import Link from "next/link";
import { KATEGORIE, zdjeciaProduktu, type Produkt } from "@/lib/products";

/**
 * Formularz produktu używany przy dodawaniu i edycji.
 * `action` to akcja serwerowa przyjmująca FormData.
 */
export function ProductForm({
  action,
  produkt,
  tekstPrzycisku,
}: {
  action: (formData: FormData) => void | Promise<void>;
  produkt?: Produkt;
  tekstPrzycisku: string;
}) {
  const existing = produkt ? zdjeciaProduktu(produkt) : [];
  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="grid gap-6 rounded-xl border border-line/60 bg-paper p-6 md:grid-cols-2"
    >
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

      <Field label="Zdjęcia produktu" className="md:col-span-2">
        <input
          name="zdjecia"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-paper hover:file:bg-gold-deep"
        />
        <span className="mt-1 block text-xs text-muted">
          Możesz wybrać kilka plików naraz (max 8). Pierwsze zdjęcie jest
          główne. Nowe pliki dołączają się do istniejących.
        </span>

        {existing.length > 0 && (
          <div className="mt-3">
            <span className="mb-2 block text-xs text-muted">
              Obecne zdjęcia — zaznacz, aby usunąć przy zapisie:
            </span>
            <div className="flex flex-wrap gap-3">
              {existing.map((url, i) => (
                <label
                  key={url}
                  className="relative block cursor-pointer"
                  title="Zaznacz, aby usunąć"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${produkt?.nazwa ?? "Zdjęcie"} ${i + 1}`}
                    className="h-20 w-20 rounded-lg border border-line object-cover"
                  />
                  <span className="absolute left-1 top-1 rounded bg-ink/70 px-1 text-[10px] text-paper">
                    {i === 0 ? "główne" : i + 1}
                  </span>
                  <input
                    type="checkbox"
                    name="usunZdjecie"
                    value={url}
                    className="absolute right-1 top-1 h-4 w-4 accent-red-600"
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </Field>

      <Field label="Krótki opis" className="md:col-span-2">
        <input name="opis" defaultValue={produkt?.opis} className={INPUT} />
      </Field>

      <Field label="Pełny opis" className="md:col-span-2">
        <textarea
          name="opisDlugi"
          rows={4}
          defaultValue={produkt?.opisDlugi}
          className={INPUT}
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
        <button
          type="submit"
          className="rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
        >
          {tekstPrzycisku}
        </button>
        <Link href="/admin" className="text-sm text-muted hover:text-gold">
          Anuluj
        </Link>
      </div>
    </form>
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
