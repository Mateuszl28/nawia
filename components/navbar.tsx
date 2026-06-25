"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useKoszyk } from "@/components/cart-context";
import { useUlubione } from "@/components/favorites-context";
import { BrandLogo } from "@/components/brand-logo";

const LINKI = [
  { href: "/produkty", label: "Sklep" },
  { href: "/o-marce", label: "O marce" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const { liczbaSztuk, gotowy } = useKoszyk();
  const { liczba: liczbaUlubionych, gotowy: ulubGotowy } = useUlubione();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOtwarte, setMenuOtwarte] = useState(false);
  const [szukaj, setSzukaj] = useState("");

  // Panel administracyjny ma własny układ — chowamy nawigację sklepu.
  if (pathname.startsWith("/admin")) return null;

  function wyslijSzukaj(e: React.FormEvent) {
    e.preventDefault();
    const q = szukaj.trim();
    router.push(q ? `/produkty?q=${encodeURIComponent(q)}` : "/produkty");
    setMenuOtwarte(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-ink"
          aria-label="NAWIA — strona główna"
        >
          <BrandLogo priority className="h-11 w-auto sm:h-12" />
        </Link>

        {/* Linki — desktop */}
        <div className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {LINKI.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Wyszukiwarka — desktop */}
        <form
          onSubmit={wyslijSzukaj}
          className="hidden flex-1 items-center md:flex md:max-w-xs"
          role="search"
        >
          <div className="flex w-full items-center rounded-full border border-line bg-paper px-4 py-2">
            <SearchIcon />
            <input
              value={szukaj}
              onChange={(e) => setSzukaj(e.target.value)}
              placeholder="Szukaj…"
              aria-label="Szukaj produktów"
              className="ml-2 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
        </form>

        {/* Akcje */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/ulubione"
            className="relative text-ink transition-colors hover:text-gold"
            aria-label="Ulubione"
          >
            <HeartIcon />
            {ulubGotowy && liczbaUlubionych > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-medium text-paper">
                {liczbaUlubionych}
              </span>
            )}
          </Link>

          <Link
            href="/koszyk"
            className="relative flex items-center gap-2 text-sm text-ink transition-colors hover:text-gold"
            aria-label="Koszyk"
          >
            <CartIcon />
            <span className="hidden sm:inline">Koszyk</span>
            {gotowy && liczbaSztuk > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.7rem] font-medium text-paper">
                {liczbaSztuk}
              </span>
            )}
          </Link>

          <Link
            href="/admin/login"
            className="hidden rounded-full border border-gold px-4 py-1.5 text-sm text-gold-deep transition-colors hover:bg-gold hover:text-paper sm:inline-block"
          >
            Logowanie
          </Link>

          {/* Hamburger — mobile */}
          <button
            type="button"
            onClick={() => setMenuOtwarte((o) => !o)}
            className="text-ink lg:hidden"
            aria-label="Menu"
            aria-expanded={menuOtwarte}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
              {menuOtwarte ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu mobilne */}
      {menuOtwarte && (
        <div className="border-t border-line/60 bg-paper px-5 py-5 lg:hidden">
          <form onSubmit={wyslijSzukaj} role="search" className="mb-4">
            <div className="flex items-center rounded-full border border-line bg-paper px-4 py-2">
              <SearchIcon />
              <input
                value={szukaj}
                onChange={(e) => setSzukaj(e.target.value)}
                placeholder="Szukaj…"
                aria-label="Szukaj produktów"
                className="ml-2 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {LINKI.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOtwarte(false)}
                className="rounded-lg px-2 py-2.5 text-ink transition-colors hover:bg-cream hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/ulubione"
              onClick={() => setMenuOtwarte(false)}
              className="rounded-lg px-2 py-2.5 text-ink transition-colors hover:bg-cream hover:text-gold"
            >
              Ulubione
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMenuOtwarte(false)}
              className="mt-2 rounded-full border border-gold px-4 py-2 text-center text-gold-deep transition-colors hover:bg-gold hover:text-paper"
            >
              Logowanie
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5l-1.45-1.32C5.4 14.5 2 11.4 2 7.6 2 5 4 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18 3 20 5 20 7.6c0 3.8-3.4 6.9-8.55 11.58L12 20.5z"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.5l1.6 12.1a1.5 1.5 0 0 0 1.49 1.3h9.83a1.5 1.5 0 0 0 1.47-1.2l1.36-7H5.1"
      />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}
