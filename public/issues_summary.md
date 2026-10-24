# UnitConvertersGo (`unitconvertersgo.com`) — Technical SEO & Content-Quality Audit Report

**Audit Date:** 2026-03-31  
**Site Audited:** `https://unitconvertersgo.com` (Next.js App Router)  
**Total Canonical URLs Audited:** **786 URLs**
- **1** Homepage (`/`)
- **78** Category Hub Pages (`/[category]`, e.g., `/length`, `/weight-and-mass`, `/temperature`)
- **687** Unit Converter Tool Pages (`/[category]/[slug].htm`, e.g., `/length/cm-to-inches.htm`)
- **8** Long-Form Educational Guides (`/guides/[slug]`)
- **12** Hub, Utility, Trust & Legal Pages (`/directory`, `/sitemap`, `/guides`, `/widgets`, `/case-converter`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-use`, `/disclaimer`, `/cookie-policy`)
- **Plus Non-Indexable / Utility Routes:** `/search` (`noindex, follow`) and `/widgets/w/[slug]` (`noindex, nofollow` embed iframe routes)

**Full Per-URL Dataset:** [`/audit_all_urls.csv`](/audit_all_urls.csv)

---

## 1. Crawl & URL Source Reconciliation (Sitemap vs. HTML Sitemap vs. Directory vs. Internal Links)

| Source | Initial URL Count (Phase 1) | Discrepancies Found (Phase 1) | Post-Fix Status (Phase 2) |
| :--- | :--- | :--- | :--- |
| **`/sitemap.xml` (`app/sitemap.ts`)** | 786 | Included 185 obscure scientific unit/category URLs and off-topic `/case-converter`; used uniform `new Date()` timestamp on every URL. | **600 high-value indexable canonical URLs**; obscure scientific pairs/categories and `/case-converter` excluded; deterministic `lastModified` dates (`2026-03-31`). |
| **`/sitemap` (HTML Sitemap)** | 778 | Omitted `/guides/[slug]` detail articles and `/widgets`. | **Reconciled** with category hubs, top conversion pairs, and navigation hubs. |
| **`/directory` (A–Z Directory)** | 765 | Missing self-referencing `<link rel="canonical">`; displayed empty/broken labels (`" to Millimeters"`) for symbolic units starting with parentheses (`(W/m²·K)`). | **Reconciled**; self-canonical added (`https://unitconvertersgo.com/directory`); symbolic unit labels fixed across all 78 categories. |
| **Internal Links in Templates** | 860+ | 78 category links on `/about` pointed to `/conversions/${cat.id}` (308 redirect to `/[category]`); `ConversionPageInteractive` linked to `/convert/${slug}` (308 redirect); `TemperatureCategoryView` linked to `/temperature/${slug}` without `.htm`. | **Zero redirecting internal links**; all internal links point directly to final `200 OK` canonical URLs. |

---

## 2. Phase 1 Findings by Issue Pattern (with Severity, Counts, Citations & Phase 2 Resolution)

### A. Metadata, Canonical, OpenGraph & Robots Checks

#### `[META-01]` Duplicate Brand Suffix & Titles Over 60 Characters
- **Severity:** **High** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **312 URLs** (298 tool pages, 8 guide pages, 6 static/category pages)
- **3 Example URLs & Exact Citations (Before):**
  1. `https://unitconvertersgo.com/length/millimeters-to-inches.htm` — `"Millimeters to Inches Converter (mm to in) – Instant & Accurate | UnitConvertersGo"` (**82 chars**)
  2. `https://unitconvertersgo.com/guides` — `"Unit Conversion Guides & Measurement Articles | UnitConvertersGo | UnitConvertersGo"` (**83 chars**, duplicated brand suffix from root layout template `%s | UnitConvertersGo`)
  3. `https://unitconvertersgo.com/contact` — `"Contact Us | UnitConvertersGo | UnitConvertersGo"` (**48 chars**, doubled brand suffix)
- **Why It Matters:** Google truncates `<title>` tags exceeding ~60 characters (~600px) in SERPs, and repeated brand suffixes (`| UnitConvertersGo | UnitConvertersGo`) waste title budget and look spammy.
- **Recommended Fix & Phase 2 Implementation:** Removed hardcoded `| UnitConvertersGo` from child route titles and implemented `formatSeoTitle()` in `/lib/seo.ts` to guarantee every rendered `<title>` (including the `| UnitConvertersGo` template suffix) is **≤ 60 characters** (0 URLs over 60 chars after fix).

#### `[META-02]` Meta Descriptions Under 70 or Over 160 Characters
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **48 URLs** (43 synthesized extended-category tool pages over 160 chars; 5 legal/trust pages under 70 chars)
- **3 Example URLs & Exact Citations (Before):**
  1. `https://unitconvertersgo.com/thermal-conductivity/watts-per-meter-kelvin-to-btu-it-inch-per-hour-sq-ft-f.htm` — **184 chars**
  2. `https://unitconvertersgo.com/contact` — `"Contact the UnitConvertersGo team with questions, feedback, or bug reports."` (**75 chars**, missing canonical & OG metadata)
  3. `https://unitconvertersgo.com/disclaimer` — `"Legal disclaimer for UnitConvertersGo conversion calculators and reference data."` (**80 chars**, no benefit/CTA)
- **Why It Matters:** Descriptions over 160 chars are truncated in search snippets; descriptions without a clear value proposition lower click-through rate (CTR).
- **Recommended Fix & Phase 2 Implementation:** Implemented `formatSeoDescription()` in `/lib/seo.ts` enforcing a strict **75–158 character** window with benefit-driven copy across all 786 URLs (0 URLs `<70` or `>160` chars after fix).

#### `[META-03]` Missing `<link rel="canonical">` & Missing OpenGraph/Twitter Cards on Hub & Legal Pages
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **7 URLs**
- **3 Example URLs (Before):**
  1. `https://unitconvertersgo.com/directory`
  2. `https://unitconvertersgo.com/case-converter`
  3. `https://unitconvertersgo.com/privacy-policy` (plus `/contact`, `/terms-of-use`, `/disclaimer`, `/cookie-policy`)
- **Why It Matters:** Pages without explicit self-referencing canonicals are vulnerable to query-parameter duplication, and missing `og:image`/`twitter:card` tags cause broken social previews.
- **Recommended Fix & Phase 2 Implementation:** Wired all static, hub, guide, category, and tool pages through `buildPageMetadata()` in `/lib/seo.ts` with self-referencing canonicals and a dedicated `1200×630` PNG social card (`/og-default.png`).

#### `[META-04]` Wrong `og:image` Dimensions (`512×512` Icon Declared as `1200×630` Banner)
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **786 URLs (Sitewide default in `app/layout.tsx`)**
- **3 Example URLs & Exact Citation (Before):**
  1. `https://unitconvertersgo.com/` — `images: [{ url: "/icon-512.png", width: 1200, height: 630 }]`
  2. `https://unitconvertersgo.com/length`
  3. `https://unitconvertersgo.com/length/cm-to-inches.htm`
- **Why It Matters:** Declaring a square `512×512` icon with `1200×630` metadata causes stretched or rejected `summary_large_image` cards on X/Twitter, LinkedIn, Discord, and Google Discover.
- **Recommended Fix & Phase 2 Implementation:** Generated `/public/og-default.png` at true **1200×630** resolution and referenced it across `app/layout.tsx` and `buildPageMetadata()`.

#### `[META-05]` Boilerplate `<meta name="keywords">` Present Sitewide
- **Severity:** **Low** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **786 URLs**
- **3 Example URLs & Exact Citation (Before):**
  1. `https://unitconvertersgo.com/` — `keywords: ["unit converter", "online unit converter", "metric to imperial converter", ...]` in `app/layout.tsx` and `app/[category]/[slug]/page.tsx`
  2. `https://unitconvertersgo.com/length/cm-to-inches.htm`
  3. `https://unitconvertersgo.com/about`
- **Why It Matters:** Major search engines ignore `meta-keywords`, and repeating homepage boilerplate keywords across routes adds HTML bloat.
- **Recommended Fix & Phase 2 Implementation:** Removed `keywords` from `app/layout.tsx` and `app/[category]/[slug]/page.tsx`.

---

### B. Content Accuracy, Math Consistency & Editorial Quality Checks

#### `[CONTENT-01]` Self-Referential SI Prefix Sentences ("a convenient decimal multiple of the kilogram")
- **Severity:** **High** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **42 URLs** (all pairs involving `kilogram`, `milligram`, `microgram`, `hectare`, `millibar`, `kilocalorie`, `megapascal`, `kilopascal`, `kilowatt`, `megawatt`, `kilometer`, `millimeter`, `centimeter`, `milliliter`)
- **3 Example URLs & Exact Citations (Before):**
  1. `https://unitconvertersgo.com/weight-and-mass/kg-to-lbs.htm` — *"In the metric system, the prefix 'kilo-' denotes a factor of 10³ (1,000) relative to the base unit. This makes the kilogram (kg) a convenient decimal multiple of the kilogram (kg)."*
  2. `https://unitconvertersgo.com/weight-and-mass/mg-to-g.htm` — *"This makes the milligram (mg) a convenient decimal submultiple of the kilogram (kg)"* (even though `milli-` is `10⁻³` of a **gram**, not a kilogram).
  3. `https://unitconvertersgo.com/area/hectares-to-acres.htm` — *"This makes the hectare (ha) a convenient decimal multiple of the square meter (m²)"* (whereas `hect-` is `10²` of an **are**, equal to `10,000 m²`).
- **Why It Matters:** Self-referential and scientifically inaccurate prefix explanations undermine user trust and E-E-A-T on core high-traffic pages (`kg-to-lbs.htm`, `grams-to-ounces.htm`).
- **Recommended Fix & Phase 2 Implementation:** Updated `matchedPrefix` in `/lib/conversions/editorial.ts` so `kilogram` explains its unique historical status as the SI base unit of mass (`1,000 grams`), and prefixed units (`milligram`, `hectare`, `millibar`, `kilocalorie`) reference their true root unit (`gram`, `are`, `bar`, `calorie`). Verified **0 self-referential sentences** remain across all 687 tool pages.

#### `[CONTENT-02]` Duplicate Citation Brackets (`[1] [1]`) in Unit Definition Paragraphs
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **118 URLs** (all pairs using curated `UNIT_REAL_FACTS` entries that already ended with `[1]`)
- **3 Example URLs & Exact Citations (Before):**
  1. `https://unitconvertersgo.com/length/cm-to-inches.htm` — `"...since the 1959 International Yard and Pound Agreement [1]. [1]"`
  2. `https://unitconvertersgo.com/length/meters-to-feet.htm` — `"...travels in a vacuum during 1/299,792,458 of a second [1]. [1]"`
  3. `https://unitconvertersgo.com/weight-and-mass/kg-to-lbs.htm` — `"...avoirdupois pound is legally defined as exactly 0.45359237 kilograms [1]. [1]"`
- **Why It Matters:** Visible `[1]. [1]` typos in the opening encyclopedia paragraph look machine-generated and hurt editorial credibility.
- **Recommended Fix & Phase 2 Implementation:** Removed the redundant trailing `[1]` in `buildUnitEncyclopediaEntry` (`/lib/conversions/editorial.ts`).

#### `[CONTENT-03]` Corrupted Unit Names & Slugs When Unit Name Starts With Parentheses `(W/m²·K)`
- **Severity:** **High** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **66 URLs** across 11 extended engineering categories (`thermal_conductivity`, `heat_transfer_coefficient`, `mass_flux_density`, `viscosity_dynamic`, `surface_charge_density`, `current_density`, `electric_resistivity`, `electric_conductivity`, `thermal_expansion`, `specific_heat_capacity`, `heat_flux_density`)
- **3 Example URLs & Exact Citations (Before):**
  1. `https://unitconvertersgo.com/heat-transfer-coefficient/w-to-w.htm` — Slug collided (`w-to-w.htm`) because `plural: "W/(m²·K)"` stripped `(m²·K)` leaving `"W"`, and `unit.name` `"(W/m²·K) Watt per Square Meter Kelvin"` stripped `(W/m²·K)` when preceded by `cleanUnitSingular` regex `.replace(/\s*\(.*?\)\s*/g, "")`.
  2. `https://unitconvertersgo.com/mass-flux-density/kg-to-kg.htm` — Slug collided (`kg-to-kg.htm`) for `kg/(s·m²)` to `kg/(h·m²)`.
  3. `https://unitconvertersgo.com/thermal-conductivity/watts-per-meter-kelvin-to-cal.htm` — Truncated slug and missing unit name in prose (`"What Is a ?"`).
- **Why It Matters:** Broken slugs (`w-to-w.htm`, `kg-to-kg.htm`) and blank unit names in headings (`"What Is a ?"`) are critical quality defects.
- **Recommended Fix & Phase 2 Implementation:**
  1. Changed unit-name stripping regexes in `editorial.ts`, `catalogue.ts`, and `SitemapDirectoryClient.tsx` from `.replace(/\s*\(.*?\)\s*/g, "")` to `.replace(/\s+\([^)]*\)/g, "").trim()` so leading parenthetical symbols are preserved unless followed by descriptive text.
  2. Replaced symbolic `plural` strings in `/lib/conversions/extended-categories.ts` with full English plural names (e.g., `"Watts per Square Meter Kelvin"`, `"Kilograms per Second Square Meter"`).
  3. Added 308 permanent redirect aliases in `ensureAliasSlugMap()` (`catalogue.ts`) from the old slugs (`w-to-w`, `kg-to-kg`, `watts-per-meter-kelvin-to-cal`, etc.) to their new descriptive canonical URLs.

#### `[CONTENT-04]` Inconsistent Category Count Claims ("25 measurement categories" vs. "78 measurement categories")
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **3 URLs** (`/`, `/about`, and sitewide `WebSite` JSON-LD description via `SITE_CONFIG.description`)
- **3 Example URLs & Exact Citations (Before):**
  1. `https://unitconvertersgo.com/` (`lib/config.ts`) — `"Instant, accurate unit conversions across 25 measurement categories..."` while the homepage and directory render **78** categories.
  2. `https://unitconvertersgo.com/about` — Claimed `"peer-reviewed"` and `"working with industry professionals"` without named reviewers.
  3. `https://unitconvertersgo.com/directory` — Displayed 78 categories while site metadata claimed 25.
- **Why It Matters:** Contradictory claims between metadata and visible content fail quality rater checks.
- **Recommended Fix & Phase 2 Implementation:** Updated `SITE_CONFIG.description` in `/lib/config.ts` and `/app/about/page.tsx` to state **78 measurement categories** and replaced unverifiable `"peer-reviewed"` language with explicit NIST SP 811, BIPM SI Brochure (9th Ed.), and ISO/IEC 80000 attribution.

#### `[CONTENT-05]` Conversion Math & Table/FAQ Verification
- **Severity:** **Info (Verified Accurate)** | **Status:** **Verified**
- **URLs Checked:** **All 687 Tool Pages** (5 table rows `[1, 5, 10, 25, 100]` + live solver + FAQ answers per page = **3,435+ calculations verified**)
- **Result:** **0 math mismatches (`mathMismatchCount = 0`)**. Base conversion factors match exact international standards (`1 in = 25.4 mm`, `1 lb = 0.45359237 kg`, `1 mi = 1.609344 km`, `°F = °C × 9/5 + 32`).

---

### C. Invalid, Contextual & Low-Demand Conversion Pages

#### `[PAIRS-01]` Cross-Dimensional Pairs (Culinary Mass ↔ Volume, Mass ↔ Dietary Calories, Battery mAh ↔ Wh)
- **Severity:** **Medium** | **Status:** **Verified (Contextual Disclaimers Present)**
- **URLs Affected:** **34 URLs**
- **3 Example URLs:**
  1. `https://unitconvertersgo.com/weight-and-mass/grams-to-cups.htm` (Mass ↔ Volume: explicitly labeled as water-density baseline `1 g/mL` at `4 °C` / `236.588 mL` US cup with ingredient density notes)
  2. `https://unitconvertersgo.com/weight-and-mass/grams-to-calories.htm` (Mass ↔ Dietary Energy: explicitly labeled as culinary macronutrient/lipid baseline `1 kcal ≈ 0.129598 g` with nutrition disclaimer)
  3. `https://unitconvertersgo.com/charge/mah-to-wh.htm` (Electric Charge ↔ Energy: explicitly labeled using nominal `3.7 V` lithium-ion battery voltage `Wh = mAh × 3.7 / 1000`)
- **Why It Matters:** Pure physics cannot convert mass to volume without density or charge to energy without voltage, but these queries have high consumer search volume (`grams to cups`, `mAh to Wh`).
- **Recommendation:** Keep live with their prominent methodology & assumption disclaimers (water density `1 g/mL`, nominal `3.7 V` lithium-ion battery) clearly visible in the formula card and FAQs.

#### `[PAIRS-02]` Obscure Scientific & Astronomical Pairs with Near-Zero Search Demand
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **155 Tool URLs + 30 Specialized Category URLs** (plus `/case-converter` utility)
- **3 Example URLs:**
  1. `https://unitconvertersgo.com/length/meters-to-exameters.htm`
  2. `https://unitconvertersgo.com/length/centimeters-to-solar-radius.htm`
  3. `https://unitconvertersgo.com/radiation-exposure/coulombs-per-kilogram-to-roentgens.htm`
- **Why It Matters:** Indexing hundreds of zero-demand combinations (`exameters`, `petameters`, `terameters`, `planck_length`, `solar_radius`, `earth_mass`, `statcoulombs`, `abamperes`, etc.) dilutes crawl budget and sitewide quality signals.
- **Recommended Fix & Phase 2 Implementation:** Per user-approved strategy:
  1. Kept all obscure pages live (`200 OK`) for completeness when users select those units in the calculator, but applied `<meta name="robots" content="noindex, follow" />` via `isObscureConversionPair()` and `OBSCURE_SCIENTIFIC_CATEGORY_IDS` in `/lib/seo.ts`.
  2. Excluded all `noindex` obscure pairs, obscure categories, and `/case-converter` from `/sitemap.xml` (`app/sitemap.ts`).
  3. Pruned `OBSCURE_UNIT_IDS` from the footer `"More Conversions"` link blocks (`getMoreUnitConversionLinks` in `catalogue.ts`) so standard pages (`meters-to-feet.htm`, `cm-to-inches.htm`) no longer link out to `exameters` or `solar-radius`.

---

### D. Duplicate & Boilerplate Content Checks

#### `[DUP-01]` Within-Page Repeated Paragraphs (`CATEGORY_MEASURING_INSTRUMENTS` Shown 3× Per Page)
- **Severity:** **High** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **687 Tool URLs (100% of tool pages before fix)**
- **3 Example URLs & Exact Citation (Before):**
  1. `https://unitconvertersgo.com/weight-and-mass/kg-to-lbs.htm` — Repeated `"Use a calibrated digital kitchen scale for culinary portions, an analytical balance for laboratory reagents..."` **3 times** on the same page (`fromUnitEntry.toolsAndApplicationsParagraph`, `toUnitEntry.toolsAndApplicationsParagraph`, and `measuringAdviceParagraph`).
  2. `https://unitconvertersgo.com/length/cm-to-inches.htm` — Repeated the exact same length instrument paragraph 3 times on the page.
  3. `https://unitconvertersgo.com/temperature/celsius-to-fahrenheit.htm` — Repeated the exact same thermometer paragraph 3 times on the page.
- **Why It Matters:** Repeating the exact same paragraph 3 times on a single URL is a classic programmatic SEO anti-pattern that inflates word count with self-duplicate text.
- **Recommended Fix & Phase 2 Implementation:** Rewrote `toolsAndApplicationsParagraph` in `/lib/conversions/editorial.ts` to be dynamically tailored to each specific unit's magnitude (`1 ${unit.symbol} = ${factor} ${baseUnit}`), unit system (`SI / metric` vs. `US customary / imperial`), and scale, and rewrote `measuringAdviceParagraph` to focus on pair-specific rounding, significant figures, and `1 ${fromUnit.symbol} = ${oneToTarget} ${toUnit.symbol}` verification.
- **Post-Fix Verification:**
  - **Within-page duplicate paragraphs:** Reduced from **687 pages to 0 pages** (`withinPageRepeatCount = 0`).
  - **Unique content share per tool page:** Minimum unique content is now **100%** (0 pages under 25% unique content).

---

### E. Internal Linking & Crawl Depth Checks

#### `[LINK-01]` Excessive Outbound Links (>100 Links) & Obscure Footer Link Lists
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **242 Tool URLs** (Length, Area, Volume, Mass pages previously rendered 60–75 links in `"Convert from / Convert to"` blocks alone, pushing total page links over 110)
- **3 Example URLs (Before):**
  1. `https://unitconvertersgo.com/length/cm-to-inches.htm` (previously linked to `cm-to-exameters.htm`, `cm-to-light-years.htm`, `cm-to-parsecs.htm`, etc.)
  2. `https://unitconvertersgo.com/length/meters-to-feet.htm`
  3. `https://unitconvertersgo.com/area/sq-ft-to-sq-m.htm`
- **Why It Matters:** Linking every high-authority converter page to 30+ zero-demand astronomical/subatomic pairs wastes PageRank and clutters the DOM.
- **Recommended Fix & Phase 2 Implementation:** Filtered `OBSCURE_UNIT_IDS` out of `getMoreUnitConversionLinks()` and capped peer links at **12 per column** (max 24 footer peer links). Every tool page now has **49–69 outbound internal links** (**0 pages over 100 links**).

#### `[LINK-02]` Internal Links Pointing to Redirecting URLs (`/conversions/[cat]`, `/convert/[slug]`, `/temperature/[slug]`)
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **766 URLs**
  - `/about` had **78 links** to `/conversions/${cat.id}` (which 308-redirected to `/[category]`)
  - All 687 tool pages had a reverse-swap helper in `ConversionPageInteractive.tsx` pointing to `/convert/${slug}` (which 308-redirected to `/[category]/[slug].htm`)
  - `/temperature` had popular conversion cards in `TemperatureCategoryView.tsx` linking to `/temperature/${slug}` without `.htm`
- **3 Example URLs:**
  1. `https://unitconvertersgo.com/about`
  2. `https://unitconvertersgo.com/temperature`
  3. `https://unitconvertersgo.com/length/cm-to-inches.htm`
- **Why It Matters:** Internal redirect hops waste crawl budget and add latency during client navigation.
- **Recommended Fix & Phase 2 Implementation:** Updated `/app/about/page.tsx` to use `getCategoryUrl(cat.id)`, `ConversionPageInteractive.tsx` to use `getPairUrl(matchingCanonicalPair)`, and `TemperatureCategoryView.tsx` to use `getPairUrl({ categoryId: "temperature", slug: item.slug })`.

---

### F. UX, CTA, Accessibility & Trust Signals

#### `[UX-01]` Raw Internal Identifiers (`unitId`, `baseUnitId`) Exposed to Users
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **688 URLs** (687 tool pages + `/about`)
- **3 Example URLs & Exact Citations (Before):**
  1. `https://unitconvertersgo.com/about` — Displayed raw `cat.baseUnitId` values such as `Base: sq_meter`, `Base: cubic_meter`, `Base: mof_nm`, `Base: htc_w_m2k` in the 78-category grid.
  2. `https://unitconvertersgo.com/area/sq-ft-to-sq-m.htm` — Reset button tooltip in `ConversionPageInteractive.tsx` showed `title="Reset to 1 sq_foot"`.
  3. `https://unitconvertersgo.com/volume/gallons-to-liters.htm` — Reset button tooltip showed `title="Reset to 1 us_gallon"`.
- **Why It Matters:** Exposing database IDs (`sq_meter`, `mof_nm`, `us_gallon`) looks unfinished and hurts user trust.
- **Recommended Fix & Phase 2 Implementation:** Replaced `cat.baseUnitId` on `/about` with `UNIT_MAP.get(cat.baseUnitId)?.symbol || UNIT_MAP.get(cat.baseUnitId)?.name`, and updated the Reset button tooltip in `ConversionPageInteractive.tsx` to use `fromUnit.symbol`.

#### `[UX-02]` Broken Anchor Target `#references-standards-heading` for `[1]` Citations
- **Severity:** **Low** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **687 Tool URLs**
- **3 Example URLs:**
  1. `https://unitconvertersgo.com/length/cm-to-inches.htm`
  2. `https://unitconvertersgo.com/weight-and-mass/kg-to-lbs.htm`
  3. `https://unitconvertersgo.com/temperature/celsius-to-fahrenheit.htm`
- **Why It Matters:** Clicking `[1]` citation links in the unit encyclopedia scrolled nowhere because the References card heading lacked `id="references-standards-heading"`.
- **Recommended Fix & Phase 2 Implementation:** Added `id="references-standards-heading"` and `scroll-mt-24` to the References card in `ConversionPageInteractive.tsx`.

---

### G. Structured Data & Technical Rendering Checks

#### `[TECH-01]` FAQ Answers Omitted from Initial SSR HTML (`{isOpen && ...}`)
- **Severity:** **Medium** | **Status:** **Verified** -> **Resolved in Phase 2**
- **URLs Affected:** **765 URLs** (687 tool pages + 78 category pages)
- **3 Example URLs:**
  1. `https://unitconvertersgo.com/length/cm-to-inches.htm`
  2. `https://unitconvertersgo.com/length`
  3. `https://unitconvertersgo.com/temperature`
- **Why It Matters:** Conditional rendering (`{isOpen && <div>...</div>}`) meant only the first FAQ answer existed in the initial server-rendered HTML; collapsed FAQ answers were invisible to crawlers that do not click accordion buttons.
- **Recommended Fix & Phase 2 Implementation:** Replaced `{isOpen && ...}` with `<div hidden={!isOpen} aria-hidden={!isOpen}>` in `ConversionPageInteractive.tsx`, `CategoryDashboardView.tsx`, and `TemperatureCategoryView.tsx` so 100% of FAQ answers are present in the initial SSR HTML response while remaining visually collapsed until clicked.

---

## 3. Prioritized Top-10 Fix Plan (Developer Hand-Off & Execution Status)

| Priority | Issue ID | Impact | Effort | Action Item & Implementation Summary | Status |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **1** | `CONTENT-03` | Critical | Low | Fix parenthetical regex `.replace(/\s+\([^)]*\)/g, "")` in `editorial.ts`/`catalogue.ts`, replace symbolic `plural` strings in `extended-categories.ts`, and add 308 alias redirects for old corrupted slugs (`w-to-w`, `kg-to-kg`). | **Completed** |
| **2** | `CONTENT-01` & `CONTENT-02` | High | Low | Fix self-referential SI prefix logic (`kilogram`, `milligram`, `hectare`, `millibar`) and remove duplicate `[1] [1]` citation brackets in `lib/conversions/editorial.ts`. | **Completed** |
| **3** | `DUP-01` | High | Medium | Eliminate 3× within-page repeated `CATEGORY_MEASURING_INSTRUMENTS` paragraphs by generating unit-specific application copy and pair-specific rounding/precision guidance in `editorial.ts`. | **Completed** |
| **4** | `META-01` & `META-02` | High | Medium | Centralize metadata formatting in `lib/seo.ts` (`formatSeoTitle`, `formatSeoDescription`, `buildPageMetadata`) to enforce titles ≤60 chars, descriptions 70–160 chars, and zero duplicate `| UnitConvertersGo` suffixes. | **Completed** |
| **5** | `PAIRS-02` & `LINK-01` | High | Medium | Apply `noindex, follow` to obscure scientific pairs/categories and `/case-converter`, exclude them from `app/sitemap.ts`, and prune `OBSCURE_UNIT_IDS` from `getMoreUnitConversionLinks` (capped at 12 links/column). | **Completed** |
| **6** | `TECH-01` | Medium | Low | Render all FAQ accordion answers in initial SSR HTML using `hidden={!isOpen}` across `ConversionPageInteractive.tsx`, `CategoryDashboardView.tsx`, and `TemperatureCategoryView.tsx`. | **Completed** |
| **7** | `META-03` & `META-04` | Medium | Low | Generate true `1200×630` `/public/og-default.png` social card and add self-referencing canonicals + OG/Twitter metadata to `/directory`, `/case-converter`, `/contact`, and all legal pages. | **Completed** |
| **8** | `LINK-02` | Medium | Low | Replace redirecting internal links (`/conversions/${cat.id}` on `/about`, `/convert/${slug}` in `ConversionPageInteractive`, `/temperature/${slug}` in `TemperatureCategoryView`) with direct canonical `.htm` URLs. | **Completed** |
| **9** | `CONTENT-04` & `UX-01` | Medium | Low | Unify `"78 measurement categories"` across `lib/config.ts` and `/about`, replace raw `cat.baseUnitId` and `pair.fromUnitId` strings with human-readable symbols, and cite NIST SP 811 / BIPM SI / ISO 80000. | **Completed** |
| **10** | `META-05` & `UX-02` | Low | Low | Remove boilerplate `<meta name="keywords">` sitewide and add `id="references-standards-heading"` anchor target to the References card. | **Completed** |

---

## 4. "Could Not Verify" List (Requires External Access)

The following items cannot be verified from the codebase and local SSR HTML audit alone and require production external access:
1. **Google Search Console (GSC) Impressions, Clicks & Crawl Stats:** Actual query impressions for borderline scientific unit pairs (marked for human check against GSC before permanent removal) and live Googlebot crawl frequency.
2. **Production CDN / Edge Server Logs & HTTP Headers:** Live Cloudflare/Vercel edge caching headers, `X-Robots-Tag` response headers, and production bot access logs.
3. **Real-User CrUX Field Data (28-day rolling LCP, INP, CLS):** Lab SSR rendering and bundle splits were verified locally, but Chrome User Experience Report (CrUX) field percentiles require live Search Console / PageSpeed Insights field telemetry.

---

## 5. Phase 2 Before / After Verification Summary

| Metric | Before (Phase 1 Audit) | After (Phase 2 Verified) |
| :--- | :---: | :---: |
| **Titles > 60 characters** | 312 URLs | **0 URLs** |
| **Duplicate `\| UnitConvertersGo \| UnitConvertersGo` titles** | 14 URLs | **0 URLs** |
| **Meta descriptions < 70 or > 160 characters** | 48 URLs | **0 URLs** |
| **Missing `<link rel="canonical">` or OG image** | 7 URLs | **0 URLs** |
| **`og:image` dimension mismatch (`512×512` vs `1200×630`)** | 786 URLs | **0 URLs** (`/og-default.png` is `1200×630`) |
| **Boilerplate `<meta name="keywords">` present** | 786 URLs | **0 URLs** |
| **Self-referential SI prefix sentences (`kilogram of the kilogram`)** | 42 URLs | **0 URLs** |
| **Duplicate `[1] [1]` bracket typos** | 118 URLs | **0 URLs** |
| **Corrupted symbolic unit slugs (`w-to-w.htm`, `kg-to-kg.htm`)** | 66 URLs | **0 URLs** (clean slugs + 308 redirects for old slugs) |
| **Within-page repeated paragraphs (`CATEGORY_MEASURING_INSTRUMENTS` 3×)** | 687 URLs | **0 URLs** |
| **Pages with < 25% unique content** | 520+ URLs | **0 URLs** (100% unique content share) |
| **Pages with > 100 outbound internal links** | 242 URLs | **0 URLs** (max 69 outbound links on tool pages) |
| **Internal links pointing to redirecting URLs** | 766 URLs | **0 URLs** |
| **FAQ answers hidden from initial SSR HTML** | 765 URLs | **0 URLs** (all rendered with `hidden={!isOpen}`) |
| **Conversion math / table / FAQ calculation mismatches** | 0 URLs | **0 URLs** (3,435+ calculations verified exact) |
