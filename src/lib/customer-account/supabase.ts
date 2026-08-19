import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { CustomerCompanyProfileInput, CustomerDocumentType } from "@/types/customer";
import { CUSTOMER_PROFILE_STORAGE_TIMEOUT_MS } from "@/lib/customer-account/profile-data";

// ── Internal helpers ──────────────────────────────────────────────────────────

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }
  // service_role bypasses RLS — only used server-side, never exposed to the browser
  return createClient(url, key, { auth: { persistSession: false } });
}

function normalizeRut(value: string): string {
  return value.replace(/\./g, "").replace(/\s+/g, "").toUpperCase();
}

function trim(v?: string | null): string | null {
  const s = v?.trim();
  return s ? s : null;
}

// ── Public shape returned to callers ─────────────────────────────────────────

export interface SupabaseCustomerRow {
  shopify_id: string;
  document_type: CustomerDocumentType;
  phone: string | null;
  rut: string | null;
  razon_social: string | null;
  giro: string | null;
  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_comuna: string | null;
  billing_city: string | null;
  billing_region: string | null;
  billing_postal_code: string | null;
  billing_country_code: string | null;
  billing_notes: string | null;
}

const SELECT_COLS = [
  "shopify_id",
  "document_type",
  "phone",
  "rut",
  "razon_social",
  "giro",
  "billing_address_line1",
  "billing_address_line2",
  "billing_comuna",
  "billing_city",
  "billing_region",
  "billing_postal_code",
  "billing_country_code",
  "billing_notes",
].join(",");

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getSupabaseCustomerProfile(
  shopifyId: string
): Promise<SupabaseCustomerRow | null> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("customer_profiles")
    .select(SELECT_COLS)
    .eq("shopify_id", shopifyId)
    .abortSignal(AbortSignal.timeout(CUSTOMER_PROFILE_STORAGE_TIMEOUT_MS))
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase read error: ${error.message}`);
  }

  return data as SupabaseCustomerRow | null;
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function upsertSupabaseCustomerProfile(
  shopifyId: string,
  input: CustomerCompanyProfileInput
): Promise<void> {
  const supabase = getClient();

  const row: SupabaseCustomerRow = {
    shopify_id: shopifyId,
    document_type: input.documentType,
    phone: trim(input.phone),
    rut: input.rut ? normalizeRut(input.rut) : null,
    razon_social: trim(input.razonSocial),
    giro: trim(input.giro),
    billing_address_line1: trim(input.billingAddressLine1),
    billing_address_line2: trim(input.billingAddressLine2),
    billing_comuna: trim(input.billingComuna),
    billing_city: trim(input.billingCity),
    billing_region: trim(input.billingRegion),
    billing_postal_code: trim(input.billingPostalCode),
    billing_country_code: input.billingCountryCode?.trim().toUpperCase() || "CL",
    billing_notes: trim(input.billingNotes),
  };

  const { error } = await supabase
    .from("customer_profiles")
    .upsert(row, { onConflict: "shopify_id" })
    .abortSignal(AbortSignal.timeout(CUSTOMER_PROFILE_STORAGE_TIMEOUT_MS));

  if (error) {
    throw new Error(`Supabase write error: ${error.message}`);
  }
}
