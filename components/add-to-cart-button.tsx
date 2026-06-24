"use client";

import { useState } from "react";
import { useKoszyk } from "@/components/cart-context";
import { useToast } from "@/components/toast";
import type { ProduktSkrot } from "@/lib/products";

export function AddToCartButton({ produkt }: { produkt: ProduktSkrot }) {
  const { dodaj } = useKoszyk();
  const { pokaz } = useToast();
  const [ilosc, setIlosc] = useState(1);
  const [dodano, setDodano] = useState(false);

  function handleDodaj() {
    dodaj(produkt, ilosc);
    pokaz(`Dodano do koszyka: ${produkt.nazwa}`);
    setDodano(true);
    setTimeout(() => setDodano(false), 1800);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-line">
        <button
          type="button"
          onClick={() => setIlosc((i) => Math.max(1, i - 1))}
          className="px-4 py-2 text-lg text-muted transition-colors hover:text-gold"
          aria-label="Zmniejsz ilość"
        >
          −
        </button>
        <span className="w-10 text-center text-ink">{ilosc}</span>
        <button
          type="button"
          onClick={() => setIlosc((i) => i + 1)}
          className="px-4 py-2 text-lg text-muted transition-colors hover:text-gold"
          aria-label="Zwiększ ilość"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleDodaj}
        className="flex-1 rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
      >
        {dodano ? "Dodano do koszyka ✓" : "Dodaj do koszyka"}
      </button>
    </div>
  );
}
