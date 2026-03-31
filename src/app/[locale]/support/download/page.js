import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import BasicPageContent from "@components/common/basic-page-content";

export const metadata = {
  title: "Скачать - ProInfo.uz",
};

export default function SupportDownloadPage() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <BasicPageContent
        title="Скачать"
        description="Раздел для каталогов, инструкций, технической документации и презентаций."
      />
      <Footer />
    </Wrapper>
  );
}