"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cx } from "@/lib/cx";

const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "/methodiek", label: "Methodiek" },
  { href: "/vergelijk", label: "Vergelijk" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Sluit drawer bij navigatie. Dit is een gewenste extern-naar-React sync
    // (route change → close), niet een derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cx(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-rule"
          : "bg-paper/0 border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 lg:px-10 h-16 md:h-[72px]">
        <Link
          href="/"
          className="display text-[1.15rem] md:text-[1.25rem] font-medium tracking-tight no-underline hover:text-ink"
        >
          <span className="text-ink">Politiek</span>
          <span className="text-navy">Profiel</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cx(
                "text-sm no-underline transition-colors",
                pathname.startsWith(link.href)
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quiz/standard"
            className="btn btn-primary text-[0.82rem] py-2.5 px-4"
          >
            Start de quiz
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Menu openen"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-ink"
            >
              <Menu size={20} strokeWidth={1.7} />
            </button>
          </Dialog.Trigger>
          <AnimatePresence>
            {mobileOpen && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild>
                  <motion.div
                    className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <motion.div
                    className="fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm bg-paper border-l border-rule-strong flex flex-col"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 32,
                    }}
                  >
                    <Dialog.Title className="sr-only">Navigatie</Dialog.Title>
                    <div className="flex items-center justify-between px-6 h-16 border-b border-rule">
                      <span className="display text-lg">
                        <span className="text-ink">Politiek</span>
                        <span className="text-navy">Profiel</span>
                      </span>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label="Menu sluiten"
                          className="w-10 h-10 -mr-2 inline-flex items-center justify-center text-ink-muted hover:text-ink"
                        >
                          <X size={20} strokeWidth={1.7} />
                        </button>
                      </Dialog.Close>
                    </div>
                    <nav className="flex-1 px-6 py-8 flex flex-col">
                      <p className="kicker mb-6">Navigatie</p>
                      <ul className="space-y-1">
                        {NAV_LINKS.map((link, i) => (
                          <li
                            key={link.href}
                            className="border-b border-rule last:border-b-0"
                          >
                            <Link
                              href={link.href}
                              className="flex items-baseline justify-between py-4 no-underline"
                            >
                              <span className="display text-[1.6rem] leading-none text-ink">
                                {link.label}
                              </span>
                              <span className="index-num text-xs">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/quiz/standard"
                        className="btn btn-primary mt-10"
                      >
                        Start de quiz
                        <ArrowRight size={16} strokeWidth={1.8} />
                      </Link>
                    </nav>
                    <div className="px-6 py-5 border-t border-rule">
                      <p className="kicker">Geen tracking · Geen reclame</p>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>
    </header>
  );
}
