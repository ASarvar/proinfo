import ShopMainArea from "@components/shop/shop-main-area";

export const metadata = {
  title: "Products - ProInfo",
};

export default async function ProductsPage({ params }) {
  const { locale } = await params;

  return <ShopMainArea locale={locale} />;
}
