import fs from "node:fs";
import path from "node:path";
import React from "react";
import { ImageResponse } from "next/og.js";
import { CATEGORIES, UNIT_MAP, getUnitsByCategory } from "../lib/conversions/units.ts";
import {
  CONVERSION_CATALOGUE,
  getConversionsByCategory,
  getCategoryUrl,
  getCategoryUrlSlug,
  getPairUrl,
} from "../lib/conversions/catalogue.ts";
import { convertUnits } from "../lib/conversions/engine.ts";
import {
  COOKING_INGREDIENTS,
  US_CUP_ML,
  METRIC_CUP_ML,
  formatCookingNumber,
} from "../lib/conversions/cooking.ts";
import { GUIDES } from "../lib/conversions/guides.ts";
import { SITE_CONFIG } from "../lib/config.ts";
import {
  buildStandardToolTitle,
  buildStandardToolDescription,
  formatSeoTitle,
  formatSeoDescription,
  getCategoryOgImage,
} from "../lib/seo.ts";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const OG_DIR = path.join(PUBLIC_DIR, "og");

if (!fs.existsSync(OG_DIR)) {
  fs.mkdirSync(OG_DIR, { recursive: true });
}

// Load logo.png as base64 Data URI so every 1200x630 OG image includes the real brand logo
const logoPath = path.join(PUBLIC_DIR, "logo.png");
const logoBase64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
  : "";

interface OgCardProps {
  badge: string;
  title: string;
  subtitle: string;
  exampleLabel: string;
  exampleEquation: string;
}

function renderOgCardElement({
  badge,
  title,
  subtitle,
  exampleLabel,
  exampleEquation,
}: OgCardProps) {
  return React.createElement(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "54px 64px",
        background: "linear-gradient(135deg, #0F172A 0%, #16324F 60%, #0D3B4C 100%)",
        color: "#FFFFFF",
        fontFamily: "sans-serif",
        position: "relative",
      },
    },
    // Top bar: Logo + Category / Official Badge
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.96)",
            padding: "12px 22px",
            borderRadius: "16px",
          },
        },
        logoBase64
          ? React.createElement("img", {
              src: logoBase64,
              width: 250,
              height: 41,
              style: { objectFit: "contain" },
            })
          : React.createElement(
              "span",
              {
                style: {
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#16324F",
                },
              },
              "UnitConvertersGo"
            )
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            borderRadius: "999px",
            background: "rgba(13, 148, 136, 0.25)",
            border: "2px solid #2DD4BF",
            color: "#5EEAD4",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.04em",
          },
        },
        badge
      )
    ),
    // Center: Page Title + Subtitle
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "12px",
          marginBottom: "12px",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            fontSize: title.length > 34 ? "54px" : "62px",
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          },
        },
        title
      ),
      React.createElement(
        "div",
        {
          style: {
            fontSize: "26px",
            fontWeight: 500,
            color: "#CBD5E1",
            lineHeight: 1.35,
          },
        },
        subtitle
      )
    ),
    // Bottom: Conversion Example Box + Domain Footer
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "rgba(15, 23, 42, 0.78)",
          border: "2px solid rgba(45, 212, 191, 0.45)",
          borderRadius: "20px",
          padding: "24px 32px",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          },
        },
        React.createElement(
          "div",
          {
            style: {
              fontSize: "16px",
              fontWeight: 700,
              color: "#2DD4BF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            },
          },
          exampleLabel
        ),
        React.createElement(
          "div",
          {
            style: {
              fontSize: "34px",
              fontWeight: 800,
              color: "#F8FAFC",
            },
          },
          exampleEquation
        )
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
          },
        },
        React.createElement(
          "div",
          {
            style: {
              fontSize: "22px",
              fontWeight: 800,
              color: "#2DD4BF",
            },
          },
          "unitconvertersgo.com"
        ),
        React.createElement(
          "div",
          {
            style: {
              fontSize: "16px",
              fontWeight: 600,
              color: "#94A3B8",
            },
          },
          `${CATEGORIES.length} Categories • ${CONVERSION_CATALOGUE.length} Converters`
        )
      )
    )
  );
}

async function writeOgPng(filePath: string, props: OgCardProps) {
  const response = new ImageResponse(renderOgCardElement(props), {
    width: 1200,
    height: 630,
  });
  const arrayBuf = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuf));
}

