// Header handling utilities
// Centralized case-insensitive header operations

/**
 * Find a header value by name (case-insensitive).
 * Returns null if not found.
 */
export function findHeader(
  headers: [string, string][],
  name: string
): string | null {
  const lower = name.toLowerCase();
  for (const [key, value] of headers) {
    if (key.toLowerCase() === lower) {
      return value;
    }
  }
  return null;
}

/**
 * Find all header values by name (case-insensitive).
 * Returns empty array if none found.
 */
export function findAllHeaders(
  headers: [string, string][],
  name: string
): string[] {
  const lower = name.toLowerCase();
  const values: string[] = [];
  for (const [key, value] of headers) {
    if (key.toLowerCase() === lower) {
      values.push(value);
    }
  }
  return values;
}

/**
 * Convert Headers object to a Map with lowercase keys.
 */
export function headersToMap(headers: Headers): Map<string, string> {
  const map = new Map<string, string>();
  headers.forEach((value, key) => {
    map.set(key.toLowerCase(), value);
  });
  return map;
}
