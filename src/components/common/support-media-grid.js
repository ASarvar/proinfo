import Link from "next/link";
import Image from "next/image";

const typeCtaMap = {
  blog: "Читать",
  video: "Смотреть",
  photo: "Открыть",
  download: "Скачать",
};

const typeLabelMap = {
  blog: "Блог",
  video: "Видео",
  photo: "Фото",
  download: "Файлы",
};

const buildFilterHref = (basePath, nextTag, nextMonth) => {
  const params = new URLSearchParams();

  if (nextTag && nextTag !== "all") {
    params.set("tag", nextTag);
  }

  if (nextMonth && nextMonth !== "all") {
    params.set("month", nextMonth);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
};

const SupportMediaGrid = ({
  title,
  description,
  items = [],
  basePath,
  tags = [],
  months = [],
  selectedTag = "all",
  selectedMonth = "all",
}) => {
  return (
    <section className="tp-blog-area pt-120 pb-100 support-media-area">
      <div className="container">
        <div className="row justify-content-center mb-45">
          <div className="col-xl-10 text-center">
            <h1 className="support-media-title">{title}</h1>
            <p className="support-media-description">{description}</p>
          </div>
        </div>

        <div className="support-media-filters mb-35">
          <div className="support-media-filter-group">
            <span className="support-media-filter-label">Тег:</span>
            <Link
              href={buildFilterHref(basePath, "all", selectedMonth)}
              className={`support-media-filter-chip ${selectedTag === "all" ? "active" : ""}`}
            >
              Все
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={buildFilterHref(basePath, tag, selectedMonth)}
                className={`support-media-filter-chip ${selectedTag === tag ? "active" : ""}`}
              >
                {tag}
              </Link>
            ))}
          </div>

          <div className="support-media-filter-group">
            <span className="support-media-filter-label">Период:</span>
            <Link
              href={buildFilterHref(basePath, selectedTag, "all")}
              className={`support-media-filter-chip ${selectedMonth === "all" ? "active" : ""}`}
            >
              Все
            </Link>
            {months.map((month) => (
              <Link
                key={month}
                href={buildFilterHref(basePath, selectedTag, month)}
                className={`support-media-filter-chip ${selectedMonth === month ? "active" : ""}`}
              >
                {month}
              </Link>
            ))}
          </div>
        </div>

        <div className="row">
          {items.map((item) => (
            <div key={item.id} className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <article className="support-media-card h-100">
                <div className="support-media-thumb w-img">
                  <Image src={item.coverImage} alt={item.title} width={416} height={270} />
                </div>
                <div className="support-media-content">
                  <div className="support-media-meta mb-10">
                    <span>{typeLabelMap[item.type] || "Материал"}</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString("ru-RU")}</span>
                    {item.duration && <span className="ml-10">{item.duration}</span>}
                    {item.fileType && item.fileSize && (
                      <span className="ml-10">{item.fileType} • {item.fileSize}</span>
                    )}
                  </div>
                  <h3 className="support-media-card-title mb-10">{item.title}</h3>
                  <p className="support-media-card-text mb-20">{item.excerpt}</p>
                  <Link href={item.href} className="support-media-card-link">
                    {typeCtaMap[item.type] || "Подробнее"}
                  </Link>
                </div>
              </article>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-12">
              <div className="support-media-empty text-center">
                <h4>Материалы скоро появятся</h4>
                <p>Этот раздел пока заполняется. Попробуйте другой раздел поддержки.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SupportMediaGrid;
