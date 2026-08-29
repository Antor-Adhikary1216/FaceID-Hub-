import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className,
  header,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm",
        className
      )}
    >
      {header && (
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">{header}</div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
}
