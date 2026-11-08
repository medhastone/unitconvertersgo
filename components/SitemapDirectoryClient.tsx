"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  ChevronRight,
  Ruler,
  Scale,
  Thermometer,
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
  Sparkles,
  BookOpen,
  Globe,
  ShieldCheck,
  Code2,
  Type,
  ChevronDown,
} from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_MAP,
  UNIT_MAP,
  getUnitsByCategory,
} from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  CATALOGUE_MAP,
  getConversionsByCategory,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { COOKING_INGREDIENTS } from "@/lib/conversions/cooking";
import { isIndexableCategory } from "@/lib/seo-config";
import { GUIDES } from "@/lib/conversions/guides";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";

const ICON_MAP: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Thermometer: <Thermometer className="w-4 h-4" />,
  Square: <Square className="w-4 h-4" />,
  Beaker: <Beaker className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  CircleDot: <CircleDot className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  HardDrive: <HardDrive className="w-4 h-4" />,
  ArrowDownUp: <ArrowDownUp className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  RotateCw: <RotateCw className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Fuel: <Fuel className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
};

// Direct unit-to-unit conversion pairs matching unitconverters.net/sitemap.php
const COMPETITOR_POPULAR_UNIT_PAIRS: { slug: string; label: string }[] = [
  { slug: "cm-to-inches", label: "cm to inches" },
  { slug: "inches-to-cm", label: "inches to cm" },
  { slug: "kg-to-lbs", label: "kg to lbs" },
  { slug: "lbs-to-kg", label: "lbs to kg" },
  { slug: "celsius-to-fahrenheit", label: "Celsius to Fahrenheit" },
  { slug: "fahrenheit-to-celsius", label: "Fahrenheit to Celsius" },
  { slug: "mm-to-inches", label: "mm to inches" },
  { slug: "inches-to-mm", label: "inches to mm" },
  { slug: "meters-to-feet", label: "meters to feet" },
  { slug: "feet-to-meters", label: "feet to meters" },
  { slug: "km-to-miles", label: "km to miles" },
  { slug: "miles-to-km", label: "miles to km" },
  { slug: "cm-to-feet", label: "cm to feet" },
  { slug: "feet-to-cm", label: "feet to cm" },
  { slug: "grams-to-ounces", label: "grams to ounces" },
  { slug: "ounces-to-grams", label: "ounces to grams" },
  { slug: "inches-to-feet", label: "inches to feet" },
  { slug: "feet-to-inches", label: "feet to inches" },
  { slug: "liters-to-gallons", label: "liters to gallons" },
  { slug: "gallons-to-liters", label: "gallons to liters" },
  { slug: "pounds-to-ounces", label: "pounds to ounces" },
  { slug: "ounces-to-pounds", label: "ounces to pounds" },
  { slug: "mph-to-kph", label: "mph to kph" },
  { slug: "kph-to-mph", label: "kph to mph" },
  { slug: "acres-to-sq-feet", label: "acres to square feet" },
  { slug: "sq-feet-to-acres", label: "square feet to acres" },
  { slug: "radians-to-degrees", label: "radians to degrees" },
  { slug: "degrees-to-radians", label: "degrees to radians" },
  { slug: "hp-to-kw", label: "hp to kw" },
  { slug: "kw-to-hp", label: "kw to hp" },
  { slug: "meters-to-yards", label: "meters to yards" },
  { slug: "yards-to-meters", label: "yards to meters" },
  { slug: "ml-to-cups", label: "mL to cups" },
  { slug: "cups-to-ml", label: "cups to mL" },
  { slug: "psi-to-bar", label: "psi to bar" },
  { slug: "bar-to-psi", label: "bar to psi" },
  { slug: "kj-to-kcal", label: "kJ to kcal" },
  { slug: "kcal-to-kj", label: "kcal to kJ" },
  { slug: "gb-to-mb", label: "GB to MB" },
  { slug: "mb-to-gb", label: "MB to GB" },
  { slug: "mpg-to-l-100km", label: "MPG to L/100km" },
  { slug: "l-100km-to-mpg", label: "L/100km to MPG" },
];

