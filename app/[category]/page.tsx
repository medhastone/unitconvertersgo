import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import TemperatureCategoryView from "@/components/TemperatureCategoryView";
import CategoryDashboardView, {
  CategoryDashboardConfig,
} from "@/components/CategoryDashboardView";
import CategoryMultiMatrix from "@/components/CategoryMultiMatrix";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";
import CategoryExplorerHub from "@/components/CategoryExplorerHub";
import ToolSearchBar from "@/components/ToolSearchBar";
import {
  CATEGORIES,
  CATEGORY_MAP,
  UNIT_MAP,
  getUnitsByCategory,
} from "@/lib/conversions/units";
import {
  CATALOGUE_MAP,
  getConversionsByCategory,
  getPairUrl,
} from "@/lib/conversions/catalogue";
import {
  getCategoryUrl,
  getCategoryUrlSlug,
  resolveCategoryIdFromUrlSlug,
} from "@/lib/conversions/url";
import { convertUnits } from "@/lib/conversions/engine";
import { getTrustedReferencesForCategory } from "@/lib/conversions/references";
import { SITE_CONFIG } from "@/lib/config";
import {
  buildCategorySeoDescription,
  buildCategorySeoTitle,
  buildPageMetadata,
  getCategoryOgImage,
} from "@/lib/seo";
import { isIndexableCategory, isMergedThinHub, getConverterTier } from "@/lib/seo-config";
import { ConversionPairInfo } from "@/lib/conversions/types";

const CATEGORY_ALIAS_MAP: Record<string, string> = {
  weight: "mass",
  "weight-and-mass": "mass",
  "weight-and-mass-converter": "mass",
  "length-converter": "length",
  distance: "length",
  "liquid-volume": "volume",
  "volume-converter": "volume",
  "temperature-converter": "temperature",
  "area-converter": "area",
  "speed-converter": "speed",
  "time-converter": "time",
  "pressure-converter": "pressure",
  "energy-converter": "energy",
  "power-converter": "power",
  "data-storage": "digital_storage",
  "digital-storage": "digital_storage",
  "data-transfer": "data_transfer",
  "fuel-economy": "fuel_economy",
  "fuel-consumption": "fuel_economy",
  "flow-rate": "flow",
  "electric-current": "current",
  "electric-charge": "charge",
  "electrical-resistance": "resistance",
  "electric-resistance": "resistance",
  "electrostatic-capacitance": "capacitance",
  "magnetic-flux-density": "magnetic",
  "frequency-wavelength": "frequency",
};

interface CategorySeoProfile {
  displayName: string;
  heroTitle: string;
  heroDescription: string;
  defaultFromId: string;
  defaultToId: string;
  defaultValue: number;
  popularSlugs?: string[];
  relatedCategoryIds: string[];
  faqs: { question: string; answer: string }[];
}

const CATEGORY_PROFILES: Record<string, CategorySeoProfile> = {
  length: {
    displayName: "Length",
    heroTitle: "Length Converter",
    heroDescription:
      "Enter a length below to convert between metric and imperial length units.",
    defaultFromId: "meter",
    defaultToId: "foot",
    defaultValue: 10,
    popularSlugs: [
      "cm-to-inches",
      "inches-to-cm",
      "mm-to-inches",
      "meters-to-feet",
      "feet-to-meters",
      "km-to-miles",
      "miles-to-km",
      "feet-to-inches",
    ],
    relatedCategoryIds: ["area", "volume", "speed", "mass", "time", "pressure"],
    faqs: [
      {
        question: "How do I convert metric length units to imperial length units?",
        answer:
          "All modern imperial length units are anchored to the meter by the 1959 International Yard and Pound Agreement: 1 inch equals exactly 2.54 cm, 1 foot equals 0.3048 m, 1 yard equals 0.9144 m, and 1 statute mile equals 1.609344 km.",
      },
      {
        question: "What is the base SI unit of length?",
        answer:
          "The meter (m) is the official SI base unit of length, defined by the distance light travels in a vacuum in 1/299,792,458 of a second.",
      },
      {
        question: "What is the difference between a statute mile and a nautical mile?",
        answer:
          "A statute land mile is 5,280 feet (1,609.344 meters), whereas an international nautical mile used in maritime and aviation navigation is defined as exactly 1,852 meters (approximately 6,076.12 feet or 1.15078 statute miles).",
      },
    ],
  },
  mass: {
    displayName: "Weight & Mass",
    heroTitle: "Weight & Mass Converter",
    heroDescription:
      "Enter a weight below to convert between metric, avoirdupois, and troy mass units.",
    defaultFromId: "kilogram",
    defaultToId: "pound",
    defaultValue: 10,
    popularSlugs: [
      "kg-to-lbs",
      "lbs-to-kg",
      "grams-to-ounces",
      "ounces-to-grams",
      "grams-to-kg",
      "pounds-to-ounces",
      "grams-to-pounds",
      "micrograms-to-grams",
    ],
    relatedCategoryIds: ["volume", "length", "density", "force", "pressure", "energy"],
    faqs: [
      {
        question: "How many pounds are in 1 kilogram?",
        answer:
          "1 kilogram equals approximately 2.20462 pounds, based on the exact legal definition of 1 avoirdupois pound = 0.45359237 kilograms.",
      },
      {
        question: "What is the difference between a standard ounce and a troy ounce?",
        answer:
          "A standard avoirdupois ounce (oz) used for groceries and postal items equals 28.3495 grams, while a troy ounce (oz t) used for gold and silver bullion equals 31.1035 grams.",
      },
      {
        question: "How many pounds are in 1 UK stone?",
        answer:
          "1 British Imperial stone (st) is equal to exactly 14 avoirdupois pounds, or approximately 6.35029 kilograms.",
      },
    ],
  },
  temperature: {
    displayName: "Temperature",
    heroTitle: "Temperature Converter",
    heroDescription:
      "Convert temperatures between Celsius, Fahrenheit, and Kelvin.",
    defaultFromId: "celsius",
    defaultToId: "fahrenheit",
    defaultValue: 25,
    relatedCategoryIds: ["length", "mass", "area", "volume", "speed", "energy"],
    faqs: [
      {
        question: "How do you convert Celsius to Fahrenheit?",
        answer:
          "To convert Celsius to Fahrenheit, multiply the Celsius temperature by 9/5 (or 1.8) and then add 32: °F = (°C × 9/5) + 32. For example, to convert 25 °C: (25 × 1.8) + 32 = 45 + 32 = 77 °F.",
      },
      {
        question: "Why are there different temperature scales?",
        answer:
          "Celsius and Fahrenheit were developed as relative scales anchored to everyday physical benchmarks such as the freezing and boiling points of water, whereas Kelvin is an absolute thermodynamic scale starting at absolute zero (0 K) used in physics, chemistry, and engineering.",
      },
      {
        question: "What is the zero point of Celsius, Fahrenheit, and Kelvin?",
        answer:
          "Temperature cannot be converted by simple multiplication alone because each scale has a different zero point: 0 °C is the freezing point of water (equal to 32 °F and 273.15 K), 0 °F equals -17.78 °C, and 0 K is absolute zero (-273.15 °C or -459.67 °F), the theoretical limit where all thermal motion ceases.",
      },
    ],
  },
  volume: {
    displayName: "Volume",
    heroTitle: "Volume Converter",
    heroDescription:
      "Enter a volume below to convert between metric, US customary, and imperial liquid units.",
    defaultFromId: "liter",
    defaultToId: "us_gallon",
    defaultValue: 10,
    relatedCategoryIds: ["area", "length", "mass", "flow", "density", "temperature"],
    faqs: [
      {
        question: "What is the difference between a US gallon and a UK Imperial gallon?",
        answer:
          "A US liquid gallon is defined as 231 cubic inches (3.78541 liters), whereas a UK Imperial gallon is defined as 4.54609 liters—making the Imperial gallon about 20.1% larger.",
      },
      {
        question: "How many milliliters are in a US fluid ounce?",
        answer:
          "There are approximately 29.5735 milliliters in 1 US fluid ounce, compared to 28.4131 milliliters in 1 UK Imperial fluid ounce.",
      },
      {
        question: "How many liters are in 1 cubic meter?",
        answer:
          "1 cubic meter (m³) equals exactly 1,000 liters (L) or 1,000,000 milliliters (mL).",
      },
    ],
  },
  area: {
    displayName: "Area",
    heroTitle: "Area Converter",
    heroDescription:
      "Enter an area below to convert between metric and imperial surface and land units.",
    defaultFromId: "sq_meter",
    defaultToId: "sq_foot",
    defaultValue: 100,
    relatedCategoryIds: ["length", "volume", "mass", "pressure", "speed", "energy"],
    faqs: [
      {
        question: "How many square feet are in 1 acre?",
        answer:
          "1 acre equals exactly 43,560 square feet (4,046.8564224 square meters, or approximately 0.404686 hectares).",
      },
      {
        question: "How do I convert square meters to square feet?",
        answer:
          "Multiply the area in square meters by 10.7639104 to get square feet. For example, 100 m² equals approximately 1,076.39 ft².",
      },
      {
        question: "How many acres are in 1 hectare?",
        answer:
          "1 metric hectare (10,000 m²) equals approximately 2.4710538 acres.",
      },
    ],
  },
  speed: {
    displayName: "Speed",
    heroTitle: "Speed Converter",
    heroDescription:
      "Enter a speed below to convert between road, maritime, and aviation velocity units.",
    defaultFromId: "km_per_h",
    defaultToId: "mph",
    defaultValue: 100,
    relatedCategoryIds: ["length", "time", "power", "energy", "area", "force"],
    faqs: [
      {
        question: "How do I convert km/h to mph?",
        answer:
          "Divide the speed in kilometers per hour by 1.609344 (or multiply by 0.621371) to convert to miles per hour. For example, 100 km/h equals 62.1371 mph.",
      },
      {
        question: "What is 1 knot in mph and km/h?",
        answer:
          "1 international knot (1 nautical mile per hour) equals exactly 1.852 km/h, or approximately 1.15078 mph.",
      },
      {
        question: "How do I convert meters per second (m/s) to km/h?",
        answer:
          "Multiply meters per second by 3.6 to get kilometers per hour. For example, 10 m/s equals 36 km/h.",
      },
    ],
  },
  time: {
    displayName: "Time",
    heroTitle: "Time Converter",
    heroDescription:
      "Enter a time duration below to convert between seconds, minutes, hours, days, and years.",
    defaultFromId: "hour",
    defaultToId: "minute",
    defaultValue: 24,
    relatedCategoryIds: ["speed", "frequency", "flow", "power", "length", "energy"],
    faqs: [
      {
        question: "How many seconds are in a standard day?",
        answer:
          "A 24-hour civil day contains 86,400 seconds (24 hours × 60 minutes × 60 seconds).",
      },
      {
        question: "How many days are used for an average Gregorian year?",
        answer:
          "In scientific and astronomical conversions, 1 Gregorian year is 365.2425 days (31,556,952 seconds), accounting for leap-year rules.",
      },
      {
        question: "How many milliseconds are in 1 second?",
        answer:
          "There are 1,000 milliseconds (ms) or 1,000,000 microseconds (µs) in 1 second.",
      },
    ],
  },
  pressure: {
    displayName: "Pressure",
    heroTitle: "Pressure Converter",
    heroDescription:
      "Enter a pressure reading below to convert between PSI, bar, Pascals, and atmospheres.",
    defaultFromId: "bar",
    defaultToId: "psi",
    defaultValue: 2,
    relatedCategoryIds: ["force", "area", "temperature", "flow", "volume", "energy"],
    faqs: [
      {
        question: "How many PSI are in 1 bar of pressure?",
        answer:
          "1 bar (100,000 Pascals) equals approximately 14.50377 pounds per square inch (PSI).",
      },
      {
        question: "What is standard atmospheric pressure at sea level?",
        answer:
          "1 standard atmosphere (atm) is defined as 101,325 Pascals (1,013.25 hPa / mbar, 1.01325 bar, 14.6959 PSI, or 760 Torr).",
      },
      {
        question: "Why are hPa and millibar numerically identical?",
        answer:
          "Both 1 hectopascal (hPa) and 1 millibar (mbar) equal exactly 100 Pascals, so meteorological readings in hPa and mbar have the exact same value.",
      },
    ],
  },
  energy: {
    displayName: "Energy",
    heroTitle: "Energy Converter",
    heroDescription:
      "Enter an energy value below to convert between Joules, calories, kilowatt-hours, and BTUs.",
    defaultFromId: "kilojoule",
    defaultToId: "kilocalorie",
    defaultValue: 100,
    relatedCategoryIds: ["power", "temperature", "force", "torque", "mass", "pressure"],
    faqs: [
      {
        question: "How many Joules are in 1 calorie vs. 1 food Calorie (kcal)?",
        answer:
          "1 thermochemical gram calorie (cal) is 4.184 Joules, whereas 1 dietary food Calorie (kilocalorie, kcal) is 1,000 gram calories or 4,184 Joules (4.184 kJ).",
      },
      {
        question: "How many Joules are in 1 kilowatt-hour (kWh)?",
        answer:
          "1 kilowatt-hour equals exactly 3,600,000 Joules (3.6 megajoules).",
      },
      {
        question: "What is 1 BTU in Joules?",
        answer:
          "1 International Table British Thermal Unit (BTU) equals approximately 1,055.05585 Joules.",
      },
    ],
  },
  power: {
    displayName: "Power",
    heroTitle: "Power Converter",
    heroDescription:
      "Enter a power value below to convert between Watts, kilowatts, horsepower, and BTU/h.",
    defaultFromId: "kilowatt",
    defaultToId: "horsepower_mechanical",
    defaultValue: 100,
    relatedCategoryIds: ["energy", "current", "torque", "speed", "temperature", "pressure"],
    faqs: [
      {
        question: "What is the difference between mechanical horsepower (hp) and metric horsepower (PS)?",
        answer:
          "1 imperial mechanical horsepower (hp) equals 550 ft·lbf/s or 745.69987 Watts, while 1 metric horsepower (PS) equals 75 kgf·m/s or 735.49875 Watts.",
      },
      {
        question: "How many kilowatts is 1 ton of refrigeration?",
        answer:
          "1 commercial HVAC ton of refrigeration (12,000 BTU/h) equals approximately 3.51685 kilowatts.",
      },
      {
        question: "How do I convert Watts to kilowatts?",
        answer:
          "Divide Watts by 1,000 to get kilowatts (1,000 W = 1 kW).",
      },
    ],
  },
  digital_storage: {
    displayName: "Data Storage",
    heroTitle: "Data Storage Converter",
    heroDescription:
      "Enter a data size below to convert between bytes, kilobytes, megabytes, gigabytes, and terabytes.",
    defaultFromId: "gigabyte",
    defaultToId: "megabyte",
    defaultValue: 1,
    relatedCategoryIds: ["data_transfer", "frequency", "time", "power", "length", "energy"],
    faqs: [
      {
        question: "Is 1 Gigabyte 1,000 MB or 1,024 MiB?",
        answer:
          "Under the SI decimal standard used by SSD manufacturers, 1 GB = 1,000 MB (10⁹ bytes). Under the IEC binary standard used by operating systems, 1 GiB = 1,024 MiB (2³⁰ = 1,073,741,824 bytes).",
      },
      {
        question: "How many bits are in 1 byte?",
        answer:
          "1 byte (B) consists of 8 binary bits (b).",
      },
      {
        question: "How many Gigabytes are in 1 Terabyte?",
        answer:
          "In decimal SI storage, 1 Terabyte (TB) equals 1,000 Gigabytes (GB). In binary IEC storage, 1 Tebibyte (TiB) equals 1,024 Gibibytes (GiB).",
      },
    ],
  },
};

