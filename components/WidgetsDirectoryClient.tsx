"use client";

import { useState, useMemo, useDeferredValue } from "react";
import Link from "next/link";
import {
  Search,
  Code2,
  ArrowRight,
  Maximize2,
  Columns,
  ExternalLink,
  Link2,
  Sparkles,
  CheckCircle2,
  Zap,
  Sun,
  Moon,
  X,
  Layers,
  Sliders,
} from "lucide-react";
import EmbedCalculatorWidget from "@/components/EmbedCalculatorWidget";
import {
  WIDGET_ACCENT_PALETTES,
  WidgetAccent,
  WidgetDescriptor,
  WidgetDirectoryItem,
  WidgetTheme,
} from "@/lib/widgets";
import { CATEGORIES } from "@/lib/conversions/units";
import { getCategoryUrlSlug, getCategoryUrl } from "@/lib/conversions/url";

interface WidgetsDirectoryClientProps {
  allItems: WidgetDirectoryItem[];
  heroDemoWidgets: WidgetDescriptor[];
}

export default function WidgetsDirectoryClient({
  allItems,
  heroDemoWidgets,
}: WidgetsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeDemoIndex, setActiveDemoIndex] = useState<number>(0);
  const [demoTheme, setDemoTheme] = useState<WidgetTheme>("light");
  const [demoAccent, setDemoAccent] = useState<WidgetAccent>("teal");

  const activeDemoWidget = heroDemoWidgets[activeDemoIndex] || heroDemoWidgets[0];

  const filteredItems = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase();
    return allItems.filter((item) => {
      if (selectedCategory === "featured" && !item.isFeatured) return false;
      if (selectedCategory === "electrical" && !item.isElectrical) return false;
      if (
        selectedCategory !== "all" &&
        selectedCategory !== "featured" &&
        selectedCategory !== "electrical" &&
        item.categoryId !== selectedCategory
      ) {
        return false;
      }

      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.fromSymbol.toLowerCase().includes(q) ||
        item.toSymbol.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [allItems, deferredSearchQuery, selectedCategory]);

  // Group filtered items by category when viewing "all" without search
  const groupedCategories = useMemo(() => {
    if (selectedCategory !== "all" || deferredSearchQuery.trim() !== "") {
      return null;
    }
    const groups: {
      categoryId: string;
      categoryName: string;
      items: WidgetDirectoryItem[];
    }[] = [];

    // 1. Featured / Most Popular Widgets group first
    const featured = allItems.filter((i) => i.isFeatured).slice(0, 12);
    if (featured.length > 0) {
      groups.push({
        categoryId: "popular_featured",
        categoryName: "Most Popular & Electrical Calculator Widgets",
        items: featured,
      });
    }

    // 2. Category sections
    for (const cat of CATEGORIES) {
      const catItems = allItems.filter((i) => i.categoryId === cat.id);
      if (catItems.length > 0) {
        groups.push({
          categoryId: cat.id,
          categoryName: `${cat.name} Calculator Widgets`,
          items: catItems,
        });
      }
    }

    return groups;
  }, [allItems, selectedCategory, deferredSearchQuery]);

  return (
    <div className="space-y-12">
      {/* =====================================================================
          HERO SECTION: Value Prop + Live Interactive Widget Sandbox
          ===================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Quick Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 text-xs font-extrabold">
              <Code2 className="w-3.5 h-3.5" />
              <span>Free Embeddable Calculator Widgets · {allItems.length}+ Tools</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#16324F] dark:text-white leading-[1.12]">
              Calculator &amp; Unit Converter Widgets for Your Website
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Select a calculator widget below to customize its layout and copy the HTML embed code for your website.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">
                <div className="font-mono text-sm font-extrabold text-[#16324F] dark:text-white">
                  4 Embed Styles
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Full-width, custom pixel width, popup, or link
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">
                <div className="font-mono text-sm font-extrabold text-[#0D9488] dark:text-[#2DD4BF]">
                  Zero Dependencies
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Works in WordPress, Wix, Squarespace &amp; HTML
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">
                <div className="font-mono text-sm font-extrabold text-[#16324F] dark:text-white">
                  100% Free Forever
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  No API keys, registration, or usage caps
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#widget-directory"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-extrabold shadow-xs transition-colors"
              >
                <span>Browse All {allItems.length}+ Widgets</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/widgets/w/ah-to-kwh"
                prefetch={false}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:border-[#0D9488] border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white transition-colors"
              >
                <Zap className="w-4 h-4 text-[#0D9488]" />
                <span>Ah to kWh Widget Studio</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Interactive Widget Showcase */}
          {activeDemoWidget && (
            <div className="lg:col-span-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 space-y-4">
              {/* Demo Switcher Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Live Widget Preview
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setDemoTheme((prev) => (prev === "light" ? "dark" : "light"))
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {demoTheme === "light" ? (
                      <>
                        <Moon className="w-3 h-3" />
                        <span>Dark</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>Light</span>
                      </>
                    )}
                  </button>

                  {(["teal", "navy", "blue", "emerald"] as WidgetAccent[]).map(
                    (cKey) => (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => setDemoAccent(cKey)}
                        style={{
                          backgroundColor: WIDGET_ACCENT_PALETTES[cKey].primaryHex,
                        }}
                        aria-label={`Select ${cKey} accent`}
                        className={`w-4 h-4 rounded-full cursor-pointer transition-transform ${
                          demoAccent === cKey ? "scale-125 ring-2 ring-offset-1 ring-slate-900 dark:ring-white" : "opacity-75"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Demo Tool Selector Pills */}
              <div className="flex flex-wrap gap-1.5">
                {heroDemoWidgets.map((dw, idx) => {
                  const isSelected = idx === activeDemoIndex;
                  return (
                    <button
                      key={dw.slug}
                      type="button"
                      onClick={() => setActiveDemoIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#16324F] dark:bg-[#0D9488] text-white border-transparent"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#0D9488]"
                      }`}
                    >
                      {dw.fromUnit.symbol} → {dw.toUnit.symbol}
                    </button>
                  );
                })}
              </div>

              {/* Live Rendered Widget */}
              <EmbedCalculatorWidget
                widget={activeDemoWidget}
                theme={demoTheme}
                accent={demoAccent}
                showFormula={true}
                showAttributionBar={true}
              />

              {/* Direct Customize CTA for Active Demo */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Want this calculator on your site?
                </span>
                <Link
                  href={activeDemoWidget.widgetStudioHref}
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                >
                  <span>Customize &amp; Get Embed Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          4 EMBED FORMATS EXPLAINER STRIP (Matching Inch Calculator's 4 Styles)
          ===================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
              Four Flexible Ways to Embed Any Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Every calculator in our catalog supports four installation styles to fit articles, sidebars, and documentation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "1. Full-Width Widget",
              badge: "100% Responsive",
              desc: "Automatically expands to fill the width of your blog post, article body, or LMS course column on desktop and mobile.",
              icon: Maximize2,
            },
            {
              title: "2. Adjustable Width",
              badge: "260px – 640px Slider",
              desc: "Set an exact maximum pixel width (e.g., 340px) using our live slider to fit narrow sidebars, widgets, and multi-column grids.",
              icon: Columns,
            },
            {
              title: "3. Popup Calculator",
              badge: "Floating Window",
              desc: "Embed a compact trigger button that launches the interactive calculator in a clean 420×540 popup window on click.",
              icon: ExternalLink,
            },
            {
              title: "4. Text Link",
              badge: "Zero Layout Shift",
              desc: "Generate a clean, semantic HTML anchor link pointing directly to the verified conversion tool.",
              icon: Link2,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-[#16324F] dark:text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SEARCH & CATEGORY FILTER DIRECTORY
          ===================================================================== */}
      <section id="widget-directory" className="space-y-6 scroll-mt-20">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                Browse &amp; Search Calculator Widgets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Select any calculator below to open its customization studio and generate your HTML embed code.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search widgets (e.g. ah to kwh, cm to in, psi)..."
                aria-label="Search calculator widgets"
                className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm font-semibold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {[
              { id: "all", label: `All Widgets (${allItems.length})` },
              { id: "featured", label: "Popular Widgets" },
              { id: "electrical", label: "Electrical & Battery (Ah / kWh)" },
              ...CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
            ].map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#16324F] dark:bg-[#0D9488] text-white"
                      : "bg-[#F7F9FC] dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:border-[#0D9488] border border-slate-200/80 dark:border-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
            <p className="text-base font-extrabold text-[#16324F] dark:text-white">
              No calculator widgets matched &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try searching for a unit name or symbol such as &ldquo;Ah to kWh&rdquo;, &ldquo;cm to inches&rdquo;, &ldquo;kg to lbs&rdquo;, or &ldquo;Celsius&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D9488] text-white text-xs font-extrabold cursor-pointer"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {/* Grouped Category View (Default when browsing All without search query) */}
        {groupedCategories ? (
          <div className="space-y-10">
            {groupedCategories.map((group) => (
              <div key={group.categoryId} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/90 dark:border-slate-800 pb-2.5">
                  <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white tracking-tight">
                    {group.categoryName}
                  </h3>
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    {group.items.length} widgets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {group.items.map((item) => (
                    <WidgetCatalogCard key={`${group.categoryId}-${item.slug}`} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Filtered Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredItems.map((item) => (
              <WidgetCatalogCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function WidgetCatalogCard({ item }: { item: WidgetDirectoryItem }) {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488] p-4 flex flex-col justify-between gap-3.5 shadow-2xs transition-all">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 rounded-md bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 font-mono text-[11px] font-extrabold">
            {item.fromSymbol} → {item.toSymbol}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {item.kind === "category" ? "Multi-Unit Widget" : item.categoryName}
          </span>
        </div>

        <Link
          href={`/widgets/w/${item.slug}`}
          prefetch={false}
          className="block text-sm font-extrabold text-[#16324F] dark:text-white hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
        >
          {item.title}
        </Link>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <Link
          href={`/widgets/w/${item.slug}`}
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Get Widget Code</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <Link
          href={
            item.kind === "category"
              ? getCategoryUrl(item.categoryId)
              : `/${getCategoryUrlSlug(item.categoryId)}/${item.slug}`
          }
          prefetch={false}
          className="text-[11px] font-semibold text-slate-500 hover:text-[#16324F] dark:hover:text-white transition-colors"
        >
          Calculator →
        </Link>
      </div>
    </div>
  );
}
