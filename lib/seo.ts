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

import { OBSCURE_UNIT_IDS } from "./conversions/obscure-units";
export { OBSCURE_UNIT_IDS };

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

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "-": "⁻",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function toSuperscriptExponent(exp: number): string {
  const s = String(Math.round(exp))
    .split("")
    .map((ch) => SUPERSCRIPT_DIGITS[ch] ?? ch)
    .join("");
  return `10${s}`;
}

function cleanPrefixLabel(unit: Unit): string {
  if (unit.id === "prefix_none") return "Base Units";
  return cleanUnitDisplayName(unit.name);
}

/**
 * Natural, high-intent title overrides for top-searched converter pairs (< 60 chars).
 */
const COMPACT_QUERY_TITLE_OVERRIDES: Record<string, string> = {
  "lbs-to-kg": "Lbs to Kg — Convert US Pounds to Kilograms",
  "kg-to-lbs": "Kg to Lbs — Kilograms to Pounds Converter",
  "inches-to-mm": "Inches to MM Calculator — Convert Inches to Millimeters",
  "mm-to-inches": "MM to Inches — Millimeter to Inches Converter",
  "cm-to-inches": "CM to Inches — Centimeters to Inches Converter",
  "cm-to-feet": "CM to Feet — Centimeters to Feet Converter",
  "inches-to-cm": "Inches to CM — Inches to Centimeters Converter",
  "meters-to-feet": "Meters to Feet (m to ft) Converter & Chart",
  "meters-to-mm": "Meters to Millimeters (m to mm) Converter",
  "meters-to-yards": "Meters to Yards (m to yd) Converter & Chart",
  "feet-to-meters": "Feet to Meters (ft to m) Converter",
  "km-to-miles": "KM to Miles — Kilometers to Miles Converter",
  "miles-to-km": "Miles to KM — Mile in KM Calculator (mi to km)",
  "kph-to-mph": "Km/h to Mph — Convert Km into Miles per Hour",
  "mph-to-kph": "MPH to KPH — Miles to Kilometers per Hour Converter",
  "knots-to-mph": "Knots to MPH — Knot vs Miles per Hour Converter",
  "grams-to-ounces": "Grams to Ounces (g to oz) Converter",
  "ounces-to-grams": "Ounces to Grams (oz to g) Converter & Oz Chart",
  "ounces-to-pounds": "Ounces to Pounds (oz to lbs) Converter & Chart",
  "pounds-to-ounces": "Pounds to Ounces (lbs to oz) Converter & Chart",
  "grams-to-pounds": "Grams to Pounds — Convert G to Lb (g to lbs)",
  "lbs-to-stone": "Pounds to Stone (lbs to st) Converter & Chart",
  "stone-to-lbs": "Stone to Pounds (st to lbs) Converter & Chart",
  "inches-to-feet": "Inches to Feet — Convert Inches to Feet (in to ft)",
  "feet-to-inches": "Feet to Inches — Feet and Inches Calculator (ft to in)",
  "cups-to-tablespoons": "Cups to Tablespoons (cups to tbsp) Converter",
  "days-to-years": "Days to Years (d to yr) Converter & Chart",
  "gb-to-tb": "GB to TB — Gigabytes to Terabytes Converter & Chart",
  "hp-to-kw": "HP to kW — Horsepower in Kilowatts Converter",
  "newtons-to-pounds-force": "Newtons to Pounds-Force — Newton Force to Lbs Converter",
  "psi-to-megapascal": "PSI to MPa — PSI to Megapascal Converter",
  "bar-to-psi": "Bar to PSI — Pressure Bar to PSI Converter",
  "celsius-to-fahrenheit": "Celsius to Fahrenheit (°C to °F) Converter",
  "fahrenheit-to-celsius": "Fahrenheit to Celsius (°F to °C) Converter",
  "sq-feet-to-sq-meters": "Sq Ft to Sq M — Square Feet to Square Meters",
  "sq-meters-to-sq-feet": "Sq M to Sq Ft — Square Meters to Square Feet",
  "liters-to-gallons": "Liters to Gallons — Convert L to Gallons US",
  "gallons-to-liters": "Gallons to Liters — US Gallon to Liter Converter",
  "ml-to-oz": "mL to Oz — Milliliters to Fluid Ounces",
  "oz-to-ml": "Oz to mL — Fluid Ounces to Milliliters",
  "lb-ft-to-nm": "ft lbs to Nm — Foot Pounds to Newton Meters Converter",
  "nm-to-lb-ft": "Nm to ft lbs — Newton Meters to Foot Pounds",
};

