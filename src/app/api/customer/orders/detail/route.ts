import { NextResponse, type NextRequest } from "next/server";
import { getCustomerSession } from "@/lib/customer-account/session";
import { getShopifyAdminOrderDetail } from "@/lib/shopify-admin";
import type {
  CustomerOrderAddress,
  CustomerOrderDetail,
  CustomerOrderDetailLineItem,
} from "@/types/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Customer session is required." },
    { status: 401 }
  );
}

function mapAddress(
  address: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    countryCodeV2: string | null;
    phone: string | null;
  } | null
): CustomerOrderAddress | null {
  if (!address) {
    return null;
  }

  return {
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    province: address.province,
    zip: address.zip,
    country: address.country,
    countryCode: address.countryCodeV2,
    phone: address.phone,
  };
}

function mapLineItems(
  lineItems: Array<{
    id: string;
    title: string;
    name: string;
    sku: string | null;
    quantity: number;
    vendor: string | null;
    variantTitle: string | null;
    originalUnitPriceSet: { shopMoney: { amount: string; currencyCode: string } };
    discountedTotalSet: { shopMoney: { amount: string; currencyCode: string } };
    product: {
      featuredImage: { url: string; altText: string | null } | null;
    } | null;
    variant: {
      image: { url: string; altText: string | null } | null;
    } | null;
  }>
): CustomerOrderDetailLineItem[] {
  return lineItems.map((line) => {
    const image = line.variant?.image ?? line.product?.featuredImage ?? null;

    return {
      id: line.id,
      title: line.title,
      name: line.name,
      quantity: line.quantity,
      sku: line.sku,
      vendor: line.vendor,
      variantTitle:
        line.variantTitle && line.variantTitle !== "Default Title"
          ? line.variantTitle
          : null,
      unitPriceAmount: line.originalUnitPriceSet.shopMoney.amount,
      linePriceAmount: line.discountedTotalSet.shopMoney.amount,
      currencyCode: line.discountedTotalSet.shopMoney.currencyCode,
      imageUrl: image?.url ?? null,
      imageAlt: image?.altText ?? line.title,
    };
  });
}

export async function GET(request: NextRequest) {
  const session = getCustomerSession(request);

  if (!session) {
    return unauthorized();
  }

  const orderId = request.nextUrl.searchParams.get("orderId")?.trim();

  if (!orderId) {
    return NextResponse.json(
      { ok: false, error: "orderId is required." },
      { status: 400 }
    );
  }

  try {
    const order = await getShopifyAdminOrderDetail(orderId);

    if (!order.customer || order.customer.id !== session.shopifyCustomerId) {
      return NextResponse.json(
        { ok: false, error: "Order not found." },
        { status: 404 }
      );
    }

    const detail: CustomerOrderDetail = {
      id: order.id,
      currencyCode: order.currencyCode,
      subtotalAmount: order.subtotalPriceSet.shopMoney.amount,
      shippingAmount: order.shippingLine?.originalPriceSet?.shopMoney.amount ?? "0",
      taxAmount: order.totalTaxSet.shopMoney.amount,
      totalAmount: order.totalPriceSet.shopMoney.amount,
      totalQuantity: order.lineItems.reduce((sum, line) => sum + line.quantity, 0),
      email: order.email ?? order.customer.email ?? null,
      phone: order.phone ?? order.customer.phone ?? null,
      note: order.note,
      shippingMethodTitle: order.shippingLine?.title ?? null,
      billingAddress: mapAddress(order.billingAddress),
      shippingAddress: mapAddress(order.shippingAddress),
      lineItems: mapLineItems(order.lineItems),
    };

    return NextResponse.json({ ok: true, order: detail });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch customer order detail.",
      },
      { status: 500 }
    );
  }
}
