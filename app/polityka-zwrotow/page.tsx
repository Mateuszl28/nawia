import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/legal";

export const metadata: Metadata = {
  title: "Polityka zwrotów i reklamacji",
  description:
    "Polityka zwrotów i reklamacji sklepu NAWIA — 14 dni na odstąpienie od umowy, zasady reklamacji i formularz odstąpienia.",
  alternates: { canonical: "/polityka-zwrotow" },
};

const AKTUALIZACJA = "22 września 2026";

const linkCls = "text-gold-deep underline-offset-4 hover:underline";

const Mail = () => (
  <a href="mailto:kontakt@nawiabizuteria.pl" className={linkCls}>
    kontakt@nawiabizuteria.pl
  </a>
);

const AdresSprzedawcy = () => (
  <p className="text-ink">
    Patrycja Reszka
    <br />
    ul. Nadrzeczna 14/12
    <br />
    58-540 Karpacz
  </p>
);

/** Śródtytuł oddzielający części dokumentu (zwroty / reklamacje / formularz). */
function Czesc({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 pt-4 text-center text-sm uppercase tracking-[0.25em] text-gold-deep"
    >
      {children}
    </h2>
  );
}

/** Pole formularza do wypełnienia odręcznie. */
function Pole({ etykieta }: { etykieta: string }) {
  return (
    <div>
      <p>{etykieta}</p>
      <div className="mt-6 border-b border-dotted border-muted/60" />
    </div>
  );
}

