import type { Metadata } from "next";
import Link from "next/link";
import { MoonLogo } from "@/components/moon-logo";

export const metadata: Metadata = {
  title: "O marce",
  description:
    "NAWIA to ręcznie tworzona biżuteria inspirowana fazami księżyca i mocą naturalnych kamieni. Poznaj historię, wartości i rzemiosło naszej małej pracowni.",
  alternates: { canonical: "/o-marce" },
};

const WARTOSCI: [string, string][] = [
  ["Ręczna praca", "Każdy element wykańczamy ręcznie w małej pracowni — bez masowej produkcji."],
  ["Naturalne kamienie", "Kamień księżycowy, labradoryt i kryształ górski o niepowtarzalnym usłojeniu."],
  ["Srebro próby 925", "Trwała, hipoalergiczna baza, która z czasem nabiera szlachetnej patyny."],
  ["Szacunek dla natury", "Kamienie pozyskujemy odpowiedzialnie, a opakowania są w pełni nadające się do recyklingu."],
];

const ETAPY: [string, string, string][] = [
  ["01", "Intencja", "Każda kolekcja zaczyna się od historii i fazy księżyca, która jej patronuje."],
  ["02", "Projekt", "Szkicujemy formę i dobieramy kamień, którego energia odpowiada intencji."],
  ["03", "Rzemiosło", "Ręcznie kujemy, lutujemy i polerujemy srebro próby 925."],
  ["04", "Rytuał", "Gotowy egzemplarz oczyszczamy i pakujemy, gotowy, by towarzyszyć Tobie."],
];

export default function ONasPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-sand">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:py-28">
          <MoonLogo className="h-16 w-16 text-gold" />
          <p className="eyebrow mt-6">O marce</p>
          <h1 className="mt-4 text-[2rem] leading-tight text-ink sm:text-5xl">
            Biżuteria utkana ze światła księżyca
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            NAWIA czerpie z dawnych słowiańskich wierzeń o księżycu jako
            przewodniku przemian. Tworzymy ozdoby, które mają towarzyszyć
            codziennym rytuałom — od porannej intencji po wieczorne wyciszenie.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="eyebrow text-center">Nasza historia</p>
        <h2 className="mt-3 text-center text-3xl text-ink">
          Z pracowni, nie z taśmy
        </h2>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
          <p>
            NAWIA narodziła się z fascynacji księżycem i kamieniami, które
            zdają się przechowywać jego światło. Zaczęło się od kilku
            wisiorków tworzonych wieczorami — dziś to mała pracownia, w której
            każdy egzemplarz powstaje powoli i z uwagą.
          </p>
          <p>
            Wierzymy, że biżuteria to coś więcej niż ozdoba. To przedmiot
            osobisty, który nosisz blisko ciała i który zbiera Twoje
            codzienne historie. Dlatego nie produkujemy masowo — każda sztuka
            jest niepowtarzalna, bo niepowtarzalny jest kamień, z którego
            powstaje.
          </p>
        </div>
      </section>

      {/* WARTOŚCI */}
      <section className="bg-cream/50">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="text-center">
            <p className="eyebrow">W co wierzymy</p>
            <h2 className="mt-3 text-3xl text-ink">Nasze wartości</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {WARTOSCI.map(([t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-line/40 bg-paper p-7"
              >
                <MoonLogo className="h-9 w-9 text-gold" />
                <h3 className="mt-4 text-xl text-gold-deep">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCES */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="text-center">
          <p className="eyebrow">Jak powstaje</p>
          <h2 className="mt-3 text-3xl text-ink">Od intencji do rytuału</h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPY.map(([nr, t, d]) => (
            <div key={nr} className="text-center sm:text-left">
              <span className="brand-mark text-3xl text-gold/70">{nr}</span>
              <h3 className="mt-3 text-xl text-ink">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <p className="eyebrow">Odkryj</p>
          <h2 className="mt-3 text-3xl text-ink">Znajdź swój egzemplarz</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted">
            Każda ozdoba czeka na swoją historię. Przejrzyj kolekcję i wybierz
            tę, która rezonuje właśnie z Tobą.
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
