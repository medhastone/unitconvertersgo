import { ConversionPairInfo, PrecisionMode, Unit } from "./types";
import { CATEGORY_MAP, UNIT_MAP } from "./units";
import { convertUnits, formatValue } from "./engine";
import { getCategoryUrl } from "./url";

export interface UnitEncyclopediaEntry {
  heading: string;
  definitionParagraph: string;
  systemAndSymbolParagraph: string;
  notationOrPrefixParagraph: string;
  benchmarkCallout?: string;
  toolsAndApplicationsParagraph: string;
  categoryLinkLabel: string;
  categoryHref: string;
}

export interface EditorialContentBundle {
  h1: string;
  subheading: string;
  cleanH1: string;
  actionableSubheading: string;
  dimensionNoun: string;
  howToHeading: string;
  howToRatioParagraph: string;
  howToFormulaIntro: string;
  howToFormulaBox: string;
  howToSentenceExplanation: string;
  howToExampleIntro: string;
  howToExampleBox: string;
  howManyHeading: string;
  howManyParagraph1: string;
  howManyEquivalenceBox: string;
  howManyInverseNote: string;
  howManySystemParagraph: string;
  howManyTransitionParagraph: string;
  fromUnitGuide: UnitEncyclopediaEntry;
  toUnitGuide: UnitEncyclopediaEntry;
  measuringAdviceParagraph: string;
  tableHeading: string;
  tableSubheading: string;
  googlePaaFaqs: { question: string; answer: string }[];
}

export interface ScaleAwareTableRow {
  input: number;
  inputDisplay: string;
  outputDisplay: string;
  thirdUnitDisplay?: string;
}

const CATEGORY_DIMENSION_NOUN: Record<string, string> = {
  length: "length",
  mass: "weight",
  volume: "volume",
  temperature: "temperature",
  area: "area",
  speed: "speed",
  time: "time",
  pressure: "pressure",
  energy: "energy",
  power: "power",
  digital_storage: "data size",
  data_transfer: "data transfer rate",
  density: "density",
  torque: "torque",
  frequency: "frequency",
  angle: "angle",
  fuel_economy: "fuel economy",
  flow: "flow rate",
  current: "electric current",
  voltage: "voltage",
  capacitance: "capacitance",
  charge: "electric charge",
  resistance: "electrical resistance",
  inductance: "inductance",
  magnetic: "magnetic flux density",
};

const CATEGORY_MEASURING_INSTRUMENTS: Record<string, string> = {
  length:
    "We recommend using a ruler, tape measure, vernier caliper, micrometer, or laser distance meter to measure length, which you can find at a local hardware retailer or home center. Rulers and tape measures are available in imperial, metric, or a combination of both, so make sure you select the right graduation scale for your project.",
  mass:
    "We recommend using a calibrated digital kitchen scale, postal scale, analytical balance, or platform floor scale to measure weight and mass accurately. Most modern digital scales include a unit-toggle button that switches between grams, kilograms, ounces, and pounds.",
  volume:
    "We recommend using a graduated cylinder, liquid measuring cup, volumetric flask, or digital kitchen scale (using density) to measure liquid and dry volumes accurately. Make sure to check whether your measuring cup is calibrated to US customary (236.59 mL) or international metric (250 mL) graduations.",
  temperature:
    "We recommend using a calibrated digital probe thermometer, infrared pyrometer, or resistance temperature detector (RTD) to measure temperature accurately across Celsius, Fahrenheit, and Kelvin scales.",
  area:
    "We recommend using a laser distance measurer, surveyor's measuring wheel, or steel tape measure to determine length and width dimensions before calculating surface area.",
  speed:
    "Speed and velocity are typically measured using a Doppler radar gun, GPS speedometer, pitot-static airspeed indicator, or digital anemometer depending on whether you are tracking vehicles, aircraft, or wind.",
  time:
    "Time intervals are measured using quartz crystal timers, digital stopwatches, high-frequency electronic counters, or atomic clocks calibrated to the SI second.",
  pressure:
    "We recommend using a Bourdon tube pressure gauge, digital tire pressure gauge, manometer, or barometric transducer to measure fluid and atmospheric pressure.",
  energy:
    "Energy consumption and thermal output are measured using calorimeters, inline watt-hour electricity meters, and thermal power analyzers.",
  power:
    "Mechanical and electrical power are measured using engine dynamometers, clamp-on wattmeters, and power quality analyzers.",
  digital_storage:
    "Digital storage capacity is reported by operating system disk utilities, filesystem analyzers, and memory hardware diagnostics.",
  data_transfer:
    "Network bandwidth and data transfer rates are measured using packet throughput monitors and broadband speed test utilities.",
  density:
    "Material and liquid density are measured using a glass hydrometer, digital oscillating U-tube density meter, or pycnometer.",
  torque:
    "Rotational torque is measured and applied using a calibrated click-type, beam, or digital torque wrench and rotary torque transducers.",
  frequency:
    "Wave and rotational frequencies are measured using digital oscilloscopes, frequency counters, stroboscopes, and optical tachometers.",
  angle:
    "Angles and inclinations are measured using a bevel protractor, digital inclinometer, optical theodolite, or spirit level.",
  fuel_economy:
    "Vehicle fuel economy is tracked using onboard diagnostic (OBD-II) fuel flow computers and tank-to-tank odometer logs.",
  flow:
    "Volumetric flow rates are measured using rotameters, turbine flow sensors, ultrasonic flow meters, and orifice plates.",
  current:
    "Electric current is measured using a digital multimeter (in series) or a Hall-effect clamp ammeter.",
  voltage:
    "Electrical potential difference is measured using a high-impedance digital voltmeter or oscilloscope probe.",
  capacitance:
    "Electrical capacitance is measured using an LCR bridge meter or a digital multimeter with a capacitance test mode.",
  charge:
    "Electric charge and battery capacity are measured using a coulombmeter, electrometer, or smart battery coulomb counter.",
  resistance:
    "Electrical resistance is measured using a digital ohmmeter, four-wire Kelvin bridge, or insulation megohmmeter.",
  inductance:
    "Coil and choke inductance are measured using an impedance analyzer or calibrated LCR meter.",
  magnetic:
    "Magnetic flux density is measured using a Hall-effect gaussmeter or teslameter probe.",
};

