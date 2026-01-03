// Centralized constants for the mik-sdk
// Matching the Rust mik-sdk patterns

// ============================================================================
// TIME CONSTANTS
// ============================================================================

/** Seconds in a day (24 * 60 * 60) */
export const SECONDS_PER_DAY = 86400;

/** Seconds in an hour (60 * 60) */
export const SECONDS_PER_HOUR = 3600;

/** Seconds in a minute */
export const SECONDS_PER_MINUTE = 60;

// ============================================================================
// SIZE LIMITS
// ============================================================================

/** Default maximum JSON input size (1MB) - prevents memory exhaustion */
export const MAX_JSON_SIZE = 1_000_000;

/** Maximum JSON nesting depth - prevents stack overflow */
export const MAX_JSON_DEPTH = 20;

/** Maximum decoded URL length (64KB) */
export const MAX_URL_DECODED_LEN = 65536;

/** Maximum number of form fields */
export const MAX_FORM_FIELDS = 1000;

/** Maximum individual header value length (8KB) */
export const MAX_HEADER_VALUE_LEN = 8192;

/** Maximum total size of all headers combined (1MB) */
export const MAX_TOTAL_HEADERS_SIZE = 1024 * 1024;

// ============================================================================
// COMMON HEADER NAMES
// ============================================================================

/** Content-Type header name (lowercase for lookups) */
export const HEADER_CONTENT_TYPE = "content-type";

/** Content-Type header name (title-case for setting headers) */
export const HEADER_CONTENT_TYPE_TITLE = "Content-Type";

/** Authorization header name (lowercase for lookups) */
export const HEADER_AUTHORIZATION = "authorization";

/** Trace ID header name (lowercase for lookups) */
export const HEADER_TRACE_ID = "x-trace-id";

/** Trace ID header name (title-case for setting headers) */
export const HEADER_TRACE_ID_TITLE = "X-Trace-Id";

// ============================================================================
// COMMON MIME TYPES
// ============================================================================

/** JSON MIME type */
export const MIME_JSON = "application/json";

/** RFC 7807 Problem Details MIME type */
export const MIME_PROBLEM_JSON = "application/problem+json";

/** HTML MIME type */
export const MIME_HTML = "text/html";

/** Plain text MIME type */
export const MIME_TEXT = "text/plain";

/** Form URL-encoded MIME type */
export const MIME_FORM_URLENCODED = "application/x-www-form-urlencoded";

// ============================================================================
// HTTP STATUS TITLES
// ============================================================================

const STATUS_TITLES: Record<number, string> = {
  // 2xx Success
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  // 3xx Redirection
  301: "Moved Permanently",
  302: "Found",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  // 4xx Client Errors
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  409: "Conflict",
  410: "Gone",
  413: "Payload Too Large",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  // 5xx Server Errors
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

/**
 * Returns the standard title for an HTTP status code.
 *
 * @example
 * ```typescript
 * statusTitle(200);  // "OK"
 * statusTitle(404);  // "Not Found"
 * statusTitle(999);  // "Error"
 * ```
 */
export function statusTitle(code: number): string {
  return STATUS_TITLES[code] ?? "Error";
}
