import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getShopifyAdminEnv } from "@/lib/env";

export interface ShopifyWebhookMetadata {
  topic: string | null;
  shopDomain: string | null;
  webhookId: string | null;
  apiVersion: string | null;
  triggeredAt: string | null;
}

export interface ShopifyOrdersPaidWebhookPayload {
  id: number;
  admin_graphql_api_id?: string;
  name?: string;
  email?: string | null;
  financial_status?: string;
  [key: string]: unknown;
}

export function getShopifyWebhookMetadata(headers: Headers): ShopifyWebhookMetadata {
  return {
    topic: headers.get("x-shopify-topic"),
    shopDomain: headers.get("x-shopify-shop-domain"),
    webhookId: headers.get("x-shopify-webhook-id"),
    apiVersion: headers.get("x-shopify-api-version"),
    triggeredAt: headers.get("x-shopify-triggered-at"),
  };
}

export function verifyShopifyWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const { apiSecret } = getShopifyAdminEnv();
  const digest = createHmac("sha256", apiSecret).update(rawBody, "utf8").digest("base64");

  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function getShopifyWebhookOrderId(
  payload: ShopifyOrdersPaidWebhookPayload
): string {
  if (payload.admin_graphql_api_id) {
    return payload.admin_graphql_api_id;
  }

  if (payload.id) {
    return `gid://shopify/Order/${payload.id}`;
  }

  throw new Error("Shopify webhook payload does not include an order id.");
}
