# Core Web Vitals Audit & Optimization Plan — UnitConvertersGo.com

## Objective
Audit, diagnose, and optimize Core Web Vitals across every route template and generated URL of `https://unitconvertersgo.com` (and the local Next.js 15 App Router production build) to meet or exceed Google's 75th-percentile mobile thresholds:
- **LCP (Largest Contentful Paint):** `<= 2.5s`
- **INP (Interaction to Next Paint):** `<= 200ms`
- **CLS (Cumulative Layout Shift):** `<= 0.1`
- **TTFB (Time to First Byte):** `< 0.8s`
- **Zero Functional or SEO Regression:** Keep all conversion formulas, calculator behavior, URLs, titles, headings, and on-page copy identical.

---

## Phase 1: Full URL Discovery & Template Grouping
We will programmatically extract and catalog every URL from `/app/sitemap.ts`, router directories (`/app/*`), and internal link graphs (`CATEGORIES`, `CONVERSION_CATALOGUE`, `GUIDES`), grouping them into 6 distinct templates:
1. **Template A — Homepage (`/`)**: Hero search with animated prompts, universal converter card, popular tools, and category bento grid (`app/page.tsx`).
2. **Template B — Individual Converter Tool Pages (`/[category]/[slug]`)**: Highest URL volume (`CONVERSION_CATALOGUE` pairs). Renders `ConversionPageInteractive`, dynamic conversion tables, formulas, and related links (`app/[category]/[slug]/page.tsx`).
3. **Template C — Category Hub Pages (`/[category]` & `/conversions/[category]`)**: Renders `CategoryDashboardView` and `TemperatureCategoryView` (`app/[category]/page.tsx`).
4. **Template D — Widget Directory & Customizer Studio (`/widgets`, `/widgets/w/[slug]`, `/embed/[slug]`)**: Renders `WidgetsDirectoryClient`, `WidgetCustomizerClient`, and `EmbedCalculatorWidget`.
5. **Template E — Interactive Utility & Directory Pages (`/case-converter`, `/directory`, `/sitemap`, `/search`)**: Text manipulation tool, searchable full directory, and HTML sitemap.
6. **Template F — Editorial Guides & Legal Pages (`/guides/[slug]`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-use`, `/disclaimer`, `/cookie-policy`)**: Static/SSR content-heavy pages.

---

## Phase 2: Baseline Measurement (Field & Lab Data)
1. **Live Origin & CrUX / PageSpeed Insights Check**:
   - Query live `https://unitconvertersgo.com` endpoints and check CrUX / PageSpeed Insights API availability (flagging URLs without sufficient field traffic as `Lab-Only`).
2. **Local Production Build & Throttled Mobile Lab Audit**:
   - Build and run the production bundle (`next build` + server) and run 3-run median mobile performance checks on representative URLs for each template (Homepage, `/length-converter/cm-to-inches`, `/temperature-converter/celsius-to-fahrenheit`, `/length-converter`, `/widgets`, `/widgets/w/cm-to-inches`, `/case-converter`, `/directory`, `/guides/metric-vs-imperial`), plus a batch check across every generated route in the catalogue.
   - Record baseline LCP, INP/TBT, CLS, TTFB, total transfer weight, JS bundle size, and Lighthouse performance score.

---

## Phase 3: Root-Cause Diagnosis
Based on initial codebase inspection and static analysis, key bottlenecks to verify and fix include:
1. **LCP & Font/CSS Payload (`app/layout.tsx`, `next.config.ts`)**:
   - `Plus_Jakarta_Sans` loads 5 font weights (`400, 500, 600, 700, 800`) and `JetBrains_Mono` loads 4 weights (`400, 500, 600, 700`) globally across every page, increasing critical path font downloads.
   - Missing `optimizePackageImports: ['lucide-react']`, compression settings, and immutable static caching headers in `next.config.ts`.
2. **INP & Main-Thread Long Tasks (`ConversionPageInteractive.tsx`, `CategoryDashboardView.tsx`, `UniversalConverterCard.tsx`, `HeroSearch.tsx`, `EmbedCalculatorWidget.tsx`)**:
   - Synchronous `setState` inside `useEffect` on mount (`ConversionPageInteractive.tsx:340`, `CategoryDashboardView.tsx:186`, `EmbedCalculatorWidget.tsx:60-77`, `lib/search/animated-prompts.ts:143`) causes immediate post-hydration cascading re-renders that block early user interactions.
   - `HeroSearch.tsx` and `animated-prompts.ts` run continuous character-by-character timer intervals (`45ms`–`90ms`) that trigger frequent React re-renders of the search bar on the homepage and category pages.
   - Unmemoized filtering/computation in converter dropdowns, live search autocomplete, and dynamic conversion tables during rapid typing or unit swapping.
   - Heavy below-the-fold client sections hydrated eagerly alongside the primary calculator.
3. **CLS (Layout Stability)**:
   - Dynamic result boxes, history chips, and animated placeholder prompts must maintain strict fixed dimensions (`min-height` / explicit line heights) so hydration and calculations never shift surrounding layout elements.

---

## Phase 4: Targeted Code Fixes (Ordered by Template Impact)
All fixes will preserve exact calculator math, URLs, headings, and copy, committed in logical, revertible git commits:
1. **Commit 1 — Global Font, Bundle & Caching Optimization (`app/layout.tsx`, `next.config.ts`)**:
   - Trim unused font weights, ensure `preload: true` with `adjustFontFallback: true` to eliminate font-swap CLS, enable `experimental.optimizePackageImports: ['lucide-react']`, configure `compress: true`, and add long-lived `Cache-Control` headers for static assets.
2. **Commit 2 — Converter Tool Pages (`/[category]/[slug]`) LCP, INP & CLS Optimization (`components/ConversionPageInteractive.tsx`)**:
   - Eliminate cascading `useEffect` state updates on mount by deriving initial state cleanly.
   - Memoize preset conversion table calculations and unit selector lists with `useMemo` and `useCallback`, and use `startTransition` for non-urgent secondary UI updates during rapid input typing or unit swaps.
   - Lock result container heights (`min-h`) to guarantee `0.000` CLS when switching units or toggling scientific/decimal formats.
3. **Commit 3 — Homepage & Hero Search INP Optimization (`components/HeroSearch.tsx`, `lib/search/animated-prompts.ts`, `components/UniversalConverterCard.tsx`)**:
   - Optimize `useAnimatedPrompts` so typing animations pause immediately on focus/interaction and avoid unnecessary parent re-renders.
   - Debounce/transition search query filtering and memoize `UniversalConverterCard` unit lists and calculations.
4. **Commit 4 — Category Dashboards & Widget Studio Optimization (`components/CategoryDashboardView.tsx`, `components/EmbedCalculatorWidget.tsx`, `components/WidgetsDirectoryClient.tsx`)**:
   - Remove synchronous `setState` in `useEffect` hooks (`CategoryDashboardView` and `EmbedCalculatorWidget`), memoize filtered directory grids, and reserve stable container heights.

---

## Phase 5: Verification & Final Engineering Report
1. Re-run the performance suite across all templates and batch-verify all generated URLs to confirm post-fix LCP, INP, CLS, TTFB, and bundle weights.
2. Verify zero functional regressions across at least 3 converter pages (typing values, swapping units, table row click-to-convert, and mobile responsiveness) plus SEO/accessibility compliance (canonical tags, meta tags, indexability, heading hierarchy).
3. Deliver the complete 5-part Core Web Vitals Engineering Report:
   - Before/After URL & Template summary table
   - Ranked root-cause issues and number of pages affected
   - Detailed changelog by file, commit, and measured impact
   - Infrastructure/external recommendations (CDN, edge caching, CrUX field collection)
   - Weekly Google Search Console & PageSpeed Insights monitoring plan with exact 28-day field data re-check date (**November 19, 2026**).
