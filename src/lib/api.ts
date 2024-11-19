import axios from 'axios';

// Create an axios instance with default config
export const API = axios.create({
  baseURL: '/.netlify/functions', // Updated to use Netlify Functions
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Project Stats
export const getProjectStats = async () => {
  try {
    const response = await API.get('/stats/projects');
    return response;
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return {
      totalProjects: 0,
      completedProjects: 0,
      ongoingProjects: 0,
      delayedProjects: 0
    };
  }
};

// Analytics
export const getAnalytics = async () => {
  try {
    const response = await API.get('/analytics');
    return response;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      roleDistribution: {},
      projectTimeline: [],
      taskCompletion: {}
    };
  }
};

// Profile
export const getProfile = async (userId: string) => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (userId: string, data: any) => {
  try {
    const response = await API.put(`/users/${userId}`, data);
    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
