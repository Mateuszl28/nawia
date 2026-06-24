import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_OPIS, SITE_TAGLINE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_OPIS,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#9a8255",
    lang: "pl",
    icons: [
      { src: "/logo.jpg", sizes: "720x720", type: "image/jpeg" },
      {
        src: "/logo.jpg",
        sizes: "720x720",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
