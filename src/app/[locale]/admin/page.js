import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";

export const metadata = {
  title: "Admin - ProInfo.uz",
};

export default async function AdminDashboardPage({ params }) {
  const { locale } = await params;

  const modules = [
    {
      title: "Категории",
      description: "Управление каталогом категорий и подкатегорий.",
      href: `/${locale}/admin/categories`,
    },
    {
      title: "Товары",
      description: "Управление товарами, ценами, изображениями и характеристиками.",
      href: `/${locale}/admin/products`,
    },
    {
      title: "Контент",
      description: "Новости, видео, фото, файлы для скачивания и FAQ.",
      href: `/${locale}/admin/content`,
    },
  ];

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="text-center mb-50">
            <h1>Админ-панель</h1>
            <p>Первый этап структуры управления контентом ProInfo.uz.</p>
          </div>
          <div className="row">
            {modules.map((module) => (
              <div className="col-lg-4" key={module.href}>
                <div className="mb-30 p-4 border rounded h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h4>{module.title}</h4>
                    <p>{module.description}</p>
                  </div>
                  <Link href={module.href} className="tp-btn-border mt-10">
                    Открыть
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}