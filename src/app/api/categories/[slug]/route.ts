import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language } from "../../../../lib/api-helpers";
import { requireAdmin } from "../../../../lib/api-auth";

/**
 * GET /api/categories/[slug]
 * Get a specific category by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lang = new URL(request.url).searchParams.get("lang") as Language || Language.RU;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { order: "asc" },
          select: { id: true, slug: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(formatError({ message: "Category not found" }), { status: 404 });
    }

    const translations = await getEntityTranslations("Category", category.id, [lang]);

    const result = {
      id: category.id,
      slug: category.slug,
      imageUrl: category.imageUrl,
      products: category.products,
      ...translations[lang],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    return NextResponse.json(formatResponse(result, "Category retrieved"), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/categories/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * PUT /api/categories/[slug]
 * Update a category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authError = requireAdmin(request);
    if (authError) {
      return authError;
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, description, imageUrl } = body;

    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      return NextResponse.json(formatError({ message: "Category not found" }), { status: 404 });
    }

    const updated = await prisma.category.update({
      where: { slug },
      data: {
        imageUrl: imageUrl || undefined,
      },
    });

    // Update translation if provided
    if (title) {
      await prisma.translation.updateMany({
        where: { entityId: category.id, entityType: "Category" },
        data: {
          title: title,
          description: description || undefined,
        },
      });
    }

    return NextResponse.json(formatResponse(updated, "Category updated"), { status: 200 });
  } catch (error: any) {
    console.error("[PUT /api/categories/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * DELETE /api/categories/[slug]
 * Delete a category
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

    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: { select: { id: true } } },
    });

    if (!category) {
      return NextResponse.json(formatError({ message: "Category not found" }), { status: 404 });
    }

    if (category.products.length > 0) {
      return NextResponse.json(
        formatError({
          message: `Cannot delete category with ${category.products.length} products. Delete products first.`,
        }),
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { slug } });

    return NextResponse.json(formatResponse(null, "Category deleted"), { status: 200 });
  } catch (error: any) {
    console.error("[DELETE /api/categories/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
