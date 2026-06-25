import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { KoszykProvider } from "@/components/cart-context";
import { FavoritesProvider } from "@/components/favorites-context";
import { ToastProvider } from "@/components/toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import {
  BASE_URL,
  SITE_EMAIL,
  SITE_NAME,
  SITE_OPIS,
  SITE_TAGLINE,
} from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_OPIS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  keywords: [
    "biżuteria",
    "biżuteria ze stali chirurgicznej",
    "stal chirurgiczna",
    "kamień księżycowy",
    "labradoryt",
    "naszyjniki",
    "pierścionki",
    "kolczyki",
    "bransoletki",
    "NAWIA",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_OPIS,
    url: BASE_URL,
    type: "website",
    locale: "pl_PL",
    siteName: SITE_NAME,
    images: [{ url: "/logo.jpg", width: 720, height: 720, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_OPIS,
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#9a8255",
  colorScheme: "light",
};

const strukturaWitryny = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organizacja`,
      name: SITE_NAME,
      alternateName: `${SITE_NAME} — ${SITE_TAGLINE}`,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.jpg`,
      image: `${BASE_URL}/logo.jpg`,
      description: SITE_OPIS,
      email: SITE_EMAIL,
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#witryna`,
      url: BASE_URL,
      name: SITE_NAME,
      inLanguage: "pl-PL",
      publisher: { "@id": `${BASE_URL}/#organizacja` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/produkty?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>
        <JsonLd data={strukturaWitryny} />
        <ToastProvider>
          <KoszykProvider>
            <FavoritesProvider>
              <Navbar />
              <main className="min-h-[60vh]">{children}</main>
              <Footer />
            </FavoritesProvider>
          </KoszykProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
