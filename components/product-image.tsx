import type { Produkt } from "@/lib/products";

/**
 * Grafika produktu generowana jako SVG (motyw księżyca i kryształu z logo NAWIA),
 * tonowana kolorem akcentu danego produktu. Dzięki temu sklep działa bez
 * zewnętrznych zdjęć — placeholdery można później podmienić na fotografie.
 */
export function ProductImage({
  produkt,
  className,
}: {
  produkt: Pick<Produkt, "slug" | "nazwa" | "ton">;
  className?: string;
}) {
  const { ton, nazwa } = produkt;
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={nazwa}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`bg-${produkt.slug}`} cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#faf8f3" />
          <stop offset="100%" stopColor="#e3dcce" />
        </radialGradient>
        <linearGradient id={`stone-${produkt.slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ton} stopOpacity="0.95" />
          <stop offset="100%" stopColor={ton} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${produkt.slug})`} />

      {/* Półksiężyc */}
      <path
        d="M 250 90 A 95 95 0 1 0 250 280 A 78 78 0 1 1 250 90 Z"
        fill="none"
        stroke="#9a8255"
        strokeWidth="2.5"
        opacity="0.85"
      />

      {/* Kryształ */}
      <g transform="translate(200 185)">
        <polygon
          points="0,-78 22,-44 22,52 0,80 -22,52 -22,-44"
          fill={`url(#stone-${produkt.slug})`}
          stroke="#7c6740"
          strokeWidth="1.6"
        />
        <line x1="-22" y1="-44" x2="22" y2="-44" stroke="#7c6740" strokeWidth="1.2" opacity="0.6" />
        <line x1="0" y1="-78" x2="0" y2="80" stroke="#faf8f3" strokeWidth="1" opacity="0.5" />
        <line x1="-22" y1="52" x2="22" y2="52" stroke="#7c6740" strokeWidth="1.2" opacity="0.6" />
      </g>

      <text
        x="200"
        y="345"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="15"
        letterSpacing="6"
        fill="#7c6740"
        opacity="0.7"
      >
        NAWIA
      </text>
    </svg>
  );
}
