import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import {
  wszystkieZamowienia,
  type StatusZamowienia,
} from "@/lib/orders";
import { zmienStatusAkcja, zapiszNotatkeAkcja } from "@/app/admin/actions";
import { formatCena, formatCenaGr } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Zamówienia — Panel NAWIA" };

const STATUS: Record<StatusZamowienia, { etykieta: string; klasa: string }> = {
  nowe: { etykieta: "Oczekuje wpłaty", klasa: "bg-amber-100 text-amber-700" },
  oplacone: { etykieta: "Opłacone", klasa: "bg-sand text-gold-deep" },
  nadane: { etykieta: "Nadane", klasa: "bg-emerald-100 text-emerald-700" },
  w_drodze: { etykieta: "W drodze", klasa: "bg-blue-100 text-blue-700" },
  dostarczone: { etykieta: "Dostarczone", klasa: "bg-emerald-100 text-emerald-800" },
  anulowane: { etykieta: "Anulowane", klasa: "bg-red-100 text-red-600" },
};

// Kolejność statusów w ścieżce zamówienia + akcje pokazywane jako przyciski.
const KOLEJNOSC: StatusZamowienia[] = [
  "nowe",
  "oplacone",
  "nadane",
  "w_drodze",
  "dostarczone",
];

function dataPl(iso: string): string {
  return new Date(iso).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ZamowieniaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; notatka?: string }>;
}) {
  const { status: filtrRaw, notatka } = await searchParams;
  const filtr = (filtrRaw ?? "") as StatusZamowienia | "";
  const wszystkie = await wszystkieZamowienia();

  const zamowienia =
    filtr && filtr in STATUS
      ? wszystkie.filter((z) => z.status === filtr)
      : wszystkie;

  const doNadania = wszystkie.filter((z) => z.status === "oplacone").length;
  const oczekuje = wszystkie.filter((z) => z.status === "nowe").length;
  const obrot = wszystkie
    .filter((z) => z.status !== "anulowane")
    .reduce((s, z) => s + z.suma + z.kosztDostawy, 0);

  return (
    <AdminShell tytul="Zamówienia">
      {notatka && (
        <p className="mb-6 rounded-lg bg-cream px-4 py-3 text-sm text-gold-deep">
          Notatka zapisana.
        </p>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Zamówienia" wartosc={wszystkie.length} />
        <Stat label="Oczekują wpłaty" wartosc={oczekuje} />
        <Stat label="Do nadania" wartosc={doNadania} />
        <Stat label="Obrót" wartosc={formatCena(Math.round(obrot))} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <FiltrLink aktywny={!filtr} href="/admin/zamowienia">
          Wszystkie ({wszystkie.length})
        </FiltrLink>
        {(Object.keys(STATUS) as StatusZamowienia[]).map((s) => {
          const ile = wszystkie.filter((z) => z.status === s).length;
          return (
            <FiltrLink
              key={s}
              aktywny={filtr === s}
              href={`/admin/zamowienia?status=${s}`}
            >
              {STATUS[s].etykieta} ({ile})
            </FiltrLink>
          );
        })}
      </div>

      {zamowienia.length === 0 ? (
        <p className="rounded-xl border border-line/60 bg-paper px-4 py-10 text-center text-muted">
          {filtr ? "Brak zamówień w tym statusie." : "Brak zamówień."}
        </p>
      ) : (
        <div className="space-y-4">
          {zamowienia.map((z) => {
            const st = STATUS[z.status];
            const tracking = z.furgonetka?.tracking;
            return (
              <div
                key={z.numer}
                className="rounded-xl border border-line/60 bg-paper p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-ink">{z.numer}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider ${st.klasa}`}
                      >
                        {st.etykieta}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      {dataPl(z.utworzono)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-gold-deep">
                      {formatCenaGr(z.suma + z.kosztDostawy)}
                    </div>
                    <div className="text-xs text-muted">
                      produkty {formatCena(z.suma)} + dostawa{" "}
                      {z.kosztDostawy === 0 ? "gratis" : formatCenaGr(z.kosztDostawy)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wider text-muted">
                      Klient
                    </div>
                    <div className="text-ink">
                      {z.klient.imie} {z.klient.nazwisko}
                    </div>
                    <div className="text-muted">
                      <a href={`mailto:${z.klient.email}`} className="hover:text-gold">
                        {z.klient.email}
                      </a>
                    </div>
                    <div className="text-muted">
                      <a href={`tel:${z.klient.telefon}`} className="hover:text-gold">
                        {z.klient.telefon}
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wider text-muted">
                      Dostawa — {z.dostawa.nazwa}
                    </div>
                    {z.dostawa.metoda === "paczkomat" ? (
                      <div className="text-ink">
                        {z.dostawa.punktNazwa || "Paczkomat"}{" "}
                        <span className="text-gold-deep">{z.dostawa.punktKod}</span>
                      </div>
                    ) : (
                      <div className="text-ink">
                        {z.dostawa.ulica}, {z.dostawa.kod} {z.dostawa.miasto}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-line/50 pt-3 text-sm">
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted">
                    Pozycje
                  </div>
                  <ul className="space-y-1">
                    {z.pozycje.map((p, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span className="text-muted">
                          {p.nazwa} <span className="text-gold-deep">× {p.ilosc}</span>
                        </span>
                        <span className="text-ink">{formatCena(p.cena * p.ilosc)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Zmiana statusu */}
                <div className="mt-4 border-t border-line/50 pt-3">
                  <div className="mb-2 text-xs uppercase tracking-wider text-muted">
                    Zmień status
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {KOLEJNOSC.filter((s) => s !== z.status).map((s) => (
                      <StatusBtn
                        key={s}
                        numer={z.numer}
                        status={s}
                        filtr={filtr}
                        etykieta={STATUS[s].etykieta}
                      />
                    ))}
                    {z.status !== "anulowane" && (
                      <StatusBtn
                        numer={z.numer}
                        status="anulowane"
                        filtr={filtr}
                        etykieta="Anuluj"
                        wariant="danger"
                      />
                    )}
                  </div>
                </div>

                {/* Notatka sprzedawcy */}
                <form
                  action={zapiszNotatkeAkcja}
                  className="mt-4 border-t border-line/50 pt-3"
                >
                  <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
                    Notatka (tylko dla Ciebie)
                  </label>
                  <input type="hidden" name="numer" value={z.numer} />
                  <input type="hidden" name="filtr" value={filtr} />
                  <textarea
                    name="notatka"
                    defaultValue={z.notatka ?? ""}
                    rows={2}
                    placeholder="np. wpłata BLIK 30.06, klient prosi o grawer…"
                    className="w-full resize-y rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-full border border-line px-4 py-1.5 text-xs text-ink transition-colors hover:border-gold hover:text-gold"
                    >
                      Zapisz notatkę
                    </button>
                  </div>
                </form>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-cream px-4 py-3 text-sm">
                  <span className="text-xs uppercase tracking-wider text-muted">
                    List przewozowy (Furgonetka)
                  </span>
                  {tracking ? (
                    <span className="flex items-center gap-3">
                      <span className="text-ink">{tracking}</span>
                      <a
                        href={`/api/furgonetka/etykieta/${z.numer}`}
                        className="rounded-full border border-gold px-4 py-1.5 text-xs text-gold-deep hover:bg-sand/50"
                      >
                        Pobierz etykietę PDF
                      </a>
                    </span>
                  ) : (
                    <span className="text-muted">
                      Przesyłka jeszcze nieutworzona
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function StatusBtn({
  numer,
  status,
  filtr,
  etykieta,
  wariant,
}: {
  numer: string;
  status: StatusZamowienia;
  filtr: string;
  etykieta: string;
  wariant?: "danger";
}) {
  return (
    <form action={zmienStatusAkcja}>
      <input type="hidden" name="numer" value={numer} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="filtr" value={filtr} />
      <button
        type="submit"
        className={
          wariant === "danger"
            ? "rounded-full border border-line px-4 py-1.5 text-xs text-red-500 transition-colors hover:border-red-400 hover:bg-red-50"
            : "rounded-full border border-line px-4 py-1.5 text-xs text-ink transition-colors hover:border-gold hover:text-gold"
        }
      >
        {etykieta}
      </button>
    </form>
  );
}

function FiltrLink({
  href,
  aktywny,
  children,
}: {
  href: string;
  aktywny: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
        aktywny
          ? "border-gold bg-sand/60 text-gold-deep"
          : "border-line text-muted hover:border-gold hover:text-gold"
      }`}
    >
      {children}
    </Link>
  );
}

function Stat({ label, wartosc }: { label: string; wartosc: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line/60 bg-paper px-4 py-4">
      <div className="text-2xl text-ink">{wartosc}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
