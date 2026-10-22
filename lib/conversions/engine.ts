import { ConversionOutput, ConversionStep, PrecisionMode, Unit } from "./types";
import { UNIT_MAP } from "./units";

/**
 * Format numeric value according to chosen precision mode.
 */
export function formatValue(value: number, precision: PrecisionMode = "auto"): string {
  if (isNaN(value) || !isFinite(value)) {
    return "—";
  }

  if (value === 0) return "0";

  if (precision === "sci") {
    return value.toExponential(4);
  }

  if (precision !== "auto") {
    const fixedDecimals = parseInt(precision, 10);
    return value.toLocaleString("en-US", {
      minimumFractionDigits: fixedDecimals,
      maximumFractionDigits: fixedDecimals,
      useGrouping: true,
    });
  }

  // Auto precision:
  const abs = Math.abs(value);
  if (abs >= 1e9 || (abs < 1e-6 && abs > 0)) {
    return value.toExponential(6);
  }

  // High precision float cleanup to remove binary floating point noise
  // e.g. 0.30000000000000004 -> 0.3
  const rounded = Number(Math.round(Number(value + "e10")) + "e-10");
  const str = rounded.toString();

  // If already clean integer or simple float
  if (!str.includes(".")) {
    return rounded.toLocaleString("en-US");
  }

  // Limit decimal places in auto mode to at most 5 decimal places for standard magnitudes
  if (abs >= 0.01 && abs < 100000) {
    const rounded5 = Number(Math.round(Number(value + "e5")) + "e-5");
    const str5 = rounded5.toString();
    if (!str5.includes(".")) {
      return rounded5.toLocaleString("en-US");
    }
    const [intP, decP] = str5.split(".");
    const cleanDec = decP.slice(0, 5).replace(/0+$/, "");
    return cleanDec ? `${Number(intP).toLocaleString("en-US")}.${cleanDec}` : Number(intP).toLocaleString("en-US");
  }

  // For very small numbers (< 0.01), preserve up to 8 decimal places
  const parts = str.split(".");
  const integerPart = Number(parts[0]).toLocaleString("en-US");
  const decimalPart = parts[1].slice(0, 8).replace(/0+$/, "");

  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
}

/**
 * Temperature converter with exact formulas and step descriptions
 */
