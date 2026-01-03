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
mik run dist/handler.wasm

# 3. Test it
curl http://localhost:8080/
curl http://localhost:8080/users
curl -X POST http://localhost:8080/users -d '{"name":"Alice","email":"alice@example.com"}'
```

## Project Structure

```
├── .github/workflows/
│   └── deploy.yml      # CI/CD → ghcr.io
├── src/
│   ├── component.ts    # Routes + main handler
│   ├── types.ts        # Type definitions
│   └── handlers.ts     # Route handlers
├── wit/handler.wit     # WIT world definition
├── tests/
│   ├── api.test.mjs    # E2E tests
│   └── helpers.mjs     # Test utilities
├── scripts/
│   ├── build.sh        # Build script
│   └── test.sh         # Run e2e tests
├── package.json        # Dependencies
└── README.md
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

export function home() {
  return { name: "my-api", version: "0.1.0" };
}

export function getUser(id: string): User | null {
  // TODO: Replace with real database call
  return { id, name: "Alice", email: "alice@example.com" };
}

export function createUser(input: CreateUser): User {
  return { id: uuid(), name: input.name, email: input.email };
}
```

**`src/component.ts`** - Wire routes to handlers:

```typescript
// Add route matching in matchRoute()
if (method === "GET" && cleanPath === "/users") {
  return { handler: "listUsers", params: {} };
}

// Add handler case in handle()
case "listUsers":
  response = ok(handlers.listUsers());
  break;
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
1. Builds your handler
2. Publishes to `ghcr.io/{owner}/{repo}:{version}`

Pull your component:

```bash
oras pull ghcr.io/your-org/my-api:0.1.0
```

## Local Development

```bash
./scripts/build.sh    # Build → dist/handler.wasm

# Run with any runtime
mik run dist/handler.wasm
wasmtime serve dist/handler.wasm
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

## Learn More

- [mik documentation](https://dufeutech.github.io/mik)
- [WASI HTTP specification](https://github.com/WebAssembly/wasi-http)
