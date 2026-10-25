import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import {
  buildPageMetadata,
  buildStandardToolTitle,
  buildStandardToolDescription,
  formatSeoTitle,
  formatSeoDescription,
  getCategoryOgImage,
} from "@/lib/seo";
import { CATEGORIES, UNIT_MAP } from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  getCategoryUrl,
  getPairUrl,
} from "@/lib/conversions/catalogue";
import {
  COOKING_INGREDIENTS,
  US_CUP_ML,
  METRIC_CUP_ML,
  formatCookingNumber,
} from "@/lib/conversions/cooking";
import { GUIDES } from "@/lib/conversions/guides";
import SeoAuditClient, { SeoAuditRow } from "@/components/SeoAuditClient";

export const metadata: Metadata = buildPageMetadata({
  title: "SEO Metadata Diff & Social Card Audit",
  description:
    "Review old vs. new standardized page titles, meta descriptions, character lengths, and 1200x630 category OpenGraph images across all URLs on UnitConvertersGo.",
  canonicalPath: "/seo-audit",
  noindex: true,
});

function buildAllAuditRows(): SeoAuditRow[] {
  const rows: SeoAuditRow[] = [];

  const pushRow = (
    path: string,
    pageType: string,
    oldTitle: string,
    newTitle: string,
    oldDescription: string,
    newDescription: string,
    categoryId?: string
  ) => {
    const fullUrl = `https://unitconvertersgo.com${
      path.startsWith("/") ? path : `/${path}`
    }`;
    const ogImgUrl = getCategoryOgImage(categoryId, newTitle).url;
    const ogImagePath = ogImgUrl.replace(SITE_CONFIG.baseUrl, "");

    rows.push({
      url: fullUrl,
      path,
      pageType,
      oldTitle,
      oldTitleLen: oldTitle.length,
      newTitle,
      newTitleLen: newTitle.length,
      oldDescription,
      oldDescLen: oldDescription.length,
      newDescription,
      newDescLen: newDescription.length,
      ogImagePath,
    });
  };

  // 1. Homepage
  pushRow(
    "/",
    "home",
    "UnitConvertersGo — Universal Unit Converter",
    SITE_CONFIG.homepageTitle,
    "Fast, accurate unit conversion platform calculating length, mass, temperature, volume, digital storage, and 78 measurement categories in real time.",
    SITE_CONFIG.description
  );

  // 2. Hubs, Cooking, Guides, Utility & Legal
  pushRow(
    "/directory",
    "hub",
    "All Unit Converters Directory | UnitConvertersGo",
    `${formatSeoTitle(`All ${CATEGORIES.length} Unit Conversion Categories`)} | UnitConvertersGo`,
    "Browse conversion tools by measurement category or find a specific unit conversion across Length, Weight & Mass, Temperature, Area, Volume, Speed, Time, Pressure, Energy, and Power.",
    formatSeoDescription(
      `Browse ${CONVERSION_CATALOGUE.length} unit conversion calculators across ${CATEGORIES.length} measurement categories including Length, Weight, Temperature, Volume, Area, and Speed.`
    )
  );

  pushRow(
    "/sitemap",
    "hub",
    "Complete HTML Sitemap — 78+ Unit Converters | UnitConvertersGo",
    `${formatSeoTitle(`Complete HTML Sitemap — ${CATEGORIES.length} Categories`)} | UnitConvertersGo`,
    "Complete HTML sitemap for UnitConvertersGo organized into Common, Engineering, Heat, Fluids, Light, Electricity, Magnetism, Radiology, and Specialty unit converters.",
    formatSeoDescription(
      `Complete HTML sitemap for UnitConvertersGo covering ${CATEGORIES.length} measurement categories and ${CONVERSION_CATALOGUE.length} unit conversion calculators.`
    )
  );

  pushRow(
    "/cooking",
    "cooking",
    "Cups to Grams & Cooking Ingredient Weight Converter | UnitConvertersGo",
    `${formatSeoTitle("Cups to Grams & Cooking Ingredient Weight Converter")} | UnitConvertersGo`,
    "Convert cooking and baking ingredients between cups, grams, ounces, tablespoons, teaspoons, and milliliters. Includes US (236.59 mL) and Metric (250 mL) cup charts verified by USDA FoodData Central.",
    formatSeoDescription(
      "1 US cup flour = 125 g, 1 US cup sugar = 200 g. Convert cooking ingredients between cups, grams, oz, tbsp & mL instantly with US & Metric cup charts."
    ),
    "cooking"
  );

  for (const ing of COOKING_INGREDIENTS) {
    const primaryStd = ing.standards[0];
    const usCupGrams = formatCookingNumber(primaryStd.densityGPerMl * US_CUP_ML);
    const metricCupGrams = formatCookingNumber(
      primaryStd.densityGPerMl * METRIC_CUP_ML
    );
    const oldTitle = `${formatSeoTitle(`${ing.shortName} Cups to Grams, Tbsp & Oz Converter`)} | UnitConvertersGo`;
    const newTitle = `${ing.shortName} Cups to Grams Converter – Free & Instant (cup to g)`;
    const oldDesc = formatSeoDescription(ing.description);
    const newDesc = formatSeoDescription(
      `1 US cup ${ing.shortName.toLowerCase()} = ${usCupGrams} g (Metric cup = ${metricCupGrams} g). Convert ${ing.shortName.toLowerCase()} cups, grams, oz & tbsp instantly. Includes live calculator & US/Metric cup charts.`
    );
    pushRow(
      `/cooking/${ing.slug}`,
      "cooking",
      oldTitle,
      newTitle,
      oldDesc,
      newDesc,
      "cooking"
    );
  }

  pushRow(
    "/guides",
    "hub",
    "Measurement Guides & Reference Articles | UnitConvertersGo",
    `${formatSeoTitle("Measurement Guides & Reference Articles")} | UnitConvertersGo`,
    "In-depth technical and historical measurement guides covering Metric vs. Imperial standards, US vs. UK fluid ounces, binary vs. decimal storage, temperature scales, and pressure units.",
    formatSeoDescription(
      "In-depth technical and historical measurement guides covering Metric vs. Imperial standards, US vs. UK fluid ounces, binary vs. decimal storage, temperature scales, and pressure units."
    )
  );

  for (const guide of GUIDES) {
    const renderedTitle = `${formatSeoTitle(guide.title)} | UnitConvertersGo`;
    const renderedDesc = formatSeoDescription(guide.summary);
    pushRow(
      `/guides/${guide.slug}`,
      "guide",
      renderedTitle,
      renderedTitle,
      renderedDesc,
      renderedDesc
    );
  }

  pushRow(
    "/widgets",
    "hub",
    "Calculator & Unit Converter Widgets | UnitConvertersGo",
    `${formatSeoTitle("Calculator & Unit Converter Widgets")} | UnitConvertersGo`,
    "Embed free, customizable unit conversion calculator widgets on your website, blog, or classroom. Includes Full-Width, Adjustable Sidebar, Popup Calculator, and Text Link embeds.",
    formatSeoDescription(
      "Embed free, customizable unit conversion calculator widgets on your website, blog, or classroom. Includes Full-Width, Adjustable Sidebar, Popup Calculator, and Text Link embeds."
    )
  );

  pushRow(
    "/case-converter",
    "utility",
    "Text Case Converter Tool | UnitConvertersGo",
    `${formatSeoTitle("Text Case Converter Tool")} | UnitConvertersGo`,
    "Free online Case Converter tool. Convert text between Sentence case, lower case, UPPER CASE, Title Case, camelCase, PascalCase, snake_case, and kebab-case in your browser.",
    formatSeoDescription(
      "Free online Case Converter tool. Convert text between Sentence case, lower case, UPPER CASE, Title Case, camelCase, PascalCase, snake_case, and kebab-case in your browser."
    )
  );

  pushRow(
    "/search",
    "utility",
    "Converter Search — Unit & Category Lookup | UnitConvertersGo",
    `${formatSeoTitle("Converter Search — Unit & Category Lookup")} | UnitConvertersGo`,
    "Search through 680+ metric and imperial unit converters, 78 categories, and formulas instantly by unit name, abbreviation, or phrase.",
    formatSeoDescription(
      `Search through ${CONVERSION_CATALOGUE.length} metric and imperial unit converters across ${CATEGORIES.length} measurement categories instantly by unit name, symbol, or phrase.`
    )
  );

  pushRow(
    "/about",
    "legal",
    "About UnitConvertersGo | UnitConvertersGo",
    "About UnitConvertersGo | UnitConvertersGo",
    "Learn about UnitConvertersGo: how our browser-based unit conversion calculators work, which 78 measurement categories are supported, and how our formulas align with SI and NIST standards.",
    formatSeoDescription(
      `Learn about UnitConvertersGo: how our ${CONVERSION_CATALOGUE.length} browser-based unit converters across ${CATEGORIES.length} measurement categories work and align with SI and NIST standards.`
    )
  );

  pushRow(
    "/contact",
    "legal",
    "Contact UnitConvertersGo | UnitConvertersGo",
    "Contact UnitConvertersGo | UnitConvertersGo",
    formatSeoDescription(
      "Contact the UnitConvertersGo team. Report a conversion formula discrepancy, request a new measurement unit, or get help with embeddable calculator widgets."
    ),
    formatSeoDescription(
      "Contact the UnitConvertersGo team. Report a conversion formula discrepancy, request a new measurement unit, or get help with embeddable calculator widgets."
    )
  );

  pushRow(
    "/privacy-policy",
    "legal",
    `${formatSeoTitle("Privacy Policy — Data & Browser Storage")} | UnitConvertersGo`,
    `${formatSeoTitle("Privacy Policy — Data & Browser Storage")} | UnitConvertersGo`,
    formatSeoDescription(
      "Read the UnitConvertersGo Privacy Policy. Learn how unit conversions run locally in your browser, what server logs and localStorage keys are used, and your privacy rights."
    ),
    formatSeoDescription(
      "Read the UnitConvertersGo Privacy Policy. Learn how unit conversions run locally in your browser, what server logs and localStorage keys are used, and your privacy rights."
    )
  );

  pushRow(
    "/terms-of-use",
    "legal",
    `${formatSeoTitle("Terms of Use — Website & Calculator Terms")} | UnitConvertersGo`,
    `${formatSeoTitle("Terms of Use — Website & Calculator Terms")} | UnitConvertersGo`,
    formatSeoDescription(
      "Read the Terms of Use for UnitConvertersGo. Understand acceptable use of our unit conversion tools, embeddable widgets, intellectual property, and limitations of liability."
    ),
    formatSeoDescription(
      "Read the Terms of Use for UnitConvertersGo. Understand acceptable use of our unit conversion tools, embeddable widgets, intellectual property, and limitations of liability."
    )
  );

  pushRow(
    "/disclaimer",
    "legal",
    `${formatSeoTitle("Disclaimer — Measurement Precision Notice")} | UnitConvertersGo`,
    `${formatSeoTitle("Disclaimer — Measurement Precision Notice")} | UnitConvertersGo`,
    formatSeoDescription(
      "Read the UnitConvertersGo Disclaimer. Understand the informational purpose of our conversion tools, how rounding and unit definitions work, and when to verify critical calculations."
    ),
    formatSeoDescription(
      "Read the UnitConvertersGo Disclaimer. Understand the informational purpose of our conversion tools, how rounding and unit definitions work, and when to verify critical calculations."
    )
  );

  pushRow(
    "/cookie-policy",
    "legal",
    `${formatSeoTitle("Cookie Policy — Browser Storage Guide")} | UnitConvertersGo`,
    `${formatSeoTitle("Cookie Policy — Browser Storage Guide")} | UnitConvertersGo`,
    formatSeoDescription(
      "Read the UnitConvertersGo Cookie Policy. See the exact browser localStorage keys we use for theme preferences, recent conversions, and bookmarks, and how to manage or clear them."
    ),
    formatSeoDescription(
      "Read the UnitConvertersGo Cookie Policy. See the exact browser localStorage keys we use for theme preferences, recent conversions, and bookmarks, and how to manage or clear them."
    )
  );

  // 3. All 78 Category Hub Pages
  for (const cat of CATEGORIES) {
    const catPath = getCategoryUrl(cat.id);
    const baseTitle = `${cat.name} Converter`;
    const renderedTitle = `${formatSeoTitle(baseTitle)} | UnitConvertersGo`;
    const desc = formatSeoDescription(
      `Convert all ${cat.name.toLowerCase()} units in real time. Includes verified NIST & SI formulas, unit comparison matrix, and reference tables.`
    );
    pushRow(
      catPath,
      "category",
      renderedTitle,
      renderedTitle,
      desc,
      desc,
      cat.id
    );
  }

  // 4. All 687 Unit Converter Tool Pages
  for (const pair of CONVERSION_CATALOGUE) {
    const pairPath = getPairUrl(pair);
    const fromUnit = UNIT_MAP.get(pair.fromUnitId);
    const toUnit = UNIT_MAP.get(pair.toUnitId);

    const oldBaseTitle =
      fromUnit && toUnit
        ? `${fromUnit.plural.replace(/\s+\([^)]*\)/g, "").trim()} to ${toUnit.plural.replace(/\s+\([^)]*\)/g, "").trim()} Converter`
        : pair.title;
    const oldRenderedTitle = `${formatSeoTitle(oldBaseTitle)} | UnitConvertersGo`;
    const oldRenderedDesc = formatSeoDescription(pair.metaDescription);

    const newTitle = buildStandardToolTitle(pair, fromUnit, toUnit);
    const newDesc = formatSeoDescription(
      buildStandardToolDescription(pair, fromUnit, toUnit)
    );

    pushRow(
      pairPath,
      "tool",
      oldRenderedTitle,
      newTitle,
      oldRenderedDesc,
      newDesc,
      pair.categoryId
    );
  }

  return rows;
}

export default function SeoAuditPage() {
  const rows = buildAllAuditRows();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "SEO Metadata Diff Audit",
        item: `${SITE_CONFIG.baseUrl}/seo-audit`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]/60 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-6">
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-[#16324F] dark:text-white">
            SEO Metadata Diff Audit
          </span>
        </nav>

        <header className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white">
            Sitewide Metadata Standardization &amp; CSV Audit
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Side-by-side comparison of old vs. new titles, meta descriptions, character counts, and build-time 1200×630 category OpenGraph images across all {rows.length} URLs.
          </p>
        </header>

        <SeoAuditClient
          rows={rows}
          totalCategories={CATEGORIES.length}
          totalConverters={CONVERSION_CATALOGUE.length}
        />
      </div>
    </div>
  );
}
