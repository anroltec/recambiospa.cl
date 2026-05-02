import "server-only";

import { cache } from "react";
import type { CartApiResponse, CartLineItem } from "@/types/cart";
import type { Category, Product } from "@/types/product";
import {
  brands as localBrands,
  categories as localCategories,
  products as localProducts,
} from "@/data/products";
import {
  categoryDirectory,
  detectBrand,
  detectCategory,
  getBrandLabelFromSlug,
  getCategoryName,
  slugify,
} from "@/lib/catalog-taxonomy";
import { hasShopifyStorefrontEnv } from "@/lib/env";
import {
  getProductsPage,
  type ShopifyCart,
  type ShopifyCartLine,
  type ShopifyProduct,
  type ShopifyProductVariant,
} from "@/lib/shopify";

const SHOPIFY_DEBUG_ENABLED = process.env.SHOPIFY_DEBUG === "1";

export interface CatalogData {
  products: Product[];
  categories: Category[];
  brands: string[];
}

export class CatalogConnectionError extends Error {
  constructor(message = "No pudimos conectar con Shopify para cargar el catalogo.") {
    super(message);
    this.name = "CatalogConnectionError";
  }
}

let hasLoggedShopifyConnectionError = false;

function parseNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function extractSpecs(tags: string[]): Record<string, string> {
  return tags.reduce<Record<string, string>>((specs, tag) => {
    if (!tag.toLowerCase().startsWith("spec:")) {
      return specs;
    }

    const specValue = tag.slice(5);
    const separator = specValue.includes("=") ? "=" : ":";
    const [key, value] = specValue.split(separator);

    if (key && value) {
      specs[key.trim()] = value.trim();
    }

    return specs;
  }, {});
}

function pickPrimaryVariant(variants: ShopifyProductVariant[]): ShopifyProductVariant | null {
  return variants.find((variant) => variant.availableForSale) ?? variants[0] ?? null;
}

function buildProductImages(images: ShopifyProduct["images"]): string[] {
  const urls = images.edges.map((edge) => edge.node.url).filter(Boolean);
  return urls.length > 0 ? urls : ["/products/placeholder.svg"];
}

export function mapShopifyProductToProduct(product: ShopifyProduct): Product {
  const variants = product.variants.edges.map((edge) => edge.node);
  const primaryVariant = pickPrimaryVariant(variants);
  const code = primaryVariant?.sku?.trim() || product.handle;
  const category = detectCategory(code, product.title, product.productType, product.tags);

  if (SHOPIFY_DEBUG_ENABLED) {
    console.info(
      "[shopify-product]",
      JSON.stringify({
        title: product.title,
        handle: product.handle,
        code,
        variantId: primaryVariant?.id ?? null,
        variantTitle: primaryVariant?.title ?? null,
        price: primaryVariant?.price.amount ?? null,
        availableForSale: primaryVariant?.availableForSale ?? null,
        hasAnyAvailableVariant: variants.some((variant) => variant.availableForSale),
        variantCount: variants.length,
        variants: variants.map((variant) => ({
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.price.amount,
          availableForSale: variant.availableForSale,
        })),
      })
    );
  }

  return {
    id: product.id,
    handle: product.handle,
    variantId: primaryVariant?.id ?? null,
    variantTitle: primaryVariant?.title ?? null,
    code,
    name: product.title,
    category,
    categoryLabel: getCategoryName(category),
    brand: detectBrand(product.title, product.vendor),
    price: primaryVariant ? parseNumber(primaryVariant.price.amount) : null,
    images: buildProductImages(product.images),
    description: product.description?.trim() || "",
    specs: extractSpecs(product.tags),
    inStock: variants.some((variant) => variant.availableForSale),
  };
}

