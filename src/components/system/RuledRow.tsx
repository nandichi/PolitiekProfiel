import { type ReactNode } from "react";
import { cx } from "@/lib/cx";

interface RuledRowProps {
  annotation?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function RuledRow({
  annotation,
  children,
  className,
}: RuledRowProps) {
  return (
    <div
      className={cx(
        "grid grid-cols-[minmax(2.5rem,auto)_minmax(0,1fr)] gap-4 border-t border-rule py-4",
        className,
      )}
    >
      <span className="mono text-[0.6875rem] tracking-[0.12em] text-text-muted">
        {annotation}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
