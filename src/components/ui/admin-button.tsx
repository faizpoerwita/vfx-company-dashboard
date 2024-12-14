import React from 'react';
import { cn } from '@/utils/cn';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger' | 'success';
  size?: 'icon' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 z-20 cursor-pointer";
    
    const variants = {
      default: "bg-neutral-900 hover:bg-neutral-800 text-neutral-100 active:bg-neutral-700",
      danger: "bg-red-950 hover:bg-red-900 text-red-100 active:bg-red-800",
      success: "bg-emerald-950 hover:bg-emerald-900 text-emerald-100 active:bg-emerald-800"
    };

    const sizes = {
      icon: "h-9 w-9 rounded-lg",
      sm: "h-8 px-3 rounded-lg text-xs",
      md: "h-10 px-4 rounded-lg text-sm",
      lg: "h-12 px-6 rounded-lg text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);

AdminButton.displayName = 'AdminButton';
