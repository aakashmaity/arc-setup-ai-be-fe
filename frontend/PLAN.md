# Minimal ecommerce frontend plan

## Scope

Build a small responsive demo shop called Forma for everyday home essentials. Use Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Lucide icons. This first deliverable is the implementation plan; application code follows separately.

Use an application-based experience: one persistent shopping workspace with feature modules, shared state, and in-context interactions. Next.js provides the app entry point and layout; products, cart, and checkout are features within the app rather than separate page-led experiences.

## Design reference

Use the public Ecommerce UI Kit by Duxica as a starting reference:
- Creator page: https://dribbble.com/shots/22514979-Free-Ecommerce-UI-Kit
- Figma Community: https://www.figma.com/community/file/1282730527197718615/Ecommerce-UI-Kit

The creator page links to this Figma resource. A new editable Figma file has not been created. Adapt the design into an original minimal storefront after inspecting the reference; do not assume rights to reuse its assets.

## Visual direction

- Warm off-white background, charcoal typography, muted olive accent.
- Large product imagery, generous spacing, fine borders, restrained rounded corners.
- Persistent app shell with wordmark, search, category navigation, and cart count. Use a category sidebar on desktop and compact navigation on mobile.
- Mobile-first responsive grid: one column on mobile, two from the tablet token (48rem), and three from the laptop token (64rem). Use shared Container, Stack, and ResponsiveGrid components.
- All controls use semantic tokens from sky-ui, with light/dark themes and comfortable/compact density. No component-level pixel literals or raw color values.
- Clear keyboard focus, labeled inputs, accessible dialogs, and readable contrast.

## Implementation sequence

1. Use frontend as an npm workspace with a single shared UI package, packages/sky-ui. Initialize Next.js inside frontend with TypeScript, App Router, Tailwind, and an @/ import alias. Keep all reusable controls and common wrappers inside sky-ui; features import these instead of duplicating controls. Add further shadcn/ui controls as needed.
2. Define theme tokens, persistent app shell, responsive navigation, and product card. Add 8–12 typed sample products with local images, prices, categories, and stock limits.
3. Build the catalog as the main app workspace with search, category filtering, price sorting, and an empty-results state. Preserve filters and scroll position when opening and closing product details or the cart.
4. Open product details in an accessible side panel on desktop and full-screen sheet on mobile, with image, description, price, quantity selector, and add-to-cart action. Restore focus to the originating product when closed.
5. Implement a cart drawer with quantity updates, removal, subtotal, and empty state. Share cart state across the app and persist it in localStorage with safe hydration and validation of saved data.
6. Implement checkout as a step-based flow within the shopping workspace: contact and shipping, order review, then confirmation. Validate labeled inputs, allow returning to the cart without losing entered information, and use a clearly labeled simulated order action. Do not collect card details or process payments.
7. Verify the production build, TypeScript checks, responsive layouts, keyboard navigation, filtering, cart persistence, stock limits, and checkout flow. Document local setup and demo limitations in README.md.

## Proposed structure

```text
frontend/
  packages/
    sky-ui/
      src/
        components/       # All controls, compositions, and responsive layouts
        lib/utils.ts
        tokens.css        # Foundation values, semantic roles, theme/density
        styles.css
        index.ts
      package.json
  src/
    app/
      page.tsx
      layout.tsx
      globals.css
    components/
      app-shell/
    features/
      catalog/
        catalog-workspace.tsx
        product-card.tsx
        product-detail-sheet.tsx
        catalog-filters.tsx
        products.ts
      cart/
        cart-drawer.tsx
        cart-provider.tsx
      checkout/
        checkout-flow.tsx
        shipping-form.tsx
        order-confirmation.tsx
    providers/app-providers.tsx
    lib/utils.ts
    types/product.ts
  public/images/products/
  skills/sky-ui-tokens/SKILL.md
  PLAN.md
  README.md
```

## Completion criteria

### Shared UI and design-system progress

The Next.js app now serves `/design-system` with interactive examples and `/design-system/analytics` with synthetic AI metrics. Sky UI includes a searchable paginated DataTable, Recharts-based line/area/bar/donut/scatter components, and a heatmap. The metric definitions and research sources are maintained in `docs/ai-analytics.md`. The ecommerce features below remain the next application phase.

A visitor can browse and filter products, inspect a product, add it to the cart, update quantities, reload without losing the cart, and complete a simulated checkout within one continuous app experience. Closing panels preserves catalog context; keyboard focus and mobile navigation work throughout the flow. The app works on phone and desktop widths and builds successfully. Authentication, real payments, backend inventory, and an admin dashboard are outside this small demo scope.
