import { NextResponse, type NextRequest } from "next/server";
import { getCustomerSession } from "@/lib/customer-account/session";
import {
  getShopifyCustomerProfile,
  updateShopifyCustomerProfile,
} from "@/lib/customer-account/shopify";
import {
  getSupabaseCustomerProfile,
  upsertSupabaseCustomerProfile,
} from "@/lib/customer-account/supabase";
import {
  resolveCustomerProfile,
  settleCustomerProfileUpdates,
} from "@/lib/customer-account/profile-data";
import type {
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

function logProfileStorageError(operation: "read" | "write", error: unknown) {
  console.error(`[customer-profile] Supabase ${operation} failed`, error);
}

function profileStorageUnavailable() {
  return NextResponse.json(
    {
      ok: false,
      error: "Customer profile storage is temporarily unavailable.",
    },
    { status: 503 }
  );
}

// ── GET /api/customer/profile ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  try {
    const result = await resolveCustomerProfile({
      shopifyProfile: getShopifyCustomerProfile(
        session.shopifyCustomerAccessToken
      ),
      supabaseProfile: getSupabaseCustomerProfile(session.shopifyCustomerId),
    });

    if (!result.profileStorageAvailable) {
      logProfileStorageError("read", result.storageError);
    }

    return NextResponse.json({
      ok: true,
      profile: result.profile,
      profileStorageAvailable: result.profileStorageAvailable,
    });
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

    const updateResult = await settleCustomerProfileUpdates({
      shopifyUpdate: updateShopifyCustomerProfile(
        session.shopifyCustomerAccessToken,
        input
      ),
      supabaseUpdate: upsertSupabaseCustomerProfile(
        session.shopifyCustomerId,
        input
      ),
    });

    if (!updateResult.profileStorageAvailable) {
      if (updateResult.shopifyError) {
        console.error(
          "[customer-profile] Shopify write failed alongside Supabase",
          updateResult.shopifyError
        );
      }
      logProfileStorageError("write", updateResult.storageError);
      return profileStorageUnavailable();
    }

    const result = await resolveCustomerProfile({
      shopifyProfile: getShopifyCustomerProfile(
        session.shopifyCustomerAccessToken
      ),
      supabaseProfile: getSupabaseCustomerProfile(session.shopifyCustomerId),
    });

    if (!result.profileStorageAvailable) {
      logProfileStorageError("read", result.storageError);
      return profileStorageUnavailable();
    }

    return NextResponse.json({
      ok: true,
      profile: result.profile,
      profileStorageAvailable: true,
    });
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
