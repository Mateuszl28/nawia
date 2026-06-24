import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth-shared";
import { SESSION_TTL_MS, utworzToken, weryfikujToken } from "@/lib/session";

// Dane logowania nadpisywalne zmiennymi środowiskowymi.
const LOGIN = process.env.ADMIN_LOGIN || "admin";
const HASLO = process.env.ADMIN_HASLO || "nawia2026";

async function sha256(s: string): Promise<Uint8Array> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return new Uint8Array(d);
}

// Porównanie w czasie stałym (odporne na ataki czasowe).
function stalyCzasEq(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a[i] ^ b[i];
  return r === 0;
}

export async function sprawdzDane(
  login: string,
  haslo: string
): Promise<boolean> {
  const [hl, hL, hh, hH] = await Promise.all([
    sha256(login),
    sha256(LOGIN),
    sha256(haslo),
    sha256(HASLO),
  ]);
  // Oba porównania zawsze wykonywane, żeby nie zdradzać, które pole było błędne.
  const okLogin = stalyCzasEq(hl, hL);
  const okHaslo = stalyCzasEq(hh, hH);
  return okLogin && okHaslo;
}

export async function czyZalogowany(): Promise<boolean> {
  const c = await cookies();
  return weryfikujToken(c.get(COOKIE)?.value);
}

export async function ustawSesje(): Promise<void> {
  const c = await cookies();
  c.set(COOKIE, await utworzToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function usunSesje(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE);
}
