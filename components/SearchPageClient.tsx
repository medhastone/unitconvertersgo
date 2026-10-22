"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  ChevronRight,
  Flame,
  Lightbulb,
  ListFilter,
  CheckCircle2,
  FileQuestion,
  Ruler,
  Scale,
  Thermometer,
  Beaker,
  Square,
  Gauge,
  CornerDownLeft,
  Sparkles,
} from "lucide-react";
import { CATEGORIES, CATEGORY_MAP, UNITS } from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { ConversionPairInfo, Category, Unit } from "@/lib/conversions/types";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";

interface SearchResultsGrouped {
  directConversions: ConversionPairInfo[];
  categories: Category[];
  units: Unit[];
  relatedConverters: ConversionPairInfo[];
}

const POPULAR_SEARCH_PRESETS = [
  { label: "cm to inches", category: "Length", href: "/length/cm-to-inches", icon: Ruler, iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
  { label: "kg to lbs", category: "Weight", href: "/weight-and-mass/kg-to-lbs", icon: Scale, iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" },
  { label: "Celsius to Fahrenheit", category: "Temperature", href: "/temperature/celsius-to-fahrenheit", icon: Thermometer, iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400" },
  { label: "liters to gallons", category: "Volume", href: "/volume/liters-to-gallons", icon: Beaker, iconBg: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400" },
  { label: "miles to kilometers", category: "Length", href: "/length/miles-to-km", icon: Gauge, iconBg: "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400" },
  { label: "square feet to square meters", category: "Area", href: "/area/sq-feet-to-sq-meters", icon: Square, iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" },
];

export default function SearchPageClient() {
  const router = useRouter();
  const [mainQuery, setMainQuery] = useState("");
  const [activeViewMode, setActiveViewMode] = useState<"showcase" | "live">("showcase");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // States for the 3 visual showcase columns
  const [showcaseInput1, setShowcaseInput1] = useState("cm");
  const [showcaseInput2, setShowcaseInput2] = useState("kg to lbs");
  const [showcaseInput3, setShowcaseInput3] = useState("xyz unit");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const { placeholder } = useTypewriterPlaceholder({
    isPaused: mainQuery.trim().length > 0,
    prefix: "Try: ",
  });

  // Instant local search function for any query string
  const performSearch = (qStr: string): SearchResultsGrouped => {
    const q = qStr.trim().toLowerCase();
    if (!q) {
      return {
        directConversions: [],
        categories: [],
        units: [],
        relatedConverters: [],
      };
    }

    // 1. Direct Conversions: match slug, title, keywords, or from/to unit names
    const directMatches = CONVERSION_CATALOGUE.filter((item) => {
      const matchSlug = item.slug.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchKeyword =
        (item.primaryKeyword && item.primaryKeyword.toLowerCase().includes(q)) ||
        (item.relatedKeywords && item.relatedKeywords.some((k) => k.toLowerCase().includes(q))) ||
        (item.aliases && item.aliases.some((a) => a.toLowerCase().includes(q)));
      const matchFromTo =
        item.fromUnitId.toLowerCase().includes(q) && item.toUnitId.toLowerCase().includes(q);

      return matchSlug || matchTitle || matchKeyword || matchFromTo;
    }).slice(0, 4);

    // 2. Categories
    const catMatches = CATEGORIES.filter((cat) => {
      return (
        cat.id.toLowerCase().includes(q) ||
        cat.name.toLowerCase().includes(q) ||
        cat.pluralName.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
      );
    }).slice(0, 3);

    // 3. Units
    const unitMatches = UNITS.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) ||
        u.plural.toLowerCase().includes(q) ||
        u.symbol.toLowerCase() === q ||
        u.symbol.toLowerCase().includes(q) ||
        (u.description && u.description.toLowerCase().includes(q))
      );
    }).slice(0, 3);

    // 4. Related Converters: other converters sharing the category of the top direct match or matching words
    const topCategory = directMatches[0]?.categoryId || (catMatches[0] ? catMatches[0].id : null);
    const relatedMatches = topCategory
      ? CONVERSION_CATALOGUE.filter(
          (item) => item.categoryId === topCategory && !directMatches.some((d) => d.slug === item.slug)
        ).slice(0, 4)
      : CONVERSION_CATALOGUE.filter((item) => {
          return (
            !directMatches.some((d) => d.slug === item.slug) &&
            (item.fromUnitId.includes(q) || item.toUnitId.includes(q))
          );
        }).slice(0, 4);

    return {
      directConversions: directMatches,
      categories: catMatches,
      units: unitMatches,
      relatedConverters: relatedMatches,
    };
  };

  // Live search results for the main search bar
  const liveResults = useMemo(() => performSearch(mainQuery), [mainQuery]);

  // Results for column 2 ("kg to lbs")
  const column2Results = useMemo(() => performSearch(showcaseInput2), [showcaseInput2]);

  // Suggestions for column 1 ("cm")
  const column1Suggestions = useMemo(() => {
    const q = showcaseInput1.trim().toLowerCase();
    if (!q) return CONVERSION_CATALOGUE.slice(0, 6);
    return CONVERSION_CATALOGUE.filter((item) => {
      return (
        item.slug.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.fromUnitId.includes(q) ||
        item.toUnitId.includes(q)
      );
    }).slice(0, 6);
  }, [showcaseInput1]);

  // Results for column 3 ("xyz unit")
  const column3Results = useMemo(() => performSearch(showcaseInput3), [showcaseInput3]);

  // Total count of matches for the live search
  const totalLiveMatches =
    liveResults.directConversions.length +
    liveResults.categories.length +
    liveResults.units.length +
    liveResults.relatedConverters.length;

  const handleSelectPreset = (presetText: string) => {
    setMainQuery(presetText);
    setActiveViewMode("live");
    mainInputRef.current?.focus();
  };

  // Keyboard navigation for live search
  const flattenedLiveItems = useMemo(() => {
    const items: { href: string; label: string }[] = [];
    liveResults.directConversions.forEach((p) => items.push({ href: getPairUrl(p), label: p.title }));
    liveResults.categories.forEach((c) => items.push({ href: getCategoryUrl(c.id), label: c.name }));
    liveResults.units.forEach((u) => {
      const parentCat = CATEGORY_MAP.get(u.categoryId);
      items.push({ href: getCategoryUrl(parentCat?.id || "length"), label: u.name });
    });
    liveResults.relatedConverters.forEach((p) => items.push({ href: getPairUrl(p), label: p.title }));
    return items;
  }, [liveResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeViewMode !== "live" || flattenedLiveItems.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flattenedLiveItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flattenedLiveItems.length) % flattenedLiveItems.length);
      } else if (e.key === "Enter" && flattenedLiveItems[selectedIndex]) {
        e.preventDefault();
        router.push(flattenedLiveItems[selectedIndex].href);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeViewMode, flattenedLiveItems, selectedIndex, router]);

  return (
    <div className="w-full bg-[#F7F9FC]/60 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* ===================================================================
            HERO SEARCH SECTION: Decorative Badges + Main Heading + Large Input
            =================================================================== */}
        <div className="relative pt-4 pb-6 flex flex-col items-center text-center">
          {/* Decorative Floating Badges around the Hero (Desktop) */}
          <div className="hidden lg:block absolute left-4 top-8 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm shadow-slate-900/[0.04] text-center w-24 transform -rotate-3 transition-transform hover:rotate-0">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <Ruler className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#16324F] dark:text-slate-200">Length</span>
          </div>

          <div className="hidden lg:block absolute left-28 top-20 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm shadow-slate-900/[0.04] text-center w-24 transform rotate-2 transition-transform hover:rotate-0">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#16324F] dark:text-slate-200">Weight</span>
          </div>

          <div className="hidden lg:block absolute right-28 top-20 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm shadow-slate-900/[0.04] text-center w-24 transform -rotate-2 transition-transform hover:rotate-0">
            <div className="w-10 h-10 mx-auto rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center mb-1">
              <Beaker className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#16324F] dark:text-slate-200">Volume</span>
          </div>

          <div className="hidden lg:block absolute right-4 top-8 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm shadow-slate-900/[0.04] text-center w-28 transform rotate-3 transition-transform hover:rotate-0">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#16324F] dark:text-slate-200">Temperature</span>
          </div>

          {/* Main Headings */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#16324F] dark:text-white mb-3">
            Find the Right <span className="text-[#0D9488] dark:text-[#2DD4BF]">Converter</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mb-8">
            Search by unit name, category or conversion. Get instant results.
          </p>

          {/* Large Hero Search Input Field */}
          <div className="w-full max-w-3xl relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 sm:left-5 pointer-events-none" />
              <input
                ref={mainInputRef}
                type="text"
                value={mainQuery}
                onChange={(e) => {
                  setMainQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setActiveViewMode("live");
                  }
                }}
                placeholder={placeholder}
                className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-700 focus:border-[#0D9488] dark:focus:border-[#2DD4BF] focus:outline-hidden text-base sm:text-lg font-semibold text-[#16324F] dark:text-white shadow-lg shadow-slate-900/[0.04] transition-all"
              />
              {mainQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setMainQuery("");
                    mainInputRef.current?.focus();
                  }}
                  className="absolute right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Popular Searches Quick Pill Row */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Try these popular searches:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {POPULAR_SEARCH_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset.label)}
                    className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488] text-xs font-semibold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] shadow-2xs transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive View Mode Switcher Toggle */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="p-1 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 inline-flex text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveViewMode("showcase")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeViewMode === "showcase"
                      ? "bg-white dark:bg-slate-900 text-[#16324F] dark:text-white shadow-2xs"
                      : "text-slate-500 hover:text-[#16324F]"
                  }`}
                >
                  UI States Showcase (3 Columns)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveViewMode("live");
                    if (!mainQuery) setMainQuery("kg to lbs");
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeViewMode === "live"
                      ? "bg-white dark:bg-slate-900 text-[#16324F] dark:text-white shadow-2xs"
                      : "text-slate-500 hover:text-[#16324F]"
                  }`}
                >
                  Live Interactive Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            VIEW 1: 3-COLUMN SHOWCASE (Matching Unit Converter Search Interface.png)
            =================================================================== */}
        {activeViewMode === "showcase" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* -------------------------------------------------------------
                COLUMN 1: Search Suggestions (State 1)
                ------------------------------------------------------------- */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm shadow-slate-900/[0.03] space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#16324F] dark:text-white">
                    Search Suggestions
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Start typing to see instant suggestions.
                  </p>
                </div>
              </div>

              {/* Column 1 Search Input */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={showcaseInput1}
                  onChange={(e) => setShowcaseInput1(e.target.value)}
                  placeholder="Type a unit or query..."
                  className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 text-sm font-semibold text-[#16324F] dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#0D9488] focus:outline-hidden transition-all"
                />
                {showcaseInput1 && (
                  <button
                    type="button"
                    onClick={() => setShowcaseInput1("")}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                    aria-label="Clear suggestions input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions List */}
              <div className="space-y-2">
                {column1Suggestions.map((pair, idx) => {
                  const isKeyboardSelected = idx === selectedSuggestionIndex;
                  const category = CATEGORY_MAP.get(pair.categoryId);
                  const fromUnit = pair.fromUnitId;
                  const toUnit = pair.toUnitId;

                  return (
                    <Link
                      key={`col1-${pair.slug}-${idx}`}
                      href={getPairUrl(pair)}
                      onClick={() => setSelectedSuggestionIndex(idx)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all group ${
                        isKeyboardSelected
                          ? "bg-[#E6FAF8] dark:bg-teal-950/40 border-[#0D9488] shadow-2xs font-extrabold"
                          : "bg-white dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:border-[#0D9488]/60 hover:bg-[#F7F9FC]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isKeyboardSelected
                              ? "bg-[#0D9488] text-white"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                          }`}
                        >
                          <Ruler className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white truncate">
                            {fromUnit} to {toUnit}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {pair.title.replace(/\s*\(.*?\)\s*/g, "")}
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-[#F7F9FC] dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shrink-0">
                        {category?.name || "Length"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* -------------------------------------------------------------
                COLUMN 2: Search Results (State 2 — "kg to lbs")
                ------------------------------------------------------------- */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm shadow-slate-900/[0.03] space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
                  <ListFilter className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#16324F] dark:text-white">
                    Search Results
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Results for &ldquo;{showcaseInput2}&rdquo;
                  </p>
                </div>
              </div>

              {/* Column 2 Search Input */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={showcaseInput2}
                  onChange={(e) => setShowcaseInput2(e.target.value)}
                  placeholder="Search a unit, category, or conversion..."
                  className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 text-sm font-semibold text-[#16324F] dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#0D9488] focus:outline-hidden transition-all"
                />
                {showcaseInput2 && (
                  <button
                    type="button"
                    onClick={() => setShowcaseInput2("")}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                    aria-label="Clear results input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 4 Organised Result Groups */}
              <div className="space-y-4">
                {/* 1. Direct Conversions */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Direct Conversions
                  </span>
                  <div className="space-y-2">
                    <Link
                      href="/weight-and-mass/kg-to-lbs"
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:bg-[#F7F9FC] flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          kg
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                            Kilograms to Pounds
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Convert kilograms (kg) to pounds (lbs) quickly and accurately.
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold shrink-0">
                        Weight
                      </span>
                    </Link>

                    <Link
                      href="/weight-and-mass/lbs-to-kg"
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:bg-[#F7F9FC] flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          lb
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                            Pounds to Kilograms
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Convert pounds (lbs) to kilograms (kg).
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold shrink-0">
                        Weight
                      </span>
                    </Link>
                  </div>
                </div>

                {/* 2. Categories */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Categories
                  </span>
                  <Link
                    href="/weight-and-mass"
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:bg-[#F7F9FC] flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        kg
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                          Weight &amp; Mass Converter
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Convert between all weight and mass units.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Category
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488]" />
                    </div>
                  </Link>
                </div>

                {/* 3. Units */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Units
                  </span>
                  <div className="space-y-2">
                    <Link
                      href="/weight-and-mass"
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:bg-[#F7F9FC] flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          kg
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                            Kilogram (kg)
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            SI unit of mass.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          Unit
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488]" />
                      </div>
                    </Link>

                    <Link
                      href="/weight-and-mass"
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:bg-[#F7F9FC] flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          lb
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                            Pound (lb)
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Imperial unit of mass.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          Unit
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488]" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* 4. Related Converters */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Related Converters
                  </span>
                  <div className="space-y-2">
                    <Link
                      href="/weight-and-mass/ounces-to-grams"
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:bg-[#F7F9FC] flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center shrink-0">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                            Ounces to Grams
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Convert ounces to grams.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                          Weight
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488]" />
                      </div>
                    </Link>

                    <Link
                      href="/weight-and-mass/grams-to-ounces"
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:bg-[#F7F9FC] flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                            Grams to Ounces
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Convert grams to ounces.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                          Weight
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488]" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                COLUMN 3: No Results Found (State 3 — "xyz unit")
                ------------------------------------------------------------- */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm shadow-slate-900/[0.03] space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileQuestion className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#16324F] dark:text-white">
                    No Results Found
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We couldn&rsquo;t find any matching converter.
                  </p>
                </div>
              </div>

              {/* Column 3 Search Input */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={showcaseInput3}
                  onChange={(e) => setShowcaseInput3(e.target.value)}
                  placeholder="Type an unknown query..."
                  className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 text-sm font-semibold text-[#16324F] dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#0D9488] focus:outline-hidden transition-all"
                />
                {showcaseInput3 && (
                  <button
                    type="button"
                    onClick={() => setShowcaseInput3("")}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                    aria-label="Clear no-results input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Friendly Empty State Graphic */}
              <div className="py-6 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full bg-[#E6FAF8] dark:bg-teal-950/60 flex items-center justify-center text-slate-500">
                    <Search className="w-9 h-9 stroke-[2.2]" />
                  </div>
                  {/* Subtle radiating accent dashes */}
                  <span className="absolute -top-1 left-3 w-1.5 h-3 bg-[#0D9488] rounded-full rotate-[-20deg]" />
                  <span className="absolute -top-1 right-3 w-1.5 h-3 bg-[#0D9488] rounded-full rotate-[20deg]" />
                  <span className="absolute top-8 -left-2 w-3 h-1.5 bg-[#0D9488] rounded-full" />
                  <span className="absolute top-8 -right-2 w-3 h-1.5 bg-[#0D9488] rounded-full" />
                  <span className="absolute -bottom-1 right-2 w-1.5 h-3 bg-[#0D9488] rounded-full rotate-[-45deg]" />
                </div>

                <h3 className="text-base font-extrabold text-[#16324F] dark:text-white mb-1">
                  No converter found.
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  Try another unit name or symbol.
                </p>
              </div>

              {/* Search Tips Box */}
              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#16324F] dark:text-white">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Lightbulb className="w-3 h-3" />
                  </div>
                  <span>Search Tips:</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-5 list-disc">
                  <li>Check the spelling of the unit name</li>
                  <li>Try a more general keyword (e.g. &ldquo;length&rdquo;, &ldquo;weight&rdquo;)</li>
                  <li>Use common abbreviations (e.g. cm, kg, lbs)</li>
                  <li>Search for a conversion (e.g. &ldquo;cm to inches&rdquo;)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 2: LIVE FULL-WIDTH ORGANIZED SEARCH RESULTS
            =================================================================== */}
        {activeViewMode === "live" && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white">
                  {mainQuery ? `Results for "${mainQuery}"` : "All Conversion Tools"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalLiveMatches > 0
                    ? `Found ${totalLiveMatches} matching conversion resources.`
                    : "No matching results found."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Navigate with ↑ ↓ and Enter
                </span>
                {mainQuery && (
                  <button
                    type="button"
                    onClick={() => setMainQuery("")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F7F9FC] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {totalLiveMatches > 0 ? (
              <div className="space-y-6">
                {/* 1. Direct Conversions */}
                {liveResults.directConversions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span>Direct Conversions</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {liveResults.directConversions.map((pair, idx) => (
                        <Link
                          key={`live-direct-${pair.slug}-${idx}`}
                          href={getPairUrl(pair)}
                          className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC]/60 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-900 hover:border-[#0D9488] hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                              {pair.title.replace(" Converter", "")}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {pair.formulaDescription || `Instant ${pair.slug.replace(/-/g, " ")} conversion.`}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0">
                            {CATEGORY_MAP.get(pair.categoryId)?.name || "Converter"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Categories */}
                {liveResults.categories.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Categories
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {liveResults.categories.map((cat, idx) => (
                        <Link
                          key={`live-cat-${cat.id}-${idx}`}
                          href={getCategoryUrl(cat.id)}
                          className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                              {cat.name} Converter
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {cat.description}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Units */}
                {liveResults.units.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Units
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {liveResults.units.map((u, idx) => {
                        const parentCat = CATEGORY_MAP.get(u.categoryId);
                        return (
                          <Link
                            key={`live-unit-${u.id}-${idx}`}
                            href={getCategoryUrl(parentCat?.id || "length")}
                            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                                {u.name} ({u.symbol})
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {u.description || `${parentCat?.name || "Measurement"} unit`}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                              Unit
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Related Converters */}
                {liveResults.relatedConverters.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Related Converters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {liveResults.relatedConverters.map((pair, idx) => (
                        <Link
                          key={`live-related-${pair.slug}-${idx}`}
                          href={getPairUrl(pair)}
                          className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#0D9488] hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                              {pair.title.replace(" Converter", "")}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {pair.formulaDescription || `Fast precision conversion.`}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Live Empty State */
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#E6FAF8] dark:bg-teal-950/60 flex items-center justify-center text-[#0D9488] mb-3">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white mb-1">
                  No converter found.
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  Try another unit name or symbol, or select from one of our popular converters below.
                </p>
                <div className="p-5 max-w-md w-full rounded-2xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#16324F] dark:text-white">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>Search Tips:</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-5 list-disc">
                    <li>Check the spelling of the unit name</li>
                    <li>Try a more general keyword (e.g. &ldquo;length&rdquo;, &ldquo;weight&rdquo;)</li>
                    <li>Use common abbreviations (e.g. cm, kg, lbs)</li>
                    <li>Search for a conversion (e.g. &ldquo;cm to inches&rdquo;)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            POPULAR SEARCHES (Bottom 6-Card Responsive Grid)
            =================================================================== */}
        <section aria-labelledby="popular-searches-heading" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-400 shrink-0" />
            <div>
              <h2
                id="popular-searches-heading"
                className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white"
              >
                Popular Searches
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick access to commonly searched conversions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {POPULAR_SEARCH_PRESETS.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0D9488] hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] transition-colors truncate">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
