import { type ReactNode } from "react";
import { cx } from "@/lib/cx";

type Width = "narrow" | "default" | "wide" | "bleed";

const widthClass: Record<Width, string> = {
  narrow: "max-w-[52rem]",
  default: "max-w-[72rem]",
  wide: "max-w-[90rem]",
  bleed: "max-w-[1500px]",
};

export function Container({
  children,
  width = "default",
  className,
  as: As = "div",
}: {
  children?: ReactNode;
  width?: Width;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article" | "main";
}) {
  return (
    <As
      data-system="container"
      className={cx(
        "mx-auto w-full px-4 sm:px-6 lg:px-10",
        widthClass[width],
        className,
      )}
    >
      {children}
    </As>
  );
}
