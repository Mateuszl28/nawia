/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Polityka bezpieczeństwa treści (CSP).
// W trybie dev Turbopack/HMR wymaga 'unsafe-eval' i połączeń websocket.
// Widget mapy paczkomatów Furgonetki ładuje skrypt, API i kafelki mapy z
// zewnętrznych domen — muszą być dopuszczone w odpowiednich dyrektywach,
// inaczej przeglądarka blokuje mapę (skrypt się nie wczytuje).
// Skrypt mapy (MapLibre GL) tworzy web-workery z blob: — bez worker-src
// spadłoby na default-src 'self' i workery byłyby blokowane (mapa się nie
// renderuje). Style/kafelki/API mapy idą z *.furgonetka.pl.
const furgonetka = "https://furgonetka.pl https://*.furgonetka.pl";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' blob: ${furgonetka}${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline' ${furgonetka}`,
  `img-src 'self' data: blob: ${furgonetka}`,
  "font-src 'self' data:",
  `connect-src 'self' ${furgonetka}${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  `frame-src ${furgonetka}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Upload zdjęć produktów przez Server Actions (domyślny limit to 1 MB).
  // Do 8 zdjęć × ~8 MB w jednym żądaniu — musi się zgadzać z nginx
  // (client_max_body_size w vhoście nawiabizuteria.conf).
  experimental: {
    serverActions: { bodySizeLimit: "64mb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
