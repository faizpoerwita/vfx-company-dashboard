import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpoint = cardsBreakpoints.reduce((prev, curr) => {
      return Math.abs(curr - latest) < Math.abs(prev - latest) ? curr : prev;
    });
    const activeIndex = cardsBreakpoints.indexOf(closestBreakpoint);
    setActiveCard(activeIndex);
  });

  return (
    <motion.div
      ref={ref}
      className="h-[30rem] overflow-y-auto space-y-8 rounded-md p-8 bg-black/50 backdrop-blur-sm"
    >
      {content.map((item, index) => (
        <div key={item.title + index} className="mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: activeCard === index ? 1 : 0.3 }}
            className="text-2xl font-bold text-neutral-100 mb-4"
          >
            {item.title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: activeCard === index ? 1 : 0.3 }}
            className={cn("text-neutral-300 text-sm", contentClassName)}
          >
            <div className="flex items-start space-x-4 bg-neutral-900/50 p-4 rounded-lg">
              {item.content}
              <p className="flex-1">{item.description}</p>
            </div>
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
};
