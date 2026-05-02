import type { NextRequest } from "next/server";
import { serializeShopifyCart } from "@/lib/catalog";
import { createCart, getCart } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBuyerIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip");
}

export async function GET(request: NextRequest) {
  const cartId = request.nextUrl.searchParams.get("cartId");

  if (!cartId) {
    return Response.json(
      { ok: false, error: "Missing cartId query parameter." },
      { status: 400 }
    );
  }

  try {
    const cart = await getCart(cartId, { buyerIp: getBuyerIp(request) });

    if (!cart) {
      return Response.json(
        { ok: false, error: "Shopify cart not found." },
        { status: 404 }
      );
    }

    return Response.json({ ok: true, cart: serializeShopifyCart(cart) });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to fetch Shopify cart.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cart = await createCart({ buyerIp: getBuyerIp(request) });
    return Response.json({ ok: true, cart: serializeShopifyCart(cart) }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to create Shopify cart.",
      },
      { status: 500 }
    );
  }
}
