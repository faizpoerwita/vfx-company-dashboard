"use client";
import { cn } from "@/lib/utils";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<{
  mouseX: number;
  mouseY: number;
  setMouseX: React.Dispatch<React.SetStateAction<number>>;
  setMouseY: React.Dispatch<React.SetStateAction<number>>;
}>({
  mouseX: 0,
  mouseY: 0,
  setMouseX: () => {},
  setMouseY: () => {},
});

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  const resetMousePosition = () => {
    setMouseX(0);
    setMouseY(0);
  };

  return (
    <div
      className={cn(
        "py-20 flex items-center justify-center",
        containerClassName
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetMousePosition}
        className={cn(
          "flex items-center justify-center relative",
          className
        )}
      >
        <MouseEnterContext.Provider
          value={{
            mouseX,
            mouseY,
            setMouseX,
            setMouseY,
          }}
        >
          {children}
        </MouseEnterContext.Provider>
      </div>
    </div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { mouseX, mouseY } = useContext(MouseEnterContext);

  const rotateX = mouseY / 25;
  const rotateY = -mouseX / 25;

  return (
    <div
      className={cn(
        "relative duration-200 ease-linear",
        className
      )}
      style={{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  as?: any;
}) => {
  return (
    <Component
      className={cn("", className)}
      style={{
        transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </Component>
  );
};