const SI_PREFIX_DETAILS: {
  prefix: string;
  symbolPrefix: string;
  factorText: string;
  powerText: string;
}[] = [
  { prefix: "exa", symbolPrefix: "E", factorText: "quintillions", powerText: "10¹⁸" },
  { prefix: "peta", symbolPrefix: "P", factorText: "quadrillions", powerText: "10¹⁵" },
  { prefix: "tera", symbolPrefix: "T", factorText: "trillions", powerText: "10¹²" },
  { prefix: "giga", symbolPrefix: "G", factorText: "billions", powerText: "10⁹" },
  { prefix: "mega", symbolPrefix: "M", factorText: "millions", powerText: "10⁶" },
  { prefix: "kilo", symbolPrefix: "k", factorText: "thousands", powerText: "10³" },
  { prefix: "hecto", symbolPrefix: "h", factorText: "hundreds", powerText: "10²" },
  { prefix: "deka", symbolPrefix: "da", factorText: "tens", powerText: "10¹" },
  { prefix: "deci", symbolPrefix: "d", factorText: "tenths", powerText: "10⁻¹" },
  { prefix: "centi", symbolPrefix: "c", factorText: "hundredths", powerText: "10⁻²" },
  { prefix: "milli", symbolPrefix: "m", factorText: "thousandths", powerText: "10⁻³" },
  { prefix: "micro", symbolPrefix: "µ", factorText: "millionths", powerText: "10⁻⁶" },
  { prefix: "nano", symbolPrefix: "n", factorText: "billionths", powerText: "10⁻⁹" },
  { prefix: "pico", symbolPrefix: "p", factorText: "trillionths", powerText: "10⁻¹²" },
  { prefix: "femto", symbolPrefix: "f", factorText: "quadrillionths", powerText: "10⁻¹⁵" },
];

function getIndefiniteArticle(word: string): "a" | "an" {
  const clean = word.trim().toLowerCase();
  if (
    clean.startsWith("hour") ||
    clean.startsWith("ohm") ||
    clean.startsWith("inch") ||
    clean.startsWith("acre") ||
    clean.startsWith("amp") ||
    clean.startsWith("angstrom") ||
    clean.startsWith("atm") ||
    clean.startsWith("erg") ||
    clean.startsWith("ex") ||
    clean.startsWith("el") ||
    clean.startsWith("imp") ||
    clean.startsWith("arc") ||
    clean.startsWith("astr") ||
    clean.startsWith("att")
  ) {
    return "an";
  }
  if (clean.startsWith("u") && (clean.startsWith("us ") || clean.startsWith("uk ") || clean.startsWith("unit"))) {
    return "a";
  }
  return /^[aeiou]/.test(clean) ? "an" : "a";
}

function cleanUnitSingular(unit: Unit): string {
  return unit.name.replace(/\s*\(.*?\)\s*/g, "").trim();
}

function cleanUnitPlural(unit: Unit): string {
  return unit.plural.replace(/\s*\(.*?\)\s*/g, "").trim();
}

/**
 * Formats a numeric value cleanly with commas and up to 9 significant decimal places
 */
export function formatCleanNumber(val: number): string {
  if (!Number.isFinite(val)) return "—";
  if (val === 0) return "0";
  const abs = Math.abs(val);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-8)) {
    return val.toExponential(6).replace(/\.?0+e/, "e");
  }
  if (abs < 0.001) {
    return val.toFixed(9).replace(/\.?0+$/, "");
  }
  const rounded = Number(val.toFixed(7));
  const parts = rounded.toString().split(".");
  const intPart = Number(parts[0]).toLocaleString("en-US");
  return parts[1] ? `${intPart}.${parts[1]}` : intPart;
}

/**
 * Generates the exact 1-sentence actionable subheading requested by the user:
 * e.g. "Enter the length in inches below to convert it to nanometers."
 */
