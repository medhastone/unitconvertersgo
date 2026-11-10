import { CONVERSION_CATALOGUE, findDedicatedPair } from "./conversions/catalogue";
import { UNIT_MAP } from "./conversions/units";
import { getCategoryUrlSlug, getInternalCategoryId, getCanonicalConverterPath } from "./conversions/url";
import { ConversionPairInfo, Unit } from "./conversions/types";
import { evaluateContentGate } from "./content-gate";
import { getPairContent, hasStaticPairContent } from "./pair-content";

export type ConverterTier = "A" | "B" | "C";

/**
 * Thin category hubs merged into /specialty via 301 permanent redirects (Task 4).
 */
export const MERGED_THIN_HUB_SLUGS = [
  "radiation",
  "digital-image-resolution",
  "concentration-molar",
  "fuel-consumption",
] as const;

/**
 * Category hubs that remain indexable and have >= 8 meaningful converters (Tasks 2 & 4).
 */
export const INDEXABLE_CATEGORY_HUBS = [
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
  "force",
  "density",
  "torque",
  "angle",
  "frequency",
  "flow",
  "numbers",
  "cooking",
  "specialty",
] as const;

const INDEXABLE_HUB_SET = new Set<string>(INDEXABLE_CATEGORY_HUBS);
const MERGED_THIN_HUB_SET = new Set<string>(MERGED_THIN_HUB_SLUGS);

export function isMergedThinHub(categoryIdOrSlug: string): boolean {
  const slug = getCategoryUrlSlug(getInternalCategoryId(categoryIdOrSlug));
  return MERGED_THIN_HUB_SET.has(slug) || MERGED_THIN_HUB_SET.has(categoryIdOrSlug);
}

export function isCategoryHubIndexable(categoryIdOrSlug: string): boolean {
  if (categoryIdOrSlug === "cooking" || categoryIdOrSlug === "specialty") {
    return true;
  }
  const internalId = getInternalCategoryId(categoryIdOrSlug);
  const slug = getCategoryUrlSlug(internalId);
  if (MERGED_THIN_HUB_SET.has(slug) || MERGED_THIN_HUB_SET.has(categoryIdOrSlug)) {
    return false;
  }
  return Boolean(slug && slug.length > 0);
}

/**
 * Archaic, astronomical, or extreme-prefix units that have near-zero search demand
 * when paired with everyday units (Task 2 Tier C rule).
 */
const ARCHAIC_OR_ASTRONOMICAL_UNIT_IDS = new Set<string>([
  // Astronomical / archaic / extreme length
  "solar_radius",
  "sun_radius",
  "earth_radius",
  "bohr_radius",
  "parsec",
  "kiloparsec",
  "megaparsec",
  "light_year",
  "astronomical_unit",
  "cubit",
  "long_cubit",
  "royal_cubit",
  "caliber",
  "link",
  "chain",
  "fathom",
  "rod",
  "perch",
  "pole",
  "furlong",
  "hand",
  "league",
  "nautical_league",
  "megameter",
  "gigameter",
  "terameter",
  "petameter",
  "exameter",
  "microinch",
  "picometer",
  "femtometer",
  "attometer",
  "planck_length",
  "arpent",
  "vara",
  "russian_verst",
  "circular_mil",

  // Archaic / extreme volume
  "attoliter",
  "picoliter",
  "femtoliter",
  "nanoliter",
  "gigaliter",
  "teraliter",
  "decaliter",
  "gill_us",
  "gill_uk",
  "minim_us",
  "minim_uk",
  "fluid_dram_us",
  "fluid_dram_uk",
  "hogshead",
  "board_foot",
  "acre_foot",
  "acre_inch",
  "stere",
  "register_ton",
  "drop",
  "dash",
  "pinch",
  "smidgen",
  "fifth",

  // Archaic / extreme mass
  "dram",
  "scruple",
  "quarter_us",
  "quarter_uk",
  "planck_mass",
  "gamma",
  "assay_ton",
  "mite",

  // Archaic CGS ESU/EMU & extreme energy/pressure
  "abvolt",
  "statvolt",
  "abampere",
  "statampere",
  "biot",
  "abohm",
  "statohm",
  "abfarad",
  "statfarad",
  "abhenry",
  "stathenry",
  "abcoulomb",
  "statcoulomb",
  "franklin",
  "faraday",
  "unit_pole",
  "poundal",
  "sthene",
  "erg",
  "quad",
  "rydberg",
  "hartree",
  "ton_tnt",
  "kiloton_tnt",
  "megaton_tnt",
  "torr_abs",
  "blondel",
  "skot",
  "rutherford",
  "terapascal",
  "nanopascal",
  "microwatt",
  "nanowatt",
  "picowatt",
  "nanojoule",
  "microjoule",
  "millijoule",
  "inch_ounce",

  // Extreme data prefixes
  "exabyte",
  "zettabyte",
  "yottabyte",
  "pebibyte",
  "exbibyte",
  "zebibyte",
  "yobibyte",
  "nibble",
  "word",

  // Extreme time
  "shake",
  "svedberg",
  "planck_time",
  "Sidereal_day",
  "sidereal_year",
  "picosecond",
  "femtosecond",
  "attosecond",
]);