function mapCartLineToProduct(line: ShopifyCartLine): Product {
  const category = detectCategory(
    line.merchandise.sku?.trim() || line.merchandise.product.handle,
    line.merchandise.product.title,
    line.merchandise.product.productType,
    line.merchandise.product.tags
  );

  return {
    id: line.merchandise.id,
    handle: line.merchandise.product.handle,
    variantId: line.merchandise.id,
    variantTitle: line.merchandise.title,
    code: line.merchandise.sku?.trim() || line.merchandise.product.handle,
    name: line.merchandise.product.title,
    category,
    categoryLabel: getCategoryName(category),
    brand: detectBrand(line.merchandise.product.title, line.merchandise.product.vendor),
    price: parseNumber(line.merchandise.price.amount),
    images: buildProductImages(line.merchandise.product.images),
    description: line.merchandise.product.description?.trim() || "",
    specs: extractSpecs(line.merchandise.product.tags),
    inStock: line.merchandise.availableForSale,
  };
}

export function serializeShopifyCart(cart: ShopifyCart): CartApiResponse {
  const items: CartLineItem[] = cart.lines.edges.map((edge) => ({
    lineId: edge.node.id,
    quantity: edge.node.quantity,
    product: mapCartLineToProduct(edge.node),
  }));

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    totalPrice: items.reduce(
      (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
      0
    ),
    currencyCode: cart.cost.totalAmount.currencyCode ?? null,
    items,
  };
}

function getLocalCatalogData(): CatalogData {
  const products: Product[] = localProducts.map((product) => ({
    ...product,
    id: product.code,
    handle: slugify(product.code),
    variantId: null,
    variantTitle: null,
    categoryLabel: getCategoryName(product.category),
  }));

  return {
    products,
    categories: localCategories as Category[],
    brands: localBrands,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Shopify storefront error.";
}

const getAllShopifyProducts = cache(async (): Promise<ShopifyProduct[]> => {
  const allProducts: ShopifyProduct[] = [];
  let after: string | null | undefined = null;

  while (true) {
    const page = await getProductsPage(100, after);
    allProducts.push(...page.products);

    if (!page.pageInfo.hasNextPage || !page.pageInfo.endCursor) {
      break;
    }

    after = page.pageInfo.endCursor;
  }

  return allProducts;
});

export function isCatalogConnectionError(error: unknown): error is CatalogConnectionError {
  return error instanceof CatalogConnectionError;
}

export const getCatalogData = cache(async (): Promise<CatalogData> => {
  if (!hasShopifyStorefrontEnv()) {
    return getLocalCatalogData();
  }

  try {
    const products = (await getAllShopifyProducts()).map(mapShopifyProductToProduct);
    const brands = [...new Set(products.map((product) => product.brand))].sort(
      (left, right) => left.localeCompare(right)
    );

    return {
      products,
      categories: categoryDirectory,
      brands,
    };
  } catch (error) {
    if (!hasLoggedShopifyConnectionError) {
      hasLoggedShopifyConnectionError = true;
      console.warn(
        `[catalog] Shopify storefront unavailable while loading catalog: ${getErrorMessage(error)}`
      );
    }

    throw new CatalogConnectionError();
  }
});

export async function getCatalogProductByCode(code: string): Promise<Product | null> {
  const { products } = await getCatalogData();
  return products.find((product) => product.code === code) ?? null;
}

export async function getRelatedCatalogProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const { products } = await getCatalogData();

  return products
    .filter((candidate) => candidate.category === product.category && candidate.code !== product.code)
    .slice(0, limit);
}

export async function resolveCatalogSlug(
  slug: string
): Promise<{ type: "category" | "brand"; label: string; value: string } | null> {
  const category = categoryDirectory.find((item) => item.id === slug);

  if (category) {
    return {
      type: "category",
      label: category.name,
      value: category.id,
    };
  }

  const { brands } = await getCatalogData();
  const brand = getBrandLabelFromSlug(slug, brands);

  if (!brand) {
    return null;
  }

  return {
    type: "brand",
    label: brand,
    value: brand,
  };
}

export function getProductUrl(product: Pick<Product, "code">): string {
  return `/producto/${product.code}`;
}

export function getBrandUrl(brand: string): string {
  return `/collections/${slugify(brand)}`;
}
