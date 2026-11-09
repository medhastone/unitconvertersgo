import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeftRight,
  ChevronRight,
  Thermometer,
  Ruler,
  Scale,
  Square,
  Beaker,
  Gauge,
  Clock,
  CircleDot,
  Zap,
  Activity,
  HardDrive,
  ArrowDownUp,
  Flame,
  Layers,
  RotateCw,
  Radio,
  Compass,
  Fuel,
} from "lucide-react";
import ConversionPageInteractive from "@/components/ConversionPageInteractive";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";
import CategoryExplorerHub from "@/components/CategoryExplorerHub";
import ToolSearchBar from "@/components/ToolSearchBar";
import {
  CONVERSION_CATALOGUE,
  CATALOGUE_MAP,
  getConversionPair,
  getConversionsByCategory,
} from "@/lib/conversions/catalogue";
import {
  getCategoryUrlSlug,
  getCategoryUrl,
  resolveCategoryIdFromUrlSlug,
  getPairUrl,
} from "@/lib/conversions/url";
import { CATEGORY_MAP, UNIT_MAP } from "@/lib/conversions/units";
import { getTrustedReferencesForPair } from "@/lib/conversions/references";
import { generateEditorialContentBundle } from "@/lib/conversions/editorial";
import { generateLiveSolution } from "@/lib/conversions/solver";
import { SITE_CONFIG } from "@/lib/config";
import {
  buildPageMetadata,
  buildStandardToolTitle,
  buildStandardToolDescription,
  getCategoryOgImage,
} from "@/lib/seo";
import { isMergedThinHub } from "@/lib/seo-config";
import { isPairIndexable, getDuplicateOf } from "@/lib/seo-tiers";
import { getPairContent, getCuratedCommonValues } from "@/lib/pair-content";
import { ConversionPairInfo } from "@/lib/conversions/types";
import { resolveInvalidPairRedirect } from "@/lib/conversions/cooking";
import fs from "fs";
import path from "path";

let cachedSlugRedirectMap: Map<string, string> | null = null;
function getSlugRedirectDestination(requestPath: string): string | undefined {
  if (!cachedSlugRedirectMap) {
    cachedSlugRedirectMap = new Map<string, string>();
    try {
      const p = path.join(process.cwd(), "data", "slug-redirects.json");
      if (fs.existsSync(p)) {
        const list = JSON.parse(fs.readFileSync(p, "utf-8")) as Array<{
          source: string;
          destination: string;
        }>;
        for (const item of list) {
          cachedSlugRedirectMap.set(item.source.toLowerCase(), item.destination);
        }
      }
    } catch {
      // ignore
    }
  }
  return cachedSlugRedirectMap.get(requestPath.toLowerCase());
}

