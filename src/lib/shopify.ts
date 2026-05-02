import "server-only";

import { getShopifyStorefrontEnv } from "@/lib/env";

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

interface ShopifyFetchOptions {
  buyerIp?: string | null;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  availableForSale: boolean;
  sku: string | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: {
    edges: { node: { url: string; altText: string | null } }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
}

export interface ShopifyProductsPage {
  products: ShopifyProduct[];
  pageInfo: PageInfo;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    sku: string | null;
    availableForSale: boolean;
    price: ShopifyMoney;
    product: {
      title: string;
      handle: string;
      description: string;
      vendor: string;
      productType: string;
      tags: string[];
      images: {
        edges: { node: { url: string; altText: string | null } }[];
      };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoney;
  };
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
}

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: ShopifyFetchOptions = {}
): Promise<T> {
  const { storeDomain, storefrontAccessToken, apiVersion } = getShopifyStorefrontEnv();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (storefrontAccessToken.startsWith("shpat_")) {
    headers["Shopify-Storefront-Private-Token"] = storefrontAccessToken;

    if (options.buyerIp) {
      headers["Shopify-Storefront-Buyer-IP"] = options.buyerIp;
    }
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = storefrontAccessToken;
  }

  const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error("Shopify returned an empty response.");
  }

  return json.data;
}

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  vendor
  productType
  tags
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  images(first: 5) {
    edges {
      node {
        url
        altText
      }
    }
  }
  variants(first: 25) {
    edges {
      node {
        id
        title
        price {
          amount
          currencyCode
        }
        availableForSale
        sku
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            sku
            availableForSale
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              description
              vendor
              productType
              tags
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function assertCart(cart: ShopifyCart | null | undefined, action: string): ShopifyCart {
  if (!cart) {
    throw new Error(`Shopify cart ${action} failed.`);
  }

  return cart;
}

export async function getProductsPage(first = 100, after?: string | null): Promise<ShopifyProductsPage> {
  const data = await shopifyFetch<{
    products: {
      edges: { node: ShopifyProduct }[];
      pageInfo: PageInfo;
    };
  }>(
    `
      query GetProductsPage($first: Int!, $after: String) {
        products(first: $first, after: $after, sortKey: TITLE) {
          edges {
            node {
              ${PRODUCT_FIELDS}
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    { first, after: after ?? null }
  );

  return {
    products: data.products.edges.map((edge) => edge.node),
    pageInfo: data.products.pageInfo,
  };
}

export async function getProducts(first = 24): Promise<ShopifyProduct[]> {
  const page = await getProductsPage(first);
  return page.products;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>(
    `
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          ${PRODUCT_FIELDS}
        }
      }
    `,
    { handle }
  );

  return data.product;
}

export async function getProductsByCollection(
  handle: string,
  first = 24
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    collection: {
      products: {
        edges: { node: ShopifyProduct }[];
      };
    } | null;
  }>(
    `
      query GetCollection($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                ${PRODUCT_FIELDS}
              }
            }
          }
        }
      }
    `,
    { handle, first }
  );

  return data.collection?.products.edges.map((edge) => edge.node) ?? [];
}

export async function getCart(
  cartId: string,
  options: ShopifyFetchOptions = {}
): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{
    cart: ShopifyCart | null;
  }>(
    `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ${CART_FIELDS}
        }
      }
    `,
    { cartId },
    options
  );

  return data.cart;
}

export async function createCart(options: ShopifyFetchOptions = {}): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>(
    `
      mutation CartCreate {
        cartCreate {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            message
          }
        }
      }
    `,
    undefined,
    options
  );

  return assertCart(data.cartCreate.cart, "creation");
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
  options: ShopifyFetchOptions = {}
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>(
    `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    options
  );

  return assertCart(data.cartLinesAdd.cart, "add");
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  options: ShopifyFetchOptions = {}
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>(
    `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    options
  );

  return assertCart(data.cartLinesUpdate.cart, "update");
}

export async function removeFromCart(
  cartId: string,
  lineId: string,
  options: ShopifyFetchOptions = {}
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>(
    `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            message
          }
        }
      }
    `,
    { cartId, lineIds: [lineId] },
    options
  );

  return assertCart(data.cartLinesRemove.cart, "remove");
}
