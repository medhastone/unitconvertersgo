import type { Metadata } from "next";
import { SITE_CONFIG } from "./config";
import type { ConversionPairInfo, Unit } from "./conversions/types";
import { CATEGORY_MAP, UNIT_MAP, getUnitsByCategory } from "./conversions/units";
import { convertUnits } from "./conversions/engine";
import { getCategoryUrlSlug } from "./conversions/url";
import { isIndexableCategory } from "./seo-config";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_CONFIG.baseUrl}/og-default.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_CONFIG.name} — Free Online Unit Converter`,
  type: "image/png",
};

export const SHARED_FAVICON_ICONS: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    { url: "/favicon-144x144.png", sizes: "144x144", type: "image/png" },
    { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
  ],
  shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
};

/**
 * Curated top 4 unit display labels per category for the standardized category title:
 * "<Category> Converter – <top 4 units> & More"
 */
const CATEGORY_TOP_FOUR_UNITS: Record<string, string[]> = {
  length: ["Meters", "Feet", "Inches", "Miles"],
  mass: ["Kilograms", "Pounds", "Grams", "Ounces"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"],
  volume: ["Liters", "Gallons", "Milliliters", "Cups"],
  area: ["Square Meters", "Square Feet", "Acres", "Hectares"],
  speed: ["km/h", "mph", "Meters per Second", "Knots"],
  time: ["Seconds", "Minutes", "Hours", "Days"],
  pressure: ["PSI", "Bar", "Pascals", "Atmospheres"],
  energy: ["Joules", "Kilowatt-Hours", "Calories", "BTU"],
  power: ["Watts", "Kilowatts", "Horsepower", "BTU/h"],
  digital_storage: ["Bytes", "Kilobytes", "Megabytes", "Gigabytes"],
  data_transfer: ["Mbps", "Gbps", "MB/s", "KB/s"],
  fuel_economy: ["MPG", "L/100km", "km/L", "Imperial MPG"],
  force: ["Newtons", "Kilonewtons", "Pound-Force", "Dynes"],
  density: ["kg/m³", "g/cm³", "lb/ft³", "lb/gal"],
  angle: ["Degrees", "Radians", "Gradians", "Arcminutes"],
  frequency: ["Hertz", "Kilohertz", "Megahertz", "RPM"],
  cooking: ["Cups", "Grams", "Ounces", "Tablespoons"],
};

/**
 * Builds the standardized Category page title:
 * "<Category> Converter – <top 4 units> & More"
 * e.g. "Length Converter – Meters, Feet, Inches, Miles & More"
 */
export function buildCategorySeoTitle(categoryId: string): string {
  if (categoryId === "cooking") {
    return "Cooking Converter – Cups, Grams, Ounces, Tablespoons & More";
  }

  const cat = CATEGORY_MAP.get(categoryId);
  if (!cat) {
    return "Unit Converter – Metric & Imperial Measurement Tools";
  }

  const curated = CATEGORY_TOP_FOUR_UNITS[cat.id];
  const allUnits = getUnitsByCategory(cat.id);
  const topUnits =
    curated && curated.length > 0
      ? curated.slice(0, 4)
      : allUnits
          .slice(0, 4)
          .map((u) => cleanUnitDisplayName(u.plural));

  if (topUnits.length === 0) {
    return `${cat.name} Converter`;
  }

  const hasMore = allUnits.length > topUnits.length;
  return `${cat.name} Converter – ${topUnits.join(", ")}${hasMore ? " & More" : ""}`;
}

/**
 * Builds a clear, benefit-led meta description for a Category page.
 */
export function buildCategorySeoDescription(categoryId: string): string {
  if (categoryId === "cooking") {
    return formatSeoDescription(
      "Convert cooking and baking ingredients between cups, grams, ounces, tablespoons, and milliliters instantly for free with US and Metric cup reference charts."
    );
  }

  const cat = CATEGORY_MAP.get(categoryId);
  if (!cat) {
    return SITE_CONFIG.description;
  }

  const curated = CATEGORY_TOP_FOUR_UNITS[cat.id];
  const allUnits = getUnitsByCategory(cat.id);
  const topUnits =
    curated && curated.length > 0
      ? curated.slice(0, 4).map((s) => s.toLowerCase())
      : allUnits
          .slice(0, 4)
          .map((u) => cleanUnitDisplayName(u.plural).toLowerCase());

  const unitsList =
    topUnits.length >= 2
      ? `${topUnits.slice(0, -1).join(", ")}, and ${topUnits[topUnits.length - 1]}`
      : topUnits[0] || cat.name.toLowerCase();

  return formatSeoDescription(
    `Convert ${cat.name.toLowerCase()} units including ${unitsList} instantly for free. Includes a live calculator, exact conversion formulas, and reference tables.`
  );
}

/**
 * Resolves the 1200x630 OpenGraph & Twitter card image for a specific converter pair
 * (via the dynamic /api/og generator) or falls back to the category's /og/category-[slug].png image.
 */
export function getCategoryOgImage(
  categoryId?: string,
  altOverride?: string,
  pairSlug?: string
) {
  if (pairSlug) {
    return {
      url: `${SITE_CONFIG.baseUrl}/api/og?slug=${encodeURIComponent(pairSlug)}`,
      width: 1200,
      height: 630,
      alt: altOverride || `${pairSlug.replace(/-/g, " ")} — ${SITE_CONFIG.name}`,
      type: "image/png",
    };
  }

  if (!categoryId) {
    return altOverride
      ? { ...DEFAULT_OG_IMAGE, alt: altOverride }
      : DEFAULT_OG_IMAGE;
  }

  if (categoryId === "cooking") {
    return {
      url: `${SITE_CONFIG.baseUrl}/og/category-cooking.png`,
      width: 1200,
      height: 630,
      alt:
        altOverride ||
        `Cooking & Ingredient Weight Converter — ${SITE_CONFIG.name}`,
      type: "image/png",
    };
  }

  const cat = CATEGORY_MAP.get(categoryId);
  if (!cat) {
    return altOverride
      ? { ...DEFAULT_OG_IMAGE, alt: altOverride }
      : DEFAULT_OG_IMAGE;
  }

  const slug = getCategoryUrlSlug(cat.id);
  return {
    url: `${SITE_CONFIG.baseUrl}/og/category-${slug}.png`,
    width: 1200,
    height: 630,
    alt: altOverride || `${cat.name} Converter — ${SITE_CONFIG.name}`,
    type: "image/png",
  };
}

/**
 * Obscure scientific unit IDs (extreme SI prefixes) that should be excluded from
 * "More Conversions" footer link blocks.
 */
export const OBSCURE_UNIT_IDS = new Set<string>([
  "exameter",
  "petameter",
  "terameter",
  "gigameter",
  "megameter",
  "hectometer",
  "decameter",
  "decimeter",
  "picometer",
  "femtometer",
  "angstrom",
  "fathom",
  "furlong",
  "chain",
  "rod",
  "league",
  "light_year",
  "parsec",
  "astronomical_unit",
  "microinch",
  "mil",
  "planck_length",
  "carat",
  "grain",
  "dram",
  "slug",
  "atomic_mass_unit",
  "quarter_us",
  "quarter_uk",
  "hundredweight_us",
  "hundredweight_uk",
  "troy_pound",
  "pennyweight",
  "gill_us",
  "gill_uk",
  "pint_dry_us",
  "quart_dry_us",
  "bushel_us",
  "barrel_us",
  "prefix_tera",
  "prefix_giga",
  "prefix_mega",
  "prefix_kilo",
  "prefix_hecto",
  "prefix_deci",
  "prefix_centi",
  "prefix_milli",
  "prefix_micro",
  "prefix_nano",
  "prefix_pico",
]);

/**
 * Non-indexable category helper delegating to centralized lib/seo-config.ts.
 */
export function isObscureConversionPair(pair: ConversionPairInfo): boolean {
  return !isIndexableCategory(pair.categoryId);
}

/**
 * Cleans a unit plural/display name for titles: removes trailing parenthetical qualifiers
 * while preserving leading parenthetical symbols if any.
 */
export function cleanUnitDisplayName(rawName: string): string {
  return rawName.replace(/\s+\([^)]*\)/g, "").trim();
}

/**
 * Standardizes tool page titles to:
 * "[A] to [B] Converter – Free & Instant ([a] to [b])"
 */
export function buildStandardToolTitle(
  pair: ConversionPairInfo,
  fromUnitOverride?: Unit,
  toUnitOverride?: Unit
): string {
  const fromUnit = fromUnitOverride || UNIT_MAP.get(pair.fromUnitId);
  const toUnit = toUnitOverride || UNIT_MAP.get(pair.toUnitId);

  if (!fromUnit || !toUnit) {
    return `${pair.title.replace(/\s*Converter.*$/i, "").trim()} Converter – Free & Instant`;
  }

  const unitA = cleanUnitDisplayName(fromUnit.plural);
  const unitB = cleanUnitDisplayName(toUnit.plural);
  const symA = fromUnit.symbol.trim();
  const symB = toUnit.symbol.trim();

  return `${unitA} to ${unitB} Converter – Free & Instant (${symA} to ${symB})`;
}

/**
 * Builds the standardized tool page meta description:
 * Factor + Benefit + What the page genuinely includes (only features that really exist).
 */
export function buildStandardToolDescription(
  pair: ConversionPairInfo,
  fromUnitOverride?: Unit,
  toUnitOverride?: Unit
): string {
  const fromUnit = fromUnitOverride || UNIT_MAP.get(pair.fromUnitId);
  const toUnit = toUnitOverride || UNIT_MAP.get(pair.toUnitId);

  if (!fromUnit || !toUnit) {
    return formatSeoDescription(pair.metaDescription);
  }

  const unitALower = cleanUnitDisplayName(fromUnit.plural).toLowerCase();
  const unitBLower = cleanUnitDisplayName(toUnit.plural).toLowerCase();
  const symA = fromUnit.symbol.trim();
  const symB = toUnit.symbol.trim();

  // 1. Exact conversion factor
  let factorClause = "";
  try {
    if (pair.categoryId === "temperature") {
      const zeroOut = convertUnits(0, fromUnit.id, toUnit.id, "auto");
      const oneOut = convertUnits(1, fromUnit.id, toUnit.id, "auto");
      factorClause = `0 ${symA} = ${zeroOut.formattedValue} ${symB} (1 ${symA} = ${oneOut.formattedValue} ${symB}).`;
    } else {
      const oneOut = convertUnits(1, fromUnit.id, toUnit.id, "auto");
      factorClause = `1 ${symA} = ${oneOut.formattedValue} ${symB}.`;
    }
  } catch {
    factorClause = `Convert ${symA} to ${symB} accurately.`;
  }

  // 2. Clear user benefit
  const benefitClause = `Convert ${unitALower} to ${unitBLower} instantly for free.`;

  // 3. Real features that genuinely exist on this page
  const featuresClause =
    pair.categoryId === "length"
      ? `Includes live calculator, formula, 1/16" tape measure & printable chart.`
      : `Includes live calculator, step-by-step formula & reference table.`;

  const fullDesc = `${factorClause} ${benefitClause} ${featuresClause}`;
  if (fullDesc.length <= 160) {
    return fullDesc;
  }

  // Compact fallback when unit names are very long (e.g., engineering compound units)
  const compactBenefit = `Convert ${symA} to ${symB} instantly for free.`;
  const compactDesc = `${factorClause} ${compactBenefit} ${featuresClause}`;
  if (compactDesc.length <= 160) {
    return compactDesc;
  }

  return formatSeoDescription(compactDesc);
}

