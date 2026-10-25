export type VerificationStatus = "verified" | "needs_human_verification";

export interface DensityStandardOption {
  id: string;
  label: string;
  shortLabel: string;
  densityGPerMl: number;
  gramsPerUsCup: number;
  gramsPerMetricCup: number;
  gramsPerUsLegalCup: number;
  gramsPerTbsp: number;
  gramsPerTsp: number;
  ouncesPerUsCup: number;
  sourceOrganization: string;
  sourceCitation: string;
  fdcId?: string;
  referenceUrl: string;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface IngredientMeasuringGuide {
  title: string;
  summary: string;
  steps: string[];
  avoidMistake: string;
}

export interface IngredientWorkedExample {
  title: string;
  scenario: string;
  formulaUsed: string;
  stepByStep: string;
  resultSummary: string;
}

export interface IngredientFaqItem {
  question: string;
  answer: string;
}

export interface CookingIngredient {
  slug: string;
  name: string;
  shortName: string;
  categoryGroup:
    | "Flours & Baking Staples"
    | "Sugars & Sweeteners"
    | "Dairy, Fats & Oils"
    | "Liquids, Grains & Seasonings";
  description: string;
  defaultDensityGPerMl: number;
  gramsPerUsCup: number;
  gramsPerMetricCup: number;
  gramsPerTbsp: number;
  gramsPerTsp: number;
  ouncesPerUsCup: number;
  verificationStatus: VerificationStatus;
  packingNote: string;
  culinaryTip: string;
  overviewParagraphs: string[];
  measuringGuide: IngredientMeasuringGuide;
  workedExamples: IngredientWorkedExample[];
  kitchenTips: string[];
  faqs: IngredientFaqItem[];
  standards: DensityStandardOption[];
}

export interface CookingUnit {
  id: string;
  name: string;
  plural: string;
  symbol: string;
  kind: "mass" | "volume";
  /** For mass units: grams per 1 unit. For volume units: milliliters per 1 unit. */
  toMetricBase: number;
}

export const US_CUP_ML = 236.5882365;
export const US_LEGAL_CUP_ML = 240;
export const METRIC_CUP_ML = 250;
export const UK_IMPERIAL_CUP_ML = 284.130625;
export const US_TBSP_ML = 14.78676478125;
export const US_TSP_ML = 4.92892159375;
export const US_FL_OZ_ML = 29.5735295625;
export const AVOIRDUPOIS_OZ_GRAMS = 28.349523125;
export const AVOIRDUPOIS_LB_GRAMS = 453.59237;

export interface RegionalCupStandard {
  id: string;
  name: string;
  regions: string;
  volumeMl: string;
  flOzEquivalent: string;
  tablespoons: string;
  notes: string;
}

export const REGIONAL_CUP_STANDARDS: RegionalCupStandard[] = [
  {
    id: "us_customary",
    name: "US Customary Cup",
    regions: "United States (Standard Cookbooks & Measuring Cups)",
    volumeMl: "236.59 mL",
    flOzEquivalent: "8 US fl oz",
    tablespoons: "16 US tbsp (14.79 mL each)",
    notes:
      "Defined as exactly 1/16 of a US liquid gallon (236.588 mL). Used by USDA FoodData Central, King Arthur Baking, and standard American kitchenware.",
  },
  {
    id: "us_legal",
    name: "US Legal / FDA Cup",
    regions: "United States (Nutrition Facts Labels)",
    volumeMl: "240.00 mL",
    flOzEquivalent: "8.12 US fl oz",
    tablespoons: "16 metric tbsp (15 mL each)",
    notes:
      "Mandated by the US Food and Drug Administration (21 CFR 101.9) for food package Nutrition Facts panels and serving size declarations.",
  },
  {
    id: "metric_cup",
    name: "Metric Cup (Commonwealth)",
    regions: "UK, Australia, New Zealand, Canada & South Africa",
    volumeMl: "250.00 mL",
    flOzEquivalent: "8.45 US fl oz (8.80 Imp fl oz)",
    tablespoons: "16.67 metric tbsp (15 mL each; 12.5 Australian 20 mL tbsp)",
    notes:
      "Standardized at exactly 250 milliliters (1/4 liter). Holds ~5.67% more volume and weight than a US Customary cup.",
  },
  {
    id: "uk_imperial",
    name: "UK Imperial Cup (Historical)",
    regions: "Pre-1970s British & Commonwealth Cookbooks",
    volumeMl: "284.13 mL",
    flOzEquivalent: "10 Imperial fl oz (9.61 US fl oz)",
    tablespoons: "16 Imperial tbsp (17.76 mL each)",
    notes:
      "Defined as half an Imperial pint (284.13 mL). Rarely used in modern kitchens, which now use grams or the 250 mL metric cup, but essential for vintage British recipes.",
  },
];

export const COOKING_UNITS: CookingUnit[] = [
  // Mass Units (base = 1 gram)
  {
    id: "g",
    name: "Gram",
    plural: "Grams",
    symbol: "g",
    kind: "mass",
    toMetricBase: 1,
  },
  {
    id: "oz",
    name: "Ounce (Weight)",
    plural: "Ounces (oz)",
    symbol: "oz",
    kind: "mass",
    toMetricBase: AVOIRDUPOIS_OZ_GRAMS,
  },
  {
    id: "lb",
    name: "Pound",
    plural: "Pounds (lb)",
    symbol: "lb",
    kind: "mass",
    toMetricBase: AVOIRDUPOIS_LB_GRAMS,
  },
  {
    id: "kg",
    name: "Kilogram",
    plural: "Kilograms (kg)",
    symbol: "kg",
    kind: "mass",
    toMetricBase: 1000,
  },

  // Volume Units (base = 1 milliliter)
  {
    id: "cup",
    name: "US Customary Cup (236.59 mL)",
    plural: "US Cups (236.59 mL)",
    symbol: "US cup",
    kind: "volume",
    toMetricBase: US_CUP_ML,
  },
  {
    id: "metric_cup",
    name: "Metric Cup (250 mL)",
    plural: "Metric Cups (250 mL)",
    symbol: "metric cup",
    kind: "volume",
    toMetricBase: METRIC_CUP_ML,
  },
  {
    id: "us_legal_cup",
    name: "US Legal / FDA Cup (240 mL)",
    plural: "US Legal Cups (240 mL)",
    symbol: "US legal cup",
    kind: "volume",
    toMetricBase: US_LEGAL_CUP_ML,
  },
  {
    id: "uk_imperial_cup",
    name: "UK Imperial Cup (284.13 mL)",
    plural: "UK Imperial Cups (284.13 mL)",
    symbol: "UK cup",
    kind: "volume",
    toMetricBase: UK_IMPERIAL_CUP_ML,
  },
  {
    id: "tbsp",
    name: "US Tablespoon (14.79 mL)",
    plural: "Tablespoons (tbsp)",
    symbol: "tbsp",
    kind: "volume",
    toMetricBase: US_TBSP_ML,
  },
  {
    id: "tsp",
    name: "US Teaspoon (4.93 mL)",
    plural: "Teaspoons (tsp)",
    symbol: "tsp",
    kind: "volume",
    toMetricBase: US_TSP_ML,
  },
  {
    id: "ml",
    name: "Milliliter",
    plural: "Milliliters (mL)",
    symbol: "mL",
    kind: "volume",
    toMetricBase: 1,
  },
  {
    id: "fl_oz",
    name: "US Fluid Ounce",
    plural: "Fluid Ounces (fl oz)",
    symbol: "fl oz",
    kind: "volume",
    toMetricBase: US_FL_OZ_ML,
  },
  {
    id: "pint",
    name: "US Liquid Pint",
    plural: "US Pints (pt)",
    symbol: "pt",
    kind: "volume",
    toMetricBase: 473.176473,
  },
  {
    id: "quart",
    name: "US Liquid Quart",
    plural: "US Quarts (qt)",
    symbol: "qt",
    kind: "volume",
    toMetricBase: 946.352946,
  },
  {
    id: "liter",
    name: "Liter",
    plural: "Liters (L)",
    symbol: "L",
    kind: "volume",
    toMetricBase: 1000,
  },
  {
    id: "gallon",
    name: "US Liquid Gallon",
    plural: "US Gallons (gal)",
    symbol: "gal",
    kind: "volume",
    toMetricBase: 3785.411784,
  },
];

export const COOKING_UNIT_MAP = new Map<string, CookingUnit>(
  COOKING_UNITS.map((u) => [u.id, u])
);

export const COOKING_DISCLAIMER_TEXT =
  "Cooking results are approximate. Values vary by brand, humidity, sifting, and how firmly you pack the measuring cup. For high-precision baking, weighing dry ingredients in grams on a digital kitchen scale is recommended.";

export const COOKING_PACKING_NOTE =
  "Values vary by brand, humidity and how you pack the cup.";

function buildStandardFromCupGrams(params: {
  id: string;
  label: string;
  shortLabel: string;
  gramsPerUsCup: number;
  sourceOrganization: string;
  sourceCitation: string;
  fdcId?: string;
  referenceUrl: string;
  verificationStatus?: VerificationStatus;
  notes?: string;
}): DensityStandardOption {
  const densityGPerMl = Number((params.gramsPerUsCup / US_CUP_ML).toFixed(4));
  const gramsPerMetricCup = Number(
    ((params.gramsPerUsCup / US_CUP_ML) * METRIC_CUP_ML).toFixed(1)
  );
  const gramsPerUsLegalCup = Number(
    ((params.gramsPerUsCup / US_CUP_ML) * US_LEGAL_CUP_ML).toFixed(1)
  );
  const gramsPerTbsp = Number((params.gramsPerUsCup / 16).toFixed(2));
  const gramsPerTsp = Number((params.gramsPerUsCup / 48).toFixed(2));
  const ouncesPerUsCup = Number(
    (params.gramsPerUsCup / AVOIRDUPOIS_OZ_GRAMS).toFixed(2)
  );
  return {
    id: params.id,
    label: params.label,
    shortLabel: params.shortLabel,
    densityGPerMl,
    gramsPerUsCup: params.gramsPerUsCup,
    gramsPerMetricCup,
    gramsPerUsLegalCup,
    gramsPerTbsp,
    gramsPerTsp,
    ouncesPerUsCup,
    sourceOrganization: params.sourceOrganization,
    sourceCitation: params.sourceCitation,
    fdcId: params.fdcId,
    referenceUrl: params.referenceUrl,
    verificationStatus: params.verificationStatus ?? "verified",
    notes: params.notes,
  };
}

export const COOKING_INGREDIENTS: CookingIngredient[] = [
  {
    slug: "flour",
    name: "All-Purpose Flour",
    shortName: "Flour",
    categoryGroup: "Flours & Baking Staples",
    description:
      "Convert all-purpose wheat flour between grams (g), ounces (oz), US cups (236.59 mL), Metric cups (250 mL), tablespoons (tbsp), teaspoons (tsp), and milliliters (mL) using published USDA FoodData Central and King Arthur Baking density references.",
    defaultDensityGPerMl: 0.5283,
    gramsPerUsCup: 125,
    gramsPerMetricCup: 132.1,
    gramsPerTbsp: 7.81,
    gramsPerTsp: 2.6,
    ouncesPerUsCup: 4.41,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Dipping a measuring cup directly into a flour canister can pack up to 140–155 g per cup. Fluff the flour with a fork, spoon it gently into the cup, and level the top with a straight edge.",
    overviewParagraphs: [
      "Converting cups of all-purpose flour to grams is the single most important adjustment you can make for consistent baking. Because flour is a fine, compressible powder, its bulk density shifts dramatically depending on whether it has settled in the bag, absorbed ambient humidity, or been scooped directly with a measuring cup.",
      "According to USDA FoodData Central (FDC ID 169761), 1 US Customary cup (236.59 mL) of unsifted all-purpose wheat flour weighs 125 grams (4.41 oz), corresponding to a bulk density of 0.5283 g/mL. If you are following a recipe written for King Arthur Baking Company's test kitchen, their official spooned-and-leveled standard is 120 grams per US cup (0.5072 g/mL). Meanwhile, a Commonwealth Metric cup (250 mL) holds 132.1 grams of flour at USDA density.",
    ],
    measuringGuide: {
      title: "How to Measure All-Purpose Flour Accurately (Spoon & Level Method)",
      summary:
        "Professional bakers and test kitchens never dip the measuring cup directly into the flour bin unless a recipe explicitly specifies the 'dip-and-sweep' method.",
      steps: [
        "Fluff and aerate: Stir the flour inside its bag or canister with a whisk, fork, or spoon to break up compacted pockets formed during storage.",
        "Spoon lightly into the cup: Using a large spoon, gently transfer spoonfuls of aerated flour into your dry measuring cup until it forms a slight mound above the rim. Do not shake or tap the cup on the counter.",
        "Level with a straight edge: Sweep the back of a flat dinner knife or bench scraper straight across the rim of the measuring cup so excess flour falls back into the container.",
      ],
      avoidMistake:
        "Scooping the measuring cup directly into a flour canister acts like a piston, compacting the flour and adding 20% to 25% more weight (145 g to 160 g per cup), which makes cakes dry, cookies cakey, and bread dough stiff.",
    },
    workedExamples: [
      {
        title: "Convert 2 ½ US Cups of Flour to Grams",
        scenario:
          "A cookie recipe calls for 2.5 US cups of all-purpose flour using the standard USDA reference (125 g per US cup).",
        formulaUsed: "Grams = US Cups × 125 g/cup (or Volume in mL × 0.5283 g/mL)",
        stepByStep: "2.5 US cups × 125 g/cup = 312.5 grams (or 300 grams using King Arthur's 120 g/cup standard)",
        resultSummary: "2 ½ US cups of all-purpose flour = 312.5 g (USDA) or 300 g (King Arthur).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Flour to Grams",
        scenario:
          "You are baking from an Australian, UK, or New Zealand recipe that specifies 1 Metric cup (250 mL) of plain flour.",
        formulaUsed: "Grams = 250 mL × 0.5283 g/mL",
        stepByStep: "250 mL × 0.5283 g/mL = 132.08 grams (≈ 132.1 g)",
        resultSummary: "1 Metric cup (250 mL) of all-purpose flour = 132.1 g (4.66 oz).",
      },
      {
        title: "Convert 200 Grams of Flour to US Cups & Tablespoons",
        scenario:
          "A European pastry recipe calls for 200 g of plain flour, and you want to measure it using US cups and tablespoons.",
        formulaUsed: "US Cups = Grams ÷ 125 g/cup",
        stepByStep: "200 g ÷ 125 g/cup = 1.6 US cups (1 US cup + 9.6 tablespoons, or 1 ½ cups + 1.6 tbsp)",
        resultSummary: "200 g of all-purpose flour = 1.60 US cups (1 ½ cups + 1 tbsp + 2 tsp).",
      },
    ],
    kitchenTips: [
      "All-purpose flour vs. cake flour: Cake flour and pastry flour are milled finer and contain less protein, weighing about 114–120 g per US cup, whereas bread flour weighs 125–127 g per US cup.",
      "Sifted flour vs. flour, sifted: '1 cup sifted flour' means sift before measuring (~110–115 g), while '1 cup flour, sifted' means measure 1 cup (125 g) first and then sift it into the bowl.",
      "Humidity effect: On humid summer days, wheat flour absorbs moisture from the air and packs more densely; weighing in grams automatically compensates for fluffiness changes.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of all-purpose flour?",
        answer:
          "1 US Customary cup (236.59 mL) of all-purpose flour weighs 125 grams (4.41 oz) according to USDA FoodData Central, or 120 grams (4.25 oz) using the King Arthur Baking spooned-and-leveled chart. If you use a 250 mL Metric cup (UK, Australia, NZ, Canada), 1 cup of flour weighs 132.1 grams.",
      },
      {
        question: "Why does King Arthur say 120g per cup of flour while USDA says 125g?",
        answer:
          "Both measurements are accurate for their testing methods. USDA FoodData Central (125 g/cup) reflects average consumer spooned unsifted flour, while King Arthur Baking (120 g/cup) aerates the flour thoroughly before lightly spooning and leveling. You can switch between both standards in the converter above.",
      },
      {
        question: "How many tablespoons are in 1/4 cup or 50 grams of flour?",
        answer:
          "1/4 US cup of flour equals 4 tablespoons and weighs 31.25 grams (at 125 g/cup). Conversely, 50 grams of all-purpose flour equals 0.4 US cups, or about 6.4 US tablespoons (6 tablespoons + 1 ¼ teaspoons).",
      },
      {
        question: "Does self-rising flour weigh the same as all-purpose flour?",
        answer:
          "Self-rising flour contains baking powder and salt blended into soft wheat flour. It is slightly lighter when aerated, averaging 113–125 grams per US cup depending on the brand.",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central (125 g / US cup)",
        shortLabel: "USDA (125 g/cup)",
        gramsPerUsCup: 125,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 169761 / 789890",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Wheat flour, white, all-purpose, enriched, bleached (FDC ID 169761, SR Legacy) — 1 cup = 125 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
        notes: "Standard USDA unsifted spooned cup reference.",
      }),
      buildStandardFromCupGrams({
        id: "king_arthur",
        label: "King Arthur Baking Guide (120 g / US cup)",
        shortLabel: "King Arthur (120 g/cup)",
        gramsPerUsCup: 120,
        sourceOrganization: "King Arthur Baking Company",
        sourceCitation:
          "King Arthur Baking Company Official Ingredient Weight Chart: All-Purpose Flour (spooned & leveled) — 1 US cup = 120 g (4.25 oz).",
        referenceUrl: "https://www.kingarthurbaking.com/learn/ingredient-weight-chart",
        notes: "Spooned and leveled method used in King Arthur test kitchens.",
      }),
    ],
  },
  {
    slug: "sugar",
    name: "Granulated White Sugar",
    shortName: "Sugar (Granulated)",
    categoryGroup: "Sugars & Sweeteners",
    description:
      "Convert granulated white cane or beet sugar between grams, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, milliliters, and ounces using USDA FoodData Central and Domino / King Arthur Baking standards.",
    defaultDensityGPerMl: 0.8453,
    gramsPerUsCup: 200,
    gramsPerMetricCup: 211.3,
    gramsPerTbsp: 12.5,
    gramsPerTsp: 4.17,
    ouncesPerUsCup: 7.05,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Granulated sugar crystals settle predictably and do not compress as much as flour, making 200 g per US cup one of the most consistent dry kitchen conversions.",
    overviewParagraphs: [
      "Granulated white sugar (refined cane or beet sucrose) consists of uniform crystalline granules that flow freely and resist compression. Unlike flour or powdered sugar, scooping granulated sugar directly from the canister yields nearly the exact same weight as spooning it into a dry measuring cup.",
      "Under USDA FoodData Central (FDC ID 169655), 1 US Customary cup (236.59 mL) of granulated sugar weighs exactly 200 grams (7.05 oz), giving a bulk density of 0.8453 g/mL. King Arthur Baking and Domino Sugar list 198 grams (7.0 oz) per US cup. If you are measuring with a 250 mL Metric cup, 1 cup of granulated white sugar weighs 211.3 grams.",
    ],
    measuringGuide: {
      title: "How to Measure Granulated White Sugar Accurately",
      summary:
        "Because crystalline white sugar does not trap pockets of air like flour, measuring it by volume is straightforward as long as you use a dry measuring cup.",
      steps: [
        "Use a dry cup, not a liquid pitcher: Scoop or pour granulated sugar into a flat-rimmed dry measuring cup rather than a spouted glass pitcher.",
        "Break up any hard clumps: If humidity has caused small sugar lumps to form, crush them with the back of a spoon before filling the cup.",
        "Sweep level across the rim: Use a straight edge or knife blade to level the sugar flush with the top of the cup without pressing down.",
      ],
      avoidMistake:
        "Do not confuse fluid ounces (fl oz) with weight ounces (oz): 1 US cup of sugar is 8 fluid ounces by volume, which weighs 7.05 avoirdupois ounces (200 g)—not 8 ounces (227 g).",
    },
    workedExamples: [
      {
        title: "Convert 3/4 US Cup of Granulated Sugar to Grams",
        scenario:
          "A muffin recipe requires 3/4 US cup of granulated white sugar.",
        formulaUsed: "Grams = US Cups × 200 g/cup",
        stepByStep: "0.75 US cups × 200 g/cup = 150 grams",
        resultSummary: "3/4 US cup of granulated sugar = 150 g (5.29 oz).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Sugar to Grams",
        scenario:
          "An Australian pavlova recipe calls for 1 Metric cup (250 mL) of white sugar.",
        formulaUsed: "Grams = 250 mL × 0.8453 g/mL",
        stepByStep: "250 mL × 0.8453 g/mL = 211.33 grams (≈ 211.3 g)",
        resultSummary: "1 Metric cup (250 mL) of granulated sugar = 211.3 g (7.45 oz).",
      },
      {
        title: "Convert 100 Grams of Sugar to US Cups & Tablespoons",
        scenario:
          "A French custard recipe specifies 100 g of sugar.",
        formulaUsed: "US Cups = 100 g ÷ 200 g/cup",
        stepByStep: "100 g ÷ 200 g/cup = 0.5 US cups (8 US tablespoons)",
        resultSummary: "100 g of granulated white sugar = 1/2 US cup (8 tbsp).",
      },
    ],
    kitchenTips: [
      "Caster (superfine) sugar: Finer crystals pack slightly closer together than regular granulated sugar; 1 US cup of caster sugar weighs approximately 210–225 g.",
      "Coarse sanding or turbinado sugar: Larger crystals leave more air space between grains, weighing slightly less (~180–190 g per US cup).",
      "Sugar acts as a liquid in baking: Beyond sweetness, sugar binds moisture, tenderizes gluten, and promotes caramelization and crisp edges.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of granulated white sugar?",
        answer:
          "1 US Customary cup (236.59 mL) of granulated white sugar weighs 200 grams (7.05 oz) according to USDA FoodData Central, or 198 grams (7.0 oz) according to King Arthur Baking. A 250 mL Metric cup of white sugar weighs 211.3 grams.",
      },
      {
        question: "How many grams are in 1 tablespoon and 1 teaspoon of sugar?",
        answer:
          "1 US tablespoon (14.79 mL) of granulated white sugar weighs 12.5 grams, and 1 US teaspoon (4.93 mL) weighs 4.17 grams (often rounded to 4.2 g on nutrition labels).",
      },
      {
        question: "Why does 1 cup of sugar weigh 200g while 1 cup of flour weighs 125g?",
        answer:
          "Sucrose crystals are much denser (0.8453 g/mL) than milled wheat starch and protein particles (0.5283 g/mL). Even though both occupy 236.59 mL of volume, the sugar cup has 60% more mass.",
      },
      {
        question: "How many cups is 250 grams of sugar?",
        answer:
          "At 200 grams per US cup, 250 grams of granulated sugar equals exactly 1 ¼ US cups (1.25 cups, or 1 cup + 4 tablespoons).",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central (200 g / US cup)",
        shortLabel: "USDA (200 g/cup)",
        gramsPerUsCup: 200,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 169655 / 748672",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Sugars, granulated (FDC ID 169655, SR Legacy) — 1 cup = 200 g, 1 tsp = 4.2 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
      buildStandardFromCupGrams({
        id: "king_arthur",
        label: "King Arthur Baking / Domino Sugar (198 g / US cup)",
        shortLabel: "King Arthur / Domino (198 g/cup)",
        gramsPerUsCup: 198,
        sourceOrganization: "King Arthur Baking Company & Domino Sugar",
        sourceCitation:
          "King Arthur Baking Company Ingredient Weight Chart & Domino Sugar Measurement Guide: Granulated White Sugar — 1 US cup = 198 g (7.0 oz).",
        referenceUrl: "https://www.kingarthurbaking.com/learn/ingredient-weight-chart",
      }),
    ],
  },
  {
    slug: "brown-sugar",
    name: "Brown Sugar (Packed)",
    shortName: "Sugar (Brown)",
    categoryGroup: "Sugars & Sweeteners",
    description:
      "Convert light or dark packed brown sugar between grams, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, milliliters, and ounces using published USDA FoodData Central and King Arthur Baking density tables.",
    defaultDensityGPerMl: 0.9299,
    gramsPerUsCup: 220,
    gramsPerMetricCup: 232.5,
    gramsPerTbsp: 13.75,
    gramsPerTsp: 4.58,
    ouncesPerUsCup: 7.76,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Brown sugar is traditionally measured firmly packed into the cup so it holds its shape when inverted. Unpacked brown sugar weighs only ~145 g per cup.",
    overviewParagraphs: [
      "Brown sugar consists of sucrose crystals coated in cane molasses (about 3.5% molasses for light brown sugar and 6.5% for dark brown sugar). Because the thin film of molasses causes the crystals to cling together and trap large air pockets when loose, almost all baking recipes specify 'packed brown sugar'.",
      "According to USDA FoodData Central (FDC ID 168833), 1 US Customary cup (236.59 mL) of firmly packed brown sugar weighs 220 grams (7.76 oz), with a bulk density of 0.9299 g/mL. King Arthur Baking uses a slightly lighter pack of 213 grams (7.5 oz) per US cup. In a 250 mL Metric cup, packed brown sugar weighs 232.5 grams.",
    ],
    measuringGuide: {
      title: "How to Pack and Measure Brown Sugar Correctly",
      summary:
        "Unlike flour, brown sugar must be pressed into the dry measuring cup to eliminate air voids created by the sticky molasses coating.",
      steps: [
        "Ensure the brown sugar is soft and moist: If your brown sugar has hardened into blocks, soften it first so it compresses evenly.",
        "Scoop and press firmly in layers: Spoon brown sugar into a dry measuring cup and press down with the back of a spoon or your knuckles until the air pockets collapse.",
        "Level the rim and test the hold: Fill to the top, press level with the rim, and invert into your mixing bowl—properly packed brown sugar should hold the shape of the cup like wet sand.",
      ],
      avoidMistake:
        "Measuring brown sugar loosely without packing yields only ~145 g per US cup instead of 213–220 g, reducing sugar by a third and leaving cookies flat, pale, and dry.",
    },
    workedExamples: [
      {
        title: "Convert 1/2 US Cup of Packed Brown Sugar to Grams",
        scenario:
          "A chocolate chip cookie recipe requires 1/2 US cup of packed dark brown sugar.",
        formulaUsed: "Grams = US Cups × 220 g/cup",
        stepByStep: "0.5 US cups × 220 g/cup = 110 grams (or 106.5 g using King Arthur's 213 g/cup chart)",
        resultSummary: "1/2 US cup of packed brown sugar = 110 g (3.88 oz).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Brown Sugar to Grams",
        scenario:
          "A Commonwealth sticky toffee pudding recipe calls for 1 Metric cup (250 mL) of packed brown sugar.",
        formulaUsed: "Grams = 250 mL × 0.9299 g/mL",
        stepByStep: "250 mL × 0.9299 g/mL = 232.48 grams (≈ 232.5 g)",
        resultSummary: "1 Metric cup (250 mL) of packed brown sugar = 232.5 g (8.20 oz).",
      },
      {
        title: "Convert 150 Grams of Brown Sugar to US Cups",
        scenario:
          "You have 150 g of light brown sugar and want to know the packed US cup equivalent.",
        formulaUsed: "US Cups = 150 g ÷ 220 g/cup",
        stepByStep: "150 g ÷ 220 g/cup = 0.6818 US cups (just over 2/3 cup, or 10.9 tablespoons)",
        resultSummary: "150 g of packed brown sugar ≈ 2/3 US cup (0.68 cups).",
      },
    ],
    kitchenTips: [
      "Light vs. dark brown sugar weight: Light and dark brown sugar have virtually identical packed weights (213–220 g per US cup), though dark brown sugar adds deeper caramel flavor and slightly more acidity.",
      "Why weighing beats packing: Every baker presses brown sugar with a different amount of force (ranging from 195 g to 245 g per cup). Weighing on a digital scale eliminates packing guesswork.",
      "Homemade substitute: If you run out of brown sugar, combine 1 US cup (200 g) of white granulated sugar with 1 to 2 tablespoons (20–40 g) of unsulfured molasses.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of packed brown sugar?",
        answer:
          "1 US Customary cup (236.59 mL) of packed light or dark brown sugar weighs 220 grams (7.76 oz) according to USDA FoodData Central, or 213 grams (7.5 oz) according to King Arthur Baking. In a 250 mL Metric cup, 1 packed cup weighs 232.5 grams.",
      },
      {
        question: "How much does 1 cup of unpacked brown sugar weigh?",
        answer:
          "According to USDA FoodData Central (FDC ID 168833), 1 US cup of loose, unpacked brown sugar weighs approximately 145 grams—about 75 grams less than a packed cup.",
      },
      {
        question: "Do light and dark brown sugar weigh the same per cup?",
        answer:
          "Yes, both light and dark refined cane brown sugars use the same 213–220 g per packed US cup reference in professional test kitchens. Muscovado sugar is slightly moister and heavier (~225–235 g/cup).",
      },
      {
        question: "How many tablespoons are in 100 grams of brown sugar?",
        answer:
          "At 13.75 grams per packed US tablespoon, 100 grams of brown sugar equals approximately 7.27 packed tablespoons (Just under 1/2 cup).",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central — Packed (220 g / US cup)",
        shortLabel: "USDA Packed (220 g/cup)",
        gramsPerUsCup: 220,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 168833",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Sugars, brown (FDC ID 168833, SR Legacy) — 1 cup packed = 220 g (unpacked = 145 g).",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
      buildStandardFromCupGrams({
        id: "king_arthur",
        label: "King Arthur Baking — Packed (213 g / US cup)",
        shortLabel: "King Arthur (213 g/cup)",
        gramsPerUsCup: 213,
        sourceOrganization: "King Arthur Baking Company",
        sourceCitation:
          "King Arthur Baking Company Ingredient Weight Chart: Light or Dark Brown Sugar (packed) — 1 US cup = 213 g (7.5 oz).",
        referenceUrl: "https://www.kingarthurbaking.com/learn/ingredient-weight-chart",
      }),
    ],
  },
  {
    slug: "powdered-sugar",
    name: "Powdered Sugar (Confectioners' / Icing)",
    shortName: "Sugar (Powdered)",
    categoryGroup: "Sugars & Sweeteners",
    description:
      "Convert powdered (confectioners' / 10X icing) sugar between grams, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, milliliters, and ounces with published USDA FoodData Central and Domino / King Arthur Baking references.",
    defaultDensityGPerMl: 0.5072,
    gramsPerUsCup: 120,
    gramsPerMetricCup: 126.8,
    gramsPerTbsp: 7.5,
    gramsPerTsp: 2.5,
    ouncesPerUsCup: 4.23,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Powdered sugar contains ~3% cornstarch and aerates heavily when sifted. Sifted powdered sugar weighs ~100 g/cup, whereas unsifted spooned powdered sugar weighs 113–120 g/cup.",
    overviewParagraphs: [
      "Powdered sugar—known as confectioners' sugar or 10X sugar in the United States and icing sugar in the UK, Australia, and Canada—is granulated sucrose milled into a superfine powder and blended with about 3% cornstarch to prevent caking. Because the particles are microscopic, powdered sugar behaves much like flour and traps substantial air.",
      "According to USDA FoodData Central (FDC ID 169656), 1 US Customary cup (236.59 mL) of unsifted powdered sugar weighs 120 grams (4.23 oz) at a density of 0.5072 g/mL. King Arthur Baking and Domino Sugar use 113 grams (4.0 oz) per US cup. In a 250 mL Metric cup, 1 cup of icing sugar weighs 126.8 grams.",
    ],
    measuringGuide: {
      title: "How to Measure Powdered (Confectioners') Sugar Accurately",
      summary:
        "Always check whether your frosting or macaron recipe calls for 'unsifted powdered sugar, then sifted' or 'sifted powdered sugar'.",
      steps: [
        "Spoon lightly into the cup: Stir the powdered sugar in its bag or box, then spoon it gently into a dry measuring cup without tapping or pressing down.",
        "Level with a knife: Sweep a straight edge across the rim of the cup for an accurate 113–120 g unsifted cup.",
        "Sift after measuring for smooth frostings: Unless a recipe states '1 cup sifted powdered sugar' (~100 g), measure or weigh your powdered sugar first and pass it through a fine-mesh sieve into your mixing bowl to remove lumps.",
      ],
      avoidMistake:
        "Scooping a dry measuring cup forcefully into a compacted box of powdered sugar can pull up to 140–150 g per cup, making royal icing or American buttercream overly stiff and gritty.",
    },
    workedExamples: [
      {
        title: "Convert 2 US Cups of Powdered Sugar to Grams for Buttercream",
        scenario:
          "A vanilla buttercream frosting recipe requires 2 US cups of unsifted powdered sugar.",
        formulaUsed: "Grams = US Cups × 120 g/cup",
        stepByStep: "2 US cups × 120 g/cup = 240 grams (or 226 g using Domino/King Arthur's 113 g/cup chart)",
        resultSummary: "2 US cups of powdered sugar = 240 g (USDA) or 226 g (King Arthur).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Icing Sugar to Grams",
        scenario:
          "A UK or Australian glaze recipe calls for 1 Metric cup (250 mL) of icing sugar.",
        formulaUsed: "Grams = 250 mL × 0.5072 g/mL",
        stepByStep: "250 mL × 0.5072 g/mL = 126.8 grams",
        resultSummary: "1 Metric cup (250 mL) of icing/powdered sugar = 126.8 g (4.47 oz).",
      },
      {
        title: "Convert 454 Grams (1 lb Box) of Powdered Sugar to US Cups",
        scenario:
          "A standard American 1-pound (16 oz / 454 g) box of confectioners' sugar is used for frosting.",
        formulaUsed: "US Cups = 453.6 g ÷ 120 g/cup (USDA) or ÷ 113.4 g/cup (Domino)",
        stepByStep: "453.6 g ÷ 120 g/cup = 3.78 US cups (or exactly 4.0 US cups at Domino's 113.4 g/cup standard)",
        resultSummary: "1 lb (454 g) box of powdered sugar = 3 ¾ to 4 US cups unsifted.",
      },
    ],
    kitchenTips: [
      "1-pound box rule of thumb: Domino and C&H formulate their 1 lb (454 g) boxes of 10X powdered sugar to equal approximately 3 ¾ to 4 spooned US cups.",
      "French macarons require a scale: Macaron shells depend on an exact almond flour-to-powdered sugar ratio by weight; even a 10-gram cup measurement error can cause hollow or cracked shells.",
      "Organic powdered sugar: Often uses tapioca starch instead of cornstarch and has a slightly coarser grind (~115–120 g per US cup).",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of powdered sugar?",
        answer:
          "1 US Customary cup (236.59 mL) of unsifted powdered (confectioners') sugar weighs 120 grams (4.23 oz) per USDA FoodData Central, or 113 grams (4.0 oz) per King Arthur Baking and Domino Sugar. If sifted before measuring, 1 US cup weighs about 100 grams.",
      },
      {
        question: "How many cups of powdered sugar are in a 1 lb (16 oz) box?",
        answer:
          "A standard 1-pound (454 g) box of powdered sugar contains about 3 ¾ US cups using the USDA 120 g/cup standard, or 4 US cups using the 113 g/cup (4 oz/cup) manufacturer standard.",
      },
      {
        question: "Are powdered sugar, confectioners' sugar, and icing sugar the same thing?",
        answer:
          "Yes. It is called powdered sugar or confectioners' sugar (10X) in the United States, and icing sugar in the UK, Canada, Australia, and New Zealand.",
      },
      {
        question: "How many grams is 1 tablespoon of powdered sugar?",
        answer:
          "1 US tablespoon of unsifted powdered sugar weighs 7.5 grams (USDA) to 8 grams, and 1 US teaspoon weighs 2.5 grams.",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central — Unsifted (120 g / US cup)",
        shortLabel: "USDA Unsifted (120 g/cup)",
        gramsPerUsCup: 120,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 169656",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Sugars, powdered (FDC ID 169656, SR Legacy) — 1 cup unsifted = 120 g, 1 tbsp = 8 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
      buildStandardFromCupGrams({
        id: "king_arthur",
        label: "King Arthur Baking / Domino Sugar (113 g / US cup)",
        shortLabel: "King Arthur / Domino (113 g/cup)",
        gramsPerUsCup: 113,
        sourceOrganization: "King Arthur Baking Company & Domino Sugar",
        sourceCitation:
          "King Arthur Baking Company Ingredient Weight Chart & Domino 10X Confectioners Sugar Guide — 1 US cup = 113 g (4.0 oz).",
        referenceUrl: "https://www.kingarthurbaking.com/learn/ingredient-weight-chart",
      }),
    ],
  },
  {
    slug: "butter",
    name: "Butter (Salted & Unsalted)",
    shortName: "Butter",
    categoryGroup: "Dairy, Fats & Oils",
    description:
      "Convert butter between grams, US cups (236.59 mL), Metric cups (250 mL), sticks, tablespoons, teaspoons, milliliters, and ounces using USDA FoodData Central and US Dairy packaging standards (1 US cup = 2 sticks = 226.8 g).",
    defaultDensityGPerMl: 0.9586,
    gramsPerUsCup: 226.8,
    gramsPerMetricCup: 239.7,
    gramsPerTbsp: 14.18,
    gramsPerTsp: 4.73,
    ouncesPerUsCup: 8.0,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "In the United States, 1 cup of butter equals exactly 2 standard sticks (8.0 avoirdupois ounces = 226.8 g, rounded to 227 g on nutrition labels). 1 tablespoon of butter is 1/8 of a stick (14.2 g).",
    overviewParagraphs: [
      "Butter is a water-in-oil dairy emulsion containing roughly 80%–82% milkfat, 16%–18% water, and 1%–2% milk solids. Because solid butter is awkward to press into a measuring cup without leaving air gaps, converting cups and tablespoons of butter directly into grams (or counting wrapper stick markings) is much faster and cleaner.",
      "In the United States, butter is sold in 1-pound (453.6 g) boxes divided into 4 sticks. Each stick equals 1/2 US cup (8 tablespoons, 4 oz weight, or 113.4 grams). Therefore, 1 US Customary cup (236.59 mL) of butter equals 2 sticks or 226.8 grams (often rounded to 227 g), with a density of 0.9586 g/mL. In a 250 mL Metric cup, 1 cup of butter weighs 239.7 grams (often rounded to 240 g).",
    ],
    measuringGuide: {
      title: "How to Measure Butter by Sticks, Grams, or Displacement",
      summary:
        "Whether you are using American 4-ounce sticks or European/Commonwealth 250 g and 500 g blocks, weighing butter on a scale avoids messy cup packing.",
      steps: [
        "Use wrapper lines on US butter sticks: 1 standard US stick = 1/2 cup = 8 tablespoons = 113.4 g (113 g). Each tablespoon line on the wax wrapper equals 14.2 grams.",
        "Weigh block butter directly on a scale: In the UK, Europe, Australia, and New Zealand, butter is sold in 250 g or 500 g blocks rather than 113 g sticks. Place a plate on your digital scale, tare to zero, and slice off the exact gram weight.",
        "Avoid packing cold butter into dry cups: Pressing firm butter into a measuring cup traps air pockets at the bottom of the cup and wastes butter clinging to the sides.",
      ],
      avoidMistake:
        "Note that Australian tablespoons equal 20 mL (4 teaspoons, ~19.2 g of butter), whereas US, UK, and Canadian tablespoons equal ~14.8–15 mL (3 teaspoons, ~14.2 g of butter).",
    },
    workedExamples: [
      {
        title: "Convert 1 Stick (1/2 US Cup) of Butter to Grams",
        scenario:
          "An American brownie recipe calls for 1 stick (1/2 cup or 8 tablespoons) of unsalted butter.",
        formulaUsed: "Grams = 0.5 US cups × 226.8 g/cup",
        stepByStep: "0.5 × 226.8 g = 113.4 grams (rounded to 113 g in most baking charts)",
        resultSummary: "1 US stick (1/2 US cup / 8 tbsp) of butter = 113.4 g (4.0 oz).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Butter to Grams",
        scenario:
          "A recipe written for a 250 mL Metric cup calls for 1 cup of softened butter.",
        formulaUsed: "Grams = 250 mL × 0.9586 g/mL",
        stepByStep: "250 mL × 0.9586 g/mL = 239.65 grams (≈ 240 g)",
        resultSummary: "1 Metric cup (250 mL) of butter = 239.7 g (8.45 oz).",
      },
      {
        title: "Convert 150 Grams of Butter to US Cups, Sticks & Tablespoons",
        scenario:
          "A French brioche recipe calls for 150 g of butter, and you are using US stick butter.",
        formulaUsed: "Tablespoons = 150 g ÷ 14.175 g/tbsp",
        stepByStep: "150 g ÷ 14.175 g/tbsp = 10.58 US tablespoons (1 stick + 2 ½ tablespoons, or 0.66 US cups)",
        resultSummary: "150 g of butter = 2/3 US cup (1 stick + 2 ½ tbsp).",
      },
    ],
    kitchenTips: [
      "Quick US Stick Cheat Sheet: 1/4 stick (2 tbsp) = 28.3 g · 1/2 stick (4 tbsp / 1/4 cup) = 56.7 g · 1 stick (8 tbsp / 1/2 cup) = 113.4 g · 2 sticks (1 cup) = 226.8 g.",
      "Melted vs. solid butter weight: Melting butter does not change its weight in grams—113 g of cold butter still weighs 113 g once melted.",
      "European-style butter: Higher butterfat (82%–85% vs. 80% in standard US butter) has virtually the same density (227 g per US cup) but less water, yielding flakier pie crusts and croissants.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup and 1 stick of butter?",
        answer:
          "1 US Customary cup of butter (2 sticks) weighs 226.8 grams (rounded to 227 g), which is exactly 8 avoirdupois ounces. 1 US stick of butter (1/2 cup or 8 tablespoons) weighs 113.4 grams (rounded to 113 g, or 4 ounces). A 250 mL Metric cup of butter weighs 239.7 grams.",
      },
      {
        question: "How many grams is 1 tablespoon of butter?",
        answer:
          "1 US tablespoon of butter (1/8 of a stick) weighs 14.18 grams (commonly rounded to 14 g or 14.2 g).",
      },
      {
        question: "Does melted butter weigh the same as softened or cold butter?",
        answer:
          "Yes! Mass is conserved when butter melts, so 1/2 cup of cold butter (113.4 g) and 1/2 cup of melted butter both weigh 113.4 grams.",
      },
      {
        question: "How many US sticks of butter is 250 grams?",
        answer:
          "250 grams of butter equals 2.2 US sticks, or 1 US cup + 1.6 tablespoons (17.6 tablespoons total).",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central & US Dairy (226.8 g / 227 g per cup)",
        shortLabel: "USDA / 2 Sticks (226.8 g/cup)",
        gramsPerUsCup: 226.8,
        sourceOrganization: "USDA FoodData Central & King Arthur Baking",
        fdcId: "FDC ID 173410 / 790508",
        sourceCitation:
          "U.S. Department of Agriculture, FoodData Central: Butter, salted/unsalted (FDC ID 173410) & US Dairy / King Arthur Baking Standard — 1 cup (2 sticks, 8 oz) = 226.8 g (227 g), 1 tbsp = 14.2 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
    ],
  },
  {
    slug: "rice",
    name: "Rice (White, Long-Grain, Raw)",
    shortName: "Rice",
    categoryGroup: "Liquids, Grains & Seasonings",
    description:
      "Convert uncooked raw white rice between grams, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, milliliters, and ounces using USDA FoodData Central reference density (185 g per US cup).",
    defaultDensityGPerMl: 0.782,
    gramsPerUsCup: 185,
    gramsPerMetricCup: 195.5,
    gramsPerTbsp: 11.56,
    gramsPerTsp: 3.85,
    ouncesPerUsCup: 6.53,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "This conversion applies to raw (uncooked) long-grain white rice (185 g per US cup). Note that Japanese rice-cooker gou cups are smaller (180 mL ≈ 150 g of raw short-grain rice).",
    overviewParagraphs: [
      "When converting cups of rice to grams, the first distinction to verify is that recipes measure uncooked (raw, dry) rice unless explicitly labeled 'cooked rice'. Raw rice grains are hard, dense kernels that settle evenly in a measuring cup without compressing.",
      "According to USDA FoodData Central (FDC ID 169756), 1 US Customary cup (236.59 mL) of raw long-grain white rice weighs 185 grams (6.53 oz), corresponding to a bulk density of 0.7820 g/mL. Short-grain sushi or Arborio rice kernels pack slightly tighter (around 195–200 g per US cup, which matches King Arthur's 198 g reference). In a 250 mL Metric cup, 1 cup of raw long-grain white rice weighs 195.5 grams.",
    ],
    measuringGuide: {
      title: "How to Measure Uncooked Rice Accurately (Standard Cup vs. Rice Cooker Cup)",
      summary:
        "Be careful not to confuse a standard kitchen measuring cup (236.59 mL US or 250 mL Metric) with the small plastic cup included with electric rice cookers.",
      steps: [
        "Measure rice dry before rinsing: Always weigh or measure raw rice before washing it, as wet rice grains swell and clump together.",
        "Pour level into a dry measuring cup: Pour dry rice into a flat-rimmed measuring cup and sweep the top level with your finger or a straight edge.",
        "Check if you are using a rice cooker 'gou' cup: The clear plastic cup bundled with Asian rice cookers (Zojirushi, Tiger, Cuckoo, Instant Pot) holds 180 mL (about 3/4 US cup, or ~150 g of raw rice), not 240 mL.",
      ],
      avoidMistake:
        "Cooked rice weighs less per cup (~158 g per US cup) and occupies roughly 3 times the volume of raw rice because the grains absorb water and expand.",
    },
    workedExamples: [
      {
        title: "Convert 2 US Cups of Uncooked White Rice to Grams",
        scenario:
          "A pilaf recipe calls for 2 US cups of uncooked long-grain white rice.",
        formulaUsed: "Grams = US Cups × 185 g/cup",
        stepByStep: "2 US cups × 185 g/cup = 370 grams",
        resultSummary: "2 US cups of raw white rice = 370 g (13.05 oz).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Raw Rice to Grams",
        scenario:
          "You are measuring 1 Metric cup (250 mL) of uncooked long-grain rice.",
        formulaUsed: "Grams = 250 mL × 0.7820 g/mL",
        stepByStep: "250 mL × 0.7820 g/mL = 195.5 grams",
        resultSummary: "1 Metric cup (250 mL) of raw white rice = 195.5 g (6.90 oz).",
      },
      {
        title: "Convert 300 Grams of Raw Rice to US Cups",
        scenario:
          "A risotto or paella recipe specifies 300 g of dry rice.",
        formulaUsed: "US Cups = 300 g ÷ 185 g/cup",
        stepByStep: "300 g ÷ 185 g/cup = 1.62 US cups (about 1 ⅔ US cups)",
        resultSummary: "300 g of raw rice = 1.62 US cups (or 1.52 cups at 198 g/cup).",
      },
    ],
    kitchenTips: [
      "Raw vs. Cooked Yield: 1 US cup (185 g) of dry long-grain white rice yields approximately 3 US cups (~475–500 g) of cooked fluffy rice.",
      "Rice varieties by weight per US cup: Basmati / Jasmine long-grain (~180–185 g), Medium-grain / Calrose (~190–195 g), Short-grain sushi / Arborio (~195–200 g), Brown long-grain rice (~185–190 g).",
      "Rice cooker cup conversion: 1 Japanese gou cup (180 mL) = 0.76 US cups = ~140–150 g of raw white rice.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of uncooked white rice?",
        answer:
          "1 US Customary cup (236.59 mL) of uncooked long-grain white rice weighs 185 grams (6.53 oz) according to USDA FoodData Central. Short-grain white rice packs slightly denser at 195–198 grams per US cup. A 250 mL Metric cup of long-grain white rice weighs 195.5 grams.",
      },
      {
        question: "How many grams is 1 cup of cooked white rice?",
        answer:
          "According to USDA FoodData Central (FDC ID 168878), 1 US cup of cooked long-grain white rice weighs approximately 158 grams because the hydrated grains trap more air space between kernels.",
      },
      {
        question: "Why does my rice cooker cup hold less than 185 grams?",
        answer:
          "Electric rice cookers use the traditional Japanese 'gou' cup, which measures 180 mL (about 3/4 of a US cup) and holds roughly 145–150 grams of uncooked rice.",
      },
      {
        question: "How many cups is 500 grams of uncooked rice?",
        answer:
          "At 185 grams per US cup, 500 grams of uncooked long-grain white rice equals 2.70 US cups (about 2 ¾ cups), or 2.56 Metric cups (250 mL).",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central — Raw Long-Grain White Rice (185 g / cup)",
        shortLabel: "USDA Raw White (185 g/cup)",
        gramsPerUsCup: 185,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 169756",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Rice, white, long-grain, regular, raw, enriched (FDC ID 169756, SR Legacy) — 1 cup = 185 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
      buildStandardFromCupGrams({
        id: "king_arthur",
        label: "King Arthur Baking Chart — White Rice (198 g / cup)",
        shortLabel: "King Arthur (198 g/cup)",
        gramsPerUsCup: 198,
        sourceOrganization: "King Arthur Baking Company",
        sourceCitation:
          "King Arthur Baking Company Ingredient Weight Chart: Rice, white (dry) — 1 US cup = 198 g (7.0 oz).",
        referenceUrl: "https://www.kingarthurbaking.com/learn/ingredient-weight-chart",
      }),
    ],
  },
  {
    slug: "milk",
    name: "Whole Milk (Liquid Dairy)",
    shortName: "Milk",
    categoryGroup: "Dairy, Fats & Oils",
    description:
      "Convert liquid milk between grams, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, milliliters, and fluid/weight ounces using USDA FoodData Central density (244 g per US cup, 1.0313 g/mL).",
    defaultDensityGPerMl: 1.0313,
    gramsPerUsCup: 244,
    gramsPerMetricCup: 257.8,
    gramsPerTbsp: 15.25,
    gramsPerTsp: 5.08,
    ouncesPerUsCup: 8.61,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Because milk contains dissolved milk solids, lactose, and proteins, its specific gravity (~1.031 g/mL) is slightly heavier than pure water (244 g vs. 236.6 g per US cup).",
    overviewParagraphs: [
      "Home cooks often assume that all thin kitchen liquids weigh the same as water (1 gram per milliliter), or that 8 fluid ounces of milk equals 8 weight ounces (227 g). In reality, cow's milk contains dissolved lactose, casein and whey proteins, and minerals that raise its specific gravity above 1.03 g/mL.",
      "According to USDA FoodData Central (FDC ID 171265), 1 US Customary cup (236.59 mL / 8 US fl oz) of whole milk (3.25% milkfat) weighs 244 grams (8.61 avoirdupois ounces), corresponding to a density of 1.0313 g/mL. In a 250 mL Metric cup, 1 cup of whole milk weighs 257.8 grams.",
    ],
    measuringGuide: {
      title: "How to Measure Liquid Milk Accurately",
      summary:
        "When measuring milk by volume rather than on a digital scale, use a clear spouted liquid measuring pitcher placed on a flat countertop.",
      steps: [
        "Set the pitcher on a flat surface: Never hold a liquid measuring cup up in the air while pouring, as even a slight tilt distorts the graduation line by 10–15 mL.",
        "Read the bottom of the meniscus at eye level: Bend down so your eyes are level with the graduation mark and align the bottom curve of the milk's surface with the line.",
        "Or weigh directly in grams: Place your mixing bowl on a digital kitchen scale, press Tare, and pour milk until you reach 244 g per US cup (or 258 g per Metric cup).",
      ],
      avoidMistake:
        "Notice that King Arthur Baking's chart lists 227 g (8 oz) per cup of milk as a simplified 1 fl oz ≈ 1 oz culinary shorthand, whereas physical USDA measurements show 1 US cup of milk actually weighs 244 g.",
    },
    workedExamples: [
      {
        title: "Convert 1 ½ US Cups of Whole Milk to Grams & Milliliters",
        scenario:
          "A pancake batter recipe calls for 1.5 US cups of whole milk.",
        formulaUsed: "Grams = US Cups × 244 g/cup",
        stepByStep: "1.5 US cups × 244 g/cup = 366 grams (and 1.5 × 236.59 mL = 354.9 mL)",
        resultSummary: "1 ½ US cups of whole milk = 366 g (354.9 mL).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Milk to Grams",
        scenario:
          "A UK or Australian custard recipe calls for 1 Metric cup (250 mL) of milk.",
        formulaUsed: "Grams = 250 mL × 1.0313 g/mL",
        stepByStep: "250 mL × 1.0313 g/mL = 257.83 grams (≈ 257.8 g)",
        resultSummary: "1 Metric cup (250 mL) of milk = 257.8 g (9.09 oz).",
      },
      {
        title: "Convert 200 Milliliters of Milk to Grams & US Cups",
        scenario:
          "A bread dough formula specifies 200 mL of warm milk.",
        formulaUsed: "Grams = 200 mL × 1.0313 g/mL",
        stepByStep: "200 mL × 1.0313 g/mL = 206.3 grams (200 mL ÷ 236.59 mL/cup = 0.845 US cups)",
        resultSummary: "200 mL of whole milk = 206.3 g (0.85 US cups).",
      },
    ],
    kitchenTips: [
      "Skim vs. whole milk vs. heavy cream: Skim milk is slightly denser (245–246 g per US cup) because milkfat is lighter than water, while heavy whipping cream (36% fat) is slightly lighter at 238–240 g per US cup.",
      "Buttermilk and yogurt: Cultured buttermilk and plain yogurt are thicker but have virtually the same density as whole milk (~242–245 g per US cup).",
      "Plant-based milks: Unsweetened almond, oat, and soy milks have densities very close to dairy milk, ranging between 240 g and 244 g per US cup.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of milk?",
        answer:
          "1 US Customary cup (236.59 mL) of whole milk weighs 244 grams (8.61 oz) according to USDA FoodData Central. In a 250 mL Metric cup, 1 cup of milk weighs 257.8 grams.",
      },
      {
        question: "Why does 1 cup of milk weigh 244g instead of 236.6g or 227g?",
        answer:
          "1 US cup holds 236.59 mL (8 US fluid ounces). Pure water weighs 236.59 g for that volume, and milk is ~3.1% denser than water due to dissolved milk solids and lactose (236.59 × 1.0313 = 244 g). Meanwhile, 227 g is 8 avoirdupois weight ounces, which is different from 8 fluid ounces.",
      },
      {
        question: "How many grams is 1 tablespoon of milk?",
        answer:
          "1 US tablespoon (14.79 mL) of whole milk weighs 15.25 grams, and 1 US teaspoon (4.93 mL) weighs 5.08 grams.",
      },
      {
        question: "Does 100 mL of milk equal 100 grams?",
        answer:
          "It is very close: 100 mL of whole milk weighs 103.1 grams. For everyday cooking, 1 mL ≈ 1 g is a workable approximation, but for large baking batches, multiplying mL by 1.031 gives the exact gram weight.",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central — Whole Milk 3.25% (244 g / US cup)",
        shortLabel: "USDA Whole Milk (244 g/cup)",
        gramsPerUsCup: 244,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 171265 / 746754",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Milk, whole, 3.25% milkfat, with added vitamin D (FDC ID 171265, SR Legacy) — 1 cup = 244 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
      buildStandardFromCupGrams({
        id: "king_arthur",
        label: "King Arthur Baking Chart — Milk (227 g / US cup)",
        shortLabel: "King Arthur (227 g/cup)",
        gramsPerUsCup: 227,
        sourceOrganization: "King Arthur Baking Company",
        sourceCitation:
          "King Arthur Baking Company Ingredient Weight Chart: Milk (whole, lowfat, or skim culinary rounding) — 1 US cup = 227 g (8 oz).",
        referenceUrl: "https://www.kingarthurbaking.com/learn/ingredient-weight-chart",
      }),
    ],
  },
  {
    slug: "water",
    name: "Water (Tap / Pure Liquid)",
    shortName: "Water",
    categoryGroup: "Liquids, Grains & Seasonings",
    description:
      "Convert water between grams, milliliters, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, and ounces using physical metrology and USDA FoodData Central reference density (1.0000 g/mL, 236.59 g per US cup).",
    defaultDensityGPerMl: 1.0,
    gramsPerUsCup: 236.59,
    gramsPerMetricCup: 250,
    gramsPerTbsp: 14.79,
    gramsPerTsp: 4.93,
    ouncesPerUsCup: 8.35,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "For pure water at room temperature, 1 milliliter (mL) weighs virtually 1 gram (0.9982 g at 20 °C). Therefore 1 US cup (236.59 mL) of water weighs 236.59 grams (8.35 avoirdupois ounces, or 8 US fluid ounces).",
    overviewParagraphs: [
      "Water is the foundational baseline for kitchen density: at standard temperature, 1 milliliter (mL) of liquid water has a mass of 1.000 gram. Because of this 1:1 metric relationship, converting milliliters of water to grams requires no math at all—250 mL of water weighs 250 grams.",
      "However, when converting US Customary cups and ounces of water to grams, many cooks fall into the 'fluid ounce vs. weight ounce' trap. 1 US Customary cup equals 8 US fluid ounces (236.59 mL), which weighs 236.59 grams—or 8.35 avoirdupois weight ounces (not 8.0 weight ounces, which would be 226.8 g). Meanwhile, 1 US Legal/FDA cup (240 mL) of water weighs 240 grams, and 1 Metric cup (250 mL) weighs 250 grams.",
    ],
    measuringGuide: {
      title: "How to Measure Water Accurately (Scale vs. Liquid Pitcher)",
      summary:
        "Even calibrated glass measuring pitchers in home kitchens can be off by 5% to 10%. Weighing water in grams on a digital scale is the gold standard for bread baking and coffee brewing.",
      steps: [
        "Weigh in grams for bread & coffee: Since 1 g of water = 1 mL, weighing water on a scale gives 1-gram (1 mL) accuracy for sourdough hydration percentages and pour-over coffee ratios.",
        "Check your cup standard: Verify whether your recipe uses a US Customary cup (236.59 g), a US Legal cup (240 g), or a Commonwealth Metric cup (250 g).",
        "Read the meniscus at eye level: If using a graduated pitcher, set it on a flat counter and align the bottom of the curved water surface with the mark.",
      ],
      avoidMistake:
        "Remember that 1 US fluid ounce of water (29.57 mL) weighs 29.57 grams (1.043 weight ounces), whereas 1 dry/weight ounce equals 28.35 grams.",
    },
    workedExamples: [
      {
        title: "Convert 2 US Cups of Water to Grams & Milliliters",
        scenario:
          "A soup or bread recipe calls for 2 US Customary cups of water.",
        formulaUsed: "Grams = US Cups × 236.588 g/cup",
        stepByStep: "2 US cups × 236.588 g/cup = 473.18 grams (473.18 mL, or 1 US liquid pint)",
        resultSummary: "2 US cups of water = 473.2 g (473.2 mL / 16.69 oz wt).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Water to Grams",
        scenario:
          "You are measuring 1 Metric cup (250 mL) of water.",
        formulaUsed: "Grams = 250 mL × 1.0000 g/mL",
        stepByStep: "250 mL × 1.0000 g/mL = 250 grams",
        resultSummary: "1 Metric cup (250 mL) of water = 250 g (8.82 oz wt).",
      },
      {
        title: "Convert 500 Grams of Water to US Cups",
        scenario:
          "A sourdough loaf requires 500 g of water.",
        formulaUsed: "US Cups = 500 g ÷ 236.588 g/cup",
        stepByStep: "500 g ÷ 236.588 g/cup = 2.113 US cups (or exactly 2.0 Metric cups)",
        resultSummary: "500 g of water = 2.11 US cups (2 cups + 1.8 tbsp) or 2 Metric cups.",
      },
    ],
    kitchenTips: [
      "Water temperature and density: Cold water at 4 °C has a density of 1.0000 g/mL; room-temperature water at 20 °C is 0.9982 g/mL; and near-boiling water at 95 °C is 0.9619 g/mL (~227.6 g per US cup).",
      "Calibrate your kitchen measuring cups with water: Place your empty measuring cup on a digital scale, tare to zero, and fill to the 1-cup rim with room-temperature water. A true US cup will read ~236.6 g; a Metric cup will read 250 g.",
      "Ice vs. liquid water: Ice is about 8% less dense than liquid water (0.917 g/mL), and crushed or cubed ice traps large air gaps (~140–150 g per cup).",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of water?",
        answer:
          "1 US Customary cup (236.59 mL) of water weighs 236.59 grams (often rounded to 237 g). 1 US Legal/FDA cup (240 mL) of water weighs 240 grams, and 1 Metric cup (250 mL) of water weighs exactly 250 grams.",
      },
      {
        question: "Why does 1 cup (8 fl oz) of water weigh 8.35 ounces instead of 8 ounces?",
        answer:
          "A US fluid ounce measures volume (29.57 mL), whereas an avoirdupois ounce measures weight (28.35 g). Because 1 fl oz of water weighs 29.57 g, 8 fl oz of water weighs 236.59 g ÷ 28.35 g/oz = 8.35 weight ounces. (In the UK Imperial system, 1 Imperial fl oz of water equals 28.41 mL, which does weigh 1 avoirdupois ounce).",
      },
      {
        question: "How many grams is 1 tablespoon and 1 teaspoon of water?",
        answer:
          "1 US tablespoon of water (14.79 mL) weighs 14.79 grams (rounded to 15 g for metric tablespoons), and 1 US teaspoon of water (4.93 mL) weighs 4.93 grams (rounded to 5 g for metric teaspoons).",
      },
      {
        question: "Does 1 gram of water equal 1 milliliter?",
        answer:
          "Yes. By metric definition, 1 milliliter (1 cubic centimeter) of pure water has a mass of 1 gram, making grams and milliliters interchangeable for water.",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "Physical / USDA Standard (1.0000 g/mL — 236.59 g / US cup)",
        shortLabel: "USDA / NIST (236.59 g/cup)",
        gramsPerUsCup: 236.59,
        sourceOrganization: "USDA FoodData Central & NIST",
        fdcId: "FDC ID 173647 / 746776",
        sourceCitation:
          "U.S. Department of Agriculture, FoodData Central: Water, tap, municipal (FDC ID 173647, rounded label 237 g/cup; exact US Customary cup = 236.588 mL at 1.0000 g/mL).",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
    ],
  },
  {
    slug: "honey",
    name: "Honey (Strained / Liquid)",
    shortName: "Honey",
    categoryGroup: "Sugars & Sweeteners",
    description:
      "Convert liquid honey between grams, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, milliliters, and ounces using USDA FoodData Central and National Honey Board density data (339 g per US cup, 1.4329 g/mL).",
    defaultDensityGPerMl: 1.4329,
    gramsPerUsCup: 339,
    gramsPerMetricCup: 358.2,
    gramsPerTbsp: 21.19,
    gramsPerTsp: 7.06,
    ouncesPerUsCup: 11.96,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Honey is over 43% denser than water: 1 US cup (8 fl oz by volume) of honey weighs nearly 12 avoirdupois ounces (339 grams). Weighing honey directly into your mixing bowl eliminates sticky measuring cup waste.",
    overviewParagraphs: [
      "Honey is a supersaturated natural sugar solution containing roughly 80% sugars (fructose and glucose) and only 17%–18% water. Because of this high dissolved sugar concentration, honey is one of the densest ingredients in the kitchen—more than 43% heavier than an equal volume of water.",
      "According to USDA FoodData Central (FDC ID 169640) and the National Honey Board, 1 US Customary cup (236.59 mL / 8 US fl oz) of liquid honey weighs 339 grams (11.96 avoirdupois ounces—almost 12 oz by weight!), with a density of 1.4329 g/mL. In a 250 mL Metric cup, 1 cup of honey weighs 358.2 grams.",
    ],
    measuringGuide: {
      title: "How to Measure Sticky Honey Without Waste",
      summary:
        "Pouring viscous honey into a measuring cup and scraping it out leaves 10 to 20 grams stuck to the cup walls. Here are the two best ways to measure honey cleanly.",
      steps: [
        "Method 1 (Best): Weigh directly into your mixing bowl: Place your mixing bowl on a digital kitchen scale, press Tare (zero), and squeeze or pour honey directly into the bowl until you hit the target gram weight (e.g., 85 g for 1/4 US cup).",
        "Method 2: Coat the measuring cup or spoon with oil: If you must use a measuring cup or tablespoon, lightly coat the inside with neutral cooking spray, vegetable oil, or warm water first so the honey slides right out.",
        "Check honey jars sold by weight vs. volume: A '12 oz' bear bottle of honey contains 12 weight ounces (340 g), which equals exactly 1 US cup (8 fluid ounces) by volume!",
      ],
      avoidMistake:
        "Never assume an 8-ounce jar of honey by weight equals 1 cup—8 weight ounces (227 g) of honey is only 2/3 of a US cup!",
    },
    workedExamples: [
      {
        title: "Convert 1/3 US Cup of Honey to Grams",
        scenario:
          "A granola or honey cake recipe calls for 1/3 US cup of liquid honey.",
        formulaUsed: "Grams = US Cups × 339 g/cup",
        stepByStep: "(1 ÷ 3) US cups × 339 g/cup = 113 grams (4.0 oz wt)",
        resultSummary: "1/3 US cup of honey = 113 g (4.0 oz wt).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Honey to Grams",
        scenario:
          "An international baking recipe specifies 1 Metric cup (250 mL) of honey.",
        formulaUsed: "Grams = 250 mL × 1.4329 g/mL",
        stepByStep: "250 mL × 1.4329 g/mL = 358.23 grams (≈ 358.2 g)",
        resultSummary: "1 Metric cup (250 mL) of honey = 358.2 g (12.64 oz wt).",
      },
      {
        title: "Convert 100 Grams of Honey to Tablespoons & US Cups",
        scenario:
          "A bread recipe requires 100 g of honey.",
        formulaUsed: "Tablespoons = 100 g ÷ 21.19 g/tbsp",
        stepByStep: "100 g ÷ 21.19 g/tbsp = 4.72 US tablespoons (or 0.295 US cups)",
        resultSummary: "100 g of honey = 4 ¾ US tablespoons (just over 1/4 cup).",
      },
    ],
    kitchenTips: [
      "The 12-oz Honey Bear rule: In US grocery stores, honey is sold by net weight. A standard 12-oz (340 g) honey bear holds almost exactly 1 US cup (8 fl oz) of honey.",
      "Maple syrup, molasses & corn syrup comparison: Pure maple syrup (~315–322 g/cup) is slightly lighter than honey (339 g/cup), whereas light/dark corn syrup (~328–340 g/cup) and molasses (~337–340 g/cup) have almost the same density as honey.",
      "Crystallized honey: If your honey has crystallized in the jar, warm the jar gently in a bowl of warm water (around 40 °C / 104 °F) to reliquefy it before measuring by volume—or simply weigh it in grams as-is.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of honey?",
        answer:
          "1 US Customary cup (236.59 mL) of honey weighs 339 grams (11.96 oz, often rounded to 340 g or 12 oz) according to USDA FoodData Central. In a 250 mL Metric cup, 1 cup of honey weighs 358.2 grams.",
      },
      {
        question: "How many grams are in 1 tablespoon and 1 teaspoon of honey?",
        answer:
          "1 US tablespoon (14.79 mL) of honey weighs 21.19 grams (rounded to 21 g on nutrition labels), and 1 US teaspoon (4.93 mL) weighs 7.06 grams (rounded to 7 g).",
      },
      {
        question: "Why does 1 cup (8 fl oz) of honey weigh 12 ounces?",
        answer:
          "Fluid ounces measure volume while dry ounces measure weight. Because honey has a specific gravity of 1.433 (43.3% denser than water), 8 fluid ounces of honey weighs 11.96 avoirdupois ounces (~12 oz / 339 g).",
      },
      {
        question: "How many cups is a 16 oz (1 lb) jar of honey?",
        answer:
          "A 1-pound (453.6 g / 16 weight oz) jar of honey equals 1.34 US cups (about 1 ⅓ cups, or 10.7 fluid ounces).",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda",
        label: "USDA FoodData Central & National Honey Board (339 g / US cup)",
        shortLabel: "USDA / Honey Board (339 g/cup)",
        gramsPerUsCup: 339,
        sourceOrganization: "USDA FoodData Central & National Honey Board",
        fdcId: "FDC ID 169640",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Honey (FDC ID 169640, SR Legacy) — 1 cup = 339 g, 1 tbsp = 21 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
    ],
  },
  {
    slug: "oil",
    name: "Cooking Oil (Canola, Vegetable & Olive Oil)",
    shortName: "Oil",
    categoryGroup: "Dairy, Fats & Oils",
    description:
      "Convert cooking oils (canola, vegetable, soybean, and olive oil) between grams, US cups (236.59 mL), Metric cups (250 mL), tablespoons, teaspoons, milliliters, and ounces using USDA FoodData Central density data (218 g per US cup).",
    defaultDensityGPerMl: 0.9214,
    gramsPerUsCup: 218,
    gramsPerMetricCup: 230.4,
    gramsPerTbsp: 13.63,
    gramsPerTsp: 4.54,
    ouncesPerUsCup: 7.69,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Liquid culinary oils are less dense than water (~0.91–0.92 g/mL), which is why oil floats on water. 1 US cup of vegetable or canola oil weighs 218 g (7.69 oz), while extra-virgin olive oil weighs 216 g (7.62 oz).",
    overviewParagraphs: [
      "All culinary liquid fats—including vegetable oil, canola oil, sunflower oil, soybean oil, corn oil, and olive oil—are triglycerides that are roughly 8% to 9% lighter than water. That lower density (around 0.913 to 0.921 g/mL) is the physical reason oil always floats on top of water or vinegar.",
      "According to USDA FoodData Central (FDC ID 172336), 1 US Customary cup (236.59 mL) of vegetable or canola oil weighs 218 grams (7.69 oz) at a density of 0.9214 g/mL, while extra-virgin olive oil (FDC ID 171413) weighs 216 grams (7.62 oz) per US cup (0.9130 g/mL). In a 250 mL Metric cup, 1 cup of cooking oil weighs 230.4 grams.",
    ],
    measuringGuide: {
      title: "How to Measure Cooking & Baking Oils Accurately",
      summary:
        "Because oil clings to the inside of measuring cups, weighing oil directly into your bowl saves cleanup and improves accuracy for chiffon cakes, muffins, and emulsions.",
      steps: [
        "Tare your mixing bowl on a digital scale: Pour vegetable, canola, or olive oil straight from the bottle until you reach 218 g per US cup (or 109 g for 1/2 US cup).",
        "Allow residual oil to drain if using a cup: When pouring from a liquid measuring cup, pause 5–10 seconds or scrape with a silicone spatula so you don't leave 5–8 grams behind.",
        "Measure coconut oil in its liquid state: Melted coconut oil has the same ~218 g/cup density as vegetable oil.",
      ],
      avoidMistake:
        "Do not equate milliliters of oil 1:1 with grams: 100 mL of cooking oil weighs only ~92 grams, and 100 grams of cooking oil occupies ~108.5 mL.",
    },
    workedExamples: [
      {
        title: "Convert 1/2 US Cup of Vegetable Oil to Grams",
        scenario:
          "A carrot cake or quick-bread recipe calls for 1/2 US cup of vegetable or canola oil.",
        formulaUsed: "Grams = US Cups × 218 g/cup",
        stepByStep: "0.5 US cups × 218 g/cup = 109 grams (or 108 g for olive oil)",
        resultSummary: "1/2 US cup of cooking oil = 109 g (3.84 oz wt).",
      },
      {
        title: "Convert 1 Metric Cup (250 mL) of Oil to Grams",
        scenario:
          "A recipe using a 250 mL Metric cup calls for 1 cup of vegetable oil.",
        formulaUsed: "Grams = 250 mL × 0.9214 g/mL",
        stepByStep: "250 mL × 0.9214 g/mL = 230.35 grams (≈ 230.4 g)",
        resultSummary: "1 Metric cup (250 mL) of cooking oil = 230.4 g (8.13 oz wt).",
      },
      {
        title: "Convert 150 Milliliters of Olive Oil to Grams",
        scenario:
          "A Mediterranean focaccia recipe calls for 150 mL of olive oil.",
        formulaUsed: "Grams = 150 mL × 0.9130 g/mL (Olive Oil)",
        stepByStep: "150 mL × 0.9130 g/mL = 136.95 grams (≈ 137 g)",
        resultSummary: "150 mL of olive oil = 137 g (0.63 US cups / 10.1 tbsp).",
      },
    ],
    kitchenTips: [
      "Canola, vegetable, sunflower, avocado, and olive oils all fall within 215–218 grams per US cup—a variance of less than 1.5%, so any culinary oil can be weighed using these charts.",
      "1 tablespoon of oil: Equals 13.6 grams (about 14 g) and 14.8 mL, which is useful when tracking nutrition or scaling salad dressings.",
      "Substituting oil for melted butter: 1 US cup of butter (227 g) contains ~182 g of pure fat and ~40 g of water; check your recipe before swapping 1:1.",
    ],
    faqs: [
      {
        question: "How many grams are in 1 cup of cooking oil or olive oil?",
        answer:
          "1 US Customary cup (236.59 mL) of vegetable or canola oil weighs 218 grams (7.69 oz), and 1 US cup of olive oil weighs 216 grams (7.62 oz) according to USDA FoodData Central. In a 250 mL Metric cup, 1 cup of cooking oil weighs 230.4 grams.",
      },
      {
        question: "How many grams is 1 tablespoon and 1 teaspoon of oil?",
        answer:
          "1 US tablespoon (14.79 mL) of cooking oil weighs 13.63 grams (13.5 g for olive oil), and 1 US teaspoon (4.93 mL) weighs 4.54 grams.",
      },
      {
        question: "How many grams is 100 mL of cooking oil?",
        answer:
          "Because cooking oil has a density of ~0.92 g/mL, 100 mL of vegetable or canola oil weighs 92.1 grams (and 100 mL of olive oil weighs 91.3 grams).",
      },
      {
        question: "How many milliliters is 100 grams of oil?",
        answer:
          "100 grams of cooking oil occupies 108.5 milliliters (mL), which is about 0.46 US cups or 7.3 US tablespoons.",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda_vegetable",
        label: "USDA FoodData Central — Canola / Vegetable Oil (218 g / cup)",
        shortLabel: "USDA Vegetable/Canola (218 g/cup)",
        gramsPerUsCup: 218,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 172336 / 748335",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Oil, canola / vegetable (FDC ID 172336, SR Legacy) — 1 cup = 218 g, 1 tbsp = 13.6 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
      buildStandardFromCupGrams({
        id: "usda_olive",
        label: "USDA FoodData Central — Olive Oil (216 g / cup)",
        shortLabel: "USDA Olive Oil (216 g/cup)",
        gramsPerUsCup: 216,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 171413",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Oil, olive, salad or cooking (FDC ID 171413, SR Legacy) — 1 cup = 216 g, 1 tbsp = 13.5 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
    ],
  },
  {
    slug: "salt",
    name: "Salt (Fine Table Salt & Kosher Salt)",
    shortName: "Salt",
    categoryGroup: "Liquids, Grains & Seasonings",
    description:
      "Convert table salt, Morton Coarse Kosher salt, and Diamond Crystal Kosher salt between grams, teaspoons, tablespoons, US cups (236.59 mL), Metric cups (250 mL), milliliters, and ounces using USDA FoodData Central and manufacturer guides.",
    defaultDensityGPerMl: 1.2342,
    gramsPerUsCup: 292,
    gramsPerMetricCup: 308.6,
    gramsPerTbsp: 18.25,
    gramsPerTsp: 6.08,
    ouncesPerUsCup: 10.3,
    verificationStatus: "verified",
    packingNote: COOKING_PACKING_NOTE,
    culinaryTip:
      "Crystal geometry drastically changes salt volume: 1 teaspoon of fine table salt (~6.1 g) has more than twice the mass of 1 teaspoon of hollow-flake Diamond Crystal Kosher salt (2.8 g).",
    overviewParagraphs: [
      "Salt is the single most dangerous ingredient to swap 1:1 by volume without checking crystal type. While every culinary salt is pure sodium chloride (NaCl) with the exact same saltiness gram-for-gram, the shape and size of the crystals drastically alter how much air sits inside a measuring spoon.",
      "According to USDA FoodData Central (FDC ID 173468), 1 US teaspoon of fine granulated table salt weighs 6.08 grams (1 tablespoon = 18.25 g; 1 US cup = 292 g; 1 Metric cup = 308.6 g). By contrast, Morton Coarse Kosher Salt weighs 4.8 grams per teaspoon (230.4 g/cup), and Diamond Crystal Kosher Salt—made of fragile, hollow pyramid flakes—weighs only 2.8 grams per teaspoon (134.4 g/cup). You can switch between all three published salt standards in our converter above.",
    ],
    measuringGuide: {
      title: "How to Measure Table Salt vs. Kosher Salt Accurately",
      summary:
        "For curing, brining, bread baking, and pastry, always weigh salt in grams—or adjust your spoon volume to match the exact salt brand specified by the recipe.",
      steps: [
        "Select your salt crystal type in Step 2 of the converter: Choose USDA Fine Table Salt (6.08 g/tsp), Morton Coarse Kosher (4.8 g/tsp), or Diamond Crystal Kosher (2.8 g/tsp).",
        "Pour level into measuring spoons: Fill your teaspoon or tablespoon and sweep the top flat without shaking.",
        "Use a 0.1-gram precision scale for small bread batches: Standard kitchen scales with 1-gram resolution can have rounding error under 5 grams; a pocket jeweler/coffee scale (0.1 g) measures teaspoons of salt with pinpoint precision.",
      ],
      avoidMistake:
        "If a recipe written for Diamond Crystal Kosher salt calls for 1 tablespoon of salt (8.4 g) and you use 1 tablespoon of fine table salt (18.25 g), your dish will contain more than double the intended sodium!",
    },
    workedExamples: [
      {
        title: "Convert 1 Tablespoon of Fine Table Salt vs. Kosher Salt to Grams",
        scenario:
          "A turkey brine or bread recipe calls for 1 US tablespoon (3 teaspoons) of salt.",
        formulaUsed: "Grams = 3 tsp × Grams per Teaspoon for the chosen salt type",
        stepByStep:
          "Fine Table Salt: 3 × 6.08 g = 18.25 g · Morton Kosher: 3 × 4.8 g = 14.4 g · Diamond Crystal Kosher: 3 × 2.8 g = 8.4 g",
        resultSummary: "1 tbsp = 18.25 g (Table Salt), 14.4 g (Morton Kosher), or 8.4 g (Diamond Crystal).",
      },
      {
        title: "Convert 10 Grams of Salt to Teaspoons (Bread Baking 2% Salt Rule)",
        scenario:
          "A sourdough loaf with 500 g of flour requires 10 g of salt (2% baker's percentage).",
        formulaUsed: "Teaspoons = 10 g ÷ Grams per Teaspoon",
        stepByStep:
          "Table Salt: 10 g ÷ 6.08 g/tsp = 1.64 tsp · Morton Kosher: 10 g ÷ 4.8 g/tsp = 2.08 tsp · Diamond Crystal: 10 g ÷ 2.8 g/tsp = 3.57 tsp",
        resultSummary: "10 g of salt = 1 ⅔ tsp Table Salt, 2 tsp Morton Kosher, or 3 ½ tsp Diamond Crystal.",
      },
      {
        title: "Convert 1/4 US Cup of Salt to Grams for Pickling Brine",
        scenario:
          "A fermented pickle brine calls for 1/4 US cup (4 tablespoons) of salt.",
        formulaUsed: "Grams = 0.25 US cups × Grams per US Cup",
        stepByStep:
          "Table Salt: 0.25 × 292 g = 73 g · Morton Kosher: 0.25 × 230.4 g = 57.6 g · Diamond Crystal: 0.25 × 134.4 g = 33.6 g",
        resultSummary: "1/4 US cup = 73 g (Table Salt), 57.6 g (Morton), or 33.6 g (Diamond Crystal).",
      },
    ],
    kitchenTips: [
      "Quick Salt Substitution Rule by Volume: 1 teaspoon Fine Table Salt (~6 g) ≈ 1 ¼ teaspoons Morton Coarse Kosher Salt ≈ 2 teaspoons Diamond Crystal Kosher Salt.",
      "Fine sea salt: Has nearly the same crystal size and bulk density as standard table salt (~5.8–6.0 g per teaspoon).",
      "Pickling and canning salt: Pure fine-grain sodium chloride with no anti-caking agents or iodine; weighs ~5.7–6.0 g per teaspoon (about 275–290 g per US cup).",
    ],
    faqs: [
      {
        question: "How many grams are in 1 teaspoon and 1 tablespoon of salt?",
        answer:
          "For fine table salt, 1 US teaspoon weighs 6.08 grams (often rounded to 6 g) and 1 US tablespoon weighs 18.25 grams (USDA FoodData Central). For Morton Coarse Kosher salt, 1 tsp = 4.8 g (1 tbsp = 14.4 g). For Diamond Crystal Kosher salt, 1 tsp = 2.8 g (1 tbsp = 8.4 g).",
      },
      {
        question: "How many grams are in 1 cup of salt?",
        answer:
          "1 US Customary cup (236.59 mL) of fine table salt weighs 292 grams (10.3 oz). 1 US cup of Morton Coarse Kosher salt weighs 230.4 grams, and 1 US cup of Diamond Crystal Kosher salt weighs 134.4 grams. A 250 mL Metric cup of table salt weighs 308.6 grams.",
      },
      {
        question: "Why does Diamond Crystal Kosher salt weigh almost half as much per spoon as table salt?",
        answer:
          "Table salt is formed into dense, compact cubic crystals that pack tightly with very little air space. Diamond Crystal is crystallized using the Alberger process into hollow, multi-faceted flakes that take up roughly twice the volume for the same weight.",
      },
      {
        question: "Is 10 grams of kosher salt the same saltiness as 10 grams of table salt?",
        answer:
          "Yes! By weight, both are pure sodium chloride (NaCl). 10 grams of Diamond Crystal, 10 grams of Morton Kosher, and 10 grams of fine sea or table salt deliver the exact same salinity.",
      },
    ],
    standards: [
      buildStandardFromCupGrams({
        id: "usda_table",
        label: "USDA FoodData Central — Fine Table Salt (292 g/cup, 6.08 g/tsp)",
        shortLabel: "USDA Table Salt (6.08 g/tsp)",
        gramsPerUsCup: 292,
        sourceOrganization: "USDA FoodData Central",
        fdcId: "FDC ID 173468",
        sourceCitation:
          "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: Salt, table (FDC ID 173468, SR Legacy) — 1 cup = 292 g, 1 tbsp = 18.25 g, 1 tsp = 6.08 g.",
        referenceUrl: "https://fdc.nal.usda.gov/",
      }),
      buildStandardFromCupGrams({
        id: "morton_kosher",
        label: "Morton Salt Guide — Coarse Kosher Salt (230.4 g/cup, 4.8 g/tsp)",
        shortLabel: "Morton Kosher (4.8 g/tsp)",
        gramsPerUsCup: 230.4,
        sourceOrganization: "Morton Salt Official Conversion Guide",
        sourceCitation:
          "Morton Salt Official Culinary Conversion Guide: Morton Coarse Kosher Salt — 1 tsp = 4.8 g (1 tbsp = 14.4 g, 1 US cup = 230.4 g).",
        referenceUrl: "https://www.mortonsalt.com/article/salt-conversion-chart/",
      }),
      buildStandardFromCupGrams({
        id: "diamond_crystal",
        label: "Diamond Crystal Guide — Kosher Flake Salt (134.4 g/cup, 2.8 g/tsp)",
        shortLabel: "Diamond Crystal (2.8 g/tsp)",
        gramsPerUsCup: 134.4,
        sourceOrganization: "Cargill / Diamond Crystal Kosher Salt Guide",
        sourceCitation:
          "Cargill / Diamond Crystal Official Measurement Guide: Diamond Crystal Kosher Salt — 1 tsp = 2.8 g (1 tbsp = 8.4 g, 1 US cup = 134.4 g).",
        referenceUrl: "https://www.diamondcrystalsalt.com/culinary-conversions",
      }),
    ],
  },
];

export const COOKING_HUB_FAQS: IngredientFaqItem[] = [
  {
    question: "Why can't you convert cups to grams without selecting an ingredient?",
    answer:
      "Cups measure volume (three-dimensional space, 236.59 mL for a US Customary cup), whereas grams measure mass (weight). Because every kitchen ingredient has a different bulk density (g/mL), 1 US cup of sifted powdered sugar weighs 120 g, 1 US cup of all-purpose flour weighs 125 g, 1 US cup of granulated sugar weighs 200 g, 1 US cup of water weighs 236.59 g, and 1 US cup of honey weighs 339 g.",
  },
  {
    question: "What is the difference between a US Cup, a US Legal Cup, and a Metric Cup?",
    answer:
      "A US Customary cup—used in American cookbooks and standard measuring cup sets—equals 236.59 mL (8 US fluid ounces). A US Legal cup—used by the FDA for Nutrition Facts labels—equals 240 mL. A Commonwealth Metric cup—used in the UK, Australia, New Zealand, Canada, and South Africa—equals 250 mL (about 5.7% larger than a US Customary cup). You can select all of these cup types in our converter above.",
  },
  {
    question: "How many grams are in 1 cup of flour, sugar, and butter?",
    answer:
      "Using published USDA FoodData Central references for a standard US Customary cup (236.59 mL): 1 cup of all-purpose flour = 125 g (or 120 g per King Arthur Baking), 1 cup of granulated white sugar = 200 g, 1 cup of packed brown sugar = 220 g (or 213 g per King Arthur), 1 cup of powdered sugar = 120 g, and 1 cup of butter (2 sticks) = 226.8 g (rounded to 227 g).",
  },
  {
    question: "What is the 'Spoon and Level' method and why does it matter for grams-to-cups?",
    answer:
      "Dipping a dry measuring cup directly into a flour or powdered sugar container compacts the powder and packs 20% to 25% extra weight into the cup (up to 150 g of flour instead of 120–125 g). Professional test kitchens fluff the ingredient with a fork, gently spoon it into the cup, and sweep the top flat with a straight knife edge.",
  },
  {
    question: "Do 8 fluid ounces (1 cup) always equal 8 ounces by weight?",
    answer:
      "No. Fluid ounces (fl oz) measure volume, while avoirdupois ounces (oz) measure weight. Even for pure water, 1 US cup (8 US fl oz / 236.59 mL) weighs 8.35 avoirdupois ounces (236.59 g). For butter, 1 US cup happens to weigh 8.0 oz (226.8 g), but 1 US cup of flour weighs only 4.41 oz (125 g) and 1 US cup of honey weighs 11.96 oz (339 g).",
  },
  {
    question: "Where are the ingredient densities on this page sourced from?",
    answer:
      "Every ingredient density on UnitConvertersGo is sourced strictly from published food-science and culinary references, primarily the U.S. Department of Agriculture (USDA) FoodData Central (SR Legacy and Foundation Foods) alongside official manufacturer measurement guides from King Arthur Baking Company, Domino Sugar, Morton Salt, and Diamond Crystal.",
  },
];

export const COOKING_INGREDIENT_MAP = new Map<string, CookingIngredient>(
  COOKING_INGREDIENTS.map((item) => [item.slug, item])
);

export function getCookingIngredient(
  slug: string
): CookingIngredient | undefined {
  return COOKING_INGREDIENT_MAP.get(slug.trim().toLowerCase());
}

export interface CookingConversionResult {
  inputValue: number;
  outputValue: number;
  formattedOutput: string;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  densityGPerMl: number;
  gramsEquivalent: number;
  millilitersEquivalent: number;
  formulaText: string;
  stepExplanation: string;
}

export function formatCookingNumber(val: number): string {
  if (!Number.isFinite(val)) return "—";
  if (val === 0) return "0";
  const abs = Math.abs(val);
  if (abs >= 100) {
    return Number(val.toFixed(2)).toLocaleString("en-US");
  }
  if (abs >= 10) {
    return Number(val.toFixed(2)).toLocaleString("en-US");
  }
  if (abs >= 1) {
    return Number(val.toFixed(3)).toLocaleString("en-US");
  }
  return Number(val.toFixed(4)).toString();
}

export function convertCookingIngredient(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  densityGPerMl: number
): CookingConversionResult {
  const fromUnit = COOKING_UNIT_MAP.get(fromUnitId) || COOKING_UNITS[0];
  const toUnit = COOKING_UNIT_MAP.get(toUnitId) || COOKING_UNITS[4];
  const safeDensity = densityGPerMl > 0 ? densityGPerMl : 1;

  let gramsEquivalent = 0;
  let millilitersEquivalent = 0;

  if (fromUnit.kind === "mass") {
    gramsEquivalent = value * fromUnit.toMetricBase;
    millilitersEquivalent = gramsEquivalent / safeDensity;
  } else {
    millilitersEquivalent = value * fromUnit.toMetricBase;
    gramsEquivalent = millilitersEquivalent * safeDensity;
  }

  const outputValue =
    toUnit.kind === "mass"
      ? gramsEquivalent / toUnit.toMetricBase
      : millilitersEquivalent / toUnit.toMetricBase;

  const oneFactor =
    fromUnit.kind === "mass" && toUnit.kind === "volume"
      ? fromUnit.toMetricBase / (safeDensity * toUnit.toMetricBase)
      : fromUnit.kind === "volume" && toUnit.kind === "mass"
      ? (fromUnit.toMetricBase * safeDensity) / toUnit.toMetricBase
      : fromUnit.toMetricBase / toUnit.toMetricBase;

  const formulaText =
    fromUnit.kind !== toUnit.kind
      ? `1 ${fromUnit.symbol} = ${formatCookingNumber(oneFactor)} ${toUnit.symbol} (at ρ = ${safeDensity} g/mL)`
      : `1 ${fromUnit.symbol} = ${formatCookingNumber(oneFactor)} ${toUnit.symbol}`;

  const stepExplanation =
    fromUnit.kind === "mass" && toUnit.kind === "volume"
      ? `${value} ${fromUnit.symbol} = ${formatCookingNumber(gramsEquivalent)} g ÷ ${safeDensity} g/mL = ${formatCookingNumber(millilitersEquivalent)} mL = ${formatCookingNumber(outputValue)} ${toUnit.symbol}`
      : fromUnit.kind === "volume" && toUnit.kind === "mass"
      ? `${value} ${fromUnit.symbol} = ${formatCookingNumber(millilitersEquivalent)} mL × ${safeDensity} g/mL = ${formatCookingNumber(gramsEquivalent)} g = ${formatCookingNumber(outputValue)} ${toUnit.symbol}`
      : `${value} ${fromUnit.symbol} × ${formatCookingNumber(oneFactor)} = ${formatCookingNumber(outputValue)} ${toUnit.symbol}`;

  return {
    inputValue: value,
    outputValue,
    formattedOutput: formatCookingNumber(outputValue),
    fromUnit,
    toUnit,
    densityGPerMl: safeDensity,
    gramsEquivalent,
    millilitersEquivalent,
    formulaText,
    stepExplanation,
  };
}

/**
 * Resolves any removed physically invalid pair slug to its permanent 301 redirect target URL.
 * Returns null if the slug is not an invalid cross-dimensional pair.
 */
const CULINARY_MASS_TOKENS = new Set([
  "gram",
  "grams",
  "g",
  "kilogram",
  "kilograms",
  "kg",
  "ounce",
  "ounces",
  "oz",
  "pound",
  "pounds",
  "lb",
  "lbs",
]);

const NON_CULINARY_MASS_TOKENS = new Set([
  "milligram",
  "milligrams",
  "mg",
  "microgram",
  "micrograms",
  "mcg",
  "ug",
  "ton",
  "tons",
  "short-ton",
  "short-tons",
  "us-ton",
  "us-tons",
  "metric-ton",
  "metric-tons",
  "tonne",
  "tonnes",
  "long-ton",
  "long-tons",
  "imperial-ton",
  "imperial-tons",
  "carat",
  "carats",
  "ct",
  "grain",
  "grains",
  "stone",
  "stones",
]);

const VOLUME_TOKENS = new Set([
  "teaspoon",
  "teaspoons",
  "tsp",
  "tablespoon",
  "tablespoons",
  "tbsp",
  "fluid-ounce",
  "fluid-ounces",
  "fl-oz",
  "cup",
  "cups",
  "metric-cup",
  "metric-cups",
  "pint",
  "pints",
  "pt",
  "quart",
  "quarts",
  "qt",
  "gallon",
  "gallons",
  "gal",
  "milliliter",
  "milliliters",
  "ml",
  "liter",
  "liters",
  "l",
]);

const ALLOWED_BATTERY_VOLTAGE_SLUGS = new Set([
  "ah-to-kwh",
  "kwh-to-ah",
  "ah-to-wh",
  "wh-to-ah",
  "mah-to-wh",
]);

const CHARGE_TOKENS = new Set([
  "coulomb",
  "coulombs",
  "kilocoulomb",
  "kilocoulombs",
  "millicoulomb",
  "millicoulombs",
  "microcoulomb",
  "microcoulombs",
  "nanocoulomb",
  "nanocoulombs",
  "picocoulomb",
  "picocoulombs",
  "ampere-hour",
  "ampere-hours",
  "ah",
  "milliampere-hour",
  "milliampere-hours",
  "mah",
  "faraday",
  "faradays",
]);

const ENERGY_TOKENS = new Set([
  "joule",
  "joules",
  "kilojoule",
  "kilojoules",
  "megajoule",
  "megajoules",
  "calorie",
  "calories",
  "kilocalorie",
  "kilocalories",
  "kcal",
  "watt-hour",
  "watt-hours",
  "wh",
  "kilowatt-hour",
  "kilowatt-hours",
  "kwh",
  "btu",
  "btus",
  "electronvolt",
  "electronvolts",
  "ev",
]);

export function resolveInvalidPairRedirect(
  rawCategory: string,
  rawSlug: string
): string | null {
  const cleanCat = decodeURIComponent(rawCategory)
    .trim()
    .toLowerCase()
    .replace(/\.html?$/i, "");
  const cleanSlug = decodeURIComponent(rawSlug)
    .trim()
    .toLowerCase()
    .replace(/\.html?$/i, "")
    .replace(/^(\d+(?:[._-]\d+)?)-+/, "")
    .replace(/^convert-/, "")
    .replace(/-(?:converter|calculator)$/, "");

  // 1. PPM in /density
  if (
    cleanSlug === "ppm-to-mg-per-liter" ||
    cleanSlug === "mg-per-liter-to-ppm"
  ) {
    return "/concentration-solution";
  }
  if (cleanSlug.startsWith("ppm-to-") || cleanSlug.endsWith("-to-ppm")) {
    return "/density";
  }

  const toIdx = cleanSlug.indexOf("-to-");
  if (toIdx <= 0) return null;

  const left = cleanSlug.slice(0, toIdx);
  const right = cleanSlug.slice(toIdx + 4);

  const isLeftCalorie = left === "calorie" || left === "calories";
  const isRightCalorie = right === "calorie" || right === "calories";

  const isLeftCulinaryMass = CULINARY_MASS_TOKENS.has(left);
  const isRightCulinaryMass = CULINARY_MASS_TOKENS.has(right);

  const isLeftNonCulinaryMass = NON_CULINARY_MASS_TOKENS.has(left);
  const isRightNonCulinaryMass = NON_CULINARY_MASS_TOKENS.has(right);

  const isLeftMass = isLeftCulinaryMass || isLeftNonCulinaryMass;
  const isRightMass = isRightCulinaryMass || isRightNonCulinaryMass;

  const isLeftVolume = VOLUME_TOKENS.has(left);
  const isRightVolume = VOLUME_TOKENS.has(right);

  // 2. Mass ↔ Calorie or Volume ↔ Calorie
  if (isLeftCalorie && (isRightMass || isRightVolume)) {
    if (isRightCulinaryMass) {
      return "/energy/calories-to-joules";
    }
    return "/energy";
  }
  if (isRightCalorie && (isLeftMass || isLeftVolume)) {
    if (isLeftCulinaryMass) {
      return "/energy/calories-to-joules";
    }
    if (isLeftVolume) {
      return "/volume";
    }
    return "/weight-and-mass";
  }

  // 3. Culinary Mass ↔ Volume -> Redirect to new Cooking & Ingredient Conversions tool
  if (
    (isLeftCulinaryMass && isRightVolume) ||
    (isLeftVolume && isRightCulinaryMass)
  ) {
    return "/cooking";
  }

  // 4. Non-culinary Mass ↔ Volume -> Redirect to closest valid category hub
  if (isLeftNonCulinaryMass && isRightVolume) {
    return "/weight-and-mass";
  }
  if (isLeftVolume && isRightNonCulinaryMass) {
    return "/volume";
  }

  // 5. Dynamic Charge ↔ Energy (excluding the 5 static interactive battery voltage calculators)
  if (!ALLOWED_BATTERY_VOLTAGE_SLUGS.has(cleanSlug)) {
    if (CHARGE_TOKENS.has(left) && ENERGY_TOKENS.has(right)) {
      return "/electric-charge";
    }
    if (ENERGY_TOKENS.has(left) && CHARGE_TOKENS.has(right)) {
      return "/energy";
    }
  }

  // Also catch any /weight-and-mass/*-to-calories or /volume/*-to-calories
  if (
    (cleanCat === "weight-and-mass" ||
      cleanCat === "mass" ||
      cleanCat === "volume") &&
    (isLeftCalorie || isRightCalorie)
  ) {
    return "/energy/calories-to-joules";
  }

  return null;
}
