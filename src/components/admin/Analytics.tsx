import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { Card, Title, DonutChart, AreaChart as TremorAreaChart } from "@tremor/react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { StatsCard } from "@/components/ui/stats-card";
import { IconUsers, IconUserPlus, IconBriefcase, IconAward } from '@tabler/icons-react';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

interface User {
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

interface KeyMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  mostCommonRole: string;
  activeUsersPercentage: string;
}

const COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  accent1: '#ffc658',
  accent2: '#ff7300',
  accent3: '#00C49F',
  background: '#1f2937',
  text: '#fff',
  grid: '#444',
};

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [userActivityData, setUserActivityData] = useState<any[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all analytics data in parallel
        const [roleResponse, growthResponse, activityResponse, metricsResponse] = await Promise.all([
          api.analytics.roleDistribution(),
          api.analytics.userGrowth(),
          api.analytics.userActivity(),
          api.analytics.keyMetrics()
        ]);

        if (roleResponse.success && roleResponse.data) {
          setRoleData(roleResponse.data);
        }

        if (growthResponse.success && growthResponse.data) {
          setUserGrowthData(growthResponse.data);
        }

        if (activityResponse.success && activityResponse.data) {
          setUserActivityData(activityResponse.data);
        }

        if (metricsResponse.success && metricsResponse.data) {
          setKeyMetrics(metricsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to fetch analytics data');
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={keyMetrics?.totalUsers || 0}
          icon={<IconUsers className="h-5 w-5 text-neutral-500" />}
          trend={{ value: keyMetrics?.activeUsers || 0, label: 'Active Users' }}
        />
        <StatsCard
          title="New Users"
          value={keyMetrics?.newUsersThisMonth || 0}
          icon={<IconUserPlus className="h-5 w-5 text-neutral-500" />}
          description="This Month"
        />
        <StatsCard
          title="Most Common Role"
          value={keyMetrics?.mostCommonRole || 'N/A'}
          icon={<IconBriefcase className="h-5 w-5 text-neutral-500" />}
          trend={{ value: Number(roleData[0]?.percentage || 0), label: '% of Users' }}
        />
        <StatsCard
          title="User Activity"
          value={keyMetrics?.activeUsersPercentage || '0'}
          icon={<IconAward className="h-5 w-5 text-neutral-500" />}
          trend={{ 
            value: keyMetrics?.activeUsers || 0, 
            label: 'Active Users', 
            isPositive: true 
          }}
        />
      </div>

      <BentoGrid className="mx-auto">
        {/* Role Distribution Chart */}
        <BentoGridItem
          title="Role Distribution"
          className="col-span-2"
          header={
            <Card className="bg-black/50 p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="role" stroke={COLORS.text} />
                  <YAxis stroke={COLORS.text} />
                  <Tooltip
                    contentStyle={{ backgroundColor: COLORS.background, border: 'none' }}
                    labelStyle={{ color: COLORS.text }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill={COLORS.primary} 
                    name="Users"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          }
        />

        {/* User Growth Chart */}
        <BentoGridItem
          title="User Growth"
          className="col-span-2"
          header={
            <Card className="bg-black/50 p-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="month" stroke={COLORS.text} />
                  <YAxis stroke={COLORS.text} />
                  <Tooltip
                    contentStyle={{ backgroundColor: COLORS.background, border: 'none' }}
                    labelStyle={{ color: COLORS.text }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                    name="Total Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={COLORS.secondary}
                    fill={COLORS.secondary}
                    fillOpacity={0.3}
                    name="New Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          }
        />

        {/* User Activity Over Time */}
        <BentoGridItem
          title="User Activity Over Time"
          className="col-span-3"
          header={
            <Card className="bg-black/50 p-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="month" stroke={COLORS.text} />
                  <YAxis stroke={COLORS.text} />
                  <Tooltip
                    contentStyle={{ backgroundColor: COLORS.background, border: 'none' }}
                    labelStyle={{ color: COLORS.text }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stackId="1"
                    stroke={COLORS.accent3}
                    fill={COLORS.accent3}
                    fillOpacity={0.6}
                    name="Active Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="inactive"
                    stackId="1"
                    stroke={COLORS.accent2}
                    fill={COLORS.accent2}
                    fillOpacity={0.6}
                    name="Inactive Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          }
        />
      </BentoGrid>
    </div>
  );
};

export default Analytics;
