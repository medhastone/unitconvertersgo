import { ConversionPairInfo, Unit } from "./conversions/types";
import { CATEGORY_MAP, UNIT_MAP, getUnitsByCategory } from "./conversions/units";
import { getCanonicalPairSlug } from "./conversions/catalogue";
import { convertUnits } from "./conversions/engine";
import { getCategoryUrlSlug, getCategoryUrl, getCanonicalConverterPath } from "./conversions/url";

export interface WorkedExampleItem {
  title: string;
  scenario: string;
  inputValue: number;
  outputValue: string;
  stepByStep: string;
}

export interface MistakesAndEdgeCasesBlock {
  title: string;
  items: string[];
}

export interface PairFormulaBlock {
  equation: string;
  exactFactor: string;
  roundedFactor: string;
  inverseFactor: string;
}

export interface PairInternalLink {
  label: string;
  href: string;
  type: "reverse" | "related" | "hub" | "guide";
}

export interface PairFaqItem {
  question: string;
  answer: string;
}

export interface PairContentData {
  status: "draft-needs-review" | "reviewed";
  slug: string;
  category: string;
  categoryId: string;
  fromUnitId: string;
  toUnitId: string;
  fromSymbol: string;
  toSymbol: string;
  intro: string;
  commonValues: number[];
  workedExamples: WorkedExampleItem[];
  mistakesAndEdgeCases: MistakesAndEdgeCasesBlock | null;
  formula: PairFormulaBlock;
  internalLinks: PairInternalLink[];
  faqs: PairFaqItem[];
}

interface CommonValuesCategoryFile {
  category: string;
  categoryId: string;
  defaultValues: number[];
  unitDefaults?: Record<string, number[]>;
  pairOverrides?: Record<string, number[]>;
}

const staticPairContentCache = new Map<string, PairContentData | null>();
const synthesizedPairContentCache = new Map<string, PairContentData>();
const commonValuesCache = new Map<string, CommonValuesCategoryFile | null>();

function getNodeFsAndPath(): {
  fs: typeof import("fs");
  path: typeof import("path");
} | null {
  if (typeof window !== "undefined") return null;
  try {
    const proc = process as unknown as {
      getBuiltinModule?: (id: string) => unknown;
    };
    if (typeof proc.getBuiltinModule === "function") {
      const fsMod = proc.getBuiltinModule("fs") as typeof import("fs") | undefined;
      const pathMod = proc.getBuiltinModule("path") as typeof import("path") | undefined;
      if (fsMod && pathMod) {
        return { fs: fsMod, path: pathMod };
      }
    }
    const req = (0, eval)("require") as (mod: string) => unknown;
    return {
      fs: req("fs") as typeof import("fs"),
      path: req("path") as typeof import("path"),
    };
  } catch {
    return null;
  }
}

export function getStaticPairContent(slug: string): PairContentData | null {
  if (staticPairContentCache.has(slug)) {
    return staticPairContentCache.get(slug) ?? null;
  }
  const nodeMods = getNodeFsAndPath();
  if (!nodeMods) return null;
  try {
    const filePath = nodeMods.path.join(process.cwd(), "data", "pair-content", `${slug}.json`);
    if (!nodeMods.fs.existsSync(filePath)) {
      staticPairContentCache.set(slug, null);
      return null;
    }
    const raw = nodeMods.fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as PairContentData;
    staticPairContentCache.set(slug, parsed);
    return parsed;
  } catch {
    staticPairContentCache.set(slug, null);
    return null;
  }
}

export function hasStaticPairContent(slug: string): boolean {
  return getStaticPairContent(slug) !== null;
}

