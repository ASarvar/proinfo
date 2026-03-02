import React from "react";
// internal
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import HeroBanner from "@components/hero-banner";
import ShopCategoryArea from "@components/shop-category/shop-category";
import ShopProducts from "@components/products";
import OfferPopularProduct from "@components/offer-product";
import ShopBanner from "@components/shop-banner";
import ShopFeature from "@components/shop-feature";
import ShopCta from "@components/cta";
import Footer from "@layout/footer";
import FaqArea from "@components/faq/faq-area";

export const metadata = {
  title: "Home - Proinfo",
};

const HomeShop = () => {
  return (
    <Wrapper>
      <Header />
      <HeroBanner />
      <ShopCategoryArea />
      <ShopProducts />
      {/* <OfferPopularProduct /> */}
      < FaqArea />
      {/* <ShopBanner /> */}
      {/* <ShopFeature /> */}
      {/* <ShopCta /> */}
      <Footer />
    </Wrapper>
  );
};

export default HomeShop;
