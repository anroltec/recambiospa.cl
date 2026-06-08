import type { Product } from "@/types/product";

const MINIMUM_PURCHASE_PATTERN =
  /Compra\s+m(?:i|\u00ed)nima\s+de\s+este\s+producto\s*:\s*([0-9]+)\s+unidad(?:es)?\b/i;

function normalizePositiveInteger(quantity: number): number {
  const normalizedQuantity = Math.trunc(quantity);
  return Number.isFinite(normalizedQuantity) && normalizedQuantity > 0 ? normalizedQuantity : 1;
}

export function getProductMinimumPurchaseQuantity(
  product: Pick<Product, "description">
): number | null {
  const match = MINIMUM_PURCHASE_PATTERN.exec(product.description);

  if (!match) {
    return null;
  }

  const quantity = Number.parseInt(match[1], 10);
  return Number.isFinite(quantity) && quantity > 1 ? quantity : null;
}

export function getProductMinimumPurchaseText(product: Pick<Product, "description">): string | null {
  const minimumQuantity = getProductMinimumPurchaseQuantity(product);

  if (!minimumQuantity) {
    return null;
  }

  return `Compra m\u00ednima de este producto: ${minimumQuantity} unidades`;
}

export function getMinimumCartQuantity(product: Pick<Product, "description">): number {
  return getProductMinimumPurchaseQuantity(product) ?? 1;
}

export function getCartAddQuantity(
  product: Pick<Product, "description">,
  quantity: number,
  isAlreadyInCart: boolean
): number {
  const normalizedQuantity = normalizePositiveInteger(quantity);

  if (isAlreadyInCart) {
    return normalizedQuantity;
  }

  return Math.max(getMinimumCartQuantity(product), normalizedQuantity);
}

export function normalizeCartLineQuantity(
  product: Pick<Product, "description">,
  quantity: number
): number {
  if (!Number.isFinite(quantity)) {
    return getMinimumCartQuantity(product);
  }

  if (quantity <= 0) {
    return quantity;
  }

  return Math.max(getMinimumCartQuantity(product), normalizePositiveInteger(quantity));
}
