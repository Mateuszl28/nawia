/** Sygnet marki — księżyc z kryształem, jak w logo NAWIA. */
export function MoonLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path
        d="M 78 22 A 40 40 0 1 0 78 98 A 33 33 0 1 1 78 22 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <g transform="translate(62 60)">
        <polygon
          points="0,-30 9,-17 9,20 0,31 -9,20 -9,-17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line x1="-9" y1="-17" x2="9" y2="-17" stroke="currentColor" strokeWidth="1.2" />
        <line x1="-9" y1="20" x2="9" y2="20" stroke="currentColor" strokeWidth="1.2" />
        <line x1="0" y1="-30" x2="0" y2="31" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>
  );
}
