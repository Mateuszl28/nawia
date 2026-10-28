/**
 * Wstawia dane strukturalne (schema.org) jako <script type="application/ld+json">.
 * Skrypt nie jest wykonywany — to czyste dane dla wyszukiwarek.
 * "<" zamieniamy na sekwencję <, żeby tekst typu "</script>" w nazwie
 * lub opisie produktu nie zamknął znacznika przedwcześnie (JSON pozostaje
 * równoważny).
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