export default function PolitykaZwrotowPage() {
  return (
    <LegalShell
      eyebrow="Informacje"
      tytul="Polityka zwrotów i reklamacji"
      aktualizacja={AKTUALIZACJA}
    >
      <Czesc>Zwroty</Czesc>

      <LegalSection nr={1} tytul="Zwrot zakupionego Towaru">
        <p>
          Jeżeli jesteś Konsumentem lub Przedsiębiorcą na prawach konsumenta i
          dokonałeś zakupu przez sklep internetowy NAWIA, masz prawo odstąpić od
          umowy zawartej na odległość w terminie 14 dni bez podawania
          przyczyny.
        </p>
        <p>Termin 14 dni rozpoczyna się od dnia otrzymania Towaru.</p>
      </LegalSection>

      <LegalSection nr={2} tytul="Jak dokonać zwrotu">
        <p>
          Aby odstąpić od umowy, należy poinformować Sprzedawcę o swojej
          decyzji przed upływem 14 dni.
        </p>
        <p>Można to zrobić:</p>
        <p>
          e-mail: <Mail />
        </p>
        <p>lub pisemnie na adres:</p>
        <AdresSprzedawcy />
        <p>
          Do odstąpienia można wykorzystać{" "}
          <a href="#formularz" className={linkCls}>
            formularz znajdujący się na końcu niniejszego dokumentu
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection nr={3} tytul="Odesłanie Towaru">
        <p>
          Po złożeniu oświadczenia o odstąpieniu od umowy Towar należy odesłać
          na adres:
        </p>
        <AdresSprzedawcy />
        <p>
          Towar należy odesłać nie później niż w terminie 14 dni od dnia
          odstąpienia od umowy.
        </p>
        <p>Bezpośredni koszt odesłania Towaru ponosi Klient.</p>
      </LegalSection>

      <LegalSection nr={4} tytul="Zwrot pieniędzy">
        <p>
          W przypadku skutecznego odstąpienia od umowy Sprzedawca zwraca
          Klientowi otrzymane płatności, w tym koszt najtańszej zwykłej dostawy
          dostępnej w Sklepie.
        </p>
        <p>
          Jeżeli Klient wybrał droższy sposób dostawy, Sprzedawca nie ma
          obowiązku zwracania różnicy pomiędzy wybranym przez Klienta droższym
          sposobem dostawy a najtańszą zwykłą formą dostawy.
        </p>
        <p>
          Zwrot pieniędzy następuje przy użyciu takiego samego sposobu
          płatności, jakiego użył Klient, chyba że Klient zgodzi się na inny
          sposób.
        </p>
        <p>
          Sprzedawca może wstrzymać się ze zwrotem pieniędzy do czasu
          otrzymania zwracanego Towaru lub dostarczenia dowodu jego odesłania.
        </p>
      </LegalSection>

      <LegalSection nr={5} tytul="Stan zwracanego Towaru">
        <p>
          Klient może zapoznać się z Towarem w zakresie koniecznym do
          stwierdzenia jego charakteru, cech i funkcjonowania.
        </p>
        <p>
          Jeżeli Klient korzysta z Towaru w sposób wykraczający poza taki
          zakres, może odpowiadać za zmniejszenie wartości Towaru.
        </p>
      </LegalSection>

      <LegalSection nr={6} tytul="Kiedy zwrot może nie przysługiwać">
        <p>
          Prawo odstąpienia od umowy nie przysługuje w przypadkach określonych w
          art. 38 ustawy o prawach konsumenta.
        </p>
        <p>
          W szczególności dotyczy to Towaru nieprefabrykowanego, wykonanego
          według specyfikacji Konsumenta lub służącego zaspokojeniu jego
          zindywidualizowanych potrzeb.
        </p>
        <p>W Sklepie sprzedawane są przede wszystkim gotowe produkty.</p>
        <p>
          Zamówienia indywidualne wykonywane na podstawie osobnych ustaleń, w
          szczególności za pośrednictwem Instagrama, mogą podlegać wyłączeniu
          prawa odstąpienia, jeżeli spełniają ustawowe przesłanki takiego
          wyłączenia.
        </p>
      </LegalSection>

      <Czesc>Reklamacje</Czesc>

      <LegalSection nr={7} tytul="Niezgodność Towaru z umową">
        <p>
          Jeżeli otrzymany Towar jest niezgodny z umową, Konsument może
          skorzystać z uprawnień przewidzianych w ustawie o prawach konsumenta.
        </p>
        <p>W pierwszej kolejności Konsument może żądać:</p>
        <LegalList items={["naprawy Towaru albo", "wymiany Towaru."]} />
        <p>W przypadkach określonych w przepisach Konsument może również żądać:</p>
        <LegalList items={["obniżenia ceny albo", "odstąpienia od umowy."]} />
      </LegalSection>

      <LegalSection nr={8} tytul="Zgłoszenie reklamacji">
        <p>
          W celu sprawnego rozpatrzenia reklamacji prosimy w pierwszej
          kolejności o kontakt pod adresem:
        </p>
        <p>
          <Mail />
        </p>
        <p>W wiadomości warto podać:</p>
        <LegalList
          items={[
            "imię i nazwisko,",
            "numer Zamówienia,",
            "opis problemu,",
            "zdjęcia, jeżeli pomagają w przedstawieniu problemu,",
            "oczekiwany sposób rozwiązania sprawy.",
          ]}
        />
        <p>
          Brak któregokolwiek z powyższych elementów nie powoduje automatycznie
          utraty uprawnień reklamacyjnych.
        </p>
      </LegalSection>

      <LegalSection nr={9} tytul="Adres do reklamacji">
        <p>
          Jeżeli dla rozpatrzenia reklamacji konieczne będzie przesłanie
          Towaru, należy wysłać go na adres:
        </p>
        <AdresSprzedawcy />
      </LegalSection>

      <LegalSection nr={10} tytul="Naturalne właściwości kamieni">
        <p>
          Kamienie naturalne mogą posiadać naturalne różnice w kolorze,
          strukturze, wzorze, przejrzystości i inkluzjach.
        </p>
        <p>
          Takie cechy nie stanowią niezgodności Towaru z umową, jeżeli
          odpowiadają właściwościom danego rodzaju kamienia i opisowi Towaru.
        </p>
        <p>
          Nie dotyczy to wad, uszkodzeń lub innych niezgodności wykraczających
          poza naturalne właściwości materiału.
        </p>
      </LegalSection>

      <LegalSection nr={11} tytul="Rozpatrzenie reklamacji">
        <p>
          Sprzedawca rozpatruje reklamację w terminach wynikających z
          obowiązujących przepisów prawa.
        </p>
        <p>
          O sposobie rozpatrzenia reklamacji Klient zostanie poinformowany na
          trwałym nośniku, w szczególności pocztą elektroniczną.
        </p>
      </LegalSection>

      <Czesc id="formularz">Formularz odstąpienia od umowy</Czesc>

      <LegalSection tytul="Formularz odstąpienia od umowy">
        <p className="italic">
          (formularz należy wypełnić i odesłać tylko w przypadku chęci
          odstąpienia od umowy)
        </p>
        <p>Adresat:</p>
        <p className="text-ink">
          Patrycja Reszka
          <br />
          ul. Nadrzeczna 14/12
          <br />
          58-540 Karpacz
          <br />
          e-mail: <Mail />
          <br />
          telefon: 511 168 962
        </p>
        <div className="space-y-5 pt-2">
          <Pole etykieta="Niniejszym informuję o moim odstąpieniu od umowy sprzedaży następującego Towaru:" />
          <Pole etykieta="Numer Zamówienia:" />
          <Pole etykieta="Data zawarcia umowy:" />
          <Pole etykieta="Data otrzymania Towaru:" />
          <Pole etykieta="Imię i nazwisko:" />
          <Pole etykieta="Adres:" />
          <Pole etykieta="Numer rachunku bankowego do zwrotu środków, jeżeli zwrot ma nastąpić na rachunek inny niż ten, z którego dokonano płatności:" />
          <Pole etykieta="Data:" />
          <Pole etykieta="Podpis Konsumenta (tylko jeżeli formularz jest składany w wersji papierowej)" />
        </div>
      </LegalSection>
    </LegalShell>
  );
}
