# {{PROJECT_NAME}}

Starter template for portable WASI HTTP handlers in TypeScript.

Build once, deploy to wasmtime, Spin, or wasmCloud.

## Quick Start

```bash
# 1. Use this template (click "Use this template" on GitHub, or:)
gh repo create my-api --template dufeutech/mik-handler-template-ts --clone
cd my-api

# 2. Build & run
./scripts/build.sh
wasmtime serve -S cli=y dist/service.wasm

# 3. Test it
curl http://localhost:8080/
curl http://localhost:8080/users
curl -X POST http://localhost:8080/users -d '{"name":"Alice","email":"alice@example.com"}'
```

## Project Structure

```
├── src/
│   ├── lib.ts          # Routes + handler export
│   ├── handlers.ts     # Route handlers
│   ├── types.ts        # Type definitions
│   └── sdk/            # SDK utilities
│       ├── index.ts    # Main exports
│       ├── log.ts      # Structured logging
│       ├── random.ts   # UUID, hex, bytes
│       ├── time.ts     # Time utilities
│       ├── env.ts      # Environment variables
│       ├── request.ts  # Request parsing
│       ├── response.ts # Response helpers
│       ├── router.ts   # Router
│       ├── constants.ts # MIME types, headers, limits
│       ├── typed.ts    # Id, ParseError, ValidationError
│       ├── encoding.ts # Text/JSON encoding utilities
│       ├── headers.ts  # Header handling utilities
│       └── http-status.ts # Status code utilities
├── wit/handler.wit     # WIT world definition
├── tests/
│   ├── api.test.mjs    # E2E tests
│   └── helpers.mjs     # Test utilities
├── scripts/
│   ├── build.sh        # Build script
│   └── test.sh         # Run e2e tests
├── .github/workflows/
│   └── deploy.yml      # CI/CD → ghcr.io
└── package.json
```

## SDK Usage

The SDK provides utilities matching the Rust mik-sdk patterns.

### Router

```typescript
import { createRouter, ok, notFound, parseJson } from "./sdk/index.js";

const router = createRouter()
  .get("/", () => ok({ name: "my-api", version: "0.1.0" }))
  .get("/users/{id}", (_req, params) => {
    const user = getUser(params.id);
    return user ? ok(user) : notFound("User not found");
  })
  .post("/users", (req) => {
    const input = parseJson(req.body);
    return created(createUser(input));
  });
```

### Logging

```typescript
import { log } from "./sdk/index.js";

log.info("Request received", { method: "GET", path: "/" });
log.warn("Rate limit approaching", { remaining: 10 });
log.error("Database connection failed", { error: "timeout" });
log.debug("Debug info", { data: someObject });
```

Output (JSON to stderr):
```json
{"level":"info","msg":"Request received","ts":"2024-01-15T10:30:00.000Z","method":"GET","path":"/"}
```

### Random

```typescript
import { random } from "./sdk/index.js";

const id = random.uuid();       // "550e8400-e29b-41d4-a716-446655440000"
const token = random.hex(16);   // "a1b2c3d4e5f6789012345678"
const bytes = random.bytes(32); // Uint8Array(32)
const num = random.u64();       // BigInt
```

### Time

```typescript
import { time } from "./sdk/index.js";

const secs = time.now();        // 1705312200 (Unix seconds)
const ms = time.nowMillis();    // 1705312200000 (Unix milliseconds)
const iso = time.nowIso();      // "2024-01-15T10:30:00.000Z"
```

### Environment

```typescript
import { env } from "./sdk/index.js";

const dbUrl = env.get("DATABASE_URL");           // string | null
const port = env.getOr("PORT", "8080");          // string
const debug = env.bool("DEBUG", false);          // boolean
const timeout = env.int("TIMEOUT", 30);          // number
const all = env.all();                           // Map<string, string>
```

### HTTP Client

```typescript
import { http } from "./sdk/index.js";

// Simple GET request
const result = await http.get("https://api.example.com/users").send();
if (result.ok) {
  const data = result.response.json();
  console.log(data);
}

// POST with JSON body
const result = await http.post("https://api.example.com/users")
  .json({ name: "Alice", email: "alice@example.com" })
  .send();

// With headers and timeout
const result = await http.get("https://api.example.com/protected")
  .header("Authorization", "Bearer token123")
  .header("Accept", "application/json")
  .timeout(5000)  // 5 seconds
  .send();

// Response helpers
if (result.ok) {
  const res = result.response;
  res.status;              // 200
  res.ok;                  // true
  res.isSuccess();         // true (2xx)
  res.isClientError();     // false (4xx)
  res.isServerError();     // false (5xx)
  res.text();              // body as string
  res.json<User>();        // parsed JSON or null
  res.header("content-type"); // "application/json"
}

// Error handling
if (!result.ok) {
  const err = result.error;
  err.type;    // "network" | "timeout" | "invalid_url" | "unknown"
  err.message; // Error description
}
```

