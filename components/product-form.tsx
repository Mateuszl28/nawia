import Link from "next/link";
import { KATEGORIE, type Produkt } from "@/lib/products";

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
  return (
    <form
      action={action}
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

      <Field label="Materiał">
        <input
          name="material"
          defaultValue={produkt?.material}
          className={INPUT}
        />
      </Field>

      <Field label="Kamień">
        <input name="kamien" defaultValue={produkt?.kamien} className={INPUT} />
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
