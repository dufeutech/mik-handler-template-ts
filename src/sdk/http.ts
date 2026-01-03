// HTTP client for making outbound requests
// Uses fetch API (available in WASI runtimes)

import { encodeJson, encodeText, decodeJson, decodeText } from "./encoding.js";
import { headersToMap } from "./headers.js";
import { isSuccess, isClientError, isServerError } from "./http-status.js";
import { MIME_JSON, HEADER_CONTENT_TYPE_TITLE } from "./constants.js";

export interface HttpResponse {
  status: number;
  headers: Map<string, string>;
  body: Uint8Array;

  // Helper methods
  ok: boolean;
  isSuccess: () => boolean;
  isClientError: () => boolean;
  isServerError: () => boolean;
  text: () => string;
  json: <T>() => T | null;
  header: (name: string) => string | null;
}

export interface HttpError {
  type: "network" | "timeout" | "invalid_url" | "unknown";
  message: string;
}

export type HttpResult =
  | { ok: true; value: HttpResponse }
  | { ok: false; error: HttpError };

function createResponse(status: number, headers: Headers, body: Uint8Array): HttpResponse {
  const headerMap = headersToMap(headers);

  return {
    status,
    headers: headerMap,
    body,
    ok: isSuccess(status),
    isSuccess: () => isSuccess(status),
    isClientError: () => isClientError(status),
    isServerError: () => isServerError(status),
    text: () => decodeText(body),
    json: <T>() => decodeJson<T>(body),
    header: (name: string) => headerMap.get(name.toLowerCase()) ?? null,
  };
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

class HttpRequest {
  private method: HttpMethod;
  private url: string;
  private reqHeaders: [string, string][] = [];
  private reqBody: Uint8Array | null = null;
  private timeoutMs: number | null = null;

  constructor(method: HttpMethod, url: string) {
    this.method = method;
    this.url = url;
  }

  header(name: string, value: string): this {
    this.reqHeaders.push([name, value]);
    return this;
  }

  body(data: Uint8Array | string): this {
    if (typeof data === "string") {
      this.reqBody = encodeText(data);
    } else {
      this.reqBody = data;
    }
    return this;
  }

  json<T>(data: T): this {
    this.reqHeaders.push([HEADER_CONTENT_TYPE_TITLE, MIME_JSON]);
    this.reqBody = encodeJson(data);
    return this;
  }

  timeout(ms: number): this {
    this.timeoutMs = ms;
    return this;
  }

  async send(): Promise<HttpResult> {
    try {
      const controller = new AbortController();
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      if (this.timeoutMs) {
        timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
      }

      const headers = new Headers();
      for (const [name, value] of this.reqHeaders) {
        headers.append(name, value);
      }

      const response = await fetch(this.url, {
        method: this.method,
        headers,
        body: this.reqBody,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      const body = new Uint8Array(await response.arrayBuffer());
      return {
        ok: true,
        value: createResponse(response.status, response.headers, body),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes("abort")) {
        return { ok: false, error: { type: "timeout", message: "Request timed out" } };
      }
      if (message.includes("URL") || message.includes("url")) {
        return { ok: false, error: { type: "invalid_url", message } };
      }
      if (message.includes("network") || message.includes("fetch")) {
        return { ok: false, error: { type: "network", message } };
      }

      return { ok: false, error: { type: "unknown", message } };
    }
  }
}

// Factory functions
export function get(url: string): HttpRequest {
  return new HttpRequest("GET", url);
}

export function post(url: string): HttpRequest {
  return new HttpRequest("POST", url);
}

export function put(url: string): HttpRequest {
  return new HttpRequest("PUT", url);
}

export function patch(url: string): HttpRequest {
  return new HttpRequest("PATCH", url);
}

export function del(url: string): HttpRequest {
  return new HttpRequest("DELETE", url);
}

export function head(url: string): HttpRequest {
  return new HttpRequest("HEAD", url);
}

export function options(url: string): HttpRequest {
  return new HttpRequest("OPTIONS", url);
}
