import type { Project } from "@/types";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-surface-500 dark:text-surface-400">
        No projects added yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-surface-900 dark:text-white">{project.title}</h3>
            {project.description && (
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                {project.description}
              </p>
            )}
            <div className="flex gap-3 mt-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1a7a5c] dark:text-primary-400 hover:text-[#15654a] dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white font-medium transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
