import { cookies } from "next/headers";
import { parseSession } from "@lib/admin-auth";

const CARDS = [
  { title: "Categories", value: "RFID · Automation · Library · Printing · Software…", accent: "#E26666" },
  { title: "Content Types", value: "Products · Blog · Video · Photo · Download · FAQ", accent: "#008080" },
  { title: "Workflow", value: "Draft / Publish for Blog, Video, Photo & Download", accent: "#3242EE" },
  { title: "File Upload", value: "Max 10 MB · Images, PDFs & documents", accent: "#FF8045" },
];

const QUICK_LINKS = [
  "/admin/categories",
  "/admin/products",
  "/admin/blog",
  "/admin/video",
  "/admin/photo",
  "/admin/download",
  "/admin/faq",
];

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("proinfo_admin_session")?.value);

  return (
    <section style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 26 }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          color: "#03041C",
          margin: "0 0 6px",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
        }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#A3A3AA", margin: 0, lineHeight: 1.5 }}>
          Welcome back,{" "}
          <strong style={{ color: "#525258" }}>{session?.username}</strong>.
          {" "}Signed in as{" "}
          <strong style={{ color: "#525258" }}>{session?.role}</strong>.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 24 }}>
        {CARDS.map((c) => (
          <div key={c.title} style={{
            background: "#fff",
            border: "1px solid #EAEAF0",
            borderRadius: 12,
            padding: "18px 20px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: c.accent }} />
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#A3A3AA",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}>
              {c.title}
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#03041C", margin: 0, lineHeight: 1.6 }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background: "#fff", border: "1px solid #EAEAF0", borderRadius: 12, padding: "20px 22px" }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#03041C",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 14,
        }}>
          Quick Access
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
          {QUICK_LINKS.map((href) => {
            const label = href.split("/").pop();
            const display = label.charAt(0).toUpperCase() + label.slice(1);
            return (
              <a key={href} href={href} style={{
                display: "block",
                padding: "10px 14px",
                background: "#F5F6F8",
                border: "1px solid #EAEAF0",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#03041C",
                textDecoration: "none",
                transition: "border-color 0.15s, background 0.15s",
              }}>
                {display}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
