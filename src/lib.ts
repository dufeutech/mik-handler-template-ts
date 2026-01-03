// {{PROJECT_NAME}} - WASI HTTP Handler
//
// Routes are defined here. Handlers are in handlers.ts.
// Types are in types.ts.

import * as handlers from "./handlers.js";
import type { CreateUser } from "./types.js";
import {
  log,
  ok,
  created,
  noContent,
  notFound,
  badRequest,
  parseJson,
  createRouter,
  type Response,
  type RequestData,
} from "./sdk/index.js";

// ---- Routes ----

const router = createRouter()
  .get("/", () => ok(handlers.home()))
  .get("/health", () => ok(handlers.health()))
  .get("/users", () => ok(handlers.listUsers()))
  .get("/users/{id}", (_req, params) => {
    const user = handlers.getUser(params.id);
    return user ? ok(user) : notFound("User not found");
  })
  .post("/users", (req) => {
    const input = parseJson<CreateUser>(req.body);
    if (!input || !input.name || !input.email) {
      return badRequest("Invalid input: name and email required");
    }
    return created(handlers.createUser(input));
  })
  .put("/users/{id}", (req, params) => {
    const input = parseJson<CreateUser>(req.body);
    if (!input || !input.name || !input.email) {
      return badRequest("Invalid input: name and email required");
    }
    const user = handlers.updateUser(params.id, input);
    return user ? ok(user) : notFound("User not found");
  })
  .delete("/users/{id}", (_req, params) => {
    const deleted = handlers.deleteUser(params.id);
    return deleted ? noContent() : notFound("User not found");
  });

// ---- Handler export (mik:core/handler interface) ----

export const handler = {
  handle(req: RequestData): Response {
    log.info("Request received", { method: req.method, path: req.path });
    return router.handle(req);
  },
};
