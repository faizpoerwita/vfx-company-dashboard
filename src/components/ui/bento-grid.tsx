import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-zinc-900 bg-white border border-transparent hover:border-zinc-700/50",
        className
      )}
    >
      {header}
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <div className="font-medium text-lg text-zinc-700 dark:text-zinc-300 mb-2">
            {title}
          </div>
        </div>
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
