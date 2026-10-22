"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  Zap,
  ArrowRight,
  Ruler,
  Code2,
} from "lucide-react";
import { CATEGORIES, CATEGORY_MAP, getUnitsByCategory, UNIT_MAP } from "@/lib/conversions/units";
import { CONVERSION_CATALOGUE, getPairUrl } from "@/lib/conversions/catalogue";
import { convertUnits } from "@/lib/conversions/engine";
import { ConversionOutput, PrecisionMode } from "@/lib/conversions/types";

interface UniversalConverterCardProps {
  initialCategoryId?: string;
  initialFromUnitId?: string;
  initialToUnitId?: string;
  initialValue?: number;
  isLockedCategory?: boolean;
  onCalculationChange?: (output: ConversionOutput, currentInput: number) => void;
  className?: string;
}

export default function UniversalConverterCard({
  initialCategoryId = "length",
  initialFromUnitId = "meter",
  initialToUnitId = "foot",
  initialValue = 1,
  isLockedCategory = false,
  onCalculationChange,
  className = "",
}: UniversalConverterCardProps) {
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [fromUnitId, setFromUnitId] = useState(initialFromUnitId);
  const [toUnitId, setToUnitId] = useState(initialToUnitId);
  const [inputValue, setInputValue] = useState<string>(initialValue.toString());
  const [precision, setPrecision] = useState<PrecisionMode>("auto");
  const [copied, setCopied] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [justConverted, setJustConverted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setCategoryId(initialCategoryId);
    setFromUnitId(initialFromUnitId);
    setToUnitId(initialToUnitId);
    setInputValue(initialValue.toString());
  }, [initialCategoryId, initialFromUnitId, initialToUnitId, initialValue]);

  // Available units for active category
  const unitsInCategory = useMemo(() => {
    return getUnitsByCategory(categoryId);
  }, [categoryId]);

  // Matching dedicated conversion page for current (fromUnitId, toUnitId)
  const matchingDedicatedPair = useMemo(() => {
    return CONVERSION_CATALOGUE.find(
      (p) => p.fromUnitId === fromUnitId && p.toUnitId === toUnitId
    );
  }, [fromUnitId, toUnitId]);

  // When category changes, ensure fromUnit and toUnit belong to that category
  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    if (newCatId === "length") {
      setFromUnitId("meter");
      setToUnitId("foot");
      return;
    }
    const catPairs = CONVERSION_CATALOGUE.filter((p) => p.categoryId === newCatId);
    if (catPairs.length > 0) {
      setFromUnitId(catPairs[0].fromUnitId);
      setToUnitId(catPairs[0].toUnitId);
      return;
    }
    const newUnits = getUnitsByCategory(newCatId);
    if (newUnits.length >= 2) {
      setFromUnitId(newUnits[0].id);
      setToUnitId(newUnits[1].id);
    } else if (newUnits.length === 1) {
      setFromUnitId(newUnits[0].id);
      setToUnitId(newUnits[0].id);
    }
  };

  // Validate input & perform calculation
  const isEmptyInput = inputValue.trim() === "";
  const numericInput = parseFloat(inputValue);

  const inputValidationError = useMemo(() => {
    if (isEmptyInput) return null;
    if (isNaN(numericInput)) {
      return "Please enter a valid number (for example: 1, 2.5, or 100).";
    }
    if (categoryId === "fuel_economy" && numericInput <= 0) {
      return "Fuel economy conversions require a positive number greater than 0.";
    }
    if (categoryId === "temperature") {
      if ((fromUnitId === "kelvin" || fromUnitId === "rankine") && numericInput < 0) {
        return `Note: Values below 0 ${fromUnitId === "kelvin" ? "K" : "°R"} are below absolute zero.`;
      }
      if (fromUnitId === "celsius" && numericInput < -273.15) {
        return "Note: Values below -273.15 °C are below absolute zero (0 K).";
      }
      if (fromUnitId === "fahrenheit" && numericInput < -459.67) {
        return "Note: Values below -459.67 °F are below absolute zero (0 K).";
      }
    }
    return null;
  }, [isEmptyInput, numericInput, categoryId, fromUnitId]);

  const calculationResult = useMemo(() => {
    if (isEmptyInput || isNaN(numericInput)) {
      const fromUnit = UNIT_MAP.get(fromUnitId);
      const toUnit = UNIT_MAP.get(toUnitId);
      if (!fromUnit || !toUnit) return null;
      return {
        rawValue: NaN,
        formattedValue: "—",
        fromUnit,
        toUnit,
        formulaDisplay: "Enter a numeric value above to calculate immediately",
        steps: [],
      } as ConversionOutput;
    }

    try {
      return convertUnits(numericInput, fromUnitId, toUnitId, precision);
    } catch {
      return null;
    }
  }, [isEmptyInput, numericInput, fromUnitId, toUnitId, precision]);

  // 1-unit baseline for footer text ("1 meter = 3.28084 feet")
  const unitSummaryLine = useMemo(() => {
    try {
      const forwardOne = convertUnits(1, fromUnitId, toUnitId, "auto");
      return `1 ${forwardOne.fromUnit.name.toLowerCase()} = ${forwardOne.formattedValue} ${forwardOne.toUnit.plural.toLowerCase()}`;
    } catch {
      return null;
    }
  }, [fromUnitId, toUnitId]);

  // Notify parent component of calculation state
  useEffect(() => {
    if (calculationResult && !isNaN(numericInput) && !isEmptyInput) {
      onCalculationChange?.(calculationResult, numericInput);
    }
  }, [calculationResult, numericInput, isEmptyInput, onCalculationChange]);

  // Swap units handler
  const handleSwap = () => {
    setIsSwapping(true);
    const prevFrom = fromUnitId;
    const prevTo = toUnitId;
    setFromUnitId(prevTo);
    setToUnitId(prevFrom);
    setTimeout(() => setIsSwapping(false), 200);
  };

  // Copy result handler
  const handleCopy = () => {
    if (!calculationResult || isEmptyInput || isNaN(numericInput)) return;
    const textToCopy = `${calculationResult.formattedValue} ${calculationResult.toUnit.symbol}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset to initial default value
  const handleReset = () => {
    setInputValue(initialValue.toString());
    setFromUnitId(initialFromUnitId);
    setToUnitId(initialToUnitId);
    setPrecision("auto");
  };

  // Convert button handler (provides tactile confirmation or restores default 1 if empty)
  const handleConvertAction = () => {
    if (isEmptyInput || isNaN(numericInput)) {
      setInputValue("1");
      inputRef.current?.focus();
    }
    setJustConverted(true);
    setTimeout(() => setJustConverted(false), 600);
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-4 sm:p-6 space-y-4 transition-all ${className}`}
    >
      {/* Card Header: Title + Instant Conversion Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-5 h-5 fill-current" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white leading-tight">
              Quick Unit Converter
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Convert between units instantly.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] shrink-0 pt-1">
          <Zap className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Instant conversion</span>
        </span>
      </div>

      {/* Row 1: Category Dropdown + Numeric Input (2 columns on mobile & desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Category Selector */}
        <div className="space-y-1.5">
          <label
            htmlFor="all-category-select"
            className="block text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Category
          </label>
          <div className="relative">
            <Ruler
              className="w-4 h-4 text-[#16324F] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            {isLockedCategory ? (
              <div
                id="all-category-select"
                className="w-full min-h-[48px] pl-10 pr-3.5 py-2.5 text-sm sm:text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 text-[#16324F] dark:text-white flex items-center"
              >
                {CATEGORY_MAP.get(categoryId)?.name || "Length"}
              </div>
            ) : (
              <select
                id="all-category-select"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full min-h-[48px] pl-10 pr-8 py-2.5 text-sm sm:text-base font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 cursor-pointer shadow-2xs"
              >
                {CATEGORIES.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {c.id === "mass"
                      ? "Weight & Mass"
                      : c.id === "digital_storage"
                      ? "Data Storage"
                      : c.id === "volume"
                      ? "Volume"
                      : c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Numeric Value Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="converter-input-value"
            className="block text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Enter value
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="converter-input-value"
              type="number"
              inputMode="decimal"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="1"
              className="w-full min-h-[48px] px-4 py-2.5 text-lg sm:text-xl font-extrabold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 tabular-nums shadow-2xs transition-all"
              aria-label={`Enter ${UNIT_MAP.get(fromUnitId)?.name || "source"} value to convert`}
            />
          </div>
        </div>
      </div>

      {/* Row 2: From Unit — Swap Button — To Unit */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 items-end">
        {/* From Unit Selector */}
        <div className="space-y-1.5 min-w-0">
          <label
            htmlFor="from-unit-select"
            className="block text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            From
          </label>
          <select
            id="from-unit-select"
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="w-full min-h-[48px] px-3 sm:px-3.5 py-2.5 text-sm sm:text-base font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 cursor-pointer shadow-2xs truncate"
          >
            {unitsInCategory.map((u) => (
              <option
                key={u.id}
                value={u.id}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
              >
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Large Accessible Swap Button (>= 44x44px touch target) */}
        <button
          type="button"
          onClick={handleSwap}
          className={`min-w-[44px] min-h-[48px] px-3 rounded-xl bg-[#0D9488]/12 hover:bg-[#0D9488] dark:bg-[#0D9488]/20 dark:hover:bg-[#0D9488] text-[#16324F] hover:text-white dark:text-[#2DD4BF] dark:hover:text-slate-950 flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 ${
            isSwapping ? "rotate-180 scale-95" : ""
          }`}
          title="Swap From and To units"
          aria-label="Swap source and destination units"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>

        {/* To Unit Selector */}
        <div className="space-y-1.5 min-w-0">
          <label
            htmlFor="to-unit-select"
            className="block text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            To
          </label>
          <select
            id="to-unit-select"
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            className="w-full min-h-[48px] px-3 sm:px-3.5 py-2.5 text-sm sm:text-base font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 cursor-pointer shadow-2xs truncate"
          >
            {unitsInCategory.map((u) => (
              <option
                key={u.id}
                value={u.id}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
              >
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Prominent Conversion Result + Copy Result Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Result
          </span>
          {copied && (
            <span className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF]">
              Copied to clipboard!
            </span>
          )}
        </div>

        <div
          className={`rounded-xl bg-[#0D9488]/10 dark:bg-[#0D9488]/15 border px-4 py-3 min-h-[64px] flex items-center justify-between gap-3 transition-colors ${
            justConverted
              ? "border-[#0D9488] ring-2 ring-[#0D9488]/25"
              : "border-[#0D9488]/30 dark:border-[#0D9488]/40"
          }`}
        >
          <div className="flex-1 text-center min-w-0">
            {isEmptyInput ? (
              <div
                className="text-sm font-medium text-slate-500 dark:text-slate-400"
                role="status"
                aria-live="polite"
              >
                Enter a value above to calculate
              </div>
            ) : (
              <div
                className="text-2xl sm:text-3xl font-extrabold text-[#16324F] dark:text-white tabular-nums break-words leading-tight"
                aria-live="polite"
              >
                {calculationResult?.formattedValue ?? "—"}{" "}
                <span className="text-lg sm:text-2xl font-bold text-[#16324F]/85 dark:text-slate-300">
                  {calculationResult?.toUnit.symbol}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={isEmptyInput || isNaN(numericInput)}
            className={`min-w-[44px] min-h-[44px] px-3 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs font-bold transition-all shrink-0 shadow-xs ${
              isEmptyInput || isNaN(numericInput)
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : copied
                ? "bg-[#16324F] text-white cursor-pointer"
                : "bg-[#0D9488] hover:bg-[#0F766E] text-white cursor-pointer"
            }`}
            title="Copy conversion result"
            aria-label="Copy converted result to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Empty / Domain Validation Feedback State */}
      {inputValidationError && (
        <div
          role="alert"
          className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 px-4 py-2.5 text-xs font-medium text-amber-800 dark:text-amber-300"
        >
          {inputValidationError}
        </div>
      )}

      {/* Row 4: Reset & Convert Action Buttons (>= 44px touch targets) */}
      <div className="grid grid-cols-2 gap-3 pt-0.5">
        <button
          type="button"
          onClick={handleReset}
          className="min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#F7F9FC] dark:hover:bg-slate-700 text-sm font-bold text-[#16324F] dark:text-white inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={handleConvertAction}
          className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-sm font-bold text-white inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Convert</span>
        </button>
      </div>

      {/* Row 5: Unit Summary Line + Precision Controls + Dedicated Page Link */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        {unitSummaryLine && (
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {unitSummaryLine}
          </span>
        )}

        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          <div className="flex items-center gap-1 p-0.5 bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-lg text-[11px]">
            {(["auto", "2", "4", "6", "sci"] as PrecisionMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPrecision(mode)}
                className={`px-2 py-1 font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  precision === mode
                    ? "bg-[#16324F] dark:bg-[#0D9488] text-white dark:text-slate-950 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {mode === "auto" ? "Auto" : mode === "sci" ? "10ⁿ" : `${mode}d`}
              </button>
            ))}
          </div>

          {matchingDedicatedPair && (
            <div className="flex items-center gap-3">
              <Link
                href={`/widgets/w/${matchingDedicatedPair.slug}`}
                prefetch={false}
                className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] shrink-0"
                title="Embed this calculator widget on your site"
              >
                <Code2 className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
                <span>Embed</span>
              </Link>
              <Link
                href={getPairUrl(matchingDedicatedPair)}
                prefetch={false}
                className="inline-flex items-center gap-1 font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
              >
                <span>Full Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
