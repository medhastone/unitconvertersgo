# Sitewide SEO Metadata, Social Cards & Structured Data Standardization

This plan standardizes titles, meta descriptions, OpenGraph/Twitter social images, and Schema.org JSON-LD across all pages on `unitconvertersgo.com`, synchronizes live category and converter counts dynamically from the conversion catalogue, and delivers a complete Old vs. New metadata audit CSV and interactive review dashboard.

---

## User Review & Confirmed Decisions

> [!IMPORTANT]
> The following architectural and SEO decisions incorporate your confirmed preferences from the clarification phase:

- **Confirmed Decision 1 — Tool Page Title Format (Exact Template Without Appended Brand Suffix)**: Every unit conversion tool page will render the exact standardized title pattern `[A] to [B] Converter – Free & Instant ([a] to [b])` using an absolute title definition so no trailing `| UnitConvertersGo` suffix is appended on tool pages.
- **Confirmed Decision 2 — Old vs. New Metadata Review CSV & Audit Page**: We will generate a downloadable CSV file at `/seo-metadata-diff.csv` covering all site URLs (Homepage, Category Hubs, Cooking Hubs/Ingredients, Tool Pages, Guides, and Legal/Utility Pages) alongside a dedicated `/seo-audit` review dashboard where you can inspect, filter, search, and download the side-by-side comparison before deploying.
- **Confirmed Decision 3 — Dynamic Category & Converter Counts Everywhere**: All references to category and converter totals across titles, meta descriptions, hero copy, footers, directory badges, and About/Legal pages will dynamically read from `CATEGORIES.length` and `CONVERSION_CATALOGUE.length` so counts are 100% consistent sitewide.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Homepage SEO & Hero Upgrade**: Updates the homepage `<title>` to stay strictly under 60 characters (`UnitConvertersGo – Free Online Unit Converter & Calculator`), pairs it with a high-conversion CTA meta description featuring live category and converter counts, and updates the primary `<h1>` to include **"Free Unit Converter"**.
  2. **Standardized Tool Titles & Truthful Meta Descriptions**: Every converter tool page (`/[category]/[slug].htm`) uses `[A] to [B] Converter – Free & Instant ([a] to [b])` for its `<title>`, `og:title`, and `twitter:title`. Meta descriptions follow the exact formula **Conversion Factor + Benefit + Real Page Features** (e.g., *"1 centimeter = 0.393701 inches. Convert cm to in instantly for free. Includes live calculator, step-by-step formula, 1/16″ tape measure & printable chart."* on length pages, or *"Includes live calculator, step-by-step formula & reference table."* on general pages).
  3. **Build-Time 1200×630 OpenGraph & Twitter Category Cards**: Generates crisp 1200×630 PNG social card images at build time for every measurement category (plus cooking and a default brand card). Each card displays the category/page title, a real conversion example badge, and the `UnitConvertersGo` logo mark, wired into `og:image`, `og:type`, `og:site_name`, and `twitter:image` on every page.
  4. **Zero Meta-Keywords**: Audits and strips any `keywords` metadata properties sitewide.
  5. **Complete JSON-LD Structured Data**: Ensures `BreadcrumbList` is rendered on every page across the site, `WebSite` + `Organization` on the root/homepage, and `WebApplication` (with `applicationCategory: "UtilityApplication"`, `operatingSystem: "All"`, free `Offer`) on all converter tool pages, cooking converters, category hubs, and utility calculators.
  6. **Old vs. New Metadata CSV & `/seo-audit` Review Interface**: Produces a complete CSV mapping every URL's previous title and meta description against its new standardized title, character counts, and meta description.

