import assert from "node:assert";

const BASE_URL = process.env.API_URL || "http://localhost:8080";

async function request(method, path, body) {
  const options = { method };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, options);
  return {
    status: res.status,
    json: await res.json().catch(() => null),
  };
}

export const get = (path) => request("GET", path);
export const post = (path, body) => request("POST", path, body);
export const put = (path, body) => request("PUT", path, body);
export const patch = (path, body) => request("PATCH", path, body);
export const del = (path) => request("DELETE", path);

export function assertOk(res) {
  assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
}

export function assertCreated(res) {
  assert.equal(res.status, 201, `Expected 201, got ${res.status}`);
}

export function assertNoContent(res) {
  assert.equal(res.status, 204, `Expected 204, got ${res.status}`);
}

export function assertNotFound(res) {
  assert.equal(res.status, 404, `Expected 404, got ${res.status}`);
}

export function assertBadRequest(res) {
  assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
}

export function assertHas(res, key, value) {
  assert.equal(
    res.json?.[key],
    value,
    `Expected ${key}="${value}", got "${res.json?.[key]}"`
  );
}
