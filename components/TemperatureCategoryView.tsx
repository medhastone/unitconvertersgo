"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Thermometer,
  ArrowLeftRight,
  ArrowUpDown,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Info,
  AlertTriangle,
  Table,
  Calculator,
  Link2,
  HelpCircle,
  Lightbulb,
  Scale,
  Grid,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { Unit } from "@/lib/conversions/types";
import { convertUnits, formatValue } from "@/lib/conversions/engine";
import {
  getMoreUnitConversionLinks,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { getTrustedReferencesForCategory } from "@/lib/conversions/references";

interface TemperatureCategoryViewProps {
  units: Unit[];
  faqs: { question: string; answer: string }[];
}

interface ReferencePoint {
  description: string;
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  badge?: string;
}

const REFERENCE_POINTS: ReferencePoint[] = [
  {
    description: "Absolute zero",
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0,
    badge: "0 K limit",
  },
  {
    description: "Water freezing point (at 1 atm)",
    celsius: 0,
    fahrenheit: 32,
    kelvin: 273.15,
  },
  {
    description: "Comfortable room temperature",
    celsius: 20,
    fahrenheit: 68,
    kelvin: 293.15,
  },
  {
    description: "Typical warm day (25 °C benchmark)",
    celsius: 25,
    fahrenheit: 77,
    kelvin: 298.15,
  },
  {
    description: "Normal human body temperature",
    celsius: 37,
    fahrenheit: 98.6,
    kelvin: 310.15,
  },
  {
    description: "Water boiling point (at 1 atm)",
    celsius: 100,
    fahrenheit: 212,
    kelvin: 373.15,
  },
  {
    description: "Typical hot day",
    celsius: 35,
    fahrenheit: 95,
    kelvin: 308.15,
  },
];

const ABSOLUTE_ZERO_BY_UNIT: Record<string, { min: number; label: string }> = {
  celsius: { min: -273.15, label: "-273.15 °C" },
  fahrenheit: { min: -459.67, label: "-459.67 °F" },
  kelvin: { min: 0, label: "0 K" },
  rankine: { min: 0, label: "0 °R" },
};

const PRIMARY_VISUAL_UNITS = [
  { id: "celsius", label: "Celsius (°C)", shortSymbol: "°C" },
  { id: "fahrenheit", label: "Fahrenheit (°F)", shortSymbol: "°F" },
  { id: "kelvin", label: "Kelvin (K)", shortSymbol: "K" },
];

const RELATED_TEMPERATURE_CONVERTERS = [
  {
    slug: "fahrenheit-to-celsius",
    title: "Fahrenheit to Celsius",
    subtitle: "Convert °F to °C",
    badgeClass:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/60",
  },
  {
    slug: "celsius-to-kelvin",
    title: "Celsius to Kelvin",
    subtitle: "Convert °C to K",
    badgeClass:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/60",
  },
  {
    slug: "kelvin-to-celsius",
    title: "Kelvin to Celsius",
    subtitle: "Convert K to °C",
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60",
  },
  {
    slug: "fahrenheit-to-kelvin",
    title: "Fahrenheit to Kelvin",
    subtitle: "Convert °F to K",
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/60",
  },
  {
    slug: "kelvin-to-fahrenheit",
    title: "Kelvin to Fahrenheit",
    subtitle: "Convert K to °F",
    badgeClass:
      "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200/80 dark:border-violet-800/60",
  },
];

const SIDEBAR_CONVERTER_LINKS = [
  { slug: "celsius-to-fahrenheit", label: "Celsius to Fahrenheit", active: true },
  { slug: "fahrenheit-to-celsius", label: "Fahrenheit to Celsius", active: false },
  { slug: "celsius-to-kelvin", label: "Celsius to Kelvin", active: false },
  { slug: "kelvin-to-celsius", label: "Kelvin to Celsius", active: false },
  { slug: "fahrenheit-to-kelvin", label: "Fahrenheit to Kelvin", active: false },
  { slug: "kelvin-to-fahrenheit", label: "Kelvin to Fahrenheit", active: false },
];

const SIDEBAR_RELATED_CATEGORIES = [
  { id: "length", label: "Length Converter" },
  { id: "mass", label: "Weight & Mass Converter" },
  { id: "area", label: "Area Converter" },
  { id: "volume", label: "Volume Converter" },
  { id: "speed", label: "Speed Converter" },
  { id: "energy", label: "Energy Converter" },
];

export default function TemperatureCategoryView({
  units,
  faqs,
}: TemperatureCategoryViewProps) {
  const [inputValue, setInputValue] = useState<string>("25");
  const [fromUnitId, setFromUnitId] = useState<string>("celsius");
  const [toUnitId, setToUnitId] = useState<string>("fahrenheit");
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [inputValue]);

  const fromUnit = useMemo(
    () => units.find((u) => u.id === fromUnitId) || units[0],
    [units, fromUnitId]
  );

  const toUnit = useMemo(
    () => units.find((u) => u.id === toUnitId) || units[1] || units[0],
    [units, toUnitId]
  );

  // Validation: check empty/non-numeric or below physical absolute zero
  const validationWarning = useMemo(() => {
    if (inputValue.trim() === "") {
      return "Enter a numeric temperature value above to see the conversion.";
    }
    if (Number.isNaN(numericValue)) {
      return "Please enter a valid number (for example: 25, 0, -40, or 98.6).";
    }
    const limit = ABSOLUTE_ZERO_BY_UNIT[fromUnitId];
    if (limit && numericValue < limit.min - 1e-6) {
      return `Note: ${numericValue} ${fromUnit.symbol} is below physical absolute zero (${limit.label}, where thermal motion ceases). Showing mathematical extrapolation.`;
    }
    return null;
  }, [inputValue, numericValue, fromUnitId, fromUnit]);

  const conversionResult = useMemo(() => {
    if (Number.isNaN(numericValue)) {
      return null;
    }
    return convertUnits(numericValue, fromUnit.id, toUnit.id, "auto");
  }, [numericValue, fromUnit, toUnit]);

  // Simultaneous equivalents in Celsius, Fahrenheit, and Kelvin
  const allThreeScales = useMemo(() => {
    const val = Number.isNaN(numericValue) ? 25 : numericValue;
    const c = convertUnits(val, fromUnit.id, "celsius", "auto");
    const f = convertUnits(val, fromUnit.id, "fahrenheit", "auto");
    const k = convertUnits(val, fromUnit.id, "kelvin", "auto");
    return {
      celsius: formatValue(c.rawValue, "auto"),
      fahrenheit: formatValue(f.rawValue, "auto"),
      kelvin: formatValue(k.rawValue, "auto"),
    };
  }, [numericValue, fromUnit]);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleReset = () => {
    setInputValue("25");
    setFromUnitId("celsius");
    setToUnitId("fahrenheit");
  };

  const handleVisualUnitClick = (clickedId: string) => {
    if (clickedId === fromUnitId) return;
    if (clickedId === toUnitId) {
      handleSwap();
      return;
    }
    setFromUnitId(clickedId);
  };

  const handleSelectPresetValue = (
    val: number,
    sourceUnitId?: string,
    targetUnitId?: string,
    scrollToConverter = false
  ) => {
    if (sourceUnitId) setFromUnitId(sourceUnitId);
    if (targetUnitId) setToUnitId(targetUnitId);
    setInputValue(String(val));
    if (scrollToConverter && typeof window !== "undefined") {
      const targetUrl = `${window.location.pathname}?value=${encodeURIComponent(
        String(val)
      )}#converter-tool-section`;
      window.history.replaceState(null, "", targetUrl);

      const converterEl = document.getElementById("converter-tool-section");
      if (converterEl) {
        converterEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const inputEl = document.getElementById(
        "temp-value-input"
      ) as HTMLInputElement | null;
      if (inputEl) {
        setTimeout(() => {
          inputEl.focus({ preventScroll: true });
        }, 300);
      }
    }
  };

  const handleCopy = async () => {
    if (!conversionResult) return;
    const textToCopy = `${conversionResult.formattedValue} ${toUnit.symbol}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const displayResultText = conversionResult
    ? `${conversionResult.formattedValue} ${toUnit.symbol}`
    : "—";

  const summaryEquationText = conversionResult
    ? `${inputValue.trim() || "0"} ${fromUnit.symbol} = ${conversionResult.formattedValue} ${toUnit.symbol}`
    : "Enter a temperature value";

  return (
    <div className="space-y-8">
      {/* =====================================================================
          HERO SECTION: Rose Thermometer Badge + Title + Visual Scale Graphic
          ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 max-w-2xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800/70 text-rose-500 dark:text-rose-400 shadow-xs flex items-center justify-center shrink-0">
            <Thermometer className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white">
              Temperature Converter
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Convert temperatures between Celsius, Fahrenheit, and Kelvin.
            </p>
          </div>
        </div>

        {/* Visual Scale Badges Graphic (Desktop) */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-rose-50/60 to-teal-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0"
        >
          <span className="px-2.5 py-1 rounded-lg bg-sky-100/90 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-xs font-extrabold shadow-2xs">
            °C
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-100/90 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-mono text-xs font-extrabold shadow-2xs">
            °F
          </span>
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-rose-200/80 dark:border-slate-700 flex items-center justify-center text-rose-500 shadow-2xs">
            <Thermometer className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-teal-100/90 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono text-xs font-extrabold shadow-2xs">
            K
          </span>
        </div>
      </div>

      {/* =====================================================================
          TWO-COLUMN RESPONSIVE DASHBOARD GRID
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* ===================================================================
            LEFT MAIN COLUMN (8 cols on lg)
            =================================================================== */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. MAIN TEMPERATURE CONVERTER CARD */}
          <section
            id="converter-tool-section"
            aria-label="Temperature Converter Calculator"
            className="scroll-mt-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
          >
            {/* Card Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
                  <ArrowUpDown className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                    Convert Temperature
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Enter a value and select the units to convert between Celsius, Fahrenheit, and Kelvin.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
                <span>Instant conversion</span>
              </span>
            </div>

            {/* Mobile-First Form Row: Value + From + Swap + To */}
            <div suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
              {/* Value Input */}
              <div className="sm:col-span-3 space-y-1.5">
                <label
                  htmlFor="temp-value-input"
                  className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
                >
                  Value
                </label>
                <input
                  suppressHydrationWarning
                  id="temp-value-input"
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="25"
                  className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                />
              </div>

              {/* From Unit Selector */}
              <div className="sm:col-span-4 space-y-1.5">
                <label
                  htmlFor="temp-from-select"
                  className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
                >
                  From
                </label>
                <select
                  suppressHydrationWarning
                  id="temp-from-select"
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-sm font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Control */}
              <div className="sm:col-span-1 flex justify-center">
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={handleSwap}
                  title="Swap From and To temperature units"
                  aria-label="Swap From and To temperature units"
                  className="w-full sm:w-12 h-11 sm:h-12 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/70 hover:bg-[#0D9488] text-[#0F766E] dark:text-teal-300 hover:text-white border border-[#0D9488]/30 flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span className="sm:hidden text-xs font-bold">Swap Units</span>
                </button>
              </div>

              {/* To Unit Selector */}
              <div className="sm:col-span-4 space-y-1.5">
                <label
                  htmlFor="temp-to-select"
                  className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
                >
                  To
                </label>
                <select
                  suppressHydrationWarning
                  id="temp-to-select"
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-sm font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Helpful Validation / Physical Absolute Zero Notice */}
            {validationWarning && (
              <div
                role="status"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs sm:text-sm text-amber-900 dark:text-amber-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{validationWarning}</span>
              </div>
            )}

            {/* Prominent Result Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Result
                </span>
                {(inputValue !== "25" ||
                  fromUnitId !== "celsius" ||
                  toUnitId !== "fahrenheit") && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to 25 °C</span>
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#E6FAF8]/85 dark:bg-teal-950/35 border border-[#0D9488]/30 flex flex-wrap items-center justify-between gap-4">
                <div
                  aria-live="polite"
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white break-all"
                >
                  {displayResultText}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!conversionResult}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Equation & Simultaneous 3-Scale Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span>{summaryEquationText}</span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {allThreeScales.celsius} °C = {allThreeScales.fahrenheit} °F ={" "}
                    {allThreeScales.kelvin} K
                  </span>
                  <Link
                    href="/widgets/w/temperature-converter"
                    prefetch={false}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 hover:border-[#0D9488] border border-slate-200/90 dark:border-slate-700 text-xs font-extrabold text-[#16324F] dark:text-teal-300 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
                    <span>Get Widget</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Compact Visual Unit Selector for Celsius, Fahrenheit, and Kelvin */}
            <div className="space-y-2 pt-1">
              <div
                role="group"
                aria-label="Quick temperature scale selector"
                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
              >
                {PRIMARY_VISUAL_UNITS.map((item) => {
                  const isSource = fromUnitId === item.id;
                  const isTarget = toUnitId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleVisualUnitClick(item.id)}
                      aria-pressed={isSource}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                        isSource
                          ? "bg-[#E6FAF8]/90 dark:bg-teal-950/60 text-[#16324F] dark:text-white border-[#0D9488] shadow-2xs"
                          : isTarget
                          ? "bg-[#F7F9FC] dark:bg-slate-800/80 text-[#16324F] dark:text-slate-200 border-[#0D9488]/40"
                          : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488]/60"
                      }`}
                    >
                      {item.id === "kelvin" ? (
                        <span className="font-mono font-extrabold text-[#16324F] dark:text-teal-300">
                          K
                        </span>
                      ) : (
                        <Thermometer
                          className={`w-4 h-4 ${
                            isSource
                              ? "text-[#0D9488]"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        />
                      )}
                      <span>{item.label}</span>
                      {isSource && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0D9488] text-white">
                          From
                        </span>
                      )}
                      {isTarget && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[#16324F] dark:text-slate-200">
                          To
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>
                  You can change the units using the dropdowns above or click on a unit button.
                </span>
              </p>
            </div>

            {/* Suggested Conversions inside Tool Box */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Suggested Conversions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 0, label: `0 ${fromUnit.symbol} (Freezing Reference)` },
                  { value: 20, label: `20 ${fromUnit.symbol} (Room Comfort)` },
                  { value: 25, label: `25 ${fromUnit.symbol} (Ambient Lab)` },
                  { value: 37, label: `37 ${fromUnit.symbol} (Body Reference)` },
                  { value: 100, label: `100 ${fromUnit.symbol} (Boiling / Benchmark)` },
                  { value: 180, label: `180 ${fromUnit.symbol} (Baking Benchmark)` },
                ].map((preset) => {
                  const isSelected = Number(inputValue) === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() =>
                        handleSelectPresetValue(
                          preset.value,
                          undefined,
                          undefined,
                          true
                        )
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#0D9488] text-white border-[#0D9488] shadow-2xs"
                          : "bg-[#F7F9FC] dark:bg-slate-800/70 text-[#16324F] dark:text-slate-200 border-slate-200/90 dark:border-slate-700 hover:border-[#0D9488] hover:text-[#0D9488] dark:hover:text-[#2DD4BF]"
                      }`}
                    >
                      <span>{preset.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-75 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 2. COMMON TEMPERATURE REFERENCE POINTS TABLE */}
          <section
            aria-labelledby="reference-points-heading"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                <Table className="w-5 h-5" />
              </span>
              <div>
                <h2
                  id="reference-points-heading"
                  className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                >
                  Common Temperature Reference Points
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Here are some common temperature values in Celsius, Fahrenheit, and Kelvin. Click any preset value or arrow to load it into the converter.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F9FC] dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Celsius (°C)</th>
                    <th className="py-3 px-4">Fahrenheit (°F)</th>
                    <th className="py-3 px-4">Kelvin (K)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-xs sm:text-sm">
                  {REFERENCE_POINTS.map((row) => {
                    const isSelected =
                      fromUnitId === "celsius" &&
                      Math.abs(numericValue - row.celsius) < 0.001;
                    return (
                      <tr
                        key={row.description}
                        tabIndex={0}
                        onClick={() =>
                          handleSelectPresetValue(
                            row.celsius,
                            "celsius",
                            "fahrenheit",
                            true
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectPresetValue(
                              row.celsius,
                              "celsius",
                              "fahrenheit",
                              true
                            );
                          }
                        }}
                        title={`Click to convert ${row.celsius} °C in calculator`}
                        className={`group/row transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#E6FAF8]/60 dark:bg-teal-950/30 font-bold"
                            : "hover:bg-[#F7F9FC] dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-[#16324F] dark:text-slate-200">
                          {row.description}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums font-bold text-[#16324F] dark:text-slate-100 group-hover/row:text-[#0D9488] dark:group-hover/row:text-[#2DD4BF] transition-colors">
                          {row.celsius}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {row.fahrenheit}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          <a
                            href={`?value=${encodeURIComponent(String(row.celsius))}#converter-tool-section`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectPresetValue(
                                row.celsius,
                                "celsius",
                                "fahrenheit",
                                true
                              );
                            }}
                            title={`Convert preset value ${row.celsius} °C in calculator`}
                            aria-label={`Convert preset value ${row.celsius} °C in calculator`}
                            className="flex items-center justify-between gap-2 w-full text-slate-700 dark:text-slate-300 group-hover/row:text-[#0D9488] dark:group-hover/row:text-[#2DD4BF] transition-colors cursor-pointer"
                          >
                            <span>{row.kelvin}</span>
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-md border transition-all shrink-0 ${
                                isSelected
                                  ? "bg-[#0D9488] text-white border-[#0D9488]"
                                  : "bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0D9488] dark:text-[#2DD4BF] border-[#0D9488]/30 group-hover/row:bg-[#0D9488] group-hover/row:text-white group-hover/row:border-[#0D9488]"
                              }`}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. TEMPERATURE CONVERSION FORMULAS SECTION */}
          <section
            aria-labelledby="temperature-formulas-heading"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5">
                <Calculator className="w-5 h-5" />
              </span>
              <div>
                <h2
                  id="temperature-formulas-heading"
                  className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                >
                  Temperature Conversion Formulas
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Use the following formulas to convert between Celsius, Fahrenheit, and Kelvin.
                </p>
              </div>
            </div>

            {/* 3 Formula Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Celsius to Fahrenheit */}
              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#16324F] dark:text-white">
                    Celsius to Fahrenheit
                  </div>
                  <div className="mt-1 font-mono text-sm font-extrabold text-[#16324F] dark:text-rose-200">
                    °F = (°C × 9/5) + 32
                  </div>
                </div>
              </div>

              {/* Fahrenheit to Celsius */}
              <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#16324F] dark:text-white">
                    Fahrenheit to Celsius
                  </div>
                  <div className="mt-1 font-mono text-sm font-extrabold text-[#16324F] dark:text-sky-200">
                    °C = (°F − 32) × 5/9
                  </div>
                </div>
              </div>

              {/* Celsius to Kelvin */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#16324F] dark:text-white">
                    Celsius to Kelvin
                  </div>
                  <div className="mt-1 font-mono text-sm font-extrabold text-[#16324F] dark:text-emerald-200">
                    K = °C + 273.15
                  </div>
                </div>
              </div>
            </div>

            {/* Worked Example Callout Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
              <div className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white">
                Example: Convert 25 °C to Fahrenheit
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <div>°F = (25 × 9/5) + 32</div>
                <div>°F = (25 × 1.8) + 32 = 45 + 32 = 77 °F</div>
              </div>
              <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">
                Because Celsius, Fahrenheit, and Kelvin have different zero points (0 °C = 32 °F = 273.15 K), temperature cannot be converted by simple multiplication alone—you must apply both the scale ratio and the zero-point offset.
              </p>
            </div>
          </section>

          {/* 4. MORE [UNIT A] & [UNIT B] CONVERSIONS (Complete Internal Linking Lists) */}
          {(() => {
            const moreLinks = getMoreUnitConversionLinks(fromUnit, toUnit);
            return (
              <section
                aria-labelledby="related-temp-converters-heading"
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
              >
                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF]">
                    <Link2 className="w-4 h-4" />
                  </span>
                  <h2
                    id="related-temp-converters-heading"
                    className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                  >
                    {moreLinks.sectionHeading}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                      {moreLinks.fromHeading}
                    </h3>
                    <ul className="space-y-1.5">
                      {moreLinks.fromLinks.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white hover:underline transition-colors py-0.5"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                      {moreLinks.toHeading}
                    </h3>
                    <ul className="space-y-1.5">
                      {moreLinks.toLinks.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white hover:underline transition-colors py-0.5"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* 5. FREQUENTLY ASKED QUESTIONS (Interactive Accordion) */}
          <section
            aria-labelledby="temp-faq-heading"
            className="space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100/90 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <HelpCircle className="w-4 h-4" />
              </span>
              <h2
                id="temp-faq-heading"
                className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : idx)
                      }
                      aria-expanded={isOpen}
                      className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white hover:bg-[#F7F9FC] dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-[#0D9488]" : ""
                        }`}
                      />
                    </button>
                    <div
                      hidden={!isOpen}
                      className={
                        isOpen
                          ? "px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80"
                          : "hidden"
                      }
                    >
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ===================================================================
            RIGHT SIDEBAR COLUMN (4 cols on lg)
            =================================================================== */}
        <aside className="lg:col-span-4 space-y-6">
          {/* 1. Temperature Converter Quick Pair Links */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5 pb-1">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500">
                <Thermometer className="w-4 h-4" />
              </span>
              <h2 className="text-base font-extrabold text-[#16324F] dark:text-white">
                Temperature Converter
              </h2>
            </div>

            <nav aria-label="Temperature pair converters" className="space-y-1">
              {SIDEBAR_CONVERTER_LINKS.map((item) => (
                <Link
                  key={item.slug}
                  href={`/temperature/${item.slug}.htm`}
                  prefetch={false}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    item.active
                      ? "bg-sky-50/90 dark:bg-sky-950/50 text-[#16324F] dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/60"
                      : "text-slate-700 dark:text-slate-300 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 hover:text-[#0D9488]"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </nav>
          </div>

          {/* 2. Quick Info Card */}
          <div className="rounded-2xl bg-amber-50/55 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
              <h2 className="text-base font-extrabold text-[#16324F] dark:text-white">
                Quick Info
              </h2>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
              <li>
                <strong className="text-[#16324F] dark:text-white">
                  Celsius (°C)
                </strong>{" "}
                is widely used worldwide for everyday temperature measurement.
              </li>
              <li>
                <strong className="text-[#16324F] dark:text-white">
                  Fahrenheit (°F)
                </strong>{" "}
                is commonly used in the United States.
              </li>
              <li>
                <strong className="text-[#16324F] dark:text-white">
                  Kelvin (K)
                </strong>{" "}
                is the SI unit of temperature and used in science and engineering.
              </li>
              <li>
                Temperature conversion is not a simple multiplication. Each scale has a different zero point.
              </li>
            </ul>
          </div>

          {/* 3. Temperature Scales Comparison Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-[#0D9488]" />
              <h2 className="text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white">
                Temperature Scales Comparison
              </h2>
            </div>

            <div className="space-y-3">
              {/* Celsius */}
              <div className="p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-extrabold text-[#16324F] dark:text-white">
                    Celsius (°C)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Based on the freezing (0 °C) and boiling (100 °C) points of water. Widely used globally.
                  </p>
                </div>
              </div>

              {/* Fahrenheit */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-extrabold text-[#16324F] dark:text-white">
                    Fahrenheit (°F)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Commonly used in the United States. Freezing point at 32 °F and boiling point at 212 °F.
                  </p>
                </div>
              </div>

              {/* Kelvin */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-extrabold text-[#16324F] dark:text-white">
                    Kelvin (K)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    The SI unit of temperature. Absolute scale with zero at absolute zero (-273.15 °C).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Clean Compact References Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0" />
              <h2 className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white">
                References
              </h2>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {getTrustedReferencesForCategory("temperature").map((ref, idx) => (
                <li
                  key={idx}
                  className="flex items-start justify-between gap-2 py-1 border-b border-slate-100/80 dark:border-slate-800/60 last:border-0"
                >
                  <div className="min-w-0 leading-snug">
                    <span className="font-mono font-bold text-[#0D9488] dark:text-teal-400 mr-1.5">
                      [{idx + 1}]
                    </span>
                    <span className="font-semibold text-[#16324F] dark:text-slate-200">
                      {ref.shortName}
                    </span>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <span className="text-slate-500 dark:text-slate-400">
                      {ref.standardCode}
                    </span>
                  </div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Related Categories Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 pb-1">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488]">
                <Grid className="w-4 h-4" />
              </span>
              <h2 className="text-base font-extrabold text-[#16324F] dark:text-white">
                Related Categories
              </h2>
            </div>

            <nav aria-label="Related measurement categories" className="divide-y divide-slate-100 dark:divide-slate-800">
              {SIDEBAR_RELATED_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={getCategoryUrl(cat.id)}
                  prefetch={false}
                  className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg text-xs sm:text-sm font-bold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] hover:bg-[#F7F9FC] dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
