import "dotenv/config";
import { PrismaClient } from "@prisma/client";
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
  const beforeCount = await prisma.translation.count({
    where: {
      entityType: "Faq",
      faqId: { not: null },
    },
  });

  if (beforeCount === 0) {
    console.log("No FAQ translation rows require migration.");
    return;
  }

  const result = await prisma.translation.updateMany({
    where: {
      entityType: "Faq",
      faqId: { not: null },
    },
    data: {
      entityType: "FAQ",
    },
  });

  console.log(`Updated ${result.count} FAQ translation rows from 'Faq' to 'FAQ'.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Failed to migrate FAQ entityType:", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
