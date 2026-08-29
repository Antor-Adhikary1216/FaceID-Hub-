import { Link } from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import type { Profile } from "@/types";

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

export default function ProfileHeader({
  profile,
  isOwnProfile,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
      <div className="h-[200px] bg-gradient-to-r from-[#1a7a5c] to-[#15654a] dark:from-primary-900/50 dark:to-primary-800/50">
        {profile.banner && (
          <img
            src={profile.banner}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
          <Avatar
            src={profile.avatar || profile.user.avatar}
            name={profile.user.fullName}
            size="xl"
            className="ring-4 ring-white dark:ring-surface-800"
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                {profile.user.fullName}
              </h1>
              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[#1a7a5c] dark:text-primary-400 bg-white dark:bg-surface-800 border border-[#1a7a5c] dark:border-primary-400 rounded-lg hover:bg-[#1a7a5c]/5 dark:hover:bg-primary-900/30 transition-colors duration-200 self-start"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                    />
                  </svg>
                  Edit Profile
                </Link>
              )}
            </div>
            {profile.jobTitle && (
              <p className="text-surface-600 dark:text-surface-400 mt-1">{profile.jobTitle}</p>
            )}
            {profile.location && (
              <div className="flex items-center gap-1 mt-1 text-sm text-surface-500 dark:text-surface-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          <div>
            <span className="text-lg font-semibold text-surface-900 dark:text-white">
              {profile.followersCount}
            </span>
            <span className="text-sm text-surface-500 dark:text-surface-400 ml-1">followers</span>
          </div>
          <div>
            <span className="text-lg font-semibold text-surface-900 dark:text-white">
              {profile.projectsCount}
            </span>
            <span className="text-sm text-surface-500 dark:text-surface-400 ml-1">projects</span>
          </div>
        </div>
      </div>
    </div>
  );
}
