const mediaItems = [
  {
    id: "blog-001",
    slug: "rfid-library-30-days",
    type: "blog",
    title: "Как внедрить RFID в библиотеке за 30 дней",
    excerpt:
      "Пошаговый план запуска RFID-инфраструктуры: аудит, пилот, интеграция и обучение персонала.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-02-12",
    content:
      "RFID-проект стоит запускать поэтапно: аудит фонда, пилот на одной зоне, интеграция с АБИС и обучение сотрудников. Такой подход снижает риски и ускоряет выход на стабильную эксплуатацию.",
    tags: ["RFID", "Автоматизация"],
  },
  {
    id: "blog-002",
    slug: "self-check-station-5-mistakes",
    type: "blog",
    title: "5 ошибок при выборе станций самообслуживания",
    excerpt:
      "Разбираем типичные ошибки в проектировании зон self-check и как избежать лишних затрат.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-01-28",
    content:
      "Перед закупкой терминалов нужно определить потоки пользователей, сценарии обслуживания и интеграцию с учетной системой. Неправильная компоновка зоны часто приводит к очередям и лишним затратам.",
    tags: ["Станции выдачи", "Практика"],
  },
  {
    id: "video-001",
    slug: "unibook-mini-pro-overview",
    type: "video",
    title: "UniBook MINI PRO: обзор и сценарии использования",
    excerpt:
      "Короткий обзор терминала самообслуживания и демонстрация основных сценариев в библиотеке.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-03-01",
    content:
      "Видео показывает ключевые сценарии: самостоятельная выдача, возврат и проверка читательского билета. Раздел полезен для подготовки персонала и демонстрации заказчику.",
    sourceUrl: "https://www.youtube.com/",
    duration: "08:42",
    tags: ["Видеообзор", "Self-service"],
  },
  {
    id: "video-002",
    slug: "rfid-inventory-fast-audit",
    type: "video",
    title: "RFID инвентаризация: ускоряем учет фонда",
    excerpt:
      "Показываем как мобильные считыватели сокращают время инвентаризации и снижают ошибки.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-02-04",
    content:
      "Демонстрация мобильной инвентаризации с RFID: от запуска сессии до формирования отчета по отсутствующим экземплярам.",
    sourceUrl: "https://www.youtube.com/",
    duration: "11:15",
    tags: ["RFID", "Инвентаризация"],
  },
  {
    id: "photo-001",
    slug: "tashkent-university-deployment",
    type: "photo",
    title: "Проект: университетская библиотека, Ташкент",
    excerpt: "Фото внедрения RFID ворот и зон самообслуживания в главном читальном зале.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-03-15",
    content:
      "Фотоальбом внедрения RFID-ворот и терминалов самообслуживания в университетской библиотеке Ташкента.",
    gallery: [
      "/assets/img/image.jpg",
      "/assets/img/image.jpg",
      "/assets/img/image.jpg",
    ],
    tags: ["Кейс", "Ташкент"],
  },
  {
    id: "photo-002",
    slug: "samarkand-public-library-case",
    type: "photo",
    title: "Проект: публичная библиотека, Самарканд",
    excerpt: "Фотоэтапы развертывания киосков и рабочих станций персонала.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-01-20",
    content:
      "Фотоэтапы запуска: монтаж оборудования, настройка рабочих мест и обучение персонала библиотеки.",
    gallery: [
      "/assets/img/image.jpg",
      "/assets/img/image.jpg",
      "/assets/img/image.jpg",
    ],
    tags: ["Кейс", "Самарканд"],
  },
  {
    id: "download-001",
    slug: "proinfo-catalog-2026",
    type: "download",
    title: "Каталог решений ProInfo 2026",
    excerpt: "Актуальный каталог оборудования, программных модулей и сервисных пакетов.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-03-10",
    content:
      "Полный каталог решений ProInfo с описанием оборудования, модулей и рекомендациями по внедрению.",
    downloadUrl: "/assets/files/proinfo-catalog-2026.pdf",
    fileType: "PDF",
    fileSize: "12.4 MB",
    tags: ["Каталог"],
  },
  {
    id: "download-002",
    slug: "issue-station-setup-guide",
    type: "download",
    title: "Инструкция: запуск станции выдачи",
    excerpt: "Пошаговая инструкция по первичной настройке и вводу станции в эксплуатацию.",
    coverImage: "/assets/img/image.jpg",
    publishedAt: "2026-02-19",
    content:
      "Техническая инструкция для первичной настройки станции выдачи: сеть, учетные записи, проверка оборудования.",
    downloadUrl: "/assets/files/issue-station-setup.pdf",
    fileType: "PDF",
    fileSize: "3.1 MB",
    tags: ["Инструкция"],
  },
];

export const mediaTypes = {
  blog: "blog",
  video: "video",
  photo: "photo",
  download: "download",
};

export const buildMediaHref = (locale, type, slug) => `/${locale}/support/${type}/${slug}`;

const withLocalizedHref = (item, locale) => ({
  ...item,
  href: buildMediaHref(locale, item.type, item.slug),
});

export const getMediaByType = (type, options = {}) => {
  const { locale = "ru", tag = "all", month = "all" } = options;

  return mediaItems
    .filter((item) => item.type === type)
    .filter((item) => (tag === "all" ? true : item.tags.includes(tag)))
    .filter((item) => {
      if (month === "all") {
        return true;
      }

      return item.publishedAt.startsWith(month);
    })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .map((item) => withLocalizedHref(item, locale));
};

export const getMediaBySlug = (type, slug, locale = "ru") => {
  const item = mediaItems.find((entry) => entry.type === type && entry.slug === slug);
  if (!item) {
    return null;
  }

  return withLocalizedHref(item, locale);
};

export const getMediaTags = (type) => {
  const tags = mediaItems
    .filter((item) => item.type === type)
    .flatMap((item) => item.tags || []);

  return [...new Set(tags)].sort((a, b) => a.localeCompare(b, "ru"));
};

export const getMediaMonths = (type) => {
  const months = mediaItems
    .filter((item) => item.type === type)
    .map((item) => item.publishedAt.slice(0, 7));

  return [...new Set(months)].sort((a, b) => b.localeCompare(a));
};

export const getMediaCounts = () => ({
  blog: mediaItems.filter((item) => item.type === mediaTypes.blog).length,
  video: mediaItems.filter((item) => item.type === mediaTypes.video).length,
  photo: mediaItems.filter((item) => item.type === mediaTypes.photo).length,
  download: mediaItems.filter((item) => item.type === mediaTypes.download).length,
});

export default mediaItems;
