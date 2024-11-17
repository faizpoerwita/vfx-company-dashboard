import { cn } from "@/utils/cn";
import React from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item) => (
        <a
          href={item.link}
          key={item.title}
          className="relative group block p-2 h-full w-full"
        >
          <div className="relative z-10 h-full w-full px-8 py-8 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 via-zinc-800/25 to-zinc-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-zinc-200 mb-2 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {item.description}
              </p>
            </div>

            {/* Hover animations */}
            <div className="absolute -inset-px bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800 group-hover:via-purple-500 transition-all duration-500" />
          </div>
        </a>
      ))}
    </div>
  );
};
