"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ICONS = {
  Dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Categories: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Products: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Blog: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Video: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Photo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  FAQ: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/video", label: "Video" },
  { href: "/admin/photo", label: "Photo" },
  { href: "/admin/download", label: "Download" },
  { href: "/admin/faq", label: "FAQ" },
];

export default function AdminShell({ children, role, username }) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const activeLabel = links.find(
    (l) => pathname === l.href || (l.href !== "/admin/dashboard" && pathname.startsWith(l.href))
  )?.label ?? "Dashboard";

  return (
    <div className="admin-shell">

      {/* ── Sidebar ── */}
      <aside className="admin-shell__sidebar">

        {/* Brand */}
        <div className="admin-shell__brand">
          <div className="admin-shell__brand__title">
            ProInfo
          </div>
          <div className="admin-shell__brand__subtitle">
            Admin Panel
          </div>
        </div>

        {/* User */}
        <div className="admin-shell__user">
          <div className="admin-shell__user__avatar">
            {(username || "A").charAt(0).toUpperCase()}
          </div>
          <div className="admin-shell__user__info">
            <div className="admin-shell__user__name">{username}</div>
            <div className="admin-shell__user__role">{role}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-shell__nav">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-shell__nav-item ${active ? "admin-shell__nav-item--active" : ""}`}
              >
                <span className="admin-shell__nav-item__icon">
                  {NAV_ICONS[link.label] || NAV_ICONS.Dashboard}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="admin-shell__logout">
          <button
            type="button"
            onClick={onLogout}
            className="admin-shell__logout__btn"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="admin-shell__main">

        {/* Top bar */}
        <header className="admin-shell__header">
          <span className="admin-shell__header__title">
            {activeLabel}
          </span>
          <span className="admin-shell__header__date">
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </header>

        <main className="admin-shell__content">{children}</main>
      </div>
    </div>
  );
}
