// Simple router for mik handlers

import type { RequestData, Method } from "./request.js";
import type { Response } from "./response.js";
import { notFound } from "./response.js";

export interface RouteParams {
  [key: string]: string;
}

export type Handler = (req: RequestData, params: RouteParams) => Response;

interface Route {
  method: Method;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  private addRoute(method: Method, path: string, handler: Handler): this {
    const paramNames: string[] = [];

    // Convert path pattern to regex
    // e.g., "/users/{id}" -> /^\/users\/([^/]+)$/
    const patternStr = path
      .replace(/\{(\w+)\}/g, (_, name) => {
        paramNames.push(name);
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    const pattern = new RegExp(`^${patternStr}$`);

    this.routes.push({ method, pattern, paramNames, handler });
    return this;
  }

  get(path: string, handler: Handler): this {
    return this.addRoute("get", path, handler);
  }

  post(path: string, handler: Handler): this {
    return this.addRoute("post", path, handler);
  }

  put(path: string, handler: Handler): this {
    return this.addRoute("put", path, handler);
  }

  patch(path: string, handler: Handler): this {
    return this.addRoute("patch", path, handler);
  }

  delete(path: string, handler: Handler): this {
    return this.addRoute("delete", path, handler);
  }

  handle(req: RequestData): Response {
    const path = req.path.split("?")[0];
    const method = req.method.toLowerCase() as Method;

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = path.match(route.pattern);
      if (!match) continue;

      // Extract params
      const params: RouteParams = {};
      for (let i = 0; i < route.paramNames.length; i++) {
        params[route.paramNames[i]] = decodeURIComponent(match[i + 1]);
      }

      return route.handler(req, params);
    }

    return notFound("Route not found");
  }
}

export function createRouter(): Router {
  return new Router();
}
