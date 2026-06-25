import Link from "next/link";
import { MoonLogo } from "@/components/moon-logo";

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
    <article className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <header className="text-center">
        <MoonLogo className="mx-auto h-12 w-12 text-gold" />
        <p className="eyebrow mt-6">{eyebrow}</p>
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
      </header>

      <div className="mt-14 space-y-10">{children}</div>

      <footer className="mt-16 border-t border-line/50 pt-10 text-center">
        <p className="text-sm leading-relaxed text-muted">
          Masz pytania? Napisz do nas —{" "}
          <a
            href="mailto:kontakt@nawia.pl"
            className="text-gold-deep underline-offset-4 hover:underline"
          >
            kontakt@nawia.pl
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