/**
 * Ensures the rendered <title> tag on non-tool pages (after Next.js template "%s | UnitConvertersGo" appends 19 chars)
 * stays <= 60 characters and never repeats the brand name twice.
 */
export function formatSeoTitle(rawTitle: string): string {
  let clean = rawTitle
    .replace(/\s*\|\s*UnitConvertersGo(?:\.com)?/gi, "")
    .replace(/\s*[—–-]\s*UnitConvertersGo(?:\.com)?/gi, "")
    .replace(/\s*\(UnitConvertersGo(?:\.com)?\)/gi, "")
    .trim();

  if (clean.length <= 41) {
    return clean;
  }

  const dashIdx = clean.search(/\s+[—–-]\s+/);
  if (dashIdx > 0) {
    const primaryPart = clean.slice(0, dashIdx).trim();
    if (primaryPart.length >= 12 && primaryPart.length <= 41) {
      return primaryPart;
    }
    clean = primaryPart;
  }

  if (clean.length > 41) {
    const withoutParens = clean
      .replace(/\s*\([^)]*\)\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (withoutParens.length <= 41) {
      return withoutParens;
    }
    const compactConverter = clean.replace(/\s+Converter$/i, "").trim();
    if (compactConverter.length <= 41) {
      return compactConverter;
    }
    const withoutBoth = withoutParens.replace(/\s+Converter$/i, "").trim();
    if (withoutBoth.length <= 41) {
      return withoutBoth;
    }
    return withoutBoth.slice(0, 40).trim();
  }

  return clean;
}

