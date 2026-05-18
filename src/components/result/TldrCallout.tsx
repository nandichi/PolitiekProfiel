import { Quote } from "lucide-react";

interface TldrCalloutProps {
  text: string;
  /**
   * Optionele kicker boven het citaat. Default geen kicker, zodat de callout
   * dicht op het kicker-label van de sectie kan staan zonder te dupliceren.
   */
  kicker?: string;
  variant?: "default" | "compact";
}

/**
 * Editorial "lede" callout: één zin als kort overzicht boven een langer blok.
 * Staat tussen de sectie-kicker en de full prose, ondersteund door een
 * verticale lijn links en een subtiel anführungs-icoon. Geeft de lezer een
 * eenduidige preview voordat zij beslissen om uit te klappen.
 */
export function TldrCallout({
  text,
  kicker,
  variant = "default",
}: TldrCalloutProps) {
  if (!text) return null;
  const compact = variant === "compact";
  return (
    <aside
      className={
        compact
          ? "border-l-2 border-navy/30 pl-4 py-1 my-3"
          : "border-l-2 border-navy/40 pl-5 py-2 my-5"
      }
    >
      {kicker && !compact && (
        <p className="kicker text-navy mb-2">{kicker}</p>
      )}
      <p
        className={
          compact
            ? "display-italic text-[0.95rem] leading-snug text-ink-2"
            : "display-italic text-lg md:text-xl leading-snug text-ink-2"
        }
      >
        <Quote
          size={compact ? 11 : 13}
          strokeWidth={1.6}
          className="inline-block mr-1.5 -mt-1 text-navy/60"
          aria-hidden
        />
        {text}
      </p>
    </aside>
  );
}
