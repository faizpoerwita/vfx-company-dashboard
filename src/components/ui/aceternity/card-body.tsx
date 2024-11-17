import { cn } from "@/utils/cn";

export const CardBody = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
};
