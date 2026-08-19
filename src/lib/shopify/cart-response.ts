export function createCartLookupResponse<T>(cart: T | null): Response {
  return Response.json({ ok: true, cart });
}
