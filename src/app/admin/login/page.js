import AdminLoginForm from "@components/admin/admin-login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSession } from "@lib/admin-auth";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("proinfo_admin_session")?.value);

  if (session) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
