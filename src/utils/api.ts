import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import security from './security';

const BASE_URL = 'http://localhost:5000';  // Removed /api suffix for auth endpoints

// Debug API calls
const debugAPI = (method: string, url: string, data?: any) => {
  console.log(`[API ${method}] ${url}`, data ? { data } : '');
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = security.getToken();
    
    // Log request details for debugging
    console.log('[API Request]', {
      url: config.url,
      method: config.method,
      hasToken: !!token
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove custom CORS headers from requests
    delete config.headers['Access-Control-Allow-Origin'];
    delete config.headers['Access-Control-Allow-Credentials'];

    debugAPI(config.method?.toUpperCase() || 'REQUEST', config.url || '', config.data);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('Response error:', error.response.data);
      if (error.response.status === 401) {
        // Handle unauthorized error
        security.clearToken();
        window.location.href = '/signin';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Cache configuration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const API = {
  // Authentication
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign in with:', { email });
      const response = await api.post('/auth/signin', { email, password });
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
      const response = await api.post('/auth/signup', userData);
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
      const response = await api.get('/auth/profile');
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
      debugAPI('PUT', '/auth/profile', profileData);
      const response = await api.put('/auth/profile', profileData);
      
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
    return await api.get('/projects', { params });
  },

  async getProject(id: string) {
    return await api.get(`/projects/${id}`);
  },

  async createProject(projectData: any) {
    return await api.post('/projects', projectData);
  },

  async updateProject(id: string, projectData: any) {
    return await api.put(`/projects/${id}`, projectData);
  },

  async deleteProject(id: string) {
    return await api.delete(`/projects/${id}`);
  },

  // Tasks
  async getTasks(params?: any) {
    return await api.get('/tasks', { params });
  },

  async getTask(id: string) {
    return await api.get(`/tasks/${id}`);
  },

  async createTask(taskData: any) {
    return await api.post('/tasks', taskData);
  },

  async updateTask(id: string, taskData: any) {
    return await api.put(`/tasks/${id}`, taskData);
  },

  async deleteTask(id: string) {
    return await api.delete(`/tasks/${id}`);
  },

  // Dashboard Statistics
  async getProjectStats() {
    try {
      const response = await api.get('/stats/projects');
      
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
    const cacheKey = 'task-stats';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const data = await api.get('/stats/tasks');
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  },

  // Team Management
  async getTeamMembers() {
    return await api.get('/team/members');
  },

  async updateTeamMember(id: string, memberData: any) {
    return await api.put(`/team/members/${id}`, memberData);
  },

  // Notifications
  async getNotifications() {
    return await api.get('/notifications');
  },

  async markNotificationAsRead(id: string) {
    return await api.put(`/notifications/${id}/read`);
  },

  async clearNotifications() {
    return await api.delete('/notifications');
  },

  // Analytics
  getAnalytics: {
    roleDistribution: async () => {
      try {
        const response = await api.get('/api/analytics/role-distribution');
        return response.data;
      } catch (error) {
        console.error('Error fetching role distribution:', error);
        throw error;
      }
    },
    experienceDistribution: async () => {
      try {
        const response = await api.get('/api/analytics/experience-distribution');
        return response.data;
      } catch (error) {
        console.error('Error fetching experience distribution:', error);
        throw error;
      }
    },
    skillsDistribution: async () => {
      try {
        const response = await api.get('/api/analytics/skills-distribution');
        return response.data;
      } catch (error) {
        console.error('Error fetching skills distribution:', error);
        throw error;
      }
    },
    workPreferences: async () => {
      try {
        const response = await api.get('/api/analytics/work-preferences');
        return response.data;
      } catch (error) {
        console.error('Error fetching work preferences:', error);
        throw error;
      }
    },
    dislikedAreas: async () => {
      try {
        const response = await api.get('/api/analytics/disliked-areas');
        return response.data;
      } catch (error) {
        console.error('Error fetching disliked areas:', error);
        throw error;
      }
    },
    test: async () => {
      try {
        const response = await api.get('/api/analytics/test');
        return response.data;
      } catch (error) {
        console.error('Error testing analytics route:', error);
        throw error;
      }
    }
  },

  // Generic request method with caching
  async get<T>(url: string, config?: any) {
    const cacheKey = url + JSON.stringify(config?.params || {});
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }

    const data = await api.get<T>(url, config);
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  },

  async post<T>(url: string, data?: any, config?: any) {
    return await api.post<T>(url, data, config);
  },

  async put<T>(url: string, data?: any, config?: any) {
    return await api.put<T>(url, data, config);
  },

  async delete(url: string, config?: any) {
    return await api.delete(url, config);
  },

  // Cache management
  clearCache() {
    cache.clear();
  },

  invalidateCache(key: string) {
    cache.delete(key);
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
    const response = await api.post('/auth/refresh');
    return response.data.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

export default API;