const COMPACT_QUERY_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "lbs-to-kg":
    "1 lb = 0.45359237 kg. Convert US lbs to kg instantly—from one pound to one kilo or body & lifting weights—with exact formula, examples & chart.",
  "kg-to-lbs":
    "1 kg = 2.20462262 lb. Convert kilograms to pounds instantly with our kg to lbs conversion chart, kg vs. lb comparison, formula & worked examples.",
  "lbs-to-stone":
    "14 lb = 1 stone exact (1 lb = 0.07143 st). Convert pounds to UK stone & lbs for body weight & shipping—with divide-by-14 formula, examples & chart.",
  "stone-to-lbs":
    "1 stone = 14 pounds exact. Convert British stone to lbs instantly for body weight, medical charts & boxing—with multiply-by-14 formula & chart.",
  "inches-to-mm":
    "1 in = 25.4 mm exact. Instant inches to millimeters conversion for decimal & fractional inches (1/16\", 1/32\"), formula, examples & reference chart.",
  "mm-to-inches":
    "1 mm = 0.03937008 in (divide by 25.4). Convert mm into inch decimals or 1/16\" & 1/64\" tape fractions fast with our formula and reference table.",
  "meters-to-feet":
    "1 m = 3.28084 ft exact (1 ft = 0.3048 m). Convert meters (metres) to feet or US survey feet for height, engineering & maps—with conversion chart.",
  "meters-to-mm":
    "1 m = 1,000 mm exact. Convert meters to millimeters instantly for CAD drawings, construction & machining—with multiply-by-1,000 formula & chart.",
  "meters-to-yards":
    "1 m = 1.09361 yd (1 yd = 0.9144 m exact). Convert meters to yards for fabric bolts, swimming pools & track lanes—with meter vs. yards formula & chart.",
  "lb-ft-to-nm":
    "1 lb·ft = 1.35582 N·m exact. Convert ft lbs to newton metres for lug nuts, cylinder heads & dyno specs—with foot pounds to Nm chart & examples.",
  "nm-to-lb-ft":
    "1 N·m = 0.73756 lb·ft. Convert newton metres to foot lbs instantly for lug nuts, cylinder heads & torque wrenches, with exact formula & lookup chart.",
  "kph-to-mph":
    "1 km/h = 0.62137 mph. Instant conversion for kilometers to miles per hour—highway limits, running paces & speedometer speeds—plus km/h to mph chart.",
  "mph-to-kph":
    "1 mph = 1.609344 km/h exact. Convert miles to kilometers per hour for speedometers, road limits & racing—with exact formula, examples & chart.",
  "cm-to-inches":
    "1 in = 2.54 cm exact. Convert centimeters to inches instantly for height, clothing & dimensions—with exact formula, examples & 1/16\" tape chart.",
  "cm-to-feet":
    "1 ft = 30.48 cm exact (1 cm = 0.03281 ft). Convert centimeters to feet and inches fast for height, rooms & furniture—with formula & lookup chart.",
  "km-to-miles":
    "1 km = 0.62137 mi. Use our km to mi converter for road distances, running races & travel—with exact 1.609344 divisor formula, examples & chart.",
  "miles-to-km":
    "1 mile = 1.609344 km exact. Convert from mile to km instantly for road trips, races & travel—with exact multiplier formula, examples & lookup chart.",
  "liters-to-gallons":
    "1 L = 0.26417 US gal (1 gal = 3.78541 L). Free convert litres to US gallons calculator with US & UK gallon note, formula, worked examples & chart.",
  "gallons-to-liters":
    "1 US gallon = 3.78541 liters exact (1 L = 0.26417 gal). Instant US gallon to liter conversion for fuel tanks, pools & water jugs—with UK litres note & chart.",
  "cups-to-tablespoons":
    "1 US cup = 16 tbsp exact (1/2 cup = 8 tbsp). Convert cups to tablespoons for baking, butter & cooking—with 1/8 cup guide, formula & chart.",
  "days-to-years":
    "365.2425 days = 1 Gregorian year (1 d = 0.002738 yr). Convert days to years for warranties, loan terms & ages—with common & leap year chart.",
  "gb-to-tb":
    "1,000 GB in 1 TB decimal (0.001 TB per GB). Convert gigabytes to terabytes for SSDs, hard drives & cloud tiers—with divide-by-1,000 formula & chart.",
  "hp-to-kw":
    "1 hp = 0.7457 kW (1 kW = 1.34102 hp). Convert hp in kW for car engines, electric motors & generators—with mechanical vs. metric PS formula & chart.",
  "newtons-to-pounds-force":
    "1 N = 0.22481 lbf (1 lbf = 4.44822 N). Convert N to lbs force instantly for structural loads, tension & thrust—with newtons to pounds formula & chart.",
  "inches-to-cm":
    "1 in = 2.54 cm exact. Convert inches to centimeters (or centimetres) instantly for screen sizes, height & woodworking—with formula & tape chart.",
  "inches-to-feet":
    "12 in = 1 ft exact (1 in = 0.08333 ft). Fast inch-to-feet conversion in decimal feet, tenths of a foot & ft-in for height, framing & survey work.",
  "feet-to-inches":
    "1 ft = 12 in exact. Free feet and inches calculator for height, framing & metric-to-feet conversions—with decimal feet-in breakdown & lookup chart.",
  "grams-to-ounces":
    "1 oz = 28.3495 g (1 g = 0.03527 oz). Convert grams to ounces instantly for cooking, baking & postal shipping—with formula, examples & lookup chart.",
  "ounces-to-grams":
    "1 oz = 28.3495 g exact. Convert ounces to grams for recipes, postal scales & portions—with ounce measurement chart, quarter-oz guide & examples.",
  "ounces-to-pounds":
    "16 oz = 1 lb exact (1 oz = 0.0625 lb). Convert ounces to pounds fast for meat, cooking & shipping—with ounce conversion chart, formula & examples.",
  "pounds-to-ounces":
    "1 lb = 16 oz exact. Free pounds to ounces conversion calculator for shipping, meat & baking—with decimal-to-ounces guide, formula & lookup chart.",
  "grams-to-pounds":
    "453.59237 g = 1 lb exact. Free convert grams into pounds calculator for meat, baking & parcels—with quarter-pound guide, formula & chart.",
  "knots-to-mph":
    "1 knot = 1.15078 mph (exact 1.852 km/h). Instant wind speed conversion knots to mph for aviation, sailing & storms, with formula & reference chart.",
  "fahrenheit-to-celsius":
    "°C = (°F − 32) × 5/9. Convert Fahrenheit to Celsius instantly for weather, fever thermometers & oven temps—with exact formula, examples & chart.",
  "psi-to-megapascal":
    "1 psi = 0.00689476 MPa (1 MPa = 145.038 psi). Convert PSI to megapascals for concrete strength, hydraulics & piping—with formula, examples & chart.",
  "bar-to-psi":
    "1 bar = 14.50377 psi exact (100 kPa). Fast pressure bar to psi conversion for car tires, espresso machines & hydraulics—with formula & chart.",
};