### Response Helpers

```typescript
import { ok, created, noContent, notFound, badRequest } from "./sdk/index.js";

// Success responses
ok({ data: "value" });                    // 200 OK
created({ id: "123" });                   // 201 Created
noContent();                              // 204 No Content

// Error responses (RFC 7807 Problem Details)
badRequest("Invalid input");              // 400 Bad Request
unauthorized("Token expired");            // 401 Unauthorized
forbidden("Access denied");               // 403 Forbidden
notFound("User not found");               // 404 Not Found
conflict("Already exists");               // 409 Conflict
internalError("Something went wrong");    // 500 Internal Server Error
```

### Request Parsing

```typescript
import { parseJson, getPath, getQuery, getHeader } from "./sdk/index.js";

// In a route handler:
router.post("/users", (req, params) => {
  const body = parseJson<CreateUser>(req.body);
  const path = getPath(req);              // "/users"
  const query = getQuery(req);            // URLSearchParams
  const auth = getHeader(req, "Authorization");
  // ...
});
```

### Guard & Ensure

```typescript
import { guard, guardAll, ensure } from "./sdk/index.js";

// Guard - return error if condition is false
router.post("/users", (req) => {
  const input = parseJson<CreateUser>(req.body);

  // Single guard
  const err = guard(!!input?.name, 400, "Name is required");
  if (err) return err;

  // Multiple guards
  const err = guardAll(
    [!!input?.name, 400, "Name is required"],
    [!!input?.email, 400, "Email is required"],
    [input.email.includes("@"), 400, "Invalid email format"],
  );
  if (err) return err;

  return created(createUser(input));
});

// Ensure - unwrap value or return error
router.get("/users/{id}", (_req, params) => {
  const result = ensure(findUser(params.id), 404, "User not found");
  if (!result.ok) return result.error;

  return ok(result.value);
});
```

### Constants

```typescript
import {
  // MIME types
  MIME_JSON,              // "application/json"
  MIME_PROBLEM_JSON,      // "application/problem+json"
  MIME_FORM_URLENCODED,   // "application/x-www-form-urlencoded"
  MIME_HTML,              // "text/html"
  MIME_TEXT,              // "text/plain"
  // Headers
  HEADER_CONTENT_TYPE,    // "content-type"
  HEADER_AUTHORIZATION,   // "authorization"
  HEADER_TRACE_ID,        // "x-trace-id"
  // Size limits
  MAX_JSON_SIZE,          // 1_000_000 (1MB)
  MAX_JSON_DEPTH,         // 20
  MAX_HEADER_VALUE_LEN,   // 8192 (8KB)
  // Time
  SECONDS_PER_DAY,        // 86400
  SECONDS_PER_HOUR,       // 3600
  // Helpers
  statusTitle,            // statusTitle(404) → "Not Found"
} from "./sdk/index.js";
```

### Typed Inputs

```typescript
import { Id, ParseError, ValidationError } from "./sdk/index.js";

// Id is a string alias for path parameters
const id: Id = params.id;  // "user_123"
const num = parseInt(id, 10);  // Parse as number if needed

// ParseError - for parsing failures
const err1 = ParseError.missing("email");
// → { field: "email", kind: "missing", message: "missing required field: email" }

const err2 = ParseError.typeMismatch("age", "integer");
// → { field: "age", kind: "type_mismatch", message: "age: expected integer" }

const err3 = ParseError.invalidFormat("date", "2024-99-99");
// → { field: "date", kind: "invalid_format", message: "date: invalid format '2024-99-99'" }

// ValidationError - for constraint failures
ValidationError.min("age", 0);           // "age: minimum value is 0"
ValidationError.max("age", 150);         // "age: maximum value is 150"
ValidationError.minLength("name", 1);    // "name: minimum length is 1"
ValidationError.maxLength("name", 100);  // "name: maximum length is 100"
ValidationError.pattern("phone", "^\\d{10}$");  // "phone: must match pattern..."
ValidationError.email("email");          // "email: must be a valid email"
ValidationError.url("website");          // "website: must be a valid URL"
ValidationError.required("name");        // "name: is required"
ValidationError.custom("password", "must contain a number");

// Both have status and title properties
err1.status;  // 400
err1.title;   // "Bad Request"
ValidationError.min("x", 0).status;  // 422
ValidationError.min("x", 0).title;   // "Unprocessable Entity"
```

### Encoding Utilities

