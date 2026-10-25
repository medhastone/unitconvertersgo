"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Info,
  CheckCircle2,
  BookOpen,
  Scale,
  ExternalLink,
} from "lucide-react";
import {
  COOKING_INGREDIENTS,
  COOKING_UNITS,
  COOKING_UNIT_MAP,
  COOKING_PACKING_NOTE,
  CookingIngredient,
  convertCookingIngredient,
} from "@/lib/conversions/cooking";

interface CookingIngredientConverterProps {
  initialIngredientSlug?: string;
  initialFromUnitId?: string;
  initialToUnitId?: string;
  initialValue?: number;
  navigateOnIngredientChange?: boolean;
}

const QUICK_VOLUME_PRESETS = [
  { label: "1/4 US cup", value: 0.25, unitId: "cup" },
  { label: "1/3 US cup", value: 0.3333, unitId: "cup" },
  { label: "1/2 US cup", value: 0.5, unitId: "cup" },
  { label: "2/3 US cup", value: 0.6667, unitId: "cup" },
  { label: "3/4 US cup", value: 0.75, unitId: "cup" },
  { label: "1 US cup (236.6 mL)", value: 1, unitId: "cup" },
  { label: "1 Metric cup (250 mL)", value: 1, unitId: "metric_cup" },
  { label: "1 tbsp", value: 1, unitId: "tbsp" },
  { label: "1 tsp", value: 1, unitId: "tsp" },
  { label: "100 g", value: 100, unitId: "g" },
];

const CORE_EQUIVALENT_UNIT_IDS = [
  "g",
  "cup",
  "metric_cup",
  "tbsp",
  "tsp",
  "ml",
  "oz",
];

