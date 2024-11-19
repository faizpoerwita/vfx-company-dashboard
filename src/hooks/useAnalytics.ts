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

      const responses = await Promise.all([
        api.analytics.roleDistribution(),
        api.analytics.experienceDistribution(),
        api.analytics.skillsDistribution(),
        api.analytics.workPreferences(),
        api.analytics.dislikedAreas(),
        api.analytics.departmentDistribution()
      ]);

      // Check if any response indicates failure
      const failedResponses = responses.filter(res => !res.success);
      if (failedResponses.length > 0) {
        throw new Error('Failed to fetch analytics data');
      }

      const [
        roleRes,
        experienceRes,
        skillsRes,
        preferencesRes,
        dislikesRes,
        departmentRes
      ] = responses;

      const analyticsData: AnalyticsData = {
        roleDistribution: roleRes.data || [],
        experienceDistribution: experienceRes.data || [],
        skillsDistribution: skillsRes.data || [],
        workPreferences: preferencesRes.data || [],
        dislikedAreas: dislikesRes.data || [],
        departmentDistribution: departmentRes.data || {
          totalUsers: 0,
          roleDistribution: [],
          departments: []
        }
      };

      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      let errorMessage = 'Failed to fetch analytics data';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err instanceof AxiosError && err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  return { data, loading, error, refetch: fetchAnalytics };
};
