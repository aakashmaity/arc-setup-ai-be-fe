# Frontend

Next.js App Router application with the shared `skyloom-ui` workspace, Tailwind v4, Radix-based controls, TanStack Table v9, and Recharts v3.

```sh
npm install
npm run dev
```

- `/`: component gallery, search, live previews, usage snippets, light/dark/system/sepia themes, typography profiles, and design tokens.
- `/#data-table`: searchable paginated table with draggable columns, pinning, and a left column-management drawer.
- Every catalog card has a Playground tab with live variant/state controls, option comparison, reset, narrow previews, and copyable configuration code. Motion controls support System, Reduced, and None.
- `/analytics`: synthetic AI analytics dashboard with operational filters, ten chart examples, and a paginated request log.

The root route renders the component catalog directly. Legacy `/design-system` URLs redirect to the new routes. The ecommerce application remains planned in PLAN.md.

## Validation

```sh
npm run check
npm run build
npm run test:browser
```

Browser tests start the production build on port 3100 and use installed Microsoft Edge in headless mode at mobile, tablet, and laptop widths. Change the Playwright channel if Edge is unavailable. Screenshots and test output go into ignored `.checks/`.

See [sky-ui documentation](packages/sky-ui/README.md) for imports and token conventions, and [AI analytics research](docs/ai-analytics.md) for metric definitions, sources, and integration limits. All analytics data and prices are synthetic; no backend telemetry is connected.

See [advanced UI research and coverage](docs/advanced-ui-research.md) for Aceternity, shadcn, and Vercel AI references, implemented behavior, and validation boundaries.

## Deploy the website

Import `aakashmaity/arc-setup-ai-be-fe` into Vercel and set **Root Directory** to `frontend`. Use the **Next.js** framework preset and the default install command. Build command: `npm run build`; leave the output directory at its default.

The component catalog is served at `/` and analytics at `/analytics`. No application API keys are required. The standalone `skyloom-ui` repository contains the npm library; deploy this frontend repository to host the catalog.

After deployment, set the package's `homepage` field to the deployed HTTPS URL and publish a new npm version to update its npm homepage link.
