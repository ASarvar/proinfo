"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminMetaLabelStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
} from "./admin-ui-tokens";

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
    <div style={shellStyle}>
      <div style={shellGlowTopStyle} />
      <div style={shellGlowSideStyle} />

      {/* ── Sidebar ── */}
      <aside style={sidebarStyle}>

        {/* Brand */}
        <div style={brandStyle}>
          <div style={brandTitleStyle}>
            ProInfo
          </div>
          <div style={brandSubtitleStyle}>
            Admin Panel
          </div>
        </div>

        {/* User */}
        <div style={userCardStyle}>
          <div style={userAvatarStyle}>
            {(username || "A").charAt(0).toUpperCase()}
          </div>
          <div style={userInfoStyle}>
            <div style={userNameStyle}>{username}</div>
            <div style={userRoleStyle}>{role}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={navStyle}>
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ ...navItemStyle, ...(active ? navItemActiveStyle : null) }}
              >
                <span style={{ ...navIconStyle, ...(active ? navIconActiveStyle : null) }}>
                  {NAV_ICONS[link.label] || NAV_ICONS.Dashboard}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={logoutWrapStyle}>
          <button
            type="button"
            onClick={onLogout}
            style={logoutButtonStyle}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={mainStyle}>

        {/* Top bar */}
        <header style={headerStyle}>
          <span style={headerTitleStyle}>
            {activeLabel}
          </span>
          <span style={headerDateStyle}>
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </header>

        <main style={contentStyle}>{children}</main>
      </div>
    </div>
  );
}

const shellStyle = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "280px minmax(0, 1fr)",
  background: "linear-gradient(180deg, #F6F8FC 0%, #EEF2F8 100%)",
  position: "relative",
  isolation: "isolate",
};

const shellGlowTopStyle = {
  ...adminAmbientGlowTopStyle,
  top: -70,
  right: "14%",
  width: 320,
  height: 320,
};

const shellGlowSideStyle = {
  ...adminAmbientGlowSideStyle,
  left: 180,
  top: 420,
  width: 260,
  height: 260,
};

const sidebarStyle = {
  background: "linear-gradient(180deg, #03041C 0%, #111738 100%)",
  color: "#fff",
  padding: "22px 18px",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  boxShadow: "8px 0 28px rgba(3,4,28,0.16)",
  position: "sticky",
  top: 0,
  minHeight: "100vh",
};

const brandStyle = {
  padding: "6px 8px 10px",
};

const brandTitleStyle = {
  ...adminPageTitleStyle,
  fontSize: 28,
  margin: 0,
};

const brandSubtitleStyle = {
  display: "inline-flex",
  marginTop: 8,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(226,102,102,0.14)",
  color: "#FFB4B4",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const userCardStyle = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: "12px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const userAvatarStyle = {
  width: 42,
  height: 42,
  borderRadius: 999,
  background: "linear-gradient(140deg, #E26666 0%, #D84F4F 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: 18,
  boxShadow: "0 10px 20px rgba(216,79,79,0.28)",
};

const userInfoStyle = { minWidth: 0 };

const userNameStyle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const userRoleStyle = {
  ...adminMetaLabelStyle,
  color: "rgba(255,255,255,0.62)",
  marginTop: 4,
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "11px 12px",
  borderRadius: 12,
  color: "rgba(255,255,255,0.82)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
  transition: "background 160ms ease, color 160ms ease",
};

const navItemActiveStyle = {
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
};

const navIconStyle = {
  width: 32,
  height: 32,
  borderRadius: 10,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.06)",
};

const navIconActiveStyle = {
  background: "rgba(226,102,102,0.18)",
  color: "#FFB4B4",
};

const logoutWrapStyle = {
  marginTop: "auto",
  paddingTop: 8,
};

const logoutButtonStyle = {
  ...adminPrimaryCtaStyle,
  width: "100%",
  background: "linear-gradient(140deg, #1E2253 0%, #313978 100%)",
  boxShadow: "none",
};

const mainStyle = {
  minWidth: 0,
  padding: "18px 22px 28px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "10px 2px 18px",
};

const headerTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 20,
  fontWeight: 700,
  color: "#03041C",
  letterSpacing: "-0.02em",
};

const headerDateStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#667085",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const contentStyle = {
  minWidth: 0,
};
