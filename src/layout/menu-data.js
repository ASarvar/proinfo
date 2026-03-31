import { getCategoryGroups } from "@data/catalog-categories";
import productsData from "@data/products";
import { getProductsByCategorySlug } from "@utils/catalog-map";

const buildProductMegaCatalog = (t, locale) => {
  const mainCategories = getCategoryGroups().map((group) => {
    const subcategories = group.categories.flatMap((category) => {
      const baseProducts = getProductsByCategorySlug(productsData, category.slug);
      const children = category.children || [];

      const childSubcategories = children.map((child) => {
        const childProducts = getProductsByCategorySlug(productsData, child.slug);
        return {
          slug: child.slug,
          title: child.name,
          link: `/${locale}/category/${child.slug}/products`,
          products: childProducts.length > 0 ? childProducts : baseProducts,
        };
      });

      return [
        {
          slug: category.slug,
          title: category.name,
          link: `/${locale}/category/${category.slug}/products`,
          products: baseProducts,
        },
        ...childSubcategories,
      ];
    });

    return {
      slug: group.key,
      title: group.name,
      link: `/${locale}/category`,
      subcategories,
    };
  });

  return {
    mainCategories,
  };
};

const getMenuData = (t, locale) => [
  {
    id: 1,
    title: t("nav.products"),
    link: `/${locale}/products`,
    megaMenu: true,
    hasDropdown: true,
    megaCatalog: buildProductMegaCatalog(t, locale),
    submenus: getCategoryGroups().map((group) => ({
      title: group.name,
      link: `/${locale}/category`,
      hasDropdown: true,
      submenus: group.categories.map((category) => ({
        title: category.name,
        link: `/${locale}/category/${category.slug}/products`,
        hasDropdown: category.children.length > 0,
        submenus: category.children.map((child) => ({
          title: child.name,
          link: `/${locale}/category/${child.slug}/products`,
        })),
      })),
    })),
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
