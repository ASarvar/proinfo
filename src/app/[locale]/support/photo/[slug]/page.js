import { notFound } from "next/navigation";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import SupportMediaDetail from "@components/common/support-media-detail";
import { getSupportMediaDetail, mediaTypes } from "@lib/content-api";

export const metadata = {
  title: "Фотоальбом - ProInfo.uz",
};

export default async function SupportPhotoDetailPage({ params }) {
  const { locale, slug } = await params;
  const item = await getSupportMediaDetail({ locale, type: mediaTypes.photo, slug });

  if (!item) {
    notFound();
  }

  return (
    <Wrapper>
      <Header style_2={true} />
      <SupportMediaDetail item={item} locale={locale} />
      <Footer />
    </Wrapper>
  );
}
