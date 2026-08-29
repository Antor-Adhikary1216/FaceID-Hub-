import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";

function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2 rounded-lg transition-colors ${
        className
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === "/";

  useEffect(() => {
    if (isLanding) {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isLanding]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  // Landing page navbar
  if (isLanding) {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-surface-900/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/assets/images/FaceID_Hub_logo_design_2K_202608291407.jpeg"
                alt="FaceID Hub Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className={`text-xl font-bold ${isScrolled ? "text-[#0f172a] dark:text-white" : "text-white"}`} style={{ textShadow: isScrolled ? "none" : "0 1px 10px rgba(0,0,0,0.3)" }}>
                FaceID Hub
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle className={`${isScrolled ? "text-[#0f172a] dark:text-white hover:bg-gray-100 dark:hover:bg-surface-800" : "text-white hover:bg-white/10"}`} />
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isScrolled
                    ? "text-[#0f172a] dark:text-white hover:bg-gray-100 dark:hover:bg-surface-800"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Dashboard/App navbar
  return (
    <nav className="bg-white dark:bg-surface-900 border-b border-[#e2e8f0] dark:border-surface-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#64748b] dark:text-surface-400 hover:text-[#0f172a] dark:hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            <Link to="/" className="flex items-center gap-2 ml-2 md:ml-0">
              <img
                src="/assets/images/FaceID_Hub_logo_design_2K_202608291407.jpeg"
                alt="FaceID Hub Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-[#0f172a] dark:text-white">FaceID Hub</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              <Link
                to="/search"
                className="text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Search
              </Link>
              <Link
                to="/dashboard"
                className="text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle className="text-[#64748b] dark:text-surface-400 hover:bg-[#f1f5f9] dark:hover:bg-surface-800 hover:text-[#0f172a] dark:hover:text-white" />

            {/* Search Button */}
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f172a] dark:text-white bg-[#f8fafc] dark:bg-surface-800 border border-[#e2e8f0] dark:border-surface-600 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-surface-700 transition-colors"
            >
              <svg className="w-4 h-4 text-[#64748b] dark:text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search
            </Link>

            {/* Profile Menu */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 text-[#334155] dark:text-surface-300 hover:text-[#0f172a] dark:hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#d1f5e8] dark:bg-primary-900/50 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#1a7a5c] dark:text-primary-400">
                      {user?.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">{user?.fullName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-[#e2e8f0] dark:border-surface-600 py-1 animate-slide-down">
                    <div className="px-4 py-3 border-b border-[#e2e8f0] dark:border-surface-600">
                      <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{user?.fullName}</p>
                      <p className="text-xs text-[#64748b] dark:text-surface-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to={`/profile/${user?.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#334155] dark:text-surface-300 hover:bg-[#f8fafc] dark:hover:bg-surface-700 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 text-[#64748b] dark:text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/profile/edit"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#334155] dark:text-surface-300 hover:bg-[#f8fafc] dark:hover:bg-surface-700 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 text-[#64748b] dark:text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit Profile
                    </Link>
                    <Link
                      to="/privacy"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#334155] dark:text-surface-300 hover:bg-[#f8fafc] dark:hover:bg-surface-700 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 text-[#64748b] dark:text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Privacy Settings
                    </Link>
                    <hr className="my-1 border-[#e2e8f0] dark:border-surface-600" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile profile + theme buttons */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle className="text-[#64748b] dark:text-surface-400 hover:bg-[#f1f5f9] dark:hover:bg-surface-800" />
            {isAuthenticated && (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 text-[#64748b] dark:text-surface-400 hover:text-[#0f172a] dark:hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#d1f5e8] dark:bg-primary-900/50 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#1a7a5c] dark:text-primary-400">
                    {user?.fullName?.charAt(0) || "U"}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2e8f0] dark:border-surface-700 bg-white dark:bg-surface-900 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/search"
              className="block text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 hover:bg-[#f8fafc] dark:hover:bg-surface-800 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/dashboard"
              className="block text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 hover:bg-[#f8fafc] dark:hover:bg-surface-800 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to={`/profile/${user?.id}`}
              className="block text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 hover:bg-[#f8fafc] dark:hover:bg-surface-800 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <hr className="my-2 border-[#e2e8f0] dark:border-surface-700" />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Profile Menu */}
      {isProfileMenuOpen && !isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2e8f0] dark:border-surface-700 bg-white dark:bg-surface-900 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            <div className="px-3 py-2 border-b border-[#e2e8f0] dark:border-surface-700 mb-2">
              <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{user?.fullName}</p>
              <p className="text-xs text-[#64748b] dark:text-surface-400 truncate">{user?.email}</p>
            </div>
            <Link
              to={`/profile/${user?.id}`}
              className="block text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 hover:bg-[#f8fafc] dark:hover:bg-surface-800 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/profile/edit"
              className="block text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 hover:bg-[#f8fafc] dark:hover:bg-surface-800 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Edit Profile
            </Link>
            <Link
              to="/privacy"
              className="block text-[#64748b] dark:text-surface-400 hover:text-[#1a7a5c] dark:hover:text-primary-400 hover:bg-[#f8fafc] dark:hover:bg-surface-800 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Privacy Settings
            </Link>
            <hr className="my-2 border-[#e2e8f0] dark:border-surface-700" />
            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
