import productsData from "@data/products";
import { getProductsByCategorySlug } from "@utils/catalog-map";

// categories: array of DB category objects { slug, title, parentSlug }
const buildProductMegaCatalog = (t, locale, categories) => {
  const topLevel = categories.filter((c) => !c.parentSlug);
  const mainCategories = topLevel.map((parent) => {
    const children = categories.filter((c) => c.parentSlug === parent.slug);
    const subcategories = children.length > 0
      ? children.map((child) => ({
          slug: child.slug,
          title: child.title || child.slug,
          link: `/${locale}/category/${child.slug}/products`,
          products: getProductsByCategorySlug(productsData, child.slug),
        }))
      : [{
          slug: parent.slug,
          title: parent.title || parent.slug,
          link: `/${locale}/category/${parent.slug}/products`,
          products: getProductsByCategorySlug(productsData, parent.slug),
        }];
    return {
      slug: parent.slug,
      title: parent.title || parent.slug,
      link: `/${locale}/category/${parent.slug}`,
      subcategories,
    };
  });
  return { mainCategories };
};

const getMenuData = (t, locale, categories = []) => [
  {
    id: 1,
    title: t("nav.products"),
    link: `/${locale}/products`,
    megaMenu: true,
    hasDropdown: true,
    megaCatalog: buildProductMegaCatalog(t, locale, categories),
    submenus: categories.filter((c) => !c.parentSlug).map((parent) => {
      const children = categories.filter((c) => c.parentSlug === parent.slug);
      return {
        title: parent.title || parent.slug,
        link: `/${locale}/category/${parent.slug}`,
        hasDropdown: children.length > 0,
        submenus: children.map((child) => ({
          title: child.title || child.slug,
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
