import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSession } from "@lib/admin-auth";

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("proinfo_admin_session")?.value);

  if (session) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}
