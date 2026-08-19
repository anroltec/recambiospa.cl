import assert from "node:assert/strict";
import test from "node:test";
import { createCartLookupResponse } from "./cart-response.ts";

test("returns an expired Shopify cart as a successful empty lookup", async () => {
  const response = createCartLookupResponse(null);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    cart: null,
  });
});
