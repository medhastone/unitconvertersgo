import {
  CATEGORIES,
  CATEGORY_MAP,
  UNITS,
} from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  getCanonicalPairSlug,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { convertUnits } from "@/lib/conversions/engine";
import { Category, Unit, ConversionPairInfo } from "@/lib/conversions/types";

export interface InstantCalculationMatch {
  type: "same_category" | "coupled_formula";
  headline: string;
  subheadline: string;
  formulaNote: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export interface SpecialToolMatch {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: string;
}

export interface SmartSearchResults {
  instantMatch: InstantCalculationMatch | null;
  specialTools: SpecialToolMatch[];
  conversions: ConversionPairInfo[];
  categories: Category[];
  units: Unit[];
}

const SPECIAL_TOOLS: Array<SpecialToolMatch & { keywords: string[] }> = [
  {
    id: "case-converter",
    title: "Text Case Converter (UPPERCASE, lowercase, camelCase, snake_case)",
    description:
      "Convert text between Sentence case, Title Case, UPPERCASE, lowercase, camelCase, PascalCase, snake_case, and kebab-case.",
    href: "/case-converter",
    badge: "Text Tool",
    keywords: [
      "case",
      "case converter",
      "uppercase",
      "lowercase",
      "title case",
      "sentence case",
      "camelcase",
      "snake_case",
      "kebab-case",
      "pascalcase",
      "text",
      "capitalization",
    ],
  },
  {
    id: "html-sitemap",
    title: "Complete 78-Category HTML Sitemap",
    description:
      "Browse all 78 measurement categories organized into Common, Engineering, Heat, Fluids, Light, Electricity, Magnetism, Radiology, and Other.",
    href: "/sitemap",
    badge: "Directory",
    keywords: ["sitemap", "all categories", "9 super categories", "index"],
  },
];

/**
 * Matches a unit query token (like "volt", "volts", "v", "watt", "watts", "w", "psi", "bar")
 * against all 500+ units in UNITS.
 */
function findBestUnitMatch(rawToken: string): Unit | null {
  const token = rawToken
    .trim()
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .trim();
  if (!token) return null;

  // 1. Exact ID, name, plural, or symbol match (case-insensitive)
  for (const u of UNITS) {
    if (
      u.id.toLowerCase() === token ||
      u.name.toLowerCase() === token ||
      u.plural.toLowerCase() === token ||
      u.symbol.toLowerCase() === token
    ) {
      return u;
    }
  }

  // 2. Exact alias match
  for (const u of UNITS) {
    if (u.aliases.some((a) => a.toLowerCase() === token)) {
      return u;
    }
  }

  // 3. Singularized token match (strip trailing 's' or 'es')
  const singular = token.endsWith("es")
    ? token.slice(0, -2)
    : token.endsWith("s")
    ? token.slice(0, -1)
    : token;

  if (singular.length >= 2) {
    for (const u of UNITS) {
      if (
        u.id.toLowerCase() === singular ||
        u.name.toLowerCase() === singular ||
        u.aliases.some((a) => a.toLowerCase() === singular)
      ) {
        return u;
      }
    }
  }

  // 4. Prefix/substring match on unit name
  if (token.length >= 3) {
    for (const u of UNITS) {
      if (
        u.name.toLowerCase().startsWith(token) ||
        u.plural.toLowerCase().startsWith(token)
      ) {
        return u;
      }
    }
  }

  return null;
}

/**
 * Parses natural queries like:
 * - "convert volt to watt"
 * - "convert 100 psi to bar"
 * - "25 celsius in fahrenheit"
 * - "newton meter to foot-pound"
 */
function parseNaturalUnitPairQuery(rawQuery: string): InstantCalculationMatch | null {
  // Strip parenthetical category hints that our animated prompts include, e.g., "(Pressure)"
  const cleaned = rawQuery
    .replace(/\([^)]*\)/g, "")
    .trim()
    .toLowerCase();

  // Match pattern: [convert|how many]? [number]? <unitA> (to|in|into|->|vs) <unitB>
  const pairRegex =
    /^(?:convert\s+|how\s+many\s+|calculate\s+)?([+-]?\d+(?:\.\d+)?)?\s*([a-zA-Z°µΩ·/\-\s]+?)\s+(?:to|in|into|from|->|↔)\s+([a-zA-Z°µΩ·/\-\s]+)$/i;
  const match = cleaned.match(pairRegex);
  if (!match) return null;

  const parsedNum = match[1] ? parseFloat(match[1]) : 1;
  const numericValue = Number.isFinite(parsedNum) ? parsedNum : 1;
  const fromToken = match[2].trim();
  const toToken = match[3].trim();

  const unitA = findBestUnitMatch(fromToken);
  const unitB = findBestUnitMatch(toToken);

  if (!unitA || !unitB) return null;

  // Case 1: Both units belong to the same measurement category -> compute exact live result!
  if (unitA.categoryId === unitB.categoryId) {
    const calc = convertUnits(numericValue, unitA.id, unitB.id, "auto");
    const category = CATEGORY_MAP.get(unitA.categoryId);

    const pairSlug = getCanonicalPairSlug(unitA, unitB);
    const primaryHref = getPairUrl({
      categoryId: unitA.categoryId,
      slug: pairSlug,
    });

    return {
      type: "same_category",
      headline: `${numericValue} ${unitA.symbol} = ${calc.formattedValue} ${unitB.symbol}`,
      subheadline: `Convert ${unitA.name} (${unitA.symbol}) to ${unitB.name} (${unitB.symbol}) · ${
        category?.name || "Unit"
      } Converter`,
      formulaNote: calc.formulaDisplay,
      primaryHref,
      primaryLabel: `Open ${unitA.name} to ${unitB.name} Tool`,
    };
  }

