import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import {
  getShopifyWebhookMetadata,
  verifyShopifyWebhookSignature,
} from "@/lib/shopify-webhooks";
import { SHOPIFY_PRODUCTS_CACHE_TAG } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook: products/update (y products/create, products/delete).
 *
 * Invalida al instante el caché del catálogo cuando un producto cambia en
 * Shopify, sin esperar el ciclo de revalidación de 60 segundos.
 *
 * Para registrar el webhook en Shopify Admin:
 *   URL: https://<dominio>/api/shopify/webhooks/products-update
 *   Eventos: products/update, products/create, products/delete
 *   Formato: JSON
 */
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

  // { expire: 0 } = expiración inmediata (recomendado para webhooks externos).
  revalidateTag(SHOPIFY_PRODUCTS_CACHE_TAG, { expire: 0 });

  console.info("[shopify-webhook] products cache invalidated", {
    topic: metadata.topic,
    shopDomain: metadata.shopDomain,
    webhookId: metadata.webhookId,
  });

  return Response.json({ ok: true }, { status: 202 });
}
