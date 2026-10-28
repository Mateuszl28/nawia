import { promises as fs } from "fs";
import path from "path";

/**
 * Serwowanie zdjęć produktów wgranych przez panel.
 *
 * Next 16 czyta zawartość `public/` raz, przy starcie serwera — pliki wgrane
 * później są dla niego niewidoczne (404), dopóki proces się nie zrestartuje.
 * Przez nginx zdjęcie się otwiera, ale `next/image` pobiera oryginał *przez
 * Next*, dostaje 404 i zwraca 400 („The requested resource isn't a valid
 * image"), więc na sklepie zamiast zdjęcia widać zastępczą grafikę.
 *
 * Ten handler czyta plik z dysku przy każdym żądaniu, więc świeżo wgrane
 * zdjęcia działają od razu. Pliki istniejące w chwili builda Next serwuje
 * statycznie i tu w ogóle nie trafiają.
 */
export const dynamic = "force-dynamic";

const KATALOG = path.join(process.cwd(), "public", "uploads");

const TYPY: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ plik: string[] }> }
) {
  const { plik } = await params;
  const nazwa = plik.join("/");

  // Nazwy plików generujemy sami (slug-timestamp-indeks.ext); wszystko poza
  // tym wzorcem odrzucamy, żeby nie dało się wyjść poza katalog uploadów.
  if (!/^[a-zA-Z0-9._-]+$/.test(nazwa) || nazwa.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const typ = TYPY[path.extname(nazwa).toLowerCase()];
  if (!typ) return new Response("Not found", { status: 404 });

  try {
    const dane = await fs.readFile(path.join(KATALOG, nazwa));
    return new Response(new Uint8Array(dane), {
      headers: {
        "Content-Type": typ,
        // Nazwa zawiera znacznik czasu, więc treść pod danym URL się nie zmienia.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
