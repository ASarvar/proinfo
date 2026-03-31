export const categoryGroups = [
  { key: "rfid", name: "RFID решения" },
  { key: "automation", name: "Автоматизация библиотек" },
  { key: "software", name: "Программное обеспечение" },
  { key: "equipment", name: "Оборудование" },
  { key: "interactive", name: "Интерактивные системы" },
  { key: "infrastructure", name: "Мебель и инфраструктура" },
  { key: "innovation", name: "Инновационные решения" },
];

export const catalogCategories = [
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