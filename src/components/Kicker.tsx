import { type ReactNode } from "react";
import { cx } from "@/lib/cx";

interface KickerProps {
  children: ReactNode;
  number?: string | number;
  className?: string;
}

export function Kicker({ children, number, className }: KickerProps) {
  return (
    <div className={cx("flex items-baseline gap-3", className)}>
      {number !== undefined && (
        <span className="index-num text-[0.72rem]">
          {typeof number === "number"
            ? String(number).padStart(2, "0")
            : number}
        </span>
      )}
      {number !== undefined && (
        <span
          aria-hidden
          className="block h-px w-6 bg-rule-strong translate-y-[-2px]"
        />
      )}
      <span className="kicker">{children}</span>
    </div>
  );
}
