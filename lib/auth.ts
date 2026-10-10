import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "alsalam_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function secret(): string {
  return process.env.JWT_SECRET ?? "alsalam-dev-secret";
}

function adminUser(): string {
  return process.env.ADMIN_USERNAME ?? "admin";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createToken(): string {
  const expiry = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${adminUser()}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const index = token.lastIndexOf(".");
  if (index < 0) return false;
  const payload = token.slice(0, index);
  const signature = token.slice(index + 1);
  if (!safeEqual(signature, sign(payload))) return false;
  const expiry = Number(payload.slice(payload.lastIndexOf(".") + 1));
  return Number.isFinite(expiry) && expiry > Date.now();
}

export function verifyCredentials(user: string, password: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(user, adminUser()) && safeEqual(password, expected);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}
