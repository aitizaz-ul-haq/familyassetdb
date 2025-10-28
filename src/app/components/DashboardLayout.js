"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children, userName }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav className="sidebar-menu">
          <Link 
            href="/dashboard" 
            className={isActive("/dashboard") ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link 
            href="/assets" 
            className={isActive("/assets") || pathname.startsWith("/assets/") ? "active" : ""}
          >
            Assets
          </Link>
          <Link 
            href="/people" 
            className={isActive("/people") ? "active" : ""}
          >
            People
          </Link>
          <Link 
            href="/history" 
            className={isActive("/history") ? "active" : ""}
          >
            History
          </Link>
          <Link 
            href="/documents" 
            className={isActive("/documents") ? "active" : ""}
          >
            Documents
          </Link>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Welcome {userName}</h3>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: "0.5rem 1.25rem",
                fontSize: "0.9rem",
                background: "#ef5350"
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
