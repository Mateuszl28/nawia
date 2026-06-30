// Centralne stałe witryny używane w SEO (sitemap, robots, JSON-LD, metadane).
export const BASE_URL =
  process.env.NEXT_PUBLIC_BAZA_URL || "http://localhost:3100";

export const SITE_NAME = "NAWIA";
export const SITE_TAGLINE = "Moon Ritual Jewelry";
export const SITE_OPIS =
  "Ręcznie tworzona biżuteria inspirowana księżycem i naturalnymi kamieniami. Stal chirurgiczna, kamień księżycowy, labradoryt i kryształy.";
export const SITE_EMAIL = "kontakt@nawiabizuteria.pl";

// Adres, na który trafiają powiadomienia o nowych zamówieniach (właścicielka).
// Nadpisywalny przez .env (SKLEP_EMAIL); używany tylko po stronie serwera.
export const SKLEP_EMAIL = process.env.SKLEP_EMAIL || "patrycja.reszka0@wp.pl";

// Dane do płatności ręcznej (przelew / BLIK na telefon) — pokazywane klientowi
// po złożeniu zamówienia i w mailu potwierdzającym. Jawne, do udostępnienia.
export const PLATNOSC = {
  odbiorca: "NAWIA", // TODO: potwierdzić dokładną nazwę odbiorcy na koncie
  bank: "Santander Bank Polska",
  konto: "24 1090 1926 0000 0001 2598 7570",
  blikTelefon: "511 168 962",
};
