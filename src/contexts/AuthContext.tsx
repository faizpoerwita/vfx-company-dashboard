import React, { createContext, useContext, useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ROLES } from '@/constants/roles';
import { api } from '@/utils/api';
import type { User, SignupData, SigninData, AuthResponse, UserProfile } from '@/types/user';

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
      const response = await api.post('/auth/signin', data);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to sign in');
      }

      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response data');
      }

      localStorage.setItem('token', token);
      setUser(user);

      return {
        success: true,
        token,
        user,
        message: 'Successfully signed in'
      };
    } catch (error) {
      console.error('Signin error:', error);
      let message = 'Failed to sign in';

      if (error instanceof Error) {
        message = error.message;
      }

      return {
        success: false,
        message
      };
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    try {
      const response = await api.post('/auth/signup', data);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to sign up');
      }

      toast.success('Account created successfully! Please sign in.');
    } catch (error) {
      console.error('Signup error:', error);
      let message = 'Failed to sign up';

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      throw error;
    }
  };

  const signout = async (): Promise<void> => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/signin';
  };

  const updateProfile = async (data: UserProfile): Promise<void> => {
    try {
      const response = await api.put('/auth/profile', data);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update profile');
      }

      setUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      let message = 'Failed to update profile';

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      throw error;
    }
  };

  const fetchUserData = async (token: string): Promise<User> => {
    const response = await api.get('/auth/me');
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch user data');
    }

    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signin,
        signup,
        signout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
