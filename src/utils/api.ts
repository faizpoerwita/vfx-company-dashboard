import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, AuthResponse, SignInData, SignUpData } from '@/types/api'

const BASE_URL = '/.netlify/functions'

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
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private handleError(error: any): ApiResponse {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'An error occurred',
        code: error.response?.data?.code,
      },
    }
  }

  // Auth endpoints
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const response = await this.client.post('/auth/signin', data)
      return { success: true, data: response.data }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await this.client.post('/auth/signup', data)
      return { success: true, data: response.data }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // Project endpoints
  async getProjectStats() {
    try {
      const response = await this.client.get('/stats/projects')
      return response.data
    } catch (error) {
      console.error('Error fetching project stats:', error)
      return {
        totalProjects: 0,
        completedProjects: 0,
        ongoingProjects: 0,
        delayedProjects: 0
      }
    }
  }

  // Analytics endpoints
  analytics = {
    roleDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/roles')
        return { success: true, data: response.data }
      } catch (error) {
        return this.handleError(error)
      }
    },

    experienceDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/experience')
        return { success: true, data: response.data }
      } catch (error) {
        return this.handleError(error)
      }
    },

    skillsDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/skills')
        return { success: true, data: response.data }
      } catch (error) {
        return this.handleError(error)
      }
    },

    workPreferences: async () => {
      try {
        const response = await this.client.get('/analytics/preferences')
        return { success: true, data: response.data }
      } catch (error) {
        return this.handleError(error)
      }
    },

    dislikedAreas: async () => {
      try {
        const response = await this.client.get('/analytics/dislikes')
        return { success: true, data: response.data }
      } catch (error) {
        return this.handleError(error)
      }
    },

    departmentDistribution: async () => {
      try {
        const response = await this.client.get('/analytics/departments')
        return { success: true, data: response.data }
      } catch (error) {
        return this.handleError(error)
      }
    },
  }

  async signOut(): Promise<ApiResponse<void>> {
    localStorage.removeItem('token')
    return { success: true }
  }
}

const api = new ApiClient()
export { api }
