import React, { createContext, useContext, useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ROLES } from '@/constants/roles';
import axios from 'axios';
import type { User, SignupData, SigninData, AuthResponse, UserProfile } from '@/types/user';

const API_URL = '/.netlify/functions/api';

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signin: (data: SigninData) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<void>;
  signout: () => Promise<void>;
  updateProfile: (data: UserProfile) => Promise<void>;
  isAuthenticated: boolean;
} | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const user = await fetchUserData(token);
      setUser(user);
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signin = async (data: SigninData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/signin`,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Gagal masuk');
      }

      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Data respons tidak valid');
      }

      localStorage.setItem('token', token);
      setUser(user);

      return {
        success: true,
        token,
        user,
        message: 'Berhasil masuk'
      };
    } catch (error) {
      console.error('Signin error:', error);
      let message = 'Gagal masuk';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          message = 'Email atau password salah';
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        }
      }

      return {
        success: false,
        message
      };
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    try {
      // Log request data
      console.log('Sending signup request with data:', {
        email: data.email,
        role: data.role,
        hasPassword: !!data.password
      });

      const response = await axios.post(
        `${API_URL}/auth/signup`,
        {
          email: data.email,
          password: data.password,
          role: data.role
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Tidak ada respons dari server');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mendaftar');
      }

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Data respons tidak valid');
      }

      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Signup error:', error);
      let message = 'Gagal mendaftar';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          message = 'Email sudah terdaftar';
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error.response?.status === 400) {
          message = 'Data tidak valid. Pastikan semua field terisi dengan benar';
        }
      }

      throw new Error(message);
    }
  };

  const updateProfile = async (data: UserProfile): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Gagal memperbarui profil');
      }

      setUser(prevUser => ({
        ...prevUser!,
        ...response.data.user
      }));
    } catch (error) {
      console.error('Profile update error:', error);
      let message = 'Gagal memperbarui profil';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          message = error.response.data.message;
        }
      }

      throw new Error(message);
    }
  };

  const signout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/auth/signout`, null, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const fetchUserData = async (token: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.data || !response.data.success) {
      throw new Error('Failed to fetch user data');
    }

    return response.data.user;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signin,
      signup,
      signout,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
