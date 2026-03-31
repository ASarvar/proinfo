import { getCategoryBySlug } from "@data/catalog-categories";

export const categorySlugToLegacyCategories = {
  "rfid-tags-cards": ["RFID метки и карты"],
  readers: ["Считыватели"],
  "anti-theft-systems": ["Антикражные системы"],
  "issue-stations": ["Станции выдачи"],
  "return-stations": ["Станции возврата"],
  "reservation-stations": ["Станции бронирования"],
  "information-systems": ["Информационные системы"],
  microsoft: ["Microsoft"],
  printers: ["Принтеры"],
  consumables: ["Расходники"],
  computers: ["Компьютеры"],
  tablets: ["Планшеты"],
  infokiosks: ["Инфокиоски"],
  "touch-panels": ["Сенсорные панели"],
  shelving: ["Стеллажи"],
  wardrobe: ["Гардероб"],
  recognition: ["Распознавание"],
  vending: ["Вендинг"],
  sterilizers: ["Стерилизаторы"],
};

const getMappedCategoriesBySlug = (slug) => {
  let currentSlug = slug;

  while (currentSlug) {
    const mappedCategories = categorySlugToLegacyCategories[currentSlug];
    if (mappedCategories?.length) {
      return mappedCategories;
    }

    const currentCategory = getCategoryBySlug(currentSlug);
    currentSlug = currentCategory?.parentSlug;
  }

  return null;
};

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
  if (product?.categorySlug) {
    return matchesSlugHierarchy(product.categorySlug, slug);
  }

  const mappedCategories = getMappedCategoriesBySlug(slug);
  if (mappedCategories?.length) {
    return mappedCategories.includes(product.category);
  }

  return (
    product.category.toLowerCase().replace("&", "").split(" ").join("-") === slug
  );
};

export const getProductsByCategorySlug = (products, slug) =>
  products.filter((product) => matchesCategorySlug(product, slug));
