// Request parsing utilities

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
  try {
    return JSON.parse(new TextDecoder().decode(body)) as T;
  } catch {
    return null;
  }
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
  const lower = name.toLowerCase();
  for (const [key, value] of req.headers) {
    if (key.toLowerCase() === lower) return value;
  }
  return null;
}

export function getHeaders(req: RequestData, name: string): string[] {
  const lower = name.toLowerCase();
  const values: string[] = [];
  for (const [key, value] of req.headers) {
    if (key.toLowerCase() === lower) values.push(value);
  }
  return values;
}

export function getText(req: RequestData): string {
  if (!req.body || req.body.length === 0) return "";
  return new TextDecoder().decode(req.body);
}
