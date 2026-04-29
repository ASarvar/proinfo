import { NextRequest, NextResponse } from "next/server";
import {
  deleteAdminContent,
  getAdminContentById,
  isAdminResource,
  updateAdminContent,
} from "@lib/admin-content";
import { requireAdminSession } from "@lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ success: false, error: "Unknown admin resource" }, { status: 404 });
  }

  const { error } = requireAdminSession(request);
  if (error) return error;

  try {
    const item = await getAdminContentById(resource, id);
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed to fetch item" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ success: false, error: "Unknown admin resource" }, { status: 404 });
  }

  const { error, session } = requireAdminSession(request);
  if (error) return error;

  try {
    const payload = await request.json();
    if (payload?.status === "published" && session?.role !== "SuperAdmin") {
      return NextResponse.json(
        { success: false, error: "Only SuperAdmin can publish content" },
        { status: 403 }
      );
    }

    const updated = await updateAdminContent(resource, id, payload);
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed to update item" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ success: false, error: "Unknown admin resource" }, { status: 404 });
  }

  const { error, session } = requireAdminSession(request, ["SuperAdmin"]);
  if (error) return error;

  try {
    const deleted = await deleteAdminContent(resource, id);
    return NextResponse.json({ success: true, data: { id: deleted.id, role: session?.role } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed to delete item" }, { status: 400 });
  }
}
