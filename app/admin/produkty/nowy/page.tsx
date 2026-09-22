import { wymagajSesji } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";
import { utworzProdukt } from "@/app/admin/actions";

export const metadata = { title: "Nowy produkt — Panel NAWIA" };

export default async function NowyProduktPage() {
  // Obrona w głąb: nie polegamy wyłącznie na proxy.ts.
  await wymagajSesji();
  return (
    <AdminShell tytul="Nowy produkt">
      <ProductForm action={utworzProdukt} tekstPrzycisku="Dodaj produkt" />
    </AdminShell>
  );
}
