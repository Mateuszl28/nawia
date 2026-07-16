import { promises as fs } from "fs";
import path from "path";
import { MAX_ZDJEC, type Produkt } from "@/lib/products";

const PLIK = path.join(process.cwd(), "data", "products.json");
// Wzorzec w repo. Żywa baza (PLIK) jest poza gitem, żeby deploy jej nie nadpisywał;
// przy pierwszym uruchomieniu (świeży serwer) odtwarzamy ją z wzorca.
const WZORZEC = path.join(process.cwd(), "data", "products.seed.json");

async function czytaj(): Promise<Produkt[]> {
  try {
    const raw = await fs.readFile(PLIK, "utf-8");
    return JSON.parse(raw) as Produkt[];
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    const raw = await fs.readFile(WZORZEC, "utf-8");
    await fs.writeFile(PLIK, raw, "utf-8");
    return JSON.parse(raw) as Produkt[];
  }
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

const DOZWOLONE_TYPY: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_ZDJECIE = 8 * 1024 * 1024; // 8 MB

/**
 * Zapisuje wgrane zdjęcie do public/uploads i zwraca ścieżkę URL (/uploads/...).
 * Zwraca null, gdy nie przesłano pliku.
 */
export async function zapiszZdjecie(
  file: unknown,
  slug: string,
  indeks = 0
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = DOZWOLONE_TYPY[file.type];
  if (!ext) throw new Error("Dozwolone formaty zdjęć: JPG, PNG, WEBP.");
  if (file.size > MAX_ZDJECIE)
    throw new Error("Maksymalny rozmiar zdjęcia to 8 MB.");

  const katalog = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(katalog, { recursive: true });
  // Indeks zapewnia unikalną nazwę przy kilku plikach wgranych w tej samej ms.
  const nazwa = `${slug}-${Date.now()}-${indeks}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(katalog, nazwa), bytes);
  return `/uploads/${nazwa}`;
}

/**
 * Zapisuje wiele wgranych plików do public/uploads i zwraca listę ścieżek URL.
 * Pomija puste pozycje (np. gdy w polu multiple nie wybrano wszystkich slotów).
 */
export async function zapiszZdjecia(
  files: unknown[],
  slug: string
): Promise<string[]> {
  const wynik: string[] = [];
  for (const file of files) {
    if (wynik.length >= MAX_ZDJEC) break;
    const url = await zapiszZdjecie(file, slug, wynik.length);
    if (url) wynik.push(url);
  }
  return wynik;
}
