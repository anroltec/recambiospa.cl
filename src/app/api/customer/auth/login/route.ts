import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateShopifyCustomer,
  getShopifyCustomerProfile,
} from "@/lib/customer-account/shopify";
import { setCustomerSession } from "@/lib/customer-account/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  let payload: LoginPayload;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const email = payload.email?.trim();
  const password = payload.password?.trim();

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "email and password are required." },
      { status: 400 }
    );
  }

  try {
    const session = await authenticateShopifyCustomer(email, password);
    const response = NextResponse.json(
      {
        ok: true,
        profile: await getShopifyCustomerProfile(session.shopifyCustomerAccessToken),
      },
      { status: 200 }
    );

    setCustomerSession(response, session);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to log in customer.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      {
        status: /not implemented/i.test(message) ? 501 : 401,
      }
    );
  }
}
