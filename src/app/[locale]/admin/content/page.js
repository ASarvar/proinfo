import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";

export const metadata = {
  title: "Admin Content - ProInfo.uz",
};

export default async function AdminContentPage({ params }) {
  const { locale } = await params;

  const modules = ["Новости", "Блог", "Видео", "Фото", "Скачать", "FAQ"];

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <h1 className="mb-0">Контент</h1>
            <Link href={`/${locale}/admin`} className="tp-btn-border">
              Назад в админ
            </Link>
          </div>

          <div className="row">
            {modules.map((module) => (
              <div className="col-lg-4" key={module}>
                <div className="mb-30 p-4 border rounded h-100">
                  <h5>{module}</h5>
                  <p className="mb-0">Модуль готов к подключению CRUD в следующем шаге.</p>
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