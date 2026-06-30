import { NextResponse } from "next/server";
import { produktPoSlug } from "@/lib/store";
import {
  kosztDostawy,
  metoda as metodaInfo,
  type MetodaDostawy,
} from "@/lib/dostawa";
import {
  dodajZamowienie,
  nowyNumer,
  type Zamowienie,
} from "@/lib/orders";
import { wyslijMail } from "@/lib/mail";
import { SKLEP_EMAIL } from "@/lib/site";
import {
  mailPotwierdzenieZamowienia,
  mailNoweZamowienieSklep,
  type DanePozycji,
} from "@/lib/mail-templates";

type Wejscie = {
  imie?: string;
  nazwisko?: string;
  email?: string;
  telefon?: string;
  metodaDostawy?: string;
  paczkomat?: string;
  paczkomatNazwa?: string;
  ulica?: string;
  kod?: string;
  miasto?: string;
  pozycje?: { slug: string; ilosc: number }[];
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let dane: Wejscie;
  try {
    dane = await req.json();
  } catch {
    return NextResponse.json({ blad: "Nieprawidłowe dane." }, { status: 400 });
  }

  const imie = dane.imie?.trim();
  const nazwisko = dane.nazwisko?.trim();
  const email = dane.email?.trim();
  const telefon = dane.telefon?.trim();
  const metodaDostawy = (
    dane.metodaDostawy === "kurier" ? "kurier" : "paczkomat"
  ) as MetodaDostawy;
  const paczkomatem = metodaDostawy === "paczkomat";

  if (!imie || !nazwisko || !email || !EMAIL_RE.test(email) || !telefon) {
    return NextResponse.json(
      { blad: "Uzupełnij poprawnie dane kontaktowe." },
      { status: 400 }
    );
  }
  if (paczkomatem) {
    if (!dane.paczkomat?.trim())
      return NextResponse.json({ blad: "Brak wybranego paczkomatu." }, { status: 400 });
  } else {
    if (!dane.ulica?.trim() || !dane.miasto?.trim() || !/^\d{2}-\d{3}$/.test(dane.kod ?? ""))
      return NextResponse.json({ blad: "Uzupełnij adres dostawy." }, { status: 400 });
  }

  // Ceny liczone po stronie serwera — nie ufamy danym z przeglądarki.
  const wejsciowe = Array.isArray(dane.pozycje) ? dane.pozycje : [];
  const pozycje: DanePozycji[] = [];
  for (const { slug, ilosc } of wejsciowe) {
    const p = await produktPoSlug(slug);
    const szt = Math.max(1, Math.min(99, Math.floor(Number(ilosc) || 0)));
    if (p) pozycje.push({ nazwa: p.nazwa, ilosc: szt, cena: p.cena });
  }
  if (pozycje.length === 0) {
    return NextResponse.json({ blad: "Koszyk jest pusty." }, { status: 400 });
  }

  const suma = pozycje.reduce((s, p) => s + p.cena * p.ilosc, 0);
  const koszt = kosztDostawy(metodaDostawy, suma);
  const numer = nowyNumer();

  const zamowienie: Zamowienie = {
    numer,
    utworzono: new Date().toISOString(),
    status: "nowe",
    klient: { imie, nazwisko, email, telefon },
    dostawa: {
      metoda: metodaDostawy,
      nazwa: metodaInfo(metodaDostawy).nazwa,
      ...(paczkomatem
        ? { punktKod: dane.paczkomat?.trim(), punktNazwa: dane.paczkomatNazwa?.trim() }
        : { ulica: dane.ulica?.trim(), kod: dane.kod?.trim(), miasto: dane.miasto?.trim() }),
    },
    pozycje,
    suma,
    kosztDostawy: koszt,
  };

  await dodajZamowienie(zamowienie);

  // TODO (Etap 3, po wklejeniu specu REST): utworzyć szkic przesyłki w Furgonetce
  // przez lib/furgonetka.ts i zapisać packageId/tracking w zamówieniu.

  const adresDostawy = paczkomatem
    ? undefined
    : `${zamowienie.dostawa.ulica}, ${zamowienie.dostawa.kod} ${zamowienie.dostawa.miasto}`;

  // Mail potwierdzający do klienta — nie blokuje zamówienia, gdy SMTP padnie.
  try {
    const m = mailPotwierdzenieZamowienia({
      numer,
      imie,
      email,
      pozycje,
      suma,
      kosztDostawy: koszt,
      metodaDostawy: zamowienie.dostawa.nazwa,
      punktKod: zamowienie.dostawa.punktKod,
      adres: adresDostawy,
    });
    await wyslijMail({ do: email, temat: m.temat, html: m.html, tekst: m.tekst });
  } catch (e) {
    console.error("Nie udało się wysłać maila potwierdzającego:", e);
  }

  // Powiadomienie do sklepu (właścicielki) — osobno, by błąd nie wpłynął na klienta.
  try {
    const m = mailNoweZamowienieSklep({
      numer,
      imie,
      nazwisko,
      email,
      telefon,
      pozycje,
      suma,
      kosztDostawy: koszt,
      metodaDostawy: zamowienie.dostawa.nazwa,
      dokad: paczkomatem
        ? `${zamowienie.dostawa.punktNazwa ?? ""} (${zamowienie.dostawa.punktKod ?? ""})`.trim()
        : (adresDostawy ?? ""),
    });
    await wyslijMail({ do: SKLEP_EMAIL, temat: m.temat, html: m.html, tekst: m.tekst });
  } catch (e) {
    console.error("Nie udało się wysłać powiadomienia do sklepu:", e);
  }

  return NextResponse.json({ numer, kwota: suma + koszt });
}
