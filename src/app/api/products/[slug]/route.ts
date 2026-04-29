import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language } from "../../../../lib/api-helpers";
import { requireAdmin } from "../../../../lib/api-auth";

/**
 * GET /api/products/[slug]
 * Get a specific product by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lang = (new URL(request.url).searchParams.get("lang") || "RU") as Language;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, slug: true } },
      },
    });

    if (!product) {
      return NextResponse.json(formatError({ message: "Product not found" }), { status: 404 });
    }

    const translations = await getEntityTranslations("Product", product.id, [lang]);
    const rawTranslation = translations[lang] || {};

    // Parse extra fields stored as JSON in content
    let extras: Record<string, unknown> = {};
    if (rawTranslation.content) {
      try {
        extras = JSON.parse(rawTranslation.content);
      } catch {
        // content is plain text, not JSON extras — keep it as-is
      }
    }

    const result = {
      id: product.id,
      slug: product.slug,
      categoryId: product.category.id,
      categorySlug: product.category.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      title: rawTranslation.title,
      description: rawTranslation.description,
      // Spread extras (sku, quantity, tags, features, specifications, videoUrl, brochureUrl)
      ...extras,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return NextResponse.json(formatResponse(result, "Product retrieved"), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/products/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * PUT /api/products/[slug]
 * Update a product
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
    const { title, description, price, imageUrl } = body;

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json(formatError({ message: "Product not found" }), { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { slug },
      data: {
        price: price || undefined,
        imageUrl: imageUrl || undefined,
      },
    });

    // Update translation if provided
    if (title) {
      await prisma.translation.updateMany({
        where: { entityId: product.id, entityType: "Product" },
        data: {
          title,
          description: description || undefined,
        },
      });
    }

    return NextResponse.json(formatResponse(updated, "Product updated"), { status: 200 });
  } catch (error: any) {
    console.error("[PUT /api/products/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}

/**
 * DELETE /api/products/[slug]
 * Delete a product
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

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json(formatError({ message: "Product not found" }), { status: 404 });
    }

    await prisma.product.delete({ where: { slug } });

    return NextResponse.json(formatResponse(null, "Product deleted"), { status: 200 });
  } catch (error: any) {
    console.error("[DELETE /api/products/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
