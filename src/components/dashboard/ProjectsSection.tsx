import React from 'react';
import { useState, useMemo } from 'react';
import { Card } from "../ui/Card";
import { 
  IconUsers,
  IconCalendarStats,
  IconChartPie,
  IconBrain,
  IconProgress,
  IconAlertCircle,
  IconInfoCircle,
  IconSearch
} from '@tabler/icons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ProjectStatus } from './ProjectStatus';
import { EfficiencyIndicator } from './EfficiencyIndicator';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Pre-Production' | 'In Production' | 'Post-Production';
  completion: number;
  efficiency: {
    timeline: number;
    resources: number;
    milestones: number;
    overall: number;
  };
  teamSize: number;
  deadline: string;
  budget: {
    allocated: number;
    spent: number;
  };
  client: string;
}

// Sample projects data
const projects: Project[] = [
  {
    title: "Luxury Car Commercial",
    description: "High-end automotive visualization campaign",
    priority: "High",
    status: "In Production",
    completion: 65,
    efficiency: {
      timeline: 95,
      resources: 88,
      milestones: 92,
      overall: 92
    },
    teamSize: 8,
    deadline: "2024-03-15",
    budget: {
      allocated: 75000,
      spent: 45000
    },
    client: "AutoLux Motors"
  },
  {
    title: "Product Showcase Series",
    description: "Tech product visualization collection",
    priority: "Medium",
    status: "Post-Production",
    completion: 85,
    efficiency: {
      timeline: 85,
      resources: 90,
      milestones: 88,
      overall: 88
    },
    teamSize: 6,
    deadline: "2024-02-28",
    budget: {
      allocated: 50000,
      spent: 42500
    },
    client: "TechVision Inc"
  },
  {
    title: "Architectural Experience",
    description: "Interactive architectural visualization",
    priority: "High",
    status: "Pre-Production",
    completion: 25,
    efficiency: {
      timeline: 92,
      resources: 85,
      milestones: 88,
      overall: 88
    },
    teamSize: 12,
    deadline: "2024-03-30",
    budget: {
      allocated: 120000,
      spent: 30000
    },
    client: "Modern Spaces"
  },
  {
    title: "Brand Commercial VFX",
    description: "VFX integration for national campaign",
    priority: "Critical",
    status: "In Production",
    completion: 45,
    efficiency: {
      timeline: 78,
      resources: 82,
      milestones: 80,
      overall: 80
    },
    teamSize: 10,
    deadline: "2024-03-20",
    budget: {
      allocated: 90000,
      spent: 40500
    },
    client: "Creative Studios"
  }
];

export const ProjectsSection = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All Projects');
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priorities');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = statusFilter === 'All Projects' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'All Priorities' || project.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-zinc-200">Production Pipeline</h2>
        <div className="flex flex-wrap gap-4">
          <select 
            className="bg-black/40 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-neutral-300 backdrop-blur-xl
            hover:border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-700 appearance-none
            cursor-pointer [&>option]:bg-zinc-950 [&>option]:text-neutral-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Projects</option>
            <option>In Production</option>
            <option>Pre-Production</option>
            <option>Post-Production</option>
          </select>
          <select 
            className="bg-black/40 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-neutral-300 backdrop-blur-xl
            hover:border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-700 appearance-none
            cursor-pointer [&>option]:bg-zinc-950 [&>option]:text-neutral-300"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All Priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <Card className="group p-6 bg-black/40 hover:bg-black/60 border-[0.5px] border-neutral-800 backdrop-blur-xl hover:border-neutral-700 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-200">{project.title}</h3>
                      <p className="text-sm text-neutral-400">{project.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      project.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                      project.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                    }`}>
                      {project.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconProgress className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm text-neutral-400">{project.status}</span>
                      </div>
                      <ProjectStatus status={project.status} completion={project.completion} />
                    </div>
                    
                    <EfficiencyIndicator metrics={project.efficiency} />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <IconUsers className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm text-neutral-400">{project.teamSize} team members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCalendarStats className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm text-neutral-400">Due {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">Budget Usage</span>
                        <span className="text-sm text-neutral-400">
                          ${project.budget.spent.toLocaleString()} / ${project.budget.allocated.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            (project.budget.spent / project.budget.allocated) > 0.9 ? 'bg-rose-500' :
                            (project.budget.spent / project.budget.allocated) > 0.7 ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${(project.budget.spent / project.budget.allocated) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-2 p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-black/40 border border-neutral-800 rounded-xl p-8 backdrop-blur-xl">
                <div className="w-16 h-16 bg-neutral-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconSearch className="w-8 h-8 text-neutral-500" />
                </div>
                <h3 className="text-xl font-medium text-neutral-300 mb-2">No Projects Found</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  No projects match the selected filters. Try adjusting your filter criteria or check back later for new projects.
                </p>
                <button
                  onClick={() => {
                    setStatusFilter('All Projects');
                    setPriorityFilter('All Priorities');
                  }}
                  className="mt-4 px-4 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 rounded-lg text-sm transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
