// Random utilities
// Uses crypto.getRandomValues (available in WASI)

export function bytes(length: number): Uint8Array {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}

export function u64(): bigint {
  const arr = new BigUint64Array(1);
  crypto.getRandomValues(new Uint8Array(arr.buffer));
  return arr[0];
}

export function uuid(): string {
  const b = bytes(16);
  // Set version 4 and variant bits
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;

  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function hex(length: number): string {
  return Array.from(bytes(length), (x) => x.toString(16).padStart(2, "0")).join("");
}
