import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  children: React.ReactNode;
}

export const MovingBorder = ({
  children,
  className,
  borderRadius = "1.5rem",
  duration = 2000,
  containerClassName,
  borderClassName,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-2",
        "text-white font-medium",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{ borderRadius }}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0",
          "rounded-[inherit]",
          "bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500",
          "p-[1px]",
          "overflow-hidden",
          containerClassName
        )}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: duration / 1000, repeat: Infinity, ease: "linear" }}
          className={cn(
            "absolute inset-[-2px]",
            "rounded-[inherit]",
            "bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500",
            borderClassName
          )}
        />
        <div
          className={cn(
            "relative h-full w-full rounded-[inherit]",
            "bg-black",
            "flex items-center justify-center"
          )}
        >
          {children}
        </div>
      </div>
    </button>
  );
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-50",
        className
      )}
      {...props}
    >
      <span 
        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
      />
      <span 
        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
      >
        {children}
      </span>
    </button>
  );
});
