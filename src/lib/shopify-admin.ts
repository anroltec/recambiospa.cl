import "server-only";

import { getShopifyAdminEnv } from "@/lib/env";

interface ShopifyGraphQLError {
  message: string;
}

interface Money {
  amount: string;
  currencyCode: string;
}

interface ShopifyMailingAddress {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  countryCodeV2: string | null;
  phone: string | null;
}

export interface ShopifyOrderLineItemForSync {
  id: string;
  sku: string | null;
  quantity: number;
  name: string;
  title: string;
  vendor: string | null;
  variantTitle: string | null;
  originalUnitPriceSet: { shopMoney: Money };
  discountedTotalSet: { shopMoney: Money };
  product: {
    id: string;
    handle: string;
    title: string;
  } | null;
  variant: {
    id: string;
    sku: string | null;
    title: string;
  } | null;
}

export interface ShopifyOrderForDefontanaSync {
  id: string;
  legacyResourceId: string;
  name: string;
  createdAt: string;
  processedAt: string | null;
  displayFinancialStatus: string;
  currencyCode: string;
  email: string | null;
  phone: string | null;
  note: string | null;
  subtotalPriceSet: { shopMoney: Money };
  totalTaxSet: { shopMoney: Money };
  totalPriceSet: { shopMoney: Money };
  shippingLine: {
    title: string | null;
    originalPriceSet: { shopMoney: Money } | null;
  } | null;
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  billingAddress: ShopifyMailingAddress | null;
  shippingAddress: ShopifyMailingAddress | null;
  lineItems: ShopifyOrderLineItemForSync[];
}

async function shopifyAdminFetch<T>(
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

  const json = (await response.json()) as {
    data?: T;
    errors?: ShopifyGraphQLError[];
  };

  if (json.errors?.length) {
    throw new Error(`Shopify Admin GraphQL error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error("Shopify Admin API returned an empty response.");
  }

  return json.data;
}

function normalizeOrderId(orderId: string): string {
  return orderId.startsWith("gid://shopify/Order/")
    ? orderId
    : `gid://shopify/Order/${orderId}`;
}

export async function getOrderForDefontanaSync(
  orderId: string
): Promise<ShopifyOrderForDefontanaSync> {
  const data = await shopifyAdminFetch<{
    order: {
      id: string;
      legacyResourceId: string;
      name: string;
      createdAt: string;
      processedAt: string | null;
      displayFinancialStatus: string;
      currencyCode: string;
      email: string | null;
      phone: string | null;
      note: string | null;
      subtotalPriceSet: { shopMoney: Money };
      totalTaxSet: { shopMoney: Money };
      totalPriceSet: { shopMoney: Money };
      shippingLine: {
        title: string | null;
        originalPriceSet: { shopMoney: Money } | null;
      } | null;
      customer: ShopifyOrderForDefontanaSync["customer"];
      billingAddress: ShopifyMailingAddress | null;
      shippingAddress: ShopifyMailingAddress | null;
      lineItems: {
        edges: {
          node: ShopifyOrderLineItemForSync;
        }[];
      };
    } | null;
  }>(
    `
      query GetOrderForDefontanaSync($id: ID!) {
        order(id: $id) {
          id
          legacyResourceId
          name
          createdAt
          processedAt
          displayFinancialStatus
          currencyCode
          email
          phone
          note
          subtotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          totalTaxSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          shippingLine {
            title
            originalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
          customer {
            id
            firstName
            lastName
            email
            phone
          }
          billingAddress {
            firstName
            lastName
            company
            address1
            address2
            city
            province
            zip
            country
            countryCodeV2
            phone
          }
          shippingAddress {
            firstName
            lastName
            company
            address1
            address2
            city
            province
            zip
            country
            countryCodeV2
            phone
          }
          lineItems(first: 100) {
            edges {
              node {
                id
                sku
                quantity
                name
                title
                vendor
                variantTitle
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedTotalSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                product {
                  id
                  handle
                  title
                }
                variant {
                  id
                  sku
                  title
                }
              }
            }
          }
        }
      }
    `,
    { id: normalizeOrderId(orderId) }
  );

  if (!data.order) {
    throw new Error(`Shopify order not found: ${orderId}`);
  }

  return {
    ...data.order,
    lineItems: data.order.lineItems.edges.map((edge) => edge.node),
  };
}
