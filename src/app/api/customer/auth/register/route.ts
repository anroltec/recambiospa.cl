import { NextResponse, type NextRequest } from "next/server";
import {
  createShopifyCustomer,
  authenticateShopifyCustomer,
  getShopifyCustomerProfile,
} from "@/lib/customer-account/shopify";
import { setCustomerSession } from "@/lib/customer-account/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegisterPayload = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

export async function POST(request: NextRequest) {
  let payload: RegisterPayload;

  try {
    payload = (await request.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const email = payload.email?.trim();
  const password = payload.password?.trim();

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email y contraseña son requeridos." },
      { status: 400 },
    );
  }

  if (password.length < 5) {
    return NextResponse.json(
      { ok: false, error: "La contraseña debe tener al menos 5 caracteres." },
      { status: 400 },
    );
  }

  try {
    console.log("[register] step 1 — createShopifyCustomer", email);
    await createShopifyCustomer({
      email,
      password,
      firstName: payload.firstName?.trim() || undefined,
      lastName: payload.lastName?.trim() || undefined,
    });

    console.log("[register] step 2 — authenticateShopifyCustomer");
    const session = await authenticateShopifyCustomer(email, password);

    console.log("[register] step 3 — getShopifyCustomerProfile");
    const profile = await getShopifyCustomerProfile(session.shopifyCustomerAccessToken);

    console.log("[register] success");
    const response = NextResponse.json({ ok: true, profile }, { status: 201 });
    setCustomerSession(response, session);
    return response;
  } catch (error) {
    console.error("[register] error:", error);
    const message = error instanceof Error ? error.message : "No fue posible crear la cuenta.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
