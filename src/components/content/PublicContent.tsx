import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Kicker } from "@/components/Kicker";
import { cx } from "@/lib/cx";

interface ContentMastheadProps {
  eyebrow: ReactNode;
  code?: string | number;
  title: ReactNode;
  intro?: ReactNode;
  backHref?: string;
  backLabel?: string;
  noteTitle?: ReactNode;
  note?: ReactNode;
  compact?: boolean;
  className?: string;
  titleClassName?: string;
}

/** Shared 5/10/15-column masthead for public content routes. */
export function ContentMasthead({
  eyebrow,
  code,
  title,
  intro,
  backHref,
  backLabel,
  noteTitle = "Publiek dossier",
  note,
  compact = false,
  className,
  titleClassName,
}: ContentMastheadProps) {
  return (
    <header
      className={cx(
        "border-b border-rule-strong pb-10 md:pb-14",
        className,
      )}
      data-content-family="dossier"
    >
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className="mb-8 inline-flex min-h-11 items-center gap-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted no-underline hover:text-signal-pressed"
        >
          <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}

      <div className="grid grid-cols-5 gap-x-4 gap-y-8 md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:gap-x-6">
        <div className="col-span-5 md:col-span-2 lg:col-span-3">
          <Kicker number={code}>{eyebrow}</Kicker>
        </div>

        <div className="col-span-5 min-w-0 md:col-span-8 lg:col-span-8">
          <h1
            className={cx(
              "max-w-[15ch] font-display font-extrabold tracking-[-0.05em] text-ink [text-wrap:balance]",
              compact
                ? "text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.94]"
                : "text-[clamp(2.65rem,7vw,6.4rem)] leading-[0.9]",
              titleClassName,
            )}
          >
            {title}
          </h1>
          {intro ? (
            <div className="mt-7 max-w-[68ch] text-base leading-7 text-ink-raised md:text-lg md:leading-8">
              {intro}
            </div>
          ) : null}
        </div>

        <aside className="col-span-5 border-t border-rule pt-5 md:col-start-3 md:col-span-8 lg:col-start-13 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-signal">
            {noteTitle}
          </p>
          {note ? (
            <div className="mt-3 text-sm leading-6 text-text-muted">{note}</div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Lees de onderdelen als afzonderlijke meetlijnen. Geen ranglijst en
              geen stemadvies.
            </p>
          )}
          <FiveLineRegister className="mt-6" />
        </aside>
      </div>
    </header>
  );
}

export function FiveLineRegister({ className }: { className?: string }) {
  return (
    <div className={cx("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className={cx(
              "block size-1.5 shrink-0 border border-rule-strong",
              index === 0 && "bg-signal border-signal",
              index === 1 && "rounded-full",
              index === 2 && "rotate-45",
              index === 3 && "h-1 w-2.5",
              index === 4 && "size-2 rounded-[1px]",
            )}
          />
          <span className="h-px flex-1 bg-rule" />
        </div>
      ))}
    </div>
  );
}

interface DossierGridProps {
  index?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}

/** One DOM order on mobile, three dossier rails on wide screens. */
export function DossierGrid({
  index,
  children,
  aside,
  className,
}: DossierGridProps) {
  return (
    <div
      className={cx(
        "grid grid-cols-5 gap-x-4 gap-y-10 md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:gap-x-6",
        className,
      )}
    >
      {index ? (
        <div className="col-span-5 md:col-span-10 lg:col-span-3">{index}</div>
      ) : null}
      <main
        className={cx(
          "col-span-5 min-w-0 md:col-span-10",
          index ? "lg:col-span-8" : "lg:col-start-4 lg:col-span-8",
        )}
      >
        {children}
      </main>
      {aside ? (
        <aside className="col-span-5 min-w-0 border-t border-rule pt-6 md:col-span-10 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          {aside}
        </aside>
      ) : null}
    </div>
  );
}

interface DossierNoteProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DossierNote({ label, children, className }: DossierNoteProps) {
  return (
    <div className={cx("border-t border-rule-strong pt-4", className)}>
      <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-signal">
        {label}
      </p>
      <div className="mt-3 text-sm leading-6 text-text-muted">{children}</div>
    </div>
  );
}

interface SectionLeadProps {
  eyebrow: ReactNode;
  code?: string | number;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function SectionLead({
  eyebrow,
  code,
  title,
  description,
  className,
}: SectionLeadProps) {
  return (
    <header
      className={cx(
        "grid grid-cols-5 gap-x-4 gap-y-4 md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:gap-x-6",
        className,
      )}
    >
      <div className="col-span-5 md:col-span-3 lg:col-span-4">
        <Kicker number={code}>{eyebrow}</Kicker>
      </div>
      <div className="col-span-5 min-w-0 md:col-span-7 lg:col-span-8">
        {title ? (
          <h2 className="max-w-[22ch] font-display text-3xl font-extrabold leading-[1] tracking-[-0.035em] text-ink md:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <div className="mt-4 max-w-[68ch] text-sm leading-6 text-ink-raised md:text-base md:leading-7">
            {description}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function RuledList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cx("border-t border-rule-strong divide-y divide-rule", className)}>
      {children}
    </ul>
  );
}

interface RuledLinkProps {
  href: string;
  code?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}

export function RuledLink({
  href,
  code,
  title,
  description,
  meta,
}: RuledLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="group grid min-h-24 grid-cols-5 gap-x-4 gap-y-3 py-5 no-underline md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:gap-x-6 lg:py-6"
      >
        <div className="col-span-1 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.12em] text-text-muted md:col-span-1 lg:col-span-2">
          {code}
        </div>
        <div className="col-span-4 min-w-0 md:col-span-6 lg:col-span-8">
          <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.025em] text-ink transition-colors group-hover:text-signal-pressed md:text-2xl">
            {title}
          </h3>
          {description ? (
            <div className="mt-2 max-w-[68ch] text-sm leading-6 text-ink-raised">
              {description}
            </div>
          ) : null}
        </div>
        <div className="col-start-2 col-span-4 flex items-center justify-between gap-3 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-text-muted md:col-start-auto md:col-span-3 lg:col-span-5">
          <span>{meta}</span>
          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </Link>
    </li>
  );
}
