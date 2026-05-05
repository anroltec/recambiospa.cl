import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { getCustomerAccountEnv } from "@/lib/env";

export interface CustomerSessionState {
  shopifyCustomerAccessToken: string;
  shopifyCustomerId: string;
  email: string;
  accessTokenExpiresAt: string;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function getCookieName(): string {
  return getCustomerAccountEnv().sessionCookieName;
}

function buildCookieValue(session: CustomerSessionState): string {
  const { sessionSecret } = getCustomerAccountEnv();
  const payload = encodeBase64Url(JSON.stringify(session));
  const signature = signValue(payload, sessionSecret);
  return `${payload}.${signature}`;
}

function parseCookieValue(rawValue: string): CustomerSessionState | null {
  const { sessionSecret } = getCustomerAccountEnv();
  const [payload, signature] = rawValue.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signValue(payload, sessionSecret);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as CustomerSessionState;

    if (
      !parsed.shopifyCustomerAccessToken ||
      !parsed.shopifyCustomerId ||
      !parsed.email ||
      !parsed.accessTokenExpiresAt
    ) {
      return null;
    }

    if (Number.isNaN(Date.parse(parsed.accessTokenExpiresAt))) {
      return null;
    }

    if (Date.parse(parsed.accessTokenExpiresAt) <= Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getCustomerSession(request: NextRequest): CustomerSessionState | null {
  const rawValue = request.cookies.get(getCookieName())?.value;

  if (!rawValue) {
    return null;
  }

  return parseCookieValue(rawValue);
}

export function setCustomerSession(
  response: NextResponse,
  session: CustomerSessionState
): void {
  const expiresAt = Date.parse(session.accessTokenExpiresAt);
  const maxAge = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

  response.cookies.set({
    name: getCookieName(),
    value: buildCookieValue(session),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
    expires: new Date(expiresAt),
  });
}

export function clearCustomerSession(response: NextResponse): void {
  response.cookies.set({
    name: getCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}
