import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";

import { ensureConfigFile } from "./config/writer.js";
import { loadConfig } from "./config/loader.js";
import { buildHeaders } from "./headers/build.js";
import { setHeaders } from "./runtime.js";

export default function astroHttp(): AstroIntegration {
  return {
    name: "astro-http",

    hooks: {
      "astro:config:setup": async ({
        command,
        config,
        addWatchFile,
        addMiddleware,
      }) => {
        const root = fileURLToPath(config.root);

        // Dev-only: generate config if missing
        if (command === "dev") {
          ensureConfigFile(root);
        }

        // Load → build → atomically replace headers
        const resolvedConfig = await loadConfig(root);
        const headers = buildHeaders(resolvedConfig);
        setHeaders(headers);

        // Register middleware once (Astro handles deduping)
        addMiddleware({
          entrypoint: new URL("./middleware.js", import.meta.url),
          order: "post",
        });

        // Enable live reload when config changes
        addWatchFile(`${root}/astro-http.config.js`);
      },
    },
  };
}