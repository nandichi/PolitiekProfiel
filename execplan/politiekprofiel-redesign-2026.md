# Rebuild the public PolitiekProfiel interface as Publieke Meetstaat

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` are updated while implementation proceeds. This repository has no checked-in PLANS.md; this plan follows the ExecPlan methodology loaded by the implementing agent.

## Purpose / Big Picture

After this change every public PolitiekProfiel route uses one recognisable visual and interaction system: a cool mineral canvas, near-black ink, a signal accent, hard rules, measurement marks, five independent political axes, self-hosted type, accessible controls and compact responsive layouts. The homepage becomes the requested Publieke Meetstaat composition, active quizzes become focused measuring instruments, paid gates explain the purchase before Stripe, results present five independent axes without a total score, and content routes read as dossiers or ruled indexes rather than card catalogues. Existing routes, metadata, data, scoring, persistence keys, APIs and privacy boundaries remain intact.

The result is observable by running the application and opening the deep-audit routes listed in `docs/REDESIGN-2026.md`. Automated evidence comes from the seven redesign contract tests, the complete Vitest suite, TypeScript, ESLint, a production build, byte and diff scans, and a rerunnable Playwright responsive audit across all required viewports.

## Progress

- [x] (2026-09-22 23:19Z) Read `AGENTS.md`, `CLAUDE.md`, `docs/REDESIGN-2026.md`, the red contract test, package manifest and the main public layout, homepage, navigation, footer, quiz and checkout code.
- [x] (2026-09-22 23:19Z) Confirmed branch `redesign/politiekprofiel-2026`, commit `4615f27`, and a clean worktree before implementation.
- [x] (2026-09-22 23:19Z) Confirmed the existing `src/redesign-contract.test.ts` is the required red-first contract supplied by the parent; its prior run produced seven expected failures.
- [x] Implemented the visual foundation, locally hosted Cabinet Grotesk and Switzer assets, shared system primitives, route-aware public chrome, bounded motion runtime and safe checkout error.
- [x] Recomposed the homepage and migrated quiz, paid gate, results, forms, charts and content/index/detail/tool families. The focused `src/redesign-contract.test.ts` passed seven times: foundation, homepage, quiz, paid-gate, results, content and adjacent surfaces, each `7/7`.
- [x] Added and exercised `pnpm qa:responsive`: 20 public audit routes x 9 viewports, plus menu Escape, quick-quiz keyboard answer and contact-form smoke checks. Final run: `180/180` passed with zero failures against a built local server.
- [x] Ran release gates: byte scan passed for 111 changed/new files, complete Vitest `75 files / 261 tests` passed, TypeScript passed, ESLint had zero errors, build passed and `git diff --check` passed.
- [x] Recorded exact results and limitations below; worktree remains uncommitted for independent review.

## Surprises & Discoveries

- Observation: The repository already has a broad editorial/Tailwind layer and Motion 12, but its public contract is still built around the old paper/navy/terra palette and Inter/Fraunces.
  Evidence: `src/app/(frontend)/globals.css` defines the legacy tokens and `src/app/(frontend)/layout.tsx` imports both fonts.

- Observation: The active quiz currently exposes five dimension progress segments, contrary to the redesign requirement for one primary question progress bar.
  Evidence: `QuizEngine` renders `QuizProgressDots` with per-dimension totals in the sticky status bar.

- Observation: Checkout error handling logs a structured internal summary correctly but also returns the internal message to the visitor.
  Evidence: the checkout catch block returns `Checkout-fout: ${summary.message}`; the contract requires a generic `CHECKOUT_UNAVAILABLE` response.

## Decision Log

- Decision: Preserve all behavioural contracts and use shared semantic CSS/system components to migrate the route fleet, then make template-specific composition changes where the brief names a distinct family.
  Rationale: This gives all public routes a coherent system without risky changes to political data, scoring, URLs, metadata or API payloads.
  Date/Author: 2026-09-22 / Hermes Agent

- Decision: Use `next/font/local` with self-hosted Cabinet Grotesk and Switzer variable WOFF2 assets plus the existing Google-hosted-at-build IBM Plex Mono integration.
  Rationale: It matches the binding font brief, avoids runtime font requests and keeps the data face already used by the application.
  Date/Author: 2026-09-22 / Hermes Agent

- Decision: Mount GSAP and Lenis through an explicit route allowlist client component, with reduced-motion bypass and no runtime on quiz, result, embed, checkout/form-heavy routes.
  Rationale: The restriction must be enforced by code rather than relying on callers to remember it.
  Date/Author: 2026-09-22 / Hermes Agent

- Decision: Do not commit during implementation even though generic ExecPlan guidance recommends frequent commits.
  Rationale: The task explicitly requires an uncommitted worktree for independent parent review.
  Date/Author: 2026-09-22 / Hermes Agent

## Outcomes & Retrospective

Implemented without a commit, push or deploy. The resulting public system has a unified canvas/ink/rule/signal vocabulary, self-hosted free fonts under `public/fonts`, semantic ruled/dossier/five-axis primitives, responsive public chrome and a strict motion runtime. GSAP and Lenis are both code-gated by the route allowlist in `src/components/motion/public-motion-policy.ts`; they are disabled for reduced motion and excluded from quiz/result/embed/checkout/form-heavy routes.

Verification evidence: the parent contract passed 7/7 in each of seven vertical slice invocations; complete Vitest passed 75 files and 261 tests; `pnpm exec tsc --noEmit` exited 0; `pnpm lint` exited 0 with two pre-existing warnings in `.work-ai-review`; `pnpm build` generated all 413 static pages; `pnpm qa:bytes` and `git diff --check` passed. The built local server was tested by Playwright via `pnpm qa:responsive -- --base-url http://127.0.0.1:3417`, covering 180 route/viewport combinations with 180 passes and zero failures.

