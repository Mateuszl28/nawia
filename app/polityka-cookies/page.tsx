import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/legal";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description:
    "Polityka cookies sklepu NAWIA — jakie pliki cookies wykorzystujemy i jak nimi zarządzać.",
  alternates: { canonical: "/polityka-cookies" },
};

const AKTUALIZACJA = "22 września 2026";

const linkCls = "text-gold-deep underline-offset-4 hover:underline";

export default function PolitykaCookiesPage() {
  return (
    <LegalShell
      eyebrow="Informacje"
      tytul="Polityka cookies"
      aktualizacja={AKTUALIZACJA}
    >
      <LegalSection nr={1} tytul="Czym są pliki cookies">
        <p>
          Pliki cookies to niewielkie pliki zapisywane na urządzeniu
          użytkownika podczas korzystania ze strony internetowej.
        </p>
      </LegalSection>

      <LegalSection nr={2} tytul="Do czego NAWIA wykorzystuje cookies">
        <p>
          Sklep wykorzystuje cookies przede wszystkim w celu prawidłowego
          działania strony oraz jej podstawowych funkcji.
        </p>
        <p>W szczególności cookies mogą służyć do:</p>
        <LegalList
          items={[
            "prawidłowego działania koszyka,",
            "zapamiętywania wybranych ustawień,",
            "obsługi listy ulubionych produktów,",
            "utrzymania sesji użytkownika,",
            "zapewnienia bezpieczeństwa,",
            "prawidłowego działania funkcji Sklepu.",
          ]}
        />
      </LegalSection>

      <LegalSection nr={3} tytul="Cookies niezbędne">
        <p>
          Cookies niezbędne są wykorzystywane do zapewnienia prawidłowego
          funkcjonowania Sklepu.
        </p>
        <p>
          Ich wyłączenie może spowodować, że niektóre funkcje Sklepu, w
          szczególności koszyk lub inne funkcje wymagające zapamiętania sesji,
          nie będą działały prawidłowo.
        </p>
      </LegalSection>

      <LegalSection nr={4} tytul="Cookies analityczne i marketingowe">
        <p>
          Na dzień wejścia w życie niniejszej Polityki Sprzedawca nie deklaruje
          wykorzystywania w Sklepie dodatkowych narzędzi analitycznych lub
          marketingowych, takich jak Google Analytics czy Meta Pixel, chyba że
          zostaną one później wdrożone.
        </p>
        <p>
          Jeżeli w przyszłości Sklep zostanie wyposażony w dodatkowe narzędzia
          wykorzystujące cookies lub podobne technologie, Polityka Cookies
          zostanie odpowiednio zaktualizowana, a w przypadkach wymaganych
          prawem użytkownik otrzyma możliwość dokonania odpowiedniego wyboru.
        </p>
      </LegalSection>

      <LegalSection nr={5} tytul="Zarządzanie cookies">
        <p>
          Użytkownik może zmienić ustawienia dotyczące cookies w swojej
          przeglądarce internetowej.
        </p>
        <p>
          Ograniczenie lub wyłączenie cookies może wpłynąć na prawidłowe
          działanie niektórych funkcji Sklepu.
        </p>
      </LegalSection>

      <LegalSection nr={6} tytul="Kontakt">
        <p>
          W sprawach dotyczących prywatności lub cookies można skontaktować się
          z Administratorem:
        </p>
        <p className="text-ink">
          Patrycja Reszka
          <br />
          ul. Nadrzeczna 14/12
          <br />
          58-540 Karpacz
          <br />
          e-mail:{" "}
          <a href="mailto:kontakt@nawiabizuteria.pl" className={linkCls}>
            kontakt@nawiabizuteria.pl
          </a>
          <br />
          telefon: 511 168 962
        </p>
      </LegalSection>
    </LegalShell>
  );
}
