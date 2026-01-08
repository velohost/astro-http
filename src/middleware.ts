import type { MiddlewareHandler } from "astro";
import { getHeaders } from "./runtime.js";

/**
 * Apply resolved HTTP headers to outgoing responses.
 *
 * This middleware:
 * - Fails closed (invalid headers are skipped)
 * - Never throws
 * - Never mutates shared state
 * - Guards against header injection
 */
export const onRequest: MiddlewareHandler = async (_context, next) => {
  const response = await next();

  let headers: unknown;

  try {
    headers = getHeaders();
  } catch {
    return response;
  }

  if (!headers || typeof headers !== "object") {
    return response;
  }

  for (const entry of Object.entries(headers as Record<string, unknown>)) {
    const [key, value] = entry;

    if (typeof key !== "string" || typeof value !== "string") {
      continue;
    }

    // Prevent response splitting / header injection
    if (key.includes("\r") || key.includes("\n")) continue;
    if (value.includes("\r") || value.includes("\n")) continue;

    try {
      response.headers.set(key, value);
    } catch {
      // Ignore invalid header names or values
      continue;
    }
  }

  return response;
};