"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, ChevronDown, Plus, Minus } from "lucide-react";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { MeasureRule } from "@/components/system/MeasureRule";
import { cx } from "@/lib/cx";

interface NavLink {
  href: string;
  label: string;
}

interface ExploreColumn {
  kicker: string;
  title: string;
  links: Array<NavLink & { description?: string }>;
}

const EXPLORE_COLUMNS: ExploreColumn[] = [
  {
    kicker: "01",
    title: "Bibliotheek",
    links: [
      {
        href: "/stellingen",
        label: "Stellingen",
        description: "Vragen, context, voor- en tegenargumenten.",
      },
      {
        href: "/ideologieen",
        label: "Ideologieën",
        description: "Zestien stromingen op de vijf dimensies.",
      },
      {
        href: "/woordenboek",
        label: "Woordenboek",
        description: "Politieke termen, helder uitgelegd.",
      },
    ],
  },
  {
    kicker: "02",
    title: "Mensen & partijen",
    links: [
      {
        href: "/politici",
        label: "Politici",
        description: "NL en internationaal, op vijf dimensies.",
      },
      {
        href: "/partijen",
        label: "Partijen",
        description: "Alle Tweede Kamer-fracties, peildatum 14 september 2026.",
      },
      {
        href: "/kabinetten",
        label: "Kabinetten",
        description: "Wat coalities sinds 1994 beloofden en wat er terechtkwam.",
      },
      {
        href: "/landen",
        label: "Landen",
        description: "Korte profielen, regering en context.",
      },
    ],
  },
  {
    kicker: "03",
    title: "Tools",
    links: [
      {
        href: "/coalitie",
        label: "Coalitie-simulator",
        description: "Welke combinatie ligt het dichtst bij jou?",
      },
      {
        href: "/turing-test",
        label: "Turing test",
        description: "Raad welk politiek kamp een retorisch fragment het beste typeert.",
      },
      {
        href: "/evolutie",
        label: "Politieke evolutie",
        description: "Bewaar shareID's en zie verloop over tijd.",
      },
    ],
  },
];

