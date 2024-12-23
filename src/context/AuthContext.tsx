import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import security from '../utils/security';
import { toast } from 'react-hot-toast';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'ARTIST' | 'CLIENT' | 'GUEST';
  onboardingCompleted?: boolean;
  skills?: string[];
  workPreferences?: string[];
  experience?: string;
  portfolio?: string;
  bio?: string;
};

export type SigninData = {
  email: string;
  password: string;
};

export type SignupData = {
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'ARTIST' | 'CLIENT' | 'GUEST';
  firstName: string;
  lastName: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  skills: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }>;
  workPreferences: Array<{ name: string; value: string }>;
  bio: string;
  portfolio?: string;
  dislikedWorkAreas: string[];
  onboardingCompleted: boolean;
};

export type AuthResponse = {
  user: User;
  token: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signin: (data: SigninData) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<void>;
  signout: () => Promise<void>;
  updateProfile: (data: UserProfile) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!security.getToken()) {
          setLoading(false);
          return;
        }
        
        const userData = await api.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        security.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signin = async (data: SigninData): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await api.signIn(data.email, data.password);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response format');
      }
      
      security.setToken(response.token);
      setUser(response.user);
      
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to sign in';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.signup(data);
      
      if (!response.data?.token || !response.data?.user) {
        throw new Error('Invalid response format');
      }
      
      security.setToken(response.data.token);
      setUser(response.data.user);
      
      toast.success('Successfully signed up! Please sign in.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to sign up';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signout = async (): Promise<void> => {
    try {
      await api.logout();
      security.clearToken();
      setUser(null);
      navigate('/signin');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Failed to sign out:', error);
      toast.error('Failed to sign out');
    }
  };

  const updateProfile = async (data: UserProfile): Promise<void> => {
    try {
      const updatedUser = await api.updateProfile(data);
      setUser(prev => ({ ...prev, ...updatedUser }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};