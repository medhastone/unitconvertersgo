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
  Copy,
  Check,
  RotateCcw,
  Calculator,
  Table,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Info,
  AlertTriangle,
  Link2,
  HelpCircle,
  Lightbulb,
  Grid,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Target,
  Code2,
  Printer,
  Download,
  FileText,
  Star,
} from "lucide-react";
import {
  ConversionOutput,
  ConversionPairInfo,
  PrecisionMode,
} from "@/lib/conversions/types";
import { convertUnits, formatValue } from "@/lib/conversions/engine";
import {
  CATEGORIES,
  getUnitsByCategory,
  UNIT_MAP,
  CATEGORY_MAP,
} from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  findDedicatedPair,
  getCanonicalPairSlug,
  getConversionPair,
  getConversionsByCategory,
  getMoreUnitConversionLinks,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import {
  generateEditorialContentBundle,
  generateScaleAwareTableRows,
} from "@/lib/conversions/editorial";
import { getTrustedReferencesForPair } from "@/lib/conversions/references";
import { generateLiveSolution } from "@/lib/conversions/solver";
import { getPresetSearchQueries } from "@/lib/conversions/scenarios";
import {
  parseNumericOrFractionInput,
  formatAsTapeFraction,
  formatFeetAndInches,
  getMultiUnitEquivalents,
  generateContinuousLengthChartRows,
  getFractionalInchesGuideData,
  STANDARD_TAPE_FRACTIONS,
  QUICK_FRACTION_CHIPS,
} from "@/lib/conversions/fractions";
import { SITE_CONFIG } from "@/lib/config";
import {
  TOP_20_POPULAR_CONVERTERS,
  isIndexableCategory,
} from "@/lib/seo-config";
import type { PairContentData } from "@/lib/pair-content";
import TapeMeasureVisual from "@/components/TapeMeasureVisual";
import SharePageButton from "@/components/SharePageButton";

interface ConversionPageInteractiveProps {
  pair: ConversionPairInfo;
  featuredRelatedPairs?: ConversionPairInfo[];
  pairContent?: PairContentData | null;
  curatedCommonValues?: number[];
}

function formatUnitWithSymbol(label: string, symbol: string): string {
  const trimmedLabel = label.trim();
  const suffix = `(${symbol.trim()})`;
  if (trimmedLabel.toLowerCase().endsWith(suffix.toLowerCase())) {
    return trimmedLabel;
  }
  return `${trimmedLabel} ${suffix}`;
}

const CATEGORY_THEME_BY_ID: Record<
  string,
  { heroBadge: string; sidebarBadge: string }
