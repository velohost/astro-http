# astro-http

Declarative, **fail-closed HTTP response headers** for Astro.

`astro-http` gives you full, explicit control over security, privacy, cache, and legacy HTTP headers using a single, auditable configuration file — with **no guessing, no defaults injected, and no magic**.

---

## Installation

```bash
npm install astro-http
```

---

## Usage

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import astroHttp from "astro-http";

export default defineConfig({
  integrations: [
    astroHttp()
  ],
});
```

On first `npm run dev`, a file called **`astro-http.config.js`** will be created in your project root.

This file is:
- Never overwritten
- Safe to commit
- The **only source of truth** for which headers are sent

---

## How It Works

- Headers are applied using Astro middleware
- Only headers **explicitly enabled** in the config are sent
- Disabled headers **do not exist at all**
- No runtime mutation
- No defaults injected
- No prototype inheritance
- No header merging

If it’s not enabled in the config, it is **not sent**.

---

## Configuration File

### `astro-http.config.js`

This file controls **all HTTP response headers** for your site.

Example (default generated file):

```js
export default {
  security: {
    enabled: true,

    csp: {
      enabled: true,
      value: "default-src 'self'",
    },

    xContentTypeOptions: {
      enabled: true,
      value: "nosniff",
    },

    xFrameOptions: {
      enabled: true,
      value: "DENY",
    },

    referrerPolicy: {
      enabled: true,
      value: "strict-origin-when-cross-origin",
    },

    permissionsPolicy: {
      enabled: true,
      value: "camera=(), microphone=(), geolocation=()",
    },
  },

  crossOrigin: {
    enabled: false,
  },

  cache: {
    enabled: false,
  },

  legacy: {
    enabled: false,
  },

  custom: {
    // "X-Powered-By": "astro-http",
  },
};
```

---

## Header Groups Explained

### Security Headers

Controls modern browser security protections.

| Header | Purpose |
|------|--------|
| **Content-Security-Policy** | Prevents XSS and injection |
| **X-Content-Type-Options** | Prevents MIME sniffing |
| **X-Frame-Options** | Prevents clickjacking |
| **Referrer-Policy** | Limits referrer leakage |
| **Permissions-Policy** | Locks down browser APIs |

Each header has:
- `enabled: true | false`
- `value: string`

If `enabled` is `false`, the header is **not sent**.

---

### Cross-Origin Headers

Advanced isolation and privacy controls.

Used only when you fully understand the impact.

Headers include:
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Embedder-Policy`
- `Cross-Origin-Resource-Policy`

Disabled by default.

---

### Cache Headers

Controls browser and proxy caching behavior.

Useful for:
- Sensitive pages
- Auth flows
- APIs
- Static assets

---

### Legacy Headers

Deprecated or obsolete headers.

Included only for compatibility with legacy environments.

---

### Custom Headers

Send **any additional headers** exactly as written.

```js
custom: {
  "X-Powered-By": "astro-http",
  "X-Robots-Tag": "noindex",
}
```

- No validation
- No transformation
- Sent verbatim

---

## Security Model

`astro-http` is designed to be **auditable and boring**:

- No defaults
- No heuristics
- No mutation after load
- Headers stored using a global symbol
- Values deep-frozen
- Header injection guarded
- Fails closed on error

If the config cannot be loaded safely, **no headers are applied**.

---

## Astro Compatibility

- Astro `^4`
- Astro `^5`
- Astro `^6`

---

## License

MIT © Velohost UK Limited  
https://github.com/velohost/astro-http
