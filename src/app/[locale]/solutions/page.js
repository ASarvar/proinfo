import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Решения - ProInfo.uz",
};

// Images and slugs are shared — only text differs per locale
const SOLUTIONS_BASE = [
  { slug: "libraries",  imageUrl: "/assets/img/solutions/libraries.jpg" },
  { slug: "archives",   imageUrl: "/assets/img/solutions/archives.jpg" },
  { slug: "educational",imageUrl: "/assets/img/solutions/educational.jpg" },
  { slug: "commercial", imageUrl: "/assets/img/solutions/commercial.jpg" },
];

const SOLUTIONS_TEXT = {
  ru: {
    heading:     "Что мы предлагаем для автоматизации",
    subheading:  "Комплексные решения для библиотек, архивов, образовательных и коммерческих учреждений на основе RFID-технологий",
    more:        "Подробнее →",
    libraries:   { title: "Библиотеки",                  description: "RFID-решения для автоматизации библиотек: учёт фондов, самообслуживание читателей, контроль доступа и управление книговыдачей." },
    archives:    { title: "Архивы",                       description: "Автоматизация архивного хранения с применением RFID: быстрый поиск дел, контроль движения документов и инвентаризация." },
    educational: { title: "Образовательные учреждения",   description: "Комплексные решения для школ и университетов: RFID-пропуски, учёт имущества, умные библиотеки и системы контроля посещаемости." },
    commercial:  { title: "Коммерческие учреждения",      description: "RFID-решения для розничной торговли и бизнеса: инвентаризация активов, управление складом и защита товаров от хищений." },
  },
  uz: {
    heading:     "Avtomatlashtirish uchun nima taklif qilamiz",
    subheading:  "Kutubxonalar, arxivlar, ta'lim va tijorat muassasalari uchun RFID texnologiyasiga asoslangan kompleks yechimlar",
    more:        "Batafsil →",
    libraries:   { title: "Kutubxonalar",       description: "Kutubxonalarni avtomatlashtirish uchun RFID yechimlari: fond hisobi, o'z-o'ziga xizmat, kirish nazorati." },
    archives:    { title: "Arxivlar",            description: "RFID yordamida arxiv saqlashni avtomatlashtirish: ishlarni tezkor qidirish, hujjatlar harakatini nazorat qilish." },
    educational: { title: "Ta'lim muassasalari", description: "Maktab va universitetlar uchun kompleks yechimlar: RFID propusklar, mulk hisobi, aqlli kutubxonalar." },
    commercial:  { title: "Tijorat muassasalari",description: "Chakana savdo va biznes uchun RFID yechimlari: aktiv inventarizatsiyasi, ombor boshqaruvi, o'g'irlikdan himoya." },
  },
  en: {
    heading:     "What we offer for automation",
    subheading:  "Comprehensive RFID-based solutions for libraries, archives, educational and commercial institutions",
    more:        "Learn more →",
    libraries:   { title: "Libraries",                description: "RFID solutions for library automation: collection management, self-service, access control and circulation management." },
    archives:    { title: "Archives",                 description: "Archive storage automation using RFID: quick file search, document movement control and inventory management." },
    educational: { title: "Educational Institutions", description: "Comprehensive solutions for schools and universities: RFID passes, asset tracking, smart libraries and attendance control." },
    commercial:  { title: "Commercial Institutions",  description: "RFID solutions for retail and business: asset inventory, warehouse management and anti-theft protection." },
  },
};

export default async function SolutionsPage({ params }) {
  const { locale } = await params;
  const t = SOLUTIONS_TEXT[locale] ?? SOLUTIONS_TEXT.ru;

  const directions = SOLUTIONS_BASE.map((base) => ({
    ...base,
    ...(t[base.slug] ?? {}),
  }));

  return (
    <Wrapper>
      <Header style_2={true} />

      <style>{`
        .sol-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .sol-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.16);
        }
        .sol-card .sol-img {
          width: 100%;
          aspect-ratio: 16/9;
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }
        .sol-card .sol-img img {
          transition: transform 0.4s ease !important;
        }
        .sol-card:hover .sol-img img {
          transform: scale(1.06) !important;
        }
        .sol-card .sol-more {
          color: #F50963;
          font-weight: 600;
          font-size: 14px;
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s ease;
        }
        .sol-card:hover .sol-more {
          gap: 10px;
        }
      `}</style>

      {/* Dark header */}
      <section style={{ background: "linear-gradient(135deg, #0f1626 0%, #1a2540 100%)", padding: "80px 0 60px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 text-center">
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(245,9,99,0.15)",
                  color: "#F50963",
                  borderRadius: 999,
                  padding: "6px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                ProInfo
              </span>
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(26px, 4vw, 44px)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: 20,
                }}
              >
                {t.heading}
              </h1>
              <p style={{ color: "#a0aec0", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
                {t.subheading}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section style={{ background: "#f7f9fc", padding: "60px 0 80px" }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {directions.map((dir) => (
              <div key={dir.slug} className="col-xl-3 col-lg-4 col-md-6 d-flex">
                <SolutionCard direction={dir} more={t.more} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </Wrapper>
  );
}

function SolutionCard({ direction, more, locale }) {
  return (
    <Link
      href={`/${locale}/solutions/${direction.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "flex", width: "100%" }}
    >
      <div className="sol-card">
        <div className="sol-img">
          <Image src={direction.imageUrl} alt={direction.title} fill style={{ objectFit: "cover" }} />
        </div>
        <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a2540", marginBottom: 10, lineHeight: 1.3 }}>
            {direction.title}
          </h3>
          {direction.description && (
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
              {direction.description}
            </p>
          )}
          <span className="sol-more">{more}</span>
        </div>
      </div>
    </Link>
  );
}
