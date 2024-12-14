import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Card, CardContent } from "../components/ui/Card";
import { 
  IconBrain,
  IconRocket,
  IconMovie,
  IconCube,
  IconPalette,
  IconClock,
  IconUsers,
  IconChartBar,
  IconTrendingUp,
  IconClipboardList
} from '@tabler/icons-react';
import { motion } from "framer-motion";
import { ProjectsSection } from '../components/dashboard/ProjectsSection';
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";
import { TracingBeam } from "../components/ui/tracing-beam";
import { api } from '../utils/api';

interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  delayedProjects: number;
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    delayedProjects: 0
  });

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/signin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await api.getProjectStats();
        setStats(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load project statistics');
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchStats();
    }
  }, [isAuthenticated, isLoading]);

  if (!isAuthenticated) {
    return null;
  }

  const displayName = user?.firstName || user?.email?.split('@')[0] || 'User';

  const quickStats = [
    {
      title: "Active Productions",
      value: String(stats?.ongoingProjects || 0),
      description: "Current VFX projects",
      icon: <IconMovie className="w-6 h-6" />,
      trend: `${((stats?.ongoingProjects || 0) / (stats?.totalProjects || 1) * 100).toFixed(1)}% of total projects`,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Team Utilization",
      value: "86%",
      description: "Team capacity",
      icon: <IconUsers className="w-6 h-6" />,
      trend: "Optimal capacity",
      color: "from-slate-600 to-slate-800",
    },
    {
      title: "Project Completion",
      value: `${((stats?.completedProjects || 0) / (stats?.totalProjects || 1) * 100).toFixed(0)}%`,
      description: "Average completion rate",
      icon: <IconChartBar className="w-6 h-6" />,
      trend: "+8% this month",
      color: "from-zinc-700 to-zinc-900",
    },
    {
      title: "Delivery Pipeline",
      value: String((stats?.totalProjects || 0) - (stats?.completedProjects || 0)),
      description: "Projects in queue",
      icon: <IconClipboardList className="w-6 h-6" />,
      trend: "On track for delivery",
      color: "from-neutral-700 to-neutral-900",
    },
  ];

  return (
    <TracingBeam className="px-6">
      <div className="max-w-7xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-left space-y-4 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {displayName}!
            </h1>
            <p className="text-zinc-400">
              Here's what's happening with your projects today.
            </p>
          </div>
          <h1 className="text-4xl font-semibold text-white">
            Production Overview
          </h1>
          <p className="text-base text-neutral-400">
            Track project progress, team performance, and delivery timelines
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-black/40 border-neutral-800 backdrop-blur-sm hover:bg-black/50 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-400">{stat.title}</p>
                    <h2 className="text-2xl font-bold">{stat.value}</h2>
                  </div>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-neutral-400">{stat.description}</p>
                  <p className="text-sm text-neutral-300 mt-1">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Section */}
        <ProjectsSection />
      </div>
    </TracingBeam>
  );
};

export default Dashboard;
