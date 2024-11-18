import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import security from './security';

const VITE_API_URL = import.meta.env.VITE_API_URL || '/api';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cached = new Map<string, { data: any; timestamp: number }>();

const axiosInstance = axios.create({
  baseURL: VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = security.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }
    
    if (error.response?.status === 401) {
      security.clearToken();
      window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

// Cache helper functions
const getCachedData = (key: string) => {
  const cachedItem = cached.get(key);
  if (!cachedItem) return null;

  const now = Date.now();
  if (now - cachedItem.timestamp > CACHE_DURATION) {
    cached.delete(key);
    return null;
  }

  return cachedItem.data;
};

const setCachedData = (key: string, data: any) => {
  cached.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const API = {
  // Authentication
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign in with:', { email });
      const response = await axiosInstance.post('/auth/signin', { email, password });
      console.log('Raw sign in response:', response);
      
      const data = response.data || response;
      console.log('Extracted sign in data:', data);

      if (!data.token || !data.user) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format: missing token or user data');
      }

      return {
        token: data.token,
        user: {
          id: data.user.id || data.user._id,
          email: data.user.email,
          role: data.user.role,
          firstName: data.user.firstName || data.user.fullName?.split(' ')[0] || '',
          lastName: data.user.lastName || data.user.fullName?.split(' ').slice(1).join(' ') || '',
          fullName: data.user.fullName || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim()
        }
      };
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof AxiosError) {
        console.error('Axios error details:', {
          config: error.config,
          response: error.response,
          request: error.request
        });
      }
      throw error;
    }
  },

  async signup(userData: {
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      console.log('Registration response:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout() {
    security.clearToken();
  },

  async getProfile() {
    try {
      const response = await axiosInstance.get('/auth/profile');
      console.log('Raw profile response:', response);

      if (!response?.data?.user) {
        throw new Error('Invalid profile response structure');
      }

      const userData = response.data.user;
      console.log('User profile data:', userData);

      // Ensure role is present and properly formatted
      if (!userData.role) {
        console.error('No role found in user data');
        throw new Error('User role not found');
      }

      // Format the user data
      const formattedData = {
        ...userData,
        role: userData.role,
        firstName: userData.firstName || userData.fullName?.split(' ')[0] || '',
        lastName: userData.lastName || userData.fullName?.split(' ').slice(1).join(' ') || '',
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      };

      console.log('Formatted profile data:', formattedData);
      return formattedData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(profileData: any) {
    try {
      const response = await axiosInstance.put('/auth/profile', profileData);
      
      if (!response?.data) {
        throw new Error('No data received from profile update');
      }
      
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Projects
  async getProjects(params?: any) {
    return await axiosInstance.get('/projects', { params });
  },

  async getProject(id: string) {
    return await axiosInstance.get(`/projects/${id}`);
  },

  async createProject(projectData: any) {
    return await axiosInstance.post('/projects', projectData);
  },

  async updateProject(id: string, projectData: any) {
    return await axiosInstance.put(`/projects/${id}`, projectData);
  },

  async deleteProject(id: string) {
    return await axiosInstance.delete(`/projects/${id}`);
  },

  // Tasks
  async getTasks(params?: any) {
    return await axiosInstance.get('/tasks', { params });
  },

  async getTask(id: string) {
    return await axiosInstance.get(`/tasks/${id}`);
  },

  async createTask(taskData: any) {
    return await axiosInstance.post('/tasks', taskData);
  },

  async updateTask(id: string, taskData: any) {
    return await axiosInstance.put(`/tasks/${id}`, taskData);
  },

  async deleteTask(id: string) {
    return await axiosInstance.delete(`/tasks/${id}`);
  },

  // Dashboard Statistics
  async getProjectStats() {
    try {
      const cachedData = getCachedData('project-stats');
      if (cachedData) return cachedData;

      const response = await axiosInstance.get('/stats/projects');
      
      if (!response?.data) {
        console.warn('No project stats data received');
        return {
          totalProjects: 0,
          completedProjects: 0,
          ongoingProjects: 0,
          delayedProjects: 0
        };
      }

      const stats = response.data;
      
      // Ensure all required fields are numbers
      const formattedStats = {
        totalProjects: Number(stats.totalProjects || 0),
        completedProjects: Number(stats.completedProjects || 0),
        ongoingProjects: Number(stats.ongoingProjects || 0),
        delayedProjects: Number(stats.delayedProjects || 0)
      };

      console.log('Project stats:', {
        raw: stats,
        formatted: formattedStats
      });

      setCachedData('project-stats', formattedStats);
      return formattedStats;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      // Return safe default values on error
      return {
        totalProjects: 0,
        completedProjects: 0,
        ongoingProjects: 0,
        delayedProjects: 0
      };
    }
  },

  async getTaskStats() {
    const cachedData = getCachedData('task-stats');
    if (cachedData) return cachedData;

    const data = await axiosInstance.get('/stats/tasks');
    setCachedData('task-stats', data);
    return data;
  },

  // Team Management
  async getTeamMembers() {
    return await axiosInstance.get('/team/members');
  },

  async updateTeamMember(id: string, memberData: any) {
    return await axiosInstance.put(`/team/members/${id}`, memberData);
  },

  // Notifications
  async getNotifications() {
    return await axiosInstance.get('/notifications');
  },

  async markNotificationAsRead(id: string) {
    return await axiosInstance.put(`/notifications/${id}/read`);
  },

  async clearNotifications() {
    return await axiosInstance.delete('/notifications');
  },

  // Analytics
  analytics: {
    roleDistribution: async () => {
      try {
        const response = await axiosInstance.get('/api/analytics/role-distribution');
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },

    getUsersByRole: async (role: string) => {
      try {
        const response = await axiosInstance.get(`/api/analytics/users-by-role/${encodeURIComponent(role)}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },

    experienceDistribution: async () => {
      return API.get('/api/analytics/experience-distribution');
    },

    skillsDistribution: async () => {
      return API.get('/api/analytics/skills-distribution');
    },

    workPreferences: async () => {
      return API.get('/api/analytics/work-preferences');
    },

    dislikedAreas: async () => {
      return API.get('/api/analytics/disliked-areas');
    },

    departmentDistribution: async () => {
      return API.get('/api/analytics/department-distribution');
    }
  },

  // Generic request methods
  async get(url: string, config = {}) {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async post(url: string, data?: any, config = {}) {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async put(url: string, data?: any, config = {}) {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async delete(url: string, config = {}) {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Cache management
  clearCache() {
    cached.clear();
  },

  invalidateCache(key: string) {
    cached.delete(key);
  },
};

// Error handling
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  const message = getErrorMessage(error);
  toast.error(message);
};

// Token refresh function
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

export { API as api };
export default API;
