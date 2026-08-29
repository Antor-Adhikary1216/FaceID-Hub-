import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function getSimilarityColor(similarity: number): string {
  if (similarity >= 70) return "text-accent-500";
  if (similarity >= 50) return "text-yellow-500";
  return "text-red-500";
}

export function getSimilarityBadgeColor(similarity: number): string {
  if (similarity >= 70) return "bg-accent-50 text-accent-600";
  if (similarity >= 50) return "bg-yellow-50 text-yellow-600";
  return "bg-red-50 text-red-600";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
