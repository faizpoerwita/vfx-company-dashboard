import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import API from '@/utils/api';

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
        API.getAnalytics.roleDistribution(),
        API.getAnalytics.experienceDistribution(),
        API.getAnalytics.skillsDistribution(),
        API.getAnalytics.workPreferences(),
        API.getAnalytics.dislikedAreas(),
      ]);

      // Log individual responses
      responses.forEach((res, index) => {
        const endpoints = ['role', 'experience', 'skills', 'preferences', 'areas'];
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
      });

      console.log('Analytics data fetched successfully:', {
        roleDistribution: responses[0].data,
        experienceDistribution: responses[1].data,
        skillsDistribution: responses[2].data,
        workPreferences: responses[3].data,
        dislikedAreas: responses[4].data,
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
