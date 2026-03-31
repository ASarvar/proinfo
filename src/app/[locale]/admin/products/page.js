import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import products from "@data/products";

export const metadata = {
  title: "Admin Products - ProInfo.uz",
};

export default async function AdminProductsPage({ params }) {
  const { locale } = await params;

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <h1 className="mb-0">Товары</h1>
            <Link href={`/${locale}/admin`} className="tp-btn-border">
              Назад в админ
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>{product._id}</td>
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