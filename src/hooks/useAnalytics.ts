import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';

interface AnalyticsData {
  roleDistribution: Array<{
    _id: string;
    count: number;
  }>;
  experienceDistribution: Array<{
    _id: string;
    count: number;
  }>;
  skillsDistribution: Array<{
    _id: {
      name: string;
      level: string;
    };
    count: number;
  }>;
  workPreferences: Array<{
    _id: string;
    trueCount: number;
    falseCount: number;
  }>;
  dislikedAreas: Array<{
    _id: string;
    count: number;
  }>;
  departmentDistribution: {
    totalUsers: number;
    roleDistribution: {
      _id: string;
      count: number;
    }[];
    departments: {
      _id: string;
      count: number;
      roleBreakdown: Record<string, number>;
    }[];
  };
}

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchAnalytics = async () => {
    if (!isAuthenticated) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching analytics data...');

      const responses = await Promise.all([
        api.analytics.roleDistribution(),
        api.analytics.experienceDistribution(),
        api.analytics.skillsDistribution(),
        api.analytics.workPreferences(),
        api.analytics.dislikedAreas(),
        api.analytics.departmentDistribution(),
      ]);

      // Log individual responses
      responses.forEach((res, index) => {
        const endpoints = ['role', 'experience', 'skills', 'preferences', 'areas', 'department'];
        console.log(`${endpoints[index]} response:`, res);
      });

      // Check if any response indicates failure
      const failedResponses = responses.filter(res => !res.success);
      
      if (failedResponses.length > 0) {
        console.error('Failed responses:', failedResponses);
        throw new Error('Failed to fetch analytics data');
      }

      setData({
        roleDistribution: responses[0].data || [],
        experienceDistribution: responses[1].data || [],
        skillsDistribution: responses[2].data || [],
        workPreferences: responses[3].data || [],
        dislikedAreas: responses[4].data || [],
        departmentDistribution: responses[5].data || {
          totalUsers: 0,
          roleDistribution: [],
          departments: [],
        },
      });

      console.log('Analytics data fetched successfully:', {
        roleDistribution: responses[0].data,
        experienceDistribution: responses[1].data,
        skillsDistribution: responses[2].data,
        workPreferences: responses[3].data,
        dislikedAreas: responses[4].data,
        departmentDistribution: responses[5].data,
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      
      let errorMessage = 'Failed to fetch analytics data';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
      // Set empty arrays for all data points on error
      setData({
        roleDistribution: [],
        experienceDistribution: [],
        skillsDistribution: [],
        workPreferences: [],
        dislikedAreas: [],
        departmentDistribution: {
          totalUsers: 0,
          roleDistribution: [],
          departments: [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [isAuthenticated]);

  return { data, loading, error, refetch: fetchAnalytics };
};
