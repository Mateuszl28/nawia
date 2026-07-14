import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection, LegalList } from "@/components/legal";

export const metadata: Metadata = {
  title: "Polityka zwrotów",
  description:
    "Polityka zwrotów i odstąpienia od umowy w sklepie NAWIA — 14 dni na zwrot, zasady i formularz odstąpienia.",
  alternates: { canonical: "/polityka-zwrotow" },
};

const AKTUALIZACJA = "25 czerwca 2026";

export default function PolitykaZwrotowPage() {
  return (
    <LegalShell
      eyebrow="Informacje"
      tytul="Polityka zwrotów"
      wstep="Chcemy, byś była w pełni zadowolona z zakupu. Jeśli to nie ta ozdoba — masz 14 dni na zwrot."
      aktualizacja={AKTUALIZACJA}
    >
      <LegalSection nr={1} tytul="Prawo do odstąpienia od umowy">
        <p>
          Jako Konsument masz prawo odstąpić od umowy w terminie 14 dni od dnia
          otrzymania zamówienia, bez podania przyczyny i bez ponoszenia kosztów
          innych niż wskazane poniżej.
        </p>
      </LegalSection>

      <LegalSection nr={2} tytul="Jak zgłosić zwrot">
        <p>Aby dokonać zwrotu:</p>
        <LegalList
          items={[
            <>
              Poinformuj nas o decyzji, pisząc na adres{" "}
              <a
                href="mailto:kontakt@nawiabizuteria.pl"
                className="text-gold-deep underline-offset-4 hover:underline"
              >
                kontakt@nawiabizuteria.pl
              </a>{" "}
              — wystarczy jednoznaczne oświadczenie o odstąpieniu od umowy.
            </>,
            "Zapakuj produkt w sposób chroniący go przed uszkodzeniem.",
            "Odeślij produkt na wskazany przez nas adres w ciągu 14 dni od zgłoszenia.",
            "Zwrot towaru następuje na koszt kupującego — bezpośredni koszt odesłania produktu ponosisz Ty.",
          ]}
        />
      </LegalSection>

      <LegalSection nr={3} tytul="Stan zwracanego produktu">
        <p>
          Zwracany produkt nie może nosić śladów użytkowania wykraczających
          poza sprawdzenie jego charakteru, cech i funkcjonowania. W miarę
          możliwości prosimy o dołączenie dowodu zakupu oraz oryginalnego
          opakowania — ułatwia to obsługę zwrotu.
        </p>
      </LegalSection>

      <LegalSection nr={4} tytul="Zwrot płatności">
        <p>
          Zwrotu należności dokonujemy niezwłocznie, nie później niż w terminie
          14 dni od otrzymania oświadczenia o odstąpieniu. Możemy wstrzymać się
          ze zwrotem do chwili otrzymania produktu lub dowodu jego odesłania.
        </p>
        <LegalList
          items={[
            "Zwracamy cenę produktu oraz koszt najtańszej oferowanej dostawy.",
            "Płatność zwracamy tą samą metodą, której użyłaś przy zakupie.",
            "Bezpośredni koszt odesłania produktu ponosi Konsument.",
          ]}
        />
      </LegalSection>

      <LegalSection nr={5} tytul="Wyłączenia">
        <p>
          Prawo odstąpienia nie przysługuje m.in. w odniesieniu do produktów
          wykonanych na indywidualne zamówienie, wyraźnie spersonalizowanych
          (np. grawer), zgodnie z art. 38 ustawy o prawach konsumenta.
        </p>
      </LegalSection>

      <LegalSection nr={6} tytul="Reklamacje i uszkodzenia">
        <p>
          Jeśli produkt dotarł uszkodzony lub niezgodny z zamówieniem, nie jest
          to zwrot, lecz reklamacja — opisaliśmy ją w{" "}
          <Link
            href="/regulamin"
            className="text-gold-deep underline-offset-4 hover:underline"
          >
            Regulaminie
          </Link>
          . Skontaktuj się z nami, a my naprawimy, wymienimy produkt lub
          zwrócimy należność.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
