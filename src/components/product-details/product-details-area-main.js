'use client';
import { useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
// internal
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import ProductDetailsBreadcrumb from "@components/product-details/breadcrumb";
import ProductDetailsArea from "@components/product-details/product-details-area";
import ErrorMessage from "@components/error-message/error";
import ProductDetailsTabArea from "@components/product-details/product-details-tab-area";
import RelatedProducts from "@components/product-details/related-products";
import { initialOrderQuantity } from "src/redux/features/cartSlice";
import { handleModalShow } from "src/redux/features/productSlice";
import productsData from "@data/products";
// internal

export default function ShopDetailsMainArea({ id }) {
  const product = productsData.find((item) => item._id === id);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initialOrderQuantity());
  }, [dispatch]);
  // remove backdrop
  useLayoutEffect(() => {
    dispatch(handleModalShow())
  }, [dispatch, router]);
  // decide what to render
  let content = null;

  if (!product) {
    content = <ErrorMessage message="Product not found" />;
  } else {
    content = (
      <>
        <ProductDetailsBreadcrumb title={product.title} />
        <ProductDetailsArea product={product} />
        <ProductDetailsTabArea product={product} />
        <RelatedProducts id={product._id} category={product.category} />
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
