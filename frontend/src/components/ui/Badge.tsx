import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

const variantStyles = {
  success: "bg-[#1a7a5c]/10 text-[#1a7a5c] dark:bg-primary-900/30 dark:text-primary-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  neutral: "bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300",
};

export default function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
