"use client";

import Link from "next/link";
import { useUlubione } from "@/components/favorites-context";
import { useKoszyk } from "@/components/cart-context";
import { useToast } from "@/components/toast";
import { ProductImage } from "@/components/product-image";
import { formatCena, nazwaKategorii } from "@/lib/products";

export default function UlubionePage() {
  const { ulubione, usun, gotowy } = useUlubione();
  const { dodaj } = useKoszyk();
  const { pokaz } = useToast();

  if (!gotowy) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center text-muted">
        Ładowanie…
      </div>
    );
  }

  if (ulubione.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl text-ink">Brak ulubionych</h1>
        <p className="mt-4 text-muted">
          Zapisuj produkty serduszkiem, by wrócić do nich później.
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="text-center">
        <p className="eyebrow">Twoja lista</p>
        <h1 className="mt-2 text-4xl text-ink">Ulubione</h1>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {ulubione.map((p) => (
          <div key={p.slug} className="fade-up">
            <div className="relative overflow-hidden rounded-lg border border-line/50 bg-cream">
              <button
                type="button"
                onClick={() => usun(p.slug)}
                aria-label="Usuń z ulubionych"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/85 text-gold backdrop-blur transition-colors hover:text-gold-deep"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 20.5l-1.45-1.32C5.4 14.5 2 11.4 2 7.6 2 5 4 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18 3 20 5 20 7.6c0 3.8-3.4 6.9-8.55 11.58L12 20.5z" />
                </svg>
              </button>
              <Link href={`/produkty/${p.slug}`} className="block">
                <ProductImage produkt={p} className="aspect-square w-full" />
              </Link>
            </div>
            <div className="mt-4 text-center">
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                {nazwaKategorii(p.kategoria)}
              </p>
              <Link
                href={`/produkty/${p.slug}`}
                className="mt-1 block text-lg text-ink transition-colors hover:text-gold"
              >
                {p.nazwa}
              </Link>
              <p className="mt-1 text-sm text-gold-deep">{formatCena(p.cena)}</p>
              <button
                type="button"
                onClick={() => {
                  dodaj(p, 1);
                  pokaz(`Dodano do koszyka: ${p.nazwa}`);
                }}
                className="mt-3 rounded-full border border-line px-5 py-2 text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:border-gold hover:text-gold"
              >
                Do koszyka
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
