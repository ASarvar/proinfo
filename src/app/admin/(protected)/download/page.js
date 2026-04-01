import AdminResourcePage from "@components/admin/admin-resource-page";

export default function AdminDownloadPage() {
  return (
    <AdminResourcePage
      title="Download"
      resource="download"
      supportsPublishing
      requiresFileUrl
    />
  );
}
