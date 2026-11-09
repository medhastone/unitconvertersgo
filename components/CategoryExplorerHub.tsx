"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
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
  ChevronDown,
} from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_MAP,
  getUnitsByCategory,
} from "@/lib/conversions/units";
import { Category } from "@/lib/conversions/types";
import { getCategoryUrl } from "@/lib/conversions/url";
import { isIndexableCategory } from "@/lib/seo-config";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";

const ICON_MAP: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-3.5 h-3.5" />,
  Scale: <Scale className="w-3.5 h-3.5" />,
  Thermometer: <Thermometer className="w-3.5 h-3.5" />,
  Square: <Square className="w-3.5 h-3.5" />,
  Beaker: <Beaker className="w-3.5 h-3.5" />,
  Gauge: <Gauge className="w-3.5 h-3.5" />,
  Clock: <Clock className="w-3.5 h-3.5" />,
  CircleDot: <CircleDot className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  Activity: <Activity className="w-3.5 h-3.5" />,
  HardDrive: <HardDrive className="w-3.5 h-3.5" />,
  ArrowDownUp: <ArrowDownUp className="w-3.5 h-3.5" />,
  Flame: <Flame className="w-3.5 h-3.5" />,
  Layers: <Layers className="w-3.5 h-3.5" />,
  RotateCw: <RotateCw className="w-3.5 h-3.5" />,
  Radio: <Radio className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
  Fuel: <Fuel className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
};

interface CategoryExplorerHubProps {
  currentCategoryId?: string;
}

export default function CategoryExplorerHub({
  currentCategoryId,
}: CategoryExplorerHubProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { placeholder } = useTypewriterPlaceholder({
    isPaused: searchQuery.trim().length > 0,
    prefix: "Filter: ",
  });

  // Precompute unit counts per category once
  const unitCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const cat of CATEGORIES) {
      map.set(cat.id, getUnitsByCategory(cat.id).length);
    }
    return map;
  }, []);

  const indexableCategories = useMemo(() => {
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
    return orderedIds
      .map((id) => CATEGORY_MAP.get(id))
      .filter((c): c is Category => Boolean(c && isIndexableCategory(c.id)));
  }, []);

  const nonIndexableCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => !isIndexableCategory(cat.id));
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(normalizedQuery) ||
        cat.pluralName.toLowerCase().includes(normalizedQuery) ||
        cat.description.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const renderCategoryLink = (cat: Category) => {
    const isCurrent = cat.id === currentCategoryId;
    const count = unitCounts.get(cat.id) ?? 0;

    return (
      <Link
        key={cat.id}
        href={getCategoryUrl(cat.id)}
        prefetch={false}
        aria-current={isCurrent ? "page" : undefined}
        className={`group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
          isCurrent
            ? "bg-[#0D9488]/8 dark:bg-[#0D9488]/15 border-[#0D9488] text-[#16324F] dark:text-white"
            : "bg-[#F7F9FC]/80 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-[#0D9488] text-[#16324F] dark:text-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`shrink-0 transition-colors ${
              isCurrent
                ? "text-[#0D9488] dark:text-[#2DD4BF]"
                : "text-slate-400 dark:text-slate-500 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF]"
            }`}
          >
            {ICON_MAP[cat.iconName] || <Layers className="w-3.5 h-3.5" />}
          </span>
          <div className="min-w-0">
            <div
              className={`text-sm font-bold truncate transition-colors ${
                isCurrent
                  ? "text-[#0D9488] dark:text-[#2DD4BF]"
                  : "group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF]"
              }`}
            >
              {cat.name} Converter
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              <span className="font-mono tabular-nums">{count} units</span>
              {isCurrent && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                    Current
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <span
          aria-hidden="true"
          className={`text-sm font-sans font-bold shrink-0 transition-transform group-hover:translate-x-0.5 ${
            isCurrent
              ? "text-[#0D9488] dark:text-[#2DD4BF]"
              : "text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF]"
          }`}
        >
          →
        </span>
      </Link>
    );
  };

  return (
    <section
      suppressHydrationWarning
      aria-label="Browse Core Measurement Categories"
      className="cv-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5 shadow-2xs"
    >
      {/* Top Header & Instant Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
              Measurement Navigator
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              18 Core Categories
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white">
            Browse Measurement Categories
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div suppressHydrationWarning className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              suppressHydrationWarning
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Filter measurement categories"
              className="w-full pl-9 pr-8 py-2 rounded-xl text-sm font-medium bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white placeholder:text-slate-400 border border-slate-200/90 dark:border-slate-800 focus:outline-none focus:border-[#0D9488] transition-colors truncate"
            />
            {searchQuery && (
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear category search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm font-bold shrink-0">
            <Link
              href="/directory"
              prefetch={false}
              className="text-[#0D9488] dark:text-[#2DD4BF] hover:underline whitespace-nowrap"
            >
              A–Z Directory →
            </Link>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
              /
            </span>
            <Link
              href="/sitemap"
              prefetch={false}
              className="text-slate-600 dark:text-slate-400 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] hover:underline whitespace-nowrap"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {normalizedQuery ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {searchResults.map((category) => renderCategoryLink(category))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {indexableCategories.map((cat) => renderCategoryLink(cat))}
            <Link
              href="/cooking"
              prefetch={false}
              className="group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border bg-[#F7F9FC]/80 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-[#0D9488] text-[#16324F] dark:text-slate-200 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 text-slate-400 group-hover:text-[#0D9488]">
                  <Scale className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate group-hover:text-[#0D9488]">
                    Cooking Converter
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    12 ingredients
                  </div>
                </div>
              </div>
              <span aria-hidden="true" className="text-sm font-bold text-slate-400 group-hover:text-[#0D9488]">
                →
              </span>
            </Link>
            <Link
              href="/specialty"
              prefetch={false}
              className="group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border bg-[#F7F9FC]/80 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-[#0D9488] text-[#16324F] dark:text-slate-200 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 text-slate-400 group-hover:text-[#0D9488]">
                  <Fuel className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate group-hover:text-[#0D9488]">
                    Specialty &amp; Fuel
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    MPG, DPI, molar &amp; radiation
                  </div>
                </div>
              </div>
              <span aria-hidden="true" className="text-sm font-bold text-slate-400 group-hover:text-[#0D9488]">
                →
              </span>
            </Link>
          </div>

          <details className="group rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC]/50 dark:bg-slate-950/40 overflow-hidden">
            <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#0D9488]">
              <span>More categories ({nonIndexableCategories.length} specialized engineering &amp; science converters)</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="p-4 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {nonIndexableCategories.map((cat) => renderCategoryLink(cat))}
            </div>
          </details>
        </div>
      )}
    </section>
  );
}
