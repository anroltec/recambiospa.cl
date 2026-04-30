import "server-only";

export interface ShopifyStorefrontEnv {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
}

export interface ShopifyAdminEnv {
  storeDomain: string;
  adminAccessToken: string;
  apiSecret: string;
  apiVersion: string;
  webhookBaseUrl: string | null;
}

export interface DefontanaEnv {
  baseUrl: string;
  authUrl: string;
  client: string;
  company: string;
  user: string;
  password: string;
  sellerCode: string | null;
  warehouseCode: string | null;
  priceListCode: string | null;
  documentType: string | null;
}

const DEFAULT_SHOPIFY_API_VERSION = "2026-04";
const DEFAULT_DEFONTANA_BASE_URL = "https://api-v2.defontana.com";

function hasEnv(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function optionalEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function getShopifyStorefrontEnv(): ShopifyStorefrontEnv {
  return {
    storeDomain: requireEnv("SHOPIFY_STORE_DOMAIN"),
    storefrontAccessToken: requireEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN"),
    apiVersion: process.env.SHOPIFY_API_VERSION?.trim() || DEFAULT_SHOPIFY_API_VERSION,
  };
}

export function hasShopifyStorefrontEnv(): boolean {
  return hasEnv("SHOPIFY_STORE_DOMAIN") && hasEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
}

export function getShopifyAdminEnv(): ShopifyAdminEnv {
  return {
    storeDomain: requireEnv("SHOPIFY_STORE_DOMAIN"),
    adminAccessToken: requireEnv("SHOPIFY_ADMIN_ACCESS_TOKEN"),
    apiSecret: requireEnv("SHOPIFY_API_SECRET"),
    apiVersion: process.env.SHOPIFY_API_VERSION?.trim() || DEFAULT_SHOPIFY_API_VERSION,
    webhookBaseUrl: optionalEnv("SHOPIFY_WEBHOOK_BASE_URL"),
  };
}

export function getDefontanaEnv(): DefontanaEnv {
  return {
    baseUrl: process.env.DEFONTANA_BASE_URL?.trim() || DEFAULT_DEFONTANA_BASE_URL,
    authUrl:
      process.env.DEFONTANA_AUTH_URL?.trim() ||
      `${process.env.DEFONTANA_BASE_URL?.trim() || DEFAULT_DEFONTANA_BASE_URL}/api/Auth/Login`,
    client: requireEnv("DEFONTANA_CLIENT"),
    company: requireEnv("DEFONTANA_COMPANY"),
    user: requireEnv("DEFONTANA_USER"),
    password: requireEnv("DEFONTANA_PASSWORD"),
    sellerCode: optionalEnv("DEFONTANA_SELLER_CODE"),
    warehouseCode: optionalEnv("DEFONTANA_WAREHOUSE_CODE"),
    priceListCode: optionalEnv("DEFONTANA_PRICE_LIST_CODE"),
    documentType: optionalEnv("DEFONTANA_DOCUMENT_TYPE"),
  };
}
