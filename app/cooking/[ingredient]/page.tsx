import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Scale,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Info,
  ArrowRight,
  Utensils,
  Calculator,
  HelpCircle,
  Globe,
} from "lucide-react";
import CookingIngredientConverter from "@/components/CookingIngredientConverter";
import {
  COOKING_INGREDIENTS,
  COOKING_PACKING_NOTE,
  US_CUP_ML,
  US_LEGAL_CUP_ML,
  METRIC_CUP_ML,
  UK_IMPERIAL_CUP_ML,
  US_TBSP_ML,
  US_TSP_ML,
  AVOIRDUPOIS_OZ_GRAMS,
  getCookingIngredient,
  formatCookingNumber,
} from "@/lib/conversions/cooking";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata, getCategoryOgImage } from "@/lib/seo";

interface IngredientPageProps {
  params: Promise<{
    ingredient: string;
  }>;
}

const VOLUME_CHART_ROWS = [
  { label: "1 Teaspoon (1 tsp)", usMl: US_TSP_ML, metricCupFraction: null },
  { label: "1 Tablespoon (1 tbsp)", usMl: US_TBSP_ML, metricCupFraction: null },
  {
    label: "2 Tablespoons (1/8 cup)",
    usMl: US_CUP_ML * 0.125,
    metricCupFraction: 0.125,
  },
  {
    label: "1/4 Cup (4 US tbsp)",
    usMl: US_CUP_ML * 0.25,
    metricCupFraction: 0.25,
  },
  {
    label: "1/3 Cup (5 tbsp + 1 tsp)",
    usMl: US_CUP_ML / 3,
    metricCupFraction: 1 / 3,
  },
  {
    label: "1/2 Cup (8 US tbsp)",
    usMl: US_CUP_ML * 0.5,
    metricCupFraction: 0.5,
  },
  {
    label: "2/3 Cup",
    usMl: (US_CUP_ML * 2) / 3,
    metricCupFraction: 2 / 3,
  },
  {
    label: "3/4 Cup (12 US tbsp)",
    usMl: US_CUP_ML * 0.75,
    metricCupFraction: 0.75,
  },
  {
    label: "1 Cup (16 US tbsp / 8 fl oz)",
    usMl: US_CUP_ML,
    metricCupFraction: 1,
  },
  {
    label: "1 ½ Cups",
    usMl: US_CUP_ML * 1.5,
    metricCupFraction: 1.5,
  },
  {
    label: "2 Cups (1 US Pint)",
    usMl: US_CUP_ML * 2,
    metricCupFraction: 2,
  },
  {
    label: "3 Cups",
    usMl: US_CUP_ML * 3,
    metricCupFraction: 3,
  },
  {
    label: "4 Cups (1 US Quart / 1 Liter Metric)",
    usMl: US_CUP_ML * 4,
    metricCupFraction: 4,
  },
];

const MASS_CHART_GRAMS = [10, 25, 50, 75, 100, 125, 150, 200, 250, 500, 1000];

