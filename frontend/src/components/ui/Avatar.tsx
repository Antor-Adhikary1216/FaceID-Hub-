import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-20 h-20 text-xl",
};

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  className,
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover",
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[#1a7a5c]/10 dark:bg-primary-900/30 text-[#1a7a5c] dark:text-primary-400 font-medium flex items-center justify-center",
        sizeStyles[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