/**
 * Standardizes tool page titles while guaranteeing every Tier-A & Prefix title stays < 60 chars
 * and contains proper mathematical symbols (never raw slug tokens).
 */
export function buildStandardToolTitle(
  pair: ConversionPairInfo,
  fromUnitOverride?: Unit,
  toUnitOverride?: Unit
): string {
  const fromUnit = fromUnitOverride || UNIT_MAP.get(pair.fromUnitId);
  const toUnit = toUnitOverride || UNIT_MAP.get(pair.toUnitId);

  if (!fromUnit || !toUnit) {
    const base = `${pair.title.replace(/\s*Converter.*$/i, "").trim()} Converter`;
    return base.length < 60 ? base : base.slice(0, 59).trim();
  }

  // Req 3: Prefix page title pattern: "Micro to Base Units: 1 µ = 10⁻⁶ | UnitConvertersGo"
  if (pair.categoryId === "prefixes" && fromUnit.toBase && toUnit.toBase) {
    const ratio = fromUnit.toBase / toUnit.toBase;
    const exp = Math.round(Math.log10(ratio));
    const fromLabel = cleanPrefixLabel(fromUnit);
    const toLabel = cleanPrefixLabel(toUnit);
    const pow10 = toSuperscriptExponent(exp);
    const withBrand = `${fromLabel} to ${toLabel}: 1 ${fromUnit.symbol} = ${pow10} | UnitConvertersGo`;
    if (withBrand.length < 60) {
      return withBrand;
    }
    const withoutBrand = `${fromLabel} to ${toLabel}: 1 ${fromUnit.symbol} = ${pow10}`;
    if (withoutBrand.length < 60) {
      return withoutBrand;
    }
    return `${fromLabel} to ${toLabel} (${fromUnit.symbol} = ${pow10})`;
  }

  // Exact high-intent query titles for core pairs
  const curatedTitle = COMPACT_QUERY_TITLE_OVERRIDES[pair.slug];
  if (curatedTitle) {
    return curatedTitle;
  }

  const unitA = cleanUnitDisplayName(fromUnit.plural);
  const unitB = cleanUnitDisplayName(toUnit.plural);
  const symA = fromUnit.symbol.trim();
  const symB = toUnit.symbol.trim();

  // Tiered concise formats under 60 characters
  const withSymbolsAndBrand = `${unitA} to ${unitB} (${symA} to ${symB}) | UnitConvertersGo`;
  if (withSymbolsAndBrand.length < 60) {
    return withSymbolsAndBrand;
  }

  const withConverter = `${unitA} to ${unitB} Converter (${symA} to ${symB})`;
  if (withConverter.length < 60) {
    return withConverter;
  }

  const withSymbols = `${unitA} to ${unitB} (${symA} to ${symB})`;
  if (withSymbols.length < 60) {
    return withSymbols;
  }

  const shortA = cleanUnitDisplayName(fromUnit.name);
  const shortB = cleanUnitDisplayName(toUnit.name);
  const singularSymbols = `${shortA} to ${shortB} (${symA} to ${symB})`;
  if (singularSymbols.length < 60) {
    return singularSymbols;
  }

  const noParens = `${unitA} to ${unitB} Converter`;
  if (noParens.length < 60) {
    return noParens;
  }

  const plain = `${unitA} to ${unitB}`;
  if (plain.length < 60) {
    return plain;
  }

  return `${symA} to ${symB} — ${shortA} to ${shortB}`.slice(0, 59).trim();
}

