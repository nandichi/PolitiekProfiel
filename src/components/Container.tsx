import { type ReactNode } from "react";

type Width = "narrow" | "default" | "wide";

const widthClass: Record<Width, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export function Container({
  children,
  width = "default",
  className = "",
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
}) {
  return (
    <div className={`mx-auto px-6 ${widthClass[width]} ${className}`}>
      {children}
    </div>
  );
}
