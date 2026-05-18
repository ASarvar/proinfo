import { notFound } from "next/navigation";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import Image from "next/image";
import Link from "next/link";
import { getPublicProducts, getDirectionRelatedProductSlugs } from "@lib/admin-content";

// ── Static direction content ────────────────────────────────────────────────

const SOLUTIONS_DATA = {
  libraries: {
    relatedCategorySlugs: ["library-rfid", "rfid-tags-cards", "readers", "security-systems", "self-service-terminals", "library-systems"],
    imageUrl2: "/assets/img/solutions/libraries-2.jpg",
    ru: {
      title: "Библиотеки",
      imageUrl: "/assets/img/solutions/libraries.jpg",
      purposeTitle: "Цель применения RFID для библиотек:",
      purpose: "Современные библиотеки нуждаются в эффективных инструментах управления фондами. RFID-технология позволяет автоматизировать учёт книг, ускорить процессы выдачи и возврата литературы, обеспечить надёжный контроль доступа и предотвратить хищение изданий.",
      solutionTitle: "Решение для библиотек",
      solution: "Наша система включает RFID-метки для каждого издания, стационарные и мобильные считыватели, терминалы самообслуживания для читателей, антикражные ворота и программное обеспечение для интеграции с существующими библиотечными системами.",
      benefitsTitle: "Преимущества:",
      benefits: ["Сокращение времени на инвентаризацию до 10 раз", "Самостоятельная выдача и возврат книг читателями 24/7", "Автоматическое обнаружение книг, расставленных не на свои места", "Интеграция с АБИС (ИРБИС, KOHA, ALEPH и др.)", "Снижение нагрузки на сотрудников библиотеки", "Полный контроль над движением фонда в режиме реального времени"],
    },
    uz: {
      title: "Kutubxonalar",
      imageUrl: "/assets/img/solutions/libraries.jpg",
      purposeTitle: "Kutubxonalarda RFID qo'llashning maqsadi:",
      purpose: "Zamonaviy kutubxonalar fond boshqaruvining samarali vositalariga muhtoj. RFID texnologiyasi kitoblar hisobini avtomatlashtirish, kitob berish va qaytarish jarayonlarini tezlashtirish imkonini beradi.",
      solutionTitle: "Kutubxonalar uchun yechim",
      solution: "Bizning tizimimiz har bir nashriyot uchun RFID teglarni, statsionar va mobil o'quvchilarni, o'z-o'ziga xizmat terminallarini va o'g'irlikka qarshi darvozalarni o'z ichiga oladi.",
      benefitsTitle: "Afzalliklari:",
      benefits: ["Inventarizatsiya vaqtini 10 baravar qisqartirish", "O'quvchilar tomonidan 24/7 kitob berish va qaytarish", "Noto'g'ri joylashtirilgan kitoblarni avtomatik aniqlash", "ABIS tizimlari bilan integratsiya", "Kutubxona xodimlari yuklamasini kamaytirish"],
    },
    en: {
      title: "Libraries",
      imageUrl: "/assets/img/solutions/libraries.jpg",
      purposeTitle: "Purpose of RFID Application for Libraries:",
      purpose: "Modern libraries need effective tools for collection management. RFID technology enables automated book tracking, faster check-out and return processes, reliable access control and theft prevention.",
      solutionTitle: "Library RFID Solution",
      solution: "Our system includes RFID tags for each item, fixed and mobile readers, self-service terminals for patrons, security gates and software for integration with existing library management systems.",
      benefitsTitle: "Benefits:",
      benefits: ["Reduce inventory time by up to 10x", "Self check-out and return available 24/7", "Automatic detection of misshelved items", "Integration with LMS (KOHA, ALEPH, IRBIS, etc.)", "Reduced workload for library staff", "Real-time tracking of the entire collection"],
    },
  },
  archives: {
    relatedCategorySlugs: ["commercial-rfid", "fixed-assets-inventory", "readers"],
    imageUrl2: "/assets/img/solutions/archives-2.jpg",
    ru: {
      title: "Архивы",
      imageUrl: "/assets/img/solutions/archives.jpg",
      purposeTitle: "Цель применения RFID для архивов:",
      purpose: "Архивное хранение требует точного учёта каждого документа и дела. RFID позволяет мгновенно определять местонахождение любого документа, контролировать доступ к архивным материалам и проводить инвентаризацию без физического перемещения документов.",
      solutionTitle: "Решение для архивов",
      solution: "Система включает RFID-метки на папках и делах, стеллажные считыватели, мобильные устройства для поиска, программный модуль управления движением документов и интеграцию с системами электронного документооборота.",
      benefitsTitle: "Преимущества:",
      benefits: ["Мгновенный поиск любого дела или документа", "Контроль доступа к конфиденциальным материалам", "Автоматическая фиксация выдачи и возврата дел", "Инвентаризация без извлечения документов с полок", "Интеграция с СЭД и архивными ИС", "Предотвращение несанкционированного выноса документов"],
    },
    uz: {
      title: "Arxivlar",
      imageUrl: "/assets/img/solutions/archives.jpg",
      purposeTitle: "Arxivlarda RFID qo'llashning maqsadi:",
      purpose: "Arxiv saqlash har bir hujjat va ish uchun aniq hisobni talab qiladi. RFID istalgan hujjatning joylashuvini tezkor aniqlash va arxiv materiallariga kirishni nazorat qilish imkonini beradi.",
      solutionTitle: "Arxivlar uchun yechim",
      solution: "Tizim jildlar va ishlardagi RFID teglarni, tokcha o'quvchilarni, mobil qidirish qurilmalarini va hujjat harakati boshqaruv modulini o'z ichiga oladi.",
      benefitsTitle: "Afzalliklari:",
      benefits: ["Istalgan ish yoki hujjatni tezkor qidirish", "Maxfiy materiallarga kirishni nazorat qilish", "Hujjat berish va qaytarishni avtomatik qayd etish", "Hujjatlarni javondan olmay inventarizatsiya qilish", "SEH tizimlari bilan integratsiya"],
    },
    en: {
      title: "Archives",
      imageUrl: "/assets/img/solutions/archives.jpg",
      purposeTitle: "Purpose of RFID Application for Archives:",
      purpose: "Archive storage requires precise tracking of every document and file. RFID enables instant location of any document, access control to archival materials, and inventory without physically moving documents.",
      solutionTitle: "Archive RFID Solution",
      solution: "The system includes RFID tags on folders and files, shelf readers, mobile search devices, a document movement management module and integration with electronic document management systems.",
      benefitsTitle: "Benefits:",
      benefits: ["Instant search for any file or document", "Access control for confidential materials", "Automatic check-out and return logging", "Inventory without removing documents from shelves", "Integration with EDMS and archival systems", "Prevention of unauthorised document removal"],
    },
  },
  educational: {
    relatedCategorySlugs: ["library-rfid", "rfid-tags-cards", "readers", "security-systems", "self-service-terminals", "library-systems", "interactive-panels-kiosks", "infokiosks", "touch-panels"],
    imageUrl2: "/assets/img/solutions/educational-2.jpg",
    ru: {
      title: "Образовательные учреждения",
      imageUrl: "/assets/img/solutions/educational.jpg",
      purposeTitle: "Цель применения RFID для образовательных учреждений:",
      purpose: "Школы, колледжи и университеты нуждаются в комплексных системах автоматизации: от управления библиотечным фондом до контроля посещаемости студентов и учёта имущества. RFID обеспечивает единую платформу для всех этих задач.",
      solutionTitle: "Решение для образовательных учреждений",
      solution: "Комплексная система охватывает RFID-карты учащихся и преподавателей, турникеты контроля доступа, библиотечную автоматизацию, учёт оборудования и инвентаря, а также системы контроля посещаемости с уведомлением родителей.",
      benefitsTitle: "Преимущества:",
      benefits: ["Единая RFID-карта для всех сервисов (библиотека, доступ, оплата)", "Автоматический учёт посещаемости занятий", "Мгновенные уведомления родителям о приходе/уходе ребёнка", "Полный учёт имущества учреждения", "Умная библиотека с самообслуживанием", "Повышение безопасности территории"],
    },
    uz: {
      title: "Ta'lim muassasalari",
      imageUrl: "/assets/img/solutions/educational.jpg",
      purposeTitle: "Ta'lim muassasalarida RFID qo'llashning maqsadi:",
      purpose: "Maktablar, kollejlar va universitetlar kutubxona fondini boshqarishdan tortib talabalar davomati va mulk hisobigacha kompleks avtomatlashtirish tizimlariga muhtoj.",
      solutionTitle: "Ta'lim muassasalari uchun yechim",
      solution: "Kompleks tizim o'quvchilar va o'qituvchilar uchun RFID kartalarni, kirish nazorati turniketlarini, kutubxona avtomatizatsiyasini va davomat nazorat tizimini o'z ichiga oladi.",
      benefitsTitle: "Afzalliklari:",
      benefits: ["Barcha xizmatlar uchun yagona RFID karta", "Avtomatik davomat hisobi", "Ota-onalarga bolaning kelish/ketishini xabar berish", "Muassasa mulkini to'liq hisobga olish", "O'z-o'ziga xizmat aqlli kutubxona"],
    },
    en: {
      title: "Educational Institutions",
      imageUrl: "/assets/img/solutions/educational.jpg",
      purposeTitle: "Purpose of RFID for Educational Institutions:",
      purpose: "Schools, colleges and universities need comprehensive automation systems: from library collection management to student attendance control and asset tracking. RFID provides a unified platform for all these tasks.",
      solutionTitle: "Educational Institution RFID Solution",
      solution: "The comprehensive system covers RFID cards for students and staff, access control turnstiles, library automation, equipment and inventory tracking, and attendance control with parent notifications.",
      benefitsTitle: "Benefits:",
      benefits: ["Single RFID card for all services (library, access, payment)", "Automatic class attendance tracking", "Instant parent notifications on arrival/departure", "Complete institutional asset tracking", "Smart self-service library", "Enhanced campus security"],
    },
  },
  commercial: {
    relatedCategorySlugs: ["commercial-rfid", "fixed-assets-inventory", "readers", "printers", "card-printers", "thermal-printers", "face-recognition"],
    imageUrl2: "/assets/img/solutions/commercial-2.jpg",
    ru: {
      title: "Коммерческие учреждения",
      imageUrl: "/assets/img/solutions/commercial.jpg",
      purposeTitle: "Цель применения RFID для коммерческих учреждений:",
      purpose: "Розничная торговля и бизнес требуют точного учёта товаров и активов, минимизации потерь от хищений и оптимизации складских операций. RFID-технология трансформирует управление цепочкой поставок и повышает прозрачность бизнес-процессов.",
      solutionTitle: "Решение для коммерческих учреждений",
      solution: "Система включает RFID-маркировку товаров, антикражные системы на выходах, мобильные устройства для инвентаризации, интеграцию с ERP и WMS системами, а также аналитику в реальном времени.",
      benefitsTitle: "Преимущества:",
      benefits: ["Точность инвентаризации до 99%", "Сокращение потерь от хищений на 50–80%", "Ускорение процессов приёмки и отгрузки товаров", "Интеграция с ERP, WMS и кассовыми системами", "Аналитика движения товаров в реальном времени", "Снижение затрат на ручной труд"],
    },
    uz: {
      title: "Tijorat muassasalari",
      imageUrl: "/assets/img/solutions/commercial.jpg",
      purposeTitle: "Tijorat muassasalarida RFID qo'llashning maqsadi:",
      purpose: "Chakana savdo va biznes tovarlar va aktivlarni aniq hisobga olishni, o'g'irlikdan yo'qotishlarni minimallashtirishni va ombor operatsiyalarini optimallashtirish talab qiladi.",
      solutionTitle: "Tijorat muassasalari uchun yechim",
      solution: "Tizim tovarlarni RFID belgilashni, chiqishlardagi o'g'irlikga qarshi tizimlarni, inventarizatsiya uchun mobil qurilmalarni va ERP va WMS tizimlari bilan integratsiyani o'z ichiga oladi.",
      benefitsTitle: "Afzalliklari:",
      benefits: ["99% gacha inventarizatsiya aniqligi", "O'g'irlikdan yo'qotishlarni 50-80% ga kamaytirish", "Tovarlarni qabul qilish va jo'natish jarayonlarini tezlashtirish", "ERP, WMS va kassa tizimlari bilan integratsiya", "Real vaqtda tovar harakati tahlili"],
    },
    en: {
      title: "Commercial Institutions",
      imageUrl: "/assets/img/solutions/commercial.jpg",
      purposeTitle: "Purpose of RFID for Commercial Institutions:",
      purpose: "Retail and business require precise inventory tracking, minimised theft losses and optimised warehouse operations. RFID technology transforms supply chain management and increases business process transparency.",
      solutionTitle: "Commercial RFID Solution",
      solution: "The system includes RFID item tagging, anti-theft systems at exits, mobile devices for stocktaking, integration with ERP and WMS systems, and real-time analytics.",
      benefitsTitle: "Benefits:",
      benefits: ["Inventory accuracy up to 99%", "Reduce theft losses by 50–80%", "Faster receiving and shipping processes", "Integration with ERP, WMS and POS systems", "Real-time goods movement analytics", "Reduced manual labour costs"],
    },
  },
};

// ── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const entry = SOLUTIONS_DATA[slug];
  if (!entry) return { title: "Решения - ProInfo.uz" };
  const dir = entry[locale] ?? entry.ru;
  return { title: `${dir.title} - ProInfo.uz` };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SolutionDetailPage({ params }) {
  const { slug, locale } = await params;

  const entry = SOLUTIONS_DATA[slug];
  if (!entry) notFound();

  const dir = entry[locale] ?? entry.ru;
  const relatedCategorySlugs = entry.relatedCategorySlugs ?? [];
  const imageUrl2 = entry.imageUrl2 ?? dir.imageUrl;

  // Fetch related products: prefer admin-pinned slugs, fall back to category filter
  let relatedProducts = [];
  try {
    const lang = locale === "uz" ? "UZ" : locale === "en" ? "EN" : "RU";
    const allProducts = await getPublicProducts(lang);

    const pinnedSlugs = await getDirectionRelatedProductSlugs(slug);

    if (pinnedSlugs.length > 0) {
      // Show exactly the admin-selected products (preserve selection order)
      const productMap = new Map(allProducts.map((p) => [p.slug, p]));
      relatedProducts = pinnedSlugs.map((s) => productMap.get(s)).filter(Boolean);
    } else if (relatedCategorySlugs.length > 0) {
      // Fall back to category-based filter
      relatedProducts = allProducts
        .filter((p) => relatedCategorySlugs.includes(p.categorySlug))
        .slice(0, 8);
    }
  } catch {}

  const purposeTitle = dir.purposeTitle;
  const purposeText = dir.purpose;
  const solutionTitle = dir.solutionTitle;
  const solutionText = dir.solution;
  const benefitsTitle = dir.benefitsTitle;
  const benefits = dir.benefits;

  const relatedProductsLabel =
    locale === "uz" ? "Tegishli mahsulotlar" : locale === "en" ? "Related Products" : "Связанные продукты";

  return (
    <Wrapper>
      <Header style_2={true} />

      {/* ── PAGE HEADER ── */}
      <section style={{ background: "#0f1626", padding: "40px 0 36px", borderBottom: "3px solid #F50963" }}>
        <div className="container">
          <nav style={{ marginBottom: 12 }}>
            <ol style={{ display: "flex", gap: 8, listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
              <li>
                <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                  {locale === "uz" ? "Bosh sahifa" : locale === "en" ? "Home" : "Главная"}
                </Link>
              </li>
              <li style={{ color: "rgba(255,255,255,0.3)" }}>/</li>
              <li>
                <Link href={`/${locale}/solutions`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                  {locale === "uz" ? "Yechimlar" : locale === "en" ? "Solutions" : "Решения"}
                </Link>
              </li>
              <li style={{ color: "rgba(255,255,255,0.3)" }}>/</li>
              <li style={{ color: "#F50963" }}>{dir.title}</li>
            </ol>
          </nav>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "clamp(22px, 3vw, 38px)",
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {dir.title}
          </h1>
        </div>
      </section>

      {/* ── PURPOSE — text left, accent right ── */}
      {purposeText && (
        <section style={{ background: "#ffffff", padding: "72px 0" }}>
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#F50963",
                    marginBottom: 12,
                  }}
                >
                  {locale === "uz" ? "Maqsad" : locale === "en" ? "Purpose" : "Цель"}
                </p>
                <h2
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 30px)",
                    fontWeight: 700,
                    color: "#0f1626",
                    marginBottom: 20,
                    lineHeight: 1.3,
                  }}
                >
                  {purposeTitle}
                </h2>
                <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.8 }}>{purposeText}</p>
              </div>
              <div className="col-lg-6">
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                    height: 340,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
                  }}
                >
                  <Image src={dir.imageUrl} alt={dir.title} fill style={{ objectFit: "cover" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SOLUTION — dark background, image left ── */}
      {solutionText && (
        <section style={{ background: "#0f1626", padding: "72px 0" }}>
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 order-lg-2">
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#F50963",
                    marginBottom: 12,
                  }}
                >
                  {locale === "uz" ? "Yechim" : locale === "en" ? "Solution" : "Решение"}
                </p>
                <h2
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 30px)",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 20,
                    lineHeight: 1.3,
                  }}
                >
                  {solutionTitle}
                </h2>
                <p style={{ fontSize: 16, color: "#a0aec0", lineHeight: 1.8 }}>{solutionText}</p>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                    height: 340,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                  }}
                >
                  <Image src={imageUrl2} alt={solutionTitle} fill style={{ objectFit: "cover" }} />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(245,9,99,0.25) 0%, transparent 60%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── BENEFITS — light grey, card grid ── */}
      {benefits.length > 0 && (
        <section style={{ background: "#f4f6fb", padding: "72px 0" }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 48 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#F50963",
                  marginBottom: 10,
                }}
              >
                {locale === "uz" ? "Afzalliklari" : locale === "en" ? "Benefits" : "Преимущества"}
              </p>
              <h2
                style={{
                  fontSize: "clamp(22px, 3vw, 36px)",
                  fontWeight: 700,
                  color: "#0f1626",
                  margin: 0,
                }}
              >
                {benefitsTitle}
              </h2>
            </div>
            <div className="row g-4">
              {benefits.map((item, i) => (
                <div key={i} className="col-lg-4 col-md-6">
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: 12,
                      padding: "28px 24px",
                      height: "100%",
                      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                      borderTop: "3px solid #374151",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#fff0f4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 14,
                        fontSize: 16,
                        color: "#F50963",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.65, margin: 0 }}>{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ── */}
      {relatedProducts.length > 0 && (
        <section className="product__popular-area pb-60 pt-60">
          <div className="container">
            <div className="row mb-35">
              <div className="col-12">
                <div className="section__title-wrapper-13">
                  <h3 className="section__title-13">{relatedProductsLabel}</h3>
                </div>
              </div>
            </div>
            <div className="row">
              {relatedProducts.map((product) => (
                <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <div className="product__item p-relative transition-3 mb-50">
                    <div className="product__thumb w-img p-relative fix">
                      <Link href={`/${locale}/product-details/${product._id}`}>
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={960}
                          height={1125}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </Link>
                      <Link href={`/${locale}/product-details/${product._id}`}>
                        <div className="product__add transition-3">
                          <button type="button" className="product-add-cart-btn w-100">
                            View Details
                          </button>
                        </div>
                      </Link>
                    </div>
                    <div className="product__content">
                      <h3 className="product__title">
                        <Link href={`/${locale}/product-details/${product._id}`}>
                          {product.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </Wrapper>
  );
}
