import { cn } from "@/utils/cn";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = ({ 
  borderRadius = "1.5rem", 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[1px]",
        "bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800",
        "hover:bg-gradient-to-r hover:from-neutral-700 hover:via-neutral-600 hover:to-neutral-700",
        "transition-all duration-300",
        className
      )}
      style={{ borderRadius }}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
};
