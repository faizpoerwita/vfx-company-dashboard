import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlowEffectProps {
  duration?: number;
  className?: string;
}

export const GlowEffect = ({ duration = 5, className }: GlowEffectProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "fixed inset-0 pointer-events-none",
            className
          )}
        >
          {/* Main container with full screen size */}
          <div className="absolute inset-0 w-full h-full">
            {/* Responsive glow border container */}
            <div className="absolute inset-[1px] rounded-2xl overflow-hidden">
              {/* Animated gradient border */}
              <div 
                className="absolute -inset-[100%] animate-[spin_2s_linear_infinite]"
                style={{
                  background: 'conic-gradient(from 90deg at 50% 50%, #E2CBFF 0%, #393BB2 50%, #E2CBFF 100%)',
                }}
              />
              
              {/* Inner content background with blur */}
              <div className="absolute inset-[1px] rounded-2xl bg-neutral-950/70 backdrop-blur-xl">
                {/* Inner glow effects */}
                <div className="absolute inset-0 rounded-2xl">
                  {/* Radial glow */}
                  <div className="absolute inset-0 bg-radial-glow opacity-30" />
                  
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 animate-pulse-subtle" />
                  
                  {/* Edge highlights */}
                  <div className="absolute inset-0 rounded-2xl">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-purple-300/20 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-blue-300/20 to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Corner glows */}
            <div className="absolute inset-0">
              {/* Top left */}
              <div className="absolute top-0 left-0 w-[25%] h-[25%] bg-gradient-to-br from-[#E2CBFF]/20 to-transparent blur-xl" />
              {/* Top right */}
              <div className="absolute top-0 right-0 w-[25%] h-[25%] bg-gradient-to-bl from-[#393BB2]/20 to-transparent blur-xl" />
              {/* Bottom left */}
              <div className="absolute bottom-0 left-0 w-[25%] h-[25%] bg-gradient-to-tr from-[#393BB2]/20 to-transparent blur-xl" />
              {/* Bottom right */}
              <div className="absolute bottom-0 right-0 w-[25%] h-[25%] bg-gradient-to-tl from-[#E2CBFF]/20 to-transparent blur-xl" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
