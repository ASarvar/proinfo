import AdminSolutionEditPage from "@components/admin/admin-solution-edit-page";

export const metadata = { title: "Edit Solution — Admin" };

export default async function AdminSolutionEditRoute({ params }) {
  const { slug } = await params;
  return <AdminSolutionEditPage slug={slug} />;
}