/**
 * Guarantees every meta description is between 75 and 160 characters with a clear benefit/CTA.
 */
export function formatSeoDescription(
  rawDesc: string,
  fallbackAppend = "Includes live calculator, step-by-step formula & reference table."
): string {
  let desc = (rawDesc || "").replace(/\s+/g, " ").trim();

  if (desc.length < 75) {
    const combined = desc.endsWith(".")
      ? `${desc} ${fallbackAppend}`
      : `${desc}. ${fallbackAppend}`;
    desc = combined.trim();
  }

  if (desc.length > 160) {
    const sliced = desc.slice(0, 157);
    const lastSpace = sliced.lastIndexOf(" ");
    const cleanCut = (lastSpace > 110 ? sliced.slice(0, lastSpace) : sliced)
      .replace(/[,;:\s—–-]+$/, "")
      .trim();
    desc = cleanCut.endsWith(".") ? cleanCut : `${cleanCut}.`;
  }

  return desc;
}

export function buildPageMetadata({
  title,
  description,
  canonicalPath,
  ogType,
  type,
  noindex = false,
  categoryId,
  pairSlug,
  useExactTitle = false,
}: {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article";
  type?: "website" | "article";
  noindex?: boolean;
  categoryId?: string;
  pairSlug?: string;
  useExactTitle?: boolean;
}): Metadata {
  const resolvedOgType = ogType ?? type ?? "website";
  const cleanTitle = useExactTitle ? title.trim() : formatSeoTitle(title);
  const socialTitle = useExactTitle
    ? cleanTitle
    : `${cleanTitle} | ${SITE_CONFIG.name}`;
  const cleanDescription = formatSeoDescription(description);
  const canonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${SITE_CONFIG.baseUrl}${
        canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`
      }`;

  const ogImage = getCategoryOgImage(categoryId, socialTitle, pairSlug);

  return {
    title: useExactTitle ? { absolute: cleanTitle } : cleanTitle,
    description: cleanDescription,
    icons: SHARED_FAVICON_ICONS,
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: resolvedOgType,
      locale: "en_US",
      siteName: SITE_CONFIG.name,
      title: socialTitle,
      description: cleanDescription,
      url: canonicalUrl,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: cleanDescription,
      images: [ogImage.url],
    },
  };
}
