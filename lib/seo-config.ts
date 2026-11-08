import { getCategoryUrlSlug } from "./conversions/url";

/**
 * Priority indexable category URL slugs.
 * Categories NOT in this list remain live and reachable for users,
 * but output `<meta name="robots" content="noindex, follow">` and are excluded from XML sitemaps
 * and primary crawlable directory sections to preserve crawl budget.
 */
export const INDEXABLE_CATEGORIES = [
  "length",
  "weight-and-mass",
  "temperature",
  "volume",
  "area",
  "speed",
  "time",
  "pressure",
  "energy",
  "power",
  "data-storage",
  "data-transfer",
  "fuel-consumption",
  "force",
  "density",
  "angle",
  "frequency",
  "cooking",
] as const;

export type IndexableCategorySlug = (typeof INDEXABLE_CATEGORIES)[number];

const INDEXABLE_CATEGORY_SET = new Set<string>(INDEXABLE_CATEGORIES);

/**
 * Checks whether a category (by URL slug such as `weight-and-mass` OR internal ID such as `mass`)
 * is in the priority indexable set.
 */
export function isIndexableCategory(slugOrId: string): boolean {
  if (!slugOrId) return false;
  const normalized = slugOrId.trim().toLowerCase();
  if (INDEXABLE_CATEGORY_SET.has(normalized)) return true;
  const resolvedSlug = getCategoryUrlSlug(normalized).toLowerCase();
  return INDEXABLE_CATEGORY_SET.has(resolvedSlug);
}

export interface PopularConverterLink {
  slug: string;
  categorySlug: string;
  href: string;
  anchorText: string;
  shortLabel: string;
}

/**
 * Top 20 most popular unit converters across priority indexable categories.
 * Used for server-rendered internal linking on the Homepage and Converter pages.
 */
export const TOP_20_POPULAR_CONVERTERS: PopularConverterLink[] = [
  {
    slug: "meters-to-feet",
    categorySlug: "length",
    href: "/length/meters-to-feet",
    anchorText: "meters to feet converter",
    shortLabel: "Meters to Feet (m → ft)",
  },
  {
    slug: "feet-to-meters",
    categorySlug: "length",
    href: "/length/feet-to-meters",
    anchorText: "feet to meters converter",
    shortLabel: "Feet to Meters (ft → m)",
  },
  {
    slug: "cm-to-inches",
    categorySlug: "length",
    href: "/length/cm-to-inches",
    anchorText: "centimeters to inches converter",
    shortLabel: "Centimeters to Inches (cm → in)",
  },
  {
    slug: "inches-to-cm",
    categorySlug: "length",
    href: "/length/inches-to-cm",
    anchorText: "inches to centimeters converter",
    shortLabel: "Inches to Centimeters (in → cm)",
  },
  {
    slug: "km-to-miles",
    categorySlug: "length",
    href: "/length/km-to-miles",
    anchorText: "kilometers to miles converter",
    shortLabel: "Kilometers to Miles (km → mi)",
  },
  {
    slug: "miles-to-km",
    categorySlug: "length",
    href: "/length/miles-to-km",
    anchorText: "miles to kilometers converter",
    shortLabel: "Miles to Kilometers (mi → km)",
  },
  {
    slug: "mm-to-inches",
    categorySlug: "length",
    href: "/length/mm-to-inches",
    anchorText: "millimeters to inches converter",
    shortLabel: "Millimeters to Inches (mm → in)",
  },
  {
    slug: "kg-to-lbs",
    categorySlug: "weight-and-mass",
    href: "/weight-and-mass/kg-to-lbs",
    anchorText: "kilograms to pounds converter",
    shortLabel: "Kilograms to Pounds (kg → lb)",
  },
  {
    slug: "lbs-to-kg",
    categorySlug: "weight-and-mass",
    href: "/weight-and-mass/lbs-to-kg",
    anchorText: "pounds to kilograms converter",
    shortLabel: "Pounds to Kilograms (lb → kg)",
  },
  {
    slug: "grams-to-ounces",
    categorySlug: "weight-and-mass",
    href: "/weight-and-mass/grams-to-ounces",
    anchorText: "grams to ounces converter",
    shortLabel: "Grams to Ounces (g → oz)",
  },
  {
    slug: "ounces-to-grams",
    categorySlug: "weight-and-mass",
    href: "/weight-and-mass/ounces-to-grams",
    anchorText: "ounces to grams converter",
    shortLabel: "Ounces to Grams (oz → g)",
  },
  {
    slug: "celsius-to-fahrenheit",
    categorySlug: "temperature",
    href: "/temperature/celsius-to-fahrenheit",
    anchorText: "celsius to fahrenheit converter",
    shortLabel: "Celsius to Fahrenheit (°C → °F)",
  },
  {
    slug: "fahrenheit-to-celsius",
    categorySlug: "temperature",
    href: "/temperature/fahrenheit-to-celsius",
    anchorText: "fahrenheit to celsius converter",
    shortLabel: "Fahrenheit to Celsius (°F → °C)",
  },
  {
    slug: "liters-to-gallons",
    categorySlug: "volume",
    href: "/volume/liters-to-gallons",
    anchorText: "liters to gallons converter",
    shortLabel: "Liters to Gallons (L → gal)",
  },
  {
    slug: "gallons-to-liters",
    categorySlug: "volume",
    href: "/volume/gallons-to-liters",
    anchorText: "gallons to liters converter",
    shortLabel: "Gallons to Liters (gal → L)",
  },
  {
    slug: "sq-feet-to-sq-meters",
    categorySlug: "area",
    href: "/area/sq-feet-to-sq-meters",
    anchorText: "square feet to square meters converter",
    shortLabel: "Square Feet to Square Meters (ft² → m²)",
  },
  {
    slug: "acres-to-sq-feet",
    categorySlug: "area",
    href: "/area/acres-to-sq-feet",
    anchorText: "acres to square feet converter",
    shortLabel: "Acres to Square Feet (ac → ft²)",
  },
  {
    slug: "mph-to-kph",
    categorySlug: "speed",
    href: "/speed/mph-to-kph",
    anchorText: "miles per hour to kilometers per hour converter",
    shortLabel: "mph to km/h Converter",
  },
  {
    slug: "bar-to-psi",
    categorySlug: "pressure",
    href: "/pressure/bar-to-psi",
    anchorText: "bar to psi converter",
    shortLabel: "Bar to PSI Converter",
  },
  {
    slug: "watts-to-horsepower",
    categorySlug: "power",
    href: "/power/watts-to-horsepower",
    anchorText: "watts to horsepower converter",
    shortLabel: "Watts to Horsepower (W → hp)",
  },
];
