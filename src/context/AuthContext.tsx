import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import security from '../utils/security';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  onboardingCompleted?: boolean;
  skills?: string[];
  workPreferences?: string[];
  experience?: string;
  portfolio?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  signout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!security.getToken()) {
          setLoading(false);
          return;
        }
        
        const userData = await API.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        security.clearToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const response = await API.signIn(email, password);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response format');
      }
      
      security.setToken(response.token);
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData: any) => {
    try {
      const response = await API.signup(userData);
      
      if (!response.data?.token || !response.data?.user) {
        throw new Error('Invalid response format');
      }
      
      security.setToken(response.data.token);
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: error.message };
    }
  };

  const signout = async () => {
    try {
      await API.logout();
      security.clearToken();
      setUser(null);
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const updatedUser = await API.updateProfile(profileData);
      setUser(prev => ({ ...prev, ...updatedUser }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signin,
    signup,
    signout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};