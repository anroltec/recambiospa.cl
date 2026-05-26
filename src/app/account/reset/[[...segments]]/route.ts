import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Shopify's customerResetByUrl mutation validates the token using the
 * myshopify.com domain. Even when the email is customized to show the
 * store's custom domain, the reset_url we send to the API must use the
 * myshopify.com domain so Shopify can resolve the customer ID and token.
 */
function toShopifyResetUrl(request: NextRequest): string {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!shopifyDomain) {
    return request.nextUrl.toString();
  }
  return `https://${shopifyDomain}${request.nextUrl.pathname}`;
}

function buildCustomerResetRedirect(request: NextRequest): URL {
  const redirectUrl = new URL("/cuenta/restablecer", request.url);
  redirectUrl.searchParams.set("reset_url", toShopifyResetUrl(request));
  return redirectUrl;
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(buildCustomerResetRedirect(request));
}
