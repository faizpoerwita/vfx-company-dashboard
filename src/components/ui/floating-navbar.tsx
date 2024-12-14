import { cn } from "@/utils/cn";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Find the index of the current path
    const currentIndex = navItems.findIndex(item => 
      item.link === location.pathname || 
      (location.pathname === '/dashboard' && item.link === '/') ||
      (item.link !== '/' && location.pathname.startsWith(item.link))
    );
    setActiveIndex(currentIndex >= 0 ? currentIndex : null);
  }, [location.pathname, navItems]);

  const handleClick = (idx: number) => {
    const item = navItems[idx];
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.link);
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "flex items-center justify-center fixed top-4 inset-x-0 max-w-fit mx-auto",
        "border border-white/[0.08] rounded-full bg-black/80 backdrop-blur-md",
        "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
        "z-[5000] px-8 py-4",
        className
      )}
    >
      {navItems.map((navItem, idx) => {
        const isActive = activeIndex === idx;
        const isHovered = hoverIndex === idx;
        
        return (
          <button
            key={navItem.link}
            onClick={() => handleClick(idx)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium",
              "flex items-center gap-2 transition-all duration-200",
              isActive 
                ? "text-white" 
                : "text-neutral-400 hover:text-neutral-200"
            )}
            onMouseEnter={() => setHoverIndex(idx)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <motion.span
              className="relative z-10"
              animate={{
                scale: isActive || isHovered ? 1.1 : 1,
                color: isActive ? "#fff" : isHovered ? "#e5e5e5" : "#a3a3a3"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {navItem.icon}
            </motion.span>
            
            <motion.span
              className="relative z-10"
              animate={{
                color: isActive ? "#fff" : isHovered ? "#e5e5e5" : "#a3a3a3"
              }}
              transition={{ duration: 0.2 }}
            >
              {navItem.name}
            </motion.span>

            {/* Active/Hover Background Effect */}
            {(isActive || isHovered) && (
              <motion.div
                layoutId="navPill"
                className={cn(
                  "absolute inset-0 z-0 rounded-full transition-colors duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-neutral-800/90 to-neutral-900/90 shadow-lg" 
                    : "bg-neutral-800/50"
                )}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />
            )}

            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-3 bg-gradient-to-b from-white to-white/50 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        );
      })}
    </motion.div>
  );
};
