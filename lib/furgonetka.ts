// Klient API Furgonetki — UŻYWAĆ WYŁĄCZNIE po stronie serwera (route handlers,
// server actions). Korzysta z sekretów z .env; nie importować w kodzie klienta.
// Token OAuth pobierany grantem "password" i cache'owany w pamięci procesu.
// Bazę API można przełączyć na środowisko testowe (demo) przez .env, żeby
// bezpiecznie próbować nadań bez realnych opłat. Domyślnie produkcja.
export const API_BASE =
  process.env.FURGONETKA_API_BASE || "https://api.furgonetka.pl";
const OAUTH_URL = `${API_BASE}/oauth/token`;

type TokenCache = { accessToken: string; wygasa: number };
let cache: TokenCache | null = null;

function konfiguracja() {
  const clientId = process.env.FURGONETKA_CLIENT_ID;
  const clientSecret = process.env.FURGONETKA_CLIENT_SECRET;
  const username = process.env.FURGONETKA_USERNAME;
  const password = process.env.FURGONETKA_PASSWORD;
  if (!clientId || !clientSecret || !username || !password) {
    throw new Error(
      "Brak konfiguracji Furgonetki w .env (FURGONETKA_CLIENT_ID/SECRET/USERNAME/PASSWORD)."
    );
  }
  return { clientId, clientSecret, username, password };
}

/** Zwraca ważny access_token, pobierając nowy gdy poprzedni wygasł. */
export async function pobierzToken(): Promise<string> {
  const teraz = Date.now();
  if (cache && cache.wygasa > teraz + 60_000) return cache.accessToken;

  const { clientId, clientSecret, username, password } = konfiguracja();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "password",
      scope: "api",
      username,
      password,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Furgonetka OAuth ${res.status}: ${await res.text()}`);
  }

  const dane = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cache = {
    accessToken: dane.access_token,
    wygasa: teraz + dane.expires_in * 1000,
  };
  return dane.access_token;
}

/** Wywołanie autoryzowanego endpointu REST Furgonetki. */
export async function furgonetkaFetch(
  sciezka: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await pobierzToken();
  // Content-Type: application/json tylko gdy faktycznie wysyłamy ciało.
  // Przy GET bez ciała Furgonetka próbuje parsować puste body i zwraca
  // 400 "JSON decode error".
  const maBody = init.body != null;
  return fetch(`${API_BASE}${sciezka}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(maBody ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}
