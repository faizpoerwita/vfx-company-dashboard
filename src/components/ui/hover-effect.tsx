import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface HoverEffectProps {
  items: {
    title: string;
    description: string;
    header?: React.ReactNode;
  }[];
  className?: string;
}

export const HoverEffect = ({ items, className }: HoverEffectProps) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title + idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20">
            <div className="relative z-50">
              <div className="p-4">
                {item.header}
                <div className="text-neutral-200 font-bold tracking-wide mt-4">
                  {item.title}
                </div>
                <div className="text-neutral-400 mt-2 text-sm">
                  {item.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
