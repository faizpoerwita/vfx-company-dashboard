import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/utils/cn";

interface SparklesProps {
  id: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
  particleColor?: string;
  particleCount?: number;
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const useRandomInterval = (callback: () => void, minDelay: number, maxDelay: number) => {
  const timeoutId = React.useRef<number | null>(null);
  const savedCallback = React.useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      const nextDelay = random(minDelay, maxDelay);
      timeoutId.current = window.setTimeout(() => {
        savedCallback.current();
        tick();
      }, nextDelay);
    };

    tick();

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, [minDelay, maxDelay]);
};

export const SparklesCore: React.FC<SparklesProps> = ({
  id,
  background = "transparent",
  minSize = 10,
  maxSize = 20,
  speed = 1,
  className,
  particleColor = "#FFF",
  particleCount = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Array<any>>([]);
  const controls = useAnimation();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const createParticles = () => {
      const particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
        });
      }

      return particles;
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle: any) => {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setParticles(createParticles());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animate();

    return () => window.removeEventListener("resize", handleResize);
  }, [background, maxSize, minSize, particleColor, particleCount]);

  useRandomInterval(
    () => {
      setParticles((particles) =>
        [...particles.slice(1), {
          id: Date.now(),
          size: random(minSize, maxSize),
          x: random(0, 100),
          y: random(0, 100),
        }].slice(-particleCount)
      );
    },
    50 / speed,
    150 / speed
  );

  return (
    <motion.canvas
      ref={canvasRef}
      animate={controls}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      style={{ background }}
      aria-hidden="true"
    />
  );
};
