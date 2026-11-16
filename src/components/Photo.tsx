import Image from "next/image";

/** Cover-fit photograph in a fixed-ratio frame, with a sand tone while loading. */
export function Photo({
  src,
  alt,
  ratio = "4 / 3",
  sizes = "(min-width: 64rem) 50vw, 100vw",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`photo ${className}`} style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
    </div>
  );
}
