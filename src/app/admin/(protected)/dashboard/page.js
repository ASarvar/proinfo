import { cookies } from "next/headers";
import { parseSession } from "@lib/admin-auth";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("proinfo_admin_session")?.value);

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        Admin namespace is active with role model and workflow controls.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <Card title="Current User" value={`${session?.username || "-"} (${session?.role || "-"})`} />
        <Card title="Roles" value="SuperAdmin, Editor" />
        <Card title="Workflow" value="Draft/Publish for Blog, Video, Photo, Download" />
        <Card title="Upload" value="/api/admin/upload with metadata output" />
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}>
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      <p style={{ color: "#334155", margin: 0 }}>{value}</p>
    </div>
  );
}
