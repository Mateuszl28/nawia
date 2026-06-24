import { promises as fs } from "fs";
import path from "path";
import type { Produkt } from "@/lib/products";

const PLIK = path.join(process.cwd(), "data", "products.json");

async function czytaj(): Promise<Produkt[]> {
  const raw = await fs.readFile(PLIK, "utf-8");
  return JSON.parse(raw) as Produkt[];
}

async function zapisz(lista: Produkt[]): Promise<void> {
  await fs.writeFile(PLIK, JSON.stringify(lista, null, 2) + "\n", "utf-8");
}

export async function wszystkieProdukty(): Promise<Produkt[]> {
  return czytaj();
}

export async function produktPoSlug(
  slug: string
): Promise<Produkt | undefined> {
  const lista = await czytaj();
  return lista.find((p) => p.slug === slug);
}

export function utworzSlug(nazwa: string): string {
  const mapa: Record<string, string> = {
    ą: "a", ć: "c", ę: "e", ł: "l", ń: "n",
    ó: "o", ś: "s", ź: "z", ż: "z",
  };
  return nazwa
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => mapa[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function dodajProdukt(p: Produkt): Promise<void> {
  const lista = await czytaj();
  if (lista.some((x) => x.slug === p.slug)) {
    throw new Error("Produkt o takim adresie (slug) już istnieje.");
  }
  lista.push(p);
  await zapisz(lista);
}

export async function aktualizujProdukt(
  slug: string,
  dane: Produkt
): Promise<void> {
  const lista = await czytaj();
  const i = lista.findIndex((x) => x.slug === slug);
  if (i === -1) throw new Error("Nie znaleziono produktu.");
  lista[i] = dane;
  await zapisz(lista);
}

export async function usunProdukt(slug: string): Promise<void> {
  const lista = await czytaj();
  await zapisz(lista.filter((x) => x.slug !== slug));
}
