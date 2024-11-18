import React from "react";
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { motion } from "framer-motion";
import { CardProps } from './types'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          'p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative z-20 p-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

export function HoverEffect({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className="group relative"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Card>
            <CardContent>
              {item.icon && (
                <div className="p-3 w-fit rounded-lg bg-neutral-900 mb-4">
                  {item.icon}
                </div>
              )}
              <h3 className="font-bold text-lg text-neutral-200 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-400">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
