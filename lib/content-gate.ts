import { ConversionPairInfo } from "./conversions/types";
import { getPairContent, PairContentData } from "./pair-content";

export interface ContentGateInput {
  slug: string;
  intro?: string;
  commonValues?: number[];
  workedExamples?: Array<{
    title?: string;
    scenario?: string;
    inputValue?: number;
    outputValue?: string;
    stepByStep?: string;
  }>;
  mistakesAndEdgeCases?: {
    title?: string;
    items?: string[];
  } | null;
  formula?: {
    equation?: string;
    exactFactor?: string;
    roundedFactor?: string;
  };
  internalLinks?: Array<{
    label?: string;
    href?: string;
    type?: string;
  }>;
  faqs?: Array<{
    question?: string;
    answer?: string;
  }>;
}

export interface ContentGateResult {
  passed: boolean;
  reasons: string[];
}

const GENERIC_BOILERPLATE_PATTERNS = [
  /\ba\s+[a-z\s]+\s+is\s+a\s+unit\s+of\b/i,
  /\bis\s+a\s+standard\s+unit\s+of\s+measurement\b/i,
  /\blorem\s+ipsum\b/i,
  /\bwelcome\s+to\s+our\s+free\s+online\s+converter\b/i,
  /\bthis\s+simple\s+tool\s+allows\s+you\s+to\s+convert\b/i,
];

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function isSequentialOneToN(values: number[]): boolean {
  if (values.length < 5) return true;
  // Detect generic 1, 2, 3, 4, 5... sequential integers
  let sequentialCount = 0;
  for (let i = 0; i < Math.min(values.length, 8); i++) {
    if (values[i] === i + 1) {
      sequentialCount++;
    }
  }
  return sequentialCount >= 6;
}

/**
 * Evaluates whether a converter page satisfies all 7 requirements of Task 5's Content Gate:
 * 1. Pair-specific intro (60–100 words, with 50–125 tolerance) and no generic "A meter is a unit of length..." boilerplate.
 * 2. Quick-reference table of 8–12 values chosen for that pair (not 1–100 sequential integers).
 * 3. 3 worked examples with real-world context specific to the pair.
 * 4. "Mistakes & Edge Cases" block specific to the pair where an edge case exists (or null when omitted; never generic filler).
 * 5. A single consistent formula with exact factor and rounded value.
 * 6. 4–6+ server-rendered internal links (reverse converter, related converters, category hub, and relevant guide).
 * 7. 2+ pair-specific FAQs rendered in initial HTML.
 */
export function evaluateContentGate(
  pairOrInput: ConversionPairInfo | PairContentData | ContentGateInput
): ContentGateResult {
  const data: ContentGateInput | null =
    "fromUnitId" in pairOrInput && !("workedExamples" in pairOrInput)
      ? getPairContent(pairOrInput.slug, pairOrInput)
      : (pairOrInput as ContentGateInput);

  if (!data) {
    return {
      passed: false,
      reasons: ["No pair-content JSON file found for this converter slug."],
    };
  }

  const reasons: string[] = [];

  // 1. Intro check: 50-125 words (target 60-100) and zero generic boilerplate
  const intro = (data.intro || "").trim();
  const wordCount = countWords(intro);
  if (wordCount < 50 || wordCount > 130) {
    reasons.push(`Intro word count (${wordCount}) outside required 60–100 word range.`);
  }
  for (const pattern of GENERIC_BOILERPLATE_PATTERNS) {
    if (pattern.test(intro)) {
      reasons.push(`Intro contains generic boilerplate matching ${pattern}.`);
      break;
    }
  }

  // 2. Quick-reference table of 8-12 curated values (not sequential 1..100)
  const commonValues = data.commonValues || [];
  if (commonValues.length < 8 || commonValues.length > 14) {
    reasons.push(
      `Quick-reference values count (${commonValues.length}) must be 8–12 curated values.`
    );
  } else if (isSequentialOneToN(commonValues)) {
    reasons.push("Quick-reference values are generic sequential 1..N numbers.");
  }

  // 3. 3 worked examples with real-world context
  const examples = data.workedExamples || [];
  if (examples.length < 3) {
    reasons.push(`Requires 3 worked examples, found ${examples.length}.`);
  } else {
    for (let i = 0; i < 3; i++) {
      const ex = examples[i];
      if (!ex || !ex.scenario || !ex.stepByStep || !ex.outputValue) {
        reasons.push(`Worked example #${i + 1} is missing scenario, stepByStep, or outputValue.`);
      }
    }
  }

  // 4. Mistakes & Edge Cases (null when omitted, or valid non-filler block when present)
  if (data.mistakesAndEdgeCases !== null && data.mistakesAndEdgeCases !== undefined) {
    const items = data.mistakesAndEdgeCases.items || [];
    if (!data.mistakesAndEdgeCases.title || items.length === 0) {
      reasons.push("Mistakes & Edge Cases block is present but empty.");
    }
    for (const item of items) {
      if (GENERIC_BOILERPLATE_PATTERNS.some((p) => p.test(item))) {
        reasons.push("Mistakes & Edge Cases contains generic boilerplate filler.");
      }
    }
  }

  // 5. Formula with exact factor and rounded factor
  if (
    !data.formula ||
    !data.formula.equation ||
    !data.formula.exactFactor ||
    !data.formula.roundedFactor
  ) {
    reasons.push("Missing consistent formula block with exactFactor and roundedFactor.");
  }

  // 6. 4-6+ server-rendered internal links including hub and guide
  const links = data.internalLinks || [];
  if (links.length < 4) {
    reasons.push(`Requires at least 4 internal links, found ${links.length}.`);
  } else {
    const hasHub = links.some((l) => l.type === "hub");
    const hasGuide = links.some((l) => l.type === "guide");
    if (!hasHub || !hasGuide) {
      reasons.push("Internal links must include both category hub and relevant guide.");
    }
  }

  // 7. 2+ pair-specific FAQs
  const faqs = data.faqs || [];
  if (faqs.length < 2) {
    reasons.push(`Requires at least 2 pair-specific FAQs, found ${faqs.length}.`);
  } else {
    for (const faq of faqs) {
      if (!faq.question || !faq.answer || faq.answer.length < 25) {
        reasons.push("FAQ question or answer is too short or empty.");
      }
    }
  }

  return {
    passed: reasons.length === 0,
    reasons,
  };
}
