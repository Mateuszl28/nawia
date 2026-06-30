import { MoonLogo } from "@/components/moon-logo";
import { zaloguj } from "@/app/admin/actions";

export const metadata = { title: "Logowanie — Panel NAWIA" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ blad?: string; powrot?: string }>;
}) {
  const { blad, powrot } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-5">
      <div className="w-full max-w-sm rounded-2xl border border-line/60 bg-paper p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <MoonLogo className="h-14 w-14 text-gold" />
          <span className="brand-mark mt-3 text-xl">NAWIA</span>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-muted">
            Panel administracyjny
          </p>
        </div>

        {blad === "config" ? (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            Panel jest zablokowany ze względów bezpieczeństwa. Ustaw na serwerze
            SESSION_SECRET i ADMIN_HASLO w pliku .env, a następnie zrestartuj
            aplikację.
          </p>
        ) : blad === "limit" ? (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            Zbyt wiele prób logowania. Spróbuj ponownie za kilka minut.
          </p>
        ) : blad ? (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            Nieprawidłowy login lub hasło.
          </p>
        ) : null}

        <form action={zaloguj} className="mt-6 space-y-4">
          <input type="hidden" name="powrot" value={powrot ?? "/admin"} />
          <label className="block">
            <span className="mb-1 block text-sm text-muted">Login</span>
            <input
              name="login"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-ink outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-muted">Hasło</span>
            <input
              name="haslo"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-ink outline-none focus:border-gold"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-ink px-6 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep"
          >
            Zaloguj się
          </button>
        </form>

        {process.env.NODE_ENV !== "production" && (
          <p className="mt-6 text-center text-xs text-muted">
            Demo: login <span className="text-gold-deep">admin</span> · hasło{" "}
            <span className="text-gold-deep">nawia2026</span>
          </p>
        )}
      </div>
    </div>
  );
}
