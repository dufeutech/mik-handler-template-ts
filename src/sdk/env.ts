// Environment variable utilities
// In WASI, env vars come from the host runtime

// Cache for environment variables (populated on first access)
let envCache: Map<string, string> | null = null;

function getEnvMap(): Map<string, string> {
  if (envCache) return envCache;

  envCache = new Map();

  // In WASI/browser, we may not have process.env
  // Try to access it if available
  if (typeof process !== "undefined" && process.env) {
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        envCache.set(key, value);
      }
    }
  }

  return envCache;
}

export function get(name: string): string | null {
  return getEnvMap().get(name) ?? null;
}

export function getOr(name: string, defaultValue: string): string {
  return getEnvMap().get(name) ?? defaultValue;
}

export function bool(name: string, defaultValue: boolean): boolean {
  const value = get(name);
  if (value === null) return defaultValue;

  const lower = value.toLowerCase();
  return lower === "true" || lower === "1" || lower === "yes";
}

export function int(name: string, defaultValue: number): number {
  const value = get(name);
  if (value === null) return defaultValue;

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function all(): Map<string, string> {
  return new Map(getEnvMap());
}

// Clear cache (useful for testing)
export function clearCache(): void {
  envCache = null;
}
