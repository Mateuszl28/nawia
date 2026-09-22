import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { PLATNOSC, SITE_EMAIL } from "@/lib/site";
import { formatCenaGr } from "@/lib/products";

export const metadata = { title: "Dziękujemy za zamówienie — NAWIA" };

export default async function SukcesPage({
  searchParams,
}: {
  searchParams: Promise<{ nr?: string; kwota?: string; mail?: string }>;
}) {
  const { nr, kwota, mail } = await searchParams;
  const mailWyslany = mail === "1";
  const doZaplaty = kwota ? Number(kwota) : null;

  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center">
      <BrandLogo priority className="mx-auto h-20 w-auto" />
      <p className="eyebrow mt-8">Zamówienie przyjęte</p>
      <h1 className="mt-4 text-4xl text-ink">Dziękujemy!</h1>
      <p className="mt-6 leading-relaxed text-muted">
        Twoje zamówienie zostało przyjęte.{" "}
        {mailWyslany
          ? "Potwierdzenie z danymi do płatności wysłaliśmy na podany adres e-mail (sprawdź też folder SPAM)."
          : "Zapisz numer zamówienia i dane do płatności poniżej — będą potrzebne do przelewu."}{" "}
        Po zaksięgowaniu wpłaty nadamy przesyłkę. W razie pytań napisz na{" "}
        <a href={`mailto:${SITE_EMAIL}`} className="text-gold-deep hover:underline">
          {SITE_EMAIL}
        </a>
        .
      </p>
      {nr && (
        <p className="mt-6 inline-block rounded-full border border-line bg-cream px-6 py-2 text-sm">
          Numer zamówienia: <span className="text-gold-deep">{nr}</span>
        </p>
      )}

      <div className="mt-8 rounded-xl border border-line/60 bg-cream p-6 text-left">
        <p className="eyebrow mb-3">Płatność</p>
        {doZaplaty != null && (
          <p className="mb-3 text-sm text-ink">
            Do zapłaty:{" "}
            <span className="text-gold-deep">{formatCenaGr(doZaplaty)}</span>
          </p>
        )}
        <dl className="space-y-1.5 text-sm text-muted">
          <div>
            Numer konta:{" "}
            <span className="text-ink">{PLATNOSC.konto}</span>
          </div>
          <div>
            Odbiorca:{" "}
            <span className="text-ink">{PLATNOSC.odbiorca}</span> ({PLATNOSC.bank})
          </div>
          <div>
            BLIK na telefon:{" "}
            <span className="text-ink">{PLATNOSC.blikTelefon}</span>
          </div>
          {nr && (
            <div>
              Tytuł przelewu:{" "}
              <span className="text-ink">{nr}</span>
            </div>
          )}
        </dl>
      </div>
      <div className="mt-10">
        <Link
          href="/produkty"
          className="rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
        >
          Wróć do sklepu
        </Link>
      </div>
    </div>
  );
}
