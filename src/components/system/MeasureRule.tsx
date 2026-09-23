import { cx } from "@/lib/cx";

interface MeasureRuleProps {
  className?: string;
  inverted?: boolean;
}

export function MeasureRule({
  className,
  inverted = false,
}: MeasureRuleProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "grid h-px w-full grid-cols-5",
        inverted ? "bg-canvas/20" : "bg-rule",
        className,
      )}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          data-measure-segment={index + 1}
          className={cx(
            "relative border-r last:border-r-0",
            inverted ? "border-canvas/55" : "border-rule-strong",
            index === 2 && (inverted ? "bg-focus" : "bg-signal"),
          )}
        />
      ))}
    </div>
  );
}
