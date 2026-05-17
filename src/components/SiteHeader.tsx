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
        description: "Twaalf stromingen op de vijf dimensies.",
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
        description: "Alle Tweede Kamer-fracties, mei 2026.",
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
        description: "Raad uit welk politiek kamp een citaat komt.",
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
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <header
      ref={containerRef}
      className={cx(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || megaOpen
          ? "bg-paper/90 backdrop-blur-md border-b border-rule"
          : "bg-paper/0 border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 lg:px-10 h-16 md:h-[72px]">
        <Link
          href="/"
          className="display text-[1.15rem] md:text-[1.25rem] font-medium tracking-tight no-underline hover:text-ink"
          onMouseEnter={cancelClose}
        >
          <span className="text-ink">Politiek</span>
          <span className="text-navy">Profiel</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-8"
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
                  : "text-ink-muted hover:text-ink",
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
                  : "text-ink-muted hover:text-ink",
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
                    <nav
                      className="flex-1 px-6 py-7 flex flex-col overflow-y-auto"
                      aria-label="Mobiele navigatie"
                    >
                      <p className="kicker mb-5">Navigatie</p>
                      <ul className="border-t border-rule">
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
                            className="border-b border-rule"
                          >
                            <Link
                              href={link.href}
                              className="flex items-baseline justify-between py-4 no-underline"
                            >
                              <span className="display text-[1.55rem] leading-none text-ink">
                                {link.label}
                              </span>
                              <span className="index-num text-xs">
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
      className="hidden md:block absolute inset-x-0 top-full border-t border-rule shadow-[0_30px_60px_-40px_rgba(14,16,20,0.18)] overflow-hidden"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-10">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-3">
            <p className="kicker">Verkennen</p>
            <p className="display mt-3 text-[1.6rem] leading-tight text-ink">
              Alles wat het{" "}
              <em className="display-italic font-light text-navy">
                kompas
              </em>{" "}
              voedt.
            </p>
            <p className="mt-4 text-sm text-ink-2 max-w-xs leading-relaxed">
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
                                ? "text-navy"
                                : "text-ink group-hover:text-navy",
                            )}
                          >
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="mt-1 block text-[0.82rem] leading-snug text-ink-muted">
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
    <li className="border-b border-rule">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-baseline justify-between py-4"
      >
        <span className="display text-[1.55rem] leading-none text-ink">
          Verkennen
        </span>
        <span className="flex items-baseline gap-3">
          <span className="index-num text-xs">
            {String(index).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-5 h-5 text-ink-muted"
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
                className="inline-flex items-center gap-2 text-sm text-ink no-underline border-b border-ink/40 hover:border-ink pb-0.5 mb-4"
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
            <span className="index-num text-[0.7rem]">{col.kicker}</span>
            <span
              aria-hidden
              className="block h-px w-4 bg-rule-strong translate-y-[-2px]"
            />
            <span className="kicker">{col.title}</span>
          </div>
          <ul className="space-y-1.5">
            {col.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="display text-[1.05rem] leading-tight text-ink no-underline"
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
