import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FavoriteButton } from "@/components/favorite-button";
import { JsonLd } from "@/components/json-ld";
import {
  formatCena,
  glowneZdjecie,
  KATEGORIE,
  skrot,
  zdjeciaProduktu,
} from "@/lib/products";
import { produktPoSlug, wszystkieProdukty } from "@/lib/store";
import { BASE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 3600; // ISR (+ rewalidacja po edycji w panelu)

export async function generateStaticParams() {
  const produkty = await wszystkieProdukty();
  return produkty.map((p) => ({ slug: p.slug }));
}

function metaOpis(produkt: { opis: string; opisDlugi: string }): string {
  // Nowe linie/wielokrotne spacje → pojedyncza spacja (meta/JSON-LD nie łamie akapitów).
  const t = (produkt.opisDlugi || produkt.opis).replace(/\s+/g, " ").trim();
  return t.length > 157 ? t.slice(0, 154).trimEnd() + "…" : t;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produkt = await produktPoSlug(slug);
  if (!produkt) return { title: "NAWIA" };
  const opis = metaOpis(produkt);
  return {
    title: produkt.nazwa,
    description: opis,
    alternates: { canonical: `/produkty/${produkt.slug}` },
    openGraph: {
      title: `${produkt.nazwa} — NAWIA`,
      description: opis,
      url: `${BASE_URL}/produkty/${produkt.slug}`,
      type: "website",
      images: [{ url: glowneZdjecie(produkt) ?? "/logo.jpg", alt: produkt.nazwa }],
    },
  };
}

export default async function ProduktPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produkt = await produktPoSlug(slug);
  if (!produkt) notFound();

  const podobne = (await wszystkieProdukty())
    .filter((p) => p.kategoria === produkt.kategoria && p.slug !== produkt.slug)
    .slice(0, 4);

  const nazwaKategorii =
    KATEGORIE.find((k) => k.id === produkt.kategoria)?.nazwa ?? produkt.kategoria;

  const galeria = zdjeciaProduktu(produkt);
  const obraz =
    galeria.length > 0
      ? galeria.map((z) => `${BASE_URL}${z}`)
      : `${BASE_URL}/logo.jpg`;

  const produktLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produkt.nazwa,
    description: metaOpis(produkt),
    sku: produkt.slug,
    category: nazwaKategorii,
    image: obraz,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: produkt.cena,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/produkty/${produkt.slug}`,
      priceValidUntil: "2027-12-31",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  const okruszkiLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sklep",
        item: `${BASE_URL}/produkty`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: nazwaKategorii,
        item: `${BASE_URL}/produkty?kategoria=${produkt.kategoria}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: produkt.nazwa,
        item: `${BASE_URL}/produkty/${produkt.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <JsonLd data={produktLd} />
      <JsonLd data={okruszkiLd} />
      <nav className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-gold">
          Strona główna
        </Link>{" "}
        /{" "}
        <Link href="/produkty" className="hover:text-gold">
          Sklep
        </Link>{" "}
        / <span className="text-ink">{produkt.nazwa}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <ProductGallery produkt={produkt} />

        <div className="flex flex-col justify-center">
          <p className="eyebrow">{nazwaKategorii}</p>
          <h1 className="mt-3 text-4xl text-ink">{produkt.nazwa}</h1>
          <p className="mt-4 text-2xl text-gold-deep">
            {formatCena(produkt.cena)}
          </p>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">{produkt.opisDlugi}</p>

          <dl className="mt-6 space-y-2 border-y border-line/50 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Kategoria</dt>
              <dd className="text-ink">{nazwaKategorii}</dd>
            </div>
            {produkt.dlugosc && (
              <div className="flex justify-between">
                <dt className="text-muted">Długość</dt>
                <dd className="text-ink">{produkt.dlugosc}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 space-y-3">
            <AddToCartButton produkt={skrot(produkt)} />
            <FavoriteButton produkt={skrot(produkt)} wariant="przycisk" />
          </div>

          <p className="mt-5 text-xs text-muted">
            Wysyłka w 2–4 dni robocze · Darmowa dostawa od 300 zł · 14 dni na
            zwrot
          </p>
        </div>
      </div>

      {podobne.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-10 text-center text-2xl text-ink">
            Może Ci się spodobać
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {podobne.map((p) => (
              <ProductCard key={p.slug} produkt={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
