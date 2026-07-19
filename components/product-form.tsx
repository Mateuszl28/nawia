"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { StanProduktu } from "@/app/admin/actions";
import {
  KATEGORIE,
  MAX_ZDJEC,
  MAX_ROZMIAR_ZDJECIA,
  TYPY_ZDJEC,
  zdjeciaProduktu,
  type Produkt,
} from "@/lib/products";

/**
 * Formularz produktu używany przy dodawaniu i edycji.
 * `action` to akcja serwerowa zwracająca stan z ewentualnym błędem.
 */
export function ProductForm({
  action,
  produkt,
  tekstPrzycisku,
}: {
  action: (stan: StanProduktu, formData: FormData) => Promise<StanProduktu>;
  produkt?: Produkt;
  tekstPrzycisku: string;
}) {
  const [stan, formAction] = useActionState<StanProduktu, FormData>(action, {});

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="grid gap-6 rounded-xl border border-line/60 bg-paper p-6 md:grid-cols-2"
    >
      {stan.blad && (
        <p
          role="alert"
          className="md:col-span-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {stan.blad}
        </p>
      )}

      <Field label="Nazwa" className="md:col-span-2">
        <input
          name="nazwa"
          required
          defaultValue={produkt?.nazwa}
          className={INPUT}
        />
      </Field>

      <Field label="Kategoria">
        <select
          name="kategoria"
          defaultValue={produkt?.kategoria ?? "naszyjniki"}
          className={INPUT}
        >
          {KATEGORIE.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nazwa}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Cena (PLN)">
        <input
          name="cena"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={produkt?.cena}
          className={INPUT}
        />
      </Field>

      <Field label="Długość">
        <input
          name="dlugosc"
          placeholder="np. 45 cm"
          defaultValue={produkt?.dlugosc}
          className={INPUT}
        />
      </Field>

      <PoleZdjec produkt={produkt} />

      <Field label="Krótki opis" className="md:col-span-2">
        <input name="opis" defaultValue={produkt?.opis} className={INPUT} />
      </Field>

      <Field label="Pełny opis" className="md:col-span-2">
        <textarea
          name="opisDlugi"
          rows={8}
          defaultValue={produkt?.opisDlugi}
          className={`${INPUT} resize-y min-h-32 leading-relaxed`}
        />
      </Field>

      <Field label="Kolor akcentu (grafika)">
        <input
          name="ton"
          type="color"
          defaultValue={produkt?.ton ?? "#9a8255"}
          className="h-11 w-full cursor-pointer rounded-lg border border-line bg-paper px-1"
        />
      </Field>

      <div className="flex items-center gap-3 self-end">
        <input
          id="nowosc"
          name="nowosc"
          type="checkbox"
          defaultChecked={produkt?.nowosc}
          className="h-4 w-4 accent-[#9a8255]"
        />
        <label htmlFor="nowosc" className="text-sm text-muted">
          Oznacz jako nowość
        </label>
      </div>

      <div className="mt-2 flex items-center gap-4 md:col-span-2">
        <PrzyciskZapisu tekst={tekstPrzycisku} />
        <Link href="/admin" className="text-sm text-muted hover:text-gold">
          Anuluj
        </Link>
      </div>
    </form>
  );
}

/** Przycisk submit blokowany na czas wysyłki — upload zdjęć bywa wolny. */
function PrzyciskZapisu({ tekst }: { tekst: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Zapisywanie…" : tekst}
    </button>
  );
}

/**
 * Zarządzanie galerią zdjęć: podgląd istniejących i nowo wybranych plików,
 * każde z przyciskiem ✕. Nowe pliki trzymamy w stanie i synchronizujemy
 * z natywnym <input type="file"> przez DataTransfer, dzięki czemu można
 * pojedynczo usuwać wybrane pliki jeszcze przed zapisem.
 */
