import assert from "node:assert/strict";
import test from "node:test";
import type { CustomerCompanyProfile } from "../../types/customer";
import type { SupabaseCustomerRow } from "./supabase";
import {
  resolveCustomerProfile,
  settleCustomerProfileUpdates,
} from "./profile-data.ts";

const SHOPIFY_PROFILE: CustomerCompanyProfile = {
  shopifyCustomerId: "gid://shopify/Customer/123",
  email: "cliente@example.com",
  firstName: "Ana",
  lastName: "Pérez",
  phone: null,
  documentType: "boleta",
  rut: null,
  razonSocial: null,
  giro: null,
  billingAddressId: null,
  billingAddressLine1: null,
  billingAddressLine2: null,
  billingComuna: null,
  billingCity: null,
  billingRegion: null,
  billingPostalCode: null,
  billingCountryCode: "CL",
  billingNotes: null,
  profileStatus: "draft",
};

test("keeps Shopify profile data available when Supabase reads fail", async () => {
  const storageError = new Error("Supabase unavailable");
  const result = await resolveCustomerProfile({
    shopifyProfile: Promise.resolve(SHOPIFY_PROFILE),
    supabaseProfile: Promise.reject(storageError),
  });

  assert.deepEqual(result, {
    profile: SHOPIFY_PROFILE,
    profileStorageAvailable: false,
    storageError,
  });
});

test("merges stored company data when Supabase is available", async () => {
  const supabaseProfile: SupabaseCustomerRow = {
    shopify_id: SHOPIFY_PROFILE.shopifyCustomerId,
    document_type: "factura",
    phone: "+56911111111",
    rut: "76123456-7",
    razon_social: "Transportes Pérez SpA",
    giro: "Transporte",
    billing_address_line1: "Av. Principal 123",
    billing_address_line2: null,
    billing_comuna: "Santiago",
    billing_city: "Santiago",
    billing_region: "RM",
    billing_postal_code: null,
    billing_country_code: "CL",
    billing_notes: null,
  };

  const result = await resolveCustomerProfile({
    shopifyProfile: Promise.resolve(SHOPIFY_PROFILE),
    supabaseProfile: Promise.resolve(supabaseProfile),
  });

  assert.deepEqual(result, {
    profile: {
      ...SHOPIFY_PROFILE,
      documentType: "factura",
      phone: "+56911111111",
      rut: "76123456-7",
      razonSocial: "Transportes Pérez SpA",
      giro: "Transporte",
      billingAddressLine1: "Av. Principal 123",
      billingAddressLine2: null,
      billingComuna: "Santiago",
      billingCity: "Santiago",
      billingRegion: "RM",
      billingPostalCode: null,
      billingCountryCode: "CL",
      billingNotes: null,
      profileStatus: "complete",
    },
    profileStorageAvailable: true,
    storageError: null,
  });
});

test("identifies a Supabase write outage without hiding a successful Shopify update", async () => {
  const storageError = new Error("Supabase unavailable");
  const result = await settleCustomerProfileUpdates({
    shopifyUpdate: Promise.resolve(),
    supabaseUpdate: Promise.reject(storageError),
  });

  assert.deepEqual(result, {
    profileStorageAvailable: false,
    storageError,
    shopifyError: null,
  });
});

test("prioritizes storage unavailability when both profile updates fail", async () => {
  const shopifyError = new Error("Shopify unavailable");
  const storageError = new Error("Supabase unavailable");
  const result = await settleCustomerProfileUpdates({
    shopifyUpdate: Promise.reject(shopifyError),
    supabaseUpdate: Promise.reject(storageError),
  });

  assert.deepEqual(result, {
    profileStorageAvailable: false,
    storageError,
    shopifyError,
  });
});

test(
  "falls back to Shopify when a Supabase read exceeds its deadline",
  { timeout: 300 },
  async () => {
    const result = await resolveCustomerProfile({
      shopifyProfile: Promise.resolve(SHOPIFY_PROFILE),
      supabaseProfile: new Promise(() => {}),
      storageTimeoutMs: 20,
    });

    assert.equal(result?.profile, SHOPIFY_PROFILE);
    assert.equal(result?.profileStorageAvailable, false);
    assert.equal(
      (result?.storageError as Error | undefined)?.name,
      "CustomerProfileStorageTimeoutError"
    );
  }
);

test(
  "reports storage unavailable when a Supabase write exceeds its deadline",
  { timeout: 300 },
  async () => {
    const result = await settleCustomerProfileUpdates({
      shopifyUpdate: Promise.resolve(),
      supabaseUpdate: new Promise(() => {}),
      storageTimeoutMs: 20,
    });

    assert.equal(result?.profileStorageAvailable, false);
    assert.equal(result?.shopifyError, null);
    assert.equal(
      (result?.storageError as Error | undefined)?.name,
      "CustomerProfileStorageTimeoutError"
    );
  }
);

test(
  "returns the storage timeout even when the Shopify update is still pending",
  { timeout: 300 },
  async () => {
    const result = await settleCustomerProfileUpdates({
      shopifyUpdate: new Promise(() => {}),
      supabaseUpdate: new Promise(() => {}),
      storageTimeoutMs: 20,
    });

    assert.equal(result.profileStorageAvailable, false);
    assert.equal(result.shopifyError, null);
    assert.equal(
      (result.storageError as Error | undefined)?.name,
      "CustomerProfileStorageTimeoutError"
    );
  }
);
