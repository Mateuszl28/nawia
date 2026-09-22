import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/legal";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności sklepu NAWIA — zasady przetwarzania i ochrony danych osobowych zgodnie z RODO.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

const AKTUALIZACJA = "22 września 2026";

const linkCls = "text-gold-deep underline-offset-4 hover:underline";

export default function PolitykaPrywatnosciPage() {
  return (
    <LegalShell
      eyebrow="Informacje"
      tytul="Polityka prywatności"
      wstep="NAWIA – nawiabizuteria.pl, obowiązująca od dnia 22 września 2026 r."
      aktualizacja={AKTUALIZACJA}
    >
      <LegalSection nr={1} tytul="Administrator danych">
        <p>Administratorem danych osobowych użytkowników Sklepu jest:</p>
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

      <LegalSection nr={2} tytul="Jakie dane mogą być przetwarzane">
        <p>
          W związku z korzystaniem ze Sklepu lub składaniem Zamówienia mogą być
          przetwarzane w szczególności:
        </p>
        <LegalList
          items={[
            "imię i nazwisko,",
            "adres dostawy,",
            "adres e-mail,",
            "numer telefonu,",
            "informacje dotyczące Zamówienia,",
            "informacje dotyczące płatności,",
            "informacje niezbędne do obsługi reklamacji lub zwrotu,",
            "informacje techniczne dotyczące korzystania ze strony internetowej.",
          ]}
        />
        <p>Administrator przetwarza wyłącznie dane niezbędne do określonego celu.</p>
      </LegalSection>

      <LegalSection nr={3} tytul="Cele przetwarzania danych">
        <p>Dane osobowe mogą być przetwarzane w celu:</p>
        <ol className="list-decimal space-y-2 pl-5 marker:text-gold-deep">
          <li>przyjęcia i realizacji Zamówienia,</li>
          <li>zawarcia i wykonania umowy sprzedaży,</li>
          <li>kontaktu z Klientem,</li>
          <li>realizacji dostawy,</li>
          <li>obsługi płatności,</li>
          <li>obsługi zwrotów,</li>
          <li>rozpatrywania reklamacji,</li>
          <li>realizacji obowiązków wynikających z przepisów prawa,</li>
          <li>ustalenia, dochodzenia lub obrony przed roszczeniami,</li>
          <li>zapewnienia prawidłowego działania Sklepu.</li>
        </ol>
      </LegalSection>

      <LegalSection nr={4} tytul="Podstawy prawne przetwarzania">
        <p>
          Dane osobowe są przetwarzane na podstawie odpowiednich przepisów RODO,
          w szczególności:
        </p>
        <LegalList
          items={[
            "art. 6 ust. 1 lit. b RODO – gdy przetwarzanie jest niezbędne do zawarcia lub wykonania umowy,",
            "art. 6 ust. 1 lit. c RODO – gdy przetwarzanie jest niezbędne do wykonania obowiązku prawnego,",
            "art. 6 ust. 1 lit. f RODO – gdy przetwarzanie jest niezbędne do realizacji prawnie uzasadnionego interesu Administratora,",
            "art. 6 ust. 1 lit. a RODO – w przypadku udzielenia zgody, jeżeli zgoda jest podstawą danego przetwarzania.",
          ]}
        />
      </LegalSection>

      <LegalSection nr={5} tytul="Odbiorcy danych">
        <p>
          Dane mogą być przekazywane podmiotom, które pomagają Administratorowi
          w prowadzeniu Sklepu, w zakresie niezbędnym do wykonania określonego
          celu.
        </p>
        <p>Może to dotyczyć w szczególności:</p>
        <LegalList
          items={[
            "operatorów pocztowych i firm kurierskich,",
            "operatorów usług logistycznych, w tym podmiotów obsługujących wysyłkę za pośrednictwem Furgonetka,",
            "dostawców usług hostingowych i technicznych,",
            "dostawców usług księgowych lub prawnych, jeżeli jest to niezbędne,",
            "banków i dostawców usług płatniczych w zakresie niezbędnym do obsługi płatności.",
          ]}
        />
        <p>Dane nie są sprzedawane innym podmiotom.</p>
      </LegalSection>

      <LegalSection nr={6} tytul="Płatności">
        <p>W Sklepie dostępne są płatności BLIK oraz przelew bankowy.</p>
        <p>Sprzedawca nie korzysta z zewnętrznej bramki płatniczej.</p>
        <p>
          Dane dotyczące płatności są przetwarzane w zakresie niezbędnym do
          potwierdzenia zapłaty i realizacji Zamówienia.
        </p>
      </LegalSection>

      <LegalSection nr={7} tytul="Dostawa">
        <p>
          W celu dostarczenia Zamówienia dane niezbędne do wysyłki mogą zostać
          przekazane operatorowi wybranej przez Klienta formy dostawy.
        </p>
        <p>
          W przypadku korzystania z usług InPost lub pośrednictwa Furgonetka
          dane mogą zostać przekazane podmiotom uczestniczącym w realizacji
          dostawy.
        </p>
      </LegalSection>

      <LegalSection nr={8} tytul="Okres przechowywania danych">
        <p>
          Dane są przechowywane przez okres niezbędny do realizacji celu, dla
          którego zostały zebrane.
        </p>
        <p>
          Dane dotyczące Zamówień mogą być przechowywane również przez okres
          wymagany przepisami prawa, w szczególności przepisami podatkowymi i
          dotyczącymi rachunkowości.
        </p>
        <p>
          Dane mogą być również przechowywane przez okres niezbędny do
          ustalenia, dochodzenia lub obrony przed roszczeniami.
        </p>
      </LegalSection>

      <LegalSection nr={9} tytul="Prawa osoby, której dane dotyczą">
        <p>
          Osobie, której dane dotyczą, przysługuje – na zasadach określonych w
          RODO – prawo do:
        </p>
        <LegalList
          items={[
            "dostępu do swoich danych,",
            "sprostowania danych,",
            "usunięcia danych,",
            "ograniczenia przetwarzania,",
            "przenoszenia danych,",
            "wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,",
            "cofnięcia zgody, jeżeli przetwarzanie odbywa się na podstawie zgody.",
          ]}
        />
        <p>
          Cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania
          dokonanego przed jej cofnięciem.
        </p>
      </LegalSection>

      <LegalSection nr={10} tytul="Skarga do organu nadzorczego">
        <p>
          Osoba, której dane dotyczą, ma prawo wniesienia skargi do Prezesa
          Urzędu Ochrony Danych Osobowych, jeżeli uzna, że jej dane są
          przetwarzane z naruszeniem przepisów o ochronie danych osobowych.
        </p>
      </LegalSection>

      <LegalSection nr={11} tytul="Dobrowolność podania danych">
        <p>
          Podanie danych jest dobrowolne, jednak w zakresie niezbędnym do
          realizacji Zamówienia ich podanie jest konieczne do zawarcia i
          wykonania umowy.
        </p>
        <p>
          Brak podania wymaganych danych może uniemożliwić realizację
          Zamówienia.
        </p>
      </LegalSection>

      <LegalSection nr={12} tytul="Zautomatyzowane podejmowanie decyzji">
        <p>
          Dane Klientów nie są wykorzystywane do podejmowania decyzji
          wywołujących wobec nich skutki prawne lub w podobny sposób istotnie
          wpływających na ich sytuację wyłącznie w sposób zautomatyzowany.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
