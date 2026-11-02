"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import {
  Thermometer,
  Ruler,
  Scale,
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
  Grid,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Code2,
} from "lucide-react";
import { Category, Unit, ConversionPairInfo } from "@/lib/conversions/types";
import { convertUnits, formatValue } from "@/lib/conversions/engine";
import { UNIT_MAP } from "@/lib/conversions/units";
import {
  getMoreUnitConversionLinks,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { getTrustedReferencesForCategory } from "@/lib/conversions/references";
import { getPresetSearchQueries } from "@/lib/conversions/scenarios";
import SharePageButton from "@/components/SharePageButton";

export interface CategoryReferenceRow {
  description: string;
  baseValueInUnit1: number;
}

export interface CategoryFormulaCard {
  label: string;
  equation: string;
}

export interface CategoryDashboardConfig {
  heroBadgeClass: string;
  sidebarIconClass: string;
  primaryUnitIds: [string, string, string];
  referenceRows: CategoryReferenceRow[];
  formulaCards: [CategoryFormulaCard, CategoryFormulaCard, CategoryFormulaCard];
  workedExampleTitle: string;
  workedExampleLines: string[];
  workedExampleNote: string;
  quickInfoBullets: { boldPrefix: string; text: string }[];
  unitComparisonCards: {
    unitId: string;
    title: string;
    description: string;
  }[];
}

interface CategoryDashboardViewProps {
  category: Category;
  displayName: string;
  heroTitle: string;
  heroDescription: string;
  units: Unit[];
  defaultFromId: string;
  defaultToId: string;
  defaultValue: number;
  popularPairs: ConversionPairInfo[];
  faqs: { question: string; answer: string }[];
  relatedCategories: { id: string; label: string }[];
  dashboardConfig?: CategoryDashboardConfig;
}

const ABSOLUTE_ZERO_BY_UNIT: Record<string, { min: number; label: string }> = {
  celsius: { min: -273.15, label: "-273.15 °C" },
  fahrenheit: { min: -459.67, label: "-459.67 °F" },
  kelvin: { min: 0, label: "0 K" },
  rankine: { min: 0, label: "0 °R" },
};

const RELATED_BADGE_CLASSES = [
  "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/60",
  "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/60",
  "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60",
  "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/60",
  "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200/80 dark:border-violet-800/60",
];

function renderCategoryIcon(iconName: string, className = "w-5 h-5") {
  switch (iconName) {
    case "Thermometer":
      return <Thermometer className={className} />;
    case "Ruler":
      return <Ruler className={className} />;
    case "Scale":
      return <Scale className={className} />;
    case "Square":
      return <Square className={className} />;
    case "Beaker":
      return <Beaker className={className} />;
    case "Gauge":
      return <Gauge className={className} />;
    case "Clock":
      return <Clock className={className} />;
    case "CircleDot":
      return <CircleDot className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Activity":
      return <Activity className={className} />;
    case "HardDrive":
      return <HardDrive className={className} />;
    case "ArrowDownUp":
      return <ArrowDownUp className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "RotateCw":
      return <RotateCw className={className} />;
    case "Radio":
      return <Radio className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Fuel":
      return <Fuel className={className} />;
    default:
      return <ArrowLeftRight className={className} />;
  }
}

export default function CategoryDashboardView({
  category,
  displayName,
  heroTitle,
  heroDescription,
  units,
  defaultFromId,
  defaultToId,
  defaultValue,
  popularPairs,
  faqs,
  relatedCategories,
  dashboardConfig,
}: CategoryDashboardViewProps) {
  const [inputValue, setInputValue] = useState<string>(String(defaultValue));
  const deferredInputValue = useDeferredValue(inputValue);
  const [fromUnitId, setFromUnitId] = useState<string>(defaultFromId);
  const [toUnitId, setToUnitId] = useState<string>(defaultToId);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync optional ?from=&to=&value= query parameters from smart search deep links
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const qFrom = params.get("from");
      const qTo = params.get("to");
      const qVal = params.get("value");

      if (qFrom && units.some((u) => u.id === qFrom)) {
        setFromUnitId((prev) => (prev === qFrom ? prev : qFrom));
      }
      if (qTo && units.some((u) => u.id === qTo)) {
        setToUnitId((prev) => (prev === qTo ? prev : qTo));
      }
      if (qVal && Number.isFinite(parseFloat(qVal))) {
        setInputValue((prev) => (prev === qVal ? prev : qVal));
      }
    };
    const rafId = window.requestAnimationFrame(syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [units]);

  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [inputValue]);

  const deferredNumericValue = useMemo(() => {
    const parsed = parseFloat(deferredInputValue);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [deferredInputValue]);

  const fromUnit = useMemo(
    () => units.find((u) => u.id === fromUnitId) || units[0],
    [units, fromUnitId]
  );

  const toUnit = useMemo(
    () => units.find((u) => u.id === toUnitId) || units[1] || units[0],
    [units, toUnitId]
  );

  // Resolve the 3 primary units for visual buttons, reference table columns, and comparison cards
  const primaryThreeUnits = useMemo(() => {
    if (dashboardConfig?.primaryUnitIds) {
      const resolved = dashboardConfig.primaryUnitIds
        .map((id) => units.find((u) => u.id === id))
        .filter((u): u is Unit => Boolean(u));
      if (resolved.length >= 3) {
        return [resolved[0], resolved[1], resolved[2]] as [Unit, Unit, Unit];
      }
    }
    const u0 = units.find((u) => u.id === defaultFromId) || units[0];
    const u1 =
      units.find((u) => u.id === defaultToId && u.id !== u0.id) ||
      units.find((u) => u.id !== u0.id) ||
      u0;
    const u2 =
      units.find((u) => u.id !== u0.id && u.id !== u1.id) || u1;
    return [u0, u1, u2] as [Unit, Unit, Unit];
  }, [dashboardConfig, units, defaultFromId, defaultToId]);

  const [unitCol1, unitCol2, unitCol3] = primaryThreeUnits;

  // Helpful validation messages
  const validationWarning = useMemo(() => {
    if (inputValue.trim() === "") {
      return `Enter a numeric ${displayName.toLowerCase()} value above to see the instant conversion.`;
    }
    if (Number.isNaN(numericValue)) {
      return `Please enter a valid number (for example: ${defaultValue}).`;
    }
    if (category.id === "temperature") {
      const limit = ABSOLUTE_ZERO_BY_UNIT[fromUnitId];
      if (limit && numericValue < limit.min - 1e-6) {
        return `Note: ${numericValue} ${fromUnit.symbol} is below physical absolute zero (${limit.label}, where thermal motion ceases). Showing mathematical extrapolation.`;
      }
    } else if (numericValue < 0) {
      return `Note: Negative ${displayName.toLowerCase()} value entered (${numericValue} ${fromUnit.symbol}). Showing directional magnitude conversion.`;
    }
    return null;
  }, [inputValue, numericValue, category.id, fromUnitId, fromUnit, displayName, defaultValue]);

  const conversionResult = useMemo(() => {
    if (Number.isNaN(numericValue)) {
      return null;
    }
    return convertUnits(numericValue, fromUnit.id, toUnit.id, "auto");
  }, [numericValue, fromUnit, toUnit]);

  // Simultaneous equivalents across the 3 primary units (deferred to keep input INP < 50ms)
  const allThreeScales = useMemo(() => {
    const val = Number.isNaN(deferredNumericValue) ? defaultValue : deferredNumericValue;
    const c1 = convertUnits(val, fromUnit.id, unitCol1.id, "auto");
    const c2 = convertUnits(val, fromUnit.id, unitCol2.id, "auto");
    const c3 = convertUnits(val, fromUnit.id, unitCol3.id, "auto");
    return {
      val1: formatValue(c1.rawValue, "auto"),
      val2: formatValue(c2.rawValue, "auto"),
      val3: formatValue(c3.rawValue, "auto"),
    };
  }, [deferredNumericValue, defaultValue, fromUnit, unitCol1, unitCol2, unitCol3]);

  // Reference Table Rows
  const referenceTableRows = useMemo(() => {
    const rawRows: CategoryReferenceRow[] = dashboardConfig?.referenceRows || [
      { description: `1 ${unitCol1.name.toLowerCase()} unit`, baseValueInUnit1: 1 },
      { description: `5 ${unitCol1.plural.toLowerCase()}`, baseValueInUnit1: 5 },
      { description: `10 ${unitCol1.plural.toLowerCase()} benchmark`, baseValueInUnit1: 10 },
      { description: `25 ${unitCol1.plural.toLowerCase()}`, baseValueInUnit1: 25 },
      { description: `50 ${unitCol1.plural.toLowerCase()}`, baseValueInUnit1: 50 },
      { description: `100 ${unitCol1.plural.toLowerCase()} reference`, baseValueInUnit1: 100 },
    ];

    return rawRows.map((row) => {
      const v1 = formatValue(row.baseValueInUnit1, "auto");
      const v2 = convertUnits(row.baseValueInUnit1, unitCol1.id, unitCol2.id, "auto").formattedValue;
      const v3 = convertUnits(row.baseValueInUnit1, unitCol1.id, unitCol3.id, "auto").formattedValue;
      return {
        description: row.description,
        rawVal1: row.baseValueInUnit1,
        col1: v1,
        col2: v2,
        col3: v3,
      };
    });
  }, [dashboardConfig, unitCol1, unitCol2, unitCol3]);

  // Formula Cards (3 cards)
  const formulaCards = useMemo(() => {
    if (dashboardConfig?.formulaCards) {
      return dashboardConfig.formulaCards;
    }
    const f12 = convertUnits(1, unitCol1.id, unitCol2.id, "auto").formattedValue;
    const f21 = convertUnits(1, unitCol2.id, unitCol1.id, "auto").formattedValue;
    const f13 = convertUnits(1, unitCol1.id, unitCol3.id, "auto").formattedValue;
    return [
      {
        label: `${unitCol1.plural} to ${unitCol2.plural}`,
        equation: `${unitCol2.symbol} = ${unitCol1.symbol} × ${f12}`,
      },
      {
        label: `${unitCol2.plural} to ${unitCol1.plural}`,
        equation: `${unitCol1.symbol} = ${unitCol2.symbol} × ${f21}`,
      },
      {
        label: `${unitCol1.plural} to ${unitCol3.plural}`,
        equation: `${unitCol3.symbol} = ${unitCol1.symbol} × ${f13}`,
      },
    ];
  }, [dashboardConfig, unitCol1, unitCol2, unitCol3]);

  // Worked example details
  const workedExample = useMemo(() => {
    if (dashboardConfig?.workedExampleTitle && dashboardConfig?.workedExampleLines) {
      return {
        title: dashboardConfig.workedExampleTitle,
        lines: dashboardConfig.workedExampleLines,
        note: dashboardConfig.workedExampleNote,
      };
    }
    const oneFactor = convertUnits(1, defaultFromId, defaultToId, "auto").formattedValue;
    const defOut = convertUnits(defaultValue, defaultFromId, defaultToId, "auto").formattedValue;
    const defFrom = units.find((u) => u.id === defaultFromId) || unitCol1;
    const defTo = units.find((u) => u.id === defaultToId) || unitCol2;
    return {
      title: `Example: Convert ${defaultValue} ${defFrom.plural} (${defFrom.symbol}) to ${defTo.plural} (${defTo.symbol})`,
      lines: [
        `1 ${defFrom.symbol} = ${oneFactor} ${defTo.symbol}`,
        `${defaultValue} ${defFrom.symbol} × ${oneFactor} = ${defOut} ${defTo.symbol}`,
      ],
      note: `All ${displayName.toLowerCase()} conversions are anchored to the international SI base unit (${
        UNIT_MAP.get(category.baseUnitId)?.name || category.baseUnitId
      }) for full scientific and engineering accuracy.`,
    };
  }, [dashboardConfig, defaultFromId, defaultToId, defaultValue, units, unitCol1, unitCol2, displayName, category.baseUnitId]);

  // Quick Info Bullets
  const quickInfoBullets = useMemo(() => {
    if (dashboardConfig?.quickInfoBullets) {
      return dashboardConfig.quickInfoBullets;
    }
    const baseUnit = UNIT_MAP.get(category.baseUnitId) || unitCol1;
    return [
      {
        boldPrefix: `${unitCol1.name} (${unitCol1.symbol})`,
        text: `is a primary ${displayName.toLowerCase()} unit used globally across science, commerce, and daily measurement.`,
      },
      {
        boldPrefix: `${unitCol2.name} (${unitCol2.symbol})`,
        text: `is widely used alongside ${unitCol1.symbol} for practical ${displayName.toLowerCase()} specifications and conversions.`,
      },
      {
        boldPrefix: `${baseUnit.name} (${baseUnit.symbol})`,
        text: `serves as the standardized reference base unit anchoring all ${units.length} units in this category.`,
      },
      {
        boldPrefix: "Verified accuracy:",
        text: "All conversion factors follow official NIST SP 811 and ISO/IEC 80000 metrology constants.",
      },
    ];
  }, [dashboardConfig, category.baseUnitId, unitCol1, unitCol2, displayName, units.length]);

  // Unit Comparison Cards (3 stacked cards in right sidebar)
  const unitComparisonCards = useMemo(() => {
    if (dashboardConfig?.unitComparisonCards) {
      return dashboardConfig.unitComparisonCards;
    }
    const uniqueUnits = Array.from(
      new Map([unitCol1, unitCol2, unitCol3].map((u) => [u.id, u])).values()
    );
    return uniqueUnits.map((u) => ({
      unitId: u.id,
      title: `${u.name} (${u.symbol})`,
      description:
        u.description ||
        `Standardized ${u.system ? u.system.replace("_", " ") : ""} unit of ${displayName.toLowerCase()} (${u.plural.toLowerCase()}).`,
    }));
  }, [dashboardConfig, unitCol1, unitCol2, unitCol3, displayName]);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleReset = () => {
    setInputValue(String(defaultValue));
    setFromUnitId(defaultFromId);
    setToUnitId(defaultToId);
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
        "cat-value-input"
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
    : `Enter a ${displayName.toLowerCase()} value`;

  const heroBadgeClass =
    dashboardConfig?.heroBadgeClass ||
    "bg-teal-50 dark:bg-teal-950/60 border-teal-200/80 dark:border-teal-800/70 text-[#0D9488] dark:text-[#2DD4BF]";

  const sidebarIconClass =
    dashboardConfig?.sidebarIconClass ||
    "bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF]";

  const relatedConverterCards = useMemo(() => {
    // Filter out the primary default pair if there are enough pairs so Related Converters highlights the sibling pairs (just like Temperature Converter)
    const defaultSlugMatch = popularPairs.find(
      (p) => p.fromUnitId === defaultFromId && p.toUnitId === defaultToId
    );
    const filtered =
      popularPairs.length > 5 && defaultSlugMatch
        ? popularPairs.filter((p) => p.slug !== defaultSlugMatch.slug)
        : popularPairs;
    return filtered.slice(0, 5);
  }, [popularPairs, defaultFromId, defaultToId]);

  const sidebarPairLinks = useMemo(() => {
    return popularPairs.slice(0, 6);
  }, [popularPairs]);

  return (
    <div className="space-y-8">
      {/* =====================================================================
          HERO SECTION: Colorful Category Icon Badge + Title + Visual Scale Graphic
          ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 max-w-2xl">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border shadow-xs flex items-center justify-center shrink-0 ${heroBadgeClass}`}
          >
            {renderCategoryIcon(category.iconName, "w-8 h-8 stroke-[2.2]")}
          </div>
          <div className="space-y-1.5">
            <h1 className="text-[26px] sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white leading-tight">
              {heroTitle}
            </h1>
            <p className="text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {heroDescription}
            </p>
          </div>
        </div>

        {/* Visual Scale Badges Graphic (Desktop) */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-rose-50/60 to-teal-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0"
        >
          <span className="px-2.5 py-1 rounded-lg bg-sky-100/90 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-xs font-extrabold shadow-2xs">
            {unitCol1.symbol}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-100/90 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-mono text-xs font-extrabold shadow-2xs">
            {unitCol2.symbol}
          </span>
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-[#0D9488] dark:text-[#2DD4BF] shadow-2xs">
            {renderCategoryIcon(category.iconName, "w-5 h-5")}
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-teal-100/90 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono text-xs font-extrabold shadow-2xs">
            {unitCol3.symbol}
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
          {/* 1. MAIN CONVERTER CARD */}
          <section
            id="converter-tool-section"
            aria-label={`${heroTitle} Calculator`}
            className="scroll-mt-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
          >
            {/* Card Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
                  <ArrowUpDown className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                    Convert {displayName}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                    Enter a value and select the units to convert between {unitCol1.plural.toLowerCase()}, {unitCol2.plural.toLowerCase()}, and {unitCol3.plural.toLowerCase()}.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 text-xs sm:text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
                <span>Instant conversion</span>
              </span>
            </div>

            {/* Mobile-First Form Row: Value + From + Swap + To */}
            <div suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
              {/* Value Input */}
              <div className="sm:col-span-3 space-y-1.5">
                <label
                  htmlFor="cat-value-input"
                  className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
                >
                  Value
                </label>
                <input
                  suppressHydrationWarning
                  id="cat-value-input"
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={String(defaultValue)}
                  className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                />
              </div>

              {/* From Unit Selector */}
              <div className="sm:col-span-4 space-y-1.5">
                <label
                  htmlFor="cat-from-select"
                  className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
                >
                  From
                </label>
                <select
                  suppressHydrationWarning
                  id="cat-from-select"
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-base font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
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
                  title={`Swap From and To ${displayName.toLowerCase()} units`}
                  aria-label={`Swap From and To ${displayName.toLowerCase()} units`}
                  className="w-full sm:w-12 h-11 sm:h-12 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/70 hover:bg-[#0D9488] text-[#0F766E] dark:text-teal-300 hover:text-white border border-[#0D9488]/30 flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span className="sm:hidden text-sm font-bold">Swap Units</span>
                </button>
              </div>

              {/* To Unit Selector */}
              <div className="sm:col-span-4 space-y-1.5">
                <label
                  htmlFor="cat-to-select"
                  className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
                >
                  To
                </label>
                <select
                  suppressHydrationWarning
                  id="cat-to-select"
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-base font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Helpful Validation Notice */}
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
                {(inputValue !== String(defaultValue) ||
                  fromUnitId !== defaultFromId ||
                  toUnitId !== defaultToId) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>
                      Reset to {defaultValue} {UNIT_MAP.get(defaultFromId)?.symbol || ""}
                    </span>
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
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
                <span>{summaryEquationText}</span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                    {allThreeScales.val1} {unitCol1.symbol} = {allThreeScales.val2}{" "}
                    {unitCol2.symbol} = {allThreeScales.val3} {unitCol3.symbol}
                  </span>
                  <Link
                    href={`/widgets/w/${category.id.replace(/_/g, "-")}-converter`}
                    prefetch={false}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 hover:border-[#0D9488] border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-teal-300 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
                    <span>Get Widget</span>
                  </Link>
                  <SharePageButton variant="button" label="Share" />
                </div>
              </div>
            </div>

            {/* Compact Visual Unit Selector for the 3 Primary Units */}
            <div className="space-y-2.5 pt-1">
              <div
                role="group"
                aria-label={`Quick ${displayName.toLowerCase()} unit selector`}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
              >
                {Array.from(
                  new Map(primaryThreeUnits.map((u) => [u.id, u])).values()
                ).map((u) => {
                  const isSource = fromUnitId === u.id;
                  const isTarget = toUnitId === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleVisualUnitClick(u.id)}
                      aria-pressed={isSource}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 min-h-[46px] rounded-xl text-sm sm:text-[15px] font-bold transition-all cursor-pointer border ${
                        isSource
                          ? "bg-[#E6FAF8]/90 dark:bg-teal-950/60 text-[#16324F] dark:text-white border-[#0D9488] shadow-2xs"
                          : isTarget
                          ? "bg-[#F7F9FC] dark:bg-slate-800/80 text-[#16324F] dark:text-slate-200 border-[#0D9488]/40"
                          : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488]/60"
                      }`}
                    >
                      <span
                        className={
                          isSource
                            ? "text-[#0D9488]"
                            : "text-slate-500 dark:text-slate-400"
                        }
                      >
                        {renderCategoryIcon(category.iconName, "w-4 h-4")}
                      </span>
                      <span className="truncate">
                        {u.name} ({u.symbol})
                      </span>
                      {isSource && (
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0D9488] text-white shrink-0">
                          From
                        </span>
                      )}
                      {isTarget && (
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[#16324F] dark:text-slate-200 shrink-0">
                          To
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>
                  You can change the units using the dropdowns above or click on a unit button.
                </span>
              </p>
            </div>

            {/* Suggested Conversions inside Tool Box */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-[#0D9488] shrink-0" />
                <span>Suggested Conversions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getPresetSearchQueries(fromUnitId, toUnitId, category.id).map(
                  (preset) => {
                    const isSelected = Number(inputValue) === preset.value;
                    return (
                      <button
                        key={`${preset.value}-${preset.label}`}
                        type="button"
                        onClick={() =>
                          handleSelectPresetValue(
                            preset.value,
                            undefined,
                            undefined,
                            true
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#0D9488] text-white border-[#0D9488] shadow-2xs"
                            : "bg-[#F7F9FC] dark:bg-slate-800/70 text-[#16324F] dark:text-slate-200 border-slate-200/90 dark:border-slate-700 hover:border-[#0D9488] hover:text-[#0D9488] dark:hover:text-[#2DD4BF]"
                        }`}
                      >
                        <span>{preset.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-75 shrink-0" />
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </section>

          {/* 2. COMMON REFERENCE POINTS TABLE */}
          <section
            aria-labelledby="reference-points-heading"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
          >
            <div className="flex items-start gap-3 w-full">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                <Table className="w-5 h-5" />
              </span>
              <div className="space-y-1 flex-1 min-w-0">
                <h2
                  id="reference-points-heading"
                  className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                >
                  Common {displayName} Reference Points
                </h2>
                <p className="w-full text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Here are some common {displayName.toLowerCase()} values in {unitCol1.name} ({unitCol1.symbol}), {unitCol2.name} ({unitCol2.symbol}), and {unitCol3.name} ({unitCol3.symbol}). Click any preset value or arrow to load it into the converter.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F9FC] dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white">
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">
                      {unitCol1.name} ({unitCol1.symbol})
                    </th>
                    <th className="py-3.5 px-4">
                      {unitCol2.name} ({unitCol2.symbol})
                    </th>
                    <th className="py-3.5 px-4">
                      {unitCol3.name} ({unitCol3.symbol})
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-[15px] sm:text-base">
                  {referenceTableRows.map((row) => {
                    const isSelected =
                      fromUnitId === unitCol1.id &&
                      Math.abs(numericValue - row.rawVal1) < 0.0001;
                    return (
                      <tr
                        key={row.description}
                        tabIndex={0}
                        onClick={() =>
                          handleSelectPresetValue(
                            row.rawVal1,
                            unitCol1.id,
                            unitCol2.id,
                            true
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectPresetValue(
                              row.rawVal1,
                              unitCol1.id,
                              unitCol2.id,
                              true
                            );
                          }
                        }}
                        title={`Click to convert ${row.col1} ${unitCol1.symbol} in calculator`}
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
                          {row.col1}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {row.col2}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          <a
                            href={`?value=${encodeURIComponent(String(row.rawVal1))}#converter-tool-section`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectPresetValue(
                                row.rawVal1,
                                unitCol1.id,
                                unitCol2.id,
                                true
                              );
                            }}
                            title={`Convert preset value ${row.col1} ${unitCol1.symbol} in calculator`}
                            aria-label={`Convert preset value ${row.col1} ${unitCol1.symbol} in calculator`}
                            className="flex items-center justify-between gap-2 w-full text-slate-700 dark:text-slate-300 group-hover/row:text-[#0D9488] dark:group-hover/row:text-[#2DD4BF] transition-colors cursor-pointer"
                          >
                            <span>{row.col3}</span>
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

          {/* 3. CONVERSION FORMULAS SECTION */}
          <section
            aria-labelledby="category-formulas-heading"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5">
                <Calculator className="w-5 h-5" />
              </span>
              <div className="space-y-1">
                <h2
                  id="category-formulas-heading"
                  className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                >
                  {displayName} Conversion Formulas
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Use the following formulas to convert between {unitCol1.plural.toLowerCase()}, {unitCol2.plural.toLowerCase()}, and {unitCol3.plural.toLowerCase()}.
                </p>
              </div>
            </div>

            {/* 3 Formula Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Card 1 */}
              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
                  {renderCategoryIcon(category.iconName, "w-5 h-5")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-[#16324F] dark:text-white truncate">
                    {formulaCards[0].label}
                  </div>
                  <div className="mt-1 font-mono text-sm sm:text-base font-extrabold text-[#16324F] dark:text-rose-200 break-words">
                    {formulaCards[0].equation}
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                  {renderCategoryIcon(category.iconName, "w-5 h-5")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-[#16324F] dark:text-white truncate">
                    {formulaCards[1].label}
                  </div>
                  <div className="mt-1 font-mono text-sm sm:text-base font-extrabold text-[#16324F] dark:text-sky-200 break-words">
                    {formulaCards[1].equation}
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  {renderCategoryIcon(category.iconName, "w-5 h-5")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-[#16324F] dark:text-white truncate">
                    {formulaCards[2].label}
                  </div>
                  <div className="mt-1 font-mono text-sm sm:text-base font-extrabold text-[#16324F] dark:text-emerald-200 break-words">
                    {formulaCards[2].equation}
                  </div>
                </div>
              </div>
            </div>

            {/* Worked Example Callout Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 space-y-2">
              <div className="text-base font-extrabold text-[#16324F] dark:text-white">
                {workedExample.title}
              </div>
              <div className="font-mono text-[15px] sm:text-base text-slate-700 dark:text-slate-300 space-y-1">
                {workedExample.lines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              {workedExample.note && (
                <p className="pt-1 text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {workedExample.note}
                </p>
              )}
            </div>
          </section>

          {/* 4. MORE [UNIT A] & [UNIT B] CONVERSIONS (Complete Internal Linking Lists) */}
          {(() => {
            const moreLinks = getMoreUnitConversionLinks(fromUnit, toUnit);
            return (
              <section
                aria-labelledby="more-cat-unit-conversions-heading"
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
              >
                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF]">
                    <Link2 className="w-4 h-4" />
                  </span>
                  <h2
                    id="more-cat-unit-conversions-heading"
                    className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                  >
                    {moreLinks.sectionHeading}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Column 1: Convert from [FromUnit.plural] */}
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                      {moreLinks.fromHeading}
                    </h3>
                    <ul className="space-y-2">
                      {moreLinks.fromLinks.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-[15px] sm:text-base font-medium text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white hover:underline transition-colors py-1"
                          >
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: Convert to [ToUnit.plural] */}
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                      {moreLinks.toHeading}
                    </h3>
                    <ul className="space-y-2">
                      {moreLinks.toLinks.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-[15px] sm:text-base font-medium text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white hover:underline transition-colors py-1"
                          >
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
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
          {faqs.length > 0 && (
            <section aria-labelledby="cat-faq-heading" className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-100/90 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <h2
                  id="cat-faq-heading"
                  className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
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
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left text-base sm:text-[17px] font-extrabold text-[#16324F] dark:text-white hover:bg-[#F7F9FC] dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-[#0D9488]" : ""
                          }`}
                        />
                      </button>
                      <div
                        hidden={!isOpen}
                        className={
                          isOpen
                            ? "px-5 pb-4 pt-2 text-[15px] sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80"
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
          )}
        </div>

        {/* ===================================================================
            RIGHT SIDEBAR COLUMN (4 cols on lg)
            =================================================================== */}
        <aside className="lg:col-span-4 space-y-6">
          {/* 1. Category Converter Quick Pair Links */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5 pb-1">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${sidebarIconClass}`}
              >
                {renderCategoryIcon(category.iconName, "w-4 h-4")}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
                {heroTitle}
              </h2>
            </div>

            <nav aria-label={`${displayName} pair converters`} className="space-y-1.5">
              {sidebarPairLinks.map((pair, idx) => {
                const pFrom = UNIT_MAP.get(pair.fromUnitId);
                const pTo = UNIT_MAP.get(pair.toUnitId);
                const label =
                  pFrom && pTo
                    ? `${pFrom.plural} to ${pTo.plural}`
                    : pair.title.replace(" Converter", "");
                return (
                  <Link
                    key={pair.slug}
                    href={getPairUrl(pair)}
                    prefetch={false}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm sm:text-[15px] font-bold transition-colors ${
                      idx === 0
                        ? "bg-sky-50/90 dark:bg-sky-950/50 text-[#16324F] dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/60"
                        : "text-slate-700 dark:text-slate-300 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 hover:text-[#0D9488]"
                    }`}
                  >
                    <span className="truncate pr-2">{label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 2. Quick Info Card */}
          <div className="rounded-2xl bg-amber-50/55 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
              <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
                Quick Info
              </h2>
            </div>

            <ul className="space-y-2.5 text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
              {quickInfoBullets.map((b, i) => (
                <li key={i}>
                  <strong className="text-[#16324F] dark:text-white">
                    {b.boldPrefix}
                  </strong>{" "}
                  {b.text}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Units / Scales Comparison Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-[#0D9488]" />
              <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
                {displayName} Units Comparison
              </h2>
            </div>

            <div className="space-y-3">
              {unitComparisonCards.map((card, idx) => {
                const cardStyles = [
                  {
                    box: "bg-sky-50/60 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-900/50",
                    icon: "text-sky-600",
                  },
                  {
                    box: "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/50",
                    icon: "text-rose-500",
                  },
                  {
                    box: "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/50",
                    icon: "text-emerald-600",
                  },
                ][idx % 3];

                return (
                  <div
                    key={card.unitId}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${cardStyles.box}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${cardStyles.icon}`}
                    >
                      {renderCategoryIcon(category.iconName, "w-4 h-4")}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white">
                        {card.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Clean Compact References Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0" />
              <h2 className="text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white">
                References
              </h2>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {getTrustedReferencesForCategory(category.id).map((ref, idx) => (
                <li
                  key={idx}
                  className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100/80 dark:border-slate-800/60 last:border-0"
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
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
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
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488]">
                <Grid className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
                Related Categories
              </h2>
            </div>

            <nav
              aria-label="Related measurement categories"
              className="divide-y divide-slate-100 dark:divide-slate-800"
            >
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={getCategoryUrl(cat.id)}
                  prefetch={false}
                  className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg text-sm sm:text-[15px] font-bold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] hover:bg-[#F7F9FC] dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </nav>
          </div>

          {/* 6. Embed Category Calculator Widget Card */}
          <div className="rounded-2xl bg-[#F7F9FC] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF]">
                <Code2 className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white">
                  Add This Calculator to Your Site
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Free HTML widget · 4 embed formats
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Embed the interactive <strong>{displayName} Converter</strong> widget on your blog, classroom, or documentation page.
            </p>

            <Link
              href={`/widgets/w/${category.id.replace(/_/g, "-")}-converter`}
              prefetch={false}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#16324F] hover:bg-[#0D9488] text-white text-sm font-extrabold transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>Customize &amp; Get Embed Code</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
