import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ensure component is mounted before showing animation
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : 20 
        }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 30,
        }}
        className="min-h-[80vh] w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
