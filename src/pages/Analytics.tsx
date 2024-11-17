import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { StatsCard } from "@/components/ui/stats-card";
import { HoverEffect } from "@/components/ui/card";
import {
  IconChartBar,
  IconClock,
  IconRocket,
  IconTrendingUp,
  IconUsers,
  IconBuildingSkyscraper,
  IconChartDots,
  IconDeviceAnalytics,
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

const performanceMetrics = [
  {
    title: "Project Velocity",
    description: "Average completion time reduced by 15%",
    icon: <IconTrendingUp className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "Resource Efficiency",
    description: "Resource utilization improved by 22%",
    icon: <IconRocket className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Team Performance",
    description: "Team productivity up by 18%",
    icon: <IconUsers className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Quality Metrics",
    description: "Client satisfaction rate at 96%",
    icon: <IconChartDots className="h-6 w-6 text-pink-500" />,
  },
];

const projectData = {
  labels: ['In Progress', 'Completed', 'In Review', 'On Hold'],
  datasets: [
    {
      data: [12, 8, 5, 3],
      backgroundColor: [
        'rgba(99, 102, 241, 0.85)', // Indigo
        'rgba(16, 185, 129, 0.85)', // Emerald
        'rgba(236, 72, 153, 0.85)', // Pink
        'rgba(245, 158, 11, 0.85)', // Amber
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(245, 158, 11, 1)',
      ],
      borderWidth: 2,
    },
  ],
};

const resourceUtilization = {
  labels: ['Rendering', '3D Modeling', 'Compositing', 'Animation', 'Texturing'],
  datasets: [
    {
      label: 'Resource Usage',
      data: [85, 65, 45, 75, 55],
      backgroundColor: [
        'rgba(99, 102, 241, 0.85)',
        'rgba(16, 185, 129, 0.85)',
        'rgba(236, 72, 153, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(124, 58, 237, 0.85)',
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(124, 58, 237, 1)',
      ],
      borderWidth: 2,
      borderRadius: 8,
    },
  ],
};

const projectTrends = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Completed Projects',
      data: [30, 45, 38, 52, 48, 60],
      borderColor: 'rgba(16, 185, 129, 1)', // Emerald
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
    },
    {
      label: 'Active Projects',
      data: [25, 32, 40, 35, 45, 55],
      borderColor: 'rgba(99, 102, 241, 1)', // Indigo
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
    },
  ],
};

