import Image from "next/image";
import Link from "next/link";

const typeTitleMap = {
  blog: "Статья",
  video: "Видео",
  photo: "Фотоальбом",
  download: "Файл",
};

const SupportMediaDetail = ({ item, locale }) => {
  return (
    <section className="tp-blog-area pt-120 pb-100 support-media-area">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="support-media-detail-head mb-30">
              <Link
                href={`/${locale}/support/${item.type}`}
                className="support-media-card-link"
              >
                Назад к списку
              </Link>
              <div className="support-media-meta mt-15">
                <span>{typeTitleMap[item.type] || "Материал"}</span>
                <span>
                  {new Date(item.publishedAt).toLocaleDateString("ru-RU")}
                </span>
                {item.duration && <span>{item.duration}</span>}
                {item.fileType && item.fileSize && (
                  <span>
                    {item.fileType} • {item.fileSize}
                  </span>
                )}
              </div>
              <h1 className="support-media-title mt-20">{item.title}</h1>
            </div>

            <div className="support-media-detail-cover mb-30">
              <Image
                src={item.coverImage}
                alt={item.title}
                width={1100}
                height={620}
                priority
              />
            </div>

            <div className="support-media-detail-body mb-35">
              <p>{item.content || item.excerpt}</p>
            </div>

            {item.type === "photo" &&
              Array.isArray(item.gallery) &&
              item.gallery.length > 0 && (
                <div className="row">
                  {item.gallery.map((imagePath, index) => (
                    <div
                      key={`${imagePath}-${index}`}
                      className="col-lg-4 col-md-6 mb-20"
                    >
                      <div className="support-media-detail-gallery-item">
                        <Image
                          src={imagePath}
                          alt={`${item.title} ${index + 1}`}
                          width={360}
                          height={240}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {item.type === "video" && item.sourceUrl && (
              <div className="support-media-detail-cta">
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tp-btn-border"
                >
                  Открыть источник видео
                </a>
              </div>
            )}

            {item.type === "download" && item.downloadUrl && (
              <div className="support-media-detail-cta">
                <a href={item.downloadUrl} className="tp-btn-border" download>
                  Скачать файл
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportMediaDetail;
