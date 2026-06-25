import Image from "next/image";

/** Pełne logo marki NAWIA (sygnet + wordmark). Tło pliku jest w kolorze `sand`. */
export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo-transparent.png"
      alt="NAWIA — Moon Ritual Jewelry"
      width={470}
      height={317}
      priority={priority}
      className={className}
    />
  );
}
