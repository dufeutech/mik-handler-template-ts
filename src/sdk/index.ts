// mik-sdk for TypeScript
// Minimal utilities matching the Rust mik-sdk patterns

export { log } from "./log.js";

export {
  // Success responses
  json,
  ok,
  created,
  accepted,
  noContent,
  // Redirects
  redirect,
  // Error responses (RFC 7807)
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  internalError,
  // Types
  type Response,
  type ProblemDetails,
} from "./response.js";

export {
  // Request parsing
  parseJson,
  getPath,
  getQuery,
  getHeader,
  getHeaders,
  getText,
  // Types
  type Method,
  type RequestData,
} from "./request.js";

export {
  // Router
  Router,
  createRouter,
  // Types
  type RouteParams,
  type Handler,
} from "./router.js";

import * as random from "./random.js";
import * as time from "./time.js";
import * as env from "./env.js";
import * as http from "./http.js";
export { random, time, env, http };
