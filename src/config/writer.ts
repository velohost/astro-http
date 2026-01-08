import fs from "node:fs";
import path from "node:path";

/**
 * Create astro-http.config.js on first dev run
 *
 * Security guarantees:
 * - Dev-only usage
 * - Never overwrites existing files
 * - Atomic write
 * - Rooted path only
 * - No user-controlled input
 *
 * This file is intentionally verbose and self-documented.
 * It acts as a local security reference and is safe to commit.
 */
export function ensureConfigFile(root: string): void {
  const resolvedRoot = path.resolve(root);
  const filePath = path.join(resolvedRoot, "astro-http.config.js");

  // Ensure the file is written inside the project root
  if (!filePath.startsWith(resolvedRoot + path.sep)) return;

  // Never overwrite an existing config
  if (fs.existsSync(filePath)) return;

  const contents = `// astro-http.config.js
//
// This file controls HTTP *response headers* for your Astro site.
//
// Headers are applied via Astro middleware and affect HTML responses,
// not just static assets.
//
// ─────────────────────────────────────────────────────────────
// IMPORTANT PRINCIPLES
// ─────────────────────────────────────────────────────────────
//
// • Nothing here is auto-guessed
// • Nothing is silently enabled
// • Disabled means NOT SENT
// • This file is never overwritten
// • This file is safe to commit to version control
//
// If a header is enabled here, it will be sent exactly as written.
// If it is disabled, it will not exist at all.
//
// ─────────────────────────────────────────────────────────────

export default {
  /* ============================================================
     SECURITY HEADERS
     ============================================================ */

  security: {
    enabled: true,

    /**
     * Content-Security-Policy (CSP)
     *
     * What it does:
     * - Restricts where scripts, styles, images, fonts, etc. may load from
     * - Mitigates Cross-Site Scripting (XSS)
     * - Prevents injected scripts from executing
     *
     * Why it matters:
     * - CSP is one of the strongest client-side security controls available
     * - Misconfiguration WILL break sites
     *
     * Allowed values:
     * - Any valid CSP directive string
     *
     * Common examples:
     * - "default-src 'self'"
     * - "default-src 'self'; img-src 'self' data:"
     * - "default-src 'self'; script-src 'self' https://trusted.cdn"
     *
     * Docs:
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
     */
    csp: {
      enabled: true,
      value: "default-src 'self'",
    },

    /**
     * X-Content-Type-Options
     *
     * What it does:
     * - Prevents browsers from MIME-sniffing responses
     * - Stops HTML being executed when served as another type
     *
     * Allowed values:
     * - "nosniff" (the only valid value)
     *
     * Recommendation:
     * - Enable on all production sites
     */
    xContentTypeOptions: {
      enabled: true,
      value: "nosniff",
    },

    /**
     * X-Frame-Options
     *
     * What it does:
     * - Prevents your site being embedded in iframes
     * - Mitigates clickjacking attacks
     *
     * Allowed values:
     * - "DENY"        → never allow framing (strongest)
     * - "SAMEORIGIN" → allow framing on the same origin
     *
     * Note:
     * - Modern alternative is CSP frame-ancestors
     */
    xFrameOptions: {
      enabled: true,
      value: "DENY",
    },

    /**
     * Referrer-Policy
     *
     * What it does:
     * - Controls how much referrer information is sent with requests
     *
     * Common values:
     * - "no-referrer"
     * - "same-origin"
     * - "strict-origin"
     * - "strict-origin-when-cross-origin" (recommended)
     *
     * Recommendation:
     * - Use strict-origin-when-cross-origin for most sites
     */
    referrerPolicy: {
      enabled: true,
      value: "strict-origin-when-cross-origin",
    },

    /**
     * Permissions-Policy
     *
     * What it does:
     * - Controls access to powerful browser features
     * - camera, microphone, geolocation, fullscreen, etc.
     *
     * Example:
     * - "camera=(), microphone=(), geolocation=()"
     *
     * Docs:
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy
     */
    permissionsPolicy: {
      enabled: true,
      value: "camera=(), microphone=(), geolocation=()",
    },
  },

  /* ============================================================
     CROSS-ORIGIN ISOLATION / PRIVACY
     ============================================================ */

  crossOrigin: {
    enabled: false,

    /**
     * Cross-Origin-Opener-Policy (COOP)
     *
     * What it does:
     * - Isolates the browsing context
     * - Required for SharedArrayBuffer
     *
     * Allowed values:
     * - "same-origin"
     */
    coop: {
      enabled: false,
      value: "same-origin",
    },

    /**
     * Cross-Origin-Embedder-Policy (COEP)
     *
     * What it does:
     * - Blocks loading resources without explicit permission
     *
     * WARNING:
     * - Will break third-party embeds if misused
     *
     * Allowed values:
     * - "require-corp"
     */
    coep: {
      enabled: false,
      value: "require-corp",
    },

    /**
     * Cross-Origin-Resource-Policy (CORP)
     *
     * What it does:
     * - Controls who can load your resources
     *
     * Allowed values:
     * - "same-origin"
     * - "cross-origin"
     */
    corp: {
      enabled: false,
      value: "same-origin",
    },
  },

  /* ============================================================
     CACHE / CORRECTNESS
     ============================================================ */

  cache: {
    enabled: false,

    /**
     * Cache-Control
     *
     * What it does:
     * - Controls browser and proxy caching behaviour
     *
     * Examples:
     * - "no-store"
     * - "public, max-age=3600"
     */
    cacheControl: {
      enabled: false,
      value: "no-store",
    },

    /**
     * Pragma
     *
     * Legacy HTTP/1.0 cache control header
     */
    pragma: {
      enabled: false,
      value: "no-cache",
    },

    /**
     * Expires
     *
     * Absolute expiry time for cached responses
     */
    expires: {
      enabled: false,
      value: "0",
    },

    /**
     * Vary
     *
     * Controls cache key variance
     */
    vary: {
      enabled: false,
      value: "*",
    },
  },

  /* ============================================================
     LEGACY / OPTIONAL
     ============================================================ */

  legacy: {
    enabled: false,

    /**
     * X-XSS-Protection
     *
     * Status:
     * - Deprecated
     * - Ignored by modern browsers
     */
    xXssProtection: {
      enabled: false,
      value: "0",
    },

    /**
     * Expect-CT
     *
     * Status:
     * - Deprecated
     * - Certificate Transparency handled elsewhere
     */
    expectCt: {
      enabled: false,
      value: "max-age=0",
    },
  },

  /* ============================================================
     CUSTOM HEADERS
     ============================================================ */

  /**
   * Any additional headers you want to send.
   * Keys and values are sent exactly as provided.
   */
  custom: {
    // "X-Powered-By": "astro-http",
  },
};
`;

  const tmpPath = filePath + ".tmp";

  try {
    fs.writeFileSync(tmpPath, contents, { encoding: "utf8", flag: "wx" });
    fs.renameSync(tmpPath, filePath);
  } catch {
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {
      /* ignore */
    }
  }
}