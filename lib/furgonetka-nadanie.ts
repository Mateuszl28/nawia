// Tworzenie przesyłek w Furgonetce (Etap 3). UŻYWAĆ WYŁĄCZNIE po stronie
// serwera. Wymaga konfiguracji w .env (dane nadawcy + service_id usług).
//
// Schemat żądania POST /packages odtworzony z biblioteki REST Furgonetki:
//   { service_id, type:"package", sender, receiver, parcels[], user_reference_number }
// sender/receiver: { name, company, street, postcode, city, county, email, phone, point }
// parcels[]:       { width, height, depth, weight, value, description }  (cm / kg / PLN)
//
// UWAGA: zanim włączysz nadania na produkcji (FURGONETKA_NADANIA=true), przetestuj
// na środowisku demo (FURGONETKA_API_BASE), bo realne nadanie jest płatne.
import { furgonetkaFetch } from "@/lib/furgonetka";
import type { Zamowienie } from "@/lib/orders";

/** Czy automatyczne nadania są włączone (master-flaga w .env). */
export function nadaniaWlaczone(): boolean {
  return process.env.FURGONETKA_NADANIA === "true";
}

const tylkoCyfry = (s: string | undefined) => (s ?? "").replace(/\D/g, "");

function nadawca() {
  const wymagane = {
    name: process.env.NADAWCA_NAZWA,
    street: process.env.NADAWCA_ULICA,
    postcode: process.env.NADAWCA_KOD,
    city: process.env.NADAWCA_MIASTO,
    email: process.env.NADAWCA_EMAIL,
    phone: process.env.NADAWCA_TELEFON,
  };
  for (const [k, v] of Object.entries(wymagane)) {
    if (!v) throw new Error(`Brak danych nadawcy w .env: NADAWCA_${k.toUpperCase()}`);
  }
  return {
    name: wymagane.name,
    company: process.env.NADAWCA_FIRMA || wymagane.name,
    street: wymagane.street,
    postcode: wymagane.postcode,
    city: wymagane.city,
    county: "",
    email: wymagane.email,
    phone: tylkoCyfry(wymagane.phone),
    point: "",
  };
}

function serviceId(metoda: Zamowienie["dostawa"]["metoda"]): number {
  const id =
    metoda === "paczkomat"
      ? process.env.FURGONETKA_SERVICE_PACZKOMAT
      : process.env.FURGONETKA_SERVICE_KURIER;
  if (!id) {
    throw new Error(
      `Brak service_id w .env dla metody "${metoda}" (FURGONETKA_SERVICE_PACZKOMAT / FURGONETKA_SERVICE_KURIER).`
    );
  }
  return Number(id);
}

function paczka(z: Zamowienie) {
  return {
    width: Number(process.env.PACZKA_SZER || 20),
    height: Number(process.env.PACZKA_WYS || 10),
    depth: Number(process.env.PACZKA_GLEB || 15),
    weight: Number(process.env.PACZKA_WAGA || 0.5),
    value: Math.max(1, Math.round(z.suma)), // zadeklarowana wartość (PLN)
    description: "Biżuteria",
  };
}

function odbiorca(z: Zamowienie) {
  const d = z.dostawa;
  const wspolne = {
    name: `${z.klient.imie} ${z.klient.nazwisko}`.trim(),
    company: "",
    county: "",
    email: z.klient.email,
    phone: tylkoCyfry(z.klient.telefon),
  };
  if (d.metoda === "paczkomat") {
    // Paczkomat: kluczowy jest kod punktu (point). Adres punktu Furgonetka
    // ustala po kodzie, więc pola adresowe zostają puste.
    return { ...wspolne, street: "", postcode: "", city: "", point: d.punktKod ?? "" };
  }
  return {
    ...wspolne,
    street: d.ulica ?? "",
    postcode: d.kod ?? "",
    city: d.miasto ?? "",
    point: "",
  };
}

export type WynikNadania = { packageId: string; tracking?: string };

/**
 * Tworzy przesyłkę (szkic) w Furgonetce dla zamówienia i zwraca jej id oraz
 * (jeśli dostępny) numer śledzenia. Rzuca wyjątkiem przy błędzie — wołający
 * łapie go, by nie blokować zamówienia.
 */
export async function utworzPrzesylke(z: Zamowienie): Promise<WynikNadania> {
  const body = {
    service_id: serviceId(z.dostawa.metoda),
    type: "package",
    sender: nadawca(),
    receiver: odbiorca(z),
    parcels: [paczka(z)],
    user_reference_number: z.numer,
  };

  const res = await furgonetkaFetch("/packages", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Furgonetka POST /packages ${res.status}: ${await res.text()}`);
  }

  const dane = (await res.json()) as {
    id?: string | number;
    package_id?: string | number;
    tracking?: string;
    tracking_number?: string;
  };
  const packageId = String(dane.id ?? dane.package_id ?? "");
  if (!packageId) {
    throw new Error("Furgonetka nie zwróciła id przesyłki.");
  }
  return { packageId, tracking: dane.tracking_number ?? dane.tracking };
}

/** Pobiera etykietę przewozową (PDF) dla danej przesyłki. */
export async function pobierzEtykiete(packageId: string): Promise<ArrayBuffer> {
  const res = await furgonetkaFetch(`/packages/${packageId}/label`, {
    method: "GET",
    headers: { Accept: "application/pdf" },
  });
  if (!res.ok) {
    throw new Error(
      `Furgonetka GET /packages/${packageId}/label ${res.status}: ${await res.text()}`
    );
  }
  return res.arrayBuffer();
}
