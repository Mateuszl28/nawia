export type Kategoria =
  | "naszyjniki"
  | "pierscionki"
  | "kolczyki"
  | "bransoletki";

export type Produkt = {
  slug: string;
  nazwa: string;
  kategoria: Kategoria;
  cena: number; // w PLN
  opis: string;
  opisDlugi: string;
  dlugosc?: string; // np. "45 cm" / "16–19 cm"
  ton: string; // kolor akcentu dla grafiki produktu (fallback gdy brak zdjęcia)
  zdjecie?: string; // starsze pole — pojedyncze zdjęcie (zgodność wsteczna)
  zdjecia?: string[]; // galeria — ścieżki do wgranych zdjęć, np. /uploads/slug-123.jpg
  nowosc?: boolean;
};

/** Minimalny zestaw danych potrzebny do wyświetlenia pozycji w koszyku. */
export type ProduktSkrot = Pick<
  Produkt,
  "slug" | "nazwa" | "cena" | "kategoria" | "ton" | "zdjecie"
>;

/**
 * Lista zdjęć produktu z uwzględnieniem zgodności wstecznej:
 * nowe produkty mają `zdjecia[]`, starsze — pojedyncze `zdjecie`.
 */
export function zdjeciaProduktu(
  p: Pick<Produkt, "zdjecie" | "zdjecia">
): string[] {
  if (p.zdjecia && p.zdjecia.length > 0) return p.zdjecia;
  return p.zdjecie ? [p.zdjecie] : [];
}

/** Główne (pierwsze) zdjęcie produktu albo undefined, gdy brak. */
export function glowneZdjecie(
  p: Pick<Produkt, "zdjecie" | "zdjecia">
): string | undefined {
  return zdjeciaProduktu(p)[0];
}

export const KATEGORIE: { id: Kategoria; nazwa: string }[] = [
  { id: "naszyjniki", nazwa: "Naszyjniki" },
  { id: "pierscionki", nazwa: "Pierścionki" },
  { id: "kolczyki", nazwa: "Kolczyki" },
  { id: "bransoletki", nazwa: "Bransoletki" },
];

export function formatCena(pln: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pln);
}

/** Jak formatCena, ale z groszami — do kosztów dostawy i sum z groszami. */
export function formatCenaGr(pln: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pln);
}

export function skrot(p: Produkt): ProduktSkrot {
  return {
    slug: p.slug,
    nazwa: p.nazwa,
    cena: p.cena,
    kategoria: p.kategoria,
    ton: p.ton,
    zdjecie: glowneZdjecie(p),
  };
}

export function nazwaKategorii(id: Kategoria): string {
  return KATEGORIE.find((k) => k.id === id)?.nazwa ?? id;
}
