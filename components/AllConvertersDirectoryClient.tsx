"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Ruler,
  Scale,
  Thermometer,
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
  Sparkles,
  BookOpen,
  Grid,
  ListFilter,
} from "lucide-react";
import { CATEGORIES, UNITS, UNIT_MAP } from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  CATALOGUE_MAP,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";

// Filter pill specification matching the design brief
export type DirectoryFilterId =
  | "all"
  | "length"
  | "mass"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "time"
  | "pressure"
  | "energy"
  | "power"
  | "digital_storage"
  | "other";

interface FilterChip {
  id: DirectoryFilterId;
  label: string;
  iconName: string;
  iconColorClass: string;
  categoryIds: string[];
}

const PRIMARY_CATEGORY_IDS = new Set([
  "length",
  "mass",
  "temperature",
  "area",
  "volume",
  "speed",
  "time",
  "pressure",
  "energy",
  "power",
  "digital_storage",
]);

const OTHER_CATEGORY_IDS = CATEGORIES.map((c) => c.id).filter(
  (id) => !PRIMARY_CATEGORY_IDS.has(id)
);

const FILTER_CHIPS: FilterChip[] = [
  {
    id: "all",
    label: "All",
    iconName: "Grid",
    iconColorClass: "text-teal-600 dark:text-teal-400",
    categoryIds: CATEGORIES.map((c) => c.id),
  },
  {
    id: "length",
    label: "Length",
    iconName: "Ruler",
    iconColorClass: "text-blue-600 dark:text-blue-400",
    categoryIds: ["length"],
  },
  {
    id: "mass",
    label: "Weight & Mass",
    iconName: "Scale",
    iconColorClass: "text-indigo-600 dark:text-indigo-400",
    categoryIds: ["mass"],
  },
  {
    id: "temperature",
    label: "Temperature",
    iconName: "Thermometer",
    iconColorClass: "text-rose-600 dark:text-rose-400",
    categoryIds: ["temperature"],
  },
  {
    id: "area",
    label: "Area",
    iconName: "Square",
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    categoryIds: ["area"],
  },
  {
    id: "volume",
    label: "Volume",
    iconName: "Beaker",
    iconColorClass: "text-cyan-600 dark:text-cyan-400",
    categoryIds: ["volume"],
  },
  {
    id: "speed",
    label: "Speed",
    iconName: "Gauge",
    iconColorClass: "text-orange-600 dark:text-orange-400",
    categoryIds: ["speed"],
  },
  {
    id: "time",
    label: "Time",
    iconName: "Clock",
    iconColorClass: "text-violet-600 dark:text-violet-400",
    categoryIds: ["time"],
  },
  {
    id: "pressure",
    label: "Pressure",
    iconName: "CircleDot",
    iconColorClass: "text-sky-600 dark:text-sky-400",
    categoryIds: ["pressure"],
  },
  {
    id: "energy",
    label: "Energy",
    iconName: "Zap",
    iconColorClass: "text-amber-600 dark:text-amber-400",
    categoryIds: ["energy"],
  },
  {
    id: "power",
    label: "Power",
    iconName: "Activity",
    iconColorClass: "text-fuchsia-600 dark:text-fuchsia-400",
    categoryIds: ["power"],
  },
  {
    id: "digital_storage",
    label: "Data Storage",
    iconName: "HardDrive",
    iconColorClass: "text-teal-600 dark:text-teal-400",
    categoryIds: ["digital_storage"],
  },
  {
    id: "other",
    label: "Other",
    iconName: "Compass",
    iconColorClass: "text-purple-600 dark:text-purple-400",
    categoryIds: OTHER_CATEGORY_IDS,
  },
];

interface CategoryThemeMeta {
  displayTitle: string;
  shortExplanation: string;
  iconBadgeClass: string;
  symbolPillClass: string;
}

