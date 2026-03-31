import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language, createEntityTranslations } from "../../../lib/api-helpers";
import { requireAdmin } from "../../../lib/api-auth";
import { normalizeSlug, normalizeText, isValidSlug } from "../../../lib/validation";

/**
 * GET /api/faq
 * Get all FAQ items
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get("lang") || "RU") as Language;
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const faqs = await prisma.faq.findMany({
      take: limit,
      skip,
      orderBy: { order: "asc" },
    });

    const enriched = await Promise.all(
      faqs.map(async (faq) => {
        const translations = await getEntityTranslations("FAQ", faq.id, [lang]);
        return {
          id: faq.id,
          slug: faq.slug,
          ...translations[lang],
        };
      })
    );

    return NextResponse.json(formatResponse(enriched, `Retrieved ${faqs.length} FAQ items`), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/faq]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * POST /api/faq
 * Create a new FAQ item
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
    const content = normalizeText(body.content);
    const { translations } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(formatError({ message: "slug, title, and content are required" }), { status: 400 });
    }

    if (!isValidSlug(slug)) {
      return NextResponse.json(formatError({ message: "slug format is invalid" }), { status: 400 });
    }

    const existing = await prisma.faq.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(formatError({ message: "FAQ with this slug already exists" }), { status: 409 });
    }

    const faq = await prisma.faq.create({
      data: {
        slug,
        order: body.order || 0,
      },
    });

    const translationsData = translations || {
      [Language.RU]: { title, content },
      [Language.UZ]: { title, content },
      [Language.EN]: { title, content },
    };

    await createEntityTranslations("FAQ", faq.id, translationsData);

    return NextResponse.json(formatResponse({ id: faq.id, slug: faq.slug }, "FAQ created"), { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/faq]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
