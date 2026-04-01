import {
  getCategoryBySlug,
  getNormalizedProductCategorySlug,
} from "@data/catalog-categories";

const matchesSlugHierarchy = (productSlug, targetSlug) => {
  let currentSlug = productSlug;

  while (currentSlug) {
    if (currentSlug === targetSlug) {
      return true;
    }

    const currentCategory = getCategoryBySlug(currentSlug);
    currentSlug = currentCategory?.parentSlug;
  }

  return false;
};

export const matchesCategorySlug = (product, slug) => {
  const productSlug = getNormalizedProductCategorySlug(product);
  return matchesSlugHierarchy(productSlug, slug);
};

export const getProductsByCategorySlug = (products, slug) =>
  products.filter((product) => matchesCategorySlug(product, slug));
