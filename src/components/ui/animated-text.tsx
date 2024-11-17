import { cn } from "@/utils/cn";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const AnimatedText = ({
  text,
  className,
  repeatDelay = 0,
}: {
  text: string;
  className?: string;
  repeatDelay?: number;
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const words = text.split(" ");

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
          y: 0,
        },
        {
          duration: 0.2,
          delay: stagger(0.1),
        }
      );
    }
  }, [isInView, animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {words.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="dark:text-white text-black opacity-0 translate-y-[-20px] inline-block mr-1.5"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      {renderWords()}
    </div>
  );
};
