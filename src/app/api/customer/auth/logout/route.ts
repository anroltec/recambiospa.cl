import { NextResponse, type NextRequest } from "next/server";
import { revokeShopifyCustomerAccessToken } from "@/lib/customer-account/shopify";
import {
  clearCustomerSession,
  getCustomerSession,
} from "@/lib/customer-account/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = getCustomerSession(request);
  const response = NextResponse.json({ ok: true }, { status: 200 });

  clearCustomerSession(response);

  if (!session) {
    return response;
  }

  try {
    await revokeShopifyCustomerAccessToken(session.shopifyCustomerAccessToken);
  } catch {
    // Logout should still clear the local session even if Shopify token revocation fails.
  }

  return response;
}
