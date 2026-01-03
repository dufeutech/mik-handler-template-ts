// Guard and ensure helpers for early return validation
// Since TypeScript doesn't have macros, these return Response | null

import { type Response, error } from "./response.js";
import { statusTitle } from "./constants.js";

/**
 * Guard - returns error response if condition is false, null otherwise.
 *
 * Usage:
 * ```typescript
 * const err = guard(!name.isEmpty(), 400, "Name is required");
 * if (err) return err;
 *
 * // Or with helper:
 * const result = guardAll(
 *   [!name.isEmpty(), 400, "Name is required"],
 *   [name.length <= 100, 400, "Name too long"],
 * );
 * if (result) return result;
 * ```
 */
export function guard(
  condition: boolean,
  status: number,
  message: string
): Response | null {
  if (!condition) {
    return error({
      title: statusTitle(status),
      status,
      detail: message,
    });
  }
  return null;
}

/**
 * GuardAll - check multiple conditions, return first failure.
 *
 * Usage:
 * ```typescript
 * const err = guardAll(
 *   [!!input.name, 400, "Name is required"],
 *   [!!input.email, 400, "Email is required"],
 *   [input.email.includes("@"), 400, "Invalid email"],
 * );
 * if (err) return err;
 * ```
 */
export function guardAll(
  ...conditions: [boolean, number, string][]
): Response | null {
  for (const [condition, status, message] of conditions) {
    if (!condition) {
      return error({
        title: statusTitle(status),
        status,
        detail: message,
      });
    }
  }
  return null;
}

/**
 * Ensure result type - either the value or an error response.
 */
export type EnsureResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: Response };

/**
 * Ensure - unwrap a value or return error response.
 *
 * Usage:
 * ```typescript
 * const result = ensure(findUser(id), 404, "User not found");
 * if (!result.ok) return result.error;
 * const user = result.value;
 *
 * // Or with multiple:
 * const userResult = ensure(findUser(id), 404, "User not found");
 * if (!userResult.ok) return userResult.error;
 *
 * const itemResult = ensure(findItem(itemId), 404, "Item not found");
 * if (!itemResult.ok) return itemResult.error;
 * ```
 */
export function ensure<T>(
  value: T | null | undefined,
  status: number,
  message: string
): EnsureResult<T> {
  if (value === null || value === undefined) {
    return {
      ok: false,
      error: error({
        title: statusTitle(status),
        status,
        detail: message,
      }),
    };
  }
  return { ok: true, value };
}

/**
 * EnsureOk - unwrap a Result-like object or return error response.
 *
 * Usage:
 * ```typescript
 * const result = ensureOk(parseJson(body), 400, "Invalid JSON");
 * if (!result.ok) return result.error;
 * const data = result.value;
 * ```
 */
export function ensureOk<T, E>(
  result: { ok: true; value: T } | { ok: false; error: E },
  status: number,
  message: string
): EnsureResult<T> {
  if (!result.ok) {
    return {
      ok: false,
      error: error({
        title: statusTitle(status),
        status,
        detail: message,
      }),
    };
  }
  return { ok: true, value: result.value };
}
