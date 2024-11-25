import React from 'react';
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
} from 'recharts';
import { Card, Title, DonutChart } from "@tremor/react";

interface AnalyticsProps {
  users: Array<{
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics: React.FC<AnalyticsProps> = ({ users }) => {
  // Calculate role distribution
  const roleDistribution = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleData = Object.entries(roleDistribution).map(([role, count]) => ({
    role,
    count,
  }));

  // Calculate status distribution
  const statusDistribution = users.reduce((acc, user) => {
    acc[user.status] = (acc[user.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusDistribution).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
  }));

  // Calculate user growth over time
  const userGrowth = users
    .map(user => new Date(user.createdAt))
    .sort((a, b) => a.getTime() - b.getTime())
    .reduce((acc, date) => {
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const growthData = Object.entries(userGrowth).map(([month, count]) => ({
    month,
    count,
    total: count,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Distribution Chart */}
        <Card className="bg-gray-900 p-4">
          <Title className="text-white mb-4">Role Distribution</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="role" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution Chart */}
        <Card className="bg-gray-900 p-4">
          <Title className="text-white mb-4">User Status</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card className="bg-gray-900 p-4">
        <Title className="text-white mb-4">User Growth Over Time</Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              name="Total Users"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Analytics;
