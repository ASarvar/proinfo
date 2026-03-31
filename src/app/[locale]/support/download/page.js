import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import SupportMediaGrid from "@components/common/support-media-grid";
import { getSupportMediaList, mediaTypes } from "@lib/content-api";

export const metadata = {
  title: "Скачать - ProInfo.uz",
};

export default async function SupportDownloadPage({ params, searchParams }) {
  const { locale } = await params;
  const query = (await searchParams) || {};
  const selectedTag = query.tag || "all";
  const selectedMonth = query.month || "all";

  const items = await getSupportMediaList({
    locale,
    type: mediaTypes.download,
    tag: selectedTag,
    month: selectedMonth,
  });
  const tags = [...new Set(items.flatMap((item) => item.tags || []))].sort((a, b) =>
    a.localeCompare(b, "ru")
  );
  const months = [...new Set(items.map((item) => `${item.publishedAt || ""}`.slice(0, 7)))].sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <Wrapper>
      <Header style_2={true} />
      <SupportMediaGrid
        title="Скачать"
        description="Раздел для каталогов, инструкций, технической документации и презентаций."
        items={items}
        basePath={`/${locale}/support/download`}
        tags={tags}
        months={months}
        selectedTag={selectedTag}
        selectedMonth={selectedMonth}
      />
      <Footer />
    </Wrapper>
  );
}