Limitations: the audit intentionally did not create a Stripe Checkout session, submit production contact traffic, or use a real customer result ID. Parent review should live-check authenticated payment completion/webhook return handling and a representative stored result URL in a non-production-safe environment. The locally reachable API documentation emits its known 405 documentation fetch warning, which the audit labels as an expected endpoint contract rather than a UI runtime error.

## Context and Orientation

The public Next.js application lives in `src/app/(frontend)`. Its root layout in `src/app/(frontend)/layout.tsx` applies fonts, metadata, JSON-LD, `SiteHeader`, `SiteFooter` and `WebMcpProvider`. Global tokens and shared utility classes live in `src/app/(frontend)/globals.css`. Thirty-two public route templates under this route group consume components from `src/components`.

The homepage is `src/app/(frontend)/page.tsx`. The dynamic quiz page `src/app/(frontend)/quiz/[tier]/page.tsx` validates paid entitlement before rendering `src/components/QuizEngine.tsx`; `QuizEngine` owns the existing localStorage resume key, adaptive-question flow and auto-advance behaviour and must retain those contracts. Result presentation starts in `src/app/(frontend)/r/[id]/page.tsx` and composes the visualisation and result components under `src/components/result` plus `DimensionBar`, `MiniVector` and `ScatterPlot`. Content, dossier, index and interactive tool routes share `Container`, `Kicker`, `Section`, `StickyIndex` and global utility classes.

The seven contract tests are in `src/redesign-contract.test.ts`. They assert the semantic token/font/home/header/motion/checkout minimum. They are necessary but not sufficient: the browser audit and complete release gates prove the broader migration.

The protected behavioural files listed in `docs/REDESIGN-2026.md` are not to be edited except the explicitly permitted checkout error normalisation in `src/app/api/stripe/checkout/route.ts`. No `.env` file may be read. No production deployment or external data mutation is part of this plan.

## Plan of Work

First replace the public foundation. Add local font assets and configure `next/font/local`; replace old color tokens with the role-based contract; add the fifteen/ten/five-column grid, ruled surfaces, accessible form/button/focus styles, reduced-motion handling and semantic compatibility classes needed by existing templates. Migrate `Container`, `Kicker`, `Section`, `StickyIndex`, `SiteHeader` and `SiteFooter`. Add new system and brand primitives for measure lines, markers, ruled rows, dossier shells and page introductions. Add GSAP and Lenis dependencies and mount them only through a route allowlist for the homepage and method methodology story.

Then implement vertical page-family slices. Recompose the homepage around the dark full-width proposition, neutral five-line instrument, asymmetric product selector, editorial sequence, five-axis rows and trust block. After that, refactor quiz presentation and paid gate while preserving logic. Next align results and all named visualisations to one line/marker/label grammar and keep controls available. Then apply dossier shells and ruled indexes to content, legal, hubs, parties, politicians and technical docs, and align tools/forms with the same controls and responsive rules. Run the focused contract after each slice.

