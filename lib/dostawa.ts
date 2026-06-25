// Metody i koszty dostawy — wspólne dla koszyka i podsumowania zamówienia.
export const PROG_DARMOWEJ_DOSTAWY = 300;

export type MetodaDostawy = "paczkomat" | "kurier";

export const METODY_DOSTAWY: {
  id: MetodaDostawy;
  nazwa: string;
  opis: string;
  koszt: number;
}[] = [
  {
    id: "paczkomat",
    nazwa: "Paczkomat InPost (mała paczka)",
    opis: "Odbiór w wybranym paczkomacie, dostępny 24/7",
    koszt: 16.49,
  },
  {
    id: "kurier",
    nazwa: "Kurier",
    opis: "Dostawa pod wskazany adres",
    koszt: 19.49,
  },
];

export function metoda(id: MetodaDostawy) {
  return METODY_DOSTAWY.find((m) => m.id === id) ?? METODY_DOSTAWY[0];
}

/** Koszt dostawy dla wybranej metody — gratis powyżej progu darmowej dostawy. */
export function kosztDostawy(id: MetodaDostawy, suma: number): number {
  if (suma >= PROG_DARMOWEJ_DOSTAWY) return 0;
  return metoda(id).koszt;
}
