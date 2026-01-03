// Request parsing utilities

import { decodeJson, decodeText } from "./encoding.js";
import { findHeader, findAllHeaders } from "./headers.js";

// ---- Types from mik:core/handler ----

export type Method = "get" | "post" | "put" | "patch" | "delete" | "head" | "options";

export interface RequestData {
  method: Method;
  path: string;
  headers: [string, string][];
  body: Uint8Array | undefined;
}

// ---- Parsing helpers ----

export function parseJson<T>(body: Uint8Array | undefined): T | null {
  if (!body || body.length === 0) return null;
  return decodeJson<T>(body);
}

export function getPath(req: RequestData): string {
  return req.path.split("?")[0];
}

export function getQuery(req: RequestData): URLSearchParams {
  const queryStart = req.path.indexOf("?");
  if (queryStart === -1) return new URLSearchParams();
  return new URLSearchParams(req.path.slice(queryStart + 1));
}

export function getHeader(req: RequestData, name: string): string | null {
  return findHeader(req.headers, name);
}

export function getHeaders(req: RequestData, name: string): string[] {
  return findAllHeaders(req.headers, name);
}

export function getText(req: RequestData): string {
  if (!req.body || req.body.length === 0) return "";
  return decodeText(req.body);
}
