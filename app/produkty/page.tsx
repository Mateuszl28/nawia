import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { KATEGORIE, type Kategoria } from "@/lib/products";
import { wszystkieProdukty } from "@/lib/store";

export const dynamic = "force-dynamic";

const OPISY_KATEGORII: Record<Kategoria, string> = {
  naszyjniki:
    "Naszyjniki NAWIA — stal chirurgiczna z kamieniem księżycowym i kryształami. Ręcznie tworzona biżuteria inspirowana fazami księżyca.",
  pierscionki:
    "Pierścionki NAWIA — stal chirurgiczna z labradorytem i naturalnymi kamieniami. Subtelne, rytualne wzory na co dzień i od święta.",
  kolczyki:
    "Kolczyki NAWIA — sztyfty i wiszące z naturalnymi kamieniami. Delikatna, księżycowa biżuteria ze stali chirurgicznej.",
  bransoletki:
    "Bransoletki NAWIA — stal chirurgiczna z kamieniem księżycowym i onyksem. Lekkie, eleganckie, z regulacją.",
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
    };
  }

  return {
    title: "Sklep",
    description:
      "Cała kolekcja NAWIA — naszyjniki, pierścionki, kolczyki i bransoletki ze stali chirurgicznej i naturalnych kamieni.",
    alternates: { canonical: "/produkty" },
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
