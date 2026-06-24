import Link from "next/link";
import { MoonLogo } from "@/components/moon-logo";

export const metadata = {
  title: "Nie znaleziono strony",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <MoonLogo className="h-16 w-16 text-gold" />
      <p className="eyebrow mt-8">Błąd 404</p>
      <h1 className="mt-4 text-4xl text-ink">Tej strony nie ma</h1>
      <p className="mt-6 leading-relaxed text-muted">
        Możliwe, że produkt został przeniesiony lub adres jest nieprawidłowy.
        Wróć do sklepu i odkryj kolekcję na nowo.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/produkty"
          className="rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
        >
          Przejdź do sklepu
        </Link>
        <Link
          href="/"
          className="rounded-full border border-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold-deep transition-colors hover:bg-gold hover:text-paper"
        >
          Strona główna
        </Link>
      </div>
    </div>
  );
}
