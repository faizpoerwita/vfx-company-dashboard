import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { StatsCard } from "@/components/ui/stats-card";
import { HoverEffect } from "@/components/ui/card";
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
import { useRef, useEffect } from 'react';

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
              title="Total Roles"
              value={data?.roleDistribution?.length || 0}
              description="Different roles in the company"
              icon={<IconUsers className="w-6 h-6" />}
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
              icon={<IconClock className="w-6 h-6" />}
            />
            <StatsCard
              title="Work Areas"
              value={data?.workPreferences?.length || 0}
              description="Distinct work preferences"
              icon={<IconChartBar className="w-6 h-6" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Role Distribution Chart */}
            <BackgroundGradient className="p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Role Distribution</h3>
              <div className="h-[300px]">
                {data?.roleDistribution?.length ? (
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
                        ],
                      }],
                    }}
                    options={chartOptions}
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
                {data?.experienceDistribution?.length ? (
                  <Bar
                    data={{
                      labels: data.experienceDistribution.map(item => item._id),
                      datasets: [{
                        label: 'Team Members',
                        data: data.experienceDistribution.map(item => item.count),
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                      }],
                    }}
                    options={chartOptions}
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
                {data?.skillsDistribution?.length ? (
                  <Line
                    data={{
                      labels: data.skillsDistribution.map(item => item._id.name),
                      datasets: [{
                        label: 'Skill Level',
                        data: data.skillsDistribution.map(item => item.count),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      }],
                    }}
                    options={chartOptions}
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
                {data?.workPreferences?.length ? (
                  <Bar
                    data={{
                      labels: data.workPreferences.map(item => item._id),
                      datasets: [
                        {
                          label: 'Preferred',
                          data: data.workPreferences.map(item => item.trueCount),
                          backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        },
                        {
                          label: 'Not Preferred',
                          data: data.workPreferences.map(item => item.falseCount),
                          backgroundColor: 'rgba(255, 99, 132, 0.8)',
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
    </div>
  );
};

export default Analytics;
