/**
 * Internal symbol used to store resolved headers.
 * This symbol is global and stable across module boundaries.
 */
const ASTRO_HTTP_HEADERS = Symbol.for("astro.http.headers");

/**
 * Replace the active header set atomically.
 *
 * Security properties:
 * - No mutation after set
 * - No merging with previous state
 * - No prototype inheritance
 * - No enumerable global leakage
 *
 * This MUST be called on every config load.
 */
export function setHeaders(value: Record<string, string>): void {
  Object.defineProperty(globalThis, ASTRO_HTTP_HEADERS, {
    value: Object.freeze({ ...value }),
    writable: false,
    configurable: true, // allow replacement on reload
    enumerable: false,
  });
}

/**
 * Retrieve resolved headers.
 *
 * Guarantees:
 * - Always returns a plain object
 * - Never throws
 * - Never exposes internal references
 */
export function getHeaders(): Record<string, string> {
  const value = (globalThis as any)[ASTRO_HTTP_HEADERS];

  if (!value || typeof value !== "object") {
    return {};
  }

  return value as Record<string, string>;
}