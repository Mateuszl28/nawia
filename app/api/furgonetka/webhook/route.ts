import { NextResponse } from "next/server";
import {
  aktualizujStatus,
  zamowieniePoNumerze,
  zamowieniePoPaczce,
  type StatusZamowienia,
} from "@/lib/orders";
import { wyslijMail } from "@/lib/mail";
import { mailPrzesylkaNadana } from "@/lib/mail-templates";

// Webhook Furgonetki — informuje o zmianach statusu przesyłki. Aktualizuje
// status zamówienia i wysyła klientowi mail „przesyłka nadana".
//
// Zabezpieczenie: wymaga sekretu (?secret=... lub nagłówek x-webhook-secret),
// porównywanego z FURGONETKA_WEBHOOK_SECRET z .env. Bez ustawionego sekretu
// endpoint jest wyłączony (fail-closed), by nie był otwarty dla świata.
//
// UWAGA: dokładny format payloadu Furgonetki jest NIEZWERYFIKOWANY — parsujemy
// defensywnie z kilku możliwych pól i logujemy surowe dane, żeby na demo poznać
// realny kształt i ewentualnie doprecyzować mapowanie statusów.

function mapujStatus(raw: string): StatusZamowienia | null {
  const s = raw.toLowerCase();
  if (/(deliver|doręcz|dorecz|dostarcz)/.test(s) && !/out|w_drodze|transit/.test(s))
    return "dostarczone";
  if (/(transit|w.?drodze|out.?for|on.?the.?way)/.test(s)) return "w_drodze";
  if (/(sent|nadan|dispatch|picked|przyj[ęe]t|accepted)/.test(s)) return "nadane";
  return null;
}

export async function POST(req: Request) {
  const sekret = process.env.FURGONETKA_WEBHOOK_SECRET;
  if (!sekret) {
    return NextResponse.json({ blad: "Webhook nieskonfigurowany." }, { status: 503 });
  }
  const url = new URL(req.url);
  const podany =
    url.searchParams.get("secret") || req.headers.get("x-webhook-secret");
  if (podany !== sekret) {
    return NextResponse.json({ blad: "Brak dostępu." }, { status: 401 });
  }

  let body: Record<string, unknown> & {
    package?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ blad: "Nieprawidłowe dane." }, { status: 400 });
  }

  // Surowy payload do logu — pozwala poznać realny format na środowisku demo.
  console.log("Furgonetka webhook:", JSON.stringify(body));

  const p = (body.package ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (v == null ? "" : String(v));
  const reference = str(body.user_reference_number ?? p.user_reference_number ?? body.reference);
  const packageId = str(body.package_id ?? body.id ?? p.id);
  const statusRaw = str(body.status ?? body.event ?? body.type ?? p.status ?? body.state);
  const tracking = str(body.tracking_number ?? body.tracking ?? p.tracking_number) || undefined;
  const trackingLink = str(body.tracking_url ?? p.tracking_url) || undefined;

  const zam =
    (reference && (await zamowieniePoNumerze(reference))) ||
    (packageId && (await zamowieniePoPaczce(packageId))) ||
    undefined;
  if (!zam) {
    // Nie znamy tego zamówienia — potwierdzamy odbiór, żeby uniknąć retry.
    return NextResponse.json({ ok: true, info: "nieznane zamówienie" });
  }

  const nowy = mapujStatus(statusRaw);
  if (!nowy) {
    return NextResponse.json({ ok: true, info: "status nieobsługiwany" });
  }

  const bylNadany = ["nadane", "w_drodze", "dostarczone"].includes(zam.status);
  await aktualizujStatus(zam.numer, nowy, tracking ? { tracking } : undefined);

  // Mail „przesyłka nadana" — tylko przy pierwszym przejściu do nadania.
  if (nowy === "nadane" && !bylNadany) {
    try {
      const m = mailPrzesylkaNadana(
        { numer: zam.numer, imie: zam.klient.imie },
        { numer: tracking ?? zam.furgonetka?.tracking, link: trackingLink }
      );
      await wyslijMail({
        do: zam.klient.email,
        temat: m.temat,
        html: m.html,
        tekst: m.tekst,
      });
    } catch (e) {
      console.error("Nie udało się wysłać maila o nadaniu:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
