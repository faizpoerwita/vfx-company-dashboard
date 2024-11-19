import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { StatsCard } from "@/components/ui/stats-card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Spinner } from "@/components/ui/spinner";
import { Navigation } from "@/components/layout/Navigation";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import toast from "react-hot-toast";
import {
  IconChartBar,
  IconClock,
  IconRocket,
  IconTrendingUp,
  IconUsers,
  IconBuildingSkyscraper,
  IconChartDots,
  IconDeviceAnalytics,
  IconAlertTriangle,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { useRef, useEffect, useState } from 'react';
import { cn } from "@/utils/cn";
import { RoleUsersModal } from "@/components/modals/RoleUsersModal";
import { api } from "@/utils/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler
);

const EmptyState = ({ message = "Data tidak tersedia" }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-neutral-900/50 rounded-lg">
    <IconAlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
    <p className="text-neutral-400 text-center">{message}</p>
  </div>
);

const Analytics = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { data, loading, error } = useAnalytics();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [roleUsers, setRoleUsers] = useState<any[] | null>(null);
  const [roleUsersLoading, setRoleUsersLoading] = useState(false);
  const [isRoleUsersModalOpen, setIsRoleUsersModalOpen] = useState(false);

  // Fetch users for a specific role
  const handleViewRoleUsers = async (role: string) => {
    try {
      setSelectedRole(role);
      setIsRoleUsersModalOpen(true);
      setRoleUsersLoading(true);
      
      const response = await api.analytics.getUsersByRole(role);
      if (response?.success && response.data) {
        setRoleUsers(response.data);
      } else {
        console.error('Invalid response format for users by role');
        toast.error('Failed to load team members');
      }
    } catch (error) {
      console.error('Error fetching users by role:', error);
      toast.error('Failed to load team members');
    } finally {
      setRoleUsersLoading(false);
    }
  };

  // Render role users modal
  const renderRoleUsersModal = () => {
    return (
      <RoleUsersModal
        isOpen={isRoleUsersModalOpen}
        onClose={() => setIsRoleUsersModalOpen(false)}
        role={selectedRole}
        users={roleUsers}
        loading={roleUsersLoading}
      />
    );
  };

  useEffect(() => {
    if (error) {
      console.error('Analytics Error:', error);
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EmptyState message={error} />
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156 163 175)',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: 'rgb(156 163 175)' },
        grid: { color: 'rgba(75, 85, 99, 0.2)' },
      },
      x: {
        ticks: { color: 'rgb(156 163 175)' },
        grid: { color: 'rgba(75, 85, 99, 0.2)' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <TextGenerateEffect words="Analytics Dashboard" className="text-4xl font-bold text-white mb-4" />
            <p className="text-gray-400">Comprehensive insights into team performance and project metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatsCard
              title="Total Workers"
              value={data?.departmentDistribution?.totalUsers || 0}
              description="Active team members"
              icon={<IconUsers className="w-6 h-6" />}
            />
            <StatsCard
              title="Total Roles"
              value={data?.roleDistribution?.length || 0}
              description="Different roles in the company"
              icon={<IconBuildingSkyscraper className="w-6 h-6" />}
            />
            <StatsCard
              title="Skills Tracked"
              value={data?.skillsDistribution?.length || 0}
              description="Unique skills monitored"
              icon={<IconChartDots className="w-6 h-6" />}
            />
            <StatsCard
              title="Experience Levels"
              value={data?.experienceDistribution?.length || 0}
              description="Different experience categories"
              icon={<IconTrendingUp className="w-6 h-6" />}
            />
          </div>

          {/* Department Overview Section */}
          <div className="mb-12">
            <MovingBorder duration={3000} className="self-start p-[1px] mb-6">
              <BackgroundGradient className="rounded-lg p-4 bg-black">
                <h2 className="text-2xl font-bold text-neutral-200">
                  Department Overview
                </h2>
              </BackgroundGradient>
            </MovingBorder>

            {/* Total Workers Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <BackgroundGradient className="rounded-[22px] p-1 bg-black">
                <div className="bg-neutral-950 rounded-[20px] p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      <IconUsers className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-neutral-200">Total Workers</h3>
                      <p className="text-3xl font-bold text-neutral-100 mt-2">
                        {data?.departmentDistribution?.totalUsers || 0}
                      </p>
                      <p className="text-sm text-neutral-400 mt-1">
                        Across {data?.departmentDistribution?.departments?.length || 0} departments
                      </p>
                    </div>
                  </div>
                </div>
              </BackgroundGradient>
            </div>

            {/* Role Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.departmentDistribution?.roleDistribution?.map((role) => (
                role?._id ? (
                  <BackgroundGradient key={role._id} className="rounded-[22px] p-1 bg-black">
                    <div className="bg-neutral-950 rounded-[20px] p-6 h-full">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {role._id.toString().charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-neutral-200">{role._id}</h3>
                          <p className="text-sm text-neutral-400 mt-1">{role.count} workers</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-400">Percentage</span>
                          <span className="text-sm text-neutral-200">
                            {Math.round((role.count / (data?.departmentDistribution?.totalUsers || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                            style={{
                              width: `${Math.round((role.count / (data?.departmentDistribution?.totalUsers || 1)) * 100)}%`
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-4">
                        <button
                          onClick={() => handleViewRoleUsers(role._id)}
                          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          <IconUsers className="w-4 h-4" />
                          <span className="text-sm">
                            {role.count} {role.count === 1 ? 'member' : 'members'}
                          </span>
                        </button>
                        <button 
                          className="text-neutral-400 hover:text-neutral-200 transition-colors"
                          onClick={() => handleViewRoleUsers(role._id)}
                        >
                          <IconChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </BackgroundGradient>
                ) : null
              ))}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Role Distribution Chart */}
            <BackgroundGradient className="p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Role Distribution</h3>
              <div className="h-[300px]">
                {data?.roleDistribution && data.roleDistribution.length > 0 ? (
                  <Doughnut
                    data={{
                      labels: data.roleDistribution.map(item => item._id),
                      datasets: [{
                        data: data.roleDistribution.map(item => item.count),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(54, 162, 235, 0.8)',
                          'rgba(255, 206, 86, 0.8)',
                          'rgba(75, 192, 192, 0.8)',
                          'rgba(153, 102, 255, 0.8)',
                          'rgba(255, 159, 64, 0.8)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                      }],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          display: true,
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </BackgroundGradient>

            {/* Experience Distribution Chart */}
            <BackgroundGradient className="p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Experience Distribution</h3>
              <div className="h-[300px]">
                {data?.experienceDistribution && data.experienceDistribution.length > 0 ? (
                  <Bar
                    data={{
                      labels: data.experienceDistribution.map(item => item._id),
                      datasets: [{
                        label: 'Team Members',
                        data: data.experienceDistribution.map(item => item.count),
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                      }],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          display: false,
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </BackgroundGradient>

            {/* Skills Distribution Chart */}
            <BackgroundGradient className="p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Skills Distribution</h3>
              <div className="h-[300px]">
                {data?.skillsDistribution && data.skillsDistribution.length > 0 ? (
                  <Line
                    data={{
                      labels: data.skillsDistribution.map(item => item._id.name),
                      datasets: [{
                        label: 'Team Members',
                        data: data.skillsDistribution.map(item => item.count),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4,
                        fill: true,
                      }],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          display: false,
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </BackgroundGradient>

            {/* Work Preferences Chart */}
            <BackgroundGradient className="p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Work Preferences</h3>
              <div className="h-[300px]">
                {data?.workPreferences && data.workPreferences.length > 0 ? (
                  <Bar
                    data={{
                      labels: data.workPreferences.map(item => item._id),
                      datasets: [
                        {
                          label: 'Preferred',
                          data: data.workPreferences.map(item => item.trueCount),
                          backgroundColor: 'rgba(75, 192, 192, 0.8)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                        },
                        {
                          label: 'Not Preferred',
                          data: data.workPreferences.map(item => item.falseCount),
                          backgroundColor: 'rgba(255, 99, 132, 0.8)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </BackgroundGradient>
          </div>
        </div>
      </div>
      {renderRoleUsersModal()}
    </div>
  );
};

export default Analytics;
