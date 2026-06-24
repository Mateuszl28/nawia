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
  zdjecie?: string; // ścieżka do wgranego zdjęcia, np. /uploads/slug-123.jpg
  nowosc?: boolean;
};

/** Minimalny zestaw danych potrzebny do wyświetlenia pozycji w koszyku. */
export type ProduktSkrot = Pick<
  Produkt,
  "slug" | "nazwa" | "cena" | "kategoria" | "ton" | "zdjecie"
>;

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

export function skrot(p: Produkt): ProduktSkrot {
  return {
    slug: p.slug,
    nazwa: p.nazwa,
    cena: p.cena,
    kategoria: p.kategoria,
    ton: p.ton,
    zdjecie: p.zdjecie,
  };
}

export function nazwaKategorii(id: Kategoria): string {
  return KATEGORIE.find((k) => k.id === id)?.nazwa ?? id;
}
