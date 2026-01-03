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

export {
  // Guard/ensure helpers
  guard,
  guardAll,
  ensure,
  ensureOk,
  // Types
  type EnsureResult,
} from "./guard.js";

export {
  // Constants
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  MAX_JSON_SIZE,
  MAX_JSON_DEPTH,
  MAX_URL_DECODED_LEN,
  MAX_FORM_FIELDS,
  MAX_HEADER_VALUE_LEN,
  MAX_TOTAL_HEADERS_SIZE,
  HEADER_CONTENT_TYPE,
  HEADER_CONTENT_TYPE_TITLE,
  HEADER_AUTHORIZATION,
  HEADER_TRACE_ID,
  HEADER_TRACE_ID_TITLE,
  MIME_JSON,
  MIME_PROBLEM_JSON,
  MIME_HTML,
  MIME_TEXT,
  MIME_FORM_URLENCODED,
  statusTitle,
} from "./constants.js";

export {
  // Typed inputs
  Id,
  ParseError,
  ValidationError,
  // Types
  type ParseErrorKind,
  type ValidationConstraint,
} from "./typed.js";

import * as random from "./random.js";
import * as time from "./time.js";
import * as env from "./env.js";
import * as http from "./http.js";
export { random, time, env, http };