export function getActionableSubheading(
  pair: ConversionPairInfo,
  fromUnit: Unit,
  toUnit: Unit
): string {
  if (pair.intro && pair.intro.trim().length > 0) {
    return pair.intro.trim();
  }
  const dimension = CATEGORY_DIMENSION_NOUN[pair.categoryId] || "measurement";
  const fromPluralLower = cleanUnitPlural(fromUnit).toLowerCase();
  const toPluralLower = cleanUnitPlural(toUnit).toLowerCase();
  const oneForward = convertUnits(1, fromUnit.id, toUnit.id, "auto");
  const oneReverse = convertUnits(1, toUnit.id, fromUnit.id, "auto");
  const factorStr = formatCleanNumber(oneForward.rawValue);
  const revFactorStr = formatCleanNumber(oneReverse.rawValue);
  return `Convert ${fromPluralLower} (${fromUnit.symbol}) to ${toPluralLower} (${toUnit.symbol}) instantly using the exact relation 1 ${toUnit.symbol} = ${revFactorStr} ${fromUnit.symbol} (1 ${fromUnit.symbol} = ${factorStr} ${toUnit.symbol}).`;
}

/**
 * Generates the clean H1 title:
 * e.g. "Inches to Nanometers Converter"
 */
export function getCleanH1Title(
  fromUnit: Unit,
  toUnit: Unit,
  customH1?: string
): string {
  if (customH1 && customH1.trim().length > 0) {
    return customH1.trim();
  }
  return `${cleanUnitPlural(fromUnit)} to ${cleanUnitPlural(toUnit)} Converter`;
}

/**
 * Builds the rich multi-paragraph "What Is a/an [Unit]?" encyclopedia entry for any unit across all 25 categories
 */
