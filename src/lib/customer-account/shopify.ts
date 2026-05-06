import "server-only";

import {
  getCustomerAccountEnv,
  getShopifyStorefrontEnv,
} from "@/lib/env";
import type {
  CustomerCompanyProfile,
  CustomerCompanyProfileInput,
  CustomerOrdersPage,
  CustomerOrderSummary,
} from "@/types/customer";

// ── GraphQL types ─────────────────────────────────────────────────────────────

interface ShopifyGraphQLError {
  message: string;
}

interface StorefrontGraphQLResponse<T> {
  data?: T;
  errors?: ShopifyGraphQLError[];
}

interface CustomerAccessTokenPayload {
  customerAccessToken: {
    accessToken: string;
    expiresAt: string;
  } | null;
  customerUserErrors: {
    code?: string;
    field?: string[];
    message: string;
  }[];
}

interface StorefrontCustomer {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

interface StorefrontOrderNode {
  id: string;
  name: string;
  processedAt: string | null;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface ShopifyCustomerSessionSeed {
  shopifyCustomerAccessToken: string;
  shopifyCustomerId: string;
  email: string;
  accessTokenExpiresAt: string;
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function storefrontCustomerFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { storeDomain, storefrontAccessToken, apiVersion } =
    getShopifyStorefrontEnv();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (storefrontAccessToken.startsWith("shpat_")) {
    headers["Shopify-Storefront-Private-Token"] = storefrontAccessToken;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = storefrontAccessToken;
  }

  const response = await fetch(
    `https://${storeDomain}/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Shopify Storefront API error: ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as StorefrontGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `Shopify Storefront GraphQL error: ${json.errors[0].message}`
    );
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API returned an empty response.");
  }

  return json.data;
}

// ── Internal: fetch bare Shopify identity ─────────────────────────────────────

async function getStorefrontCustomer(
  customerAccessToken: string
): Promise<StorefrontCustomer | null> {
  const data = await storefrontCustomerFetch<{
    customer: StorefrontCustomer | null;
  }>(
    `
      query CurrentCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
        }
      }
    `,
    { customerAccessToken }
  );

  return data.customer;
}

// ── Internal: map Shopify identity → CustomerCompanyProfile skeleton ──────────
// Company/billing fields are intentionally null here.
// The profile route merges them from Supabase.

function mapCustomerIdentity(customer: StorefrontCustomer): CustomerCompanyProfile {
  const profile: CustomerCompanyProfile = {
    shopifyCustomerId: customer.id,
    email: customer.email ?? "",
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: null,
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
  return profile;
}

function normalizeOptional(value?: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

// ── Customer creation ─────────────────────────────────────────────────────────

interface CustomerCreatePayload {
  customer: { id: string; email: string | null } | null;
  customerUserErrors: { code?: string; field?: string[]; message: string }[];
}

export async function createShopifyCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  const data = await storefrontCustomerFetch<{
    customerCreate: CustomerCreatePayload;
  }>(
    `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    { input }
  );

  const payload = data.customerCreate;

  if (payload.customerUserErrors.length) {
    throw new Error(
      payload.customerUserErrors[0]?.message ?? "Unable to create customer."
    );
  }

  if (!payload.customer) {
    throw new Error("Shopify did not return a customer after creation.");
  }
}

// ── Authentication ────────────────────────────────────────────────────────────

