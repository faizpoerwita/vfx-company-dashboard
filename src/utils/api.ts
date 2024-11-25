import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, AuthResponse, SignInData, SignUpData } from '@/types/api'

const BASE_URL = '/.netlify/functions/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/signin'
        }
        return Promise.reject(error)
      }
    )
  }

  private handleError(error: any): ApiResponse {
    if (error.response?.data?.error) {
      return {
        success: false,
        error: error.response.data.error,
      }
    }
    return {
      success: false,
      error: error.message || 'An error occurred',
    }
  }

  // Auth endpoints
  auth = {
    signIn: async (data: SignInData): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await this.client.post('/auth/signin', data)
        if (response.token) {
          localStorage.setItem('token', response.token)
        }
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    signUp: async (data: SignUpData): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await this.client.post('/auth/signup', data)
        if (response.token) {
          localStorage.setItem('token', response.token)
        }
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    // Get current user profile
    getProfile: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await this.client.get('/auth/me')
        return { success: true, data: response.user }
      } catch (error) {
        return this.handleError(error)
      }
    },

    // Update user profile
    updateProfile: async (data: any): Promise<ApiResponse<any>> => {
      try {
        const response = await this.client.put('/auth/profile', data)
        return { success: true, data: response.user }
      } catch (error) {
        return this.handleError(error)
      }
    },
  }

  // Analytics endpoints
  analytics = {
    roleDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/role-distribution')
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    experienceDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/experience-distribution')
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    skillsDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/skills-distribution')
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    workPreferences: async () => {
      try {
        const response = await this.client.get('/analytics/work-preferences')
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    dislikedAreas: async () => {
      try {
        const response = await this.client.get('/analytics/disliked-areas')
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    departmentDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/department-distribution')
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    },

    getUsersByRole: async (role: string) => {
      try {
        const response = await this.client.get(`/analytics/users-by-role/${encodeURIComponent(role)}`)
        return { success: true, data: response }
      } catch (error) {
        return this.handleError(error)
      }
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('token')
    window.location.href = '/signin'
  }
}

const api = new ApiClient()
export { api }
