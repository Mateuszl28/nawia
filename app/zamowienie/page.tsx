"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useKoszyk } from "@/components/cart-context";
import { OpcjeDostawy } from "@/components/shipping-options";
import { FurgonetkaMapa } from "@/components/furgonetka-map";
import { formatCena, formatCenaGr } from "@/lib/products";
import { kosztDostawy, metoda as metodaInfo } from "@/lib/dostawa";

type Pola = {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  ulica: string;
  kod: string;
  miasto: string;
  paczkomat: string;
  paczkomatNazwa: string;
};

const PUSTE: Pola = {
  imie: "",
  nazwisko: "",
  email: "",
  telefon: "",
  ulica: "",
  kod: "",
  miasto: "",
  paczkomat: "",
  paczkomatNazwa: "",
};

export default function ZamowieniePage() {
  const { produktyZKoszyka, suma, metodaDostawy, wyczysc, gotowy } = useKoszyk();
  const router = useRouter();
  const [pola, setPola] = useState<Pola>(PUSTE);
  const [bledy, setBledy] = useState<Partial<Record<keyof Pola, string>>>({});
  const [wysylanie, setWysylanie] = useState(false);
  const [bladWysylki, setBladWysylki] = useState<string | null>(null);

  const dostawa = kosztDostawy(metodaDostawy, suma);
  const paczkomatem = metodaDostawy === "paczkomat";

  if (gotowy && produktyZKoszyka.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl text-ink">Koszyk jest pusty</h1>
        <Link
          href="/produkty"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper hover:bg-gold-deep"
        >
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  function zmien(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPola((p) => ({ ...p, [name]: value }));
    setBledy((b) => ({ ...b, [name]: undefined }));
  }

  function waliduj(): boolean {
    const nowe: Partial<Record<keyof Pola, string>> = {};
    if (!pola.imie.trim()) nowe.imie = "Podaj imię";
    if (!pola.nazwisko.trim()) nowe.nazwisko = "Podaj nazwisko";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(pola.email))
      nowe.email = "Nieprawidłowy adres e-mail";
    if (!/^[+\d][\d\s-]{7,}$/.test(pola.telefon))
      nowe.telefon = "Nieprawidłowy numer telefonu";
    if (paczkomatem) {
      if (!pola.paczkomat.trim())
        nowe.paczkomat = "Podaj nazwę lub numer paczkomatu";
    } else {
      if (!pola.ulica.trim()) nowe.ulica = "Podaj ulicę i numer";
      if (!/^\d{2}-\d{3}$/.test(pola.kod)) nowe.kod = "Format: 00-000";
      if (!pola.miasto.trim()) nowe.miasto = "Podaj miasto";
    }
    setBledy(nowe);
    return Object.keys(nowe).length === 0;
  }

  async function zloz(e: React.FormEvent) {
    e.preventDefault();
    if (!waliduj()) return;
    setWysylanie(true);
    setBladWysylki(null);
    try {
      const res = await fetch("/api/zamowienie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imie: pola.imie,
          nazwisko: pola.nazwisko,
          email: pola.email,
          telefon: pola.telefon,
          metodaDostawy,
          paczkomat: pola.paczkomat,
          paczkomatNazwa: pola.paczkomatNazwa,
          ulica: pola.ulica,
          kod: pola.kod,
          miasto: pola.miasto,
          pozycje: produktyZKoszyka.map(({ produkt, ilosc }) => ({
            slug: produkt.slug,
            ilosc,
          })),
        }),
      });
      const wynik = await res.json();
      if (!res.ok) throw new Error(wynik?.blad || "Nie udało się złożyć zamówienia.");
      wyczysc();
      const q = new URLSearchParams({ nr: wynik.numer });
      if (wynik.kwota != null) q.set("kwota", String(wynik.kwota));
      router.push(`/zamowienie/sukces?${q.toString()}`);
    } catch (err) {
      setBladWysylki(
        err instanceof Error ? err.message : "Nie udało się złożyć zamówienia."
      );
      setWysylanie(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-4xl text-ink">Zamówienie</h1>

      <form
        onSubmit={zloz}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]"
      >
        <div className="space-y-8">
          <fieldset>
            <legend className="eyebrow mb-5">Dane kontaktowe</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Pole name="imie" label="Imię" wartosc={pola.imie} blad={bledy.imie} onChange={zmien} />
              <Pole name="nazwisko" label="Nazwisko" wartosc={pola.nazwisko} blad={bledy.nazwisko} onChange={zmien} />
              <Pole name="email" label="E-mail" type="email" wartosc={pola.email} blad={bledy.email} onChange={zmien} />
              <Pole name="telefon" label="Telefon" wartosc={pola.telefon} blad={bledy.telefon} onChange={zmien} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-5">Metoda dostawy</legend>
            <OpcjeDostawy tytul={false} />
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-5">
              {paczkomatem ? "Paczkomat" : "Adres dostawy"}
            </legend>
            {paczkomatem ? (
              <div className="grid gap-4">
                <FurgonetkaMapa
                  etykieta={
                    pola.paczkomat
                      ? "Zmień punkt na mapie"
                      : "Wybierz punkt na mapie"
                  }
                  onWybor={(punkt) => {
                    setPola((p) => ({
                      ...p,
                      paczkomat: punkt.kod,
                      paczkomatNazwa: punkt.nazwa,
                    }));
                    setBledy((b) => ({ ...b, paczkomat: undefined }));
                  }}
                />
                {pola.paczkomatNazwa && (
                  <p className="rounded-lg border border-gold/50 bg-sand/40 px-4 py-2.5 text-sm text-ink">
                    Wybrany punkt:{" "}
                    <span className="text-gold-deep">{pola.paczkomatNazwa}</span>
                  </p>
                )}
                <Pole
                  name="paczkomat"
                  label="Kod punktu / paczkomatu"
                  placeholder="np. WAW123M"
                  wartosc={pola.paczkomat}
                  blad={bledy.paczkomat}
                  onChange={zmien}
                />
                <p className="text-xs leading-relaxed text-muted">
                  Wybierz punkt na mapie albo wpisz kod paczkomatu InPost ręcznie.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Pole name="ulica" label="Ulica i numer" wartosc={pola.ulica} blad={bledy.ulica} onChange={zmien} />
                </div>
                <Pole name="kod" label="Kod pocztowy" placeholder="00-000" wartosc={pola.kod} blad={bledy.kod} onChange={zmien} />
                <Pole name="miasto" label="Miasto" wartosc={pola.miasto} blad={bledy.miasto} onChange={zmien} />
              </div>
            )}
          </fieldset>
        </div>

        {/* Podsumowanie */}
        <aside className="h-fit rounded-xl border border-line/50 bg-cream p-6">
          <h2 className="text-xl text-ink">Twoje zamówienie</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {produktyZKoszyka.map(({ produkt, ilosc }) => (
              <li key={produkt.slug} className="flex justify-between gap-3">
                <span className="text-muted">
                  {produkt.nazwa}{" "}
                  <span className="text-gold-deep">× {ilosc}</span>
                </span>
                <span className="text-ink">
                  {formatCena(produkt.cena * ilosc)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line/50 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Produkty</dt>
              <dd className="text-ink">{formatCena(suma)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Dostawa — {metodaInfo(metodaDostawy).nazwa}</dt>
              <dd className="text-ink">
                {dostawa === 0 ? "Gratis" : formatCenaGr(dostawa)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line/50 pt-2 text-base">
              <dt className="text-ink">Razem</dt>
              <dd className="text-gold-deep">{formatCenaGr(suma + dostawa)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={wysylanie}
            className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep disabled:opacity-60"
          >
            {wysylanie ? "Składanie…" : "Złóż zamówienie"}
          </button>
          {bladWysylki && (
            <p className="mt-3 text-center text-xs text-red-500">{bladWysylki}</p>
          )}
          <p className="mt-3 text-center text-xs text-muted">
            Klikając, akceptujesz regulamin sklepu. Płatność przelewem lub BLIK po
            złożeniu zamówienia.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Pole({
  name,
  label,
  wartosc,
  blad,
  onChange,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  wartosc: string;
  blad?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <input
        name={name}
        type={type}
        value={wartosc}
        onChange={onChange}
        placeholder={placeholder}
        className={
          "w-full rounded-lg border bg-paper px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold " +
          (blad ? "border-red-400" : "border-line")
        }
      />
      {blad && <span className="mt-1 block text-xs text-red-500">{blad}</span>}
    </label>
  );
}
