import { AdminShell } from "@/components/admin-shell";
import { wszystkieZamowienia, type StatusZamowienia } from "@/lib/orders";
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

function dataPl(iso: string): string {
  return new Date(iso).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ZamowieniaPage() {
  const zamowienia = await wszystkieZamowienia();
  const doNadania = zamowienia.filter((z) => z.status === "oplacone").length;
  const oczekuje = zamowienia.filter((z) => z.status === "nowe").length;
  const obrot = zamowienia
    .filter((z) => z.status !== "anulowane")
    .reduce((s, z) => s + z.suma + z.kosztDostawy, 0);

  return (
    <AdminShell tytul="Zamówienia">
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Zamówienia" wartosc={zamowienia.length} />
        <Stat label="Oczekują wpłaty" wartosc={oczekuje} />
        <Stat label="Do nadania" wartosc={doNadania} />
        <Stat label="Obrót" wartosc={formatCena(Math.round(obrot))} />
      </div>

      {zamowienia.length === 0 ? (
        <p className="rounded-xl border border-line/60 bg-paper px-4 py-10 text-center text-muted">
          Brak zamówień.
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

function Stat({ label, wartosc }: { label: string; wartosc: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line/60 bg-paper px-4 py-4">
      <div className="text-2xl text-ink">{wartosc}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
