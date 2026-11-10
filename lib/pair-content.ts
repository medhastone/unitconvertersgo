import { ConversionPairInfo, Unit } from "./conversions/types";
import { CATEGORY_MAP, UNIT_MAP, getUnitsByCategory } from "./conversions/units";
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

function makeUnitToken(u: Unit): string {
  return u.plural
    .replace(/\s+\([^)]*\)/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function synthesizePairContent(pair: ConversionPairInfo): PairContentData | null {
  const cached = synthesizedPairContentCache.get(pair.slug);
  if (cached) return cached;

  const fromU = UNIT_MAP.get(pair.fromUnitId);
  const toU = UNIT_MAP.get(pair.toUnitId);
  const cat = CATEGORY_MAP.get(pair.categoryId);
  if (!fromU || !toU || !cat) return null;

  const catSlug = getCategoryUrlSlug(pair.categoryId);
  const commonValues = getCuratedCommonValues(catSlug, pair.slug, fromU.id);

  const oneTo = convertUnits(1, fromU.id, toU.id, "auto").rawValue;
  const oneRev = convertUnits(1, toU.id, fromU.id, "auto").rawValue;
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
  };

  const contextPhrase =
    domainUseCases[pair.categoryId] ||
    "engineering specifications, international trade documentation, and standardized technical measurements";

  const intro = `Professionals and everyday users convert ${fromU.plural.toLowerCase()} (${fromU.symbol}) to ${toU.plural.toLowerCase()} (${toU.symbol}) when working across ${fromU.system} and ${toU.system} standards in ${contextPhrase}. One ${fromU.name.toLowerCase()} equals ${exactFactorStr} ${toU.plural.toLowerCase()}, while 1 ${toU.name.toLowerCase()} equals ${revFactorStr} ${fromU.plural.toLowerCase()}. Whether you are verifying ${cat.name.toLowerCase()} specifications on imported equipment, cross-checking technical datasheets, or scaling practical figures, this converter applies the exact NIST SP 811 and ISO 80000 reference relationship with instant precision.`;

  const sampleInputs = [
    commonValues[Math.min(2, commonValues.length - 1)] || 1,
    commonValues[Math.min(5, commonValues.length - 1)] || 10,
    commonValues[Math.min(8, commonValues.length - 1)] || 50,
  ];

  const workedExamples: WorkedExampleItem[] = sampleInputs.map((val, idx) => {
    const out = convertUnits(val, fromU.id, toU.id, "auto").rawValue;
    const outExact = formatNum(out, 6);
    const outRounded = formatNum(out, 2);
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
      stepByStep: `${val} ${fromU.symbol} × ${exactFactorStr} = ${outExact} ${toU.symbol} (rounds to ${outRounded} ${toU.symbol}).`,
    };
  });

  let mistakesAndEdgeCases: MistakesAndEdgeCasesBlock | null = null;
  if (pair.categoryId === "numbers") {
    mistakesAndEdgeCases = {
      title: "South Asian (Lakh / Crore) vs. International Short-Scale (Million / Billion) Grouping",
      items: [
        "In the International numbering system, commas group digits in powers of 1,000 (1,000 = Thousand; 1,000,000 = Million; 1,000,000,000 = Billion). In the South Asian (Indian) numbering system, the first comma sits after the hundreds place (1,000), and subsequent commas group every two digits: 1,00,000 = 1 Lakh (10⁵) and 1,00,00,000 = 1 Crore (10⁷ = 100 Lakhs).",
        "Key exact bridges: 1 Million = 10 Lakhs; 1 Crore = 10 Million; 1 Billion = 100 Crores = 10,000 Lakhs; 1 Trillion = 100,000 Crores (1 Lakh Crore).",
      ],
    };
  }

  const revSlug = `${makeUnitToken(toU)}-to-${makeUnitToken(fromU)}`;
  const peerUnits = getUnitsByCategory(pair.categoryId)
    .filter((u) => u.id !== fromU.id && u.id !== toU.id)
    .slice(0, 3);

  const internalLinks: PairInternalLink[] = [
    {
      label: `${toU.plural} to ${fromU.plural} (${toU.symbol} to ${fromU.symbol})`,
      href: getCanonicalConverterPath(pair.categoryId, revSlug),
      type: "reverse",
    },
    ...peerUnits.map((peer) => ({
      label: `${fromU.plural} to ${peer.plural} (${fromU.symbol} to ${peer.symbol})`,
      href: getCanonicalConverterPath(
        pair.categoryId,
        `${makeUnitToken(fromU)}-to-${makeUnitToken(peer)}`
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

  const faqs: PairFaqItem[] = [
    {
      question: `How many ${toU.plural.toLowerCase()} (${toU.symbol}) are in 1 ${fromU.name.toLowerCase()} (${fromU.symbol})?`,
      answer: `There are ${exactFactorStr} ${toU.plural.toLowerCase()} (${toU.symbol}) in 1 ${fromU.name.toLowerCase()} (${fromU.symbol}). For quick everyday estimates, 1 ${fromU.symbol} ≈ ${roundedFactorStr} ${toU.symbol}, and conversely 1 ${toU.symbol} = ${revFactorStr} ${fromU.symbol}.`,
    },
    {
      question: `What is the formula to convert ${fromU.plural.toLowerCase()} to ${toU.plural.toLowerCase()}?`,
      answer: `Multiply your value in ${fromU.plural.toLowerCase()} (${fromU.symbol}) by ${exactFactorStr}: ${toU.symbol} = ${fromU.symbol} × ${exactFactorStr}. To convert back from ${toU.plural.toLowerCase()} to ${fromU.plural.toLowerCase()}, multiply by ${revFactorStr}.`,
    },
    {
      question: `What is ${sampleInputs[1]} ${fromU.plural.toLowerCase()} in ${toU.plural.toLowerCase()}?`,
      answer: `Using the exact conversion factor, ${sampleInputs[1]} ${fromU.symbol} equals ${workedExamples[1].outputValue}. Step-by-step: ${workedExamples[1].stepByStep}`,
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
      equation: `${toU.symbol} = ${fromU.symbol} × ${exactFactorStr}`,
      exactFactor: `1 ${fromU.symbol} = ${exactFactorStr} ${toU.symbol}`,
      roundedFactor: `1 ${fromU.symbol} ≈ ${roundedFactorStr} ${toU.symbol}`,
      inverseFactor: `1 ${toU.symbol} = ${revFactorStr} ${fromU.symbol}`,
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


