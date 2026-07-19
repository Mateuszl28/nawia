"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  KONFIGURACJA_NIEBEZPIECZNA,
  sprawdzDane,
  ustawSesje,
  usunSesje,
  wymagajSesji,
} from "@/lib/auth";
import {
  aktualizujProdukt,
  dodajProdukt,
  produktPoSlug,
  usunProdukt,
  utworzSlug,
  wszystkieProdukty,
  zapiszZdjecia,
} from "@/lib/store";
import { zdjeciaProduktu } from "@/lib/products";
import {
  aktualizujStatus,
  ustawNotatke,
  type StatusZamowienia,
} from "@/lib/orders";
import type { Kategoria, Produkt } from "@/lib/products";

const STATUSY: StatusZamowienia[] = [
  "nowe",
  "oplacone",
  "nadane",
  "w_drodze",
  "dostarczone",
  "anulowane",
];

const KATEGORIE_ID: Kategoria[] = [
  "naszyjniki",
  "pierscionki",
  "kolczyki",
  "bransoletki",
];

// Prosty limiter prób logowania w pamięci procesu (anty-brute-force).
const LIMIT_PROB = 6;
const OKNO_MS = 10 * 60 * 1000; // 10 minut
const proby = new Map<string, { licznik: number; reset: number }>();

function sprawdzLimit(ip: string): boolean {
  const teraz = Date.now();
  const wpis = proby.get(ip);
  if (!wpis || wpis.reset < teraz) {
    proby.set(ip, { licznik: 1, reset: teraz + OKNO_MS });
    return true;
  }
  wpis.licznik += 1;
  return wpis.licznik <= LIMIT_PROB;
}

function zerujLimit(ip: string) {
  proby.delete(ip);
}

