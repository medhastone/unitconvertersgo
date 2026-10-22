export type UnitSystem = "metric" | "imperial" | "us_customary" | "binary" | "si" | "other";

export interface Unit {
  id: string;
  name: string;
  plural: string;
  symbol: string;
  categoryId: string;
  system?: UnitSystem;
  aliases: string[];
  description?: string;
  // For linear units: factor to multiply to convert 1 [unit] to the base unit
  toBase?: number;
}

export interface Category {
  id: string;
  name: string;
  pluralName: string;
  baseUnitId: string;
  iconName: string; // Lucide icon key
  description: string;
  popularPairSlugs: string[];
}

export type PrecisionMode = "auto" | "0" | "2" | "4" | "6" | "8" | "10" | "sci";

export interface ConversionStep {
  label: string;
  expression: string;
  explanation: string;
}

export interface ConversionOutput {
  rawValue: number;
  formattedValue: string;
  fromUnit: Unit;
  toUnit: Unit;
  formulaDisplay: string;
  formulaLatex?: string;
  steps: ConversionStep[];
  inverseFactor?: number;
  directFactor?: number;
  isNonlinear?: boolean;
}

export interface PracticalBenchmark {
  value: number;
  convertedValue: string;
  label: string;
  description?: string;
}

export interface ConversionPairInfo {
  slug: string;
  aliases?: string[];
  fromUnitId: string;
  toUnitId: string;
  categoryId: string;
  title: string;
  h1?: string;
  metaDescription: string;
  intro?: string;
  formulaDescription: string;
  formulaSource?: string;
  howToSteps?: string[];
  regionalNote?: string;
  uniquenessNote?: string;
  exampleInput: number;
  primaryKeyword?: string;
  relatedKeywords?: string[];
  commonValues?: number[];
  priorityTier?: "A" | "B" | "C";
  benchmarks?: PracticalBenchmark[];
  faqs?: { question: string; answer: string }[];
}

export interface GuideArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  publishedDate: string;
  content: {
    heading: string;
    body: string;
  }[];
}