const CATEGORY_DASHBOARD_CONFIGS: Record<string, CategoryDashboardConfig> = {
  length: {
    heroBadgeClass:
      "bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/70 text-blue-600 dark:text-blue-400",
    sidebarIconClass:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
    primaryUnitIds: ["meter", "foot", "inch"],
    referenceRows: [
      { description: "1 centimeter (0.01 m)", baseValueInUnit1: 0.01 },
      { description: "Standard 30 cm ruler", baseValueInUnit1: 0.3 },
      { description: "1 meter SI base length", baseValueInUnit1: 1 },
      { description: "Standard doorway height (2 m)", baseValueInUnit1: 2 },
      { description: "10 meters benchmark", baseValueInUnit1: 10 },
      { description: "Olympic swimming pool (50 m)", baseValueInUnit1: 50 },
      { description: "100-meter track sprint", baseValueInUnit1: 100 },
    ],
    formulaCards: [
      { label: "Meters to Feet", equation: "ft = m × 3.28084" },
      { label: "Centimeters to Inches", equation: "in = cm ÷ 2.54" },
      { label: "Kilometers to Miles", equation: "mi = km × 0.621371" },
    ],
    workedExampleTitle: "Example: Convert 10 Meters to Feet",
    workedExampleLines: [
      "ft = 10 × 3.28084",
      "ft = 32.8084 ft",
    ],
    workedExampleNote:
      "Under the 1959 International Yard and Pound Agreement, 1 foot is defined as exactly 0.3048 meters (and 1 inch = 2.54 cm).",
    quickInfoBullets: [
      {
        boldPrefix: "Meter (m)",
        text: "is the SI base unit of length used worldwide for science, engineering, and everyday distance.",
      },
      {
        boldPrefix: "Foot (ft) & Inch (in)",
        text: "are the primary Imperial and US Customary length units (1 ft = 12 in = 0.3048 m).",
      },
      {
        boldPrefix: "Kilometer (km) & Mile (mi)",
        text: "are used for geographic and road distances (1 mile = 1.609344 km).",
      },
      {
        boldPrefix: "Exact 1959 standard:",
        text: "1 inch is defined internationally as exactly 25.4 millimeters (2.54 cm).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "meter",
        title: "Meter (m)",
        description:
          "The fundamental SI base unit of length. Equal to 100 centimeters or approximately 3.28084 feet.",
      },
      {
        unitId: "foot",
        title: "Foot (ft)",
        description:
          "Imperial and US Customary unit equal to 12 inches or 1/3 of a yard (exactly 0.3048 meters).",
      },
      {
        unitId: "inch",
        title: "Inch (in)",
        description:
          "Commonly used in the US, UK, and display sizing. Defined as exactly 2.54 centimeters (25.4 mm).",
      },
    ],
  },
  mass: {
    heroBadgeClass:
      "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-400",
    sidebarIconClass:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
    primaryUnitIds: ["kilogram", "pound", "ounce"],
    referenceRows: [
      { description: "100 grams (0.1 kg)", baseValueInUnit1: 0.1 },
      { description: "Half kilogram (500 g)", baseValueInUnit1: 0.5 },
      { description: "1 kilogram SI base mass", baseValueInUnit1: 1 },
      { description: "Bag of flour (5 kg)", baseValueInUnit1: 5 },
      { description: "10 kilograms benchmark", baseValueInUnit1: 10 },
      { description: "Checked airline luggage (23 kg)", baseValueInUnit1: 23 },
      { description: "100 kilograms reference", baseValueInUnit1: 100 },
    ],
    formulaCards: [
      { label: "Kilograms to Pounds", equation: "lb = kg × 2.20462" },
      { label: "Pounds to Kilograms", equation: "kg = lb × 0.453592" },
      { label: "Grams to Ounces", equation: "oz = g ÷ 28.3495" },
    ],
    workedExampleTitle: "Example: Convert 10 Kilograms to Pounds",
    workedExampleLines: [
      "lb = 10 × 2.20462",
      "lb = 22.0462 lb",
    ],
    workedExampleNote:
      "1 avoirdupois pound is legally defined as exactly 0.45359237 kilograms (and 1 pound = 16 ounces).",
    quickInfoBullets: [
      {
        boldPrefix: "Kilogram (kg)",
        text: "is the fundamental SI base unit of mass used globally across commerce, science, and healthcare.",
      },
      {
        boldPrefix: "Pound (lb)",
        text: "is the primary avoirdupois unit of weight in the United States and UK (1 lb = 0.45359237 kg).",
      },
      {
        boldPrefix: "Ounce (oz) & Gram (g)",
        text: "are used for culinary, postal, and small parcel measurements (1 oz ≈ 28.3495 g).",
      },
      {
        boldPrefix: "Troy vs. Avoirdupois:",
        text: "Precious metals use the Troy ounce (31.1035 g), which is heavier than the standard ounce (28.3495 g).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "kilogram",
        title: "Kilogram (kg)",
        description:
          "The SI base unit of mass equal to 1,000 grams or approximately 2.20462 avoirdupois pounds.",
      },
      {
        unitId: "pound",
        title: "Pound (lb)",
        description:
          "Standard US and Imperial weight unit equal to 16 ounces or 0.45359237 kilograms.",
      },
      {
        unitId: "ounce",
        title: "Ounce (oz)",
        description:
          "Equal to 1/16 of a pound (approximately 28.3495 grams), widely used in food and postal weight.",
      },
    ],
  },
  volume: {
    heroBadgeClass:
      "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/80 dark:border-cyan-800/70 text-cyan-600 dark:text-cyan-400",
    sidebarIconClass:
      "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
    primaryUnitIds: ["liter", "us_gallon", "milliliter"],
    referenceRows: [
      { description: "1 US cup (~0.2366 L)", baseValueInUnit1: 0.236588 },
      { description: "Half liter bottle (500 mL)", baseValueInUnit1: 0.5 },
      { description: "1 liter metric benchmark", baseValueInUnit1: 1 },
      { description: "2-liter beverage bottle", baseValueInUnit1: 2 },
      { description: "1 US gallon (3.7854 L)", baseValueInUnit1: 3.785412 },
      { description: "10 liters container", baseValueInUnit1: 10 },
      { description: "50 liters fuel tank", baseValueInUnit1: 50 },
    ],
    formulaCards: [
      { label: "Liters to US Gallons", equation: "gal = L ÷ 3.78541" },
      { label: "US Gallons to Liters", equation: "L = gal × 3.78541" },
      { label: "Milliliters to Fluid Oz", equation: "fl oz = mL ÷ 29.5735" },
    ],
    workedExampleTitle: "Example: Convert 10 Liters to US Gallons",
    workedExampleLines: [
      "gal (US) = 10 ÷ 3.78541",
      "gal (US) = 2.64172 gal (US)",
    ],
    workedExampleNote:
      "Note the distinction between US Liquid Gallons (3.78541 L) and UK Imperial Gallons (4.54609 L).",
    quickInfoBullets: [
      {
        boldPrefix: "Liter (L) & Milliliter (mL)",
        text: "are the universal metric volume units for liquids and containers (1 L = 1,000 mL = 1,000 cm³).",
      },
      {
        boldPrefix: "US Liquid Gallon (gal)",
        text: "equals 4 US quarts, 8 US pints, 128 US fluid ounces, or 3.78541 liters.",
      },
      {
        boldPrefix: "UK Imperial Gallon",
        text: "equals 4.54609 liters (160 UK fluid ounces), making it 20.1% larger than a US gallon.",
      },
      {
        boldPrefix: "Cubic Meter (m³)",
        text: "is the coherent SI derived unit of volume equal to exactly 1,000 liters.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "liter",
        title: "Liter (L)",
        description:
          "Metric volume unit equal to 1 cubic decimeter (1,000 mL). Widely used globally for beverages and fuel.",
      },
      {
        unitId: "us_gallon",
        title: "US Gallon (gal)",
        description:
          "Defined as 231 cubic inches (3.78541 liters). Standard in the United States for fuel and milk.",
      },
      {
        unitId: "milliliter",
        title: "Milliliter (mL)",
        description:
          "Equal to 1/1000 of a liter or 1 cubic centimeter (cc). Used in cooking, medicine, and chemistry.",
      },
    ],
  },
  area: {
    heroBadgeClass:
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400",
    sidebarIconClass:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    primaryUnitIds: ["sq_meter", "sq_foot", "acre"],
    referenceRows: [
      { description: "1 square meter benchmark", baseValueInUnit1: 1 },
      { description: "Small bedroom (15 m²)", baseValueInUnit1: 15 },
      { description: "Studio apartment (50 m²)", baseValueInUnit1: 50 },
      { description: "100 square meters floor plan", baseValueInUnit1: 100 },
      { description: "Tennis court (~261 m²)", baseValueInUnit1: 260.87 },
      { description: "1 Acre land parcel (4,046.86 m²)", baseValueInUnit1: 4046.8564 },
      { description: "1 Hectare (10,000 m²)", baseValueInUnit1: 10000 },
    ],
    formulaCards: [
      { label: "Sq Meters to Sq Feet", equation: "ft² = m² × 10.7639" },
      { label: "Sq Feet to Sq Meters", equation: "m² = ft² × 0.092903" },
      { label: "Hectares to Acres", equation: "ac = ha × 2.47105" },
    ],
    workedExampleTitle: "Example: Convert 100 Square Meters to Square Feet",
    workedExampleLines: [
      "ft² = 100 × 10.7639104",
      "ft² = 1,076.391 ft²",
    ],
    workedExampleNote:
      "Because 1 foot = 0.3048 m, 1 square foot equals (0.3048)² = 0.09290304 square meters.",
    quickInfoBullets: [
      {
        boldPrefix: "Square Meter (m²)",
        text: "is the SI derived unit of area used internationally for architecture, floor plans, and land.",
      },
      {
        boldPrefix: "Square Foot (ft²)",
        text: "is the standard floor-space unit in the US, UK, and Canada (1 m² ≈ 10.7639 ft²).",
      },
      {
        boldPrefix: "Acre (ac) & Hectare (ha)",
        text: "measure agricultural and real estate land parcels (1 ha = 10,000 m² ≈ 2.471 acres).",
      },
      {
        boldPrefix: "Squaring linear factors:",
        text: "Area conversion factors are the square of their corresponding linear length factors.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "sq_meter",
        title: "Square Meter (m²)",
        description:
          "SI unit of surface area equal to a square 1 meter on each side (approx. 10.7639 square feet).",
      },
      {
        unitId: "sq_foot",
        title: "Square Foot (ft²)",
        description:
          "Imperial and US real estate standard equal to 144 square inches (0.09290304 m²).",
      },
      {
        unitId: "acre",
        title: "Acre (ac)",
        description:
          "Land area unit equal to 43,560 square feet or 4,840 square yards (approx. 4,046.86 m²).",
      },
    ],
  },
  speed: {
    heroBadgeClass:
      "bg-orange-50 dark:bg-orange-950/60 border-orange-200/80 dark:border-orange-800/70 text-orange-600 dark:text-orange-400",
    sidebarIconClass:
      "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400",
    primaryUnitIds: ["km_per_h", "mph", "m_per_s"],
    referenceRows: [
      { description: "Brisk walking speed (5 km/h)", baseValueInUnit1: 5 },
      { description: "Urban school zone (30 km/h)", baseValueInUnit1: 30 },
      { description: "City street limit (50 km/h)", baseValueInUnit1: 50 },
      { description: "Highway cruising (100 km/h)", baseValueInUnit1: 100 },
      { description: "Expressway speed (120 km/h)", baseValueInUnit1: 120 },
      { description: "High-speed rail (300 km/h)", baseValueInUnit1: 300 },
      { description: "Speed of sound Mach 1 (~1,225 km/h)", baseValueInUnit1: 1225.044 },
    ],
    formulaCards: [
      { label: "km/h to mph", equation: "mph = km/h ÷ 1.609344" },
      { label: "mph to km/h", equation: "km/h = mph × 1.609344" },
      { label: "m/s to km/h", equation: "km/h = m/s × 3.6" },
    ],
    workedExampleTitle: "Example: Convert 100 km/h to Miles per Hour (mph)",
    workedExampleLines: [
      "mph = 100 ÷ 1.609344",
      "mph = 62.137119 mph",
    ],
    workedExampleNote:
      "1 mile per hour equals exactly 1.609344 km/h (0.44704 m/s), and 1 m/s equals 3.6 km/h.",
    quickInfoBullets: [
      {
        boldPrefix: "Kilometers per hour (km/h)",
        text: "is the official road speed limit and speedometer unit in most countries worldwide.",
      },
      {
        boldPrefix: "Miles per hour (mph)",
        text: "is used for road traffic speed limits in the United States and the United Kingdom.",
      },
      {
        boldPrefix: "Meters per second (m/s)",
        text: "is the coherent SI unit of velocity used in physics and meteorology (wind speed).",
      },
      {
        boldPrefix: "Knot (kn):",
        text: "Used in aviation and maritime navigation, equal to 1 nautical mile per hour (1.852 km/h).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "km_per_h",
        title: "Kilometers per Hour (km/h)",
        description:
          "Global metric road velocity standard. 100 km/h equals approximately 62.14 mph.",
      },
      {
        unitId: "mph",
        title: "Miles per Hour (mph)",
        description:
          "US and UK road velocity standard. 60 mph equals approximately 96.56 km/h.",
      },
      {
        unitId: "m_per_s",
        title: "Meters per Second (m/s)",
        description:
          "The SI derived unit of speed and velocity. 1 m/s equals exactly 3.6 km/h.",
      },
    ],
  },
  time: {
    heroBadgeClass:
      "bg-violet-50 dark:bg-violet-950/60 border-violet-200/80 dark:border-violet-800/70 text-violet-600 dark:text-violet-400",
    sidebarIconClass:
      "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400",
    primaryUnitIds: ["hour", "minute", "second"],
    referenceRows: [
      { description: "1 minute (60 seconds)", baseValueInUnit1: 1 / 60 },
      { description: "Half hour (30 minutes)", baseValueInUnit1: 0.5 },
      { description: "1 hour standard duration", baseValueInUnit1: 1 },
      { description: "Standard 8-hour workday", baseValueInUnit1: 8 },
      { description: "1 civil day (24 hours)", baseValueInUnit1: 24 },
      { description: "1 calendar week (168 hours)", baseValueInUnit1: 168 },
    ],
    formulaCards: [
      { label: "Hours to Minutes", equation: "min = hr × 60" },
      { label: "Hours to Seconds", equation: "s = hr × 3,600" },
      { label: "Days to Hours", equation: "hr = d × 24" },
    ],
    workedExampleTitle: "Example: Convert 24 Hours to Minutes",
    workedExampleLines: ["min = 24 × 60", "min = 1,440 min (86,400 seconds)"],
    workedExampleNote:
      "1 standard civil day equals 24 hours, 1,440 minutes, or 86,400 SI seconds.",
    quickInfoBullets: [
      {
        boldPrefix: "Second (s)",
        text: "is the fundamental SI base unit of time defined by the cesium-133 atomic transition frequency.",
      },
      {
        boldPrefix: "Minute (min) & Hour (hr)",
        text: "follow the sexagesimal (base-60) division: 1 hr = 60 min = 3,600 s.",
      },
      {
        boldPrefix: "Gregorian Year (yr)",
        text: "averages 365.2425 days (31,556,952 seconds) to account for leap-year rules.",
      },
      {
        boldPrefix: "Sub-second precision:",
        text: "Computing and physics use milliseconds (10⁻³ s), microseconds (10⁻⁶ s), and nanoseconds (10⁻⁹ s).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "hour",
        title: "Hour (hr)",
        description:
          "Standard civil time unit equal to 60 minutes, 3,600 seconds, or 1/24 of a solar day.",
      },
      {
        unitId: "minute",
        title: "Minute (min)",
        description:
          "Unit of duration equal to 60 seconds or 1/60 of an hour.",
      },
      {
        unitId: "second",
        title: "Second (s)",
        description:
          "The official SI base unit of time used across physics, engineering, and astronomy.",
      },
    ],
  },
  pressure: {
    heroBadgeClass:
      "bg-sky-50 dark:bg-sky-950/60 border-sky-200/80 dark:border-sky-800/70 text-sky-600 dark:text-sky-400",
    sidebarIconClass:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400",
    primaryUnitIds: ["bar", "psi", "kilopascal"],
    referenceRows: [
      { description: "Standard atmospheric pressure (1 atm)", baseValueInUnit1: 1.01325 },
      { description: "1 Bar metric benchmark (100 kPa)", baseValueInUnit1: 1 },
      { description: "Passenger car tire (~2.2 bar / 32 PSI)", baseValueInUnit1: 2.2 },
      { description: "Residential water line (~4 bar)", baseValueInUnit1: 4 },
      { description: "Road bike tire (~6.9 bar / 100 PSI)", baseValueInUnit1: 6.89476 },
      { description: "Scuba tank full (~200 bar)", baseValueInUnit1: 200 },
    ],
    formulaCards: [
      { label: "Bar to PSI", equation: "PSI = bar × 14.5038" },
      { label: "PSI to kPa", equation: "kPa = PSI × 6.89476" },
      { label: "Bar to Kilopascals", equation: "kPa = bar × 100" },
    ],
    workedExampleTitle: "Example: Convert 2 Bar to Pounds per Square Inch (PSI)",
    workedExampleLines: ["PSI = 2 × 14.5037738", "PSI = 29.007548 PSI"],
    workedExampleNote:
      "1 bar equals exactly 100,000 Pascals (100 kPa), and 1 standard atmosphere (atm) equals 101.325 kPa.",
    quickInfoBullets: [
      {
        boldPrefix: "Pascal (Pa) & Kilopascal (kPa)",
        text: "are the coherent SI pressure units (1 Pa = 1 N/m²; 1 kPa = 1,000 Pa).",
      },
      {
        boldPrefix: "Bar & Millibar (mbar)",
        text: "are widely used in meteorology, hydraulics, and industrial gauges (1 bar = 100 kPa).",
      },
      {
        boldPrefix: "PSI (lbf/in²)",
        text: "is the standard automotive tire, pneumatic, and hydraulic pressure unit in the US.",
      },
      {
        boldPrefix: "Standard Atmosphere (atm):",
        text: "Defined internationally as exactly 101,325 Pascals (approx. 14.6959 PSI or 760 Torr).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "bar",
        title: "Bar (bar)",
        description:
          "Metric pressure unit equal to 100 kilopascals (100,000 Pa) or approximately 14.5038 PSI.",
      },
      {
        unitId: "psi",
        title: "PSI (lbf/in²)",
        description:
          "Pounds-force per square inch. 1 PSI equals approximately 6.89476 kilopascals.",
      },
      {
        unitId: "kilopascal",
        title: "Kilopascal (kPa)",
        description:
          "SI metric multiple equal to 1,000 Pascals (1/100 of a bar).",
      },
    ],
  },
  energy: {
    heroBadgeClass:
      "bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/70 text-amber-600 dark:text-amber-400",
    sidebarIconClass:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
    primaryUnitIds: ["kilojoule", "kilocalorie", "kilowatt_hour"],
    referenceRows: [
      { description: "1 Kilojoule (1,000 Joules)", baseValueInUnit1: 1 },
      { description: "1 Dietary food Calorie (1 kcal)", baseValueInUnit1: 4.184 },
      { description: "100 Kilojoules benchmark", baseValueInUnit1: 100 },
      { description: "Medium apple (~400 kJ / 95 kcal)", baseValueInUnit1: 400 },
      { description: "1 Kilowatt-hour electricity (3,600 kJ)", baseValueInUnit1: 3600 },
      { description: "Daily adult diet (8,400 kJ / 2,000 kcal)", baseValueInUnit1: 8368 },
    ],
    formulaCards: [
      { label: "Kilojoules to kcal", equation: "kcal = kJ ÷ 4.184" },
      { label: "kcal to Kilojoules", equation: "kJ = kcal × 4.184" },
      { label: "kWh to Kilojoules", equation: "kJ = kWh × 3,600" },
    ],
    workedExampleTitle: "Example: Convert 100 Kilojoules to Kilocalories (kcal)",
    workedExampleLines: ["kcal = 100 ÷ 4.184", "kcal = 23.900574 kcal"],
    workedExampleNote:
      "1 thermochemical kilocalorie (dietary Calorie) equals exactly 4.184 kilojoules (4,184 Joules).",
    quickInfoBullets: [
      {
        boldPrefix: "Joule (J) & Kilojoule (kJ)",
        text: "are the coherent SI units of energy, work, and heat (1 kJ = 1,000 J).",
      },
      {
        boldPrefix: "Kilocalorie (kcal)",
        text: "is the nutritional 'Calorie' printed on food labels (1 kcal = 1,000 cal = 4.184 kJ).",
      },
      {
        boldPrefix: "Kilowatt-hour (kWh)",
        text: "is the standard electrical utility billing unit (1 kWh = 3.6 MJ = 3,600 kJ).",
      },
      {
        boldPrefix: "BTU (British Thermal Unit):",
        text: "Used in HVAC and heating systems; 1 BTU equals approximately 1.05506 kJ.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "kilojoule",
        title: "Kilojoule (kJ)",
        description:
          "SI metric unit equal to 1,000 Joules. Used internationally on nutrition labels and in physics.",
      },
      {
        unitId: "kilocalorie",
        title: "Kilocalorie (kcal)",
        description:
          "Dietary Calorie equal to 1,000 gram calories or 4,184 Joules.",
      },
      {
        unitId: "kilowatt_hour",
        title: "Kilowatt-hour (kWh)",
        description:
          "Electrical energy equivalent to 1,000 Watts sustained for 1 hour (3,600,000 Joules).",
      },
    ],
  },
  power: {
    heroBadgeClass:
      "bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-200/80 dark:border-fuchsia-800/70 text-fuchsia-600 dark:text-fuchsia-400",
    sidebarIconClass:
      "bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400",
    primaryUnitIds: ["kilowatt", "horsepower_mechanical", "watt"],
    referenceRows: [
      { description: "LED household bulb (0.01 kW / 10 W)", baseValueInUnit1: 0.01 },
      { description: "1 Mechanical Horsepower (~0.7457 kW)", baseValueInUnit1: 0.7457 },
      { description: "1 Kilowatt electrical power (1,000 W)", baseValueInUnit1: 1 },
      { description: "1 Ton of HVAC refrigeration (~3.517 kW)", baseValueInUnit1: 3.51685 },
      { description: "Compact car engine (100 kW)", baseValueInUnit1: 100 },
      { description: "Sports car output (300 kW)", baseValueInUnit1: 300 },
    ],
    formulaCards: [
      { label: "Kilowatts to HP", equation: "hp = kW × 1.34102" },
      { label: "HP to Kilowatts", equation: "kW = hp × 0.7457" },
      { label: "Kilowatts to Watts", equation: "W = kW × 1,000" },
    ],
    workedExampleTitle: "Example: Convert 100 Kilowatts to Mechanical Horsepower (hp)",
    workedExampleLines: ["hp = 100 ÷ 0.74569987", "hp = 134.102209 hp"],
    workedExampleNote:
      "1 imperial mechanical horsepower (550 ft·lbf/s) equals 745.69987 Watts, while 1 metric PS equals 735.49875 Watts.",
    quickInfoBullets: [
      {
        boldPrefix: "Watt (W) & Kilowatt (kW)",
        text: "are the coherent SI units of power (1 W = 1 Joule/second; 1 kW = 1,000 W).",
      },
      {
        boldPrefix: "Mechanical Horsepower (hp)",
        text: "is the traditional imperial automotive and motor rating equal to 745.7 Watts.",
      },
      {
        boldPrefix: "Metric Horsepower (PS)",
        text: "is used in European automotive specs (1 PS = 735.5 W ≈ 0.9863 hp).",
      },
      {
        boldPrefix: "BTU/hr & Tons of Cooling:",
        text: "HVAC systems use BTU/hr and Tons of Refrigeration (1 TR = 12,000 BTU/hr = 3.517 kW).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "kilowatt",
        title: "Kilowatt (kW)",
        description:
          "Equal to 1,000 Watts. Global standard for EV motors, generators, and electrical appliances.",
      },
      {
        unitId: "horsepower_mechanical",
        title: "Horsepower (hp)",
        description:
          "Imperial mechanical power rating defined as 550 foot-pounds per second (745.7 W).",
      },
      {
        unitId: "watt",
        title: "Watt (W)",
        description:
          "Coherent SI derived unit of power equal to 1 Joule per second (1 V × 1 A).",
      },
    ],
  },
  digital_storage: {
    heroBadgeClass:
      "bg-teal-50 dark:bg-teal-950/60 border-teal-200/80 dark:border-teal-800/70 text-teal-600 dark:text-teal-400",
    sidebarIconClass:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400",
    primaryUnitIds: ["gigabyte", "megabyte", "gibibyte"],
    referenceRows: [
      { description: "High-res photo (10 MB / 0.01 GB)", baseValueInUnit1: 0.01 },
      { description: "1 Gigabyte SI decimal benchmark", baseValueInUnit1: 1 },
      { description: "HD feature film (~4 GB)", baseValueInUnit1: 4 },
      { description: "Smartphone base storage (128 GB)", baseValueInUnit1: 128 },
      { description: "Laptop NVMe SSD (512 GB)", baseValueInUnit1: 512 },
      { description: "1 Terabyte drive (1,000 GB)", baseValueInUnit1: 1000 },
    ],
    formulaCards: [
      { label: "GB to MB (SI Decimal)", equation: "MB = GB × 1,000" },
      { label: "GiB to MiB (Binary)", equation: "MiB = GiB × 1,024" },
      { label: "Bytes to Bits", equation: "bits = Bytes × 8" },
    ],
    workedExampleTitle: "Example: Convert 1 Gigabyte (GB) to Megabytes (MB) and Gibibytes (GiB)",
    workedExampleLines: [
      "MB (SI decimal) = 1 × 1,000 = 1,000 MB",
      "GiB (IEC binary) = 1,000,000,000 ÷ 1,073,741,824 = 0.931323 GiB",
    ],
    workedExampleNote:
      "Storage manufacturers use decimal SI powers of 1,000 (1 GB = 10⁹ B), while OS memory uses binary IEC powers of 1,024 (1 GiB = 2³⁰ B).",
    quickInfoBullets: [
      {
        boldPrefix: "Byte (B) & Bit (b)",
        text: "form the foundation of digital data: 1 Byte equals exactly 8 binary bits.",
      },
      {
        boldPrefix: "Decimal SI (KB, MB, GB, TB)",
        text: "scales by powers of 1,000 (1 GB = 1,000 MB = 1,000,000,000 Bytes).",
      },
      {
        boldPrefix: "Binary IEC (KiB, MiB, GiB, TiB)",
        text: "scales by powers of 1,024 (1 GiB = 1,024 MiB = 1,073,741,824 Bytes).",
      },
      {
        boldPrefix: "Why drives look smaller in OS:",
        text: "A 1 TB (10¹² B) SSD displays as 931.3 GiB when read using binary 1,024-based units.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "gigabyte",
        title: "Gigabyte (GB)",
        description:
          "SI decimal storage unit equal to 1,000 Megabytes or 10⁹ Bytes.",
      },
      {
        unitId: "megabyte",
        title: "Megabyte (MB)",
        description:
          "SI decimal storage unit equal to 1,000 Kilobytes or 10⁶ Bytes.",
      },
      {
        unitId: "gibibyte",
        title: "Gibibyte (GiB)",
        description:
          "IEC binary unit equal to 1,024 Mebibytes or 2³⁰ (1,073,741,824) Bytes.",
      },
    ],
  },
  data_transfer: {
    heroBadgeClass:
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400",
    sidebarIconClass:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    primaryUnitIds: ["mbps", "mb_per_sec", "gbps"],
    referenceRows: [
      { description: "4K video stream (25 Mbps)", baseValueInUnit1: 25 },
      { description: "Fast home broadband (100 Mbps)", baseValueInUnit1: 100 },
      { description: "Wi-Fi 6 real throughput (500 Mbps)", baseValueInUnit1: 500 },
      { description: "1 Gigabit fiber (1,000 Mbps)", baseValueInUnit1: 1000 },
      { description: "10 Gigabit Ethernet (10,000 Mbps)", baseValueInUnit1: 10000 },
    ],
    formulaCards: [
      { label: "Mbps to MB/s", equation: "MB/s = Mbps ÷ 8" },
      { label: "MB/s to Mbps", equation: "Mbps = MB/s × 8" },
      { label: "Gbps to Mbps", equation: "Mbps = Gbps × 1,000" },
    ],
    workedExampleTitle: "Example: Convert 100 Mbps Internet Speed to Megabytes per Second (MB/s)",
    workedExampleLines: ["MB/s = 100 ÷ 8", "MB/s = 12.5 MB/s"],
    workedExampleNote:
      "ISPs advertise speeds in Megabits per second (Mbps), while browsers and download managers show Megabytes per second (MB/s). Divide by 8 to convert bits to Bytes.",
    quickInfoBullets: [
      {
        boldPrefix: "Megabits per second (Mbps)",
        text: "is the standard telecommunications and ISP bandwidth rating (1 Mbps = 10⁶ bits/s).",
      },
      {
        boldPrefix: "Megabytes per second (MB/s)",
        text: "measures actual file transfer and disk write speed (1 MB/s = 8 Mbps).",
      },
      {
        boldPrefix: "Gigabits per second (Gbps)",
        text: "is used for fiber internet, Ethernet NICs, and server backbones (1 Gbps = 1,000 Mbps).",
      },
      {
        boldPrefix: "8 bits = 1 Byte:",
        text: "Always divide bit-rate (bps, Mbps, Gbps) by 8 to find the maximum byte transfer rate.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "mbps",
        title: "Megabits per Sec (Mbps)",
        description:
          "Equal to 1,000,000 bits per second. Used to rate Wi-Fi and broadband connections.",
      },
      {
        unitId: "mb_per_sec",
        title: "Megabytes per Sec (MB/s)",
        description:
          "Equal to 8 Megabits per second (1,000,000 Bytes/sec). Used for file downloads and SSD speeds.",
      },
      {
        unitId: "gbps",
        title: "Gigabits per Sec (Gbps)",
        description:
          "Equal to 1,000 Mbps or 125 MB/s. Standard for fiber-optic and LAN interfaces.",
      },
    ],
  },
  force: {
    heroBadgeClass:
      "bg-red-50 dark:bg-red-950/60 border-red-200/80 dark:border-red-800/70 text-red-600 dark:text-red-400",
    sidebarIconClass:
      "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400",
    primaryUnitIds: ["newton", "pound_force", "kilogram_force"],
    referenceRows: [
      { description: "Weight of a small apple (~1 N)", baseValueInUnit1: 1 },
      { description: "1 Pound-force (4.4482 N)", baseValueInUnit1: 4.448222 },
      { description: "1 Kilogram-force (9.80665 N)", baseValueInUnit1: 9.80665 },
      { description: "100 Newtons benchmark", baseValueInUnit1: 100 },
      { description: "1 Kilonewton structural load (1,000 N)", baseValueInUnit1: 1000 },
    ],
    formulaCards: [
      { label: "Newtons to lbf", equation: "lbf = N ÷ 4.44822" },
      { label: "lbf to Newtons", equation: "N = lbf × 4.44822" },
      { label: "kgf to Newtons", equation: "N = kgf × 9.80665" },
    ],
    workedExampleTitle: "Example: Convert 100 Newtons to Pounds-force (lbf)",
    workedExampleLines: ["lbf = 100 ÷ 4.4482216", "lbf = 22.480894 lbf"],
    workedExampleNote:
      "1 Newton is the force required to accelerate 1 kg of mass at 1 m/s².",
    quickInfoBullets: [
      {
        boldPrefix: "Newton (N) & Kilonewton (kN)",
        text: "are the coherent SI units of mechanical and structural force (1 N = 1 kg·m/s²).",
      },
      {
        boldPrefix: "Pound-force (lbf)",
        text: "is the gravitational force exerted on 1 avoirdupois pound under standard gravity (4.44822 N).",
      },
      {
        boldPrefix: "Kilogram-force (kgf / kp)",
        text: "equals the weight of 1 kg under standard gravity g₀ = 9.80665 m/s² (9.80665 N).",
      },
      {
        boldPrefix: "Kip-force (kipf):",
        text: "Used in civil and structural engineering, equal to 1,000 pounds-force (4.44822 kN).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "newton",
        title: "Newton (N)",
        description:
          "Coherent SI unit of force defined as 1 kg·m/s².",
      },
      {
        unitId: "pound_force",
        title: "Pound-force (lbf)",
        description:
          "US & Imperial engineering force unit equal to 4.4482216 Newtons.",
      },
      {
        unitId: "kilogram_force",
        title: "Kilogram-force (kgf)",
        description:
          "Gravitational metric unit equal to exactly 9.80665 Newtons.",
      },
    ],
  },
  density: {
    heroBadgeClass:
      "bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/70 text-purple-600 dark:text-purple-400",
    sidebarIconClass:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
    primaryUnitIds: ["kg_per_m3", "g_per_cm3", "lb_per_ft3"],
    referenceRows: [
      { description: "Air at sea level (~1.225 kg/m³)", baseValueInUnit1: 1.225 },
      { description: " Gasoline (~750 kg/m³)", baseValueInUnit1: 750 },
      { description: "Pure water at 4 °C (1,000 kg/m³)", baseValueInUnit1: 1000 },
      { description: "Aluminum (~2,700 kg/m³)", baseValueInUnit1: 2700 },
      { description: "Structural steel (~7,850 kg/m³)", baseValueInUnit1: 7850 },
    ],
    formulaCards: [
      { label: "g/cm³ to kg/m³", equation: "kg/m³ = g/cm³ × 1,000" },
      { label: "kg/m³ to lb/ft³", equation: "lb/ft³ = kg/m³ ÷ 16.0185" },
      { label: "mg/L to ppm", equation: "ppm = mg/L × 1" },
    ],
    workedExampleTitle: "Example: Convert Water Density (1,000 kg/m³) to g/cm³ and lb/ft³",
    workedExampleLines: [
      "g/cm³ = 1,000 ÷ 1,000 = 1 g/cm³",
      "lb/ft³ = 1,000 ÷ 16.018463 = 62.42796 lb/ft³",
    ],
    workedExampleNote:
      "1 g/cm³ (or 1 g/mL) equals exactly 1,000 kg/m³. In dilute aqueous solutions, 1 mg/L equals 1 part per million (ppm).",
    quickInfoBullets: [
      {
        boldPrefix: "kg/m³",
        text: "is the coherent SI unit of volumetric mass density (1 kg/m³ = 1 g/L).",
      },
      {
        boldPrefix: "g/cm³ & g/mL",
        text: "are standard chemistry laboratory units anchored to liquid water (1.0 g/cm³ = 1,000 kg/m³).",
      },
      {
        boldPrefix: "lb/ft³ (pcf)",
        text: "is the US and Imperial material density unit (water ≈ 62.43 lb/ft³).",
      },
      {
        boldPrefix: "ppm & mg/L:",
        text: "Used for water quality and solution concentration (1 ppm ≈ 1 mg/L in water).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "kg_per_m3",
        title: "kg per Cubic Meter (kg/m³)",
        description:
          "Coherent SI density unit. Pure water has a density of 1,000 kg/m³.",
      },
      {
        unitId: "g_per_cm3",
        title: "Gram per Cubic Cm (g/cm³)",
        description:
          "Chemistry standard equal to 1,000 kg/m³ or 1 gram per milliliter.",
      },
      {
        unitId: "lb_per_ft3",
        title: "Pound per Cubic Foot (lb/ft³)",
        description:
          "Imperial engineering density unit equal to 16.01846 kg/m³.",
      },
    ],
  },
  torque: {
    heroBadgeClass:
      "bg-orange-50 dark:bg-orange-950/60 border-orange-200/80 dark:border-orange-800/70 text-orange-600 dark:text-orange-400",
    sidebarIconClass:
      "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400",
    primaryUnitIds: ["nm", "lb_ft", "lb_in"],
    referenceRows: [
      { description: "Bicycle stem bolt (5 N·m)", baseValueInUnit1: 5 },
      { description: "Spark plug torque (25 N·m)", baseValueInUnit1: 25 },
      { description: "100 N·m automotive wheel lug", baseValueInUnit1: 100 },
      { description: "Passenger car engine peak (250 N·m)", baseValueInUnit1: 250 },
      { description: "Heavy-duty truck diesel (1,000 N·m)", baseValueInUnit1: 1000 },
    ],
    formulaCards: [
      { label: "N·m to lb·ft", equation: "lb·ft = N·m × 0.737562" },
      { label: "lb·ft to N·m", equation: "N·m = lb·ft × 1.355818" },
      { label: "lb·ft to lb·in", equation: "lb·in = lb·ft × 12" },
    ],
    workedExampleTitle: "Example: Convert 100 Newton-meters (N·m) to Pound-feet (lb·ft)",
    workedExampleLines: ["lb·ft = 100 ÷ 1.35581795", "lb·ft = 73.756215 lb·ft"],
    workedExampleNote:
      "1 pound-foot (ft·lbf) equals 12 pound-inches (in·lbf) or approximately 1.355818 Newton-meters.",
    quickInfoBullets: [
      {
        boldPrefix: "Newton-meter (N·m)",
        text: "is the SI derived unit of rotational moment and fastener torque.",
      },
      {
        boldPrefix: "Pound-foot (lb·ft / ft·lbf)",
        text: "is the standard US automotive engine and torque wrench unit (1 lb·ft = 1.3558 N·m).",
      },
      {
        boldPrefix: "Pound-inch (lb·in)",
        text: "equals 1/12 of a pound-foot, used for smaller fasteners, electronics, and bicycles.",
      },
      {
        boldPrefix: "Kilogram-force meter (kgf·m):",
        text: "Equals 9.80665 N·m or approximately 7.233 pound-feet.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "nm",
        title: "Newton-meter (N·m)",
        description:
          "SI unit of torque resulting from a 1 Newton force applied 1 meter from the pivot.",
      },
      {
        unitId: "lb_ft",
        title: "Pound-foot (lb·ft)",
        description:
          "Imperial rotational torque unit equal to 1.355818 N·m.",
      },
      {
        unitId: "lb_in",
        title: "Pound-inch (lb·in)",
        description:
          "Equal to 1/12 of a pound-foot (0.112985 N·m).",
      },
    ],
  },
  frequency: {
    heroBadgeClass:
      "bg-pink-50 dark:bg-pink-950/60 border-pink-200/80 dark:border-pink-800/70 text-pink-600 dark:text-pink-400",
    sidebarIconClass:
      "bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400",
    primaryUnitIds: ["hertz", "megahertz", "rpm"],
    referenceRows: [
      { description: "1 Hertz (1 cycle/sec = 60 RPM)", baseValueInUnit1: 1 },
      { description: "AC utility power grid (50 Hz)", baseValueInUnit1: 50 },
      { description: "AC power grid US/Americas (60 Hz)", baseValueInUnit1: 60 },
      { description: "Concert pitch A4 note (440 Hz)", baseValueInUnit1: 440 },
      { description: "1 Kilohertz audio tone (1,000 Hz)", baseValueInUnit1: 1000 },
    ],
    formulaCards: [
      { label: "Hertz to RPM", equation: "RPM = Hz × 60" },
      { label: "MHz to Hertz", equation: "Hz = MHz × 1,000,000" },
      { label: "GHz to MHz", equation: "MHz = GHz × 1,000" },
    ],
    workedExampleTitle: "Example: Convert 60 Hertz (Hz) to Revolutions per Minute (RPM)",
    workedExampleLines: ["RPM = 60 × 60", "RPM = 3,600 RPM"],
    workedExampleNote:
      "1 Hertz equals 1 cycle per second, so multiplying Hertz by 60 gives cycles (or revolutions) per minute.",
    quickInfoBullets: [
      {
        boldPrefix: "Hertz (Hz)",
        text: "is the SI derived unit of frequency defined as 1 cycle per second (s⁻¹).",
      },
      {
        boldPrefix: "kHz, MHz & GHz",
        text: "measure audio, radio RF bands, Wi-Fi, and CPU clock rates (1 GHz = 1,000 MHz = 10⁹ Hz).",
      },
      {
        boldPrefix: "RPM (Revolutions per Minute)",
        text: "measures mechanical shaft, motor, and turbine rotation speed (60 RPM = 1 Hz).",
      },
      {
        boldPrefix: "Period T = 1 / f:",
        text: "The time period of one cycle in seconds is the reciprocal of frequency in Hertz.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "hertz",
        title: "Hertz (Hz)",
        description:
          "SI unit of frequency equal to 1 periodic cycle per second.",
      },
      {
        unitId: "megahertz",
        title: "Megahertz (MHz)",
        description:
          "Equal to 1,000,000 Hertz (1,000 kHz), used in FM radio and clock frequencies.",
      },
      {
        unitId: "rpm",
        title: "Revolutions per Min (RPM)",
        description:
          "Mechanical rotational frequency where 1 RPM equals 1/60 Hz.",
      },
    ],
  },
  angle: {
    heroBadgeClass:
      "bg-lime-50 dark:bg-lime-950/60 border-lime-200/80 dark:border-lime-800/70 text-lime-700 dark:text-lime-400",
    sidebarIconClass:
      "bg-lime-50 dark:bg-lime-950/60 text-lime-700 dark:text-lime-400",
    primaryUnitIds: ["degree", "radian", "gradian"],
    referenceRows: [
      { description: "30° acute angle (π/6 rad)", baseValueInUnit1: 30 },
      { description: "45° diagonal angle (π/4 rad)", baseValueInUnit1: 45 },
      { description: "1 Radian (~57.2958°)", baseValueInUnit1: 57.2957795 },
      { description: "90° right angle (π/2 rad)", baseValueInUnit1: 90 },
      { description: "180° straight angle (π rad)", baseValueInUnit1: 180 },
      { description: "360° full circle (2π rad)", baseValueInUnit1: 360 },
    ],
    formulaCards: [
      { label: "Degrees to Radians", equation: "rad = deg × π / 180" },
      { label: "Radians to Degrees", equation: "deg = rad × 180 / π" },
      { label: "Degrees to Gradians", equation: "grad = deg ÷ 0.9" },
    ],
    workedExampleTitle: "Example: Convert 180 Degrees to Radians",
    workedExampleLines: ["rad = 180 × (π ÷ 180)", "rad = 3.141593 rad (π rad)"],
    workedExampleNote:
      "A full circle equals 360 degrees, 2π radians (≈ 6.283185 rad), or 400 gradians (gons).",
    quickInfoBullets: [
      {
        boldPrefix: "Degree (°)",
        text: "divides a complete circle into 360 equal parts, with each degree subdivided into 60 arcminutes (′).",
      },
      {
        boldPrefix: "Radian (rad)",
        text: "is the coherent SI unit of plane angle where 1 rad = 180/π ≈ 57.29578°.",
      },
      {
        boldPrefix: "Gradian (grad / gon)",
        text: "divides a right angle into 100 grads and a full circle into 400 grads (1 grad = 0.9°).",
      },
      {
        boldPrefix: "Arcminute & Arcsecond:",
        text: "1 degree = 60 arcminutes (′) = 3,600 arcseconds (″), used in astronomy and cartography.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "degree",
        title: "Degree (°)",
        description:
          "Standard geometric angle unit equal to 1/360 of a full rotation.",
      },
      {
        unitId: "radian",
        title: "Radian (rad)",
        description:
          "SI angle subtended by an arc equal in length to the radius (~57.2958°).",
      },
      {
        unitId: "gradian",
        title: "Gradian (grad)",
        description:
          "Metric surveying angle equal to 1/400 of a circle (0.9 degrees).",
      },
    ],
  },
  fuel_economy: {
    heroBadgeClass:
      "bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200/80 dark:border-yellow-800/70 text-yellow-700 dark:text-yellow-400",
    sidebarIconClass:
      "bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400",
    primaryUnitIds: ["mpg_us", "liters_per_100km", "km_per_liter"],
    referenceRows: [
      { description: "Heavy pickup truck (15 MPG US)", baseValueInUnit1: 15 },
      { description: "Mid-size SUV (25 MPG US)", baseValueInUnit1: 25 },
      { description: "Efficient highway sedan (35 MPG US)", baseValueInUnit1: 35 },
      { description: "Hybrid vehicle (50 MPG US)", baseValueInUnit1: 50 },
      { description: "High-efficiency hybrid (60 MPG US)", baseValueInUnit1: 60 },
    ],
    formulaCards: [
      { label: "US MPG to L/100km", equation: "L/100km = 235.215 ÷ MPG" },
      { label: "US MPG to km/L", equation: "km/L = MPG × 0.425144" },
      { label: "US MPG to UK MPG", equation: "MPG(UK) = MPG(US) × 1.20095" },
    ],
    workedExampleTitle: "Example: Convert 30 MPG (US) to Liters per 100 km (L/100km)",
    workedExampleLines: ["L/100km = 235.214583 ÷ 30", "L/100km = 7.840486 L/100km"],
    workedExampleNote:
      "MPG and L/100km have an inverse (reciprocal) relationship: higher MPG means lower L/100km fuel consumption.",
    quickInfoBullets: [
      {
        boldPrefix: "MPG (US)",
        text: "measures miles traveled per US liquid gallon (3.78541 L) and is standard in the United States.",
      },
      {
        boldPrefix: "L/100km",
        text: "measures liters of fuel consumed per 100 km (lower is better), used across Europe, Canada, and Australia.",
      },
      {
        boldPrefix: "km/L",
        text: "measures kilometers traveled per liter, widely used in Japan, India, and Latin America.",
      },
      {
        boldPrefix: "MPG (UK Imperial):",
        text: "Uses the larger 4.54609 L Imperial gallon, so UK MPG values are 20.1% higher than US MPG.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "mpg_us",
        title: "Miles per Gallon (US)",
        description:
          "Distance in miles traveled per US gallon (3.785 L) of fuel.",
      },
      {
        unitId: "liters_per_100km",
        title: "Liters per 100 km (L/100km)",
        description:
          "Inverse consumption metric: 235.215 divided by US MPG.",
      },
      {
        unitId: "km_per_liter",
        title: "Kilometers per Liter (km/L)",
        description:
          "Metric distance per liter (1 km/L ≈ 2.35215 US MPG).",
      },
    ],
  },
  flow: {
    heroBadgeClass:
      "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/80 dark:border-cyan-800/70 text-cyan-600 dark:text-cyan-400",
    sidebarIconClass:
      "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
    primaryUnitIds: ["liter_per_min", "gallon_us_per_min", "cubic_foot_per_min"],
    referenceRows: [
      { description: "Bathroom faucet aerator (5 L/min)", baseValueInUnit1: 5 },
      { description: "Standard showerhead (~9.5 L/min / 2.5 GPM)", baseValueInUnit1: 9.46353 },
      { description: "Garden hose flow (20 L/min)", baseValueInUnit1: 20 },
      { description: "1 Cubic Foot per Minute (~28.32 L/min)", baseValueInUnit1: 28.31685 },
      { description: " Residential pump (100 L/min)", baseValueInUnit1: 100 },
    ],
    formulaCards: [
      { label: "L/min to US GPM", equation: "GPM = L/min ÷ 3.78541" },
      { label: "US GPM to L/min", equation: "L/min = GPM × 3.78541" },
      { label: "CFM to L/min", equation: "L/min = CFM × 28.3168" },
    ],
    workedExampleTitle: "Example: Convert 10 Liters per Minute (L/min) to US GPM",
    workedExampleLines: ["GPM = 10 ÷ 3.78541178", "GPM = 2.641721 GPM"],
    workedExampleNote:
      "1 US Gallon per Minute (GPM) equals 3.78541 L/min, and 1 Cubic Foot per Minute (CFM) equals 28.31685 L/min.",
    quickInfoBullets: [
      {
        boldPrefix: "Liters per Minute (L/min)",
        text: "is the metric standard for plumbing fixtures, hydraulic pumps, and medical oxygen flow.",
      },
      {
        boldPrefix: "US Gallons per Minute (GPM)",
        text: "is the primary US plumbing, irrigation, and fire-pump flow rate unit.",
      },
      {
        boldPrefix: "CFM (Cubic Feet per Minute)",
        text: "is used in HVAC ventilation, air compressors, and industrial blower specifications.",
      },
      {
        boldPrefix: "m³/s & m³/h:",
        text: "Used for municipal water mains, river hydrology, and chemical process engineering.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "liter_per_min",
        title: "Liters per Minute (L/min)",
        description:
          "Metric volumetric flow rate equal to 1/60 of a liter per second.",
      },
      {
        unitId: "gallon_us_per_min",
        title: "US Gallons per Min (GPM)",
        description:
          "Equal to 3.78541 liters per minute.",
      },
      {
        unitId: "cubic_foot_per_min",
        title: "Cubic Feet per Min (CFM)",
        description:
          "Airflow and gas volume rate equal to 28.31685 L/min.",
      },
    ],
  },
  current: {
    heroBadgeClass:
      "bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/70 text-amber-600 dark:text-amber-400",
    sidebarIconClass:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
    primaryUnitIds: ["ampere", "milliampere", "kiloampere"],
    referenceRows: [
      { description: "LED indicator current (0.02 A / 20 mA)", baseValueInUnit1: 0.02 },
      { description: "USB 2.0 port limit (0.5 A / 500 mA)", baseValueInUnit1: 0.5 },
      { description: "1 Ampere SI base current (1,000 mA)", baseValueInUnit1: 1 },
      { description: "Household circuit breaker (15 A)", baseValueInUnit1: 15 },
      { description: "Residential main service panel (200 A)", baseValueInUnit1: 200 },
    ],
    formulaCards: [
      { label: "Amps to Milliamps", equation: "mA = A × 1,000" },
      { label: "Milliamps to Amps", equation: "A = mA ÷ 1,000" },
      { label: "Kiloamps to Amps", equation: "A = kA × 1,000" },
    ],
    workedExampleTitle: "Example: Convert 500 Milliamperes (mA) to Amperes (A)",
    workedExampleLines: ["A = 500 ÷ 1,000", "A = 0.5 A"],
    workedExampleNote:
      "1 Ampere (A) equals 1,000 milliamperes (mA) or 1,000,000 microamperes (µA).",
    quickInfoBullets: [
      {
        boldPrefix: "Ampere (A)",
        text: "is the fundamental SI base unit of electric current (1 Coulomb of charge per second).",
      },
      {
        boldPrefix: "Milliampere (mA)",
        text: "equals 0.001 A, widely used in electronics, sensors, and low-voltage DC circuits.",
      },
      {
        boldPrefix: "Microampere (µA)",
        text: "equals 10⁻⁶ A, used to measure sleep currents in IoT devices and microcontrollers.",
      },
      {
        boldPrefix: "Kiloampere (kA):",
        text: "Equals 1,000 A, used in high-voltage power distribution and lightning surge ratings.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "ampere",
        title: "Ampere (A)",
        description:
          "Official SI base unit of electric current equal to 1,000 milliamperes.",
      },
      {
        unitId: "milliampere",
        title: "Milliampere (mA)",
        description:
          "Equal to 1/1000 of an Ampere (0.001 A).",
      },
      {
        unitId: "kiloampere",
        title: "Kiloampere (kA)",
        description:
          "Equal to 1,000 Amperes.",
      },
    ],
  },
  capacitance: {
    heroBadgeClass:
      "bg-sky-50 dark:bg-sky-950/60 border-sky-200/80 dark:border-sky-800/70 text-sky-600 dark:text-sky-400",
    sidebarIconClass:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400",
    primaryUnitIds: ["microfarad", "nanofarad", "picofarad"],
    referenceRows: [
      { description: "Ceramic RF filter capacitor (0.0001 µF / 100 pF)", baseValueInUnit1: 0.0001 },
      { description: "Decoupling capacitor (0.1 µF / 100 nF)", baseValueInUnit1: 0.1 },
      { description: "1 Microfarad benchmark (1,000 nF)", baseValueInUnit1: 1 },
      { description: "Audio crossover capacitor (10 µF)", baseValueInUnit1: 10 },
      { description: "Power supply smoothing cap (1,000 µF)", baseValueInUnit1: 1000 },
    ],
    formulaCards: [
      { label: "µF to Nanofarads", equation: "nF = µF × 1,000" },
      { label: "nF to Picofarads", equation: "pF = nF × 1,000" },
      { label: "µF to Farads", equation: "F = µF ÷ 1,000,000" },
    ],
    workedExampleTitle: "Example: Convert 0.1 Microfarads (µF) to Nanofarads (nF)",
    workedExampleLines: ["nF = 0.1 × 1,000", "nF = 100 nF (100,000 pF)"],
    workedExampleNote:
      "1 Farad = 10⁶ µF = 10⁹ nF = 10¹² pF. Each metric step (µF → nF → pF) scales by a factor of 1,000.",
    quickInfoBullets: [
      {
        boldPrefix: "Farad (F)",
        text: "is the coherent SI unit of capacitance (1 Coulomb per Volt), used for supercapacitors.",
      },
      {
        boldPrefix: "Microfarad (µF = 10⁻⁶ F)",
        text: "is the standard rating for electrolytic and film capacitors in power supplies.",
      },
      {
        boldPrefix: "Nanofarad (nF = 10⁻⁹ F)",
        text: "bridges microfarads and picofarads (1 µF = 1,000 nF).",
      },
      {
        boldPrefix: "Picofarad (pF = 10⁻¹² F):",
        text: "Used for high-frequency RF, crystal oscillators, and ceramic capacitors.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "microfarad",
        title: "Microfarad (µF)",
        description:
          "One-millionth of a Farad (10⁻⁶ F = 1,000 nF).",
      },
      {
        unitId: "nanofarad",
        title: "Nanofarad (nF)",
        description:
          "One-billionth of a Farad (10⁻⁹ F = 1,000 pF).",
      },
      {
        unitId: "picofarad",
        title: "Picofarad (pF)",
        description:
          "One-trillionth of a Farad (10⁻¹² F).",
      },
    ],
  },
  charge: {
    heroBadgeClass:
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400",
    sidebarIconClass:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    primaryUnitIds: ["milliampere_hour", "ampere_hour", "coulomb"],
    referenceRows: [
      { description: "Smartwatch battery (300 mAh)", baseValueInUnit1: 300 },
      { description: "1 Ampere-hour (1,000 mAh)", baseValueInUnit1: 1000 },
      { description: "Typical smartphone battery (4,500 mAh)", baseValueInUnit1: 4500 },
      { description: "USB power bank (10,000 mAh)", baseValueInUnit1: 10000 },
      { description: "Automotive 12V starter battery (60,000 mAh / 60 Ah)", baseValueInUnit1: 60000 },
    ],
    formulaCards: [
      { label: "mAh to Ah", equation: "Ah = mAh ÷ 1,000" },
      { label: "Ah to mAh", equation: "mAh = Ah × 1,000" },
      { label: "Ah to Coulombs", equation: "C = Ah × 3,600" },
    ],
    workedExampleTitle: "Example: Convert 5,000 mAh Battery Capacity to Ampere-hours (Ah)",
    workedExampleLines: ["Ah = 5,000 ÷ 1,000", "Ah = 5 Ah (18,000 Coulombs)"],
    workedExampleNote:
      "1 Ampere-hour (Ah) equals 1,000 milliampere-hours (mAh) or 3,600 Coulombs (C).",
    quickInfoBullets: [
      {
        boldPrefix: "Coulomb (C)",
        text: "is the coherent SI unit of electric charge transported by 1 Ampere in 1 second.",
      },
      {
        boldPrefix: "Milliampere-hour (mAh)",
        text: "is the standard rating for smartphone, laptop, and consumer lithium-ion batteries.",
      },
      {
        boldPrefix: "Ampere-hour (Ah)",
        text: "equals 1,000 mAh (3,600 C), used for automotive, solar, and marine batteries.",
      },
      {
        boldPrefix: "Charge vs. Energy:",
        text: "Multiply Ah by battery Voltage (V) to convert charge capacity into Watt-hours (Wh).",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "milliampere_hour",
        title: "Milliampere-hour (mAh)",
        description:
          "Equal to 0.001 Ah or 3.6 Coulombs.",
      },
      {
        unitId: "ampere_hour",
        title: "Ampere-hour (Ah)",
        description:
          "Equal to 1,000 mAh or 3,600 Coulombs.",
      },
      {
        unitId: "coulomb",
        title: "Coulomb (C)",
        description:
          "Coherent SI unit of electric charge (1 A·s).",
      },
    ],
  },
  resistance: {
    heroBadgeClass:
      "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-400",
    sidebarIconClass:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
    primaryUnitIds: ["ohm", "kiloohm", "megohm"],
    referenceRows: [
      { description: "Speaker voice coil impedance (8 Ω)", baseValueInUnit1: 8 },
      { description: "LED current-limiting resistor (330 Ω)", baseValueInUnit1: 330 },
      { description: "1 Kiloohm benchmark (1,000 Ω)", baseValueInUnit1: 1000 },
      { description: "Pull-up logic resistor (10,000 Ω / 10 kΩ)", baseValueInUnit1: 10000 },
      { description: "1 Megohm high-impedance input (1,000,000 Ω)", baseValueInUnit1: 1000000 },
    ],
    formulaCards: [
      { label: "kΩ to Ohms", equation: "Ω = kΩ × 1,000" },
      { label: "Ohms to kΩ", equation: "kΩ = Ω ÷ 1,000" },
      { label: "MΩ to kΩ", equation: "kΩ = MΩ × 1,000" },
    ],
    workedExampleTitle: "Example: Convert 4.7 Kiloohms (kΩ) to Ohms (Ω)",
    workedExampleLines: ["Ω = 4.7 × 1,000", "Ω = 4,700 Ω"],
    workedExampleNote:
      "By Ohm's Law (R = V / I), 1 Ohm is the electrical resistance across which 1 Volt produces 1 Ampere of current.",
    quickInfoBullets: [
      {
        boldPrefix: "Ohm (Ω)",
        text: "is the coherent SI derived unit of electrical resistance and impedance (1 V/A).",
      },
      {
        boldPrefix: "Kiloohm (kΩ = 1,000 Ω)",
        text: "is the most common range for analog and digital circuit pull-up/bias resistors.",
      },
      {
        boldPrefix: "Megohm (MΩ = 10⁶ Ω)",
        text: "measures insulation resistance and oscilloscope/multimeter input impedance.",
      },
      {
        boldPrefix: "Milliohm (mΩ = 0.001 Ω):",
        text: "Used for current-sense shunt resistors, PCB traces, and battery internal resistance.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "ohm",
        title: "Ohm (Ω)",
        description:
          "Coherent SI unit of electrical resistance (1 Volt per Ampere).",
      },
      {
        unitId: "kiloohm",
        title: "Kiloohm (kΩ)",
        description:
          "Equal to 1,000 Ohms.",
      },
      {
        unitId: "megohm",
        title: "Megohm (MΩ)",
        description:
          "Equal to 1,000,000 Ohms (1,000 kΩ).",
      },
    ],
  },
  inductance: {
    heroBadgeClass:
      "bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/70 text-purple-600 dark:text-purple-400",
    sidebarIconClass:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
    primaryUnitIds: ["millihenry", "microhenry", "henry"],
    referenceRows: [
      { description: "Buck converter power inductor (0.01 mH / 10 µH)", baseValueInUnit1: 0.01 },
      { description: "EMI filter choke (0.1 mH / 100 µH)", baseValueInUnit1: 0.1 },
      { description: "1 Millihenry benchmark (1,000 µH)", baseValueInUnit1: 1 },
      { description: "Speaker crossover coil (5 mH)", baseValueInUnit1: 5 },
      { description: "1 Henry large filter choke (1,000 mH)", baseValueInUnit1: 1000 },
    ],
    formulaCards: [
      { label: "mH to Microhenries", equation: "µH = mH × 1,000" },
      { label: "mH to Henries", equation: "H = mH ÷ 1,000" },
      { label: "µH to Nanohenries", equation: "nH = µH × 1,000" },
    ],
    workedExampleTitle: "Example: Convert 4.7 Millihenries (mH) to Microhenries (µH)",
    workedExampleLines: ["µH = 4.7 × 1,000", "µH = 4,700 µH"],
    workedExampleNote:
      "1 Henry (H) equals 1,000 millihenries (mH), 1,000,000 microhenries (µH), or 10⁹ nanohenries (nH).",
    quickInfoBullets: [
      {
        boldPrefix: "Henry (H)",
        text: "is the coherent SI unit of electrical inductance (1 Weber per Ampere).",
      },
      {
        boldPrefix: "Millihenry (mH = 10⁻³ H)",
        text: "is used for audio crossovers, power chokes, and relay solenoids.",
      },
      {
        boldPrefix: "Microhenry (µH = 10⁻⁶ H)",
        text: "is the standard range for DC-DC switching regulator inductors.",
      },
      {
        boldPrefix: "Nanohenry (nH = 10⁻⁹ H):",
        text: "Used in RF/microwave circuits and high-speed PCB trace parasitic modeling.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "millihenry",
        title: "Millihenry (mH)",
        description:
          "Equal to 0.001 Henry or 1,000 microhenries.",
      },
      {
        unitId: "microhenry",
        title: "Microhenry (µH)",
        description:
          "Equal to 10⁻⁶ Henry or 1,000 nanohenries.",
      },
      {
        unitId: "henry",
        title: "Henry (H)",
        description:
          "Coherent SI unit of electromagnetic inductance.",
      },
    ],
  },
  magnetic: {
    heroBadgeClass:
      "bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800/70 text-rose-600 dark:text-rose-400",
    sidebarIconClass:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400",
    primaryUnitIds: ["tesla", "millitesla", "gauss"],
    referenceRows: [
      { description: "Earth's magnetic field (~0.00005 T / 0.5 G)", baseValueInUnit1: 0.00005 },
      { description: "Refrigerator magnet (0.005 T / 50 G)", baseValueInUnit1: 0.005 },
      { description: "Neodymium N52 magnet surface (0.4 T / 4,000 G)", baseValueInUnit1: 0.4 },
      { description: "1 Tesla SI benchmark (10,000 Gauss)", baseValueInUnit1: 1 },
      { description: "Clinical MRI scanner (3 T / 30,000 G)", baseValueInUnit1: 3 },
    ],
    formulaCards: [
      { label: "Tesla to Gauss", equation: "G = T × 10,000" },
      { label: "Gauss to Tesla", equation: "T = G ÷ 10,000" },
      { label: "Millitesla to Gauss", equation: "G = mT × 10" },
    ],
    workedExampleTitle: "Example: Convert 1.5 Tesla (MRI Field) to Gauss (G) and Millitesla (mT)",
    workedExampleLines: [
      "G = 1.5 × 10,000 = 15,000 Gauss",
      "mT = 1.5 × 1,000 = 1,500 mT",
    ],
    workedExampleNote:
      "1 Tesla (T) equals exactly 10,000 Gauss (G) or 1,000 millitesla (mT).",
    quickInfoBullets: [
      {
        boldPrefix: "Tesla (T)",
        text: "is the coherent SI unit of magnetic flux density (1 Weber per square meter).",
      },
      {
        boldPrefix: "Gauss (G)",
        text: "is the CGS unit of magnetic induction where 10,000 Gauss = 1 Tesla (1 G = 0.1 mT).",
      },
      {
        boldPrefix: "Millitesla (mT)",
        text: "equals 0.001 Tesla or 10 Gauss, widely used for permanent magnet specifications.",
      },
      {
        boldPrefix: "Microtesla (µT):",
        text: "Equals 10⁻⁶ T (0.01 G); Earth's surface magnetic field ranges from 25 to 65 µT.",
      },
    ],
    unitComparisonCards: [
      {
        unitId: "tesla",
        title: "Tesla (T)",
        description:
          "Coherent SI unit of magnetic flux density equal to 10,000 Gauss.",
      },
      {
        unitId: "millitesla",
        title: "Millitesla (mT)",
        description:
          "Equal to 0.001 Tesla or 10 Gauss.",
      },
      {
        unitId: "gauss",
        title: "Gauss (G)",
        description:
          "CGS magnetic flux density unit equal to 0.0001 Tesla (100 µT).",
      },
    ],
  },
};

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    category: getCategoryUrlSlug(c.id),
  }));
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: rawCategoryId } = await params;
  const resolvedId =
    resolveCategoryIdFromUrlSlug(rawCategoryId) ||
    CATEGORY_ALIAS_MAP[rawCategoryId.toLowerCase()] ||
    rawCategoryId.toLowerCase();
  const category = CATEGORY_MAP.get(resolvedId);
  if (!category) return {};

  const canonicalCategoryPath = getCategoryUrl(category.id);
  const title = buildCategorySeoTitle(category.id);
  const description = buildCategorySeoDescription(category.id);

  return buildPageMetadata({
    title,
    description,
    canonicalPath: canonicalCategoryPath,
    categoryId: category.id,
    noindex: !isIndexableCategory(category.id),
    useExactTitle: true,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: rawCategoryId } = await params;
  const decodedSegment = decodeURIComponent(rawCategoryId).trim();
  const lowerId = decodedSegment.toLowerCase();

  if (lowerId === "sitemap.php" || lowerId === "sitemap.html" || lowerId === "sitemap.htm") {
    permanentRedirect("/sitemap");
  }
  if (
    lowerId === "case-converter" ||
    lowerId === "case_converter" ||
    lowerId === "case" ||
    lowerId === "case-converter.html" ||
    lowerId === "case-converter.htm"
  ) {
    permanentRedirect("/case-converter");
  }

  if (isMergedThinHub(lowerId)) {
    permanentRedirect("/specialty");
  }

  const resolvedId =
    resolveCategoryIdFromUrlSlug(lowerId) ||
    CATEGORY_ALIAS_MAP[lowerId] ||
    lowerId;
  const category = CATEGORY_MAP.get(resolvedId);

  if (!category) {
    notFound();
  }

  if (isMergedThinHub(category.id)) {
    permanentRedirect("/specialty");
  }

  const canonicalCategoryPath = getCategoryUrl(category.id);
  if (`/${decodedSegment}` !== canonicalCategoryPath) {
    permanentRedirect(canonicalCategoryPath);
  }

  const categoryId = category.id;

  const units = getUnitsByCategory(categoryId);
  const conversionPairs = getConversionsByCategory(categoryId);
  const trustedRefs = getTrustedReferencesForCategory(category.id);
  const siblingCategories = CATEGORIES.filter((c) => c.id !== category.id);

  const profile = CATEGORY_PROFILES[category.id];
  const displayName = profile?.displayName || category.name;
  const heroTitle = profile?.heroTitle || `${category.name} Converter`;
  const heroDescription =
    profile?.heroDescription ||
    `Enter a value below to convert between metric, imperial, and standard ${category.name.toLowerCase()} units.`;

  const rawDefaultFrom =
    profile?.defaultFromId || conversionPairs[0]?.fromUnitId || units[0]?.id || "";
  const rawDefaultTo =
    profile?.defaultToId ||
    conversionPairs[0]?.toUnitId ||
    units[1]?.id ||
    units[0]?.id ||
    "";
  const defaultValue = profile?.defaultValue ?? 10;

  const defaultFromUnit = UNIT_MAP.get(rawDefaultFrom) || units[0];
  const defaultToUnit = UNIT_MAP.get(rawDefaultTo) || units[1] || units[0];
  const defaultFrom = defaultFromUnit.id;
  const defaultTo = defaultToUnit.id;
  const oneOut = convertUnits(1, defaultFromUnit.id, defaultToUnit.id, "auto");

  // Curated Popular Conversions in this category (prioritize Tier A/B first)
  const tierABCategoryPairs = conversionPairs.filter((p) => getConverterTier(p) !== "C");
  const tierCCategoryPairs = conversionPairs.filter((p) => getConverterTier(p) === "C");

  const popularPairs: ConversionPairInfo[] = [];
  const seenSlugs = new Set<string>();
  for (const p of tierABCategoryPairs) {
    if (popularPairs.length >= 8) break;
    if (!seenSlugs.has(p.slug)) {
      seenSlugs.add(p.slug);
      popularPairs.push(p);
    }
  }
  if (profile?.popularSlugs) {
    for (const s of profile.popularSlugs) {
      if (popularPairs.length >= 8) break;
      const p = CATALOGUE_MAP.get(s);
      if (p && !seenSlugs.has(p.slug)) {
        seenSlugs.add(p.slug);
        popularPairs.push(p);
      }
    }
  }
  for (const p of conversionPairs) {
    if (popularPairs.length >= 8) break;
    if (!seenSlugs.has(p.slug)) {
      seenSlugs.add(p.slug);
      popularPairs.push(p);
    }
  }

  // Related Categories for Sidebar
  const relatedCategoryIds =
    profile?.relatedCategoryIds ||
    siblingCategories.slice(0, 6).map((c) => c.id);
  const sidebarRelatedCategories = relatedCategoryIds
    .map((id) => CATEGORY_MAP.get(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 6)
    .map((c) => ({
      id: c.id,
      label: `${CATEGORY_PROFILES[c.id]?.displayName || c.name} Converter`,
    }));

  // Category FAQs
  const categoryFaqs = profile?.faqs || [
    {
      question: `How do you convert ${defaultFromUnit.plural.toLowerCase()} to ${defaultToUnit.plural.toLowerCase()}?`,
      answer: `1 ${defaultFromUnit.name.toLowerCase()} (${defaultFromUnit.symbol}) equals ${
        oneOut.formattedValue
      } ${defaultToUnit.plural.toLowerCase()} (${defaultToUnit.symbol}). Multiply your ${defaultFromUnit.name.toLowerCase()} value by ${oneOut.formattedValue} or enter it in the ${heroTitle} above for instant calculation.`,
    },
    {
      question: `What is the base SI unit for ${category.name.toLowerCase()}?`,
      answer: `The primary reference unit for ${category.name.toLowerCase()} in this converter is the ${
        UNIT_MAP.get(category.baseUnitId)?.name || category.baseUnitId
      } (${UNIT_MAP.get(category.baseUnitId)?.symbol || ""}). All ${
        units.length
      } supported ${category.name.toLowerCase()} units are anchored to this standard.`,
    },
    {
      question: `Are these ${category.name.toLowerCase()} conversion factors verified?`,
      answer: `Yes, all ${category.name.toLowerCase()} conversion constants on UnitConvertersGo are verified against NIST Special Publication 811 and ISO/IEC 80000 international metrology standards.`,
    },
  ];

  // Structured Data: BreadcrumbList + TechArticle + FAQPage
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: heroTitle,
        item: `${SITE_CONFIG.baseUrl}${canonicalCategoryPath}`,
      },
    ],
  };

  const categoryArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: heroTitle,
    description: heroDescription,
    url: `${SITE_CONFIG.baseUrl}${canonicalCategoryPath}`,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
    citation: trustedRefs.map((r) => ({
      "@type": "CreativeWork",
      name: `${r.shortName} ${r.standardCode}: ${r.documentTitle}`,
      url: r.url,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categoryFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const categoryOgImg = getCategoryOgImage(category.id, heroTitle);

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: heroTitle,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: `${SITE_CONFIG.baseUrl}${canonicalCategoryPath}`,
    description: heroDescription,
    image: categoryOgImg.url,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.baseUrl}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div suppressHydrationWarning className="w-full bg-[#F7F9FC]/65 dark:bg-slate-950 min-h-screen">
      <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-9 space-y-10">
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryArticleJsonLd),
          }}
        />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* ===================================================================
            BREADCRUMBS & INLINE ANIMATED SMART SEARCH BAR
            =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumbs"
            className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 min-w-0 flex-1"
          >
            <Link
              href="/"
              prefetch={false}
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors font-medium shrink-0"
            >
              Home
            </Link>
            <ChevronRight
              className="w-3.5 h-3.5 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-[#16324F] dark:text-white font-bold truncate">
              {heroTitle}
            </span>
          </nav>

          <div className="w-full md:w-80 lg:w-96 shrink-0">
            <ToolSearchBar currentCategoryName={displayName} />
          </div>
        </div>

        {/* ===================================================================
            MODERN 2-COLUMN DASHBOARD VIEW (All 25 Categories)
            =================================================================== */}
        {category.id === "temperature" ? (
          <TemperatureCategoryView units={units} faqs={categoryFaqs} />
        ) : (
          <CategoryDashboardView
            category={category}
            displayName={displayName}
            heroTitle={heroTitle}
            heroDescription={heroDescription}
            units={units}
            defaultFromId={defaultFrom}
            defaultToId={defaultTo}
            defaultValue={defaultValue}
            popularPairs={popularPairs}
            faqs={categoryFaqs}
            relatedCategories={sidebarRelatedCategories}
            dashboardConfig={CATEGORY_DASHBOARD_CONFIGS[category.id]}
          />
        )}

        {/* ===================================================================
            COMPLETE DEDICATED CONVERSION PAIR DIRECTORY FOR THIS CATEGORY
            Tier A/B shown prominently; Tier C placed in collapsed <details>
            =================================================================== */}
        {conversionPairs.length > 0 && (
          <section
            id="all-category-converters"
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-5 scroll-mt-20"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                  Popular {displayName} Conversion Calculators
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Select any high-demand {displayName.toLowerCase()} pair below for worked examples and reference tables
                </p>
              </div>
            </div>

            {tierABCategoryPairs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {tierABCategoryPairs.map((pair) => {
                  const pFrom = UNIT_MAP.get(pair.fromUnitId);
                  const pTo = UNIT_MAP.get(pair.toUnitId);
                  const descriptiveLabel =
                    pFrom && pTo
                      ? `${pFrom.plural} to ${pTo.plural} (${pFrom.symbol} to ${pTo.symbol})`
                      : pair.title;
                  return (
                    <Link
                      key={pair.slug}
                      href={getPairUrl(pair)}
                      prefetch={false}
                      className="px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC]/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 hover:border-[#0D9488] transition-all flex items-center justify-between group"
                    >
                      <span className="text-sm sm:text-[15px] font-bold text-[#16324F] dark:text-slate-200 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] truncate pr-2">
                        {descriptiveLabel}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}

            {tierCCategoryPairs.length > 0 && (
              <details className="group rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold text-[#16324F] dark:text-slate-200">
                  <span>
                    All conversions ({tierCCategoryPairs.length} additional {displayName.toLowerCase()} pairs)
                  </span>
                  <span className="text-xs text-[#0D9488] dark:text-[#2DD4BF] group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {tierCCategoryPairs.map((pair) => {
                    const pFrom = UNIT_MAP.get(pair.fromUnitId);
                    const pTo = UNIT_MAP.get(pair.toUnitId);
                    const descriptiveLabel =
                      pFrom && pTo
                        ? `${pFrom.plural} to ${pTo.plural} (${pFrom.symbol} to ${pTo.symbol})`
                        : pair.title;
                    return (
                      <Link
                        key={pair.slug}
                        href={getPairUrl(pair)}
                        prefetch={false}
                        className="px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-800/70 bg-white dark:bg-slate-900 hover:border-[#0D9488] text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#0D9488] truncate transition-colors"
                      >
                        {descriptiveLabel}
                      </Link>
                    );
                  })}
                </div>
              </details>
            )}
          </section>
        )}

        {/* Simultaneous Comparison Matrix */}
        <section className="space-y-4">
          <CategoryMultiMatrix categoryId={category.id} />
        </section>

        {/* Complete Unit Definitions Reference */}
        <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <BookOpen className="w-5 h-5 text-[#0D9488]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
              {displayName} Unit Definitions &amp; Symbols
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950/50 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-[17px] font-bold text-[#16324F] dark:text-white">
                    {unit.name} ({unit.symbol})
                  </h3>
                  {unit.system && (
                    <span className="text-xs font-mono text-[#0D9488] dark:text-[#2DD4BF] font-semibold">
                      {unit.system.replace("_", " ").toUpperCase()}
                    </span>
                  )}
                </div>
                {unit.description && (
                  <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {unit.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Trusted Scientific Sources & Metrology Standards (E-E-A-T) */}
        <TrustedSourcesSection
          categoryId={category.id}
          categoryName={displayName}
          pageTopic={`${heroTitle} (${defaultFromUnit.symbol} to ${defaultToUnit.symbol})`}
        />

        {/* All Other Categories Hub */}
        <CategoryExplorerHub currentCategoryId={category.id} />
      </div>
    </div>
  );
}
