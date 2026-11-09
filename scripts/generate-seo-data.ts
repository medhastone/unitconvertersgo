import fs from "fs";
import path from "path";
import {
  CONVERSION_CATALOGUE,
  ensureEnrichedPair,
  findDedicatedPair,
} from "../lib/conversions/catalogue";
import { CATEGORIES, CATEGORY_MAP, UNIT_MAP, UNITS } from "../lib/conversions/units";
import { convertUnits, formatValue } from "../lib/conversions/engine";
import { getCategoryUrlSlug, getCanonicalConverterPath } from "../lib/conversions/url";
import { ConversionPairInfo, Unit } from "../lib/conversions/types";

function convertValue(val: number, fromU: Unit, toU: Unit): number {
  return convertUnits(val, fromU.id, toU.id, "auto").rawValue;
}

function formatNumber(val: number, decimals: number = 6): string {
  if (!isFinite(val)) return "—";
  if (val === 0) return "0";
  const abs = Math.abs(val);
  if (abs >= 1e9 || (abs < 1e-6 && abs > 0)) {
    return val.toExponential(4);
  }
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(val * factor) / factor;
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
}

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const COMMON_VALUES_DIR = path.join(DATA_DIR, "common-values");
const PAIR_CONTENT_DIR = path.join(DATA_DIR, "pair-content");

