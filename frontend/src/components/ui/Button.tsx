import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles = {
  primary:
    "bg-[#1a7a5c] text-white hover:bg-[#15654a] active:bg-[#105038] shadow-sm dark:bg-[#1a7a5c] dark:hover:bg-[#15654a] dark:active:bg-[#105038]",
  secondary:
    "bg-white text-[#1a7a5c] border border-[#1a7a5c] hover:bg-[#1a7a5c]/5 active:bg-[#1a7a5c]/10 dark:bg-surface-800 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/30 dark:active:bg-primary-900/50",
  ghost: "text-surface-600 hover:bg-surface-100 active:bg-surface-200 dark:text-surface-300 dark:hover:bg-surface-700 dark:active:bg-surface-600",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a7a5c] focus:ring-offset-2 dark:focus:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