interface HierarchicalConversionPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return CONVERSION_CATALOGUE.map((item) => ({
    category: getCategoryUrlSlug(item.categoryId),
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: HierarchicalConversionPageProps): Promise<Metadata> {
  const { category: rawCat, slug } = await params;
  if (resolveInvalidPairRedirect(rawCat, slug)) {
    return {};
  }
  const currentPath = `/${decodeURIComponent(rawCat).trim()}/${decodeURIComponent(slug).trim()}`;
  const explicitRedirect = getSlugRedirectDestination(currentPath);
  if (explicitRedirect) {
    return {};
  }

  const categoryIdHint = resolveCategoryIdFromUrlSlug(rawCat);
  const pair = getConversionPair(slug, categoryIdHint);
  if (!pair) return {};

  const duplicateWinnerPath = getDuplicateOf(pair);
  const canonicalPath = duplicateWinnerPath || getPairUrl(pair);
  const fromUnit = UNIT_MAP.get(pair.fromUnitId);
  const toUnit = UNIT_MAP.get(pair.toUnitId);
  const standardTitle = buildStandardToolTitle(pair, fromUnit, toUnit);
  const standardDescription = buildStandardToolDescription(pair, fromUnit, toUnit);

  return buildPageMetadata({
    title: standardTitle,
    description: standardDescription,
    canonicalPath,
    type: "website",
    noindex: !isPairIndexable(pair),
    categoryId: pair.categoryId,
    pairSlug: pair.slug,
    useExactTitle: true,
  });
}

export default async function HierarchicalConversionPage({
  params,
}: HierarchicalConversionPageProps) {
  const { category: rawCat, slug } = await params;
  const invalidRedirectTarget = resolveInvalidPairRedirect(rawCat, slug);
  if (invalidRedirectTarget) {
    permanentRedirect(invalidRedirectTarget);
  }

  const currentPath = `/${decodeURIComponent(rawCat).trim()}/${decodeURIComponent(
    slug
  ).trim()}`;
  const explicitRedirect = getSlugRedirectDestination(currentPath);
  if (explicitRedirect && explicitRedirect !== currentPath) {
    permanentRedirect(explicitRedirect);
  }

  const categoryIdHint = resolveCategoryIdFromUrlSlug(rawCat);
  const pair = getConversionPair(slug, categoryIdHint);

  if (!pair) {
    notFound();
  }

  const canonicalPath = getPairUrl(pair);

  // Canonicalize any non-.htm or alias category/slug URL to the single canonical /[category]/[slug] URL
  if (currentPath !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const category = CATEGORY_MAP.get(pair.categoryId);
  const fromUnit = UNIT_MAP.get(pair.fromUnitId);
  const toUnit = UNIT_MAP.get(pair.toUnitId);

  if (!category || !fromUnit || !toUnit) {
    notFound();
  }

  const editorial = generateEditorialContentBundle(pair, fromUnit, toUnit);
  const pairContent = getPairContent(pair.slug);
  const curatedCommonValues = getCuratedCommonValues(
    getCategoryUrlSlug(pair.categoryId),
    pair.slug,
    pair.fromUnitId
  );
  const h1WithSymbols =
    editorial.h1.includes(fromUnit.symbol) && editorial.h1.includes(toUnit.symbol)
      ? editorial.h1
      : `${fromUnit.plural} to ${toUnit.plural} Converter (${fromUnit.symbol} to ${toUnit.symbol})`;

  // 1. Reciprocal pair (e.g. inches-to-cm for cm-to-inches)
  const reciprocalPair =
    CONVERSION_CATALOGUE.find(
      (p) => p.fromUnitId === pair.toUnitId && p.toUnitId === pair.fromUnitId
    ) || getConversionPair(`${toUnit.id}-to-${fromUnit.id}`, pair.categoryId);

  // 2. Same-Source internal links
  const sameSourceConversions = CONVERSION_CATALOGUE.filter(
    (p) => p.fromUnitId === pair.fromUnitId && p.slug !== pair.slug
  ).slice(0, 6);

  // 3. Same-Target internal links
  const sameTargetConversions = CONVERSION_CATALOGUE.filter(
    (p) => p.toUnitId === pair.toUnitId && p.slug !== pair.slug
  ).slice(0, 6);

  // 4. Other conversions in same category
  const relatedConversions = getConversionsByCategory(pair.categoryId)
    .filter((p) => p.slug !== pair.slug)
    .slice(0, 10);

  // Featured "Related Converters" (5–8 related converters in the same category)
  const featuredRelatedPairs: ConversionPairInfo[] = [];
  if (pair.slug === "cm-to-inches") {
    const preferredSlugs = [
      "inches-to-cm",
      "mm-to-inches",
      "meters-to-feet",
      "feet-to-inches",
      "cm-to-feet",
      "feet-to-meters",
      "km-to-miles",
    ];
    for (const s of preferredSlugs) {
      const found = CATALOGUE_MAP.get(s);
      if (found) featuredRelatedPairs.push(found);
    }
  } else {
    const seen = new Set<string>([pair.slug]);
    const candidates = [
      ...(reciprocalPair ? [reciprocalPair] : []),
      ...sameTargetConversions.slice(0, 3),
      ...sameSourceConversions.slice(0, 3),
      ...relatedConversions,
    ];
    for (const c of candidates) {
      if (!seen.has(c.slug) && featuredRelatedPairs.length < 8) {
        seen.add(c.slug);
        featuredRelatedPairs.push(c);
      }
    }
  }

  const trustedRefs = getTrustedReferencesForPair(pair, fromUnit, toUnit);

  // Structured Data (BreadcrumbList + TechArticle + HowTo + WebApplication + FAQPage)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${category.name} Converter`,
        item: `${SITE_CONFIG.baseUrl}${getCategoryUrl(category.id)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${fromUnit.plural} to ${toUnit.plural}`,
        item: `${SITE_CONFIG.baseUrl}${canonicalPath}`,
      },
    ],
  };

  const standardTitle = buildStandardToolTitle(pair, fromUnit, toUnit);
  const standardDescription = buildStandardToolDescription(pair, fromUnit, toUnit);
  const categoryOgImg = getCategoryOgImage(pair.categoryId, standardTitle, pair.slug);

  const articleAndAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: standardTitle,
    description: standardDescription,
    url: `${SITE_CONFIG.baseUrl}${canonicalPath}`,
    image: categoryOgImg.url,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
    citation: trustedRefs.map((r) => ({
      "@type": "CreativeWork",
      name: `${r.shortName} ${r.standardCode}: ${r.documentTitle}`,
      url: r.url,
    })),
  };

  const exampleSolution = generateLiveSolution(
    pair.exampleInput,
    pair.fromUnitId,
    pair.toUnitId,
    "auto"
  );

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Convert ${fromUnit.plural} to ${toUnit.plural}`,
    description: `Step-by-step mathematical guide to convert from ${fromUnit.name} (${fromUnit.symbol}) to ${toUnit.name} (${toUnit.symbol}) using official metrology standards: ${exampleSolution.factorNote}.`,
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: exampleSolution.step1Title,
        text: exampleSolution.step1Detail,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: exampleSolution.step2Title,
        text: `${exampleSolution.step2Explanation} Calculation: ${exampleSolution.step2Expression}`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: exampleSolution.step3Title,
        text: `${exampleSolution.step3Conclusion} ${exampleSolution.reciprocalNote}`,
      },
    ],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: standardTitle,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: `${SITE_CONFIG.baseUrl}${canonicalPath}`,
    description: standardDescription,
    image: categoryOgImg.url,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.baseUrl}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqList =
    editorial.googlePaaFaqs && editorial.googlePaaFaqs.length > 0
      ? editorial.googlePaaFaqs
      : pair.faqs || [];

  const faqJsonLd =
    faqList.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqList.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  const combinedPageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd,
      articleAndAppJsonLd,
      howToJsonLd,
      webAppJsonLd,
      ...(faqJsonLd ? [faqJsonLd] : []),
    ],
  };

  return (
    <div suppressHydrationWarning className="w-full bg-[#F7F9FC]/60 dark:bg-slate-950 min-h-screen">
      <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-9 space-y-8">
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedPageJsonLd) }}
        />

        {/* Breadcrumbs & Inline Animated Smart Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumbs"
            className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 shrink-0"
          >
            <Link
              href="/"
              prefetch={false}
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight
              className="w-4 h-4 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <Link
              href={isMergedThinHub(category.id) ? "/specialty" : getCategoryUrl(category.id)}
              prefetch={false}
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors font-medium"
            >
              {isMergedThinHub(category.id) ? "Specialty & Engineering Hub" : `${category.name} Converter`}
            </Link>
            <ChevronRight
              className="w-4 h-4 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-[#16324F] dark:text-white font-bold">
              {fromUnit.plural} to {toUnit.plural}
            </span>
          </nav>

          <div className="w-full md:max-w-md lg:max-w-lg">
            <ToolSearchBar currentCategoryName={category.name} />
          </div>
        </div>

        {/* Page Title (H1) & 1-Sentence Actionable Subheading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-1">
          <div className="flex items-start sm:items-center gap-4 max-w-3xl">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E6FAF8] dark:bg-teal-950/60 border border-[#0D9488]/30 dark:border-teal-800/70 text-[#0D9488] dark:text-[#2DD4BF] shadow-xs flex items-center justify-center shrink-0">
              {category.iconName === "Thermometer" ? (
                <Thermometer className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Ruler" ? (
                <Ruler className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Scale" ? (
                <Scale className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Square" ? (
                <Square className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Beaker" ? (
                <Beaker className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Gauge" ? (
                <Gauge className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Clock" ? (
                <Clock className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "CircleDot" ? (
                <CircleDot className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Zap" ? (
                <Zap className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Activity" ? (
                <Activity className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "HardDrive" ? (
                <HardDrive className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "ArrowDownUp" ? (
                <ArrowDownUp className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Flame" ? (
                <Flame className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Layers" ? (
                <Layers className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "RotateCw" ? (
                <RotateCw className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Radio" ? (
                <Radio className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Compass" ? (
                <Compass className="w-7 h-7 stroke-[2.2]" />
              ) : category.iconName === "Fuel" ? (
                <Fuel className="w-7 h-7 stroke-[2.2]" />
              ) : (
                <ArrowLeftRight className="w-7 h-7 stroke-[2.2]" />
              )}
            </div>
            <div className="space-y-1.5">
              <h1 className="text-[26px] sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white leading-tight">
                {h1WithSymbols}
              </h1>
              <p className="text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {editorial.subheading}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Visual Scale Graphic (Desktop) */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
            >
              <span className="px-2.5 py-1 rounded-lg bg-sky-100/90 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-xs font-extrabold">
                {fromUnit.symbol}
              </span>
              <ArrowRight className="w-4 h-4 text-[#0D9488]" />
              <span className="px-2.5 py-1 rounded-lg bg-teal-100/90 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono text-xs font-extrabold">
                {toUnit.symbol}
              </span>
            </div>

            {reciprocalPair && (
              <Link
                href={getPairUrl(reciprocalPair)}
                prefetch={false}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#16324F] dark:text-slate-200 bg-white dark:bg-slate-900 hover:border-[#0D9488] border border-slate-200/90 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-2xs transition-all group"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#0D9488] group-hover:rotate-180 transition-transform duration-300" />
                <span>
                  {toUnit.plural} to {fromUnit.plural} ({toUnit.symbol} →{" "}
                  {fromUnit.symbol})
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Main 2-Column Layout: Tool Box -> Conversion Table -> How to Convert -> What Is -> More [Unit A] & [Unit B] Conversions -> FAQs */}
        <ConversionPageInteractive
          pair={pair}
          featuredRelatedPairs={featuredRelatedPairs}
          pairContent={pairContent}
          curatedCommonValues={curatedCommonValues}
        />

        {/* Compact Official Metrology References Section */}
        <TrustedSourcesSection
          categoryId={category.id}
          categoryName={category.name}
          pair={pair}
          fromUnit={fromUnit}
          toUnit={toUnit}
          pageTopic={`Convert ${fromUnit.plural} to ${toUnit.plural} (${fromUnit.symbol} to ${toUnit.symbol})`}
        />

        {/* Cross-Category Hub Links */}
        <CategoryExplorerHub currentCategoryId={category.id} />
      </div>
    </div>
  );
}
