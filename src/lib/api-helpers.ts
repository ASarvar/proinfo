import { PrismaClient, Language } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Use a global instance to avoid creating multiple clients
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  prismaPool: pg.Pool;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool =
  globalForPrisma.prismaPool ||
  new pg.Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaPool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Generic function to get translations for an entity
 */
export async function getEntityTranslations(
  entityType: string,
  entityId: string,
  languages: Language[] = [Language.RU, Language.UZ, Language.EN]
) {
  const translations = await prisma.translation.findMany({
    where: {
      entityType,
      entityId,
      language: { in: languages },
    },
  });

  return translations.reduce(
    (acc, trans) => {
      acc[trans.language] = {
        title: trans.title,
        description: trans.description,
        content: trans.content,
        excerpt: trans.excerpt,
      };
      return acc;
    },
    {} as Record<string, any>
  );
}

/**
 * Create translations for an entity
 */
export async function createEntityTranslations(
  entityType: string,
  entityId: string,
  translations: Record<Language, { title: string; description?: string; content?: string }>
) {
  for (const [language, data] of Object.entries(translations)) {
    await prisma.translation.create({
      data: {
        language: language as Language,
        entityType,
        entityId,
        ...data,
      },
    });
  }
}

/**
 * Format API response with proper structure
 */
export function formatResponse(data: any, message?: string) {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Format error response
 */
export function formatError(error: any, statusCode: number = 400) {
  return {
    success: false,
    error: error?.message || "An error occurred",
    statusCode,
  };
}

export { Language };
