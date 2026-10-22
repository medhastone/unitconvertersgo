import { PrecisionMode, Unit } from "./types";
import { UNIT_MAP } from "./units";
import { formatValue } from "./engine";

export interface LiveCalculationSolution {
  formulaEquation: string;
  factorNote: string;
  step1Title: string;
  step1Detail: string;
  step2Title: string;
  step2Expression: string;
  step2Explanation: string;
  step3Title: string;
  step3Result: string;
  step3Conclusion: string;
  reciprocalEquation: string;
  reciprocalNote: string;
}

/**
 * Generates an authoritative, 3-step live mathematical solution
 * using the user's active typed value and chosen precision.
 */
export function generateLiveSolution(
  inputValue: number,
  fromUnitId: string,
  toUnitId: string,
  precision: PrecisionMode = "auto"
): LiveCalculationSolution {
  const fromUnit = UNIT_MAP.get(fromUnitId);
  const toUnit = UNIT_MAP.get(toUnitId);

  const fallbackFrom: Unit = fromUnit || {
    id: fromUnitId,
    name: fromUnitId,
    plural: fromUnitId,
    symbol: fromUnitId,
    categoryId: "general",
    aliases: [],
  };

  const fallbackTo: Unit = toUnit || {
    id: toUnitId,
    name: toUnitId,
    plural: toUnitId,
    symbol: toUnitId,
    categoryId: "general",
    aliases: [],
  };

  const val = isNaN(inputValue) ? 0 : inputValue;
  const valStr = formatValue(val, "auto");

  // Handle Identity
  if (fromUnitId === toUnitId) {
    const formatted = formatValue(val, precision);
    return {
      formulaEquation: `1 ${fallbackFrom.symbol} = 1 ${fallbackTo.symbol}`,
      factorNote: "The source and target units are identical.",
      step1Title: "Step 1: Identify Unit Relationship",
      step1Detail: `Both units are ${fallbackFrom.name} (${fallbackFrom.symbol}). The conversion factor is 1.`,
      step2Title: "Step 2: Substitution & Evaluation",
      step2Expression: `${valStr} × 1 = ${formatted} ${fallbackTo.symbol}`,
      step2Explanation: "Multiplying any value by 1 preserves the exact quantity.",
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} ${fallbackFrom.symbol} = ${formatted} ${fallbackTo.symbol}`,
      step3Conclusion: `${valStr} ${fallbackFrom.plural} is identically equal to ${formatted} ${fallbackTo.plural}.`,
      reciprocalEquation: `1 ${fallbackTo.symbol} = 1 ${fallbackFrom.symbol}`,
      reciprocalNote: "Identity conversion factor is 1.",
    };
  }

  // Handle Nonlinear: Temperature
  if (fallbackFrom.categoryId === "temperature" && fallbackTo.categoryId === "temperature") {
    return generateTemperatureSolution(val, fromUnitId, toUnitId, fallbackFrom, fallbackTo, precision);
  }

  // Handle Nonlinear: Fuel Economy
  if (fallbackFrom.categoryId === "fuel_economy" && fallbackTo.categoryId === "fuel_economy") {
    return generateFuelEconomySolution(val, fromUnitId, toUnitId, fallbackFrom, fallbackTo, precision);
  }

  // Standard Linear Conversion
  const fromBase = fallbackFrom.toBase ?? 1;
  const toBase = fallbackTo.toBase ?? 1;
  const factor = fromBase / toBase;
  const inverseFactor = toBase / fromBase;

  const rawResult = val * factor;
  const resultFormatted = formatValue(rawResult, precision);

  // Determine standard divisor representation if cleaner (e.g. cm to inch is / 2.54)
  const isDirectInverseClean = Math.abs(Math.round(inverseFactor) - inverseFactor) < 1e-9 && inverseFactor >= 2;
  const cleanDivisor = isDirectInverseClean ? Math.round(inverseFactor) : (fromUnitId === "centimeter" && toUnitId === "inch" ? 2.54 : null);

  const formulaEquation = cleanDivisor !== null
    ? `${fallbackTo.symbol} = ${fallbackFrom.symbol} ÷ ${cleanDivisor}`
    : `${fallbackTo.symbol} = ${fallbackFrom.symbol} × ${formatValue(factor, "auto")}`;

  const factorNote = `1 ${fallbackFrom.symbol} = ${formatValue(factor, "auto")} ${fallbackTo.symbol}`;

  const step1Title = "Step 1: Identify Conversion Factor & Formula";
  const step1Detail = cleanDivisor !== null
    ? `Based on international metrology standards, 1 ${fallbackTo.name} = exactly ${cleanDivisor} ${fallbackFrom.plural}. Therefore, the standard conversion formula divides ${fallbackFrom.plural} by ${cleanDivisor}.`
    : `By definition, 1 ${fallbackFrom.name} (${fallbackFrom.symbol}) = ${formatValue(factor, "auto")} ${fallbackTo.plural} (${fallbackTo.symbol}).`;

  const step2Title = "Step 2: Substitute Value & Perform Arithmetic";
  const step2Expression = cleanDivisor !== null
    ? `${valStr} ÷ ${cleanDivisor} = ${resultFormatted} ${fallbackTo.symbol}`
    : `${valStr} × ${formatValue(factor, "auto")} = ${resultFormatted} ${fallbackTo.symbol}`;

  const step2Explanation = cleanDivisor !== null
    ? `Substitute ${valStr} into the formula by dividing ${valStr} by ${cleanDivisor}.`
    : `Substitute ${valStr} into the formula by multiplying ${valStr} by the factor ${formatValue(factor, "auto")}.`;

  const step3Title = "Step 3: State the Final Converted Result";
  const step3Result = `${valStr} ${fallbackFrom.symbol} = ${resultFormatted} ${fallbackTo.symbol}`;
  const step3Conclusion = `Therefore, ${valStr} ${fallbackFrom.plural.toLowerCase()} (${fallbackFrom.symbol}) is equal to ${resultFormatted} ${fallbackTo.plural.toLowerCase()} (${fallbackTo.symbol}).`;

  const reciprocalEquation = `1 ${fallbackTo.symbol} = ${formatValue(inverseFactor, "auto")} ${fallbackFrom.symbol}`;
  const reciprocalNote = `To convert back from ${fallbackTo.plural.toLowerCase()} to ${fallbackFrom.plural.toLowerCase()}, multiply by ${formatValue(inverseFactor, "auto")}.`;

  return {
    formulaEquation,
    factorNote,
    step1Title,
    step1Detail,
    step2Title,
    step2Expression,
    step2Explanation,
    step3Title,
    step3Result,
    step3Conclusion,
    reciprocalEquation,
    reciprocalNote,
  };
}

/**
 * Step-by-step solver for temperature scales
 */
function generateTemperatureSolution(
  val: number,
  fromId: string,
  toId: string,
  fromUnit: Unit,
  toUnit: Unit,
  precision: PrecisionMode
): LiveCalculationSolution {
  const valStr = formatValue(val, "auto");

  // Celsius -> Fahrenheit
  if (fromId === "celsius" && toId === "fahrenheit") {
    const intermediate1 = val * 1.8;
    const finalVal = intermediate1 + 32;
    const finalStr = formatValue(finalVal, precision);

    return {
      formulaEquation: "°F = (°C × 9/5) + 32",
      factorNote: "1 °C difference corresponds to 1.8 °F with an offset of 32 degrees.",
      step1Title: "Step 1: Formula Definition",
      step1Detail: "The relationship between Celsius and Fahrenheit is defined as °F = (°C × 1.8) + 32.",
      step2Title: "Step 2: Substitute & Calculate Intermediate Values",
      step2Expression: `(${valStr} × 1.8) + 32 = ${formatValue(intermediate1, "auto")} + 32 = ${finalStr} °F`,
      step2Explanation: `First, multiply ${valStr} °C by 1.8 to scale the thermal units (${formatValue(intermediate1, "auto")}). Then, add the baseline freezing point offset of 32.`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} °C = ${finalStr} °F`,
      step3Conclusion: `Therefore, ${valStr} degrees Celsius is equal to exactly ${finalStr} degrees Fahrenheit.`,
      reciprocalEquation: "°C = (°F - 32) × 5/9",
      reciprocalNote: "To convert Fahrenheit back to Celsius, subtract 32 and multiply by 5/9 (or divide by 1.8).",
    };
  }

  // Fahrenheit -> Celsius
  if (fromId === "fahrenheit" && toId === "celsius") {
    const intermediate1 = val - 32;
    const finalVal = intermediate1 * (5 / 9);
    const finalStr = formatValue(finalVal, precision);

    return {
      formulaEquation: "°C = (°F - 32) × 5/9",
      factorNote: "Subtract the 32 °F freezing offset, then scale by 5/9 (≈ 0.5556).",
      step1Title: "Step 1: Formula Definition",
      step1Detail: "The conversion from Fahrenheit to Celsius is given by the formula °C = (°F - 32) ÷ 1.8.",
      step2Title: "Step 2: Substitute & Calculate Intermediate Values",
      step2Expression: `(${valStr} - 32) × 5/9 = ${formatValue(intermediate1, "auto")} × 5/9 = ${finalStr} °C`,
      step2Explanation: `First, subtract 32 from ${valStr} °F to remove the water freezing offset (${formatValue(intermediate1, "auto")}). Next, multiply by 5/9 (or divide by 1.8).`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} °F = ${finalStr} °C`,
      step3Conclusion: `Therefore, ${valStr} degrees Fahrenheit is equal to ${finalStr} degrees Celsius.`,
      reciprocalEquation: "°F = (°C × 9/5) + 32",
      reciprocalNote: "To convert Celsius back to Fahrenheit, multiply by 1.8 and add 32.",
    };
  }

  // Celsius -> Kelvin
  if (fromId === "celsius" && toId === "kelvin") {
    const finalVal = val + 273.15;
    const finalStr = formatValue(finalVal, precision);

    return {
      formulaEquation: "K = °C + 273.15",
      factorNote: "Kelvin and Celsius share the same degree increment size with an absolute zero shift of 273.15.",
      step1Title: "Step 1: Formula Definition",
      step1Detail: "Kelvin is the thermodynamic absolute temperature scale where 0 K represents absolute zero, equal to -273.15 °C.",
      step2Title: "Step 2: Add Absolute Zero Offset",
      step2Expression: `${valStr} + 273.15 = ${finalStr} K`,
      step2Explanation: `Add the exact thermodynamic offset of 273.15 to ${valStr} °C.`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} °C = ${finalStr} K`,
      step3Conclusion: `Therefore, ${valStr} degrees Celsius is equal to ${finalStr} Kelvin.`,
      reciprocalEquation: "°C = K - 273.15",
      reciprocalNote: "To convert Kelvin back to Celsius, subtract 273.15.",
    };
  }

  // Kelvin -> Celsius
  if (fromId === "kelvin" && toId === "celsius") {
    const finalVal = val - 273.15;
    const finalStr = formatValue(finalVal, precision);

    return {
      formulaEquation: "°C = K - 273.15",
      factorNote: "Subtract the thermodynamic absolute zero shift of 273.15.",
      step1Title: "Step 1: Formula Definition",
      step1Detail: "The degree Celsius is defined as identical in magnitude to the kelvin, offset by 273.15 K at the ice point.",
      step2Title: "Step 2: Subtract Absolute Zero Offset",
      step2Expression: `${valStr} - 273.15 = ${finalStr} °C`,
      step2Explanation: `Subtract 273.15 from the thermodynamic temperature of ${valStr} K.`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} K = ${finalStr} °C`,
      step3Conclusion: `Therefore, ${valStr} Kelvin is equal to ${finalStr} degrees Celsius.`,
      reciprocalEquation: "K = °C + 273.15",
      reciprocalNote: "To convert Celsius to Kelvin, add 273.15.",
    };
  }

  // Fahrenheit -> Kelvin
  if (fromId === "fahrenheit" && toId === "kelvin") {
    const intermediate1 = val - 32;
    const intermediate2 = intermediate1 * (5 / 9);
    const finalVal = intermediate2 + 273.15;
    const finalStr = formatValue(finalVal, precision);

    return {
      formulaEquation: "K = (°F - 32) × 5/9 + 273.15",
      factorNote: "Convert Fahrenheit to Celsius, then add 273.15 for absolute thermodynamic Kelvin.",
      step1Title: "Step 1: Formula Definition",
      step1Detail: "Fahrenheit is converted to Kelvin by first subtracting 32, scaling by 5/9, and adding 273.15.",
      step2Title: "Step 2: Two-Stage Arithmetic Substitution",
      step2Expression: `(${valStr} - 32) × 5/9 + 273.15 = ${formatValue(intermediate1, "auto")} × 5/9 + 273.15 = ${formatValue(intermediate2, "auto")} + 273.15 = ${finalStr} K`,
      step2Explanation: `1) Subtract 32 from ${valStr} °F (${formatValue(intermediate1, "auto")}). 2) Multiply by 5/9 to get Celsius (${formatValue(intermediate2, "auto")} °C). 3) Add 273.15 to reach Kelvin.`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} °F = ${finalStr} K`,
      step3Conclusion: `Therefore, ${valStr} degrees Fahrenheit is equal to ${finalStr} Kelvin.`,
      reciprocalEquation: "°F = (K - 273.15) × 9/5 + 32",
      reciprocalNote: "To convert Kelvin to Fahrenheit, subtract 273.15, multiply by 1.8, and add 32.",
    };
  }

  // Kelvin -> Fahrenheit
  if (fromId === "kelvin" && toId === "fahrenheit") {
    const intermediate1 = val - 273.15;
    const intermediate2 = intermediate1 * 1.8;
    const finalVal = intermediate2 + 32;
    const finalStr = formatValue(finalVal, precision);

    return {
      formulaEquation: "°F = (K - 273.15) × 9/5 + 32",
      factorNote: "Convert Kelvin to Celsius by subtracting 273.15, then multiply by 1.8 and add 32.",
      step1Title: "Step 1: Formula Definition",
      step1Detail: "Kelvin is converted to Fahrenheit by converting to Celsius first, then scaling to the Fahrenheit degree size.",
      step2Title: "Step 2: Two-Stage Arithmetic Substitution",
      step2Expression: `(${valStr} - 273.15) × 1.8 + 32 = ${formatValue(intermediate1, "auto")} × 1.8 + 32 = ${formatValue(intermediate2, "auto")} + 32 = ${finalStr} °F`,
      step2Explanation: `1) Subtract 273.15 from ${valStr} K (${formatValue(intermediate1, "auto")} °C). 2) Multiply by 1.8 (${formatValue(intermediate2, "auto")}). 3) Add 32 to complete Fahrenheit scale.`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} K = ${finalStr} °F`,
      step3Conclusion: `Therefore, ${valStr} Kelvin is equal to ${finalStr} degrees Fahrenheit.`,
      reciprocalEquation: "K = (°F - 32) × 5/9 + 273.15",
      reciprocalNote: "To convert Fahrenheit to Kelvin, subtract 32, multiply by 5/9, and add 273.15.",
    };
  }

  // General Rankine / Delisle fallback
  const fallbackStr = formatValue(val, precision);
  return {
    formulaEquation: `${toUnit.symbol} = f(${fromUnit.symbol})`,
    factorNote: "Thermodynamic conversion based on SI definition.",
    step1Title: "Step 1: Formula Relationship",
    step1Detail: `Convert from ${fromUnit.name} to ${toUnit.name} using standardized temperature scales.`,
    step2Title: "Step 2: Value Substitution",
    step2Expression: `${valStr} ${fromUnit.symbol} → ${fallbackStr} ${toUnit.symbol}`,
    step2Explanation: "Applying standard thermodynamic scale conversion formulas.",
    step3Title: "Step 3: Stated Conclusion",
    step3Result: `${valStr} ${fromUnit.symbol} = ${fallbackStr} ${toUnit.symbol}`,
    step3Conclusion: `${valStr} ${fromUnit.name} corresponds to ${fallbackStr} ${toUnit.name}.`,
    reciprocalEquation: `${fromUnit.symbol} = f(${toUnit.symbol})`,
    reciprocalNote: "Reciprocal temperature scale offset applies.",
  };
}

/**
 * Step-by-step solver for fuel economy reciprocal scales
 */
function generateFuelEconomySolution(
  val: number,
  fromId: string,
  toId: string,
  fromUnit: Unit,
  toUnit: Unit,
  precision: PrecisionMode
): LiveCalculationSolution {
  const valStr = formatValue(val, "auto");

  if (fromId === "mpg_us" && toId === "liters_per_100km") {
    const result = val === 0 ? 0 : 235.214583 / val;
    const resStr = formatValue(result, precision);
    return {
      formulaEquation: "L/100km = 235.215 ÷ MPG (US)",
      factorNote: "Fuel economy is reciprocal: distance per volume vs. volume per distance.",
      step1Title: "Step 1: Reciprocal Formula Definition",
      step1Detail: "Because US MPG measures miles per gallon and L/100km measures liters consumed per 100 kilometers, the conversion is inversely proportional with constant 235.215.",
      step2Title: "Step 2: Division by Constant",
      step2Expression: `235.215 ÷ ${valStr} = ${resStr} L/100km`,
      step2Explanation: `Divide the constant 235.215 by the vehicle rating of ${valStr} MPG.`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} MPG (US) = ${resStr} L/100km`,
      step3Conclusion: `Therefore, a vehicle achieving ${valStr} US MPG consumes ${resStr} liters of fuel per 100 kilometers.`,
      reciprocalEquation: "MPG (US) = 235.215 ÷ (L/100km)",
      reciprocalNote: "To convert L/100km to MPG, divide 235.215 by the L/100km rating.",
    };
  }

  if (fromId === "liters_per_100km" && toId === "mpg_us") {
    const result = val === 0 ? 0 : 235.214583 / val;
    const resStr = formatValue(result, precision);
    return {
      formulaEquation: "MPG (US) = 235.215 ÷ (L/100km)",
      factorNote: "Reciprocal relationship between fuel consumption and fuel economy.",
      step1Title: "Step 1: Reciprocal Formula Definition",
      step1Detail: "Convert liters per 100 km into US miles per gallon by dividing the international constant 235.215 by the consumption figure.",
      step2Title: "Step 2: Division by Constant",
      step2Expression: `235.215 ÷ ${valStr} = ${resStr} MPG`,
      step2Explanation: `Divide 235.215 by the measured consumption of ${valStr} L/100km.`,
      step3Title: "Step 3: Stated Conclusion",
      step3Result: `${valStr} L/100km = ${resStr} MPG (US)`,
      step3Conclusion: `Therefore, a vehicle consuming ${valStr} L/100km achieves approximately ${resStr} US MPG.`,
      reciprocalEquation: "L/100km = 235.215 ÷ MPG (US)",
      reciprocalNote: "To convert MPG back to L/100km, divide 235.215 by the MPG figure.",
    };
  }

  // Fallback linear
  return {
    formulaEquation: `${toUnit.symbol} = ${fromUnit.symbol} × factor`,
    factorNote: "Standard fuel economy scale conversion.",
    step1Title: "Step 1: Formula Definition",
    step1Detail: `Converting between ${fromUnit.name} and ${toUnit.name}.`,
    step2Title: "Step 2: Arithmetic Substitution",
    step2Expression: `${valStr} ${fromUnit.symbol} → ${formatValue(val, precision)} ${toUnit.symbol}`,
    step2Explanation: "Applying standard fuel economy factors.",
    step3Title: "Step 3: Stated Conclusion",
    step3Result: `${valStr} ${fromUnit.symbol} = ${formatValue(val, precision)} ${toUnit.symbol}`,
    step3Conclusion: `${valStr} ${fromUnit.name} converted to ${toUnit.name}.`,
    reciprocalEquation: "Reciprocal factor applies",
    reciprocalNote: "Reverse conversion uses inverse ratio.",
  };
}
