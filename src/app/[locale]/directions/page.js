import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import BasicPageContent from "@components/common/basic-page-content";

export const metadata = {
  title: "Направления - ProInfo.uz",
};

export default function DirectionsPage() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <BasicPageContent
        title="Направления"
        description="Раздел направлений внедрения библиотечной автоматизации. На следующем этапе добавим отдельные страницы по каждому направлению."
      />
      <Footer />
    </Wrapper>
  );
}