/**
 * Builds the standardized tool page meta description:
 * Leads with exact "1 <from> = <value> <to>" result + exact query phrases + real page features.
 */
export function buildStandardToolDescription(
  pair: ConversionPairInfo,
  fromUnitOverride?: Unit,
  toUnitOverride?: Unit
): string {
  const curatedDesc = COMPACT_QUERY_DESCRIPTION_OVERRIDES[pair.slug];
  if (curatedDesc) {
    return formatSeoDescription(curatedDesc);
  }

  const fromUnit = fromUnitOverride || UNIT_MAP.get(pair.fromUnitId);
  const toUnit = toUnitOverride || UNIT_MAP.get(pair.toUnitId);

  if (!fromUnit || !toUnit) {
    return formatSeoDescription(pair.metaDescription);
  }

  const unitALower = cleanUnitDisplayName(fromUnit.plural).toLowerCase();
  const unitBLower = cleanUnitDisplayName(toUnit.plural).toLowerCase();
  const symA = fromUnit.symbol.trim();
  const symB = toUnit.symbol.trim();
  const slugQuery = pair.slug.replace(/-/g, " ");

  const isMassVolume =
    (fromUnit.categoryId === "mass" && toUnit.categoryId === "volume") ||
    (fromUnit.categoryId === "volume" && toUnit.categoryId === "mass");

  // 1. Exact conversion factor right at the beginning of the description
  let factorClause = "";
  try {
    if (pair.categoryId === "temperature") {
      const zeroOut = convertUnits(0, fromUnit.id, toUnit.id, "auto");
      const oneOut = convertUnits(1, fromUnit.id, toUnit.id, "auto");
      factorClause = `0 ${symA} = ${zeroOut.formattedValue} ${symB} (1 ${symA} = ${oneOut.formattedValue} ${symB}).`;
    } else if (isMassVolume) {
      const oneOut = convertUnits(1, fromUnit.id, toUnit.id, "auto", 12, 1);
      factorClause = `1 ${symA} = ${oneOut.formattedValue} ${symB} (assuming water at 1 g/mL).`;
    } else {
      const oneOut = convertUnits(1, fromUnit.id, toUnit.id, "auto");
      factorClause = `1 ${symA} = ${oneOut.formattedValue} ${symB}.`;
    }
  } catch {
    factorClause = `Convert ${symA} to ${symB} accurately.`;
  }

  // 2. Include both natural query phrase (e.g. "lbs to kg") and full unit names ("pounds to kilograms")
  const hasDifferentSlugPhrase =
    !slugQuery.includes(unitALower) || !slugQuery.includes(unitBLower);
  const benefitClause = isMassVolume
    ? `Convert ${unitALower} to ${unitBLower} using our substance density selector (water, oil, flour, sugar).`
    : hasDifferentSlugPhrase && !slugQuery.includes(" per ")
    ? `Convert ${slugQuery} (${unitALower} to ${unitBLower}) instantly for free.`
    : `Convert ${unitALower} to ${unitBLower} instantly for free.`;

  // 3. Real features that genuinely exist on this page
  const featuresClause =
    pair.categoryId === "length"
      ? `Includes calculator, formula, 1/16" tape measure & table.`
      : `Includes calculator, worked examples & conversion table.`;

  const fullDesc = `${factorClause} ${benefitClause} ${featuresClause}`;
  if (fullDesc.length <= 160) {
    return fullDesc;
  }

  const compactBenefit = `Convert ${unitALower} to ${unitBLower} (${symA} to ${symB}) free.`;
  const compactDesc = `${factorClause} ${compactBenefit} ${featuresClause}`;
  if (compactDesc.length <= 160) {
    return compactDesc;
  }

  const tightDesc = `${factorClause} Convert ${symA} to ${symB} with formula, examples & chart.`;
  if (tightDesc.length <= 160) {
    return tightDesc;
  }

  return formatSeoDescription(tightDesc);
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
