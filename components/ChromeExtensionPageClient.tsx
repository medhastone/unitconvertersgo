"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Copy,
  Check,
  ArrowLeftRight,
  ExternalLink,
  Sun,
  Moon,
  History,
  MousePointerClick,
  Keyboard,
  ShieldCheck,
  WifiOff,
  Download,
  Chrome,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  FolderArchive,
  Zap,
  Ruler,
  Cpu,
  Utensils,
  Gauge,
  Compass,
} from "lucide-react";
import {
  CATEGORIES,
  UNIT_MAP,
  UNITS,
  getUnitsByCategory,
} from "@/lib/conversions/units";
import { convertUnits, formatValue } from "@/lib/conversions/engine";
import {
  getCanonicalPairSlug,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { PrecisionMode, Unit } from "@/lib/conversions/types";

interface HistoryEntry {
  id: string;
  inputVal: number;
  fromUnitId: string;
  toUnitId: string;
  fromSymbol: string;
  toSymbol: string;
  formattedResult: string;
  pairHref: string;
}

const EXTENSION_CATEGORY_IDS = [
  "length",
  "mass",
  "temperature",
  "volume",
  "area",
  "speed",
  "time",
  "digital_storage",
  "data_transfer",
  "frequency",
  "pressure",
  "energy",
  "power",
  "force",
  "torque",
  "flow",
  "density",
  "acceleration",
  "current",
  "electric_potential",
  "resistance",
  "capacitance",
  "inductance",
  "charge",
  "angle",
  "fuel_economy",
  "illumination",
  "volume_dry",
];

const DEFAULT_HISTORY: HistoryEntry[] = [
  {
    id: "5-kilometer-mile",
    inputVal: 5,
    fromUnitId: "kilometer",
    toUnitId: "mile",
    fromSymbol: "km",
    toSymbol: "mi",
    formattedResult: "3.106856",
    pairHref: "/length/km-to-miles",
  },
  {
    id: "72-fahrenheit-celsius",
    inputVal: 72,
    fromUnitId: "fahrenheit",
    toUnitId: "celsius",
    fromSymbol: "°F",
    toSymbol: "°C",
    formattedResult: "22.222222",
    pairHref: "/temperature/fahrenheit-to-celsius",
  },
  {
    id: "10-kilogram-pound",
    inputVal: 10,
    fromUnitId: "kilogram",
    toUnitId: "pound",
    fromSymbol: "kg",
    toSymbol: "lb",
    formattedResult: "22.046226",
    pairHref: "/weight-and-mass/kg-to-lbs",
  },
  {
    id: "2-us_cup-milliliter",
    inputVal: 2,
    fromUnitId: "us_cup",
    toUnitId: "milliliter",
    fromSymbol: "cup (US)",
    toSymbol: "mL",
    formattedResult: "473.176473",
    pairHref: "/volume/cups-to-ml",
  },
  {
    id: "100-psi-bar",
    inputVal: 100,
    fromUnitId: "psi",
    toUnitId: "bar",
    fromSymbol: "psi",
    toSymbol: "bar",
    formattedResult: "6.894757",
    pairHref: "/pressure/psi-to-bar",
  },
];

const QUICK_SEARCH_PRESETS = [
  { label: "5 km to miles", query: "5 km to miles" },
  { label: "72 f in c", query: "72 f in c" },
  { label: "10 kg to lbs", query: "10 kg to lbs" },
  { label: "250 ml to cups", query: "250 ml to cups" },
  { label: "100 psi to bar", query: "100 psi to bar" },
];

const CONTEXT_MENU_SAMPLES = [
  {
    id: "10kg",
    selectedText: "10 kg",
    contextSentenceBefore: "Checked baggage allowance on international flights is limited to ",
    contextSentenceAfter: " per small carry-on item.",
    fromUnitId: "kilogram",
    toUnitId: "pound",
    inputVal: 10,
    convertedDisplay: "22.0462 lb (352.74 oz)",
    pairHref: "/weight-and-mass/kg-to-lbs",
  },
  {
    id: "5km",
    selectedText: "5 km",
    contextSentenceBefore: "The morning park run follows a flat ",
    contextSentenceAfter: " waterfront loop along the bay.",
    fromUnitId: "kilometer",
    toUnitId: "mile",
    inputVal: 5,
    convertedDisplay: "3.1069 miles (16,404.2 ft)",
    pairHref: "/length/km-to-miles",
  },
  {
    id: "72f",
    selectedText: "72 °F",
    contextSentenceBefore: "Set the room thermostat to ",
    contextSentenceAfter: " for optimal indoor comfort.",
    fromUnitId: "fahrenheit",
    toUnitId: "celsius",
    inputVal: 72,
    convertedDisplay: "22.22 °C (295.37 K)",
    pairHref: "/temperature/fahrenheit-to-celsius",
  },
  {
    id: "2cups",
    selectedText: "2 cups",
    contextSentenceBefore: "Whisk ",
    contextSentenceAfter: " of warm milk into the batter until smooth.",
    fromUnitId: "us_cup",
    toUnitId: "milliliter",
    inputVal: 2,
    convertedDisplay: "473.18 mL (16 US fl oz)",
    pairHref: "/volume/cups-to-ml",
  },
];

const UNIT_SHORTHAND_MAP: Record<string, string> = {
  f: "fahrenheit",
  "°f": "fahrenheit",
  degf: "fahrenheit",
  c: "celsius",
  "°c": "celsius",
  degc: "celsius",
  k: "kelvin",
  km: "kilometer",
  kilometers: "kilometer",
  kilometres: "kilometer",
  m: "meter",
  meters: "meter",
  metres: "meter",
  cm: "centimeter",
  mm: "millimeter",
  mi: "mile",
  mile: "mile",
  miles: "mile",
  ft: "foot",
  feet: "foot",
  in: "inch",
  inch: "inch",
  inches: "inch",
  yd: "yard",
  yards: "yard",
  kg: "kilogram",
  kgs: "kilogram",
  g: "gram",
  grams: "gram",
  mg: "milligram",
  lb: "pound",
  lbs: "pound",
  pounds: "pound",
  oz: "ounce",
  ounces: "ounce",
  l: "liter",
  liter: "liter",
  liters: "liter",
  ml: "milliliter",
  cup: "us_cup",
  cups: "us_cup",
  tbsp: "us_tablespoon",
  tablespoons: "us_tablespoon",
  tsp: "us_teaspoon",
  teaspoons: "us_teaspoon",
  gal: "us_gallon",
  gallons: "us_gallon",
  floz: "us_fluid_ounce",
  "fl oz": "us_fluid_ounce",
  psi: "psi",
  bar: "bar",
  kpa: "kilopascal",
  mph: "mph",
  kph: "km_per_h",
  "km/h": "km_per_h",
  gb: "gigabyte",
  mb: "megabyte",
  tb: "terabyte",
};

function resolveExtensionUnitToken(rawToken: string): Unit | null {
  const token = rawToken.trim().toLowerCase();
  if (!token) return null;

  const mappedId = UNIT_SHORTHAND_MAP[token];
  if (mappedId) {
    const found = UNIT_MAP.get(mappedId);
    if (found) return found;
  }

  for (const u of UNITS) {
    if (
      u.id.toLowerCase() === token ||
      u.name.toLowerCase() === token ||
      u.plural.toLowerCase() === token ||
      u.symbol.toLowerCase() === token ||
      u.aliases.some((a) => a.toLowerCase() === token)
    ) {
      return u;
    }
  }

  const singular = token.endsWith("s") ? token.slice(0, -1) : token;
  if (singular.length >= 2) {
    for (const u of UNITS) {
      if (
        u.id.toLowerCase() === singular ||
        u.name.toLowerCase() === singular ||
        u.aliases.some((a) => a.toLowerCase() === singular)
      ) {
        return u;
      }
    }
  }

  return null;
}

function parseQuickSearchBox(query: string): {
  value: number;
  fromUnit: Unit;
  toUnit: Unit;
} | null {
  const cleaned = query.trim();
  if (!cleaned) return null;

  const match = cleaned.match(
    /^([+-]?\d+(?:\.\d+)?)\s*([a-zA-Z°µΩ/\s]+?)\s+(?:to|in|into|->)\s+([a-zA-Z°µΩ/\s]+)$/i
  );
  if (!match) return null;

  const val = parseFloat(match[1]);
  if (!Number.isFinite(val)) return null;

  const fromUnit = resolveExtensionUnitToken(match[2]);
  const toUnit = resolveExtensionUnitToken(match[3]);
  if (!fromUnit || !toUnit || fromUnit.categoryId !== toUnit.categoryId) {
    return null;
  }

  return { value: val, fromUnit, toUnit };
}

export default function ChromeExtensionPageClient() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("length");
  const [fromUnitId, setFromUnitId] = useState<string>("kilometer");
  const [toUnitId, setToUnitId] = useState<string>("mile");
  const [inputValueStr, setInputValueStr] = useState<string>("5");
  const [quickQuery, setQuickQuery] = useState<string>("5 km to miles");
  const [popupTheme, setPopupTheme] = useState<"light" | "dark">("light");
  const [decimals, setDecimals] = useState<PrecisionMode>("auto");
  const [copiedResult, setCopiedResult] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(DEFAULT_HISTORY);
  const [activeContextId, setActiveContextId] = useState<string>("10kg");
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [downloadedBundle, setDownloadedBundle] = useState(false);

  // Listen for Alt+U keyboard shortcut on the page to focus the extension simulator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        const el = document.getElementById("extension-quick-search-input");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          (el as HTMLInputElement).focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const extensionCategories = useMemo(() => {
    const filtered = CATEGORIES.filter((c) =>
      EXTENSION_CATEGORY_IDS.includes(c.id)
    );
    return filtered.length > 0 ? filtered : CATEGORIES.slice(0, 31);
  }, []);

  const categoryUnits = useMemo(() => {
    const list = getUnitsByCategory(selectedCategoryId);
    return list.length > 0 ? list : getUnitsByCategory("length");
  }, [selectedCategoryId]);

  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValueStr);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [inputValueStr]);

  const conversionResult = useMemo(() => {
    return convertUnits(numericValue, fromUnitId, toUnitId, decimals);
  }, [numericValue, fromUnitId, toUnitId, decimals]);

  const formattedOutput = useMemo(() => {
    if (!Number.isFinite(conversionResult.rawValue)) return "—";
    if (decimals === "auto") {
      return formatValue(conversionResult.rawValue, "6");
    }
    return formatValue(conversionResult.rawValue, decimals);
  }, [conversionResult.rawValue, decimals]);

  const fromUnit = UNIT_MAP.get(fromUnitId) || conversionResult.fromUnit;
  const toUnit = UNIT_MAP.get(toUnitId) || conversionResult.toUnit;

  const matchingWebsiteHref = useMemo(() => {
    const slug = getCanonicalPairSlug(fromUnit, toUnit);
    return getPairUrl({
      categoryId: fromUnit.categoryId,
      slug,
    });
  }, [fromUnit, toUnit]);

  const pushToHistory = (
    val: number,
    fUnit: Unit,
    tUnit: Unit,
    resultStr: string
  ) => {
    const slug = getCanonicalPairSlug(fUnit, tUnit);
    const pairHref = getPairUrl({ categoryId: fUnit.categoryId, slug });
    const entryId = `${val}-${fUnit.id}-${tUnit.id}`;
    const newEntry: HistoryEntry = {
      id: entryId,
      inputVal: val,
      fromUnitId: fUnit.id,
      toUnitId: tUnit.id,
      fromSymbol: fUnit.symbol,
      toSymbol: tUnit.symbol,
      formattedResult: resultStr,
      pairHref,
    };
    setHistory((prev) => {
      const deduped = prev.filter((item) => item.id !== entryId);
      return [newEntry, ...deduped].slice(0, 5);
    });
  };

  const handleQuickQueryChange = (val: string) => {
    setQuickQuery(val);
    const parsed = parseQuickSearchBox(val);
    if (parsed) {
      setSelectedCategoryId(parsed.fromUnit.categoryId);
      setFromUnitId(parsed.fromUnit.id);
      setToUnitId(parsed.toUnit.id);
      setInputValueStr(String(parsed.value));
      const out = convertUnits(
        parsed.value,
        parsed.fromUnit.id,
        parsed.toUnit.id,
        decimals
      );
      const formatted =
        decimals === "auto"
          ? formatValue(out.rawValue, "6")
          : formatValue(out.rawValue, decimals);
      pushToHistory(parsed.value, parsed.fromUnit, parsed.toUnit, formatted);
    }
  };

  const handleCategoryChange = (newCatId: string) => {
    setSelectedCategoryId(newCatId);
    const units = getUnitsByCategory(newCatId);
    if (units.length >= 2) {
      setFromUnitId(units[0].id);
      setToUnitId(units[1].id);
      setQuickQuery(
        `${inputValueStr || "1"} ${units[0].symbol} to ${units[1].symbol}`
      );
    }
  };

  const handleSwapUnits = () => {
    const prevFrom = fromUnitId;
    const prevTo = toUnitId;
    setFromUnitId(prevTo);
    setToUnitId(prevFrom);
    const f = UNIT_MAP.get(prevTo);
    const t = UNIT_MAP.get(prevFrom);
    if (f && t) {
      setQuickQuery(`${inputValueStr || "1"} ${f.symbol} to ${t.symbol}`);
    }
  };

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(
        `${formattedOutput} ${toUnit.symbol}`
      );
      setCopiedResult(true);
      pushToHistory(numericValue, fromUnit, toUnit, formattedOutput);
      setTimeout(() => setCopiedResult(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSelectHistoryItem = (item: HistoryEntry) => {
    const fUnit = UNIT_MAP.get(item.fromUnitId);
    const tUnit = UNIT_MAP.get(item.toUnitId);
    if (fUnit && tUnit) {
      setSelectedCategoryId(fUnit.categoryId);
      setFromUnitId(fUnit.id);
      setToUnitId(tUnit.id);
      setInputValueStr(String(item.inputVal));
      setQuickQuery(`${item.inputVal} ${fUnit.symbol} to ${tUnit.symbol}`);
    }
  };

  const handleDownloadExtensionManifest = () => {
    const manifestJson = {
      manifest_version: 3,
      name: "UnitConvertersGo — Fast Offline Unit Calculator",
      short_name: "UnitConvertersGo",
      version: "1.0.0",
      description:
        "Pick two units, type a number, and see the answer instantly. Supports 31 categories, quick search, and right-click conversion.",
      permissions: ["contextMenus", "storage"],
      action: {
        default_title: "UnitConvertersGo (Alt+U)",
        default_popup: "popup.html",
      },
      commands: {
        _execute_action: {
          suggested_key: {
            default: "Alt+U",
            mac: "Alt+U",
          },
          description: "Open UnitConvertersGo toolbar calculator",
        },
      },
      background: {
        service_worker: "background.js",
      },
      homepage_url: "https://unitconvertersgo.com",
    };

    const blob = new Blob([JSON.stringify(manifestJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unitconvertersgo-manifest-v3.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedBundle(true);
    setTimeout(() => setDownloadedBundle(false), 3000);
  };

  const activeContextSample =
    CONTEXT_MENU_SAMPLES.find((s) => s.id === activeContextId) ||
    CONTEXT_MENU_SAMPLES[0];

  const supportedCategoryGroups = [
    {
      title: "Everyday",
      icon: <Ruler className="w-5 h-5 text-[#0D9488]" />,
      summary: "length, weight, temperature, volume, area, speed, time",
      links: [
        { label: "Length", href: getCategoryUrl("length") },
        { label: "Weight & Mass", href: getCategoryUrl("mass") },
        { label: "Temperature", href: getCategoryUrl("temperature") },
        { label: "Volume", href: getCategoryUrl("volume") },
        { label: "Area", href: getCategoryUrl("area") },
        { label: "Speed", href: getCategoryUrl("speed") },
        { label: "Time", href: getCategoryUrl("time") },
      ],
    },
    {
      title: "Technology",
      icon: <Cpu className="w-5 h-5 text-[#0D9488]" />,
      summary: "data storage, data transfer rate, frequency",
      links: [
        { label: "Data Storage", href: getCategoryUrl("digital_storage") },
        { label: "Data Transfer Rate", href: getCategoryUrl("data_transfer") },
        { label: "Frequency", href: getCategoryUrl("frequency") },
      ],
    },
    {
      title: "Home and kitchen",
      icon: <Utensils className="w-5 h-5 text-[#0D9488]" />,
      summary:
        "cups, tablespoons, teaspoons, fluid ounces, gallons (US and UK)",
      links: [
        { label: "Cups to mL", href: "/volume/cups-to-ml" },
        { label: "Tablespoons to mL", href: "/volume/tablespoons-to-ml" },
        { label: "Teaspoons to mL", href: "/volume/teaspoons-to-ml" },
        { label: "Fluid Ounces to mL", href: "/volume/fl-oz-to-ml" },
        { label: "Gallons to Liters (US & UK)", href: "/volume/gallons-to-liters" },
        { label: "Cooking Ingredient Hub", href: "/cooking" },
      ],
    },
    {
      title: "Engineering",
      icon: <Gauge className="w-5 h-5 text-[#0D9488]" />,
      summary:
        "pressure, energy, power, force, torque, flow, density, acceleration",
      links: [
        { label: "Pressure", href: getCategoryUrl("pressure") },
        { label: "Energy", href: getCategoryUrl("energy") },
        { label: "Power", href: getCategoryUrl("power") },
        { label: "Force", href: getCategoryUrl("force") },
        { label: "Torque", href: getCategoryUrl("torque") },
        { label: "Flow Rate", href: getCategoryUrl("flow") },
        { label: "Density", href: getCategoryUrl("density") },
        { label: "Acceleration", href: getCategoryUrl("acceleration") },
      ],
    },
    {
      title: "Electrical",
      icon: <Zap className="w-5 h-5 text-[#0D9488]" />,
      summary:
        "current, voltage, resistance, capacitance, inductance, charge",
      links: [
        { label: "Electric Current", href: getCategoryUrl("current") },
        { label: "Voltage (Electric Potential)", href: getCategoryUrl("electric_potential") },
        { label: "Electrical Resistance", href: getCategoryUrl("resistance") },
        { label: "Capacitance", href: getCategoryUrl("capacitance") },
        { label: "Inductance", href: getCategoryUrl("inductance") },
        { label: "Electric Charge", href: getCategoryUrl("charge") },
      ],
    },
    {
      title: "Also Included",
      icon: <Compass className="w-5 h-5 text-[#0D9488]" />,
      summary: "angle, fuel economy, illumination, dry volume and more",
      links: [
        { label: "Angle", href: getCategoryUrl("angle") },
        { label: "Fuel Economy", href: getCategoryUrl("fuel_economy") },
        { label: "Illumination", href: getCategoryUrl("illumination") },
        { label: "Volume — Dry", href: getCategoryUrl("volume_dry") },
        { label: "Browse All Categories", href: "/directory" },
      ],
    },
  ];

  return (
    <div className="space-y-12">
      {/* =====================================================================
          HERO SECTION + LIVE EXTENSION POPUP SIMULATOR
          ===================================================================== */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Product Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
              <span>Browser Toolbar Extension</span>
              <span aria-hidden="true">·</span>
              <span>31 Unit Categories</span>
              <span aria-hidden="true">·</span>
              <span>100% Offline &amp; Private</span>
              <span aria-hidden="true">·</span>
              <span>Shortcut: Alt+U</span>
            </div>

            <div className="space-y-3.5">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#16324F] dark:text-white leading-[1.15]">
                UnitConvertersGo for Chrome — Fast, Simple Browser Toolbar Unit Calculator
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                UnitConvertersGo is a fast, simple unit calculator for your browser toolbar. Pick two units, type a number, and see the answer instantly. No sign-up and no internet connection needed.
              </p>
            </div>

            {/* Key Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#16324F] dark:text-white">Quick search box:</strong>{" "}
                  type <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">&quot;5 km to miles&quot;</code> or{" "}
                  <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">&quot;72 f in c&quot;</code>
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#16324F] dark:text-white">Right-click conversion:</strong>{" "}
                  select any value like <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">&quot;10 kg&quot;</code> on a web page
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#16324F] dark:text-white">Remembers last 5 conversions</strong>{" "}
                  with one-click copy
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#16324F] dark:text-white">Works 100% offline:</strong>{" "}
                  zero tracking, no personal data collected
                </span>
              </div>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setShowInstallModal(true)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm sm:text-base font-extrabold shadow-sm transition-colors cursor-pointer"
              >
                <Chrome className="w-5 h-5 shrink-0" />
                <span>Add to Chrome — It&apos;s Free</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadExtensionManifest}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-xl bg-[#F7F9FC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 text-[#16324F] dark:text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0D9488] shrink-0" />
                <span>
                  {downloadedBundle
                    ? "Downloaded manifest.json!"
                    : "Download Manifest V3 Config"}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>
                  Press <kbd className="px-1.5 py-0.5 font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[#16324F] dark:text-slate-200">Alt+U</kbd> now to focus the live toolbar simulator
                </span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Compatible with Chrome, Brave, Edge &amp; Chromium browsers</span>
            </div>
          </div>

          {/* Right Column: Authentic Interactive Chrome Extension Popup Simulator */}
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[390px]">
              {/* Simulated Browser Address & Toolbar Header */}
              <div className="rounded-t-2xl bg-slate-100 dark:bg-slate-800 border border-b-0 border-slate-200/90 dark:border-slate-700 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-2 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate text-center">
                  unitconvertersgo.com
                </div>
                <div
                  title="UnitConvertersGo Toolbar Icon (Alt+U)"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0D9488] text-white text-[11px] font-extrabold shadow-2xs"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Alt+U</span>
                </div>
              </div>

              {/* Extension Popup Window Container */}
              <div
                className={`rounded-b-2xl border shadow-xl transition-colors duration-150 p-4 space-y-3.5 ${
                  popupTheme === "dark"
                    ? "bg-slate-950 border-slate-800 text-slate-100"
                    : "bg-white border-slate-200/90 text-[#16324F]"
                }`}
              >
                {/* Popup Top Bar: Brand + Theme Toggle + Decimal Precision */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0D9488] text-white flex items-center justify-center font-extrabold text-xs">
                      U
                    </div>
                    <div>
                      <div className="text-xs font-extrabold leading-none">
                        UnitConvertersGo
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Offline Toolbar Calculator
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Decimal Places Selector */}
                    <div
                      className={`inline-flex items-center rounded-lg p-0.5 border text-[10px] font-mono font-bold ${
                        popupTheme === "dark"
                          ? "bg-slate-900 border-slate-800"
                          : "bg-slate-100 border-slate-200"
                      }`}
                      title="Adjustable decimal places"
                    >
                      {(["auto", "2", "4"] as PrecisionMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setDecimals(mode)}
                          className={`px-1.5 py-0.5 rounded-md cursor-pointer transition-colors ${
                            decimals === mode
                              ? "bg-[#0D9488] text-white"
                              : popupTheme === "dark"
                              ? "text-slate-400 hover:text-white"
                              : "text-slate-600 hover:text-[#16324F]"
                          }`}
                        >
                          {mode === "auto" ? "Auto" : `.${mode}`}
                        </button>
                      ))}
                    </div>

                    {/* Popup Theme Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setPopupTheme((prev) =>
                          prev === "light" ? "dark" : "light"
                        )
                      }
                      aria-label="Toggle extension popup light or dark theme"
                      title="Toggle popup Light / Dark theme"
                      className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                        popupTheme === "dark"
                          ? "bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800"
                          : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/70"
                      }`}
                    >
                      {popupTheme === "dark" ? (
                        <Sun className="w-3.5 h-3.5" />
                      ) : (
                        <Moon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Search Box ("5 km to miles" or "72 f in c") */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="extension-quick-search-input"
                    className="block text-[11px] font-bold text-slate-500 dark:text-slate-400"
                  >
                    Quick Search Box (e.g. &quot;5 km to miles&quot; or &quot;72 f in c&quot;)
                  </label>
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-[#0D9488] absolute left-3 pointer-events-none" />
                    <input
                      id="extension-quick-search-input"
                      type="text"
                      value={quickQuery}
                      onChange={(e) => handleQuickQueryChange(e.target.value)}
                      placeholder='Type "5 km to miles" or "72 f in c"...'
                      className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:border-[#0D9488] ${
                        popupTheme === "dark"
                          ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                          : "bg-[#F7F9FC] border-slate-200 text-[#16324F] placeholder:text-slate-400"
                      }`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {QUICK_SEARCH_PRESETS.map((preset) => (
                      <button
                        key={preset.query}
                        type="button"
                        onClick={() => handleQuickQueryChange(preset.query)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border cursor-pointer transition-colors ${
                          quickQuery.toLowerCase() === preset.query.toLowerCase()
                            ? "bg-[#0D9488] text-white border-[#0D9488]"
                            : popupTheme === "dark"
                            ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-[#0D9488]"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-[#0D9488]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category & Unit Pickers */}
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-7 space-y-1">
                    <label
                      htmlFor="ext-sim-category"
                      className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Category (31)
                    </label>
                    <select
                      id="ext-sim-category"
                      value={selectedCategoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className={`w-full h-9 px-2.5 rounded-lg border text-xs font-bold focus:outline-none focus:border-[#0D9488] cursor-pointer ${
                        popupTheme === "dark"
                          ? "bg-slate-900 border-slate-800 text-white"
                          : "bg-[#F7F9FC] border-slate-200 text-[#16324F]"
                      }`}
                    >
                      {extensionCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-5 space-y-1">
                    <label
                      htmlFor="ext-sim-value"
                      className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Value ({fromUnit.symbol})
                    </label>
                    <input
                      id="ext-sim-value"
                      type="text"
                      inputMode="decimal"
                      value={inputValueStr}
                      onChange={(e) => setInputValueStr(e.target.value)}
                      className={`w-full h-9 px-2.5 rounded-lg border text-xs font-mono font-extrabold focus:outline-none focus:border-[#0D9488] ${
                        popupTheme === "dark"
                          ? "bg-slate-900 border-slate-800 text-white"
                          : "bg-[#F7F9FC] border-slate-200 text-[#16324F]"
                      }`}
                    />
                  </div>
                </div>

                {/* Two Unit Selectors + Swap Button */}
                <div className="grid grid-cols-11 gap-1.5 items-center">
                  <div className="col-span-5">
                    <select
                      aria-label="Source unit"
                      value={fromUnitId}
                      onChange={(e) => setFromUnitId(e.target.value)}
                      className={`w-full h-9 px-2 rounded-lg border text-xs font-semibold truncate focus:outline-none focus:border-[#0D9488] cursor-pointer ${
                        popupTheme === "dark"
                          ? "bg-slate-900 border-slate-800 text-white"
                          : "bg-[#F7F9FC] border-slate-200 text-[#16324F]"
                      }`}
                    >
                      {categoryUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={handleSwapUnits}
                      title="Swap units"
                      aria-label="Swap units"
                      className="w-7 h-7 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0D9488] hover:bg-[#0D9488] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="col-span-5">
                    <select
                      aria-label="Target unit"
                      value={toUnitId}
                      onChange={(e) => setToUnitId(e.target.value)}
                      className={`w-full h-9 px-2 rounded-lg border text-xs font-semibold truncate focus:outline-none focus:border-[#0D9488] cursor-pointer ${
                        popupTheme === "dark"
                          ? "bg-slate-900 border-slate-800 text-white"
                          : "bg-[#F7F9FC] border-slate-200 text-[#16324F]"
                      }`}
                    >
                      {categoryUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Result Box + One-Click Copy + Website Link */}
                <div
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    popupTheme === "dark"
                      ? "bg-teal-950/40 border-teal-800/70"
                      : "bg-[#E6FAF8]/85 border-[#0D9488]/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {numericValue} {fromUnit.symbol} =
                      </div>
                      <div className="text-xl font-extrabold font-mono tracking-tight truncate">
                        {formattedOutput}{" "}
                        <span className="text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                          {toUnit.symbol}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyResult}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      {copiedResult ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Website Link per User Requirement */}
                  <div className="pt-2 border-t border-[#0D9488]/20 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      Full formula &amp; reference chart:
                    </span>
                    <Link
                      href={matchingWebsiteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#0F766E] dark:text-[#2DD4BF] hover:underline shrink-0"
                    >
                      <span>unitconvertersgo.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Remembers Your Last 5 Conversions */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <History className="w-3 h-3 text-[#0D9488]" />
                      <span>Last 5 Conversions</span>
                    </span>
                    <span className="text-[10px] font-normal">Click to reload</span>
                  </div>

                  <div className="space-y-1">
                    {history.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
                          popupTheme === "dark"
                            ? "bg-slate-900/90 border-slate-800 hover:border-[#0D9488]"
                            : "bg-[#F7F9FC] border-slate-200/80 hover:border-[#0D9488]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectHistoryItem(item)}
                          className="text-left truncate flex-1 cursor-pointer font-semibold"
                        >
                          <span>
                            {item.inputVal} {item.fromSymbol}
                          </span>{" "}
                          <span className="text-slate-400">→</span>{" "}
                          <span className="font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                            {item.formattedResult} {item.toSymbol}
                          </span>
                        </button>
                        <Link
                          href={item.pairHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open matching page on unitconvertersgo.com in a new tab"
                          className="text-slate-400 hover:text-[#0D9488] shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SUPPORTED UNITS (31 CATEGORIES) SECTION
          ===================================================================== */}
      <section
        id="supported-units"
        aria-labelledby="supported-units-heading"
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <h2
            id="supported-units-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
          >
            Supported Units (31 Categories)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Instant offline calculations across everyday, kitchen, technology, engineering, and electrical measurement systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {supportedCategoryGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 flex items-center justify-center shrink-0">
                    {group.icon}
                  </div>
                  <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
                    {group.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {group.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-semibold">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className="text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          FEATURES + INTERACTIVE RIGHT-CLICK CONTEXT MENU DEMO
          ===================================================================== */}
      <section
        id="features"
        aria-labelledby="extension-features-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch"
      >
        {/* Left 7 Cols: Features List */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="space-y-1.5">
            <h2
              id="extension-features-heading"
              className="text-2xl sm:text-3xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
            >
              Features
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Built for speed and simplicity right inside your browser toolbar.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              {
                icon: <Sparkles className="w-4 h-4 text-[#0D9488]" />,
                title: "Live results as you type",
                detail:
                  "No submit button required—see the converted measurement update keystroke by keystroke.",
              },
              {
                icon: <Search className="w-4 h-4 text-[#0D9488]" />,
                title:
                  'Quick search box: type "5 km to miles" or "72 f in c" and get the answer',
                detail:
                  "Jump straight to any calculation using natural shorthand queries.",
              },
              {
                icon: <MousePointerClick className="w-4 h-4 text-[#0D9488]" />,
                title:
                  'Right-click any selected value on a web page (for example "10 kg") to convert it',
                detail:
                  "Highlight a measurement on any article, recipe, or datasheet and convert it via the context menu.",
              },
              {
                icon: <Copy className="w-4 h-4 text-[#0D9488]" />,
                title: "One-click copy of the result",
                detail:
                  "Copy the exact converted figure to your clipboard with a single click.",
              },
              {
                icon: <History className="w-4 h-4 text-[#0D9488]" />,
                title: "Remembers your last five conversions",
                detail:
                  "Your 5 most recent conversions stay handy in local storage so you can revisit them anytime.",
              },
              {
                icon: <SlidersHorizontal className="w-4 h-4 text-[#0D9488]" />,
                title: "Light and dark theme, adjustable decimal places",
                detail:
                  "Match your system appearance and choose full precision or fixed decimal rounding.",
              },
              {
                icon: <Keyboard className="w-4 h-4 text-[#0D9488]" />,
                title: "Keyboard shortcut: Alt+U",
                detail:
                  "Pop open the calculator from any tab without reaching for the mouse.",
              },
            ].map((feat) => (
              <li key={feat.title} className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/60 flex items-center justify-center shrink-0 mt-0.5">
                  {feat.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="text-base font-extrabold text-[#16324F] dark:text-white">
                    {feat.title}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right 5 Cols: Interactive Right-Click Context Menu Preview */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
              <MousePointerClick className="w-4 h-4" />
              <span>Interactive Right-Click Demo</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#16324F] dark:text-white">
              Convert Selected Text on Any Page
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Click any sample measurement below to preview how the right-click context menu converts highlighted values on the spot:
            </p>
          </div>

          {/* Sample Value Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {CONTEXT_MENU_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => setActiveContextId(sample.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-colors ${
                  activeContextId === sample.id
                    ? "bg-[#16324F] text-white border-[#16324F]"
                    : "bg-[#F7F9FC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0D9488]"
                }`}
              >
                &quot;{sample.selectedText}&quot;
              </button>
            ))}
          </div>

          {/* Simulated Web Page + Context Menu Overlay */}
          <div className="rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 p-4 space-y-3.5">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeContextSample.contextSentenceBefore}
              <mark className="px-1.5 py-0.5 rounded bg-sky-200 dark:bg-sky-800 text-[#16324F] dark:text-white font-mono font-extrabold">
                {activeContextSample.selectedText}
              </mark>
              {activeContextSample.contextSentenceAfter}
            </p>

            {/* Simulated Browser Right-Click Menu */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 space-y-1 text-xs">
              <div className="px-3 py-1.5 text-slate-400 flex items-center justify-between">
                <span>Copy</span>
                <span className="font-mono text-[10px]">Ctrl+C</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/70 text-[#16324F] dark:text-white font-bold flex items-center justify-between gap-2 border border-[#0D9488]/30">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-4 h-4 rounded bg-[#0D9488] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    U
                  </span>
                  <span className="truncate">
                    UnitConvertersGo: <strong>{activeContextSample.selectedText}</strong> ={" "}
                    <span className="text-[#0F766E] dark:text-[#2DD4BF] font-mono">
                      {activeContextSample.convertedDisplay}
                    </span>
                  </span>
                </div>
              </div>
              <div className="px-3 py-1.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Open full converter in new tab</span>
                <Link
                  href={activeContextSample.pairHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline inline-flex items-center gap-1"
                >
                  <span>unitconvertersgo.com</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          HOW TO USE (3 STEPS)
          ===================================================================== */}
      <section
        id="how-to-use"
        aria-labelledby="how-to-use-heading"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="space-y-1.5">
          <h2
            id="how-to-use-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
          >
            How to Use
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Convert units in seconds from your browser toolbar or directly on any web page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-5 space-y-2.5">
            <div className="text-xs font-mono font-extrabold text-[#0D9488] dark:text-[#2DD4BF]">
              01. OPEN POPUP
            </div>
            <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
              1. Click the extension icon (or press Alt+U).
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Launch the calculator instantly from your Chrome toolbar or with the{" "}
              <kbd className="px-1.5 py-0.5 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
                Alt+U
              </kbd>{" "}
              keyboard shortcut.
            </p>
          </div>

          <div className="rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-5 space-y-2.5">
            <div className="text-xs font-mono font-extrabold text-[#0D9488] dark:text-[#2DD4BF]">
              02. PICK UNITS OR SEARCH
            </div>
            <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
              2. Choose a category, enter a value, and pick your units.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Type a number or enter a quick search like{" "}
              <code className="font-mono text-xs bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">
                5 km to miles
              </code>{" "}
              to see live results as you type.
            </p>
          </div>

          <div className="rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-5 space-y-2.5">
            <div className="text-xs font-mono font-extrabold text-[#0D9488] dark:text-[#2DD4BF]">
              03. RIGHT-CLICK ON ANY PAGE
            </div>
            <h3 className="text-lg font-extrabold text-[#16324F] dark:text-white">
              3. Or select text on any page, right-click, and choose the UnitConvertersGo option.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Highlight any measurement (such as{" "}
              <code className="font-mono text-xs bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">
                10 kg
              </code>
              ) while browsing to convert it without leaving your tab.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          WEBSITE LINK & PRIVACY GUARANTEE (SIDE BY SIDE)
          ===================================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website Link Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] flex items-center justify-center">
              <ExternalLink className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
              Website Link
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Each result has a link to the matching page on{" "}
              <Link
                href="/"
                className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                unitconvertersgo.com
              </Link>
              , where you can find more detail—including step-by-step formulas, NIST metrology references, fractional inch charts, and printable lookup tables. Clicking it opens our website in a new tab.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/directory"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
            >
              <span>Explore all web converters on unitconvertersgo.com</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Privacy Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E6FAF8] dark:bg-teal-950/60 text-[#0D9488] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <WifiOff className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
              Privacy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              The extension works offline. It does not collect, store on a server, or send your personal data. It asks only for the two permissions it needs: the right-click menu and local storage for your settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="font-mono font-extrabold text-[#16324F] dark:text-white">
                contextMenus
              </div>
              <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                Converts highlighted values when you right-click selected text
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="font-mono font-extrabold text-[#16324F] dark:text-white">
                storage
              </div>
              <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                Saves your theme, decimal places &amp; last 5 conversions locally
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <Link
              href="/chrome-extension/privacy-policy"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Read Chrome Extension Privacy Policy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          INSTALL / UNPACKED EXTENSION MODAL
          ===================================================================== */}
      {showInstallModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chrome-ext-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowInstallModal(false);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shrink-0">
                  <Chrome className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="chrome-ext-modal-title"
                    className="text-lg font-extrabold text-[#16324F] dark:text-white"
                  >
                    Install UnitConvertersGo for Chrome
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manifest V3 · Offline Toolbar Calculator · Alt+U
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-[#16324F] dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                You can test the full extension popup right now using the interactive simulator on this page, or download the Manifest V3 configuration for local developer installation in{" "}
                <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  chrome://extensions
                </code>
                .
              </p>

              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-extrabold text-[#16324F] dark:text-white flex items-center gap-1.5">
                  <FolderArchive className="w-4 h-4 text-[#0D9488]" />
                  <span>Quick Unpacked Load Steps:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Open <code className="font-mono">chrome://extensions</code> in Chrome.</li>
                  <li>Enable <strong>Developer mode</strong> in the top-right corner.</li>
                  <li>Click <strong>Load unpacked</strong> and select your extension folder.</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDownloadExtensionManifest}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-extrabold cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Manifest V3 JSON</span>
              </button>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#16324F] dark:text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
