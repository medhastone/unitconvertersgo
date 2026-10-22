"use client";

import { useState, useMemo, useRef, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  X,
  CornerDownLeft,
  Zap,
  Sparkles,
} from "lucide-react";
import { UNITS } from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";
import { runSmartSearch } from "@/lib/search/smart-search";

const QUICK_TRY_LINKS = [
  { label: "convert volt to watt", query: "convert volt to watt" },
  { label: "meter to feet", href: "/length/meters-to-feet" },
  { label: "kg to pounds", href: "/weight-and-mass/kg-to-lbs" },
  { label: "celsius to fahrenheit", href: "/temperature/celsius-to-fahrenheit" },
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { placeholder, currentFullPrompt } = useTypewriterPlaceholder({
    isPaused: isFocused || query.trim().length > 0,
    prefix: "Try: ",
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deferredQuery = useDeferredValue(query);

  // Smart search across instant unit pairs, coupled formulas, 78 categories, and 500+ units
  const results = useMemo(() => {
    return runSmartSearch(deferredQuery, { conversions: 8, categories: 6, units: 4 });
  }, [deferredQuery]);

  const applyAnimatedExample = () => {
    const cleanPrompt = currentFullPrompt.replace(/\s*\([^)]*\)$/, "");
    setQuery(cleanPrompt);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    } else if (
      e.key === "Tab" &&
      !query.trim() &&
      currentFullPrompt &&
      !e.shiftKey
    ) {
      e.preventDefault();
      applyAnimatedExample();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.instantMatch) {
        setIsFocused(false);
        router.push(results.instantMatch.primaryHref);
      } else if (results.specialTools.length > 0) {
        setIsFocused(false);
        router.push(results.specialTools[0].href);
      } else if (results.conversions.length > 0) {
        setIsFocused(false);
        router.push(getPairUrl(results.conversions[0]));
      } else if (results.categories.length > 0) {
        setIsFocused(false);
        router.push(getCategoryUrl(results.categories[0].id));
      }
    }
  };

  const showDropdown =
    isFocused &&
    (query.trim().length > 0 ||
      results.conversions.length > 0 ||
      Boolean(results.instantMatch));

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto space-y-2">
      <div
        className={`flex items-center gap-3 px-4 sm:px-5 min-h-[48px] py-2.5 rounded-full bg-white dark:bg-slate-900 border transition-all shadow-sm ${
          isFocused
            ? "border-[#0D9488] ring-3 ring-[#0D9488]/15 dark:border-[#0D9488]"
            : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        }`}
      >
        <Search
          className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0"
          aria-hidden="true"
        />
        <label htmlFor="hero-discovery-search" className="sr-only">
          Search units or converters
        </label>
        <input
          ref={inputRef}
          id="hero-discovery-search"
          type="search"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-hidden truncate"
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={applyAnimatedExample}
              title={`Fill example: "${currentFullPrompt}"`}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Tab</span>
            </button>
            <kbd
              className="inline-flex items-center gap-0.5 px-2 py-1 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
              title="Press Command+K or Ctrl+K to search from anywhere"
            >
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Quick Try Suggestions Line */}
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400 px-2">
        <span>Try:</span>
        {QUICK_TRY_LINKS.map((item, idx) => (
          <span key={item.label} className="inline-flex items-center">
            {item.query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery(item.query);
                  setIsFocused(true);
                  inputRef.current?.focus();
                }}
                className="font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href!}
                prefetch={false}
                className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors"
              >
                {item.label}
              </Link>
            )}
            {idx < QUICK_TRY_LINKS.length - 1 ? <span>,</span> : <span>...</span>}
          </span>
        ))}
      </div>

      {/* Instant Discovery Dropdown */}
      {showDropdown && (
        <div
          role="listbox"
          aria-label="Suggested unit converters"
          className="absolute left-0 right-0 top-[54px] z-30 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-left"
        >
          <div className="max-h-96 overflow-y-auto p-2.5 space-y-3">
            {/* Smart Instant Answer / Coupled Engineering Match */}
            {results.instantMatch && (
              <div className="p-3 rounded-xl bg-[#0D9488]/8 dark:bg-[#0D9488]/15 border border-[#0D9488]/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {results.instantMatch.type === "same_category"
                      ? "Instant Unit Calculation"
                      : "Engineering Formula & Calculators"}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-mono font-extrabold text-[#16324F] dark:text-white tabular-nums">
                  {results.instantMatch.headline}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {results.instantMatch.subheadline}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href={results.instantMatch.primaryHref}
                    prefetch={false}
                    onClick={() => setIsFocused(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors"
                  >
                    <span>{results.instantMatch.primaryLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {results.instantMatch.secondaryHref &&
                    results.instantMatch.secondaryLabel && (
                      <Link
                        href={results.instantMatch.secondaryHref}
                        prefetch={false}
                        onClick={() => setIsFocused(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#16324F] dark:text-slate-200 hover:border-[#0D9488] text-xs font-bold transition-colors"
                      >
                        <span>{results.instantMatch.secondaryLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                </div>
              </div>
            )}

            {results.specialTools.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Tools
                </div>
                <div className="mt-1 space-y-1">
                  {results.specialTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      prefetch={false}
                      onClick={() => setIsFocused(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 transition-colors group"
                    >
                      <span className="text-xs sm:text-sm font-semibold group-hover:text-[#0D9488]">
                        {tool.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.conversions.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {query.trim() ? "Matching Converters" : "Popular Quick Converters"}
                </div>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {results.conversions.map((conv) => (
                    <Link
                      key={conv.slug}
                      href={getPairUrl(conv)}
                      prefetch={false}
                      onClick={() => setIsFocused(false)}
                      className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 transition-colors group"
                    >
                      <span className="text-xs sm:text-sm font-semibold group-hover:text-[#0D9488] transition-colors truncate pr-2">
                        {conv.title.replace(" Converter", "")}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.categories.length > 0 && (
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Categories (78 Total)
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5 px-2">
                  {results.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={getCategoryUrl(cat.id)}
                      prefetch={false}
                      onClick={() => setIsFocused(false)}
                      className="px-3 py-1.5 min-h-[36px] inline-flex items-center rounded-lg text-xs font-semibold bg-[#F7F9FC] dark:bg-slate-800 text-[#16324F] dark:text-slate-200 hover:bg-[#0D9488] hover:text-white transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.units.length > 0 && (
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Units
                </div>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {results.units.map((u) => (
                    <Link
                      key={u.id}
                      href={`${getCategoryUrl(u.categoryId)}?from=${encodeURIComponent(
                        u.id
                      )}`}
                      prefetch={false}
                      onClick={() => setIsFocused(false)}
                      className="flex items-center justify-between px-3 py-2 min-h-[40px] rounded-lg hover:bg-[#F7F9FC] dark:hover:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="font-medium">
                        {u.name} ({u.symbol})
                      </span>
                      <span className="text-slate-400">
                        {u.categoryId.replace(/_/g, " ")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!results.instantMatch &&
              results.specialTools.length === 0 &&
              results.conversions.length === 0 &&
              results.categories.length === 0 &&
              results.units.length === 0 && (
                <div className="py-6 text-center text-xs sm:text-sm text-slate-500 space-y-1.5">
                  <p>No converters found for &ldquo;{query}&rdquo;.</p>
                  <button
                    type="button"
                    onClick={applyAnimatedExample}
                    className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                  >
                    Try &ldquo;{currentFullPrompt}&rdquo;
                  </button>
                </div>
              )}
          </div>

          <div className="px-3.5 py-2 bg-[#F7F9FC] dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Search across 78 categories, {CONVERSION_CATALOGUE.length} pairs &amp;{" "}
              {UNITS.length} units
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-[#16324F] dark:text-slate-300">
              <CornerDownLeft className="w-3 h-3" /> Enter to open
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
