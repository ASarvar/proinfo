import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language, createEntityTranslations } from "../../../lib/api-helpers";
import { requireAdmin } from "../../../lib/api-auth";
import { normalizeSlug, normalizeText, isValidSlug } from "../../../lib/validation";

/**
 * GET /api/directions
 * Get all directions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get("lang") || "RU") as Language;
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const directions = await prisma.direction.findMany({
      take: limit,
      skip,
      orderBy: { order: "asc" },
    });

    const enriched = await Promise.all(
      directions.map(async (dir) => {
        const translations = await getEntityTranslations("Direction", dir.id, [lang]);
        return {
          id: dir.id,
          slug: dir.slug,
          imageUrl: dir.imageUrl,
          ...translations[lang],
        };
      })
    );

    return NextResponse.json(formatResponse(enriched, `Retrieved ${directions.length} directions`), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/directions]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * POST /api/directions
 * Create a new direction
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

    const existing = await prisma.direction.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(formatError({ message: "Direction with this slug already exists" }), { status: 409 });
    }

    const direction = await prisma.direction.create({
      data: {
        slug,
        imageUrl: body.imageUrl || null,
        order: body.order || 0,
      },
    });

    const translationsData = translations || {
      [Language.RU]: { title, description },
      [Language.UZ]: { title, description },
      [Language.EN]: { title, description },
    };

    await createEntityTranslations("Direction", direction.id, translationsData);

    return NextResponse.json(
      formatResponse({ id: direction.id, slug: direction.slug }, "Direction created"),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/directions]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
