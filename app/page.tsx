import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { BrandLogo } from "@/components/brand-logo";
import { wszystkieProdukty } from "@/lib/store";

export const revalidate = 3600; // ISR — odświeżanie co godzinę (+ rewalidacja po edycji w panelu)

export default async function Home() {
  const produkty = await wszystkieProdukty();
  const polecane = produkty.filter((p) => p.nowosc).slice(0, 4);
  const bestsellery = produkty.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-sand">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-16 text-center sm:py-24 md:py-32">
          <BrandLogo
            priority
            className="h-auto w-56 max-w-full sm:w-72"
          />
          <h1 className="mt-2 max-w-2xl text-[2rem] leading-tight text-ink sm:text-5xl md:text-6xl">
            Biżuteria inspirowana tym, co niewidzialne
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-6">
            Ręcznie tworzona z naturalnych kamieni — jako subtelny rytuał,
            symbol i osobisty talizman.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/produkty"
              className="rounded-full bg-ink px-8 py-3 text-center text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
            >
              Odkryj kolekcję
            </Link>
            <Link
              href="/o-marce"
              className="rounded-full border border-gold px-8 py-3 text-center text-sm uppercase tracking-[0.2em] text-gold-deep transition-colors hover:bg-gold hover:text-paper"
            >
              O marce
            </Link>
          </div>
        </div>
      </section>

      {/* NOWOŚCI */}
      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="mb-10 text-center">
          <p className="eyebrow">Świeżo z pracowni</p>
          <h2 className="mt-2 text-3xl text-ink">Nowości</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {polecane.map((p) => (
            <ProductCard key={p.slug} produkt={p} />
          ))}
        </div>
      </section>

      {/* BESTSELLERY */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-10 text-center">
          <p className="eyebrow">Ulubione</p>
          <h2 className="mt-2 text-3xl text-ink">Bestsellery</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {bestsellery.map((p) => (
            <ProductCard key={p.slug} produkt={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/produkty"
            className="rounded-full border border-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold-deep transition-colors hover:bg-gold hover:text-paper"
          >
            Zobacz wszystkie
          </Link>
        </div>
      </section>
    </>
  );
}
