/**
 * Wstawia dane strukturalne (schema.org) jako <script type="application/ld+json">.
 * Skrypt nie jest wykonywany — to czyste dane dla wyszukiwarek.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
