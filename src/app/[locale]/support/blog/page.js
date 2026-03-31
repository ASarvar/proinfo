import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import BasicPageContent from "@components/common/basic-page-content";

export const metadata = {
  title: "Блог - ProInfo.uz",
};

export default function SupportBlogPage() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <BasicPageContent
        title="Блог"
        description="Раздел новостей и экспертных материалов ProInfo. На следующем этапе подключим CMS-данные и пагинацию."
      />
      <Footer />
    </Wrapper>
  );
}