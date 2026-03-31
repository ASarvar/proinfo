import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import BasicPageContent from "@components/common/basic-page-content";

export const metadata = {
  title: "Фото - ProInfo.uz",
};

export default function SupportPhotoPage() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <BasicPageContent
        title="Фото"
        description="Раздел фото-галерей проектов, оборудования и внедрений ProInfo."
      />
      <Footer />
    </Wrapper>
  );
}