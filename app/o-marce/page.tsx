import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "O marce",
  description:
    "NAWIA — biżuteria inspirowana światem intuicji, księżyca i słowiańskiej duchowości. Małe, osobiste talizmany ze stali chirurgicznej i naturalnych kamieni.",
  alternates: { canonical: "/o-marce" },
};

const DLA_KOBIET = [
  "kierują się intuicją",
  "odnajdują piękno w rytuałach",
  "kochają naturę, kamienie i symbolikę",
  "szukają rzeczy z duszą i znaczeniem",
];

export default function OMarcePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-sand">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:py-28">
          <BrandLogo priority className="h-auto w-56 max-w-full sm:w-64" />
          <p className="eyebrow mt-6">O marce</p>
          <h1 className="mt-4 text-[2rem] leading-tight text-ink sm:text-5xl">
            Świat intuicji i księżyca
          </h1>
        </div>
      </section>

      {/* NARRACJA */}
      <section className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
        <div className="space-y-6 text-base leading-relaxed text-muted sm:text-lg">
          <p>
            <span className="brand-mark text-ink">NAWIA</span> to przestrzeń
            inspirowana tym, co niewidzialne — intuicją, energią i spokojem
            ukrytym poza światem codzienności.
          </p>
          <p>
            Nazwa nawiązuje do słowiańskiego pojęcia niematerialnej
            rzeczywistości — sfery duchowej, symbolicznej i pełnej wewnętrznego
            znaczenia. To świat księżyca, rytuałów, natury i kobiecej intuicji.
          </p>
          <p>
            Biżuteria NAWIA powstaje jako małe, osobiste talizmany — inspirowane
            ruchem planet, światłem księżyca i naturalną energią kamieni. Każdy
            projekt tworzony jest z intencją, w atmosferze spokoju i świadomego
            rytuału.
          </p>
        </div>

        {/* Cytat */}
        <blockquote className="my-12 text-center">
          <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
            NAWIA nie jest dosłownością.
            <br />
            To emocja.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
            To cisza nocy, światło pełni i symboliczna więź między naturą,
            człowiekiem i tym, co niewidzialne.
          </p>
        </blockquote>

        {/* Dla kobiet, które */}
        <div className="rounded-2xl border border-line/40 bg-cream/40 p-7 sm:p-9">
          <p className="text-lg text-ink">To biżuteria dla kobiet, które:</p>
          <ul className="mt-5 space-y-3 text-muted">
            {DLA_KOBIET.map((t) => (
              <li key={t} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Materiały */}
        <p className="mt-12 text-center text-sm leading-relaxed text-muted">
          Tworzymy ze stali chirurgicznej i naturalnych kamieni — materiałów
          trwałych, hipoalergicznych i przyjaznych skórze.
        </p>

        {/* Tagline + podpis */}
        <div className="mt-12 border-t border-line/50 pt-10 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-gold-deep sm:text-2xl">
            NAWIA — biżuteria inspirowana światem intuicji, księżyca i
            słowiańskiej duchowości.
          </p>
          <p className="brand-mark mt-7 text-lg text-ink">Patrycja Reszka</p>
          <p className="eyebrow mt-1">Założycielka</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <p className="eyebrow">Odkryj</p>
          <h2 className="mt-3 text-3xl text-ink">Znajdź swój talizman</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted">
            Każdy egzemplarz czeka na swoją historię. Przejrzyj kolekcję i
            wybierz ten, który rezonuje właśnie z Tobą.
          </p>
          <Link
            href="/produkty"
            className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
          >
            Odkryj kolekcję
          </Link>
        </div>
      </section>
    </>
  );
}
