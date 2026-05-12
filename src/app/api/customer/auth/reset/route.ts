import { NextResponse, type NextRequest } from "next/server";
import { setCustomerSession } from "@/lib/customer-account/session";
import { resetShopifyCustomerPasswordByUrl } from "@/lib/customer-account/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResetPayload = {
  resetUrl?: string;
  password?: string;
  confirmPassword?: string;
};

function getErrorStatus(message: string): number {
  if (/required|invalid|match|least 5|short|expired|password/i.test(message)) {
    return 400;
  }

  return 500;
}

export async function POST(request: NextRequest) {
  let payload: ResetPayload;

  try {
    payload = (await request.json()) as ResetPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const resetUrl = payload.resetUrl?.trim();
  const password = payload.password?.trim();
  const confirmPassword = payload.confirmPassword?.trim();

  if (!resetUrl) {
    return NextResponse.json(
      { ok: false, error: "resetUrl is required." },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { ok: false, error: "password is required." },
      { status: 400 }
    );
  }

  if (password.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 5 characters long." },
      { status: 400 }
    );
  }

  if (!confirmPassword || password !== confirmPassword) {
    return NextResponse.json(
      { ok: false, error: "Passwords must match." },
      { status: 400 }
    );
  }

  try {
    const session = await resetShopifyCustomerPasswordByUrl(resetUrl, password);
    const response = NextResponse.json({ ok: true }, { status: 200 });
    setCustomerSession(response, session);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reset password.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: getErrorStatus(message) }
    );
  }
}
