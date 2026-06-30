import { NextResponse } from "next/server";
import { czyZalogowany } from "@/lib/auth";
import { furgonetkaFetch } from "@/lib/furgonetka";

// Pomocniczy endpoint: listuje usługi (przewoźników) z konta Furgonetki wraz z
// ich service_id. Służy do odczytania ID potrzebnych do FURGONETKA_SERVICE_*.
// Tylko dla zalogowanego administratora. Wejdź na /api/furgonetka/uslugi będąc
// zalogowanym w panelu.
export async function GET() {
  if (!(await czyZalogowany())) {
    return NextResponse.json({ blad: "Brak dostępu." }, { status: 401 });
  }

  try {
    const res = await furgonetkaFetch("/account/services", { method: "GET" });
    const tekst = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { blad: `Furgonetka ${res.status}`, odpowiedz: tekst.slice(0, 2000) },
        { status: 502 }
      );
    }
    // Zwracamy surową odpowiedź konta — przejrzyj ją i wypisz service_id usług
    // dla paczkomatu (InPost) i kuriera.
    return new NextResponse(tekst, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    console.error("Błąd pobierania usług Furgonetki:", e);
    return NextResponse.json(
      { blad: "Nie udało się pobrać usług z Furgonetki (sprawdź dane OAuth w .env)." },
      { status: 502 }
    );
  }
}
