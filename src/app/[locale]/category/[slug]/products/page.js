import { notFound } from "next/navigation";
import ShopMainArea from "@components/shop/shop-main-area";
import {
  categoryGroups,
  getTopLevelCategories,
  getCategoryBySlug,
} from "@data/catalog-categories";

export async function generateStaticParams() {
  return getTopLevelCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Категория не найдена - ProInfo.uz",
    };
  }

  return {
    title: `${category.name} - Товары категории - ProInfo.uz`,
  };
}

export default async function CategorySlugProductsPage({ params }) {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const group = categoryGroups.find((item) => item.key === category.groupKey);

  return (
    <ShopMainArea
      Category={slug}
      locale={locale}
      groupName={group?.name}
      categoryName={category.name}
    />
  );
}