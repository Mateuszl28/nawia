import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { wszystkieProdukty } from "@/lib/store";
import { wszystkieZamowienia } from "@/lib/orders";
import { formatCena } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pulpit — Panel NAWIA" };

export default async function PulpitPage() {
  const [produkty, zamowienia] = await Promise.all([
    wszystkieProdukty(),
    wszystkieZamowienia(),
  ]);

  const oczekuje = zamowienia.filter((z) => z.status === "nowe").length;
  const doNadania = zamowienia.filter((z) => z.status === "oplacone").length;
  const obrot = zamowienia
    .filter((z) => z.status !== "anulowane")
    .reduce((s, z) => s + z.suma + z.kosztDostawy, 0);

  const ostatnie = [...zamowienia]
    .sort((a, b) => b.utworzono.localeCompare(a.utworzono))
    .slice(0, 5);

  return (
    <AdminShell tytul="Pulpit">
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat
          label="Oczekują wpłaty"
          wartosc={oczekuje}
          akcent={oczekuje > 0}
          href="/admin/zamowienia?status=nowe"
        />
        <Stat
          label="Do nadania"
          wartosc={doNadania}
          akcent={doNadania > 0}
          href="/admin/zamowienia?status=oplacone"
        />
        <Stat
          label="Obrót"
          wartosc={formatCena(Math.round(obrot))}
          href="/admin/zamowienia"
        />
        <Stat
          label="Produkty"
          wartosc={produkty.length}
          href="/admin/produkty"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/admin/produkty/nowy"
          tytul="Dodaj produkt"
          opis="Nowa pozycja w sklepie"
        />
        <QuickLink
          href="/admin/zamowienia"
          tytul="Zamówienia"
          opis="Statusy, notatki, etykiety"
        />
        <QuickLink
          href="/admin/produkty"
          tytul="Produkty"
          opis="Edycja i ceny"
        />
      </div>

      <h2 className="mt-10 mb-4 text-sm uppercase tracking-wider text-muted">
        Ostatnie zamówienia
      </h2>
      {ostatnie.length === 0 ? (
        <p className="rounded-xl border border-line/60 bg-paper px-4 py-8 text-center text-muted">
          Brak zamówień.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line/60 bg-paper">
          <table className="w-full min-w-[420px] text-left text-sm">
            <tbody className="divide-y divide-line/50">
              {ostatnie.map((z) => (
                <tr key={z.numer} className="hover:bg-cream/50">
                  <td className="px-4 py-3 text-ink">{z.numer}</td>
                  <td className="px-4 py-3 text-muted">
                    {z.klient.imie} {z.klient.nazwisko}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {formatCena(z.suma + z.kosztDostawy)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/admin/zamowienia"
                      className="text-xs text-gold-deep hover:text-gold"
                    >
                      Otwórz →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function Stat({
  label,
  wartosc,
  href,
  akcent,
}: {
  label: string;
  wartosc: React.ReactNode;
  href: string;
  akcent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border px-4 py-4 transition-colors hover:border-gold ${
        akcent ? "border-gold/60 bg-sand/50" : "border-line/60 bg-paper"
      }`}
    >
      <div className="text-2xl text-ink">{wartosc}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">
        {label}
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  tytul,
  opis,
}: {
  href: string;
  tytul: string;
  opis: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-line/60 bg-paper px-5 py-4 transition-colors hover:border-gold"
    >
      <div className="text-ink">{tytul}</div>
      <div className="mt-1 text-xs text-muted">{opis}</div>
    </Link>
  );
}
