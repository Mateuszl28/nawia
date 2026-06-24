"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonLogo } from "@/components/moon-logo";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-line/60 bg-sand/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 text-ink">
            <MoonLogo className="h-8 w-8 text-gold" />
            <span className="brand-mark text-lg">NAWIA</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
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
              <Link href="/produkty?kategoria=naszyjniki" className="hover:text-gold">
                Naszyjniki
              </Link>
            </li>
            <li>
              <Link href="/produkty?kategoria=kolczyki" className="hover:text-gold">
                Kolczyki
              </Link>
            </li>
            <li>
              <Link href="/koszyk" className="hover:text-gold">
                Koszyk
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Kontakt</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>kontakt@nawia.pl</li>
            <li>+48 600 000 000</li>
            <li>Pon–Pt, 10:00–18:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/40 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} NAWIA — Moon Ritual Jewelry. Wszelkie prawa
        zastrzeżone.
      </div>
    </footer>
  );
}
