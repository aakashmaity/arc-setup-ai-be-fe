---
name: sky-ui-tokens
description: Create or update sky-ui components and consuming frontend features using semantic theme tokens, shared wrappers, and mobile/tablet/laptop layouts. Use for this project's UI work, not unrelated design systems.
---

# Sky UI tokens and responsive components

Locate `frontend/packages/sky-ui` (or `packages/sky-ui` when already in frontend). Read its README, `src/tokens.css`, `src/styles.css`, and `src/index.ts` before extending it. Preserve the project's Next.js, React, Tailwind v4, and Radix/shadcn-style composition choices.

## Package boundary

Keep all reusable wrappers in `sky-ui/src/components`. There is no commoncomponents folder or separate package. Export new controls from `src/index.ts`; app features import from `skyloom-ui`. Keep product data, cart logic, and checkout business rules in app features. Reuse wrappers before adding new ones.

## Token contract

- Foundation values live in `tokens.css`; semantic roles reference those values. Components consume semantic roles, not palette literals. Light and dark modes must define matching foreground/background pairs.
- Dimensions use rem-based foundation tokens. No literal pixel values, inline fixed dimensions, arbitrary numeric Tailwind dimensions, or raw colors in authored UI components. Zero, percentages, full viewport sizing, grid counts, and state/data-derived measurements are layout behavior, not new design tokens.
- Prefer named utilities such as `bg-card`, `text-muted-foreground`, `gap-control`, `p-panel`, `h-field`, `rounded-control`, and `shadow-floating`. Reuse existing tokens; introduce a new role only when it has a distinct reusable purpose. Numeric spacing shortcuts such as `p-4` are not this project's convention.
- Map runtime roles to Tailwind v4 using `@theme inline`. Keep alias names distinct from the properties they reference to avoid cycles. Colors, spacing, sizes, type, border/focus widths, radius, shadows, layers, opacity, and motion belong in the token system.
- Set `data-theme="light|dark"` and `data-density="comfortable|compact"` on the document html element so portaled content inherits the same theme. A scoped wrapper alone does not theme body portals. Explicit light overrides a legacy dark class.
- Breakpoint tokens live in the static `@theme` block of `styles.css`; media queries cannot read runtime CSS variables. Do not copy breakpoint literals into components.

## Responsive and accessibility behavior

Use a mobile-first layout. `tablet:` starts at 48rem and `laptop:` at 64rem, as defined by the shared breakpoint tokens. Prefer Container, Stack, and ResponsiveGrid. Allow shrinking (`min-w-0`), wrapping, and overflow where appropriate.

Keep mobile controls at least `min-h-touch`; compact desktop sizes can apply at `tablet:`. Input text uses `text-body` on mobile. Dialog actions stack on mobile; sheets fill mobile width and use a token-based maximum width on tablets/laptops. Never hide essential functionality by viewport.

Use Radix primitives for focus management, Escape handling, keyboard navigation, and ARIA behavior. Dialogs/sheets need titles and descriptions, switches need labels, and tooltips must not be the sole source of essential information on touch devices. Preserve refs, native props, controlled state, and disabled behavior. Respect reduced-motion preferences.

## Validation

From frontend, run `npm run check` after changes. This checks TypeScript, compiles Tailwind, checks token/responsive contracts, and exercises interactive controls. For new behaviors add meaningful interaction tests; do not add snapshots that merely duplicate markup.

When a consuming app and browser tooling are available, inspect mobile, tablet, and laptop widths, zoom/reflow, both themes, both densities, long text, and keyboard focus. CSS compilation and jsdom tests do not establish visual responsiveness; report any browser verification limit accurately.

## Research basis

- [shadcn theming](https://ui.shadcn.com/docs/theming): semantic background/foreground roles with CSS variables.
- [Tailwind theme variables](https://tailwindcss.com/docs/theme): utility namespaces, inline aliases, and static breakpoint tokens.
- [DTCG token format](https://www.designtokens.org/tr/2025.10/format/): references and aliases separate decisions from raw values. This package uses CSS as its source of truth; do not claim DTCG JSON compliance or create a second token source without an actual interchange requirement.
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog): accessible modal composition and keyboard behavior.
