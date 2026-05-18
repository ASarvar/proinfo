import { notFound } from "next/navigation";
import ShopMainArea from "@components/shop/shop-main-area";
import { getPublicCategories, getPublicProducts } from "@lib/admin-content";
import { Language } from "@prisma/client";

const localeToLang = (locale = "ru") => {
  if (locale === "uz") return Language.UZ;
  if (locale === "en") return Language.EN;
  return Language.RU;
};

export async function generateStaticParams() {
  try {
    const categories = await getPublicCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const categories = await getPublicCategories();
    const category = categories.find((c) => c.slug === slug);
    if (category) {
      return { title: `${category.title} - Товары категории - ProInfo.uz` };
    }
  } catch {}
  return { title: "Категория не найдена - ProInfo.uz" };
}

export default async function CategorySlugProductsPage({ params }) {
  const { locale, slug } = await params;
  const lang = localeToLang(locale);

  const [categories, products] = await Promise.all([
    getPublicCategories(lang),
    getPublicProducts(lang),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  return (
    <ShopMainArea
      Category={slug}
      locale={locale}
      categoryName={category.title}
      initialProducts={products}
      initialCategories={categories}
    />
  );
}