import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ulubione",
  robots: { index: false, follow: true },
  alternates: { canonical: "/ulubione" },
};

export default function UlubioneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
