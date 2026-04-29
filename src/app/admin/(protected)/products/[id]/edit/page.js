import AdminProductForm from "@components/admin/admin-product-form";
import { use } from "react";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  return <AdminProductForm mode="edit" productId={id} />;
}
