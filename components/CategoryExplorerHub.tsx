"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
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
} from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_MAP,
  getUnitsByCategory,
} from "@/lib/conversions/units";
import { SUPER_CATEGORIES } from "@/lib/conversions/extended-categories";
import { Category } from "@/lib/conversions/types";
import { getCategoryUrl } from "@/lib/conversions/url";
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
  // Identify which super-category owns the current tool page
  const currentGroupId = useMemo(() => {
    if (!currentCategoryId) return SUPER_CATEGORIES[0].id;
    const found = SUPER_CATEGORIES.find((group) =>
      group.categoryIds.includes(currentCategoryId)
    );
    return found ? found.id : SUPER_CATEGORIES[0].id;
  }, [currentCategoryId]);

  const [activeTab, setActiveTab] = useState<string>(currentGroupId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { placeholder } = useTypewriterPlaceholder({
    isPaused: searchQuery.trim().length > 0,
    prefix: "Filter: ",
  });

  // Order super-categories so the current domain appears first in the tab bar
  const orderedGroups = useMemo(() => {
    const currentGroup = SUPER_CATEGORIES.find((g) => g.id === currentGroupId);
    const others = SUPER_CATEGORIES.filter((g) => g.id !== currentGroupId);
    return currentGroup ? [currentGroup, ...others] : SUPER_CATEGORIES;
  }, [currentGroupId]);

  // Precompute unit counts per category once
  const unitCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const cat of CATEGORIES) {
      map.set(cat.id, getUnitsByCategory(cat.id).length);
    }
    return map;
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filtered categories when searching across all 78 categories
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    const results: Array<{ category: Category; groupName: string }> = [];

    for (const group of SUPER_CATEGORIES) {
      for (const catId of group.categoryIds) {
        const cat = CATEGORY_MAP.get(catId);
        if (!cat) continue;
        const matches =
          cat.name.toLowerCase().includes(normalizedQuery) ||
          cat.pluralName.toLowerCase().includes(normalizedQuery) ||
          cat.description.toLowerCase().includes(normalizedQuery) ||
          group.name.toLowerCase().includes(normalizedQuery) ||
          group.shortName.toLowerCase().includes(normalizedQuery);
        if (matches) {
          results.push({ category: cat, groupName: group.shortName });
        }
      }
    }
    return results;
  }, [normalizedQuery]);

  const selectedGroup = useMemo(
    () => SUPER_CATEGORIES.find((g) => g.id === activeTab),
    [activeTab]
  );

  const renderCategoryLink = (cat: Category, groupLabel?: string) => {
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
              {cat.name}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              <span className="font-mono tabular-nums">{count} units</span>
              {groupLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{groupLabel}</span>
                </>
              )}
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
        <ArrowRight
          className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
            isCurrent
              ? "text-[#0D9488] dark:text-[#2DD4BF]"
              : "text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF]"
          }`}
        />
      </Link>
    );
  };

  return (
    <section
      suppressHydrationWarning
      aria-label={`Browse All ${CATEGORIES.length} Measurement Categories`}
      className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5 shadow-2xs"
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
              {CATEGORIES.length} Categories
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {SUPER_CATEGORIES.length} Scientific Domains
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white">
            Browse All {CATEGORIES.length} Measurement Categories
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Instant Search Filter */}
          <div suppressHydrationWarning className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              suppressHydrationWarning
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={`Filter ${CATEGORIES.length} measurement categories`}
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

      {/* Segmented Domain Group Tabs (hidden while actively filtering by search text) */}
      {!normalizedQuery && (
        <div
          role="tablist"
          aria-label="Measurement domain groups"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
        >
          {orderedGroups.map((group) => {
            const isSelected = activeTab === group.id;
            const isCurrentDomain = group.id === currentGroupId;
            return (
              <button
                key={group.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setActiveTab(group.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#16324F] dark:bg-[#0D9488] text-white shadow-2xs"
                    : "bg-[#F7F9FC] dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-[#16324F] dark:hover:text-white border border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <span className="opacity-85">
                  {ICON_MAP[group.iconName] || <Layers className="w-3.5 h-3.5" />}
                </span>
                <span>{group.shortName}</span>
                <span
                  className={`font-mono tabular-nums text-[11px] ${
                    isSelected
                      ? "text-teal-200 dark:text-white/90"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  · {group.categoryIds.length}
                </span>
                {isCurrentDomain && !isSelected && (
                  <span className="text-[10px] font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                    · Active
                  </span>
                )}
              </button>
            );
          })}

          <button
            role="tab"
            type="button"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#16324F] dark:bg-[#0D9488] text-white shadow-2xs"
                : "bg-[#F7F9FC] dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-[#16324F] dark:hover:text-white border border-slate-200/80 dark:border-slate-800"
            }`}
          >
            <span>All Categories</span>
            <span
              className={`font-mono tabular-nums text-[11px] ${
                activeTab === "all"
                  ? "text-teal-200 dark:text-white/90"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              · {CATEGORIES.length}
            </span>
          </button>
        </div>
      )}

      {/* Content View: 1) Search Results, 2) Single Domain Tab, or 3) All 9 Domains Grouped */}
      {normalizedQuery ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing{" "}
              <strong className="font-mono tabular-nums text-[#16324F] dark:text-white">
                {searchResults.length}
              </strong>{" "}
              matching {searchResults.length === 1 ? "category" : "categories"}{" "}
              for &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
            >
              Reset Filter
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {searchResults.map(({ category, groupName }) =>
                renderCategoryLink(category, groupName)
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 rounded-xl bg-[#F7F9FC]/60 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                No measurement categories matched &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                Show all {CATEGORIES.length} categories
              </button>
            </div>
          )}
        </div>
      ) : activeTab === "all" ? (
        <div className="space-y-6 pt-1">
          {orderedGroups.map((group) => {
            const groupCategories = group.categoryIds
              .map((id) => CATEGORY_MAP.get(id))
              .filter((c): c is Category => Boolean(c));

            return (
              <div
                key={group.id}
                className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#0D9488] dark:text-[#2DD4BF]">
                      {ICON_MAP[group.iconName] || (
                        <Layers className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <h3 className="font-extrabold text-sm text-[#16324F] dark:text-white">
                      {group.name}
                    </h3>
                    <span className="text-slate-400" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {groupCategories.length} tools
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-2xl">
                    {group.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {groupCategories.map((cat) => renderCategoryLink(cat))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        selectedGroup && (
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-[#F7F9FC]/70 dark:bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-[#16324F] dark:text-white">
                  {selectedGroup.name}
                </span>
                <span className="text-slate-400" aria-hidden="true">
                  ·
                </span>
                <span>{selectedGroup.description}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
              >
                View All {CATEGORIES.length} Categories →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {selectedGroup.categoryIds
                .map((id) => CATEGORY_MAP.get(id))
                .filter((c): c is Category => Boolean(c))
                .map((cat) => renderCategoryLink(cat))}
            </div>
          </div>
        )
      )}
    </section>
  );
}
