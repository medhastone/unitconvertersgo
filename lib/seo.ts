import type { Metadata } from "next";
import { SITE_CONFIG } from "./config";
import type { ConversionPairInfo } from "./conversions/types";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_CONFIG.baseUrl}/og-default.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_CONFIG.name} — High-Precision Unit Converter`,
  type: "image/png",
};

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
 * Ensures the rendered <title> tag (after Next.js template "%s | UnitConvertersGo" appends 21 chars)
 * stays <= 60 characters and never repeats the brand name twice.
 */
export function formatSeoTitle(rawTitle: string): string {
  // Strip any existing brand suffix so layout template never duplicates it
  let clean = rawTitle
    .replace(/\s*\|\s*UnitConvertersGo(?:\.com)?/gi, "")
    .replace(/\s*[—–-]\s*UnitConvertersGo(?:\.com)?/gi, "")
    .replace(/\s*\(UnitConvertersGo(?:\.com)?\)/gi, "")
    .trim();

  // Because root layout appends " | UnitConvertersGo" (19 chars), keep base title <= 41 chars
  if (clean.length <= 41) {
    return clean;
  }

  // If title has " — " or " - " subtitle (e.g. "CM to Inches Converter — Centimeters to Inches"), drop the subtitle
  const dashIdx = clean.search(/\s+[—–-]\s+/);
  if (dashIdx > 0) {
    const primaryPart = clean.slice(0, dashIdx).trim();
    if (primaryPart.length >= 12 && primaryPart.length <= 41) {
      return primaryPart;
    }
    clean = primaryPart;
  }

  // If still > 41 chars and has parenthetical symbols "(cm to in)", try dropping parenthetical or word "Converter"
  if (clean.length > 41) {
    const withoutParens = clean.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
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
 * Guarantees every meta description is between 75 and 158 characters with a clear benefit/CTA.
 */
export function formatSeoDescription(
  rawDesc: string,
  fallbackAppend = "Includes live calculator, exact formula, and reference table."
): string {
  let desc = (rawDesc || "").replace(/\s+/g, " ").trim();

  if (desc.length < 75) {
    const combined = desc.endsWith(".")
      ? `${desc} ${fallbackAppend}`
      : `${desc}. ${fallbackAppend}`;
    desc = combined.trim();
  }

  if (desc.length > 158) {
    const sliced = desc.slice(0, 155);
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
}: {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article";
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const resolvedOgType = ogType ?? type ?? "website";
  const cleanTitle = formatSeoTitle(title);
  const cleanDescription = formatSeoDescription(description);
  const canonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${SITE_CONFIG.baseUrl}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;

  return {
    title: cleanTitle,
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
      title: `${cleanTitle} | ${SITE_CONFIG.name}`,
      description: cleanDescription,
      url: canonicalUrl,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | ${SITE_CONFIG.name}`,
      description: cleanDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
