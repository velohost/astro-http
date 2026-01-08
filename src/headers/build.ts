import type { AstroHttpConfig } from "../config/types";

/**
 * Build a flat map of HTTP headers from validated config.
 *
 * This function:
 * - Fails closed
 * - Emits strings only
 * - Guards against header injection
 * - Avoids prototype pollution
 */
export function buildHeaders(
  config: AstroHttpConfig
): Record<string, string> {
  const headers: Record<string, string> = Object.create(null);

  const safeSet = (key: string, value: string) => {
    if (!key || !value) return;
    if (key.includes("\r") || key.includes("\n")) return;
    if (value.includes("\r") || value.includes("\n")) return;
    headers[key] = value;
  };

  /* ============================================================
     SECURITY HEADERS
     ============================================================ */

  if (config.security?.enabled) {
    const s = config.security;

    if (s.csp?.enabled && typeof s.csp.value === "string") {
      safeSet("Content-Security-Policy", s.csp.value);
    }

    if (
      s.xContentTypeOptions?.enabled &&
      typeof s.xContentTypeOptions.value === "string"
    ) {
      safeSet("X-Content-Type-Options", s.xContentTypeOptions.value);
    }

    if (
      s.xFrameOptions?.enabled &&
      typeof s.xFrameOptions.value === "string"
    ) {
      safeSet("X-Frame-Options", s.xFrameOptions.value);
    }

    if (
      s.referrerPolicy?.enabled &&
      typeof s.referrerPolicy.value === "string"
    ) {
      safeSet("Referrer-Policy", s.referrerPolicy.value);
    }

    if (
      s.permissionsPolicy?.enabled &&
      typeof s.permissionsPolicy.value === "string"
    ) {
      safeSet("Permissions-Policy", s.permissionsPolicy.value);
    }
  }

  /* ============================================================
     CROSS-ORIGIN ISOLATION
     ============================================================ */

  if (config.crossOrigin?.enabled) {
    const c = config.crossOrigin;

    if (c.coop?.enabled && typeof c.coop.value === "string") {
      safeSet("Cross-Origin-Opener-Policy", c.coop.value);
    }

    if (c.coep?.enabled && typeof c.coep.value === "string") {
      safeSet("Cross-Origin-Embedder-Policy", c.coep.value);
    }

    if (c.corp?.enabled && typeof c.corp.value === "string") {
      safeSet("Cross-Origin-Resource-Policy", c.corp.value);
    }
  }

  /* ============================================================
     CACHE / CORRECTNESS
     ============================================================ */

  if (config.cache?.enabled) {
    const c = config.cache;

    if (c.cacheControl?.enabled && typeof c.cacheControl.value === "string") {
      safeSet("Cache-Control", c.cacheControl.value);
    }

    if (c.pragma?.enabled && typeof c.pragma.value === "string") {
      safeSet("Pragma", c.pragma.value);
    }

    if (c.expires?.enabled && typeof c.expires.value === "string") {
      safeSet("Expires", c.expires.value);
    }

    if (c.vary?.enabled && typeof c.vary.value === "string") {
      safeSet("Vary", c.vary.value);
    }
  }

  /* ============================================================
     LEGACY HEADERS
     ============================================================ */

  if (config.legacy?.enabled) {
    const l = config.legacy;

    if (
      l.xXssProtection?.enabled &&
      typeof l.xXssProtection.value === "string"
    ) {
      safeSet("X-XSS-Protection", l.xXssProtection.value);
    }

    if (l.expectCt?.enabled && typeof l.expectCt.value === "string") {
      safeSet("Expect-CT", l.expectCt.value);
    }
  }

  /* ============================================================
     CUSTOM HEADERS
     ============================================================ */

  if (config.custom && typeof config.custom === "object") {
    for (const key of Object.keys(config.custom)) {
      const value = (config.custom as Record<string, unknown>)[key];
      if (typeof value === "string") {
        safeSet(key, value);
      }
    }
  }

  return headers;
}