const PRIMARY_LINKS: NavLink[] = [
  { href: "/methodiek", label: "Methodiek" },
  { href: "/vergelijk", label: "Vergelijk" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const pathname = usePathname();

  const megaPanelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  // Capture open-state on pointerDown to make click toggle robust tegen
  // de hover→click race (hover zet open, click zou anders altijd sluiten).
  const wasOpenOnPointerDown = useRef(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Sluit menus bij navigatie. Externe sync (route change → close), geen
    // afgeleide state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileExploreOpen(false);
  }, [pathname]);

  // Sluit mega-menu bij Escape en buitenklik.
  useEffect(() => {
    if (!megaOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    function onClick(e: MouseEvent) {
      const node = containerRef.current;
      if (!node) return;
      if (e.target instanceof Node && !node.contains(e.target)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  // Radix closes the dialog too, but retain an explicit page-level Escape
  // handler so the full-screen mobile navigation cannot trap the keyboard
  // during an exit animation.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const exploreActive = pathname.startsWith("/verkennen") ||
    EXPLORE_COLUMNS.some((c) =>
      c.links.some((l) => pathname.startsWith(l.href)),
    );

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  }, [cancelClose]);

  if (pathname.startsWith("/quiz/")) {
    return (
      <header className="sticky top-0 z-40 border-b border-rule-strong bg-canvas">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="no-underline" aria-label="PolitiekProfiel home">
            <BrandWordmark className="text-lg" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="mono hidden text-[0.64rem] uppercase tracking-[0.14em] text-text-muted sm:inline">
              Actieve meting
            </span>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center border-l border-rule pl-4 text-sm font-semibold text-ink no-underline hover:text-signal-pressed"
            >
              Stoppen
            </Link>
          </div>
        </div>
        <MeasureRule />
      </header>
    );
  }

  return (
    <header
      ref={containerRef}
      className={cx(
        "sticky top-0 z-40 border-b border-rule-strong bg-canvas transition-colors duration-200",
        (scrolled || megaOpen) && "bg-canvas-raised",
      )}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 lg:px-10 h-16 md:h-[72px]">
        <Link href="/" className="no-underline" onMouseEnter={cancelClose}>
          <BrandWordmark className="text-[1.15rem] md:text-[1.25rem]" />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="Hoofdnavigatie"
        >
          <div
            className="relative flex items-center"
            onMouseEnter={() => {
              cancelClose();
              setMegaOpen(true);
            }}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={megaOpen}
              aria-controls={megaPanelId}
              onPointerDown={() => {
                wasOpenOnPointerDown.current = megaOpen;
              }}
              onClick={() => {
                cancelClose();
                setMegaOpen(!wasOpenOnPointerDown.current);
              }}
              onFocus={() => {
                cancelClose();
                setMegaOpen(true);
              }}
              className={cx(
                "inline-flex items-center gap-1.5 text-sm transition-colors outline-none",
                exploreActive || megaOpen
                  ? "text-ink"
                  : "text-text-muted hover:text-ink",
              )}
            >
              Verkennen
              <ChevronDown
                size={14}
                strokeWidth={1.7}
                className={cx(
                  "transition-transform duration-200",
                  megaOpen ? "rotate-180" : "rotate-0",
                )}
              />
            </button>
          </div>

          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={scheduleClose}
              className={cx(
                "text-sm no-underline transition-colors",
                pathname.startsWith(link.href)
                  ? "text-ink"
                  : "text-text-muted hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quiz/standard"
            onMouseEnter={scheduleClose}
            className="btn btn-primary text-[0.82rem] py-2.5 px-4"
          >
            Kies je quiz
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Menu openen"
              className="lg:hidden inline-flex min-h-11 min-w-11 items-center justify-center -mr-2 text-ink"
            >
              <Menu size={20} strokeWidth={1.7} />
            </button>
          </Dialog.Trigger>
          <AnimatePresence>
            {mobileOpen && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild>
                  <motion.div
                    className="fixed inset-0 z-50 bg-ink"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild onEscapeKeyDown={() => setMobileOpen(false)}>
                  <motion.div
                    data-mobile-menu
                    className="fixed inset-0 z-50 flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-y-auto bg-ink text-canvas"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 32,
                    }}
                  >
                    <Dialog.Title className="sr-only">Navigatie</Dialog.Title>
                    <div className="flex items-center justify-between px-6 h-16 border-b border-canvas/25">
                      <BrandWordmark className="text-lg" inverted />
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label="Menu sluiten"
                          className="inline-flex min-h-11 min-w-11 -mr-2 items-center justify-center text-canvas/70 hover:text-focus"
                        >
                          <X size={20} strokeWidth={1.7} />
                        </button>
                      </Dialog.Close>
                    </div>
                    <nav
                      className="flex-1 px-6 py-7 flex flex-col overflow-y-auto text-canvas"
                      aria-label="Mobiele navigatie"
                    >
                      <p className="kicker mb-5 text-canvas/60">Navigatie</p>
                      <ul className="border-t border-canvas/25">
                        <MobileExploreItem
                          open={mobileExploreOpen}
                          onToggle={() =>
                            setMobileExploreOpen((v) => !v)
                          }
                          index={1}
                        />
                        {PRIMARY_LINKS.map((link, i) => (
                          <li
                            key={link.href}
                            className="border-b border-canvas/25"
                          >
                            <Link
                              href={link.href}
                              className="flex items-baseline justify-between py-4 no-underline"
                            >
                              <span className="display text-[1.55rem] leading-none text-canvas">
                                {link.label}
                              </span>
                              <span className="index-num text-xs text-canvas/60">
                                {String(i + 2).padStart(2, "0")}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/quiz/standard"
                        className="btn btn-primary mt-8"
                      >
                        Kies je quiz
                        <ArrowRight size={16} strokeWidth={1.8} />
                      </Link>
                    </nav>
                    <div className="px-6 py-5 border-t border-canvas/25">
                      <p className="mono text-[0.65rem] uppercase tracking-[0.14em] text-canvas/60">Geen tracking · Geen reclame</p>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>

      <MeasureRule />

      {/* Mega-menu paneel (desktop) */}
      <AnimatePresence>
        {megaOpen && (
          <DesktopMegaMenu
            id={megaPanelId}
            pathname={pathname}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onClose={() => setMegaOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

interface DesktopMegaMenuProps {
  id: string;
  pathname: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

function DesktopMegaMenu({
  id,
  pathname,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: DesktopMegaMenuProps) {
  return (
    <motion.div
      id={id}
      role="region"
      aria-label="Verkennen menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ y: -8, clipPath: "inset(0 0 100% 0)" }}
      animate={{ y: 0, clipPath: "inset(0 0 0% 0)" }}
      exit={{ y: -8, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      className="hidden lg:block absolute inset-x-0 top-full border-t border-rule-strong overflow-hidden"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-10">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-3">
            <p className="kicker">Verkennen</p>
            <p className="display mt-3 text-[1.6rem] leading-tight text-ink">
              Alles wat het kompas voedt.
            </p>
            <p className="mt-4 text-sm text-ink-raised max-w-xs leading-relaxed">
              Stellingen, ideologieën, mensen, partijen, landen en tools:
              doorbladerbaar en uitlegbaar.
            </p>
            <Link
              href="/verkennen"
              onClick={onClose}
              className="mt-6 inline-flex items-center gap-2 text-sm text-ink no-underline border-b border-ink/40 hover:border-ink pb-0.5"
            >
              Bekijk overzicht
              <ArrowRight size={14} strokeWidth={1.8} />
            </Link>
          </div>

          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-8">
            {EXPLORE_COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="index-num text-[0.7rem]">
                    {col.kicker}
                  </span>
                  <span
                    aria-hidden
                    className="block h-px w-5 bg-rule-strong translate-y-[-2px]"
                  />
                  <span className="kicker">{col.title}</span>
                </div>
                <ul className="space-y-3">
                  {col.links.map((link) => {
                    const active = pathname.startsWith(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={cx(
                            "group block no-underline border-b border-transparent pb-2",
                            active && "border-rule",
                          )}
                        >
                          <span
                            className={cx(
                              "display text-[1.15rem] leading-tight transition-colors",
                              active
                                ? "text-signal"
                                : "text-ink group-hover:text-signal",
                            )}
                          >
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="mt-1 block text-[0.82rem] leading-snug text-text-muted">
                              {link.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface MobileExploreItemProps {
  open: boolean;
  onToggle: () => void;
  index: number;
}

function MobileExploreItem({ open, onToggle, index }: MobileExploreItemProps) {
  return (
    <li className="border-b border-canvas/25">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex min-h-11 items-baseline justify-between py-4 text-canvas"
      >
        <span className="display text-[1.55rem] leading-none text-canvas">
          Verkennen
        </span>
        <span className="flex items-baseline gap-3">
          <span className="index-num text-xs text-canvas/60">
            {String(index).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-5 h-5 text-canvas/60"
          >
            {open ? (
              <Minus size={14} strokeWidth={1.7} />
            ) : (
              <Plus size={14} strokeWidth={1.7} />
            )}
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-1">
              <Link
                href="/verkennen"
                className="mb-4 inline-flex min-h-11 items-center gap-2 border-b border-canvas/50 pb-0.5 text-sm text-canvas no-underline hover:border-focus hover:text-focus"
              >
                Bekijk overzicht
                <ArrowRight size={14} strokeWidth={1.8} />
              </Link>
              <MobileExploreColumns />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function MobileExploreColumns(): ReactNode {
  return (
    <div className="space-y-6">
      {EXPLORE_COLUMNS.map((col) => (
        <div key={col.title}>
          <div className="flex items-baseline gap-3 mb-2.5">
            <span className="index-num text-[0.7rem] text-canvas/60">{col.kicker}</span>
            <span
              aria-hidden
              className="block h-px w-4 bg-canvas/40 translate-y-[-2px]"
            />
            <span className="kicker text-canvas/60">{col.title}</span>
          </div>
          <ul className="space-y-1.5">
            {col.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="display inline-flex min-h-11 items-center text-[1.05rem] leading-tight text-canvas no-underline hover:text-focus"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
