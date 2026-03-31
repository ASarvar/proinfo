import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import BasicPageContent from "@components/common/basic-page-content";

export const metadata = {
  title: "Поддержка - ProInfo.uz",
};

export default async function SupportPage({ params }) {
  const { locale } = await params;

  return (
    <Wrapper>
      <Header style_2={true} />
      <BasicPageContent
        title="Поддержка"
        description="Выберите раздел поддержки: FAQ, Блог, Видео, Фото и Скачать."
        links={[
          { label: "FAQ", href: `/${locale}/support/faq` },
          { label: "Блог", href: `/${locale}/support/blog` },
          { label: "Видео", href: `/${locale}/support/video` },
          { label: "Фото", href: `/${locale}/support/photo` },
          { label: "Скачать", href: `/${locale}/support/download` },
        ]}
      />
      <Footer />
    </Wrapper>
  );
}