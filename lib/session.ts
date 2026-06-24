// Podpisane tokeny sesji (HMAC-SHA256) oparte o Web Crypto.
// Działa zarówno w środowisku Node (Server Actions), jak i edge (proxy).
// Token NIE jest możliwy do podrobienia bez znajomości sekretu.

const SECRET =
  process.env.SESSION_SECRET ||
  "nawia-domyslny-sekret-ZMIEN-w-produkcji-2026-xyz";

export const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 godzin

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(s: string): Uint8Array {
  let str = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4 ? 4 - (str.length % 4) : 0;
  str += "=".repeat(pad);
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function klucz(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Tworzy podpisany token sesji z czasem wygaśnięcia. */
export async function utworzToken(
  ttlMs: number = SESSION_TTL_MS
): Promise<string> {
  const payload = bytesToB64url(
    enc.encode(JSON.stringify({ exp: Date.now() + ttlMs }))
  );
  const sig = await crypto.subtle.sign("HMAC", await klucz(), enc.encode(payload));
  return `${payload}.${bytesToB64url(new Uint8Array(sig))}`;
}

/** Weryfikuje podpis i ważność tokena. Zwraca true tylko dla prawidłowej, niewygasłej sesji. */
export async function weryfikujToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const kropka = token.indexOf(".");
  if (kropka < 1) return false;

  const payload = token.slice(0, kropka);
  const sig = token.slice(kropka + 1);

  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await klucz(),
      b64urlToBytes(sig),
      enc.encode(payload)
    );
    if (!ok) return false;

    const dane = JSON.parse(dec.decode(b64urlToBytes(payload))) as {
      exp?: number;
    };
    return typeof dane.exp === "number" && dane.exp > Date.now();
  } catch {
    return false;
  }
}
