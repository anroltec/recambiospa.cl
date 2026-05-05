import { NextResponse, type NextRequest } from "next/server";
import { getCustomerSession } from "@/lib/customer-account/session";
import {
  getShopifyCustomerProfile,
  updateShopifyCustomerProfile,
} from "@/lib/customer-account/shopify";
import type { CustomerCompanyProfileInput } from "@/types/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Customer session is required." },
    { status: 401 }
  );
}

function requireNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function parseProfileInput(payload: unknown): CustomerCompanyProfileInput {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid profile payload.");
  }

  const body = payload as Record<string, unknown>;

  return {
    firstName: typeof body.firstName === "string" ? body.firstName.trim() : "",
    lastName: typeof body.lastName === "string" ? body.lastName.trim() : "",
    phone: typeof body.phone === "string" ? body.phone.trim() : "",
    rut: requireNonEmptyString(body.rut, "rut"),
    razonSocial: requireNonEmptyString(body.razonSocial, "razonSocial"),
    giro: requireNonEmptyString(body.giro, "giro"),
    billingAddressLine1: requireNonEmptyString(
      body.billingAddressLine1,
      "billingAddressLine1"
    ),
    billingAddressLine2:
      typeof body.billingAddressLine2 === "string" ? body.billingAddressLine2.trim() : "",
    billingComuna: requireNonEmptyString(body.billingComuna, "billingComuna"),
    billingCity: requireNonEmptyString(body.billingCity, "billingCity"),
    billingRegion:
      typeof body.billingRegion === "string" ? body.billingRegion.trim() : "",
    billingPostalCode:
      typeof body.billingPostalCode === "string" ? body.billingPostalCode.trim() : "",
    billingCountryCode:
      typeof body.billingCountryCode === "string" && body.billingCountryCode.trim()
        ? body.billingCountryCode.trim().toUpperCase()
        : "CL",
    billingNotes:
      typeof body.billingNotes === "string" ? body.billingNotes.trim() : "",
  };
}

export async function GET(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  try {
    const profile = await getShopifyCustomerProfile(session.shopifyCustomerAccessToken);
    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to fetch customer profile.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  try {
    const input = parseProfileInput(payload);
    const profile = await updateShopifyCustomerProfile(
      session.shopifyCustomerAccessToken,
      input
    );

    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update customer profile.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: /required|invalid/i.test(message) ? 400 : 500 }
    );
  }
}
