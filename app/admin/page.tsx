import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { ProductImage } from "@/components/product-image";
import { usunProduktAkcja } from "@/app/admin/actions";
import { wszystkieProdukty } from "@/lib/store";
import { formatCena, KATEGORIE } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produkty — Panel NAWIA" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    dodano?: string;
    zapisano?: string;
    usunieto?: string;
  }>;
}) {
  const produkty = await wszystkieProdukty();
  const { dodano, zapisano, usunieto } = await searchParams;
  const komunikat = dodano
    ? "Produkt został dodany."
    : zapisano
      ? "Zmiany zapisane."
      : usunieto
        ? "Produkt usunięty."
        : null;

  const nazwaKat = (id: string) =>
    KATEGORIE.find((k) => k.id === id)?.nazwa ?? id;

  return (
    <AdminShell
      tytul="Produkty"
      akcja={
        <Link
          href="/admin/produkty/nowy"
          className="rounded-full bg-ink px-6 py-2.5 text-sm uppercase tracking-[0.15em] text-paper transition-colors hover:bg-gold-deep"
        >
          + Dodaj produkt
        </Link>
      }
    >
      {komunikat && (
        <p className="mb-6 rounded-lg bg-cream px-4 py-3 text-sm text-gold-deep">
          {komunikat}
        </p>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Produkty" wartosc={produkty.length} />
        <Stat
          label="Nowości"
          wartosc={produkty.filter((p) => p.nowosc).length}
        />
        <Stat label="Kategorie" wartosc={KATEGORIE.length} />
        <Stat
          label="Śr. cena"
          wartosc={
            produkty.length
              ? formatCena(
                  Math.round(
                    produkty.reduce((s, p) => s + p.cena, 0) / produkty.length
                  )
                )
              : "—"
          }
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line/60 bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/60 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Produkt</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                Kategoria
              </th>
              <th className="px-4 py-3 font-medium">Cena</th>
              <th className="px-4 py-3 text-right font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50">
            {produkty.map((p) => (
              <tr key={p.slug} className="hover:bg-cream/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line/50 bg-cream">
                      <ProductImage produkt={p} className="h-full w-full" />
                    </div>
                    <div>
                      <div className="text-ink">{p.nazwa}</div>
                      <div className="text-xs text-muted">
                        {p.dlugosc ?? p.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted sm:table-cell">
                  {nazwaKat(p.kategoria)}
                  {p.nowosc && (
                    <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-gold-deep">
                      nowość
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink">{formatCena(p.cena)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/produkty/${p.slug}`}
                      className="rounded-full border border-line px-4 py-1.5 text-xs text-ink transition-colors hover:border-gold hover:text-gold"
                    >
                      Edytuj
                    </Link>
                    <form action={usunProduktAkcja}>
                      <input type="hidden" name="slug" value={p.slug} />
                      <button
                        type="submit"
                        className="rounded-full border border-line px-4 py-1.5 text-xs text-red-500 transition-colors hover:border-red-400 hover:bg-red-50"
                      >
                        Usuń
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {produkty.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  Brak produktów. Dodaj pierwszy.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Stat({ label, wartosc }: { label: string; wartosc: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line/60 bg-paper px-4 py-4">
      <div className="text-2xl text-ink">{wartosc}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">
        {label}
      </div>
    </div>
  );
}
