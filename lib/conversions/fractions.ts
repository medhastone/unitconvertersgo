import { convertUnits, formatValue } from "./engine";
import { UNIT_MAP } from "./units";

export interface TapeFractionInfo {
  whole: number;
  numerator: number;
  denominator: number;
  display: string;
  exactDecimal: number;
  error: number;
}

export interface MultiUnitEquivalent {
  unitId: string;
  symbol: string;
  name: string;
  formatted: string;
  isCompound?: boolean;
}

export interface TapeFractionRow {
  fractionLabel: string;
  decimalValue: number;
  decimalLabel: string;
}

/**
 * Standard binary tape-measure fractions from 1/64 to 1
 */
export const STANDARD_TAPE_FRACTIONS: TapeFractionRow[] = [
  { fractionLabel: "1/64", decimalValue: 1 / 64, decimalLabel: "0.015625" },
  { fractionLabel: "1/32", decimalValue: 1 / 32, decimalLabel: "0.03125" },
  { fractionLabel: "1/16", decimalValue: 1 / 16, decimalLabel: "0.0625" },
  { fractionLabel: "1/8", decimalValue: 1 / 8, decimalLabel: "0.125" },
  { fractionLabel: "3/16", decimalValue: 3 / 16, decimalLabel: "0.1875" },
  { fractionLabel: "1/4", decimalValue: 1 / 4, decimalLabel: "0.25" },
  { fractionLabel: "5/16", decimalValue: 5 / 16, decimalLabel: "0.3125" },
  { fractionLabel: "3/8", decimalValue: 3 / 8, decimalLabel: "0.375" },
  { fractionLabel: "7/16", decimalValue: 7 / 16, decimalLabel: "0.4375" },
  { fractionLabel: "1/2", decimalValue: 1 / 2, decimalLabel: "0.5" },
  { fractionLabel: "9/16", decimalValue: 9 / 16, decimalLabel: "0.5625" },
  { fractionLabel: "5/8", decimalValue: 5 / 8, decimalLabel: "0.625" },
  { fractionLabel: "11/16", decimalValue: 11 / 16, decimalLabel: "0.6875" },
  { fractionLabel: "3/4", decimalValue: 3 / 4, decimalLabel: "0.75" },
  { fractionLabel: "13/16", decimalValue: 13 / 16, decimalLabel: "0.8125" },
  { fractionLabel: "7/8", decimalValue: 7 / 8, decimalLabel: "0.875" },
  { fractionLabel: "15/16", decimalValue: 15 / 16, decimalLabel: "0.9375" },
  { fractionLabel: "1", decimalValue: 1, decimalLabel: "1.0" },
];

export const QUICK_FRACTION_CHIPS: { label: string; decimal: number }[] = [
  { label: "1/16", decimal: 0.0625 },
  { label: "1/8", decimal: 0.125 },
  { label: "3/16", decimal: 0.1875 },
  { label: "1/4", decimal: 0.25 },
  { label: "3/8", decimal: 0.375 },
  { label: "1/2", decimal: 0.5 },
  { label: "5/8", decimal: 0.625 },
  { label: "3/4", decimal: 0.75 },
  { label: "7/8", decimal: 0.875 },
];

/**
 * Greatest common divisor helper
 */
function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/**
 * Parses decimal, simple fraction ("3/8"), or mixed number ("5 3/8" or "5-3/8") into a numeric float.
 */
export function parseNumericOrFractionInput(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "-" || trimmed === ".") return NaN;

  // 1. Standard number
  const direct = Number(trimmed);
  if (!Number.isNaN(direct)) {
    return direct;
  }

  // 2. Mixed number: e.g. "5 3/8" or "-5 3/8" or "5-3/8"
  const mixedMatch = trimmed.match(/^([+-]?\d+)\s*(?:\s+|-)\s*(\d+)\s*\/\s*(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den === 0) return NaN;
    const sign = whole < 0 || trimmed.startsWith("-") ? -1 : 1;
    return sign * (Math.abs(whole) + num / den);
  }

  // 3. Simple fraction: e.g. "3/8" or "-3/8"
  const fracMatch = trimmed.match(/^([+-]?\d+)\s*\/\s*(\d+)$/);
  if (fracMatch) {
    const num = parseInt(fracMatch[1], 10);
    const den = parseInt(fracMatch[2], 10);
    if (den === 0) return NaN;
    return num / den;
  }

  return NaN;
}

/**
 * Converts a decimal number to its nearest binary tape-measure fraction (e.g. nearest 1/16 or 1/64).
 */
export function formatAsTapeFraction(
  value: number,
  maxDenominator: 16 | 32 | 64 = 16
): TapeFractionInfo | null {
  if (!Number.isFinite(value) || value < 0 || value > 100000) return null;

  const wholeFloor = Math.floor(value);
  const remainder = value - wholeFloor;

  const rawNumerator = Math.round(remainder * maxDenominator);
  if (rawNumerator === 0) {
    return {
      whole: wholeFloor,
      numerator: 0,
      denominator: 1,
      display: `${wholeFloor}`,
      exactDecimal: wholeFloor,
      error: Math.abs(value - wholeFloor),
    };
  }

  if (rawNumerator === maxDenominator) {
    const nextWhole = wholeFloor + 1;
    return {
      whole: nextWhole,
      numerator: 0,
      denominator: 1,
      display: `${nextWhole}`,
      exactDecimal: nextWhole,
      error: Math.abs(value - nextWhole),
    };
  }

  const divisor = gcd(rawNumerator, maxDenominator);
  const num = rawNumerator / divisor;
  const den = maxDenominator / divisor;
  const approx = wholeFloor + num / den;

  const display = wholeFloor > 0 ? `${wholeFloor} ${num}/${den}` : `${num}/${den}`;

  return {
    whole: wholeFloor,
    numerator: num,
    denominator: den,
    display,
    exactDecimal: approx,
    error: Math.abs(value - approx),
  };
}

