import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import type { SearchResult } from "@/types";

interface MatchCardProps {
  result: SearchResult;
}

function getSimilarityBadgeClasses(similarity: number): string {
  if (similarity >= 70)
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
  if (similarity >= 50)
    return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
  return "bg-slate-100 text-slate-600 dark:bg-surface-700 dark:text-surface-300";
}

function getSimilarityLabel(similarity: number): string {
  if (similarity >= 70) return "High similarity";
  if (similarity >= 50) return "Medium similarity";
  return "Lower similarity";
}

function getSimilarityIcon(similarity: number) {
  if (similarity >= 70) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (similarity >= 50) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function getAvatarBgColor(similarity: number): string {
  if (similarity >= 70) return "bg-slate-100 text-slate-700 dark:bg-surface-700 dark:text-surface-300";
  if (similarity >= 50) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
}

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "github":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "twitter":
    case "x":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "dribbble":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.91 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function MatchCard({ result }: MatchCardProps) {
  const { profile, similarity } = result;

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl transition-all hover:border-slate-300 dark:hover:border-surface-600 hover:shadow-md">
      <div className="w-[100px] h-[100px] rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-surface-700">
        {profile.avatar || profile.user.avatar ? (
          <img
            src={profile.avatar || profile.user.avatar}
            alt={profile.user.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center text-2xl font-bold rounded-lg",
              getAvatarBgColor(similarity)
            )}
          >
            {getInitials(profile.user.fullName)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {profile.user.fullName}
            </h2>
            {profile.jobTitle && (
              <p className="text-sm text-slate-500 dark:text-surface-400">{profile.jobTitle}</p>
            )}
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap",
              getSimilarityBadgeClasses(similarity)
            )}
          >
            {getSimilarityIcon(similarity)}
            {getSimilarityLabel(similarity)}
          </span>
        </div>
        {profile.bio && (
          <p className="text-sm text-slate-500 dark:text-surface-400 leading-relaxed line-clamp-2 mb-3">
            {profile.bio}
          </p>
        )}
        {profile.socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-surface-700 text-slate-500 dark:text-surface-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label={`${link.platform} profile`}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
        <div>
          <Link
            to={`/profile/${profile.id}`}
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              similarity >= 70
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "border border-slate-300 dark:border-surface-600 text-slate-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700"
            )}
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
