import { getCategoryUrlSlug, getInternalCategoryId } from "./conversions/url";
import {
  INDEXABLE_CATEGORY_HUBS,
  MERGED_THIN_HUB_SLUGS,
  isCategoryHubIndexable,
  isMergedThinHub,
  getConverterTier,
  isPairIndexable,
  ConverterTier,
} from "./seo-tiers";

/**
 * Single source of truth for indexable category hubs.
 * Note: Converter pages now use page-level tier assignment via `isPairIndexable(pair)`
 * and `getConverterTier(pair)` in `lib/seo-tiers.ts`.
 * Thin hubs (/radiation, /digital-image-resolution, /concentration-molar, /fuel-consumption)
 * have been merged into /specialty via 301 permanent redirects.
 */
export const INDEXABLE_CATEGORIES = INDEXABLE_CATEGORY_HUBS;

export type IndexableCategorySlug = (typeof INDEXABLE_CATEGORIES)[number];

/**
 * Returns true if the given category slug or internal category ID is an indexable category hub.
 */
export function isIndexableCategory(slugOrId: string): boolean {
  return isCategoryHubIndexable(slugOrId);
}

/**
 * Deterministic build/content timestamp for sitemaps so <lastmod> reflects
 * the actual content release date rather than changing on every HTTP request.
 */
export const SITEMAP_LASTMOD = "2026-11-08T00:00:00.000Z";

export const TOP_20_POPULAR_CONVERTERS = [
  { href: "/length/cm-to-inches", anchorText: "cm to inches" },
  { href: "/length/inches-to-cm", anchorText: "inches to cm" },
  { href: "/weight-and-mass/kg-to-lbs", anchorText: "kg to lbs" },
  { href: "/weight-and-mass/lbs-to-kg", anchorText: "lbs to kg" },
  { href: "/temperature/celsius-to-fahrenheit", anchorText: "Celsius to Fahrenheit" },
  { href: "/temperature/fahrenheit-to-celsius", anchorText: "Fahrenheit to Celsius" },
  { href: "/length/meters-to-feet", anchorText: "meters to feet" },
  { href: "/length/feet-to-meters", anchorText: "feet to meters" },
  { href: "/length/km-to-miles", anchorText: "km to miles" },
  { href: "/length/miles-to-km", anchorText: "miles to km" },
  { href: "/length/mm-to-inches", anchorText: "mm to inches" },
  { href: "/weight-and-mass/grams-to-ounces", anchorText: "grams to ounces" },
  { href: "/weight-and-mass/ounces-to-grams", anchorText: "ounces to grams" },
  { href: "/volume/liters-to-gallons", anchorText: "liters to gallons" },
  { href: "/volume/gallons-to-liters", anchorText: "gallons to liters" },
  { href: "/volume/ml-to-oz", anchorText: "ml to oz" },
  { href: "/area/square-feet-to-square-meters", anchorText: "sq ft to sq m" },
  { href: "/area/acres-to-hectares", anchorText: "acres to hectares" },
  { href: "/pressure/psi-to-kpa", anchorText: "psi to kPa" },
  { href: "/power/watts-to-horsepower", anchorText: "watts to horsepower" },
] as const;

export {
  INDEXABLE_CATEGORY_HUBS,
  MERGED_THIN_HUB_SLUGS,
  isCategoryHubIndexable,
  isMergedThinHub,
  getConverterTier,
  isPairIndexable,
  type ConverterTier,
};

