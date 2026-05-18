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
    { slug: "rfid-tags-cards",        titleRu: "RFID метки и карты",             titleUz: "RFID teglar va kartalar",      titleEn: "RFID Tags & Cards",         descRu: "RFID метки и карты",                   descUz: "RFID teglar va kartalar",              descEn: "RFID tags and cards",          parentSlug: "library-rfid" },
    { slug: "readers",                titleRu: "Считыватели",                    titleUz: "O'quvchilar",                  titleEn: "Readers",                   descRu: "RFID считыватели",                    descUz: "RFID o'quvchilari",                    descEn: "RFID readers",                 parentSlug: "library-rfid" },
    { slug: "security-systems",       titleRu: "Системы безопасности",           titleUz: "Xavfsizlik tizimlari",         titleEn: "Security Systems",          descRu: "Системы контроля доступа и безопасности", descUz: "Kirish nazorati va xavfsizlik tizimlari", descEn: "Access control and security systems", parentSlug: "library-rfid" },
    { slug: "self-service-terminals", titleRu: "Терминалы самообслуживания",     titleUz: "O'z-o'ziga xizmat terminallari", titleEn: "Self-Service Terminals",  descRu: "Терминалы самообслуживания",           descUz: "O'z-o'ziga xizmat terminallari",       descEn: "Self-service terminals",       parentSlug: "library-rfid" },
    // Программное обеспечение
    { slug: "software",               titleRu: "Программное обеспечение",        titleUz: "Dasturiy ta'minot",            titleEn: "Software",                  descRu: "Программные продукты",                descUz: "Dasturiy mahsulotlar",                 descEn: "Software products" },
    { slug: "library-systems",        titleRu: "Библиотечные системы",           titleUz: "Kutubxona tizimlari",          titleEn: "Library Systems",           descRu: "Автоматизация библиотек",             descUz: "Kutubxonalarni avtomatlashtirish",      descEn: "Library automation systems",   parentSlug: "software" },
    { slug: "microsoft-products",     titleRu: "Продукты Microsoft",             titleUz: "Microsoft mahsulotlari",       titleEn: "Microsoft Products",        descRu: "Лицензионные продукты Microsoft",     descUz: "Litsenziyalangan Microsoft mahsulotlari", descEn: "Licensed Microsoft products", parentSlug: "software" },
    // Распознавание лиц
    { slug: "face-recognition",       titleRu: "Распознавание лиц",             titleUz: "Yuz tanish",                  titleEn: "Face Recognition",          descRu: "Биометрическое распознавание лиц",    descUz: "Biometrik yuz tanish",                 descEn: "Biometric face recognition" },
    // Интерактивные панели и киоски
    { slug: "interactive-panels-kiosks", titleRu: "Интерактивные панели и киоски", titleUz: "Interaktiv panellar va kiosklar", titleEn: "Interactive Panels & Kiosks", descRu: "Интерактивные решения", descUz: "Interaktiv yechimlar", descEn: "Interactive solutions" },
    { slug: "infokiosks",             titleRu: "Инфокиоски",                    titleUz: "Infokiosklar",                 titleEn: "Info Kiosks",               descRu: "Информационные киоски",               descUz: "Axborot kiosklari",                    descEn: "Information kiosks",           parentSlug: "interactive-panels-kiosks" },
    { slug: "touch-panels",           titleRu: "Сенсорные панели",              titleUz: "Sensorli panellar",            titleEn: "Touch Panels",              descRu: "Сенсорные панели",                    descUz: "Sensorli panellar",                    descEn: "Touch panels",                 parentSlug: "interactive-panels-kiosks" },
    // Мебель и инфраструктура
    { slug: "furniture-infrastructure", titleRu: "Мебель и инфраструктура",     titleUz: "Mebel va infratuzilma",        titleEn: "Furniture & Infrastructure", descRu: "Специализированная мебель",          descUz: "Ixtisoslashtirilgan mebel",            descEn: "Specialized furniture and infrastructure" },
    // Инновационные решения
    { slug: "innovative-solutions",   titleRu: "Инновационные решения",         titleUz: "Innovatsion yechimlar",        titleEn: "Innovative Solutions",      descRu: "Инновационные технологии",            descUz: "Innovatsion texnologiyalar",           descEn: "Innovative technologies" },
    // Принтеры
    { slug: "printers",               titleRu: "Принтеры",                      titleUz: "Printerlar",                  titleEn: "Printers",                  descRu: "Принтеры различных типов",            descUz: "Turli xil printerlar",                 descEn: "Various types of printers" },
    { slug: "card-printers",          titleRu: "Карт-принтеры",                 titleUz: "Karta printerlari",            titleEn: "Card Printers",             descRu: "Принтеры для печати карт",            descUz: "Karta bosib chiqarish printerlari",    descEn: "Card printing printers",       parentSlug: "printers" },
    { slug: "thermal-printers",       titleRu: "Термопринтеры",                 titleUz: "Termal printerlar",            titleEn: "Thermal Printers",          descRu: "Термопринтеры",                       descUz: "Termal printerlar",                    descEn: "Thermal printers",             parentSlug: "printers" },
    // Коммерческий RFID
    { slug: "commercial-rfid",        titleRu: "Коммерческий RFID",             titleUz: "Tijorat RFID",                titleEn: "Commercial RFID",           descRu: "RFID решения для бизнеса",            descUz: "Biznes uchun RFID yechimlari",         descEn: "RFID solutions for business" },
    { slug: "fixed-assets-inventory", titleRu: "Инвентаризация основных средств", titleUz: "Asosiy vositalar inventarizatsiyasi", titleEn: "Fixed Assets Inventory", descRu: "Учёт и инвентаризация основных средств", descUz: "Asosiy vositalar hisobi va inventarizatsiyasi", descEn: "Fixed assets accounting and inventory", parentSlug: "commercial-rfid" },
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
      const contentJson = cat.parentSlug ? JSON.stringify({ parentSlug: cat.parentSlug }) : undefined;
      for (const lang of Object.values(Language)) {
        await prisma.translation.upsert({
          where: {
            language_categoryId: {
              categoryId: category.id,
              language: lang,
            },
          },
          update: {
            title: lang === Language.RU ? cat.titleRu : lang === Language.UZ ? cat.titleUz : cat.titleEn,
            description: lang === Language.RU ? cat.descRu : lang === Language.UZ ? cat.descUz : cat.descEn,
            content: contentJson,
          },
          create: {
            language: lang,
            entityType: "Category",
            entityId: category.id,
            title: lang === Language.RU ? cat.titleRu : lang === Language.UZ ? cat.titleUz : cat.titleEn,
            description: lang === Language.RU ? cat.descRu : lang === Language.UZ ? cat.descUz : cat.descEn,
            content: contentJson,
            categoryId: category.id,
          },
        });
      }

      return category;
    })
  );

  console.log(`✅ Created ${categories.length} categories with translations\n`);

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log("🎉 Database seed completed successfully!\n");
  console.log(`Summary:\n  • ${categories.length} Categories\n`);
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
