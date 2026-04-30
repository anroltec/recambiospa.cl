import { serializeShopifyCart } from "@/lib/catalog";
import { addToCart, removeFromCart, updateCartLine } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AddLinePayload = {
  cartId?: string;
  variantId?: string;
  quantity?: number;
};

type UpdateLinePayload = {
  cartId?: string;
  lineId?: string;
  quantity?: number;
};

type RemoveLinePayload = {
  cartId?: string;
  lineId?: string;
};

export async function POST(request: Request) {
  let payload: AddLinePayload;

  try {
    payload = (await request.json()) as AddLinePayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.cartId || !payload.variantId) {
    return Response.json(
      { ok: false, error: "cartId and variantId are required." },
      { status: 400 }
    );
  }

  try {
    const cart = await addToCart(payload.cartId, payload.variantId, payload.quantity ?? 1);
    return Response.json({ ok: true, cart: serializeShopifyCart(cart) });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to add line to Shopify cart.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  let payload: UpdateLinePayload;

  try {
    payload = (await request.json()) as UpdateLinePayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.cartId || !payload.lineId || typeof payload.quantity !== "number") {
    return Response.json(
      { ok: false, error: "cartId, lineId and quantity are required." },
      { status: 400 }
    );
  }

  try {
    const cart = await updateCartLine(payload.cartId, payload.lineId, payload.quantity);
    return Response.json({ ok: true, cart: serializeShopifyCart(cart) });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to update Shopify cart line.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  let payload: RemoveLinePayload;

  try {
    payload = (await request.json()) as RemoveLinePayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.cartId || !payload.lineId) {
    return Response.json(
      { ok: false, error: "cartId and lineId are required." },
      { status: 400 }
    );
  }

  try {
    const cart = await removeFromCart(payload.cartId, payload.lineId);
    return Response.json({ ok: true, cart: serializeShopifyCart(cart) });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to remove Shopify cart line.",
      },
      { status: 500 }
    );
  }
}