const Analytics = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = header.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      header.style.setProperty('--mouse-x', `${x}px`);
      header.style.setProperty('--mouse-y', `${y}px`);
    };

    header.addEventListener('mousemove', handleMouseMove);

    return () => {
      header.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="relative p-[1px] overflow-hidden rounded-xl group">
          {/* Animated border gradient */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600/50 via-cyan-500/50 to-emerald-500/50">
            <div 
              className="absolute z-0 h-[500%] w-[500%] animate-[spin_3s_linear_infinite] group-hover:animate-[spin_2s_linear_infinite]"
              style={{
                background: "conic-gradient(from 0deg, transparent 0 340deg, rgba(255,255,255,0.5) 360deg)"
              }}
            />
          </div>

          {/* Content container */}
          <div 
            ref={headerRef}
            className="relative z-10 bg-black/90 backdrop-blur-sm rounded-xl transition-colors duration-200 group-hover:bg-black/80"
          >
            <div className="relative overflow-hidden rounded-xl p-6">
              {/* Spotlight effect */}
              <div 
                className="pointer-events-none absolute -inset-px transition duration-500 rounded-xl opacity-0 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(600px circle at var(--mouse-x, 100px) var(--mouse-y, 100px), rgba(255,255,255,0.08), transparent 40%)"
                }}
              />

              {/* Header content */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-500/10 ring-1 ring-white/10 transition-all duration-200 group-hover:ring-white/20">
                    <IconDeviceAnalytics className="h-8 w-8 text-blue-500 transition-colors duration-200 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400">
                      Analytics Overview
                    </h1>
                    <p className="text-neutral-400 mt-1 transition-colors duration-200 group-hover:text-neutral-300">
                      Track your project metrics and performance
                    </p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="hidden lg:flex items-center divide-x divide-white/10">
                  <div className="text-right pr-6">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm text-neutral-400 transition-colors duration-200 group-hover:text-neutral-300">Active Projects</span>
                      <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-200 transition-colors duration-200 group-hover:text-white">28</p>
                  </div>
                  <div className="text-right px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm text-neutral-400 transition-colors duration-200 group-hover:text-neutral-300">Team Members</span>
                      <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-200 transition-colors duration-200 group-hover:text-white">12</p>
                  </div>
                  <div className="text-right pl-6">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm text-neutral-400 transition-colors duration-200 group-hover:text-neutral-300">Completion Rate</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <p className="text-2xl font-semibold text-emerald-400 transition-colors duration-200 group-hover:text-emerald-300">94%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={156}
          icon={<IconBuildingSkyscraper className="h-5 w-5 text-indigo-500" />}
          trend={{ value: 23, isPositive: true }}
        />
        <StatsCard
          title="Active Hours"
          value="2,847"
          icon={<IconClock className="h-5 w-5 text-emerald-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Team Efficiency"
          value="94%"
          icon={<IconRocket className="h-5 w-5 text-blue-500" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Success Rate"
          value="98%"
          icon={<IconChartBar className="h-5 w-5 text-purple-500" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-200 mb-4">Performance Insights</h2>
        <HoverEffect 
          items={performanceMetrics}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BackgroundGradient className="rounded-2xl bg-black p-6">
          <h2 className="text-xl font-semibold text-neutral-200 mb-6">Project Status Distribution</h2>
          <div className="h-80">
            <Doughnut 
              data={projectData} 
              options={{ 
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#e5e5e5',
                      padding: 20,
                      font: {
                        size: 12,
                        weight: '500',
                      },
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                },
                animation: {
                  animateScale: true,
                  animateRotate: true,
                  duration: 2000,
                },
              }} 
            />
          </div>
        </BackgroundGradient>

        <BackgroundGradient className="rounded-2xl bg-black p-6">
          <h2 className="text-xl font-semibold text-neutral-200 mb-6">Resource Utilization</h2>
          <div className="h-80">
            <Bar 
              data={resourceUtilization} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      color: 'rgba(38, 38, 38, 0.3)',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#e5e5e5',
                      callback: (value) => `${value}%`,
                      font: {
                        size: 12,
                        weight: '500',
                      },
                    },
                    border: {
                      display: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: '#e5e5e5',
                      font: {
                        size: 12,
                        weight: '500',
                      },
                    },
                    border: {
                      display: false,
                    },
                  },
                },
                animation: {
                  duration: 2000,
                },
              }} 
            />
          </div>
        </BackgroundGradient>
      </div>

      {/* Project Trends */}
      <BackgroundGradient className="rounded-2xl bg-black p-6">
        <h2 className="text-xl font-semibold text-neutral-200 mb-6">Project Trends</h2>
        <div className="h-80">
          <Line
            data={projectTrends}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  align: 'end',
                  labels: {
                    color: '#e5e5e5',
                    padding: 20,
                    font: {
                      size: 12,
                      weight: '500',
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(38, 38, 38, 0.3)',
                    drawBorder: false,
                  },
                  ticks: {
                    color: '#e5e5e5',
                    font: {
                      size: 12,
                      weight: '500',
                    },
                  },
                  border: {
                    display: false,
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: '#e5e5e5',
                    font: {
                      size: 12,
                      weight: '500',
                    },
                  },
                  border: {
                    display: false,
                  },
                },
              },
              animation: {
                duration: 2000,
              },
              elements: {
                line: {
                  borderWidth: 3,
                },
                point: {
                  radius: 4,
                  hoverRadius: 6,
                  borderWidth: 3,
                },
              },
            }}
          />
        </div>
      </BackgroundGradient>

      {/* Detailed Metrics */}
      <BackgroundGradient className="rounded-2xl bg-black p-6">
        <h2 className="text-xl font-semibold text-neutral-200 mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Avg. Completion Time", value: "4.2 days", trend: "-15%" },
            { name: "Resource Utilization", value: "87%", trend: "+12%" },
            { name: "Team Satisfaction", value: "92%", trend: "+5%" },
            { name: "Quality Score", value: "4.8/5", trend: "+0.3" },
          ].map((metric) => (
            <div key={metric.name} className="p-4 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors duration-200">
              <p className="text-sm text-neutral-400 mb-1">{metric.name}</p>
              <p className="text-2xl font-bold text-neutral-200 mb-2">{metric.value}</p>
              <p className={`text-sm ${metric.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                {metric.trend}
              </p>
            </div>
          ))}
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default Analytics;
