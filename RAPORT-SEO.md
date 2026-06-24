# Raport audytu SEO — NAWIA (Moon Ritual Jewelry)

- **Wersja:** 2 (po wdrożeniu poprawek)
- **Data audytu:** 2026-06-24
- **Środowisko:** produkcja **http://212.132.124.0:3100** (VPS, Next.js 16, pm2)
- **Metoda:** analiza realnie renderowanego HTML na żywej produkcji dla wszystkich tras + `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, nagłówki HTTP, walidacja JSON-LD.

---

## Ocena ogólna: **92 / 100** — bardzo dobra (↑ z 79/100)

| Obszar | v1 | v2 | Komentarz |
|---|---|---|---|
| Indeksacja (robots, sitemap, 404, canonical) | 8/10 | **10/10** | Kategorie indeksowalne, lastmod, noindex koszyka/zamówienia |
| Metadane (title / description) | 8/10 | **10/10** | Opisy produktów i kategorii wydłużone |
| Dane strukturalne (JSON-LD) | 9/10 | **9/10** | Brak ocen/recenzji (wymaga funkcji) |
| Social / Open Graph | 7/10 | **9/10** | og:image przywrócone; brak baneru 1200×630 |
| Obrazy produktów | 4/10 | **4/10** | Wciąż placeholdery SVG (wymaga zdjęć) |
| Wydajność / Core Web Vitals | 6/10 | **9/10** | ISR (cache) na stronie głównej i produktach |
| Mobile / PWA | 10/10 | **10/10** | viewport, theme-color, manifest, ikony |
| Bezpieczeństwo / zaufanie | 10/10 | **8/10** | Komplet nagłówków; brak HTTPS (nowa uwaga) |

---

## ✅ Naprawione w tej iteracji

| # | Problem (v1) | Status |
|---|---|---|
| 1 | URL-e wskazywały na `localhost` | **Naprawione** — wszystkie adresy używają `http://212.132.124.0:3100` |
| 3 | Strony kategorii nie mogły rankować | **Naprawione** — unikalny `title`, `description` i **canonical per kategoria** (np. `/produkty?kategoria=pierscionki`) |
| 4 | Karty produktów bez `og:image` | **Naprawione** — `og:image` przywrócone na produktach |
| 5 | `force-dynamic` → brak cache | **Naprawione** — **ISR** (`revalidate 1h`) na stronie głównej i produktach + rewalidacja po edycji w panelu |
| 6 | Za krótkie opisy produktów (~66 zn.) | **Naprawione** — opisy ~155 zn. (z `opisDlugi`) |
| 7 | Sitemap bez `lastmod` | **Naprawione** — `lastModified` na wszystkich 14 wpisach |
| 8 | Koszyk/zamówienie indeksowalne | **Naprawione** — `noindex` + wpis w `robots.txt` |
| 11 | Brak własnej strony 404 | **Naprawione** — markowa strona 404 (status HTTP 404) |

Dodatkowo: usunięto z ekranu logowania podpowiedź demo na produkcji; ustawiono losowy `SESSION_SECRET` i mocne hasło administratora.

---

## ✅ Stałe atuty

- Jeden `<h1>` na stronach treściowych, poprawna hierarchia nagłówków.
- Bogaty JSON-LD: `Organization`, `WebSite` + `SearchAction`, `Product` + `Offer` (cena PLN, InStock), `BreadcrumbList`.
- `robots.txt`, `sitemap.xml` (15 URL z datami), `manifest.webmanifest`, `lang="pl"`, `viewport`, `theme-color`, favicon + apple-touch-icon.
- Wyszukiwanie `?q=` ma `noindex` + canonical do `/produkty` (brak cienkich duplikatów w indeksie).
- Nagłówki bezpieczeństwa (CSP, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy) i brak `X-Powered-By`.

---

## 🟠 Pozostałe rekomendacje (wymagają zasobów/funkcji lub decyzji)

### A. Brak HTTPS (nowa uwaga — produkcja na `http://…:3100`)
Google preferuje HTTPS, a przeglądarki oznaczają `http` jako „niezabezpieczone".
**Fix:** podpiąć aplikację pod **nginx** (już działa na :80) jako reverse proxy z certyfikatem **Let's Encrypt** (domena lub subdomena). Wtedy `SESSION_SECRET`/cookie `secure` zadziałają w pełni, a ocena bezpieczeństwa wróci do 10/10.

### B. Realne zdjęcia produktów (najważniejsze dla e-commerce)
Wciąż placeholdery SVG (`<img>`: 0). Brak ruchu z Google Images, `Product.image` = logo.
**Fix:** dodać pole zdjęcia do produktu + upload w panelu, renderować przez `next/image` z opisowym `alt`, użyć URL zdjęcia w JSON-LD i `og:image`.

### C. Recenzje i oceny (`AggregateRating`)
Bez recenzji nie pojawią się gwiazdki w wynikach Google.
**Fix:** system recenzji + `AggregateRating`/`Review` w `Product` JSON-LD.

### D. Dedykowany baner Open Graph 1200×630
Obecnie podgląd społecznościowy używa kwadratowego logo.
**Fix:** wygenerować baner (np. `next/og` `opengraph-image`).

---

## 📋 Lista działań wg priorytetu

- [ ] **(WYS.)** HTTPS przez nginx + Let's Encrypt (domena/subdomena)
- [ ] **(WYS.)** Realne zdjęcia produktów + `next/image` + `alt` + obraz w JSON-LD/OG
- [ ] **(ŚR.)** Recenzje + `AggregateRating` (gwiazdki w Google)
- [ ] **(NISK.)** Baner OG 1200×630
- [x] ~~Domena w adresach kanonicznych/OG/sitemap~~
- [x] ~~Strony kategorii indeksowalne~~
- [x] ~~og:image na produktach~~
- [x] ~~ISR zamiast force-dynamic~~
- [x] ~~Dłuższe opisy produktów~~
- [x] ~~lastmod w sitemapie~~
- [x] ~~noindex koszyka/zamówienia~~
- [x] ~~Własna strona 404~~

---

## Metodyka i pomiary (v2, produkcja)

Sprawdzone trasy: `/`, `/produkty`, `/produkty?kategoria=…`, `/produkty?q=…`, `/produkty/[slug]`, `/koszyk`, `/zamowienie`, `/ulubione`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, strona 404.

Potwierdzone pomiary: canonical kategorii unikalny (`/produkty?kategoria=pierscionki`), `?q=` → `noindex` + canonical `/produkty`, `og:image` obecne na produktach, opis produktu ~155 zn., koszyk/zamówienie `noindex`, `robots.txt` blokuje `/admin`, `/ulubione`, `/koszyk`, `/zamowienie`, sitemap z 14 × `lastmod`, 404 = HTTP 404 + strona marki, strona główna i produkty renderowane jako ISR (cache 1h).
