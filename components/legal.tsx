import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

/**
 * Wspólny szkielet stron informacyjno-prawnych (regulamin, polityki).
 * Spójna typografia i nagłówek dla całej sekcji „Informacje".
 */
export function LegalShell({
  eyebrow,
  tytul,
  wstep,
  aktualizacja,
  children,
}: {
  eyebrow: string;
  tytul: string;
  wstep?: string;
  aktualizacja?: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      {/* Pasek nagłówkowy w kolorze sand — logo wtapia się tłem */}
      <header className="bg-sand">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-14 text-center sm:py-16">
          <BrandLogo priority className="h-auto w-48 max-w-full sm:w-56" />
          <p className="eyebrow mt-4">{eyebrow}</p>
          <h1 className="mt-3 text-[2rem] leading-tight text-ink sm:text-4xl">
            {tytul}
          </h1>
          {wstep && (
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              {wstep}
            </p>
          )}
          {aktualizacja && (
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">
              Ostatnia aktualizacja: {aktualizacja}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-10 px-5 py-16 sm:py-20">
        {children}
      </div>

      <footer className="mx-auto max-w-3xl border-t border-line/50 px-5 pb-16 pt-10 text-center">
        <p className="text-sm leading-relaxed text-muted">
          Masz pytania? Napisz do nas —{" "}
          <a
            href="mailto:kontakt@nawiabizuteria.pl"
            className="text-gold-deep underline-offset-4 hover:underline"
          >
            kontakt@nawiabizuteria.pl
          </a>
        </p>
        <Link
          href="/produkty"
          className="mt-6 inline-block rounded-full border border-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold-deep transition-colors hover:bg-gold hover:text-paper"
        >
          Wróć do sklepu
        </Link>
      </footer>
    </article>
  );
}

/** Pojedyncza, numerowana sekcja dokumentu. */
export function LegalSection({
  nr,
  tytul,
  children,
}: {
  nr?: number;
  tytul: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line/40 bg-cream/40 p-6 sm:p-8">
      <h2 className="flex items-baseline gap-3 text-xl text-ink sm:text-2xl">
        {nr != null && (
          <span className="brand-mark text-base text-gold">
            {String(nr).padStart(2, "0")}
          </span>
        )}
        <span>{tytul}</span>
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted sm:text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}

/** Lista wypunktowana w stylu strony. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
