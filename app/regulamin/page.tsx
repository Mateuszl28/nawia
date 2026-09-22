import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin sklepu internetowego NAWIA — zasady składania zamówień, płatności, dostawy, odstąpienia od umowy i reklamacji.",
  alternates: { canonical: "/regulamin" },
};

const AKTUALIZACJA = "22 września 2026";

const linkCls = "text-gold-deep underline-offset-4 hover:underline";

const Mail = () => (
  <a href="mailto:kontakt@nawiabizuteria.pl" className={linkCls}>
    kontakt@nawiabizuteria.pl
  </a>
);

const Sklep = () => (
  <a href="https://nawiabizuteria.pl/" className={linkCls}>
    https://nawiabizuteria.pl/
  </a>
);

/** Numerowane ustępy paragrafu (1., 2., …). */
function Ustepy({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-decimal space-y-3 pl-5 marker:text-gold-deep">
      {children}
    </ol>
  );
}

/** Wyliczenie literowe w ustępie: a), b), … */
function Litery({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-2 space-y-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-gold-deep">{String.fromCharCode(97 + i)})</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Blok adresowy wewnątrz ustępu. */
function Adres({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 not-italic text-ink">{children}</p>;
}

export default function RegulaminPage() {
  return (
    <LegalShell
      eyebrow="Informacje"
      tytul="Regulamin sklepu"
      wstep="obowiązujący od dnia 22 września 2026 r."
      aktualizacja={AKTUALIZACJA}
    >
      <LegalSection nr={1} tytul="Postanowienia ogólne">
        <Ustepy>
          <li>
            Niniejszy Regulamin określa zasady korzystania ze sklepu
            internetowego NAWIA, dostępnego pod adresem <Sklep />, a także
            zasady zawierania i wykonywania umów sprzedaży Towarów za
            pośrednictwem Sklepu.
          </li>
          <li>
            Sprzedawcą jest:
            <Adres>
              Patrycja Reszka
              <br />
              ul. Nadrzeczna 14/12
              <br />
              58-540 Karpacz
              <br />
              adres e-mail: <Mail />
              <br />
              telefon: 511 168 962
            </Adres>
          </li>
          <li>
            Sprzedawca prowadzi sprzedaż w ramach działalności nierejestrowanej,
            o której mowa w art. 5 ustawy z dnia 6 marca 2018 r. – Prawo
            przedsiębiorców.
          </li>
          <li>Sprzedawca nie posiada numeru NIP ani numeru REGON.</li>
          <li>
            Sprzedawca nie jest wpisany do CEIDG w związku z prowadzoną
            działalnością nierejestrowaną.
          </li>
          <li>
            Sklep prowadzi sprzedaż ręcznie wykonywanej biżuterii z kamieni
            naturalnych.
          </li>
          <li>
            Zamówienia indywidualne lub produkty wykonywane według
            indywidualnych ustaleń z Klientem są obsługiwane poza Sklepem, w
            szczególności za pośrednictwem profilu NAWIA w serwisie Instagram,
            i nie stanowią przedmiotu zamówień składanych za pośrednictwem
            Sklepu, chyba że strony wyraźnie ustalą inaczej.
          </li>
          <li>
            Regulamin jest dostępny bezpłatnie na stronie Sklepu w sposób
            umożliwiający jego pozyskanie, odtworzenie i utrwalenie.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={2} tytul="Definicje">
        <Ustepy>
          <li>
            <strong className="text-ink">Sklep</strong> – sklep internetowy
            NAWIA dostępny pod adresem <Sklep />.
          </li>
          <li>
            <strong className="text-ink">Sprzedawca</strong> – Patrycja
            Reszka, prowadząca sprzedaż w ramach działalności nierejestrowanej.
          </li>
          <li>
            <strong className="text-ink">Klient</strong> – osoba dokonująca
            zakupu Towaru za pośrednictwem Sklepu.
          </li>
          <li>
            <strong className="text-ink">Konsument</strong> – osoba fizyczna
            dokonująca ze Sprzedawcą czynności prawnej niezwiązanej
            bezpośrednio z jej działalnością gospodarczą lub zawodową.
          </li>
          <li>
            <strong className="text-ink">
              Przedsiębiorca na prawach konsumenta
            </strong>{" "}
            – osoba fizyczna zawierająca umowę bezpośrednio związaną z
            prowadzoną przez nią działalnością gospodarczą, jeżeli z treści tej
            umowy wynika, że nie posiada ona dla tej osoby charakteru
            zawodowego.
          </li>
          <li>
            <strong className="text-ink">Towar</strong> – biżuteria oferowana
            w Sklepie.
          </li>
          <li>
            <strong className="text-ink">Zamówienie</strong> – oświadczenie
            Klienta zmierzające do zawarcia umowy sprzedaży Towaru.
          </li>
          <li>
            <strong className="text-ink">Dzień roboczy</strong> – dzień od
            poniedziałku do piątku, z wyłączeniem dni ustawowo wolnych od
            pracy.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={3} tytul="Towary">
        <Ustepy>
          <li>
            Towarami oferowanymi w Sklepie jest ręcznie wykonywana biżuteria z
            kamieni naturalnych.
          </li>
          <li>
            Każdy Towar jest opisany w Sklepie w sposób pozwalający Klientowi
            zapoznać się z jego podstawowymi cechami przed dokonaniem zakupu.
          </li>
          <li>
            Ze względu na naturalne pochodzenie kamieni poszczególne egzemplarze
            mogą różnić się między sobą m.in. kolorem, odcieniem, wzorem,
            strukturą, przejrzystością oraz występowaniem naturalnych inkluzji.
          </li>
          <li>
            Naturalne różnice pomiędzy kamieniami nie stanowią niezgodności
            Towaru z umową, jeżeli mieszczą się w charakterystyce danego rodzaju
            kamienia i są zgodne z informacjami przedstawionymi w Sklepie.
          </li>
          <li>
            Powyższe nie ogranicza ustawowych praw Klienta związanych z
            niezgodnością Towaru z umową.
          </li>
          <li>
            Zdjęcia Towarów mają charakter poglądowy. Sprzedawca dokłada starań,
            aby przedstawiały Towar możliwie wiernie, jednak sposób wyświetlania
            kolorów może zależeć od ustawień urządzenia Klienta.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={4} tytul="Ceny">
        <Ustepy>
          <li>Ceny Towarów są podawane w złotych polskich.</li>
          <li>Cena Towaru jest podana przy danym Towarze.</li>
          <li>
            Przed złożeniem Zamówienia Klient jest informowany o łącznej cenie
            Towaru oraz o kosztach dostawy.
          </li>
          <li>
            W przypadku obniżenia ceny Towaru Sprzedawca przekazuje informacje
            wymagane przez obowiązujące przepisy dotyczące informowania o
            obniżkach cen.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={5} tytul="Składanie i realizacja Zamówień">
        <Ustepy>
          <li>
            Zamówienia można składać za pośrednictwem Sklepu przez całą dobę.
          </li>
          <li>
            W celu złożenia Zamówienia Klient:
            <Litery
              items={[
                "wybiera Towar,",
                "wybiera jego liczbę,",
                "dodaje Towar do koszyka,",
                "podaje dane niezbędne do realizacji Zamówienia,",
                "wybiera sposób dostawy,",
                "wybiera sposób płatności,",
                "zapoznaje się z Regulaminem,",
                "potwierdza złożenie Zamówienia z obowiązkiem zapłaty.",
              ]}
            />
          </li>
          <li>
            Złożenie Zamówienia stanowi ofertę zawarcia umowy sprzedaży Towaru.
          </li>
          <li>
            Po złożeniu Zamówienia Klient otrzymuje wiadomość potwierdzającą
            jego otrzymanie.
          </li>
          <li>
            Umowa sprzedaży zostaje zawarta po przyjęciu Zamówienia przez
            Sprzedawcę.
          </li>
          <li>
            Sprzedawca realizuje Zamówienie po zaksięgowaniu płatności na
            właściwym rachunku lub otrzymaniu prawidłowej płatności BLIK.
          </li>
          <li>
            Standardowy czas przygotowania Zamówienia wynosi od 2 do 5 dni
            roboczych, liczonych od dnia zaksięgowania płatności.
          </li>
          <li>
            Jeżeli z przyczyn niezależnych od Sprzedawcy realizacja Zamówienia w
            tym terminie okaże się niemożliwa, Sprzedawca poinformuje Klienta o
            przewidywanym terminie realizacji.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={6} tytul="Płatności">
        <Ustepy>
          <li>
            W Sklepie dostępne są następujące formy płatności:
            <Litery items={["BLIK,", "przelew bankowy."]} />
          </li>
          <li>Sprzedawca nie korzysta z zewnętrznej bramki płatniczej.</li>
          <li>
            Dane niezbędne do dokonania płatności są przekazywane Klientowi po
            złożeniu Zamówienia.
          </li>
          <li>
            Sprzedawca rozpoczyna realizację Zamówienia po zaksięgowaniu pełnej
            kwoty należnej za Zamówienie.
          </li>
          <li>
            Jeżeli płatność nie zostanie dokonana w terminie wskazanym w
            wiadomości dotyczącej Zamówienia, Sprzedawca może skontaktować się z
            Klientem w celu ustalenia dalszego sposobu realizacji Zamówienia.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={7} tytul="Dostawa i odbiór osobisty">
        <Ustepy>
          <li>
            Sprzedawca oferuje następujące sposoby dostawy:
            <Litery
              items={[
                "dostawę do Paczkomatu InPost,",
                "dostawę na adres za pośrednictwem InPost,",
                "odbiór osobisty.",
              ]}
            />
          </li>
          <li>
            Dostawa przesyłek może być realizowana przy wykorzystaniu usług
            Furgonetka.
          </li>
          <li>
            Dostawa realizowana jest na adres wskazany przez Klienta albo do
            wybranego przez niego Paczkomatu, zgodnie z wybraną formą dostawy.
          </li>
          <li>Koszt dostawy jest wskazywany Klientowi przed złożeniem Zamówienia.</li>
          <li>
            Odbiór osobisty odbywa się w miejscu i terminie uzgodnionym
            indywidualnie ze Sprzedawcą.
          </li>
          <li>
            Sprzedawca wydaje Towar w terminie uzgodnionym z Klientem, nie
            później niż w terminie 30 dni od zawarcia umowy, chyba że strony
            uzgodniły inny termin.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={8} tytul="Prawo odstąpienia od umowy">
        <Ustepy>
          <li>
            Konsument, który zawarł umowę sprzedaży na odległość, ma prawo
            odstąpić od umowy w terminie 14 dni bez podawania przyczyny.
          </li>
          <li>
            Termin do odstąpienia od umowy rozpoczyna się od dnia, w którym
            Konsument lub wskazana przez niego osoba trzecia, inna niż
            przewoźnik, weszła w posiadanie Towaru.
          </li>
          <li>
            Aby skorzystać z prawa odstąpienia, Konsument powinien poinformować
            Sprzedawcę o swojej decyzji przed upływem 14-dniowego terminu.
          </li>
          <li>
            Oświadczenie o odstąpieniu od umowy można przesłać:
            <Litery
              items={[
                <>
                  pocztą na adres: Patrycja Reszka, ul. Nadrzeczna 14/12, 58-540
                  Karpacz
                </>,
                <>
                  pocztą elektroniczną na adres: <Mail />
                </>,
              ]}
            />
          </li>
          <li>
            Konsument może skorzystać z formularza odstąpienia od umowy
            stanowiącego załącznik do niniejszego Regulaminu. Skorzystanie z
            formularza nie jest obowiązkowe.
          </li>
          <li>
            W przypadku odstąpienia od umowy Sprzedawca zwraca Konsumentowi
            wszystkie otrzymane płatności, w tym koszt dostarczenia Towaru, z
            wyjątkiem dodatkowych kosztów wynikających z wybranego przez
            Konsumenta sposobu dostawy innego niż najtańszy zwykły sposób
            dostawy oferowany przez Sprzedawcę.
          </li>
          <li>
            Zwrot płatności następuje przy użyciu takiego samego sposobu
            płatności, jakiego użył Konsument, chyba że Konsument wyraźnie
            zgodzi się na inny sposób.
          </li>
          <li>
            Sprzedawca może wstrzymać się ze zwrotem płatności do chwili
            otrzymania zwracanego Towaru lub dostarczenia przez Konsumenta
            dowodu jego odesłania – w zależności od tego, które zdarzenie
            nastąpi wcześniej.
          </li>
          <li>
            Konsument powinien odesłać Towar niezwłocznie, nie później niż w
            terminie 14 dni od dnia odstąpienia od umowy.
          </li>
          <li>Bezpośredni koszt zwrotu Towaru ponosi Konsument.</li>
          <li>
            Konsument odpowiada za zmniejszenie wartości Towaru wynikające z
            korzystania z niego w sposób wykraczający poza konieczny do
            stwierdzenia charakteru, cech i funkcjonowania Towaru.
          </li>
          <li>
            Prawo odstąpienia od umowy nie przysługuje w przypadkach określonych
            w art. 38 ustawy o prawach konsumenta.
          </li>
          <li>
            W szczególności prawo odstąpienia może nie przysługiwać w przypadku
            Towaru nieprefabrykowanego, wykonanego według specyfikacji
            Konsumenta lub służącego zaspokojeniu jego zindywidualizowanych
            potrzeb.
          </li>
          <li>
            Niniejszy Regulamin dotyczy produktów gotowych oferowanych w
            Sklepie. Zamówienia indywidualne wykonywane na podstawie odrębnych
            ustaleń są rozpatrywane z uwzględnieniem ich indywidualnego
            charakteru oraz obowiązujących przepisów prawa.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={9} tytul="Reklamacje – niezgodność Towaru z umową">
        <Ustepy>
          <li>
            Sprzedawca ponosi wobec Konsumenta odpowiedzialność za zgodność
            Towaru z umową na zasadach określonych w ustawie o prawach
            konsumenta.
          </li>
          <li>
            Jeżeli Towar jest niezgodny z umową, Konsument może skorzystać z
            uprawnień przewidzianych w obowiązujących przepisach, w
            szczególności może żądać naprawy Towaru albo jego wymiany.
          </li>
          <li>
            W przypadkach przewidzianych prawem Konsument może również żądać
            obniżenia ceny albo odstąpić od umowy.
          </li>
          <li>
            Reklamację należy w pierwszej kolejności zgłosić poprzez kontakt
            e-mailowy na adres:
            <Adres>
              <Mail />
            </Adres>
          </li>
          <li>
            W wiadomości reklamacyjnej warto podać:
            <Litery
              items={[
                "imię i nazwisko,",
                "numer Zamówienia,",
                "opis problemu,",
                "oczekiwany sposób rozwiązania sprawy.",
              ]}
            />
          </li>
          <li>
            Sprzedawca może poprosić o przesłanie Towaru w celu rozpatrzenia
            reklamacji, jeżeli będzie to konieczne.
          </li>
          <li>
            Towar w związku z reklamacją należy wysłać na adres:
            <Adres>
              Patrycja Reszka
              <br />
              ul. Nadrzeczna 14/12
              <br />
              58-540 Karpacz
            </Adres>
          </li>
          <li>
            Sprzedawca nie może uzależniać przyjęcia reklamacji od wcześniejszego
            skontaktowania się z nim, jeżeli przepisy prawa nie przewidują
            takiego wymogu. Kontakt e-mailowy wskazany w ust. 4 ma służyć
            sprawnej obsłudze reklamacji.
          </li>
          <li>
            Odpowiedź na reklamację zostanie przekazana Klientowi na papierze
            lub innym trwałym nośniku, w szczególności pocztą elektroniczną.
          </li>
          <li>
            Odpowiedzialność Sprzedawcy z tytułu niezgodności Towaru z umową ma
            charakter ustawowy i nie może zostać wyłączona Regulaminem.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={10} tytul="Dane osobowe">
        <Ustepy>
          <li>Administratorem danych osobowych Klientów jest Patrycja Reszka.</li>
          <li>
            Dane kontaktowe Administratora:
            <Adres>
              Patrycja Reszka
              <br />
              ul. Nadrzeczna 14/12
              <br />
              58-540 Karpacz
              <br />
              e-mail: <Mail />
              <br />
              telefon: 511 168 962
            </Adres>
          </li>
          <li>
            Dane osobowe są przetwarzane w szczególności w celu:
            <Litery
              items={[
                "realizacji Zamówień,",
                "zawierania i wykonywania umów,",
                "obsługi płatności,",
                "realizacji dostaw,",
                "rozpatrywania reklamacji i zwrotów,",
                "realizacji obowiązków prawnych.",
              ]}
            />
          </li>
          <li>
            Szczegółowe informacje dotyczące przetwarzania danych osobowych
            znajdują się w{" "}
            <Link href="/polityka-prywatnosci" className={linkCls}>
              Polityce Prywatności
            </Link>
            .
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={11} tytul="Opinie i treści Klientów">
        <Ustepy>
          <li>
            Jeżeli Sklep umożliwia publikowanie opinii lub innych treści przez
            Klientów, mogą oni publikować wyłącznie treści zgodne z prawem.
          </li>
          <li>
            Zabronione jest publikowanie treści naruszających prawa osób
            trzecich, zawierających bezprawnie dane osobowe innych osób lub
            wprowadzających w błąd.
          </li>
          <li>
            Sprzedawca może podejmować działania wobec treści naruszających
            prawo na zasadach wynikających z obowiązujących przepisów.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={12} tytul="Pliki cookies">
        <Ustepy>
          <li>
            Sklep wykorzystuje pliki cookies oraz podobne technologie w zakresie
            niezbędnym do prawidłowego działania strony internetowej.
          </li>
          <li>
            Cookies mogą być wykorzystywane w szczególności do:
            <Litery
              items={[
                "utrzymywania zawartości koszyka,",
                "zapamiętywania ustawień użytkownika,",
                "zapewnienia prawidłowego działania Sklepu,",
                "zapewnienia bezpieczeństwa,",
                "zapamiętywania wybranych funkcji Sklepu.",
              ]}
            />
          </li>
          <li>
            Szczegółowe informacje dotyczące plików cookies znajdują się w
            Polityce Cookies.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={13} tytul="Pozasądowe rozwiązywanie sporów">
        <Ustepy>
          <li>
            Konsument może skorzystać z dostępnych pozasądowych sposobów
            rozwiązywania sporów konsumenckich.
          </li>
          <li>
            W szczególności może zwrócić się o pomoc do właściwego miejscowo
            rzecznika konsumentów lub Inspekcji Handlowej.
          </li>
          <li>
            Informacje o dostępnych formach pomocy konsumentom można znaleźć na
            stronach Urzędu Ochrony Konkurencji i Konsumentów.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={14} tytul="Zmiany Regulaminu">
        <Ustepy>
          <li>
            Sprzedawca może zmienić Regulamin w przypadku:
            <Litery
              items={[
                "zmiany przepisów prawa,",
                "zmiany sposobów dostawy lub płatności,",
                "zmiany funkcjonalności Sklepu,",
                "konieczności poprawienia błędów lub niejasności,",
                "innych ważnych przyczyn związanych z funkcjonowaniem Sklepu.",
              ]}
            />
          </li>
          <li>
            Zmiany Regulaminu nie wpływają na prawa Klientów wynikające z umów
            zawartych przed wejściem zmian w życie.
          </li>
        </Ustepy>
      </LegalSection>

      <LegalSection nr={15} tytul="Postanowienia końcowe">
        <Ustepy>
          <li>
            W sprawach nieuregulowanych Regulaminem zastosowanie mają przepisy
            prawa polskiego, w szczególności Kodeksu cywilnego oraz ustawy o
            prawach konsumenta.
          </li>
          <li>
            Postanowienia Regulaminu nie wyłączają ani nie ograniczają praw
            Konsumenta wynikających z bezwzględnie obowiązujących przepisów
            prawa.
          </li>
          <li>Regulamin wchodzi w życie z dniem 22 września 2026 r.</li>
        </Ustepy>
      </LegalSection>
    </LegalShell>
  );
}
