import { NextRequest, NextResponse } from "next/server";
import { applySessionCookie, isAdminLoginConfigured, validateAdminLogin } from "@lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    if (!isAdminLoginConfigured()) {
      return NextResponse.json(
        { success: false, error: "Admin credentials are not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const username = (body?.username || "").trim();
    const password = (body?.password || "").trim();

    const session = validateAdminLogin(username, password);
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        username: session.username,
        role: session.role,
      },
    });

    applySessionCookie(response, session);
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Login failed" }, { status: 500 });
  }
}
