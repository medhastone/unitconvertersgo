import type { Metadata } from "next";
import { SITE_CONFIG } from "./config";
import type { ConversionPairInfo, Unit } from "./conversions/types";
import { CATEGORY_MAP, UNIT_MAP } from "./conversions/units";
import { convertUnits } from "./conversions/engine";
import { getCategoryUrlSlug } from "./conversions/url";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_CONFIG.baseUrl}/og-default.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_CONFIG.name} — Free Online Unit Converter`,
  type: "image/png",
};

/**
 * Resolves the 1200x630 OpenGraph & Twitter card image for a specific category
 * (generated at build time under /public/og/category-[slug].png) or falls back to /og-default.png.
 */
export function getCategoryOgImage(categoryId?: string, altOverride?: string) {
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
 * "More Conversions" footer link blocks and marked noindex,follow when accessed directly.
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
 * Specialized niche physics/engineering categories flagged as low/zero organic search demand
 * candidates to keep live with `robots: { index: false, follow: true }`.
 */
export const OBSCURE_SCIENTIFIC_CATEGORY_IDS = new Set<string>([
  "permeability",
  "magnetomotive_force",
  "charge_linear",
  "charge_surface",
  "charge_volume",
  "current_linear",
  "current_surface",
  "heat_density",
  "heat_flux_density",
  "heat_transfer_coefficient",
  "mass_flux_density",
  "specific_volume",
  "acceleration_angular",
  "thermal_expansion",
  "thermal_resistance",
  "radiation_exposure",
  "sound",
  "prefixes",
]);

export function isObscureConversionPair(pair: ConversionPairInfo): boolean {
  if (OBSCURE_SCIENTIFIC_CATEGORY_IDS.has(pair.categoryId)) {
    return true;
  }
  if (
    OBSCURE_UNIT_IDS.has(pair.fromUnitId) &&
    OBSCURE_UNIT_IDS.has(pair.toUnitId)
  ) {
    return true;
  }
  if (
    pair.fromUnitId === "exameter" ||
    pair.toUnitId === "exameter" ||
    pair.fromUnitId === "petameter" ||
    pair.toUnitId === "petameter" ||
    pair.fromUnitId === "terameter" ||
    pair.toUnitId === "terameter" ||
    pair.fromUnitId === "gigameter" ||
    pair.toUnitId === "gigameter" ||
    pair.fromUnitId === "femtometer" ||
    pair.toUnitId === "femtometer" ||
    pair.fromUnitId === "picometer" ||
    pair.toUnitId === "picometer" ||
    pair.fromUnitId === "planck_length" ||
    pair.toUnitId === "planck_length"
  ) {
    return true;
  }
  return false;
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
  useExactTitle = false,
}: {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article";
  type?: "website" | "article";
  noindex?: boolean;
  categoryId?: string;
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

  const ogImage = getCategoryOgImage(categoryId, socialTitle);

  return {
    title: useExactTitle ? { absolute: cleanTitle } : cleanTitle,
    description: cleanDescription,
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
