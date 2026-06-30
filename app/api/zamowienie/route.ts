import { NextResponse } from "next/server";
import { produktPoSlug } from "@/lib/store";
import {
  kosztDostawy,
  metoda as metodaInfo,
  type MetodaDostawy,
} from "@/lib/dostawa";
import {
  dodajZamowienie,
  aktualizujStatus,
  nowyNumer,
  type Zamowienie,
} from "@/lib/orders";
import { nadaniaWlaczone, utworzPrzesylke } from "@/lib/furgonetka-nadanie";
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
const MAX_POLE = 120; // maks. długość pól tekstowych
const MAX_POZYCJI = 50; // maks. liczba różnych pozycji w koszyku

// Prosty limiter w pamięci procesu — przeciw spamowi zamówień i zalewaniu mailem.
const LIMIT = 8;
const OKNO_MS = 10 * 60 * 1000;
const proby = new Map<string, { licznik: number; reset: number }>();
function podLimitem(ip: string): boolean {
  const teraz = Date.now();
  const w = proby.get(ip);
  if (!w || w.reset < teraz) {
    proby.set(ip, { licznik: 1, reset: teraz + OKNO_MS });
    return true;
  }
  w.licznik += 1;
  return w.licznik <= LIMIT;
}

const przytnij = (s: string | undefined) => s?.trim().slice(0, MAX_POLE);

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  if (!podLimitem(ip)) {
    return NextResponse.json(
      { blad: "Zbyt wiele prób. Spróbuj ponownie za kilka minut." },
      { status: 429 }
    );
  }

  let dane: Wejscie;
  try {
    dane = await req.json();
  } catch {
    return NextResponse.json({ blad: "Nieprawidłowe dane." }, { status: 400 });
  }

  const imie = przytnij(dane.imie);
  const nazwisko = przytnij(dane.nazwisko);
  const email = przytnij(dane.email);
  const telefon = przytnij(dane.telefon);
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
  const wejsciowe = (Array.isArray(dane.pozycje) ? dane.pozycje : []).slice(
    0,
    MAX_POZYCJI
  );
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
        ? { punktKod: przytnij(dane.paczkomat), punktNazwa: przytnij(dane.paczkomatNazwa) }
        : { ulica: przytnij(dane.ulica), kod: przytnij(dane.kod), miasto: przytnij(dane.miasto) }),
    },
    pozycje,
    suma,
    kosztDostawy: koszt,
  };

  await dodajZamowienie(zamowienie);

  // Automatyczne nadanie w Furgonetce (Etap 3). Za flagą FURGONETKA_NADANIA,
  // w try/catch — błąd integracji nigdy nie blokuje złożenia zamówienia.
  if (nadaniaWlaczone()) {
    try {
      const { packageId, tracking } = await utworzPrzesylke(zamowienie);
      await aktualizujStatus(numer, zamowienie.status, { packageId, tracking });
    } catch (e) {
      console.error("Nie udało się utworzyć przesyłki w Furgonetce:", e);
    }
  }

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
