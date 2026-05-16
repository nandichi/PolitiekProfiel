import { type ReactNode } from "react";
import { Container } from "@/components/Container";
import { cx } from "@/lib/cx";

interface SectionProps {
  children: ReactNode;
  id?: string;
  width?: "narrow" | "default" | "wide" | "bleed";
  className?: string;
  bordered?: boolean;
  spacing?: "tight" | "default" | "loose";
}

const spacingClass: Record<NonNullable<SectionProps["spacing"]>, string> = {
  tight: "py-12 md:py-16",
  default: "py-16 md:py-24",
  loose: "py-20 md:py-32",
};

export function Section({
  children,
  id,
  width = "wide",
  className,
  bordered = false,
  spacing = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cx(
        "relative",
        bordered && "border-b border-rule",
        className,
      )}
    >
      <Container width={width} className={spacingClass[spacing]}>
        {children}
      </Container>
    </section>
  );
}
