import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import BasicPageContent from "@components/common/basic-page-content";
import { getSupportMediaCounts } from "@lib/content-api";

export const metadata = {
  title: "Поддержка - ProInfo.uz",
};

export default async function SupportPage({ params }) {
  const { locale } = await params;
  const counts = await getSupportMediaCounts(locale);

  return (
    <Wrapper>
      <Header style_2={true} />
      <BasicPageContent
        title="Поддержка"
        description="Выберите раздел поддержки: FAQ, Блог, Видео, Фото и Скачать."
        links={[
          { label: "FAQ", href: `/${locale}/support/faq` },
          { label: `Блог (${counts.blog})`, href: `/${locale}/support/blog` },
          { label: `Видео (${counts.video})`, href: `/${locale}/support/video` },
          { label: `Фото (${counts.photo})`, href: `/${locale}/support/photo` },
          { label: `Скачать (${counts.download})`, href: `/${locale}/support/download` },
        ]}
      />
      <Footer />
    </Wrapper>
  );
}