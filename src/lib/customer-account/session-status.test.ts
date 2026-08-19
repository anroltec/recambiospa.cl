import assert from "node:assert/strict";
import test from "node:test";
import { createCustomerAuthStatusResponse } from "./session-status.ts";

test("reports a guest through a successful status response", async () => {
  const response = createCustomerAuthStatusResponse(null);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    authenticated: false,
  });
});

test("reports the authenticated customer without loading external profile data", async () => {
  const response = createCustomerAuthStatusResponse({
    email: "cliente@example.com",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    authenticated: true,
    profile: {
      email: "cliente@example.com",
      firstName: null,
      lastName: null,
    },
  });
});
