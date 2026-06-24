import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { FavoriteButton } from "@/components/favorite-button";
import { formatCena, nazwaKategorii, skrot, type Produkt } from "@/lib/products";

export function ProductCard({ produkt }: { produkt: Produkt }) {
  return (
    <div className="group fade-up block">
      <div className="relative overflow-hidden rounded-lg border border-line/50 bg-cream">
        <FavoriteButton produkt={skrot(produkt)} />
        <Link href={`/produkty/${produkt.slug}`} className="block">
          <ProductImage
            produkt={produkt}
            className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {produkt.nowosc && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold">
            Nowość
          </span>
        )}
      </div>
      <Link href={`/produkty/${produkt.slug}`} className="mt-4 block text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          {nazwaKategorii(produkt.kategoria)}
        </p>
        <h3 className="mt-1 text-lg text-ink transition-colors group-hover:text-gold">
          {produkt.nazwa}
        </h3>
        <p className="mt-1 text-sm text-gold-deep">{formatCena(produkt.cena)}</p>
      </Link>
    </div>
  );
}