function convertTemperature(
  value: number,
  fromId: string,
  toId: string,
  fromUnit: Unit,
  toUnit: Unit,
  precision: PrecisionMode
): ConversionOutput {
  let result = value;
  let formulaDisplay = "";
  const steps: ConversionStep[] = [];

  if (fromId === toId) {
    return {
      rawValue: value,
      formattedValue: formatValue(value, precision),
      fromUnit,
      toUnit,
      formulaDisplay: `${fromUnit.symbol} = ${toUnit.symbol}`,
      steps: [{ label: "Identity", expression: `${value} = ${value}`, explanation: "Units are identical." }],
      isNonlinear: true,
    };
  }

  // Convert to Celsius as pivot
  let celsius = value;
  if (fromId === "celsius") {
    celsius = value;
  } else if (fromId === "fahrenheit") {
    celsius = (value - 32) * (5 / 9);
    steps.push({
      label: "Convert to Celsius pivot",
      expression: `(${value} °F - 32) × 5/9 = ${formatValue(celsius, "4")} °C`,
      explanation: "Subtract 32 then multiply by 5/9.",
    });
  } else if (fromId === "kelvin") {
    celsius = value - 273.15;
    steps.push({
      label: "Convert to Celsius pivot",
      expression: `${value} K - 273.15 = ${formatValue(celsius, "4")} °C`,
      explanation: "Subtract 273.15 to reach Celsius.",
    });
  } else if (fromId === "rankine") {
    celsius = (value - 491.67) * (5 / 9);
    steps.push({
      label: "Convert to Celsius pivot",
      expression: `(${value} °R - 491.67) × 5/9 = ${formatValue(celsius, "4")} °C`,
      explanation: "Subtract 491.67 then multiply by 5/9.",
    });
  }

  // Convert from Celsius pivot to target
  if (toId === "celsius") {
    result = celsius;
    if (fromId === "fahrenheit") formulaDisplay = "°C = (°F - 32) × 5/9";
    else if (fromId === "kelvin") formulaDisplay = "°C = K - 273.15";
    else if (fromId === "rankine") formulaDisplay = "°C = (°R - 491.67) × 5/9";
  } else if (toId === "fahrenheit") {
    result = celsius * (9 / 5) + 32;
    if (fromId === "celsius") {
      formulaDisplay = "°F = (°C × 9/5) + 32";
      steps.push({
        label: "Multiply & Offset",
        expression: `(${value} × 9/5) + 32 = ${formatValue(result, precision)} °F`,
        explanation: "Multiply Celsius by 1.8 (9/5) and add 32.",
      });
    } else if (fromId === "kelvin") {
      formulaDisplay = "°F = (K - 273.15) × 9/5 + 32";
      steps.push({
        label: "Convert Kelvin to Fahrenheit",
        expression: `(${value} - 273.15) × 9/5 + 32 = ${formatValue(result, precision)} °F`,
        explanation: "Subtract 273.15, multiply by 1.8, and add 32.",
      });
    } else if (fromId === "rankine") {
      result = value - 459.67;
      formulaDisplay = "°F = °R - 459.67";
      steps.push({
        label: "Direct Offset",
        expression: `${value} - 459.67 = ${formatValue(result, precision)} °F`,
        explanation: "Subtract the absolute zero offset.",
      });
    }
  } else if (toId === "kelvin") {
    result = celsius + 273.15;
    if (fromId === "celsius") {
      formulaDisplay = "K = °C + 273.15";
      steps.push({
        label: "Absolute Offset",
        expression: `${value} + 273.15 = ${formatValue(result, precision)} K`,
        explanation: "Add 273.15 to shift to the absolute thermodynamic scale.",
      });
    } else if (fromId === "fahrenheit") {
      formulaDisplay = "K = (°F - 32) × 5/9 + 273.15";
      steps.push({
        label: "Final Step to Kelvin",
        expression: `${formatValue(celsius, "4")} + 273.15 = ${formatValue(result, precision)} K`,
        explanation: "Add 273.15 to the Celsius value.",
      });
    } else if (fromId === "rankine") {
      result = value * (5 / 9);
      formulaDisplay = "K = °R × 5/9";
      steps.push({
        label: "Direct Ratio",
        expression: `${value} × 5/9 = ${formatValue(result, precision)} K`,
        explanation: "Multiply Rankine by 5/9.",
      });
    }
  } else if (toId === "rankine") {
    result = (celsius + 273.15) * (9 / 5);
    if (fromId === "fahrenheit") {
      result = value + 459.67;
      formulaDisplay = "°R = °F + 459.67";
      steps.push({
        label: "Direct Offset",
        expression: `${value} + 459.67 = ${formatValue(result, precision)} °R`,
        explanation: "Add 459.67 to Fahrenheit.",
      });
    } else if (fromId === "celsius") {
      formulaDisplay = "°R = (°C + 273.15) × 9/5";
      steps.push({
        label: "Celsius to Rankine",
        expression: `(${value} + 273.15) × 9/5 = ${formatValue(result, precision)} °R`,
        explanation: "Add 273.15 and scale by 1.8.",
      });
    } else if (fromId === "kelvin") {
      result = value * 1.8;
      formulaDisplay = "°R = K × 1.8";
      steps.push({
        label: "Kelvin to Rankine",
        expression: `${value} × 1.8 = ${formatValue(result, precision)} °R`,
        explanation: "Multiply Kelvin by 1.8.",
      });
    }
  }

  return {
    rawValue: result,
    formattedValue: formatValue(result, precision),
    fromUnit,
    toUnit,
    formulaDisplay: formulaDisplay || `${toUnit.symbol} from ${fromUnit.symbol}`,
    steps,
    isNonlinear: true,
  };
}

