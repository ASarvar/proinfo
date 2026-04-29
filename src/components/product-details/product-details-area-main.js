'use client';
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
// internal
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import ProductDetailsBreadcrumb from "@components/product-details/breadcrumb";
import ProductDetailsArea from "@components/product-details/product-details-area";
import ErrorMessage from "@components/error-message/error";
import { initialOrderQuantity } from "src/redux/features/cartSlice";
import { handleModalShow } from "src/redux/features/productSlice";

export default function ShopDetailsMainArea({ id, locale = "ru" }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    dispatch(initialOrderQuantity());
  }, [dispatch]);

  useLayoutEffect(() => {
    dispatch(handleModalShow());
  }, [dispatch, router]);

  useEffect(() => {
    setLoading(true);
    setFetchError("");
    const lang = locale.toUpperCase();
    fetch(`/api/products/${encodeURIComponent(id)}?lang=${lang}`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setProduct(json.data);
        } else {
          setFetchError(json?.error || "Product not found");
        }
      })
      .catch(() => setFetchError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, locale]);

  let content = null;
  if (loading) {
    content = (
      <div style={{ padding: "80px 0", textAlign: "center", color: "#A3A3AA", fontSize: 15 }}>
        Loading…
      </div>
    );
  } else if (fetchError || !product) {
    content = <ErrorMessage message={fetchError || "Product not found"} />;
  } else {
    content = (
      <>
        <ProductDetailsBreadcrumb title={product.title} />
        <ProductDetailsArea product={product} />
      </>
    );
  }

  return (
    <Wrapper>
      <Header style_2={true} />
      {content}
      <Footer />
    </Wrapper>
  );
}