/**
 * Formats total inches into compound Feet & Inches (e.g. 70 in -> "5 ft 10 in (5' 10\")")
 */
export function formatFeetAndInches(totalInches: number): string | null {
  if (!Number.isFinite(totalInches) || totalInches < 0 || totalInches > 100000) {
    return null;
  }
  const feet = Math.floor(totalInches / 12);
  const remInches = totalInches - feet * 12;
  const cleanRem = Number(remInches.toFixed(2));
  const frac16 = formatAsTapeFraction(remInches, 16);
  const fracPart =
    frac16 && frac16.numerator > 0 ? `${frac16.display}"` : `${cleanRem}"`;

  return `${feet} ft ${cleanRem} in (${feet}' ${fracPart})`;
}

/**
 * Formats total ounces into compound Pounds & Ounces (e.g. 40 oz -> "2 lb 8 oz")
 */
export function formatPoundsAndOunces(totalOunces: number): string | null {
  if (!Number.isFinite(totalOunces) || totalOunces < 0 || totalOunces > 100000) {
    return null;
  }
  const lbs = Math.floor(totalOunces / 16);
  const remOz = Number((totalOunces - lbs * 16).toFixed(2));
  return `${lbs} lb ${remOz} oz`;
}

/**
 * Generates simultaneous multi-unit equivalents for the active input value
 */
export function getMultiUnitEquivalents(
  value: number,
  fromUnitId: string,
  categoryId: string
): MultiUnitEquivalent[] {
  if (!Number.isFinite(value)) return [];

  const targetIdsByCategory: Record<string, string[]> = {
    length: ["millimeter", "centimeter", "meter", "inch", "foot", "yard"],
    mass: ["milligram", "gram", "kilogram", "ounce", "pound", "stone"],
    temperature: ["celsius", "fahrenheit", "kelvin"],
    volume: ["milliliter", "liter", "fluid_ounce", "cup", "pint", "gallon"],
    area: ["square_centimeter", "square_meter", "square_inch", "square_foot", "acre"],
    speed: ["meter_per_second", "kilometer_per_hour", "mile_per_hour", "knot"],
    pressure: ["pascal", "kilopascal", "bar", "psi", "atmosphere"],
  };

  const unitIds = targetIdsByCategory[categoryId];
  const results: MultiUnitEquivalent[] = [];

  if (unitIds) {
    for (const uid of unitIds) {
      if (uid === fromUnitId) continue;
      const u = UNIT_MAP.get(uid);
      if (!u) continue;
      try {
        const out = convertUnits(value, fromUnitId, uid, "auto");
        results.push({
          unitId: uid,
          symbol: u.symbol,
          name: u.plural,
          formatted: formatValue(out.rawValue, "auto"),
        });
      } catch {
        // ignore unmapped
      }
    }
  }

  // Add compound Feet + Inches and Fractional Inches for length conversions
  if (categoryId === "length") {
    try {
      const inInches = convertUnits(value, fromUnitId, "inch", "auto").rawValue;
      if (inInches > 0 && inInches < 10000) {
        const frac16 = formatAsTapeFraction(inInches, 16);
        const frac64 = formatAsTapeFraction(inInches, 64);
        if (frac16 && frac16.numerator > 0) {
          results.unshift({
            unitId: "inch_fraction_16",
            symbol: "in (1/16\")",
            name: "Nearest 1/16\" Fraction",
            formatted: `${frac16.display} in`,
            isCompound: true,
          });
        } else if (frac64 && frac64.numerator > 0) {
          results.unshift({
            unitId: "inch_fraction_64",
            symbol: "in (1/64\")",
            name: "Nearest 1/64\" Fraction",
            formatted: `${frac64.display} in`,
            isCompound: true,
          });
        }

        if (inInches >= 12) {
          const ftIn = formatFeetAndInches(inInches);
          if (ftIn) {
            results.unshift({
              unitId: "feet_and_inches",
              symbol: "ft + in",
              name: "Feet & Inches",
              formatted: ftIn,
              isCompound: true,
            });
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Add compound Pounds + Ounces for mass conversions
  if (categoryId === "mass") {
    try {
      const inOz = convertUnits(value, fromUnitId, "ounce", "auto").rawValue;
      if (inOz >= 16 && inOz < 100000) {
        const lbOz = formatPoundsAndOunces(inOz);
        if (lbOz) {
          results.unshift({
            unitId: "pounds_and_ounces",
            symbol: "lb + oz",
            name: "Pounds & Ounces",
            formatted: lbOz,
            isCompound: true,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  return results.slice(0, 6);
}
