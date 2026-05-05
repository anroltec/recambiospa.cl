import "server-only";

import {
  getCustomerAccountEnv,
  getShopifyAdminEnv,
  getShopifyStorefrontEnv,
} from "@/lib/env";
import type {
  CustomerCompanyProfile,
  CustomerCompanyProfileInput,
  CustomerOrdersPage,
  CustomerOrderSummary,
} from "@/types/customer";

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

interface CustomerAddress {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  company: string | null;
  countryCodeV2: string | null;
  phone: string | null;
  province: string | null;
  zip: string | null;
}

interface StorefrontCustomer {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  defaultAddress: CustomerAddress | null;
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

interface CustomerMetafieldValues {
  rut: string | null;
  giro: string | null;
  billingComuna: string | null;
  billingNotes: string | null;
}

export interface ShopifyCustomerSessionSeed {
  shopifyCustomerAccessToken: string;
  shopifyCustomerId: string;
  email: string;
  accessTokenExpiresAt: string;
}

async function storefrontCustomerFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { storeDomain, storefrontAccessToken, apiVersion } = getShopifyStorefrontEnv();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (storefrontAccessToken.startsWith("shpat_")) {
    headers["Shopify-Storefront-Private-Token"] = storefrontAccessToken;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = storefrontAccessToken;
  }

  const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as StorefrontGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Shopify Storefront GraphQL error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API returned an empty response.");
  }

  return json.data;
}

async function adminCustomerFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { storeDomain, adminAccessToken, apiVersion } = getShopifyAdminEnv();

  const response = await fetch(
    `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as StorefrontGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Shopify Admin GraphQL error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error("Shopify Admin API returned an empty response.");
  }

  return json.data;
}

function getProfileStatus(profile: CustomerCompanyProfile): CustomerCompanyProfile["profileStatus"] {
  return profile.rut &&
    profile.razonSocial &&
    profile.giro &&
    profile.billingAddressLine1 &&
    profile.billingComuna &&
    profile.billingCity
    ? "complete"
    : "draft";
}

function toShopifyCountryName(countryCode?: string): string {
  if (!countryCode || countryCode.toUpperCase() === "CL") {
    return "Chile";
  }

  return countryCode;
}

function normalizeOptional(value?: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeRut(value: string): string {
  return value.replace(/\./g, "").replace(/\s+/g, "").toUpperCase();
}

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
          phone
          defaultAddress {
            id
            address1
            address2
            city
            company
            countryCodeV2
            phone
            province
            zip
          }
        }
      }
    `,
    { customerAccessToken }
  );

  return data.customer;
}

async function getCustomerMetafields(customerId: string): Promise<CustomerMetafieldValues> {
  const namespace = getCustomerAccountEnv().metafieldNamespace;
  const data = await adminCustomerFetch<{
    customer: {
      rut: { value: string } | null;
      giro: { value: string } | null;
      billingComuna: { value: string } | null;
      billingNotes: { value: string } | null;
    } | null;
  }>(
    `
      query CustomerMetafields($id: ID!, $namespace: String!) {
        customer(id: $id) {
          rut: metafield(namespace: $namespace, key: "rut") {
            value
          }
          giro: metafield(namespace: $namespace, key: "giro") {
            value
          }
          billingComuna: metafield(namespace: $namespace, key: "billing_comuna") {
            value
          }
          billingNotes: metafield(namespace: $namespace, key: "billing_notes") {
            value
          }
        }
      }
    `,
    { id: customerId, namespace }
  );

  return {
    rut: data.customer?.rut?.value ?? null,
    giro: data.customer?.giro?.value ?? null,
    billingComuna: data.customer?.billingComuna?.value ?? null,
    billingNotes: data.customer?.billingNotes?.value ?? null,
  };
}

