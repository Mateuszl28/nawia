import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/legal";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności sklepu NAWIA — zasady przetwarzania i ochrony danych osobowych zgodnie z RODO.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

const AKTUALIZACJA = "25 czerwca 2026";

export default function PolitykaPrywatnosciPage() {
  return (
    <LegalShell
      eyebrow="Informacje"
      tytul="Polityka prywatności"
      wstep="Dbamy o Twoje dane. Poniżej wyjaśniamy, jakie informacje zbieramy, w jakim celu i jakie masz prawa."
      aktualizacja={AKTUALIZACJA}
    >
      <LegalSection nr={1} tytul="Administrator danych">
        <p>
          Administratorem Twoich danych osobowych jest NAWIA (dalej „Sklep").
          We wszystkich sprawach dotyczących ochrony danych możesz
          skontaktować się z nami pod adresem{" "}
          <a
            href="mailto:kontakt@nawia.pl"
            className="text-gold-deep underline-offset-4 hover:underline"
          >
            kontakt@nawia.pl
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection nr={2} tytul="Jakie dane zbieramy">
        <p>W zależności od sposobu korzystania ze sklepu możemy przetwarzać:</p>
        <LegalList
          items={[
            "dane podane przy składaniu zamówienia: imię i nazwisko, adres dostawy, adres e-mail, numer telefonu,",
            "dane niezbędne do realizacji płatności i wystawienia dowodu zakupu,",
            "dane techniczne: adres IP, typ urządzenia i przeglądarki, informacje z plików cookie,",
            "treść korespondencji, jeśli kontaktujesz się z nami mailowo.",
          ]}
        />
      </LegalSection>

      <LegalSection nr={3} tytul="Cele i podstawy przetwarzania">
        <p>Twoje dane przetwarzamy w celu:</p>
        <LegalList
          items={[
            "realizacji i obsługi zamówienia — art. 6 ust. 1 lit. b RODO (wykonanie umowy),",
            "wypełnienia obowiązków podatkowych i księgowych — art. 6 ust. 1 lit. c RODO,",
            "obsługi reklamacji i zwrotów — art. 6 ust. 1 lit. b i c RODO,",
            "marketingu własnych produktów oraz analityki — art. 6 ust. 1 lit. f RODO (uzasadniony interes).",
          ]}
        />
      </LegalSection>

      <LegalSection nr={4} tytul="Odbiorcy danych">
        <p>
          Dane możemy przekazywać podmiotom, które wspierają nas w realizacji
          zamówień, w szczególności: firmom kurierskim i operatorom pocztowym,
          dostawcom systemów płatności, biuru rachunkowemu oraz dostawcom usług
          IT i hostingu. Każdy z tych podmiotów przetwarza dane wyłącznie w
          zakresie niezbędnym do świadczenia usługi.
        </p>
      </LegalSection>

      <LegalSection nr={5} tytul="Okres przechowywania">
        <p>
          Dane związane z zamówieniami przechowujemy przez okres wymagany
          przepisami prawa (m.in. podatkowymi), a dane przetwarzane na
          podstawie uzasadnionego interesu — do czasu wniesienia skutecznego
          sprzeciwu lub ustania celu przetwarzania.
        </p>
      </LegalSection>

      <LegalSection nr={6} tytul="Twoje prawa">
        <p>W każdej chwili masz prawo do:</p>
        <LegalList
          items={[
            "dostępu do swoich danych oraz otrzymania ich kopii,",
            "sprostowania, usunięcia lub ograniczenia przetwarzania,",
            "przenoszenia danych,",
            "wniesienia sprzeciwu wobec przetwarzania,",
            "wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.",
          ]}
        />
      </LegalSection>

      <LegalSection nr={7} tytul="Pliki cookie">
        <p>
          Sklep korzysta z plików cookie niezbędnych do działania koszyka i
          listy ulubionych oraz, za Twoją zgodą, z plików analitycznych. W
          każdej chwili możesz zarządzać plikami cookie w ustawieniach swojej
          przeglądarki.
        </p>
      </LegalSection>

      <LegalSection nr={8} tytul="Zmiany polityki">
        <p>
          Zastrzegamy sobie prawo do aktualizacji niniejszej polityki.
          Aktualna wersja jest zawsze dostępna na tej stronie wraz z datą
          ostatniej aktualizacji.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