Finally add a project-owned Playwright audit script under `tests/` that can start from a configurable local base URL, enumerate the required deep-audit routes and nine viewports, and emit machine-readable failures for overflow, out-of-bounds content, mobile hit-target size, console/page errors, reduced-motion hidden content and route markers. Include focused click-through and keyboard checks where local data permits. Start a real local production server on an unused port, run the audit, repair discovered regressions, then run all release gates.

## Concrete Steps

All commands run from `C:\Users\Naoufal\GitHub\PolitiekProfiel`.

Install the two bounded motion dependencies without changing unrelated versions:

    pnpm add gsap lenis

Run the existing focused test after every vertical slice:

    pnpm vitest run src/redesign-contract.test.ts

Start and audit the built application using the scripts added to `package.json`:

    pnpm build
    pnpm start -- --port 3417
    pnpm qa:responsive -- --base-url http://127.0.0.1:3417

Run final gates in this order so source encoding failures are caught before expensive compilation:

    pnpm qa:bytes
    pnpm test
    pnpm exec tsc --noEmit
    pnpm lint
    pnpm build
    git diff --check

The exact command names may be adjusted to match the implemented rerunnable scripts, but `package.json` must expose a clear browser/responsive QA entry and the final report must quote the real commands and outputs.

## Validation and Acceptance

Acceptance requires all seven tests in `src/redesign-contract.test.ts` to pass. The complete Vitest suite must pass with no newly introduced product-code lint warnings. `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` and `git diff --check` must succeed. A byte scan must report no NUL, UTF-8 BOM or U+2028/U+2029 in changed text files, and visible copy added by this implementation must not contain em dash or en dash characters.

The browser audit must request all 20 deep-audit routes from the brief at every required viewport: 320x700, 360x800, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1440x900 and 1920x1080. Each reachable page must have a successful status, a recognisable DOM marker, zero horizontal document overflow, no non-scrollable visible element outside its container, no console or page errors, and mobile interactive targets at least 44 pixels where the control is visible. Reduced motion must keep content visible. Keyboard checks must cover the header/mega menu/mobile menu, quiz controls, forms and dialogs. Result routes may use only local synthetic fixtures and must never inspect customer results.

The Quick flow, InfoDrawer, Turing tool, coalition tool, form states and result controls are click-tested where their dependencies can run locally without reading secrets. Any environmental limitation is recorded exactly rather than worked around by changing product architecture.

## Idempotence and Recovery

Package installation, tests and audits are rerunnable. Font downloads are checked by file type and size before use. The responsive audit accepts a base URL rather than owning a hard-coded process, so stale ports can be avoided. No database migrations, production requests, secrets, commits, pushes or deploys are performed. If a slice regresses behaviour, use the focused test or browser reproduction, revert only that slice and reapply a smaller semantic change.

## Artifacts and Notes

Initial repository state:

    branch: redesign/politiekprofiel-2026
    commit: 4615f27
    worktree: clean
    focused test: seven expected failures already observed by parent before implementation
    baseline: 217 tests passing, TypeScript passing, lint zero errors and two pre-existing .work-ai-review warnings

## Interfaces and Dependencies

`src/components/motion/PublicMotionRuntime.tsx` (or an equivalently named module) must remain a client-only boundary. It receives no private data, reads `usePathname()`, enables Lenis only for an explicit marketing/content allowlist, and enables the one GSAP methodology/home story without hiding server-rendered content. It tears down both runtimes on route change and returns no visible wrapper.

System primitives under `src/components/system/` expose composable presentational interfaces for ruled rows, five-line measurements, page/dossier scaffolding and annotated metadata. They accept normal React children and `className` values and do not own political calculations.

Brand visualisations under `src/components/brand/` render five independent neutral lines with shape-distinct markers. They do not label a visitor, calculate an outcome or combine axes into a total.

The responsive audit under `tests/` uses the repository's browser dependency or Playwright installation and takes its base URL from a command argument or environment variable. It produces a nonzero exit code with route, viewport and offender details when a contract fails.

Revision note: 2026-09-22, initial self-contained plan created after repository and brief inspection so implementation can be resumed from this file alone.