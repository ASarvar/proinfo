import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language, createEntityTranslations } from "../../../lib/api-helpers";
import { requireAdmin } from "../../../lib/api-auth";
import { normalizeSlug, normalizeText, isValidSlug, parseOptionalNumber } from "../../../lib/validation";

/**
 * GET /api/products
 * Get products with optional filtering by category, skip, limit
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get("lang") || "RU") as Language;
    const categorySlug = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const where: any = {};
    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!category) {
        return NextResponse.json(formatError({ message: "Category not found" }), { status: 404 });
      }
      where.categoryId = category.id;
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      skip,
      orderBy: { order: "asc" },
      include: {
        category: { select: { slug: true } },
      },
    });

    // Enrich with translations
    const enriched = await Promise.all(
      products.map(async (prod) => {
        const translations = await getEntityTranslations("Product", prod.id, [lang]);
        return {
          id: prod.id,
          slug: prod.slug,
          categorySlug: prod.category.slug,
          imageUrl: prod.imageUrl,
          price: prod.price,
          ...translations[lang],
          createdAt: prod.createdAt,
          updatedAt: prod.updatedAt,
        };
      })
    );

    return NextResponse.json(formatResponse(enriched, `Retrieved ${products.length} products`), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    const authError = requireAdmin(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const slug = normalizeSlug(body.slug);
    const categorySlug = normalizeSlug(body.categorySlug);
    const title = normalizeText(body.title);
    const description = normalizeText(body.description);
    const price = parseOptionalNumber(body.price);
    const imageUrl = normalizeText(body.imageUrl) || null;
    const { translations } = body;

    if (!slug || !categorySlug || !title) {
      return NextResponse.json(
        formatError({ message: "slug, categorySlug, and title are required" }),
        { status: 400 }
      );
    }

    if (!isValidSlug(slug) || !isValidSlug(categorySlug)) {
      return NextResponse.json(formatError({ message: "slug format is invalid" }), { status: 400 });
    }

    // Check for duplicate slug
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(formatError({ message: "Product with this slug already exists" }), { status: 409 });
    }

    // Get category
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return NextResponse.json(formatError({ message: "Category not found" }), { status: 404 });
    }

    const product = await prisma.product.create({
      data: {
        slug,
        categoryId: category.id,
        imageUrl,
        price,
        order: body.order || 0,
      },
    });

    // Create translations
    const translationsData = translations || {
      [Language.RU]: { title, description },
      [Language.UZ]: { title, description },
      [Language.EN]: { title, description },
    };

    await createEntityTranslations("Product", product.id, translationsData);

    return NextResponse.json(
      formatResponse({ id: product.id, slug: product.slug }, "Product created"),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/products]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
