import Link from "next/link";
import { MoonLogo } from "@/components/moon-logo";
import { wyloguj } from "@/app/admin/actions";

export function AdminShell({
  children,
  tytul,
  akcja,
}: {
  children: React.ReactNode;
  tytul: string;
  akcja?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand/40">
      <header className="border-b border-line/60 bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/admin" className="flex items-center gap-3 text-ink">
            <MoonLogo className="h-8 w-8 text-gold" />
            <span className="flex flex-col leading-none">
              <span className="brand-mark text-lg">NAWIA</span>
              <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.25em] text-muted">
                Panel
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted">
            <Link href="/admin" className="hover:text-gold">
              Produkty
            </Link>
            <Link href="/admin/zamowienia" className="hover:text-gold">
              Zamówienia
            </Link>
            <Link href="/" className="hover:text-gold" target="_blank">
              Zobacz sklep ↗
            </Link>
            <form action={wyloguj}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-1.5 text-ink transition-colors hover:border-gold hover:text-gold"
              >
                Wyloguj
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl text-ink">{tytul}</h1>
          {akcja}
        </div>
        {children}
      </main>
    </div>
  );
}
