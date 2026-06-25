import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { MoonLogo } from "@/components/moon-logo";
import { BrandLogo } from "@/components/brand-logo";
import { KATEGORIE } from "@/lib/products";
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
            Biżuteria utkana ze światła księżyca
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-6">
            Ręcznie tworzone naszyjniki, pierścionki i kolczyki z naturalnych
            kamieni. Srebro 925, kamień księżycowy, labradoryt i surowe
            kryształy — każdy egzemplarz niepowtarzalny.
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

      {/* KATEGORIE */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {KATEGORIE.map((k) => (
            <Link
              key={k.id}
              href={`/produkty?kategoria=${k.id}`}
              className="group rounded-lg border border-line/50 bg-cream px-6 py-10 text-center transition-colors hover:border-gold"
            >
              <MoonLogo className="mx-auto h-10 w-10 text-gold/70 transition-colors group-hover:text-gold" />
              <span className="mt-4 block text-lg text-ink">{k.nazwa}</span>
            </Link>
          ))}
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

      {/* O MARCE */}
      <section id="o-marce" className="mx-auto mt-16 max-w-4xl px-5 py-20 text-center">
        <p className="eyebrow">O marce</p>
        <h2 className="mt-3 text-3xl text-ink">Rytuał, nie tylko ozdoba</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          NAWIA czerpie z dawnych wierzeń o księżycu jako przewodniku przemian.
          Tworzymy biżuterię, która ma towarzyszyć codziennym rytuałom — od
          porannej intencji po wieczorne wyciszenie. Pracujemy ze srebrem próby
          925 i kamieniami pozyskiwanymi z poszanowaniem natury.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            ["Ręczna praca", "Każdy element wykańczany ręcznie w małej pracowni."],
            ["Naturalne kamienie", "Kamień księżycowy, labradoryt, kryształ górski."],
            ["Srebro 925", "Trwała, hipoalergiczna baza każdej ozdoby."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="text-xl text-gold-deep">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/o-marce"
            className="rounded-full border border-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold-deep transition-colors hover:bg-gold hover:text-paper"
          >
            Poznaj naszą historię
          </Link>
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