const ZERO_DEMAND_PAIR_SLUGS = new Set<string>([
  "cups-to-cubic-millimeters",
  "cubic-millimeters-to-cups",
  "lakhs-to-dozens",
  "dozens-to-lakhs",
  "hectares-to-square-millimeters",
  "square-millimeters-to-hectares",
  "square-millimeters-to-square-feet",
  "square-feet-to-square-millimeters",
]);

export function isAbsurdOrArchaicUnit(unitId: string): boolean {
  return ARCHAIC_OR_ASTRONOMICAL_UNIT_IDS.has(unitId);
}

/**
 * Checks whether both units measure the exact same physical quantity (Task 1 & Task 3).
 * Specifically flags:
 * - Electric Charge (Ah, mAh, C) vs Electrical Energy (Wh, kWh) in `charge` category
 * - Volume vs Mass pairs outside of the `/cooking` ingredient converter
 * - Any pair where `fromUnit.categoryId !== toUnit.categoryId`
 */
const ENERGY_UNITS_IN_CHARGE_CATEGORY = new Set<string>(["watt_hour", "kilowatt_hour"]);
const MASS_UNIT_IDS = new Set<string>([
  "kilogram",
  "gram",
  "milligram",
  "microgram",
  "pound",
  "ounce",
  "stone",
  "us_ton",
  "imperial_ton",
  "metric_ton",
  "troy_ounce",
  "carat",
]);
const VOLUME_UNIT_IDS = new Set<string>([
  "liter",
  "milliliter",
  "us_gallon",
  "imperial_gallon",
  "us_quart",
  "imperial_quart",
  "us_pint",
  "imperial_pint",
  "us_cup",
  "imperial_cup",
  "metric_cup",
  "us_fluid_ounce",
  "imperial_fluid_ounce",
  "us_tablespoon",
  "us_teaspoon",
  "cubic_meter",
  "cubic_centimeter",
  "cubic_millimeter",
  "cubic_foot",
  "cubic_inch",
  "cubic_yard",
]);

export function checkDimensionMatch(
  fromUnit: Unit | undefined,
  toUnit: Unit | undefined,
  slug?: string
): { matches: boolean; reason?: string } {
  if (!fromUnit || !toUnit) {
    return { matches: false, reason: "Missing unit definition" };
  }

  // Check Charge (Ah, mAh, Coulombs) vs Energy (Wh, kWh)
  const fromIsEnergyInCharge =
    fromUnit.categoryId === "charge" && ENERGY_UNITS_IN_CHARGE_CATEGORY.has(fromUnit.id);
  const toIsEnergyInCharge =
    toUnit.categoryId === "charge" && ENERGY_UNITS_IN_CHARGE_CATEGORY.has(toUnit.id);
  if (fromIsEnergyInCharge !== toIsEnergyInCharge) {
    return {
      matches: false,
      reason:
        "Electric Charge (Ah/mAh) vs Electrical Energy (Wh/kWh) requires a nominal voltage assumption (E = Q × V)",
    };
  }

  // Check Volume vs Mass
  const fromIsVol = VOLUME_UNIT_IDS.has(fromUnit.id) || fromUnit.categoryId === "volume";
  const toIsVol = VOLUME_UNIT_IDS.has(toUnit.id) || toUnit.categoryId === "volume";
  const fromIsMass = MASS_UNIT_IDS.has(fromUnit.id) || fromUnit.categoryId === "weight";
  const toIsMass = MASS_UNIT_IDS.has(toUnit.id) || toUnit.categoryId === "weight";
  if ((fromIsVol && toIsMass) || (fromIsMass && toIsVol)) {
    return {
      matches: false,
      reason: "Volume vs Mass conversion requires a material density assumption (m = ρ × V)",
    };
  }

  if (fromUnit.categoryId !== toUnit.categoryId) {
    return {
      matches: false,
      reason: `Mismatched unit categories (${fromUnit.categoryId} vs ${toUnit.categoryId})`,
    };
  }

  if (slug && (slug.includes("pints-to-metric-tons") || slug.includes("metric-tons-to-pints"))) {
    return {
      matches: false,
      reason: "Volume (pints) vs Mass (metric tons) dimension mismatch",
    };
  }

  return { matches: true };
}

