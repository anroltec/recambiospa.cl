import type { NextRequest } from "next/server";
import { prepareShopifyPaidOrderSync } from "@/lib/defontana";
import { getOrderForDefontanaSync } from "@/lib/shopify-admin";
import {
  getShopifyWebhookMetadata,
  getShopifyWebhookOrderId,
  verifyShopifyWebhookSignature,
  type ShopifyOrdersPaidWebhookPayload,
} from "@/lib/shopify-webhooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const metadata = getShopifyWebhookMetadata(request.headers);
  const signature = request.headers.get("x-shopify-hmac-sha256");

  if (!verifyShopifyWebhookSignature(rawBody, signature)) {
    return Response.json(
      { ok: false, error: "Invalid Shopify webhook signature." },
      { status: 401 }
    );
  }

  let payload: ShopifyOrdersPaidWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as ShopifyOrdersPaidWebhookPayload;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid Shopify webhook JSON payload." },
      { status: 400 }
    );
  }

  try {
    const orderId = getShopifyWebhookOrderId(payload);
    const order = await getOrderForDefontanaSync(orderId);
    const preparedSync = await prepareShopifyPaidOrderSync(order);

    console.info(
      "[shopify-webhook] orders/paid prepared for Defontana",
      JSON.stringify({
        webhookId: metadata.webhookId,
        shopDomain: metadata.shopDomain,
        topic: metadata.topic,
        orderId: order.id,
        legacyResourceId: order.legacyResourceId,
        status: preparedSync.status,
        lineCount: preparedSync.draft.lines.length,
      })
    );

    return Response.json(
      {
        ok: true,
        status: preparedSync.status,
        orderId: order.id,
        legacyResourceId: order.legacyResourceId,
        lineCount: preparedSync.draft.lines.length,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("[shopify-webhook] orders/paid sync failed", error);

    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown sync error.",
      },
      { status: 500 }
    );
  }
}
