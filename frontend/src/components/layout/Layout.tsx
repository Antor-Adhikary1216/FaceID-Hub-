import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(
    location.pathname
  );

  // Auth pages have their own layout (no navbar, no footer)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Landing page: transparent navbar + footer
  if (isLanding) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>{children}</main>
      </div>
    );
  }

  // Dashboard pages: white navbar + main content
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-surface-900">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
