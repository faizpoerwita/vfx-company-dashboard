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

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
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

    getProfile: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await this.client.get('/auth/me')
        return { success: true, data: response.user }
      } catch (error) {
        return this.handleError(error)
      }
    },

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
    roleDistribution: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await this.client.get('/analytics/role-distribution')
        return response
      } catch (error) {
        return this.handleError(error)
      }
    },

    userGrowth: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await this.client.get('/analytics/user-growth')
        return response
      } catch (error) {
        return this.handleError(error)
      }
    },

    userActivity: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await this.client.get('/analytics/user-activity')
        return response
      } catch (error) {
        return this.handleError(error)
      }
    },

    keyMetrics: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await this.client.get('/analytics/key-metrics')
        return response
      } catch (error) {
        return this.handleError(error)
      }
    }
  }

  // Admin endpoints
  admin = {
    getUsers: async () => {
      try {
        const response = await this.client.get('/admin/users')
        return response
      } catch (error) {
        return this.handleError(error)
      }
    },

    updateUser: async (userId: string, updates: any) => {
      try {
        const response = await this.client.put(`/admin/users/${userId}`, updates)
        return response
      } catch (error) {
        return this.handleError(error)
      }
    },

    deleteUser: async (userId: string) => {
      try {
        const response = await this.client.delete(`/admin/users/${userId}`)
        return response
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
