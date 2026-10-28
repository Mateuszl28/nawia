"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

// Koniec przerwy: 23.10.2026 00:00 czasu polskiego — po tej chwili plansza sama znika.
const KONIEC = Date.parse("2026-10-23T00:00:00+02:00");
// Klucz związany z tą konkretną przerwą — przy następnej plansza pokaże się znowu.
const KLUCZ = "nawia-urlop-2026-10-zamknieta";

// Gwiazdki na nocnym niebie: [x%, y%, rozmiar px, opóźnienie migotania s]
const GWIAZDY: [number, number, number, number][] = [
  [8, 18, 2, 0], [17, 62, 1.5, 1.2], [26, 30, 1, 2.1], [34, 80, 2, 0.6],
  [44, 14, 1.5, 1.8], [58, 70, 1, 0.3], [66, 22, 2, 2.4], [74, 54, 1, 1],
  [83, 12, 1.5, 0.8], [90, 40, 2, 1.6], [12, 86, 1, 2.8], [52, 42, 1, 3.1],
  [94, 78, 1.5, 0.2], [4, 48, 1, 1.4], [38, 52, 1, 2.6], [70, 88, 1.5, 1.9],
];

export function VacationBanner() {
  const pathname = usePathname();
  const [otwarta, setOtwarta] = useState(false);

  useEffect(() => {
    if (Date.now() >= KONIEC) return;
    try {
      if (localStorage.getItem(KLUCZ)) return;
    } catch {}
    setOtwarta(true);
  }, []);

  useEffect(() => {
    if (!otwarta) return;
    const naKlawisz = (e: KeyboardEvent) => e.key === "Escape" && zamknij();
    const poprzedniOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", naKlawisz);
    return () => {
      document.body.style.overflow = poprzedniOverflow;
      window.removeEventListener("keydown", naKlawisz);
    };
  }, [otwarta]);

  function zamknij() {
    setOtwarta(false);
    try {
      localStorage.setItem(KLUCZ, "1");
    } catch {}
  }

  if (!otwarta || pathname.startsWith("/admin")) return null;

  return (
    <div
      className="urlop-tlo fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-[3px]"
      onClick={zamknij}
    >
      <style>{`
        @keyframes urlopTlo { from { opacity: 0 } to { opacity: 1 } }
        @keyframes urlopKarta {
          from { opacity: 0; transform: translateY(18px) scale(.97) }
          to { opacity: 1; transform: none }
        }
        @keyframes urlopMig { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
        @keyframes urlopKsiezyc {
          0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) }
        }
        .urlop-tlo { animation: urlopTlo .35s ease-out both }
        .urlop-karta { animation: urlopKarta .6s cubic-bezier(.2,.8,.2,1) .05s both }
        .urlop-gwiazda { animation: urlopMig 3.2s ease-in-out infinite }
        .urlop-ksiezyc { animation: urlopKsiezyc 6s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .urlop-tlo, .urlop-karta, .urlop-gwiazda, .urlop-ksiezyc { animation: none }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="urlop-tytul"
        className="urlop-karta relative my-auto w-full max-w-[26rem] overflow-hidden rounded-[1.75rem] bg-paper shadow-[0_30px_80px_-20px_rgba(46,42,34,.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nocne niebo z księżycem */}
        <div className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#4a4234_0%,#2e2a22_55%,#1f1c17_100%)] px-8 pb-10 pt-12 text-center">
          {GWIAZDY.map(([x, y, r, d], i) => (
            <span
              key={i}
              className="urlop-gwiazda absolute rounded-full bg-gold-light"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: r,
                height: r,
                animationDelay: `${d}s`,
              }}
            />
          ))}

          {/* Poświata za księżycem */}
          <div className="pointer-events-none absolute left-1/2 top-6 h-40 w-40 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl" />

          <Image
            src="/logo-transparent.png"
            alt="NAWIA — Moon Ritual Jewelry"
            width={470}
            height={317}
            className="urlop-ksiezyc relative mx-auto h-auto w-44 [filter:brightness(1.9)_saturate(1.15)]"
          />

          <p className="relative mt-6 text-[0.65rem] uppercase tracking-[0.42em] text-gold-light/80">
            Pracownia odpoczywa
          </p>
          <div className="relative mt-3 flex items-center justify-center gap-4 font-serif text-gold-light [font-variant-numeric:lining-nums]">
            <span className="text-6xl font-medium leading-none">12</span>
            <span className="h-px w-8 bg-gold-light/60" />
            <span className="text-6xl font-medium leading-none">22</span>
          </div>
          <p className="relative mt-2 font-serif text-xl italic tracking-wide text-cream/90">
            października
          </p>
        </div>

        {/* Łuk przejścia nieba w papier */}
        <svg
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="relative -mt-6 block h-6 w-full fill-paper"
        >
          <path d="M0 24 Q200 -16 400 24 Z" />
        </svg>

        <div className="px-8 pb-9 pt-2 text-center sm:px-10">
          <h2
            id="urlop-tytul"
            className="font-serif text-[2.1rem] font-medium leading-tight text-ink"
          >
            Przerwa urlopowa
          </h2>

          <div className="mx-auto mt-4 flex items-center justify-center gap-3 text-gold">
            <span className="h-px w-10 bg-gold/50" />
            <span className="text-[0.6rem]">✦</span>
            <span className="h-px w-10 bg-gold/50" />
          </div>

          <p className="mt-4 leading-relaxed text-muted">
            Sklep pozostaje otwarty, jednak wszystkie zamówienia zrealizuję
            po&nbsp;22&nbsp;października.
          </p>
          <p className="mt-4 font-serif text-[1.35rem] italic leading-snug text-gold-deep">
            Dziękuję za wyrozumiałość
            <br />i do zobaczenia!
          </p>

          <button
            type="button"
            onClick={zamknij}
            className="mt-7 w-full rounded-full bg-ink px-8 py-3.5 text-sm uppercase tracking-[0.22em] text-paper transition-colors hover:bg-gold-deep sm:w-auto"
          >
            Przejdź do sklepu
          </button>
        </div>

        <button
          type="button"
          onClick={zamknij}
          aria-label="Zamknij"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gold-light/30 text-gold-light/90 transition-colors hover:border-gold-light hover:bg-gold-light/10 hover:text-cream"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
