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

const pairContentCache = new Map<string, PairContentData | null>();
const commonValuesCache = new Map<string, CommonValuesCategoryFile | null>();

function getNodeFsAndPath(): {
  fs: typeof import("fs");
  path: typeof import("path");
} | null {
  if (typeof window !== "undefined") return null;
  try {
    const req = new Function("mod", "return require(mod)") as (mod: string) => unknown;
    return {
      fs: req("fs") as typeof import("fs"),
      path: req("path") as typeof import("path"),
    };
  } catch {
    return null;
  }
}

export function getPairContent(slug: string): PairContentData | null {
  if (pairContentCache.has(slug)) {
    return pairContentCache.get(slug) ?? null;
  }
  const nodeMods = getNodeFsAndPath();
  if (!nodeMods) return null;
  try {
    const filePath = nodeMods.path.join(process.cwd(), "data", "pair-content", `${slug}.json`);
    if (!nodeMods.fs.existsSync(filePath)) {
      pairContentCache.set(slug, null);
      return null;
    }
    const raw = nodeMods.fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as PairContentData;
    pairContentCache.set(slug, parsed);
    return parsed;
  } catch {
    pairContentCache.set(slug, null);
    return null;
  }
}

export function getCuratedCommonValues(
  categorySlug: string,
  pairSlug: string,
  fromUnitId: string
): number[] {
  const pairContent = getPairContent(pairSlug);
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

