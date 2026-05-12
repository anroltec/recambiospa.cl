import { NextResponse, type NextRequest } from "next/server";
import { sendShopifyCustomerPasswordReset } from "@/lib/customer-account/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RecoverPayload = {
  email?: string;
};

function getBuyerIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  let payload: RecoverPayload;

  try {
    payload = (await request.json()) as RecoverPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const email = payload.email?.trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required." },
      { status: 400 }
    );
  }

  try {
    await sendShopifyCustomerPasswordReset(email, {
      buyerIp: getBuyerIp(request),
    });

    return NextResponse.json(
      {
        ok: true,
        message:
          "If an account exists for that email, we sent a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to start password recovery.";

    return NextResponse.json(
      { ok: false, error: message },
      {
        status: /429/.test(message) ? 429 : 500,
      }
    );
  }
}