// Clean, non-repetitive short descriptions, display titles & colorful icon themes for each category
const CATEGORY_DISPLAY_META: Record<string, CategoryThemeMeta> = {
  length: {
    displayTitle: "Length",
    shortExplanation:
      "Metric and imperial distance measurements from millimeters to miles.",
    iconBadgeClass:
      "bg-blue-100/90 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/70",
    symbolPillClass:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
  },
  mass: {
    displayTitle: "Weight & Mass",
    shortExplanation:
      "Everyday body weight, culinary mass, and industrial tonnage conversions.",
    iconBadgeClass:
      "bg-indigo-100/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/70",
    symbolPillClass:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
  },
  temperature: {
    displayTitle: "Temperature",
    shortExplanation:
      "Thermodynamic and weather scales across Celsius, Fahrenheit, and Kelvin.",
    iconBadgeClass:
      "bg-rose-100/90 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/70",
    symbolPillClass:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
  },
  area: {
    displayTitle: "Area",
    shortExplanation:
      "Floor plans, real estate acreage, hectares, and geographic surface area.",
    iconBadgeClass:
      "bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/70",
    symbolPillClass:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
  },
  volume: {
    displayTitle: "Volume",
    shortExplanation:
      "Liquid capacity, cooking measurements, and cubic container volumes.",
    iconBadgeClass:
      "bg-cyan-100/90 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 border-cyan-200/80 dark:border-cyan-800/70",
    symbolPillClass:
      "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300",
  },
  speed: {
    displayTitle: "Speed",
    shortExplanation:
      "Road velocity, aviation knots, wind speeds, and Mach numbers.",
    iconBadgeClass:
      "bg-orange-100/90 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 border-orange-200/80 dark:border-orange-800/70",
    symbolPillClass:
      "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300",
  },
  time: {
    displayTitle: "Time",
    shortExplanation:
      "Duration conversions from milliseconds and seconds to calendar years.",
    iconBadgeClass:
      "bg-violet-100/90 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 border-violet-200/80 dark:border-violet-800/70",
    symbolPillClass:
      "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300",
  },
  pressure: {
    displayTitle: "Pressure",
    shortExplanation:
      "Tire PSI, barometric pressure, hydraulic bar, and kilopascals.",
    iconBadgeClass:
      "bg-sky-100/90 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/70",
    symbolPillClass:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300",
  },
  energy: {
    displayTitle: "Energy",
    shortExplanation:
      "Mechanical work, dietary calories, thermal BTUs, and kilowatt-hours.",
    iconBadgeClass:
      "bg-amber-100/90 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/70",
    symbolPillClass:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
  },
  power: {
    displayTitle: "Power",
    shortExplanation:
      "Electrical wattage, engine horsepower, and HVAC cooling output.",
    iconBadgeClass:
      "bg-fuchsia-100/90 dark:bg-fuchsia-950/70 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/80 dark:border-fuchsia-800/70",
    symbolPillClass:
      "bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300",
  },
  digital_storage: {
    displayTitle: "Data Storage",
    shortExplanation:
      "Decimal and binary memory capacity across bytes, MB, GB, and TB.",
    iconBadgeClass:
      "bg-teal-100/90 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/70",
    symbolPillClass:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300",
  },
  data_transfer: {
    displayTitle: "Data Transfer",
    shortExplanation:
      "Network bandwidth and file transfer rates in Mbps, Gbps, and MB/s.",
    iconBadgeClass:
      "bg-blue-100/90 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/70",
    symbolPillClass:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
  },
  force: {
    displayTitle: "Force",
    shortExplanation:
      "Mechanical and structural load in Newtons, kilonewtons, and pound-force.",
    iconBadgeClass:
      "bg-red-100/90 dark:bg-red-950/70 text-red-600 dark:text-red-400 border-red-200/80 dark:border-red-800/70",
    symbolPillClass:
      "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300",
  },
  density: {
    displayTitle: "Density",
    shortExplanation:
      "Material mass-to-volume ratios and solution concentration in ppm.",
    iconBadgeClass:
      "bg-purple-100/90 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/70",
    symbolPillClass:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
  },
  torque: {
    displayTitle: "Torque",
    shortExplanation:
      "Automotive and fastener rotational force in Newton-meters and ft-lbs.",
    iconBadgeClass:
      "bg-amber-100/90 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/70",
    symbolPillClass:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
  },
  frequency: {
    displayTitle: "Frequency",
    shortExplanation:
      "Oscillation cycles and rotational speed from Hertz to GHz and RPM.",
    iconBadgeClass:
      "bg-pink-100/90 dark:bg-pink-950/70 text-pink-600 dark:text-pink-400 border-pink-200/80 dark:border-pink-800/70",
    symbolPillClass:
      "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300",
  },
  angle: {
    displayTitle: "Angle",
    shortExplanation:
      "Geometric and navigation angles in degrees, radians, and gradians.",
    iconBadgeClass:
      "bg-lime-100/90 dark:bg-lime-950/70 text-lime-700 dark:text-lime-400 border-lime-200/80 dark:border-lime-800/70",
    symbolPillClass:
      "bg-lime-50 dark:bg-lime-950/60 text-lime-700 dark:text-lime-300",
  },
  fuel_economy: {
    displayTitle: "Fuel Economy",
    shortExplanation:
      "Vehicle fuel consumption across US MPG, UK MPG, km/L, and L/100km.",
    iconBadgeClass:
      "bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/70",
    symbolPillClass:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
  },
  flow: {
    displayTitle: "Flow Rate",
    shortExplanation:
      "Pipe and pump volumetric flow in L/min, GPM, CFM, and cubic meters.",
    iconBadgeClass:
      "bg-sky-100/90 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/70",
    symbolPillClass:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300",
  },
  current: {
    displayTitle: "Electric Current",
    shortExplanation:
      "Circuit amperage conversions across microamps, milliamps, and amps.",
    iconBadgeClass:
      "bg-yellow-100/90 dark:bg-yellow-950/70 text-yellow-700 dark:text-yellow-400 border-yellow-200/80 dark:border-yellow-800/70",
    symbolPillClass:
      "bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300",
  },
  capacitance: {
    displayTitle: "Capacitance",
    shortExplanation:
      "Electronic capacitor values in farads, microfarads, and picofarads.",
    iconBadgeClass:
      "bg-indigo-100/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/70",
    symbolPillClass:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
  },
  charge: {
    displayTitle: "Electric Charge",
    shortExplanation:
      "Battery capacity and electrical charge in mAh, Ah, and coulombs.",
    iconBadgeClass:
      "bg-orange-100/90 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 border-orange-200/80 dark:border-orange-800/70",
    symbolPillClass:
      "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300",
  },
  resistance: {
    displayTitle: "Electrical Resistance",
    shortExplanation:
      "Component impedance and resistance from milliohms to megohms.",
    iconBadgeClass:
      "bg-rose-100/90 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/70",
    symbolPillClass:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
  },
  inductance: {
    displayTitle: "Inductance",
    shortExplanation:
      "Coil and choke inductance in henries, millihenries, and microhenries.",
    iconBadgeClass:
      "bg-violet-100/90 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 border-violet-200/80 dark:border-violet-800/70",
    symbolPillClass:
      "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300",
  },
  magnetic: {
    displayTitle: "Magnetic Flux",
    shortExplanation:
      "Magnetic field strength conversions between Tesla, Gauss, and millitesla.",
    iconBadgeClass:
      "bg-cyan-100/90 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 border-cyan-200/80 dark:border-cyan-800/70",
    symbolPillClass:
      "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300",
  },
};

