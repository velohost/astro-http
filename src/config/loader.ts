import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { AstroHttpConfig } from "./types.js";

const CONFIG_FILENAME = "astro-http.config.js";

/**
 * Load astro-http configuration.
 *
 * SECURITY MODEL
 * ------------------------------------------------------------
 * - Config is user-owned, local, and trusted by definition
 * - Loaded via ESM import (Astro-standard)
 * - No defaults injected
 * - No prototype inheritance
 * - Fail-closed on error
 * - Deep-frozen to prevent mutation
 */
export async function loadConfig(root: string): Promise<AstroHttpConfig> {
  const resolvedRoot = path.resolve(root);
  const filePath = path.join(resolvedRoot, CONFIG_FILENAME);

  // ⛔ Path traversal protection
  if (!filePath.startsWith(resolvedRoot + path.sep)) {
    return emptyConfig();
  }

  // ⛔ No config file → no headers
  if (!fs.existsSync(filePath)) {
    return emptyConfig();
  }

  try {
    const url = pathToFileURL(filePath).href;

    // Cache-bust in dev to allow live reloads
    const mod = await import(`${url}?t=${Date.now()}`);

    const config = mod?.default;

    if (!isPlainObject(config)) {
      return emptyConfig();
    }

    return deepFreeze(stripPrototype(config)) as AstroHttpConfig;
  } catch {
    return emptyConfig();
  }
}

/* ============================================================
   HARD SECURITY HELPERS
   ============================================================ */

function emptyConfig(): AstroHttpConfig {
  return deepFreeze({
    security: undefined,
    crossOrigin: undefined,
    cache: undefined,
    legacy: undefined,
    custom: {},
  } as AstroHttpConfig);
}

/**
 * Ensure no prototype chain survives
 */
function stripPrototype<T extends Record<string, any>>(obj: T): T {
  const clean = Object.create(null);
  for (const [key, value] of Object.entries(obj)) {
    clean[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? stripPrototype(value as any)
        : value;
  }
  return clean;
}

/**
 * Plain object only
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Deep freeze recursively
 */
function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === "object") {
    Object.freeze(obj);
    for (const value of Object.values(obj)) {
      deepFreeze(value);
    }
  }
  return obj;
}