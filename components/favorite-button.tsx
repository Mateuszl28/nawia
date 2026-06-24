"use client";

import { useUlubione } from "@/components/favorites-context";
import { useToast } from "@/components/toast";
import type { ProduktSkrot } from "@/lib/products";

export function FavoriteButton({
  produkt,
  wariant = "ikona",
}: {
  produkt: ProduktSkrot;
  wariant?: "ikona" | "przycisk";
}) {
  const { przelacz, czyUlubiony, gotowy } = useUlubione();
  const { pokaz } = useToast();
  const aktywny = gotowy && czyUlubiony(produkt.slug);

  function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const teraz = przelacz(produkt);
    pokaz(teraz ? "Dodano do ulubionych ♥" : "Usunięto z ulubionych");
  }

  const Serce = (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={aktywny ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5l-1.45-1.32C5.4 14.5 2 11.4 2 7.6 2 5 4 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18 3 20 5 20 7.6c0 3.8-3.4 6.9-8.55 11.58L12 20.5z"
      />
    </svg>
  );

  if (wariant === "przycisk") {
    return (
      <button
        type="button"
        onClick={handle}
        className={
          "flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm uppercase tracking-[0.2em] transition-colors " +
          (aktywny
            ? "border-gold bg-gold text-paper"
            : "border-line text-ink hover:border-gold hover:text-gold")
        }
        aria-pressed={aktywny}
      >
        {Serce}
        {aktywny ? "W ulubionych" : "Do ulubionych"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={aktywny ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      aria-pressed={aktywny}
      className={
        "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/85 backdrop-blur transition-colors " +
        (aktywny ? "text-gold" : "text-muted hover:text-gold")
      }
    >
      {Serce}
    </button>
  );
}
