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
} from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_MAP,
  UNIT_MAP,
  getUnitsByCategory,
} from "@/lib/conversions/units";
import { SUPER_CATEGORIES } from "@/lib/conversions/extended-categories";
import {
  CONVERSION_CATALOGUE,
  CATALOGUE_MAP,
  getConversionsByCategory,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
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
  { slug: "nm-to-ft-lb", label: "Nm to ft-lb" },
  { slug: "ft-lb-to-nm", label: "ft-lb to Nm" },
  { slug: "kj-to-kcal", label: "kJ to kcal" },
  { slug: "kcal-to-kj", label: "kcal to kJ" },
  { slug: "gb-to-mb", label: "GB to MB" },
  { slug: "mb-to-gb", label: "MB to GB" },
  { slug: "mpg-to-l-100km", label: "MPG to L/100km" },
  { slug: "l-100km-to-mpg", label: "L/100km to MPG" },
];

export default function SitemapDirectoryClient() {
  const [query, setQuery] = useState("");
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("all");
  const { placeholder } = useTypewriterPlaceholder({
    isPaused: query.trim().length > 0,
    prefix: `Filter ${CATEGORIES.length} categories & ${CONVERSION_CATALOGUE.length} converters — e.g. `,
  });

  const normalizedQuery = query.trim().toLowerCase();

  // Enrich each super-category with its resolved category objects, unit counts, and top pairs
  const superCategoryTree = useMemo(() => {
    return SUPER_CATEGORIES.map((group) => {
      const items = group.categoryIds
        .map((catId) => {
          const cat = CATEGORY_MAP.get(catId);
          if (!cat) return null;
          const units = getUnitsByCategory(cat.id);
          const allCatPairs = getConversionsByCategory(cat.id);
          const topPairs = (
            cat.popularPairSlugs.length > 0
              ? cat.popularPairSlugs
                  .map((s) => CATALOGUE_MAP.get(s))
                  .filter((p): p is NonNullable<typeof p> => Boolean(p))
              : allCatPairs
          ).slice(0, 4);

          return {
            id: cat.id,
            name: `${cat.name} Converter`,
            shortName: cat.name,
            href: getCategoryUrl(cat.id),
            description: cat.description,
            iconName: cat.iconName,
            unitCount: units.length,
            unitPreview: units
              .slice(0, 5)
              .map((u) => u.symbol)
              .join(", "),
            topPairs: topPairs.map((p) => {
              const fromU = UNIT_MAP.get(p.fromUnitId);
              const toU = UNIT_MAP.get(p.toUnitId);
              return {
                slug: p.slug,
                href: getPairUrl(p),
                label:
                  fromU && toU
                    ? `${fromU.name.replace(/\s+\([^)]*\)/g, "")} to ${toU.name.replace(/\s+\([^)]*\)/g, "")}`
                    : (p.h1 || p.title).replace(" Converter", ""),
              };
            }),
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      // Include Case Converter under Common Converters just like unitconverters.net/sitemap.php
      if (group.id === "common") {
        items.push({
          id: "case_converter",
          name: "Case Converter",
          shortName: "Case Converter",
          href: "/case-converter",
          description:
            "Convert text between Sentence case, UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
          iconName: "Type",
          unitCount: 12,
          unitPreview: "UPPER, lower, Title, camelCase, snake_case",
          topPairs: [],
        });
      }

      return {
        ...group,
        items,
      };
    });
  }, []);

  // Filtered super-category tree based on search query and selected group pill
  const filteredTree = useMemo(() => {
    return superCategoryTree
      .filter(
        (group) =>
          activeGroupFilter === "all" || group.id === activeGroupFilter
      )
      .map((group) => {
        if (!normalizedQuery) return group;
        const matchingItems = group.items.filter((item) => {
          const inName = item.name.toLowerCase().includes(normalizedQuery);
          const inDesc = item.description.toLowerCase().includes(normalizedQuery);
          const inUnits = item.unitPreview.toLowerCase().includes(normalizedQuery);
          const inPairs = item.topPairs.some(
            (p) =>
              p.label.toLowerCase().includes(normalizedQuery) ||
              p.slug.toLowerCase().includes(normalizedQuery)
          );
          return inName || inDesc || inUnits || inPairs;
        });
        return {
          ...group,
          items: matchingItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [superCategoryTree, activeGroupFilter, normalizedQuery]);

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
          1.STICKY FILTER SEARCH & 9 SUPER-CATEGORY JUMP BAR
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
              href="#popular-unit-pairs"
              className="px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:text-[#0D9488] font-semibold transition-colors"
            >
              Unit-to-Unit Pairs
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

        {/* Super-Category Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter by Converter Super-Category"
          className="flex flex-wrap items-center gap-1.5 pt-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeGroupFilter === "all"}
            onClick={() => setActiveGroupFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGroupFilter === "all"
                ? "bg-[#16324F] dark:bg-[#0D9488] text-white shadow-2xs"
                : "bg-[#F7F9FC] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#0D9488] border border-slate-200/80 dark:border-slate-700"
            }`}
          >
            All 9 Converter Groups ({superCategoryTree.reduce((sum, g) => sum + g.items.length, 0)})
          </button>

          {superCategoryTree.map((group) => {
            const isSelected = activeGroupFilter === group.id;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveGroupFilter(group.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#0D9488] text-white border-[#0D9488] shadow-2xs"
                    : "bg-[#F7F9FC] dark:bg-slate-800/80 text-[#16324F] dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-[#0D9488]"
                }`}
              >
                <span>{group.shortName}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {group.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. MULTI-COLUMN SUPER-CATEGORY TREE (ALL 9 CONVERTER GROUPS)
         ===================================================================== */}
      {filteredTree.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-3">
          <p className="text-sm font-bold text-[#16324F] dark:text-white">
            No converters matched &ldquo;{query}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveGroupFilter("all");
            }}
            className="px-4 py-2 rounded-xl bg-[#0D9488] text-white text-xs font-bold cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredTree.map((group) => (
            <section
              key={group.id}
              id={`group-${group.id}`}
              aria-labelledby={`heading-${group.id}`}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs scroll-mt-24"
            >
              {/* Group Header */}
              <div
                className={`px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r ${group.headerBgClass} flex flex-wrap items-center justify-between gap-3`}
              >
                <div className="space-y-1 max-w-3xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border shrink-0 ${group.badgeClass}`}
                    >
                      {ICON_MAP[group.iconName] || <Ruler className="w-4 h-4" />}
                    </span>
                    <h2
                      id={`heading-${group.id}`}
                      className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16324F] dark:text-white break-words"
                    >
                      {group.name}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold border shrink-0 ${group.badgeClass}`}
                    >
                      {group.items.length} Converters
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>

              {/* Multi-Column Tree Grid of Converters in this Super-Category */}
              <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC]/60 dark:bg-slate-950/60 hover:border-[#0D9488]/70 transition-all p-4 flex flex-col justify-between gap-3 min-w-0 overflow-hidden"
                  >
                    <div className="space-y-2 min-w-0">
                      {/* Primary Category Converter Link */}
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="group/title flex items-start gap-2 min-w-0 flex-1 text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors leading-snug"
                        >
                          <span className="text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5">
                            {ICON_MAP[item.iconName] || (
                              <Ruler className="w-4 h-4" />
                            )}
                          </span>
                          <span className="break-words min-w-0">{item.name}</span>
                        </Link>
                        <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
                          {item.unitCount} units
                        </span>
                      </div>

                      {/* Supported Symbols Preview */}
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 break-words line-clamp-2 leading-relaxed">
                        Units: {item.unitPreview}
                      </div>

                      {/* Nested Popular Unit-to-Unit Pairs Tree */}
                      {item.topPairs.length > 0 && (
                        <ul className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1 text-xs min-w-0">
                          {item.topPairs.map((pair) => (
                            <li key={pair.slug} className="min-w-0">
                              <Link
                                href={pair.href}
                                prefetch={false}
                                className="flex items-center gap-1.5 min-w-0 w-full text-slate-600 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors py-0.5"
                              >
                                <ChevronRight className="w-3 h-3 text-[#0D9488] shrink-0" />
                                <span className="truncate min-w-0">{pair.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs min-w-0">
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline flex items-center gap-1 min-w-0 max-w-full"
                      >
                        <span className="truncate">Open {item.shortName} Calculator</span>
                        <ArrowRight className="w-3 h-3 shrink-0" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

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
    </div>
  );
}
