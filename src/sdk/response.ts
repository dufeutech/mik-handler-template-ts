// Response helpers matching mik-sdk patterns
// Uses simple mik:core response format

import { encodeJson } from "./encoding.js";
import {
  MIME_JSON,
  MIME_PROBLEM_JSON,
  HEADER_CONTENT_TYPE,
  statusTitle,
} from "./constants.js";

// ---- Types from mik:core/handler ----

export interface Response {
  status: number;
  headers: [string, string][];
  body: Uint8Array | undefined;
}

// RFC 7807 Problem Details
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

// ---- Success responses ----

export function json<T>(status: number, body: T): Response {
  return {
    status,
    headers: [[HEADER_CONTENT_TYPE, MIME_JSON]],
    body: encodeJson(body),
  };
}

export function ok<T>(body: T): Response {
  return json(200, body);
}

export function created<T>(body: T, location?: string): Response {
  const headers: [string, string][] = [[HEADER_CONTENT_TYPE, MIME_JSON]];
  if (location) {
    headers.push(["location", location]);
  }
  return {
    status: 201,
    headers,
    body: encodeJson(body),
  };
}

export function accepted<T>(body?: T): Response {
  if (body !== undefined) {
    return json(202, body);
  }
  return { status: 202, headers: [], body: undefined };
}

export function noContent(): Response {
  return { status: 204, headers: [], body: undefined };
}

// ---- Redirect responses ----

export function redirect(location: string, permanent = false): Response {
  return {
    status: permanent ? 301 : 302,
    headers: [["location", location]],
    body: undefined,
  };
}

// ---- Error responses (RFC 7807) ----

export function error(problem: ProblemDetails): Response {
  const body = {
    type: problem.type ?? "about:blank",
    ...problem,
  };
  return {
    status: problem.status,
    headers: [[HEADER_CONTENT_TYPE, MIME_PROBLEM_JSON]],
    body: encodeJson(body),
  };
}

/** Create error response for a status code using statusTitle lookup. */
function errorStatus(status: number, detail: string): Response {
  return error({ title: statusTitle(status), status, detail });
}

export function badRequest(detail: string): Response {
  return errorStatus(400, detail);
}

export function unauthorized(detail = "Authentication required"): Response {
  return errorStatus(401, detail);
}

export function forbidden(detail = "Access denied"): Response {
  return errorStatus(403, detail);
}

export function notFound(detail = "Resource not found"): Response {
  return errorStatus(404, detail);
}

export function conflict(detail: string): Response {
  return errorStatus(409, detail);
}

export function unprocessableEntity(detail: string): Response {
  return errorStatus(422, detail);
}

export function internalError(detail = "An unexpected error occurred"): Response {
  return errorStatus(500, detail);
}
