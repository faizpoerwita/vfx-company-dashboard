import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/utils/cn";
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-neutral-950 py-12 relative overflow-hidden">
      {/* Background sparkles effect */}
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleCount={100}
        speed={1}
        className="w-full h-full absolute inset-0"
        particleColor="#FFFFFF"
      />
      
      {/* Main content */}
      <div className={cn("max-w-7xl mx-auto px-4 relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};
