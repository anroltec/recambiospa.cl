import { NextResponse, type NextRequest } from "next/server";
import { getCustomerSession } from "@/lib/customer-account/session";
import {
  getShopifyCustomerProfile,
  updateShopifyCustomerProfile,
} from "@/lib/customer-account/shopify";
import {
  getSupabaseCustomerProfile,
  upsertSupabaseCustomerProfile,
  type SupabaseCustomerRow,
} from "@/lib/customer-account/supabase";
import type {
  CustomerCompanyProfile,
  CustomerCompanyProfileInput,
} from "@/types/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────────────────────────────────────

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
      typeof body.billingAddressLine2 === "string"
        ? body.billingAddressLine2.trim()
        : "",
    billingComuna: requireNonEmptyString(body.billingComuna, "billingComuna"),
    billingCity: requireNonEmptyString(body.billingCity, "billingCity"),
    billingRegion:
      typeof body.billingRegion === "string" ? body.billingRegion.trim() : "",
    billingPostalCode:
      typeof body.billingPostalCode === "string"
        ? body.billingPostalCode.trim()
        : "",
    billingCountryCode:
      typeof body.billingCountryCode === "string" &&
      body.billingCountryCode.trim()
        ? body.billingCountryCode.trim().toUpperCase()
        : "CL",
    billingNotes:
      typeof body.billingNotes === "string" ? body.billingNotes.trim() : "",
  };
}

/** Merge Shopify identity skeleton + Supabase company row into a full profile. */
function mergeProfile(
  shopify: CustomerCompanyProfile,
  supabase: SupabaseCustomerRow | null
): CustomerCompanyProfile {
  if (!supabase) return shopify; // new customer — no company data yet

  const merged: CustomerCompanyProfile = {
    ...shopify,
    phone: supabase.phone,
    rut: supabase.rut,
    razonSocial: supabase.razon_social,
    giro: supabase.giro,
    billingAddressLine1: supabase.billing_address_line1,
    billingAddressLine2: supabase.billing_address_line2,
    billingComuna: supabase.billing_comuna,
    billingCity: supabase.billing_city,
    billingRegion: supabase.billing_region,
    billingPostalCode: supabase.billing_postal_code,
    billingCountryCode: supabase.billing_country_code ?? "CL",
    billingNotes: supabase.billing_notes,
  };

  // Recalculate completion status after merging
  merged.profileStatus =
    merged.rut &&
    merged.razonSocial &&
    merged.giro &&
    merged.billingAddressLine1 &&
    merged.billingComuna &&
    merged.billingCity
      ? "complete"
      : "draft";

  return merged;
}

// ── GET /api/customer/profile ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  try {
    // Fetch identity (Shopify) and company data (Supabase) in parallel
    const [shopifyProfile, supabaseRow] = await Promise.all([
      getShopifyCustomerProfile(session.shopifyCustomerAccessToken),
      getSupabaseCustomerProfile(session.shopifyCustomerId),
    ]);

    const profile = mergeProfile(shopifyProfile, supabaseRow);
    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch customer profile.",
      },
      { status: 500 }
    );
  }
}

// ── PUT /api/customer/profile ─────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  try {
    const input = parseProfileInput(payload);

    // Update identity in Shopify and company data in Supabase in parallel
    await Promise.all([
      updateShopifyCustomerProfile(session.shopifyCustomerAccessToken, input),
      upsertSupabaseCustomerProfile(session.shopifyCustomerId, input),
    ]);

    // Re-fetch both sources in parallel and return merged result
    const [shopifyProfile, supabaseRow] = await Promise.all([
      getShopifyCustomerProfile(session.shopifyCustomerAccessToken),
      getSupabaseCustomerProfile(session.shopifyCustomerId),
    ]);

    const profile = mergeProfile(shopifyProfile, supabaseRow);
    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update customer profile.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: /required|invalid/i.test(message) ? 400 : 500 }
    );
  }
}
