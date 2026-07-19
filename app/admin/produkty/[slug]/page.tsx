import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";
import { usunProduktAkcja, zaktualizujProdukt } from "@/app/admin/actions";
import { produktPoSlug } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produkt = await produktPoSlug(slug);
  return { title: produkt ? `Edycja: ${produkt.nazwa} — NAWIA` : "Panel NAWIA" };
}

export default async function EdycjaProduktuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produkt = await produktPoSlug(slug);
  if (!produkt) notFound();

  // bind podstawia slug; formularz dokłada (stan, formData).
  const zapisz = zaktualizujProdukt.bind(null, produkt.slug);

  return (
    <AdminShell
      tytul="Edycja produktu"
      akcja={
        <form action={usunProduktAkcja}>
          <input type="hidden" name="slug" value={produkt.slug} />
          <button
            type="submit"
            className="rounded-full border border-line px-5 py-2 text-sm text-red-500 transition-colors hover:border-red-400 hover:bg-red-50"
          >
            Usuń produkt
          </button>
        </form>
      }
    >
      <ProductForm
        action={zapisz}
        produkt={produkt}
        tekstPrzycisku="Zapisz zmiany"
      />
    </AdminShell>
  );
}
