import { cx } from "@/lib/cx";

interface BrandWordmarkProps {
  className?: string;
  inverted?: boolean;
}

export function BrandWordmark({
  className,
  inverted = false,
}: BrandWordmarkProps) {
  return (
    <span
      aria-label="PolitiekProfiel"
      className={cx(
        "display inline-flex items-baseline font-extrabold tracking-[-0.035em]",
        inverted ? "text-canvas" : "text-ink",
        className,
      )}
    >
      <span aria-hidden="true">Politiek</span>
      <span
        aria-hidden="true"
        className={inverted ? "text-focus" : "text-signal"}
      >
        Profiel
      </span>
    </span>
  );
}
