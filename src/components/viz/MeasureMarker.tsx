import type { DimensionId } from "@/lib/dimensions";
import { cx } from "@/lib/cx";

export type MeasureMarkerShape =
  | "circle"
  | "square"
  | "diamond"
  | "triangle"
  | "cross";

const SHAPES: Record<DimensionId, MeasureMarkerShape> = {
  economic: "circle",
  social: "square",
  civil: "diamond",
  governance: "triangle",
  trust: "cross",
};

export function dimensionMarkerShape(
  dimension: DimensionId,
): MeasureMarkerShape {
  return SHAPES[dimension];
}

interface MeasureMarkerProps {
  shape: MeasureMarkerShape;
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Shared marker vocabulary for every political measurement.
 * Shape remains legible when colour is unavailable.
 */
export function MeasureMarker({
  shape,
  className,
  size = 14,
  title,
}: MeasureMarkerProps) {
  const accessible = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={cx("block overflow-visible", className)}
      focusable="false"
      {...accessible}
    >
      {shape === "circle" ? (
        <circle cx="8" cy="8" r="5" fill="currentColor" />
      ) : null}
      {shape === "square" ? (
        <rect
          x="3"
          y="3"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      ) : null}
      {shape === "diamond" ? (
        <path d="M8 1.8 14.2 8 8 14.2 1.8 8Z" fill="currentColor" />
      ) : null}
      {shape === "triangle" ? (
        <path d="M8 2 14 13H2Z" fill="currentColor" />
      ) : null}
      {shape === "cross" ? (
        <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="square">
          <path d="M3 3 13 13" />
          <path d="m13 3-10 10" />
        </g>
      ) : null}
    </svg>
  );
}
