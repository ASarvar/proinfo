import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@lib/admin-auth";
import {
  getDirectionRelatedProductSlugs,
  setDirectionRelatedProductSlugs,
} from "@lib/admin-content";

const VALID_SLUGS = new Set(["libraries", "archives", "educational", "commercial"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { error } = requireAdminSession(request);
  if (error) return error;

  if (!VALID_SLUGS.has(slug)) {
    return NextResponse.json({ success: false, error: "Unknown solution" }, { status: 404 });
  }

  try {
    const relatedProductSlugs = await getDirectionRelatedProductSlugs(slug);
    return NextResponse.json({ success: true, data: { slug, relatedProductSlugs } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { error } = requireAdminSession(request);
  if (error) return error;

  if (!VALID_SLUGS.has(slug)) {
    return NextResponse.json({ success: false, error: "Unknown solution" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const productSlugs: string[] = Array.isArray(body?.productSlugs)
      ? body.productSlugs.filter((s: unknown) => typeof s === "string" && s.trim())
      : [];

    await setDirectionRelatedProductSlugs(slug, productSlugs);
    return NextResponse.json({ success: true, data: { slug, relatedProductSlugs: productSlugs } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed" }, { status: 500 });
  }
}
