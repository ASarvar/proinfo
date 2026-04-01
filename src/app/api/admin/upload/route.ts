import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdminSession } from "@lib/admin-auth";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".zip",
  ".mp4",
]);
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
  "video/mp4",
]);

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  const { error } = requireAdminSession(request);
  if (error) return error;

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    if (file.size <= 0) {
      return NextResponse.json({ success: false, error: "Uploaded file is empty" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File is too large. Max allowed size is ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB`,
        },
        { status: 413 }
      );
    }

    const ext = path.extname(file.name || "").toLowerCase();
    const mimeType = (file.type || "").toLowerCase();
    const extensionAllowed = ALLOWED_EXTENSIONS.has(ext);
    const mimeAllowed = mimeType ? ALLOWED_MIME_TYPES.has(mimeType) : false;

    if (!extensionAllowed || !mimeAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file type",
        },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const base = sanitizeFilename(path.basename(file.name || "file", ext).toLowerCase());
    const filename = `${Date.now()}-${base}${ext}`;
    const destination = path.join(uploadDir, filename);

    await writeFile(destination, buffer);

    const metadata = {
      name: file.name,
      filename,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
      publicUrl: `/uploads/${filename}`,
    };

    return NextResponse.json({ success: true, data: metadata }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Upload failed" }, { status: 500 });
  }
}
