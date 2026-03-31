import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language } from "../../../../lib/api-helpers";
import { requireAdmin } from "../../../../lib/api-auth";

/**
 * GET /api/faq/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lang = (new URL(request.url).searchParams.get("lang") || "RU") as Language;

    const faq = await prisma.faq.findUnique({ where: { slug } });

    if (!faq) {
      return NextResponse.json(formatError({ message: "FAQ not found" }), { status: 404 });
    }

    const translations = await getEntityTranslations("FAQ", faq.id, [lang]);

    return NextResponse.json(
      formatResponse({
        id: faq.id,
        slug: faq.slug,
        ...translations[lang],
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET /api/faq/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * DELETE /api/faq/[slug]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authError = requireAdmin(request);
    if (authError) {
      return authError;
    }

    const { slug } = await params;

    const faq = await prisma.faq.findUnique({ where: { slug } });
    if (!faq) {
      return NextResponse.json(formatError({ message: "FAQ not found" }), { status: 404 });
    }

    await prisma.faq.delete({ where: { slug } });

    return NextResponse.json(formatResponse(null, "FAQ deleted"), { status: 200 });
  } catch (error: any) {
    console.error("[DELETE /api/faq/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