export async function zaloguj(formData: FormData) {
  const login = String(formData.get("login") ?? "");
  const haslo = String(formData.get("haslo") ?? "");
  const powrot = String(formData.get("powrot") ?? "/admin");
  const bezpiecznyPowrot = powrot.startsWith("/admin") ? powrot : "/admin";

  // Fail-closed: nie wpuszczamy nikogo, dopóki produkcja używa domyślnych
  // sekretów z repo (SESSION_SECRET / ADMIN_HASLO).
  if (KONFIGURACJA_NIEBEZPIECZNA) {
    redirect(
      `/admin/login?blad=config&powrot=${encodeURIComponent(bezpiecznyPowrot)}`
    );
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local";

  if (!sprawdzLimit(ip)) {
    redirect(
      `/admin/login?blad=limit&powrot=${encodeURIComponent(bezpiecznyPowrot)}`
    );
  }

  if (!(await sprawdzDane(login, haslo))) {
    redirect(
      `/admin/login?blad=1&powrot=${encodeURIComponent(bezpiecznyPowrot)}`
    );
  }

  zerujLimit(ip);
  await ustawSesje();
  redirect(bezpiecznyPowrot);
}

export async function wyloguj() {
  await usunSesje();
  redirect("/admin/login");
}

function odczytajProdukt(formData: FormData): Produkt {
  const nazwa = String(formData.get("nazwa") ?? "").trim();
  const kategoria = String(formData.get("kategoria") ?? "") as Kategoria;
  const cena = Number(formData.get("cena"));

  if (!nazwa) throw new Error("Nazwa jest wymagana.");
  if (!KATEGORIE_ID.includes(kategoria))
    throw new Error("Nieprawidłowa kategoria.");
  if (!Number.isFinite(cena) || cena < 0)
    throw new Error("Nieprawidłowa cena.");

  return {
    slug: String(formData.get("slug") ?? "").trim() || utworzSlug(nazwa),
    nazwa,
    kategoria,
    cena: Math.round(cena),
    opis: String(formData.get("opis") ?? "").trim(),
    opisDlugi: String(formData.get("opisDlugi") ?? "").trim(),
    dlugosc: String(formData.get("dlugosc") ?? "").trim() || undefined,
    ton: String(formData.get("ton") ?? "#9a8255").trim() || "#9a8255",
    nowosc: formData.get("nowosc") === "on",
  };
}

function odswiezSklep(slug?: string) {
  revalidatePath("/");
  revalidatePath("/produkty");
  revalidatePath("/admin");
  revalidatePath("/admin/produkty");
  if (slug) revalidatePath(`/produkty/${slug}`);
}

/** Stan formularza produktu — `blad` trafia do UI zamiast wywracać stronę. */
export type StanProduktu = { blad?: string };

function komunikat(e: unknown): string {
  return e instanceof Error && e.message
    ? e.message
    : "Nie udało się zapisać. Spróbuj ponownie.";
}

export async function utworzProdukt(
  _stan: StanProduktu,
  formData: FormData
): Promise<StanProduktu> {
  await wymagajSesji();

  let slug: string;
  // redirect() rzuca NEXT_REDIRECT, więc musi zostać poza try/catch.
  try {
    const produkt = odczytajProdukt(formData);
    // Zapewniamy unikalny slug.
    const lista = await wszystkieProdukty();
    slug = produkt.slug;
    let i = 2;
    while (lista.some((p) => p.slug === slug)) slug = `${produkt.slug}-${i++}`;
    const zdjecia = await zapiszZdjecia(formData.getAll("zdjecia"), slug);
    await dodajProdukt({
      ...produkt,
      slug,
      zdjecia: zdjecia.length ? zdjecia : undefined,
    });
  } catch (e) {
    return { blad: komunikat(e) };
  }

  odswiezSklep(slug);
  redirect("/admin/produkty?dodano=1");
}

export async function zaktualizujProdukt(
  slug: string,
  _stan: StanProduktu,
  formData: FormData
): Promise<StanProduktu> {
  await wymagajSesji();

  try {
    const dane = odczytajProdukt(formData);
    const stary = await produktPoSlug(slug);

    // Istniejące zdjęcia minus zaznaczone do usunięcia, plus nowo wgrane.
    const doUsuniecia = new Set(
      formData.getAll("usunZdjecie").map((v) => String(v))
    );
    const zachowane = (stary ? zdjeciaProduktu(stary) : []).filter(
      (url) => !doUsuniecia.has(url)
    );
    const nowe = await zapiszZdjecia(formData.getAll("zdjecia"), slug);
    const zdjecia = [...zachowane, ...nowe];

    await aktualizujProdukt(slug, {
      ...dane,
      slug, // slug pozostaje stały
      zdjecie: undefined, // migrujemy na `zdjecia`
      zdjecia: zdjecia.length ? zdjecia : undefined,
    });
  } catch (e) {
    return { blad: komunikat(e) };
  }

  odswiezSklep(slug);
  redirect("/admin/produkty?zapisano=1");
}

export async function usunProduktAkcja(formData: FormData) {
  await wymagajSesji();
  const slug = String(formData.get("slug") ?? "");
  if (slug) {
    await usunProdukt(slug);
    odswiezSklep(slug);
  }
  redirect("/admin/produkty?usunieto=1");
}

// ——— Zamówienia ———

export async function zmienStatusAkcja(formData: FormData) {
  await wymagajSesji();
  const numer = String(formData.get("numer") ?? "").trim();
  const status = String(formData.get("status") ?? "") as StatusZamowienia;
  const filtr = String(formData.get("filtr") ?? "").trim();
  if (numer && STATUSY.includes(status)) {
    await aktualizujStatus(numer, status);
    revalidatePath("/admin");
    revalidatePath("/admin/zamowienia");
  }
  redirect(filtr ? `/admin/zamowienia?status=${filtr}` : "/admin/zamowienia");
}

export async function zapiszNotatkeAkcja(formData: FormData) {
  await wymagajSesji();
  const numer = String(formData.get("numer") ?? "").trim();
  const notatka = String(formData.get("notatka") ?? "");
  const filtr = String(formData.get("filtr") ?? "").trim();
  if (numer) {
    await ustawNotatke(numer, notatka);
    revalidatePath("/admin/zamowienia");
  }
  redirect(
    filtr
      ? `/admin/zamowienia?status=${filtr}&notatka=1`
      : "/admin/zamowienia?notatka=1"
  );
}
