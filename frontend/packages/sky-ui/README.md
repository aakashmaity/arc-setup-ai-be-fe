# skyloom-ui

Theme-token-based React components, layouts, data tables, and charts for React 19 and Tailwind CSS v4. Interactive components use Radix primitives for accessible behavior.

## Installation

```bash
npm install skyloom-ui
```

React and React DOM are peer dependencies and must be available in your application.

Import the package stylesheet after Tailwind in your global CSS:

```css
@import "tailwindcss";
@import "skyloom-ui/styles.css";
```

For Next.js, add the package to `transpilePackages` in `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["skyloom-ui"],
};

export default nextConfig;
```

## Quick start

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "skyloom-ui";

export function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get started</Button>
      </CardContent>
    </Card>
  );
}
```

Set the theme and density on the document root:

```html
<html lang="en" data-theme="light" data-density="comfortable">
```

Available themes are `light` and `dark`; densities are `comfortable` (default) and `compact`.

```tsx
import { Button, SelectField, MultiSelect, Card, Dialog, Sheet, ResponsiveGrid } from "skyloom-ui";
```

## Theme and tokens

The design follows [shadcn semantic CSS variables](https://ui.shadcn.com/docs/theming) and [Tailwind v4 theme aliases](https://tailwindcss.com/docs/theme). Foundation values, semantic roles, and component decisions are separated using CSS references. This uses the aliasing principle described by [DTCG](https://www.designtokens.org/tr/2025.10/format/), without maintaining a duplicate JSON token source.

- `src/tokens.css`: OKLCH palette, rem dimensions, typography, spacing, focus/border widths, radii, shadows, layers, opacity, motion, and runtime light/dark and density roles.
- `src/styles.css`: Tailwind inline mappings, static breakpoint tokens, shared state styles, and reduced-motion rules.
- Components: semantic utilities such as `bg-card`, `text-muted-foreground`, `p-panel`, `gap-control`, `h-field`, and `rounded-control`.

No pixel literals or raw palette colors are used in authored components. Foundation dimensions are defined centrally in rem. Zero, percentage/viewport layout, grid counts, and Radix's computed positioning values remain layout behavior. Generated Tailwind CSS and dependency internals are not authored token definitions.

Apply theme and density to the document root so body portals receive the same values:

```tsx
<html lang="en" data-theme="dark" data-density="comfortable">
```

Use `light` or `dark`; use `comfortable` (default) or `compact`. Existing `.dark` works too, but explicit `data-theme="light"` takes precedence. Brand overrides belong after the package stylesheet; override the appropriate `--sky-brand-light` and `--sky-brand-dark` foundation values and verify contrast. This package supplies themes, not preference persistence or a system-theme provider.

## Responsive behavior

| Screen | Token | Default behavior |
| --- | --- | --- |
| Mobile | Base styles | Single-column grid, full-width sheets, stacked dialog actions, touch-size controls |
| Tablet | `tablet:` / 48rem | Two-column grid, constrained dialogs/sheets, optional compact control density |
| Laptop | `laptop:` / 64rem | Three-column grid, centered max-width container |

Breakpoints are defined once in `@theme`; CSS media queries cannot resolve runtime custom properties. Use Container, Stack, and ResponsiveGrid for shared layouts. Inputs use body-size text on mobile, panels scroll within the dynamic viewport, and tabs scroll when needed. Components allow className overrides for intentional composition.

```tsx
<Container>
  <ResponsiveGrid>
    <Card><CardHeader><CardTitle>Product</CardTitle></CardHeader></Card>
  </ResponsiveGrid>
</Container>
```

## Components

- Forms: Button, Input, Textarea, Label, Checkbox, Select (composable parts), SelectField, FormField, MultiSelect, Switch.
- Surfaces: Card and parts, Badge, Alert and parts, EmptyState, Separator.
- Overlays/navigation: Dialog and parts, Sheet and parts, Tabs and parts, Accordion and parts, Tooltip and provider.
- Loading/layout: Skeleton, Spinner, Container, Stack, ResponsiveGrid.
- Data: Avatar, Table, DataTable with pagination/search/page sizes, Progress, Breadcrumb, Pagination.
- Additional overlays: DropdownMenu and Popover.
- Analytics: ChartContainer, ChartTooltipContent, CartesianChart (line/area/bar), DonutChart, ScatterPlot, Heatmap. Chart height, palettes, and emphasis use theme tokens; exact values are available in HTML data tables.

### Paginated data

```tsx
import { DataTable, type DataTableColumn } from "skyloom-ui";

type Item = { id: string; name: string };
const columns: DataTableColumn<Item>[] = [
  { id: "name", header: "Name", cell: row => row.name },
];
// Client component: supply the complete dataset, not a single server page.
<DataTable data={items} columns={columns} getRowId={row => row.id}
  caption="Items" initialPageSize={10} searchText={row => row.name} />;
```

Pagination follows filtering, and page indices are clamped after data shrinks. `loading` and `error` display distinct states. This version does not claim server pagination, sorting, selection, or virtualization.

### Charts

```tsx
import { CartesianChart } from "skyloom-ui";

<CartesianChart title="Token usage" unit="tokens" kind="area" stacked
  data={[{ label: "Monday", input: 1200, output: 400 }]}
  series={[
    { key: "input", label: "Input", color: "chart-1" },
    { key: "output", label: "Output", color: "chart-2" },
  ]} />;
```

Use finite numeric values or null for missing observations; keep units consistent within a Cartesian chart. Supply percentages on a 0–100 scale. Charts include labeled series and data-table alternatives; legend buttons toggle Cartesian series. Donut values must be nonnegative. ScatterPlot currently specializes in cost/quality comparisons with a 0–100 quality axis. Aggregation belongs in app features, not sky-ui.

MultiSelect supports Select all, mixed state, disabled options, and empty options. Select is single-choice; option values must be unique and nonempty, with an empty current value representing no selection. FormField labels a matching child id; connect child aria-describedby to `<id>-error` and aria-invalid when rendering an error. SelectField does this automatically.

Supply DialogTitle/SheetTitle and descriptions in overlays. Label switches and icon-only buttons. Tooltips require TooltipProvider and must not hold essential information available only on hover. Button defaults to type="button"; pass type="submit" explicitly. Button asChild expects one appropriate interactive child, such as a link; native button disabled semantics do not automatically apply to links. Accordion accepts Radix single/multiple modes. Keep business logic out of these wrappers.

## Styles and exports

The package exports its components from `skyloom-ui` and provides two stylesheet entry points:

- `skyloom-ui/styles.css` includes the theme, Tailwind utility mappings, responsive tokens, and shared state styles. Import this stylesheet for normal use.
- `skyloom-ui/tokens.css` contains the design-token CSS variables when you need tokens without the full stylesheet.

The stylesheet registers package component sources for Tailwind CSS v4 class scanning. Load it in your app's global stylesheet so the component styles and utilities are included.

## Development

From the repository's `frontend` directory, install dependencies with `npm install`. Run `npm run check` to type-check the frontend, verify compiled token and responsive styles, and run component interaction tests.
