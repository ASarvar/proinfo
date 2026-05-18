import ShopMainArea from "@components/shop/shop-main-area";
import { getPublicProducts } from "@lib/admin-content";
import { Language } from "@prisma/client";

export const metadata = {
  title: "Products - ProInfo",
};

const localeToLang = (locale = "ru") => {
  if (locale === "uz") return Language.UZ;
  if (locale === "en") return Language.EN;
  return Language.RU;
};

export default async function ProductsPage({ params }) {
  const { locale } = await params;
  const products = await getPublicProducts(localeToLang(locale));

  return <ShopMainArea locale={locale} initialProducts={products} />;
}
