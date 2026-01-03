// HTTP status code utilities
// Centralized status range checks and helpers

/**
 * Check if status code indicates success (2xx).
 */
export function isSuccess(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Check if status code indicates client error (4xx).
 */
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500;
}

/**
 * Check if status code indicates server error (5xx).
 */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600;
}

/**
 * Check if status code indicates a redirect (3xx).
 */
export function isRedirect(status: number): boolean {
  return status >= 300 && status < 400;
}
