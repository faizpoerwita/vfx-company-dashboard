import { cn } from "@/utils/cn";
import React from "react";
import { motion } from "framer-motion";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  backgroundFill = "black",
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  backgroundFill?: string;
  animate?: boolean;
}) => {
  const paths = [
    "M0 25C125 25 125 25 250 25C375 25 375 25 500 25L500 0L0 0Z",
    "M0 15C125 35 125 35 250 25C375 15 375 15 500 25L500 0L0 0Z",
    "M0 35C125 15 125 15 250 25C375 35 375 35 500 15L500 0L0 0Z",
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full overflow-hidden bg-black",
        containerClassName
      )}
    >
      <div className="absolute inset-0 z-0">
        <svg
          viewBox="0 0 500 50"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ transform: "rotate(180deg)" }}
        >
          {paths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              fill={backgroundFill || "currentColor"}
              initial={{ d: paths[index] }}
              animate={
                animate
                  ? {
                      d: paths[(index + 1) % paths.length],
                    }
                  : undefined
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          ))}
        </svg>
      </div>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
