'use client';
// internal
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import ShopCta from "@components/cta";
import Footer from "@layout/footer";
import ShopBreadcrumb from "@components/common/breadcrumb/shop-breadcrumb";
import ShopArea from "@components/shop/shop-area";
import productsData from "@data/products";
import { getCategoryBySlug } from "@data/catalog-categories";

const belongsToCategory = (product, selectedSlug) => {
  if (!selectedSlug) {
    return true;
  }

  // Preferred path: use normalized category slug from product data.
  if (product?.categorySlug) {
    let currentSlug = product.categorySlug;

    while (currentSlug) {
      if (currentSlug === selectedSlug) {
        return true;
      }

      const currentCategory = getCategoryBySlug(currentSlug);
      currentSlug = currentCategory?.parentSlug;
    }

    return false;
  }

  // Fallback for legacy data without categorySlug.
  return (
    product.category?.toLowerCase().replace("&", "").split(" ").join("-") === selectedSlug
  );
};

export default function ShopMainArea({
  Category,
  category,
  brand,
  priceMin,
  max,
  priceMax,
  color,
  locale,
  groupName,
  categoryName,
}) {
  // Use mock data instead of API
  const products = productsData;
  let all_products = products;
  let product_items = all_products;

  if (Category) {
    product_items = product_items.filter((product) => belongsToCategory(product, Category));
  }
  if (category) {
    product_items = product_items.filter((product) => belongsToCategory(product, category));
  }
  if (priceMin || max || priceMax) {
    product_items = product_items.filter((product) => {
      const price = Number(product.price);
      const minPrice = Number(priceMin);
      const maxPrice = Number(max);
      if (!priceMax && priceMin && max) {
        return price >= minPrice && price <= maxPrice;
      }
      if (priceMax) {
        return price >= priceMax;
      }
    });
  }

  const content = (
    <ShopArea
      products={product_items}
      all_products={all_products}
    />
  );

  return (
    <Wrapper>
      <Header style_2={true} />
      <ShopBreadcrumb locale={locale} groupName={groupName} categoryName={categoryName} />
      {content}
      {/* <ShopCta /> */}
      <Footer />
    </Wrapper>
  );
}
