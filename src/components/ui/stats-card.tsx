import { BackgroundGradient } from "./background-gradient";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <BackgroundGradient className={cn("rounded-2xl bg-black", className)}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 h-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && (
              <div className="p-2 rounded-lg bg-neutral-900">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
          </div>
          {trend && (
            <div className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium",
              trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold text-neutral-200">{value}</div>
          {description && (
            <p className="mt-1 text-sm text-neutral-400">{description}</p>
          )}
        </div>
      </motion.div>
    </BackgroundGradient>
  );
};
