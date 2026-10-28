import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { KATEGORIE, type Kategoria } from "@/lib/products";
import { wszystkieProdukty } from "@/lib/store";
import { metaSpolecznosciowe } from "@/lib/site";

// Strona czyta searchParams (filtr kategorii, wyszukiwanie) — Next i tak
// renderuje ją w pełni dynamicznie niezależnie od tej flagi, więc nie ma
// realnej korzyści z ISR bez większej przebudowy (np. filtrowanie po stronie
// klienta). TTFB i tak jest tu podobny jak na stronach z cache (~150-200ms).
export const dynamic = "force-dynamic";

// Opisy meta (do ~160 znaków) — muszą odpowiadać faktycznemu asortymentowi.
const OPISY_KATEGORII: Record<Kategoria, string> = {
  naszyjniki:
    "Naszyjniki z kamieniami naturalnymi — księżyc, słońce, lunula i chokery z labradorytem, kamieniem księżycowym, turmalinem i hematytem. Ręcznie tworzone.",
  bransoletki:
    "Bransoletki z kamieni naturalnych — zodiakalne dla każdego znaku, bransoletki przyjaźni, męskie z tygrysim okiem i agatem oraz słowiańskie z hematytem.",
  akcesoria:
    "Zawieszki do telefonu z kamieni naturalnych — ametyst, rodonit, agat mszysty, jaspis i turmalin. Ręcznie tworzone dodatki NAWIA.",
};

// Widoczny wstęp na stronie kategorii — strona lądowania potrzebuje treści,
// nie samej siatki produktów, żeby rankować na frazy typu „naszyjniki z
// kamieniami naturalnymi".
const WSTEPY_KATEGORII: Record<Kategoria, string> = {
  naszyjniki:
    "Ręcznie tworzone naszyjniki z kamieniami naturalnymi, inspirowane księżycem, słońcem i słowiańską symboliką. W kolekcji znajdziesz zawieszki z księżycem i słońcem, lunule, kwiat lotosu i rozgwiazdę, a także chokery z hematytem. Każdy naszyjnik łączy kamienie o różnym znaczeniu — od kamienia księżycowego i labradorytu, przez turmalin, rodochrozyt i amazonit, po akwamaryn, szmaragd i granat — tak, by stał się osobistym talizmanem.",
  bransoletki:
    "Bransoletki z kamieni naturalnych na co dzień i na prezent. Bransoletki zodiakalne przygotowaliśmy dla każdego z dwunastu znaków zodiaku. Bransoletka przyjaźni z lapis lazuli, kwarcem różowym i ametystem jest dostępna pojedynczo lub w zestawie dla dwóch osób. Dla mężczyzn mamy bransoletki z tygrysim okiem, czarnym agatem oraz turmalinem z lawą wulkaniczną, a w kolekcji słowiańskiej — chryzokolę, rodonit i bursztyn z hematytem.",
  akcesoria:
    "Zawieszki do telefonu z kamieni naturalnych — mały talizman, który masz zawsze przy sobie. Łączymy ametyst z jaspisem cesarskim, agat mszysty z turkusem afrykańskim, jaspis dalmatyński z turmalinem oraz rodonit. To ręcznie tworzony dodatek w tym samym duchu co biżuteria NAWIA i pomysł na niewielki prezent.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string; q?: string }>;
}) {
  const { kategoria, q } = await searchParams;
  const kat = KATEGORIE.find((k) => k.id === kategoria);

  // Wyszukiwanie: jeden kanoniczny adres /produkty (bez indeksacji cienkich duplikatów).
  if (q && q.trim()) {
    return {
      title: `Wyniki wyszukiwania: ${q.trim()}`,
      description: `Wyniki wyszukiwania „${q.trim()}" w sklepie NAWIA.`,
      alternates: { canonical: "/produkty" },
      robots: { index: false, follow: true },
    };
  }

  // Strona kategorii: własny tytuł, opis i canonical (indeksowalna strona lądowania).
  if (kat) {
    return {
      title: kat.nazwa,
      description: OPISY_KATEGORII[kat.id],
      alternates: { canonical: `/produkty?kategoria=${kat.id}` },
      ...metaSpolecznosciowe(
        `/produkty?kategoria=${kat.id}`,
        kat.nazwa,
        OPISY_KATEGORII[kat.id]
      ),
    };
  }

  const opis =
    "Cała kolekcja NAWIA — naszyjniki i bransoletki ze stali chirurgicznej i naturalnych kamieni.";
  return {
    title: "Sklep",
    description: opis,
    alternates: { canonical: "/produkty" },
    ...metaSpolecznosciowe("/produkty", "Sklep", opis),
  };
}

function normalizuj(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l");
}

export default async function ProduktyPage({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string; q?: string }>;
}) {
  const { kategoria, q } = await searchParams;
  const aktywna = kategoria as Kategoria | undefined;
  const fraza = (q ?? "").trim();

  const produkty = await wszystkieProdukty();
  let lista =
    aktywna && KATEGORIE.some((k) => k.id === aktywna)
      ? produkty.filter((p) => p.kategoria === aktywna)
      : produkty;

  if (fraza) {
    const nf = normalizuj(fraza);
    lista = lista.filter((p) =>
      normalizuj(`${p.nazwa} ${p.opis} ${p.opisDlugi}`).includes(nf)
    );
  }

  const nazwaKategorii = KATEGORIE.find((k) => k.id === aktywna)?.nazwa;
  const tytul = fraza
    ? `Wyniki: „${fraza}”`
    : (nazwaKategorii ?? "Cała kolekcja");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="text-center">
        <p className="eyebrow">Sklep</p>
        <h1 className="mt-2 text-4xl text-ink">{tytul}</h1>
        {aktywna && WSTEPY_KATEGORII[aktywna] && !fraza && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {WSTEPY_KATEGORII[aktywna]}
          </p>
        )}
        <p className="mt-3 text-sm text-muted">
          {lista.length}{" "}
          {lista.length === 1 ? "produkt" : lista.length < 5 ? "produkty" : "produktów"}
        </p>
      </div>

      {/* Filtr kategorii */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <FiltrLink aktywne={!aktywna && !fraza} href="/produkty">
          Wszystkie
        </FiltrLink>
        {KATEGORIE.map((k) => (
          <FiltrLink
            key={k.id}
            aktywne={aktywna === k.id}
            href={`/produkty?kategoria=${k.id}`}
          >
            {k.nazwa}
          </FiltrLink>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="mt-16 text-center text-muted">
          <p>Brak produktów spełniających kryteria.</p>
          <Link href="/produkty" className="mt-4 inline-block text-gold-deep hover:underline">
            Wyczyść filtry
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => (
            <ProductCard key={p.slug} produkt={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FiltrLink({
  href,
  aktywne,
  children,
}: {
  href: string;
  aktywne: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full border px-5 py-2 text-sm transition-colors " +
        (aktywne
          ? "border-gold bg-gold text-paper"
          : "border-line text-muted hover:border-gold hover:text-gold")
      }
    >
      {children}
    </Link>
  );
}
