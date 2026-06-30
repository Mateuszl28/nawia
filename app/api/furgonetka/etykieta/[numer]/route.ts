import { NextResponse } from "next/server";
import { czyZalogowany } from "@/lib/auth";
import { zamowieniePoNumerze } from "@/lib/orders";
import { pobierzEtykiete } from "@/lib/furgonetka-nadanie";

// Pobranie etykiety przewozowej (PDF) dla zamówienia. Tylko dla zalogowanego
// administratora — trasa /api nie jest objęta proxy.ts, więc sprawdzamy sesję tu.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ numer: string }> }
) {
  if (!(await czyZalogowany())) {
    return NextResponse.json({ blad: "Brak dostępu." }, { status: 401 });
  }

  const { numer } = await params;
  const z = await zamowieniePoNumerze(numer);
  const packageId = z?.furgonetka?.packageId;
  if (!packageId) {
    return NextResponse.json(
      { blad: "Brak przesyłki dla tego zamówienia." },
      { status: 404 }
    );
  }

  try {
    const pdf = await pobierzEtykiete(packageId);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="etykieta-${numer}.pdf"`,
      },
    });
  } catch (e) {
    console.error("Nie udało się pobrać etykiety:", e);
    return NextResponse.json(
      { blad: "Nie udało się pobrać etykiety z Furgonetki." },
      { status: 502 }
    );
  }
}