/**
 * Detects whether a slug suffers from exponent loss (e.g., stripped ² or ³ or / resulting in
 * ambiguous fragments like `g-m-to-lb-ft`, `kgf-m-to-feet-of-water`, `pascals-to-kgf-cm`,
 * `dynes-cm-to-pascals`, `terawatts-to-ft-lbf-s`, `g-m-to-g-ml`).
 */
const EXPONENT_LOSS_PATTERNS: RegExp[] = [
  /(?:^|-)(?:g-m|kg-m|mg-m|g-cm|kgf-cm|dynes-cm|ft-lbf-s|btu-h|kj-h|kcal-h)(?:-to-|$)/i,
  /(?:^|-)kg-per-m3|g-per-cm3|lb-per-ft3|lb-per-in3|lb-per-yd3(?:-to-|$)/i,
  /^kgf-m-to-feet-of-water$/i,
  /^feet-of-water-to-kgf-m$/i,
  /^g-m-to-lb-ft$/i,
  /^lb-ft-to-g-m$/i,
  /^g-m-to-g-ml$/i,
  /^pascals-to-kgf-cm$/i,
  /^dynes-cm-to-pascals$/i,
  /^terawatts-to-ft-lbf-s$/i,
];

const ALLOWED_ACRONYM_SLUGS = new Set<string>([
  "psi",
  "ksi",
  "cfm",
  "gpm",
  "gph",
  "lpm",
  "mph",
  "kph",
  "mpg",
  "rpm",
  "dpi",
  "ppi",
]);

