import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language, createEntityTranslations } from "../../../lib/api-helpers";
import { requireAdmin } from "../../../lib/api-auth";
import { normalizeSlug, normalizeText, isValidSlug } from "../../../lib/validation";

/**
 * GET /api/categories
 * Get all categories with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get("lang") || "RU") as Language;
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const categories = await prisma.category.findMany({
      take: limit,
      skip,
      orderBy: { order: "asc" },
      include: {
        products: {
          select: { id: true },
        },
      },
    });

    // Enrich with translations
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const translations = await getEntityTranslations("Category", cat.id, [lang]);
        return {
          id: cat.id,
          slug: cat.slug,
          imageUrl: cat.imageUrl,
          productCount: cat.products.length,
          ...translations[lang],
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        };
      })
    );

    return NextResponse.json(formatResponse(enriched, `Retrieved ${categories.length} categories`), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * POST /api/categories
 * Create a new category
 * Body: { slug, title, description?, translations }
 */
export async function POST(request: NextRequest) {
  try {
    const authError = requireAdmin(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const slug = normalizeSlug(body.slug);
    const title = normalizeText(body.title);
    const description = normalizeText(body.description);
    const { translations } = body;

    if (!slug || !title) {
      return NextResponse.json(formatError({ message: "slug and title are required" }), { status: 400 });
    }

    if (!isValidSlug(slug)) {
      return NextResponse.json(formatError({ message: "slug format is invalid" }), { status: 400 });
    }

    // Check for duplicate slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(formatError({ message: "Category with this slug already exists" }), { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        slug,
        imageUrl: body.imageUrl,
        order: body.order || 0,
      },
    });

    // Create translations
    const translationsData = translations || {
      [Language.RU]: { title, description },
      [Language.UZ]: { title, description },
      [Language.EN]: { title, description },
    };

    await createEntityTranslations("Category", category.id, translationsData);

    return NextResponse.json(formatResponse({ id: category.id, slug: category.slug }, "Category created"), { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/categories]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
