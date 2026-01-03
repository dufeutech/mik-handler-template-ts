// Time utilities

export function now(): number {
  return Math.floor(Date.now() / 1000);
}

export function nowMillis(): number {
  return Date.now();
}

export function nowIso(): string {
  return new Date().toISOString();
}
