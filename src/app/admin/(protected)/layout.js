import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSession } from "@lib/admin-auth";
import AdminShell from "@components/admin/admin-shell";

export default async function ProtectedAdminLayout({ children }) {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("proinfo_admin_session")?.value);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell role={session.role} username={session.username}>
      {children}
    </AdminShell>
  );
}
