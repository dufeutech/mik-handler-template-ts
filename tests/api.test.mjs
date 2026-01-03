import { describe, it } from "node:test";
import {
  get,
  post,
  put,
  del,
  assertOk,
  assertCreated,
  assertNoContent,
  assertNotFound,
  assertBadRequest,
  assertHas,
} from "./helpers.mjs";

describe("GET /", () => {
  it("returns api info", async () => {
    const res = await get("/");
    assertOk(res);
    assertHas(res, "name", "{{PROJECT_NAME}}");
    assertHas(res, "version", "0.1.0");
  });
});

describe("GET /health", () => {
  it("returns healthy status", async () => {
    const res = await get("/health");
    assertOk(res);
    assertHas(res, "status", "healthy");
  });
});

describe("GET /users", () => {
  it("returns user list", async () => {
    const res = await get("/users");
    assertOk(res);
    assertHas(res, "total", 2);
  });
});

describe("GET /users/{id}", () => {
  it("returns user by id", async () => {
    const res = await get("/users/1");
    assertOk(res);
    assertHas(res, "name", "Alice");
    assertHas(res, "email", "alice@example.com");
  });

  it("returns 404 for unknown user", async () => {
    const res = await get("/users/999");
    assertNotFound(res);
  });
});

describe("POST /users", () => {
  it("creates a new user", async () => {
    const res = await post("/users", {
      name: "Test",
      email: "test@example.com",
    });
    assertCreated(res);
    assertHas(res, "name", "Test");
    assertHas(res, "email", "test@example.com");
  });

  it("rejects invalid input", async () => {
    const res = await post("/users", { name: "Test" });
    assertBadRequest(res);
  });
});

describe("PUT /users/{id}", () => {
  it("updates existing user", async () => {
    const res = await put("/users/1", {
      name: "Alice Updated",
      email: "alice.new@example.com",
    });
    assertOk(res);
    assertHas(res, "name", "Alice Updated");
  });

  it("returns 404 for unknown user", async () => {
    const res = await put("/users/999", {
      name: "Nobody",
      email: "nobody@example.com",
    });
    assertNotFound(res);
  });
});

describe("DELETE /users/{id}", () => {
  it("deletes existing user", async () => {
    const res = await del("/users/1");
    assertNoContent(res);
  });

  it("returns 404 for unknown user", async () => {
    const res = await del("/users/999");
    assertNotFound(res);
  });
});
