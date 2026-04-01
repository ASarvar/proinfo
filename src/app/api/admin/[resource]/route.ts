import { NextRequest, NextResponse } from "next/server";
import { Language } from "@lib/api-helpers";
import {
  createAdminContent,
  isAdminResource,
  listAdminContent,
  adminResourceMeta,
} from "@lib/admin-content";
import { requireAdminSession } from "@lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ success: false, error: "Unknown admin resource" }, { status: 404 });
  }

  const { error } = requireAdminSession(request);
  if (error) return error;

  try {
    const langParam = new URL(request.url).searchParams.get("lang") || "RU";
    const lang = (langParam.toUpperCase() as Language) || Language.RU;
    const rows = await listAdminContent(resource, lang);

    return NextResponse.json({
      success: true,
      data: rows,
      meta: adminResourceMeta[resource],
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed to list items" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ success: false, error: "Unknown admin resource" }, { status: 404 });
  }

  const { error, session } = requireAdminSession(request);
  if (error) return error;

  try {
    const payload = await request.json();

    if (resource !== "faq" && session?.role !== "SuperAdmin" && payload?.status === "published") {
      return NextResponse.json(
        { success: false, error: "Only SuperAdmin can publish directly" },
        { status: 403 }
      );
    }

    const created = await createAdminContent(resource, payload);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed to create item" }, { status: 400 });
  }
}
