import {
  CONVERSION_CATALOGUE,
  getConversionPair,
} from "../lib/conversions/catalogue";
import { CATEGORIES, UNIT_MAP } from "../lib/conversions/units";
import { getCategoryUrlSlug, resolveCategoryIdFromUrlSlug } from "../lib/conversions/url";
import { generateEditorialContentBundle } from "../lib/conversions/editorial";
import {
  buildCategorySeoTitle,
  buildStandardToolTitle,
} from "../lib/seo";
import { getConverterTier, isPairIndexable } from "../lib/seo-tiers";
import type { ConversionPairInfo } from "../lib/conversions/types";

const RAW_SLUG_FRAGMENT_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "contains '-to-' slug joiner", regex: /[a-z0-9]-to-[a-z0-9]/i },
  { label: "contains hyphenated 'per-' slug token", regex: /[a-z]-per-[a-z]/i },
  { label: "contains 'base-units' slug token", regex: /\bbase-units\b/i },
  {
    label: "contains stripped compound slug token",
    regex: /\b(?:g-m|g-ml|mg-l|ug-l|kg-m|kg-l|lb-ft|lb-in|lb-gal|ft-lbf-s|kgf-cm|kgf-m|btu-h|kj-h|kcal-h)\b/i,
  },
];

function checkTextForSlugLeak(
  text: string,
  pair: ConversionPairInfo | null,
  fieldLabel: string
): string | null {
  if (!text || text.trim().length < 4) {
    return `${fieldLabel} is empty`;
  }
  for (const pat of RAW_SLUG_FRAGMENT_PATTERNS) {
    if (pat.regex.test(text)) {
      return `${fieldLabel} ("${text}") ${pat.label}`;
    }
  }
  if (pair) {
    if (pair.fromUnitId.includes("_") && text.includes(pair.fromUnitId)) {
      return `${fieldLabel} ("${text}") contains raw unitId "${pair.fromUnitId}"`;
    }
    if (pair.toUnitId.includes("_") && text.includes(pair.toUnitId)) {
      return `${fieldLabel} ("${text}") contains raw unitId "${pair.toUnitId}"`;
    }
    if (pair.slug.includes("-") && text.toLowerCase().includes(pair.slug.toLowerCase())) {
      return `${fieldLabel} ("${text}") contains raw slug "${pair.slug}"`;
    }
  }
  return null;
}

function main() {
  const failures: string[] = [];

  // 1. Validate every Category Hub title
  for (const cat of CATEGORIES) {
    const title = buildCategorySeoTitle(cat.id);
    const catSlug = getCategoryUrlSlug(cat.id);
    const leak = checkTextForSlugLeak(title, null, `Category(${catSlug}).title`);
    if (leak) failures.push(leak);
    if (catSlug.includes("-") && title.toLowerCase().includes(catSlug)) {
      failures.push(`Category(${catSlug}).title ("${title}") contains raw category slug`);
    }
  }

  // 2. Collect all static catalogue pairs + key dynamic prefix/technical/cross-dim pairs
  const extraPaths = [
    "/prefixes/micro-to-base-units",
    "/prefixes/nano-to-base-units",
    "/prefixes/pico-to-base-units",
    "/prefixes/kilo-to-base-units",
    "/prefixes/mega-to-base-units",
    "/prefixes/giga-to-base-units",
    "/prefixes/nano-to-giga",
    "/concentration-solution/ppm-to-mg-per-liter",
    "/concentration-solution/ppm-to-ug-per-liter",
    "/concentration-solution/ppm-to-kilograms-per-cubic-meter",
    "/flow/cfh-to-cfm",
    "/flow/liters-per-second-to-cfm",
    "/flow/gpd-to-gpm",
    "/resistance/ohm-to-kiloohm",
    "/capacitance/picofarads-to-farads",
    "/energy/ergs-to-joules",
    "/energy/joules-to-tons-of-tnt",
    "/pressure/ksi-to-pa",
    "/radiation/msv-to-rem",
    "/power/watts-to-kilojoules-per-hour",
    "/torque/lb-ft-to-nm",
    "/weight-and-mass/ounces-to-milliliters",
    "/volume/pints-to-grams",
    "/volume/pints-to-kilograms",
    "/weight-and-mass/metric-tons-to-gallons",
    "/volume/liters-to-pounds",
  ];

  const allPairs = new Map<string, ConversionPairInfo>();
  for (const p of CONVERSION_CATALOGUE) {
    allPairs.set(`${p.categoryId}::${p.slug}`, p);
  }
  for (const route of extraPaths) {
    const [, catSlug, slug] = route.split("/");
    const catId = resolveCategoryIdFromUrlSlug(catSlug);
    const resolved = getConversionPair(slug, catId);
    if (!resolved) {
      failures.push(`Required SEO route failed to resolve: ${route}`);
      continue;
    }
    allPairs.set(`${resolved.categoryId}::${resolved.slug}`, resolved);
  }

  let checkedCount = 0;
  for (const pair of allPairs.values()) {
    checkedCount++;
    const fromU = UNIT_MAP.get(pair.fromUnitId);
    const toU = UNIT_MAP.get(pair.toUnitId);
    if (!fromU || !toU) {
      failures.push(`Pair ${pair.slug} missing unit definition (${pair.fromUnitId} / ${pair.toUnitId})`);
      continue;
    }

    const title = buildStandardToolTitle(pair, fromU, toU);
    const editorial = generateEditorialContentBundle(pair, fromU, toU);
    const h1 =
      editorial.h1.includes(fromU.symbol) && editorial.h1.includes(toU.symbol)
        ? editorial.h1
        : `${fromU.plural} to ${toU.plural} Converter (${fromU.symbol} to ${toU.symbol})`;

    const titleLeak = checkTextForSlugLeak(title, pair, `Pair(${pair.categoryId}/${pair.slug}).title`);
    if (titleLeak) failures.push(titleLeak);

    const h1Leak = checkTextForSlugLeak(h1, pair, `Pair(${pair.categoryId}/${pair.slug}).h1`);
    if (h1Leak) failures.push(h1Leak);

    if (isPairIndexable(pair) && getConverterTier(pair) === "A" && title.length >= 60) {
      failures.push(
        `Tier-A title >= 60 chars (${title.length}): ${pair.categoryId}/${pair.slug} -> "${title}"`
      );
    }

    if (pair.categoryId === "prefixes" && !/=\s*10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/.test(title)) {
      failures.push(
        `Prefix title missing "10ⁿ" exponent format: ${pair.slug} -> "${title}"`
      );
    }
  }

  if (failures.length > 0) {
    console.error(`\n❌ SEO Title & H1 Check FAILED (${failures.length} issues):`);
    for (const err of failures.slice(0, 30)) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `✅ SEO Title & H1 Check PASSED: verified ${CATEGORIES.length} category hubs and ${checkedCount} converter pages (0 slug leaks, all Tier-A titles < 60 chars).`
  );
}

main();
