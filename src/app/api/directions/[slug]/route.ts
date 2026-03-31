import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language } from "../../../../lib/api-helpers";
import { requireAdmin } from "../../../../lib/api-auth";

/**
 * GET /api/directions/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lang = (new URL(request.url).searchParams.get("lang") || "RU") as Language;

    const direction = await prisma.direction.findUnique({ where: { slug } });

    if (!direction) {
      return NextResponse.json(formatError({ message: "Direction not found" }), { status: 404 });
    }

    const translations = await getEntityTranslations("Direction", direction.id, [lang]);

    return NextResponse.json(
      formatResponse({
        id: direction.id,
        slug: direction.slug,
        imageUrl: direction.imageUrl,
        ...translations[lang],
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET /api/directions/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * DELETE /api/directions/[slug]
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

    const direction = await prisma.direction.findUnique({ where: { slug } });
    if (!direction) {
      return NextResponse.json(formatError({ message: "Direction not found" }), { status: 404 });
    }

    await prisma.direction.delete({ where: { slug } });

    return NextResponse.json(formatResponse(null, "Direction deleted"), { status: 200 });
  } catch (error: any) {
    console.error("[DELETE /api/directions/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
