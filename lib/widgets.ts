import { SITE_CONFIG } from "@/lib/config";
import {
  CONVERSION_CATALOGUE,
  getConversionPair,
  getConversionsByCategory,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import {
  CATEGORIES,
  CATEGORY_MAP,
  UNIT_MAP,
  getUnitsByCategory,
} from "@/lib/conversions/units";
import { Category, ConversionPairInfo, PrecisionMode, Unit } from "@/lib/conversions/types";

export type WidgetEmbedStyle = "full" | "adjustable" | "popup" | "link";
export type WidgetTheme = "light" | "dark";
export type WidgetAccent = "teal" | "navy" | "blue" | "emerald" | "amber" | "slate";

export interface WidgetCustomizationOptions {
  style: WidgetEmbedStyle;
  widthPx: number;
  theme: WidgetTheme;
  accent: WidgetAccent;
  defaultValue: string;
  defaultVoltage: string;
  precision: PrecisionMode;
  showFormula: boolean;
  lockUnits: boolean;
}

export interface WidgetDescriptor {
  slug: string;
  kind: "pair" | "category";
  title: string;
  shortTitle: string;
  widgetHeading: string;
  description: string;
  categoryId: string;
  categoryName: string;
  fromUnit: Unit;
  toUnit: Unit;
  availableUnits: Unit[];
  exampleInput: number;
  defaultVoltage: number;
  requiresVoltage: boolean;
  converterHref: string;
  widgetStudioHref: string;
  embedEndpointPath: string;
  pair?: ConversionPairInfo;
  category?: Category;
}

export const WIDGET_ACCENT_PALETTES: Record<
  WidgetAccent,
  {
    name: string;
    primaryHex: string;
    hoverHex: string;
    softBgLight: string;
    softBgDark: string;
    borderHex: string;
    textAccentLight: string;
    textAccentDark: string;
  }
> = {
  teal: {
    name: "Precision Teal",
    primaryHex: "#0D9488",
    hoverHex: "#0F766E",
    softBgLight: "#E6FAF8",
    softBgDark: "rgba(13, 148, 136, 0.18)",
    borderHex: "#0D9488",
    textAccentLight: "#0F766E",
    textAccentDark: "#2DD4BF",
  },
  navy: {
    name: "Deep Navy",
    primaryHex: "#16324F",
    hoverHex: "#0F2338",
    softBgLight: "#EDF2F7",
    softBgDark: "rgba(30, 58, 95, 0.35)",
    borderHex: "#16324F",
    textAccentLight: "#16324F",
    textAccentDark: "#93C5FD",
  },
  blue: {
    name: "Royal Blue",
    primaryHex: "#2563EB",
    hoverHex: "#1D4ED8",
    softBgLight: "#EFF6FF",
    softBgDark: "rgba(37, 99, 235, 0.2)",
    borderHex: "#2563EB",
    textAccentLight: "#1D4ED8",
    textAccentDark: "#60A5FA",
  },
  emerald: {
    name: "Emerald",
    primaryHex: "#059669",
    hoverHex: "#047857",
    softBgLight: "#ECFDF5",
    softBgDark: "rgba(5, 150, 105, 0.2)",
    borderHex: "#059669",
    textAccentLight: "#047857",
    textAccentDark: "#34D399",
  },
  amber: {
    name: "Industrial Amber",
    primaryHex: "#D97706",
    hoverHex: "#B45309",
    softBgLight: "#FFFBEB",
    softBgDark: "rgba(217, 119, 6, 0.2)",
    borderHex: "#D97706",
    textAccentLight: "#B45309",
    textAccentDark: "#FBBF24",
  },
  slate: {
    name: "Graphite Slate",
    primaryHex: "#334155",
    hoverHex: "#1E293B",
    softBgLight: "#F1F5F9",
    softBgDark: "rgba(71, 85, 105, 0.3)",
    borderHex: "#475569",
    textAccentLight: "#334155",
    textAccentDark: "#CBD5E1",
  },
};

const CATEGORY_ALIAS_MAP: Record<string, string> = {
  weight: "mass",
  "weight-converter": "mass",
  "mass-converter": "mass",
  "data-storage": "digital_storage",
  "digital-storage-converter": "digital_storage",
  "data-transfer-converter": "data_transfer",
  "fuel-economy-converter": "fuel_economy",
  "electric-charge": "charge",
  "electric-current": "current",
  "electrical-resistance": "resistance",
};

function checkRequiresVoltage(fromUnit: Unit, toUnit: Unit): boolean {
  return (
    (fromUnit.categoryId === "charge" && toUnit.categoryId === "energy") ||
    (fromUnit.categoryId === "energy" && toUnit.categoryId === "charge")
  );
}

function getAvailableUnitsForPair(fromUnit: Unit, toUnit: Unit): Unit[] {
  if (fromUnit.categoryId === toUnit.categoryId) {
    return getUnitsByCategory(fromUnit.categoryId);
  }
  const combined = [
    ...getUnitsByCategory(fromUnit.categoryId),
    ...getUnitsByCategory(toUnit.categoryId),
  ];
  const seen = new Set<string>();
  return combined.filter((u) => {
    if (seen.has(u.id)) return false;
    seen.add(u.id);
    return true;
  });
}

export function resolveWidgetBySlug(rawSlug: string): WidgetDescriptor | undefined {
  const clean = decodeURIComponent(rawSlug).trim().toLowerCase();

  // 1. Check if slug matches a category or "[category]-converter" / "[category]-calculator"
  const normalizedCatSlug = clean
    .replace(/-(?:converter|calculator|widget)$/, "")
    .replace(/-/g, "_");
  const matchedCatId =
    CATEGORY_MAP.has(clean)
      ? clean
      : CATEGORY_MAP.has(normalizedCatSlug)
      ? normalizedCatSlug
      : CATEGORY_ALIAS_MAP[clean] || CATEGORY_ALIAS_MAP[clean.replace(/-(?:converter|calculator|widget)$/, "")];

  if (matchedCatId && !clean.includes("-to-")) {
    const category = CATEGORY_MAP.get(matchedCatId);
    if (category) {
      const catUnits = getUnitsByCategory(category.id);
      const catPairs = getConversionsByCategory(category.id);
      const defaultPair = catPairs[0];
      const fromUnit =
        (defaultPair && UNIT_MAP.get(defaultPair.fromUnitId)) ||
        catUnits[0];
      const toUnit =
        (defaultPair && UNIT_MAP.get(defaultPair.toUnitId)) ||
        catUnits[1] ||
        catUnits[0];

      if (fromUnit && toUnit) {
        const canonicalWidgetSlug = `${category.id.replace(/_/g, "-")}-converter`;
        return {
          slug: canonicalWidgetSlug,
          kind: "category",
          title: `${category.name} Converter Widget`,
          shortTitle: `${category.name} Converter`,
          widgetHeading: `${category.name} Calculator`,
          description: `Embed a free, interactive ${category.name.toLowerCase()} conversion calculator supporting ${catUnits.length} ${category.pluralName.toLowerCase()} units directly on your website.`,
          categoryId: category.id,
          categoryName: category.name,
          fromUnit,
          toUnit,
          availableUnits: catUnits,
          exampleInput: defaultPair?.exampleInput ?? 10,
          defaultVoltage: 12,
          requiresVoltage: false,
          converterHref: getCategoryUrl(category.id),
          widgetStudioHref: `/widgets/w/${canonicalWidgetSlug}`,
          embedEndpointPath: `/embed/${canonicalWidgetSlug}`,
          category,
        };
      }
    }
  }

  // 2. Resolve as a conversion pair slug (e.g. "ah-to-kwh", "cm-to-inches", "celsius-to-fahrenheit")
  const pair = getConversionPair(clean);
  if (!pair) return undefined;

  const fromUnit = UNIT_MAP.get(pair.fromUnitId);
  const toUnit = UNIT_MAP.get(pair.toUnitId);
  if (!fromUnit || !toUnit) return undefined;

  const category = CATEGORY_MAP.get(pair.categoryId);
  const requiresVoltage = checkRequiresVoltage(fromUnit, toUnit);
  const availableUnits = getAvailableUnitsForPair(fromUnit, toUnit);

  const cleanFromPlural = fromUnit.plural.replace(/\s*\(.*?\)\s*/g, "").trim();
  const cleanToPlural = toUnit.plural.replace(/\s*\(.*?\)\s*/g, "").trim();

  const shortTitle =
    pair.slug === "ah-to-kwh"
      ? "Amp-Hours to Kilowatt-Hours Calculator"
      : pair.slug === "kwh-to-ah"
      ? "Kilowatt-Hours to Amp-Hours Calculator"
      : `${cleanFromPlural} to ${cleanToPlural} Calculator`;

  const widgetHeading =
    pair.slug === "ah-to-kwh"
      ? "Amp-Hours to Kilowatt-Hours Calculator"
      : pair.slug === "kwh-to-ah"
      ? "Kilowatt-Hours to Amp-Hours Calculator"
      : `${cleanFromPlural} to ${cleanToPlural} Converter`;

  return {
    slug: pair.slug,
    kind: "pair",
    title: `${shortTitle} Widget`,
    shortTitle,
    widgetHeading,
    description: `Add a customizable ${cleanFromPlural.toLowerCase()} to ${cleanToPlural.toLowerCase()} (${fromUnit.symbol} to ${toUnit.symbol}) calculator widget to your website, blog, or course documentation in seconds.`,
    categoryId: pair.categoryId,
    categoryName: category?.name || "Unit Conversion",
    fromUnit,
    toUnit,
    availableUnits,
    exampleInput: pair.exampleInput || 10,
    defaultVoltage: 12,
    requiresVoltage,
    converterHref: getPairUrl(pair),
    widgetStudioHref: `/widgets/w/${pair.slug}`,
    embedEndpointPath: `/embed/${pair.slug}`,
    pair,
    category,
  };
}

export function buildWidgetQueryParams(options: WidgetCustomizationOptions, defaultExampleInput: number): string {
  const params = new URLSearchParams();
  if (options.theme !== "light") {
    params.set("theme", options.theme);
  }
  if (options.accent !== "teal") {
    params.set("accent", options.accent);
  }
  const cleanVal = options.defaultValue.trim();
  if (cleanVal && cleanVal !== String(defaultExampleInput)) {
    params.set("val", cleanVal);
  }
  const cleanVolt = options.defaultVoltage.trim();
  if (cleanVolt && cleanVolt !== "12") {
    params.set("v", cleanVolt);
  }
  if (options.precision !== "auto") {
    params.set("decimals", options.precision);
  }
  if (!options.showFormula) {
    params.set("formula", "0");
  }
  if (options.lockUnits) {
    params.set("lock", "1");
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function generateWidgetEmbedCode(
  widget: WidgetDescriptor,
  options: WidgetCustomizationOptions,
  originUrl: string = SITE_CONFIG.baseUrl
): string {
  const base = originUrl.replace(/\/$/, "");
  const queryString = buildWidgetQueryParams(options, widget.exampleInput);
  const embedUrl = `${base}${widget.embedEndpointPath}${queryString}`;
  const fullConverterUrl = `${base}${widget.converterHref}`;
  const iframeHeight = widget.requiresVoltage
    ? options.showFormula
      ? 430
      : 385
    : options.showFormula
    ? 375
    : 330;

  if (options.style === "link") {
    return `<a href="${fullConverterUrl}" target="_blank" rel="noopener">${widget.shortTitle}</a>`;
  }

  if (options.style === "popup") {
    const palette = WIDGET_ACCENT_PALETTES[options.accent] || WIDGET_ACCENT_PALETTES.teal;
    return `<a href="${fullConverterUrl}" onclick="window.open('${embedUrl}','ucg_widget_${widget.slug.replace(/-/g, "_")}','width=420,height=${iframeHeight + 40},resizable=yes,scrollbars=yes'); return false;" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:${palette.primaryHex};color:#ffffff;font-family:system-ui,-apple-system,sans-serif;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;box-shadow:0 1px 2px rgba(0,0,0,0.08);">${widget.shortTitle} &#8599;</a>`;
  }

  if (options.style === "adjustable") {
    const safeWidth = Math.max(260, Math.min(640, Number(options.widthPx) || 340));
    return `<div class="ucg-calculator-widget" style="width:100%;max-width:${safeWidth}px;">
  <iframe src="${embedUrl}" width="100%" height="${iframeHeight}" style="border:1px solid #e2e8f0;border-radius:14px;display:block;overflow:hidden;" title="${widget.shortTitle}" loading="lazy"></iframe>
  <div style="text-align:right;font-family:system-ui,-apple-system,sans-serif;font-size:11px;margin-top:4px;color:#64748b;">
    <a href="${fullConverterUrl}" target="_blank" rel="noopener" style="color:#0d9488;text-decoration:none;font-weight:600;">${widget.shortTitle}</a> by ${SITE_CONFIG.name}
  </div>
</div>`;
  }

  // Default: "full" (Full-Width Responsive Widget)
  return `<div class="ucg-calculator-widget" style="width:100%;">
  <iframe src="${embedUrl}" width="100%" height="${iframeHeight}" style="border:1px solid #e2e8f0;border-radius:14px;display:block;overflow:hidden;" title="${widget.shortTitle}" loading="lazy"></iframe>
  <div style="text-align:right;font-family:system-ui,-apple-system,sans-serif;font-size:11px;margin-top:4px;color:#64748b;">
    <a href="${fullConverterUrl}" target="_blank" rel="noopener" style="color:#0d9488;text-decoration:none;font-weight:600;">${widget.shortTitle}</a> by ${SITE_CONFIG.name}
  </div>
</div>`;
}

export interface WidgetDirectoryItem {
  slug: string;
  title: string;
  fromSymbol: string;
  toSymbol: string;
  categoryId: string;
  categoryName: string;
  description: string;
  isFeatured?: boolean;
  isElectrical?: boolean;
  kind: "pair" | "category";
}

const FEATURED_WIDGET_SLUGS = [
  "ah-to-kwh",
  "cm-to-inches",
  "kg-to-lbs",
  "celsius-to-fahrenheit",
  "inches-to-cm",
  "meters-to-feet",
  "lbs-to-kg",
  "kwh-to-ah",
  "ah-to-wh",
  "mah-to-wh",
  "gallons-to-liters",
  "psi-to-bar",
  "km-to-miles",
  "grams-to-ounces",
  "watts-to-horsepower",
  "mpg-to-l-100km",
];

export function getAllWidgetDirectoryItems(): WidgetDirectoryItem[] {
  const items: WidgetDirectoryItem[] = [];
  const seenSlugs = new Set<string>();

  // 1. Add Category Multi-Unit Converter Widgets
  for (const cat of CATEGORIES) {
    const catUnits = getUnitsByCategory(cat.id);
    if (catUnits.length >= 2) {
      const slug = `${cat.id.replace(/_/g, "-")}-converter`;
      seenSlugs.add(slug);
      items.push({
        slug,
        title: `${cat.name} Converter Widget (All ${catUnits.length} Units)`,
        fromSymbol: catUnits[0].symbol,
        toSymbol: catUnits[1].symbol,
        categoryId: cat.id,
        categoryName: cat.name,
        description: `Multi-unit ${cat.name.toLowerCase()} calculator supporting ${catUnits.slice(0, 4).map((u) => u.symbol).join(", ")}, and more.`,
        isFeatured: ["length", "mass", "temperature", "volume", "energy", "charge"].includes(cat.id),
        isElectrical: ["energy", "power", "charge", "current", "capacitance", "resistance", "inductance"].includes(cat.id),
        kind: "category",
      });
    }
  }

  // 2. Add All Conversion Pair Widgets (prioritizing featured slugs first)
  const featuredSet = new Set(FEATURED_WIDGET_SLUGS);
  const sortedPairs = [...CONVERSION_CATALOGUE].sort((a, b) => {
    const aFeat = featuredSet.has(a.slug) ? 0 : 1;
    const bFeat = featuredSet.has(b.slug) ? 0 : 1;
    if (aFeat !== bFeat) return aFeat - bFeat;
    return 0;
  });

  for (const pair of sortedPairs) {
    if (seenSlugs.has(pair.slug)) continue;
    const fromU = UNIT_MAP.get(pair.fromUnitId);
    const toU = UNIT_MAP.get(pair.toUnitId);
    const cat = CATEGORY_MAP.get(pair.categoryId);
    if (!fromU || !toU) continue;

    seenSlugs.add(pair.slug);
    const cleanFrom = fromU.plural.replace(/\s*\(.*?\)\s*/g, "").trim();
    const cleanTo = toU.plural.replace(/\s*\(.*?\)\s*/g, "").trim();

    items.push({
      slug: pair.slug,
      title:
        pair.slug === "ah-to-kwh"
          ? "Amp-Hours to Kilowatt-Hours (Ah to kWh)"
          : pair.slug === "kwh-to-ah"
          ? "Kilowatt-Hours to Amp-Hours (kWh to Ah)"
          : `${cleanFrom} to ${cleanTo} (${fromU.symbol} to ${toU.symbol})`,
      fromSymbol: fromU.symbol,
      toSymbol: toU.symbol,
      categoryId: pair.categoryId,
      categoryName: cat?.name || pair.categoryId,
      description: pair.metaDescription,
      isFeatured: featuredSet.has(pair.slug),
      isElectrical: ["energy", "power", "charge", "current", "capacitance", "resistance", "inductance"].includes(pair.categoryId),
      kind: "pair",
    });
  }

  return items;
}
