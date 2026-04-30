import "server-only";

import { getDefontanaEnv } from "@/lib/env";
import type { ShopifyOrderForDefontanaSync } from "@/lib/shopify-admin";

interface DefontanaAuthResponse {
  access_token: string | null;
  expires_in: number;
  token_type: string | null;
  success: boolean;
  message: string | null;
}

export interface DefontanaSyncLineDraft {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface DefontanaSaleDraft {
  externalOrderId: string;
  shopifyOrderName: string;
  financialStatus: string;
  currencyCode: string;
  customer: {
    fullName: string;
    email: string | null;
    phone: string | null;
  };
  billingAddress: ShopifyOrderForDefontanaSync["billingAddress"];
  shippingAddress: ShopifyOrderForDefontanaSync["shippingAddress"];
  sellerCode: string | null;
  warehouseCode: string | null;
  priceListCode: string | null;
  documentType: string | null;
  subtotal: number;
  tax: number;
  total: number;
  shippingAmount: number;
  lines: DefontanaSyncLineDraft[];
  note: string | null;
}

export interface DefontanaPreparedOrderSync {
  status: "draft";
  draft: DefontanaSaleDraft;
}

type DefontanaRequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
};

let cachedToken:
  | {
      value: string;
      expiresAt: number;
    }
  | null = null;
let tokenPromise: Promise<string> | null = null;

function isTokenValid(): boolean {
  return Boolean(cachedToken && cachedToken.expiresAt > Date.now() + 60_000);
}

function safeNumber(value: string): number {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric value received from Shopify: ${value}`);
  }

  return parsed;
}

function buildCustomerName(order: ShopifyOrderForDefontanaSync): string {
  const firstName =
    order.customer?.firstName ||
    order.billingAddress?.firstName ||
    order.shippingAddress?.firstName ||
    "";
  const lastName =
    order.customer?.lastName ||
    order.billingAddress?.lastName ||
    order.shippingAddress?.lastName ||
    "";

  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || "Cliente Shopify";
}

async function loginDefontana(): Promise<string> {
  const env = getDefontanaEnv();
  const searchParams = new URLSearchParams({
    Client: env.client,
    Company: env.company,
    User: env.user,
    Password: env.password,
  });

  const response = await fetch(`${env.authUrl}?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Defontana auth error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as DefontanaAuthResponse;

  if (!data.success || !data.access_token) {
    throw new Error(data.message || "Defontana login failed.");
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function getDefontanaAccessToken(): Promise<string> {
  if (isTokenValid()) {
    return cachedToken!.value;
  }

  if (!tokenPromise) {
    tokenPromise = loginDefontana().finally(() => {
      tokenPromise = null;
    });
  }

  return tokenPromise;
}

export async function defontanaFetch<T>(
  path: string,
  options: DefontanaRequestOptions = {}
): Promise<T> {
  const env = getDefontanaEnv();
  const token = await getDefontanaAccessToken();
  const url = new URL(path.startsWith("http") ? path : `${env.baseUrl}${path}`);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === null || value === undefined || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Defontana API error: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export function buildDefontanaSaleDraftFromShopifyOrder(
  order: ShopifyOrderForDefontanaSync
): DefontanaSaleDraft {
  const env = getDefontanaEnv();

  const lines = order.lineItems.map((line) => {
    const sku = line.sku || line.variant?.sku;

    if (!sku) {
      throw new Error(`Shopify line item ${line.id} is missing a SKU.`);
    }

    return {
      sku,
      description: line.name,
      quantity: line.quantity,
      unitPrice: safeNumber(line.originalUnitPriceSet.shopMoney.amount),
      lineTotal: safeNumber(line.discountedTotalSet.shopMoney.amount),
    };
  });

  return {
    externalOrderId: order.legacyResourceId,
    shopifyOrderName: order.name,
    financialStatus: order.displayFinancialStatus,
    currencyCode: order.currencyCode,
    customer: {
      fullName: buildCustomerName(order),
      email: order.email || order.customer?.email || null,
      phone: order.phone || order.customer?.phone || null,
    },
    billingAddress: order.billingAddress,
    shippingAddress: order.shippingAddress,
    sellerCode: env.sellerCode,
    warehouseCode: env.warehouseCode,
    priceListCode: env.priceListCode,
    documentType: env.documentType,
    subtotal: safeNumber(order.subtotalPriceSet.shopMoney.amount),
    tax: safeNumber(order.totalTaxSet.shopMoney.amount),
    total: safeNumber(order.totalPriceSet.shopMoney.amount),
    shippingAmount: safeNumber(
      order.shippingLine?.originalPriceSet?.shopMoney.amount || "0"
    ),
    lines,
    note: order.note,
  };
}

export async function prepareShopifyPaidOrderSync(
  order: ShopifyOrderForDefontanaSync
): Promise<DefontanaPreparedOrderSync> {
  await getDefontanaAccessToken();

  return {
    status: "draft",
    draft: buildDefontanaSaleDraftFromShopifyOrder(order),
  };
}
