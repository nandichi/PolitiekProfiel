"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ExternalLink, X } from "lucide-react";
import { type ReactNode } from "react";

interface DrawerSource {
  label: string;
  url: string;
}

export interface InfoDrawerContent {
  statement: string;
  dimensionLabel: string;
  context?: string;
  argumentsFor?: string[];
  argumentsAgainst?: string[];
  sources?: DrawerSource[];
}

interface InfoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: InfoDrawerContent;
}

export function InfoDrawer({ open, onOpenChange, content }: InfoDrawerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence initial={!reduceMotion}>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
                onClick={() => onOpenChange(false)}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-rule-strong bg-canvas-raised sm:w-[520px] lg:w-[560px]"
                initial={reduceMotion ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={reduceMotion ? undefined : { x: "100%" }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 280,
                        damping: 32,
                      }
                }
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-7 h-16 border-b border-rule shrink-0">
                  <p className="kicker">Achtergrond</p>
                  <button
                    type="button"
                    aria-label="Sluiten"
                    onClick={() => onOpenChange(false)}
                    className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
                  >
                    <X size={20} strokeWidth={1.7} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-7 py-8 lg:px-9 lg:py-10">
                  <Dialog.Title asChild>
                    <h2 className="display text-2xl md:text-[1.7rem] leading-tight mb-2">
                      {content.statement}
                    </h2>
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <p className="kicker mb-8">
                      Dimensie · {content.dimensionLabel}
                    </p>
                  </Dialog.Description>

                  {content.context && (
                    <DrawerSection title="Context" number="01">
                      <p className="text-sm text-ink-raised leading-relaxed">
                        {content.context}
                      </p>
                    </DrawerSection>
                  )}

                  {content.argumentsFor && content.argumentsFor.length > 0 && (
                    <DrawerSection title="Argumenten vóór" number="02">
                      <ArgumentList items={content.argumentsFor} side="for" />
                    </DrawerSection>
                  )}

                  {content.argumentsAgainst &&
                    content.argumentsAgainst.length > 0 && (
                      <DrawerSection title="Argumenten tegen" number="03">
                        <ArgumentList
                          items={content.argumentsAgainst}
                          side="against"
                        />
                      </DrawerSection>
                    )}

                  {content.sources && content.sources.length > 0 && (
                    <DrawerSection title="Bronnen" number="04">
                      <ul className="space-y-2.5">
                        {content.sources.map((s, i) => (
                          <li key={i}>
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-11 items-center gap-2 border-b border-rule-strong text-sm no-underline hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
                            >
                              <span>{s.label}</span>
                              <ExternalLink
                                size={12}
                                strokeWidth={1.7}
                                className="shrink-0 translate-y-px"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </DrawerSection>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function DrawerSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-baseline gap-3 mb-3 pb-2 border-b border-rule">
        <span className="index-num text-[0.65rem]">{number}</span>
        <p className="kicker">{title}</p>
      </div>
      {children}
    </div>
  );
}

function ArgumentList({
  items,
  side,
}: {
  items: string[];
  side: "for" | "against";
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((arg, i) => (
        <li key={i} className="flex gap-3 text-sm text-ink-raised leading-relaxed">
          <span
            aria-hidden
            className={`mono text-[0.62rem] tracking-wider shrink-0 mt-1 ${
              side === "for" ? "text-success" : "text-danger"
            }`}
          >
            {side === "for" ? "PRO" : "CON"}
          </span>
          <span>{arg}</span>
        </li>
      ))}
    </ul>
  );
}
