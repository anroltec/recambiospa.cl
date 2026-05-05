import { NextResponse, type NextRequest } from "next/server";
import { getCustomerSession } from "@/lib/customer-account/session";
import { getShopifyCustomerOrders } from "@/lib/customer-account/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Customer session is required." },
    { status: 401 }
  );
}

export async function GET(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  const firstParam = Number(request.nextUrl.searchParams.get("first") || "20");
  const first = Number.isFinite(firstParam) ? Math.min(Math.max(firstParam, 1), 50) : 20;
  const after = request.nextUrl.searchParams.get("after");

  try {
    const page = await getShopifyCustomerOrders(
      session.shopifyCustomerAccessToken,
      first,
      after
    );

    return NextResponse.json({ ok: true, ...page });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to fetch customer orders.",
      },
      { status: 500 }
    );
  }
}