/**
 * Fuel Economy nonlinear converter (distance per volume vs volume per distance)
 */
function convertFuelEconomy(
  value: number,
  fromId: string,
  toId: string,
  fromUnit: Unit,
  toUnit: Unit,
  precision: PrecisionMode
): ConversionOutput {
  const steps: ConversionStep[] = [];
  let result = 0;
  let formulaDisplay = "";

  if (value <= 0) {
    return {
      rawValue: 0,
      formattedValue: "0",
      fromUnit,
      toUnit,
      formulaDisplay: "Invalid / zero fuel consumption",
      steps: [{ label: "Zero Input", expression: "0", explanation: "Fuel economy requires a positive number." }],
      isNonlinear: true,
    };
  }

  if (fromId === toId) {
    return {
      rawValue: value,
      formattedValue: formatValue(value, precision),
      fromUnit,
      toUnit,
      formulaDisplay: "1:1 Identity",
      steps: [],
      isNonlinear: true,
    };
  }

  // MPG (US) <-> L/100km
  if (fromId === "mpg_us" && toId === "liters_per_100km") {
    result = 235.214583 / value;
    formulaDisplay = "L/100km = 235.215 / MPG (US)";
    steps.push({
      label: "Inverse Division",
      expression: `235.214583 ÷ ${value} = ${formatValue(result, precision)}`,
      explanation: "Divide the international constant 235.215 by the US MPG figure.",
    });
  } else if (fromId === "liters_per_100km" && toId === "mpg_us") {
    result = 235.214583 / value;
    formulaDisplay = "MPG (US) = 235.215 / (L/100km)";
    steps.push({
      label: "Inverse Division",
      expression: `235.214583 ÷ ${value} = ${formatValue(result, precision)}`,
      explanation: "Divide the international constant 235.215 by the L/100km value.",
    });
  } else if (fromId === "mpg_imperial" && toId === "liters_per_100km") {
    result = 282.4809363 / value;
    formulaDisplay = "L/100km = 282.481 / MPG (UK)";
    steps.push({
      label: "Imperial Constant Division",
      expression: `282.4809363 ÷ ${value} = ${formatValue(result, precision)}`,
      explanation: "Divide 282.481 by the UK Imperial MPG value.",
    });
  } else if (fromId === "liters_per_100km" && toId === "mpg_imperial") {
    result = 282.4809363 / value;
    formulaDisplay = "MPG (UK) = 282.481 / (L/100km)";
    steps.push({
      label: "Imperial Constant Division",
      expression: `282.4809363 ÷ ${value} = ${formatValue(result, precision)}`,
      explanation: "Divide 282.481 by the L/100km value.",
    });
  } else if (fromId === "mpg_us" && toId === "mpg_imperial") {
    result = value * 1.2009499;
    formulaDisplay = "MPG (UK) = MPG (US) × 1.20095";
    steps.push({
      label: "Gallon Size Ratio",
      expression: `${value} × 1.2009499 = ${formatValue(result, precision)}`,
      explanation: "Multiply by the ratio of Imperial Gallon to US Gallon (4.54609 / 3.78541).",
    });
  } else if (fromId === "mpg_imperial" && toId === "mpg_us") {
    result = value / 1.2009499;
    formulaDisplay = "MPG (US) = MPG (UK) / 1.20095";
    steps.push({
      label: "Gallon Size Ratio",
      expression: `${value} ÷ 1.2009499 = ${formatValue(result, precision)}`,
      explanation: "Divide by the gallon ratio.",
    });
  } else if (fromId === "km_per_liter" && toId === "mpg_us") {
    result = value * 2.35214583;
    formulaDisplay = "MPG (US) = km/L × 2.35215";
    steps.push({
      label: "Direct Factor",
      expression: `${value} × 2.35214583 = ${formatValue(result, precision)}`,
      explanation: "Multiply km/L by 2.35215.",
    });
  } else if (fromId === "mpg_us" && toId === "km_per_liter") {
    result = value * 0.4251437;
    formulaDisplay = "km/L = MPG (US) × 0.42514";
    steps.push({
      label: "Direct Factor",
      expression: `${value} × 0.4251437 = ${formatValue(result, precision)}`,
      explanation: "Multiply US MPG by 0.42514.",
    });
  } else if (fromId === "km_per_liter" && toId === "liters_per_100km") {
    result = 100 / value;
    formulaDisplay = "L/100km = 100 / (km/L)";
    steps.push({
      label: "Reciprocal Scale",
      expression: `100 ÷ ${value} = ${formatValue(result, precision)}`,
      explanation: "Divide 100 km by the distance per liter.",
    });
  } else if (fromId === "liters_per_100km" && toId === "km_per_liter") {
    result = 100 / value;
    formulaDisplay = "km/L = 100 / (L/100km)";
    steps.push({
      label: "Reciprocal Scale",
      expression: `100 ÷ ${value} = ${formatValue(result, precision)}`,
      explanation: "Divide 100 by the liters consumed.",
    });
  } else {
    // Fallback: convert through L/100km
    const toL100 = 235.215 / (fromId === "mpg_us" ? value : value * 0.8327);
    result = 235.215 / toL100;
    formulaDisplay = "Multi-step conversion";
  }

  return {
    rawValue: result,
    formattedValue: formatValue(result, precision),
    fromUnit,
    toUnit,
    formulaDisplay,
    steps,
    isNonlinear: true,
  };
}