async function generateAllOgImages() {
  console.log("Generating 1200x630 OpenGraph & Twitter PNG images...");

  // 1. Default / Homepage OG Image (/public/og-default.png)
  await writeOgPng(path.join(PUBLIC_DIR, "og-default.png"), {
    badge: `${CATEGORIES.length} CATEGORIES • ${CONVERSION_CATALOGUE.length} CONVERTERS`,
    title: "Free Online Unit Converter",
    subtitle:
      "Instant, standards-verified metric & imperial conversions with formulas and tables.",
    exampleLabel: "Verified Conversion Examples",
    exampleEquation: "10 cm = 3.937 in (3 15/16″)  •  1 kg = 2.2046 lb",
  });

  // 2. Cooking Category OG Image (/public/og/category-cooking.png)
  await writeOgPng(path.join(OG_DIR, "category-cooking.png"), {
    badge: "COOKING & BAKING CONVERTER",
    title: "Cups to Grams & Ingredient Converter",
    subtitle:
      "Convert flour, sugar, butter, oats & liquids between US/Metric cups, grams, oz & spoons.",
    exampleLabel: "Conversion Example (USDA & King Arthur Standard)",
    exampleEquation: "1 US Cup All-Purpose Flour = 125 g (4.41 oz)",
  });

  // 3. All 78 Category OG Images (/public/og/category-[slug].png)
  for (const cat of CATEGORIES) {
    const slug = getCategoryUrlSlug(cat.id);
    const catPairs = getConversionsByCategory(cat.id);
    const units = getUnitsByCategory(cat.id);

    const firstPair = catPairs[0];
    const fromUnit =
      (firstPair && UNIT_MAP.get(firstPair.fromUnitId)) || units[0];
    const toUnit =
      (firstPair && UNIT_MAP.get(firstPair.toUnitId)) || units[1] || units[0];

    let exampleEquation = `1 ${fromUnit?.symbol || "unit"} = 1 ${toUnit?.symbol || "unit"}`;
    let exampleLabel = "Instant Conversion Example";

    if (fromUnit && toUnit) {
      try {
        const sampleInput = firstPair?.exampleInput || 1;
        const out = convertUnits(sampleInput, fromUnit.id, toUnit.id, "auto");
        exampleLabel = `Example: ${fromUnit.plural} to ${toUnit.plural}`;
        exampleEquation = `${sampleInput} ${fromUnit.symbol} = ${out.formattedValue} ${toUnit.symbol}`;
      } catch {
        // fallback
      }
    }

    const outPath = path.join(OG_DIR, `category-${slug}.png`);
    await writeOgPng(outPath, {
      badge: `${cat.name.toUpperCase()} CONVERTER`,
      title: `${cat.name} Converter`,
      subtitle: cat.description,
      exampleLabel,
      exampleEquation,
    });
  }

  console.log(
    `✓ Generated default OG image + cooking OG image + ${CATEGORIES.length} category 1200x630 PNGs in /public/og/`
  );
}

function escapeCsvCell(value: string | number): string {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export interface SeoMetadataDiffRow {
  url: string;
  pageType: string;
  oldTitle: string;
  oldTitleLen: number;
  newTitle: string;
  newTitleLen: number;
  oldDescription: string;
  oldDescLen: number;
  newDescription: string;
  newDescLen: number;
  ogImage: string;
}

function generateMetadataDiffCsv() {
  console.log("Generating Old vs. New Title & Description CSV per URL...");

  const rows: SeoMetadataDiffRow[] = [];

  const pushRow = (
    pathOrUrl: string,
    pageType: string,
    oldTitle: string,
    newTitle: string,
    oldDescription: string,
    newDescription: string,
    categoryId?: string
  ) => {
    const fullUrl = pathOrUrl.startsWith("http")
      ? pathOrUrl
      : `https://unitconvertersgo.com${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
    const ogImg = getCategoryOgImage(categoryId, newTitle).url.replace(
      SITE_CONFIG.baseUrl,
      "https://unitconvertersgo.com"
    );

    rows.push({
      url: fullUrl,
      pageType,
      oldTitle,
      oldTitleLen: oldTitle.length,
      newTitle,
      newTitleLen: newTitle.length,
      oldDescription,
      oldDescLen: oldDescription.length,
      newDescription,
      newDescLen: newDescription.length,
      ogImage: ogImg,
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

  // 2. Hub, Utility & Legal Pages
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

  // Write CSV to /public/seo-metadata-diff.csv and /seo-metadata-diff.csv
  const header = [
    "url",
    "page_type",
    "old_title",
    "old_title_len",
    "new_title",
    "new_title_len",
    "old_description",
    "old_desc_len",
    "new_description",
    "new_desc_len",
    "og_image",
  ].join(",");

  const csvLines = [
    header,
    ...rows.map((r) =>
      [
        escapeCsvCell(r.url),
        escapeCsvCell(r.pageType),
        escapeCsvCell(r.oldTitle),
        escapeCsvCell(r.oldTitleLen),
        escapeCsvCell(r.newTitle),
        escapeCsvCell(r.newTitleLen),
        escapeCsvCell(r.oldDescription),
        escapeCsvCell(r.oldDescLen),
        escapeCsvCell(r.newDescription),
        escapeCsvCell(r.newDescLen),
        escapeCsvCell(r.ogImage),
      ].join(",")
    ),
  ];

  const csvContent = csvLines.join("\n") + "\n";
  fs.writeFileSync(path.join(PUBLIC_DIR, "seo-metadata-diff.csv"), csvContent, "utf8");
  fs.writeFileSync(path.join(ROOT_DIR, "seo-metadata-diff.csv"), csvContent, "utf8");

  console.log(
    `✓ Generated /public/seo-metadata-diff.csv and /seo-metadata-diff.csv (${rows.length} URLs audited)`
  );
}

async function main() {
  await generateAllOgImages();
  generateMetadataDiffCsv();
}

main().catch((err) => {
  console.error("Failed to generate SEO assets:", err);
  process.exit(1);
});