// Highlighted Popular Conversions (12 curated flagship links)
const POPULAR_HIGHLIGHT_SLUGS = [
  "cm-to-inches",
  "kg-to-lbs",
  "celsius-to-fahrenheit",
  "meters-to-feet",
  "km-to-miles",
  "liters-to-gallons",
  "mm-to-inches",
  "lbs-to-kg",
  "sq-feet-to-sq-meters",
  "bar-to-psi",
  "kw-to-horsepower",
  "mb-to-gb",
];

function getCategoryIcon(iconName: string, className = "w-4 h-4") {
  switch (iconName) {
    case "Grid":
      return <Grid className={className} />;
    case "Ruler":
      return <Ruler className={className} />;
    case "Scale":
      return <Scale className={className} />;
    case "Thermometer":
      return <Thermometer className={className} />;
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

export default function AllConvertersDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<DirectoryFilterId>("all");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [mobileCollapsed, setMobileCollapsed] = useState<Record<string, boolean>>({});
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [showAllUnitsAZ, setShowAllUnitsAZ] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { placeholder } = useTypewriterPlaceholder({
    isPaused: searchQuery.trim().length > 0,
    prefix: "Search converters — e.g. ",
  });

  // Press "/" to focus the directory search field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "SELECT"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Order categories so the 11 primary categories appear first in the exact filter order, followed by specialized categories
  const orderedCategories = useMemo(() => {
    const primaryOrder = [
      "length",
      "mass",
      "temperature",
      "area",
      "volume",
      "speed",
      "time",
      "pressure",
      "energy",
      "power",
      "digital_storage",
    ];
    const catMap = new Map(CATEGORIES.map((c) => [c.id, c]));
    const first = primaryOrder
      .map((id) => catMap.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    const rest = CATEGORIES.filter((c) => !PRIMARY_CATEGORY_IDS.has(c.id));
    return [...first, ...rest];
  }, []);

  // Precompute pairs grouped by category, placing popular pairs first
  const categoryDirectoryData = useMemo(() => {
    return orderedCategories.map((cat) => {
      const allPairs = CONVERSION_CATALOGUE.filter((p) => p.categoryId === cat.id);
      const popularSet = new Set(cat.popularPairSlugs);
      const popPairs = cat.popularPairSlugs
        .map((slug) => CATALOGUE_MAP.get(slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p && p.categoryId === cat.id));
      const otherPairs = allPairs.filter((p) => !popularSet.has(p.slug));
      const sortedPairs = [...popPairs, ...otherPairs];

      const meta = CATEGORY_DISPLAY_META[cat.id] || {
        displayTitle: cat.name,
        shortExplanation: cat.description,
        iconBadgeClass:
          "bg-teal-100/90 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/70",
        symbolPillClass:
          "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300",
      };

      return {
        category: cat,
        displayTitle: meta.displayTitle,
        shortExplanation: meta.shortExplanation,
        iconBadgeClass: meta.iconBadgeClass,
        symbolPillClass: meta.symbolPillClass,
        pairs: sortedPairs,
      };
    });
  }, [orderedCategories]);

  // Filter categories and conversion links based on selected filter chip and live search query
  const filteredCategoryData = useMemo(() => {
    const activeChip =
      FILTER_CHIPS.find((chip) => chip.id === selectedFilter) || FILTER_CHIPS[0];
    const allowedCatIds = new Set(activeChip.categoryIds);

    return categoryDirectoryData
      .filter((item) => allowedCatIds.has(item.category.id))
      .map((item) => {
        if (!normalizedQuery) {
          return {
            ...item,
            matchingPairs: item.pairs,
            categoryMatchedDirectly: false,
          };
        }

        const catMatches =
          item.displayTitle.toLowerCase().includes(normalizedQuery) ||
          item.category.name.toLowerCase().includes(normalizedQuery) ||
          item.shortExplanation.toLowerCase().includes(normalizedQuery);

        const matchingPairs = item.pairs.filter((pair) => {
          const fromUnit = UNIT_MAP.get(pair.fromUnitId);
          const toUnit = UNIT_MAP.get(pair.toUnitId);
          const cleanLabel =
            fromUnit && toUnit
              ? `${fromUnit.plural} to ${toUnit.plural}`.toLowerCase()
              : pair.title.toLowerCase();
          const reverseLabel =
            fromUnit && toUnit
              ? `${fromUnit.name} to ${toUnit.name}`.toLowerCase()
              : "";
          const symbols =
            fromUnit && toUnit
              ? `${fromUnit.symbol} to ${toUnit.symbol} ${fromUnit.symbol} ${toUnit.symbol}`.toLowerCase()
              : "";
          const aliases = [
            ...(fromUnit?.aliases || []),
            ...(toUnit?.aliases || []),
            ...(pair.aliases || []),
          ]
            .join(" ")
            .toLowerCase();

          return (
            cleanLabel.includes(normalizedQuery) ||
            reverseLabel.includes(normalizedQuery) ||
            pair.title.toLowerCase().includes(normalizedQuery) ||
            pair.slug.toLowerCase().includes(normalizedQuery) ||
            symbols.includes(normalizedQuery) ||
            aliases.includes(normalizedQuery) ||
            (pair.primaryKeyword &&
              pair.primaryKeyword.toLowerCase().includes(normalizedQuery))
          );
        });

        return {
          ...item,
          matchingPairs:
            catMatches && matchingPairs.length === 0 ? item.pairs : matchingPairs,
          categoryMatchedDirectly: catMatches,
        };
      })
      .filter((item) => item.matchingPairs.length > 0);
  }, [categoryDirectoryData, selectedFilter, normalizedQuery]);

  // Curated Popular Links
  const popularHighlightPairs = useMemo(() => {
    return POPULAR_HIGHLIGHT_SLUGS.map((slug) => CATALOGUE_MAP.get(slug)).filter(
      (p): p is NonNullable<typeof p> => Boolean(p)
    );
  }, []);

  // A-Z Alphabetical Unit Index
  const alphabeticalUnits = useMemo(() => {
    const primarySlugByUnitId = new Map<string, string>();
    for (const pair of CONVERSION_CATALOGUE) {
      if (!primarySlugByUnitId.has(pair.fromUnitId)) {
        primarySlugByUnitId.set(pair.fromUnitId, pair.slug);
      }
    }
    for (const pair of CONVERSION_CATALOGUE) {
      if (!primarySlugByUnitId.has(pair.toUnitId)) {
        primarySlugByUnitId.set(pair.toUnitId, pair.slug);
      }
    }

    const catIconById = new Map(CATEGORIES.map((c) => [c.id, c.iconName]));

    const enriched = UNITS.map((unit) => {
      const catMeta = CATEGORY_DISPLAY_META[unit.categoryId];
      const catName = catMeta ? catMeta.displayTitle : unit.categoryId;
      const iconName = catIconById.get(unit.categoryId) || "ArrowLeftRight";
      const iconBadgeClass =
        catMeta?.iconBadgeClass ||
        "bg-teal-100/90 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/70";
      const symbolPillClass =
        catMeta?.symbolPillClass ||
        "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300";
      const targetSlug = primarySlugByUnitId.get(unit.id);
      const href = targetSlug
        ? getPairUrl({ categoryId: unit.categoryId, slug: targetSlug })
        : getCategoryUrl(unit.categoryId);
      const firstChar = unit.name.charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(firstChar) ? firstChar : "#";

      return {
        unit,
        catName,
        iconName,
        iconBadgeClass,
        symbolPillClass,
        href,
        letter,
      };
    }).sort((a, b) => a.unit.name.localeCompare(b.unit.name));

    return enriched;
  }, []);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const item of alphabeticalUnits) {
      set.add(item.letter);
    }
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => ({
      letter: char,
      hasUnits: set.has(char),
    }));
  }, [alphabeticalUnits]);

  const filteredAZUnits = useMemo(() => {
    return alphabeticalUnits.filter((item) => {
      if (selectedLetter !== "ALL" && item.letter !== selectedLetter) {
        return false;
      }
      if (!normalizedQuery) return true;
      return (
        item.unit.name.toLowerCase().includes(normalizedQuery) ||
        item.unit.plural.toLowerCase().includes(normalizedQuery) ||
        item.unit.symbol.toLowerCase().includes(normalizedQuery) ||
        item.catName.toLowerCase().includes(normalizedQuery) ||
        item.unit.aliases.some((a) => a.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [alphabeticalUnits, selectedLetter, normalizedQuery]);

  const displayedAZUnits = useMemo(() => {
    if (selectedLetter !== "ALL" || normalizedQuery || showAllUnitsAZ) {
      return filteredAZUnits;
    }
    return filteredAZUnits.slice(0, 36);
  }, [filteredAZUnits, selectedLetter, normalizedQuery, showAllUnitsAZ]);

  const toggleCardExpand = (catId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const toggleMobileCollapse = (catId: string) => {
    setMobileCollapsed((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const totalMatchingConverters = useMemo(() => {
    return filteredCategoryData.reduce((sum, c) => sum + c.matchingPairs.length, 0);
  }, [filteredCategoryData]);

  return (
    <div className="space-y-10">
      {/* =====================================================================
          SEARCH & CATEGORY FILTERS PANEL
          ===================================================================== */}
      <section
        aria-label="Search and filter unit converters"
        className="rounded-2xl bg-[#F7F9FC] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 space-y-5 shadow-xs"
      >
        {/* Prominent Searchable Converter Field */}
        <div className="relative max-w-3xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="w-5 h-5 text-[#0D9488] dark:text-[#2DD4BF]" />
          </div>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Search unit converters"
            className="w-full h-13 pl-12 pr-24 rounded-xl bg-white dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700 text-sm sm:text-base font-medium text-[#16324F] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all shadow-2xs"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search query"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Compact Category Filters with Colorful Category Icons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <ListFilter className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Filter by Measurement Category</span>
            </div>
            {(selectedFilter !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("all");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Category filters"
            className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar -mx-1 px-1"
          >
            {FILTER_CHIPS.map((chip) => {
              const isSelected = selectedFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedFilter(chip.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#16324F] dark:bg-[#0D9488] text-white border-[#16324F] dark:border-[#0D9488] shadow-xs"
                      : "bg-white dark:bg-slate-950 text-[#16324F] dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488]/60 hover:text-[#0D9488] dark:hover:text-[#2DD4BF]"
                  }`}
                >
                  <span
                    className={
                      isSelected ? "text-white" : chip.iconColorClass
                    }
                  >
                    {getCategoryIcon(chip.iconName, "w-3.5 h-3.5")}
                  </span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          POPULAR LINKS HIGHLIGHT (Shown when browsing All without active search)
          ===================================================================== */}
      {selectedFilter === "all" && !normalizedQuery && (
        <section
          aria-labelledby="popular-conversions-heading"
          className="space-y-3.5"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2
                id="popular-conversions-heading"
                className="text-base sm:text-lg font-extrabold tracking-tight text-[#16324F] dark:text-white"
              >
                Popular Unit Conversions
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
              Quick access to everyday converters
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {popularHighlightPairs.map((pair) => {
              const fromUnit = UNIT_MAP.get(pair.fromUnitId);
              const toUnit = UNIT_MAP.get(pair.toUnitId);
              const catMeta = CATEGORY_DISPLAY_META[pair.categoryId];
              const catObj = CATEGORIES.find((c) => c.id === pair.categoryId);
              const shortTitle =
                fromUnit && toUnit
                  ? `${fromUnit.plural} to ${toUnit.plural}`
                  : pair.title.replace(" Converter", "");
              const symbolPair =
                fromUnit && toUnit
                  ? `${fromUnit.symbol} → ${toUnit.symbol}`
                  : "";

              return (
                <Link
                  key={pair.slug}
                  href={getPairUrl(pair)}
                  prefetch={false}
                  className="group flex flex-col justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] hover:bg-[#F7F9FC]/60 dark:hover:bg-slate-800/60 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md border ${
                          catMeta?.iconBadgeClass ||
                          "bg-teal-100 text-teal-600 border-teal-200"
                        }`}
                      >
                        {getCategoryIcon(catObj?.iconName || "ArrowLeftRight", "w-3 h-3")}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          catMeta?.symbolPillClass ||
                          "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#2DD4BF]"
                        }`}
                      >
                        {symbolPair}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <span className="text-xs font-bold text-[#16324F] dark:text-slate-100 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors line-clamp-1">
                    {shortTitle}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          CONVERTER DIRECTORY — GROUPED CATEGORIES IN A CLEAR GRID
          ===================================================================== */}
      <section aria-labelledby="converter-directory-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0D9488]/12 dark:bg-slate-800 text-[#0D9488] dark:text-[#2DD4BF]">
              <Grid className="w-4 h-4" />
            </span>
            <div>
              <h2
                id="converter-directory-heading"
                className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16324F] dark:text-white"
              >
                Converter Directory by Category
              </h2>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-bold text-[#16324F] dark:text-white">
              {filteredCategoryData.length}
            </span>{" "}
            {filteredCategoryData.length === 1 ? "category" : "categories"} (
            <span className="font-bold text-[#0D9488] dark:text-[#2DD4BF]">
              {totalMatchingConverters}
            </span>{" "}
            conversion tools)
          </div>
        </div>

        {filteredCategoryData.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900/60 p-8 sm:p-12 text-center space-y-3">
            <p className="text-base font-bold text-[#16324F] dark:text-white">
              No converter found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try another unit name, standard symbol (e.g., cm, kg, psi, °C), or reset the category filter.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0F766E] transition-colors cursor-pointer"
              >
                Show All Unit Converters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
            {filteredCategoryData.map(
              (
                {
                  category,
                  displayTitle,
                  shortExplanation,
                  iconBadgeClass,
                  symbolPillClass,
                  matchingPairs,
                },
                index
              ) => {
                const isExpanded =
                  Boolean(expandedCards[category.id]) ||
                  Boolean(normalizedQuery) ||
                  selectedFilter !== "all";
                // On mobile (<md), allow collapsing cards; keep top 6 open by default
                const isCollapsedOnMobile =
                  mobileCollapsed[category.id] !== undefined
                    ? mobileCollapsed[category.id]
                    : index >= 6 && !normalizedQuery && selectedFilter === "all";

                const INITIAL_VISIBLE_COUNT = 7;
                const visiblePairs = isExpanded
                  ? matchingPairs
                  : matchingPairs.slice(0, INITIAL_VISIBLE_COUNT);
                const hiddenPairs = isExpanded
                  ? []
                  : matchingPairs.slice(INITIAL_VISIBLE_COUNT);

                return (
                  <article
                    key={category.id}
                    id={`category-${category.id}`}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col overflow-hidden"
                  >
                    {/* Card Header: Colorful Category Icon + Category Title + Short Explanation */}
                    <div className="p-5 bg-[#F7F9FC]/70 dark:bg-slate-900/90 border-b border-slate-200/70 dark:border-slate-800/90">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Link
                            href={getCategoryUrl(category.id)}
                            prefetch={false}
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border shrink-0 shadow-2xs hover:scale-105 transition-transform ${iconBadgeClass}`}
                            aria-label={`${displayTitle} Converter Category`}
                          >
                            {getCategoryIcon(category.iconName, "w-5 h-5")}
                          </Link>
                          <div className="min-w-0">
                            <h3 className="text-base font-extrabold tracking-tight text-[#16324F] dark:text-white truncate">
                              <Link
                                href={getCategoryUrl(category.id)}
                                prefetch={false}
                                className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
                              >
                                {displayTitle}
                              </Link>
                            </h3>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              {matchingPairs.length} conversion{" "}
                              {matchingPairs.length === 1 ? "tool" : "tools"}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Collapsible Accordion Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleMobileCollapse(category.id)}
                          aria-expanded={!isCollapsedOnMobile}
                          aria-label={`Toggle ${displayTitle} converters list`}
                          className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {isCollapsedOnMobile ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {shortExplanation}
                      </p>
                    </div>

                    {/* Supported Conversion Links List */}
                    <div
                      className={`${
                        isCollapsedOnMobile ? "hidden md:flex" : "flex"
                      } flex-col flex-1 justify-between p-4 sm:p-5 space-y-4`}
                    >
                      <ul className="space-y-1">
                        {visiblePairs.map((pair) => {
                          const fromUnit = UNIT_MAP.get(pair.fromUnitId);
                          const toUnit = UNIT_MAP.get(pair.toUnitId);
                          const linkLabel =
                            fromUnit && toUnit
                              ? `${fromUnit.plural} to ${toUnit.plural}`
                              : pair.title.replace(" Converter", "");
                          const symbolHint =
                            fromUnit && toUnit
                              ? `${fromUnit.symbol} → ${toUnit.symbol}`
                              : "";

                          return (
                            <li key={pair.slug}>
                              <Link
                                href={getPairUrl(pair)}
                                prefetch={false}
                                className="group flex items-center justify-between gap-2 py-1.5 px-2.5 -mx-2.5 rounded-lg text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#F7F9FC] dark:hover:bg-slate-800/80 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
                              >
                                <span className="truncate">{linkLabel}</span>
                                <span className="inline-flex items-center gap-1.5 shrink-0">
                                  {symbolHint && (
                                    <span
                                      className={`text-[11px] font-mono px-1.5 py-0.5 rounded transition-colors ${symbolPillClass}`}
                                    >
                                      {symbolHint}
                                    </span>
                                  )}
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] group-hover:translate-x-0.5 transition-all" />
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Crawlable remaining links in DOM for SEO + interactive expand toggle */}
                      {hiddenPairs.length > 0 && (
                        <div className="sr-only" aria-hidden="false">
                          <ul>
                            {hiddenPairs.map((pair) => {
                              const fromUnit = UNIT_MAP.get(pair.fromUnitId);
                              const toUnit = UNIT_MAP.get(pair.toUnitId);
                              const linkLabel =
                                fromUnit && toUnit
                                  ? `${fromUnit.plural} to ${toUnit.plural} Converter`
                                  : pair.title;
                              return (
                                <li key={pair.slug}>
                                  <Link href={getPairUrl(pair)} prefetch={false}>
                                    {linkLabel}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Card Footer: Expand toggle + "View all" category link */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/90 flex items-center justify-between gap-2">
                        {matchingPairs.length > INITIAL_VISIBLE_COUNT &&
                        !normalizedQuery &&
                        selectedFilter === "all" ? (
                          <button
                            type="button"
                            onClick={() => toggleCardExpand(category.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#16324F] dark:hover:text-white transition-colors cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                <span>Show fewer</span>
                                <ChevronUp className="w-3.5 h-3.5" />
                              </>
                            ) : (
                              <>
                                <span>
                                  +{matchingPairs.length - INITIAL_VISIBLE_COUNT} more
                                </span>
                                <ChevronDown className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            All {matchingPairs.length} shown
                          </span>
                        )}

                        <Link
                          href={getCategoryUrl(category.id)}
                          prefetch={false}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#0F766E] dark:hover:underline transition-colors"
                        >
                          <span>View all {displayTitle}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* =====================================================================
          A–Z NAVIGATION — ALPHABETICAL INDEX FOR FINDING INDIVIDUAL UNITS QUICKLY
          ===================================================================== */}
      <section
        aria-labelledby="az-unit-index-heading"
        className="rounded-2xl bg-[#F7F9FC] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <h2
                id="az-unit-index-heading"
                className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16324F] dark:text-white"
              >
                A–Z Measurement Unit Index
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Find individual measurement units alphabetically by name or symbol and open their conversion tool.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            {filteredAZUnits.length} {filteredAZUnits.length === 1 ? "unit" : "units"} indexed
          </div>
        </div>

        {/* Alphabetical Letter Bar */}
        <div
          role="toolbar"
          aria-label="Alphabetical unit filter"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar"
        >
          <button
            type="button"
            onClick={() => setSelectedLetter("ALL")}
            className={`px-3 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
              selectedLetter === "ALL"
                ? "bg-[#16324F] dark:bg-[#0D9488] text-white border-[#16324F] dark:border-[#0D9488]"
                : "bg-white dark:bg-slate-950 text-[#16324F] dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#0D9488]"
            }`}
          >
            All A–Z
          </button>
          {availableLetters.map(({ letter, hasUnits }) => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                type="button"
                disabled={!hasUnits}
                onClick={() => setSelectedLetter(letter)}
                aria-label={`Filter units starting with ${letter}`}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors shrink-0 border flex items-center justify-center ${
                  isSelected
                    ? "bg-[#0D9488] text-white border-[#0D9488] shadow-2xs cursor-pointer"
                    : hasUnits
                    ? "bg-white dark:bg-slate-950 text-[#16324F] dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#0D9488] hover:text-[#0D9488] cursor-pointer"
                    : "bg-slate-100/60 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700 border-slate-200/40 dark:border-slate-800/40 cursor-not-allowed"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* A-Z Units Grid with Colorful Category Icons */}
        {displayedAZUnits.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-6 text-center text-xs sm:text-sm text-slate-500">
            No measurement units found for letter &ldquo;{selectedLetter}&rdquo;
            {searchQuery ? ` matching "${searchQuery}"` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {displayedAZUnits.map(
              ({
                unit,
                catName,
                iconName,
                iconBadgeClass,
                symbolPillClass,
                href,
              }) => (
                <Link
                  key={unit.id}
                  href={href}
                  prefetch={false}
                  className="group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border shrink-0 ${iconBadgeClass}`}
                    >
                      {getCategoryIcon(iconName, "w-3.5 h-3.5")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-[#16324F] dark:text-slate-100 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors truncate min-w-0">
                          {unit.name}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded shrink-0 max-w-[110px] truncate ${symbolPillClass}`}
                        >
                          {unit.symbol}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {catName}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] shrink-0" />
                </Link>
              )
            )}
          </div>
        )}

        {/* Show All Units Button when browsing "All A-Z" */}
        {selectedLetter === "ALL" &&
          !normalizedQuery &&
          filteredAZUnits.length > 36 && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setShowAllUnitsAZ((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#16324F] dark:text-slate-200 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#0D9488] hover:text-[#0D9488] transition-colors cursor-pointer shadow-2xs"
              >
                {showAllUnitsAZ ? (
                  <>
                    <span>Show compact A–Z preview (36 units)</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>
                      View all {filteredAZUnits.length} measurement units A–Z
                    </span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
      </section>
    </div>
  );
}
