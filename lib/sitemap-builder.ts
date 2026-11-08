import { SITE_CONFIG } from "@/lib/config";
import { INDEXABLE_CATEGORIES, isIndexableCategory } from "@/lib/seo-config";
import { CONVERSION_CATALOGUE } from "@/lib/conversions/catalogue";
import {
  getCategoryUrlSlug,
  getCategoryUrl,
  getPairUrl,
  resolveCategoryIdFromUrlSlug,
} from "@/lib/conversions/url";
import { GUIDES } from "@/lib/conversions/guides";
import { COOKING_INGREDIENTS } from "@/lib/conversions/cooking";

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

const BUILD_LASTMOD = SITE_CONFIG.legalLastUpdatedIso;

/**
 * Returns the list of all child sitemap names (without "sitemap-" prefix and ".xml" suffix)
 * in the exact order they appear in /sitemap.xml:
 * - "pages" -> /sitemap-pages.xml
 * - "guides" -> /sitemap-guides.xml
 * - "cooking" -> /sitemap-cooking.xml
 * - 17 indexable category slugs -> /sitemap-<category>.xml
 */
export function getAllChildSitemapNames(): string[] {
  const categorySlugs = INDEXABLE_CATEGORIES.filter((slug) => slug !== "cooking");
  return ["pages", "guides", "cooking", ...categorySlugs];
}

/**
 * Resolves the canonical, 200-status, indexable URL entries for a given child sitemap name.
 */
export function getChildSitemapEntries(name: string): SitemapUrlEntry[] | null {
  const baseUrl = SITE_CONFIG.baseUrl;

  if (name === "pages") {
    return [
      {
        loc: baseUrl,
        lastmod: BUILD_LASTMOD,
        changefreq: "weekly",
        priority: "1.0",
      },
      {
        loc: `${baseUrl}/directory`,
        lastmod: BUILD_LASTMOD,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: BUILD_LASTMOD,
        changefreq: "monthly",
        priority: "0.6",
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: BUILD_LASTMOD,
        changefreq: "monthly",
        priority: "0.5",
      },
      {
        loc: `${baseUrl}/widgets`,
        lastmod: BUILD_LASTMOD,
        changefreq: "weekly",
        priority: "0.8",
      },
    ];
  }

  if (name === "guides") {
    return [
      {
        loc: `${baseUrl}/guides`,
        lastmod: BUILD_LASTMOD,
        changefreq: "weekly",
        priority: "0.8",
      },
      ...GUIDES.map((g) => ({
        loc: `${baseUrl}/guides/${g.slug}`,
        lastmod: BUILD_LASTMOD,
        changefreq: "monthly" as const,
        priority: "0.7",
      })),
    ];
  }

  if (name === "cooking") {
    return [
      {
        loc: `${baseUrl}/cooking`,
        lastmod: BUILD_LASTMOD,
        changefreq: "weekly",
        priority: "0.9",
      },
      ...COOKING_INGREDIENTS.map((ing) => ({
        loc: `${baseUrl}/cooking/${ing.slug}`,
        lastmod: BUILD_LASTMOD,
        changefreq: "weekly" as const,
        priority: "0.8",
      })),
    ];
  }

  // Check if `name` is one of the 17 indexable catalogue category slugs
  if (!isIndexableCategory(name)) {
    return null;
  }

  const categoryId = resolveCategoryIdFromUrlSlug(name);
  if (!categoryId || !isIndexableCategory(categoryId)) {
    return null;
  }

  const canonicalSlug = getCategoryUrlSlug(categoryId);
  if (canonicalSlug !== name) {
    return null;
  }

  const pairs = CONVERSION_CATALOGUE.filter((p) => p.categoryId === categoryId);

  return [
    {
      loc: `${baseUrl}${getCategoryUrl(categoryId)}`,
      lastmod: BUILD_LASTMOD,
      changefreq: "weekly",
      priority: "0.9",
    },
    ...pairs.map((pair) => ({
      loc: `${baseUrl}${getPairUrl(pair)}`,
      lastmod: BUILD_LASTMOD,
      changefreq: "weekly" as const,
      priority: "0.8",
    })),
  ];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates the XML string for the root Sitemap Index (/sitemap.xml)
 * and logs the URL count per child sitemap at build time.
 */
export function buildSitemapIndexXml(): string {
  const baseUrl = SITE_CONFIG.baseUrl;
  const names = getAllChildSitemapNames();
  let totalUrls = 0;

  const sitemapBlocks = names.map((name) => {
    const entries = getChildSitemapEntries(name) || [];
    totalUrls += entries.length;
    console.log(
      `[SEO Sitemap] sitemap-${name}.xml -> ${entries.length} indexable URLs`
    );
    return [
      "  <sitemap>",
      `    <loc>${escapeXml(`${baseUrl}/sitemap-${name}.xml`)}</loc>`,
      `    <lastmod>${escapeXml(BUILD_LASTMOD)}</lastmod>`,
      "  </sitemap>",
    ].join("\n");
  });

  console.log(
    `[SEO Sitemap] Total indexable URLs across ${names.length} sitemaps: ${totalUrls}`
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapBlocks,
    "</sitemapindex>",
    "",
  ].join("\n");
}

/**
 * Generates the XML string for a child sitemap (/sitemap-<name>.xml).
 */
export function buildChildSitemapXml(name: string): string | null {
  const entries = getChildSitemapEntries(name);
  if (!entries) return null;

  console.log(
    `[SEO Sitemap] Built sitemap-${name}.xml (${entries.length} URLs)`
  );

  const urlBlocks = entries.map((entry) => {
    const lines = [
      "  <url>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
    ];
    if (entry.changefreq) {
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }
    if (entry.priority) {
      lines.push(`    <priority>${entry.priority}</priority>`);
    }
    lines.push("  </url>");
    return lines.join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlBlocks,
    "</urlset>",
    "",
  ].join("\n");
}
