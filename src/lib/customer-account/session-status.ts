interface CustomerSessionIdentity {
  email: string;
}

export function createCustomerAuthStatusResponse(
  session: CustomerSessionIdentity | null
): Response {
  if (!session) {
    return Response.json(
      { ok: true, authenticated: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return Response.json(
    {
      ok: true,
      authenticated: true,
      profile: {
        email: session.email,
        firstName: null,
        lastName: null,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
