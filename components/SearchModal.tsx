"use client";

import { useEffect, useState, useMemo, useDeferredValue } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  CornerDownLeft,
  Zap,
  Sparkles,
} from "lucide-react";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";
import { runSmartSearch } from "@/lib/search/smart-search";
import { getPairUrl, getCategoryUrl } from "@/lib/conversions/url";
import { CATEGORIES } from "@/lib/conversions/units";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { placeholder, currentFullPrompt } = useTypewriterPlaceholder({
    isPaused: !isOpen || query.trim().length > 0,
    prefix: "Try: ",
  });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuery("");
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          setQuery("");
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    return runSmartSearch(deferredQuery, { conversions: 10, categories: 8, units: 6 });
  }, [deferredQuery]);

  if (!isOpen) return null;

  const applyAnimatedExample = () => {
    const cleanPrompt = currentFullPrompt.replace(/\s*\([^)]*\)$/, "");
    setQuery(cleanPrompt);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search unit converters and categories"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-[#0D9488] shrink-0" />
          <label htmlFor="global-converter-search" className="sr-only">
            Search conversions, categories, and units
          </label>
          <input
            id="global-converter-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (
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
                  onClose();
                  router.push(results.instantMatch.primaryHref);
                } else if (results.specialTools.length > 0) {
                  onClose();
                  router.push(results.specialTools[0].href);
                } else if (results.conversions.length > 0) {
                  onClose();
                  router.push(getPairUrl(results.conversions[0]));
                } else if (results.categories.length > 0) {
                  onClose();
                  router.push(getCategoryUrl(results.categories[0].id));
                }
              }
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden truncate"
            autoFocus
          />
          {!query ? (
            <button
              type="button"
              onClick={applyAnimatedExample}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try example</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Smart Instant Calculation / Coupled Engineering Formula Match */}
          {results.instantMatch && (
            <div className="p-3.5 rounded-xl bg-[#0D9488]/8 dark:bg-[#0D9488]/15 border border-[#0D9488]/30 space-y-1.5">
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
                  onClick={onClose}
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
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#16324F] dark:text-slate-200 hover:border-[#0D9488] text-xs font-bold transition-colors"
                    >
                      <span>{results.instantMatch.secondaryLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
              </div>
            </div>
          )}

          {/* Special Tools */}
          {results.specialTools.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Specialty Tools
              </div>
              <div className="mt-1 space-y-1">
                {results.specialTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    prefetch={false}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 transition-colors group"
                  >
                    <span className="text-sm font-medium">{tool.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Conversion Pages */}
          {results.conversions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {query ? "Conversion Calculators" : "Popular Conversions"}
              </div>
              <div className="mt-1 space-y-1">
                {results.conversions.map((conv) => (
                  <Link
                    key={conv.slug}
                    href={getPairUrl(conv)}
                    prefetch={false}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{conv.title}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Measurement Categories ({CATEGORIES.length} Total)
              </div>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={getCategoryUrl(cat.id)}
                    prefetch={false}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 transition-colors text-sm"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-slate-400">View Category</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Units */}
          {results.units.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Units of Measurement
              </div>
              <div className="mt-1 space-y-1">
                {results.units.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`${getCategoryUrl(unit.categoryId)}?from=${encodeURIComponent(
                      unit.id
                    )}`}
                    prefetch={false}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 text-xs transition-colors"
                  >
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {unit.name} ({unit.symbol})
                    </span>
                    <span className="text-slate-400">
                      in {unit.categoryId.replace(/_/g, " ")}
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
              <div className="py-8 text-center text-sm text-slate-500 space-y-2">
                <p>No conversions found matching &ldquo;{query}&rdquo;.</p>
                <button
                  type="button"
                  onClick={applyAnimatedExample}
                  className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                >
                  Try &ldquo;{currentFullPrompt}&rdquo;
                </button>
              </div>
            )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500">
          <Link
            href="/search"
            prefetch={false}
            onClick={onClose}
            className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline flex items-center gap-1"
          >
            <span>Open full search page</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> Enter to open · Tab to fill
            example
          </span>
        </div>
      </div>
    </div>
  );
}