export async function authenticateShopifyCustomer(
  email: string,
  password: string
): Promise<ShopifyCustomerSessionSeed> {
  if (getCustomerAccountEnv().authMode !== "storefront") {
    throw new Error(
      "SHOPIFY_CUSTOMER_AUTH_MODE=customer-account-api is not implemented in this module yet."
    );
  }

  const data = await storefrontCustomerFetch<{
    customerAccessTokenCreate: CustomerAccessTokenPayload;
  }>(
    `
      mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    { input: { email, password } }
  );

  const payload = data.customerAccessTokenCreate;

  if (payload.customerUserErrors.length) {
    throw new Error(
      payload.customerUserErrors[0]?.message || "Unable to authenticate customer."
    );
  }

  if (!payload.customerAccessToken) {
    throw new Error("Shopify did not return a customer access token.");
  }

  const customer = await getStorefrontCustomer(
    payload.customerAccessToken.accessToken
  );

  if (!customer?.email) {
    throw new Error(
      "Shopify customer profile is not available for this session."
    );
  }

  return {
    shopifyCustomerAccessToken: payload.customerAccessToken.accessToken,
    shopifyCustomerId: customer.id,
    email: customer.email,
    accessTokenExpiresAt: payload.customerAccessToken.expiresAt,
  };
}

// ── Token revocation ──────────────────────────────────────────────────────────

export async function revokeShopifyCustomerAccessToken(
  customerAccessToken: string
): Promise<void> {
  if (getCustomerAccountEnv().authMode !== "storefront") {
    return;
  }

  const data = await storefrontCustomerFetch<{
    customerAccessTokenDelete: {
      deletedAccessToken: string | null;
      deletedCustomerAccessTokenId: string | null;
      userErrors: { message: string }[];
    };
  }>(
    `
      mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
          deletedAccessToken
          deletedCustomerAccessTokenId
          userErrors {
            message
          }
        }
      }
    `,
    { customerAccessToken }
  );

  const firstError = data.customerAccessTokenDelete.userErrors[0];

  if (firstError) {
    throw new Error(firstError.message);
  }
}

// ── Profile read (Shopify identity only — company data comes from Supabase) ───

export async function getShopifyCustomerProfile(
  customerAccessToken: string
): Promise<CustomerCompanyProfile> {
  const customer = await getStorefrontCustomer(customerAccessToken);

  if (!customer) {
    throw new Error("Shopify customer session is no longer valid.");
  }

  return mapCustomerIdentity(customer);
}

// ── Profile update (identity fields only — company data goes to Supabase) ─────

export async function updateShopifyCustomerProfile(
  customerAccessToken: string,
  input: CustomerCompanyProfileInput
): Promise<void> {
  const data = await storefrontCustomerFetch<{
    customerUpdate: {
      customer: { id: string } | null;
      customerUserErrors: { message: string }[];
    };
  }>(
    `
      mutation CustomerUpdate(
        $customerAccessToken: String!
        $customer: CustomerUpdateInput!
      ) {
        customerUpdate(
          customerAccessToken: $customerAccessToken
          customer: $customer
        ) {
          customer {
            id
          }
          customerUserErrors {
            message
          }
        }
      }
    `,
    {
      customerAccessToken,
      customer: {
        firstName: normalizeOptional(input.firstName),
        lastName: normalizeOptional(input.lastName),
        // phone is managed exclusively in Supabase — Shopify rejects
        // Chilean +56 format and it is not needed for order fulfillment
      },
    }
  );

  const firstError = data.customerUpdate.customerUserErrors[0];

  if (firstError) {
    throw new Error(firstError.message);
  }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getShopifyCustomerOrders(
  customerAccessToken: string,
  first = 20,
  after?: string | null
): Promise<CustomerOrdersPage> {
  const data = await storefrontCustomerFetch<{
    customer: {
      orders: {
        edges: { node: StorefrontOrderNode }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    } | null;
  }>(
    `
      query CustomerOrders(
        $customerAccessToken: String!
        $first: Int!
        $after: String
      ) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: $first, after: $after, reverse: true, sortKey: PROCESSED_AT) {
            edges {
              node {
                id
                name
                processedAt
                financialStatus
                fulfillmentStatus
                totalPrice {
                  amount
                  currencyCode
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `,
    {
      customerAccessToken,
      first,
      after: after ?? null,
    }
  );

  if (!data.customer) {
    throw new Error("Shopify customer session is no longer valid.");
  }

  const orders: CustomerOrderSummary[] = data.customer.orders.edges.map(
    ({ node }) => ({
      id: node.id,
      name: node.name,
      processedAt: node.processedAt,
      financialStatus: node.financialStatus,
      fulfillmentStatus: node.fulfillmentStatus,
      currencyCode: node.totalPrice.currencyCode,
      totalAmount: node.totalPrice.amount,
    })
  );

  return {
    orders,
    pageInfo: data.customer.orders.pageInfo,
  };
}
