import { cookies } from "next/headers";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const SESSION_COOKIE = "cn_admin_session";

export interface SessionPayload {
  email: string;
  loggedInAt: number;
}

interface StoredCredentials {
  email: string;
  password: string;
  updatedAt: string;
}

const CREDS_DIR = join(process.cwd(), "data");
const CREDS_PATH = join(CREDS_DIR, "admin-credentials.json");

function loadCredentials(): StoredCredentials | null {
  try {
    if (existsSync(CREDS_PATH)) {
      const raw = readFileSync(CREDS_PATH, "utf-8");
      return JSON.parse(raw) as StoredCredentials;
    }
  } catch {
    // fall through
  }
  return null;
}

function saveCredentials(creds: StoredCredentials): void {
  if (!existsSync(CREDS_DIR)) {
    mkdirSync(CREDS_DIR, { recursive: true });
  }
  writeFileSync(CREDS_PATH, JSON.stringify(creds, null, 2), "utf-8");
}

function base64url(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is not set");
  return secret;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64url(new Uint8Array(signature));
}

async function hmacVerify(
  data: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expected = await hmacSign(data, secret);
  return expected === signature;
}

export async function createSession(email: string): Promise<string> {
  const payload: SessionPayload = { email, loggedInAt: Date.now() };
  const body = base64url(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const signature = await hmacSign(body, getSecret());
  return `${body}.${signature}`;
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const [body, signature] = token.split(".");
    if (!body || !signature) return null;

    const valid = await hmacVerify(body, signature, getSecret());
    if (!valid) return null;

    const json = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(body.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
          c.charCodeAt(0)
        )
      )
    ) as SessionPayload;

    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - json.loggedInAt > maxAge) return null;

    return json;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const stored = loadCredentials();
  if (stored && stored.email === email && stored.password === password) {
    return true;
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return email === adminEmail && password === adminPassword;
}

export async function changeCredentials(
  currentPassword: string,
  newPassword: string,
  email?: string
): Promise<{ success: boolean; error?: string }> {
  const stored = loadCredentials();
  const adminEmail = email || process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  const currentValid = stored
    ? stored.password === currentPassword
    : currentPassword === adminPassword;

  if (!currentValid) {
    return { success: false, error: "Current password is incorrect" };
  }

  const targetEmail = stored?.email || adminEmail;
  saveCredentials({
    email: targetEmail,
    password: newPassword,
    updatedAt: new Date().toISOString(),
  });

  return { success: true };
}
