import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import { catalogCategories } from "@data/catalog-categories";

export const metadata = {
  title: "Admin Categories - ProInfo.uz",
};

export default async function AdminCategoriesPage({ params }) {
  const { locale } = await params;

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <h1 className="mb-0">Категории</h1>
            <Link href={`/${locale}/admin`} className="tp-btn-border">
              Назад в админ
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Slug</th>
                  <th>Parent</th>
                </tr>
              </thead>
              <tbody>
                {catalogCategories.map((category) => (
                  <tr key={category.slug}>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>{category.parentSlug || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}