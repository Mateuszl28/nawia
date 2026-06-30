// Brandowane szablony maili NAWIA (HTML + tekst). Email-safe style inline.
import { PLATNOSC } from "@/lib/site";

export type DanePozycji = { nazwa: string; ilosc: number; cena: number };

export type DaneZamowienia = {
  numer: string;
  imie: string;
  email: string;
  pozycje: DanePozycji[];
  suma: number;
  kosztDostawy: number;
  metodaDostawy: string; // np. "Paczkomat InPost" / "Kurier"
  punktKod?: string; // kod paczkomatu, jeśli dotyczy
  adres?: string; // adres dostawy, jeśli kurier
};

const ZL = (gr: number) =>
  gr.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  " zł";

function ramka(tytul: string, tresc: string): string {
  return `<!DOCTYPE html><html lang="pl"><body style="margin:0;background:#f4efe9;font-family:Georgia,'Times New Roman',serif;color:#2b2622;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe9;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#fffdfa;border:1px solid #e7ddd0;border-radius:14px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;text-align:center;">
          <div style="font-size:22px;letter-spacing:6px;color:#2b2622;">N A W I A</div>
          <div style="font-size:11px;letter-spacing:2px;color:#a08a6a;text-transform:uppercase;margin-top:4px;">Moon Ritual Jewelry</div>
        </td></tr>
        <tr><td style="padding:16px 32px 28px;">
          <h1 style="font-size:20px;font-weight:normal;color:#2b2622;margin:8px 0 16px;">${tytul}</h1>
          ${tresc}
        </td></tr>
        <tr><td style="padding:18px 32px;background:#faf6f0;border-top:1px solid #efe6d9;text-align:center;color:#8a8178;font-size:12px;line-height:1.7;">
          To wiadomość automatyczna — prosimy na nią nie odpowiadać.<br>
          W sprawach zamówienia: <a href="mailto:kontakt@nawiabizuteria.pl" style="color:#a07c3a;">kontakt@nawiabizuteria.pl</a><br>
          <span style="color:#b8ae9a;">nawiabizuteria.pl</span>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function tabelaPozycji(z: DaneZamowienia): string {
  const wiersze = z.pozycje
    .map(
      (p) =>
        `<tr><td style="padding:6px 0;color:#5a534b;">${p.nazwa} <span style="color:#a07c3a;">× ${p.ilosc}</span></td><td style="padding:6px 0;text-align:right;color:#2b2622;">${ZL(p.cena * p.ilosc)}</td></tr>`
    )
    .join("");
  const dostawa = z.kosztDostawy === 0 ? "Gratis" : ZL(z.kosztDostawy);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #efe6d9;margin-top:8px;">
    ${wiersze}
    <tr><td style="padding:6px 0;border-top:1px solid #efe6d9;color:#5a534b;">Dostawa — ${z.metodaDostawy}</td><td style="padding:6px 0;border-top:1px solid #efe6d9;text-align:right;color:#2b2622;">${dostawa}</td></tr>
    <tr><td style="padding:10px 0 0;color:#2b2622;font-size:16px;">Razem</td><td style="padding:10px 0 0;text-align:right;color:#a07c3a;font-size:16px;">${ZL(z.suma + z.kosztDostawy)}</td></tr>
  </table>`;
}

