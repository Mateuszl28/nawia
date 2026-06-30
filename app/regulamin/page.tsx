import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection, LegalList } from "@/components/legal";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin sklepu internetowego NAWIA — zasady składania zamówień, płatności, dostawy oraz prawa konsumenta.",
  alternates: { canonical: "/regulamin" },
};

const AKTUALIZACJA = "25 czerwca 2026";

export default function RegulaminPage() {
  return (
    <LegalShell
      eyebrow="Informacje"
      tytul="Regulamin sklepu"
      wstep="Niniejszy regulamin określa zasady korzystania ze sklepu internetowego NAWIA oraz składania i realizacji zamówień."
      aktualizacja={AKTUALIZACJA}
    >
      <LegalSection nr={1} tytul="Postanowienia ogólne">
        <p>
          Sklep internetowy NAWIA (dalej „Sklep") prowadzi sprzedaż ręcznie
          tworzonej biżuterii za pośrednictwem strony internetowej. Złożenie
          zamówienia oznacza akceptację niniejszego regulaminu.
        </p>
      </LegalSection>

      <LegalSection nr={2} tytul="Definicje">
        <LegalList
          items={[
            "Klient — osoba fizyczna, prawna lub jednostka organizacyjna składająca zamówienie.",
            "Konsument — Klient będący osobą fizyczną dokonującą zakupu niezwiązanego z działalnością gospodarczą.",
            "Produkt — biżuteria prezentowana w Sklepie i objęta umową sprzedaży.",
            "Zamówienie — oświadczenie woli Klienta zmierzające do zawarcia umowy sprzedaży.",
          ]}
        />
      </LegalSection>

      <LegalSection nr={3} tytul="Składanie zamówień">
        <p>
          Zamówienia można składać przez całą dobę, 7 dni w tygodniu, dodając
          produkty do koszyka i wypełniając formularz zamówienia. Ceny
          produktów podane są w złotych polskich i zawierają podatek VAT.
          Wiążąca jest cena obowiązująca w chwili złożenia zamówienia.
        </p>
        <p>
          Ze względu na ręczny charakter wyrobów poszczególne egzemplarze mogą
          nieznacznie różnić się od zdjęć — jest to cecha produktu, a nie wada.
        </p>
      </LegalSection>

      <LegalSection nr={4} tytul="Płatności">
        <p>Udostępniamy następujące formy płatności:</p>
        <LegalList
          items={[
            "szybki przelew online / BLIK,",
            "przelew tradycyjny na rachunek bankowy Sklepu,",
            "płatność za pobraniem (jeśli dostępna dla wybranej metody dostawy).",
          ]}
        />
        <p>
          Realizację zamówienia rozpoczynamy po zaksięgowaniu wpłaty, a w
          przypadku płatności za pobraniem — po potwierdzeniu zamówienia.
        </p>
      </LegalSection>

      <LegalSection nr={5} tytul="Dostawa">
        <p>
          Zamówienia realizujemy zwykle w ciągu 2–5 dni roboczych. Produkty
          wysyłamy za pośrednictwem firm kurierskich oraz operatorów
          pocztowych. Koszt i czas dostawy prezentowane są w podsumowaniu
          zamówienia przed jego złożeniem.
        </p>
      </LegalSection>

      <LegalSection nr={6} tytul="Odstąpienie od umowy">
        <p>
          Konsument może odstąpić od umowy w terminie 14 dni bez podania
          przyczyny. Szczegółowe zasady, terminy i wzór formularza opisaliśmy w{" "}
          <Link
            href="/polityka-zwrotow"
            className="text-gold-deep underline-offset-4 hover:underline"
          >
            Polityce zwrotów
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection nr={7} tytul="Reklamacje">
        <p>
          Wszystkie produkty objęte są odpowiedzialnością Sklepu za zgodność
          towaru z umową. Reklamację można złożyć mailowo na adres{" "}
          <a
            href="mailto:kontakt@nawiabizuteria.pl"
            className="text-gold-deep underline-offset-4 hover:underline"
          >
            kontakt@nawiabizuteria.pl
          </a>
          . Reklamacje rozpatrujemy w terminie do 14 dni od ich otrzymania.
        </p>
      </LegalSection>

      <LegalSection nr={8} tytul="Dane osobowe">
        <p>
          Zasady przetwarzania danych osobowych Klientów opisuje{" "}
          <Link
            href="/polityka-prywatnosci"
            className="text-gold-deep underline-offset-4 hover:underline"
          >
            Polityka prywatności
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection nr={9} tytul="Postanowienia końcowe">
        <p>
          W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają
          przepisy prawa polskiego, w szczególności Kodeksu cywilnego oraz
          ustawy o prawach konsumenta. Sklep zastrzega sobie prawo do zmiany
          regulaminu; do zamówień złożonych przed zmianą stosuje się regulamin
          obowiązujący w chwili ich złożenia.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
