import { NextResponse, type NextRequest } from "next/server";
import {
  getCustomerSession,
  setCustomerSession,
} from "@/lib/customer-account/session";
import {
  authenticateShopifyCustomer,
  revokeShopifyCustomerAccessToken,
  type ShopifyCustomerSessionSeed,
  updateShopifyCustomerPassword,
} from "@/lib/customer-account/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Customer session is required." },
    { status: 401 }
  );
}

function getErrorStatus(message: string, verifiedSession: boolean): number {
  if (/required|invalid json|match|least 5|short|mismatch/i.test(message)) {
    return 400;
  }

  if (!verifiedSession) {
    return 401;
  }

  if (/forbidden/i.test(message)) {
    return 403;
  }

  if (/password/i.test(message)) {
    return 400;
  }

  return 500;
}

export async function POST(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  let payload: PasswordPayload;

  try {
    payload = (await request.json()) as PasswordPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const currentPassword = payload.currentPassword?.trim();
  const newPassword = payload.newPassword?.trim();
  const confirmPassword = payload.confirmPassword?.trim();

  if (!currentPassword) {
    return NextResponse.json(
      { ok: false, error: "currentPassword is required." },
      { status: 400 }
    );
  }

  if (!newPassword) {
    return NextResponse.json(
      { ok: false, error: "newPassword is required." },
      { status: 400 }
    );
  }

  if (newPassword.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 5 characters long." },
      { status: 400 }
    );
  }

  if (!confirmPassword || newPassword !== confirmPassword) {
    return NextResponse.json(
      { ok: false, error: "Passwords must match." },
      { status: 400 }
    );
  }

  let verifiedSession: ShopifyCustomerSessionSeed | null = null;
  let passwordChanged = false;

  try {
    verifiedSession = await authenticateShopifyCustomer(
      session.email,
      currentPassword
    );

    if (verifiedSession.shopifyCustomerId !== session.shopifyCustomerId) {
      throw new Error("Forbidden customer mismatch.");
    }

    const nextSession = await updateShopifyCustomerPassword(
      verifiedSession.shopifyCustomerAccessToken,
      newPassword
    );

    passwordChanged = true;

    const response = NextResponse.json({ ok: true }, { status: 200 });
    setCustomerSession(response, nextSession);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update password.";

    return NextResponse.json(
      { ok: false, error: message },
      {
        status: getErrorStatus(message, Boolean(verifiedSession)),
      }
    );
  } finally {
    if (verifiedSession && !passwordChanged) {
      try {
        await revokeShopifyCustomerAccessToken(
          verifiedSession.shopifyCustomerAccessToken
        );
      } catch {
        // Keep the original error path unchanged if token cleanup fails.
      }
    }
  }
}
