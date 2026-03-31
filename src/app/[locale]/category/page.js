import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import { getCategoryGroups } from "@data/catalog-categories";

export const metadata = {
  title: "Категории - ProInfo.uz",
};

export default async function CategoryPage({ params }) {
  const { locale } = await params;
  const categoryGroups = getCategoryGroups();

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="text-center mb-50">
            <h1>Категории оборудования</h1>
            <p>Выберите направление и категорию для просмотра оборудования.</p>
          </div>

          <div className="row g-4">
            {categoryGroups.map((group) => (
              <div className="col-xl-6" key={group.key}>
                <div className="h-100 p-4 border rounded">
                  <h4 className="mb-20">{group.name}</h4>
                  <ul className="mb-0 ps-3">
                    {group.categories.map((category) => (
                      <li key={category.slug} className="mb-2">
                        <Link href={`/${locale}/category/${category.slug}/products`}>
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-20">
                    <Link href={`/${locale}/category/products`} className="tp-btn-border">
                      Все товары направления
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href={`/${locale}/category/products`} className="tp-btn-border">
              Все товары
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}