export default function CookingIngredientConverter({
  initialIngredientSlug = "flour",
  initialFromUnitId = "cup",
  initialToUnitId = "g",
  initialValue = 1,
  navigateOnIngredientChange = false,
}: CookingIngredientConverterProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(initialIngredientSlug);
  const [standardIdx, setStandardIdx] = useState(0);
  const [fromUnitId, setFromUnitId] = useState(initialFromUnitId);
  const [toUnitId, setToUnitId] = useState(initialToUnitId);
  const [inputValue, setInputValue] = useState<string>(String(initialValue));
  const [copied, setCopied] = useState(false);

  const activeIngredient: CookingIngredient = useMemo(() => {
    return (
      COOKING_INGREDIENTS.find((item) => item.slug === selectedSlug) ||
      COOKING_INGREDIENTS[0]
    );
  }, [selectedSlug]);

  const activeStandard = useMemo(() => {
    return (
      activeIngredient.standards[standardIdx] || activeIngredient.standards[0]
    );
  }, [activeIngredient, standardIdx]);

  const numericInput = parseFloat(inputValue);
  const isValidInput = Number.isFinite(numericInput) && numericInput >= 0;
  const effectiveValue = isValidInput ? numericInput : 0;

  const conversionResult = useMemo(() => {
    return convertCookingIngredient(
      effectiveValue,
      fromUnitId,
      toUnitId,
      activeStandard.densityGPerMl
    );
  }, [effectiveValue, fromUnitId, toUnitId, activeStandard.densityGPerMl]);

  // Core simultaneous equivalents: grams, US cups, Metric cups, tbsp, tsp, mL, oz
  const coreEquivalents = useMemo(() => {
    return CORE_EQUIVALENT_UNIT_IDS.map((targetId) => {
      const unit = COOKING_UNIT_MAP.get(targetId)!;
      const res = convertCookingIngredient(
        effectiveValue,
        fromUnitId,
        targetId,
        activeStandard.densityGPerMl
      );
      return {
        unit,
        formatted: res.formattedOutput,
      };
    });
  }, [effectiveValue, fromUnitId, activeStandard.densityGPerMl]);

  const handleIngredientSelect = (newSlug: string) => {
    setSelectedSlug(newSlug);
    setStandardIdx(0);
    if (navigateOnIngredientChange && newSlug !== initialIngredientSlug) {
      router.push(`/cooking/${newSlug}`);
    }
  };

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleReset = () => {
    setInputValue("1");
    setFromUnitId("cup");
    setToUnitId("g");
    setStandardIdx(0);
  };

  const handleCopy = () => {
    if (!isValidInput) return;
    const text = `${conversionResult.formattedOutput} ${conversionResult.toUnit.symbol} (${activeIngredient.shortName})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const massUnits = COOKING_UNITS.filter((u) => u.kind === "mass");
  const volumeUnits = COOKING_UNITS.filter((u) => u.kind === "volume");

  return (
    <div className="space-y-5">
      {/* Visible Approximate Results Disclaimer Banner */}
      <div
        role="note"
        aria-label="Cooking conversion accuracy disclaimer"
        className="rounded-2xl border border-amber-300/90 dark:border-amber-700/80 bg-amber-50/90 dark:bg-amber-950/40 px-4 py-3.5 flex items-start gap-3 shadow-2xs"
      >
        <AlertTriangle
          className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="text-sm sm:text-base text-amber-950 dark:text-amber-200 leading-relaxed">
          <strong className="font-extrabold">
            Disclaimer: Cooking results are approximate.
          </strong>{" "}
          <span className="font-medium">{COOKING_PACKING_NOTE}</span> For
          critical baking recipes, weighing ingredients in grams on a digital
          scale is recommended.
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-4 sm:p-6 space-y-5">
        {/* Card Header with Ingredient Selector + Density Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white leading-tight">
                {activeIngredient.name} Weight ↔ Volume Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Convert grams ↔ US cups (236.59 mL), Metric cups (250 mL), tbsp,
                tsp, mL, and oz
              </p>
            </div>
          </div>

          {/* Active Density & Verification Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] tabular-nums">
              <span>
                ρ = {activeStandard.densityGPerMl} g/mL · 1 US cup ={" "}
                {activeStandard.gramsPerUsCup} g · 1 Metric cup ={" "}
                {activeStandard.gramsPerMetricCup} g
              </span>
            </span>

            {activeStandard.verificationStatus === "verified" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Verified Source</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Needs human verification</span>
              </span>
            )}
          </div>
        </div>

        {/* Row 1: Ingredient Selector + Reference Standard Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Ingredient Dropdown */}
          <div className="space-y-1.5">
            <label
              htmlFor="cooking-ingredient-select"
              className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
            >
              1. Select Ingredient
            </label>
            <select
              suppressHydrationWarning
              id="cooking-ingredient-select"
              value={selectedSlug}
              onChange={(e) => handleIngredientSelect(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 cursor-pointer"
            >
              {COOKING_INGREDIENTS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name} ({item.gramsPerUsCup} g/US cup ·{" "}
                  {item.gramsPerMetricCup} g/Metric cup)
                </option>
              ))}
            </select>
          </div>

          {/* Published Reference Standard Selector */}
          <div className="space-y-1.5">
            <label
              htmlFor="cooking-standard-select"
              className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
            >
              2. Published Density Reference
            </label>
            <select
              suppressHydrationWarning
              id="cooking-standard-select"
              value={standardIdx}
              onChange={(e) => setStandardIdx(Number(e.target.value))}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-sm sm:text-base font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 cursor-pointer"
            >
              {activeIngredient.standards.map((std, idx) => (
                <option key={std.id} value={idx}>
                  {std.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Ingredient Switcher Links */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
            Ingredients:
          </span>
          {COOKING_INGREDIENTS.map((item) => {
            const isActive = item.slug === selectedSlug;
            return (
              <Link
                key={item.slug}
                href={`/cooking/${item.slug}`}
                onClick={(e) => {
                  if (!navigateOnIngredientChange) {
                    e.preventDefault();
                    handleIngredientSelect(item.slug);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs sm:text-[13px] font-bold transition-colors ${
                  isActive
                    ? "bg-[#16324F] dark:bg-[#0D9488] text-white dark:text-slate-950 shadow-2xs"
                    : "bg-[#F7F9FC] dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:border-[#0D9488] border border-slate-200/80 dark:border-slate-700"
                }`}
              >
                {item.shortName}
              </Link>
            );
          })}
        </div>

        {/* Row 2: Amount Input + From Unit + Swap + To Unit */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end pt-1">
          {/* Amount Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label
              htmlFor="cooking-amount-input"
              className="block text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              Amount
            </label>
            <input
              suppressHydrationWarning
              id="cooking-amount-input"
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="1"
              className="w-full min-h-[48px] px-4 py-2.5 text-lg sm:text-xl font-extrabold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 tabular-nums"
            />
          </div>

          {/* From Unit */}
          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor="cooking-from-unit"
              className="block text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              From Unit
            </label>
            <select
              suppressHydrationWarning
              id="cooking-from-unit"
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full min-h-[48px] px-3 py-2.5 text-base font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] cursor-pointer"
            >
              <optgroup label="Volume Units (US, Metric & UK)">
                {volumeUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Weight / Mass Units">
                {massUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleSwap}
              className="w-full md:w-auto min-w-[48px] min-h-[48px] px-4 rounded-xl bg-[#0D9488]/12 hover:bg-[#0D9488] text-[#16324F] hover:text-white dark:bg-[#0D9488]/20 dark:text-[#2DD4BF] dark:hover:bg-[#0D9488] dark:hover:text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Swap From and To units"
              aria-label="Swap From and To units"
            >
              <ArrowLeftRight className="w-5 h-5" />
              <span className="md:hidden">Swap Units</span>
            </button>
          </div>

          {/* To Unit */}
          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor="cooking-to-unit"
              className="block text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              To Unit
            </label>
            <select
              suppressHydrationWarning
              id="cooking-to-unit"
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full min-h-[48px] px-3 py-2.5 text-base font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-hidden focus:border-[#0D9488] cursor-pointer"
            >
              <optgroup label="Weight / Mass Units">
                {massUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Volume Units (US, Metric & UK)">
                {volumeUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Quick Kitchen Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
            Quick presets:
          </span>
          {QUICK_VOLUME_PRESETS.map((preset) => (
            <button
              suppressHydrationWarning
              key={preset.label}
              type="button"
              onClick={() => {
                setInputValue(String(preset.value));
                setFromUnitId(preset.unitId);
                setToUnitId(preset.unitId === "g" ? "cup" : "g");
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 hover:border-[#0D9488] text-xs font-semibold text-[#16324F] dark:text-slate-200 cursor-pointer transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Primary Result Display Box */}
        <div className="rounded-2xl bg-[#0D9488]/10 dark:bg-[#0D9488]/15 border border-[#0D9488]/30 dark:border-[#0D9488]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              {isValidInput
                ? `${inputValue} ${conversionResult.fromUnit.plural}`
                : "Result"}{" "}
              of{" "}
              <span className="font-bold text-[#16324F] dark:text-white">
                {activeIngredient.name}
              </span>{" "}
              equals:
            </div>
            <div
              className="text-2xl sm:text-4xl font-extrabold text-[#16324F] dark:text-white tabular-nums"
              aria-live="polite"
            >
              {isValidInput ? conversionResult.formattedOutput : "—"}{" "}
              <span className="text-lg sm:text-2xl font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                {conversionResult.toUnit.symbol}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
              {conversionResult.stepExplanation}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleReset}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-[#16324F] dark:text-white inline-flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-xs sm:text-sm font-bold text-white inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Simultaneous Equivalents Grid: grams <-> US cups / Metric cups / tbsp / tsp / mL / oz */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#16324F] dark:text-slate-200">
            Instant Equivalents for {isValidInput ? inputValue : 0}{" "}
            {conversionResult.fromUnit.symbol} of {activeIngredient.shortName}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {coreEquivalents.map((item) => (
              <div
                key={item.unit.id}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-3 text-center space-y-0.5"
              >
                <div className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white tabular-nums">
                  {isValidInput ? item.formatted : "—"}
                </div>
                <div className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                  {item.unit.plural}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Packing, Brand & Humidity Note + Published Source Citation */}
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950/90 p-4 space-y-3 text-sm sm:text-base leading-relaxed">
          <div className="flex items-start gap-2.5 text-[#16324F] dark:text-slate-200">
            <Info className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-1" />
            <div>
              <strong className="font-extrabold">Measurement Note:</strong>{" "}
              <span className="font-semibold underline decoration-[#0D9488]/50 underline-offset-2">
                {COOKING_PACKING_NOTE}
              </span>{" "}
              <span>{activeIngredient.culinaryTip}</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#16324F] dark:text-slate-200">
                  Published Density Source ({activeStandard.sourceOrganization}
                  {activeStandard.fdcId ? ` — ${activeStandard.fdcId}` : ""}):
                </span>{" "}
                <span>{activeStandard.sourceCitation}</span>
              </div>
            </div>
            <a
              href={activeStandard.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
            >
              <span>Verify Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
