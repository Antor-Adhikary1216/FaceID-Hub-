import type { Skill } from "@/types";

interface SkillsListProps {
  skills: Skill[];
}

const categoryColors: Record<string, string> = {
  frontend: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  backend: "bg-[#1a7a5c]/10 text-[#1a7a5c] dark:bg-primary-900/30 dark:text-primary-400",
  mobile: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  devops: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  design: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
  database: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  default: "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300",
};

export default function SkillsList({ skills }: SkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-8 text-surface-500 dark:text-surface-400">
        No skills added yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {skills.map((skill) => (
        <span
          key={skill.id}
          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${
            categoryColors[skill.category || "default"] ||
            categoryColors.default
          }`}
        >
          {skill.name}
        </span>
      ))}
    </div>
  );
}
