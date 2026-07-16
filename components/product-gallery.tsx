"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";
import { zdjeciaProduktu, type Produkt } from "@/lib/products";

/**
 * Galeria zdjęć produktu na stronie szczegółów.
 * Gdy produkt ma jedno zdjęcie (lub żadnego) — zachowuje się jak ProductImage.
 * Przy kilku zdjęciach pokazuje duży podgląd i klikalne miniatury.
 */
export function ProductGallery({
  produkt,
}: {
  produkt: Pick<Produkt, "slug" | "nazwa" | "ton" | "zdjecie" | "zdjecia">;
}) {
  const zdjecia = zdjeciaProduktu(produkt);
  const [aktywne, setAktywne] = useState(0);

  if (zdjecia.length <= 1) {
    return (
      <div className="overflow-hidden rounded-xl border border-line/50 bg-cream">
        <ProductImage produkt={produkt} className="aspect-square w-full" />
      </div>
    );
  }

  const glowne = zdjecia[Math.min(aktywne, zdjecia.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-line/50 bg-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={glowne}
          alt={produkt.nazwa}
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {zdjecia.map((url, i) => {
          const aktywny = i === aktywne;
          return (
            <button
              key={url}
              type="button"
              onClick={() => setAktywne(i)}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
              aria-current={aktywny}
              className={`overflow-hidden rounded-lg border transition-colors ${
                aktywny
                  ? "border-gold ring-1 ring-gold"
                  : "border-line/50 hover:border-gold/60"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${produkt.nazwa} — miniatura ${i + 1}`}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
