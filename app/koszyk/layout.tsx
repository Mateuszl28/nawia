import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koszyk",
  robots: { index: false, follow: true },
  alternates: { canonical: "/koszyk" },
};

export default function KoszykLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
