# Specification: Results and political knowledge centre

**Feature branch:** `main`
**Created:** 2026-09-14
**Status:** Research and implementation in progress

## User value

A person who completes 50 or 80 quiz statements should leave with a thorough, plain-Dutch explanation of their political profile: what the result means, which answers shaped it, which topics are clear or unresolved, and which trade-offs sit behind it. They should be able to explore parties and politicians as a neutral, sourced knowledge centre rather than receive a voting instruction.

## Scope

1. Expand paid standard and extended result pages into a long-form, evidence-led profile.
2. Expand Dutch politician and party pages from short cards into source-backed profiles.
3. Add a quality-first international party catalogue, including the United States and a bounded initial set of other democracies.
4. Preserve the current quick-result paywall, payment flow, report links, privacy headers, answer validation and self-service deletion.

## Non-goals

- Predicting a person’s vote, personality, demographic group or future political behaviour.
- Collecting new tracking data, making results publicly searchable, or showing aggregate customer profiles.
- Claiming that all countries or all political parties are covered.
- Publishing gossip, private details, unverified quotations or unsourced controversy.

## Functional requirements

### R1. Result-page explanation
- Paid result pages show a readable opening synthesis based solely on the result’s ideology match, five dimension scores, theme scores, confidence and submitted answers.
- The opening explains the strongest directions, clear middle positions and answer coverage without treating a profile label as an identity or advice.
- Every detailed insight points back to the relevant dimensions, themes or literal answered statements.
- The extended tier has visibly more depth than the standard tier. It must not fabricate insight where confidence is low.

### R2. Result-page sections
The report supports a layered reading experience with at least these sections:
- a one-minute orientation;
- a profile narrative with explicit caveat;
- an evidence trail from strongest dimensions to representative answered statements;
- a topic-by-topic map that distinguishes clear direction, mixed evidence and insufficient evidence;
- a trade-off or tension section that treats mixed answers as legitimate complexity;
- a reading route with linked ideologies, parties, politicians and sources;
- a method and confidence explainer in plain Dutch.

Additional sections are allowed only when they can be derived from existing answers and are explained transparently.

### R3. Politician profiles
- Every existing politician record can support a richer public page with a concise overview, role and party context, political route or public career timeline where reliably sourced, policy focus, selected public record, position methodology and source list.
- Each page may include a small editorial curiosity only when it is relevant, public, sourced and not sensational or personal gossip.
- Facts susceptible to change carry a review date and source. Profile vectors remain labelled as editorial estimates.

### R4. Party profiles
- Every Dutch party page provides a plain overview, history, leadership, ideology, current parliamentary role, programme themes, voting context when available, internal variety or trade-offs where sourced, and links to primary evidence.
- Programme summaries distinguish what the party proposes from established fact.
- Every party page explicitly says that the page explains positions and is not voting advice.

### R5. International parties
- Add United States party pages for Democrats and Republicans with source-backed history, organisation, current platform context, ideological coalitions and major internal currents.
- Add a bounded first catalogue of parties from selected other democracies. Each record includes country, name, abbreviation, primary website/programme, broad ideology, position vector, review date and at least one evidence source.
- Country selection and catalogue limits are explained on the international overview. Missing countries are not implied to be unimportant.

### R6. Design and accessibility
- Use the current editorial visual system, not a generic dashboard or repeated feature-card grid.
- All content is understandable on 320px to desktop widths with no horizontal overflow.
- Interactions are keyboard operable, visible to assistive technology and do not hide substantive content behind hover-only treatment.
- Long pages offer clear in-page navigation and short summaries without creating duplicate or contradictory copy.

### R7. Privacy and security
- Result content remains capability-link protected, private, no-store and noindex.
- New computation accepts only the loaded result record and static public data. It does not create tracking identifiers, write telemetry or expose raw answers outside the report’s authorised server render.
- Existing result links and legacy question IDs remain compatible.

## Acceptance criteria

1. A standard and extended report visibly explain profile, evidence, themes, uncertainty and trade-offs in plain Dutch; no section claims more than its input supports.
2. Each new published political claim has a visible primary or clearly-labelled contextual source.
3. Dutch politician and party pages include materially richer, structured content and source lists without unsupported personal details.
4. US plus the selected international catalogue render as discoverable, sourced party pages.
5. Unit and regression tests cover new computations, content integrity and page presence.
6. TypeScript, ESLint, Vitest, production build, responsive audit and production route checks pass.
7. Result privacy headers remain in production and a synthetic report can still be created and self-deleted.

## Assumptions

- The current five-axis model remains the product’s explanation framework.
- A quality-first international first release is preferable to a shallow universal catalogue.
- Existing public primary source links can be used directly; no paid-source content will be reproduced.
- This specification will be updated with verified competitor and source research before each content batch is published.
