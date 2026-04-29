import products from "@data/products";

export const categoryGroups = [
  { key: "library-rfid", name: "Библиотечный RFID" },
  { key: "software", name: "Программное обеспечение" },
  { key: "face-recognition", name: "Распознавание лиц" },
  { key: "interactive", name: "Интерактивные панели и киоски" },
  { key: "infrastructure", name: "Мебель и инфраструктура" },
  { key: "innovation", name: "Инновационные решения" },
  { key: "printers", name: "Принтеры" },
  { key: "commercial-rfid", name: "Коммерческий RFID" },
];

const seedCategories = [
  // Библиотечный RFID
  { slug: "library-rfid", name: "Библиотечный RFID", groupKey: "library-rfid" },
  { slug: "rfid-tags-cards", name: "RFID метки и карты", groupKey: "library-rfid", parentSlug: "library-rfid" },
  { slug: "readers", name: "Считыватели", groupKey: "library-rfid", parentSlug: "library-rfid" },
  { slug: "security-systems", name: "Системы безопасности", groupKey: "library-rfid", parentSlug: "library-rfid" },
  { slug: "self-service-terminals", name: "Терминалы самообслуживания", groupKey: "library-rfid", parentSlug: "library-rfid" },

  // Программное обеспечение
  { slug: "software", name: "Программное обеспечение", groupKey: "software" },
  { slug: "library-systems", name: "Библиотечные системы", groupKey: "software", parentSlug: "software" },
  { slug: "microsoft-products", name: "Продукты Microsoft", groupKey: "software", parentSlug: "software" },

  // Распознавание лиц
  { slug: "face-recognition", name: "Распознавание лиц", groupKey: "face-recognition" },

  // Интерактивные панели и киоски
  { slug: "interactive-panels-kiosks", name: "Интерактивные панели и киоски", groupKey: "interactive" },
  { slug: "infokiosks", name: "Инфокиоски", groupKey: "interactive", parentSlug: "interactive-panels-kiosks" },
  { slug: "touch-panels", name: "Сенсорные панели", groupKey: "interactive", parentSlug: "interactive-panels-kiosks" },

  // Мебель и инфраструктура
  { slug: "furniture-infrastructure", name: "Мебель и инфраструктура", groupKey: "infrastructure" },

  // Инновационные решения
  { slug: "innovative-solutions", name: "Инновационные решения", groupKey: "innovation" },

  // Принтеры
  { slug: "printers", name: "Принтеры", groupKey: "printers" },
  { slug: "card-printers", name: "Карт-принтеры", groupKey: "printers", parentSlug: "printers" },
  { slug: "thermal-printers", name: "Термопринтеры", groupKey: "printers", parentSlug: "printers" },

  // Коммерческий RFID
  { slug: "commercial-rfid", name: "Коммерческий RFID", groupKey: "commercial-rfid" },
  { slug: "fixed-assets-inventory", name: "Инвентаризация основных средств", groupKey: "commercial-rfid", parentSlug: "commercial-rfid" },
];

const groupKeySet = new Set(categoryGroups.map((group) => group.key));
const seedBySlug = new Map(seedCategories.map((category) => [category.slug, category]));

const slugifyCategory = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getNormalizedProductCategorySlug = (product) => {
  const explicitSlug = (product?.categorySlug || "").trim();
  if (explicitSlug) {
    return explicitSlug;
  }

  return slugifyCategory(product?.category || "");
};

export const withResolvedProductCategory = (product) => {
  const normalizedSlug = getNormalizedProductCategorySlug(product);
  const seededCategory = seedBySlug.get(normalizedSlug);

  return {
    ...product,
    categorySlug: normalizedSlug,
    category: product?.category || seededCategory?.name || normalizedSlug,
  };
};

const buildCatalogCategories = () => {
  const categoryMap = new Map(seedCategories.map((category) => [category.slug, { ...category }]));

  products.forEach((product) => {
    const slug = getNormalizedProductCategorySlug(product);
    if (!slug) {
      return;
    }

    const seededCategory = seedBySlug.get(slug);
    const existingCategory = categoryMap.get(slug);

    const nextCategory = {
      slug,
      name: seededCategory?.name || product.category || existingCategory?.name || slug,
      groupKey: groupKeySet.has(seededCategory?.groupKey)
        ? seededCategory.groupKey
        : existingCategory?.groupKey || "software",
      parentSlug: seededCategory?.parentSlug || existingCategory?.parentSlug,
    };

    categoryMap.set(slug, nextCategory);
  });

  return Array.from(categoryMap.values());
};

export const catalogCategories = buildCatalogCategories();

export const productsWithResolvedCategories = products.map(withResolvedProductCategory);

export const getCategoryBySlug = (slug) =>
  catalogCategories.find((category) => category.slug === slug);

export const getTopLevelCategories = () =>
  catalogCategories.filter((category) => !category.parentSlug);

export const getChildCategories = (parentSlug) =>
  catalogCategories.filter((category) => category.parentSlug === parentSlug);

export const getCategoryGroups = () => {
  const topLevel = getTopLevelCategories();

  return categoryGroups
    .map((group) => {
      const categories = topLevel
        .filter((category) => category.groupKey === group.key)
        .map((category) => ({
          ...category,
          children: getChildCategories(category.slug),
        }));

      return {
        ...group,
        categories,
      };
    })
    .filter((group) => group.categories.length > 0);
};