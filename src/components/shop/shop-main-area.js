'use client';
// internal
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import ShopCta from "@components/cta";
import Footer from "@layout/footer";
import ShopBreadcrumb from "@components/common/breadcrumb/shop-breadcrumb";
import ShopArea from "@components/shop/shop-area";
import {
  getCategoryBySlug,
  productsWithResolvedCategories,
  getNormalizedProductCategorySlug,
} from "@data/catalog-categories";

const belongsToCategory = (product, selectedSlug) => {
  if (!selectedSlug) {
    return true;
  }

  let currentSlug = getNormalizedProductCategorySlug(product);

  while (currentSlug) {
    if (currentSlug === selectedSlug) {
      return true;
    }

    const currentCategory = getCategoryBySlug(currentSlug);
    currentSlug = currentCategory?.parentSlug;
  }

  return false;
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
  const products = productsWithResolvedCategories;
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