export async function generateStaticParams() {
  return COOKING_INGREDIENTS.map((item) => ({
    ingredient: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: IngredientPageProps): Promise<Metadata> {
  const { ingredient: rawSlug } = await params;
  const item = getCookingIngredient(rawSlug);
  if (!item) return {};

  const primaryStd = item.standards[0];
  const usCupGrams = formatCookingNumber(primaryStd.densityGPerMl * US_CUP_ML);
  const metricCupGrams = formatCookingNumber(
    primaryStd.densityGPerMl * METRIC_CUP_ML
  );
  const toolTitle = `${item.shortName} Cups to Grams Converter – Free & Instant (cup to g)`;
  const toolDescription = `1 US cup ${item.shortName.toLowerCase()} = ${usCupGrams} g (Metric cup = ${metricCupGrams} g). Convert ${item.shortName.toLowerCase()} cups, grams, oz & tbsp instantly. Includes live calculator & US/Metric cup charts.`;

  return buildPageMetadata({
    title: toolTitle,
    description: toolDescription,
    canonicalPath: `/cooking/${item.slug}`,
    categoryId: "cooking",
    useExactTitle: true,
  });
}

export default async function CookingIngredientPage({
  params,
}: IngredientPageProps) {
  const { ingredient: rawSlug } = await params;
  const item = getCookingIngredient(rawSlug);

  if (!item) {
    notFound();
  }

  const primaryStd = item.standards[0];
  const secondaryStd = item.standards[1];
  const otherIngredients = COOKING_INGREDIENTS.filter(
    (other) => other.slug !== item.slug
  );

  const regionalCupWeights = [
    {
      name: "US Customary Cup",
      volumeLabel: "236.59 mL (8 US fl oz)",
      regions: "United States (Standard Cookbooks)",
      grams: primaryStd.densityGPerMl * US_CUP_ML,
      oz: (primaryStd.densityGPerMl * US_CUP_ML) / AVOIRDUPOIS_OZ_GRAMS,
    },
    {
      name: "US Legal / FDA Cup",
      volumeLabel: "240.00 mL",
      regions: "US Nutrition Facts Labels",
      grams: primaryStd.densityGPerMl * US_LEGAL_CUP_ML,
      oz: (primaryStd.densityGPerMl * US_LEGAL_CUP_ML) / AVOIRDUPOIS_OZ_GRAMS,
    },
    {
      name: "Metric Cup (Commonwealth)",
      volumeLabel: "250.00 mL (1/4 Liter)",
      regions: "UK, Australia, NZ, Canada, South Africa",
      grams: primaryStd.densityGPerMl * METRIC_CUP_ML,
      oz: (primaryStd.densityGPerMl * METRIC_CUP_ML) / AVOIRDUPOIS_OZ_GRAMS,
    },
    {
      name: "UK Imperial Cup (Historical)",
      volumeLabel: "284.13 mL (10 Imp fl oz)",
      regions: "Vintage Pre-1970s British Cookbooks",
      grams: primaryStd.densityGPerMl * UK_IMPERIAL_CUP_ML,
      oz: (primaryStd.densityGPerMl * UK_IMPERIAL_CUP_ML) / AVOIRDUPOIS_OZ_GRAMS,
    },
  ];

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
        name: "Cooking & Ingredient Conversions",
        item: `${SITE_CONFIG.baseUrl}/cooking`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.name,
        item: `${SITE_CONFIG.baseUrl}/cooking/${item.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: item.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const usCupGrams = formatCookingNumber(primaryStd.densityGPerMl * US_CUP_ML);
  const metricCupGrams = formatCookingNumber(
    primaryStd.densityGPerMl * METRIC_CUP_ML
  );
  const toolTitle = `${item.shortName} Cups to Grams Converter – Free & Instant (cup to g)`;
  const toolDescription = `1 US cup ${item.shortName.toLowerCase()} = ${usCupGrams} g (Metric cup = ${metricCupGrams} g). Convert ${item.shortName.toLowerCase()} cups, grams, oz & tbsp instantly. Includes live calculator & US/Metric cup charts.`;
  const cookingOgImg = getCategoryOgImage("cooking", toolTitle);

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolTitle,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: `${SITE_CONFIG.baseUrl}/cooking/${item.slug}`,
    description: toolDescription,
    image: cookingOgImg.url,
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

  return (
    <div className="min-h-screen bg-[#F7F9FC]/60 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link
            href="/cooking"
            className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
          >
            Cooking &amp; Ingredient Conversions
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-[#16324F] dark:text-white">
            {item.name}
          </span>
        </nav>

        {/* Hero Header */}
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] text-xs font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>{item.categoryGroup}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {item.verificationStatus === "verified"
                  ? `Verified Reference (${primaryStd.sourceOrganization})`
                  : "Needs human verification"}
              </span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white leading-tight">
            {item.name} — Cups to Grams &amp; Grams to Cups Converter
          </h1>

          <p className="text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-snug tabular-nums">
            Convert {item.shortName.toLowerCase()} between grams, cups, and spoons —{" "}
            <strong className="font-bold text-[#16324F] dark:text-white">
              1 US cup = {primaryStd.gramsPerUsCup} g ({primaryStd.ouncesPerUsCup} oz)
            </strong>{" "}
            ·{" "}
            <strong className="font-bold text-[#16324F] dark:text-white">
              1 Metric cup = {primaryStd.gramsPerMetricCup} g
            </strong>
            .
          </p>
        </header>

        {/* Interactive Ingredient Converter */}
        <CookingIngredientConverter
          initialIngredientSlug={item.slug}
          initialFromUnitId="cup"
          initialToUnitId="g"
          initialValue={1}
          navigateOnIngredientChange={true}
        />

        {/* Table 1: Volume (US Cups, Metric Cups, Tbsp, Tsp, mL) to Grams & Ounces */}
        <section
          aria-labelledby="volume-to-weight-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="space-y-1">
            <h2
              id="volume-to-weight-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              {item.name} — Cups, Tablespoons &amp; Teaspoons to Grams Chart (US &amp; Metric Cups)
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Calculated using published density{" "}
              <span className="font-mono font-bold text-[#16324F] dark:text-white">
                {primaryStd.densityGPerMl} g/mL
              </span>{" "}
              ({primaryStd.sourceOrganization}). Includes side-by-side weights for
              both <strong>US Customary Cups (236.59 mL)</strong> and{" "}
              <strong>Metric Cups (250 mL)</strong>.{" "}
              <span className="font-semibold text-[#16324F] dark:text-white">
                {COOKING_PACKING_NOTE}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-[#F7F9FC] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-[#16324F] dark:text-slate-200">
                  <th className="py-3.5 px-4">Volume Measure</th>
                  <th className="py-3.5 px-4">US Volume (mL)</th>
                  <th className="py-3.5 px-4">
                    US Cup Grams ({primaryStd.shortLabel})
                  </th>
                  <th className="py-3.5 px-4">Ounces (oz wt)</th>
                  <th className="py-3.5 px-4">Metric Cup (250 mL) Grams</th>
                  {secondaryStd && (
                    <th className="py-3.5 px-4">
                      Alt US Grams ({secondaryStd.shortLabel})
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                {VOLUME_CHART_ROWS.map((row) => {
                  const gUsPrimary = row.usMl * primaryStd.densityGPerMl;
                  const ozUsPrimary = gUsPrimary / AVOIRDUPOIS_OZ_GRAMS;
                  const gMetricCup =
                    row.metricCupFraction !== null
                      ? row.metricCupFraction *
                        METRIC_CUP_ML *
                        primaryStd.densityGPerMl
                      : null;
                  const gUsSecondary = secondaryStd
                    ? row.usMl * secondaryStd.densityGPerMl
                    : null;
                  return (
                    <tr
                      key={row.label}
                      className="hover:bg-[#F7F9FC]/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#16324F] dark:text-white">
                        {row.label}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {formatCookingNumber(row.usMl)} mL
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                        {formatCookingNumber(gUsPrimary)} g
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {formatCookingNumber(ozUsPrimary)} oz
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#16324F] dark:text-slate-200">
                        {gMetricCup !== null
                          ? `${formatCookingNumber(gMetricCup)} g`
                          : `${formatCookingNumber(
                              (row.usMl === US_TSP_ML ? 5 : 15) *
                                primaryStd.densityGPerMl
                            )} g (metric)`}
                      </td>
                      {secondaryStd && gUsSecondary !== null && (
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {formatCookingNumber(gUsSecondary)} g
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: Grams to US Cups, Metric Cups, Tablespoons, Teaspoons, Milliliters & Ounces */}
        <section
          aria-labelledby="grams-to-volume-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="space-y-1">
            <h2
              id="grams-to-volume-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              {item.name} — Grams to US Cups, Metric Cups, Tbsp, Tsp &amp; Ounces Chart
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Quick lookup for converting metric recipe weights in grams into{" "}
              <strong>US Customary cups (236.59 mL)</strong>,{" "}
              <strong>Metric cups (250 mL)</strong>, tablespoons, teaspoons,
              milliliters, and weight ounces at{" "}
              <span className="font-mono font-bold">
                ρ = {primaryStd.densityGPerMl} g/mL
              </span>
              .
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-[#F7F9FC] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-[#16324F] dark:text-slate-200">
                  <th className="py-3.5 px-4">Weight (Grams)</th>
                  <th className="py-3.5 px-4">US Cups (236.6 mL)</th>
                  <th className="py-3.5 px-4">Metric Cups (250 mL)</th>
                  <th className="py-3.5 px-4">Tablespoons (tbsp)</th>
                  <th className="py-3.5 px-4">Teaspoons (tsp)</th>
                  <th className="py-3.5 px-4">Milliliters (mL)</th>
                  <th className="py-3.5 px-4">Ounces (oz)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                {MASS_CHART_GRAMS.map((grams) => {
                  const ml = grams / primaryStd.densityGPerMl;
                  const usCups = ml / US_CUP_ML;
                  const metricCups = ml / METRIC_CUP_ML;
                  const tbsp = ml / US_TBSP_ML;
                  const tsp = ml / US_TSP_ML;
                  const oz = grams / AVOIRDUPOIS_OZ_GRAMS;
                  return (
                    <tr
                      key={grams}
                      className="hover:bg-[#F7F9FC]/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#16324F] dark:text-white">
                        {grams} g
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                        {formatCookingNumber(usCups)} US cups
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#16324F] dark:text-slate-200">
                        {formatCookingNumber(metricCups)} metric cups
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {formatCookingNumber(tbsp)} tbsp
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {formatCookingNumber(tsp)} tsp
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {formatCookingNumber(ml)} mL
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {formatCookingNumber(oz)} oz
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Editorial Section 1: Deep-Dive Overview & How to Measure [Ingredient] Accurately */}
        <section
          aria-labelledby="ingredient-measuring-guide-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-6 shadow-xs"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Utensils className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
              <h2
                id="ingredient-measuring-guide-heading"
                className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
              >
                {item.measuringGuide.title}
              </h2>
            </div>

            {item.overviewParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-base text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 sm:p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
                Step-by-Step Kitchen Measuring Technique
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300">
                {item.measuringGuide.summary}
              </p>
            </div>

            <ol className="space-y-2.5 list-decimal list-inside text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.measuringGuide.steps.map((step, i) => (
                <li key={i} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>

            <div className="rounded-lg bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 p-3.5 text-base text-amber-950 dark:text-amber-200">
              <strong>Common Kitchen Mistake to Avoid:</strong>{" "}
              {item.measuringGuide.avoidMistake}
            </div>
          </div>

          {/* Practical Kitchen & Baking Notes */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
              Culinary &amp; Baking Notes for {item.name}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {item.kitchenTips.map((tip, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Editorial Section 2: Regional Cup Comparison (US Customary vs US Legal vs Metric vs UK Imperial) */}
        <section
          aria-labelledby="regional-cup-comparison-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
            <h2
              id="regional-cup-comparison-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              US Cup vs. Metric Cup vs. UK Cup Weight for {item.name}
            </h2>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            If you are adapting an international recipe, remember that cup sizes
            vary by country. Here is how much <strong>1 cup of {item.name.toLowerCase()}</strong>{" "}
            weighs across all four global cup standards (at{" "}
            <span className="font-mono font-bold">
              ρ = {primaryStd.densityGPerMl} g/mL
            </span>
            ):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {regionalCupWeights.map((rc) => (
              <div
                key={rc.name}
                className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-1.5"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {rc.name}
                </div>
                <div className="text-xl font-extrabold text-[#16324F] dark:text-white tabular-nums">
                  {formatCookingNumber(rc.grams)} g{" "}
                  <span className="text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                    ({formatCookingNumber(rc.oz)} oz)
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  Volume: {rc.volumeLabel}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {rc.regions}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Section 3: Worked Conversion Examples */}
        <section
          aria-labelledby="worked-examples-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
            <h2
              id="worked-examples-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              Step-by-Step Conversion Examples for {item.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {item.workedExamples.map((ex) => (
              <div
                key={ex.title}
                className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 sm:p-5 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
                    {ex.title}
                  </h3>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ex.scenario}
                  </p>
                  <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <div>
                      <strong>Formula:</strong> {ex.formulaUsed}
                    </div>
                    <div>
                      <strong>Math:</strong> {ex.stepByStep}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 text-sm sm:text-base font-extrabold text-[#0D9488] dark:text-[#2DD4BF]">
                  {ex.resultSummary}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Published Source Citations & Packing Variability Card */}
        <section
          aria-labelledby="published-sources-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
            <h2
              id="published-sources-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white"
            >
              Published Density References &amp; Citations for {item.name}
            </h2>
          </div>

          <div className="space-y-3">
            {item.standards.map((std) => (
              <div
                key={std.id}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-extrabold text-[#16324F] dark:text-white">
                      {std.label}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-xs font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                      ρ = {std.densityGPerMl} g/mL · 1 Metric cup ={" "}
                      {std.gramsPerMetricCup} g
                    </span>
                    {std.verificationStatus === "verified" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Needs human verification</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {std.sourceCitation}
                  </p>
                </div>

                <a
                  href={std.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0 self-start sm:self-center"
                >
                  <span>Reference</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 p-4 flex items-start gap-2.5 text-sm sm:text-base text-amber-950 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
            <div>
              <strong>Important Culinary Notice:</strong> Cooking results are
              approximate. {COOKING_PACKING_NOTE} {item.culinaryTip}
            </div>
          </div>
        </section>

        {/* Ingredient-Specific Frequently Asked Questions */}
        <section
          aria-labelledby="ingredient-faq-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
            <h2
              id="ingredient-faq-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              Frequently Asked Questions About {item.name} Conversions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 sm:p-5 space-y-2"
              >
                <h3 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white leading-snug">
                  {faq.question}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Other Ingredients in Cooking & Ingredient Conversions */}
        <section aria-labelledby="other-ingredients-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2
              id="other-ingredients-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white"
            >
              More Cooking &amp; Ingredient Conversions
            </h2>
            <Link
              href="/cooking"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
            >
              <span>All Ingredients</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {otherIngredients.map((other) => (
              <Link
                key={other.slug}
                href={`/cooking/${other.slug}`}
                className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0D9488] transition-colors flex flex-col justify-between gap-1"
              >
                <span className="text-sm sm:text-base font-bold text-[#16324F] dark:text-white">
                  {other.shortName}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {other.gramsPerUsCup} g/US cup · {other.gramsPerMetricCup} g/Metric
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