```typescript
import { encodeJson, decodeJson, encodeText, decodeText } from "./sdk/index.js";

// Encode to Uint8Array
const jsonBytes = encodeJson({ name: "Alice" });  // JSON string → bytes
const textBytes = encodeText("Hello");            // string → UTF-8 bytes

// Decode from Uint8Array
const obj = decodeJson<User>(jsonBytes);  // bytes → parsed object (or null)
const str = decodeText(textBytes);        // UTF-8 bytes → string
```

### Header Utilities

```typescript
import { findHeader, findAllHeaders, headersToMap } from "./sdk/index.js";

const headers: [string, string][] = [
  ["Content-Type", "application/json"],
  ["Accept", "text/html"],
  ["Accept", "application/json"],
];

// Case-insensitive lookup
findHeader(headers, "content-type");     // "application/json"
findHeader(headers, "X-Missing");        // null

// Get all values for a header
findAllHeaders(headers, "accept");       // ["text/html", "application/json"]

// Convert Headers object to Map (lowercase keys)
const map = headersToMap(response.headers);
map.get("content-type");                 // "application/json"
```

### HTTP Status Utilities

```typescript
import { isSuccess, isClientError, isServerError, isRedirect } from "./sdk/index.js";

isSuccess(200);      // true  (2xx)
isSuccess(201);      // true
isSuccess(404);      // false

isClientError(400);  // true  (4xx)
isClientError(404);  // true
isClientError(500);  // false

isServerError(500);  // true  (5xx)
isServerError(503);  // true
isServerError(404);  // false

isRedirect(301);     // true  (3xx)
isRedirect(302);     // true
isRedirect(200);     // false
```

## Writing Handlers

**`src/types.ts`** - Define your request/response types:

```typescript
export interface CreateUser {
  name: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
```

**`src/handlers.ts`** - Implement route handlers:

```typescript
import type { User, CreateUser } from "./types.js";
import { random } from "./sdk/index.js";

export function home() {
  return { name: "my-api", version: "0.1.0" };
}

export function getUser(id: string): User | null {
  // TODO: Replace with real database call
  return { id, name: "Alice", email: "alice@example.com" };
}

export function createUser(input: CreateUser): User {
  return { id: random.uuid(), name: input.name, email: input.email };
}
```

**`src/lib.ts`** - Define routes:

```typescript
import * as handlers from "./handlers.js";
import { ok, created, notFound, badRequest, parseJson, createRouter } from "./sdk/index.js";

const router = createRouter()
  .get("/", () => ok(handlers.home()))
  .get("/users/{id}", (_req, params) => {
    const user = handlers.getUser(params.id);
    return user ? ok(user) : notFound("User not found");
  })
  .post("/users", (req) => {
    const input = parseJson<CreateUser>(req.body);
    if (!input) return badRequest("Invalid JSON");
    return created(handlers.createUser(input));
  });

export const handler = {
  handle(req) {
    return router.handle(req);
  },
};
```

## Deployment

Deploy by pushing a version tag or manually triggering the workflow:

```bash
# Tag and push to trigger deploy
git tag v0.1.0
git push origin v0.1.0

# Or manually: Actions → Deploy → Run workflow
```

The workflow:
1. Builds your handler + composes with bridge
2. Publishes to `ghcr.io/{owner}/{repo}:{version}`

Pull your component:

```bash
oras pull ghcr.io/your-org/my-api:0.1.0
```

## Local Development

```bash
npm run dev             # Watch mode (Vite)
./scripts/build.sh      # Full build → dist/service.wasm

# Run with any runtime
wasmtime serve -S cli=y dist/service.wasm
mik run dist/service.wasm
```

## Testing

```bash
./scripts/test.sh     # Builds, starts server, runs e2e tests
```

Tests use Node.js built-in test runner (Node 18+):

```
tests/api.test.mjs
  GET /
    ✔ returns api info
  GET /users
    ✔ returns user list
  GET /users/{id}
    ✔ returns user by id
    ✔ returns 404 for unknown user
  POST /users
    ✔ creates a new user
```

Add tests in `tests/` using the helpers:

```javascript
import { get, post, assertOk, assertHas } from './helpers.mjs'

it('my test', async () => {
  const res = await get('/my-endpoint')
  assertOk(res)
  assertHas(res, 'key', 'value')
})
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | / | API info |
| GET | /health | Health check |
| GET | /users | List users |
| GET | /users/:id | Get user by ID |
| POST | /users | Create user |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

## Prerequisites

- Node.js 18+
- npm
- wkg (for fetching WIT deps)
- wac (for component composition)
- wasm-tools (for stripping)

## Learn More

- [mik documentation](https://dufeutech.github.io/mik)
- [WASI HTTP specification](https://github.com/WebAssembly/wasi-http)