/**
 * Main Conversion Function
 */
export function convertUnits(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  precision: PrecisionMode = "auto",
  voltage: number = 12
): ConversionOutput {
  const fromUnit = UNIT_MAP.get(fromUnitId);
  const toUnit = UNIT_MAP.get(toUnitId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid unit ID: from=${fromUnitId}, to=${toUnitId}`);
  }

  // Handle Nonlinear: Temperature
  if (fromUnit.categoryId === "temperature" && toUnit.categoryId === "temperature") {
    return convertTemperature(value, fromUnitId, toUnitId, fromUnit, toUnit, precision);
  }

  // Handle Nonlinear: Fuel Economy
  if (fromUnit.categoryId === "fuel_economy" && toUnit.categoryId === "fuel_economy") {
    return convertFuelEconomy(value, fromUnitId, toUnitId, fromUnit, toUnit, precision);
  }

  // Handle Electrical Battery Charge <-> Energy (e.g. Ah <-> kWh / Wh using Voltage V, default 12V)
  const isChargeToEnergy =
    fromUnit.categoryId === "charge" && toUnit.categoryId === "energy";
  const isEnergyToCharge =
    fromUnit.categoryId === "energy" && toUnit.categoryId === "charge";

  if (isChargeToEnergy || isEnergyToCharge) {
    const safeVoltage = voltage > 0 && isFinite(voltage) ? voltage : 12;
    const fromBaseFactor = fromUnit.toBase ?? 1;
    const toBaseFactor = toUnit.toBase ?? 1;
    // 1 Coulomb * 1 Volt = 1 Joule
    const factor = isChargeToEnergy
      ? (fromBaseFactor * safeVoltage) / toBaseFactor
      : fromBaseFactor / (toBaseFactor * safeVoltage);
    const inverseFactor = 1 / factor;
    const rawValue = value * factor;

    const formulaDisplay =
      fromUnitId === "ampere_hour" && toUnitId === "kilowatt_hour"
        ? `kWh = (Ah × ${safeVoltage} V) ÷ 1,000`
        : fromUnitId === "kilowatt_hour" && toUnitId === "ampere_hour"
        ? `Ah = (kWh × 1,000) ÷ ${safeVoltage} V`
        : fromUnitId === "ampere_hour" && toUnitId === "watt_hour"
        ? `Wh = Ah × ${safeVoltage} V`
        : fromUnitId === "watt_hour" && toUnitId === "ampere_hour"
        ? `Ah = Wh ÷ ${safeVoltage} V`
        : `1 ${fromUnit.symbol} (at ${safeVoltage} V) = ${formatValue(factor, "auto")} ${toUnit.symbol}`;

    const steps: ConversionStep[] = [
      {
        label: `System Voltage (${safeVoltage} V DC)`,
        expression: formulaDisplay,
        explanation: isChargeToEnergy
          ? `Multiply ${fromUnit.plural.toLowerCase()} by system voltage (${safeVoltage} V) to obtain Watt-hours, then scale to ${toUnit.plural.toLowerCase()}.`
          : `Divide ${fromUnit.plural.toLowerCase()} energy by system voltage (${safeVoltage} V) to obtain ${toUnit.plural.toLowerCase()}.`,
      },
      {
        label: "Arithmetic Substitution",
        expression: `${value} ${fromUnit.symbol} × ${formatValue(factor, "auto")} = ${formatValue(rawValue, precision)} ${toUnit.symbol}`,
        explanation: `At ${safeVoltage} V nominal battery voltage, ${value} ${fromUnit.symbol} equals ${formatValue(rawValue, precision)} ${toUnit.symbol}.`,
      },
    ];

    return {
      rawValue,
      formattedValue: formatValue(rawValue, precision),
      fromUnit,
      toUnit,
      formulaDisplay,
      steps,
      directFactor: factor,
      inverseFactor,
      isNonlinear: false,
    };
  }

  // Standard Linear Conversion via Category Base Unit
  const fromBaseFactor = fromUnit.toBase ?? 1;
  const toBaseFactor = toUnit.toBase ?? 1;

  // 1 fromUnit = fromBaseFactor baseUnits
  // 1 toUnit = toBaseFactor baseUnits
  // So: value [from] = value * (fromBaseFactor / toBaseFactor) [to]
  const factor = fromBaseFactor / toBaseFactor;
  const inverseFactor = toBaseFactor / fromBaseFactor;
  const rawValue = value * factor;

  const steps: ConversionStep[] = [
    {
      label: "Standard Multiplier",
      expression: `1 ${fromUnit.symbol} = ${formatValue(factor, "auto")} ${toUnit.symbol}`,
      explanation: `To convert ${fromUnit.plural.toLowerCase()} to ${toUnit.plural.toLowerCase()}, multiply the input by ${formatValue(factor, "auto")}.`,
    },
    {
      label: "Arithmetic Substitution",
      expression: `${value} × ${formatValue(factor, "auto")} = ${formatValue(rawValue, precision)}`,
      explanation: `Multiply the given value of ${value} ${fromUnit.symbol} by the scale factor ${formatValue(factor, "auto")}.`,
    },
  ];

  const formulaDisplay = `1 ${fromUnit.symbol} = ${formatValue(factor, "auto")} ${toUnit.symbol}`;

  return {
    rawValue,
    formattedValue: formatValue(rawValue, precision),
    fromUnit,
    toUnit,
    formulaDisplay,
    steps,
    directFactor: factor,
    inverseFactor,
    isNonlinear: false,
  };
}

/**
 * Generate a dynamic reference conversion table for a given pair
 */
export function generateReferenceTable(
  fromUnitId: string,
  toUnitId: string,
  customSteps?: number[]
): { input: number; output: string }[] {
  const steps = customSteps || [1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100, 250, 500, 1000];
  return steps.map((val) => {
    const res = convertUnits(val, fromUnitId, toUnitId, "auto");
    return {
      input: val,
      output: res.formattedValue,
    };
  });
}