function PoleZdjec({ produkt }: { produkt?: Produkt }) {
  const istniejace = produkt ? zdjeciaProduktu(produkt) : [];
  const [usuniete, setUsuniete] = useState<string[]>([]);
  const [nowePliki, setNowePliki] = useState<File[]>([]);
  const [podglady, setPodglady] = useState<string[]>([]);
  const [odrzucone, setOdrzucone] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const zachowane = istniejace.filter((u) => !usuniete.includes(u));
  const wolneSloty = MAX_ZDJEC - zachowane.length - nowePliki.length;

  // Synchronizuj natywny input z listą wybranych plików (per-plik usuwanie).
  useEffect(() => {
    if (!fileRef.current) return;
    const dt = new DataTransfer();
    nowePliki.forEach((f) => dt.items.add(f));
    fileRef.current.files = dt.files;
  }, [nowePliki]);

  // Podglądy nowych plików (object URL) — sprzątamy po zmianie/odmontowaniu.
  useEffect(() => {
    const urls = nowePliki.map((f) => URL.createObjectURL(f));
    setPodglady(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [nowePliki]);

  function dodajPliki(e: React.ChangeEvent<HTMLInputElement>) {
    const wybrane = Array.from(e.target.files ?? []);
    if (wybrane.length === 0) return;

    // Odrzucamy zły format/rozmiar od razu — inaczej błąd wyszedłby dopiero
    // przy zapisie, po wysłaniu kilkunastu MB na serwer.
    const zle: string[] = [];
    const dobre = wybrane.filter((f) => {
      if (!TYPY_ZDJEC.includes(f.type)) {
        zle.push(`„${f.name}" — nieobsługiwany format (dozwolone: JPG, PNG, WEBP)`);
        return false;
      }
      if (f.size > MAX_ROZMIAR_ZDJECIA) {
        zle.push(
          `„${f.name}" — ${(f.size / 1024 / 1024).toFixed(1)} MB, maksimum to 8 MB`
        );
        return false;
      }
      return true;
    });
    setOdrzucone(zle);

    setNowePliki((prev) => {
      const razem = [...prev];
      const limit = MAX_ZDJEC - zachowane.length;
      for (const f of dobre) {
        if (razem.length >= limit) break;
        const duplikat = razem.some(
          (x) =>
            x.name === f.name &&
            x.size === f.size &&
            x.lastModified === f.lastModified
        );
        if (!duplikat) razem.push(f);
      }
      return razem;
    });
  }

  function usunNowy(idx: number) {
    setNowePliki((prev) => prev.filter((_, i) => i !== idx));
  }

  function usunIstniejacy(url: string) {
    setUsuniete((prev) => [...prev, url]);
  }

  function przywrocIstniejacy(url: string) {
    setUsuniete((prev) => prev.filter((u) => u !== url));
  }

  // Numeracja "główne" liczona po widocznej kolejności: zachowane, potem nowe.
  let licznik = 0;

  return (
    <div className="md:col-span-2">
      <span className="mb-1 block text-sm text-muted">Zdjęcia produktu</span>
      <input
        ref={fileRef}
        name="zdjecia"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={dodajPliki}
        className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-paper hover:file:bg-gold-deep"
      />
      <span className="mt-1 block text-xs text-muted">
        Możesz wybrać kilka plików naraz (max {MAX_ZDJEC}). Pierwsze zdjęcie jest
        główne.{" "}
        {wolneSloty > 0
          ? `Możesz dodać jeszcze ${wolneSloty}.`
          : "Osiągnięto limit — usuń jakieś, aby dodać kolejne."}
      </span>

      {odrzucone.length > 0 && (
        <ul
          role="alert"
          className="mt-2 space-y-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {odrzucone.map((t) => (
            <li key={t}>Pominięto {t}</li>
          ))}
        </ul>
      )}

      {/* Ukryte pola informujące akcję, które istniejące zdjęcia usunąć. */}
      {usuniete.map((url) => (
        <input key={url} type="hidden" name="usunZdjecie" value={url} />
      ))}

      {(zachowane.length > 0 || nowePliki.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {zachowane.map((url) => {
            const nr = licznik++;
            return (
              <Miniatura
                key={url}
                src={url}
                alt={`${produkt?.nazwa ?? "Zdjęcie"} ${nr + 1}`}
                glowne={nr === 0}
                onUsun={() => usunIstniejacy(url)}
              />
            );
          })}
          {podglady.map((url, i) => {
            const nr = licznik++;
            return (
              <Miniatura
                key={url}
                src={url}
                alt={`Nowe zdjęcie ${i + 1}`}
                glowne={nr === 0}
                nowe
                onUsun={() => usunNowy(i)}
              />
            );
          })}
        </div>
      )}

      {usuniete.length > 0 && (
        <div className="mt-3">
          <span className="mb-1 block text-xs text-muted">
            Do usunięcia przy zapisie:
          </span>
          <div className="flex flex-wrap gap-2">
            {usuniete.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => przywrocIstniejacy(url)}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-gold hover:text-gold"
              >
                Przywróć zdjęcie
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Miniatura({
  src,
  alt,
  glowne,
  nowe,
  onUsun,
}: {
  src: string;
  alt: string;
  glowne: boolean;
  nowe?: boolean;
  onUsun: () => void;
}) {
  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-24 w-24 rounded-lg border border-line object-cover"
      />
      {glowne && (
        <span className="absolute left-1 top-1 rounded bg-ink/70 px-1 text-[10px] text-paper">
          główne
        </span>
      )}
      {nowe && (
        <span className="absolute bottom-1 left-1 rounded bg-gold-deep/80 px-1 text-[10px] text-paper">
          nowe
        </span>
      )}
      <button
        type="button"
        onClick={onUsun}
        aria-label="Usuń zdjęcie"
        title="Usuń zdjęcie"
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-paper text-sm leading-none text-red-600 shadow-sm transition-colors hover:bg-red-600 hover:text-paper"
      >
        ✕
      </button>
    </div>
  );
}

const INPUT =
  "w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold";

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={"block " + (className ?? "")}>
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}
