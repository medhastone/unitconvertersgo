"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  Search,
  ListFilter,
  ChevronRight,
  Info,
  ArrowRight,
  X,
  Star,
} from "lucide-react";
import { Unit, Category, ConversionPairInfo } from "@/lib/conversions/types";
import { convertUnits } from "@/lib/conversions/engine";
import { CONVERSION_CATALOGUE } from "@/lib/conversions/catalogue";
import { UNIT_MAP } from "@/lib/conversions/units";

interface CategoryEducationalContent {
  aboutHeading: string;
  aboutParagraph: string;
  formulaTitle: string;
  formulaEquation: string;
  formulaExample: string;
  guideHref: string;
  guideLabel: string;
}

interface CategoryPageInteractiveProps {
  category: Category;
  displayName: string;
  units: Unit[];
  defaultFromId: string;
  defaultToId: string;
  defaultValue: number;
  popularPairs: ConversionPairInfo[];
  educationalContent: CategoryEducationalContent;
}

export default function CategoryPageInteractive({
  category,
  displayName,
  units,
  defaultFromId,
  defaultToId,
  defaultValue,
  popularPairs,
  educationalContent,
}: CategoryPageInteractiveProps) {
  const [fromUnitId, setFromUnitId] = useState<string>(defaultFromId);
  const [toUnitId, setToUnitId] = useState<string>(defaultToId);
  const [inputStr, setInputStr] = useState<string>(String(defaultValue));
  const [copied, setCopied] = useState(false);

  // Search & filter state for the Unit Directory
  const [unitSearch, setUnitSearch] = useState("");
  const [selectedSystem, setSelectedSystem] = useState<string>("all");
  const [selectedUnitForDetail, setSelectedUnitForDetail] = useState<Unit | null>(
    null
  );

  const numericInput = useMemo(() => {
    const trimmed = inputStr.trim();
    if (trimmed === "" || trimmed === "-" || trimmed === ".") return NaN;
    return Number(trimmed);
  }, [inputStr]);

  const isValidInput = Number.isFinite(numericInput);
  const effectiveInput = isValidInput ? numericInput : 0;

  const conversionOutput = useMemo(() => {
    return convertUnits(effectiveInput, fromUnitId, toUnitId, "auto");
  }, [effectiveInput, fromUnitId, toUnitId]);

  const fromUnit = useMemo(
    () => units.find((u) => u.id === fromUnitId) || conversionOutput.fromUnit,
    [units, fromUnitId, conversionOutput.fromUnit]
  );
  const toUnit = useMemo(
    () => units.find((u) => u.id === toUnitId) || conversionOutput.toUnit,
    [units, toUnitId, conversionOutput.toUnit]
  );

  // Check if there is a dedicated canonical pair page for the currently selected From/To units
  const matchingPair = useMemo(() => {
    return CONVERSION_CATALOGUE.find(
      (p) => p.fromUnitId === fromUnitId && p.toUnitId === toUnitId
    );
  }, [fromUnitId, toUnitId]);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleReset = () => {
    setFromUnitId(defaultFromId);
    setToUnitId(defaultToId);
    setInputStr(String(defaultValue));
  };

  const handleCopy = async () => {
    if (!isValidInput) return;
    try {
      await navigator.clipboard.writeText(conversionOutput.formattedValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  // Prioritize common everyday units at the top of the directory (e.g., mm, cm, m, km, in, ft, yd, mi, nmi, µm for length)
  const orderedUnits = useMemo(() => {
    if (category.id === "length") {
      const priorityOrder = [
        "millimeter",
        "foot",
        "centimeter",
        "yard",
        "meter",
        "mile",
        "kilometer",
        "nautical_mile",
        "inch",
        "micrometer",
      ];
      const rankMap = new Map(priorityOrder.map((id, idx) => [id, idx]));
      return [...units].sort((a, b) => {
        const rA = rankMap.has(a.id) ? rankMap.get(a.id)! : 999;
        const rB = rankMap.has(b.id) ? rankMap.get(b.id)! : 999;
        return rA - rB;
      });
    }
    return units;
  }, [category.id, units]);

  const filteredUnits = useMemo(() => {
    const q = unitSearch.trim().toLowerCase();
    return orderedUnits.filter((u) => {
      const matchesSystem =
        selectedSystem === "all" ||
        (selectedSystem === "metric" && u.system === "metric") ||
        (selectedSystem === "imperial" &&
          (u.system === "imperial" || u.system === "us_customary"));
      if (!matchesSystem) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.plural.toLowerCase().includes(q) ||
        u.symbol.toLowerCase().includes(q) ||
        (u.description && u.description.toLowerCase().includes(q))
      );
    });
  }, [orderedUnits, unitSearch, selectedSystem]);

  const hasSystemDistinction = useMemo(() => {
    return (
      units.some((u) => u.system === "metric") &&
      units.some((u) => u.system === "imperial" || u.system === "us_customary")
    );
  }, [units]);

  return (
    <div className="space-y-10">
      {/* =====================================================================
          PRIMARY CATEGORY CONVERTER (Compact, High-Clarity Horizontal Layout)
          ===================================================================== */}
      <section aria-label={`${displayName} Calculator`} className="pt-1">
        {/* Attached Teal Tab Header Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-t-2xl bg-[#0D9488] text-white font-extrabold text-sm sm:text-base shadow-xs">
          <Zap className="w-4 h-4 fill-current" />
          <span>{displayName} Conversions</span>
        </div>

        {/* Main Card Body */}
        <div className="rounded-b-2xl rounded-tr-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-lg shadow-slate-900/[0.04] space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* 1. Value Input (3 cols on lg) */}
            <div className="lg:col-span-2 space-y-1.5">
              <label
                htmlFor="cat-converter-value"
                className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
              >
                Value
              </label>
              <input
                id="cat-converter-value"
                type="number"
                inputMode="decimal"
                step="any"
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                placeholder="10"
                className="w-full h-[52px] px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 focus:outline-hidden text-xl font-extrabold font-mono text-[#16324F] dark:text-white transition-all"
              />
            </div>

            {/* 2. From Unit Dropdown (3 cols on lg) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label
                htmlFor="cat-converter-from"
                className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
              >
                From Unit
              </label>
              <select
                id="cat-converter-from"
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full h-[52px] px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 focus:outline-hidden text-sm font-bold text-[#16324F] dark:text-white transition-all cursor-pointer"
              >
                {units.map((u) => (
                  <option key={`from-unit-${u.id}`} value={u.id}>
                    {u.plural} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Swap Button (1 col on lg) */}
            <div className="lg:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                aria-label={`Swap ${fromUnit.plural} and ${toUnit.plural}`}
                title="Swap source and destination units"
                className="w-full lg:w-[52px] h-[48px] lg:h-[52px] rounded-xl bg-[#E6FAF8] dark:bg-teal-950/70 hover:bg-[#0D9488] text-[#0D9488] dark:text-[#2DD4BF] hover:text-white border border-[#0D9488]/25 flex items-center justify-center gap-2 transition-all cursor-pointer group shrink-0"
              >
                <ArrowLeftRight className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                <span className="lg:hidden text-xs font-bold">Swap Units</span>
              </button>
            </div>

            {/* 4. To Unit Dropdown (3 cols on lg) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label
                htmlFor="cat-converter-to"
                className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
              >
                To Unit
              </label>
              <select
                id="cat-converter-to"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full h-[52px] px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 focus:outline-hidden text-sm font-bold text-[#16324F] dark:text-white transition-all cursor-pointer"
              >
                {units.map((u) => (
                  <option key={`to-unit-${u.id}`} value={u.id}>
                    {u.plural} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Prominent Result + Copy Control (3 cols on lg) */}
            <div className="lg:col-span-3">
              <div
                aria-live="polite"
                className="p-3.5 rounded-xl bg-[#E6FAF8]/75 dark:bg-teal-950/35 border border-[#0D9488]/30 dark:border-teal-800/70 flex items-center justify-between gap-2.5"
              >
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0F766E] dark:text-teal-300">
                    Result
                  </span>
                  {isValidInput ? (
                    <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#16324F] dark:text-white truncate">
                      {conversionOutput.formattedValue}{" "}
                      <span className="font-sans font-bold text-base sm:text-lg text-[#0D9488] dark:text-[#2DD4BF]">
                        {toUnit.symbol}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 py-1">
                      Enter a valid number
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!isValidInput}
                  aria-label="Copy conversion result"
                  title={copied ? "Copied!" : "Copy conversion result"}
                  className="w-10 h-10 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-xs transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Instant Update Status + Reset & Convert Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
                <span>Result updates instantly</span>
              </div>
              {isValidInput && (
                <span className="text-xs font-mono font-bold text-[#16324F] dark:text-slate-200 bg-[#F7F9FC] dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  {numericInput} {fromUnit.plural.toLowerCase()} ({fromUnit.symbol}) →{" "}
                  <span className="text-[#0D9488] dark:text-[#2DD4BF]">
                    {conversionOutput.formattedValue} {toUnit.plural.toLowerCase()} ({toUnit.symbol})
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#F7F9FC] dark:hover:bg-slate-700 text-[#16324F] dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {matchingPair ? (
                <Link
                  href={`/convert/${matchingPair.slug}`}
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Convert ({fromUnit.symbol} → {toUnit.symbol})</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied Result!" : "Convert"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          POPULAR CATEGORY CONVERSIONS (Clean 8-Card Responsive Grid)
          ===================================================================== */}
      {popularPairs && popularPairs.length > 0 && (
        <section
          aria-labelledby="popular-category-conversions"
          className="space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
              <h2
                id="popular-category-conversions"
                className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white"
              >
                Popular {displayName} Conversions
              </h2>
            </div>

            <a
              href="#all-category-converters"
              className="text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {popularPairs.map((pair, idx) => {
              const pFrom = UNIT_MAP.get(pair.fromUnitId);
              const pTo = UNIT_MAP.get(pair.toUnitId);
              const pairLabel =
                pFrom && pTo
                  ? `${pFrom.plural} to ${pTo.plural}`
                  : pair.title.replace(/\s*\(.*?\)\s*/g, "").replace(" Converter", "");
              const symbolSub =
                pFrom && pTo
                  ? `${pFrom.symbol} to ${pTo.symbol}`
                  : pair.slug.replace(/-/g, " ");

              const badgeColors = [
                "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
                "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
                "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400",
                "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
                "bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400",
                "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400",
                "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
                "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
              ];
              const badgeClass = badgeColors[idx % badgeColors.length];

              return (
                <Link
                  key={`popular-pair-${pair.slug}-${idx}`}
                  href={`/convert/${pair.slug}`}
                  className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0D9488] hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badgeClass}`}
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors truncate">
                        {pairLabel}
                      </div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                        {symbolSub}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          TWO-COLUMN SECTION: UNIT DIRECTORY + EDUCATIONAL ABOUT SECTION
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (6 cols): Searchable & Filterable Unit Directory */}
        <section
          aria-labelledby="unit-directory-heading"
          className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
                <ListFilter className="w-4 h-4" />
              </div>
              <h2
                id="unit-directory-heading"
                className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white"
              >
                {displayName} Unit Directory
              </h2>
            </div>

            {hasSystemDistinction && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs">
                {[
                  { id: "all", label: "All" },
                  { id: "metric", label: "Metric" },
                  { id: "imperial", label: "Imperial/US" },
                ].map((tab) => (
                  <button
                    key={`sys-tab-${tab.id}`}
                    type="button"
                    onClick={() => setSelectedSystem(tab.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedSystem === tab.id
                        ? "bg-white dark:bg-slate-900 text-[#16324F] dark:text-white shadow-2xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-[#16324F]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              value={unitSearch}
              onChange={(e) => setUnitSearch(e.target.value)}
              placeholder={`Search ${displayName.toLowerCase()} units...`}
              aria-label={`Search ${displayName.toLowerCase()} units`}
              className="w-full h-[44px] pl-10 pr-9 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-[#0D9488] focus:outline-hidden text-xs sm:text-sm font-medium text-[#16324F] dark:text-white placeholder:text-slate-400 transition-all"
            />
            {unitSearch && (
              <button
                type="button"
                onClick={() => setUnitSearch("")}
                aria-label="Clear unit search"
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Selected Unit Quick Inspector Banner (when user clicks a unit) */}
          {selectedUnitForDetail && (
            <div className="p-3.5 rounded-xl bg-[#F0FDFA] dark:bg-teal-950/35 border border-[#0D9488]/30 dark:border-teal-800/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-[#16324F] dark:text-white text-sm">
                  {selectedUnitForDetail.name} ({selectedUnitForDetail.symbol})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedUnitForDetail(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Close unit detail"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedUnitForDetail.description ||
                  `Standard ${displayName.toLowerCase()} measurement unit (${selectedUnitForDetail.plural}).`}
              </p>
              <div className="text-[11px] font-mono text-[#0F766E] dark:text-teal-300 pt-0.5">
                Loaded as active <strong>From Unit</strong> in calculator above (1{" "}
                {selectedUnitForDetail.symbol} ={" "}
                {
                  convertUnits(1, selectedUnitForDetail.id, toUnitId, "auto")
                    .formattedValue
                }{" "}
                {toUnit.symbol})
              </div>
            </div>
          )}

          {/* 2-Column Compact Unit List */}
          {filteredUnits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredUnits.map((unit, idx) => {
                const isSelected = fromUnitId === unit.id;
                return (
                  <button
                    key={`unit-item-${unit.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      setFromUnitId(unit.id);
                      if (toUnitId === unit.id) {
                        const fallback = units.find((u) => u.id !== unit.id);
                        if (fallback) setToUnitId(fallback.id);
                      }
                      setSelectedUnitForDetail(unit);
                    }}
                    className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-[#F0FDFA] dark:bg-teal-950/40 border-[#0D9488] text-[#16324F] dark:text-white font-bold shadow-2xs"
                        : "bg-white dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:border-[#0D9488]/60 hover:bg-[#F7F9FC] dark:hover:bg-slate-800/60 text-[#16324F] dark:text-slate-200 font-semibold"
                    }`}
                  >
                    <span className="text-xs sm:text-sm truncate">
                      {unit.name} <span className="text-slate-500 dark:text-slate-400 font-mono">({unit.symbol})</span>
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        isSelected ? "text-[#0D9488]" : "text-slate-400 group-hover:text-[#0D9488]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
              No {displayName.toLowerCase()} units match &ldquo;{unitSearch}&rdquo;. Try clearing your filter.
            </div>
          )}
        </section>

        {/* RIGHT COLUMN (6 cols): Educational Section ("About Length Conversion") */}
        <section
          aria-labelledby="about-category-heading"
          className="lg:col-span-6 rounded-2xl border border-[#0D9488]/25 dark:border-teal-800/60 bg-[#E6FAF8]/65 dark:bg-teal-950/25 p-6 sm:p-7 shadow-xs space-y-5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <h2
              id="about-category-heading"
              className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white"
            >
              {educationalContent.aboutHeading}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {educationalContent.aboutParagraph}
          </p>

          {/* Useful Formula Example Box */}
          <div className="pt-3 border-t border-[#0D9488]/20 dark:border-teal-800/60 space-y-1.5 text-xs sm:text-sm">
            <div className="font-extrabold text-[#16324F] dark:text-white">
              {educationalContent.formulaTitle}
            </div>
            <div className="font-mono font-bold text-[#16324F] dark:text-[#2DD4BF]">
              {educationalContent.formulaEquation}
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              <strong className="text-[#16324F] dark:text-white">Example:</strong>{" "}
              <span className="font-mono">{educationalContent.formulaExample}</span>
            </div>
          </div>

          <div className="pt-1">
            <Link
              href={educationalContent.guideHref}
              className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0B4F6C] hover:bg-[#16324F] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>{educationalContent.guideLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
