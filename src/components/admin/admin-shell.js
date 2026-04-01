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

  return (
    <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", minHeight: "100vh", background: "#f7f8fb" }}>
      <aside style={{ borderRight: "1px solid #d9dde6", padding: 16, background: "#fff" }}>
        <h2 style={{ marginBottom: 6 }}>Admin Panel</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>{username} ({role})</p>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: active ? "#fff" : "#1f2937",
                  background: active ? "#0f172a" : "#f3f4f6",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          style={{ marginTop: 18, width: "100%", border: "1px solid #cbd5e1", background: "#fff", borderRadius: 8, padding: 10 }}
        >
          Logout
        </button>
      </aside>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}
