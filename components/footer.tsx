"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-line/60 bg-sand/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-5">
        <div className="md:col-span-2">
          <BrandLogo className="h-16 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Ręcznie tworzona biżuteria inspirowana fazami księżyca i mocą
            naturalnych kamieni. Każdy egzemplarz powstaje w małej pracowni.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Sklep</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/produkty" className="hover:text-gold">
                Wszystkie produkty
              </Link>
            </li>
            <li>
              <Link href="/koszyk" className="hover:text-gold">
                Koszyk
              </Link>
            </li>
            <li>
              <Link href="/ulubione" className="hover:text-gold">
                Ulubione
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Informacje</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/o-marce" className="hover:text-gold">
                O marce
              </Link>
            </li>
            <li>
              <Link href="/regulamin" className="hover:text-gold">
                Regulamin
              </Link>
            </li>
            <li>
              <Link href="/polityka-prywatnosci" className="hover:text-gold">
                Polityka prywatności
              </Link>
            </li>
            <li>
              <Link href="/polityka-zwrotow" className="hover:text-gold">
                Polityka zwrotów
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Kontakt</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href="mailto:kontakt@nawia.pl" className="hover:text-gold">
                kontakt@nawia.pl
              </a>
            </li>
            <li>+48 600 000 000</li>
            <li>Pon–Pt, 10:00–18:00</li>
            <li>
              <Link href="/kontakt" className="text-gold-deep hover:text-gold">
                Formularz kontaktowy →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/40 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-xs text-muted sm:flex-row sm:justify-between">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} NAWIA — Moon Ritual Jewelry. Wszelkie
            prawa zastrzeżone.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/regulamin" className="hover:text-gold">
              Regulamin
            </Link>
            <Link href="/polityka-prywatnosci" className="hover:text-gold">
              Polityka prywatności
            </Link>
            <Link href="/polityka-zwrotow" className="hover:text-gold">
              Polityka zwrotów
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
