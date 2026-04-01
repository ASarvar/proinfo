import AdminResourcePage from "@components/admin/admin-resource-page";

export default function AdminVideoPage() {
  return (
    <AdminResourcePage
      title="Video"
      resource="video"
      supportsPublishing
      requiresVideoUrl
    />
  );
}
