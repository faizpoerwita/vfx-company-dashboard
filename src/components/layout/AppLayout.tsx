import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { PageTransition } from '../ui/page-transition';
import { BackgroundBeams } from '../ui/background-beams';
import { SparklesCore } from '../ui/sparkles';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  </div>
);

export const AppLayout = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading state briefly when route changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Adjust this timing if needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative">
      {/* Navigation */}
      <Navigation />

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

      {/* Main Content with Transitions */}
      <main className="relative pt-20">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" />
          ) : (
            <Suspense fallback={<LoadingScreen />}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </Suspense>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
