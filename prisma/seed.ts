import "dotenv/config";
import { PrismaClient, Language } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ============================================================================
  // SEED CATEGORIES
  // ============================================================================

  // Delete old categories (and their linked products via cascade)
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("🗑️  Cleared old categories and products\n");

  const categoriesData = [
    // Библиотечный RFID
    { slug: "library-rfid",          titleRu: "Библиотечный RFID",             titleUz: "Kutubxona RFID",              titleEn: "Library RFID",              descRu: "RFID решения для библиотек",          descUz: "Kutubxonalar uchun RFID yechimlari",   descEn: "RFID solutions for libraries" },
    { slug: "rfid-tags-cards",        titleRu: "RFID метки и карты",             titleUz: "RFID teglar va kartalar",      titleEn: "RFID Tags & Cards",         descRu: "RFID метки и карты",                   descUz: "RFID teglar va kartalar",              descEn: "RFID tags and cards" },
    { slug: "readers",                titleRu: "Считыватели",                    titleUz: "O'quvchilar",                  titleEn: "Readers",                   descRu: "RFID считыватели",                    descUz: "RFID o'quvchilari",                    descEn: "RFID readers" },
    { slug: "security-systems",       titleRu: "Системы безопасности",           titleUz: "Xavfsizlik tizimlari",         titleEn: "Security Systems",          descRu: "Системы контроля доступа и безопасности", descUz: "Kirish nazorati va xavfsizlik tizimlari", descEn: "Access control and security systems" },
    { slug: "self-service-terminals", titleRu: "Терминалы самообслуживания",     titleUz: "O'z-o'ziga xizmat terminallari", titleEn: "Self-Service Terminals",  descRu: "Терминалы самообслуживания",           descUz: "O'z-o'ziga xizmat terminallari",       descEn: "Self-service terminals" },
    // Программное обеспечение
    { slug: "software",               titleRu: "Программное обеспечение",        titleUz: "Dasturiy ta'minot",            titleEn: "Software",                  descRu: "Программные продукты",                descUz: "Dasturiy mahsulotlar",                 descEn: "Software products" },
    { slug: "library-systems",        titleRu: "Библиотечные системы",           titleUz: "Kutubxona tizimlari",          titleEn: "Library Systems",           descRu: "Автоматизация библиотек",             descUz: "Kutubxonalarni avtomatlashtirish",      descEn: "Library automation systems" },
    { slug: "microsoft-products",     titleRu: "Продукты Microsoft",             titleUz: "Microsoft mahsulotlari",       titleEn: "Microsoft Products",        descRu: "Лицензионные продукты Microsoft",     descUz: "Litsenziyalangan Microsoft mahsulotlari", descEn: "Licensed Microsoft products" },
    // Распознавание лиц
    { slug: "face-recognition",       titleRu: "Распознавание лиц",             titleUz: "Yuz tanish",                  titleEn: "Face Recognition",          descRu: "Биометрическое распознавание лиц",    descUz: "Biometrik yuz tanish",                 descEn: "Biometric face recognition" },
    // Интерактивные панели и киоски
    { slug: "interactive-panels-kiosks", titleRu: "Интерактивные панели и киоски", titleUz: "Interaktiv panellar va kiosklar", titleEn: "Interactive Panels & Kiosks", descRu: "Интерактивные решения", descUz: "Interaktiv yechimlar", descEn: "Interactive solutions" },
    { slug: "infokiosks",             titleRu: "Инфокиоски",                    titleUz: "Infokiosklar",                 titleEn: "Info Kiosks",               descRu: "Информационные киоски",               descUz: "Axborot kiosklari",                    descEn: "Information kiosks" },
    { slug: "touch-panels",           titleRu: "Сенсорные панели",              titleUz: "Sensorli panellar",            titleEn: "Touch Panels",              descRu: "Сенсорные панели",                    descUz: "Sensorli panellar",                    descEn: "Touch panels" },
    // Мебель и инфраструктура
    { slug: "furniture-infrastructure", titleRu: "Мебель и инфраструктура",     titleUz: "Mebel va infratuzilma",        titleEn: "Furniture & Infrastructure", descRu: "Специализированная мебель",          descUz: "Ixtisoslashtirilgan mebel",            descEn: "Specialized furniture and infrastructure" },
    // Инновационные решения
    { slug: "innovative-solutions",   titleRu: "Инновационные решения",         titleUz: "Innovatsion yechimlar",        titleEn: "Innovative Solutions",      descRu: "Инновационные технологии",            descUz: "Innovatsion texnologiyalar",           descEn: "Innovative technologies" },
    // Принтеры
    { slug: "printers",               titleRu: "Принтеры",                      titleUz: "Printerlar",                  titleEn: "Printers",                  descRu: "Принтеры различных типов",            descUz: "Turli xil printerlar",                 descEn: "Various types of printers" },
    { slug: "card-printers",          titleRu: "Карт-принтеры",                 titleUz: "Karta printerlari",            titleEn: "Card Printers",             descRu: "Принтеры для печати карт",            descUz: "Karta bosib chiqarish printerlari",    descEn: "Card printing printers" },
    { slug: "thermal-printers",       titleRu: "Термопринтеры",                 titleUz: "Termal printerlar",            titleEn: "Thermal Printers",          descRu: "Термопринтеры",                       descUz: "Termal printerlar",                    descEn: "Thermal printers" },
    // Коммерческий RFID
    { slug: "commercial-rfid",        titleRu: "Коммерческий RFID",             titleUz: "Tijorat RFID",                titleEn: "Commercial RFID",           descRu: "RFID решения для бизнеса",            descUz: "Biznes uchun RFID yechimlari",         descEn: "RFID solutions for business" },
    { slug: "fixed-assets-inventory", titleRu: "Инвентаризация основных средств", titleUz: "Asosiy vositalar inventarizatsiyasi", titleEn: "Fixed Assets Inventory", descRu: "Учёт и инвентаризация основных средств", descUz: "Asosiy vositalar hisobi va inventarizatsiyasi", descEn: "Fixed assets accounting and inventory" },
  ];

  const categories = await Promise.all(
    categoriesData.map(async (cat) => {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          slug: cat.slug,
          imageUrl: `/assets/img/category/${cat.slug}.jpg`,
          order: categoriesData.indexOf(cat),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_categoryId: {
              categoryId: category.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "Category",
            entityId: category.id,
            title: lang === Language.RU ? cat.titleRu : lang === Language.UZ ? cat.titleUz : cat.titleEn,
            description: lang === Language.RU ? cat.descRu : lang === Language.UZ ? cat.descUz : cat.descEn,
            categoryId: category.id,
          },
        });
      }

      return category;
    })
  );

  console.log(`✅ Created ${categories.length} categories with translations\n`);

  // ============================================================================
  // SEED DIRECTIONS
  // ============================================================================

  const directionsData = [
    { slug: "commerce", titleRu: "E-commerce", titleUz: "E-savdo", titleEn: "E-commerce" },
    { slug: "logistics", titleRu: "Логистика", titleUz: "Logistika", titleEn: "Logistics" },
    { slug: "manufacturing", titleRu: "Производство", titleUz: "Ishlab chiqarish", titleEn: "Manufacturing" },
    { slug: "healthcare", titleRu: "Здравоохранение", titleUz: "Sog'liqni saqlash", titleEn: "Healthcare" },
    { slug: "retail", titleRu: "Розница", titleUz: "Chakana savdo", titleEn: "Retail" },
  ];

  const directions = await Promise.all(
    directionsData.map(async (dir) => {
      const direction = await prisma.direction.upsert({
        where: { slug: dir.slug },
        update: {},
        create: {
          slug: dir.slug,
          imageUrl: `/assets/img/direction/${dir.slug}.jpg`,
          order: directionsData.indexOf(dir),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_directionId: {
              directionId: direction.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "Direction",
            entityId: direction.id,
            title: lang === Language.RU ? dir.titleRu : lang === Language.UZ ? dir.titleUz : dir.titleEn,
            description: `${lang === Language.RU ? dir.titleRu : lang === Language.UZ ? dir.titleUz : dir.titleEn} solutions`,
            directionId: direction.id,
          },
        });
      }

      return direction;
    })
  );

  console.log(`✅ Created ${directions.length} directions with translations\n`);

  // ============================================================================
  // SEED BLOG POSTS
  // ============================================================================

  const postsData = [
    { slug: "rfid-implementation", titleRu: "Внедрение RFID", excerpt: "Как успешно внедрить RFID..." },
    { slug: "automation-trends", titleRu: "Тренды автоматизации", excerpt: "Новые тренды в автоматизации..." },
    { slug: "digital-transformation", titleRu: "Цифровая трансформация", excerpt: "Путь к цифровой трансформации..." },
  ];

  const posts = await Promise.all(
    postsData.map(async (post) => {
      const postRecord = await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          slug: post.slug,
          coverImageUrl: `/assets/img/blog/${post.slug}.jpg`,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          order: postsData.indexOf(post),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_postId: {
              postId: postRecord.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "Post",
            entityId: postRecord.id,
            title: post.titleRu,
            excerpt: post.excerpt,
            content: `<p>${post.excerpt}</p><p>Полный контент статьи...</p>`,
            postId: postRecord.id,
          },
        });
      }

      return postRecord;
    })
  );

  console.log(`✅ Created ${posts.length} blog posts with translations\n`);

  // ============================================================================
  // SEED VIDEOS
  // ============================================================================

  const videosData = [
    { slug: "rfid-intro", titleRu: "Введение в RFID", duration: 450 },
    { slug: "automation-demo", titleRu: "Демонстрация автоматизации", duration: 720 },
    { slug: "product-review", titleRu: "Обзор продукта", duration: 600 },
  ];

  const videos = await Promise.all(
    videosData.map(async (video) => {
      const videoRecord = await prisma.video.upsert({
        where: { slug: video.slug },
        update: {},
        create: {
          slug: video.slug,
          coverImageUrl: `/assets/img/video/${video.slug}.jpg`,
          videoUrl: `https://example.com/videos/${video.slug}.mp4`,
          duration: video.duration,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          order: videosData.indexOf(video),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_videoId: {
              videoId: videoRecord.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "Video",
            entityId: videoRecord.id,
            title: video.titleRu,
            description: `${video.titleRu} - ${Math.floor(video.duration / 60)} минут`,
            videoId: videoRecord.id,
          },
        });
      }

      return videoRecord;
    })
  );

  console.log(`✅ Created ${videos.length} videos with translations\n`);

  // ============================================================================
  // SEED PHOTO ALBUMS
  // ============================================================================

  const albumsData = [
    { slug: "trade-show-2024", titleRu: "Выставка 2024", description: "Фото с выставки" },
    { slug: "office-tour", titleRu: "Экскурсия по офису", description: "Наш офис и команда" },
    { slug: "product-photography", titleRu: "Фотографии продуктов", description: "Профессиональные фото продуктов" },
  ];

  const albums = await Promise.all(
    albumsData.map(async (album) => {
      const albumRecord = await prisma.photoAlbum.upsert({
        where: { slug: album.slug },
        update: {},
        create: {
          slug: album.slug,
          coverImageUrl: `/assets/img/gallery/${album.slug}/cover.jpg`,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          order: albumsData.indexOf(album),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_photoAlbumId: {
              photoAlbumId: albumRecord.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "PhotoAlbum",
            entityId: albumRecord.id,
            title: album.titleRu,
            description: album.description,
            photoAlbumId: albumRecord.id,
          },
        });
      }

      // Create photo items
      for (let i = 1; i <= 3; i++) {
        await prisma.photoItem.create({
          data: {
            albumId: albumRecord.id,
            imageUrl: `/assets/img/gallery/${album.slug}/photo-${i}.jpg`,
            caption: `Фото ${i}`,
            order: i - 1,
          },
        });
      }

      return albumRecord;
    })
  );

  console.log(`✅ Created ${albums.length} photo albums with items and translations\n`);

  // ============================================================================
  // SEED DOWNLOADS
  // ============================================================================

  const downloadsData = [
    { slug: "rfid-guide", titleRu: "Руководство RFID", fileType: "PDF", fileSizeKb: 2500 },
    { slug: "installation-manual", titleRu: "Руководство установки", fileType: "PDF", fileSizeKb: 3200 },
    { slug: "product-catalog", titleRu: "Каталог продуктов", fileType: "PDF", fileSizeKb: 5000 },
    { slug: "software-installer", titleRu: "Установщик ПО", fileType: "ZIP", fileSizeKb: 75000 },
  ];

  const downloads = await Promise.all(
    downloadsData.map(async (download) => {
      const downloadRecord = await prisma.downloadFile.upsert({
        where: { slug: download.slug },
        update: {},
        create: {
          slug: download.slug,
          fileUrl: `/files/${download.slug}.${download.fileType.toLowerCase()}`,
          fileType: download.fileType === "PDF" ? "PDF" : download.fileType === "ZIP" ? "ZIP" : "OTHER",
          fileSizeKb: download.fileSizeKb,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          order: downloadsData.indexOf(download),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_downloadFileId: {
              downloadFileId: downloadRecord.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "DownloadFile",
            entityId: downloadRecord.id,
            title: download.titleRu,
            description: `${download.titleRu} (${download.fileSizeKb} KB)`,
            downloadFileId: downloadRecord.id,
          },
        });
      }

      return downloadRecord;
    })
  );

  console.log(`✅ Created ${downloads.length} download files with translations\n`);

  // ============================================================================
  // SEED FAQ
  // ============================================================================

  const faqData = [
    { slug: "what-is-rfid", titleRu: "Что такое RFID?", answerRu: "RFID - это технология радиочастотной идентификации..." },
    { slug: "how-to-install", titleRu: "Как установить систему?", answerRu: "Подробное руководство по установке..." },
    { slug: "pricing-info", titleRu: "Какова цена?", answerRu: "Цена зависит от конфигурации и объема заказа..." },
    { slug: "support-contact", titleRu: "Как связаться с поддержкой?", answerRu: "Вы можете связаться с нами через форму контактов..." },
  ];

  const faqs = await Promise.all(
    faqData.map(async (faq) => {
      const faqRecord = await prisma.faq.upsert({
        where: { slug: faq.slug },
        update: {},
        create: {
          slug: faq.slug,
          order: faqData.indexOf(faq),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_faqId: {
              faqId: faqRecord.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "FAQ",
            entityId: faqRecord.id,
            title: faq.titleRu,
            content: faq.answerRu,
            faqId: faqRecord.id,
          },
        });
      }

      return faqRecord;
    })
  );

  console.log(`✅ Created ${faqs.length} FAQ items with translations\n`);

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log("🎉 Database seed completed successfully!\n");
  console.log(
    `Summary:\n` +
      `  • ${categories.length} Categories\n` +
      `  • ${directions.length} Directions\n` +
      `  • ${posts.length} Blog Posts\n` +
      `  • ${videos.length} Videos\n` +
      `  • ${albums.length} Photo Albums\n` +
      `  • ${downloads.length} Download Files\n` +
      `  • ${faqs.length} FAQ Items\n`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
