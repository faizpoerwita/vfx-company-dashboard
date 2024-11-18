import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Navigation } from '../components/layout/Navigation';
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
import { BackgroundBeams } from "../components/ui/background-beams";
import { SparklesCore } from "../components/ui/sparkles";
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/signin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await api.getProjectStats();
        setStats(response);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load project statistics');
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchStats();
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-[200px] h-[200px]"
            particleColor="#FFFFFF"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  console.log('Dashboard user data:', {
    user,
    firstName: user?.firstName,
    email: user?.email,
    rawUser: JSON.stringify(user, null, 2)
  });

  // Use firstName from user data, with email prefix as fallback
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'User';
  console.log('Display name:', displayName);

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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-black/40 backdrop-blur-xl border-b border-neutral-800">
          <Navigation />
        </div>
      </div>

      {/* Background Effects */}
      <BackgroundBeams className="fixed inset-0" />
      <div className="fixed inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen pt-20">
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
                        <span className="text-sm font-medium text-neutral-300">{stat.title}</span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-semibold text-white">
                            {stat.value}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-900">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-neutral-400">{stat.description}</p>
                      <p className="text-xs text-neutral-500">{stat.trend}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Workflow Insights */}
            <div className="mt-12">
              <StickyScroll content={[
                {
                  title: "Production Timeline",
                  description: "Track project milestones, shot progress, and delivery schedules across all active productions.",
                  content: (
                    <div className="h-96 bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-neutral-800">
                      {/* Timeline visualization component would go here */}
                      <div className="h-full flex items-center justify-center text-neutral-500">
                        Timeline Visualization
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Team Performance",
                  description: "Monitor artist workload, shot completion rates, and review cycles.",
                  content: (
                    <div className="h-96 bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-neutral-800">
                      {/* Team performance charts would go here */}
                      <div className="h-full flex items-center justify-center text-neutral-500">
                        Performance Analytics
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Quality Control",
                  description: "Track review feedback, iteration cycles, and final delivery approvals.",
                  content: (
                    <div className="h-96 bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-neutral-800">
                      {/* Quality metrics would go here */}
                      <div className="h-full flex items-center justify-center text-neutral-500">
                        Quality Metrics
                      </div>
                    </div>
                  ),
                },
              ]} />
            </div>

            {/* Active Projects */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Active Projects</h2>
                <button className="px-4 py-2 text-sm bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">
                  Add Project
                </button>
              </div>
              <ProjectsSection />
            </div>
          </div>
        </TracingBeam>
      </div>
    </div>
  );
};

export default Dashboard;
