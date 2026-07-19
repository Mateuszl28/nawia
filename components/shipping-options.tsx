"use client";

import { useKoszyk } from "@/components/cart-context";
import { METODY_DOSTAWY, kosztDostawy } from "@/lib/dostawa";
import { formatCenaGr } from "@/lib/products";

/** Wybór metody dostawy (Paczkomat / Kurier) — współdzielony przez koszyk i kasę. */
export function OpcjeDostawy({ tytul = true }: { tytul?: boolean }) {
  const { metodaDostawy, ustawMetodeDostawy } = useKoszyk();

  return (
    <div>
      {tytul && <p className="eyebrow mb-3">Metoda dostawy</p>}
      <div className="space-y-2">
        {METODY_DOSTAWY.map((m) => {
          const wybrana = metodaDostawy === m.id;
          const koszt = kosztDostawy(m.id);
          return (
            <label
              key={m.id}
              className={
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors " +
                (wybrana
                  ? "border-gold bg-sand/50"
                  : "border-line/60 bg-paper hover:border-gold/60")
              }
            >
              <input
                type="radio"
                name="metoda-dostawy"
                checked={wybrana}
                onChange={() => ustawMetodeDostawy(m.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border " +
                  (wybrana ? "border-gold" : "border-line")
                }
              >
                {wybrana && <span className="h-2 w-2 rounded-full bg-gold" />}
              </span>
              <span className="flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink">{m.nazwa}</span>
                  <span className="text-sm text-gold-deep">
                    {formatCenaGr(koszt)}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                  {m.opis}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
