import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { AnimatedText } from "@/components/ui/animated-text";
import { cn } from "@/utils/cn";
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageHeader = ({ title, subtitle, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center mb-12", className)}>
      <MovingBorder duration={3000} className="p-4 hover:scale-105 transition-transform">
        <BackgroundGradient className="rounded-[22px] max-w-2xl p-4 bg-black">
          <AnimatedText
            text={title}
            className="text-4xl md:text-5xl font-bold text-center text-neutral-200"
          />
        </BackgroundGradient>
      </MovingBorder>
      
      {subtitle && (
        <div className="mt-8 text-center max-w-xl">
          <AnimatedText
            text={subtitle}
            className="text-lg text-neutral-400"
          />
        </div>
      )}
    </div>
  );
};