- **Target Audience / Persona**: Search engine crawlers, social sharing parsers (Slack, X/Twitter, Discord, LinkedIn, iMessage), and everyday users searching for fast, trustworthy unit conversions.
- **Key Value**: Eliminates truncated or inconsistent SERP snippets, guarantees rich 1200×630 social previews with real conversion examples, and provides full pre-deployment visibility via the CSV diff report.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Homepage Experience**: Users land on the homepage and immediately see the updated `<h1>` (**"Free Unit Converter — Convert Units Instantly"**) alongside live category and converter counts that match the directory, navbar, footer, and metadata.
  2. **Social Card Previews (1200×630)**: Sharing any URL previews a high-contrast 1200×630 PNG card tailored to that page's category, displaying the `UnitConvertersGo` brand header & logo icon, the category title, and a highlighted conversion equation box (e.g., `1 m = 3.28084 ft` or `1 kg = 2.20462 lbs`).
  3. **Pre-Deployment SEO Audit Flow (`/seo-audit`)**: Navigating to `/seo-audit` (or clicking the download button for `/seo-metadata-diff.csv`) displays summary metrics (total URLs audited, average title/description length, 100% `og:image` coverage), live search and page-type filtering, character-count badges, and a one-click CSV download.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Clean, high-precision technical authority with deep navy (`#16324F`), precision teal (`#0D9488`), and crisp tabular numerals (`JetBrains Mono`).
  - *1200×630 Social Card Design*: Dark slate-navy canvas (`#0F172A` to `#16324F` subtle gradient) with a teal accent bar, official ruler/scale brand mark, bold white typography for the title, and a monospace conversion example card at the center-bottom.
  - *Audit Table Typography*: `Plus Jakarta Sans` for headings and descriptions paired with `JetBrains Mono` (`tabular-nums`) for URL paths and character-length counters.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Exact Tool Title Template Without Brand Suffix Duplication**
  - *Chosen Approach*: Use Next.js `title: { absolute: "[A] to [B] Converter – Free & Instant ([a] to [b])" }` on tool pages while keeping the brand suffix template for static/legal pages.
  - *Why*: Standard unit pairs like `Centimeters to Inches Converter – Free & Instant (cm to in)` are already 59 characters; omitting the trailing brand suffix keeps the entire `<title>` visible in search results while matching the requested format verbatim.

- **Decision 2: Feature-Accurate Meta Descriptions by Category**
  - *Chosen Approach*: Generate tool meta descriptions dynamically from each pair's exact conversion factor (`1 [from] = [factor] [to]`), a clear benefit (`Convert [a] to [b] instantly for free.`), and only the features that genuinely exist on that page (including the 1/16″ tape measure and printable 1–100 chart on length pages, US/Metric cup tables on cooking pages, and live calculator + step-by-step formula + reference table on all other tool pages).
  - *Why*: Prevents misleading snippet claims while maximizing click-through rate with the exact conversion factor right in the SERP snippet.

- **Decision 3: Build-Time Static 1200×630 Category PNG Generation**
  - *Chosen Approach*: Generate deterministic 1200×630 PNG social card assets for all categories (`/og/category-[id].png`) and `/og-default.png` at build time so every page points to a fast, cacheable static PNG asset.
  - *Why*: Static PNGs load instantaneously for social crawlers (Twitterbot, Slackbot, Facebook External Hit) with zero runtime serverless cold-start latency.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                   Centralized SEO & Metadata Engine                       │
│  • Dynamic Counts: CATEGORIES.length (78) & CONVERSION_CATALOGUE.length   │
│  • Tool Title Builder: "[A] to [B] Converter – Free & Instant ([a] to [b])"│
│  • Meta Description Builder: Exact Factor + Benefit + Verified Features   │
│  • Category OG Image Resolver: /og/category-[slug].png + /og-default.png  │
└───────────────┬───────────────────────────────────────────┬───────────────┘
                │                                           │
                ▼                                           ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────┐
│     Next.js App Router Pages          │   │  Build-Time OG & CSV Pipeline │
│  • Homepage (H1: Free Unit Converter) │   │  • 1200×630 PNG Generator     │
│  • Category Hubs (/[category])        │   │    (Logo + Title + Example)   │
│  • Tool Pages (/[category]/[slug].htm)│   │  • Old vs New Metadata CSV    │
│  • Cooking Hub & Ingredient Pages     │   │    (/seo-metadata-diff.csv)   │
│  • Utility, Guide & Legal Pages       │   │  • Interactive /seo-audit UI  │
└───────────────┬───────────────────────┘   └───────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                 Schema.org JSON-LD Structured Data Layer                  │
│  • Every Page: BreadcrumbList                                             │
│  • Root / Homepage: WebSite + Organization                                │
│  • Tool & Calculator Pages: WebApplication (Offer: $0 USD, UtilityApp)    │
└───────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - **Metadata Record Schema (for CSV & Audit UI)**: `url`, `pageType` (`homepage` | `category` | `tool` | `cooking` | `guide` | `utility` | `legal`), `oldTitle`, `newTitle`, `newTitleLength`, `oldDescription`, `newDescription`, `newDescriptionLength`, `ogImageUrl`.
  - **Interactive Audit State (`/seo-audit`)**: Client-side search query (`url`, `newTitle`, `newDescription`), active `pageType` filter tab, pagination/virtualized table view for browsing all 780+ URLs smoothly, and direct CSV download trigger.