function mapCustomerProfile(
  customer: StorefrontCustomer,
  metafields: CustomerMetafieldValues
): CustomerCompanyProfile {
  const profile: CustomerCompanyProfile = {
    shopifyCustomerId: customer.id,
    email: customer.email ?? "",
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone ?? customer.defaultAddress?.phone ?? null,
    rut: metafields.rut,
    razonSocial: customer.defaultAddress?.company ?? null,
    giro: metafields.giro,
    billingAddressId: customer.defaultAddress?.id ?? null,
    billingAddressLine1: customer.defaultAddress?.address1 ?? null,
    billingAddressLine2: customer.defaultAddress?.address2 ?? null,
    billingComuna: metafields.billingComuna ?? null,
    billingCity: customer.defaultAddress?.city ?? null,
    billingRegion: customer.defaultAddress?.province ?? null,
    billingPostalCode: customer.defaultAddress?.zip ?? null,
    billingCountryCode: customer.defaultAddress?.countryCodeV2 ?? "CL",
    billingNotes: metafields.billingNotes,
    profileStatus: "draft",
  };

  profile.profileStatus = getProfileStatus(profile);
  return profile;
}

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
    throw new Error(payload.customerUserErrors[0]?.message || "Unable to authenticate customer.");
  }

  if (!payload.customerAccessToken) {
    throw new Error("Shopify did not return a customer access token.");
  }

  const customer = await getStorefrontCustomer(payload.customerAccessToken.accessToken);

  if (!customer?.email) {
    throw new Error("Shopify customer profile is not available for this session.");
  }

  return {
    shopifyCustomerAccessToken: payload.customerAccessToken.accessToken,
    shopifyCustomerId: customer.id,
    email: customer.email,
    accessTokenExpiresAt: payload.customerAccessToken.expiresAt,
  };
}

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

export async function getShopifyCustomerProfile(
  customerAccessToken: string
): Promise<CustomerCompanyProfile> {
  const customer = await getStorefrontCustomer(customerAccessToken);

  if (!customer) {
    throw new Error("Shopify customer session is no longer valid.");
  }

  const metafields = await getCustomerMetafields(customer.id);
  return mapCustomerProfile(customer, metafields);
}

async function updateStorefrontCustomerIdentity(
  customerAccessToken: string,
  input: CustomerCompanyProfileInput
): Promise<void> {
  const data = await storefrontCustomerFetch<{
    customerUpdate: {
      customer: {
        id: string;
      } | null;
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
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
          customerAccessToken {
            accessToken
            expiresAt
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
        phone: normalizeOptional(input.phone),
      },
    }
  );

  const firstError = data.customerUpdate.customerUserErrors[0];

  if (firstError) {
    throw new Error(firstError.message);
  }
}

