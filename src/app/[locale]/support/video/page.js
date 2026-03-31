import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import BasicPageContent from "@components/common/basic-page-content";

export const metadata = {
  title: "Видео - ProInfo.uz",
};

export default function SupportVideoPage() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <BasicPageContent
        title="Видео"
        description="Раздел видео-обзоров, обучающих роликов и кейсов по внедрению библиотечной автоматизации."
      />
      <Footer />
    </Wrapper>
  );
}