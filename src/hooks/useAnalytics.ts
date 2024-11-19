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

  const fetchData = async () => {
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

      // Validate responses
      const invalidResponses = responses.filter(res => !res?.success);
      if (invalidResponses.length > 0) {
        console.error('Invalid responses:', invalidResponses);
        throw new Error('Failed to fetch some analytics data');
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
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      
      // Set default empty data structure
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
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  return { data, loading, error, refetch: fetchData };
};
