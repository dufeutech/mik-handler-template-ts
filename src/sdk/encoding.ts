// Text and JSON encoding utilities
// Centralized to avoid duplication across response, request, and http modules

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Encode a string to UTF-8 bytes.
 */
export function encodeText(text: string): Uint8Array {
  return encoder.encode(text);
}

/**
 * Decode UTF-8 bytes to a string.
 */
export function decodeText(bytes: Uint8Array): string {
  return decoder.decode(bytes);
}

/**
 * Encode a value as JSON UTF-8 bytes.
 */
export function encodeJson<T>(data: T): Uint8Array {
  return encoder.encode(JSON.stringify(data));
}

/**
 * Decode JSON UTF-8 bytes to a value.
 * Returns null if parsing fails.
 */
export function decodeJson<T>(bytes: Uint8Array): T | null {
  try {
    return JSON.parse(decoder.decode(bytes)) as T;
  } catch {
    return null;
  }
}
