import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { useSearchStore } from "@/stores/search.store";
import Sidebar from "@/components/layout/Sidebar";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { profile, isLoading: profileLoading, fetchMyProfile } = useProfileStore();
  const { searchHistory, fetchHistory } = useSearchStore();

  useEffect(() => {
    fetchMyProfile();
    fetchHistory();
  }, [fetchMyProfile, fetchHistory]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-5xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.fullName?.split(" ")[0] || "User"}
            </h1>
            <p className="text-base text-slate-500 dark:text-surface-400">
              Here's what's happening with your profile today.
            </p>
          </div>

          {/* Search CTA */}
          <Link
            to="/search"
            className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl text-white mb-8 no-underline"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Search by Photo</h2>
              <p className="text-sm opacity-90">
                Upload a photograph to find possible matching profiles from our
                consent-based database.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-medium whitespace-nowrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Start Search
            </div>
          </Link>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Left Column */}
            <div>
              {/* Recent Searches */}
              <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-600 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Recent Searches
                  </h3>
                  <Link
                    to="/search"
                    className="text-sm font-medium text-emerald-600 dark:text-primary-400 hover:text-emerald-700 dark:hover:text-primary-300"
                  >
                    View all
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {searchHistory.length > 0 ? (
                    searchHistory.slice(0, 3).map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-surface-700 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-600 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-slate-200 dark:bg-surface-500 rounded-lg flex items-center justify-center text-sm font-medium text-slate-600 dark:text-surface-300">
                            {result.profile.user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {result.profile.user.fullName}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-surface-500">
                            {formatDate(result.matchedAt)}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            result.similarity >= 70
                              ? "bg-emerald-100 dark:bg-green-900/20 text-emerald-700 dark:text-green-400"
                              : result.similarity >= 50
                              ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                              : "bg-slate-100 dark:bg-surface-600 text-slate-600 dark:text-surface-300"
                          }`}
                        >
                          {result.similarity >= 70
                            ? "High match"
                            : result.similarity >= 50
                            ? "Medium match"
                            : "Low match"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-surface-700 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-surface-500 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-surface-300">
                          JS
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            John Smith
                          </p>
                          <p className="text-xs text-slate-400 dark:text-surface-500">2 hours ago</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-green-900/20 text-emerald-700 dark:text-green-400">
                          High match
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-surface-700 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-surface-500 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-surface-300">
                          AB
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Alex Brown
                          </p>
                          <p className="text-xs text-slate-400 dark:text-surface-500">Yesterday</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                          Medium match
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-surface-700 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-surface-500 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-surface-300">
                          DL
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            David Lee
                          </p>
                          <p className="text-xs text-slate-400 dark:text-surface-500">3 days ago</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-surface-600 text-slate-600 dark:text-surface-300">
                          Low match
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-600 rounded-xl p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Quick Actions
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/search"
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-surface-700 border border-slate-200 dark:border-surface-600 rounded-lg cursor-pointer transition-all hover:bg-emerald-50 dark:hover:bg-primary-900/20 hover:border-emerald-500 dark:hover:border-primary-500 hover:text-emerald-600 dark:hover:text-primary-400 text-slate-900 dark:text-white no-underline"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <span className="text-xs font-medium text-center">
                      New Search
                    </span>
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-surface-700 border border-slate-200 dark:border-surface-600 rounded-lg cursor-pointer transition-all hover:bg-emerald-50 dark:hover:bg-primary-900/20 hover:border-emerald-500 dark:hover:border-primary-500 hover:text-emerald-600 dark:hover:text-primary-400 text-slate-900 dark:text-white no-underline"
                  >
                    <svg
                      className="w-6 h-6"
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
                    <span className="text-xs font-medium text-center">
                      Edit Profile
                    </span>
                  </Link>
                  <Link
                    to="/privacy"
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-surface-700 border border-slate-200 dark:border-surface-600 rounded-lg cursor-pointer transition-all hover:bg-emerald-50 dark:hover:bg-primary-900/20 hover:border-emerald-500 dark:hover:border-primary-500 hover:text-emerald-600 dark:hover:text-primary-400 text-slate-900 dark:text-white no-underline"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-xs font-medium text-center">
                      Privacy
                    </span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-surface-700 border border-slate-200 dark:border-surface-600 rounded-lg cursor-pointer transition-all hover:bg-emerald-50 dark:hover:bg-primary-900/20 hover:border-emerald-500 dark:hover:border-primary-500 hover:text-emerald-600 dark:hover:text-primary-400 text-slate-900 dark:text-white no-underline"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span className="text-xs font-medium text-center">
                      Settings
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Profile Completion */}
              <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-600 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Your Profile
                  </h3>
                  <Link
                    to="/profile/me"
                    className="text-sm font-medium text-emerald-600 dark:text-primary-400 hover:text-emerald-700 dark:hover:text-primary-300"
                  >
                    View
                  </Link>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Completion
                    </span>
                    <span className="text-sm text-slate-500 dark:text-surface-400">85%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-surface-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-surface-400">
                      <svg
                        className="w-4 h-4 text-emerald-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Basic information
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-surface-400">
                      <svg
                        className="w-4 h-4 text-emerald-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Profile photo
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-surface-400">
                      <svg
                        className="w-4 h-4 text-emerald-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Bio
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-surface-500">
                      <svg
                        className="w-4 h-4 text-slate-400 dark:text-surface-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      Skills (add 3+)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-surface-500">
                      <svg
                        className="w-4 h-4 text-slate-400 dark:text-surface-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      Social links
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Status */}
              <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-600 rounded-xl p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Privacy Status
                  </h3>
                  <Link
                    to="/privacy"
                    className="text-sm font-medium text-emerald-600 dark:text-primary-400 hover:text-emerald-700 dark:hover:text-primary-300"
                  >
                    Manage
                  </Link>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-surface-700 rounded-lg">
                    <span className="text-sm text-slate-900 dark:text-white">
                      Profile visibility
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-green-900/20 text-emerald-700 dark:text-green-400">
                      Public
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-surface-700 rounded-lg">
                    <span className="text-sm text-slate-900 dark:text-white">
                      Face matching
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-green-900/20 text-emerald-700 dark:text-green-400">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-surface-700 rounded-lg">
                    <span className="text-sm text-slate-900 dark:text-white">
                      Search participation
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-green-900/20 text-emerald-700 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
