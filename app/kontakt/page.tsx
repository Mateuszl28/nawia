import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z NAWIA — napisz do nas w sprawie zamówienia, zwrotu lub biżuterii na zamówienie. E-mail, telefon i formularz kontaktowy.",
  alternates: { canonical: "/kontakt" },
};

const DANE: { etykieta: string; wartosc: string; href?: string }[] = [
  { etykieta: "E-mail", wartosc: "kontakt@nawiabizuteria.pl", href: "mailto:kontakt@nawiabizuteria.pl" },
  { etykieta: "Telefon", wartosc: "+48 511 168 962", href: "tel:+48511168962" },
  { etykieta: "Godziny", wartosc: "Pon–Pt, 10:00–18:00" },
];

export default function KontaktPage() {
  return (
    <>
      {/* Nagłówek */}
      <header className="bg-sand">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-14 text-center sm:py-16">
          <BrandLogo priority className="h-auto w-48 max-w-full sm:w-56" />
          <p className="eyebrow mt-4">Kontakt</p>
          <h1 className="mt-3 text-[2rem] leading-tight text-ink sm:text-4xl">
            Napisz do nas
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
            Masz pytanie o zamówienie, zwrot albo marzy Ci się egzemplarz na
            zamówienie? Chętnie pomożemy — odpisujemy zwykle w ciągu jednego
            dnia roboczego.
          </p>
        </div>
      </header>

      {/* Treść */}
      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:py-20 md:grid-cols-2">
        {/* Dane kontaktowe */}
        <div>
          <h2 className="text-2xl text-ink">Dane kontaktowe</h2>
          <ul className="mt-6 space-y-5">
            {DANE.map((d) => (
              <li
                key={d.etykieta}
                className="rounded-2xl border border-line/40 bg-cream/40 p-5"
              >
                <p className="eyebrow">{d.etykieta}</p>
                {d.href ? (
                  <a
                    href={d.href}
                    className="mt-1 block text-lg text-ink transition-colors hover:text-gold-deep"
                  >
                    {d.wartosc}
                  </a>
                ) : (
                  <p className="mt-1 text-lg text-ink">{d.wartosc}</p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Każdy egzemplarz NAWIA powstaje ręcznie w małej pracowni — jeśli
            szukasz czegoś wyjątkowego, napisz, a wspólnie dobierzemy kamień i
            formę.
          </p>
        </div>

        {/* Formularz */}
        <div>
          <h2 className="text-2xl text-ink">Formularz</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
