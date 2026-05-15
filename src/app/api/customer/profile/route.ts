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
  CustomerDocumentType,
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

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseProfileInput(payload: unknown): CustomerCompanyProfileInput {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid profile payload.");
  }

  const body = payload as Record<string, unknown>;
  const documentType: CustomerDocumentType =
    body.documentType === "factura" ? "factura" : "boleta";
  const isFactura = documentType === "factura";

  // Company fields are required only when documentType === "factura"
  const companyField = (value: unknown, name: string) =>
    isFactura ? requireNonEmptyString(value, name) : optionalString(value);

  return {
    firstName: optionalString(body.firstName),
    lastName:  optionalString(body.lastName),
    phone:     optionalString(body.phone),
    documentType,
    rut:                 companyField(body.rut,                 "rut"),
    razonSocial:         companyField(body.razonSocial,         "razonSocial"),
    giro:                companyField(body.giro,                "giro"),
    billingAddressLine1: companyField(body.billingAddressLine1, "billingAddressLine1"),
    billingAddressLine2: optionalString(body.billingAddressLine2),
    billingComuna:       companyField(body.billingComuna,       "billingComuna"),
    billingCity:         companyField(body.billingCity,         "billingCity"),
    billingRegion:       optionalString(body.billingRegion),
    billingPostalCode:   optionalString(body.billingPostalCode),
    billingCountryCode:
      typeof body.billingCountryCode === "string" && body.billingCountryCode.trim()
        ? body.billingCountryCode.trim().toUpperCase()
        : "CL",
    billingNotes: optionalString(body.billingNotes),
  };
}

/** Merge Shopify identity skeleton + Supabase company row into a full profile. */
function mergeProfile(
  shopify: CustomerCompanyProfile,
  supabase: SupabaseCustomerRow | null
): CustomerCompanyProfile {
  if (!supabase) return shopify; // new customer — no company data yet

  const documentType = supabase.document_type ?? "boleta";

  const merged: CustomerCompanyProfile = {
    ...shopify,
    documentType,
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

  // Boleta: always complete. Factura: requires full company data.
  merged.profileStatus =
    documentType === "boleta" ||
    (merged.rut &&
      merged.razonSocial &&
      merged.giro &&
      merged.billingAddressLine1 &&
      merged.billingComuna &&
      merged.billingCity)
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