export function buildUnitEncyclopediaEntry(unit: Unit): UnitEncyclopediaEntry {
  const category = CATEGORY_MAP.get(unit.categoryId);
  const baseUnit = category ? UNIT_MAP.get(category.baseUnitId) : undefined;
  const singularClean = cleanUnitSingular(unit);
  const singularLower = singularClean.toLowerCase();
  const pluralLower = cleanUnitPlural(unit).toLowerCase();
  const article = getIndefiniteArticle(singularClean);
  const articleCap = article === "an" ? "An" : "A";
  const dimension = CATEGORY_DIMENSION_NOUN[unit.categoryId] || "measurement";
  const categoryHref = getCategoryUrl(unit.categoryId);
  const categoryLinkLabel = `Learn more about ${pluralLower} in our ${category?.name || "Unit"} Converter.`;

  // Special curated profiles for flagship units (matching Inch Calculator's exact depth and facts)
  if (unit.id === "inch") {
    return {
      heading: "What Is an Inch?",
      definitionParagraph:
        "An inch is a unit of length equal to 1/12 of a foot or 1/36 of a yard. Because the international yard is legally defined as exactly 0.9144 meters under the 1959 International Yard and Pound Agreement, one inch equals exactly 2.54 centimeters (25.4 millimeters or 25,400,000 nanometers).[1]",
      systemAndSymbolParagraph:
        "The inch is a US customary and imperial unit of length. Inches can be abbreviated as in; for example, 1 inch can be written as 1 in.",
      notationOrPrefixParagraph:
        "Inches can also be denoted using the ″ symbol, otherwise known as a double prime. Often a double quote (\") is used instead of a double prime for convenience. A double prime is commonly used to express 1 in as 1″.",
      benchmarkCallout:
        "A US quarter coin is .955\" (24.26 mm) in diameter, which is just smaller than 1\".",
      toolsAndApplicationsParagraph:
        "The standard ruler is 12 inches long and is a common tool for measuring a length in inches. Another frequently used tool to perform measurements in inches is a tape measure, which commonly comes in lengths from 6' to 35'. Other devices used to measure in inches include scales, calipers, measuring wheels, micrometers, yardsticks, and even lasers.",
      categoryLinkLabel: "Explore all length conversions in our Length Converter.",
      categoryHref,
    };
  }

  if (unit.id === "nanometer") {
    return {
      heading: "What Is a Nanometer?",
      definitionParagraph:
        "One nanometer is equal to one-billionth (1/1,000,000,000) of a meter, which is defined as the distance light travels in a vacuum in a 1/299,792,458 second time interval.[1]",
      systemAndSymbolParagraph:
        "The nanometer, or nanometre, is a multiple of the meter, the SI base unit for length. In the metric system, \"nano\" is the prefix for billionths, or 10⁻⁹. Nanometers can be abbreviated as nm; for example, 1 nanometer can be written as 1 nm.",
      notationOrPrefixParagraph:
        "Because 1 inch equals 25.4 millimeters and 1 millimeter equals 1,000,000 nanometers, there are exactly 25,400,000 nanometers in 1 inch (and 10 Angstroms in 1 nanometer).",
      benchmarkCallout:
        "A single strand of human DNA is approximately 2.5 nanometers in diameter, and a sheet of paper is about 100,000 nanometers thick.",
      toolsAndApplicationsParagraph:
        "The nanometer is an extremely small unit of length measurement, often used to measure things that are very small, such as the wavelengths of visible light (400 nm to 700 nm), the transistors and electrical pathways in computer processors, and thin-film nanotechnology.",
      categoryLinkLabel: "Explore all length conversions in our Length Converter.",
      categoryHref,
    };
  }

  if (unit.id === "centimeter") {
    return {
      heading: "What Is a Centimeter?",
      definitionParagraph:
        "A centimeter is a metric unit of length equal to one-hundredth (1/100) of a meter, which is the International System of Units (SI) base unit of length.[1] One centimeter is also equal to 10 millimeters or approximately 0.39370079 inches.",
      systemAndSymbolParagraph:
        "The centimeter, or centimetre, is part of the SI metric system used worldwide for everyday, scientific, and clinical measurements. Centimeters can be abbreviated as cm; for example, 1 centimeter can be written as 1 cm.",
      notationOrPrefixParagraph:
        "In the metric system, \"centi\" is the Latin-derived prefix for hundredths, or 10⁻². Because 1 international inch is legally defined as 2.54 centimeters, converting between centimeters and inches is anchored by an exact mathematical constant.",
      benchmarkCallout:
        "A standard fingernail or the width of a standard AAA battery is approximately 1 centimeter (10 mm) across.",
      toolsAndApplicationsParagraph:
        "Centimeters are measured using metric rulers, tailor's measuring tapes, stadiometers (for human height), and vernier calipers across carpentry, apparel sizing, school science, and medical charts.",
      categoryLinkLabel: "Explore all length conversions in our Length Converter.",
      categoryHref,
    };
  }

  if (unit.id === "millimeter") {
    return {
      heading: "What Is a Millimeter?",
      definitionParagraph:
        "A millimeter is a metric unit of length equal to one-thousandth (1/1,000) of a meter or one-tenth (1/10) of a centimeter.[1] By international definition, there are exactly 25.4 millimeters in one inch.",
      systemAndSymbolParagraph:
        "The millimeter, or millimetre, is a standard SI metric unit of length. Millimeters can be abbreviated as mm; for example, 1 millimeter can be written as 1 mm.",
      notationOrPrefixParagraph:
        "In the metric system, \"milli\" is the prefix for thousandths, or 10⁻³. Millimeters are the default unit on mechanical engineering drawings and architectural blueprints worldwide.",
      benchmarkCallout:
        "A standard plastic credit card or ID card is approximately 0.76 to 0.8 millimeters thick, and a dime is about 1.35 mm thick.",
      toolsAndApplicationsParagraph:
        "Millimeters are commonly measured using metric steel rules, digital vernier calipers, depth gauges, and micrometers in CNC machining, 3D printing, automotive fasteners, and precision manufacturing.",
      categoryLinkLabel: "Explore all length conversions in our Length Converter.",
      categoryHref,
    };
  }

  if (unit.id === "meter") {
    return {
      heading: "What Is a Meter?",
      definitionParagraph:
        "The meter (or metre) is the fundamental base unit of length in the International System of Units (SI), officially defined by the BIPM as the length of the path traveled by light in a vacuum during a time interval of 1/299,792,458 of a second.[1]",
      systemAndSymbolParagraph:
        "All metric units of length—from nanometers and millimeters to kilometers—are derived as decimal powers of the meter. Meters can be abbreviated as m; for example, 1 meter can be written as 1 m.",
      notationOrPrefixParagraph:
        "One meter is equal to 100 centimeters, 1,000 millimeters, or approximately 39.3700787 inches (3.28084 feet or 1.09361 yards).",
      benchmarkCallout:
        "A standard residential doorknob is mounted approximately 1 meter above the floor, and a typical guitar is about 1 meter long.",
      toolsAndApplicationsParagraph:
        "Meters are measured using meter sticks, retractable steel tape measures, laser distance finders, and total station surveying instruments in construction, athletics, physics, and civil engineering.",
      categoryLinkLabel: "Explore all length conversions in our Length Converter.",
      categoryHref,
    };
  }

  if (unit.id === "foot") {
    return {
      heading: "What Is a Foot?",
      definitionParagraph:
        "A foot is a US customary and imperial unit of length equal to 12 inches or 1/3 of a yard. Under the 1959 International Yard and Pound Agreement, one foot is legally defined as exactly 0.3048 meters (30.48 centimeters).[1]",
      systemAndSymbolParagraph:
        "Feet are widely used in the United States, Canada, and the United Kingdom for human height, building construction, real estate floor plans, and aviation altitude. Feet can be abbreviated as ft; for example, 1 foot can be written as 1 ft.",
      notationOrPrefixParagraph:
        "Feet can also be denoted using the ′ symbol, known as a prime (or a single quote ' for convenience). For example, 5 feet 10 inches is frequently written as 5′ 10″ or 5' 10\".",
      benchmarkCallout:
        "A standard classroom ruler is exactly 1 foot (12 inches or 30.48 cm) in length.",
      toolsAndApplicationsParagraph:
        "Feet are measured using 12-inch rulers, carpenter's folding rules, 25-foot steel tape measures, and laser distance meters across residential framing, architecture, and surveying.",
      categoryLinkLabel: "Explore all length conversions in our Length Converter.",
      categoryHref,
    };
  }

  // Generic intelligent builder for any other unit in the catalogue
  let defPara = `${articleCap} ${singularLower} is a unit of ${dimension} in the ${formatSystemLabel(unit.system)} system.`;
  if (baseUnit && unit.id !== baseUnit.id && unit.toBase !== undefined) {
    const ratioToBase = unit.toBase;
    const inverseRatio = 1 / ratioToBase;
    if (ratioToBase < 1 && Math.abs(Math.round(inverseRatio) - inverseRatio) < 1e-6) {
      defPara = `${articleCap} ${singularLower} is a unit of ${dimension} equal to 1/${Math.round(inverseRatio).toLocaleString("en-US")} of ${getIndefiniteArticle(baseUnit.name)} ${cleanUnitSingular(baseUnit).toLowerCase()} (${formatCleanNumber(ratioToBase)} ${baseUnit.symbol}).[1] ${unit.description || ""}`;
    } else {
      defPara = `${articleCap} ${singularLower} is a unit of ${dimension} equal to ${formatCleanNumber(ratioToBase)} ${cleanUnitPlural(baseUnit).toLowerCase()} (${baseUnit.symbol}), the base unit for ${dimension}.[1] ${unit.description || ""}`;
    }
  } else if (unit.description) {
    defPara = `${unit.description} It serves as a primary reference unit for measuring ${dimension} across scientific and practical applications.[1]`;
  }

  const sysPara = `The ${singularLower} is classified as ${formatSystemLabelWithArticle(unit.system)} unit of ${dimension}. ${cleanUnitPlural(unit)} can be abbreviated as ${unit.symbol}; for example, 1 ${singularLower} can be written as 1 ${unit.symbol}.`;

  const matchedPrefix = SI_PREFIX_DETAILS.find(
    (p) => singularLower.startsWith(p.prefix) && singularLower !== p.prefix
  );
  let prefixPara: string;
  if (matchedPrefix && baseUnit) {
    prefixPara = `In the metric system, "${matchedPrefix.prefix}" is the standard SI prefix for ${matchedPrefix.factorText}, or ${matchedPrefix.powerText}. This makes the ${singularLower} (${unit.symbol}) a convenient decimal multiple of the ${cleanUnitSingular(baseUnit).toLowerCase()} (${baseUnit.symbol}).`;
  } else if (unit.id === "yard") {
    prefixPara = `One yard is defined as exactly 3 feet or 36 inches, and is legally anchored by international treaty as 0.9144 meters.`;
  } else if (unit.id === "mile") {
    prefixPara = `One statute mile is defined as 5,280 feet or 1,760 yards, which equals exactly 1,609.344 meters (1.609344 kilometers).`;
  } else {
    prefixPara = `When working with ${pluralLower} (${unit.symbol}) in formulas or technical specifications, always verify whether your target system uses SI metric, US customary, or British imperial standards.`;
  }

  const toolsPara =
    CATEGORY_MEASURING_INSTRUMENTS[unit.categoryId] ||
    `Measurements in ${pluralLower} (${unit.symbol}) are performed using calibrated laboratory and industrial instruments verified against national metrology standards.`;

  return {
    heading: `What Is ${article} ${singularClean}?`,
    definitionParagraph: defPara,
    systemAndSymbolParagraph: sysPara,
    notationOrPrefixParagraph: prefixPara,
    toolsAndApplicationsParagraph: toolsPara,
    categoryLinkLabel,
    categoryHref,
  };
}