export function checkSlugHasExponentLoss(
  slug: string,
  fromUnit?: Unit,
  toUnit?: Unit
): boolean {
  for (const pat of EXPONENT_LOSS_PATTERNS) {
    if (pat.test(slug)) return true;
  }

  // Also check if either unit symbol has ² or ³ and the slug has a bare -m-, -cm-, -ft-, -in- without square/cubic/sq/cu
  const checkUnitPart = (u: Unit | undefined, part: string): boolean => {
    if (!u) return false;
    if (ALLOWED_ACRONYM_SLUGS.has(part)) return false;
    const hasSquare = u.symbol.includes("²") || /square/i.test(u.name);
    const hasCubic = u.symbol.includes("³") || /cubic/i.test(u.name);
    if (
      hasSquare &&
      !part.includes("square") &&
      !part.startsWith("sq-") &&
      !part.includes("-sq-") &&
      !part.includes("acre") &&
      !part.includes("hectare") &&
      !part.includes("are") &&
      !part.includes("bar") &&
      !part.includes("pascal") &&
      !part.includes("psi") &&
      !part.includes("ksi") &&
      !part.includes("torr") &&
      !part.includes("atm") &&
      !part.includes("inhg") &&
      !part.includes("mmhg") &&
      !part.includes("water") &&
      !part.includes("lux") &&
      !part.includes("foot-candle") &&
      !part.includes("nit") &&
      !part.includes("stilb") &&
      !part.includes("lambert") &&
      !part.includes("phot") &&
      !part.includes("gauss") &&
      !part.includes("tesla") &&
      !part.includes("barye") &&
      !part.includes("pieze")
    ) {
      return true;
    }
    if (
      hasCubic &&
      !part.includes("cubic") &&
      !part.startsWith("cu-") &&
      !part.includes("-cu-") &&
      !part.includes("liter") &&
      !part.includes("milliliter") &&
      !part.includes("ml") &&
      !part.includes("cc") &&
      !part.includes("gallon") &&
      !part.includes("quart") &&
      !part.includes("pint") &&
      !part.includes("cup") &&
      !part.includes("ounce") &&
      !part.includes("fl-oz") &&
      !part.includes("tablespoon") &&
      !part.includes("tbsp") &&
      !part.includes("teaspoon") &&
      !part.includes("tsp") &&
      !part.includes("barrel") &&
      !part.includes("cfm") &&
      !part.includes("gpm") &&
      !part.includes("gph")
    ) {
      return true;
    }
    return false;
  };

  const parts = slug.split("-to-");
  if (parts.length === 2) {
    if (checkUnitPart(fromUnit, parts[0]) || checkUnitPart(toUnit, parts[1])) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a converter pair is a duplicate of another canonical converter page (Task 1 & Task 3).
 */
const SeenPhysicalPairs = new Map<string, string>();
let duplicateMapInitialized = false;

function initDuplicateMap() {
  if (duplicateMapInitialized) return;
  duplicateMapInitialized = true;

  for (const item of CONVERSION_CATALOGUE) {
    const key = `${item.fromUnitId}__${item.toUnitId}`;
    const canonicalPath = getCanonicalConverterPath(item.categoryId, item.slug);
    if (!SeenPhysicalPairs.has(key)) {
      SeenPhysicalPairs.set(key, canonicalPath);
    }
  }
}

export function getDuplicateOf(pair: ConversionPairInfo): string | null {
  initDuplicateMap();
  const canonicalPath = getCanonicalConverterPath(pair.categoryId, pair.slug);

  // Check if same physical unit pair is already owned by an earlier canonical entry
  const key = `${pair.fromUnitId}__${pair.toUnitId}`;
  const ownerPath = SeenPhysicalPairs.get(key);
  if (ownerPath && ownerPath !== canonicalPath) {
    return ownerPath;
  }

  // Check cross-category duplicate concepts (e.g. watt_hour <-> kilowatt_hour in charge vs energy)
  if (pair.categoryId === "charge" && ENERGY_UNITS_IN_CHARGE_CATEGORY.has(pair.fromUnitId) && ENERGY_UNITS_IN_CHARGE_CATEGORY.has(pair.toUnitId)) {
    const energyPair = findDedicatedPair(pair.fromUnitId, pair.toUnitId);
    if (energyPair && energyPair.categoryId === "energy") {
      return getCanonicalConverterPath(energyPair.categoryId, energyPair.slug);
    }
  }

  // Check mass_flux_density kg-to-g vs weight-and-mass/kg-to-grams
  if (pair.categoryId === "mass_flux_density" && (pair.slug === "kg-to-g" || pair.slug === "g-to-kg")) {
    return pair.slug === "kg-to-g"
      ? "/weight-and-mass/kg-to-grams"
      : "/weight-and-mass/grams-to-kg";
  }

  return null;
}

/**
 * Determine the Page-Level Indexing Tier (A, B, or C) for any converter pair (Tasks 2 & 5).
 * - Tier A: High-demand seed pairs that pass the 7-point Content Gate (`lib/content-gate.ts`).
 * - Tier B: Plausible pairs in indexable categories that have unique content passing `lib/content-gate.ts`.
 * - Tier C: Absurd/archaic/zero-demand pairs, any pair failing `dimension_match`, any `duplicate_of` loser,
 *           any pair with `slug_has_exponent_loss`, or any page failing the Content Gate.
 */
const tierCache = new Map<string, ConverterTier>();

export function getConverterTier(pair: ConversionPairInfo): ConverterTier {
  const cacheKey = `${pair.categoryId}/${pair.slug}`;
  const cached = tierCache.get(cacheKey);
  if (cached) return cached;

  const fromU = UNIT_MAP.get(pair.fromUnitId);
  const toU = UNIT_MAP.get(pair.toUnitId);

  // 1. Fail fast to Tier C on dimension mismatch
  const dim = checkDimensionMatch(fromU, toU, pair.slug);
  if (!dim.matches) {
    tierCache.set(cacheKey, "C");
    return "C";
  }

  // 2. Fail fast to Tier C on duplicate loser
  if (getDuplicateOf(pair) !== null) {
    tierCache.set(cacheKey, "C");
    return "C";
  }

  // 3. Fail fast to Tier C on slug exponent loss
  if (checkSlugHasExponentLoss(pair.slug, fromU, toU)) {
    tierCache.set(cacheKey, "C");
    return "C";
  }

  // 4. Fail fast to Tier C if either unit is archaic/astronomical or slug is in zero-demand list
  if (
    isAbsurdOrArchaicUnit(pair.fromUnitId) ||
    isAbsurdOrArchaicUnit(pair.toUnitId) ||
    ZERO_DEMAND_PAIR_SLUGS.has(pair.slug)
  ) {
    tierCache.set(cacheKey, "C");
    return "C";
  }

  // 5. Check extreme scale ratio (> 1e12 or < 1e-12) for everyday categories
  if (
    fromU?.toBase &&
    toU?.toBase &&
    pair.categoryId !== "permeability" &&
    pair.fromUnitId !== "electronvolt" &&
    pair.toUnitId !== "electronvolt"
  ) {
    const ratio = fromU.toBase / toU.toBase;
    if (ratio > 1e12 || ratio < 1e-12) {
      tierCache.set(cacheKey, "C");
      return "C";
    }
  }

  // 6. Enforce Content Gate (Task 5: "Pages failing the gate are automatically treated as Tier C")
  const pairContent = getPairContent(pair.slug, pair);
  if (!pairContent) {
    tierCache.set(cacheKey, "C");
    return "C";
  }

  const gateResult = evaluateContentGate(pairContent);
  if (!gateResult.passed) {
    tierCache.set(cacheKey, "C");
    return "C";
  }

  // Pairs with static pair-content JSON in our high-demand seed set are Tier A;
  // other plausible pairs across all categories that pass the Content Gate are Tier B
  const tier: ConverterTier = hasStaticPairContent(pair.slug) ? "A" : "B";
  tierCache.set(cacheKey, tier);
  return tier;
}

export function isPairIndexable(pair: ConversionPairInfo): boolean {
  const tier = getConverterTier(pair);
  return tier === "A" || tier === "B";
}
