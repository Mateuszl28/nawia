"use client";

import Link from "next/link";
import { useKoszyk } from "@/components/cart-context";
import { ProductImage } from "@/components/product-image";
import { formatCena, nazwaKategorii } from "@/lib/products";

const PROG_DARMOWEJ_DOSTAWY = 300;
const KOSZT_DOSTAWY = 15;

export default function KoszykPage() {
  const { produktyZKoszyka, ustawIlosc, usun, suma, gotowy } = useKoszyk();

  if (!gotowy) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center text-muted">
        Ładowanie koszyka…
      </div>
    );
  }

  if (produktyZKoszyka.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl text-ink">Twój koszyk jest pusty</h1>
        <p className="mt-4 text-muted">
          Odkryj kolekcję i znajdź coś dla siebie.
        </p>
        <Link
          href="/produkty"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
        >
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  const dostawa = suma >= PROG_DARMOWEJ_DOSTAWY ? 0 : KOSZT_DOSTAWY;
  const doDarmowej = Math.max(0, PROG_DARMOWEJ_DOSTAWY - suma);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-4xl text-ink">Koszyk</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line/50">
          {produktyZKoszyka.map(({ produkt, ilosc }) => (
            <li key={produkt.slug} className="flex gap-4 py-6">
              <Link
                href={`/produkty/${produkt.slug}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line/50 bg-cream"
              >
                <ProductImage produkt={produkt} className="h-full w-full" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/produkty/${produkt.slug}`}
                      className="text-lg text-ink hover:text-gold"
                    >
                      {produkt.nazwa}
                    </Link>
                    <p className="text-sm text-muted">
                      {nazwaKategorii(produkt.kategoria)}
                    </p>
                  </div>
                  <p className="text-gold-deep">
                    {formatCena(produkt.cena * ilosc)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      onClick={() => ustawIlosc(produkt.slug, ilosc - 1)}
                      className="px-3 py-1 text-muted hover:text-gold"
                      aria-label="Zmniejsz ilość"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-ink">
                      {ilosc}
                    </span>
                    <button
                      onClick={() => ustawIlosc(produkt.slug, ilosc + 1)}
                      className="px-3 py-1 text-muted hover:text-gold"
                      aria-label="Zwiększ ilość"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => usun(produkt.slug)}
                    className="text-sm text-muted underline-offset-4 hover:text-gold hover:underline"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Podsumowanie */}
        <aside className="h-fit rounded-xl border border-line/50 bg-cream p-6">
          <h2 className="text-xl text-ink">Podsumowanie</h2>

          {doDarmowej > 0 ? (
            <p className="mt-4 rounded-lg bg-sand/60 px-4 py-3 text-xs text-muted">
              Do darmowej dostawy brakuje{" "}
              <span className="text-gold-deep">{formatCena(doDarmowej)}</span>.
            </p>
          ) : (
            <p className="mt-4 rounded-lg bg-sand/60 px-4 py-3 text-xs text-gold-deep">
              Masz darmową dostawę! ✓
            </p>
          )}

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Wartość produktów</dt>
              <dd className="text-ink">{formatCena(suma)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Dostawa</dt>
              <dd className="text-ink">
                {dostawa === 0 ? "Gratis" : formatCena(dostawa)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line/50 pt-3 text-base">
              <dt className="text-ink">Razem</dt>
              <dd className="text-gold-deep">{formatCena(suma + dostawa)}</dd>
            </div>
          </dl>

          <Link
            href="/zamowienie"
            className="mt-6 block rounded-full bg-ink px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
          >
            Przejdź do kasy
          </Link>
          <Link
            href="/produkty"
            className="mt-3 block text-center text-sm text-muted hover:text-gold"
          >
            Kontynuuj zakupy
          </Link>
        </aside>
      </div>
    </div>
  );
}
