import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildCustomerResetRedirect(request: NextRequest): URL {
  const redirectUrl = new URL("/cuenta/restablecer", request.url);
  redirectUrl.searchParams.set("reset_url", request.nextUrl.toString());
  return redirectUrl;
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(buildCustomerResetRedirect(request));
}