function formatSystemLabel(system?: Unit["system"]): string {
  switch (system) {
    case "si":
      return "International System of Units (SI)";
    case "metric":
      return "SI metric";
    case "imperial":
      return "US customary and imperial";
    case "us_customary":
      return "US customary";
    case "binary":
      return "IEC binary";
    default:
      return "international standard";
  }
}

function formatSystemLabelWithArticle(system?: Unit["system"]): string {
  switch (system) {
    case "si":
      return "an International System of Units (SI)";
    case "metric":
      return "a metric and SI-compatible";
    case "imperial":
      return "a US customary and imperial";
    case "us_customary":
      return "a US customary";
    case "binary":
      return "an IEC binary";
    default:
      return "a standard";
  }
}

/**
 * Generates the complete human-readable SEO editorial content bundle for any conversion pair
 * matching the exact structure of inchcalculator.com/convert/inch-to-nanometer/
 */
export function generateEditorialContent(
  pair: ConversionPairInfo,
  fromUnit: Unit,
  toUnit: Unit,
  activeInput?: number
): EditorialContentBundle {
  const dimensionNoun = CATEGORY_DIMENSION_NOUN[pair.categoryId] || "measurement";
  const fromSingularClean = cleanUnitSingular(fromUnit);
  const toSingularClean = cleanUnitSingular(toUnit);
  const fromSingularLower = fromSingularClean.toLowerCase();
  const toSingularLower = toSingularClean.toLowerCase();
  const fromPluralClean = cleanUnitPlural(fromUnit);
  const toPluralClean = cleanUnitPlural(toUnit);
  const fromPluralLower = fromPluralClean.toLowerCase();
  const toPluralLower = toPluralClean.toLowerCase();

  const articleFrom = getIndefiniteArticle(fromSingularClean);
  const oneForward = convertUnits(1, fromUnit.id, toUnit.id, "auto");
  const oneReverse = convertUnits(1, toUnit.id, fromUnit.id, "auto");

  const exampleVal =
    activeInput !== undefined && Number.isFinite(activeInput) && activeInput > 0
      ? activeInput
      : pair.exampleInput || 5;
  const exampleOut = convertUnits(exampleVal, fromUnit.id, toUnit.id, "auto");

  const ratioFormatted = formatCleanNumber(oneForward.rawValue);
  const reverseRatioFormatted = formatCleanNumber(oneReverse.rawValue);
  const exampleResultFormatted = formatCleanNumber(exampleOut.rawValue);

  const fromValueWithSymbol =
    fromUnit.id === "inch"
      ? `${exampleVal}"`
      : fromUnit.id === "foot"
      ? `${exampleVal}'`
      : `${exampleVal} ${fromUnit.symbol}`;

  const oneFromWithSymbol =
    fromUnit.id === "inch"
      ? `1"`
      : fromUnit.id === "foot"
      ? `1'`
      : `1 ${fromUnit.symbol}`;

  let howToRatioParagraph: string;
  let howToFormulaIntro: string;
  let howToFormulaBox: string;
  let howToSentenceExplanation: string;
  let howToExampleIntro: string;
  let howToExampleBox: string;

  if (pair.categoryId === "temperature") {
    howToRatioParagraph = `To convert ${fromPluralLower} (${fromUnit.symbol}) to ${toPluralLower} (${toUnit.symbol}), apply the thermodynamic scale offset formula rather than a single multiplication factor because the two temperature scales have different zero points.`;
    howToFormulaIntro = `You can use this standard formula to convert ${fromPluralLower} to ${toPluralLower}:`;
    howToFormulaBox = oneForward.formulaDisplay;
    howToSentenceExplanation = `Each temperature reading in ${fromPluralLower} is scaled and shifted by the zero-point offset to obtain the exact temperature in ${toPluralLower}.`;
    howToExampleIntro = `For example, here's how to convert ${exampleVal} ${fromUnit.symbol} to ${toPluralLower} using the formula above:`;
    howToExampleBox = `${toPluralLower} = ${exampleOut.steps.map((s) => s.expression).join(" = ")} = ${exampleResultFormatted} ${toUnit.symbol}`;
  } else if (pair.categoryId === "fuel_economy") {
    howToRatioParagraph = `To convert ${fromPluralLower} (${fromUnit.symbol}) to ${toPluralLower} (${toUnit.symbol}), apply the governing fuel efficiency relationship: ${oneForward.formulaDisplay}.`;
    howToFormulaIntro = `Use this formula to convert between ${fromPluralLower} and ${toPluralLower}:`;
    howToFormulaBox = oneForward.formulaDisplay;
    howToSentenceExplanation = `Fuel consumption and distance-per-volume efficiency scales are related by exact international volume and mile/kilometer constants.`;
    howToExampleIntro = `For example, here's how to convert ${exampleVal} ${fromUnit.symbol} to ${toPluralLower} using the formula above:`;
    howToExampleBox = `${toPluralLower} = ${exampleOut.steps.map((s) => s.expression).join(" = ")} = ${exampleResultFormatted} ${toUnit.symbol}`;
  } else {
    howToRatioParagraph = `To convert ${fromPluralLower} to ${toPluralLower}, multiply the ${dimensionNoun} by the following conversion ratio: ${ratioFormatted} ${toPluralLower}/${fromSingularLower}.`;
    howToFormulaIntro = `Since one ${fromSingularLower} is equal to ${ratioFormatted} ${toPluralLower}, you can use this simple formula to convert:`;
    howToFormulaBox = `${toPluralLower} = ${fromPluralLower} × ${ratioFormatted}`;
    howToSentenceExplanation = `The ${dimensionNoun} in ${toPluralLower} is equal to the ${dimensionNoun} in ${fromPluralLower} multiplied by ${ratioFormatted}.`;
    howToExampleIntro = `For example, here's how to convert ${exampleVal} ${fromPluralLower} to ${toPluralLower} using the formula above.`;
    howToExampleBox = `${toPluralLower} = (${fromValueWithSymbol} × ${ratioFormatted}) = ${exampleResultFormatted} ${toUnit.symbol}`;
  }

  const howManyHeading = `How Many ${toPluralClean} Are in ${articleFrom} ${fromSingularClean}?`;
  const howManyParagraph1 =
    pair.categoryId === "temperature"
      ? `On the ${fromSingularClean} scale, a reading of 1 ${fromUnit.symbol} corresponds to ${ratioFormatted} ${toUnit.symbol} on the ${toSingularClean} scale.`
      : `There are ${ratioFormatted} ${toPluralLower} in ${articleFrom} ${fromSingularLower}, which is why we use this value in the formula above.`;
  const howManyEquivalenceBox = `${oneFromWithSymbol} = ${ratioFormatted} ${toUnit.symbol}`;
  const howManyInverseNote = `1 ${toUnit.symbol} = ${reverseRatioFormatted} ${fromUnit.symbol}`;

  const howManySystemParagraph =
    pair.categoryId === "length"
      ? `Our ${fromSingularLower} fraction and decimal calculator can convert ${fromPluralLower} and ${toPluralLower}, and it automatically converts the results to US customary, imperial, and SI metric values.`
      : `Our ${fromSingularLower} to ${toSingularLower} calculator automatically converts your ${dimensionNoun} measurements with full decimal and scientific precision across US customary, imperial, and SI metric standards.`;

  const howManyTransitionParagraph = `${fromPluralClean} and ${toPluralLower} are both units used to measure ${dimensionNoun}. Keep reading to learn more about each unit.`;

  const fromUnitGuide = buildUnitEncyclopediaEntry(fromUnit);
  const toUnitGuide = buildUnitEncyclopediaEntry(toUnit);
  const measuringAdviceParagraph =
    CATEGORY_MEASURING_INSTRUMENTS[pair.categoryId] ||
    `Always use a properly calibrated instrument when measuring ${dimensionNoun} in ${fromPluralLower} or ${toPluralLower}.`;

  // Generate 6 comprehensive Google "People Also Ask" (PAA) FAQs for this exact pair
  const googlePaaFaqs = buildGooglePaaFaqs(
    pair,
    fromUnit,
    toUnit,
    dimensionNoun,
    ratioFormatted,
    reverseRatioFormatted,
    exampleVal,
    exampleResultFormatted,
    howToFormulaBox
  );

  const cleanH1 = getCleanH1Title(fromUnit, toUnit);
  const actionableSubheading = getActionableSubheading(pair, fromUnit, toUnit);

  return {
    h1: cleanH1,
    subheading: actionableSubheading,
    cleanH1,
    actionableSubheading,
    dimensionNoun,
    howToHeading: `How to Convert ${fromPluralClean} to ${toPluralClean}`,
    howToRatioParagraph,
    howToFormulaIntro,
    howToFormulaBox,
    howToSentenceExplanation,
    howToExampleIntro,
    howToExampleBox,
    howManyHeading,
    howManyParagraph1,
    howManyEquivalenceBox,
    howManyInverseNote,
    howManySystemParagraph,
    howManyTransitionParagraph,
    fromUnitGuide,
    toUnitGuide,
    measuringAdviceParagraph,
    tableHeading: `${fromSingularClean} to ${toSingularClean} Conversion Table`,
    tableSubheading: `Table showing various ${fromSingularLower} measurements converted to ${toPluralLower}.`,
    googlePaaFaqs,
  };
}

