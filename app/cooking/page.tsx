import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Scale,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  ArrowRight,
  HelpCircle,
  Globe,
  Utensils,
} from "lucide-react";
import CookingIngredientConverter from "@/components/CookingIngredientConverter";
import {
  COOKING_INGREDIENTS,
  COOKING_PACKING_NOTE,
  COOKING_HUB_FAQS,
  REGIONAL_CUP_STANDARDS,
  formatCookingNumber,
} from "@/lib/conversions/cooking";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata, getCategoryOgImage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cups to Grams & Cooking Ingredient Weight Converter",
  description:
    "1 US cup flour = 125 g, 1 US cup sugar = 200 g. Convert cooking ingredients between cups, grams, oz, tbsp & mL instantly with US & Metric cup charts.",
  canonicalPath: "/cooking",
  categoryId: "cooking",
});

export default function CookingCategoryHubPage() {
  const cookingOgImage = getCategoryOgImage(
    "cooking",
    "Cups to Grams & Cooking Ingredient Weight Converter"
  );

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
    ],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cups to Grams & Cooking Ingredient Weight Converter",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: `${SITE_CONFIG.baseUrl}/cooking`,
    description:
      "Convert cooking and baking ingredients between cups, grams, ounces, tablespoons, teaspoons, and milliliters with US Customary (236.59 mL) and Metric (250 mL) cup charts.",
    image: cookingOgImage.url,
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

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cooking & Ingredient Conversions (Cups to Grams & Grams to Cups)",
    description:
      "Density-aware kitchen ingredient conversions between grams, ounces, US cups, Metric cups, tablespoons, teaspoons, and milliliters sourced from USDA FoodData Central and manufacturer guides.",
    url: `${SITE_CONFIG.baseUrl}/cooking`,
    hasPart: COOKING_INGREDIENTS.map((item) => ({
      "@type": "WebPage",
      name: `${item.name} Weight to Volume Converter`,
      url: `${SITE_CONFIG.baseUrl}/cooking/${item.slug}`,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COOKING_HUB_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-[#16324F] dark:text-white">
            Cooking &amp; Ingredient Conversions
          </span>
        </nav>

        {/* Page Hero */}
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Density-Aware Kitchen Calculators</span>
            <span aria-hidden="true">•</span>
            <span>USDA FoodData Central &amp; Manufacturer Verified</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white leading-tight">
            Cups to Grams &amp; Cooking Ingredient Converter
          </h1>

          <p className="text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-snug">
            Convert flour, sugar, butter, honey, and more between grams, cups, and spoons —{" "}
            <strong className="font-bold text-[#16324F] dark:text-white">
              1 US cup flour = 125 g
            </strong>{" "}
            ·{" "}
            <strong className="font-bold text-[#16324F] dark:text-white">
              1 Metric cup = 132.1 g
            </strong>
            .
          </p>
        </header>

        {/* Interactive Ingredient Density Calculator */}
        <CookingIngredientConverter
          initialIngredientSlug="flour"
          initialFromUnitId="cup"
          initialToUnitId="g"
          initialValue={1}
          navigateOnIngredientChange={false}
        />

        {/* Multi-Ingredient Quick Reference Chart (1, 3/4, 1/2, 1/3, 1/4 US Cup + 1 Metric Cup) */}
        <section
          aria-labelledby="quick-reference-chart-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="space-y-1.5">
            <h2
              id="quick-reference-chart-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              Cups to Grams Quick Reference Chart for Common Ingredients
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Use this side-by-side kitchen chart to convert fractional{" "}
              <strong>US Customary cups (236.59 mL)</strong>,{" "}
              <strong>1 US Tablespoon</strong>, and{" "}
              <strong>1 Metric Cup (250 mL)</strong> directly into grams. Click any
              ingredient name to open its dedicated converter and full gram-to-cup
              tables.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-[#F7F9FC] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-[#16324F] dark:text-slate-200">
                  <th className="py-3.5 px-3.5">Ingredient</th>
                  <th className="py-3.5 px-3.5">1 US Cup (236.6 mL)</th>
                  <th className="py-3.5 px-3.5">3/4 US Cup</th>
                  <th className="py-3.5 px-3.5">1/2 US Cup</th>
                  <th className="py-3.5 px-3.5">1/3 US Cup</th>
                  <th className="py-3.5 px-3.5">1/4 US Cup</th>
                  <th className="py-3.5 px-3.5">1 Tbsp</th>
                  <th className="py-3.5 px-3.5">1 Metric Cup (250 mL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                {COOKING_INGREDIENTS.map((item) => {
                  const c1 = item.gramsPerUsCup;
                  return (
                    <tr
                      key={item.slug}
                      className="hover:bg-[#F7F9FC]/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3.5 font-bold text-[#16324F] dark:text-white">
                        <Link
                          href={`/cooking/${item.slug}`}
                          className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3.5 font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                        {formatCookingNumber(c1)} g
                      </td>
                      <td className="py-3.5 px-3.5 font-mono">
                        {formatCookingNumber(c1 * 0.75)} g
                      </td>
                      <td className="py-3.5 px-3.5 font-mono">
                        {formatCookingNumber(c1 * 0.5)} g
                      </td>
                      <td className="py-3.5 px-3.5 font-mono">
                        {formatCookingNumber(c1 / 3)} g
                      </td>
                      <td className="py-3.5 px-3.5 font-mono">
                        {formatCookingNumber(c1 * 0.25)} g
                      </td>
                      <td className="py-3.5 px-3.5 font-mono">
                        {formatCookingNumber(item.gramsPerTbsp)} g
                      </td>
                      <td className="py-3.5 px-3.5 font-mono font-semibold text-[#16324F] dark:text-slate-200">
                        {formatCookingNumber(item.gramsPerMetricCup)} g
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dedicated Ingredient Pages Grid */}
        <section aria-labelledby="ingredient-pages-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2
                id="ingredient-pages-heading"
                className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
              >
                Dedicated Ingredient Conversion Tools
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Open a dedicated ingredient page for full US &amp; Metric cup/spoon
                charts, measuring instructions, worked examples, and source
                citations:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {COOKING_INGREDIENTS.map((item) => (
              <Link
                key={item.slug}
                href={`/cooking/${item.slug}`}
                className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0D9488] dark:hover:border-[#0D9488] p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
                      {item.categoryGroup}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>
                        {item.verificationStatus === "verified"
                          ? "USDA Verified"
                          : "Needs human verification"}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                    <span className="px-2 py-0.5 rounded bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                      1 US cup = {item.gramsPerUsCup} g ({item.ouncesPerUsCup} oz)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                      1 Metric cup = {item.gramsPerMetricCup} g
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                  <span>Convert {item.shortName} (g ↔ cups/tbsp/tsp/mL/oz)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Editorial Section 1: Why Cups to Grams Depends on Ingredient Density */}
        <section
          aria-labelledby="why-density-matters-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <h2
            id="why-density-matters-heading"
            className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
          >
            How to Convert Cups to Grams (And Why Ingredient Density Matters)
          </h2>

          <div className="space-y-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              A common point of confusion in home kitchens is trying to convert{" "}
              <strong>cups</strong> or <strong>tablespoons</strong> directly into{" "}
              <strong>grams</strong> using a single universal number. In physical
              metrology, cups and milliliters measure <strong>volume</strong> (the
              three-dimensional space an ingredient occupies), whereas grams and
              avoirdupois ounces measure <strong>mass</strong> (how heavy the
              ingredient is on a scale).
            </p>
            <p>
              To bridge volume and weight, you must multiply or divide by the
              ingredient&apos;s <strong>bulk density</strong> (
              <span className="font-mono font-semibold">ρ</span>, expressed in
              grams per milliliter, <span className="font-mono">g/mL</span>). For
              example, filling the exact same 1-cup (236.59 mL) measuring cup with
              different pantry staples produces vastly different weights on a
              digital scale:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              <li className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Light &amp; Aerated Powder
                </div>
                <div className="text-base font-extrabold text-[#16324F] dark:text-white mt-0.5 tabular-nums">
                  1 US Cup All-Purpose Flour = 125 g
                </div>
                <div className="text-xs font-mono text-[#0D9488] dark:text-[#2DD4BF]">
                  Density: 0.5283 g/mL (4.41 oz wt)
                </div>
              </li>
              <li className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Crystalline Granules
                </div>
                <div className="text-base font-extrabold text-[#16324F] dark:text-white mt-0.5 tabular-nums">
                  1 US Cup Granulated Sugar = 200 g
                </div>
                <div className="text-xs font-mono text-[#0D9488] dark:text-[#2DD4BF]">
                  Density: 0.8453 g/mL (7.05 oz wt)
                </div>
              </li>
              <li className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dense Viscous Syrup
                </div>
                <div className="text-base font-extrabold text-[#16324F] dark:text-white mt-0.5 tabular-nums">
                  1 US Cup Liquid Honey = 339 g
                </div>
                <div className="text-xs font-mono text-[#0D9488] dark:text-[#2DD4BF]">
                  Density: 1.4329 g/mL (11.96 oz wt)
                </div>
              </li>
            </ul>

            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2">
              <div className="text-sm font-extrabold uppercase tracking-wider text-[#16324F] dark:text-slate-200">
                Core Kitchen Density Formulas
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm sm:text-base text-[#16324F] dark:text-white">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <strong>US Cups to Grams:</strong> Grams = US Cups × 236.588 mL ×
                  Density (g/mL)
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <strong>Metric Cups to Grams:</strong> Grams = Metric Cups ×
                  250 mL × Density (g/mL)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Section 2: US Cups vs. Metric Cups vs. UK Imperial Cups */}
        <section
          aria-labelledby="regional-cup-sizes-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
            <h2
              id="regional-cup-sizes-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              US Cups vs. Metric Cups vs. UK Imperial Cups: What Is the Difference?
            </h2>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Before converting a recipe from cups to grams, check where the recipe
            was written. An American measuring cup holds{" "}
            <strong>236.59 mL</strong> (or <strong>240 mL</strong> on US FDA
            nutrition labels), whereas a modern{" "}
            <strong>Metric cup</strong> used in the United Kingdom, Australia, New
            Zealand, Canada, and South Africa holds <strong>250 mL</strong>—about{" "}
            <strong>5.67% more volume</strong>. All four regional cup standards are
            built directly into our calculator above:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-[#F7F9FC] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-[#16324F] dark:text-slate-200">
                  <th className="py-3.5 px-4">Cup Standard</th>
                  <th className="py-3.5 px-4">Exact Volume (mL)</th>
                  <th className="py-3.5 px-4">Fluid Ounces</th>
                  <th className="py-3.5 px-4">Tablespoons</th>
                  <th className="py-3.5 px-4">Where It Is Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                {REGIONAL_CUP_STANDARDS.map((cup) => (
                  <tr
                    key={cup.id}
                    className="hover:bg-[#F7F9FC]/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#16324F] dark:text-white">
                      {cup.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                      {cup.volumeMl}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{cup.flOzEquivalent}</td>
                    <td className="py-3.5 px-4 text-sm">{cup.tablespoons}</td>
                    <td className="py-3.5 px-4 text-sm leading-relaxed">
                      <div className="font-semibold text-[#16324F] dark:text-slate-200">
                        {cup.regions}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {cup.notes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Editorial Section 3: How to Measure Ingredients Accurately (Spoon & Level vs Packing) */}
        <section
          aria-labelledby="measuring-technique-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-5 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Utensils className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
            <h2
              id="measuring-technique-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              How to Measure Baking Ingredients Accurately: Spoon &amp; Level vs. Packing
            </h2>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Why do two experienced bakers using the exact same measuring cup often
            end up with a 30-gram difference in flour or brown sugar? How you fill
            the cup changes the density of dry ingredients. Here is how professional
            test kitchens measure each category of ingredient when creating their
            gram weight charts:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2">
              <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
                1. Flour &amp; Powdered Sugar (Spoon &amp; Level)
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Never dip your measuring cup directly into the flour sack—doing so
                compacts the powder and packs <strong>145–155 g</strong> into a cup
                meant to hold <strong>120–125 g</strong>. Instead, fluff the flour
                with a fork, gently spoon it into a dry cup until mounded, and sweep
                it flat with the straight back of a knife.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2">
              <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
                2. Brown Sugar (Firmly Packed)
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Because molasses causes brown sugar crystals to cling together and
                trap air pockets, loose brown sugar weighs only ~145 g per cup.
                Press moist brown sugar firmly into a dry cup with the back of a
                spoon until level with the rim (<strong>213–220 g</strong> per US
                cup) so it holds its shape when inverted.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2">
              <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
                3. Liquids, Honey &amp; Oils (Eye-Level Meniscus)
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Use a spouted glass pitcher on a flat countertop and read the bottom
                of the liquid&apos;s curved meniscus at eye level. Better yet, place
                your mixing bowl directly on a digital scale, press{" "}
                <strong>Tare</strong>, and pour milk (<strong>244 g/cup</strong>),
                oil (<strong>218 g/cup</strong>), or honey (
                <strong>339 g/cup</strong>) straight in with zero sticky cleanup.
              </p>
            </div>
          </div>
        </section>

        {/* Master Published Ingredient & Density Reference Table */}
        <section
          aria-labelledby="density-table-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-4 shadow-xs"
        >
          <div className="space-y-1.5">
            <h2
              id="density-table-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              Published Ingredient Density &amp; Source Citations Table
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              All values below are sourced from{" "}
              <strong>USDA FoodData Central</strong> (SR Legacy / Foundation Foods)
              and official manufacturer measurement guides (King Arthur Baking
              Company, Domino Sugar, Morton Salt, and Diamond Crystal).{" "}
              <span className="font-semibold text-[#16324F] dark:text-white">
                {COOKING_PACKING_NOTE}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-[#F7F9FC] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-[#16324F] dark:text-slate-200">
                  <th className="py-3.5 px-3.5">Ingredient</th>
                  <th className="py-3.5 px-3.5">Density (g/mL)</th>
                  <th className="py-3.5 px-3.5">1 US Cup (236.59 mL)</th>
                  <th className="py-3.5 px-3.5">1 Metric Cup (250 mL)</th>
                  <th className="py-3.5 px-3.5">1 Tbsp / 1 Tsp</th>
                  <th className="py-3.5 px-3.5">Published Source Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                {COOKING_INGREDIENTS.map((item) => {
                  const primaryStd = item.standards[0];
                  const secondaryStd = item.standards[1];
                  return (
                    <tr
                      key={item.slug}
                      className="hover:bg-[#F7F9FC]/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3.5 font-bold text-[#16324F] dark:text-white">
                        <Link
                          href={`/cooking/${item.slug}`}
                          className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3.5 font-mono">
                        <div className="font-bold text-[#16324F] dark:text-white">
                          {primaryStd.densityGPerMl} g/mL
                        </div>
                        {secondaryStd && (
                          <div className="text-xs text-slate-500">
                            Alt: {secondaryStd.densityGPerMl} g/mL
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono">
                        <div className="font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                          {primaryStd.gramsPerUsCup} g ({primaryStd.ouncesPerUsCup} oz)
                        </div>
                        {secondaryStd && (
                          <div className="text-xs text-slate-500">
                            {secondaryStd.shortLabel}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono font-semibold text-[#16324F] dark:text-slate-200">
                        <div>{primaryStd.gramsPerMetricCup} g</div>
                        {secondaryStd && (
                          <div className="text-xs text-slate-500">
                            Alt: {secondaryStd.gramsPerMetricCup} g
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono text-sm">
                        <div>{primaryStd.gramsPerTbsp} g / tbsp</div>
                        <div className="text-xs text-slate-500">
                          {primaryStd.gramsPerTsp} g / tsp
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-xs leading-relaxed max-w-xs">
                        <div className="font-semibold text-[#16324F] dark:text-slate-200">
                          {primaryStd.sourceOrganization}
                          {primaryStd.fdcId ? ` (${primaryStd.fdcId})` : ""}
                        </div>
                        {secondaryStd && (
                          <div className="text-slate-500 mt-0.5">
                            + {secondaryStd.sourceOrganization}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Methodology & Verification Policy Note */}
          <div className="rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
              <span>
                <strong>Editorial Verification Policy:</strong> Every ingredient
                density on {SITE_CONFIG.name} is sourced strictly from published
                references (USDA FoodData Central and official manufacturer
                measurement guides). Any ingredient without a published reference
                is explicitly flagged as{" "}
                <em className="font-semibold">needs human verification</em> and is
                never guessed.
              </span>
            </div>
            <a
              href="https://fdc.nal.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
            >
              <span>USDA FoodData Central</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) Section */}
        <section
          aria-labelledby="cooking-hub-faq-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-5 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
            <h2
              id="cooking-hub-faq-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              Frequently Asked Questions About Cups to Grams Conversions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COOKING_HUB_FAQS.map((faq) => (
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
      </div>
    </div>
  );
}
