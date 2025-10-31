"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children, userName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/assets", label: "Assets", icon: "🏢" },
    { href: "/people", label: "People", icon: "👥" },
    { href: "/documents", label: "Documents", icon: "📎" },
  ];

  const isActive = (href) => pathname === href;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
        <h1 className={styles.mobileTitle}>Family Assets</h1>
        <div className={styles.mobileUserBadge}>
          {userName?.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isMobileMenuOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Family Asset Registry</h2>
          <button
            className={styles.closeSidebar}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{userName}</p>
            <p className={styles.userRole}>Admin</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                isActive(item.href) ? styles.navLinkActive : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu}></div>
      )}

      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
