"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sprawdzDane, ustawSesje, usunSesje } from "@/lib/auth";
import {
  aktualizujProdukt,
  dodajProdukt,
  usunProdukt,
  utworzSlug,
  wszystkieProdukty,
} from "@/lib/store";
import type { Kategoria, Produkt } from "@/lib/products";

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
    material: String(formData.get("material") ?? "").trim(),
    kamien: String(formData.get("kamien") ?? "").trim(),
    opis: String(formData.get("opis") ?? "").trim(),
    opisDlugi: String(formData.get("opisDlugi") ?? "").trim(),
    ton: String(formData.get("ton") ?? "#9a8255").trim() || "#9a8255",
    nowosc: formData.get("nowosc") === "on",
  };
}

function odswiezSklep(slug?: string) {
  revalidatePath("/");
  revalidatePath("/produkty");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/produkty/${slug}`);
}

export async function utworzProdukt(formData: FormData) {
  const produkt = odczytajProdukt(formData);
  // Zapewniamy unikalny slug.
  const lista = await wszystkieProdukty();
  let slug = produkt.slug;
  let i = 2;
  while (lista.some((p) => p.slug === slug)) slug = `${produkt.slug}-${i++}`;
  await dodajProdukt({ ...produkt, slug });
  odswiezSklep(slug);
  redirect("/admin?dodano=1");
}

export async function zaktualizujProdukt(slug: string, formData: FormData) {
  const dane = odczytajProdukt(formData);
  await aktualizujProdukt(slug, { ...dane, slug }); // slug pozostaje stały
  odswiezSklep(slug);
  redirect("/admin?zapisano=1");
}

export async function usunProduktAkcja(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (slug) {
    await usunProdukt(slug);
    odswiezSklep(slug);
  }
  redirect("/admin?usunieto=1");
}
