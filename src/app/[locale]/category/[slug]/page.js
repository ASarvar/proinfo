import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import {
  categoryGroups,
  getTopLevelCategories,
  getCategoryBySlug,
} from "@data/catalog-categories";

export async function generateStaticParams() {
  return getTopLevelCategories().map((category) => ({ slug: category.slug }));
}

export const metadata = {
  title: "Категория - ProInfo.uz",
};

export default async function CategorySlugPage({ params }) {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const group = categoryGroups.find((item) => item.key === category.groupKey);
  const relatedCategories = getTopLevelCategories().filter(
    (item) => item.groupKey === category.groupKey && item.slug !== category.slug
  );

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="text-center mb-50">
            <h1>{category.name}</h1>
            <p>
              Направление: <strong>{group?.name || "Категории"}</strong>
            </p>
          </div>

          <div className="d-flex justify-content-center flex-wrap gap-3 mb-40">
            <Link href={`/${locale}/category/${slug}/products`} className="tp-btn-border">
              Открыть товары категории
            </Link>
            <Link href={`/${locale}/category`} className="tp-btn-border">
              Назад к категориям
            </Link>
          </div>

          {relatedCategories.length > 0 && (
            <div className="text-center">
              <h4 className="mb-20">Другие категории этого направления</h4>
              <div className="d-flex justify-content-center flex-wrap gap-2">
                {relatedCategories.map((item) => (
                  <Link key={item.slug} href={`/${locale}/category/${item.slug}`} className="tp-btn-border">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}