import Link from "next/link";
import { MoonLogo } from "@/components/moon-logo";

export const metadata = { title: "Dziękujemy za zamówienie — NAWIA" };

export default async function SukcesPage({
  searchParams,
}: {
  searchParams: Promise<{ nr?: string }>;
}) {
  const { nr } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center">
      <MoonLogo className="mx-auto h-16 w-16 text-gold" />
      <p className="eyebrow mt-8">Zamówienie przyjęte</p>
      <h1 className="mt-4 text-4xl text-ink">Dziękujemy!</h1>
      <p className="mt-6 leading-relaxed text-muted">
        Twoje zamówienie zostało przyjęte do realizacji. Potwierdzenie wysłaliśmy
        na podany adres e-mail. Spakujemy je z należytą uwagą i wyślemy w ciągu
        2–4 dni roboczych.
      </p>
      {nr && (
        <p className="mt-6 inline-block rounded-full border border-line bg-cream px-6 py-2 text-sm">
          Numer zamówienia: <span className="text-gold-deep">{nr}</span>
        </p>
      )}
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
