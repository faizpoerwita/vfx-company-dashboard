import React, { createContext, useContext, useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ROLES, RoleType } from '@/constants/roles';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: RoleType;
  firstName?: string;
  lastName?: string;
  onboardingCompleted: boolean;
}

interface SignupData {
  email: string;
  password: string;
  role: RoleType;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<void>;
  signout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate token and get user data
          const userData = await fetchUserData(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signin = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post('http://localhost:5000/auth/signin', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: 'Gagal signin' };
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    try {
      // Validate role
      if (!Object.values(ROLES).includes(data.role)) {
        throw new Error('Invalid role');
      }

      const response = await axios.post('http://localhost:5000/auth/signup', data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signout = async (): Promise<void> => {
    try {
      await axios.post('http://localhost:5000/auth/signout', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if server call fails
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      // Update the user's profile
      const response = await axios.put('http://localhost:5000/auth/profile', {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        onboardingCompleted: true,
        skills: data.skills,
        experience: data.experience,
        portfolio: data.portfolio,
        bio: data.bio,
        preferences: data.preferences,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.data;
      setUser(updatedUser);
      toast.success('Profile updated successfully!');

    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const fetchUserData = async (token: string): Promise<User> => {
  const response = await axios.get('http://localhost:5000/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const userData = await response.data;
  return userData;
};

export default AuthContext;
