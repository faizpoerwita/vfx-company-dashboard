import React from 'react';
import { Navigation } from './navigation';
import { cn } from '@/utils/cn';
import { SparklesCore } from '../ui/sparkles';
import { BackgroundGradient } from '../ui/background-gradient';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleCount={100}
          speed={1}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-950/90 to-neutral-950/70" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className={cn(
        "relative z-10 pt-24 pb-16 px-4 max-w-7xl mx-auto",
        "grid grid-cols-1 lg:grid-cols-12 gap-8",
        className
      )}>
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <BackgroundGradient className="rounded-2xl p-4 bg-black">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-200">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-neutral-900/50">
                  <p className="text-sm text-neutral-400">Active</p>
                  <p className="text-2xl font-bold text-neutral-200">24</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/50">
                  <p className="text-sm text-neutral-400">Completed</p>
                  <p className="text-2xl font-bold text-neutral-200">156</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/50">
                  <p className="text-sm text-neutral-400">In Review</p>
                  <p className="text-2xl font-bold text-neutral-200">8</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/50">
                  <p className="text-sm text-neutral-400">On Hold</p>
                  <p className="text-2xl font-bold text-neutral-200">3</p>
                </div>
              </div>
            </div>
          </BackgroundGradient>

          <BackgroundGradient className="rounded-2xl p-4 bg-black">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-200">Recent Activity</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-900/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-sm text-neutral-300">Project X updated</p>
                      <p className="text-xs text-neutral-500">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BackgroundGradient>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {children}
        </div>
      </main>
    </div>
  );
};