fs.mkdirSync(COMMON_VALUES_DIR, { recursive: true });
fs.mkdirSync(PAIR_CONTENT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// 1. Define Tier A Seed Pairs (~165 high-demand pairs across top categories)
// ---------------------------------------------------------------------------
export const TIER_A_UNIT_PAIRS: Array<[string, string]> = [
  // Length: cm/inches/feet/meters/km/miles/yards/mm both directions
  ["centimeter", "inch"],
  ["inch", "centimeter"],
  ["foot", "meter"],
  ["meter", "foot"],
  ["kilometer", "mile"],
  ["mile", "kilometer"],
  ["millimeter", "inch"],
  ["inch", "millimeter"],
  ["centimeter", "foot"],
  ["foot", "centimeter"],
  ["meter", "yard"],
  ["yard", "meter"],
  ["foot", "inch"],
  ["inch", "foot"],
  ["yard", "foot"],
  ["foot", "yard"],
  ["mile", "foot"],
  ["foot", "mile"],
  ["mile", "yard"],
  ["yard", "mile"],
  ["centimeter", "millimeter"],
  ["millimeter", "centimeter"],
  ["meter", "centimeter"],
  ["centimeter", "meter"],
  ["kilometer", "meter"],
  ["meter", "kilometer"],
  ["yard", "inch"],
  ["inch", "yard"],
  ["meter", "inch"],
  ["inch", "meter"],
  ["meter", "millimeter"],
  ["millimeter", "meter"],
  ["nautical_mile", "mile"],
  ["mile", "nautical_mile"],

  // Weight & Mass: kg/lbs/grams/ounces/stone/tons both directions
  ["kilogram", "pound"],
  ["pound", "kilogram"],
  ["gram", "ounce"],
  ["ounce", "gram"],
  ["pound", "ounce"],
  ["ounce", "pound"],
  ["kilogram", "gram"],
  ["gram", "kilogram"],
  ["stone", "pound"],
  ["pound", "stone"],
  ["stone", "kilogram"],
  ["kilogram", "stone"],
  ["milligram", "gram"],
  ["gram", "milligram"],
  ["kilogram", "metric_ton"],
  ["metric_ton", "kilogram"],
  ["pound", "us_ton"],
  ["us_ton", "pound"],
  ["us_ton", "metric_ton"],
  ["metric_ton", "us_ton"],
  ["gram", "pound"],
  ["pound", "gram"],
  ["kilogram", "ounce"],
  ["ounce", "kilogram"],
  ["troy_ounce", "gram"],
  ["gram", "troy_ounce"],
  ["carat", "gram"],
  ["microgram", "milligram"],

  // Temperature: celsius/fahrenheit/kelvin
  ["celsius", "fahrenheit"],
  ["fahrenheit", "celsius"],
  ["celsius", "kelvin"],
  ["kelvin", "celsius"],
  ["fahrenheit", "kelvin"],
  ["kelvin", "fahrenheit"],

  // Volume: liters/gallons/ml/cups/tablespoons/teaspoons/fluid ounces/pints/quarts
  ["liter", "us_gallon"],
  ["us_gallon", "liter"],
  ["milliliter", "us_fluid_ounce"],
  ["us_fluid_ounce", "milliliter"],
  ["us_cup", "milliliter"],
  ["milliliter", "us_cup"],
  ["us_cup", "us_tablespoon"],
  ["us_tablespoon", "us_cup"],
  ["us_tablespoon", "us_teaspoon"],
  ["us_teaspoon", "us_tablespoon"],
  ["us_tablespoon", "milliliter"],
  ["milliliter", "us_tablespoon"],
  ["us_teaspoon", "milliliter"],
  ["milliliter", "us_teaspoon"],
  ["us_gallon", "us_quart"],
  ["us_quart", "us_gallon"],
  ["us_quart", "us_pint"],
  ["us_pint", "us_quart"],
  ["us_pint", "us_cup"],
  ["us_cup", "us_pint"],
  ["us_cup", "us_fluid_ounce"],
  ["us_fluid_ounce", "us_cup"],
  ["liter", "milliliter"],
  ["milliliter", "liter"],
  ["liter", "us_quart"],
  ["us_quart", "liter"],
  ["us_gallon", "us_pint"],
  ["us_pint", "liter"],
  ["liter", "us_pint"],
  ["us_gallon", "us_fluid_ounce"],
  ["us_fluid_ounce", "us_tablespoon"],
  ["us_tablespoon", "us_fluid_ounce"],
  ["cubic_meter", "liter"],
  ["liter", "cubic_meter"],
  ["cubic_foot", "us_gallon"],
  ["us_gallon", "Imperial_gallon"],
  ["imperial_gallon", "us_gallon"],
  ["imperial_gallon", "liter"],
  ["liter", "imperial_gallon"],

  // Area: acres/hectares/square feet/square meters/square miles/square km
  ["sq_foot", "sq_meter"],
  ["sq_meter", "sq_foot"],
  ["acre", "sq_foot"],
  ["sq_foot", "acre"],
  ["acre", "hectare"],
  ["hectare", "acre"],
  ["hectare", "sq_meter"],
  ["sq_meter", "hectare"],
  ["sq_inch", "sq_cm"],
  ["sq_cm", "sq_inch"],
  ["sq_yard", "sq_foot"],
  ["sq_foot", "sq_yard"],
  ["sq_mile", "sq_km"],
  ["sq_km", "sq_mile"],
  ["sq_mile", "acre"],
  ["acre", "sq_mile"],
  ["sq_km", "hectare"],
  ["hectare", "sq_km"],
  ["acre", "sq_meter"],
  ["sq_meter", "sq_yard"],

  // Pressure: psi/kpa/bar/atm/pascals/torr/mmhg
  ["psi", "bar"],
  ["bar", "psi"],
  ["psi", "kilopascal"],
  ["kilopascal", "psi"],
  ["bar", "kilopascal"],
  ["kilopascal", "bar"],
  ["atmosphere", "psi"],
  ["psi", "atmosphere"],
  ["atmosphere", "bar"],
  ["bar", "atmosphere"],
  ["atmosphere", "kilopascal"],
  ["torr", "mmhg"],
  ["psi", "pascal"],
  ["pascal", "psi"],
  ["pascal", "torr"],
  ["torr", "pascal"],
  ["megapascal", "psi"],
  ["psi", "megapascal"],
  ["ksi", "psi"],
  ["psi", "ksi"],
  ["psi", "inhg"],
  ["inhg", "psi"],
  ["millibar", "hectopascal"],

  // Power: watts/horsepower/kw
  ["watt", "kilowatt"],
  ["kilowatt", "watt"],
  ["horsepower_mechanical", "kilowatt"],
  ["kilowatt", "horsepower_mechanical"],
  ["watt", "horsepower_mechanical"],
  ["horsepower_mechanical", "watt"],
  ["horsepower_metric", "horsepower_mechanical"],
  ["horsepower_mechanical", "horsepower_metric"],
  ["watt", "btu_per_hour"],
  ["btu_per_hour", "watt"],
  ["megawatt", "kilowatt"],
  ["kilowatt", "megawatt"],

  // Speed: mph/kph/knots/m-s/mach
  ["mph", "km_per_h"],
  ["km_per_h", "mph"],
  ["m_per_s", "km_per_h"],
  ["km_per_h", "m_per_s"],
  ["m_per_s", "mph"],
  ["mph", "m_per_s"],
  ["knot", "mph"],
  ["mph", "knot"],
  ["knot", "km_per_h"],
  ["km_per_h", "knot"],
  ["mach", "km_per_h"],
  ["km_per_h", "mach"],
  ["mach", "mph"],
  ["mph", "mach"],
  ["ft_per_s", "mph"],
  ["mph", "ft_per_s"],

  // Data Storage & Data Transfer: MB/GB/TB/KB/bits
  ["megabyte", "gigabyte"],
  ["gigabyte", "megabyte"],
  ["gigabyte", "terabyte"],
  ["terabyte", "gigabyte"],
  ["kilobyte", "megabyte"],
  ["megabyte", "kilobyte"],
  ["bit", "byte"],
  ["byte", "bit"],
  ["gibibyte", "gigabyte"],
  ["gigabyte", "gibibyte"],
  ["mbps", "mb_per_sec"],
  ["mb_per_sec", "mbps"],
  ["gbps", "mbps"],
  ["mbps", "gbps"],
  ["gbps", "mb_per_sec"],
  ["kbps", "mbps"],

  // Energy: joules/calories/kcal/kwh/btu
  ["joule", "kilojoule"],
  ["kilojoule", "joule"],
  ["kilocalorie", "kilojoule"],
  ["kilojoule", "kilocalorie"],
  ["watt_hour", "kilowatt_hour"],
  ["kilowatt_hour", "watt_hour"],
  ["kilowatt_hour", "megajoule"],
  ["megajoule", "kilowatt_hour"],
  ["btu", "joule"],
  ["joule", "btu"],
  ["btu", "kilojoule"],
  ["kilowatt_hour", "btu"],
  ["btu", "kilowatt_hour"],
  ["calorie", "joule"],
  ["joule", "calorie"],
  ["kilocalorie", "calorie"],
  ["calorie", "kilocalorie"],
  ["foot_pound", "joule"],
  ["joule", "foot_pound"],

  // Force: newtons/pounds-force/kgf
  ["newton", "pound_force"],
  ["pound_force", "newton"],
  ["kilonewton", "newton"],
  ["newton", "kilonewton"],
  ["kilogram_force", "newton"],
  ["newton", "kilogram_force"],
  ["kilogram_force", "pound_force"],
  ["pound_force", "kilogram_force"],
  ["kilonewton", "pound_force"],
  ["pound_force", "kilonewton"],

  // Time: hours/minutes/seconds/days/weeks
  ["hour", "minute"],
  ["minute", "hour"],
  ["minute", "second"],
  ["second", "minute"],
  ["day", "hour"],
  ["hour", "day"],
  ["week", "day"],
  ["day", "week"],
  ["hour", "second"],
  ["second", "hour"],
  ["millisecond", "second"],
  ["second", "millisecond"],
  ["year", "day"],
  ["day", "year"],
  ["month", "day"],
  ["week", "hour"],

  // Torque, Density, Angle, Frequency, Flow, Fuel Economy
  ["nm", "lb_ft"],
  ["lb_ft", "nm"],
  ["nm", "lb_in"],
  ["lb_in", "nm"],
  ["lb_ft", "lb_in"],
  ["lb_in", "lb_ft"],
  ["degree", "radian"],
  ["radian", "degree"],
  ["kg_per_m3", "g_per_cm3"],
  ["g_per_cm3", "kg_per_m3"],
  ["lb_per_ft3", "kg_per_m3"],
  ["kg_per_m3", "lb_per_ft3"],
  ["megahertz", "gigahertz"],
  ["gigahertz", "megahertz"],
  ["hertz", "kilohertz"],
  ["kilohertz", "hertz"],
  ["rpm", "hertz"],
  ["hertz", "rpm"],
  ["mpg_us", "liters_per_100km"],
  ["liters_per_100km", "mpg_us"],
  ["mpg_us", "mpg_uk"],
  ["mpg_uk", "mpg_us"],
  ["mpg_us", "km_per_liter"],
  ["km_per_liter", "mpg_us"],
  ["liter_per_min", "gallon_us_per_min"],
  ["gallon_us_per_min", "liter_per_min"],
  ["cubic_foot_per_min", "liter_per_min"],
  ["cubic_foot_per_min", "cubic_meter_per_hour"],
];

// ---------------------------------------------------------------------------
// 2. Curated Common Values per Category & Specific Overrides
// ---------------------------------------------------------------------------
const PAIR_SPECIFIC_VALUES: Record<string, number[]> = {
  "cups-to-tablespoons": [0.25, 0.333, 0.5, 0.75, 1, 1.5, 2, 3, 4],
  "tablespoons-to-cups": [1, 2, 3, 4, 6, 8, 12, 16, 24, 32],
  "cups-to-ml": [0.25, 0.333, 0.5, 0.667, 0.75, 1, 1.5, 2, 3, 4],
  "ml-to-cups": [30, 60, 80, 120, 180, 240, 360, 480, 720, 1000],
  "tablespoons-to-teaspoons": [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16],
  "teaspoons-to-tablespoons": [1, 1.5, 2, 3, 4.5, 6, 9, 12, 15, 18],
  "tablespoons-to-ml": [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
  "teaspoons-to-ml": [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6],
  "psi-to-kpa": [14.7, 28, 30, 32, 35, 40, 50, 60, 80, 100],
  "kpa-to-psi": [100, 150, 200, 220, 240, 250, 300, 400, 500, 700],
  "psi-to-bar": [14.5, 14.7, 28, 30, 32, 35, 40, 50, 60, 100],
  "bar-to-psi": [0.5, 1, 1.5, 2, 2.2, 2.5, 3, 4, 5, 8, 10],
  "celsius-to-fahrenheit": [-40, -18, 0, 10, 20, 25, 30, 37, 100, 180, 200],
  "fahrenheit-to-celsius": [-40, 0, 32, 50, 68, 72, 98.6, 100, 212, 350, 400],
  "celsius-to-kelvin": [-273.15, -196, -78.5, 0, 20, 25, 37, 100, 300, 1000],
  "kelvin-to-celsius": [0, 77, 195, 273.15, 293.15, 298.15, 310.15, 373.15, 500, 1000],
  "watts-to-horsepower": [100, 250, 500, 745.7, 1000, 1500, 2000, 5000, 10000, 50000],
  "horsepower-to-watts": [0.25, 0.5, 1, 1.5, 2, 5, 10, 50, 100, 250],
  "hp-to-kw": [1, 5, 10, 25, 50, 100, 150, 200, 300, 500],
  "kw-to-hp": [1, 2, 5, 10, 20, 50, 75, 100, 150, 250],
  "kg-to-lbs": [1, 2, 5, 10, 20, 25, 50, 60, 70, 80, 100],
  "lbs-to-kg": [1, 5, 10, 25, 45, 50, 100, 135, 150, 180, 200],
  "kg-to-grams": [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 5, 10],
  "grams-to-kg": [100, 250, 500, 750, 1000, 1500, 2000, 2500, 5000, 10000],
  "grams-to-ounces": [10, 25, 28.35, 50, 100, 150, 200, 250, 453.6, 500],
  "ounces-to-grams": [0.5, 1, 2, 4, 6, 8, 10, 12, 16, 32],
  "cm-to-inches": [1, 2.54, 5, 10, 15, 20, 30, 50, 100, 150, 180],
  "inches-to-cm": [1, 2, 4, 6, 10, 12, 18, 24, 36, 48, 72],
  "feet-to-meters": [1, 3, 5, 6, 8, 10, 12, 15, 20, 50, 100],
  "meters-to-feet": [1, 1.5, 1.8, 2, 3, 5, 10, 20, 50, 100],
  "km-to-miles": [1, 3, 5, 10, 15, 21.1, 42.2, 50, 80, 100, 160],
  "miles-to-km": [1, 3.1, 5, 6.2, 10, 13.1, 26.2, 50, 60, 70, 100],
  "miles-to-yards": [0.25, 0.5, 1, 1.5, 2, 3, 5, 10, 13.1, 26.2],
  "acres-to-hectares": [0.5, 1, 2, 5, 10, 20, 40, 80, 100, 640],
  "hectares-to-acres": [0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500],
  "mach-to-kph": [0.5, 0.8, 0.85, 1, 1.2, 1.5, 2, 2.5, 3, 5],
  "kph-to-mach": [300, 500, 800, 900, 1000, 1234.8, 1500, 2000, 2500, 3500],
  "ksi-to-psi": [1, 2, 5, 10, 20, 36, 50, 60, 80, 100],
  "psi-to-ksi": [1000, 2500, 5000, 10000, 20000, 36000, 50000, 60000, 80000, 100000],
  "pascals-to-torr": [10, 50, 100, 133.32, 500, 1000, 5000, 10000, 50000, 101325],
  "torr-to-pascals": [0.1, 1, 5, 10, 25, 50, 100, 250, 500, 760],
  "us-tons-to-metric-tons": [0.5, 1, 2, 5, 10, 20, 25, 40, 50, 100],
  "metric-tons-to-us-tons": [0.5, 1, 2, 5, 10, 20, 25, 40, 50, 100],
  "mpg-to-l-100km": [15, 20, 25, 30, 35, 40, 45, 50, 60, 75],
  "l-100km-to-mpg": [3, 4, 5, 6, 7, 8, 9, 10, 12, 15],
};

function getCuratedValuesForUnit(unitId: string, categoryId: string): number[] {
  switch (unitId) {
    case "us_cup":
    case "imperial_cup":
    case "metric_cup":
      return [0.25, 0.333, 0.5, 0.667, 0.75, 1, 1.5, 2, 3, 4];
    case "us_tablespoon":
    case "us_teaspoon":
      return [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16];
    case "us_fluid_ounce":
    case "imperial_fluid_ounce":
      return [1, 2, 4, 6, 8, 12, 16, 20, 24, 32];
    case "milliliter":
      return [5, 15, 30, 60, 100, 120, 240, 250, 500, 1000];
    case "liter":
      return [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10, 20];
    case "us_gallon":
    case "imperial_gallon":
      return [0.5, 1, 2, 3, 5, 10, 15, 20, 30, 50];
    case "psi":
      return [14.7, 28, 30, 32, 35, 40, 50, 60, 80, 100];
    case "bar":
    case "atmosphere":
      return [0.5, 1, 1.5, 2, 2.2, 2.5, 3, 4, 5, 10];
    case "kilopascal":
      return [50, 100, 101.325, 150, 200, 220, 240, 250, 300, 500];
    case "pascal":
      return [10, 50, 100, 133.32, 500, 1000, 5000, 10000, 50000, 101325];
    case "celsius":
      return [-40, -18, 0, 10, 20, 25, 30, 37, 100, 180];
    case "fahrenheit":
      return [-40, 0, 32, 50, 68, 72, 98.6, 100, 212, 350];
    case "kelvin":
      return [0, 77, 195, 273.15, 293.15, 298.15, 310.15, 373.15, 500, 1000];
    case "inch":
      return [1, 2, 4, 6, 8, 12, 18, 24, 36, 48];
    case "foot":
      return [1, 3, 5, 6, 8, 10, 12, 15, 20, 50];
    case "yard":
      return [1, 2, 5, 10, 25, 50, 100, 200, 440, 1760];
    case "centimeter":
      return [1, 2.54, 5, 10, 15, 20, 30, 50, 100, 180];
    case "millimeter":
      return [1, 2, 5, 10, 12.7, 25.4, 50, 100, 250, 1000];
    case "meter":
      return [0.5, 1, 1.5, 2, 3, 5, 10, 25, 50, 100];
    case "kilometer":
    case "mile":
      return [1, 3, 5, 10, 15, 21.1, 42.2, 50, 80, 100];
    case "kilogram":
      return [0.5, 1, 2, 5, 10, 20, 25, 50, 75, 100];
    case "pound":
      return [1, 2, 5, 10, 25, 45, 50, 100, 150, 200];
    case "gram":
      return [5, 10, 28.35, 50, 100, 200, 250, 453.6, 500, 1000];
    case "ounce":
      return [0.5, 1, 2, 4, 6, 8, 12, 16, 24, 32];
    case "stone":
      return [5, 8, 9, 10, 11, 12, 13, 14, 15, 20];
    case "watt":
      return [15, 60, 100, 250, 500, 745.7, 1000, 1500, 2000, 5000];
    case "kilowatt":
    case "horsepower":
      return [0.5, 1, 2, 5, 10, 25, 50, 100, 200, 500];
    case "mph":
    case "kph":
    case "knot":
      return [5, 10, 25, 35, 50, 60, 70, 80, 100, 120];
    case "mach":
      return [0.5, 0.8, 0.85, 1, 1.2, 1.5, 2, 2.5, 3, 5];
    case "byte":
    case "kilobyte":
    case "megabyte":
    case "gigabyte":
    case "terabyte":
      return [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1000, 1024];
    case "second":
    case "minute":
      return [1, 5, 10, 15, 30, 45, 60, 90, 120, 180];
    case "hour":
      return [1, 2, 4, 6, 8, 12, 16, 24, 36, 48, 72, 168];
    case "day":
      return [1, 2, 3, 5, 7, 10, 14, 21, 30, 60, 90, 365];
    default:
      break;
  }

  switch (categoryId) {
    case "area":
      return [0.25, 0.5, 1, 2, 5, 10, 25, 50, 100, 500];
    case "energy":
      return [10, 50, 100, 250, 500, 1000, 2000, 3600, 5000, 10000];
    case "force":
    case "torque":
      return [1, 5, 10, 25, 50, 75, 100, 150, 250, 500];
    case "angle":
      return [15, 30, 45, 60, 90, 120, 135, 180, 270, 360];
    case "fuel_economy":
      return [5, 8, 10, 15, 20, 25, 30, 40, 50, 60];
    default:
      return [0.5, 1, 2, 5, 10, 20, 25, 50, 75, 100];
  }
}

for (const cat of CATEGORIES) {
  const catSlug = getCategoryUrlSlug(cat.id);
  const catUnits = UNITS.filter((u) => u.categoryId === cat.id);
  const unitDefaults: Record<string, number[]> = {};
  for (const u of catUnits) {
    unitDefaults[u.id] = getCuratedValuesForUnit(u.id, cat.id);
  }
  const pairOverrides: Record<string, number[]> = {};
  for (const [slug, vals] of Object.entries(PAIR_SPECIFIC_VALUES)) {
    const p = CONVERSION_CATALOGUE.find((item) => item.slug === slug);
    if (p && p.categoryId === cat.id) {
      pairOverrides[slug] = vals;
    }
  }
  const payload = {
    category: catSlug,
    categoryId: cat.id,
    defaultValues: getCuratedValuesForUnit("", cat.id),
    unitDefaults,
    pairOverrides,
  };
  fs.writeFileSync(
    path.join(COMMON_VALUES_DIR, `${catSlug}.json`),
    JSON.stringify(payload, null, 2)
  );
}

// Also write cooking.json
fs.writeFileSync(
  path.join(COMMON_VALUES_DIR, "cooking.json"),
  JSON.stringify(
    {
      category: "cooking",
      categoryId: "cooking",
      defaultValues: [0.25, 0.333, 0.5, 0.75, 1, 1.5, 2, 3, 4],
      pairOverrides: {
        "cups-to-grams": [0.25, 0.333, 0.5, 0.667, 0.75, 1, 1.5, 2, 3, 4],
        "grams-to-cups": [25, 50, 75, 100, 120, 150, 200, 250, 300, 500],
        "tablespoons-to-grams": [0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 12],
        "teaspoons-to-grams": [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8],
        "ounces-to-grams": [0.5, 1, 2, 4, 6, 8, 10, 12, 16, 32],
        "grams-to-ounces": [15, 28.35, 50, 100, 150, 200, 250, 350, 453.6, 500],
        "ml-to-grams": [15, 30, 60, 100, 120, 180, 240, 250, 500, 1000],
        "grams-to-ml": [15, 30, 50, 100, 125, 200, 250, 350, 500, 1000],
      },
    },
    null,
    2
  )
);

// ---------------------------------------------------------------------------
// 3. Helper for Relevant Guide per Category / Pair
// ---------------------------------------------------------------------------
function getGuideForPair(pair: ConversionPairInfo, fromUnit: Unit, toUnit: Unit): { title: string; href: string } {
  if (pair.categoryId === "temperature") {
    return {
      title: "Celsius vs. Fahrenheit vs. Kelvin Temperature Scales Guide",
      href: "/guides/temperature-scales-explained",
    };
  }
  if (pair.categoryId === "pressure") {
    return {
      title: "PSI vs. Bar vs. kPa vs. Atmosphere Pressure Reference",
      href: "/guides/pressure-units-psi-bar-kpa-explained",
    };
  }
  if (pair.categoryId === "data" || pair.categoryId === "data_rate") {
    return {
      title: "Decimal (GB) vs. Binary (GiB) Data Storage Guide",
      href: "/guides/decimal-vs-binary-data-storage",
    };
  }
  if (pair.categoryId === "fuel_economy") {
    return {
      title: "US MPG vs. UK Imperial MPG vs. L/100km Fuel Economy Guide",
      href: "/guides/us-vs-uk-mpg-fuel-economy",
    };
  }
  if (pair.categoryId === "volume" || pair.categoryId === "flow") {
    return {
      title: "US Customary vs. British Imperial Fluid Units Explained",
      href: "/guides/us-vs-imperial-fluid-ounces",
    };
  }
  if (
    fromUnit.id.includes("troy") ||
    toUnit.id.includes("troy") ||
    fromUnit.id === "ounce" ||
    toUnit.id === "ounce" ||
    fromUnit.id === "carat" ||
    toUnit.id === "carat"
  ) {
    return {
      title: "Troy Ounces vs. Regular Avoirdupois Ounces Weight Guide",
      href: "/guides/avoirdupois-vs-troy-weight",
    };
  }
  return {
    title: "The Comprehensive Metric to Imperial Conversion Guide",
    href: "/guides/metric-to-imperial",
  };
}

// ---------------------------------------------------------------------------
// 4. Genuine Edge Case Detector (returns null when no real edge case exists)
// ---------------------------------------------------------------------------
function getMistakesAndEdgeCases(pair: ConversionPairInfo, fromU: Unit, toU: Unit): {
  title: string;
  items: string[];
} | null {
  const ids = [fromU.id, toU.id];

  // Temperature offset vs interval trap
  if (pair.categoryId === "temperature") {
    return {
      title: "Temperature Offset vs. Temperature Interval Trap",
      items: [
        `Converting a specific thermometer reading between ${fromU.name} (${fromU.symbol}) and ${toU.name} (${toU.symbol}) requires applying the zero-point offset (+32 or +273.15). However, when converting a temperature change or difference (ΔT, such as a 10° rise), you must use only the scale ratio (1 °C = 1.8 °F = 1 K) without adding the offset.`,
        `Remember that -40 °C and -40 °F are the exact crossover point where both relative scales read the same value.`,
      ],
    };
  }

  // US vs UK Imperial fluid volume
  if (
    ids.some((id) =>
      [
        "us_gallon",
        "imperial_gallon",
        "us_quart",
        "imperial_quart",
        "us_pint",
        "imperial_pint",
        "us_cup",
        "imperial_cup",
        "us_fluid_ounce",
        "imperial_fluid_ounce",
        "us_tablespoon",
        "us_teaspoon",
        "gallon_us_per_min",
        "mpg_us",
        "mpg_uk",
      ].includes(id)
    )
  ) {
    return {
      title: "US Customary vs. British Imperial Liquid Volume Trap",
      items: [
        `US Customary and UK Imperial liquid units share identical names but have different physical volumes: 1 US Gallon is 3.78541 L (128 US fl oz), whereas 1 UK Imperial Gallon is 4.54609 L (160 Imp fl oz) — a 20.1% difference.`,
        `Similarly, 1 US Pint contains 16 US fluid ounces (473.18 mL), while 1 British Imperial Pint contains 20 Imperial fluid ounces (568.26 mL). Always verify whether your recipe, pump datasheet, or vehicle spec sheet uses US or UK standards.`,
      ],
    };
  }

  // Tons: US Short Ton vs UK Long Ton vs Metric Tonne
  if (ids.some((id) => ["us_ton", "imperial_ton", "metric_ton"].includes(id))) {
    return {
      title: "Short Ton (US) vs. Metric Tonne (t) vs. Long Ton (UK)",
      items: [
        `Three distinct units are called a "ton": the US Short Ton equals 2,000 lbs (907.185 kg), the Metric Tonne (t) equals 1,000 kg (2,204.62 lbs), and the British Imperial Long Ton equals 2,240 lbs (1,016.05 kg).`,
        `Confusing US short tons with metric tonnes introduces a 10.2% freight weight error on international bills of lading.`,
      ],
    };
  }

  // Ounces: Avoirdupois vs Troy vs Fluid
  if (ids.some((id) => ["ounce", "troy_ounce"].includes(id))) {
    return {
      title: "Avoirdupois Ounces (oz) vs. Precious Metal Troy Ounces (oz t) vs. Fluid Ounces (fl oz)",
      items: [
        `Standard grocery and postal scales use the Avoirdupois ounce (1 oz = 28.349523125 g). Gold, silver, and platinum bullion use the Troy ounce (1 oz t = 31.1034768 g), which is 9.7% heavier.`,
        `Never confuse dry weight ounces (oz) with liquid volume fluid ounces (fl oz); they only match numerically for pure water at standard density.`,
      ],
    };
  }

  // Data Storage & Transfer: Decimal SI (1000) vs Binary IEC (1024) and Bits vs Bytes
  if (pair.categoryId === "data" || pair.categoryId === "data_rate") {
    return {
      title: "Decimal SI (1,000) vs. Binary IEC (1,024) & Bits vs. Bytes",
      items: [
        `SI decimal prefixes (KB, MB, GB, TB) scale by powers of 1,000 (10³), whereas IEC binary prefixes (KiB, MiB, GiB, TiB) scale by powers of 1,024 (2¹⁰). A 1 TB SSD (10¹² bytes) reports as 931.32 GiB in operating systems that use binary division.`,
        `In networking, speeds are quoted in megabits or gigabits per second (Mbps / Gbps), whereas file transfers show megabytes per second (MB/s). Because 1 Byte = 8 bits, divide Mbps by 8 to find theoretical maximum MB/s.`,
      ],
    };
  }

  // Pressure: Gauge (psig) vs Absolute (psia)
  if (pair.categoryId === "pressure") {
    return {
      title: "Gauge Pressure (psig) vs. Absolute Pressure (psia)",
      items: [
        `This converter scales pressure magnitude directly between ${fromU.symbol} and ${toU.symbol}. In automotive tires, HVAC, and compressed air systems, gauges display Gauge Pressure (referenced to ambient atmospheric pressure, ~14.696 psi or 101.325 kPa at sea level).`,
        `For thermodynamic gas laws (PV = nRT) or vacuum chamber calculations, convert gauge pressure to absolute pressure by adding local barometric pressure before scaling.`,
      ],
    };
  }

  // Power: Mechanical HP vs Metric HP (PS)
  if (ids.some((id) => ["horsepower", "metric_horsepower"].includes(id))) {
    return {
      title: "Mechanical Imperial Horsepower (hp) vs. Metric Horsepower (PS / cv)",
      items: [
        `One Imperial/US mechanical horsepower (550 ft·lbf/s) equals 745.699872 Watts, whereas one European metric horsepower (PS or cv, defined as 75 kgf·m/s) equals 735.49875 Watts — a 1.39% difference.`,
        `A 300 PS European engine specification corresponds to 295.9 mechanical bhp under SAE/imperial standards.`,
      ],
    };
  }

  // Energy: Food Kilocalories (Cal) vs Thermochemical gram calories (cal)
  if (ids.some((id) => ["calorie", "kilocalorie"].includes(id))) {
    return {
      title: "Dietary Calories (kcal) vs. Chemistry Gram Calories (cal)",
      items: [
        `On nutrition labels, a capitalized "Calorie" (Cal) is actually 1 kilocalorie (1,000 small gram calories = 4,184 Joules).`,
        `In physics and chemistry lab equations, 1 small calorie (cal) is the energy required to warm 1 gram of water by 1 °C (4.184 J). Always check whether your source means dietary kcal or thermochemical cal.`,
      ],
    };
  }

  // Speed: Mach altitude dependence
  if (ids.includes("mach")) {
    return {
      title: "Speed of Sound (Mach) Temperature & Altitude Dependence",
      items: [
        `Standard Mach conversions use the ICAO International Standard Atmosphere sea-level speed of sound at 15 °C (59 °F): Mach 1 = 340.29 m/s = 1,225.04 km/h (or 343 m/s = 1,234.8 km/h at 20 °C dry air).`,
        `At commercial jet cruising altitude (35,000 ft / 10,668 m, where ambient air is -54 °C), the local speed of sound drops to ~295 m/s (1,062 km/h).`,
      ],
    };
  }

  // Metric vs Imperial irrational / multi-decimal rounding error
  if (fromU.system !== toU.system && Math.abs((fromU.toBase || 1) / (toU.toBase || 1) - Math.round((fromU.toBase || 1) / (toU.toBase || 1))) > 1e-6) {
    const exactFactor = convertValue(1, fromU, toU);
    return {
      title: "Exact NIST Factor vs. Early Rounding Drift",
      items: [
        `The exact conversion factor from ${fromU.name} to ${toU.name} is ${formatNumber(exactFactor, 8)}, derived from the 1959 International Yard and Pound Agreement (1 inch = 25.4 mm, 1 lb = 0.45359237 kg).`,
        `In structural engineering, CNC machining, or bulk inventory totals, rounding the multiplier to 2 decimal places too early can introduce cumulative tolerance errors; always compute with the full factor and round only the final displayed figure.`,
      ],
    };
  }

  // No special edge case -> omit rather than writing filler!
  return null;
}

// ---------------------------------------------------------------------------
// 5. Generate Pair-Specific Content JSON for all Tier A Pairs
// ---------------------------------------------------------------------------
function buildPairIntro(pair: ConversionPairInfo, fromU: Unit, toU: Unit, catName: string): string {
  const oneTo = convertValue(1, fromU, toU);
  const oneRev = convertValue(1, toU, fromU);
  const factorStr = formatNumber(oneTo, 6);
  const revFactorStr = formatNumber(oneRev, 6);

  const domainUseCases: Record<string, string> = {
    length: `architectural blueprints, international manufacturing tolerances, athletic track distances, and hardware sizing`,
    weight: `international freight logistics, kitchen recipe scaling, athletic weight classes, and laboratory formulation`,
    temperature: `meteorological weather reports, culinary oven calibration, HVAC setpoints, and clinical thermometry`,
    volume: `culinary recipe scaling, beverage bottling, laboratory reagent preparation, and fluid tank capacity sizing`,
    area: `real estate property deeds, agricultural land surveying, commercial floor plan leases, and civil zoning`,
    speed: `automotive speedometer readings, aviation airspeed navigation, maritime chart plotting, and meteorology`,
    time: `project scheduling, payroll timecards, scientific interval logging, and server uptime SLAs`,
    pressure: `automotive tire inflation placards, hydraulic cylinder design, scuba diving tanks, and barometric weather tracking`,
    energy: `residential electricity billing, HVAC heating load calculations, battery storage sizing, and nutritional energy tracking`,
    power: `automotive engine output ratings, electric motor sizing, solar inverter specifications, and appliance load planning`,
    data: `SSD and hard drive capacity verification, cloud storage provisioning, and database memory allocation`,
    data_rate: `fiber broadband speed testing, network throughput provisioning, and video streaming bitrate calculation`,
    force: `structural beam load analysis, fastener tensile testing, aerospace thrust ratings, and mechanical engineering`,
    torque: `automotive lug nut torque wrench settings, engine dynamometer curves, and industrial fastener specifications`,
    density: `materials science specifications, concrete and soil compaction testing, chemical solution density, and buoyancy calculations`,
    angle: `CNC rotary indexing, optical alignment, trigonometric engineering, and surveying bearings`,
    frequency: `processor clock speeds, RF wireless spectrum allocation, audio signal processing, and rotational machinery RPM`,
    flow: `pump selection, municipal water pipe sizing, HVAC airflow balancing, and welding shielding gas regulation`,
    fuel_economy: `comparing North American EPA window stickers against European WLTP and UK vehicle fuel consumption figures`,
  };

  const contextPhrase =
    domainUseCases[pair.categoryId] ||
    `engineering specifications, international trade documentation, and technical measurements`;

  return `Professionals and everyday users convert ${fromU.plural.toLowerCase()} (${fromU.symbol}) to ${toU.plural.toLowerCase()} (${toU.symbol}) when working across ${fromU.system} and ${toU.system} standards in ${contextPhrase}. One ${fromU.name.toLowerCase()} equals ${factorStr} ${toU.plural.toLowerCase()}, while 1 ${toU.name.toLowerCase()} equals ${revFactorStr} ${fromU.plural.toLowerCase()}. Whether you are verifying ${catName.toLowerCase()} specifications on imported equipment, cross-checking technical datasheets, or scaling practical measurements, this converter applies the exact NIST SP 811 and ISO 80000 reference relationship with instant precision.`;
}

function buildWorkedExamples(
  pair: ConversionPairInfo,
  fromU: Unit,
  toU: Unit,
  commonValues: number[]
): Array<{
  title: string;
  scenario: string;
  inputValue: number;
  outputValue: string;
  stepByStep: string;
}> {
  const sampleInputs = [
    commonValues[Math.min(2, commonValues.length - 1)] || 1,
    commonValues[Math.min(5, commonValues.length - 1)] || 10,
    commonValues[Math.min(8, commonValues.length - 1)] || 50,
  ];

  const oneTo = convertValue(1, fromU, toU);
  const factorExact = formatNumber(oneTo, 6);

  return sampleInputs.map((val, idx) => {
    const out = convertValue(val, fromU, toU);
    const outExact = formatNumber(out, 6);
    const outRounded = formatNumber(out, 2);

    let stepByStep = `${val} ${fromU.symbol} × ${factorExact} = ${outExact} ${toU.symbol} (rounds to ${outRounded} ${toU.symbol}).`;
    if (pair.categoryId === "temperature") {
      if (fromU.id === "celsius" && toU.id === "fahrenheit") {
        stepByStep = `(${val} °C × 9/5) + 32 = ${formatNumber(val * 1.8, 4)} + 32 = ${outExact} °F.`;
      } else if (fromU.id === "fahrenheit" && toU.id === "celsius") {
        stepByStep = `(${val} °F − 32) × 5/9 = ${formatNumber(val - 32, 4)} × 5/9 = ${outExact} °C.`;
      } else {
        stepByStep = `Apply the thermodynamic offset formula to ${val} ${fromU.symbol} to obtain ${outExact} ${toU.symbol}.`;
      }
    } else if (
      pair.categoryId === "fuel_economy" &&
      (fromU.id === "liters_per_100km" || toU.id === "liters_per_100km")
    ) {
      stepByStep = `Apply the inverse consumption formula to ${val} ${fromU.symbol} to obtain ${outExact} ${toU.symbol} (${outRounded} ${toU.symbol}).`;
    }

    const labels = [
      `Standard ${fromU.name} Benchmark (${val} ${fromU.symbol})`,
      `Practical Mid-Range Conversion (${val} ${fromU.symbol})`,
      `Higher-Capacity Specification (${val} ${fromU.symbol})`,
    ];

    return {
      title: labels[idx],
      scenario: `Convert ${val} ${fromU.plural.toLowerCase()} (${fromU.symbol}) into ${toU.plural.toLowerCase()} (${toU.symbol}) for technical comparison and documentation.`,
      inputValue: val,
      outputValue: `${outExact} ${toU.symbol}`,
      stepByStep,
    };
  });
}

// Resolve all Tier A pairs in CONVERSION_CATALOGUE
const tierASlugs = new Set<string>();
const tierAPairs: ConversionPairInfo[] = [];

for (const [fId, tId] of TIER_A_UNIT_PAIRS) {
  const found = findDedicatedPair(fId.trim(), tId.trim());
  if (found && !tierASlugs.has(found.slug)) {
    tierASlugs.add(found.slug);
    tierAPairs.push(ensureEnrichedPair(found));
  }
}

console.log(`Resolved ${tierAPairs.length} Tier A converter pairs.`);

for (const pair of tierAPairs) {
  const fromU = UNIT_MAP.get(pair.fromUnitId)!;
  const toU = UNIT_MAP.get(pair.toUnitId)!;
  const cat = CATEGORY_MAP.get(pair.categoryId)!;
  const catSlug = getCategoryUrlSlug(pair.categoryId);

  const commonValues =
    PAIR_SPECIFIC_VALUES[pair.slug] ||
    getCuratedValuesForUnit(fromU.id, pair.categoryId);

  const oneTo = convertValue(1, fromU, toU);
  const oneRev = convertValue(1, toU, fromU);
  const exactFactor = formatNumber(oneTo, 8);
  const roundedFactor = formatNumber(oneTo, 4);
  const inverseFactor = formatNumber(oneRev, 6);

  let formulaEquation = `${toU.symbol} = ${fromU.symbol} × ${exactFactor}`;
  if (pair.categoryId === "temperature") {
    if (fromU.id === "celsius" && toU.id === "fahrenheit") {
      formulaEquation = "°F = (°C × 9/5) + 32";
    } else if (fromU.id === "fahrenheit" && toU.id === "celsius") {
      formulaEquation = "°C = (°F − 32) × 5/9";
    } else if (fromU.id === "celsius" && toU.id === "kelvin") {
      formulaEquation = "K = °C + 273.15";
    } else if (fromU.id === "kelvin" && toU.id === "celsius") {
      formulaEquation = "°C = K − 273.15";
    } else if (fromU.id === "fahrenheit" && toU.id === "kelvin") {
      formulaEquation = "K = (°F − 32) × 5/9 + 273.15";
    } else if (fromU.id === "kelvin" && toU.id === "fahrenheit") {
      formulaEquation = "°F = (K − 273.15) × 9/5 + 32";
    }
  } else if (
    pair.categoryId === "fuel_economy" &&
    ((fromU.id === "mpg_us" && toU.id === "liters_per_100km") ||
      (fromU.id === "liters_per_100km" && toU.id === "mpg_us"))
  ) {
    formulaEquation = `${toU.symbol} = 235.214583 ÷ ${fromU.symbol}`;
  }

  // Reverse link
  const reversePair = findDedicatedPair(pair.toUnitId, pair.fromUnitId);
  const reverseLink = reversePair
    ? {
        label: `${toU.plural} to ${fromU.plural} (${toU.symbol} to ${fromU.symbol})`,
        href: getCanonicalConverterPath(reversePair.categoryId, reversePair.slug),
        type: "reverse",
      }
    : null;

  // 3-4 Related converters in same category (prefer Tier A, fallback to category pairs so length is always >= 3)
  const relatedCandidates = [
    ...tierAPairs.filter(
      (p) =>
        p.categoryId === pair.categoryId &&
        p.slug !== pair.slug &&
        p.slug !== reversePair?.slug
    ),
    ...CONVERSION_CATALOGUE.filter(
      (p) =>
        p.categoryId === pair.categoryId &&
        p.slug !== pair.slug &&
        p.slug !== reversePair?.slug &&
        !tierASlugs.has(p.slug)
    ),
  ].slice(0, 4);

  const relatedInCategory = relatedCandidates.map((p) => {
    const rf = UNIT_MAP.get(p.fromUnitId)!;
    const rt = UNIT_MAP.get(p.toUnitId)!;
    return {
      label: `${rf.plural} to ${rt.plural} (${rf.symbol} to ${rt.symbol})`,
      href: getCanonicalConverterPath(p.categoryId, p.slug),
      type: "related",
    };
  });

  const hubHref = catSlug === "fuel-consumption" ? "/specialty" : `/${catSlug}`;
  const guide = getGuideForPair(pair, fromU, toU);

  const internalLinks = [
    ...(reverseLink ? [reverseLink] : []),
    ...relatedInCategory,
    {
      label: `${cat.name} Conversions Hub`,
      href: hubHref,
      type: "hub",
    },
    {
      label: guide.title,
      href: guide.href,
      type: "guide",
    },
  ];

  const intro = buildPairIntro(pair, fromU, toU, cat.name);
  const workedExamples = buildWorkedExamples(pair, fromU, toU, commonValues);
  const mistakesAndEdgeCases = getMistakesAndEdgeCases(pair, fromU, toU);

  const sampleVal = commonValues[Math.min(4, commonValues.length - 1)] || 10;
  const sampleOut = formatNumber(convertValue(sampleVal, fromU, toU), 4);

  const faqs = [
    {
      question: `How many ${toU.plural.toLowerCase()} (${toU.symbol}) are in 1 ${fromU.name.toLowerCase()} (${fromU.symbol})?`,
      answer: `There are ${exactFactor} ${toU.plural.toLowerCase()} (${toU.symbol}) in 1 ${fromU.name.toLowerCase()} (${fromU.symbol}), which rounds to ${roundedFactor} ${toU.symbol} for everyday calculations. Conversely, 1 ${toU.name.toLowerCase()} equals ${inverseFactor} ${fromU.plural.toLowerCase()}.`,
    },
    {
      question: `How do I convert ${fromU.plural.toLowerCase()} to ${toU.plural.toLowerCase()} (${fromU.symbol} to ${toU.symbol})?`,
      answer: `To convert ${fromU.plural.toLowerCase()} to ${toU.plural.toLowerCase()}, use the formula: ${formulaEquation}. For example, converting ${sampleVal} ${fromU.symbol} gives ${sampleOut} ${toU.symbol}.`,
    },
    {
      question: `What is ${sampleVal} ${fromU.plural.toLowerCase()} in ${toU.plural.toLowerCase()}?`,
      answer: `${sampleVal} ${fromU.plural.toLowerCase()} (${fromU.symbol}) equals exactly ${sampleOut} ${toU.plural.toLowerCase()} (${toU.symbol}) using standard NIST SP 811 and ISO 80000 conversion factors.`,
    },
  ];

  const payload = {
    status: "draft-needs-review",
    slug: pair.slug,
    category: catSlug,
    categoryId: pair.categoryId,
    fromUnitId: pair.fromUnitId,
    toUnitId: pair.toUnitId,
    fromSymbol: fromU.symbol,
    toSymbol: toU.symbol,
    intro,
    commonValues,
    workedExamples,
    mistakesAndEdgeCases,
    formula: {
      equation: formulaEquation,
      exactFactor,
      roundedFactor,
      inverseFactor,
    },
    internalLinks,
    faqs,
  };

  fs.writeFileSync(
    path.join(PAIR_CONTENT_DIR, `${pair.slug}.json`),
    JSON.stringify(payload, null, 2)
  );
}

// ---------------------------------------------------------------------------
// 6. Generate data/slug-redirects.json (301 permanent redirects, no chains)
// ---------------------------------------------------------------------------
const redirectsMap = new Map<string, string>();

function addRedirect(source: string, destination: string) {
  if (!source || !destination || source === destination) return;
  redirectsMap.set(source, destination);
}

// A. Thin hubs merged into /specialty (Task 4)
addRedirect("/radiation", "/specialty");
addRedirect("/digital-image-resolution", "/specialty");
addRedirect("/concentration-molar", "/specialty");
addRedirect("/fuel-consumption", "/specialty");

// B. /conversions/* legacy paths -> canonical hub
addRedirect("/conversions/radiation", "/specialty");
addRedirect("/conversions/digital-image-resolution", "/specialty");
addRedirect("/conversions/concentration-molar", "/specialty");
addRedirect("/conversions/fuel-consumption", "/specialty");
addRedirect("/conversions", "/directory");

// C. Explicit prompt-flagged exponent-loss slugs & duplicate/cross-dimension slugs (Task 3)
addRedirect(
  "/density/g-m-to-lb-ft",
  "/density/grams-per-cubic-meter-to-pounds-per-cubic-foot"
);
addRedirect(
  "/density/lb-ft-to-g-m",
  "/density/pounds-per-cubic-foot-to-grams-per-cubic-meter"
);
addRedirect(
  "/density/g-m-to-g-ml",
  "/density/grams-per-cubic-meter-to-grams-per-milliliter"
);
addRedirect(
  "/density/g-ml-to-g-m",
  "/density/grams-per-milliliter-to-grams-per-cubic-meter"
);
addRedirect(
  "/pressure/kgf-m-to-feet-of-water",
  "/pressure/kilograms-force-per-square-meter-to-feet-of-water"
);
addRedirect(
  "/pressure/feet-of-water-to-kgf-m",
  "/pressure/feet-of-water-to-kilograms-force-per-square-meter"
);
addRedirect(
  "/pressure/pascals-to-kgf-cm",
  "/pressure/pascals-to-kilograms-force-per-square-centimeter"
);
addRedirect(
  "/pressure/kgf-cm-to-pascals",
  "/pressure/kilograms-force-per-square-centimeter-to-pascals"
);
addRedirect(
  "/pressure/dynes-cm-to-pascals",
  "/pressure/dynes-per-square-centimeter-to-pascals"
);
addRedirect(
  "/pressure/pascals-to-dynes-cm",
  "/pressure/pascals-to-dynes-per-square-centimeter"
);
addRedirect(
  "/power/terawatts-to-ft-lbf-s",
  "/power/terawatts-to-foot-pounds-per-second"
);
addRedirect(
  "/power/ft-lbf-s-to-terawatts",
  "/power/foot-pounds-per-second-to-terawatts"
);

// D. All static catalogue pairs with old aliases (density, torque, flow)
for (const item of CONVERSION_CATALOGUE) {
  const catSlug = getCategoryUrlSlug(item.categoryId);
  const canonicalUrl = `/${catSlug}/${item.slug}`;
  if (item.aliases) {
    for (const alias of item.aliases) {
      if (alias !== item.slug) {
        addRedirect(`/${catSlug}/${alias}`, canonicalUrl);
      }
    }
  }
}

// E. Generate redirects for any dynamic or compound unit pairs where old symbol-stripped tokens were used
const oldTokenMap: Record<string, string> = {
  kg_per_m3: "kg-m",
  g_per_cm3: "g-cm",
  g_per_ml: "g-ml",
  g_per_l: "g-l",
  mg_per_l: "mg-l",
  ug_per_l: "ug-l",
  ng_per_l: "ng-l",
  g_per_m3: "g-m",
  mg_per_m3: "mg-m",
  lb_per_ft3: "lb-ft",
  lb_per_in3: "lb-in",
  lb_per_yd3: "lb-yd",
  lb_per_gal_us: "lb-gal",
  kgf_sq_cm: "kgf-cm",
  kgf_sq_m: "kgf-m",
  dyne_sq_cm: "dynes-cm",
  foot_pound_per_second: "ft-lbf-s",
  btu_per_hour: "btu-h",
  kilojoule_per_hour: "kj-h",
  kilocalorie_per_hour: "kcal-h",
  kilogram_force_meter: "kgf-m",
  kgf_m: "kgf-m",
  kgf_cm: "kgf-cm",
  kgf_mm: "kgf-mm",
  gf_mm: "gf-mm",
};

function getPreferredUnitSlug(u: Unit): string {
  return u.plural
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

for (const item of CONVERSION_CATALOGUE) {
  const fromU = UNIT_MAP.get(item.fromUnitId);
  const toU = UNIT_MAP.get(item.toUnitId);
  if (!fromU || !toU) continue;
  const catSlug = getCategoryUrlSlug(item.categoryId);
  const canonicalUrl = `/${catSlug}/${item.slug}`;

  const oldFrom = oldTokenMap[fromU.id] || getPreferredUnitSlug(fromU);
  const oldTo = oldTokenMap[toU.id] || getPreferredUnitSlug(toU);
  const oldSlug = `${oldFrom}-to-${oldTo}`;
  if (oldSlug !== item.slug) {
    addRedirect(`/${catSlug}/${oldSlug}`, canonicalUrl);
  }
}

// F. Duplicate losers across categories -> 301 to canonical primary category
addRedirect("/mass-flux-density/kg-to-g", "/weight-and-mass/kg-to-grams");
addRedirect("/mass-flux-density/g-to-kg", "/weight-and-mass/grams-to-kg");
addRedirect("/mass-flux-density/kg-to-lb", "/weight-and-mass/kg-to-lbs");
addRedirect("/mass-flux-density/lb-to-kg", "/weight-and-mass/lbs-to-kg");

// G. Cross-dimension volume/mass invalid URLs -> 301 to /cooking
addRedirect("/volume/pints-to-metric-tons", "/cooking");
addRedirect("/volume/metric-tons-to-pints", "/cooking");
addRedirect("/volume/cups-to-grams", "/cooking/cups-to-grams");
addRedirect("/volume/grams-to-cups", "/cooking/grams-to-cups");
addRedirect("/volume/tablespoons-to-grams", "/cooking/tablespoons-to-grams");
addRedirect("/volume/teaspoons-to-grams", "/cooking/teaspoons-to-grams");
addRedirect("/volume/ml-to-grams", "/cooking/ml-to-grams");
addRedirect("/volume/grams-to-ml", "/cooking/grams-to-ml");

// H. Resolve any chains so every source maps directly to its final destination in 1 hop
const resolvedRedirects: Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> = [];

for (const [src, dest] of redirectsMap.entries()) {
  let finalDest = dest;
  let hops = 0;
  while (redirectsMap.has(finalDest) && hops < 10) {
    finalDest = redirectsMap.get(finalDest)!;
    hops++;
  }
  if (src !== finalDest) {
    resolvedRedirects.push({
      source: src,
      destination: finalDest,
      permanent: true,
    });
  }
}

fs.writeFileSync(
  path.join(DATA_DIR, "slug-redirects.json"),
  JSON.stringify(resolvedRedirects, null, 2)
);

console.log(
  `Generated ${resolvedRedirects.length} 301 redirects in data/slug-redirects.json (0 chains).`
);
