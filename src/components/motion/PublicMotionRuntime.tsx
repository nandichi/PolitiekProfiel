"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  PUBLIC_MOTION_BLOCKER_SELECTOR,
  getPublicMotionPolicy,
} from "./public-motion-policy";

/**
 * Bounded enhancement layer for public reading routes.
 *
 * Content is rendered before this component runs. The runtime never mounts on
 * quizzes, results, embeds, checkout states, dialogs, forms or interactive
 * tools, and reduced-motion users keep native scrolling.
 */
export function PublicMotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const policy = getPublicMotionPolicy(
      pathname,
      window.location.search.replace(/^\?/, ""),
    );

    if (reducedMotion || (!policy.lenis && !policy.gsap)) return;

    let cancelled = false;
    let destroyLenis: (() => void) | undefined;
    let destroyGsap: (() => void) | undefined;

    async function enhance() {
      if (policy.lenis) {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        const lenis = new Lenis({
          autoRaf: true,
          anchors: true,
          lerp: 0.09,
          smoothWheel: true,
          respectReducedMotion: true,
          prevent: (node) =>
            Boolean(node.closest(PUBLIC_MOTION_BLOCKER_SELECTOR)),
        });
        const syncInteractionState = () => {
          if (document.querySelector(PUBLIC_MOTION_BLOCKER_SELECTOR)) {
            lenis.stop();
          } else {
            lenis.start();
          }
        };
        const interactionObserver = new MutationObserver(syncInteractionState);
        interactionObserver.observe(document.body, {
          attributes: true,
          attributeFilter: ["open", "role"],
          childList: true,
          subtree: true,
        });
        syncInteractionState();
        destroyLenis = () => {
          interactionObserver.disconnect();
          lenis.destroy();
        };
      }

      if (policy.gsap) {
        const { gsap } = await import("gsap");
        if (cancelled) return;

        if (pathname === "/") {
          const intro = gsap.fromTo(
            "[data-home-intro]",
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              stagger: 0.06,
              ease: "power2.out",
              clearProps: "all",
            },
          );
          destroyGsap = () => intro.kill();
          return;
        }

        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const contexts = gsap.utils
          .toArray<HTMLElement>("[data-method-story]")
          .map((element) =>
            gsap.fromTo(
              element.querySelectorAll("[data-method-line]"),
              { scaleX: 0.15, transformOrigin: "left center" },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: element,
                  start: "top 80%",
                  end: "bottom 45%",
                  scrub: 0.35,
                },
              },
            ),
          );
        destroyGsap = () => {
          contexts.forEach((context) => {
            context.scrollTrigger?.kill();
            context.kill();
          });
        };
      }
    }

    void enhance();

    return () => {
      cancelled = true;
      destroyGsap?.();
      destroyLenis?.();
    };
  }, [pathname]);

  return null;
}
