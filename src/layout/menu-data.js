const getMenuData = (t, locale) => [
  {
    id: 1,
    title: t("nav.home"),
    link: `/${locale}`,
  },
  {
    id: 2,
    title: t("nav.about"),
    link: `/${locale}/about`,
  },
  {
    id: 3,
    title: t("nav.products"),
    link: `/${locale}/products`,
  },
  {
    id: 4,
    title: t("nav.contact"),
    link: `/${locale}/contact`,
  },
];

export default getMenuData;
