import { NextRequest, NextResponse } from "next/server";

/**
 * Protect write endpoints with a simple shared token.
 * Send token via `Authorization: Bearer <token>` or `x-admin-token` header.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const expectedToken = process.env.NEXT_ADMIN_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      {
        success: false,
        error: "NEXT_ADMIN_TOKEN is not configured",
      },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";

  const headerToken = request.headers.get("x-admin-token") || "";
  const providedToken = bearerToken || headerToken;

  if (!providedToken || providedToken !== expectedToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  return null;
}
