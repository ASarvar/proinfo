import products from "@data/products";

export const categoryGroups = [
  { key: "rfid", name: "RFID решения" },
  { key: "automation", name: "Автоматизация библиотек" },
  { key: "software", name: "Программное обеспечение" },
  { key: "equipment", name: "Оборудование" },
  { key: "interactive", name: "Интерактивные системы" },
  { key: "infrastructure", name: "Мебель и инфраструктура" },
  { key: "innovation", name: "Инновационные решения" },
];

const seedCategories = [
  { slug: "rfid-tags-cards", name: "RFID метки и карты", groupKey: "rfid" },
  { slug: "readers", name: "Считыватели", groupKey: "rfid" },
  { slug: "anti-theft-systems", name: "Антикражные системы", groupKey: "rfid" },

  { slug: "issue-stations", name: "Станции выдачи", groupKey: "automation" },
  { slug: "return-stations", name: "Станции возврата", groupKey: "automation" },
  { slug: "reservation-stations", name: "Станции бронирования", groupKey: "automation" },

  { slug: "information-systems", name: "Информационные системы", groupKey: "software" },
  { slug: "microsoft", name: "Microsoft", groupKey: "software" },

  { slug: "printers", name: "Принтеры", groupKey: "equipment" },
  { slug: "consumables", name: "Расходники", groupKey: "equipment" },
  { slug: "computers", name: "Компьютеры", groupKey: "equipment" },
  { slug: "tablets", name: "Планшеты", groupKey: "equipment" },

  { slug: "infokiosks", name: "Инфокиоски", groupKey: "interactive" },
  { slug: "touch-panels", name: "Сенсорные панели", groupKey: "interactive" },

  { slug: "shelving", name: "Стеллажи", groupKey: "infrastructure" },
  { slug: "wardrobe", name: "Гардероб", groupKey: "infrastructure" },

  { slug: "recognition", name: "Распознавание", groupKey: "innovation" },
  { slug: "vending", name: "Вендинг", groupKey: "innovation" },
  { slug: "sterilizers", name: "Стерилизаторы", groupKey: "innovation" },
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