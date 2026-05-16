import { type ReactNode } from "react";
import { cx } from "@/lib/cx";

type Width = "narrow" | "default" | "wide" | "bleed";

const widthClass: Record<Width, string> = {
  narrow: "max-w-3xl px-6",
  default: "max-w-5xl px-6",
  wide: "max-w-7xl px-6 lg:px-10",
  bleed: "max-w-[1500px] px-6 lg:px-10",
};

export function Container({
  children,
  width = "default",
  className,
  as: As = "div",
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article" | "main";
}) {
  return (
    <As className={cx("mx-auto w-full", widthClass[width], className)}>
      {children}
    </As>
  );
}
