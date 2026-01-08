export type HeaderToggle = {
  enabled: boolean;
  value: string;
};

export type HeaderGroup<T> = {
  enabled: boolean;
} & T;

/* ============================================================
   SECURITY HEADERS
   ============================================================ */

export type SecurityHeadersConfig = HeaderGroup<{
  csp?: HeaderToggle;
  xContentTypeOptions?: HeaderToggle;
  xFrameOptions?: HeaderToggle;
  referrerPolicy?: HeaderToggle;
  permissionsPolicy?: HeaderToggle;
}>;

/* ============================================================
   CROSS-ORIGIN HEADERS
   ============================================================ */

export type CrossOriginHeadersConfig = HeaderGroup<{
  coop?: HeaderToggle;
  coep?: HeaderToggle;
  corp?: HeaderToggle;
}>;

/* ============================================================
   CACHE HEADERS
   ============================================================ */

export type CacheHeadersConfig = HeaderGroup<{
  cacheControl?: HeaderToggle;
  pragma?: HeaderToggle;
  expires?: HeaderToggle;
  vary?: HeaderToggle;
}>;

/* ============================================================
   LEGACY HEADERS
   ============================================================ */

export type LegacyHeadersConfig = HeaderGroup<{
  xXssProtection?: HeaderToggle;
  expectCt?: HeaderToggle;
}>;

/* ============================================================
   ROOT CONFIG (AUTHORITATIVE)
   ============================================================ */

export type AstroHttpConfig = Readonly<{
  security?: SecurityHeadersConfig;
  crossOrigin?: CrossOriginHeadersConfig;
  cache?: CacheHeadersConfig;
  legacy?: LegacyHeadersConfig;
  custom?: Readonly<Record<string, string>>;
}>;