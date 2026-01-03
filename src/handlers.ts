// {{PROJECT_NAME}} - Route handlers
//
// Implement your route handlers here.
// Each handler receives path params, query params, and body as needed.

import type {
  User,
  CreateUser,
  UserList,
  ApiInfo,
  HealthStatus,
} from "./types.js";
import { random } from "./sdk/index.js";

// ---- Handlers ----

export function home(): ApiInfo {
  return {
    name: "{{PROJECT_NAME}}",
    version: "0.1.0",
  };
}

export function health(): HealthStatus {
  return { status: "healthy" };
}

export function listUsers(): UserList {
  // TODO: Replace with real database call
  return {
    users: [
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "2", name: "Bob", email: "bob@example.com" },
    ],
    total: 2,
  };
}

export function getUser(id: string): User | null {
  // TODO: Replace with real database call
  const users: Record<string, User> = {
    "1": { id: "1", name: "Alice", email: "alice@example.com" },
    "2": { id: "2", name: "Bob", email: "bob@example.com" },
  };
  return users[id] ?? null;
}

export function createUser(input: CreateUser): User {
  // TODO: Replace with real database call
  return {
    id: random.uuid(),
    name: input.name,
    email: input.email,
  };
}

export function updateUser(id: string, input: CreateUser): User | null {
  // TODO: Replace with real database call
  const existing = getUser(id);
  if (!existing) return null;

  return {
    id,
    name: input.name,
    email: input.email,
  };
}

export function deleteUser(id: string): boolean {
  // TODO: Replace with real database call
  const existing = getUser(id);
  return existing !== null;
}
