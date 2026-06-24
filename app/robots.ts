import type { MetadataRoute } from "next";
import { BASE_URL as BAZA } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/ulubione", "/koszyk", "/zamowienie"],
    },
    sitemap: `${BAZA}/sitemap.xml`,
  };
}
