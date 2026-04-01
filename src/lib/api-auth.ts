import { NextRequest, NextResponse } from "next/server";
import { AdminRole, requireAdminSession } from "@lib/admin-auth";

/**
 * Protect write endpoints with admin session cookie auth.
 */
export function requireAdmin(request: NextRequest, roles?: AdminRole[]): NextResponse | null {
  const { error } = requireAdminSession(request, roles);
  return error;
}
