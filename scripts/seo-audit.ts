import fs from "fs";
import path from "path";
import { CONVERSION_CATALOGUE } from "../lib/conversions/catalogue";
import { UNIT_MAP } from "../lib/conversions/units";
import { getCategoryUrlSlug, getCanonicalConverterPath } from "../lib/conversions/url";
import {
  checkDimensionMatch,
  checkSlugHasExponentLoss,
  getDuplicateOf,
  getConverterTier,
  isPairIndexable,
  ConverterTier,
} from "../lib/seo-tiers";
import { evaluateContentGate } from "../lib/content-gate";
import { getPairContent } from "../lib/pair-content";

interface AuditRow {
  url: string;
  category: string;
  from: string;
  to: string;
  slug: string;
  tier: ConverterTier;
  dimension_match: boolean;
  dimension_reason?: string;
  slug_has_exponent_loss: boolean;
  duplicate_of: string;
  has_unique_content: boolean;
  indexable: boolean;
}

function escapeCsv(val: string | boolean | number): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const rows: AuditRow[] = [];

// 1. Audit all active pairs in CONVERSION_CATALOGUE
for (const pair of CONVERSION_CATALOGUE) {
  const fromU = UNIT_MAP.get(pair.fromUnitId);
  const toU = UNIT_MAP.get(pair.toUnitId);
  const catSlug = getCategoryUrlSlug(pair.categoryId);
  const url = getCanonicalConverterPath(pair.categoryId, pair.slug);

  const dim = checkDimensionMatch(fromU, toU, pair.slug);
  const expLoss = checkSlugHasExponentLoss(pair.slug, fromU, toU);
  const dupOf = getDuplicateOf(pair) || "";

  const pairContent = getPairContent(pair.slug);
  const hasUniqueContent = pairContent ? evaluateContentGate(pairContent).passed : false;
  const tier = getConverterTier(pair);
  const indexable = isPairIndexable(pair);

  rows.push({
    url,
    category: catSlug,
    from: fromU ? `${fromU.name} (${fromU.symbol})` : pair.fromUnitId,
    to: toU ? `${toU.name} (${toU.symbol})` : pair.toUnitId,
    slug: pair.slug,
    tier,
    dimension_match: dim.matches,
    dimension_reason: dim.reason,
    slug_has_exponent_loss: expLoss,
    duplicate_of: dupOf,
    has_unique_content: hasUniqueContent,
    indexable,
  });
}

// 2. Also include known historical cross-dimension/duplicate URLs reported in Search Console
// so they appear in the audit & dimension-issues CSVs with their exact status (Tier C / 301).
const historicalFlaggedRows: AuditRow[] = [
  {
    url: "/volume/pints-to-metric-tons",
    category: "volume",
    from: "US Pint (pt)",
    to: "Metric Ton (t)",
    slug: "pints-to-metric-tons",
    tier: "C",
    dimension_match: false,
    dimension_reason: "Volume (US Pint) vs Mass (Metric Ton) requires material density assumption (301 redirected to /cooking)",
    slug_has_exponent_loss: false,
    duplicate_of: "",
    has_unique_content: false,
    indexable: false,
  },
  {
    url: "/mass-flux-density/kg-to-g",
    category: "mass-flux-density",
    from: "Kilogram per Second per Square Meter (kg/(s·m²))",
    to: "Gram per Second per Square Meter (g/(s·m²))",
    slug: "kg-to-g",
    tier: "C",
    dimension_match: true,
    slug_has_exponent_loss: true,
    duplicate_of: "/weight-and-mass/kg-to-grams",
    has_unique_content: false,
    indexable: false,
  },
];

for (const hRow of historicalFlaggedRows) {
  if (!rows.some((r) => r.url === hRow.url)) {
    rows.push(hRow);
  }
}

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

// Write data/seo-audit.csv
const auditHeaders = [
  "url",
  "category",
  "from",
  "to",
  "slug",
  "tier",
  "dimension_match",
  "slug_has_exponent_loss",
  "duplicate_of",
  "has_unique_content",
  "indexable",
];

const auditLines = [
  auditHeaders.join(","),
  ...rows.map((r) =>
    [
      r.url,
      r.category,
      r.from,
      r.to,
      r.slug,
      r.tier,
      r.dimension_match,
      r.slug_has_exponent_loss,
      r.duplicate_of,
      r.has_unique_content,
      r.indexable,
    ]
      .map(escapeCsv)
      .join(",")
  ),
];

fs.writeFileSync(path.join(dataDir, "seo-audit.csv"), auditLines.join("\n"));

// Write data/seo-dimension-issues.csv
const dimIssues = rows.filter((r) => !r.dimension_match);
const dimHeaders = [
  "url",
  "category",
  "from",
  "to",
  "slug",
  "tier",
  "dimension_match",
  "issue_reason",
  "indexable",
];

const dimLines = [
  dimHeaders.join(","),
  ...dimIssues.map((r) =>
    [
      r.url,
      r.category,
      r.from,
      r.to,
      r.slug,
      r.tier,
      r.dimension_match,
      r.dimension_reason || "Units measure different physical quantities",
      r.indexable,
    ]
      .map(escapeCsv)
      .join(",")
  ),
];

fs.writeFileSync(path.join(dataDir, "seo-dimension-issues.csv"), dimLines.join("\n"));

// Print Summary Table by Tier and Category
const byTier: Record<ConverterTier, number> = { A: 0, B: 0, C: 0 };
const byCategory: Record<
  string,
  { A: number; B: number; C: number; indexable: number; total: number }
> = {};

for (const r of rows) {
  byTier[r.tier]++;
  if (!byCategory[r.category]) {
    byCategory[r.category] = { A: 0, B: 0, C: 0, indexable: 0, total: 0 };
  }
  byCategory[r.category][r.tier]++;
  if (r.indexable) byCategory[r.category].indexable++;
  byCategory[r.category].total++;
}

console.log("\n=== SEO AUDIT SUMMARY BY TIER ===");
console.table([
  { Tier: "Tier A (High-Demand + Enriched)", Count: byTier.A, Indexable: "Yes" },
  { Tier: "Tier B (Plausible + Unique Content)", Count: byTier.B, Indexable: "Yes" },
  { Tier: "Tier C (Noindex / Archaic / Loser / Un-enriched)", Count: byTier.C, Indexable: "No" },
  { Tier: "TOTAL AUDITED URLS", Count: rows.length, Indexable: String(byTier.A + byTier.B) },
]);

console.log("\n=== SEO AUDIT SUMMARY BY CATEGORY ===");
const catSummaryRows = Object.entries(byCategory)
  .sort((a, b) => b[1].indexable - a[1].indexable || b[1].total - a[1].total)
  .map(([cat, stats]) => ({
    Category: cat,
    Tier_A: stats.A,
    Tier_B: stats.B,
    Tier_C: stats.C,
    Indexable: stats.indexable,
    Total: stats.total,
  }));
console.table(catSummaryRows);

console.log(
  `\nWrote ${rows.length} rows to data/seo-audit.csv and ${dimIssues.length} rows to data/seo-dimension-issues.csv.`
);
