import assert from "node:assert/strict";
import { after, test } from "node:test";
import app from "../src/app.js";

const server = app.listen(0);
await new Promise((resolve) => server.once("listening", resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(
  () =>
    new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
);

test("health reports the database as unavailable until connected", async () => {
  const response = await fetch(`${baseUrl}/api/health`);

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    status: "unavailable",
    database: "disconnected",
  });
});

test("unknown routes return a JSON 404", async () => {
  const response = await fetch(`${baseUrl}/not-a-route`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Not found." });
});

test("invalid product pagination is rejected before database access", async () => {
  const response = await fetch(`${baseUrl}/api/v1/products?limit=0`);

  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "Invalid query parameters.");
});

test("malformed JSON returns a client error", async () => {
  const response = await fetch(`${baseUrl}/api/unknown`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Request body must be valid JSON.",
  });
});

test("oversized JSON returns a 413 response", async () => {
  const response = await fetch(`${baseUrl}/api/unknown`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data: "x".repeat(11 * 1024) }),
  });

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    error: "Request body exceeds the 10kb limit.",
  });
});
