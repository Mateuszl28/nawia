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
  material: string;
  kamien: string;
  opis: string;
  opisDlugi: string;
  ton: string; // kolor akcentu dla grafiki produktu
  nowosc?: boolean;
};

/** Minimalny zestaw danych potrzebny do wyświetlenia pozycji w koszyku. */
export type ProduktSkrot = Pick<
  Produkt,
  "slug" | "nazwa" | "cena" | "kamien" | "ton"
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
    kamien: p.kamien,
    ton: p.ton,
  };
}