> = {
  length: {
    heroBadge:
      "bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/70 text-blue-600 dark:text-blue-400",
    sidebarBadge:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
  },
  mass: {
    heroBadge:
      "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-400",
    sidebarBadge:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
  },
  temperature: {
    heroBadge:
      "bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800/70 text-rose-500 dark:text-rose-400",
    sidebarBadge:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400",
  },
  area: {
    heroBadge:
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400",
    sidebarBadge:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
  },
  volume: {
    heroBadge:
      "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/80 dark:border-cyan-800/70 text-cyan-600 dark:text-cyan-400",
    sidebarBadge:
      "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
  },
  speed: {
    heroBadge:
      "bg-orange-50 dark:bg-orange-950/60 border-orange-200/80 dark:border-orange-800/70 text-orange-600 dark:text-orange-400",
    sidebarBadge:
      "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400",
  },
  time: {
    heroBadge:
      "bg-violet-50 dark:bg-violet-950/60 border-violet-200/80 dark:border-violet-800/70 text-violet-600 dark:text-violet-400",
    sidebarBadge:
      "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400",
  },
  pressure: {
    heroBadge:
      "bg-sky-50 dark:bg-sky-950/60 border-sky-200/80 dark:border-sky-800/70 text-sky-600 dark:text-sky-400",
    sidebarBadge:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400",
  },
  energy: {
    heroBadge:
      "bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/70 text-amber-600 dark:text-amber-400",
    sidebarBadge:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
  },
  power: {
    heroBadge:
      "bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-200/80 dark:border-fuchsia-800/70 text-fuchsia-600 dark:text-fuchsia-400",
    sidebarBadge:
      "bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400",
  },
  digital_storage: {
    heroBadge:
      "bg-teal-50 dark:bg-teal-950/60 border-teal-200/80 dark:border-teal-800/70 text-teal-600 dark:text-teal-400",
    sidebarBadge:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400",
  },
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

/**
 * Formats a conversion result consistently with formatValue so the displayed
 * conversion factor matches across the calculator, formula box, and prose,
 * while all internal arithmetic uses the exact floating-point value.
 */
function formatPairResult(rawValue: number, precision: PrecisionMode): string {
  if (!Number.isFinite(rawValue)) return "Invalid Input";
  if (rawValue === 0) return "0";
  return formatValue(rawValue, precision);
}

interface SubstancePreset {
  id: string;
  label: string;
  shortLabel: string;
  density: number; // g/mL (= kg/L)
}

const SUBSTANCE_DENSITY_PRESETS: SubstancePreset[] = [
  { id: "water", label: "Pure Water (20 °C)", shortLabel: "Water", density: 1.0 },
  { id: "milk", label: "Whole Milk", shortLabel: "Milk", density: 1.03 },
  { id: "olive_oil", label: "Olive Oil", shortLabel: "Olive Oil", density: 0.915 },
  { id: "veg_oil", label: "Vegetable Oil", shortLabel: "Veg Oil", density: 0.92 },
  { id: "butter", label: "Melted Butter", shortLabel: "Butter", density: 0.959 },
  { id: "honey", label: "Honey", shortLabel: "Honey", density: 1.42 },
  { id: "flour", label: "All-Purpose Flour", shortLabel: "Flour", density: 0.529 },
  { id: "sugar", label: "Granulated Sugar", shortLabel: "Sugar", density: 0.849 },
  { id: "gasoline", label: "Gasoline", shortLabel: "Gasoline", density: 0.745 },
  { id: "diesel", label: "Diesel Fuel", shortLabel: "Diesel", density: 0.832 },
  { id: "ethanol", label: "Ethanol", shortLabel: "Ethanol", density: 0.789 },
  { id: "mercury", label: "Mercury", shortLabel: "Mercury", density: 13.534 },
  { id: "custom", label: "Custom Density", shortLabel: "Custom", density: 1.0 },
];

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "-": "⁻",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function toSuperscriptExponent(exp: number): string {
  return String(exp)
    .split("")
    .map((ch) => SUPERSCRIPT_DIGITS[ch] ?? ch)
    .join("");
}

function formatPlainDecimalForPower(val: number): string {
  if (!Number.isFinite(val)) return "—";
  if (val === 1) return "1";
  const exp = Math.round(Math.log10(val));
  if (Math.abs(val - Math.pow(10, exp)) < 1e-15 * Math.max(1, val)) {
    if (exp >= 0 && exp <= 12) {
      return Math.pow(10, exp).toLocaleString("en-US");
    }
    if (exp < 0 && exp >= -12) {
      return `0.${"0".repeat(Math.abs(exp) - 1)}1`;
    }
  }
  return formatValue(val, "auto");
}

const SI_PREFIX_REFERENCE_ROWS = [
  { unitId: "prefix_tera", slug: "tera-to-base-units", name: "Tera", symbol: "T", exp: 12, decimal: "1,000,000,000,000" },
  { unitId: "prefix_giga", slug: "giga-to-base-units", name: "Giga", symbol: "G", exp: 9, decimal: "1,000,000,000" },
  { unitId: "prefix_mega", slug: "mega-to-base-units", name: "Mega", symbol: "M", exp: 6, decimal: "1,000,000" },
  { unitId: "prefix_kilo", slug: "kilo-to-base-units", name: "Kilo", symbol: "k", exp: 3, decimal: "1,000" },
  { unitId: "prefix_hecto", slug: "hecto-to-base-units", name: "Hecto", symbol: "h", exp: 2, decimal: "100" },
  { unitId: "prefix_none", slug: "base-units-to-kilo", name: "Base Unit", symbol: "1", exp: 0, decimal: "1" },
  { unitId: "prefix_deci", slug: "deci-to-base-units", name: "Deci", symbol: "d", exp: -1, decimal: "0.1" },
  { unitId: "prefix_centi", slug: "centi-to-base-units", name: "Centi", symbol: "c", exp: -2, decimal: "0.01" },
  { unitId: "prefix_milli", slug: "milli-to-base-units", name: "Milli", symbol: "m", exp: -3, decimal: "0.001" },
  { unitId: "prefix_micro", slug: "micro-to-base-units", name: "Micro", symbol: "µ", exp: -6, decimal: "0.000001" },
  { unitId: "prefix_nano", slug: "nano-to-base-units", name: "Nano", symbol: "n", exp: -9, decimal: "0.000000001" },
  { unitId: "prefix_pico", slug: "pico-to-base-units", name: "Pico", symbol: "p", exp: -12, decimal: "0.000000000001" },
];

/**
 * Produces a human-readable formula string and worked example arithmetic
 */
function getHumanFormulaAndExample(
  fromUnitId: string,
  toUnitId: string,
  inputVal: number,
  output: ConversionOutput,
  densityGPerMl = 1
) {
  const fromUnit = output.fromUnit;
  const toUnit = output.toUnit;
  const fromPlural = fromUnit.plural.toLowerCase();
  const toPlural = toUnit.plural.toLowerCase();

  const oneReverse = convertUnits(1, toUnitId, fromUnitId, "auto", 12, densityGPerMl);
  const oneForward = convertUnits(1, fromUnitId, toUnitId, "auto", 12, densityGPerMl);

  if (fromUnitId === "centimeter" && toUnitId === "inch") {
    const approx3 = Number(output.rawValue.toFixed(3));
    return {
      primaryFormula: "inches = centimeters ÷ 2.54",
      secondaryFormula: "in = cm × 0.3937007874",
      inverseFormula: "centimeters = inches × 2.54",
      factorText: "1 inch = 2.54 centimeters (exact international definition)",
      workedEquation: `${inputVal} ÷ 2.54 = approximately ${approx3} inches`,
      workedExact: `${inputVal} cm ÷ 2.54 = ${formatPairResult(output.rawValue, "auto")} in`,
    };
  }

  if (fromUnitId === "inch" && toUnitId === "centimeter") {
    const approx3 = Number(output.rawValue.toFixed(3));
    return {
      primaryFormula: "centimeters = inches × 2.54",
      secondaryFormula: "cm = in ÷ 0.3937007874",
      inverseFormula: "inches = centimeters ÷ 2.54",
      factorText: "1 inch = 2.54 centimeters (exact international definition)",
      workedEquation: `${inputVal} × 2.54 = ${approx3} centimeters`,
      workedExact: `${inputVal} in × 2.54 = ${formatPairResult(output.rawValue, "auto")} cm`,
    };
  }

  if (fromUnit.categoryId === "temperature" || fromUnit.categoryId === "fuel_economy") {
    return {
      primaryFormula: output.formulaDisplay,
      secondaryFormula: `1 ${fromUnit.symbol} = ${oneForward.formattedValue} ${toUnit.symbol}`,
      inverseFormula: `1 ${toUnit.symbol} = ${oneReverse.formattedValue} ${fromUnit.symbol}`,
      factorText: `Non-linear / offset scale conversion between ${fromUnit.name} and ${toUnit.name}`,
      workedEquation: `${output.steps.map((s) => s.expression).join(" → ")}`,
      workedExact: `${inputVal} ${fromUnit.symbol} = ${formatPairResult(output.rawValue, "auto")} ${toUnit.symbol}`,
    };
  }

  const invRaw = oneReverse.rawValue;
  const invRounded = Number(invRaw.toFixed(4));
  const isCleanDivisor =
    invRaw > 1 &&
    Math.abs(invRaw - invRounded) < 1e-7 &&
    invRounded.toString().length <= 6;

  if (isCleanDivisor) {
    const approx3 = Number(output.rawValue.toFixed(3));
    return {
      primaryFormula: `${toPlural} = ${fromPlural} ÷ ${invRounded}`,
      secondaryFormula: `${toUnit.symbol} = ${fromUnit.symbol} × ${oneForward.formattedValue}`,
      inverseFormula: `${fromUnit.symbol} = ${toUnit.symbol} × ${invRounded}`,
      factorText: `1 ${toUnit.name.toLowerCase()} (${toUnit.symbol}) = ${invRounded} ${fromPlural} (${fromUnit.symbol})`,
      workedEquation: `${inputVal} ÷ ${invRounded} = approximately ${approx3} ${toPlural}`,
      workedExact: `${inputVal} ${fromUnit.symbol} ÷ ${invRounded} = ${formatPairResult(output.rawValue, "auto")} ${toUnit.symbol}`,
    };
  }

  const fwdFactor = oneForward.formattedValue;
  const approx3 = Number(output.rawValue.toFixed(3));
  return {
    primaryFormula: `${toPlural} = ${fromPlural} × ${fwdFactor}`,
    secondaryFormula: output.formulaDisplay,
    inverseFormula: `${fromUnit.symbol} = ${toUnit.symbol} × ${oneReverse.formattedValue}`,
    factorText: `1 ${fromUnit.name.toLowerCase()} (${fromUnit.symbol}) = ${fwdFactor} ${toPlural} (${toUnit.symbol})`,
    workedEquation: `${inputVal} × ${fwdFactor} = approximately ${approx3} ${toPlural}`,
    workedExact: `${inputVal} ${fromUnit.symbol} × ${fwdFactor} = ${formatPairResult(output.rawValue, "auto")} ${toUnit.symbol}`,
  };
}

export default function ConversionPageInteractive({
  pair,
  featuredRelatedPairs = [],
  pairContent = null,
  curatedCommonValues,
}: ConversionPageInteractiveProps) {
  const [fromUnitId, setFromUnitId] = useState<string>(pair.fromUnitId);
  const [toUnitId, setToUnitId] = useState<string>(pair.toUnitId);
  const [inputStr, setInputStr] = useState<string>(String(pair.exampleInput));
  const deferredInputStr = useDeferredValue(inputStr);
  const [precision, setPrecision] = useState<PrecisionMode>("auto");
  const [selectedVoltage, setSelectedVoltage] = useState<number>(12);
  const [selectedSubstanceId, setSelectedSubstanceId] = useState<string>("water");
  const [customDensityStr, setCustomDensityStr] = useState<string>("1.000");
  const [copied, setCopied] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [tablePreset, setTablePreset] = useState<"common" | "small" | "large">(
    "common"
  );
  const [lengthChartMaxN, setLengthChartMaxN] = useState<40 | 100>(40);
  const [isExporting, setIsExporting] = useState<
    null | "print" | "png" | "pdf"
  >(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [isMobileTableExpanded, setIsMobileTableExpanded] = useState(false);
  const [isMobileLinksExpanded, setIsMobileLinksExpanded] = useState(false);

  // Sync optional ?value= query parameter and desktop viewport detection on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktopViewport(e.matches);
    };
    mql.addEventListener("change", handleMediaChange);

    const syncState = () => {
      if (mql.matches) {
        setIsDesktopViewport(true);
      }
      const params = new URLSearchParams(window.location.search);
      const qVal = params.get("value");
      if (qVal && Number.isFinite(parseFloat(qVal))) {
        setInputStr((prev) => (prev === qVal ? prev : qVal));
      }
    };
    const rafId = window.requestAnimationFrame(syncState);
    window.addEventListener("popstate", syncState);
    return () => {
      mql.removeEventListener("change", handleMediaChange);
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("popstate", syncState);
    };
  }, []);

  const categoryUnits = useMemo(() => {
    const base = [...getUnitsByCategory(pair.categoryId)];
    const f = UNIT_MAP.get(fromUnitId);
    const t = UNIT_MAP.get(toUnitId);
    if (f && !base.some((u) => u.id === f.id)) base.push(f);
    if (t && !base.some((u) => u.id === t.id)) base.push(t);
    return base;
  }, [pair.categoryId, fromUnitId, toUnitId]);
  const category = CATEGORY_MAP.get(pair.categoryId);
  const iconName = category?.iconName || "ArrowLeftRight";
  const theme = CATEGORY_THEME_BY_ID[pair.categoryId] || {
    heroBadge:
      "bg-teal-50 dark:bg-teal-950/60 border-teal-200/80 dark:border-teal-800/70 text-[#0D9488] dark:text-[#2DD4BF]",
    sidebarBadge:
      "bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF]",
  };

  const numericInput = useMemo(() => {
    return parseNumericOrFractionInput(inputStr);
  }, [inputStr]);

  const deferredNumericInput = useMemo(() => {
    return parseNumericOrFractionInput(deferredInputStr);
  }, [deferredInputStr]);

  const isValidInput = Number.isFinite(numericInput);
  const effectiveInput = isValidInput ? numericInput : 0;
  const isDeferredValid = Number.isFinite(deferredNumericInput);
  const deferredEffectiveInput = isDeferredValid ? deferredNumericInput : 0;

  const isCrossDimensionBatteryPair = useMemo(() => {
    const energyIds = new Set(["watt_hour", "kilowatt_hour"]);
    const chargeIds = new Set(["ampere_hour", "milliampere_hour", "coulomb"]);
    return (
      (chargeIds.has(fromUnitId) && energyIds.has(toUnitId)) ||
      (energyIds.has(fromUnitId) && chargeIds.has(toUnitId))
    );
  }, [fromUnitId, toUnitId]);

  const activeSubstance = useMemo(() => {
    return (
      SUBSTANCE_DENSITY_PRESETS.find((s) => s.id === selectedSubstanceId) ||
      SUBSTANCE_DENSITY_PRESETS[0]
    );
  }, [selectedSubstanceId]);

  const densityGPerMl = useMemo(() => {
    if (selectedSubstanceId === "custom") {
      const parsed = parseFloat(customDensityStr);
      return Number.isFinite(parsed) && parsed > 0 && parsed <= 100 ? parsed : 1.0;
    }
    return activeSubstance.density;
  }, [selectedSubstanceId, customDensityStr, activeSubstance]);

  const isCrossDimensionMassVolume = useMemo(() => {
    const f = UNIT_MAP.get(fromUnitId);
    const t = UNIT_MAP.get(toUnitId);
    if (!f || !t) return false;
    return (
      (f.categoryId === "mass" && t.categoryId === "volume") ||
      (f.categoryId === "volume" && t.categoryId === "mass")
    );
  }, [fromUnitId, toUnitId]);

  const fromDropdownUnits = useMemo(() => {
    const f = UNIT_MAP.get(fromUnitId);
    const catId = f?.categoryId || pair.categoryId;
    const base = [...getUnitsByCategory(catId)];
    if (f && !base.some((u) => u.id === f.id)) base.push(f);
    return base;
  }, [fromUnitId, pair.categoryId]);

  const toDropdownUnits = useMemo(() => {
    const t = UNIT_MAP.get(toUnitId);
    const catId = t?.categoryId || pair.categoryId;
    const base = [...getUnitsByCategory(catId)];
    if (t && !base.some((u) => u.id === t.id)) base.push(t);
    return base;
  }, [toUnitId, pair.categoryId]);

  const activeOutput: ConversionOutput = useMemo(() => {
    return convertUnits(
      effectiveInput,
      fromUnitId,
      toUnitId,
      precision,
      selectedVoltage,
      densityGPerMl
    );
  }, [effectiveInput, fromUnitId, toUnitId, precision, selectedVoltage, densityGPerMl]);

  const highPrecisionFormatted = useMemo(() => {
    if (!isValidInput) return "—";
    return formatPairResult(activeOutput.rawValue, precision);
  }, [isValidInput, activeOutput.rawValue, precision]);

  const fromUnit = UNIT_MAP.get(fromUnitId) || activeOutput.fromUnit;
  const toUnit = UNIT_MAP.get(toUnitId) || activeOutput.toUnit;

  // Tape-measure fraction & Feet+Inches breakdown when converting to/from length units
  const inchBreakdown = useMemo(() => {
    if (!isValidInput || pair.categoryId !== "length") return null;
    try {
      const totalInches =
        toUnitId === "inch"
          ? activeOutput.rawValue
          : fromUnitId === "inch"
          ? effectiveInput
          : convertUnits(effectiveInput, fromUnitId, "inch", "auto").rawValue;
      const totalCm =
        toUnitId === "centimeter"
          ? activeOutput.rawValue
          : fromUnitId === "centimeter"
          ? effectiveInput
          : convertUnits(effectiveInput, fromUnitId, "centimeter", "auto").rawValue;

      if (!Number.isFinite(totalInches) || totalInches < 0 || totalInches > 100000) {
        return null;
      }

      const frac16 = formatAsTapeFraction(totalInches, 16);
      const frac32 = formatAsTapeFraction(totalInches, 32);
      const frac64 = formatAsTapeFraction(totalInches, 64);
      const feetInches = formatFeetAndInches(totalInches);

      return {
        totalInches,
        totalCm,
        frac16,
        frac32,
        frac64,
        feetInches,
      };
    } catch {
      return null;
    }
  }, [isValidInput, pair.categoryId, toUnitId, fromUnitId, activeOutput.rawValue, effectiveInput]);

  // Simultaneous multi-unit equivalents for the active input (deferred to keep input INP < 50ms)
  const multiUnitEquivalents = useMemo(() => {
    if (!isDeferredValid) return [];
    return getMultiUnitEquivalents(deferredEffectiveInput, fromUnitId, pair.categoryId);
  }, [isDeferredValid, deferredEffectiveInput, fromUnitId, pair.categoryId]);

  const supportsFractionalInput = useMemo(() => {
    return ["inch", "foot", "yard", "ounce", "pound", "cup", "fluid_ounce"].includes(
      fromUnitId
    );
  }, [fromUnitId]);

  const primaryReferences = useMemo(() => {
    return getTrustedReferencesForPair(pair, fromUnit, toUnit);
  }, [pair, fromUnit, toUnit]);

  const handleSelectFractionChip = (decimal: number, label: string) => {
    const trimmed = inputStr.trim();
    const wholeMatch = trimmed.match(/^(\d+)$/);
    if (wholeMatch && Number(wholeMatch[1]) > 0 && Number(wholeMatch[1]) < 1000) {
      setInputStr(`${wholeMatch[1]} ${label}`);
    } else {
      setInputStr(label);
    }
  };

  // Resolve a 3rd visual comparison unit (base unit or another popular unit in the category)
  const thirdVisualUnit = useMemo(() => {
    const cat = CATEGORY_MAP.get(pair.categoryId);
    const baseU = cat ? UNIT_MAP.get(cat.baseUnitId) : undefined;
    if (baseU && baseU.id !== fromUnit.id && baseU.id !== toUnit.id) {
      return baseU;
    }
    return (
      categoryUnits.find(
        (u) => u.id !== fromUnit.id && u.id !== toUnit.id
      ) || toUnit
    );
  }, [pair.categoryId, categoryUnits, fromUnit, toUnit]);

  const visualUnits = useMemo(() => {
    const list = [fromUnit, toUnit];
    if (
      thirdVisualUnit &&
      thirdVisualUnit.id !== fromUnit.id &&
      thirdVisualUnit.id !== toUnit.id
    ) {
      list.push(thirdVisualUnit);
    }
    return list;
  }, [fromUnit, toUnit, thirdVisualUnit]);

  // Check if the user switched units to another canonical pair in the catalogue
  const matchingCanonicalPair = useMemo(() => {
    return findDedicatedPair(fromUnitId, toUnitId);
  }, [fromUnitId, toUnitId]);

  const handleSwapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleReset = () => {
    setFromUnitId(pair.fromUnitId);
    setToUnitId(pair.toUnitId);
    setInputStr(String(pair.exampleInput));
    setPrecision("auto");
  };

  const handleClear = () => {
    setInputStr("");
  };

  const handleSelectValue = (val: number, scrollToConverter = false) => {
    setInputStr(String(val));
    if (scrollToConverter && typeof window !== "undefined") {
      const converterEl = document.getElementById("converter-tool-section");
      if (converterEl) {
        converterEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const inputEl = document.getElementById(
        "pair-numeric-input"
      ) as HTMLInputElement | null;
      if (inputEl) {
        setTimeout(() => {
          inputEl.focus({ preventScroll: true });
        }, 300);
      }
    }
  };

  const handleVisualUnitClick = (clickedId: string) => {
    if (clickedId === fromUnitId) return;
    if (clickedId === toUnitId) {
      handleSwapUnits();
      return;
    }
    setFromUnitId(clickedId);
  };

  const handleCopy = async () => {
    if (!isValidInput) return;
    try {
      await navigator.clipboard.writeText(highPrecisionFormatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const liveSolution = useMemo(() => {
    return generateLiveSolution(deferredEffectiveInput, fromUnitId, toUnitId, precision);
  }, [deferredEffectiveInput, fromUnitId, toUnitId, precision]);

  const searchPresets = useMemo(() => {
    return getPresetSearchQueries(fromUnitId, toUnitId, pair.categoryId);
  }, [fromUnitId, toUnitId, pair.categoryId]);

  const editorial = useMemo(
    () =>
      generateEditorialContentBundle(
        pair,
        fromUnit,
        toUnit,
        isDeferredValid ? deferredNumericInput : pair.exampleInput
      ),
    [pair, fromUnit, toUnit, isDeferredValid, deferredNumericInput]
  );

  const moreUnitLinks = useMemo(
    () => getMoreUnitConversionLinks(fromUnit, toUnit),
    [fromUnit, toUnit]
  );

  const handleCopyFormula = async () => {
    try {
      await navigator.clipboard.writeText(liveSolution.formulaEquation);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopySolution = async () => {
    try {
      const solutionText = `${liveSolution.step1Title}\n${liveSolution.step1Detail}\n\n${liveSolution.step2Title}\n${liveSolution.step2Expression}\n${liveSolution.step2Explanation}\n\n${liveSolution.step3Title}\n${liveSolution.step3Result}\n${liveSolution.step3Conclusion}`;
      await navigator.clipboard.writeText(solutionText);
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    } catch {
      // ignore
    }
  };

  const formulaDetails = useMemo(
    () =>
      getHumanFormulaAndExample(
        fromUnitId,
        toUnitId,
        isValidInput ? numericInput : pair.exampleInput,
        activeOutput,
        densityGPerMl
      ),
    [
      fromUnitId,
      toUnitId,
      isValidInput,
      numericInput,
      pair.exampleInput,
      activeOutput,
      densityGPerMl,
    ]
  );

  // Scale-aware conversion table rows (handles extreme ratios + density-labelled mass<->volume rows)
  const tableRows = useMemo(() => {
    if (isCrossDimensionMassVolume) {
      const baseValues =
        tablePreset === "small"
          ? [0.1, 0.25, 0.5, 1, 2, 3, 4, 5, 8, 10]
          : tablePreset === "large"
          ? [1, 5, 10, 20, 25, 50, 75, 100, 250, 500]
          : pairContent?.commonValues || curatedCommonValues || pair.commonValues || [0.5, 1, 2, 5, 10, 20, 25, 50, 100];
      return baseValues.map((val) => {
        const res = convertUnits(val, fromUnitId, toUnitId, "auto", selectedVoltage, densityGPerMl);
        const resThird = convertUnits(val, fromUnitId, thirdVisualUnit.id, "auto", selectedVoltage, densityGPerMl);
        return {
          input: val,
          inputLabel: `${formatValue(val, "auto")} ${fromUnit.symbol}`,
          formatted6: `${formatPairResult(res.rawValue, "4")} ${toUnit.symbol} (${activeSubstance.shortLabel})`,
          formattedThird: `${formatValue(resThird.rawValue, "auto")} ${thirdVisualUnit.symbol}`,
        };
      });
    }

    if (tablePreset === "small" && (fromUnitId === "inch" || pair.categoryId === "length") && toUnitId !== "nanometer") {
      return STANDARD_TAPE_FRACTIONS.map((row) => {
        const res = convertUnits(row.decimalValue, fromUnitId, toUnitId, "auto");
        const resThird = convertUnits(
          row.decimalValue,
          fromUnitId,
          thirdVisualUnit.id,
          "auto"
        );
        return {
          input: row.decimalValue,
          inputLabel: `${row.fractionLabel} ${fromUnit.symbol} (${row.decimalLabel})`,
          formatted6: `${formatPairResult(res.rawValue, "6")} ${toUnit.symbol}`,
          formattedThird: `${formatValue(resThird.rawValue, "auto")} ${thirdVisualUnit.symbol}`,
        };
      });
    }

    const mode =
      tablePreset === "common"
        ? "auto"
        : tablePreset === "small"
        ? "fractions"
        : "standard";
    const effectiveCommonValues =
      pairContent?.commonValues || curatedCommonValues || pair.commonValues;
    const generated = generateScaleAwareTableRows(
      fromUnit,
      toUnit,
      thirdVisualUnit,
      mode,
      effectiveCommonValues
    );
    return generated.map((r) => ({
      input: r.input,
      inputLabel: r.inputDisplay,
      formatted6: r.outputDisplay,
      formattedThird: r.thirdUnitDisplay || "",
    }));
  }, [
    isCrossDimensionMassVolume,
    selectedVoltage,
    densityGPerMl,
    activeSubstance.shortLabel,
    tablePreset,
    pairContent?.commonValues,
    curatedCommonValues,
    pair.commonValues,
    pair.categoryId,
    fromUnitId,
    toUnitId,
    fromUnit,
    toUnit,
    thirdVisualUnit,
  ]);

  const isLengthCategory = pair.categoryId === "length";

  const continuousLengthRows = useMemo(() => {
    if (!isLengthCategory) return [];
    return generateContinuousLengthChartRows(
      fromUnitId,
      toUnitId,
      lengthChartMaxN
    );
  }, [isLengthCategory, fromUnitId, toUnitId, lengthChartMaxN]);

  const fractionalInchesGuide = useMemo(() => {
    if (!isLengthCategory) return null;
    const sampleAmount =
      isValidInput && numericInput > 0 ? numericInput : pair.exampleInput;
    return getFractionalInchesGuideData(sampleAmount, fromUnitId);
  }, [isLengthCategory, isValidInput, numericInput, pair.exampleInput, fromUnitId]);

  const canonicalPageUrl = `${SITE_CONFIG.baseUrl}${getPairUrl(
    matchingCanonicalPair || pair
  )}`;

  const handleExportChart = async (mode: "print" | "png" | "pdf") => {
    if (isExporting || continuousLengthRows.length === 0) return;
    setIsExporting(mode);
    try {
      const exportMod = await import("@/lib/conversions/chart-export");
      const payload = {
        slug: (matchingCanonicalPair || pair).slug,
        title: `${fromUnit.plural} to ${toUnit.plural} Conversion Chart`,
        fromUnitLabel: fromUnit.plural,
        toUnitLabel: toUnit.plural,
        fromSymbol: fromUnit.symbol,
        toSymbol: toUnit.symbol,
        formulaSubtitle: formulaDetails.factorText,
        siteName: SITE_CONFIG.name,
        pageUrl: canonicalPageUrl,
        rows: continuousLengthRows,
      };
      if (mode === "print") {
        await exportMod.printConversionChart(payload);
      } else if (mode === "png") {
        await exportMod.downloadChartAsPng(payload);
      } else {
        await exportMod.downloadChartAsPdf(payload);
      }
    } catch {
      // ignore export error
    } finally {
      setIsExporting(null);
    }
  };

  // Sidebar links in the same category
  const sidebarCategoryPairs = useMemo(() => {
    const allInCat = getConversionsByCategory(pair.categoryId);
    const prioritized: ConversionPairInfo[] = [pair];
    for (const p of allInCat) {
      if (p.slug !== pair.slug && prioritized.length < 6) {
        prioritized.push(p);
      }
    }
    return prioritized;
  }, [pair]);

  const oneForward = useMemo(
    () => convertUnits(1, fromUnitId, toUnitId, "auto", selectedVoltage, densityGPerMl),
    [fromUnitId, toUnitId, selectedVoltage, densityGPerMl]
  );
  const oneReverse = useMemo(
    () => convertUnits(1, toUnitId, fromUnitId, "auto", selectedVoltage, densityGPerMl),
    [fromUnitId, toUnitId, selectedVoltage, densityGPerMl]
  );

  const prefixDirectAnswer = useMemo(() => {
    if (pair.categoryId !== "prefixes" || !fromUnit.toBase || !toUnit.toBase) return null;
    const ratio = fromUnit.toBase / toUnit.toBase;
    const invRatio = toUnit.toBase / fromUnit.toBase;
    const exp = Math.round(Math.log10(ratio));
    const invExp = -exp;
    const cleanFromName = fromUnit.name.replace(/\s*\([^)]*\)/g, "").toLowerCase();
    const cleanToPlural = toUnit.plural.replace(/\s*\([^)]*\)/g, "").toLowerCase();
    const decimalStr = formatPlainDecimalForPower(ratio);
    const invDecimalStr = formatPlainDecimalForPower(invRatio);
    const line1 = `1 ${cleanFromName} (${fromUnit.symbol}) = ${decimalStr} = 10${toSuperscriptExponent(exp)} ${cleanToPlural}`;
    const line2 = `Inverse: 1 ${toUnit.name.replace(/\s*\([^)]*\)/g, "").toLowerCase()} (${toUnit.symbol}) = ${invDecimalStr} = 10${toSuperscriptExponent(invExp)} ${cleanFromName} (${fromUnit.symbol})`;
    return { line1, line2 };
  }, [pair.categoryId, fromUnit, toUnit]);

  const sidebarRelatedCategories = useMemo(() => {
    return CATEGORIES.filter(
      (c) => c.id !== pair.categoryId && isIndexableCategory(c.id)
    ).slice(0, 6);
  }, [pair.categoryId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
      {/* =====================================================================
          LEFT MAIN COLUMN (8 cols on lg)
          ===================================================================== */}
      <div className="lg:col-span-8 space-y-8">
        {/* 1. MAIN CONVERTER CARD (Visual Focus of the Page) */}
        <section
          id="converter-tool-section"
          aria-label={`${fromUnit.plural} to ${toUnit.plural} Calculator`}
          className="scroll-mt-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
        >
          {/* Card Header + Precision Mode Controls */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <span className="inline-flex items-center justify-center w-9 h-9 mt-0.5 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
                <ArrowUpDown className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <h2
                  className={`font-extrabold text-[#16324F] dark:text-white tracking-tight [text-wrap:balance] ${
                    fromUnit.plural.length + toUnit.plural.length > 36
                      ? "text-lg sm:text-xl leading-snug"
                      : "text-xl sm:text-2xl leading-tight"
                  }`}
                >
                  Convert {fromUnit.plural} to {toUnit.plural}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter a value in {fromUnit.plural.toLowerCase()} ({fromUnit.symbol}) to convert to {toUnit.plural.toLowerCase()} ({toUnit.symbol}).
                </p>
              </div>
            </div>

            {/* Precision Selector */}
            <div
              className="flex items-center gap-1 shrink-0"
              role="group"
              aria-label="Decimal precision"
            >
              {(
                [
                  { mode: "auto", label: "Full" },
                  { mode: "2", label: "2 dec" },
                  { mode: "4", label: "4 dec" },
                  { mode: "6", label: "6 dec" },
                  { mode: "scientific", label: "10ⁿ" },
                ] as { mode: PrecisionMode; label: string }[]
              ).map((item) => (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setPrecision(item.mode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    precision === item.mode
                      ? "bg-[#0D9488] text-white shadow-2xs"
                      : "bg-[#F7F9FC] dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:border-[#0D9488]/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Direct-Answer & Assumption Summary Block (Above Fold) */}
          {pair.categoryId === "prefixes" && prefixDirectAnswer ? (
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#E6FAF8]/80 dark:bg-teal-950/40 border border-[#0D9488]/30 space-y-1">
              <p className="font-mono text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white">
                {prefixDirectAnswer.line1}
              </p>
              <p className="font-mono text-xs sm:text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                {prefixDirectAnswer.line2}
              </p>
            </div>
          ) : isCrossDimensionMassVolume ? (
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/85 dark:bg-amber-950/35 border border-amber-300/80 dark:border-amber-800/70 space-y-1">
              <p className="font-mono text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white">
                Assuming {activeSubstance.label} (ρ = {densityGPerMl.toFixed(3)} g/mL): 1 {fromUnit.symbol} = {oneForward.formattedValue} {toUnit.symbol}
              </p>
              <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                Mass and volume require substance density (1 {toUnit.symbol} = {oneReverse.formattedValue} {fromUnit.symbol} for {activeSubstance.shortLabel.toLowerCase()}). Change the substance or enter a custom g/mL density below.
              </p>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <p className="font-mono text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white">
                Direct Answer: 1 {fromUnit.name.toLowerCase()} ({fromUnit.symbol}) = {oneForward.formattedValue} {toUnit.plural.toLowerCase()} ({toUnit.symbol})
              </p>
              {pairContent?.mistakesAndEdgeCases?.items?.[0] && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Medium / Assumption Note:</strong> {pairContent.mistakesAndEdgeCases.items[0]}
                </p>
              )}
            </div>
          )}

          {/* Mobile-First Form Row: Value + From + Swap + To */}
          <div suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
            {/* Value Input (supports decimal, fraction "3/8", or mixed number "5 3/8") */}
            <div className="sm:col-span-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pair-numeric-input"
                  className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
                >
                  Value ({fromUnit.symbol})
                </label>
                {supportsFractionalInput && (
                  <span className="text-xs font-mono font-semibold text-[#0D9488] dark:text-teal-400">
                    Dec or Frac
                  </span>
                )}
              </div>
              <input
                suppressHydrationWarning
                id="pair-numeric-input"
                type="text"
                inputMode="decimal"
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                placeholder={supportsFractionalInput ? "e.g. 5 or 5 3/8" : "Enter value..."}
                className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-base sm:text-lg font-extrabold font-mono text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
              />
            </div>

            {/* Source Unit Selector */}
            <div className="sm:col-span-4 space-y-1.5">
              <label
                htmlFor="pair-from-unit"
                className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
              >
                From
              </label>
              <select
                suppressHydrationWarning
                id="pair-from-unit"
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-base font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
              >
                {fromDropdownUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.plural} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Direction Control */}
            <div className="sm:col-span-1 flex justify-center">
              <button
                suppressHydrationWarning
                type="button"
                onClick={handleSwapUnits}
                aria-label={`Swap conversion direction from ${fromUnit.plural} to ${toUnit.plural}`}
                title="Swap source and target units"
                className="w-full sm:w-12 h-11 sm:h-12 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/70 hover:bg-[#0D9488] text-[#0F766E] dark:text-teal-300 hover:text-white border border-[#0D9488]/30 flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span className="sm:hidden text-sm font-bold">Swap Units</span>
              </button>
            </div>

            {/* Target Unit Selector */}
            <div className="sm:col-span-4 space-y-1.5">
              <label
                htmlFor="pair-to-unit"
                className="block text-sm font-bold text-[#16324F] dark:text-slate-200"
              >
                To
              </label>
              <select
                suppressHydrationWarning
                id="pair-to-unit"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-base font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
              >
                {toDropdownUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.plural} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Tape-Measure Fraction Input Strip (for Inches / Imperial units) */}
          {supportsFractionalInput && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                Quick Fractions ({fromUnit.symbol}):
              </span>
              {QUICK_FRACTION_CHIPS.map((fc) => {
                const isFracSelected = inputStr.trim() === fc.label || inputStr.trim().endsWith(` ${fc.label}`);
                return (
                  <button
                    key={fc.label}
                    type="button"
                    onClick={() => handleSelectFractionChip(fc.decimal, fc.label)}
                    title={`Enter ${fc.label} ${fromUnit.symbol} (${fc.decimal})`}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                      isFracSelected
                        ? "bg-[#0D9488] text-white border-[#0D9488]"
                        : "bg-[#F7F9FC] dark:bg-slate-800/80 text-[#16324F] dark:text-slate-200 border-slate-200/90 dark:border-slate-700 hover:border-[#0D9488] hover:text-[#0D9488]"
                    }`}
                  >
                    {fc.label}
                  </button>
                );
              })}
              <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1 hidden sm:inline">
                (Tip: type mixed numbers like <code className="font-mono font-semibold text-slate-600 dark:text-slate-300">5 3/8</code>)
              </span>
            </div>
          )}

          {/* Substance & Density Selector for Cross-Dimension Mass <-> Volume Pages */}
          {isCrossDimensionMassVolume && (
            <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="substance-density-select"
                  className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white flex items-center gap-1.5"
                >
                  <Beaker className="w-4 h-4 text-[#0D9488]" />
                  <span>Substance / Ingredient Density (Required for Mass ↔ Volume)</span>
                </label>
                <span className="font-mono text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                  ρ = {densityGPerMl.toFixed(3)} g/mL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                <div className="sm:col-span-7">
                  <select
                    id="substance-density-select"
                    value={selectedSubstanceId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setSelectedSubstanceId(nextId);
                      const found = SUBSTANCE_DENSITY_PRESETS.find((s) => s.id === nextId);
                      if (found && nextId !== "custom") {
                        setCustomDensityStr(found.density.toFixed(3));
                      }
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/90 dark:border-slate-700 text-sm font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] cursor-pointer"
                  >
                    {SUBSTANCE_DENSITY_PRESETS.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.label} {sub.id !== "custom" ? `(${sub.density.toFixed(3)} g/mL)` : "(Enter g/mL)"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-5 flex items-center gap-2">
                  <label
                    htmlFor="custom-density-input"
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0"
                  >
                    Density (g/mL):
                  </label>
                  <input
                    id="custom-density-input"
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="25"
                    value={customDensityStr}
                    onChange={(e) => {
                      setSelectedSubstanceId("custom");
                      setCustomDensityStr(e.target.value);
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/90 dark:border-slate-700 text-sm font-mono font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SUBSTANCE_DENSITY_PRESETS.slice(0, 7).map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubstanceId(sub.id);
                      setCustomDensityStr(sub.density.toFixed(3));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedSubstanceId === sub.id
                        ? "bg-[#0D9488] text-white border-[#0D9488]"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0D9488]"
                    }`}
                  >
                    {sub.shortLabel} ({sub.density} g/mL)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cross-Dimension Assumption Box for Battery Charge (Ah/mAh) <-> Energy (Wh/kWh) (Task 3) */}
          {isCrossDimensionBatteryPair && (
            <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/70 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
                  <strong>Physical Assumption Required (Nominal DC System Voltage):</strong>{" "}
                  {fromUnit.plural} ({fromUnit.symbol}) measure <em>electric charge</em> (A·h), while{" "}
                  {toUnit.plural} ({toUnit.symbol}) measure <em>electrical energy</em> (W·h). Converting
                  between them requires specifying the battery&apos;s nominal voltage (
                  <code className="font-mono font-bold">Wh = Ah × V</code>).
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                  Select Battery Voltage:
                </span>
                {[
                  { v: 3.7, label: "3.7 V (Li-ion Cell)" },
                  { v: 12, label: "12 V (Automotive / RV)" },
                  { v: 24, label: "24 V (Marine / Truck)" },
                  { v: 36, label: "36 V (E-Bike / Golf)" },
                  { v: 48, label: "48 V (Solar / Server)" },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setSelectedVoltage(opt.v)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedVoltage === opt.v
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:border-amber-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation Notice when empty/invalid */}
          {!isValidInput && (
            <div
              role="status"
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs sm:text-sm text-amber-900 dark:text-amber-200"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                Please enter a valid number or fraction above (for example:{" "}
                <strong>{pair.exampleInput}</strong> or <strong>5 3/8</strong>).
              </span>
            </div>
          )}

          {/* Prominent Result Box (Matching Temperature Converter Result Box) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Result
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-semibold text-slate-500 hover:text-[#0D9488] transition-colors cursor-pointer"
                  title="Clear input field"
                >
                  Clear
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0D9488] transition-colors cursor-pointer"
                  title={`Reset to default (${pair.exampleInput} ${fromUnit.symbol})`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 min-h-[82px] rounded-2xl bg-[#E6FAF8]/85 dark:bg-teal-950/35 border border-[#0D9488]/30 flex flex-wrap items-center justify-between gap-4">
              <div
                aria-live="polite"
                className="space-y-1"
              >
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#16324F] dark:text-white break-all">
                    {highPrecisionFormatted}
                  </span>
                  <span className="text-base sm:text-xl font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                    {toUnit.plural.toLowerCase()}
                  </span>
                </div>
                {isCrossDimensionMassVolume && (
                  <div className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
                    Assuming {activeSubstance.label} (ρ = {densityGPerMl.toFixed(3)} g/mL)
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!isValidInput}
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
                    <span>Copy Result</span>
                  </>
                )}
              </button>
            </div>

            {/* Tape-Measure Fractional Inch & Feet+Inches Breakdown (for Length Conversions) */}
            {inchBreakdown && isLengthCategory && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {inchBreakdown.frac16 && (
                  <div className="p-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Nearest 1/16&Prime; Tape
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white mt-0.5 tabular-nums">
                      {inchBreakdown.frac16.display} in
                    </span>
                  </div>
                )}
                {inchBreakdown.frac32 && (
                  <div className="p-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Nearest 1/32&Prime; Fine
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white mt-0.5 tabular-nums">
                      {inchBreakdown.frac32.display} in
                    </span>
                  </div>
                )}
                {inchBreakdown.frac64 && (
                  <div className="p-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Nearest 1/64&Prime; Machinist
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-[#0D9488] dark:text-[#2DD4BF] mt-0.5 tabular-nums">
                      {inchBreakdown.frac64.display} in
                    </span>
                  </div>
                )}
                {inchBreakdown.feetInches && (
                  <div className="p-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Feet &amp; Inches (ft + in)
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white mt-0.5 tabular-nums">
                      {inchBreakdown.feetInches}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Interactive 1/16" Tape Measure Visual inside the Live Calculator Card */}
            {inchBreakdown && isLengthCategory && (
              <TapeMeasureVisual
                inchesValue={inchBreakdown.totalInches}
                cmValue={inchBreakdown.totalCm}
              />
            )}

            {/* Below Result: Equation Statement + Automatic Update Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {isValidInput ? (
                <div className="font-mono text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white">
                  {inputStr.trim() !== String(numericInput)
                    ? `${inputStr.trim()} (${numericInput}) ${fromUnit.symbol}`
                    : `${numericInput} ${fromUnit.symbol}`}{" "}
                  = {highPrecisionFormatted} {toUnit.symbol}
                  {isCrossDimensionMassVolume
                    ? ` (${activeSubstance.shortLabel}, ρ = ${densityGPerMl.toFixed(3)} g/mL)`
                    : ""}
                </div>
              ) : (
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Waiting for numeric input...
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
                  <span>Result updates automatically</span>
                </div>

                <SharePageButton
                  variant="button"
                  label="Share"
                  customPath={getPairUrl(matchingCanonicalPair || pair)}
                  customTitle={matchingCanonicalPair?.title || pair.title}
                />
              </div>
            </div>
          </div>

          {/* Simultaneous Multi-Unit Equivalents Strip */}
          {multiUnitEquivalents.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Equivalent Measurements Across Units
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  For {numericInput} {fromUnit.symbol}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {multiUnitEquivalents.map((eq) => (
                  <div
                    key={eq.unitId}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs sm:text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                      {eq.name}
                    </span>
                    <span className="font-mono font-bold text-[#16324F] dark:text-white shrink-0">
                      {eq.formatted} {!eq.isCompound ? eq.symbol : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact Visual Unit Selector Buttons */}
          <div className="space-y-2.5 pt-1">
            <div
              role="group"
              aria-label="Quick unit selector"
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
            >
              {visualUnits.map((u) => {
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
                      {renderCategoryIcon(iconName, "w-4 h-4")}
                    </span>
                    {isSource && (
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0D9488] text-white shrink-0">
                        From:
                      </span>
                    )}
                    {isTarget && (
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[#16324F] dark:text-slate-200 shrink-0">
                        To:
                      </span>
                    )}
                    <span className="truncate">
                      {formatUnitWithSymbol(u.plural, u.symbol)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Suggested Conversions & Benchmark Chips */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold text-[#16324F] dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0D9488]" />
                  <span>Suggested Conversions</span>
                </span>
                {matchingCanonicalPair &&
                  matchingCanonicalPair.slug !== pair.slug && (
                    <Link
                      href={getPairUrl(matchingCanonicalPair)}
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#0D9488] dark:text-teal-400 hover:underline"
                    >
                      <span>
                        Open{" "}
                        {matchingCanonicalPair.title.replace(" Converter", "")}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {searchPresets.map((preset) => {
                  const isSelected =
                    isValidInput && numericInput === preset.value;
                  return (
                    <button
                      key={`${preset.value}-${preset.label}`}
                      type="button"
                      onClick={() => handleSelectValue(preset.value, true)}
                      title={`Load ${preset.label} into calculator`}
                      className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#16324F] text-white border-[#16324F] shadow-sm font-bold scale-[1.02]"
                          : "bg-[#F7F9FC] dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-[#E6FAF8]/50"
                      }`}
                    >
                      <span className="font-mono">{preset.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-75 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Standard Reference Attribution Footer (No Author Box) */}
            {primaryReferences.length > 0 && (
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Reference:
                  </span>
                  <span className="truncate">
                    {primaryReferences[0].shortName} ({primaryReferences[0].standardCode})
                  </span>
                </div>
                <a
                  href="#references-standards-heading"
                  className="font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
                >
                  [1–{primaryReferences.length}] ↓
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Full SI Metric Prefix Reference Table (Req 3) */}
        {pair.categoryId === "prefixes" && (
          <section
            aria-labelledby="si-prefix-reference-heading"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <h2
                id="si-prefix-reference-heading"
                className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
              >
                Complete SI Metric Prefix Chart (Symbol, Exponent &amp; Decimal)
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Standard International System of Units (SI) decimal factors from Tera (10¹²) to Pico (10⁻¹²).
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F7F9FC] dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 font-extrabold text-[#16324F] dark:text-white">
                    <th scope="col" className="py-3 px-4">Prefix</th>
                    <th scope="col" className="py-3 px-4">Symbol</th>
                    <th scope="col" className="py-3 px-4">Exponent</th>
                    <th scope="col" className="py-3 px-4">Decimal Factor (vs. Base Unit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 font-mono">
                  {SI_PREFIX_REFERENCE_ROWS.map((row) => {
                    const isActive = row.unitId === fromUnitId || row.unitId === toUnitId;
                    return (
                      <tr
                        key={row.unitId}
                        className={
                          isActive
                            ? "bg-[#E6FAF8]/70 dark:bg-teal-950/40 font-extrabold"
                            : "hover:bg-[#F7F9FC] dark:hover:bg-slate-800/40"
                        }
                      >
                        <td className="py-2.5 px-4 font-sans font-bold text-[#16324F] dark:text-white">
                          <Link
                            href={`/prefixes/${row.slug}`}
                            prefetch={false}
                            className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] hover:underline"
                          >
                            {row.name}
                          </Link>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                          {row.symbol}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                          10{toSuperscriptExponent(row.exp)}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                          {row.decimal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 1B. PAIR-SPECIFIC INTRO OVERVIEW (60-100 words, Task 5 Gate #1) */}
        {pairContent?.intro && (
          <section
            aria-label={`About converting ${fromUnit.plural} to ${toUnit.plural}`}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs"
          >
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {pairContent.intro}
            </p>
          </section>
        )}

        {/* 2. CONVERSION TABLE (Continuous 1–40 / 1–100 Chart with Fraction & Export for Length; Scale-Aware Table for Other Categories) */}
        <section
          aria-labelledby="common-conversions-table-heading"
          className="cv-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
        >
          <div className="flex flex-col gap-3.5 w-full">
            <div className="flex items-start gap-3 w-full">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                <Table className="w-5 h-5" />
              </span>
              <div className="space-y-1 flex-1 min-w-0">
                <h2
                  id="common-conversions-table-heading"
                  className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                >
                  {isLengthCategory
                    ? `${fromUnit.plural} to ${toUnit.plural} Conversion Chart (1–${lengthChartMaxN} Continuous)`
                    : editorial.tableHeading}
                </h2>
                <p className="w-full text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isLengthCategory
                    ? `Continuous 1 to ${lengthChartMaxN} ${fromUnit.plural.toLowerCase()} lookup table with exact decimals and reduced nearest 1/64 fractions. Highlighted rows mark common shop and ruler values.`
                    : `${editorial.tableSubheading} Click any preset value or arrow to load it into the converter.`}
                </p>
              </div>
            </div>

            {/* Range Toggle Controls Bar (Full Container Width Alignment) */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 w-full no-print">
              {isLengthCategory ? (
                <div className="inline-flex items-center p-1 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setLengthChartMaxN(40);
                      setIsMobileTableExpanded(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      lengthChartMaxN === 40
                        ? "bg-white dark:bg-slate-900 text-[#16324F] dark:text-white shadow-2xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-[#16324F]"
                    }`}
                  >
                    1–40
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLengthChartMaxN(100);
                      setIsMobileTableExpanded(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      lengthChartMaxN === 100
                        ? "bg-white dark:bg-slate-900 text-[#16324F] dark:text-white shadow-2xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-[#16324F]"
                    }`}
                  >
                    1–100
                  </button>
                </div>
              ) : (
                <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm">
                  {(
                    [
                      { id: "common", label: "Scale-Aware" },
                      { id: "small", label: "Fractions / Micro" },
                      { id: "large", label: "Standard (1–100)" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setTablePreset(tab.id);
                        setIsMobileTableExpanded(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        tablePreset === tab.id
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

            {/* Print / Download PNG / Download PDF Action Toolbar for Length Charts */}
            {isLengthCategory && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 no-print">
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Star className="w-3.5 h-3.5 text-[#0D9488] fill-[#0D9488]" />
                  <span>
                    Common values highlighted · Round-half-up &amp; reduced to lowest terms
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportChart("print")}
                    disabled={isExporting !== null}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 hover:border-[#0D9488] text-xs sm:text-sm font-bold text-[#16324F] dark:text-white transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>
                      {isExporting === "print" ? "Preparing..." : "Print Chart"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportChart("png")}
                    disabled={isExporting !== null}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 hover:border-[#0D9488] text-xs sm:text-sm font-bold text-[#16324F] dark:text-white transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>
                      {isExporting === "png" ? "Exporting..." : "Download PNG"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportChart("pdf")}
                    disabled={isExporting !== null}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16324F] hover:bg-[#1E4268] text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>
                      {isExporting === "pdf" ? "Generating..." : "Download PDF"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isLengthCategory ? (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
                <table
                  className="w-full text-left border-collapse"
                  aria-label={`${fromUnit.plural} to ${toUnit.plural} Continuous Conversion Chart`}
                >
                  <thead>
                    <tr className="bg-[#F7F9FC] dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#16324F] dark:text-white">
                      <th scope="col" className="py-3.5 px-4">
                        {formatUnitWithSymbol(fromUnit.plural, fromUnit.symbol)}
                      </th>
                      <th scope="col" className="py-3.5 px-4">
                        Decimal ({toUnit.symbol})
                      </th>
                      <th scope="col" className="py-3.5 px-4">
                        Fraction — Nearest 1/64 (Reduced)
                      </th>
                      <th scope="col" className="py-3.5 px-4">
                        Nearest 1/16 (Tape)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-[15px] sm:text-base font-mono tabular-nums">
                    {(isDesktopViewport || isMobileTableExpanded
                      ? continuousLengthRows
                      : continuousLengthRows.slice(0, 12)
                    ).map((row) => {
                      const isCurrentRow =
                        isValidInput && Math.abs(numericInput - row.n) < 1e-9;
                      return (
                        <tr
                          key={row.n}
                          tabIndex={0}
                          onClick={() => handleSelectValue(row.n, true)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectValue(row.n, true);
                            }
                          }}
                          title={`Click to load ${row.inputLabel} into calculator`}
                          className={`group/row cursor-pointer transition-colors ${
                            isCurrentRow
                              ? "bg-[#E6FAF8] dark:bg-teal-950/60 font-extrabold"
                              : row.isCommon
                              ? "bg-teal-50/45 dark:bg-teal-950/25 hover:bg-[#E6FAF8]/60 dark:hover:bg-teal-950/40"
                              : "hover:bg-[#F7F9FC] dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-[#16324F] dark:text-slate-100">
                            <div className="flex items-center gap-2">
                              <span>{row.inputLabel}</span>
                              {row.isCommon && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0D9488]/15 dark:bg-[#0D9488]/25 text-[#0F766E] dark:text-[#2DD4BF] font-sans text-[11px] font-extrabold">
                                  ★ Common
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {row.decimalFormatted}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                            {row.fraction64Display}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center justify-between gap-2">
                              <span>{row.fraction16Display}</span>
                              <span
                                aria-hidden="true"
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-md border text-xs font-sans font-bold transition-all shrink-0 no-print ${
                                  isCurrentRow
                                    ? "bg-[#0D9488] text-white border-[#0D9488]"
                                    : "bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0D9488] dark:text-[#2DD4BF] border-[#0D9488]/30 group-hover/row:bg-[#0D9488] group-hover/row:text-white"
                                }`}
                              >
                                →
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!isDesktopViewport && continuousLengthRows.length > 12 && (
                <button
                  type="button"
                  onClick={() => setIsMobileTableExpanded((prev) => !prev)}
                  className="md:hidden no-print w-full py-2.5 px-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:bg-[#E6FAF8] dark:hover:bg-teal-950/50 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>
                    {isMobileTableExpanded
                      ? "Show Compact Preview (12 Rows)"
                      : `Show All ${continuousLengthRows.length} Conversion Rows`}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0D9488] transition-transform ${
                      isMobileTableExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {/* Bottom Toggle + Branded Chart Footer (Site Name + URL) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <strong className="font-bold text-[#16324F] dark:text-white">
                    {SITE_CONFIG.name}
                  </strong>{" "}
                  ·{" "}
                  <span className="font-mono text-[#0D9488] dark:text-[#2DD4BF]">
                    {canonicalPageUrl}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLengthChartMaxN((prev) => (prev === 40 ? 100 : 40));
                    setIsMobileTableExpanded(true);
                  }}
                  className="no-print inline-flex items-center gap-1.5 font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer self-start sm:self-auto"
                >
                  <span>
                    {lengthChartMaxN === 40
                      ? `Expand Full 1–100 ${fromUnit.plural} Chart (100 Rows)`
                      : `Show Compact 1–40 ${fromUnit.plural} Chart (40 Rows)`}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      lengthChartMaxN === 100 ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
                <table
                  className="w-full text-left border-collapse"
                  aria-label={editorial.tableHeading}
                >
                  <thead>
                    <tr className="bg-[#F7F9FC] dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white">
                      <th scope="col" className="py-3.5 px-4 w-1/2">
                        {formatUnitWithSymbol(fromUnit.plural, fromUnit.symbol)}
                      </th>
                      <th scope="col" className="py-3.5 px-4 w-1/2">
                        {formatUnitWithSymbol(toUnit.plural, toUnit.symbol)}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-[15px] sm:text-base font-mono tabular-nums">
                    {(isDesktopViewport || isMobileTableExpanded
                      ? tableRows
                      : tableRows.slice(0, 10)
                    ).map((row) => {
                      const isCurrentRow =
                        isValidInput && Math.abs(numericInput - row.input) < 1e-9;
                      return (
                        <tr
                          key={`${row.input}-${row.inputLabel}`}
                          tabIndex={0}
                          onClick={() => handleSelectValue(row.input, true)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectValue(row.input, true);
                            }
                          }}
                          title={`Click to convert ${row.inputLabel} in calculator`}
                          className={`group/row cursor-pointer transition-colors ${
                            isCurrentRow
                              ? "bg-[#E6FAF8]/60 dark:bg-teal-950/40 font-extrabold"
                              : "hover:bg-[#F7F9FC] dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-[#16324F] dark:text-slate-100 group-hover/row:text-[#0D9488] dark:group-hover/row:text-[#2DD4BF] transition-colors">
                            {row.inputLabel}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectValue(row.input, true);
                              }}
                              title={`Convert preset value ${row.inputLabel} in calculator`}
                              aria-label={`Convert preset value ${row.inputLabel} in calculator`}
                              className="flex items-center justify-between gap-2 w-full text-left font-bold text-[#0D9488] dark:text-[#2DD4BF] cursor-pointer"
                            >
                              <span>{row.formatted6}</span>
                              <span
                                aria-hidden="true"
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-md border text-xs font-sans font-bold transition-all shrink-0 ${
                                  isCurrentRow
                                    ? "bg-[#0D9488] text-white border-[#0D9488]"
                                    : "bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0D9488] dark:text-[#2DD4BF] border-[#0D9488]/30 group-hover/row:bg-[#0D9488] group-hover/row:text-white group-hover/row:border-[#0D9488]"
                                }`}
                              >
                                →
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!isDesktopViewport && tableRows.length > 10 && (
                <button
                  type="button"
                  onClick={() => setIsMobileTableExpanded((prev) => !prev)}
                  className="md:hidden no-print w-full py-2.5 px-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:bg-[#E6FAF8] dark:hover:bg-teal-950/50 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>
                    {isMobileTableExpanded
                      ? "Show Compact Preview (10 Rows)"
                      : `Show All ${tableRows.length} Reference Rows`}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0D9488] transition-transform ${
                      isMobileTableExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </>
          )}
        </section>

        {/* 3. HOW TO CONVERT & HOW MANY SECTION (Competitor-Style Editorial Guide) */}
        <section
          aria-labelledby="how-to-convert-heading"
          className="cv-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
                <Calculator className="w-5 h-5" />
              </span>
              <h2
                id="how-to-convert-heading"
                className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
              >
                {editorial.howToHeading}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleCopyFormula}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer"
              >
                {copiedFormula ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Formula</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCopySolution}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#16324F] hover:bg-[#1E4268] text-white transition-all cursor-pointer shadow-2xs"
              >
                {copiedSolution ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Steps</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* How to Convert Narrative & Formula Box */}
          <div className="space-y-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>{editorial.howToRatioParagraph}</p>
            <p>{editorial.howToFormulaIntro}</p>

            <div className="p-4 sm:p-5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 font-mono text-base sm:text-lg font-extrabold text-[#16324F] dark:text-teal-300 text-center shadow-2xs">
              {editorial.howToFormulaBox}
            </div>

            <p>{editorial.howToSentenceExplanation}</p>
            <p>{editorial.howToExampleIntro}</p>

            <div className="p-4 sm:p-5 rounded-xl bg-[#E6FAF8]/65 dark:bg-teal-950/35 border border-[#0D9488]/30 font-mono text-base sm:text-lg font-extrabold text-[#0F766E] dark:text-[#2DD4BF] text-center shadow-2xs">
              {editorial.howToExampleBox}
            </div>
          </div>

          {/* How Many [ToPlural] Are in a/an [FromSingular]? */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
              {editorial.howManyHeading}
            </h3>
            <p>{editorial.howManyParagraph1}</p>

            <div className="p-4 sm:p-5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 font-mono text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
              <span>{editorial.howManyEquivalenceBox}</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-bold">
                {editorial.howManyInverseNote}
              </span>
            </div>

            <p>{editorial.howManySystemParagraph}</p>
            <p>{editorial.howManyTransitionParagraph}</p>
          </div>

          {/* 3 Worked Examples with Real-World Context (Task 5 Gate #3) */}
          {pairContent?.workedExamples && pairContent.workedExamples.length >= 3 && (
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                3 Real-World Worked Examples ({fromUnit.symbol} to {toUnit.symbol})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {pairContent.workedExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 space-y-2"
                  >
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
                      Example {idx + 1}: {ex.title}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ex.scenario}
                    </p>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 font-mono text-xs sm:text-sm font-bold text-[#16324F] dark:text-teal-300">
                      {ex.stepByStep}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Mistakes & Edge Cases Block (Task 5 Gate #4: rendered only when real edge case exists) */}
          {pairContent?.mistakesAndEdgeCases && (
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50/75 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-base sm:text-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <h3>Mistakes &amp; Edge Cases: {pairContent.mistakesAndEdgeCases.title}</h3>
                </div>
                <ul className="space-y-2 text-sm sm:text-[15px] text-amber-950/90 dark:text-amber-200/90 list-disc pl-5 leading-relaxed">
                  {pairContent.mistakesAndEdgeCases.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* 3B. HOW TO CONVERT [UNIT] TO FRACTIONAL INCHES (1/16, 1/32, 1/64 Plain-Language Step-by-Step Guide) */}
        {isLengthCategory && fractionalInchesGuide && (
          <section
            aria-labelledby="fractional-inches-guide-heading"
            className="cv-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
                <Ruler className="w-5 h-5" />
              </span>
              <div>
                <h2
                  id="fractional-inches-guide-heading"
                  className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
                >
                  How to Convert {fromUnit.plural} to Fractional Inches (1/16&Prime;, 1/32&Prime; &amp; 1/64&Prime;)
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Plain-language method for turning decimal inches into a standard tape-measure or machinist ruler fraction
                </p>
              </div>
            </div>

            <div className="space-y-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Calculators give you a <strong>decimal number</strong> (such as{" "}
                <span className="font-mono font-bold text-[#16324F] dark:text-white">
                  {fractionalInchesGuide.decimalInchesFormatted} in
                </span>
                ), but tape measures and woodworking rulers are marked in{" "}
                <strong>binary fractions of an inch</strong>—most commonly{" "}
                <strong>1/16&Prime;</strong> on carpenter tapes,{" "}
                <strong>1/32&Prime;</strong> on fine woodworking rules, and{" "}
                <strong>1/64&Prime;</strong> on machinist scales.
              </p>

              <p>
                Here is the step-by-step worked example for converting{" "}
                <strong className="text-[#16324F] dark:text-white">
                  {fractionalInchesGuide.inputAmount}{" "}
                  {fractionalInchesGuide.fromUnitPlural} (
                  {fractionalInchesGuide.fromUnitSymbol})
                </strong>{" "}
                into fractional inches:
              </p>

              {/* 4 Plain-Language Steps */}
              <ol className="space-y-3 list-decimal list-inside rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5">
                <li>
                  <strong className="text-[#16324F] dark:text-white">
                    Find the decimal inches result:
                  </strong>{" "}
                  Convert{" "}
                  <span className="font-mono font-semibold">
                    {fractionalInchesGuide.inputAmount}{" "}
                    {fractionalInchesGuide.fromUnitSymbol}
                  </span>{" "}
                  to inches to get{" "}
                  <span className="font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                    {fractionalInchesGuide.decimalInchesFormatted} in
                  </span>
                  .
                </li>
                <li>
                  <strong className="text-[#16324F] dark:text-white">
                    Separate the whole inches from the decimal part:
                  </strong>{" "}
                  Keep the whole number{" "}
                  <span className="font-mono font-bold text-[#16324F] dark:text-white">
                    {fractionalInchesGuide.wholeInches}
                  </span>{" "}
                  aside, leaving the decimal remainder{" "}
                  <span className="font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                    {fractionalInchesGuide.decimalRemainderFormatted}
                  </span>
                  .
                </li>
                <li>
                  <strong className="text-[#16324F] dark:text-white">
                    Multiply the decimal part by your desired fraction denominator
                    (16, 32, or 64) and round half up:
                  </strong>{" "}
                  Multiply{" "}
                  <span className="font-mono">
                    {fractionalInchesGuide.decimalRemainderFormatted}
                  </span>{" "}
                  by 16, 32, or 64, then round to the nearest whole number (values
                  ending in .5 round up).
                </li>
                <li>
                  <strong className="text-[#16324F] dark:text-white">
                    Reduce the fraction to lowest terms:
                  </strong>{" "}
                  If the rounded top number (numerator) is even, divide both top and
                  bottom by 2 (or their Greatest Common Divisor) until the top number
                  is odd, then combine with your whole inches.
                </li>
              </ol>

              {/* Side-by-Side 1/16, 1/32, and 1/64 Worked Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Nearest 1/16 */}
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Nearest 1/16&Prime; (Tape Measure)
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <div>
                      {fractionalInchesGuide.decimalRemainderFormatted} × 16 ={" "}
                      <strong>{fractionalInchesGuide.rawProduct16}</strong>
                    </div>
                    <div>
                      Round half up →{" "}
                      <strong>
                        {fractionalInchesGuide.frac16.unreducedNumerator}/16
                      </strong>
                    </div>
                    <div>
                      Reduced:{" "}
                      <strong>
                        {fractionalInchesGuide.frac16.fractionOnlyDisplay}
                      </strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 font-mono text-lg font-extrabold text-[#16324F] dark:text-white tabular-nums">
                    = {fractionalInchesGuide.frac16.display} in
                  </div>
                </div>

                {/* Nearest 1/32 */}
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Nearest 1/32&Prime; (Woodworking Rule)
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <div>
                      {fractionalInchesGuide.decimalRemainderFormatted} × 32 ={" "}
                      <strong>{fractionalInchesGuide.rawProduct32}</strong>
                    </div>
                    <div>
                      Round half up →{" "}
                      <strong>
                        {fractionalInchesGuide.frac32.unreducedNumerator}/32
                      </strong>
                    </div>
                    <div>
                      Reduced:{" "}
                      <strong>
                        {fractionalInchesGuide.frac32.fractionOnlyDisplay}
                      </strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 font-mono text-lg font-extrabold text-[#16324F] dark:text-white tabular-nums">
                    = {fractionalInchesGuide.frac32.display} in
                  </div>
                </div>

                {/* Nearest 1/64 */}
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
                    Nearest 1/64&Prime; (Machinist Scale)
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <div>
                      {fractionalInchesGuide.decimalRemainderFormatted} × 64 ={" "}
                      <strong>{fractionalInchesGuide.rawProduct64}</strong>
                    </div>
                    <div>
                      Round half up →{" "}
                      <strong>
                        {fractionalInchesGuide.frac64.unreducedNumerator}/64
                      </strong>
                    </div>
                    <div>
                      Reduced:{" "}
                      <strong>
                        {fractionalInchesGuide.frac64.fractionOnlyDisplay}
                      </strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 font-mono text-lg font-extrabold text-[#0D9488] dark:text-[#2DD4BF] tabular-nums">
                    = {fractionalInchesGuide.frac64.display} in
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. WHAT IS A [SOURCE UNIT] & WHAT IS A [TARGET UNIT] ENCYCLOPEDIA SECTIONS */}
        <section
          aria-labelledby="unit-definitions-heading"
          className="cv-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6"
        >
          {/* Source Unit Encyclopedia Section */}
          <div className="space-y-3.5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <h2
              id="unit-definitions-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              {editorial.fromUnitGuide.heading}
            </h2>
            <p>
              {editorial.fromUnitGuide.definitionParagraph}{" "}
              <a
                href="#references-standards-heading"
                className="font-mono text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                [1]
              </a>
            </p>
            <p>{editorial.fromUnitGuide.systemAndSymbolParagraph}</p>
            <p>{editorial.fromUnitGuide.notationOrPrefixParagraph}</p>

            {editorial.fromUnitGuide.benchmarkCallout && (
              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border-l-4 border-[#0D9488] text-[15px] sm:text-base font-semibold text-[#16324F] dark:text-slate-200 leading-relaxed">
                {editorial.fromUnitGuide.benchmarkCallout}
              </div>
            )}

            <p>{editorial.fromUnitGuide.toolsAndApplicationsParagraph}</p>
            <div>
              <Link
                href={editorial.fromUnitGuide.categoryHref}
                prefetch={false}
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                <span>{editorial.fromUnitGuide.categoryLinkLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Target Unit Encyclopedia Section */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
              {editorial.toUnitGuide.heading}
            </h2>
            <p>
              {editorial.toUnitGuide.definitionParagraph}{" "}
              <a
                href="#references-standards-heading"
                className="font-mono text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                [2]
              </a>
            </p>
            <p>{editorial.toUnitGuide.systemAndSymbolParagraph}</p>
            <p>{editorial.toUnitGuide.notationOrPrefixParagraph}</p>

            {editorial.toUnitGuide.benchmarkCallout && (
              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border-l-4 border-[#0D9488] text-[15px] sm:text-base font-semibold text-[#16324F] dark:text-slate-200 leading-relaxed">
                {editorial.toUnitGuide.benchmarkCallout}
              </div>
            )}

            <p>{editorial.toUnitGuide.toolsAndApplicationsParagraph}</p>
            <div>
              <Link
                href={editorial.toUnitGuide.categoryHref}
                prefetch={false}
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                <span>{editorial.toUnitGuide.categoryLinkLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="pt-3 text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/70 leading-relaxed">
              {editorial.measuringAdviceParagraph}
            </p>
          </div>
        </section>

        {/* 5. MORE [UNIT A] & [UNIT B] CONVERSIONS (Reverse Conversion Prose + Complete Internal Linking Lists) */}
        <section
          aria-labelledby="more-unit-conversions-heading"
          className="cv-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
        >
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF]">
              <Link2 className="w-4 h-4" />
            </span>
            <h2
              id="more-unit-conversions-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              {moreUnitLinks.sectionHeading}
            </h2>
          </div>

          {(() => {
            const reversePair =
              CONVERSION_CATALOGUE.find(
                (p) => p.fromUnitId === toUnit.id && p.toUnitId === fromUnit.id
              ) || getConversionPair(getCanonicalPairSlug(toUnit, fromUnit), toUnit.categoryId);
            const fallbackRelated = (pairContent?.internalLinks || [])
              .filter((l) => l.type === "related")
              .slice(0, 6);
            const otherRelated = (featuredRelatedPairs || [])
              .filter((p) => p.slug !== pair.slug && p.slug !== reversePair?.slug)
              .slice(0, 6);
            return (
              <div className="space-y-4">
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Need to calculate in the opposite direction? Use our{" "}
                  {reversePair ? (
                    <Link
                      href={getPairUrl(reversePair)}
                      prefetch={false}
                      className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                    >
                      {toUnit.plural.toLowerCase()} to {fromUnit.plural.toLowerCase()} converter
                    </Link>
                  ) : (
                    <span>
                      {toUnit.plural.toLowerCase()} to {fromUnit.plural.toLowerCase()} converter
                    </span>
                  )}{" "}
                  ({toUnit.symbol} to {fromUnit.symbol}), or browse our complete{" "}
                  {category && (
                    <Link
                      href={getCategoryUrl(category.id)}
                      prefetch={false}
                      className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                    >
                      {category.name.toLowerCase()} converter
                    </Link>
                  )}{" "}
                  hub.
                </p>

                {(otherRelated.length >= 4 || fallbackRelated.length > 0) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Related {category?.name} Converters
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {otherRelated.length >= 4
                        ? otherRelated.map((rel) => {
                            const rFrom = UNIT_MAP.get(rel.fromUnitId);
                            const rTo = UNIT_MAP.get(rel.toUnitId);
                            const anchorLabel =
                              rFrom && rTo
                                ? `${rFrom.plural.toLowerCase()} to ${rTo.plural.toLowerCase()} converter`
                                : `${rel.title.replace(/\s*Converter.*$/i, "").toLowerCase()} converter`;
                            return (
                              <Link
                                key={rel.slug}
                                href={getPairUrl(rel)}
                                prefetch={false}
                                className="inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#0D9488] text-sm font-bold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors capitalize"
                              >
                                <span>{anchorLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                              </Link>
                            );
                          })
                        : fallbackRelated.map((rel) => (
                            <Link
                              key={rel.href}
                              href={rel.href}
                              prefetch={false}
                              className="inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#0D9488] text-sm font-bold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors capitalize"
                            >
                              <span>{rel.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                            </Link>
                          ))}
                    </div>
                  </div>
                )}

                {/* Curated Hub & Guide Internal Links (Task 5 Gate #6) */}
                {pairContent?.internalLinks && pairContent.internalLinks.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    {pairContent.internalLinks
                      .filter((l) => l.type === "guide" || l.type === "hub")
                      .map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          prefetch={false}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E6FAF8]/70 dark:bg-teal-950/40 border border-[#0D9488]/30 text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#0D9488] hover:text-white transition-colors"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Collapsed All Conversions (<details>) for Extended / Tier C Unit Links (Task 7) */}
          <details className="group rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC]/70 dark:bg-slate-950/50 p-4">
            <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-extrabold text-[#16324F] dark:text-slate-200">
              <span>
                All conversions for {fromUnit.plural} &amp; {toUnit.plural} (
                {moreUnitLinks.fromLinks.length + moreUnitLinks.toLinks.length} pairs)
              </span>
              <ChevronDown className="w-4 h-4 text-[#0D9488] group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Column 1: Convert from [FromUnit.plural] */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-[#16324F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  {moreUnitLinks.fromHeading}
                </h3>
                <ul className="space-y-1.5">
                  {moreUnitLinks.fromLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white hover:underline transition-colors py-0.5"
                      >
                        <span aria-hidden="true" className="text-slate-400 font-bold shrink-0">
                          ›
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Convert to [ToUnit.plural] */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-[#16324F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  {moreUnitLinks.toHeading}
                </h3>
                <ul className="space-y-1.5">
                  {moreUnitLinks.toLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white hover:underline transition-colors py-0.5"
                      >
                        <span aria-hidden="true" className="text-slate-400 font-bold shrink-0">
                          ›
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          {/* Popular Converters Across Categories + Link to Homepage Popular List */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Most Popular Unit Converters
              </h3>
              <Link
                href="/#popular-converters"
                prefetch={false}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                <span>View all popular unit converters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {TOP_20_POPULAR_CONVERTERS.filter(
                (pop) => !pop.href.endsWith(`/${pair.slug}`)
              )
                .slice(0, 8)
                .map((pop) => (
                  <Link
                    key={pop.href}
                    href={pop.href}
                    prefetch={false}
                    className="px-3 py-1.5 rounded-lg bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#0D9488] text-xs sm:text-sm font-semibold text-[#16324F] dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors capitalize"
                  >
                    {pop.anchorText}
                  </Link>
                ))}
            </div>
          </div>

          {(pair.categoryId === "mass" || pair.categoryId === "volume") && (
            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 p-4 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white">
                  Converting Grams or Ounces to Cups, Tbsp &amp; Tsp?
                </div>
                <Link
                  href="/cooking"
                  prefetch={false}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                >
                  <span>Open Cooking &amp; Ingredient Converter</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Weight and volume require ingredient density (g/mL). Choose a
                USDA FoodData Central verified ingredient below:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { slug: "flour", label: "Flour (125 g/cup)" },
                  { slug: "sugar", label: "Granulated Sugar (200 g/cup)" },
                  { slug: "brown-sugar", label: "Brown Sugar (220 g/cup)" },
                  { slug: "powdered-sugar", label: "Powdered Sugar (120 g/cup)" },
                  { slug: "butter", label: "Butter (227 g/cup)" },
                  { slug: "rice", label: "Rice (185 g/cup)" },
                  { slug: "milk", label: "Milk (244 g/cup)" },
                  { slug: "water", label: "Water (236.6 g/cup)" },
                  { slug: "honey", label: "Honey (339 g/cup)" },
                  { slug: "oil", label: "Cooking Oil (218 g/cup)" },
                  { slug: "salt", label: "Salt (292 g/cup)" },
                ].map((ing) => (
                  <Link
                    key={ing.slug}
                    href={`/cooking/${ing.slug}`}
                    prefetch={false}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0D9488] text-xs font-semibold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] transition-colors"
                  >
                    {ing.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 6. FREQUENTLY ASKED QUESTIONS (Server-Rendered in Initial HTML, Task 5 Gate #7) */}
        {(pairContent?.faqs?.length || editorial.googlePaaFaqs.length > 0) && (
          <section aria-labelledby="pair-faq-heading" className="cv-auto space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-100/90 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h2
                id="pair-faq-heading"
                className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2.5">
              {(pairContent?.faqs && pairContent.faqs.length >= 2
                ? pairContent.faqs
                : editorial.googlePaaFaqs
              ).map((faq, idx) => {
                const isOpen = openFaqIndex === null || openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
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
                    <div className="px-5 pb-4 pt-2 text-[15px] sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* =====================================================================
          RIGHT SIDEBAR COLUMN (4 cols on lg)
          ===================================================================== */}
      <aside className="cv-auto lg:col-span-4 space-y-6">
        {/* 1. Category Converter Pair Links */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2.5 pb-1">
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${theme.sidebarBadge}`}
            >
              {renderCategoryIcon(iconName, "w-4 h-4")}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
              {category ? `${category.name} Converter` : "Unit Converter"}
            </h2>
          </div>

          <nav
            aria-label={`${category?.name || "Unit"} conversion links`}
            className="space-y-1.5"
          >
            {sidebarCategoryPairs.map((p) => {
              const pFrom = UNIT_MAP.get(p.fromUnitId);
              const pTo = UNIT_MAP.get(p.toUnitId);
              const label =
                pFrom && pTo
                  ? `${pFrom.plural} to ${pTo.plural}`
                  : p.title.replace(" Converter", "");
              const isActive = p.slug === pair.slug;
              return (
                <Link
                  key={p.slug}
                  href={getPairUrl(p)}
                  prefetch={false}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm sm:text-[15px] font-bold transition-colors ${
                    isActive
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
            <li>
              <strong className="text-[#16324F] dark:text-white">
                Direct Factor:
              </strong>{" "}
              1 {fromUnit.name.toLowerCase()} ({fromUnit.symbol}) equals{" "}
              {oneForward.formattedValue} {toUnit.plural.toLowerCase()} (
              {toUnit.symbol}).
            </li>
            <li>
              <strong className="text-[#16324F] dark:text-white">
                Inverse Factor:
              </strong>{" "}
              1 {toUnit.name.toLowerCase()} ({toUnit.symbol}) equals{" "}
              {oneReverse.formattedValue} {fromUnit.plural.toLowerCase()} (
              {fromUnit.symbol}).
            </li>
            <li>
              <strong className="text-[#16324F] dark:text-white">
                Formula:
              </strong>{" "}
              {formulaDetails.primaryFormula}.
            </li>
            {pair.regionalNote ? (
              <li>
                <strong className="text-[#16324F] dark:text-white">
                  Standard Note:
                </strong>{" "}
                {pair.regionalNote}
              </li>
            ) : (
              <li>
                <strong className="text-[#16324F] dark:text-white">
                  Verified Precision:
                </strong>{" "}
                Anchored to official NIST SP 811 and ISO/IEC 80000 standards.
              </li>
            )}
          </ul>
        </div>

        {/* 3. Units Comparison Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#0D9488]" />
            <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
              Units Comparison
            </h2>
          </div>

          <div className="space-y-3">
            {/* Source Unit Card */}
            <div className="p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/50 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                {renderCategoryIcon(iconName, "w-4 h-4")}
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white">
                  {formatUnitWithSymbol(fromUnit.name, fromUnit.symbol)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {fromUnit.description ||
                    `Standard source unit of ${
                      category?.name.toLowerCase() || "measurement"
                    }.`}
                </p>
              </div>
            </div>

            {/* Target Unit Card */}
            <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                {renderCategoryIcon(iconName, "w-4 h-4")}
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white">
                  {formatUnitWithSymbol(toUnit.name, toUnit.symbol)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {toUnit.description ||
                    `Standard target unit of ${
                      category?.name.toLowerCase() || "measurement"
                    }.`}
                </p>
              </div>
            </div>

            {/* 3rd Reference Unit Card */}
            {thirdVisualUnit.id !== fromUnit.id &&
              thirdVisualUnit.id !== toUnit.id && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {renderCategoryIcon(iconName, "w-4 h-4")}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm sm:text-[15px] font-extrabold text-[#16324F] dark:text-white">
                      {formatUnitWithSymbol(thirdVisualUnit.name, thirdVisualUnit.symbol)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {thirdVisualUnit.description ||
                        `Reference unit in ${
                          category?.name.toLowerCase() || "this category"
                        }.`}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* 4. Clean Compact References Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0" />
            <h2
              id="references-standards-heading"
              className="text-sm sm:text-base font-extrabold text-[#16324F] dark:text-white"
            >
              References
            </h2>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {getTrustedReferencesForPair(pair, fromUnit, toUnit).map((ref, idx) => (
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
            {sidebarRelatedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={getCategoryUrl(cat.id)}
                prefetch={false}
                className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg text-sm sm:text-[15px] font-bold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] hover:bg-[#F7F9FC] dark:hover:bg-slate-800/60 transition-colors"
              >
                <span>{cat.name} Converter</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </nav>
        </div>

        {/* 6. Embed Calculator Widget Card */}
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
            Embed the interactive <strong>{fromUnit.plural} to {toUnit.plural}</strong> converter on your blog, classroom, or documentation page.
          </p>

          <Link
            href={`/widgets/w/${matchingCanonicalPair?.slug || pair.slug}`}
            rel="nofollow"
            prefetch={false}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#16324F] hover:bg-[#0D9488] text-white text-sm font-extrabold transition-colors"
          >
            <Code2 className="w-4 h-4" />
            <span>Customize &amp; Get Embed Code</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
