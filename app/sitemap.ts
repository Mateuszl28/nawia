import type { MetadataRoute } from "next";
import { wszystkieProdukty } from "@/lib/store";
import { KATEGORIE, zdjeciaProduktu, type Produkt } from "@/lib/products";
import { BASE_URL as BAZA } from "@/lib/site";

export const revalidate = 3600; // ISR (+ rewalidacja po edycji w panelu)

// Data ostatniej zmiany produktu: zapis w panelu, a dla starszych wpisów
// znacznik czasu z nazwy najnowszego zdjęcia (slug-<ms>-<n>.webp). Google
// ignoruje lastmod, który zawsze równa się „teraz", więc bez pewnej daty
// pole pomijamy.
function zmianaProduktu(p: Produkt): Date | undefined {
  if (p.zmieniono) return new Date(p.zmieniono);
  const czasy = zdjeciaProduktu(p)
    .map((z) => Number(z.match(/-(\d{13})-\d+\.\w+$/)?.[1]))
    .filter((n) => Number.isFinite(n) && n > 0);
  return czasy.length ? new Date(Math.max(...czasy)) : undefined;
}

function najpozniej(daty: (Date | undefined)[]): Date | undefined {
  const ms = daty.filter((d): d is Date => d != null).map((d) => d.getTime());
  return ms.length ? new Date(Math.max(...ms)) : undefined;
}

// Data ostatniej aktualizacji stron prawnych (AKTUALIZACJA w ich treści).
const PRAWNE = new Date("2026-09-22");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produkty = await wszystkieProdukty();
  // Strona główna i sklep zmieniają się razem z najnowszym produktem.
  const najnowsza = najpozniej(produkty.map(zmianaProduktu));

  const statyczne: MetadataRoute.Sitemap = [
    { url: `${BAZA}/`, lastModified: najnowsza, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BAZA}/produkty`,
      lastModified: najnowsza,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BAZA}/o-marce`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BAZA}/kontakt`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BAZA}/regulamin`,
      lastModified: PRAWNE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BAZA}/polityka-prywatnosci`,
      lastModified: PRAWNE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BAZA}/polityka-zwrotow`,
      lastModified: PRAWNE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BAZA}/polityka-cookies`,
      lastModified: PRAWNE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const kategorie: MetadataRoute.Sitemap = KATEGORIE.map((k) => ({
    url: `${BAZA}/produkty?kategoria=${k.id}`,
    lastModified: najpozniej(
      produkty.filter((p) => p.kategoria === k.id).map(zmianaProduktu)
    ),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const karty: MetadataRoute.Sitemap = produkty.map((p) => ({
    url: `${BAZA}/produkty/${p.slug}`,
    lastModified: zmianaProduktu(p),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...statyczne, ...kategorie, ...karty];
}
