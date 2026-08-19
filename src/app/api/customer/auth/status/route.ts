import type { NextRequest } from "next/server";
import { getCustomerSession } from "@/lib/customer-account/session";
import { createCustomerAuthStatusResponse } from "@/lib/customer-account/session-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return createCustomerAuthStatusResponse(getCustomerSession(request));
}
