
import ShopDetailsMainArea from "@components/product-details/product-details-area-main";


export const metadata = {
  title: "Product Details - ProInfo",
};

const ProductDetailsPage = async ({ params }) => {
  const { id, locale } = await params;
  return <ShopDetailsMainArea id={id} locale={locale} />;
};

export default ProductDetailsPage;
