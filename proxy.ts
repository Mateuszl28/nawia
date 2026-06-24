import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE } from "@/lib/auth-shared";
import { weryfikujToken } from "@/lib/session";

// Next.js 16: konwencja "proxy" (dawniej "middleware").
export async function proxy(req: NextRequest) {
  const zalogowany = await weryfikujToken(req.cookies.get(COOKIE)?.value);
  const { pathname } = req.nextUrl;
  const toLogin = pathname === "/admin/login";

  // Próba wejścia do panelu bez ważnej sesji → przekierowanie na logowanie.
  if (!toLogin && !zalogowany) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("powrot", pathname);
    return NextResponse.redirect(url);
  }

  // Zalogowany na stronie logowania → prosto do panelu.
  if (toLogin && zalogowany) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
