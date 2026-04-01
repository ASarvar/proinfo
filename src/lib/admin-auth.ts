import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export type AdminRole = "SuperAdmin" | "Editor";

export type AdminSession = {
  username: string;
  role: AdminRole;
  issuedAt: number;
};

const ADMIN_COOKIE = "proinfo_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXT_ADMIN_TOKEN || "";
}

function sign(payload: string) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }

  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function serializeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function parseSession(rawCookie?: string | null): AdminSession | null {
  if (!rawCookie || !rawCookie.includes(".")) {
    return null;
  }

  const [payload, signature] = rawCookie.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const givenBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== givenBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(expectedBuffer, givenBuffer)) {
    return null;
  }

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    const session = JSON.parse(decoded) as AdminSession;
    if (!session?.username || !session?.role) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest) {
  const raw = request.cookies.get(ADMIN_COOKIE)?.value;
  return parseSession(raw);
}

export function requireAdminSession(request: NextRequest, roles?: AdminRole[]) {
  if (!getSessionSecret()) {
    return {
      error: NextResponse.json(
        { success: false, error: "ADMIN_SESSION_SECRET is not configured" },
        { status: 500 }
      ),
      session: null,
    };
  }

  const session = getSessionFromRequest(request);
  if (!session) {
    return {
      error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }

  if (roles && roles.length > 0 && !roles.includes(session.role)) {
    return {
      error: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }

  return { error: null, session };
}

export function applySessionCookie(response: NextResponse, session: AdminSession) {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: serializeSession(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
}

type AdminCredential = {
  username: string;
  password: string;
  role: AdminRole;
};

function parseEnvCredential(value: string | undefined, fallbackRole: AdminRole): AdminCredential | null {
  if (!value) {
    return null;
  }

  const [username, password, roleRaw] = value.split(":");
  if (!username || !password) {
    return null;
  }

  const role = roleRaw === "SuperAdmin" || roleRaw === "Editor" ? roleRaw : fallbackRole;
  return { username, password, role };
}

function parseCredentialsList(value: string | undefined): AdminCredential[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => parseEnvCredential(entry.trim(), "Editor"))
    .filter((item): item is AdminCredential => Boolean(item));
}

export function getAdminCredentials(): AdminCredential[] {
  const fromJson = process.env.ADMIN_USERS_JSON;
  if (fromJson) {
    try {
      const parsed = JSON.parse(fromJson) as AdminCredential[];
      return parsed.filter((item) => item?.username && item?.password && item?.role);
    } catch {
      // ignore malformed JSON
    }
  }

  const fromList = parseCredentialsList(process.env.ADMIN_CREDENTIALS);
  if (fromList.length > 0) {
    return fromList;
  }

  const superFromPair = parseEnvCredential(process.env.ADMIN_SUPERADMIN, "SuperAdmin");
  const editorFromPair = parseEnvCredential(process.env.ADMIN_EDITOR, "Editor");

  const creds: AdminCredential[] = [];
  if (superFromPair) creds.push(superFromPair);
  if (editorFromPair) creds.push(editorFromPair);

  return creds;
}

export function isAdminLoginConfigured() {
  return getAdminCredentials().length > 0;
}

export function validateAdminLogin(username: string, password: string): AdminSession | null {
  const trimmedUser = (username || "").trim();
  const trimmedPassword = (password || "").trim();

  const match = getAdminCredentials().find(
    (item) => item.username === trimmedUser && item.password === trimmedPassword
  );

  if (!match) {
    return null;
  }

  return {
    username: match.username,
    role: match.role,
    issuedAt: Date.now(),
  };
}
