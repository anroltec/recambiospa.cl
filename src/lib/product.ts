import type { Product } from "@/types/product";

export function getProductListKey(
  product: Pick<Product, "variantId" | "id" | "handle" | "code" | "brand" | "name">
): string {
  return (
    product.variantId ||
    product.id ||
    product.handle ||
    `${product.code}:${product.brand}:${product.name}`
  );
}
