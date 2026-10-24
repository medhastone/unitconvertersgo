import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { isObscureConversionPair } from "@/lib/seo";
import { CATEGORIES } from "@/lib/conversions/units";
import { CONVERSION_CATALOGUE } from "@/lib/conversions/catalogue";
import { getPairUrl, getCategoryUrl } from "@/lib/conversions/url";
import { GUIDES } from "@/lib/conversions/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.baseUrl;
  const stableLastModified = new Date(SITE_CONFIG.legalLastUpdatedIso);

  // Static core routes (only 200 indexable canonical URLs)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: stableLastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: stableLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: stableLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: stableLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-converter`,
      lastModified: stableLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/widgets`,
      lastModified: stableLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: stableLastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: stableLastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: stableLastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: stableLastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: stableLastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: stableLastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Category hub pages (clean top-level /[category-slug])
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}${getCategoryUrl(cat.id)}`,
    lastModified: stableLastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Indexable conversion landing pages (excluding noindex obscure scientific pairs)
  const indexablePairs = CONVERSION_CATALOGUE.filter(
    (pair) => !isObscureConversionPair(pair)
  );

  const conversionRoutes: MetadataRoute.Sitemap = indexablePairs.map((pair) => ({
    url: `${baseUrl}${getPairUrl(pair)}`,
    lastModified: stableLastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Widget Customizer Studio pages for indexable pairs
  const widgetRoutes: MetadataRoute.Sitemap = indexablePairs.map((pair) => ({
    url: `${baseUrl}/widgets/w/${pair.slug}`,
    lastModified: stableLastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Educational guides
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: stableLastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...conversionRoutes,
    ...widgetRoutes,
    ...guideRoutes,
  ];
}
