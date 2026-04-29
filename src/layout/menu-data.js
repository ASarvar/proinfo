import { getCategoryGroups } from "@data/catalog-categories";
import productsData from "@data/products";
import { getProductsByCategorySlug } from "@utils/catalog-map";

const buildProductMegaCatalog = (t, locale) => {
  const mainCategories = getCategoryGroups().map((group) => {
    // Each group maps to exactly one top-level category
    const topCat = group.categories[0];
    if (!topCat) return null;

    const children = topCat.children || [];

    // Subcategories = children of the top-level category.
    // For standalone categories (no children), use the top-level itself as the only entry.
    const subcategories = children.length > 0
      ? children.map((child) => ({
          slug: child.slug,
          title: child.name,
          link: `/${locale}/category/${child.slug}/products`,
          products: getProductsByCategorySlug(productsData, child.slug),
        }))
      : [{
          slug: topCat.slug,
          title: topCat.name,
          link: `/${locale}/category/${topCat.slug}/products`,
          products: getProductsByCategorySlug(productsData, topCat.slug),
        }];

    return {
      slug: group.key,
      title: group.name,
      link: `/${locale}/category/${topCat.slug}`,
      subcategories,
    };
  }).filter(Boolean);

  return { mainCategories };
};

const getMenuData = (t, locale) => [
  {
    id: 1,
    title: t("nav.products"),
    link: `/${locale}/products`,
    megaMenu: true,
    hasDropdown: true,
    megaCatalog: buildProductMegaCatalog(t, locale),
    submenus: getCategoryGroups().map((group) => {
      const topCat = group.categories[0];
      const children = topCat?.children || [];
      return {
        title: group.name,
        link: `/${locale}/category/${topCat?.slug || ""}`,
        hasDropdown: children.length > 0,
        submenus: children.map((child) => ({
          title: child.name,
          link: `/${locale}/category/${child.slug}/products`,
        })),
      };
    }),
  },
  {
    id: 2,
    title: t("nav.directions"),
    link: `/${locale}/directions`,
  },
  {
    id: 3,
    title: t("nav.support"),
    link: `/${locale}/support`,
    hasDropdown: true,
    submenus: [
      {
        title: t("nav.faq"),
        link: `/${locale}/support/faq`,
      },
      {
        title: t("nav.blog"),
        link: `/${locale}/support/blog`,
      },
      {
        title: t("nav.video"),
        link: `/${locale}/support/video`,
      },
      {
        title: t("nav.photo"),
        link: `/${locale}/support/photo`,
      },
      {
        title: t("nav.download"),
        link: `/${locale}/support/download`,
      },
    ],
  },
  {
    id: 4,
    title: t("nav.about"),
    link: `/${locale}/about`,
  },
  {
    id: 5,
    title: t("nav.contact"),
    link: `/${locale}/contact`,
  },
];

export default getMenuData;
