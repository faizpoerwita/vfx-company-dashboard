import { cn } from "@/utils/cn";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleClick = (idx: number) => {
    setActiveIndex(idx);
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
        "flex items-center justify-center fixed top-4 inset-x-0 max-w-fit mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-4",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <button
          key={navItem.link}
          onClick={() => handleClick(idx)}
          className={cn(
            "relative px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 font-medium",
            "hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors",
            "flex items-center gap-2"
          )}
          onMouseEnter={() => setActiveIndex(idx)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <span className="relative z-10">{navItem.icon}</span>
          <span className="relative z-10">{navItem.name}</span>
          {activeIndex === idx && (
            <motion.div
              layoutId="pill"
              className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 rounded-full z-0"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
};
