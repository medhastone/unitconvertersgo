"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Zap,
  Sparkles,
  CornerDownLeft,
} from "lucide-react";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";
import { runSmartSearch } from "@/lib/search/smart-search";
import { getPairUrl, getCategoryUrl } from "@/lib/conversions/url";

interface ToolSearchBarProps {
  currentCategoryName?: string;
}

export default function ToolSearchBar({
  currentCategoryName,
}: ToolSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isAnimationPaused = isFocused || query.trim().length > 0;
  const { placeholder, currentFullPrompt } = useTypewriterPlaceholder({
    isPaused: isAnimationPaused,
    prefix: "Search 78 tools — e.g. ",
  });

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

  const results = useMemo(() => {
    if (!isFocused && !query.trim()) {
      return {
        instantMatch: null,
        specialTools: [],
        conversions: [],
        categories: [],
        units: [],
      };
    }
    return runSmartSearch(query, { conversions: 6, categories: 6, units: 4 });
  }, [isFocused, query]);

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
      const cleanPrompt = currentFullPrompt.replace(/\s*\([^)]*\)$/, "");
      setQuery(cleanPrompt);
      setIsFocused(true);
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

  const applyAnimatedExample = () => {
    const cleanPrompt = currentFullPrompt.replace(/\s*\([^)]*\)$/, "");
    setQuery(cleanPrompt);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const hasAnyResults =
    Boolean(results.instantMatch) ||
    results.specialTools.length > 0 ||
    results.conversions.length > 0 ||
    results.categories.length > 0 ||
    results.units.length > 0;

  return (
    <div suppressHydrationWarning ref={containerRef} className="relative w-full">
      <div
        suppressHydrationWarning
        className={`flex items-center gap-2.5 px-3.5 sm:px-4 min-h-[44px] py-2 rounded-xl bg-white dark:bg-slate-900 border transition-all shadow-2xs ${
          isFocused
            ? "border-[#0D9488] ring-2 ring-[#0D9488]/15 dark:border-[#0D9488]"
            : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        }`}
      >
        <Search
          className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0"
          aria-hidden="true"
        />
        <label htmlFor="inline-tool-smart-search" className="sr-only">
          Search any unit conversion or measurement category
        </label>
        <input
          suppressHydrationWarning
          ref={inputRef}
          id="inline-tool-smart-search"
          type="search"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#16324F] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-hidden truncate"
          autoComplete="off"
        />

        {!query ? (
          <button
            suppressHydrationWarning
            type="button"
            onClick={applyAnimatedExample}
            title={`Try searching "${currentFullPrompt}"`}
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] shrink-0 whitespace-nowrap transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#0D9488] dark:text-[#2DD4BF]" />
            <span>Try example</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm">
              Tab
            </kbd>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search query"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Panel */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-left max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {/* Quick Interactive Example Bar when input is empty */}
          {!query.trim() && (
            <div className="px-4 py-2.5 bg-[#F7F9FC] dark:bg-slate-950/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                <Sparkles className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                <span>Live prompt:</span>
                <button
                  type="button"
                  onClick={applyAnimatedExample}
                  className="font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline truncate cursor-pointer"
                >
                  &ldquo;{currentFullPrompt}&rdquo;
                </button>
              </div>
              {currentCategoryName && (
                <span className="text-[11px] text-slate-400">
                  Viewing: {currentCategoryName}
                </span>
              )}
            </div>
          )}

          {/* 1. Smart Instant Calculation / Coupled Engineering Formula Match */}
          {results.instantMatch && (
            <div className="p-3.5 bg-[#0D9488]/6 dark:bg-[#0D9488]/15 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {results.instantMatch.type === "same_category"
                    ? "Instant Unit Conversion"
                    : "Engineering Formula & Calculators"}
                </span>
              </div>
              <div className="text-sm sm:text-base font-mono font-extrabold text-[#16324F] dark:text-white tabular-nums">
                {results.instantMatch.headline}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {results.instantMatch.subheadline}
              </p>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {results.instantMatch.formulaNote}
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

          {/* 2. Special Tools */}
          {results.specialTools.length > 0 && (
            <div className="p-2">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Specialty Tools
              </div>
              {results.specialTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  prefetch={false}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF]">
                      {tool.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {tool.description}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          )}

          {/* 3. Direct Unit Pair Converters */}
          {results.conversions.length > 0 && (
            <div className="p-2">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {query.trim() ? "Matching Unit Converters" : "Popular Converters"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {results.conversions.map((item) => (
                  <Link
                    key={item.slug}
                    href={getPairUrl(item)}
                    prefetch={false}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] truncate pr-2">
                      {item.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 4. Measurement Categories (All 78 searchable) */}
          {results.categories.length > 0 && (
            <div className="p-2">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Measurement Categories (78 Total)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={getCategoryUrl(cat.id)}
                    prefetch={false}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-[#16324F] dark:text-slate-200 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] truncate">
                        {cat.name} Converter
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {cat.pluralName}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 5. Individual Units */}
          {results.units.length > 0 && (
            <div className="p-2">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Matching Units
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {results.units.map((u) => (
                  <Link
                    key={u.id}
                    href={`${getCategoryUrl(u.categoryId)}?from=${encodeURIComponent(
                      u.id
                    )}`}
                    prefetch={false}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                      {u.name}{" "}
                      <span className="font-mono text-slate-400">
                        ({u.symbol})
                      </span>
                    </span>
                    <span className="text-[11px] text-[#0D9488] dark:text-[#2DD4BF] font-semibold">
                      Open →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!hasAnyResults && (
            <div className="p-6 text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No exact converter found for &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                onClick={applyAnimatedExample}
                className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer"
              >
                Try &ldquo;{currentFullPrompt}&rdquo;
              </button>
            </div>
          )}

          <div className="px-3.5 py-2 bg-[#F7F9FC] dark:bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Press Enter to open top
              match, or Tab to fill example
            </span>
            <Link
              href="/sitemap"
              prefetch={false}
              onClick={() => setIsFocused(false)}
              className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
            >
              All 78 Categories →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
