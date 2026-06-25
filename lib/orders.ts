import { promises as fs } from "fs";
import path from "path";
import type { DanePozycji } from "@/lib/mail-templates";

const PLIK = path.join(process.cwd(), "data", "zamowienia.json");

export type StatusZamowienia =
  | "nowe"
  | "oplacone"
  | "nadane"
  | "w_drodze"
  | "dostarczone"
  | "anulowane";

export type Zamowienie = {
  numer: string;
  utworzono: string; // ISO
  status: StatusZamowienia;
  klient: { imie: string; nazwisko: string; email: string; telefon: string };
  dostawa: {
    metoda: "paczkomat" | "kurier";
    nazwa: string;
    punktKod?: string;
    punktNazwa?: string;
    ulica?: string;
    kod?: string;
    miasto?: string;
  };
  pozycje: DanePozycji[];
  suma: number; // wartość produktów (PLN)
  kosztDostawy: number; // PLN
  furgonetka?: { packageId?: string; tracking?: string };
};

async function czytaj(): Promise<Zamowienie[]> {
  try {
    const raw = await fs.readFile(PLIK, "utf-8");
    return JSON.parse(raw) as Zamowienie[];
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

async function zapisz(lista: Zamowienie[]): Promise<void> {
  await fs.mkdir(path.dirname(PLIK), { recursive: true });
  await fs.writeFile(PLIK, JSON.stringify(lista, null, 2) + "\n", "utf-8");
}

/** Wszystkie zamówienia, od najnowszego. */
export async function wszystkieZamowienia(): Promise<Zamowienie[]> {
  const lista = await czytaj();
  return lista.sort((a, b) => b.utworzono.localeCompare(a.utworzono));
}

export async function dodajZamowienie(z: Zamowienie): Promise<void> {
  const lista = await czytaj();
  lista.push(z);
  await zapisz(lista);
}

export async function zamowieniePoNumerze(
  numer: string
): Promise<Zamowienie | undefined> {
  return (await czytaj()).find((z) => z.numer === numer);
}

/** Aktualizuje status (i opcjonalnie dane Furgonetki) zamówienia. */
export async function aktualizujStatus(
  numer: string,
  status: StatusZamowienia,
  furgonetka?: Zamowienie["furgonetka"]
): Promise<Zamowienie | undefined> {
  const lista = await czytaj();
  const z = lista.find((x) => x.numer === numer);
  if (!z) return undefined;
  z.status = status;
  if (furgonetka) z.furgonetka = { ...z.furgonetka, ...furgonetka };
  await zapisz(lista);
  return z;
}

/** Generuje numer zamówienia: NW-RRMMDD-XXXX. */
export function nowyNumer(): string {
  const d = new Date();
  const data =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `NW-${data}-${rand}`;
}
