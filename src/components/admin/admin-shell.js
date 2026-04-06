"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F6F8", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 256, flexShrink: 0, background: "#03041C", display: "flex", flexDirection: "column" }}>

        {/* Brand */}
        <div style={{ padding: "26px 22px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
            ProInfo
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#E26666", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
            Admin Panel
          </div>
        </div>

        {/* User */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E26666", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {(username || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{username}</div>
            <div style={{ fontSize: 11, color: "#A3A3AA", marginTop: 1 }}>{role}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  background: active ? "rgba(226,102,102,0.18)" : "transparent",
                  borderLeft: `3px solid ${active ? "#E26666" : "transparent"}`,
                  transition: "all 0.15s ease",
                  boxSizing: "border-box",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            type="button"
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              borderRadius: 8,
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.15s",
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          background: "#fff",
          borderBottom: "1px solid #EAEAF0",
          height: 58,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: "#03041C", letterSpacing: "-0.01em" }}>
            {activeLabel}
          </span>
          <span style={{ fontSize: 12, color: "#A3A3AA" }}>
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </header>

        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