export const generateEditorialContentBundle = generateEditorialContent;

function buildGooglePaaFaqs(
  pair: ConversionPairInfo,
  fromUnit: Unit,
  toUnit: Unit,
  dimensionNoun: string,
  ratioFormatted: string,
  reverseRatioFormatted: string,
  exampleVal: number,
  exampleResultFormatted: string,
  howToFormulaBox: string
): { question: string; answer: string }[] {
  const fromSingularClean = cleanUnitSingular(fromUnit);
  const toSingularClean = cleanUnitSingular(toUnit);
  const fromSingularLower = fromSingularClean.toLowerCase();
  const toSingularLower = toSingularClean.toLowerCase();
  const fromPluralLower = cleanUnitPlural(fromUnit).toLowerCase();
  const toPluralLower = cleanUnitPlural(toUnit).toLowerCase();
  const articleFrom = getIndefiniteArticle(fromSingularClean);
  const articleTo = getIndefiniteArticle(toSingularClean);

  const generated: { question: string; answer: string }[] = [
    {
      question: `How many ${toPluralLower} are in ${articleFrom} ${fromSingularLower}?`,
      answer:
        pair.categoryId === "temperature"
          ? `A temperature of 1 ${fromUnit.symbol} is equal to ${ratioFormatted} ${toUnit.symbol}. Because ${fromSingularClean} and ${toSingularClean} have different zero points, use the formula ${howToFormulaBox} for any temperature value.`
          : `There are ${ratioFormatted} ${toPluralLower} (${toUnit.symbol}) in 1 ${fromSingularLower} (${fromUnit.symbol}). Conversely, 1 ${toSingularLower} equals ${reverseRatioFormatted} ${fromPluralLower}.`,
    },
    {
      question: `How do you convert ${fromPluralLower} to ${toPluralLower}?`,
      answer:
        pair.categoryId === "temperature" || pair.categoryId === "fuel_economy"
          ? `To convert ${fromPluralLower} to ${toPluralLower}, apply the conversion formula: ${howToFormulaBox}. For example, ${exampleVal} ${fromUnit.symbol} converts to ${exampleResultFormatted} ${toUnit.symbol}.`
          : `To convert ${fromPluralLower} (${fromUnit.symbol}) to ${toPluralLower} (${toUnit.symbol}), multiply the ${dimensionNoun} in ${fromPluralLower} by ${ratioFormatted}. Formula: ${howToFormulaBox}.`,
    },
    {
      question: `What is ${exampleVal} ${fromPluralLower} in ${toPluralLower}?`,
      answer: `${exampleVal} ${fromPluralLower} (${exampleVal} ${fromUnit.symbol}) is equal to ${exampleResultFormatted} ${toPluralLower} (${exampleResultFormatted} ${toUnit.symbol}).`,
    },
    {
      question: `Which is bigger, ${articleFrom} ${fromSingularLower} or ${articleTo} ${toSingularLower}?`,
      answer:
        pair.categoryId === "temperature" || pair.categoryId === "fuel_economy"
          ? `At a reading of 1 ${fromUnit.symbol}, the equivalent is ${ratioFormatted} ${toUnit.symbol}, whereas 1 ${toUnit.symbol} equals ${reverseRatioFormatted} ${fromUnit.symbol}.`
          : (fromUnit.toBase ?? 1) >= (toUnit.toBase ?? 1)
          ? `One ${fromSingularLower} (${fromUnit.symbol}) is larger than one ${toSingularLower} (${toUnit.symbol}). Specifically, 1 ${fromUnit.symbol} equals ${ratioFormatted} ${toUnit.symbol}.`
          : `One ${toSingularLower} (${toUnit.symbol}) is larger than one ${fromSingularLower} (${fromUnit.symbol}). Specifically, 1 ${toUnit.symbol} equals ${reverseRatioFormatted} ${fromUnit.symbol}, while 1 ${fromUnit.symbol} is ${ratioFormatted} ${toUnit.symbol}.`,
    },
    {
      question: `How do I convert ${toPluralLower} back to ${fromPluralLower}?`,
      answer:
        pair.categoryId === "temperature" || pair.categoryId === "fuel_economy"
          ? `Click the Swap button in the converter tool above to reverse the calculation from ${toPluralLower} (${toUnit.symbol}) to ${fromPluralLower} (${fromUnit.symbol}) immediately.`
          : `To convert in reverse from ${toPluralLower} (${toUnit.symbol}) to ${fromPluralLower} (${fromUnit.symbol}), divide the ${toSingularLower} value by ${ratioFormatted} (or multiply by ${reverseRatioFormatted}).`,
    },
  ];

  // Merge with any curated pair.faqs without duplicating questions
  const combined: { question: string; answer: string }[] = [];
  const seen = new Set<string>();

  if (pair.faqs) {
    for (const f of pair.faqs) {
      const key = f.question.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(f);
      }
    }
  }

  for (const g of generated) {
    const key = g.question.trim().toLowerCase();
    if (!seen.has(key) && combined.length < 6) {
      seen.add(key);
      combined.push(g);
    }
  }

  return combined;
}

