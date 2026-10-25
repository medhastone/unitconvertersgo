# Mobile PageSpeed Insights (PSI) Optimization Plan

## 1. Objective
Resolve all Mobile PageSpeed Insights bottlenecks identified on `/speed/kph-to-meters-per-second` and sitewide across `unitconvertersgo.com` while preserving the existing desktop layout and performance:
- **Eliminate Render-Blocking Google Fonts (~750 ms + 415 ms critical path chain)** & **Reduce LCP Element Render Delay (1,280 ms)**.
- **Fix Cumulative Layout Shift (CLS: 0.052)** caused by the header logo `<Image>` and font swap metric shifts.
- **Reduce Mobile DOM Size (from 1,479 elements to <700 on initial load)** & **Main-Thread Hydration / Forced Reflows (42 ms)** using compact mobile row limits with an instant expand toggle and CSS `content-visibility: auto` on below-the-fold sections.
- **Remove Legacy JavaScript Polyfills (~12 KiB savings)** by targeting modern Baseline browsers (`Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimStart/trimEnd`).

---

## 2. Root Cause Analysis & Architecture Changes

### A. Self-Host Fonts via `next/font/google` (`/app/layout.tsx` & `/app/globals.css`)
- **Problem**: `/app/layout.tsx` currently injects a render-blocking `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />` tag in `<head>`, adding a 750 ms CSS request plus 415 ms chained `.woff2` downloads before the `<h1>` LCP element can render.
- **Solution**:
  - Replace the external Google Fonts `<link>` and `<link rel="preconnect">` tags with `Plus_Jakarta_Sans` and `JetBrains_Mono` from `next/font/google` configured with `display: 'swap'`, `preload: true`, and CSS variables (`--font-jakarta` and `--font-mono`).
  - Bind `--font-sans: var(--font-jakarta)` and `--font-mono: var(--font-mono)` in `/app/globals.css` so fonts are self-hosted from the same origin with automatic `size-adjust` fallback metrics (zero font-induced CLS and zero third-party font network latency).

### B. Fix Header Logo CLS & Forced Reflow (`/components/Navbar.tsx`)
- **Problem**:
  - PSI flagged `<img alt="UnitConvertersGo" width="290" height="48" class="h-9 sm:h-10 md:h-10 lg:h-12 w-auto ...">` as an unsized/shifting image contributing `0.052` CLS to the `<h2 class="text-xl sm:text-2xl font-extrabold...">` below the header.
  - `NavbarSearchPlaceholder` starts a typewriter state timer immediately on mount.
- **Solution**:
  - Wrap the logo `<Image>` in a fixed-dimension/aspect-ratio container (`w-[180px] h-9 sm:w-[205px] sm:h-10 lg:w-[240px] lg:h-12`) with explicit `sizes="(max-width: 640px) 180px, (max-width: 1024px) 205px, 240px"` and `priority` so the browser reserves exact layout space before the image decodes.
  - Reserve fixed heights on the mobile search bar and top navigation row so hydration never shifts elements below `<header>`.

### C. Reduce Mobile Initial DOM Size & Hydration Work (`/components/ConversionPageInteractive.tsx` & `/components/ContinuousConversionChart.tsx`)
- **Problem**:
  - Tool pages render 1,479 DOM nodes on initial paint because reference tables, multi-unit conversion grids, 30+ related converter links, and 8+ FAQ items all render expanded on mobile.
  - Hydration of all below-the-fold interactive nodes causes two long main-thread tasks (102 ms and 70 ms) and a 42 ms forced reflow.
- **Solution (Mobile-Only Compact View + Desktop Unchanged)**:
  - **Quick Reference Table & Continuous Chart**: On mobile viewports, show the first 10 rows initially with a clean **"Show All Rows"** toggle button (while keeping the full table visible on desktop `md:` viewports or when expanded).
  - **Related Converters & Category Grids**: On mobile, display the top 8 most relevant links initially with a **"Show All Converters"** expand toggle so hundreds of nested `<a><span><svg><path>` nodes are not mounted until requested on mobile.
  - **Below-the-Fold CSS Containment**: Apply `content-visibility: auto; contain-intrinsic-size: 0 500px;` via utility class on below-the-fold sections (`#reference-table`, `#worked-examples`, `#faq-section`, `#related-converters`) so mobile browsers skip layout and paint work for offscreen sections during initial LCP render.
  - **Eliminate Forced Reflows**: Avoid reading layout properties (`offsetWidth` / `getBoundingClientRect`) after DOM state mutations during initial mount.

### D. Remove Legacy JavaScript Polyfills (`/package.json`)
- **Problem**: Next.js bundles ~12 KiB of polyfills (`Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimStart`, `trimEnd`) when no modern `browserslist` is defined.
- **Solution**:
  - Add a modern Baseline `browserslist` configuration to `/package.json` targeting `chrome >= 105`, `edge >= 105`, `firefox >= 115`, `safari >= 16`, `ios >= 16` so Next.js SWC skips unnecessary ES6+/Baseline polyfills.

---

## 3. Files to Modify
- `/app/layout.tsx`: Replace external `fonts.googleapis.com` stylesheet link with `next/font/google` (`Plus_Jakarta_Sans`, `JetBrains_Mono`).
- `/app/globals.css`: Wire `--font-jakarta` and `--font-mono` variables and add `.cv-auto` (`content-visibility: auto`) helper for below-the-fold sections.
- `/components/Navbar.tsx`: Fix `<Image>` aspect-ratio sizing and explicit `sizes` to eliminate the `0.052` layout shift.
- `/components/ConversionPageInteractive.tsx`: Add mobile-compact row/link toggles (preserving full desktop rendering) and apply below-the-fold rendering optimizations to cut DOM node count and main-thread TBT.
- `/components/ContinuousConversionChart.tsx`: Default to a compact initial row count on mobile with instant expand while preserving 40/100 rows on desktop and full print/export output.
- `/package.json`: Add modern `browserslist` configuration to drop 12 KiB of legacy JS polyfills.
