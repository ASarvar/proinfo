import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@lib/admin-auth";

export async function GET(request: NextRequest) {
  const { error, session } = requireAdminSession(request);
  if (error) return error;

  return NextResponse.json({
    success: true,
    data: {
      username: session?.username,
      role: session?.role,
      issuedAt: session?.issuedAt,
    },
  });
}