  // Case 2: Cross-category coupled engineering queries (e.g., "convert volt to watt", "watt to volt", "amp to watt")
  const catPair = new Set([unitA.categoryId, unitB.categoryId]);
  if (
    catPair.has("electric_potential") &&
    catPair.has("power")
  ) {
    const isVoltToWatt = unitA.categoryId === "electric_potential";
    return {
      type: "coupled_formula",
      headline: isVoltToWatt
        ? `${numericValue} V × 1 A = ${numericValue} W (Watt's Law: P = V × I)`
        : `${numericValue} W ÷ 1 A = ${numericValue} V (Watt's Law: V = P ÷ I)`,
      subheadline:
        "Volts (Electric Potential) and Watts (Electrical Power) are linked by Electric Current in Amperes (I).",
      formulaNote:
        "Formula: Watts (W) = Volts (V) × Amperes (A). Explore full Voltage and Power unit converters below:",
      primaryHref: getCategoryUrl("power"),
      primaryLabel: "Open Power (Watts) Converter",
      secondaryHref: getCategoryUrl("electric_potential"),
      secondaryLabel: "Open Voltage (Volts) Converter",
    };
  }

  if (catPair.has("current") && catPair.has("power")) {
    return {
      type: "coupled_formula",
      headline: `${numericValue} A × 120 V = ${
        numericValue * 120
      } W (Watt's Law: P = I × V)`,
      subheadline:
        "Amperes (Current) and Watts (Power) are linked by Voltage (V).",
      formulaNote: "Formula: Watts (W) = Amperes (A) × Volts (V).",
      primaryHref: getCategoryUrl("power"),
      primaryLabel: "Open Power (Watts) Converter",
      secondaryHref: getCategoryUrl("current"),
      secondaryLabel: "Open Electric Current Converter",
    };
  }

  // General cross-category fallback: offer both category calculators side-by-side
  const catA = CATEGORY_MAP.get(unitA.categoryId);
  const catB = CATEGORY_MAP.get(unitB.categoryId);
  if (catA && catB) {
    return {
      type: "coupled_formula",
      headline: `${unitA.name} (${catA.name}) & ${unitB.name} (${catB.name})`,
      subheadline: `${unitA.name} measures ${catA.name.toLowerCase()}, while ${unitB.name} measures ${catB.name.toLowerCase()}.`,
      formulaNote: `Jump directly to either the ${catA.name} or ${catB.name} calculator:`,
      primaryHref: `${getCategoryUrl(catA.id)}?from=${encodeURIComponent(unitA.id)}`,
      primaryLabel: `${catA.name} (${unitA.symbol}) Tool`,
      secondaryHref: `${getCategoryUrl(catB.id)}?from=${encodeURIComponent(unitB.id)}`,
      secondaryLabel: `${catB.name} (${unitB.symbol}) Tool`,
    };
  }

  return null;
}

export function runSmartSearch(
  rawQuery: string,
  limits = { conversions: 8, categories: 8, units: 6 }
): SmartSearchResults {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    return {
      instantMatch: null,
      specialTools: [],
      conversions: CONVERSION_CATALOGUE.slice(0, limits.conversions),
      categories: CATEGORIES.slice(0, limits.categories),
      units: [],
    };
  }

  // Normalize conversational filler so "convert volt to watt" also matches tokens "volt", "watt"
  const strippedTokens = q
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(convert|converter|conversion|how|many|to|in|into|from|calculate)\b/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !/^\d+(\.\d+)?$/.test(t));

  const instantMatch = parseNaturalUnitPairQuery(rawQuery);

  const matchedSpecialTools = SPECIAL_TOOLS.filter((tool) =>
    tool.keywords.some((kw) => q.includes(kw) || kw.includes(q))
  );

  const matchedConversions = CONVERSION_CATALOGUE.filter((item) => {
    const directMatch =
      item.slug.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.fromUnitId.includes(q) ||
      item.toUnitId.includes(q) ||
      (item.primaryKeyword && item.primaryKeyword.toLowerCase().includes(q)) ||
      (item.relatedKeywords &&
        item.relatedKeywords.some((k) => k.toLowerCase().includes(q))) ||
      (item.aliases && item.aliases.some((a) => a.toLowerCase().includes(q)));

    if (directMatch) return true;
    if (strippedTokens.length === 0) return false;

    const hay = `${item.slug} ${item.title} ${item.fromUnitId} ${item.toUnitId} ${
      item.primaryKeyword || ""
    }`.toLowerCase();
    return strippedTokens.every((tok) => hay.includes(tok));
  }).slice(0, limits.conversions);

  const matchedCategories = CATEGORIES.filter((cat) => {
    const hay = `${cat.id} ${cat.name} ${cat.pluralName} ${cat.description}`.toLowerCase();
    if (hay.includes(q)) return true;
    if (strippedTokens.length > 0 && strippedTokens.some((tok) => hay.includes(tok))) {
      return true;
    }
    return false;
  }).slice(0, limits.categories);

  const matchedUnits = UNITS.filter((u) => {
    const hay = `${u.id} ${u.name} ${u.plural} ${u.symbol} ${u.aliases.join(" ")}`.toLowerCase();
    if (hay.includes(q)) return true;
    if (
      strippedTokens.length > 0 &&
      strippedTokens.some(
        (tok) =>
          u.name.toLowerCase().includes(tok) ||
          u.symbol.toLowerCase() === tok ||
          u.aliases.some((a) => a.toLowerCase().includes(tok))
      )
    ) {
      return true;
    }
    return false;
  }).slice(0, limits.units);

  return {
    instantMatch,
    specialTools: matchedSpecialTools,
    conversions: matchedConversions,
    categories: matchedCategories,
    units: matchedUnits,
  };
}
