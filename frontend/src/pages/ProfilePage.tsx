import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { cn, getInitials } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "github":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "twitter":
    case "x":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "website":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { profile, isLoading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id, fetchProfile]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Profile not found
          </h2>
          <p className="mt-2 text-slate-500 dark:text-surface-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isOwnProfile = user?.id === profile.userId;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[800px] mx-auto">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
            {isOwnProfile && (
              <a
                href="/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-surface-600 rounded-lg text-sm font-medium text-slate-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors no-underline"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </a>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-[120px] bg-gradient-to-r from-emerald-100 to-emerald-600 dark:from-emerald-900/50 dark:to-emerald-700/50" />

            <div className="px-6 pb-6">
              {/* Avatar + Info */}
              <div className="flex gap-4 -mt-10 mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-surface-800 bg-white dark:bg-surface-800 overflow-hidden flex-shrink-0">
                  {profile.avatar || profile.user.avatar ? (
                    <img
                      src={profile.avatar || profile.user.avatar}
                      alt={profile.user.fullName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-200 dark:bg-surface-700 flex items-center justify-center text-3xl font-bold text-slate-600 dark:text-surface-300">
                      {getInitials(profile.user.fullName)}
                    </div>
                  )}
                </div>
                <div className="pt-12">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {profile.user.fullName}
                  </h2>
                  {profile.jobTitle && (
                    <p className="text-base text-slate-500 dark:text-surface-400 mb-3">
                      {profile.jobTitle}
                    </p>
                  )}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {profile.skills.length}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-surface-500">Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {profile.projects.length}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-surface-500">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {profile.socialLinks.length}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-surface-500">Links</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    About
                  </h3>
                  <p className="text-base text-slate-500 dark:text-surface-400 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {profile.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-surface-300 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {profile.projects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Projects
                  </h3>
                  <div className="flex flex-col gap-3">
                    {profile.projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 bg-slate-50 dark:bg-surface-900 rounded-lg"
                      >
                        <h4 className="text-base font-medium text-slate-900 dark:text-white mb-1">
                          {project.title}
                        </h4>
                        {project.description && (
                          <p className="text-sm text-slate-500 dark:text-surface-400">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {profile.socialLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Connect
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-surface-900 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors no-underline"
                      >
                        <span className="text-slate-500 dark:text-surface-400">
                          {getSocialIcon(link.platform)}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {link.platform}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-surface-500">
                            {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
