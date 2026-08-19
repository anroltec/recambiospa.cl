import type { CustomerCompanyProfile } from "@/types/customer";
import type { SupabaseCustomerRow } from "@/lib/customer-account/supabase";

interface CustomerProfileSources {
  shopifyProfile: Promise<CustomerCompanyProfile>;
  supabaseProfile: Promise<SupabaseCustomerRow | null>;
  storageTimeoutMs?: number;
}

interface CustomerProfileUpdates {
  shopifyUpdate: Promise<void>;
  supabaseUpdate: Promise<void>;
  storageTimeoutMs?: number;
}

export const CUSTOMER_PROFILE_STORAGE_TIMEOUT_MS = 5_000;

export class CustomerProfileStorageTimeoutError extends Error {
  constructor() {
    super("Customer profile storage timed out.");
    this.name = "CustomerProfileStorageTimeoutError";
  }
}

export interface ResolvedCustomerProfile {
  profile: CustomerCompanyProfile;
  profileStorageAvailable: boolean;
  storageError: unknown | null;
}

export interface SettledCustomerProfileUpdates {
  profileStorageAvailable: boolean;
  storageError: unknown | null;
  shopifyError: unknown | null;
}

function withCustomerProfileStorageTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new CustomerProfileStorageTimeoutError()),
      timeoutMs
    );
  });

  return Promise.race([operation, timeout]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

function mergeCustomerProfile(
  shopify: CustomerCompanyProfile,
  supabase: SupabaseCustomerRow | null
): CustomerCompanyProfile {
  if (!supabase) return shopify;

  const documentType = supabase.document_type ?? "boleta";
  const profile: CustomerCompanyProfile = {
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
    profileStatus: "draft",
  };

  profile.profileStatus =
    documentType === "boleta" ||
    Boolean(
      profile.rut &&
        profile.razonSocial &&
        profile.giro &&
        profile.billingAddressLine1 &&
        profile.billingComuna &&
        profile.billingCity
    )
      ? "complete"
      : "draft";

  return profile;
}

export async function resolveCustomerProfile(
  sources: CustomerProfileSources
): Promise<ResolvedCustomerProfile> {
  const storedProfile = withCustomerProfileStorageTimeout(
    sources.supabaseProfile,
    sources.storageTimeoutMs ?? CUSTOMER_PROFILE_STORAGE_TIMEOUT_MS
  ).then(
    (profile) => ({ available: true as const, profile, error: null }),
    (error: unknown) => ({ available: false as const, profile: null, error })
  );

  const [shopifyProfile, storage] = await Promise.all([
    sources.shopifyProfile,
    storedProfile,
  ]);

  return {
    profile: mergeCustomerProfile(shopifyProfile, storage.profile),
    profileStorageAvailable: storage.available,
    storageError: storage.error,
  };
}

export async function settleCustomerProfileUpdates(
  updates: CustomerProfileUpdates
): Promise<SettledCustomerProfileUpdates> {
  let shopifySettled = false;
  let observedShopifyError: unknown | null = null;
  const shopifyResult = updates.shopifyUpdate.then(
    () => {
      shopifySettled = true;
      return { ok: true as const };
    },
    (error: unknown) => {
      shopifySettled = true;
      observedShopifyError = error;
      return { ok: false as const, error };
    }
  );

  const storageUpdate = withCustomerProfileStorageTimeout(
    updates.supabaseUpdate,
    updates.storageTimeoutMs ?? CUSTOMER_PROFILE_STORAGE_TIMEOUT_MS
  );
  const storageResult = await storageUpdate.then(
    () => ({ ok: true as const }),
    (error: unknown) => ({ ok: false as const, error })
  );

  if (!storageResult.ok) {
    return {
      profileStorageAvailable: false,
      storageError: storageResult.error,
      shopifyError: shopifySettled ? observedShopifyError : null,
    };
  }

  const completedShopifyResult = await shopifyResult;
  if (!completedShopifyResult.ok) {
    throw completedShopifyResult.error;
  }

  return {
    profileStorageAvailable: true,
    storageError: null,
    shopifyError: null,
  };
}