/**
 * Generates scale-aware conversion table rows that automatically include micro/decimal steps
 * for extreme unit ratios (like Inch to Nanometer: 0.0000001" to 1") plus standard rows.
 */
export function generateScaleAwareTableRows(
  fromUnit: Unit,
  toUnit: Unit,
  thirdUnit: Unit | undefined,
  mode: "auto" | "standard" | "fractions",
  commonValues?: number[]
): ScaleAwareTableRow[] {
  const oneForward = convertUnits(1, fromUnit.id, toUnit.id, "auto");
  const factor = Math.abs(oneForward.rawValue);

  let steps: number[] = [];

  if (mode === "standard") {
    steps = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 75, 100,
    ];
  } else if (mode === "fractions") {
    if (factor >= 100000) {
      steps = [
        0.00000001,
        0.0000001,
        0.0000002,
        0.0000003,
        0.0000004,
        0.0000005,
        0.0000006,
        0.0000007,
        0.0000008,
        0.0000009,
        0.000001,
        0.00001,
        0.0001,
        0.001,
        0.01,
        0.1,
        0.25,
        0.5,
        0.75,
        1,
      ];
    } else {
      steps = [
        0.015625,
        0.03125,
        0.0625,
        0.1,
        0.125,
        0.25,
        0.375,
        0.5,
        0.625,
        0.75,
        0.875,
        1,
        1.5,
        2,
        2.5,
        5,
        10,
      ];
    }
  } else {
    // "auto" Scale-Aware mode
    if (factor >= 100000) {
      // Extreme large multiplier (e.g. Inches to Nanometers where 1" = 25,400,000 nm)
      // Matches the exact competitor table rows from 0.0000001" to 1" plus standard whole numbers!
      steps = [
        0.0000001,
        0.0000002,
        0.0000003,
        0.0000004,
        0.0000005,
        0.0000006,
        0.0000007,
        0.0000008,
        0.0000009,
        0.00000001,
        0.000001,
        0.00001,
        0.0001,
        0.001,
        0.01,
        0.1,
        1,
        2,
        5,
        10,
        25,
        50,
        100,
      ];
    } else if (factor > 0 && factor <= 0.00001 && fromUnit.categoryId !== "temperature") {
      // Extreme small multiplier (e.g. Nanometers to Inches)
      steps = [
        1,
        10,
        100,
        1000,
        10000,
        100000,
        1000000,
        5000000,
        10000000,
        25400000,
        50000000,
        100000000,
        254000000,
      ];
    } else if (commonValues && commonValues.length >= 8) {
      const merged = new Set<number>([
        ...commonValues,
        1,
        2,
        5,
        10,
        15,
        20,
        25,
        50,
        100,
      ]);
      steps = Array.from(merged).sort((a, b) => a - b);
    } else {
      steps = [
        0.1,
        0.25,
        0.5,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        15,
        20,
        25,
        50,
        100,
      ];
    }
  }

  return steps.map((val) => {
    const out = convertUnits(val, fromUnit.id, toUnit.id, "auto");
    const inputNumStr =
      val < 0.001 && val > 0
        ? val.toFixed(8).replace(/\.?0+$/, "")
        : formatCleanNumber(val);

    const inputDisplay =
      fromUnit.id === "inch"
        ? `${inputNumStr}"`
        : `${inputNumStr} ${fromUnit.symbol}`;

    const outputDisplay = `${formatCleanNumber(out.rawValue)} ${toUnit.symbol}`;

    let thirdUnitDisplay: string | undefined;
    if (thirdUnit && thirdUnit.id !== fromUnit.id && thirdUnit.id !== toUnit.id) {
      const outThird = convertUnits(val, fromUnit.id, thirdUnit.id, "auto");
      thirdUnitDisplay = `${formatValue(outThird.rawValue, "auto")} ${thirdUnit.symbol}`;
    }

    return {
      input: val,
      inputDisplay,
      outputDisplay,
      thirdUnitDisplay,
    };
  });
}
