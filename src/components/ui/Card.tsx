import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl h-full w-full overflow-hidden bg-black border border-neutral-800 dark:border-white/[0.2] group-hover:border-neutral-600 relative z-20",
          className
        )}
        {...props}
      >
        <div className="relative z-50">
          {children}
        </div>
        <div
          className="absolute inset-0 z-10 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

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