async function upsertDefaultAddress(
  customerAccessToken: string,
  currentProfile: CustomerCompanyProfile,
  input: CustomerCompanyProfileInput
): Promise<void> {
  const address = {
    address1: input.billingAddressLine1.trim(),
    address2: normalizeOptional(input.billingAddressLine2),
    city: input.billingCity.trim(),
    company: input.razonSocial.trim(),
    country: toShopifyCountryName(input.billingCountryCode),
    firstName: normalizeOptional(input.firstName),
    lastName: normalizeOptional(input.lastName),
    phone: normalizeOptional(input.phone),
    province: normalizeOptional(input.billingRegion),
    zip: normalizeOptional(input.billingPostalCode),
  };

  if (currentProfile.billingAddressId) {
    const data = await storefrontCustomerFetch<{
      customerAddressUpdate: {
        customerAddress: { id: string } | null;
        customerUserErrors: { message: string }[];
      };
    }>(
      `
        mutation CustomerAddressUpdate(
          $address: MailingAddressInput!
          $customerAccessToken: String!
          $id: ID!
        ) {
          customerAddressUpdate(
            address: $address
            customerAccessToken: $customerAccessToken
            id: $id
          ) {
            customerAddress {
              id
            }
            customerUserErrors {
              message
            }
          }
        }
      `,
      {
        address,
        customerAccessToken,
        id: currentProfile.billingAddressId,
      }
    );

    const firstError = data.customerAddressUpdate.customerUserErrors[0];

    if (firstError) {
      throw new Error(firstError.message);
    }

    return;
  }

  const data = await storefrontCustomerFetch<{
    customerAddressCreate: {
      customerAddress: { id: string } | null;
      customerUserErrors: { message: string }[];
    };
  }>(
    `
      mutation CustomerAddressCreate(
        $address: MailingAddressInput!
        $customerAccessToken: String!
      ) {
        customerAddressCreate(
          address: $address
          customerAccessToken: $customerAccessToken
        ) {
          customerAddress {
            id
          }
          customerUserErrors {
            message
          }
        }
      }
    `,
    {
      address,
      customerAccessToken,
    }
  );

  const firstError = data.customerAddressCreate.customerUserErrors[0];

  if (firstError) {
    throw new Error(firstError.message);
  }

  if (data.customerAddressCreate.customerAddress?.id) {
    await storefrontCustomerFetch<{
      customerDefaultAddressUpdate: {
        customer: { id: string } | null;
        customerUserErrors: { message: string }[];
      };
    }>(
      `
        mutation CustomerDefaultAddressUpdate(
          $addressId: ID!
          $customerAccessToken: String!
        ) {
          customerDefaultAddressUpdate(
            addressId: $addressId
            customerAccessToken: $customerAccessToken
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
        addressId: data.customerAddressCreate.customerAddress.id,
        customerAccessToken,
      }
    );
  }
}

async function setCustomerMetafields(
  customerId: string,
  input: CustomerCompanyProfileInput
): Promise<void> {
  const namespace = getCustomerAccountEnv().metafieldNamespace;
  const data = await adminCustomerFetch<{
    metafieldsSet: {
      metafields: { id: string }[];
      userErrors: { message: string }[];
    };
  }>(
    `
      mutation SetCustomerMetafields($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      metafields: [
        {
          ownerId: customerId,
          namespace,
          key: "rut",
          type: "single_line_text_field",
          value: normalizeRut(input.rut),
        },
        {
          ownerId: customerId,
          namespace,
          key: "giro",
          type: "single_line_text_field",
          value: input.giro.trim(),
        },
        {
          ownerId: customerId,
          namespace,
          key: "billing_comuna",
          type: "single_line_text_field",
          value: input.billingComuna.trim(),
        },
        {
          ownerId: customerId,
          namespace,
          key: "billing_notes",
          type: "multi_line_text_field",
          value: input.billingNotes?.trim() || "",
        },
      ],
    }
  );

  const firstError = data.metafieldsSet.userErrors[0];

  if (firstError) {
    throw new Error(firstError.message);
  }
}

export async function updateShopifyCustomerProfile(
  customerAccessToken: string,
  input: CustomerCompanyProfileInput
): Promise<CustomerCompanyProfile> {
  const currentProfile = await getShopifyCustomerProfile(customerAccessToken);

  await updateStorefrontCustomerIdentity(customerAccessToken, input);
  await upsertDefaultAddress(customerAccessToken, currentProfile, input);
  await setCustomerMetafields(currentProfile.shopifyCustomerId, input);

  return getShopifyCustomerProfile(customerAccessToken);
}

export async function getShopifyCustomerOrders(
  customerAccessToken: string,
  first = 20,
  after?: string | null
): Promise<CustomerOrdersPage> {
  const data = await storefrontCustomerFetch<{
    customer: {
      orders: {
        edges: {
          node: StorefrontOrderNode;
        }[];
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
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

  const orders: CustomerOrderSummary[] = data.customer.orders.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    processedAt: node.processedAt,
    financialStatus: node.financialStatus,
    fulfillmentStatus: node.fulfillmentStatus,
    currencyCode: node.totalPrice.currencyCode,
    totalAmount: node.totalPrice.amount,
  }));

  return {
    orders,
    pageInfo: data.customer.orders.pageInfo,
  };
}
