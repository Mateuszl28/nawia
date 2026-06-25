import type { MetadataRoute } from "next";
import { wszystkieProdukty } from "@/lib/store";
import { KATEGORIE } from "@/lib/products";
import { BASE_URL as BAZA } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produkty = await wszystkieProdukty();
  const teraz = new Date();

  const statyczne: MetadataRoute.Sitemap = [
    { url: `${BAZA}/`, lastModified: teraz, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BAZA}/produkty`,
      lastModified: teraz,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BAZA}/o-marce`,
      lastModified: teraz,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BAZA}/kontakt`,
      lastModified: teraz,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BAZA}/regulamin`,
      lastModified: teraz,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BAZA}/polityka-prywatnosci`,
      lastModified: teraz,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BAZA}/polityka-zwrotow`,
      lastModified: teraz,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const kategorie: MetadataRoute.Sitemap = KATEGORIE.map((k) => ({
    url: `${BAZA}/produkty?kategoria=${k.id}`,
    lastModified: teraz,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const karty: MetadataRoute.Sitemap = produkty.map((p) => ({
    url: `${BAZA}/produkty/${p.slug}`,
    lastModified: teraz,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...statyczne, ...kategorie, ...karty];
}