function formatNum(val: number, decimals = 6): string {
  if (!isFinite(val)) return "—";
  if (val === 0) return "0";
  const abs = Math.abs(val);
  if (abs >= 1e9 || (abs < 1e-6 && abs > 0)) {
    return val.toExponential(4);
  }
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(val * factor) / factor;
  return rounded.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

function synthesizePairContent(pair: ConversionPairInfo): PairContentData | null {
  const cached = synthesizedPairContentCache.get(pair.slug);
  if (cached) return cached;

  const fromU = UNIT_MAP.get(pair.fromUnitId);
  const toU = UNIT_MAP.get(pair.toUnitId);
  const cat = CATEGORY_MAP.get(pair.categoryId) || CATEGORY_MAP.get(fromU?.categoryId || "");
  if (!fromU || !toU || !cat) return null;

  const isMassVol =
    (fromU.categoryId === "mass" && toU.categoryId === "volume") ||
    (fromU.categoryId === "volume" && toU.categoryId === "mass");

  const catSlug = getCategoryUrlSlug(pair.categoryId);
  const commonValues = getCuratedCommonValues(catSlug, pair.slug, fromU.id);

  const oneTo = convertUnits(1, fromU.id, toU.id, "auto", 12, 1).rawValue;
  const oneRev = convertUnits(1, toU.id, fromU.id, "auto", 12, 1).rawValue;
  const exactFactorStr = formatNum(oneTo, 8);
  const roundedFactorStr = formatNum(oneTo, 4);
  const revFactorStr = formatNum(oneRev, 6);

  const domainUseCases: Record<string, string> = {
    numbers:
      "corporate financial reporting, South Asian banking statements, demographic census data, and international budget comparisons",
    length:
      "architectural blueprints, international manufacturing tolerances, athletic track distances, and hardware sizing",
    mass: "international freight logistics, kitchen recipe scaling, athletic weight classes, and laboratory formulation",
    temperature:
      "meteorological weather reports, culinary oven calibration, HVAC setpoints, and clinical thermometry",
    volume:
      "culinary recipe scaling, beverage bottling, laboratory reagent preparation, and fluid tank capacity sizing",
    area: "real estate property deeds, agricultural land surveying, commercial floor plan leases, and civil zoning",
    speed:
      "automotive speedometer readings, aviation airspeed navigation, maritime chart plotting, and meteorology",
    time: "project scheduling, payroll timecards, scientific interval logging, and server uptime SLAs",
    pressure:
      "automotive tire inflation placards, hydraulic cylinder design, scuba diving tanks, and barometric weather tracking",
    energy:
      "residential electricity billing, HVAC heating load calculations, battery storage sizing, and nutritional energy tracking",
    power:
      "automotive engine output ratings, electric motor sizing, solar inverter specifications, and appliance load planning",
    digital_storage:
      "SSD and hard drive capacity verification, cloud storage provisioning, and database memory allocation",
    data_transfer:
      "fiber broadband speed testing, network throughput provisioning, and video streaming bitrate calculation",
    force:
      "structural beam load analysis, fastener tensile testing, aerospace thrust ratings, and mechanical engineering",
    torque:
      "automotive lug nut torque wrench settings, engine dynamometer curves, and industrial fastener specifications",
    density:
      "materials science specifications, concrete and soil compaction testing, chemical solution density, and buoyancy calculations",
    angle:
      "CNC rotary indexing, optical alignment, trigonometric engineering, and surveying bearings",
    frequency:
      "processor clock speeds, RF wireless spectrum allocation, audio signal processing, and rotational machinery RPM",
    flow: "pump selection, municipal water pipe sizing, HVAC airflow balancing, and welding shielding gas regulation",
    fuel_economy:
      "comparing North American EPA window stickers against European WLTP and UK vehicle fuel consumption figures",
    concentration_solution:
      "drinking water quality testing, environmental compliance monitoring, aquaculture salinity checks, and laboratory reagent preparation",
    radiation:
      "occupational dosimetry, medical imaging dose reporting, radiological safety audits, and nuclear regulatory compliance",
    resistance:
      "electronic circuit design, PCB pull-up/pull-down sizing, continuity testing, and power distribution diagnostics",
    capacitance:
      "RF filter tuning, decoupling capacitor selection, timing circuit calculation, and power electronics design",
    prefixes:
      "SI metric unit scaling, scientific notation conversion, semiconductor timing specs, and engineering datasheet interpretation",
  };

  const contextPhrase = isMassVol
    ? "culinary recipe scaling, chemical formulation, freight liquid-weight estimation, and ingredient batching"
    : domainUseCases[pair.categoryId] ||
      "engineering specifications, international trade documentation, and standardized technical measurements";

  const densityClause = isMassVol
    ? " Because mass-to-volume and volume-to-mass conversions depend on substance density, the baseline reference below assumes Pure Water at standard density (ρ = 1.000 g/mL), where 1 milliliter equals 1 gram; use the substance/density selector above for oils, milk, honey, flour, sugar, fuels, or custom densities."
    : ` Whether you are verifying ${cat.name.toLowerCase()} specifications on imported equipment, cross-checking technical datasheets, or scaling practical figures, this converter applies the exact NIST SP 811 and ISO 80000 reference relationship with instant precision.`;

  const intro = `Professionals and everyday users convert ${fromU.plural.toLowerCase()} (${fromU.symbol}) to ${toU.plural.toLowerCase()} (${toU.symbol}) when working across ${fromU.system} and ${toU.system} standards in ${contextPhrase}. Assuming ${isMassVol ? "Pure Water (ρ = 1.000 g/mL)" : "standard reference conditions"}, 1 ${fromU.name.toLowerCase()} equals ${exactFactorStr} ${toU.plural.toLowerCase()}, while 1 ${toU.name.toLowerCase()} equals ${revFactorStr} ${fromU.plural.toLowerCase()}.${densityClause}`;

  const sampleInputs = [
    commonValues[Math.min(2, commonValues.length - 1)] || 1,
    commonValues[Math.min(5, commonValues.length - 1)] || 10,
    commonValues[Math.min(8, commonValues.length - 1)] || 50,
  ];

  const workedExamples: WorkedExampleItem[] = sampleInputs.map((val, idx) => {
    const out = convertUnits(val, fromU.id, toU.id, "auto", 12, 1).rawValue;
    const outExact = formatNum(out, 6);
    const outRounded = formatNum(out, 2);
    const labels = [
      `Standard ${fromU.name} Benchmark (${val} ${fromU.symbol})`,
      `Practical Mid-Range Conversion (${val} ${fromU.symbol})`,
      `Higher-Capacity Specification (${val} ${fromU.symbol})`,
    ];
    const conditionNote = isMassVol ? " (assuming Pure Water, ρ = 1.000 g/mL)" : "";
    return {
      title: labels[idx],
      scenario: `Convert ${val} ${fromU.plural.toLowerCase()} (${fromU.symbol}) into ${toU.plural.toLowerCase()} (${toU.symbol})${conditionNote} for technical comparison and documentation.`,
      inputValue: val,
      outputValue: isMassVol ? `${outExact} ${toU.symbol} (Water)` : `${outExact} ${toU.symbol}`,
      stepByStep: `${val} ${fromU.symbol} × ${exactFactorStr}${isMassVol ? " (ρ = 1.000 g/mL)" : ""} = ${outExact} ${toU.symbol} (rounds to ${outRounded} ${toU.symbol}).`,
    };
  });

  let mistakesAndEdgeCases: MistakesAndEdgeCasesBlock | null = null;
  if (isMassVol) {
    mistakesAndEdgeCases = {
      title: "Density & Medium Assumption (Mass ↔ Volume)",
      items: [
        "Mass (weight) and volume measure different physical dimensions and cannot be converted without substance density (mass = volume × density).",
        "Default figures assume Pure Water at ρ = 1.000 g/mL (1 mL = 1 g, 1 L = 1 kg). Dense liquids like honey (1.42 g/mL) weigh ~42% more per cup/pint than water, while olive oil (0.915 g/mL) and gasoline (0.745 g/mL) weigh less. Select a preset or enter a custom g/mL density above.",
      ],
    };
  } else if (pair.categoryId === "concentration_solution") {
    mistakesAndEdgeCases = {
      title: "Medium Assumption: Dilute Aqueous Solution (Water) vs. Air / Gas (ppmv)",
      items: [
        "In dilute aqueous solutions (water at ≈ 1.000 g/mL = 1 kg/L), 1 ppm by mass equals 1 mg/L (1,000 µg/L) and 1 kg/m³ equals 1,000 ppm = 1,000 mg/L.",
        "In air or gas mixtures, ppm is usually volume/mole fraction (ppmv), which depends on molecular weight (MW), temperature, and pressure: mg/m³ = ppmv × MW / 24.45 at 25 °C and 1 atm — do not apply aqueous 1 ppm = 1 mg/L ratios to air pollutants.",
      ],
    };
  } else if (pair.categoryId === "flow") {
    mistakesAndEdgeCases = {
      title: "Fluid Medium & Pressure Note (Liquid vs. Compressed Air / SCFM vs. ACFM)",
      items: [
        "Volumetric flow ratios (such as CFH ↔ CFM, L/s ↔ CFM, and GPD ↔ GPM) are exact geometric relationships regardless of whether the fluid is water, oil, or air.",
        "For gases and compressed air, confirm whether rated CFM is Actual CFM (ACFM, at line pressure/temperature) or Standard CFM (SCFM, at 14.696 psia and 60 °F/68 °F), because gas density scales directly with absolute pressure.",
      ],
    };
  } else if (pair.categoryId === "radiation") {
    mistakesAndEdgeCases = {
      title: "Radiation Weighting Factor (w_R) & Equivalent Dose Context",
      items: [
        "Sievert (Sv / mSv) and rem are both equivalent-dose units (1 Sv = 100 rem; 1 mSv = 0.1 rem = 100 mrem), so the mathematical ratio is exact.",
        "Converting absorbed dose (Gy / rad) into equivalent dose (Sv / rem) depends on the radiation weighting factor w_R: w_R = 1 for X-rays, gamma rays, and beta particles, but w_R = 20 for alpha particles and 2–20 for neutrons.",
      ],
    };
  } else if (pair.categoryId === "prefixes") {
    mistakesAndEdgeCases = {
      title: "SI Decimal Metric Prefixes (Base-10) vs. Binary Computing Prefixes (Base-2)",
      items: [
        "SI metric prefixes always scale in exact powers of 10 (10³, 10⁶, 10⁻⁶, 10⁻⁹, 10⁻¹²). For example, 1 micro (µ) = 0.000001 = 10⁻⁶ base units, 1 nano (n) = 10⁻⁹, and 1 pico (p) = 10⁻¹².",
        "Do not confuse lowercase m (milli = 10⁻³) with uppercase M (mega = 10⁶) or µ (micro = 10⁻⁶), and in computing memory keep SI decimal prefixes distinct from IEC binary prefixes (Ki = 2¹⁰ = 1,024).",
      ],
    };
  } else if (pair.categoryId === "numbers") {
    mistakesAndEdgeCases = {
      title: "South Asian (Lakh / Crore) vs. International Short-Scale (Million / Billion) Grouping",
      items: [
        "In the International numbering system, commas group digits in powers of 1,000 (1,000 = Thousand; 1,000,000 = Million; 1,000,000,000 = Billion). In the South Asian (Indian) numbering system, the first comma sits after the hundreds place (1,000), and subsequent commas group every two digits: 1,00,000 = 1 Lakh (10⁵) and 1,00,00,000 = 1 Crore (10⁷ = 100 Lakhs).",
        "Key exact bridges: 1 Million = 10 Lakhs; 1 Crore = 10 Million; 1 Billion = 100 Crores = 10,000 Lakhs; 1 Trillion = 100,000 Crores (1 Lakh Crore).",
      ],
    };
  }

  const revSlug = getCanonicalPairSlug(toU, fromU);
  const revCategoryId = isMassVol ? toU.categoryId : pair.categoryId;
  const peerPool = isMassVol
    ? getUnitsByCategory(toU.categoryId).filter((u) => u.id !== toU.id)
    : getUnitsByCategory(pair.categoryId).filter((u) => u.id !== fromU.id && u.id !== toU.id);
  const peerUnits = peerPool.slice(0, 5);

  const internalLinks: PairInternalLink[] = [
    {
      label: `${toU.plural} to ${fromU.plural} (${toU.symbol} to ${fromU.symbol})`,
      href: getCanonicalConverterPath(revCategoryId, revSlug),
      type: "reverse",
    },
    ...peerUnits.map((peer) => ({
      label: `${fromU.plural} to ${peer.plural} (${fromU.symbol} to ${peer.symbol})`,
      href: getCanonicalConverterPath(
        fromU.categoryId,
        getCanonicalPairSlug(fromU, peer)
      ),
      type: "related" as const,
    })),
    {
      label: `${cat.name} Converter Hub`,
      href: getCategoryUrl(pair.categoryId),
      type: "hub",
    },
    {
      label: "The Comprehensive Metric to Imperial Conversion Guide",
      href: "/guides/metric-to-imperial",
      type: "guide",
    },
  ];

  const waterNote = isMassVol ? " for pure water (ρ = 1.000 g/mL)" : "";
  const faqs: PairFaqItem[] = [
    {
      question: `How many ${toU.plural.toLowerCase()} (${toU.symbol}) are in 1 ${fromU.name.toLowerCase()} (${fromU.symbol})?`,
      answer: `There are ${exactFactorStr} ${toU.plural.toLowerCase()} (${toU.symbol}) in 1 ${fromU.name.toLowerCase()} (${fromU.symbol})${waterNote}. For quick everyday estimates, 1 ${fromU.symbol} ≈ ${roundedFactorStr} ${toU.symbol}, and conversely 1 ${toU.symbol} = ${revFactorStr} ${fromU.symbol}.`,
    },
    {
      question: `What is the formula to convert ${fromU.plural.toLowerCase()} to ${toU.plural.toLowerCase()}?`,
      answer: isMassVol
        ? `Multiply your value in ${fromU.plural.toLowerCase()} (${fromU.symbol}) by ${exactFactorStr} for water (ρ = 1.000 g/mL), and scale linearly by density ρ (in g/mL)${fromU.categoryId === "volume" ? " (multiply by ρ)" : " (divide by ρ)"}.`
        : `Multiply your value in ${fromU.plural.toLowerCase()} (${fromU.symbol}) by ${exactFactorStr}: ${toU.symbol} = ${fromU.symbol} × ${exactFactorStr}. To convert back from ${toU.plural.toLowerCase()} to ${fromU.plural.toLowerCase()}, multiply by ${revFactorStr}.`,
    },
    {
      question: `What is ${sampleInputs[1]} ${fromU.plural.toLowerCase()} in ${toU.plural.toLowerCase()}?`,
      answer: `Using the exact conversion factor${waterNote}, ${sampleInputs[1]} ${fromU.symbol} equals ${workedExamples[1].outputValue}. Step-by-step: ${workedExamples[1].stepByStep}`,
    },
  ];

  const data: PairContentData = {
    status: "draft-needs-review",
    slug: pair.slug,
    category: catSlug,
    categoryId: pair.categoryId,
    fromUnitId: fromU.id,
    toUnitId: toU.id,
    fromSymbol: fromU.symbol,
    toSymbol: toU.symbol,
    intro,
    commonValues,
    workedExamples,
    mistakesAndEdgeCases,
    formula: {
      equation: isMassVol
        ? `${toU.symbol} = ${fromU.symbol} × ${exactFactorStr} (Water, ρ = 1.000 g/mL)`
        : `${toU.symbol} = ${fromU.symbol} × ${exactFactorStr}`,
      exactFactor: `1 ${fromU.symbol} = ${exactFactorStr} ${toU.symbol}${isMassVol ? " (Water)" : ""}`,
      roundedFactor: `1 ${fromU.symbol} ≈ ${roundedFactorStr} ${toU.symbol}${isMassVol ? " (Water)" : ""}`,
      inverseFactor: `1 ${toU.symbol} = ${revFactorStr} ${fromU.symbol}${isMassVol ? " (Water)" : ""}`,
    },
    internalLinks,
    faqs,
  };

  synthesizedPairContentCache.set(pair.slug, data);
  return data;
}

export function getPairContent(
  slug: string,
  pairFallback?: ConversionPairInfo
): PairContentData | null {
  const staticContent = getStaticPairContent(slug);
  if (staticContent) return staticContent;
  if (pairFallback) {
    return synthesizePairContent(pairFallback);
  }
  return null;
}

export function getCuratedCommonValues(
  categorySlug: string,
  pairSlug: string,
  fromUnitId: string
): number[] {
  const pairContent = getStaticPairContent(pairSlug);
  if (pairContent && Array.isArray(pairContent.commonValues) && pairContent.commonValues.length >= 8) {
    return pairContent.commonValues;
  }

  let catData = commonValuesCache.get(categorySlug);
  if (catData === undefined) {
    const nodeMods = getNodeFsAndPath();
    if (nodeMods) {
      try {
        const filePath = nodeMods.path.join(
          process.cwd(),
          "data",
          "common-values",
          `${categorySlug}.json`
        );
        if (nodeMods.fs.existsSync(filePath)) {
          catData = JSON.parse(
            nodeMods.fs.readFileSync(filePath, "utf-8")
          ) as CommonValuesCategoryFile;
        } else {
          catData = null;
        }
      } catch {
        catData = null;
      }
      commonValuesCache.set(categorySlug, catData);
    }
  }

  if (catData) {
    if (catData.pairOverrides && catData.pairOverrides[pairSlug]) {
      return catData.pairOverrides[pairSlug];
    }
    if (catData.unitDefaults && catData.unitDefaults[fromUnitId]) {
      return catData.unitDefaults[fromUnitId];
    }
    if (Array.isArray(catData.defaultValues) && catData.defaultValues.length >= 8) {
      return catData.defaultValues;
    }
  }

  return [0.5, 1, 2, 5, 10, 20, 25, 50, 75, 100];
}