/** Mail wysyłany od razu po złożeniu zamówienia. */
export function mailPotwierdzenieZamowienia(z: DaneZamowienia) {
  const dokad = z.punktKod
    ? `Paczkomat / punkt: <strong>${z.punktKod}</strong>`
    : z.adres
      ? `Adres dostawy: <strong>${z.adres}</strong>`
      : "";
  const doZaplaty = ZL(z.suma + z.kosztDostawy);
  const platnosc = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;background:#faf6f0;border:1px solid #efe6d9;border-radius:10px;">
    <tr><td style="padding:16px 18px;">
      <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#a08a6a;margin-bottom:8px;">Do zapłaty: ${doZaplaty}</div>
      <div style="font-size:13px;line-height:1.8;color:#5a534b;">
        Przelew na konto albo <strong>BLIK na telefon</strong>:<br>
        Numer konta: <strong style="color:#2b2622;">${PLATNOSC.konto}</strong><br>
        Odbiorca: <strong>${PLATNOSC.odbiorca}</strong> (${PLATNOSC.bank})<br>
        BLIK na telefon: <strong style="color:#2b2622;">${PLATNOSC.blikTelefon}</strong><br>
        Tytuł przelewu: <strong>${z.numer}</strong>
      </div>
      <div style="font-size:12px;color:#8a8178;margin-top:10px;">Po zaksięgowaniu wpłaty nadamy przesyłkę i wyślemy Ci powiadomienie.</div>
    </td></tr>
  </table>`;
  const html = ramka(
    "Dziękujemy za zamówienie",
    `<p style="font-size:14px;line-height:1.7;color:#5a534b;margin:0 0 12px;">Cześć ${z.imie}, przyjęliśmy Twoje zamówienie <strong>${z.numer}</strong>. Aby ruszyć z realizacją, prosimy o opłacenie zamówienia.</p>
     ${dokad ? `<p style="font-size:14px;color:#5a534b;margin:0 0 12px;">${dokad}</p>` : ""}
     ${tabelaPozycji(z)}
     ${platnosc}`
  );
  const tekst = `Dziękujemy za zamówienie ${z.numer}. Do zapłaty: ${doZaplaty}. Przelew na konto ${PLATNOSC.konto} (${PLATNOSC.odbiorca}) lub BLIK na telefon ${PLATNOSC.blikTelefon}. Tytuł: ${z.numer}.`;
  return { temat: `Potwierdzenie zamówienia ${z.numer} — NAWIA`, html, tekst };
}

/** Powiadomienie dla sklepu (właścicielki) o nowym zamówieniu — z danymi klienta. */
export function mailNoweZamowienieSklep(
  z: DaneZamowienia & {
    nazwisko: string;
    telefon: string;
    dokad: string; // paczkomat lub adres
    metodaDostawy: string;
  }
) {
  const html = ramka(
    `Nowe zamówienie ${z.numer}`,
    `<p style="font-size:14px;line-height:1.7;color:#5a534b;margin:0 0 12px;">Wpłynęło nowe zamówienie <strong>${z.numer}</strong>.</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;color:#5a534b;">
       <tr><td>Klient:</td><td style="text-align:right;color:#2b2622;"><strong>${z.imie} ${z.nazwisko}</strong></td></tr>
       <tr><td>E-mail:</td><td style="text-align:right;"><a href="mailto:${z.email}" style="color:#a07c3a;">${z.email}</a></td></tr>
       <tr><td>Telefon:</td><td style="text-align:right;"><a href="tel:${z.telefon}" style="color:#a07c3a;">${z.telefon}</a></td></tr>
       <tr><td>Dostawa:</td><td style="text-align:right;color:#2b2622;">${z.metodaDostawy}</td></tr>
       <tr><td>Dokąd:</td><td style="text-align:right;color:#2b2622;">${z.dokad}</td></tr>
     </table>
     ${tabelaPozycji(z)}`
  );
  const tekst = `Nowe zamówienie ${z.numer}. Klient: ${z.imie} ${z.nazwisko}, ${z.email}, ${z.telefon}. Dostawa: ${z.metodaDostawy} — ${z.dokad}. Razem: ${ZL(z.suma + z.kosztDostawy)}.`;
  return { temat: `Nowe zamówienie ${z.numer} — NAWIA`, html, tekst };
}

/** Mail wysyłany automatycznie, gdy przesyłka zostanie nadana (webhook). */
export function mailPrzesylkaNadana(
  z: Pick<DaneZamowienia, "numer" | "imie">,
  sledzenie?: { numer?: string; link?: string }
) {
  const tracking =
    sledzenie?.numer || sledzenie?.link
      ? `<p style="font-size:14px;color:#5a534b;margin:12px 0;">Numer śledzenia: <strong>${sledzenie?.numer ?? "—"}</strong>${
          sledzenie?.link
            ? `<br><a href="${sledzenie.link}" style="color:#a07c3a;">Śledź przesyłkę →</a>`
            : ""
        }</p>`
      : "";
  const html = ramka(
    "Twoja przesyłka została nadana",
    `<p style="font-size:14px;line-height:1.7;color:#5a534b;margin:0 0 12px;">Cześć ${z.imie}, Twoje zamówienie <strong>${z.numer}</strong> zostało nadane i jest już w drodze.</p>
     ${tracking}
     <p style="font-size:13px;color:#8a8178;margin:12px 0 0;">O kolejnych statusach przesyłki będziemy Cię informować.</p>`
  );
  const tekst = `Zamówienie ${z.numer} zostało nadane.${sledzenie?.numer ? " Nr śledzenia: " + sledzenie.numer : ""}`;
  return { temat: `Przesyłka nadana — zamówienie ${z.numer}`, html, tekst };
}
