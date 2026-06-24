import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zamówienie",
  robots: { index: false, follow: true },
  alternates: { canonical: "/zamowienie" },
};

export default function ZamowienieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
