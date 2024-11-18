import { cn } from "@/lib/utils";
import React from "react";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = "div",
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: any;
}) => {
  return (
    <Component
      className={cn(
        "relative p-[1px] bg-transparent overflow-hidden rounded-lg",
        containerClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-0 overflow-hidden rounded-lg",
          borderClassName
        )}
      >
        <div
          className={cn(
            "absolute z-0 h-[500%] w-[500%] animate-spin",
            "[background:conic-gradient(from_0deg,transparent_0_340deg,white_360deg)]",
            "[animation-duration:3s]",
            "[animation-iteration-count:infinite]",
            "[animation-timing-function:linear]"
          )}
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      </div>
      <div
        className={cn(
          "relative z-10 bg-black dark:bg-zinc-950 rounded-lg",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
};
