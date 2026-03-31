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

  const categoriesData = [
    { slug: "rfid", titleRu: "RFID", titleUz: "RFID", titleEn: "RFID", descRu: "RFID технология", descUz: "RFID texnologiyasi", descEn: "RFID technology" },
    { slug: "automation", titleRu: "Автоматизация", titleUz: "Avtomatika", titleEn: "Automation", descRu: "Системы автоматизации", descUz: "Avtomatika tizimlari", descEn: "Automation systems" },
    { slug: "software", titleRu: "ПО", titleUz: "Dasturiy ta'minot", titleEn: "Software", descRu: "Программное обеспечение", descUz: "Dasturiy ta'minot", descEn: "Software" },
    { slug: "equipment", titleRu: "Оборудование", titleUz: "Asboblar", titleEn: "Equipment", descRu: "Оборудование и приборы", descUz: "Asboblar va qurilmalar", descEn: "Equipment and devices" },
    { slug: "interactive", titleRu: "Интерактивные", titleUz: "Interaktiv", titleEn: "Interactive", descRu: "Интерактивные системы", descUz: "Interaktiv tizimlar", descEn: "Interactive systems" },
    { slug: "infrastructure", titleRu: "Инфраструктура", titleUz: "Infra-tuzilma", titleEn: "Infrastructure", descRu: "Инфраструктурные решения", descUz: "Infra-tuzilma yechimlari", descEn: "Infrastructure solutions" },
    { slug: "innovation", titleRu: "Инновации", titleUz: "Innovatsiyalar", titleEn: "Innovation", descRu: "Инновационные решения", descUz: "Innovatsion echimlari", descEn: "Innovative solutions" },
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
  // SEED PRODUCTS
  // ============================================================================

  const productsData = [
    { categorySlug: "rfid", slug: "product-1", titleRu: "RFID Читатель", price: 4500 },
    { categorySlug: "rfid", slug: "product-2", titleRu: "RFID Метка", price: 150 },
    { categorySlug: "automation", slug: "product-3", titleRu: "PLC Контроллер", price: 8900 },
    { categorySlug: "automation", slug: "product-4", titleRu: "Датчик движения", price: 350 },
    { categorySlug: "software", slug: "product-5", titleRu: "ERP система", price: 25000 },
    { categorySlug: "software", slug: "product-6", titleRu: "CRM платформа", price: 15000 },
    { categorySlug: "equipment", slug: "product-7", titleRu: "Сканер штрих-кодов", price: 2500 },
    { categorySlug: "equipment", slug: "product-8", titleRu: "Весы электронные", price: 3200 },
    { categorySlug: "interactive", slug: "product-9", titleRu: "Интерактивная доска", price: 12000 },
    { categorySlug: "interactive", slug: "product-10", titleRu: "Сенсорный киоск", price: 18500 },
    { categorySlug: "infrastructure", slug: "product-11", titleRu: "Облачный сервер", price: 5000 },
    { categorySlug: "infrastructure", slug: "product-12", titleRu: "Network Router", price: 4200 },
    { categorySlug: "innovation", slug: "product-13", titleRu: "IoT платформа", price: 35000 },
    { categorySlug: "innovation", slug: "product-14", titleRu: "AI решение", price: 50000 },
    { categorySlug: "rfid", slug: "product-15", titleRu: "RFID Принтер", price: 9800 },
    { categorySlug: "automation", slug: "product-16", titleRu: "Smart Controller", price: 7500 },
  ];

  const products = await Promise.all(
    productsData.map(async (prod) => {
      const category = categories.find((c) => c.slug === prod.categorySlug);
      if (!category) return null;

      const product = await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: {
          slug: prod.slug,
          categoryId: category.id,
          imageUrl: `/assets/img/product/${prod.slug}.jpg`,
          price: prod.price,
          order: productsData.indexOf(prod),
        },
      });

      // Create translations
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_productId: {
              productId: product.id,
              language: lang,
            },
          },
          update: {},
          create: {
            language: lang,
            entityType: "Product",
            entityId: product.id,
            title: prod.titleRu,
            description: `${prod.titleRu} - Цена: ${prod.price}`,
            productId: product.id,
          },
        });
      }

      return product;
    })
  );

  console.log(`✅ Created ${products.filter((p) => p).length} products with translations\n`);

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
      `  • ${products.filter((p) => p).length} Products\n` +
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