export default function SitemapDirectoryClient() {
  const [query, setQuery] = useState("");
  const { placeholder } = useTypewriterPlaceholder({
    isPaused: query.trim().length > 0,
    prefix: "Filter indexable categories & converters — e.g. ",
  });

  const normalizedQuery = query.trim().toLowerCase();

  // Build indexable categories with all of their converter pages
  const indexableCategoriesList = useMemo(() => {
    const orderedIds = [
      "length",
      "mass",
      "temperature",
      "volume",
      "area",
      "speed",
      "time",
      "pressure",
      "energy",
      "power",
      "digital_storage",
      "data_transfer",
      "fuel_economy",
      "force",
      "density",
      "angle",
      "frequency",
    ];
    const list = orderedIds
      .map((catId) => {
        const cat = CATEGORY_MAP.get(catId);
        if (!cat || !isIndexableCategory(cat.id)) return null;
        const units = getUnitsByCategory(cat.id);
        const allCatPairs = getConversionsByCategory(cat.id);
        return {
          id: cat.id,
          name: `${cat.name} Converter`,
          shortName: cat.name,
          href: getCategoryUrl(cat.id),
          description: cat.description,
          iconName: cat.iconName,
          unitCount: units.length,
          pairs: allCatPairs.map((p) => {
            const fromU = UNIT_MAP.get(p.fromUnitId);
            const toU = UNIT_MAP.get(p.toUnitId);
            return {
              slug: p.slug,
              href: getPairUrl(p),
              label:
                fromU && toU
                  ? `${fromU.plural} to ${toU.plural} Converter`
                  : p.title,
            };
          }),
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    // Add Cooking & Ingredients (18th indexable category)
    list.push({
      id: "cooking",
      name: "Cooking & Ingredient Converter",
      shortName: "Cooking",
      href: "/cooking",
      description:
        "Convert kitchen weights and volumes (grams, cups, tbsp, tsp, oz, mL) across verified baking ingredients.",
      iconName: "Scale",
      unitCount: COOKING_INGREDIENTS.length,
      pairs: COOKING_INGREDIENTS.map((ing) => ({
        slug: ing.slug,
        href: `/cooking/${ing.slug}`,
        label: `${ing.name} Weight to Volume Converter`,
      })),
    });

    return list;
  }, []);

  const nonIndexableCategoriesList = useMemo(() => {
    return CATEGORIES.filter((cat) => !isIndexableCategory(cat.id)).map((cat) => {
      const allCatPairs = getConversionsByCategory(cat.id);
      return {
        id: cat.id,
        name: `${cat.name} Converter`,
        href: getCategoryUrl(cat.id),
        pairs: allCatPairs.map((p) => {
          const fromU = UNIT_MAP.get(p.fromUnitId);
          const toU = UNIT_MAP.get(p.toUnitId);
          return {
            slug: p.slug,
            href: getPairUrl(p),
            label:
              fromU && toU
                ? `${fromU.plural} to ${toU.plural}`
                : p.title.replace(" Converter", ""),
          };
        }),
      };
    });
  }, []);

  const filteredIndexableCategories = useMemo(() => {
    if (!normalizedQuery) return indexableCategoriesList;
    return indexableCategoriesList
      .map((cat) => {
        const catMatches =
          cat.name.toLowerCase().includes(normalizedQuery) ||
          cat.description.toLowerCase().includes(normalizedQuery);
        const matchingPairs = cat.pairs.filter(
          (p) =>
            p.label.toLowerCase().includes(normalizedQuery) ||
            p.slug.toLowerCase().includes(normalizedQuery)
        );
        return {
          ...cat,
          pairs: catMatches && matchingPairs.length === 0 ? cat.pairs : matchingPairs,
        };
      })
      .filter((cat) => cat.pairs.length > 0);
  }, [indexableCategoriesList, normalizedQuery]);

  const filteredPopularPairs = useMemo(() => {
    if (!normalizedQuery) return COMPETITOR_POPULAR_UNIT_PAIRS;
    return COMPETITOR_POPULAR_UNIT_PAIRS.filter(
      (p) =>
        p.label.toLowerCase().includes(normalizedQuery) ||
        p.slug.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  return (
    <div className="space-y-10">
      {/* =====================================================================
          1. FILTER SEARCH & SECTION JUMP BAR
         ===================================================================== */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Filter sitemap converters and unit pairs"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-950 text-xs sm:text-sm text-[#16324F] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear filter"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <a
              href="#indexable-categories"
              className="px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:text-[#0D9488] font-semibold transition-colors"
            >
              Core Categories (18)
            </a>
            <a
              href="#popular-unit-pairs"
              className="px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:text-[#0D9488] font-semibold transition-colors"
            >
              Popular Pairs
            </a>
            <a
              href="#unit-systems-guides"
              className="px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:text-[#0D9488] font-semibold transition-colors"
            >
              Unit Systems
            </a>
            <a
              href="#site-pages"
              className="px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:text-[#0D9488] font-semibold transition-colors"
            >
              Site &amp; Legal
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. INDEXABLE CATEGORIES & ALL CONVERTERS GROUPED BY CATEGORY
         ===================================================================== */}
      <section id="indexable-categories" className="space-y-6">
        {filteredIndexableCategories.map((cat) => (
          <div
            key={cat.id}
            id={`sitemap-category-${cat.id}`}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF]">
                  {ICON_MAP[cat.iconName] || <Ruler className="w-4 h-4" />}
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white">
                    <Link
                      href={cat.href}
                      prefetch={false}
                      className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cat.description}
                  </p>
                </div>
              </div>
              <Link
                href={cat.href}
                prefetch={false}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
              >
                <span>Open {cat.shortName} Hub ({cat.pairs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs sm:text-sm">
              {cat.pairs.map((pair) => (
                <li key={pair.slug} className="min-w-0">
                  <Link
                    href={pair.href}
                    prefetch={false}
                    className="px-3 py-2 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 hover:border-[#0D9488] text-slate-700 dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] font-semibold flex items-center justify-between gap-2 transition-colors"
                  >
                    <span className="truncate">{pair.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* =====================================================================
          3. POPULAR UNIT-TO-UNIT CONVERSIONS (COMPETITOR SITEMAP TREE)
         ===================================================================== */}
      {filteredPopularPairs.length > 0 && (
        <section
          id="popular-unit-pairs"
          aria-labelledby="popular-unit-pairs-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xs space-y-4 scroll-mt-24 overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div className="min-w-0">
              <h2
                id="popular-unit-pairs-heading"
                className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white"
              >
                Direct Unit-to-Unit Conversions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                High-frequency metric and imperial unit conversion calculators with formulas and reference tables.
              </p>
            </div>
            <Link
              href="/directory"
              prefetch={false}
              className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Browse All Pair Calculators</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs sm:text-sm">
            {filteredPopularPairs.map((pair) => {
              const pairObj = CATALOGUE_MAP.get(pair.slug);
              const pairHref = pairObj ? getPairUrl(pairObj) : `/length/${pair.slug}`;
              return (
                <li key={pair.slug} className="min-w-0">
                  <Link
                    href={pairHref}
                    prefetch={false}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 hover:border-[#0D9488] hover:text-[#0D9488] dark:hover:text-[#2DD4BF] font-semibold text-[#16324F] dark:text-slate-200 flex items-center justify-between gap-2 min-w-0 overflow-hidden transition-colors"
                  >
                    <span className="truncate min-w-0">{pair.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* =====================================================================
          4. COMMON UNIT SYSTEMS, MEASUREMENT GUIDES & PLATFORM PAGES
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Unit Systems & Measurement Guides */}
        <section
          id="unit-systems-guides"
          aria-labelledby="unit-systems-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xs space-y-4 scroll-mt-24 min-w-0 overflow-hidden"
        >
          <div className="flex items-start gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5 min-w-0">
            <BookOpen className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h2
                id="unit-systems-heading"
                className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white break-words"
              >
                Common Unit Systems &amp; Measurement Guides
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SI (International System of Units), Metric, Imperial, and US Customary reference documentation
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm">
            {GUIDES.map((guide) => (
              <li key={guide.slug} className="min-w-0">
                <Link
                  href={`/guides/${guide.slug}`}
                  prefetch={false}
                  className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 hover:border-[#0D9488] flex items-center justify-between gap-2 min-w-0 font-semibold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
                >
                  <span className="break-words min-w-0">{guide.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Core Platform, Developer Tools & Legal Pages */}
        <section
          id="site-pages"
          aria-labelledby="site-pages-heading"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xs space-y-4 scroll-mt-24 min-w-0 overflow-hidden"
        >
          <div className="flex items-start gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5 min-w-0">
            <Globe className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h2
                id="site-pages-heading"
                className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white break-words"
              >
                Platform Tools, Widgets &amp; Legal Pages
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct navigation to core site directories, embeddable calculator widgets, and legal documentation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
            {[
              {
                href: "/",
                label: "Home — Universal Converter",
                badge: "Core",
                icon: <Globe className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/directory",
                label: "All Converters Directory (A–Z)",
                badge: "Directory",
                icon: <Layers className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/case-converter",
                label: "Text Case Converter Tool",
                badge: "Utility",
                icon: <Type className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/widgets",
                label: "Embeddable Calculator Widgets",
                badge: "Widgets",
                icon: <Code2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/chrome-extension",
                label: "Chrome Extension (Toolbar Calculator)",
                badge: "Extension",
                icon: <Sparkles className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/about",
                label: "About UnitConvertersGo",
                badge: "Company",
                icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/contact",
                label: "Contact & Feedback",
                badge: "Support",
                icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/privacy-policy",
                label: "Privacy Policy",
                badge: "Legal",
                icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/terms-of-use",
                label: "Terms of Use",
                badge: "Legal",
                icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/disclaimer",
                label: "Disclaimer",
                badge: "Legal",
                icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
              {
                href: "/cookie-policy",
                label: "Cookie Policy",
                badge: "Legal",
                icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
              },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                prefetch={false}
                className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 hover:border-[#0D9488] flex items-center justify-between gap-2 min-w-0 overflow-hidden font-semibold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0 flex-1">
                  {page.icon}
                  <span className="truncate min-w-0">{page.label}</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-slate-500 shrink-0">
                  {page.badge}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* =====================================================================
          5. COLLAPSED "MORE CATEGORIES" SECTION FOR NON-INDEXABLE CATEGORIES
         ===================================================================== */}
      <details className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <summary className="list-none cursor-pointer px-5 sm:px-7 py-4 flex items-center justify-between gap-3 hover:bg-[#F7F9FC] dark:hover:bg-slate-800/60 transition-colors">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
              More categories ({nonIndexableCategoriesList.length} specialized engineering &amp; science categories)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Expand to view specialized thermal, fluid, electromagnetic, radiation, and photometry categories and converters
            </p>
          </div>
          <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0" />
        </summary>
        <div className="p-5 sm:p-7 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nonIndexableCategoriesList.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC]/60 dark:bg-slate-950/60 p-4 space-y-2.5"
            >
              <Link
                href={cat.href}
                prefetch={false}
                className="text-sm font-extrabold text-[#16324F] dark:text-white hover:text-[#0D9488] dark:hover:text-[#2DD4BF] flex items-center justify-between gap-2"
              >
                <span>{cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
              </Link>
              {cat.pairs.length > 0 && (
                <ul className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
                  {cat.pairs.map((pair) => (
                    <li key={pair.slug}>
                      <Link
                        href={pair.href}
                        prefetch={false}
                        className="text-slate-600 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] hover:underline block py-0.5 truncate"
                      >
                        {pair.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
