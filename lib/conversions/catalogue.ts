import { ConversionPairInfo, Unit } from "./types";
import { CATEGORIES, CATEGORY_MAP, UNIT_MAP, UNITS, getUnitsByCategory } from "./units";
import { convertUnits } from "./engine";
import { getPairUrl, getCategoryUrl, getCategoryUrlSlug } from "./url";
import { OBSCURE_UNIT_IDS } from "./obscure-units";

export { getPairUrl, getCategoryUrl, getCategoryUrlSlug };

const RAW_CONVERSION_CATALOGUE: ConversionPairInfo[] = [
  // --- LENGTH ---
  {
    slug: "cm-to-inches",
    fromUnitId: "centimeter",
    toUnitId: "inch",
    categoryId: "length",
    primaryKeyword: "cm to inches",
    relatedKeywords: [
      "centimeters to inches",
      "cm in inches",
      "cm to inch chart",
    ],
    title: "CM to Inches — Centimeters to Inches Converter",
    h1: "Centimeters to Inches Converter (cm to in)",
    intro:
      "Convert centimeters to inches accurately for personal height, furniture dimensions, and packaging specs. Under the 1959 international definition, 1 inch equals exactly 2.54 centimeters, so dividing by 2.54 gives exact decimal inches and tape fractions.",
    metaDescription:
      "1 in = 2.54 cm exact. Convert centimeters to inches instantly for height, clothing & dimensions—with exact formula, examples & 1/16\" tape chart.",
    formulaDescription:
      "1 inch is legally defined as exactly 2.54 centimeters. To convert centimeters to inches, divide your centimeter figure by 2.54 (inches = centimeters ÷ 2.54) or multiply by 0.3937007874.",
    exampleInput: 45,
    commonValues: [3.5, 13.5, 15, 20, 30, 45, 59, 77.5, 150, 176],
    benchmarks: [
      { value: 2.54, convertedValue: "1 in", label: "One inch standard", description: "Exact 1959 international definition baseline" },
      { value: 15, convertedValue: "5.9055 in", label: "Standard pocket ruler", description: "Half-foot (~6-inch) desk ruler" },
      { value: 45, convertedValue: "17.7165 in", label: "45 cm carry-on / frame width", description: "Approximately 17.72 inches" },
      { value: 176, convertedValue: "69.2913 in", label: "176 cm adult height", description: "Approximately 5 ft 9.3 in" },
    ],
    faqs: [
      {
        question: "How many inches is 15 cm?",
        answer:
          "15 cm equals 5.9055 inches (just under 5 29/32 inches on a tape measure). Calculation: 15 ÷ 2.54 = 5.9055118 in.",
      },
      {
        question: "How many inches is 45 cm?",
        answer:
          "45 cm equals 17.7165 inches (about 17 23/32 inches). Calculation: 45 ÷ 2.54 = 17.716535 in.",
      },
      {
        question: "How many inches is 176 cm?",
        answer:
          "176 cm is equal to 69.2913 inches, or about 5 feet 9.3 inches. Calculation: 176 ÷ 2.54 = 69.291339 in.",
      },
      {
        question: "How do you convert cm to inches?",
        answer:
          "Divide the length in centimeters by 2.54 (or multiply by 0.39370079), since 1 international inch is legally defined as exactly 2.54 cm.",
      },
    ],
  },
  {
    slug: "inches-to-cm",
    fromUnitId: "inch",
    toUnitId: "centimeter",
    categoryId: "length",
    primaryKeyword: "inches to cm",
    relatedKeywords: ["inches to centimeters", "inch in cm", "inches to centimetres"],
    title: "Inches to CM — Inches to Centimeters Converter",
    h1: "Inches to Centimeters Converter (in to cm)",
    intro:
      "Convert inches to centimeters (or centimetres) with exact precision for television screens, luggage dimensions, clothing sizes, and workshop blueprints. Under the 1959 international agreement, 1 inch equals exactly 2.54 cm.",
    metaDescription:
      "1 in = 2.54 cm exact. Convert inches to centimeters (or centimetres) instantly for screen sizes, height & woodworking—with formula & tape chart.",
    formulaDescription: "To convert inches to centimeters, multiply the inch value by exactly 2.54.",
    exampleInput: 37,
    commonValues: [1, 7, 7.75, 9, 17.5, 20, 28, 37, 57, 68],
    benchmarks: [
      { value: 1, convertedValue: "2.54 cm", label: "Single inch", description: "International definition" },
      { value: 7.75, convertedValue: "19.685 cm", label: "7.75-inch skateboard deck", description: "Common board width" },
      { value: 12, convertedValue: "30.48 cm", label: "One foot", description: "Standard imperial foot" },
      { value: 68, convertedValue: "172.72 cm", label: "68-inch height (5 ft 8 in)", description: "Common height benchmark" },
    ],
    faqs: [
      {
        question: "How many centimeters (cm) are in 1 inch (in)?",
        answer: "There are exactly 2.54 centimeters (cm) in 1 inch (in). Conversely, 1 centimeter equals approximately 0.39370079 inches.",
      },
      {
        question: "How do I convert inches to centimeters (in to cm)?",
        answer: "Multiply the length in inches by 2.54 (cm = in × 2.54). For example, 37 inches × 2.54 = 93.98 cm.",
      },
      {
        question: "What is 37 inches in centimeters?",
        answer: "37 inches equals exactly 93.98 centimeters (centimetres). Calculation: 37 × 2.54 = 93.98 cm.",
      },
    ],
  },
  {
    slug: "meters-to-feet",
    fromUnitId: "meter",
    toUnitId: "foot",
    categoryId: "length",
    primaryKeyword: "meters to feet",
    relatedKeywords: ["m to ft", "meter to ft conversion chart", "metres to feet"],
    title: "Meters to Feet Converter – Free & Accurate (m to ft)",
    h1: "Meters to Feet Converter (m to ft)",
    intro:
      "Convert meters to feet quickly with our free calculator. Since 1 foot is defined as 0.3048 meters, 1 meter equals approximately 3.2808399 feet.",
    metaDescription:
      "Convert meters to feet (m to ft) instantly for free. Includes the exact 3.28084 multiplier formula, worked example, and conversion chart.",
    formulaDescription: "1 meter is equivalent to approximately 3.280839895 feet. Multiply meters by 3.28084 to find feet.",
    exampleInput: 50,
    commonValues: [1.6, 2.2, 8, 15, 25, 50, 60, 100, 300],
    benchmarks: [
      { value: 1, convertedValue: "3.2808 ft", label: "One meter", description: "Slightly longer than a yard" },
      { value: 50, convertedValue: "164.042 ft", label: "Olympic swimming pool", description: "50-meter lap pool length" },
      { value: 100, convertedValue: "328.084 ft", label: "100-meter dash track", description: "Olympic sprint straight" },
    ],
    faqs: [
      {
        question: "How many feet is 15 meters?",
        answer: "15 meters equals 49.2126 feet (about 49 feet 2.55 inches). Calculation: 15 ÷ 0.3048 = 49.2125984 ft.",
      },
      {
        question: "How many feet is 50 meters?",
        answer: "50 meters (or 50 metres) equals 164.042 feet. Calculation: 50 ÷ 0.3048 = 164.0419948 ft.",
      },
      {
        question: "How many feet is 100 meters?",
        answer: "100 meters is equal to 328.084 feet. Calculation: 100 ÷ 0.3048 = 328.0839895 ft.",
      },
      {
        question: "What is 1.60 m in feet?",
        answer: "1.60 meters equals 5.2493 feet, which is approximately 5 feet 3 inches. Calculation: 1.60 ÷ 0.3048 = 5.2493438 ft.",
      },
    ],
  },
  {
    slug: "feet-to-meters",
    fromUnitId: "foot",
    toUnitId: "meter",
    categoryId: "length",
    title: "Feet to Meters Converter – Free & Instant (ft to m)",
    metaDescription: "Convert feet to meters (ft to m) accurately for free. Features exact 0.3048 multiplier formula, worked example, and conversion table.",
    formulaDescription: "1 foot equals exactly 0.3048 meters. Multiply your feet measurement by 0.3048 to obtain meters.",
    exampleInput: 8,
    commonValues: [2.5, 3.5, 4, 6, 8, 10, 15, 18, 24, 90, 150],
    benchmarks: [
      { value: 1, convertedValue: "0.3048 m", label: "One foot", description: "12 inches" },
      { value: 6, convertedValue: "1.8288 m", label: "6-foot tall person", description: "Common height benchmark" },
      { value: 5280, convertedValue: "1,609.344 m (1.609 km)", label: "One statute mile", description: "Distance of 1 mile" },
    ],
  },
  {
    slug: "km-to-miles",
    fromUnitId: "kilometer",
    toUnitId: "mile",
    categoryId: "length",
    primaryKeyword: "kilometers to miles converter",
    relatedKeywords: [
      "km to mi converter",
      "conversion chart for kilometers to miles",
      "kilometres to miles",
    ],
    title: "KM to Miles — Kilometers to Miles Converter",
    h1: "Kilometers to Miles Converter (km to mi)",
    intro:
      "Convert kilometers (km) to miles (mi) with exact precision for road trips, race distances, and international travel planning. Because 1 statute mile equals exactly 1.609344 kilometers, 1 km equals 0.62137119 miles.",
    metaDescription:
      "1 km = 0.62137 mi. Use our km to mi converter for road distances, running races & travel—with exact 1.609344 divisor formula, examples & chart.",
    formulaDescription: "1 kilometer equals approximately 0.62137119 miles. To convert km to miles, multiply by 0.62137119 (or divide by 1.609344).",
    exampleInput: 21,
    commonValues: [3.5, 5, 10.5, 14, 21, 36, 100, 130, 200, 900],
    benchmarks: [
      { value: 5, convertedValue: "3.10686 mi", label: "5K Fun Run", description: "Popular running distance" },
      { value: 21, convertedValue: "13.0488 mi", label: "21 km benchmark", description: "Just under a half marathon (21.1 km)" },
      { value: 42.195, convertedValue: "26.2188 mi", label: "Marathon race", description: "Official Olympic marathon distance" },
    ],
    faqs: [
      {
        question: "How many miles is a kilometer?",
        answer: "One kilometer equals approximately 0.621371 miles (just over three-fifths of a mile). Calculation: 1 ÷ 1.609344 = 0.62137119 mi.",
      },
      {
        question: "How many miles is 21 km?",
        answer: "21 kilometers equals 13.0488 miles. Calculation: 21 ÷ 1.609344 = 13.048795 mi.",
      },
      {
        question: "How many miles is 200 km?",
        answer: "200 kilometers equals 124.27424 miles. Calculation: 200 ÷ 1.609344 = 124.274238 mi.",
      },
    ],
  },
  {
    slug: "miles-to-km",
    fromUnitId: "mile",
    toUnitId: "kilometer",
    categoryId: "length",
    title: "Miles to KM Converter – Free Miles to Kilometers",
    metaDescription: "Convert miles to kilometers (mi to km) instantly for free. Includes the exact 1.609344 multiplier formula, worked example, and chart.",
    formulaDescription: "1 statute mile is legally defined as exactly 1.609344 kilometers. Multiply miles by 1.609344 to get kilometers.",
    exampleInput: 50,
    commonValues: [2.5, 3, 5, 6, 15, 50, 70, 80, 300, 800],
    benchmarks: [
      { value: 1, convertedValue: "1.60934 km", label: "One mile", description: "5,280 feet" },
      { value: 60, convertedValue: "96.5606 km", label: "60 mph highway distance (1 hr)", description: "Typical interstate travel" },
      { value: 26.2, convertedValue: "42.1648 km", label: "Marathon", description: "26.2 statute miles" },
    ],
  },
  {
    slug: "yards-to-meters",
    fromUnitId: "yard",
    toUnitId: "meter",
    categoryId: "length",
    title: "Yards to Meters Converter (yd to m)",
    metaDescription: "Convert yards to meters (yd to m) instantly with live formula (multiply by 0.9144), conversion matrix, and sports field reference measurements.",
    formulaDescription: "1 yard equals exactly 0.9144 meters. Multiply yards by 0.9144 to convert to meters.",
    exampleInput: 100,
  },
  {
    slug: "meters-to-yards",
    fromUnitId: "meter",
    toUnitId: "yard",
    categoryId: "length",
    title: "Meters to Yards Converter (m to yd)",
    metaDescription: "Convert meters to yards (m to yd) with live calculations, worked steps, and reference charts.",
    formulaDescription: "1 meter equals approximately 1.09361 yards. Multiply meters by 1.09361 to convert to yards.",
    exampleInput: 50,
  },
  {
    slug: "mm-to-inches",
    fromUnitId: "millimeter",
    toUnitId: "inch",
    categoryId: "length",
    primaryKeyword: "millimeter to inches",
    relatedKeywords: [
      "convert mm into inch",
      "mm to decimal calculator",
      "mm to fractional inches conversion",
      "millimeters to inches",
    ],
    title: "MM to Inches — Millimeter to Inches Converter",
    h1: "Millimeters to Inches Converter (mm to in)",
    intro:
      "Convert millimeter to inches measurements accurately for fasteners, pipe diameters, and workshop layouts. Dividing millimeters by 25.4 converts mm into inch decimals and nearest tape-measure fractions.",
    metaDescription:
      "1 mm = 0.03937008 in (divide by 25.4). Convert mm into inch decimals or 1/16\" & 1/64\" tape fractions fast with our formula and reference table.",
    formulaDescription: "1 inch equals exactly 25.4 mm. Divide millimeters by 25.4 to convert to inches.",
    exampleInput: 22,
    commonValues: [1, 3, 5, 6, 10, 19, 22, 24, 28, 150, 205],
    benchmarks: [
      { value: 1, convertedValue: "0.03937 in", label: "Credit card thickness (~0.8–1 mm)", description: "Standard sheet gauge" },
      { value: 10, convertedValue: "0.3937 in (~3/8 in)", label: "10 mm socket wrench", description: "Most common metric automotive fastener" },
      { value: 25.4, convertedValue: "1 in", label: "Exact 1-inch international standard", description: "1959 International Yard & Pound definition" },
    ],
    faqs: [
      {
        question: "How many inches is 15 mm?",
        answer:
          "15 mm is equal to approximately 0.5906 inches, which is just under 19/32 of an inch (0.5938 in) on a standard tape measure. Calculation: 15 ÷ 25.4 = 0.59055118 in.",
      },
      {
        question: "How many mm to the inch?",
        answer:
          "There are exactly 25.4 millimeters in 1 international inch under the 1959 International Yard and Pound Agreement. Conversely, 1 millimeter equals 0.03937008 inches (1 ÷ 25.4).",
      },
      {
        question: "How many inches is 12 mm?",
        answer:
          "12 mm equals approximately 0.4724 inches, or roughly 15/32 of an inch (0.4688 in) on a ruler. Calculation: 12 ÷ 25.4 = 0.47244094 in.",
      },
      {
        question: "How many inches is 120 mm?",
        answer:
          "120 mm is equal to approximately 4.7244 inches (about 4 23/32 inches), a standard frame size for PC cooling fans. Calculation: 120 ÷ 25.4 = 4.72440945 in.",
      },
      {
        question: "How many inches is 14 mm?",
        answer:
          "14 mm equals approximately 0.5512 inches, which sits close to 9/16 of an inch (0.5625 in). Calculation: 14 ÷ 25.4 = 0.55118110 in.",
      },
    ],
  },
  {
    slug: "inches-to-mm",
    fromUnitId: "inch",
    toUnitId: "millimeter",
    categoryId: "length",
    primaryKeyword: "convert inches to millimeters",
    relatedKeywords: [
      "inches to mm calculator",
      "inches to millimeters conversion",
      "inch convert to mm chart",
    ],
    title: "Inches to MM Calculator — Convert Inches to Millimeters",
    h1: "Inches to Millimeters Converter (in to mm)",
    intro:
      "Convert decimal or fractional inches to millimeters with exact precision. Because 1 international inch equals exactly 25.4 mm, multiplying inches by 25.4 yields the exact millimeter dimension.",
    metaDescription:
      "1 in = 25.4 mm exact. Instant inches to millimeters conversion for decimal & fractional inches (1/16\", 1/32\"), formula, examples & reference chart.",
    formulaDescription: "1 inch equals exactly 25.4 millimeters. Multiply inches by 25.4.",
    exampleInput: 5,
    commonValues: [0.3, 1, 1.375, 2, 2.4, 2.5, 3, 4, 5, 18, 45],
    benchmarks: [
      { value: 0.125, convertedValue: "3.175 mm", label: "1/8 inch drill bit", description: "Standard fractional hardware size" },
      { value: 0.25, convertedValue: "6.35 mm", label: "1/4 inch hex shank", description: "Universal power tool bit size" },
      { value: 0.5, convertedValue: "12.7 mm", label: "1/2 inch drive socket", description: "Heavy-duty wrench drive" },
      { value: 1, convertedValue: "25.4 mm", label: "1 international inch", description: "Exact SI definition" },
    ],
    faqs: [
      {
        question: "How many mm is 5 inches?",
        answer: "5 inches is equal to exactly 127 millimeters. Calculation: 5 × 25.4 = 127 mm.",
      },
      {
        question: "How many mm is 3.5 inches?",
        answer: "3.5 inches equals exactly 88.9 millimeters. Calculation: 3.5 × 25.4 = 88.9 mm.",
      },
      {
        question: "What is 1/4 inch and 5/8 inch in mm?",
        answer: "1/4 inch (0.25 in) equals 6.35 mm (0.25 × 25.4), and 5/8 inch (0.625 in) equals 15.875 mm (0.625 × 25.4).",
      },
      {
        question: "What is 3/16 inch and 7/8 inch in millimetres?",
        answer: "3/16 inch (0.1875 in) equals 4.7625 mm (0.1875 × 25.4), while 7/8 inch (0.875 in) equals 22.225 mm (0.875 × 25.4).",
      },
    ],
  },
  {
    slug: "feet-to-inches",
    fromUnitId: "foot",
    toUnitId: "inch",
    categoryId: "length",
    title: "Feet to Inches Converter – Free & Instant (ft to in)",
    metaDescription: "Convert feet to inches (ft to in) instantly for free. Includes the exact 12-inch multiplier formula, height chart, and worked examples.",
    formulaDescription: "There are exactly 12 inches in one foot. Multiply feet by 12.",
    exampleInput: 6,
    commonValues: [2, 3, 5.5, 6, 8, 9, 12],
    benchmarks: [
      { value: 1, convertedValue: "12 in", label: "Standard 1-foot ruler", description: "12 inches exactly" },
      { value: 5, convertedValue: "60 in", label: "5-foot stature mark", description: "60 inches total height" },
      { value: 6, convertedValue: "72 in", label: "6-foot stature / doorway width", description: "72 inches" },
      { value: 8, convertedValue: "96 in", label: "Standard residential ceiling height", description: "8-foot drywall stud length" },
    ],
  },
  {
    slug: "inches-to-feet",
    fromUnitId: "inch",
    toUnitId: "foot",
    categoryId: "length",
    primaryKeyword: "convert inches to feet",
    relatedKeywords: [
      "conversion inch to feet",
      "inches into linear feet",
      "inches to tenths of a foot",
      "inches to survey feet",
    ],
    title: "Inches to Feet — Convert Inches to Feet (in to ft)",
    h1: "Inches to Feet Converter (in to ft)",
    metaDescription:
      "12 in = 1 ft exact (1 in = 0.08333 ft). Fast inch-to-feet conversion in decimal feet, tenths of a foot & ft-in for height, framing & survey work.",
    formulaDescription: "Divide inches by 12 to convert to feet.",
    exampleInput: 69,
    benchmarks: [
      { value: 36, convertedValue: "3 ft (1 yd)", label: "Standard countertop height", description: "36 inches = 3 feet" },
      { value: 60, convertedValue: "5 ft", label: "5 feet height", description: "60 inches" },
      { value: 69, convertedValue: "5.75 ft (5 ft 9 in)", label: "5 ft 9 in adult height", description: "69 inches" },
      { value: 80, convertedValue: "6.6667 ft (6 ft 8 in)", label: "Standard US interior door height", description: "80-inch door slab" },
    ],
  },
  {
    slug: "miles-to-feet",
    fromUnitId: "mile",
    toUnitId: "foot",
    categoryId: "length",
    title: "Miles to Feet Converter (mi to ft)",
    metaDescription: "Convert miles to feet (mi to ft). 5,280 feet per mile formula, elevation calculations, and reference charts.",
    formulaDescription: "1 statute mile equals exactly 5,280 feet. Multiply miles by 5,280.",
    exampleInput: 1,
  },
  {
    slug: "nautical-miles-to-km",
    fromUnitId: "nautical_mile",
    toUnitId: "kilometer",
    categoryId: "length",
    title: "Nautical Miles to Kilometers Converter (nmi to km)",
    metaDescription: "Convert maritime nautical miles to kilometers with exact 1.852 km definition factor and aviation benchmarks.",
    formulaDescription: "1 international nautical mile is defined as exactly 1.852 kilometers (1,852 meters). Multiply nautical miles by 1.852.",
    exampleInput: 10,
  },
  {
    slug: "micrometers-to-mm",
    fromUnitId: "micrometer",
    toUnitId: "millimeter",
    categoryId: "length",
    title: "Micrometers to Millimeters Converter (µm to mm)",
    metaDescription: "Convert micrometers (microns) to millimeters for microscopic imaging, biology, and precision machining.",
    formulaDescription: "1 millimeter equals 1,000 micrometers. Divide micrometers by 1,000.",
    exampleInput: 500,
  },
  {
    slug: "cm-to-feet",
    fromUnitId: "centimeter",
    toUnitId: "foot",
    categoryId: "length",
    title: "Centimeters to Feet Converter (cm to ft)",
    metaDescription: "Convert centimeters to feet (cm to ft) for human height, architectural dimensions, and construction with exact 30.48 cm divisor.",
    formulaDescription: "1 foot equals exactly 30.48 centimeters. Divide centimeters by 30.48 to convert to feet.",
    exampleInput: 175,
    benchmarks: [
      { value: 160, convertedValue: "5.249 ft (5 ft 3 in)", label: "Average female height", description: "Global height average" },
      { value: 175, convertedValue: "5.741 ft (5 ft 8.9 in)", label: "Average male height", description: "US male height average" },
      { value: 183, convertedValue: "6.004 ft (6 ft)", label: "6-foot milestone", description: "6-foot height mark" },
    ],
  },
  {
    slug: "feet-to-cm",
    fromUnitId: "foot",
    toUnitId: "centimeter",
    categoryId: "length",
    title: "Feet to Centimeters Converter (ft to cm)",
    metaDescription: "Convert feet to centimeters (ft to cm) in real time. Multiply feet by 30.48 with exact legal conversion factors.",
    formulaDescription: "Multiply feet by 30.48 to convert to centimeters.",
    exampleInput: 6,
  },
  {
    slug: "cm-to-meters",
    fromUnitId: "centimeter",
    toUnitId: "meter",
    categoryId: "length",
    title: "Centimeters to Meters Converter (cm to m)",
    metaDescription: "Convert centimeters to meters (cm to m) instantly with exact 100 divisor formula.",
    formulaDescription: "1 meter contains 100 centimeters. Divide centimeters by 100.",
    exampleInput: 150,
  },
  {
    slug: "meters-to-cm",
    fromUnitId: "meter",
    toUnitId: "centimeter",
    categoryId: "length",
    title: "Meters to Centimeters Converter (m to cm)",
    metaDescription: "Convert meters to centimeters (m to cm). Multiply meters by 100.",
    formulaDescription: "Multiply meters by 100 to calculate centimeters.",
    exampleInput: 1.75,
  },
  {
    slug: "meters-to-mm",
    fromUnitId: "meter",
    toUnitId: "millimeter",
    categoryId: "length",
    title: "Meters to Millimeters Converter (m to mm)",
    metaDescription: "Convert meters to millimeters (m to mm) with exact 1,000 multiplier for engineering schematics.",
    formulaDescription: "1 meter contains 1,000 millimeters. Multiply meters by 1,000.",
    exampleInput: 2.5,
  },
  {
    slug: "mm-to-meters",
    fromUnitId: "millimeter",
    toUnitId: "meter",
    categoryId: "length",
    title: "Millimeters to Meters Converter (mm to m)",
    metaDescription: "Convert millimeters to meters (mm to m). Divide millimeters by 1,000.",
    formulaDescription: "Divide millimeters by 1,000 to convert to meters.",
    exampleInput: 2500,
  },
  {
    slug: "meters-to-inches",
    fromUnitId: "meter",
    toUnitId: "inch",
    categoryId: "length",
    title: "Meters to Inches Converter (m to in)",
    metaDescription: "Convert meters to inches (m to in) with exact 39.3701 multiplier for textiles and construction.",
    formulaDescription: "1 meter equals approximately 39.3700787 inches. Multiply meters by 39.3701.",
    exampleInput: 1.8,
  },
  {
    slug: "inches-to-meters",
    fromUnitId: "inch",
    toUnitId: "meter",
    categoryId: "length",
    title: "Inches to Meters Converter (in to m)",
    metaDescription: "Convert inches to meters (in to m) with exact 0.0254 multiplier.",
    formulaDescription: "Multiply inches by 0.0254 to convert to meters.",
    exampleInput: 70,
  },
  {
    slug: "feet-to-km",
    fromUnitId: "foot",
    toUnitId: "kilometer",
    categoryId: "length",
    title: "Feet to Kilometers Converter (ft to km)",
    metaDescription: "Convert feet to kilometers (ft to km) for altitude and flight elevations. Divide feet by 3,280.84.",
    formulaDescription: "Divide feet by 3,280.8399 to convert to kilometers.",
    exampleInput: 10000,
  },
  {
    slug: "km-to-feet",
    fromUnitId: "kilometer",
    toUnitId: "foot",
    categoryId: "length",
    title: "Kilometers to Feet Converter (km to ft)",
    metaDescription: "Convert kilometers to feet (km to ft) with live calculations. Multiply kilometers by 3,280.84.",
    formulaDescription: "Multiply kilometers by 3,280.8399 to convert to feet.",
    exampleInput: 5,
  },

  // --- MASS & WEIGHT (17) ---
  {
    slug: "kg-to-lbs",
    fromUnitId: "kilogram",
    toUnitId: "pound",
    categoryId: "mass",
    primaryKeyword: "kg to lbs",
    relatedKeywords: [
      "kg vs. lb",
      "kg to lbs conversion chart",
      "conversion chart kilograms to pounds",
      "kilos to pounds chart",
    ],
    title: "Kg to Lbs — Kilograms to Pounds Converter",
    h1: "Kilograms to Pounds Converter (kg to lb)",
    metaDescription: "1 kg = 2.20462262 lb. Convert kilograms to pounds instantly with our kg to lbs conversion chart, kg vs. lb comparison, formula & worked examples.",
    formulaDescription: "1 kilogram equals approximately 2.20462262 pounds (avoirdupois). Multiply kg by 2.20462262 to calculate pounds.",
    exampleInput: 70,
    benchmarks: [
      { value: 1, convertedValue: "2.20462 lbs", label: "One kilogram", description: "Standard bag of flour / 1L water" },
      { value: 20, convertedValue: "44.0925 lbs", label: "Olympic barbell plate", description: "20 kg plate" },
      { value: 70, convertedValue: "154.324 lbs", label: "Average adult human mass", description: "Typical adult baseline" },
    ],
    faqs: [
      {
        question: "How many kilos are in a pound?",
        answer: "There are exactly 0.45359237 kilograms (kilos) in 1 international avoirdupois pound—about 0.4536 kg, or roughly 454 grams.",
      },
      {
        question: "How many pounds (lb) are in 1 kilogram (kg)?",
        answer: "There are 2.20462262 pounds (lb) in 1 kilogram (kg), which rounds to 2.2046 lb for everyday calculations.",
      },
    ],
  },
  {
    slug: "lbs-to-kg",
    fromUnitId: "pound",
    toUnitId: "kilogram",
    categoryId: "mass",
    primaryKeyword: "lbs to kg",
    relatedKeywords: [
      "us pounds to kilograms",
      "us lbs to kg",
      "one pound to one kilo",
      "lbs to kgs chart",
      "pounds to kilograms chart powerlifting",
    ],
    title: "Lbs to Kg — Convert US Pounds to Kilograms",
    h1: "Pounds to Kilograms Converter (lb to kg)",
    metaDescription: "1 lb = 0.45359237 kg. Convert US lbs to kg instantly—from one pound to one kilo or body & lifting weights—with exact formula, examples & chart.",
    formulaDescription: "1 pound (avoirdupois) is legally defined as exactly 0.45359237 kilograms. Multiply pounds by 0.45359237 to get kilograms.",
    exampleInput: 150,
    benchmarks: [
      { value: 50, convertedValue: "22.6796 kg", label: "Airline checked luggage limit", description: "Standard 50 lb luggage allowance" },
      { value: 100, convertedValue: "45.3592 kg", label: "100 lbs weight", description: "Half-hundredweight" },
    ],
  },
  {
    slug: "grams-to-ounces",
    fromUnitId: "gram",
    toUnitId: "ounce",
    categoryId: "mass",
    primaryKeyword: "grams to ounces",
    relatedKeywords: [
      "how to convert grams to oz formula",
      "how many grams in a half ounce",
      "how many grams in a quarter ounce",
      "are grams or ounces bigger",
    ],
    title: "Grams to Ounces (g to oz) Converter",
    h1: "Grams to Ounces Converter (g to oz)",
    metaDescription: "1 oz = 28.3495 g (1 g = 0.03527 oz). Convert grams to ounces instantly for cooking, baking & postal shipping—with formula, examples & lookup chart.",
    formulaDescription: "1 avoirdupois ounce equals 28.349523125 grams. To convert grams to ounces, divide by 28.349523 (or multiply by 0.03527396).",
    exampleInput: 500,
    benchmarks: [
      { value: 28.35, convertedValue: "1 oz", label: "Single avoirdupois ounce", description: "Standard postal & kitchen ounce" },
      { value: 142, convertedValue: "5.0089 oz", label: "5 oz kitchen portion", description: "Typical recipe weight" },
      { value: 250, convertedValue: "8.8185 oz", label: "Standard coffee bag", description: "Quarter-kilogram pouch" },
      { value: 500, convertedValue: "17.637 oz", label: "500g grocery pack", description: "Half-kilogram package" },
    ],
    faqs: [
      { question: "What is the formula to convert grams to oz?", answer: "Use oz = g ÷ 28.349523 (or oz = g × 0.03527396). For example, 500 g ÷ 28.349523 equals 17.63698 oz." },
      { question: "How many grams are in a half ounce?", answer: "There are approximately 14.1748 grams (14.17476 g exact) in a half avoirdupois ounce (0.5 oz), often rounded to 14.2 g." },
      { question: "How many grams are in a quarter ounce?", answer: "There are approximately 7.0874 grams (7.08738 g exact) in a quarter avoirdupois ounce (0.25 oz), often rounded to 7.1 g." },
    ],
  },
  {
    slug: "ounces-to-grams",
    fromUnitId: "ounce",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Ounces to Grams Converter (oz to g)",
    metaDescription: "Convert ounces to grams (oz to g) with real-time recipe scaling, exact 28.3495 factor, and cooking measurement tables.",
    formulaDescription: "1 avoirdupois ounce equals 28.349523125 grams. Multiply ounces by 28.3495.",
    exampleInput: 8,
    benchmarks: [
      { value: 1, convertedValue: "28.3495 g", label: "1 oz postal letter limit", description: "USPS first-class base weight" },
      { value: 4, convertedValue: "113.4 g", label: "Quarter-pound burger patty (4 oz)", description: "1/4 lb kitchen portion" },
      { value: 8, convertedValue: "226.8 g", label: "Half-pound block of butter (8 oz)", description: "2 US sticks of butter" },
      { value: 16, convertedValue: "453.592 g", label: "One full pound (16 oz)", description: "Exact legal pound in grams" },
    ],
  },
  {
    slug: "kg-to-grams",
    fromUnitId: "kilogram",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Kilograms to Grams Converter (kg to g)",
    metaDescription: "Convert kilograms to grams (kg to g) instantly with exact 1,000 multiplier and dynamic conversion grid.",
    formulaDescription: "1 kilogram equals exactly 1,000 grams. Multiply kilograms by 1,000.",
    exampleInput: 2.5,
  },
  {
    slug: "grams-to-kg",
    fromUnitId: "gram",
    toUnitId: "kilogram",
    categoryId: "mass",
    title: "Grams to Kilograms Converter (g to kg)",
    metaDescription: "Convert grams to kilograms (g to kg) in real time. Divide by 1,000 with clear step-by-step arithmetic.",
    formulaDescription: "Divide grams by 1,000 to convert to kilograms.",
    exampleInput: 500,
  },
  {
    slug: "stone-to-lbs",
    fromUnitId: "stone",
    toUnitId: "pound",
    categoryId: "mass",
    title: "Stone to Pounds Converter (st to lbs)",
    metaDescription: "Convert British stone to pounds (st to lbs) for body weight tracking with exact 14-pound multiplier and breakdown.",
    formulaDescription: "1 stone equals exactly 14 pounds (avoirdupois). Multiply stone by 14.",
    exampleInput: 11,
  },
  {
    slug: "lbs-to-stone",
    fromUnitId: "pound",
    toUnitId: "stone",
    categoryId: "mass",
    title: "Pounds to Stone Converter (lbs to st)",
    metaDescription: "Convert pounds to British stone (lbs to st) with real-time conversion and body weight reference tables.",
    formulaDescription: "Divide pounds by 14 to convert to stone.",
    exampleInput: 154,
  },
  {
    slug: "metric-tons-to-us-tons",
    fromUnitId: "metric_ton",
    toUnitId: "us_ton",
    categoryId: "mass",
    title: "Metric Tons to US Short Tons Converter (t to ton)",
    metaDescription: "Convert metric tonnes to US short tons for freight, shipping, and industrial cargo calculation.",
    formulaDescription: "1 metric ton (1,000 kg) equals approximately 1.102311 US short tons (2,000 lbs). Multiply tonnes by 1.10231.",
    exampleInput: 10,
  },
  {
    slug: "mg-to-grams",
    fromUnitId: "milligram",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Milligrams to Grams Converter (mg to g)",
    metaDescription: "Convert milligrams to grams (mg to g) for medication dosages, laboratory experiments, and nutrition facts.",
    formulaDescription: "1 gram equals 1,000 milligrams. Divide milligrams by 1,000 to get grams.",
    exampleInput: 500,
  },
  {
    slug: "ounces-to-pounds",
    fromUnitId: "ounce",
    toUnitId: "pound",
    categoryId: "mass",
    primaryKeyword: "ounces to pounds",
    relatedKeywords: [
      "ounce conversion chart",
      "ounces in a pound chart",
      "ounces pounds chart",
      "how many ounces in a pound of meat",
    ],
    title: "Ounces to Pounds (oz to lbs) Converter & Chart",
    h1: "Ounces to Pounds Converter (oz to lb)",
    metaDescription:
      "16 oz = 1 lb exact (1 oz = 0.0625 lb). Convert ounces to pounds fast for meat, cooking & shipping—with ounce conversion chart, formula & examples.",
    formulaDescription: "There are exactly 16 ounces in 1 avoirdupois pound. Divide ounces by 16.",
    exampleInput: 32,
  },
  {
    slug: "pounds-to-ounces",
    fromUnitId: "pound",
    toUnitId: "ounce",
    categoryId: "mass",
    title: "Pounds to Ounces Converter (lbs to oz)",
    metaDescription: "Convert pounds to ounces (lbs to oz) with live calculation. Multiply pounds by 16.",
    formulaDescription: "Multiply pounds by 16 to find ounces.",
    exampleInput: 2.5,
  },
  {
    slug: "grams-to-pounds",
    fromUnitId: "gram",
    toUnitId: "pound",
    categoryId: "mass",
    primaryKeyword: "convert g to lb",
    relatedKeywords: [
      "convert grams into pounds calculator",
      "how many grams in a quarter pound",
      "grams in a pound of meat",
    ],
    title: "Grams to Pounds — Convert G to Lb (g to lbs)",
    h1: "Grams to Pounds Converter (g to lb)",
    metaDescription:
      "453.59237 g = 1 lb exact. Free convert grams into pounds calculator for meat, baking & parcels—with quarter-pound guide, formula & chart.",
    formulaDescription: "1 pound equals exactly 453.59237 grams. Divide grams by 453.59237.",
    exampleInput: 500,
  },
  {
    slug: "pounds-to-grams",
    fromUnitId: "pound",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Pounds to Grams Converter (lbs to g)",
    metaDescription: "Convert pounds to grams (lbs to g) in real time. Multiply pounds by 453.59237.",
    formulaDescription: "Multiply pounds by 453.59237 to calculate grams.",
    exampleInput: 2.2,
  },
  {
    slug: "micrograms-to-grams",
    fromUnitId: "microgram",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Micrograms to Grams Converter (µg to g)",
    metaDescription: "Convert micrograms (mcg) to grams (g) for biochemistry and lab formulations.",
    formulaDescription: "1 gram contains 1,000,000 micrograms. Divide micrograms by 1,000,000.",
    exampleInput: 100000,
  },
  {
    slug: "milligrams-to-micrograms",
    fromUnitId: "milligram",
    toUnitId: "microgram",
    categoryId: "mass",
    title: "Milligrams to Micrograms Converter (mg to µg)",
    metaDescription: "Convert milligrams (mg) to micrograms (mcg) for pharmacy and medical dosing. Multiply by 1,000.",
    formulaDescription: "1 milligram equals 1,000 micrograms. Multiply milligrams by 1,000.",
    exampleInput: 5,
  },
  {
    slug: "micrograms-to-milligrams",
    fromUnitId: "microgram",
    toUnitId: "milligram",
    categoryId: "mass",
    title: "Micrograms to Milligrams Converter (µg to mg)",
    metaDescription: "Convert micrograms (mcg) to milligrams (mg). Divide micrograms by 1,000.",
    formulaDescription: "Divide micrograms by 1,000 to convert to milligrams.",
    exampleInput: 500,
  },

  // --- TEMPERATURE (8) ---
  {
    slug: "celsius-to-fahrenheit",
    fromUnitId: "celsius",
    toUnitId: "fahrenheit",
    categoryId: "temperature",
    title: "Celsius to Fahrenheit Converter (°C to °F)",
    metaDescription: "Convert Celsius to Fahrenheit (°C to °F) with real-time temperature calculations, step-by-step formula (°C × 9/5 + 32), and reference chart.",
    formulaDescription: "Multiply the Celsius temperature by 1.8 (or 9/5) and add 32: °F = (°C × 9/5) + 32.",
    exampleInput: 25,
    benchmarks: [
      { value: -40, convertedValue: "-40 °F", label: "Intersection point", description: "The single point where °C and °F are equal" },
      { value: 0, convertedValue: "32 °F", label: "Freezing point of water", description: "Ice melts at 0 °C (32 °F)" },
      { value: 20, convertedValue: "68 °F", label: "Comfortable room temperature", description: "Standard indoor ambient" },
      { value: 37, convertedValue: "98.6 °F", label: "Normal human body temperature", description: "Average healthy internal temp" },
      { value: 100, convertedValue: "212 °F", label: "Boiling point of water", description: "At 1 standard atmosphere" },
    ],
  },
  {
    slug: "fahrenheit-to-celsius",
    fromUnitId: "fahrenheit",
    toUnitId: "celsius",
    categoryId: "temperature",
    title: "Fahrenheit to Celsius Converter (°F to °C)",
    metaDescription: "Convert Fahrenheit to Celsius (°F to °C) instantly. Exact formula: (°F - 32) × 5/9 with live substitution and weather guide.",
    formulaDescription: "Subtract 32 from the Fahrenheit temperature and then multiply by 5/9 (or divide by 1.8): °C = (°F - 32) × 5/9.",
    exampleInput: 72,
    benchmarks: [
      { value: 32, convertedValue: "0 °C", label: "Water freezing", description: "Pure water turns to ice" },
      { value: 72, convertedValue: "22.22 °C", label: "Room temperature", description: "Typical home thermostat setting" },
      { value: 212, convertedValue: "100 °C", label: "Water boiling", description: "Sea level boiling point" },
    ],
  },
  {
    slug: "celsius-to-kelvin",
    fromUnitId: "celsius",
    toUnitId: "kelvin",
    categoryId: "temperature",
    title: "Celsius to Kelvin Converter (°C to K)",
    metaDescription: "Convert Celsius to Kelvin (°C to K) for scientific and thermodynamic calculations. Exact offset formula: K = °C + 273.15.",
    formulaDescription: "Kelvin is the thermodynamic absolute temperature scale. Add 273.15 to the Celsius value: K = °C + 273.15.",
    exampleInput: 25,
    benchmarks: [
      { value: -273.15, convertedValue: "0 K", label: "Absolute Zero", description: "Theoretical minimum temperature where all molecular motion ceases" },
      { value: 0, convertedValue: "273.15 K", label: "Water freezing point", description: "Standard STP reference" },
      { value: 100, convertedValue: "373.15 K", label: "Water boiling point", description: "Boiling point at standard pressure" },
    ],
  },
  {
    slug: "kelvin-to-celsius",
    fromUnitId: "kelvin",
    toUnitId: "celsius",
    categoryId: "temperature",
    title: "Kelvin to Celsius Converter (K to °C)",
    metaDescription: "Convert Kelvin to Celsius (K to °C) with live formula step (subtract 273.15), reference table, and physics notes.",
    formulaDescription: "Subtract 273.15 from the Kelvin value: °C = K - 273.15.",
    exampleInput: 300,
  },
  {
    slug: "fahrenheit-to-kelvin",
    fromUnitId: "fahrenheit",
    toUnitId: "kelvin",
    categoryId: "temperature",
    title: "Fahrenheit to Kelvin Converter (°F to K)",
    metaDescription: "Convert Fahrenheit to Kelvin (°F to K) in real time with step-by-step formula substitution and reference scale.",
    formulaDescription: "Convert Fahrenheit to Celsius then add 273.15: K = (°F - 32) × 5/9 + 273.15.",
    exampleInput: 68,
  },
  {
    slug: "kelvin-to-fahrenheit",
    fromUnitId: "kelvin",
    toUnitId: "fahrenheit",
    categoryId: "temperature",
    title: "Kelvin to Fahrenheit Converter (K to °F)",
    metaDescription: "Convert Kelvin to Fahrenheit (K to °F) for astrophysics and cryogenics with exact mathematical conversion.",
    formulaDescription: "Subtract 273.15, multiply by 9/5, and add 32: °F = (K - 273.15) × 9/5 + 32.",
    exampleInput: 293.15,
  },
  {
    slug: "celsius-to-rankine",
    fromUnitId: "celsius",
    toUnitId: "rankine",
    categoryId: "temperature",
    title: "Celsius to Rankine Converter (°C to °R)",
    metaDescription: "Convert Celsius to Rankine (°C to °R) with thermodynamic absolute scale formulas for aerospace engineering.",
    formulaDescription: "Add 273.15 to Celsius and multiply by 1.8: °R = (°C + 273.15) × 1.8.",
    exampleInput: 20,
  },
  {
    slug: "fahrenheit-to-rankine",
    fromUnitId: "fahrenheit",
    toUnitId: "rankine",
    categoryId: "temperature",
    title: "Fahrenheit to Rankine Converter (°F to °R)",
    metaDescription: "Convert Fahrenheit to Rankine (°F to °R). Direct offset formula: °R = °F + 459.67.",
    formulaDescription: "Rankine is the absolute thermodynamic scale using Fahrenheit-sized degrees. Add 459.67 to Fahrenheit: °R = °F + 459.67.",
    exampleInput: 70,
  },

  // --- AREA (10) ---
  {
    slug: "sq-feet-to-sq-meters",
    fromUnitId: "sq_foot",
    toUnitId: "sq_meter",
    categoryId: "area",
    title: "Square Feet to Square Meters Converter (sq ft to sq m)",
    metaDescription: "Convert square feet to square meters (ft² to m²) for real estate, floor plans, and construction. Multiply by 0.092903.",
    formulaDescription: "1 square foot equals exactly 0.09290304 square meters. Multiply square feet by 0.092903.",
    exampleInput: 1000,
    benchmarks: [
      { value: 1000, convertedValue: "92.903 m²", label: "2-bedroom apartment", description: "Standard urban apartment size" },
      { value: 2000, convertedValue: "185.806 m²", label: "Suburban family home", description: "Typical North American house" },
    ],
  },
  {
    slug: "sq-meters-to-sq-feet",
    fromUnitId: "sq_meter",
    toUnitId: "sq_foot",
    categoryId: "area",
    title: "Square Meters to Square Feet Converter (sq m to sq ft)",
    metaDescription: "Convert square meters to square feet (m² to ft²) with live real estate calculations, tables, and exact 10.7639 multiplier.",
    formulaDescription: "1 square meter equals approximately 10.7639104 square feet. Multiply square meters by 10.7639.",
    exampleInput: 100,
  },
  {
    slug: "acres-to-hectares",
    fromUnitId: "acre",
    toUnitId: "hectare",
    categoryId: "area",
    title: "Acres to Hectares Converter (ac to ha)",
    metaDescription: "Convert acres to hectares for agricultural land, forestry, and property surveying with exact 0.404686 factor.",
    formulaDescription: "1 acre equals approximately 0.40468564 hectares. Multiply acres by 0.404686.",
    exampleInput: 10,
  },
  {
    slug: "hectares-to-acres",
    fromUnitId: "hectare",
    toUnitId: "acre",
    categoryId: "area",
    title: "Hectares to Acres Converter (ha to ac)",
    metaDescription: "Convert hectares to acres for international farmland and forestry with live calculation and 2.47105 factor.",
    formulaDescription: "1 hectare equals approximately 2.4710538 acres. Multiply hectares by 2.47105.",
    exampleInput: 5,
  },
  {
    slug: "sq-miles-to-sq-km",
    fromUnitId: "sq_mile",
    toUnitId: "sq_km",
    categoryId: "area",
    title: "Square Miles to Square Kilometers Converter (sq mi to sq km)",
    metaDescription: "Convert square miles to square kilometers for geographic, county, and municipal surface area calculation.",
    formulaDescription: "1 square mile equals approximately 2.58998811 square kilometers. Multiply square miles by 2.58999.",
    exampleInput: 100,
  },
  {
    slug: "sq-km-to-sq-miles",
    fromUnitId: "sq_km",
    toUnitId: "sq_mile",
    categoryId: "area",
    title: "Square Kilometers to Square Miles Converter (sq km to sq mi)",
    metaDescription: "Convert square kilometers to square miles with live conversion and reference geographic areas.",
    formulaDescription: "Multiply square kilometers by 0.386102159 to convert to square miles.",
    exampleInput: 250,
  },
  {
    slug: "acres-to-sq-feet",
    fromUnitId: "acre",
    toUnitId: "sq_foot",
    categoryId: "area",
    title: "Acres to Square Feet Converter (ac to sq ft)",
    metaDescription: "Convert acres to square feet with exact 43,560 sq ft definition and land survey calculator.",
    formulaDescription: "1 acre is legally defined as exactly 43,560 square feet. Multiply acres by 43,560.",
    exampleInput: 1,
  },
  {
    slug: "sq-inches-to-sq-cm",
    fromUnitId: "sq_inch",
    toUnitId: "sq_cm",
    categoryId: "area",
    title: "Square Inches to Square Centimeters Converter (in² to cm²)",
    metaDescription: "Convert square inches to square centimeters with exact 6.4516 factor for engineering and design.",
    formulaDescription: "1 square inch equals exactly 6.4516 square centimeters. Multiply square inches by 6.4516.",
    exampleInput: 10,
  },
  {
    slug: "acres-to-square-miles",
    fromUnitId: "acre",
    toUnitId: "sq_mile",
    categoryId: "area",
    title: "Acres to Square Miles Converter (ac to sq mi)",
    metaDescription: "Convert acres to square miles for land plots, agriculture, and municipal boundaries. Divide acres by 640.",
    formulaDescription: "There are exactly 640 acres in 1 square mile. Divide acres by 640.",
    exampleInput: 640,
  },
  {
    slug: "square-miles-to-acres",
    fromUnitId: "sq_mile",
    toUnitId: "acre",
    categoryId: "area",
    title: "Square Miles to Acres Converter (sq mi to ac)",
    metaDescription: "Convert square miles to acres. Multiply square miles by 640 with live real-time calculation.",
    formulaDescription: "1 square mile equals 640 acres. Multiply square miles by 640.",
    exampleInput: 2.5,
  },

  // --- VOLUME (24) ---
  {
    slug: "liters-to-gallons",
    fromUnitId: "liter",
    toUnitId: "us_gallon",
    categoryId: "volume",
    primaryKeyword: "convert l to gallons us",
    relatedKeywords: [
      "liters in gallons uk",
      "liter to the gallon",
      "convert litres to us gallons calculator",
      "liters to gallons chart",
    ],
    title: "Liters to Gallons — Convert L to Gallons US",
    h1: "Liters to Gallons Converter (L to gal (US))",
    metaDescription: "1 L = 0.26417 US gal (1 gal = 3.78541 L). Free convert litres to US gallons calculator with US & UK gallon note, formula, worked examples & chart.",
    formulaDescription: "1 US liquid gallon equals exactly 3.785411784 liters. To convert liters to US gallons, divide by 3.785411784 (or multiply by 0.26417205).",
    exampleInput: 50,
    benchmarks: [
      { value: 3.785, convertedValue: "1 gal", label: "Standard milk jug", description: "US retail gallon" },
      { value: 50, convertedValue: "13.2086 gal", label: "Compact car fuel tank", description: "Typical sedan capacity" },
    ],
    faqs: [
      {
        question: "How many litres are in a gallon?",
        answer: "One US liquid gallon equals 3.78541 litres, while one UK Imperial gallon equals 4.54609 litres.",
      },
      {
        question: "How much is a liter in gallons?",
        answer: "One liter equals 0.26417205 US liquid gallons (or 0.219969 UK Imperial gallons).",
      },
    ],
  },
  {
    slug: "gallons-to-liters",
    fromUnitId: "us_gallon",
    toUnitId: "liter",
    categoryId: "volume",
    title: "Gallons to Liters Converter (gal to L US)",
    metaDescription: "Convert US liquid gallons to liters with real-time accuracy, formula (multiply by 3.78541), and fuel volume charts.",
    formulaDescription: "1 US gallon equals exactly 231 cubic inches or 3.785411784 liters. Multiply US gallons by 3.78541.",
    exampleInput: 15,
  },
  {
    slug: "gallons-to-quarts",
    fromUnitId: "us_gallon",
    toUnitId: "us_quart",
    categoryId: "volume",
    title: "Gallons to Quarts Converter (gal to qt)",
    metaDescription: "Convert gallons to quarts (gal to qt) with 4-multiplier formula, culinary conversion charts, and engine oil capacities.",
    formulaDescription: "There are exactly 4 US liquid quarts in 1 US gallon. Multiply gallons by 4.",
    exampleInput: 5,
  },
  {
    slug: "quarts-to-gallons",
    fromUnitId: "us_quart",
    toUnitId: "us_gallon",
    categoryId: "volume",
    title: "Quarts to Gallons Converter (qt to gal)",
    metaDescription: "Convert quarts to gallons (qt to gal). Divide quarts by 4 with live calculation.",
    formulaDescription: "Divide US liquid quarts by 4 to convert to US gallons.",
    exampleInput: 12,
  },
  {
    slug: "pints-to-quarts",
    fromUnitId: "us_pint",
    toUnitId: "us_quart",
    categoryId: "volume",
    title: "Pints to Quarts Converter (pt to qt)",
    metaDescription: "Convert US liquid pints to quarts (pt to qt) with exact 2-to-1 ratio for culinary baking and beverages.",
    formulaDescription: "There are 2 pints in 1 US quart. Divide pints by 2.",
    exampleInput: 4,
  },
  {
    slug: "quarts-to-pints",
    fromUnitId: "us_quart",
    toUnitId: "us_pint",
    categoryId: "volume",
    title: "Quarts to Pints Converter (qt to pt)",
    metaDescription: "Convert US liquid quarts to pints. Multiply quarts by 2 with real-time calculation.",
    formulaDescription: "Multiply US quarts by 2 to calculate pints.",
    exampleInput: 3,
  },
  {
    slug: "tablespoons-to-cups",
    fromUnitId: "us_tablespoon",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Tablespoons to Cups Converter (tbsp to cups)",
    metaDescription: "Convert tablespoons to cups (tbsp to cups) for baking and cooking. Divide tablespoons by 16.",
    formulaDescription: "There are exactly 16 tablespoons in 1 US customary cup. Divide tablespoons by 16.",
    exampleInput: 8,
  },
  {
    slug: "cups-to-tablespoons",
    fromUnitId: "us_cup",
    toUnitId: "us_tablespoon",
    categoryId: "volume",
    title: "Cups to Tablespoons Converter (cups to tbsp)",
    metaDescription: "Convert cups to tablespoons. Multiply cups by 16 for baking recipes.",
    formulaDescription: "Multiply US customary cups by 16 to find tablespoons.",
    exampleInput: 0.5,
  },
  {
    slug: "liters-to-cups",
    fromUnitId: "liter",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Liters to Cups Converter (L to cups)",
    metaDescription: "Convert liters to US cups for international recipe scaling. Multiply liters by 4.22675.",
    formulaDescription: "1 liter equals approximately 4.2267528 US customary cups. Multiply liters by 4.22675.",
    exampleInput: 1,
  },
  {
    slug: "cups-to-liters",
    fromUnitId: "us_cup",
    toUnitId: "liter",
    categoryId: "volume",
    title: "Cups to Liters Converter (cups to L)",
    metaDescription: "Convert US customary cups to liters. Multiply cups by 0.236588.",
    formulaDescription: "Multiply US customary cups by 0.236588 to convert to liters.",
    exampleInput: 4,
  },
  {
    slug: "cups-to-quarts",
    fromUnitId: "us_cup",
    toUnitId: "us_quart",
    categoryId: "volume",
    title: "Cups to Quarts Converter (cups to qt)",
    metaDescription: "Convert cups to quarts for cooking recipes. Divide cups by 4.",
    formulaDescription: "There are 4 US customary cups in 1 US liquid quart. Divide cups by 4.",
    exampleInput: 8,
  },
  {
    slug: "quarts-to-cups",
    fromUnitId: "us_quart",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Quarts to Cups Converter (qt to cups)",
    metaDescription: "Convert quarts to cups. Multiply quarts by 4.",
    formulaDescription: "Multiply US liquid quarts by 4 to calculate cups.",
    exampleInput: 2,
  },
  {
    slug: "ml-to-fluid-ounces",
    fromUnitId: "milliliter",
    toUnitId: "us_fluid_ounce",
    categoryId: "volume",
    title: "Milliliters to Fluid Ounces Converter (mL to fl oz)",
    metaDescription: "Convert milliliters to US fluid ounces for beverage bottles, perfumes, cooking, and medicine. Divide by 29.5735.",
    formulaDescription: "1 US fluid ounce equals approximately 29.5735296 milliliters. Divide milliliters by 29.5735.",
    exampleInput: 500,
    benchmarks: [
      { value: 30, convertedValue: "1.0144 fl oz", label: "Standard 30 mL medicine / shot glass", description: "Approx. 1 US fl oz" },
      { value: 100, convertedValue: "3.3814 fl oz", label: "TSA carry-on liquid limit (100 mL)", description: "3.4 oz travel bottle rule" },
      { value: 355, convertedValue: "12.004 fl oz", label: "Standard soda / beer can", description: "12 US fl oz beverage can" },
      { value: 500, convertedValue: "16.907 fl oz", label: "Standard water bottle (500 mL)", description: "16.9 fl oz single-serve bottle" },
    ],
    faqs: [
      { question: "How many fluid ounces is 500 mL?", answer: "500 mL is equal to 16.907 US fluid ounces (or 17.5975 UK Imperial fluid ounces)." },
      { question: "Why is 100 mL the airport liquid limit?", answer: "International aviation authorities set the carry-on container limit at 100 milliliters, which converts to 3.3814 US fluid ounces (commonly rounded to 3.4 oz on travel bottles)." },
    ],
  },
  {
    slug: "fluid-ounces-to-ml",
    fromUnitId: "us_fluid_ounce",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Fluid Ounces to Milliliters Converter (fl oz to mL)",
    metaDescription: "Convert US fluid ounces to milliliters (fl oz to mL) with recipe tables, exact 29.5735 factor, and bartender guides.",
    formulaDescription: "Multiply US fluid ounces by 29.5735296 to convert to milliliters.",
    exampleInput: 8,
    benchmarks: [
      { value: 1, convertedValue: "29.5735 mL", label: "1 US fluid ounce", description: "2 US tablespoons" },
      { value: 1.5, convertedValue: "44.3603 mL", label: "Standard US bar jigger shot", description: "1.5 fl oz spirit measure" },
      { value: 8, convertedValue: "236.588 mL", label: "1 US Customary Cup (8 fl oz)", description: "Standard baking cup" },
      { value: 16, convertedValue: "473.176 mL", label: "1 US Liquid Pint (16 fl oz)", description: "2 US cups" },
    ],
  },
  {
    slug: "cups-to-ml",
    fromUnitId: "us_cup",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Cups to Milliliters Converter (cups to mL)",
    metaDescription: "Convert US legal and customary cups to milliliters for kitchen cooking and baking with exact 236.588 mL factor.",
    formulaDescription: "1 US customary cup equals 8 fluid ounces or approx. 236.588 milliliters. Multiply by 236.588.",
    exampleInput: 2,
    benchmarks: [
      { value: 0.25, convertedValue: "59.147 mL", label: "1/4 US Cup (4 tbsp)", description: "Quarter-cup measure" },
      { value: 0.5, convertedValue: "118.294 mL", label: "1/2 US Cup (4 fl oz)", description: "Half-cup measure" },
      { value: 1, convertedValue: "236.588 mL", label: "1 US Customary Cup (8 fl oz)", description: "Standard US kitchen cup" },
      { value: 4, convertedValue: "946.353 mL", label: "4 US Cups (1 US Quart)", description: "Just under 1 liter" },
    ],
    faqs: [
      { question: "Is a cup 236.6 mL, 240 mL, or 250 mL?", answer: "A US Customary kitchen cup (8 US fl oz) is 236.588 mL. A US FDA Nutrition Labeling 'legal cup' is 240 mL. An international Metric Cup (used in Australia, New Zealand, Canada, and UK metric recipes) is 250 mL." },
    ],
  },
  {
    slug: "ml-to-cups",
    fromUnitId: "milliliter",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Milliliters to Cups Converter (mL to cups)",
    metaDescription: "Convert milliliters to cups for international cooking recipes with decimal and culinary fraction breakdowns.",
    formulaDescription: "Divide milliliters by 236.588 to convert to US cups.",
    exampleInput: 500,
    benchmarks: [
      { value: 120, convertedValue: "0.5072 cup (~1/2 cup)", label: "120 mL recipe portion", description: "Half of an FDA legal cup" },
      { value: 236.59, convertedValue: "1 cup", label: "1 US Customary Cup", description: "8 US fluid ounces" },
      { value: 250, convertedValue: "1.0567 US cups", label: "1 Metric Cup (250 mL)", description: "Quarter of a liter" },
      { value: 500, convertedValue: "2.1134 US cups", label: "500 mL (Half Liter)", description: "Approx. 2 US cups + 2 tbsp" },
    ],
  },
  {
    slug: "tablespoons-to-teaspoons",
    fromUnitId: "us_tablespoon",
    toUnitId: "us_teaspoon",
    categoryId: "volume",
    title: "Tablespoons to Teaspoons Converter (tbsp to tsp)",
    metaDescription: "Convert tablespoons to teaspoons with exact 3-to-1 kitchen culinary conversion factor.",
    formulaDescription: "There are exactly 3 teaspoons in 1 tablespoon. Multiply tablespoons by 3.",
    exampleInput: 4,
  },
  {
    slug: "quarts-to-liters",
    fromUnitId: "us_quart",
    toUnitId: "liter",
    categoryId: "volume",
    title: "Quarts to Liters Converter (qt to L)",
    metaDescription: "Convert US liquid quarts to liters with exact 0.946353 factor for cooking and engine oil capacity.",
    formulaDescription: "1 US liquid quart equals 0.946352946 liters. Multiply quarts by 0.946353.",
    exampleInput: 5,
  },
  {
    slug: "liters-to-quarts",
    fromUnitId: "liter",
    toUnitId: "us_quart",
    categoryId: "volume",
    title: "Liters to Quarts Converter (L to qt)",
    metaDescription: "Convert liters to US liquid quarts. Multiply liters by 1.05669.",
    formulaDescription: "1 liter equals approximately 1.0566882 US liquid quarts. Multiply liters by 1.05669.",
    exampleInput: 5,
  },
  {
    slug: "pints-to-cups",
    fromUnitId: "us_pint",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Pints to Cups Converter (pt to cups)",
    metaDescription: "Convert US liquid pints to cups with exact 2-to-1 ratio for culinary baking and beverages.",
    formulaDescription: "There are exactly 2 cups in 1 US liquid pint. Multiply pints by 2.",
    exampleInput: 3,
  },
  {
    slug: "cubic-meters-to-cubic-feet",
    fromUnitId: "cubic_meter",
    toUnitId: "cubic_foot",
    categoryId: "volume",
    title: "Cubic Meters to Cubic Feet Converter (m³ to ft³)",
    metaDescription: "Convert cubic meters to cubic feet for shipping containers, freight cargo, and concrete volume.",
    formulaDescription: "1 cubic meter equals approximately 35.3146667 cubic feet. Multiply cubic meters by 35.3147.",
    exampleInput: 10,
  },
  {
    slug: "gallons-us-to-gallons-imperial",
    fromUnitId: "us_gallon",
    toUnitId: "imperial_gallon",
    categoryId: "volume",
    title: "US Gallons to Imperial UK Gallons Converter",
    metaDescription: "Convert between US liquid gallons (3.785 L) and British Imperial gallons (4.546 L) without confusion.",
    formulaDescription: "1 US gallon is approx. 0.832674 Imperial gallons. Multiply US gallons by 0.832674.",
    exampleInput: 10,
  },
  {
    slug: "cubic-feet-to-gallons",
    fromUnitId: "cubic_foot",
    toUnitId: "us_gallon",
    categoryId: "volume",
    title: "Cubic Feet to Gallons Converter (ft³ to gal)",
    metaDescription: "Convert cubic feet to US liquid gallons for pool volume, water tanks, and plumbing systems.",
    formulaDescription: "1 cubic foot contains approximately 7.48051948 US liquid gallons. Multiply cubic feet by 7.48052.",
    exampleInput: 100,
  },
  {
    slug: "gallons-to-cubic-feet",
    fromUnitId: "us_gallon",
    toUnitId: "cubic_foot",
    categoryId: "volume",
    title: "Gallons to Cubic Feet Converter (gal to ft³)",
    metaDescription: "Convert US liquid gallons to cubic feet for water storage tanks and civil engineering. Divide gallons by 7.48052.",
    formulaDescription: "Divide US gallons by 7.480519 to calculate cubic feet.",
    exampleInput: 500,
  },
  {
    slug: "cc-to-ml",
    fromUnitId: "cubic_cm",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Cubic Centimeters to Milliliters Converter (cc to mL)",
    metaDescription: "Convert cubic centimeters (cc) to milliliters (mL) with 1:1 identical volume equivalence.",
    formulaDescription: "1 cubic centimeter (cc) is defined as exactly 1 milliliter (mL). The ratio is 1 to 1.",
    exampleInput: 250,
  },
  {
    slug: "ml-to-cc",
    fromUnitId: "milliliter",
    toUnitId: "cubic_cm",
    categoryId: "volume",
    title: "Milliliters to Cubic Centimeters Converter (mL to cc)",
    metaDescription: "Convert milliliters (mL) to cubic centimeters (cc) for medical dosages and engine displacement.",
    formulaDescription: "1 milliliter equals exactly 1 cubic centimeter (cc).",
    exampleInput: 50,
  },
  {
    slug: "teaspoons-to-ml",
    fromUnitId: "us_teaspoon",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Teaspoons to Milliliters Converter (tsp to mL)",
    metaDescription: "Convert US cooking teaspoons to milliliters with exact 4.92892 mL factor.",
    formulaDescription: "1 US customary teaspoon equals approximately 4.92892159 milliliters. Multiply teaspoons by 4.92892.",
    exampleInput: 3,
  },
  {
    slug: "ml-to-teaspoons",
    fromUnitId: "milliliter",
    toUnitId: "us_teaspoon",
    categoryId: "volume",
    title: "Milliliters to Teaspoons Converter (mL to tsp)",
    metaDescription: "Convert milliliters to teaspoons for medicine and baking recipes. Divide milliliters by 4.92892.",
    formulaDescription: "Divide milliliters by 4.92892 to convert to US teaspoons.",
    exampleInput: 15,
  },
  {
    slug: "pints-to-ml",
    fromUnitId: "us_pint",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Pints to Milliliters Converter (pt to mL)",
    metaDescription: "Convert US liquid pints to milliliters with exact 473.176 mL factor.",
    formulaDescription: "1 US liquid pint equals approximately 473.176 milliliters. Multiply pints by 473.176.",
    exampleInput: 2,
  },
  {
    slug: "ml-to-pints",
    fromUnitId: "milliliter",
    toUnitId: "us_pint",
    categoryId: "volume",
    title: "Milliliters to Pints Converter (mL to pt)",
    metaDescription: "Convert milliliters to US liquid pints. Divide milliliters by 473.176.",
    formulaDescription: "Divide milliliters by 473.176 to calculate US liquid pints.",
    exampleInput: 1000,
  },
  {
    slug: "quarts-to-ml",
    fromUnitId: "us_quart",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Quarts to Milliliters Converter (qt to mL)",
    metaDescription: "Convert US liquid quarts to milliliters with exact 946.353 mL factor.",
    formulaDescription: "1 US liquid quart equals 946.352946 milliliters. Multiply quarts by 946.353.",
    exampleInput: 1,
  },
  {
    slug: "ml-to-quarts",
    fromUnitId: "milliliter",
    toUnitId: "us_quart",
    categoryId: "volume",
    title: "Milliliters to Quarts Converter (mL to qt)",
    metaDescription: "Convert milliliters to US liquid quarts. Divide milliliters by 946.353.",
    formulaDescription: "Divide milliliters by 946.353 to convert to US liquid quarts.",
    exampleInput: 2000,
  },

  // --- SPEED (7) ---
  {
    slug: "mph-to-kph",
    fromUnitId: "mph",
    toUnitId: "km_per_h",
    categoryId: "speed",
    primaryKeyword: "miles to kilometers per hour converter",
    relatedKeywords: [
      "miles to kilometers per hour",
      "mile to kilometer per hour",
      "mph to kmh formula",
    ],
    title: "MPH to KPH — Miles to Kilometers per Hour Converter",
    h1: "Miles per Hour to Kilometers per Hour Converter (mph to km/h)",
    metaDescription:
      "1 mph = 1.609344 km/h exact. Convert miles to kilometers per hour for speedometers, road limits & racing—with exact formula, examples & chart.",
    formulaDescription: "1 mile per hour equals exactly 1.609344 kilometers per hour. Multiply mph by 1.609344.",
    exampleInput: 65,
    benchmarks: [
      { value: 25, convertedValue: "40.2336 km/h", label: "US residential street limit", description: "Typical 25 mph school/city zone" },
      { value: 60, convertedValue: "96.5606 km/h", label: "60 mph highway speed", description: "1 mile per minute pace" },
      { value: 70, convertedValue: "112.654 km/h", label: "70 mph interstate limit", description: "Standard US freeway cruising speed" },
    ],
  },
  {
    slug: "kph-to-mph",
    fromUnitId: "km_per_h",
    toUnitId: "mph",
    categoryId: "speed",
    primaryKeyword: "convert km into miles per hour",
    relatedKeywords: [
      "conversion for kilometers to miles per hour",
      "km/h to mph chart",
      "kilometers to miles per hour conversion table",
      "kilometer to mph conversion table",
    ],
    title: "Km/h to Mph — Convert Km into Miles per Hour",
    h1: "Kilometers per Hour to Miles per Hour Converter (km/h to mph)",
    metaDescription: "1 km/h = 0.62137 mph. Instant conversion for kilometers to miles per hour—highway limits, running paces & speedometer speeds—plus km/h to mph chart.",
    formulaDescription: "1 kilometer per hour equals approximately 0.62137119 miles per hour. Multiply km/h by 0.62137119 (or divide by 1.609344).",
    exampleInput: 100,
    benchmarks: [
      { value: 50, convertedValue: "31.0686 mph", label: "50 km/h urban speed limit", description: "Standard European/Canadian city limit" },
      { value: 100, convertedValue: "62.1371 mph", label: "100 km/h highway benchmark", description: "Common metric expressway limit" },
      { value: 322, convertedValue: "200.082 mph", label: "322 km/h supercar mark", description: "Just over 200 mph milestone" },
    ],
    faqs: [
      {
        question: "How do I convert km/h into mph?",
        answer: "Divide kilometers per hour (km/h) by 1.609344, or multiply by 0.62137119. For example, 100 km/h ÷ 1.609344 equals 62.13712 mph.",
      },
      {
        question: "How do I change a speedometer from km/h to mph?",
        answer: "In most digital instrument clusters, open Settings > Units (or Display) and switch distance/speed from km/h to mph; on analog dials, check the owner's manual or use the chart below.",
      },
    ],
  },
  {
    slug: "meters-per-second-to-kph",
    fromUnitId: "m_per_s",
    toUnitId: "km_per_h",
    categoryId: "speed",
    title: "Meters per Second to Kilometers per Hour Converter (m/s to km/h)",
    metaDescription: "Convert m/s to km/h for physics experiments, wind speed, and robotics. Multiply by 3.6.",
    formulaDescription: "1 m/s equals exactly 3.6 km/h. Multiply meters per second by 3.6.",
    exampleInput: 10,
  },
  {
    slug: "knots-to-mph",
    fromUnitId: "knot",
    toUnitId: "mph",
    categoryId: "speed",
    primaryKeyword: "knots to mph",
    relatedKeywords: [
      "knot vs miles per hour",
      "wind speed conversion knots to mph",
      "difference between knots and mph",
    ],
    title: "Knots to MPH — Knot vs Miles per Hour Converter",
    h1: "Knots to Miles per Hour Converter (kn to mph)",
    metaDescription: "1 knot = 1.15078 mph (exact 1.852 km/h). Instant wind speed conversion knots to mph for aviation, sailing & storms, with formula & reference chart.",
    formulaDescription: "1 knot equals 1 nautical mile per hour (1.852 km/h), or approximately 1.15077945 mph. Multiply knots by 1.15077945.",
    exampleInput: 53,
    faqs: [
      {
        question: "How many miles per hour (mph) are in 1 knot?",
        answer: "One knot equals 1.15077945 miles per hour (about 1.151 mph). Multiply knots by 1.15077945 to convert knots to mph.",
      },
      {
        question: "What is the difference between knots and miles per hour?",
        answer: "A knot measures 1 nautical mile per hour (1.852 km/h), while mph measures 1 statute mile per hour (1.609344 km/h), making 1 knot about 15% faster than 1 mph.",
      },
    ],
  },
  {
    slug: "knots-to-kph",
    fromUnitId: "knot",
    toUnitId: "km_per_h",
    categoryId: "speed",
    title: "Knots to Kilometers per Hour Converter (kn to km/h)",
    metaDescription: "Convert knots to kilometers per hour with exact 1.852 factor for maritime navigation.",
    formulaDescription: "1 knot equals exactly 1.852 km/h. Multiply knots by 1.852.",
    exampleInput: 20,
  },
  {
    slug: "fps-to-mph",
    fromUnitId: "ft_per_s",
    toUnitId: "mph",
    categoryId: "speed",
    title: "Feet per Second to Miles per Hour Converter (fps to mph)",
    metaDescription: "Convert feet per second to miles per hour for ballistics, projectile mechanics, and sports radar guns.",
    formulaDescription: "Multiply feet per second by 0.681818 to convert to miles per hour.",
    exampleInput: 100,
  },
  {
    slug: "mach-to-kph",
    fromUnitId: "mach",
    toUnitId: "km_per_h",
    categoryId: "speed",
    title: "Mach to Kilometers per Hour Converter",
    metaDescription: "Convert Mach numbers to km/h at standard sea-level temperature for aerospace and supersonic flight.",
    formulaDescription: "At standard sea level atmospheric temperature (15 °C), Mach 1 is approx. 1,225.04 km/h (340.29 m/s). Multiply Mach by 1,225.04.",
    exampleInput: 2,
  },

  // --- TIME (9) ---
  {
    slug: "seconds-to-minutes",
    fromUnitId: "second",
    toUnitId: "minute",
    categoryId: "time",
    title: "Seconds to Minutes Converter (s to min)",
    metaDescription: "Convert seconds to minutes with live 60-second divisor calculation, decimal breakdown, and countdown charts.",
    formulaDescription: "There are 60 seconds in 1 minute. Divide seconds by 60.",
    exampleInput: 300,
  },
  {
    slug: "seconds-to-milliseconds",
    fromUnitId: "second",
    toUnitId: "millisecond",
    categoryId: "time",
    title: "Seconds to Milliseconds Converter (s to ms)",
    metaDescription: "Convert seconds to milliseconds with exact 1,000 multiplier for video gaming latency and computer benchmarks.",
    formulaDescription: "1 second contains 1,000 milliseconds. Multiply seconds by 1,000.",
    exampleInput: 2.5,
  },
  {
    slug: "minutes-to-hours",
    fromUnitId: "minute",
    toUnitId: "hour",
    categoryId: "time",
    title: "Minutes to Hours Converter (min to hr)",
    metaDescription: "Convert minutes to hours with decimal hours for payroll, work tracking, and flight duration calculations.",
    formulaDescription: "There are 60 minutes in 1 hour. Divide minutes by 60.",
    exampleInput: 90,
  },
  {
    slug: "hours-to-days",
    fromUnitId: "hour",
    toUnitId: "day",
    categoryId: "time",
    title: "Hours to Days Converter (hr to d)",
    metaDescription: "Convert hours to civil days with exact 24-hour divisor and work shift calculations.",
    formulaDescription: "There are 24 hours in 1 civil day. Divide hours by 24.",
    exampleInput: 72,
  },
  {
    slug: "days-to-hours",
    fromUnitId: "day",
    toUnitId: "hour",
    categoryId: "time",
    title: "Days to Hours Converter (d to hr)",
    metaDescription: "Convert civil days to hours. Multiply days by 24 with live calculation.",
    formulaDescription: "Multiply civil days by 24 to calculate hours.",
    exampleInput: 5,
  },
  {
    slug: "days-to-weeks",
    fromUnitId: "day",
    toUnitId: "week",
    categoryId: "time",
    title: "Days to Weeks Converter (d to wk)",
    metaDescription: "Convert days to weeks for project schedules, pregnancy tracking, and rental planning.",
    formulaDescription: "There are 7 days in 1 week. Divide days by 7.",
    exampleInput: 30,
  },
  {
    slug: "days-to-years",
    fromUnitId: "day",
    toUnitId: "year",
    categoryId: "time",
    title: "Days to Years Converter (d to yr)",
    metaDescription: "Convert days to calendar years based on the tropical year average of 365.2425 days.",
    formulaDescription: "Divide days by 365.2425 to find calendar years.",
    exampleInput: 1000,
  },
  {
    slug: "milliseconds-to-seconds",
    fromUnitId: "millisecond",
    toUnitId: "second",
    categoryId: "time",
    title: "Milliseconds to Seconds Converter (ms to s)",
    metaDescription: "Convert milliseconds to seconds for software benchmarking, audio latency, and video frame rates.",
    formulaDescription: "1 second equals 1,000 milliseconds. Divide milliseconds by 1,000.",
    exampleInput: 1500,
  },
  {
    slug: "hours-to-minutes",
    fromUnitId: "hour",
    toUnitId: "minute",
    categoryId: "time",
    title: "Hours to Minutes Converter (hr to min)",
    metaDescription: "Convert hours to minutes. Multiply hours by 60 with instant real-time calculation.",
    formulaDescription: "Multiply hours by 60 to find minutes.",
    exampleInput: 3.5,
  },
  {
    slug: "weeks-to-days",
    fromUnitId: "week",
    toUnitId: "day",
    categoryId: "time",
    title: "Weeks to Days Converter (wk to d)",
    metaDescription: "Convert weeks to days with exact 7-multiplier calculation.",
    formulaDescription: "Multiply weeks by 7 to calculate days.",
    exampleInput: 52,
  },

  // --- PRESSURE (13) ---
  {
    slug: "psi-to-bar",
    fromUnitId: "psi",
    toUnitId: "bar",
    categoryId: "pressure",
    title: "PSI to Bar Converter (Pounds per Sq Inch to Bar)",
    metaDescription: "Convert PSI to Bar in real time. Features tire pressure charts, exact 0.0689476 multiplier, and compressor tables.",
    formulaDescription: "1 PSI equals approximately 0.06894757 Bar. Multiply PSI by 0.068948 (or divide by 14.5038).",
    exampleInput: 32,
    benchmarks: [
      { value: 14.696, convertedValue: "1.01325 bar", label: "1 Standard Atmosphere (Sea Level)", description: "Ambient atmospheric pressure" },
      { value: 32, convertedValue: "2.2063 bar", label: "Standard passenger car tire (32 PSI)", description: "Typical sedan cold tire inflation" },
      { value: 35, convertedValue: "2.4132 bar", label: "SUV / crossover tire pressure (35 PSI)", description: "Standard light-duty tire pressure" },
      { value: 100, convertedValue: "6.8948 bar", label: "Shop air compressor line (100 PSI)", description: "Standard pneumatic tool supply" },
    ],
  },
  {
    slug: "bar-to-psi",
    fromUnitId: "bar",
    toUnitId: "psi",
    categoryId: "pressure",
    title: "Bar to PSI Converter (Bar to Pounds per Sq Inch)",
    metaDescription: "Convert Bar to PSI with live calculation, automotive tire conversion tables, and formula (multiply by 14.5038).",
    formulaDescription: "1 Bar equals approximately 14.5037738 PSI. Multiply Bar by 14.5038.",
    exampleInput: 2.2,
    benchmarks: [
      { value: 1, convertedValue: "14.5038 psi", label: "1 Bar (100 kPa)", description: "Slightly below 1 standard atmosphere" },
      { value: 2.2, convertedValue: "31.9083 psi (~32 PSI)", label: "2.2 Bar car tire placard", description: "Standard European passenger tire rating" },
      { value: 2.5, convertedValue: "36.2594 psi (~36 PSI)", label: "2.5 Bar highway load tire", description: "Full-load automotive tire rating" },
      { value: 9, convertedValue: "130.534 psi", label: "Espresso extraction pressure (9 bar)", description: "Ideal Italian pump espresso pressure" },
    ],
  },
  {
    slug: "kpa-to-psi",
    fromUnitId: "kilopascal",
    toUnitId: "psi",
    categoryId: "pressure",
    title: "Kilopascals to PSI Converter (kPa to psi)",
    metaDescription: "Convert kilopascals to PSI for vehicle tire pressure and meteorology. Multiply kPa by 0.145038.",
    formulaDescription: "1 kilopascal equals approximately 0.1450377 PSI. Multiply kPa by 0.145038 (or divide by 6.89476).",
    exampleInput: 220,
    benchmarks: [
      { value: 101.325, convertedValue: "14.6959 psi", label: "Standard Sea-Level Atmosphere", description: "1 atm = 101.325 kPa" },
      { value: 220, convertedValue: "31.9083 psi (~32 PSI)", label: "220 kPa door-jamb tire label", description: "Standard passenger car tire specification" },
      { value: 240, convertedValue: "34.8091 psi (~35 PSI)", label: "240 kPa SUV tire specification", description: "Common crossover tire placard" },
    ],
  },
  {
    slug: "psi-to-kpa",
    fromUnitId: "psi",
    toUnitId: "kilopascal",
    categoryId: "pressure",
    title: "PSI to Kilopascals Converter (psi to kPa)",
    metaDescription: "Convert PSI to kilopascals with exact 6.89476 multiplier for automotive handbooks and tire pressure.",
    formulaDescription: "1 PSI equals 6.894757 kilopascals. Multiply PSI by 6.89476.",
    exampleInput: 32,
    benchmarks: [
      { value: 30, convertedValue: "206.843 kPa", label: "30 PSI cold tire pressure", description: "Compact car tire" },
      { value: 32, convertedValue: "220.632 kPa", label: "32 PSI passenger tire", description: "≈ 220 kPa placard rating" },
      { value: 35, convertedValue: "241.317 kPa", label: "35 PSI tire pressure", description: "≈ 240 kPa placard rating" },
    ],
  },
  {
    slug: "megapascal-to-psi",
    fromUnitId: "megapascal",
    toUnitId: "psi",
    categoryId: "pressure",
    title: "Megapascals to PSI Converter (MPa to psi)",
    metaDescription: "Convert megapascals to PSI for materials testing, concrete tensile strength, and hydraulics.",
    formulaDescription: "1 megapascal equals approximately 145.037738 PSI. Multiply MPa by 145.038.",
    exampleInput: 25,
  },
  {
    slug: "psi-to-megapascal",
    fromUnitId: "psi",
    toUnitId: "megapascal",
    categoryId: "pressure",
    title: "PSI to Megapascals Converter (psi to MPa)",
    metaDescription: "Convert PSI to megapascals. Divide PSI by 145.038 for structural engineering.",
    formulaDescription: "Divide PSI by 145.037738 to calculate megapascals.",
    exampleInput: 3000,
  },
  {
    slug: "hectopascal-to-pascal",
    fromUnitId: "hectopascal",
    toUnitId: "pascal",
    categoryId: "pressure",
    title: "Hectopascals to Pascals Converter (hPa to Pa)",
    metaDescription: "Convert hectopascals to Pascals with exact 100 multiplier for barometric weather maps.",
    formulaDescription: "1 hectopascal equals exactly 100 Pascals. Multiply hPa by 100.",
    exampleInput: 1013.25,
  },
  {
    slug: "pascal-to-hectopascal",
    fromUnitId: "pascal",
    toUnitId: "hectopascal",
    categoryId: "pressure",
    title: "Pascals to Hectopascals Converter (Pa to hPa)",
    metaDescription: "Convert Pascals to hectopascals. Divide Pascals by 100.",
    formulaDescription: "Divide Pascals by 100 to calculate hectopascals.",
    exampleInput: 101325,
  },
  {
    slug: "pascal-to-psi",
    fromUnitId: "pascal",
    toUnitId: "psi",
    categoryId: "pressure",
    title: "Pascal to PSI Converter (Pa to psi)",
    metaDescription: "Convert Pascals to PSI for mechanical stress, engineering, and fluid dynamics.",
    formulaDescription: "1 PSI equals 6,894.757 Pascals. Divide Pascals by 6,894.76.",
    exampleInput: 100000,
  },
  {
    slug: "atm-to-bar",
    fromUnitId: "atmosphere",
    toUnitId: "bar",
    categoryId: "pressure",
    title: "Atmospheres to Bar Converter (atm to bar)",
    metaDescription: "Convert standard atmospheres to bar with exact 1.01325 factor for scuba diving and meteorology.",
    formulaDescription: "1 standard atmosphere equals exactly 1.01325 bar. Multiply atm by 1.01325.",
    exampleInput: 1,
  },
  {
    slug: "atm-to-psi",
    fromUnitId: "atmosphere",
    toUnitId: "psi",
    categoryId: "pressure",
    title: "Atmospheres to PSI Converter (atm to psi)",
    metaDescription: "Convert standard atmospheres to PSI. 1 atm = 14.6959 psi sea level pressure.",
    formulaDescription: "1 standard atmosphere equals approximately 14.6959488 PSI. Multiply atm by 14.6959.",
    exampleInput: 2,
  },
  {
    slug: "bar-to-atm",
    fromUnitId: "bar",
    toUnitId: "atmosphere",
    categoryId: "pressure",
    title: "Bar to Atmospheres Converter (bar to atm)",
    metaDescription: "Convert bar to standard atmospheres with live precision controls and deep-sea diving depths.",
    formulaDescription: "Divide bar by 1.01325 to convert to standard atmospheres.",
    exampleInput: 10,
  },
  {
    slug: "torr-to-atm",
    fromUnitId: "torr",
    toUnitId: "atmosphere",
    categoryId: "pressure",
    title: "Torr to Atmospheres Converter (Torr to atm)",
    metaDescription: "Convert Torr (mmHg) to atmospheres with exact 760-to-1 scientific ratio for vacuum physics.",
    formulaDescription: "1 atmosphere equals exactly 760 Torr. Divide Torr by 760.",
    exampleInput: 760,
  },

  // --- ENERGY (9) ---
  {
    slug: "joules-to-calories",
    fromUnitId: "joule",
    toUnitId: "calorie",
    categoryId: "energy",
    title: "Joules to Calories Converter (J to cal)",
    metaDescription: "Convert Joules to thermochemical calories with exact 4.184 divisor for thermodynamics and physics experiments.",
    formulaDescription: "1 thermochemical calorie is defined as exactly 4.184 Joules. Divide Joules by 4.184.",
    exampleInput: 100,
  },
  {
    slug: "calories-to-joules",
    fromUnitId: "calorie",
    toUnitId: "joule",
    categoryId: "energy",
    title: "Calories to Joules Converter (cal to J)",
    metaDescription: "Convert calories to Joules with exact 4.184 multiplier and energy calculation steps.",
    formulaDescription: "1 calorie equals exactly 4.184 Joules. Multiply calories by 4.184.",
    exampleInput: 50,
  },
  {
    slug: "kj-to-j",
    fromUnitId: "kilojoule",
    toUnitId: "joule",
    categoryId: "energy",
    title: "Kilojoules to Joules Converter (kJ to J)",
    metaDescription: "Convert kilojoules to Joules (kJ to J) with exact 1,000 multiplier for physics work and thermodynamics.",
    formulaDescription: "1 kilojoule equals exactly 1,000 Joules. Multiply kilojoules by 1,000.",
    exampleInput: 5,
  },
  {
    slug: "j-to-kj",
    fromUnitId: "joule",
    toUnitId: "kilojoule",
    categoryId: "energy",
    title: "Joules to Kilojoules Converter (J to kJ)",
    metaDescription: "Convert Joules to kilojoules (J to kJ). Divide Joules by 1,000.",
    formulaDescription: "Divide Joules by 1,000 to convert to kilojoules.",
    exampleInput: 2500,
  },
  {
    slug: "kwh-to-joules",
    fromUnitId: "kilowatt_hour",
    toUnitId: "joule",
    categoryId: "energy",
    title: "Kilowatt-hours to Joules Converter (kWh to J)",
    metaDescription: "Convert kWh to Joules for electricity billing, solar generation, and battery capacity. 1 kWh = 3.6 MJ.",
    formulaDescription: "1 kilowatt-hour equals exactly 3,600,000 Joules (3.6 Megajoules). Multiply kWh by 3,600,000.",
    exampleInput: 1,
  },
  {
    slug: "btu-to-joules",
    fromUnitId: "btu",
    toUnitId: "joule",
    categoryId: "energy",
    title: "BTU to Joules Converter (BTU to J)",
    metaDescription: "Convert British Thermal Units to Joules for HVAC, heating capacity, and thermal engineering.",
    formulaDescription: "1 ISO BTU equals approximately 1,055.056 Joules. Multiply BTU by 1,055.06.",
    exampleInput: 1000,
  },
  {
    slug: "calories-to-kilocalories",
    fromUnitId: "calorie",
    toUnitId: "kilocalorie",
    categoryId: "energy",
    title: "Small Calories to Food Calories Converter (cal to kcal)",
    metaDescription: "Convert small physics calories to food Kilocalories (Calories with a capital C) with exact 1,000 ratio.",
    formulaDescription: "1 dietary Calorie (kcal) equals 1,000 small physics calories. Divide calories by 1,000.",
    exampleInput: 2000000,
  },
  {
    slug: "kwh-to-btu",
    fromUnitId: "kilowatt_hour",
    toUnitId: "btu",
    categoryId: "energy",
    title: "Kilowatt-hours to BTU Converter (kWh to BTU)",
    metaDescription: "Convert kWh to BTU for heat pumps, electric furnaces, and air conditioning efficiency.",
    formulaDescription: "1 kWh equals approximately 3,412.142 BTU. Multiply kWh by 3,412.14.",
    exampleInput: 10,
  },
  {
    slug: "ev-to-joules",
    fromUnitId: "electronvolt",
    toUnitId: "joule",
    categoryId: "energy",
    title: "Electronvolts to Joules Converter (eV to J)",
    metaDescription: "Convert electronvolts to Joules for quantum mechanics, photon energies, and nuclear physics.",
    formulaDescription: "1 eV equals 1.602176634×10⁻¹⁹ Joules. Multiply eV by 1.602177e-19.",
    exampleInput: 1000000,
  },

  // --- POWER (6) ---
  {
    slug: "watts-to-horsepower",
    fromUnitId: "watt",
    toUnitId: "horsepower_mechanical",
    categoryId: "power",
    title: "Watts to Horsepower Converter (W to hp)",
    metaDescription: "Convert Watts to mechanical horsepower (W to hp) for electric vehicle motors, generators, and engines.",
    formulaDescription: "1 mechanical horsepower equals approximately 745.69987 Watts. Divide Watts by 745.7.",
    exampleInput: 750,
  },
  {
    slug: "horsepower-to-watts",
    fromUnitId: "horsepower_mechanical",
    toUnitId: "watt",
    categoryId: "power",
    title: "Horsepower to Watts Converter (hp to W)",
    metaDescription: "Convert mechanical horsepower to Watts with exact 745.7 multiplier and EV power benchmarks.",
    formulaDescription: "1 hp equals 745.69987 Watts. Multiply horsepower by 745.7.",
    exampleInput: 100,
  },
  {
    slug: "kw-to-horsepower",
    fromUnitId: "kilowatt",
    toUnitId: "horsepower_mechanical",
    categoryId: "power",
    title: "Kilowatts to Horsepower Converter (kW to hp)",
    metaDescription: "Convert kilowatts to horsepower for automobile specifications, dyno tuning, and industrial pumps.",
    formulaDescription: "1 kW equals approximately 1.341022 mechanical horsepower. Multiply kW by 1.34102.",
    exampleInput: 150,
  },
  {
    slug: "hp-to-kw",
    fromUnitId: "horsepower_mechanical",
    toUnitId: "kilowatt",
    categoryId: "power",
    title: "Horsepower to Kilowatts Converter (hp to kW)",
    metaDescription: "Convert horsepower to kilowatts with live calculation. Multiply hp by 0.7457.",
    formulaDescription: "Multiply mechanical horsepower by 0.7456999 to convert to kilowatts.",
    exampleInput: 200,
  },
  {
    slug: "btu-per-hour-to-watts",
    fromUnitId: "btu_per_hour",
    toUnitId: "watt",
    categoryId: "power",
    title: "BTU per Hour to Watts Converter (BTU/hr to W)",
    metaDescription: "Convert HVAC BTU/hr ratings to Watts for cooling capacity and electrical load calculation.",
    formulaDescription: "1 BTU/hr equals approximately 0.293071 Watts. Multiply BTU/hr by 0.293071.",
    exampleInput: 12000,
  },
  {
    slug: "mw-to-kw",
    fromUnitId: "megawatt",
    toUnitId: "kilowatt",
    categoryId: "power",
    title: "Megawatts to Kilowatts Converter (MW to kW)",
    metaDescription: "Convert Megawatts to Kilowatts with exact 1,000 multiplier for grid power and renewable wind turbines.",
    formulaDescription: "1 Megawatt equals 1,000 Kilowatts. Multiply MW by 1,000.",
    exampleInput: 2.5,
  },

  // --- DIGITAL STORAGE (8) ---
  {
    slug: "mb-to-gb",
    fromUnitId: "megabyte",
    toUnitId: "gigabyte",
    categoryId: "digital_storage",
    title: "Megabytes to Gigabytes Converter (MB to GB)",
    metaDescription: "Convert Megabytes to Gigabytes (MB to GB) in real time with decimal standard (1,000 MB = 1 GB) and binary comparison.",
    formulaDescription: "Under the international SI decimal standard, 1 Gigabyte equals 1,000 Megabytes. Divide MB by 1,000.",
    exampleInput: 1024,
  },
  {
    slug: "gb-to-tb",
    fromUnitId: "gigabyte",
    toUnitId: "terabyte",
    categoryId: "digital_storage",
    title: "Gigabytes to Terabytes Converter (GB to TB)",
    metaDescription: "Convert Gigabytes to Terabytes (GB to TB) for hard drive sizes, SSD capacity, and cloud storage tiers.",
    formulaDescription: "1 Terabyte equals 1,000 Gigabytes (SI decimal). Divide GB by 1,000.",
    exampleInput: 2000,
  },
  {
    slug: "kb-to-mb",
    fromUnitId: "kilobyte",
    toUnitId: "megabyte",
    categoryId: "digital_storage",
    title: "Kilobytes to Megabytes Converter (KB to MB)",
    metaDescription: "Convert KB to MB for image optimization, file sizes, and download estimates. Divide by 1,000.",
    formulaDescription: "Divide Kilobytes by 1,000 to convert to Megabytes.",
    exampleInput: 2500,
  },
  {
    slug: "bits-to-bytes",
    fromUnitId: "bit",
    toUnitId: "byte",
    categoryId: "digital_storage",
    title: "Bits to Bytes Converter (b to B)",
    metaDescription: "Convert binary bits to bytes with exact 8-to-1 ratio for computer architecture and network packets.",
    formulaDescription: "There are exactly 8 bits in 1 byte. Divide bits by 8.",
    exampleInput: 64,
  },
  {
    slug: "bytes-to-kilobytes",
    fromUnitId: "byte",
    toUnitId: "kilobyte",
    categoryId: "digital_storage",
    title: "Bytes to Kilobytes Converter (B to KB)",
    metaDescription: "Convert bytes to kilobytes with live real-time calculation and file size tables.",
    formulaDescription: "Divide bytes by 1,000 to convert to decimal Kilobytes.",
    exampleInput: 10000,
  },
  {
    slug: "gb-to-mb",
    fromUnitId: "gigabyte",
    toUnitId: "megabyte",
    categoryId: "digital_storage",
    title: "Gigabytes to Megabytes Converter (GB to MB)",
    metaDescription: "Convert Gigabytes to Megabytes. Multiply GB by 1,000 with live calculation.",
    formulaDescription: "Multiply Gigabytes by 1,000 to find Megabytes.",
    exampleInput: 16,
  },
  {
    slug: "tb-to-gb",
    fromUnitId: "terabyte",
    toUnitId: "gigabyte",
    categoryId: "digital_storage",
    title: "Terabytes to Gigabytes Converter (TB to GB)",
    metaDescription: "Convert Terabytes to Gigabytes. Multiply TB by 1,000 for storage drives.",
    formulaDescription: "Multiply Terabytes by 1,000 to find Gigabytes.",
    exampleInput: 2,
  },
  {
    slug: "mib-to-mb",
    fromUnitId: "mebibyte",
    toUnitId: "megabyte",
    categoryId: "digital_storage",
    title: "Mebibytes to Megabytes Converter (MiB to MB)",
    metaDescription: "Convert binary Mebibytes (1024²) to decimal Megabytes (1000²) explaining the difference between Windows OS and drive packaging.",
    formulaDescription: "1 MiB = 1,048,576 bytes, while 1 MB = 1,000,000 bytes. Multiply MiB by 1.048576.",
    exampleInput: 100,
  },

  // --- DATA TRANSFER RATE (6) ---
  {
    slug: "mbps-to-gbps",
    fromUnitId: "mbps",
    toUnitId: "gbps",
    categoryId: "data_transfer",
    title: "Megabits per Second to Gigabits per Second Converter (Mbps to Gbps)",
    metaDescription: "Convert Mbps to Gbps for broadband speeds, fiber optic connections, and router bandwidth.",
    formulaDescription: "1 Gbps equals 1,000 Mbps. Divide Mbps by 1,000.",
    exampleInput: 1000,
  },
  {
    slug: "kbps-to-mbps",
    fromUnitId: "kbps",
    toUnitId: "mbps",
    categoryId: "data_transfer",
    title: "Kilobits per Second to Megabits per Second Converter (Kbps to Mbps)",
    metaDescription: "Convert Kbps to Mbps for streaming bitrates, audio quality, and mobile data speed tiers.",
    formulaDescription: "1 Mbps equals 1,000 Kbps. Divide Kbps by 1,000.",
    exampleInput: 5000,
  },
  {
    slug: "mbps-to-mbytes-per-sec",
    fromUnitId: "mbps",
    toUnitId: "mb_per_sec",
    categoryId: "data_transfer",
    title: "Megabits per Second to Megabytes per Second (Mbps to MB/s)",
    metaDescription: "Convert ISP speed (Mbps) to real download speed (MB/s). Divide your internet connection speed by 8.",
    formulaDescription: "Because there are 8 bits in a byte, divide your ISP Megabit speed by 8 to get actual Megabytes per second: MB/s = Mbps ÷ 8.",
    exampleInput: 100,
  },
  {
    slug: "gbps-to-mbps",
    fromUnitId: "gbps",
    toUnitId: "mbps",
    categoryId: "data_transfer",
    title: "Gigabits per Second to Megabits per Second Converter (Gbps to Mbps)",
    metaDescription: "Convert Gbps to Mbps. Multiply Gbps by 1,000 for network switches and datacenters.",
    formulaDescription: "Multiply Gbps by 1,000 to find Mbps.",
    exampleInput: 10,
  },
  {
    slug: "mbytes-per-sec-to-mbps",
    fromUnitId: "mb_per_sec",
    toUnitId: "mbps",
    categoryId: "data_transfer",
    title: "Megabytes per Second to Megabits per Second (MB/s to Mbps)",
    metaDescription: "Convert file download rate (MB/s) to connection bandwidth (Mbps). Multiply by 8.",
    formulaDescription: "Multiply Megabytes per second by 8 to convert to Megabits per second: Mbps = MB/s × 8.",
    exampleInput: 25,
  },
  {
    slug: "bps-to-kbps",
    fromUnitId: "bps",
    toUnitId: "kbps",
    categoryId: "data_transfer",
    title: "Bits per Second to Kilobits per Second Converter (bps to Kbps)",
    metaDescription: "Convert bps to Kbps for telecommunications, modem baud rates, and serial communications.",
    formulaDescription: "Divide bps by 1,000 to convert to Kbps.",
    exampleInput: 56000,
  },

  // --- FORCE (4) ---
  {
    slug: "newtons-to-pounds-force",
    fromUnitId: "newton",
    toUnitId: "pound_force",
    categoryId: "force",
    title: "Newtons to Pounds-force Converter (N to lbf)",
    metaDescription: "Convert Newtons to pounds-force for mechanical engineering, tension tests, and rocket thrust.",
    formulaDescription: "1 pound-force equals approximately 4.448222 Newtons. Divide Newtons by 4.44822.",
    exampleInput: 100,
  },
  {
    slug: "pounds-force-to-newtons",
    fromUnitId: "pound_force",
    toUnitId: "newton",
    categoryId: "force",
    title: "Pounds-force to Newtons Converter (lbf to N)",
    metaDescription: "Convert pounds-force to Newtons with exact 4.44822 multiplier and physics calculation steps.",
    formulaDescription: "1 lbf equals 4.4482216 Newtons. Multiply lbf by 4.44822.",
    exampleInput: 50,
  },
  {
    slug: "kilonewtons-to-newtons",
    fromUnitId: "kilonewton",
    toUnitId: "newton",
    categoryId: "force",
    title: "Kilonewtons to Newtons Converter (kN to N)",
    metaDescription: "Convert kilonewtons to Newtons with exact 1,000 multiplier for civil engineering structural loads.",
    formulaDescription: "Multiply kilonewtons by 1,000 to get Newtons.",
    exampleInput: 25,
  },
  {
    slug: "dynes-to-newtons",
    fromUnitId: "dyne",
    toUnitId: "newton",
    categoryId: "force",
    title: "Dynes to Newtons Converter (dyn to N)",
    metaDescription: "Convert CGS dynes to SI Newtons for surface tension and micro-fluidics.",
    formulaDescription: "1 Newton equals 100,000 dynes. Divide dynes by 100,000.",
    exampleInput: 100000,
  },

  // --- DENSITY (4) ---
  {
    slug: "kilograms-per-cubic-meter-to-grams-per-cubic-centimeter",
    aliases: ["kg-per-m3-to-g-per-cm3"],
    fromUnitId: "kg_per_m3",
    toUnitId: "g_per_cm3",
    categoryId: "density",
    title: "Kilograms per Cubic Meter to Grams per Cubic Centimeter (kg/m³ to g/cm³)",
    metaDescription: "Convert kg/m³ to g/cm³ for materials science and chemistry. Divide by 1,000.",
    formulaDescription: "1 g/cm³ equals 1,000 kg/m³. Divide kg/m³ by 1,000 to convert to g/cm³.",
    exampleInput: 1000,
  },
  {
    slug: "grams-per-cubic-centimeter-to-kilograms-per-cubic-meter",
    aliases: ["g-per-cm3-to-kg-per-m3"],
    fromUnitId: "g_per_cm3",
    toUnitId: "kg_per_m3",
    categoryId: "density",
    title: "Grams per Cubic Centimeter to Kilograms per Cubic Meter (g/cm³ to kg/m³)",
    metaDescription: "Convert g/cm³ to kg/m³ with live calculation. Multiply g/cm³ by 1,000.",
    formulaDescription: "Multiply g/cm³ by 1,000 to find kg/m³.",
    exampleInput: 1,
  },
  {
    slug: "pounds-per-cubic-foot-to-kilograms-per-cubic-meter",
    aliases: ["lb-per-ft3-to-kg-per-m3"],
    fromUnitId: "lb_per_ft3",
    toUnitId: "kg_per_m3",
    categoryId: "density",
    title: "Pounds per Cubic Foot to Kilograms per Cubic Meter (lb/ft³ to kg/m³)",
    metaDescription: "Convert US engineering density (lb/ft³) to metric density (kg/m³) with exact 16.0185 factor.",
    formulaDescription: "1 lb/ft³ equals approximately 16.018463 kg/m³. Multiply lb/ft³ by 16.0185.",
    exampleInput: 62.4,
  },
  {
    slug: "grams-per-milliliter-to-grams-per-cubic-centimeter",
    aliases: ["g-per-ml-to-g-per-cm3"],
    fromUnitId: "g_per_ml",
    toUnitId: "g_per_cm3",
    categoryId: "density",
    title: "Grams per Milliliter to Grams per Cubic Centimeter (g/mL to g/cm³)",
    metaDescription: "Convert g/mL to g/cm³ (1:1 identical equivalence in the metric system).",
    formulaDescription: "1 mL equals exactly 1 cm³, so 1 g/mL is identical to 1 g/cm³.",
    exampleInput: 1,
  },

  // --- TORQUE (4) ---
  {
    slug: "nm-to-lb-ft",
    fromUnitId: "nm",
    toUnitId: "lb_ft",
    categoryId: "torque",
    primaryKeyword: "nm to ft lbs",
    relatedKeywords: [
      "newton meters to foot pounds",
      "newton metres to foot lbs",
      "convert nm to lb ft torque",
      "torque nm to ft lb",
    ],
    title: "Nm to ft lbs — Newton Meters to Foot Pounds",
    h1: "Newton-Meters to Pound-Feet Converter (N·m to lb·ft)",
    metaDescription: "1 N·m = 0.73756 lb·ft. Convert newton metres to foot lbs instantly for lug nuts, cylinder heads & torque wrenches, with exact formula & lookup chart.",
    formulaDescription: "1 N·m equals approximately 0.73756215 lb·ft. Multiply N·m by 0.73756215 (or divide by 1.35581795).",
    exampleInput: 100,
  },
  {
    slug: "lb-ft-to-nm",
    fromUnitId: "lb_ft",
    toUnitId: "nm",
    categoryId: "torque",
    title: "Pound-feet to Newton-meters Converter (lb·ft to N·m)",
    metaDescription: "Convert pound-feet to Newton-meters with exact 1.355818 factor for engine dyno charts and mechanics.",
    formulaDescription: "1 lb·ft equals approximately 1.35581795 N·m. Multiply lb·ft by 1.35582.",
    exampleInput: 250,
  },
  {
    slug: "nm-to-lb-in",
    fromUnitId: "nm",
    toUnitId: "lb_in",
    categoryId: "torque",
    title: "Newton-meters to Pound-inches Converter (N·m to lb·in)",
    metaDescription: "Convert Newton-meters to pound-inches for precision electronics, bicycle components, and small fasteners.",
    formulaDescription: "1 N·m equals approximately 8.8507458 lb·in. Multiply N·m by 8.85075.",
    exampleInput: 5,
  },
  {
    slug: "kilogram-force-meters-to-newton-meters",
    aliases: ["kgf-m-to-nm"],
    fromUnitId: "kgf_m",
    toUnitId: "nm",
    categoryId: "torque",
    title: "Kilogram-force Meters to Newton-meters (kgf·m to N·m)",
    metaDescription: "Convert kgf·m to N·m with exact 9.80665 gravitational multiplier.",
    formulaDescription: "1 kgf·m equals exactly 9.80665 N·m. Multiply kgf·m by 9.80665.",
    exampleInput: 10,
  },

  // --- FREQUENCY (4) ---
  {
    slug: "hz-to-khz",
    fromUnitId: "hertz",
    toUnitId: "kilohertz",
    categoryId: "frequency",
    title: "Hertz to Kilohertz Converter (Hz to kHz)",
    metaDescription: "Convert Hertz to Kilohertz for audio engineering, acoustics, and radio communications. Divide by 1,000.",
    formulaDescription: "1 kHz equals 1,000 Hz. Divide Hertz by 1,000.",
    exampleInput: 44100,
  },
  {
    slug: "khz-to-mhz",
    fromUnitId: "kilohertz",
    toUnitId: "megahertz",
    categoryId: "frequency",
    title: "Kilohertz to Megahertz Converter (kHz to MHz)",
    metaDescription: "Convert kHz to MHz for radio bands (AM/FM) and microcontrollers.",
    formulaDescription: "1 MHz equals 1,000 kHz. Divide kHz by 1,000.",
    exampleInput: 1000,
  },
  {
    slug: "mhz-to-ghz",
    fromUnitId: "megahertz",
    toUnitId: "gigahertz",
    categoryId: "frequency",
    title: "Megahertz to Gigahertz Converter (MHz to GHz)",
    metaDescription: "Convert MHz to GHz for CPU clock frequencies and Wi-Fi channels (2.4 GHz & 5 GHz).",
    formulaDescription: "1 GHz equals 1,000 MHz. Divide MHz by 1,000.",
    exampleInput: 3200,
  },
  {
    slug: "rpm-to-hz",
    fromUnitId: "rpm",
    toUnitId: "hertz",
    categoryId: "frequency",
    title: "RPM to Hertz Converter (Revolutions per Min to Hz)",
    metaDescription: "Convert engine RPM to rotational cycles per second (Hertz) by dividing by 60.",
    formulaDescription: "There are 60 seconds in a minute. Divide RPM by 60 to obtain cycles per second (Hertz).",
    exampleInput: 3000,
  },

  // --- ANGLE (4) ---
  {
    slug: "degrees-to-radians",
    fromUnitId: "degree",
    toUnitId: "radian",
    categoryId: "angle",
    title: "Degrees to Radians Converter (° to rad)",
    metaDescription: "Convert degrees to radians for calculus, trigonometry, robotics, and game geometry. Multiply by π / 180.",
    formulaDescription: "Multiply degrees by π / 180 (approx. 0.0174533) to convert to radians: rad = ° × (π / 180).",
    exampleInput: 180,
  },
  {
    slug: "radians-to-degrees",
    fromUnitId: "radian",
    toUnitId: "degree",
    categoryId: "angle",
    title: "Radians to Degrees Converter (rad to °)",
    metaDescription: "Convert radians to degrees with live calculation. Multiply by 180 / π (approx. 57.2958°).",
    formulaDescription: "Multiply radians by 180 / π: ° = rad × (180 / π).",
    exampleInput: 3.14159265,
  },
  {
    slug: "degrees-to-gradians",
    fromUnitId: "degree",
    toUnitId: "gradian",
    categoryId: "angle",
    title: "Degrees to Gradians Converter (° to grad)",
    metaDescription: "Convert degrees to gradians (gon) for civil engineering and surveying with 400 grad full circle ratio.",
    formulaDescription: "1 full turn has 360 degrees and 400 gradians. Multiply degrees by 10/9 (approx. 1.11111).",
    exampleInput: 90,
  },
  {
    slug: "arcminutes-to-degrees",
    fromUnitId: "arcminute",
    toUnitId: "degree",
    categoryId: "angle",
    title: "Arcminutes to Degrees Converter (′ to °)",
    metaDescription: "Convert minutes of arc to decimal degrees for astronomy and GPS navigation. Divide by 60.",
    formulaDescription: "1 degree has 60 arcminutes. Divide arcminutes by 60.",
    exampleInput: 30,
  },

  // --- FUEL ECONOMY (4) ---
  {
    slug: "mpg-to-l-100km",
    fromUnitId: "mpg_us",
    toUnitId: "liters_per_100km",
    categoryId: "fuel_economy",
    title: "US MPG to L/100km Converter (Miles per Gallon to Liters/100km)",
    metaDescription: "Convert US MPG to Liters per 100km (L/100km) with live inverse formula (235.215 / MPG), consumption charts, and vehicle guide.",
    formulaDescription: "Fuel economy and consumption are inversely related. Divide 235.214583 by the US MPG: L/100km = 235.215 / MPG.",
    exampleInput: 30,
  },
  {
    slug: "l-100km-to-mpg",
    fromUnitId: "liters_per_100km",
    toUnitId: "mpg_us",
    categoryId: "fuel_economy",
    title: "L/100km to US MPG Converter (Liters/100km to Miles per Gallon)",
    metaDescription: "Convert European L/100km fuel consumption to US MPG with exact inverse formula: MPG = 235.215 / (L/100km).",
    formulaDescription: "Divide 235.214583 by the L/100km rating to find US MPG: MPG = 235.215 / (L/100km).",
    exampleInput: 7.5,
  },
  {
    slug: "mpg-us-to-mpg-imperial",
    fromUnitId: "mpg_us",
    toUnitId: "mpg_imperial",
    categoryId: "fuel_economy",
    title: "US MPG to UK Imperial MPG Converter",
    metaDescription: "Convert between US MPG and UK Imperial MPG based on the 1.20095 gallon size difference.",
    formulaDescription: "An Imperial gallon is approx. 20% larger than a US gallon. Multiply US MPG by 1.20095.",
    exampleInput: 35,
  },
  {
    slug: "km-per-l-to-mpg",
    fromUnitId: "km_per_liter",
    toUnitId: "mpg_us",
    categoryId: "fuel_economy",
    title: "Kilometers per Liter to US MPG Converter (km/L to MPG)",
    metaDescription: "Convert km/L to US MPG for Japanese and international vehicle fuel economy ratings.",
    formulaDescription: "Multiply kilometers per liter by 2.3521458 to obtain US MPG.",
    exampleInput: 15,
  },
  {
    slug: "mpg-to-km-per-l",
    fromUnitId: "mpg_us",
    toUnitId: "km_per_liter",
    categoryId: "fuel_economy",
    title: "US MPG to Kilometers per Liter Converter (MPG to km/L)",
    metaDescription: "Convert US miles per gallon (MPG) to kilometers per liter (km/L) with exact 0.425144 factor.",
    formulaDescription: "1 US MPG equals approximately 0.4251437 km/L. Multiply US MPG by 0.425144.",
    exampleInput: 30,
  },
  {
    slug: "km-per-l-to-l-100km",
    fromUnitId: "km_per_liter",
    toUnitId: "liters_per_100km",
    categoryId: "fuel_economy",
    title: "Kilometers per Liter to Liters per 100 km Converter (km/L to L/100km)",
    metaDescription: "Convert km/L to L/100km using the inverse fuel consumption formula: L/100km = 100 / (km/L).",
    formulaDescription: "Divide 100 by the kilometers-per-liter value: L/100km = 100 ÷ (km/L).",
    exampleInput: 12.5,
  },
  {
    slug: "l-100km-to-km-per-l",
    fromUnitId: "liters_per_100km",
    toUnitId: "km_per_liter",
    categoryId: "fuel_economy",
    title: "Liters per 100 km to Kilometers per Liter Converter (L/100km to km/L)",
    metaDescription: "Convert L/100km fuel consumption to km/L efficiency using the exact reciprocal formula: km/L = 100 / (L/100km).",
    formulaDescription: "Divide 100 by the L/100km figure: km/L = 100 ÷ (L/100km).",
    exampleInput: 8,
  },
  {
    slug: "mpg-imperial-to-mpg-us",
    fromUnitId: "mpg_imperial",
    toUnitId: "mpg_us",
    categoryId: "fuel_economy",
    title: "UK Imperial MPG to US MPG Converter",
    metaDescription: "Convert British Imperial MPG to US liquid MPG by multiplying by 0.832674.",
    formulaDescription: "Multiply UK Imperial MPG by 0.832674 to convert to US MPG.",
    exampleInput: 45,
  },

  // --- ADDITIONAL LENGTH & DISTANCE ---
  {
    slug: "cm-to-mm",
    fromUnitId: "centimeter",
    toUnitId: "millimeter",
    categoryId: "length",
    title: "Centimeters to Millimeters Converter (cm to mm)",
    metaDescription: "Convert centimeters to millimeters (cm to mm) instantly. Multiply centimeters by 10 with live reference table.",
    formulaDescription: "1 centimeter equals exactly 10 millimeters. Multiply centimeters by 10.",
    exampleInput: 15,
  },
  {
    slug: "mm-to-cm",
    fromUnitId: "millimeter",
    toUnitId: "centimeter",
    categoryId: "length",
    title: "Millimeters to Centimeters Converter (mm to cm)",
    metaDescription: "Convert millimeters to centimeters (mm to cm) in real time. Divide millimeters by 10.",
    formulaDescription: "There are 10 millimeters in 1 centimeter. Divide millimeters by 10.",
    exampleInput: 150,
  },
  {
    slug: "yards-to-feet",
    fromUnitId: "yard",
    toUnitId: "foot",
    categoryId: "length",
    title: "Yards to Feet Converter (yd to ft)",
    metaDescription: "Convert yards to feet (yd to ft) with exact 3-to-1 multiplier for landscaping, fabric, and sports fields.",
    formulaDescription: "1 yard is defined as exactly 3 feet. Multiply yards by 3.",
    exampleInput: 100,
  },
  {
    slug: "feet-to-yards",
    fromUnitId: "foot",
    toUnitId: "yard",
    categoryId: "length",
    title: "Feet to Yards Converter (ft to yd)",
    metaDescription: "Convert feet to yards (ft to yd) by dividing by 3. Includes landscaping and construction conversion tables.",
    formulaDescription: "Divide feet by 3 to convert to yards.",
    exampleInput: 30,
  },
  {
    slug: "yards-to-inches",
    fromUnitId: "yard",
    toUnitId: "inch",
    categoryId: "length",
    title: "Yards to Inches Converter (yd to in)",
    metaDescription: "Convert yards to inches (yd to in) for sewing, quilting, and upholstery. Multiply yards by 36.",
    formulaDescription: "1 yard equals 3 feet or 36 inches. Multiply yards by 36.",
    exampleInput: 2,
  },
  {
    slug: "inches-to-yards",
    fromUnitId: "inch",
    toUnitId: "yard",
    categoryId: "length",
    title: "Inches to Yards Converter (in to yd)",
    metaDescription: "Convert inches to yards (in to yd) for textile and fabric measurements. Divide inches by 36.",
    formulaDescription: "Divide inches by 36 to convert to yards.",
    exampleInput: 72,
  },
  {
    slug: "km-to-meters",
    fromUnitId: "kilometer",
    toUnitId: "meter",
    categoryId: "length",
    title: "Kilometers to Meters Converter (km to m)",
    metaDescription: "Convert kilometers to meters (km to m) with exact 1,000 multiplier and track distance benchmarks.",
    formulaDescription: "1 kilometer equals 1,000 meters. Multiply kilometers by 1,000.",
    exampleInput: 5,
  },
  {
    slug: "meters-to-km",
    fromUnitId: "meter",
    toUnitId: "kilometer",
    categoryId: "length",
    title: "Meters to Kilometers Converter (m to km)",
    metaDescription: "Convert meters to kilometers (m to km). Divide meters by 1,000 with instant decimal output.",
    formulaDescription: "Divide meters by 1,000 to convert to kilometers.",
    exampleInput: 1500,
  },
  {
    slug: "feet-to-miles",
    fromUnitId: "foot",
    toUnitId: "mile",
    categoryId: "length",
    title: "Feet to Miles Converter (ft to mi)",
    metaDescription: "Convert feet to statute miles (ft to mi) for aviation altitude, hiking elevation, and surveying. Divide by 5,280.",
    formulaDescription: "1 statute mile is 5,280 feet. Divide feet by 5,280 to obtain miles.",
    exampleInput: 10560,
  },
  {
    slug: "yards-to-miles",
    fromUnitId: "yard",
    toUnitId: "mile",
    categoryId: "length",
    title: "Yards to Miles Converter (yd to mi)",
    metaDescription: "Convert yards to miles (yd to mi) for swimming, golf, and track distances. Divide yards by 1,760.",
    formulaDescription: "1 mile contains 1,760 yards. Divide yards by 1,760.",
    exampleInput: 1760,
  },
  {
    slug: "miles-to-yards",
    fromUnitId: "mile",
    toUnitId: "yard",
    categoryId: "length",
    title: "Miles to Yards Converter (mi to yd)",
    metaDescription: "Convert statute miles to yards (mi to yd). Multiply miles by 1,760.",
    formulaDescription: "Multiply statute miles by 1,760 to calculate yards.",
    exampleInput: 2,
  },
  {
    slug: "nautical-miles-to-miles",
    fromUnitId: "nautical_mile",
    toUnitId: "mile",
    categoryId: "length",
    title: "Nautical Miles to Miles Converter (nmi to mi)",
    metaDescription: "Convert maritime nautical miles to statute miles (nmi to mi) with exact 1.15078 factor.",
    formulaDescription: "1 nautical mile (1,852 m) equals approximately 1.15077945 statute miles. Multiply nmi by 1.15078.",
    exampleInput: 100,
  },
  {
    slug: "miles-to-nautical-miles",
    fromUnitId: "mile",
    toUnitId: "nautical_mile",
    categoryId: "length",
    title: "Miles to Nautical Miles Converter (mi to nmi)",
    metaDescription: "Convert statute miles to nautical miles (mi to nmi) for marine and aviation navigation.",
    formulaDescription: "Multiply statute miles by 0.86897624 to convert to nautical miles.",
    exampleInput: 100,
  },
  {
    slug: "mil-to-mm",
    fromUnitId: "mil",
    toUnitId: "millimeter",
    categoryId: "length",
    title: "Mil (Thou) to Millimeters Converter (mil to mm)",
    metaDescription: "Convert mils (thousandths of an inch) to millimeters for PCB traces, coating thickness, and machining.",
    formulaDescription: "1 mil (0.001 inch) equals exactly 0.0254 millimeters. Multiply mils by 0.0254.",
    exampleInput: 10,
  },
  {
    slug: "mm-to-mil",
    fromUnitId: "millimeter",
    toUnitId: "mil",
    categoryId: "length",
    title: "Millimeters to Mils (Thou) Converter (mm to mil)",
    metaDescription: "Convert millimeters to mils (thousandths of an inch) with exact 39.3701 multiplier.",
    formulaDescription: "1 millimeter equals approximately 39.3700787 mils. Multiply mm by 39.3701.",
    exampleInput: 1,
  },
  {
    slug: "inches-to-nanometers",
    fromUnitId: "inch",
    toUnitId: "nanometer",
    categoryId: "length",
    title: "Inches to Nanometers Converter (in to nm)",
    metaDescription: "Convert inches to nanometers (in to nm) instantly using the exact 25,400,000 nanometers per inch formula, scale-aware conversion table, and step-by-step guide.",
    formulaDescription: "To convert inches to nanometers, multiply the length by the conversion ratio: 25,400,000 nanometers/inch.",
    exampleInput: 5,
    commonValues: [0.0000001, 0.000001, 0.00001, 0.0001, 0.001, 0.01, 0.1, 1, 2, 5, 10],
    benchmarks: [
      { value: 0.0000001, convertedValue: "2.54 nm", label: "Sub-10 nm transistor node (~0.1 microinch)", description: "Semiconductor lithography scale" },
      { value: 0.001, convertedValue: "25,400 nm", label: "1 Mil / Thou (0.001 in)", description: "Precision machining & film gauge" },
      { value: 1, convertedValue: "25,400,000 nm", label: "1 International Inch", description: "Exact SI definition (2.54 cm)" },
    ],
    faqs: [
      {
        question: "How many nanometers are in an inch?",
        answer: "There are exactly 25,400,000 nanometers in 1 international inch (1\" = 25,400,000 nm), because 1 inch is defined as 25.4 millimeters and each millimeter contains 1,000,000 nanometers.",
      },
      {
        question: "How do you convert inches to nanometers?",
        answer: "To convert inches to nanometers, multiply the length in inches by 25,400,000. Formula: nanometers = inches × 25,400,000. For example, 5 inches × 25,400,000 = 127,000,000 nm.",
      },
      {
        question: "What is 0.0000001 inches in nanometers?",
        answer: "0.0000001 inches (one ten-millionth of an inch) is equal to exactly 2.54 nanometers.",
      },
    ],
  },
  {
    slug: "nanometers-to-inches",
    fromUnitId: "nanometer",
    toUnitId: "inch",
    categoryId: "length",
    title: "Nanometers to Inches Converter (nm to in)",
    metaDescription: "Convert nanometers to inches (nm to in) with scientific and decimal precision. Divide nanometers by 25,400,000.",
    formulaDescription: "1 inch equals 25,400,000 nanometers. Divide the length in nanometers by 25,400,000 to convert to inches.",
    exampleInput: 25400000,
    commonValues: [1, 10, 100, 1000, 10000, 100000, 1000000, 25400000, 50000000, 100000000],
  },
  {
    slug: "inches-to-micrometers",
    fromUnitId: "inch",
    toUnitId: "micrometer",
    categoryId: "length",
    title: "Inches to Micrometers (Microns) Converter (in to µm)",
    metaDescription: "Convert inches to micrometers / microns (in to µm) using the exact 25,400 micrometers per inch ratio.",
    formulaDescription: "1 inch equals exactly 25,400 micrometers (microns). Multiply inches by 25,400.",
    exampleInput: 1,
  },
  {
    slug: "micrometers-to-inches",
    fromUnitId: "micrometer",
    toUnitId: "inch",
    categoryId: "length",
    title: "Micrometers (Microns) to Inches Converter (µm to in)",
    metaDescription: "Convert micrometers (microns) to inches (µm to in) by dividing by 25,400.",
    formulaDescription: "1 inch equals 25,400 micrometers. Divide micrometers by 25,400 to convert to inches.",
    exampleInput: 254,
  },
  {
    slug: "meters-to-nanometers",
    fromUnitId: "meter",
    toUnitId: "nanometer",
    categoryId: "length",
    title: "Meters to Nanometers Converter (m to nm)",
    metaDescription: "Convert meters to nanometers (m to nm) by multiplying by 1,000,000,000 (10⁹).",
    formulaDescription: "1 meter equals 1,000,000,000 nanometers. Multiply meters by 1,000,000,000.",
    exampleInput: 1,
  },
  {
    slug: "mm-to-nanometers",
    fromUnitId: "millimeter",
    toUnitId: "nanometer",
    categoryId: "length",
    title: "Millimeters to Nanometers Converter (mm to nm)",
    metaDescription: "Convert millimeters to nanometers (mm to nm) using the exact 1,000,000 nanometers per millimeter ratio.",
    formulaDescription: "1 millimeter equals 1,000,000 nanometers. Multiply millimeters by 1,000,000.",
    exampleInput: 1,
  },
  {
    slug: "nanometers-to-mm",
    fromUnitId: "nanometer",
    toUnitId: "millimeter",
    categoryId: "length",
    title: "Nanometers to Millimeters Converter (nm to mm)",
    metaDescription: "Convert nanometers to millimeters (nm to mm) by dividing by 1,000,000.",
    formulaDescription: "1 millimeter equals 1,000,000 nanometers. Divide nanometers by 1,000,000.",
    exampleInput: 1000000,
  },
  {
    slug: "nanometers-to-meters",
    fromUnitId: "nanometer",
    toUnitId: "meter",
    categoryId: "length",
    title: "Nanometers to Meters Converter (nm to m)",
    metaDescription: "Convert nanometers to meters (nm to m) for optics, laser wavelengths, and semiconductor lithography.",
    formulaDescription: "1 meter equals 1,000,000,000 (10⁹) nanometers. Divide nanometers by 10⁹.",
    exampleInput: 550,
  },
  {
    slug: "angstroms-to-nanometers",
    fromUnitId: "angstrom",
    toUnitId: "nanometer",
    categoryId: "length",
    title: "Angstroms to Nanometers Converter (Å to nm)",
    metaDescription: "Convert Angstroms to nanometers (Å to nm) for crystallography and atomic physics. Divide by 10.",
    formulaDescription: "1 nanometer equals 10 Angstroms. Divide Angstroms by 10.",
    exampleInput: 10,
  },
  {
    slug: "points-to-inches",
    fromUnitId: "point",
    toUnitId: "inch",
    categoryId: "length",
    title: "Points to Inches Converter (pt to in Typography)",
    metaDescription: "Convert typographic DTP points to inches (pt to in) using the 72 points per inch standard.",
    formulaDescription: "There are 72 desktop publishing points in 1 inch. Divide points by 72.",
    exampleInput: 12,
  },

  // --- ADDITIONAL MASS & WEIGHT ---
  {
    slug: "grams-to-mg",
    fromUnitId: "gram",
    toUnitId: "milligram",
    categoryId: "mass",
    title: "Grams to Milligrams Converter (g to mg)",
    metaDescription: "Convert grams to milligrams (g to mg) with exact 1,000 multiplier for pharmacy, nutrition, and lab chemistry.",
    formulaDescription: "1 gram equals 1,000 milligrams. Multiply grams by 1,000.",
    exampleInput: 2.5,
  },
  {
    slug: "kg-to-stone",
    fromUnitId: "kilogram",
    toUnitId: "stone",
    categoryId: "mass",
    title: "Kilograms to Stone Converter (kg to st)",
    metaDescription: "Convert kilograms to British stone (kg to st) for body weight. Divide kg by 6.35029.",
    formulaDescription: "1 stone equals 6.35029318 kilograms. Divide kilograms by 6.35029 (or multiply by 0.157473).",
    exampleInput: 75,
  },
  {
    slug: "stone-to-kg",
    fromUnitId: "stone",
    toUnitId: "kilogram",
    categoryId: "mass",
    title: "Stone to Kilograms Converter (st to kg)",
    metaDescription: "Convert British stone to kilograms (st to kg) with exact 6.35029 multiplier and weight charts.",
    formulaDescription: "1 stone (14 lbs) equals 6.35029318 kilograms. Multiply stone by 6.35029.",
    exampleInput: 12,
  },
  {
    slug: "kg-to-ounces",
    fromUnitId: "kilogram",
    toUnitId: "ounce",
    categoryId: "mass",
    title: "Kilograms to Ounces Converter (kg to oz)",
    metaDescription: "Convert kilograms to ounces (kg to oz) with exact 35.274 multiplier for shipping and culinary prep.",
    formulaDescription: "1 kilogram equals approximately 35.2739619 ounces. Multiply kilograms by 35.274.",
    exampleInput: 1,
  },
  {
    slug: "ounces-to-kg",
    fromUnitId: "ounce",
    toUnitId: "kilogram",
    categoryId: "mass",
    title: "Ounces to Kilograms Converter (oz to kg)",
    metaDescription: "Convert ounces to kilograms (oz to kg) by multiplying by 0.0283495.",
    formulaDescription: "1 ounce equals 0.028349523 kilograms. Multiply ounces by 0.02835.",
    exampleInput: 16,
  },
  {
    slug: "kg-to-metric-tons",
    fromUnitId: "kilogram",
    toUnitId: "metric_ton",
    categoryId: "mass",
    title: "Kilograms to Metric Tons (Tonnes) Converter (kg to t)",
    metaDescription: "Convert kilograms to metric tons / tonnes (kg to t). Divide kilograms by 1,000.",
    formulaDescription: "1 metric ton (tonne) equals 1,000 kilograms. Divide kilograms by 1,000.",
    exampleInput: 2500,
  },
  {
    slug: "metric-tons-to-kg",
    fromUnitId: "metric_ton",
    toUnitId: "kilogram",
    categoryId: "mass",
    title: "Metric Tons (Tonnes) to Kilograms Converter (t to kg)",
    metaDescription: "Convert metric tons (tonnes) to kilograms (t to kg). Multiply tonnes by 1,000.",
    formulaDescription: "Multiply metric tons by 1,000 to obtain kilograms.",
    exampleInput: 5,
  },
  {
    slug: "lbs-to-tons",
    fromUnitId: "pound",
    toUnitId: "us_ton",
    categoryId: "mass",
    title: "Pounds to US Tons Converter (lbs to tons)",
    metaDescription: "Convert pounds to US short tons (lbs to ton) for trucking, freight, and towing capacity. Divide by 2,000.",
    formulaDescription: "1 US short ton equals 2,000 pounds. Divide pounds by 2,000.",
    exampleInput: 5000,
  },
  {
    slug: "tons-to-lbs",
    fromUnitId: "us_ton",
    toUnitId: "pound",
    categoryId: "mass",
    title: "US Tons to Pounds Converter (tons to lbs)",
    metaDescription: "Convert US short tons to pounds (tons to lbs). Multiply tons by 2,000.",
    formulaDescription: "Multiply US short tons by 2,000 to calculate pounds.",
    exampleInput: 2.5,
  },
  {
    slug: "us-tons-to-metric-tons",
    fromUnitId: "us_ton",
    toUnitId: "metric_ton",
    categoryId: "mass",
    title: "US Short Tons to Metric Tons (Tonnes) Converter",
    metaDescription: "Convert US short tons (2,000 lbs) to metric tonnes (1,000 kg) with exact 0.907185 multiplier.",
    formulaDescription: "1 US short ton equals 0.90718474 metric tons. Multiply US tons by 0.907185.",
    exampleInput: 10,
  },
  {
    slug: "grains-to-grams",
    fromUnitId: "grain",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Grains to Grams Converter (gr to g)",
    metaDescription: "Convert grains to grams (gr to g) for archery, reloading, and pharmaceutical weights. Multiply by 0.06479891.",
    formulaDescription: "1 grain is legally defined as exactly 0.06479891 grams (64.79891 mg). Multiply grains by 0.0647989.",
    exampleInput: 150,
  },
  {
    slug: "grams-to-grains",
    fromUnitId: "gram",
    toUnitId: "grain",
    categoryId: "mass",
    title: "Grams to Grains Converter (g to gr)",
    metaDescription: "Convert grams to grains (g to gr) with exact 15.43236 multiplier.",
    formulaDescription: "1 gram equals approximately 15.4323584 grains. Multiply grams by 15.4324.",
    exampleInput: 10,
  },
  {
    slug: "carats-to-grams",
    fromUnitId: "carat",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Carats to Grams Converter (ct to g)",
    metaDescription: "Convert metric gemstone carats to grams (ct to g) using the exact 0.2 grams per carat definition.",
    formulaDescription: "1 metric carat equals 0.2 grams (200 milligrams). Multiply carats by 0.2.",
    exampleInput: 5,
  },

  // --- ADDITIONAL VOLUME & LIQUID ---
  {
    slug: "liters-to-ml",
    fromUnitId: "liter",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Liters to Milliliters Converter (L to mL)",
    metaDescription: "Convert liters to milliliters (L to mL) instantly. Multiply liters by 1,000.",
    formulaDescription: "1 liter contains 1,000 milliliters. Multiply liters by 1,000.",
    exampleInput: 1.5,
  },
  {
    slug: "ml-to-liters",
    fromUnitId: "milliliter",
    toUnitId: "liter",
    categoryId: "volume",
    title: "Milliliters to Liters Converter (mL to L)",
    metaDescription: "Convert milliliters to liters (mL to L) in real time. Divide milliliters by 1,000.",
    formulaDescription: "Divide milliliters by 1,000 to convert to liters.",
    exampleInput: 750,
  },
  {
    slug: "tablespoons-to-ml",
    fromUnitId: "us_tablespoon",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Tablespoons to Milliliters Converter (tbsp to mL)",
    metaDescription: "Convert US tablespoons to milliliters (tbsp to mL) for cooking and liquid medicine. Multiply by 14.7868.",
    formulaDescription: "1 US customary tablespoon equals approximately 14.7867648 milliliters. Multiply tablespoons by 14.7868.",
    exampleInput: 2,
  },
  {
    slug: "ml-to-tablespoons",
    fromUnitId: "milliliter",
    toUnitId: "us_tablespoon",
    categoryId: "volume",
    title: "Milliliters to Tablespoons Converter (mL to tbsp)",
    metaDescription: "Convert milliliters to US tablespoons (mL to tbsp). Divide milliliters by 14.7868.",
    formulaDescription: "Divide milliliters by 14.7868 to convert to US tablespoons.",
    exampleInput: 30,
  },
  {
    slug: "teaspoons-to-tablespoons",
    fromUnitId: "us_teaspoon",
    toUnitId: "us_tablespoon",
    categoryId: "volume",
    title: "Teaspoons to Tablespoons Converter (tsp to tbsp)",
    metaDescription: "Convert teaspoons to tablespoons (tsp to tbsp) for recipes. Divide teaspoons by 3.",
    formulaDescription: "There are 3 teaspoons in 1 tablespoon. Divide teaspoons by 3.",
    exampleInput: 6,
  },
  {
    slug: "cups-to-pints",
    fromUnitId: "us_cup",
    toUnitId: "us_pint",
    categoryId: "volume",
    title: "Cups to Pints Converter (cups to pt)",
    metaDescription: "Convert US cups to liquid pints (cups to pt). Divide cups by 2.",
    formulaDescription: "There are 2 US cups in 1 US liquid pint. Divide cups by 2.",
    exampleInput: 4,
  },
  {
    slug: "cups-to-gallons",
    fromUnitId: "us_cup",
    toUnitId: "us_gallon",
    categoryId: "volume",
    title: "Cups to Gallons Converter (cups to gal)",
    metaDescription: "Convert US cups to gallons (cups to gal) using the exact 16 cups per gallon ratio.",
    formulaDescription: "There are 16 US customary cups in 1 US liquid gallon. Divide cups by 16.",
    exampleInput: 16,
  },
  {
    slug: "gallons-to-cups",
    fromUnitId: "us_gallon",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Gallons to Cups Converter (gal to cups)",
    metaDescription: "Convert US gallons to cups (gal to cups). Multiply gallons by 16.",
    formulaDescription: "1 US gallon equals 16 US cups. Multiply gallons by 16.",
    exampleInput: 1,
  },
  {
    slug: "pints-to-gallons",
    fromUnitId: "us_pint",
    toUnitId: "us_gallon",
    categoryId: "volume",
    title: "Pints to Gallons Converter (pt to gal)",
    metaDescription: "Convert US liquid pints to gallons (pt to gal). Divide pints by 8.",
    formulaDescription: "There are 8 US liquid pints in 1 US gallon. Divide pints by 8.",
    exampleInput: 8,
  },
  {
    slug: "gallons-to-pints",
    fromUnitId: "us_gallon",
    toUnitId: "us_pint",
    categoryId: "volume",
    title: "Gallons to Pints Converter (gal to pt)",
    metaDescription: "Convert US gallons to liquid pints (gal to pt). Multiply gallons by 8.",
    formulaDescription: "Multiply US liquid gallons by 8 to calculate pints.",
    exampleInput: 2,
  },
  {
    slug: "fluid-ounces-to-cups",
    fromUnitId: "us_fluid_ounce",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Fluid Ounces to Cups Converter (fl oz to cups)",
    metaDescription: "Convert US fluid ounces to cups (fl oz to cups) for cooking and hydration tracking. Divide by 8.",
    formulaDescription: "There are 8 US fluid ounces in 1 US cup. Divide fluid ounces by 8.",
    exampleInput: 16,
  },
  {
    slug: "cups-to-fluid-ounces",
    fromUnitId: "us_cup",
    toUnitId: "us_fluid_ounce",
    categoryId: "volume",
    title: "Cups to Fluid Ounces Converter (cups to fl oz)",
    metaDescription: "Convert US cups to fluid ounces (cups to fl oz). Multiply cups by 8.",
    formulaDescription: "1 US cup equals 8 US fluid ounces. Multiply cups by 8.",
    exampleInput: 2,
  },
  {
    slug: "fluid-ounces-to-gallons",
    fromUnitId: "us_fluid_ounce",
    toUnitId: "us_gallon",
    categoryId: "volume",
    title: "Fluid Ounces to Gallons Converter (fl oz to gal)",
    metaDescription: "Convert US fluid ounces to gallons (fl oz to gal) using the 128 fl oz per gallon standard.",
    formulaDescription: "1 US liquid gallon contains 128 US fluid ounces. Divide fluid ounces by 128.",
    exampleInput: 64,
  },
  {
    slug: "gallons-to-fluid-ounces",
    fromUnitId: "us_gallon",
    toUnitId: "us_fluid_ounce",
    categoryId: "volume",
    title: "Gallons to Fluid Ounces Converter (gal to fl oz)",
    metaDescription: "Convert US gallons to fluid ounces (gal to fl oz). Multiply gallons by 128.",
    formulaDescription: "Multiply US liquid gallons by 128 to obtain fluid ounces.",
    exampleInput: 1,
  },
  {
    slug: "fluid-ounces-to-liters",
    fromUnitId: "us_fluid_ounce",
    toUnitId: "liter",
    categoryId: "volume",
    title: "Fluid Ounces to Liters Converter (fl oz to L)",
    metaDescription: "Convert US fluid ounces to liters (fl oz to L) for beverage bottles and hydration.",
    formulaDescription: "1 US fluid ounce equals 0.02957353 liters. Multiply fl oz by 0.0295735 (or divide by 33.814).",
    exampleInput: 32,
  },
  {
    slug: "liters-to-fluid-ounces",
    fromUnitId: "liter",
    toUnitId: "us_fluid_ounce",
    categoryId: "volume",
    title: "Liters to Fluid Ounces Converter (L to fl oz)",
    metaDescription: "Convert liters to US fluid ounces (L to fl oz) with exact 33.814 multiplier.",
    formulaDescription: "1 liter equals approximately 33.8140227 US fluid ounces. Multiply liters by 33.814.",
    exampleInput: 2,
  },
  {
    slug: "pints-to-liters",
    fromUnitId: "us_pint",
    toUnitId: "liter",
    categoryId: "volume",
    title: "Pints to Liters Converter (pt to L)",
    metaDescription: "Convert US liquid pints to liters (pt to L) with exact 0.473176 multiplier.",
    formulaDescription: "1 US liquid pint equals 0.473176473 liters. Multiply pints by 0.473176.",
    exampleInput: 2,
  },
  {
    slug: "liters-to-pints",
    fromUnitId: "liter",
    toUnitId: "us_pint",
    categoryId: "volume",
    title: "Liters to Pints Converter (L to pt)",
    metaDescription: "Convert liters to US liquid pints (L to pt) by multiplying by 2.11338.",
    formulaDescription: "1 liter equals approximately 2.1133764 US liquid pints. Multiply liters by 2.11338.",
    exampleInput: 1,
  },
  {
    slug: "cubic-inches-to-gallons",
    fromUnitId: "cubic_inch",
    toUnitId: "us_gallon",
    categoryId: "volume",
    title: "Cubic Inches to Gallons Converter (in³ to gal)",
    metaDescription: "Convert cubic inches to US liquid gallons using the exact legal definition of 231 cubic inches per gallon.",
    formulaDescription: "1 US liquid gallon is legally defined as exactly 231 cubic inches. Divide cubic inches by 231.",
    exampleInput: 231,
  },
  {
    slug: "cubic-inches-to-liters",
    fromUnitId: "cubic_inch",
    toUnitId: "liter",
    categoryId: "volume",
    title: "Cubic Inches to Liters Converter (in³ to L Engine Displacement)",
    metaDescription: "Convert engine displacement from cubic inches (ci / in³) to liters (L) for V8 muscle cars and motorsports.",
    formulaDescription: "1 cubic inch equals 0.016387064 liters. Multiply cubic inches by 0.0163871 (or divide by 61.0237).",
    exampleInput: 350,
  },
  {
    slug: "liters-to-cubic-inches",
    fromUnitId: "liter",
    toUnitId: "cubic_inch",
    categoryId: "volume",
    title: "Liters to Cubic Inches Converter (L to in³ Engine Size)",
    metaDescription: "Convert engine liters to cubic inches (L to cu in) with exact 61.0237 multiplier.",
    formulaDescription: "1 liter equals approximately 61.0237441 cubic inches. Multiply liters by 61.0237.",
    exampleInput: 5.7,
  },
  {
    slug: "cubic-feet-to-cubic-meters",
    fromUnitId: "cubic_foot",
    toUnitId: "cubic_meter",
    categoryId: "volume",
    title: "Cubic Feet to Cubic Meters Converter (ft³ to m³)",
    metaDescription: "Convert cubic feet to cubic meters (ft³ to m³) for HVAC, shipping containers, and natural gas.",
    formulaDescription: "1 cubic foot equals 0.028316847 cubic meters. Multiply cubic feet by 0.0283168.",
    exampleInput: 100,
  },
  {
    slug: "cubic-feet-to-cubic-yards",
    fromUnitId: "cubic_foot",
    toUnitId: "cubic_yard",
    categoryId: "volume",
    title: "Cubic Feet to Cubic Yards Converter (ft³ to yd³)",
    metaDescription: "Convert cubic feet to cubic yards (ft³ to yd³) for concrete, mulch, topsoil, and gravel. Divide by 27.",
    formulaDescription: "1 cubic yard (3 ft × 3 ft × 3 ft) equals 27 cubic feet. Divide cubic feet by 27.",
    exampleInput: 54,
  },
  {
    slug: "cubic-yards-to-cubic-feet",
    fromUnitId: "cubic_yard",
    toUnitId: "cubic_foot",
    categoryId: "volume",
    title: "Cubic Yards to Cubic Feet Converter (yd³ to ft³)",
    metaDescription: "Convert cubic yards to cubic feet (yd³ to ft³) for landscaping and concrete volume. Multiply by 27.",
    formulaDescription: "Multiply cubic yards by 27 to calculate cubic feet.",
    exampleInput: 3,
  },

  // --- ADDITIONAL AREA ---
  {
    slug: "sq-feet-to-acres",
    fromUnitId: "sq_foot",
    toUnitId: "acre",
    categoryId: "area",
    title: "Square Feet to Acres Converter (sq ft to ac)",
    metaDescription: "Convert square feet to acres (ft² to ac) for real estate lot sizes and land surveying. Divide by 43,560.",
    formulaDescription: "1 acre contains exactly 43,560 square feet. Divide square feet by 43,560.",
    exampleInput: 43560,
  },
  {
    slug: "sq-feet-to-sq-yards",
    fromUnitId: "sq_foot",
    toUnitId: "sq_yard",
    categoryId: "area",
    title: "Square Feet to Square Yards Converter (sq ft to sq yd)",
    metaDescription: "Convert square feet to square yards (ft² to yd²) for carpeting, flooring, and sod. Divide by 9.",
    formulaDescription: "1 square yard (3 ft × 3 ft) equals 9 square feet. Divide square feet by 9.",
    exampleInput: 180,
  },
  {
    slug: "sq-yards-to-sq-feet",
    fromUnitId: "sq_yard",
    toUnitId: "sq_foot",
    categoryId: "area",
    title: "Square Yards to Square Feet Converter (sq yd to sq ft)",
    metaDescription: "Convert square yards to square feet (yd² to ft²). Multiply square yards by 9.",
    formulaDescription: "Multiply square yards by 9 to obtain square feet.",
    exampleInput: 20,
  },
  {
    slug: "sq-cm-to-sq-inches",
    fromUnitId: "sq_cm",
    toUnitId: "sq_inch",
    categoryId: "area",
    title: "Square Centimeters to Square Inches Converter (cm² to in²)",
    metaDescription: "Convert square centimeters to square inches (cm² to in²). Divide by 6.4516.",
    formulaDescription: "1 square inch equals 6.4516 cm². Divide square centimeters by 6.4516.",
    exampleInput: 100,
  },
  {
    slug: "hectares-to-sq-meters",
    fromUnitId: "hectare",
    toUnitId: "sq_meter",
    categoryId: "area",
    title: "Hectares to Square Meters Converter (ha to m²)",
    metaDescription: "Convert hectares to square meters (ha to m²) with exact 10,000 multiplier.",
    formulaDescription: "1 hectare equals 10,000 square meters (100 m × 100 m). Multiply hectares by 10,000.",
    exampleInput: 2,
  },
  {
    slug: "sq-meters-to-hectares",
    fromUnitId: "sq_meter",
    toUnitId: "hectare",
    categoryId: "area",
    title: "Square Meters to Hectares Converter (m² to ha)",
    metaDescription: "Convert square meters to hectares (m² to ha). Divide square meters by 10,000.",
    formulaDescription: "Divide square meters by 10,000 to convert to hectares.",
    exampleInput: 25000,
  },

  // --- ADDITIONAL SPEED ---
  {
    slug: "meters-per-second-to-mph",
    fromUnitId: "m_per_s",
    toUnitId: "mph",
    categoryId: "speed",
    title: "Meters per Second to Miles per Hour Converter (m/s to mph)",
    metaDescription: "Convert meters per second to miles per hour (m/s to mph) for wind speed and meteorology. Multiply by 2.23694.",
    formulaDescription: "1 meter per second equals approximately 2.23693629 miles per hour. Multiply m/s by 2.23694.",
    exampleInput: 10,
  },
  {
    slug: "mph-to-meters-per-second",
    fromUnitId: "mph",
    toUnitId: "m_per_s",
    categoryId: "speed",
    title: "Miles per Hour to Meters per Second Converter (mph to m/s)",
    metaDescription: "Convert miles per hour to meters per second (mph to m/s) with exact 0.44704 multiplier.",
    formulaDescription: "1 mph equals exactly 0.44704 meters per second. Multiply mph by 0.44704.",
    exampleInput: 60,
  },
  {
    slug: "mph-to-knots",
    fromUnitId: "mph",
    toUnitId: "knot",
    categoryId: "speed",
    title: "Miles per Hour to Knots Converter (mph to kn)",
    metaDescription: "Convert miles per hour to knots (mph to kn) for marine and aviation wind speed.",
    formulaDescription: "Multiply miles per hour by 0.868976 to convert to knots.",
    exampleInput: 50,
  },
  {
    slug: "kph-to-meters-per-second",
    fromUnitId: "km_per_h",
    toUnitId: "m_per_s",
    categoryId: "speed",
    title: "Kilometers per Hour to Meters per Second Converter (km/h to m/s)",
    metaDescription: "Convert km/h to m/s for physics and vehicle braking distance calculations. Divide km/h by 3.6.",
    formulaDescription: "1 m/s equals 3.6 km/h. Divide kilometers per hour by 3.6.",
    exampleInput: 36,
  },
  {
    slug: "mph-to-fps",
    fromUnitId: "mph",
    toUnitId: "ft_per_s",
    categoryId: "speed",
    title: "Miles per Hour to Feet per Second Converter (mph to ft/s)",
    metaDescription: "Convert mph to feet per second (ft/s) for vehicle stopping distance and ballistics. Multiply by 1.46667.",
    formulaDescription: "1 mph equals 5,280 ft / 3,600 s ≈ 1.46667 ft/s. Multiply mph by 1.46667.",
    exampleInput: 60,
  },

  // --- ADDITIONAL TIME ---
  {
    slug: "months-to-years",
    fromUnitId: "month",
    toUnitId: "year",
    categoryId: "time",
    title: "Months to Years Converter (mo to yr)",
    metaDescription: "Convert months to years (mo to yr) for loans, mortgages, and age milestones. Divide months by 12.",
    formulaDescription: "There are 12 months in 1 calendar year. Divide months by 12.",
    exampleInput: 36,
  },
  {
    slug: "years-to-months",
    fromUnitId: "year",
    toUnitId: "month",
    categoryId: "time",
    title: "Years to Months Converter (yr to mo)",
    metaDescription: "Convert years to months (yr to mo). Multiply years by 12.",
    formulaDescription: "Multiply years by 12 to calculate months.",
    exampleInput: 5,
  },
  {
    slug: "seconds-to-days",
    fromUnitId: "second",
    toUnitId: "day",
    categoryId: "time",
    title: "Seconds to Days Converter (s to d)",
    metaDescription: "Convert seconds to civil days (s to d) using the 86,400 seconds per day standard.",
    formulaDescription: "1 civil day contains 86,400 seconds (24 × 60 × 60). Divide seconds by 86,400.",
    exampleInput: 86400,
  },
  {
    slug: "days-to-seconds",
    fromUnitId: "day",
    toUnitId: "second",
    categoryId: "time",
    title: "Days to Seconds Converter (d to s)",
    metaDescription: "Convert days to seconds (d to s). Multiply days by 86,400.",
    formulaDescription: "Multiply civil days by 86,400 to calculate seconds.",
    exampleInput: 1,
  },
  {
    slug: "minutes-to-seconds",
    fromUnitId: "minute",
    toUnitId: "second",
    categoryId: "time",
    title: "Minutes to Seconds Converter (min to s)",
    metaDescription: "Convert minutes to seconds (min to s). Multiply minutes by 60.",
    formulaDescription: "1 minute equals 60 seconds. Multiply minutes by 60.",
    exampleInput: 5,
  },
  {
    slug: "seconds-to-hours",
    fromUnitId: "second",
    toUnitId: "hour",
    categoryId: "time",
    title: "Seconds to Hours Converter (s to hr)",
    metaDescription: "Convert seconds to hours (s to hr) by dividing by 3,600.",
    formulaDescription: "There are 3,600 seconds in 1 hour. Divide seconds by 3,600.",
    exampleInput: 3600,
  },
  {
    slug: "hours-to-seconds",
    fromUnitId: "hour",
    toUnitId: "second",
    categoryId: "time",
    title: "Hours to Seconds Converter (hr to s)",
    metaDescription: "Convert hours to seconds (hr to s). Multiply hours by 3,600.",
    formulaDescription: "Multiply hours by 3,600 to calculate seconds.",
    exampleInput: 2,
  },
  {
    slug: "minutes-to-days",
    fromUnitId: "minute",
    toUnitId: "day",
    categoryId: "time",
    title: "Minutes to Days Converter (min to d)",
    metaDescription: "Convert minutes to days (min to d) using the 1,440 minutes per day ratio.",
    formulaDescription: "1 day contains 1,440 minutes (24 × 60). Divide minutes by 1,440.",
    exampleInput: 1440,
  },

  // --- ADDITIONAL PRESSURE ---
  {
    slug: "pascal-to-megapascal",
    fromUnitId: "pascal",
    toUnitId: "megapascal",
    categoryId: "pressure",
    title: "Pascals to Megapascals Converter (Pa to MPa)",
    metaDescription: "Convert Pascals to Megapascals (Pa to MPa). Divide Pascals by 1,000,000.",
    formulaDescription: "1 Megapascal equals 1,000,000 Pascals. Divide Pascals by 1,000,000.",
    exampleInput: 1000000,
  },
  {
    slug: "megapascal-to-pascal",
    fromUnitId: "megapascal",
    toUnitId: "pascal",
    categoryId: "pressure",
    title: "Megapascals to Pascals Converter (MPa to Pa)",
    metaDescription: "Convert Megapascals to Pascals (MPa to Pa). Multiply MPa by 1,000,000.",
    formulaDescription: "Multiply Megapascals by 1,000,000 to calculate Pascals.",
    exampleInput: 1,
  },
  {
    slug: "bar-to-kpa",
    fromUnitId: "bar",
    toUnitId: "kilopascal",
    categoryId: "pressure",
    title: "Bar to Kilopascals Converter (bar to kPa)",
    metaDescription: "Convert bar to kilopascals (bar to kPa) with exact 100 multiplier.",
    formulaDescription: "1 bar equals 100 kilopascals (100,000 Pa). Multiply bar by 100.",
    exampleInput: 2.5,
  },
  {
    slug: "kpa-to-bar",
    fromUnitId: "kilopascal",
    toUnitId: "bar",
    categoryId: "pressure",
    title: "Kilopascals to Bar Converter (kPa to bar)",
    metaDescription: "Convert kilopascals to bar (kPa to bar). Divide kPa by 100.",
    formulaDescription: "Divide kilopascals by 100 to convert to bar.",
    exampleInput: 250,
  },
  {
    slug: "bar-to-megapascal",
    fromUnitId: "bar",
    toUnitId: "megapascal",
    categoryId: "pressure",
    title: "Bar to Megapascals Converter (bar to MPa)",
    metaDescription: "Convert bar to Megapascals (bar to MPa) for hydraulic systems. Divide bar by 10.",
    formulaDescription: "1 Megapascal equals 10 bar. Divide bar by 10.",
    exampleInput: 100,
  },
  {
    slug: "megapascal-to-bar",
    fromUnitId: "megapascal",
    toUnitId: "bar",
    categoryId: "pressure",
    title: "Megapascals to Bar Converter (MPa to bar)",
    metaDescription: "Convert Megapascals to bar (MPa to bar). Multiply MPa by 10.",
    formulaDescription: "Multiply Megapascals by 10 to calculate bar.",
    exampleInput: 10,
  },
  {
    slug: "ksi-to-psi",
    fromUnitId: "ksi",
    toUnitId: "psi",
    categoryId: "pressure",
    title: "ksi to PSI Converter (Kilopounds per Sq Inch to PSI)",
    metaDescription: "Convert ksi to PSI for structural steel yield strength and materials testing. Multiply ksi by 1,000.",
    formulaDescription: "1 ksi equals 1,000 PSI. Multiply ksi by 1,000.",
    exampleInput: 50,
  },
  {
    slug: "ksi-to-megapascal",
    fromUnitId: "ksi",
    toUnitId: "megapascal",
    categoryId: "pressure",
    title: "ksi to Megapascals Converter (ksi to MPa)",
    metaDescription: "Convert ksi to MPa for metallurgy and tensile stress testing. Multiply ksi by 6.89476.",
    formulaDescription: "1 ksi equals approximately 6.894757 MPa. Multiply ksi by 6.89476.",
    exampleInput: 60,
  },
  {
    slug: "megapascal-to-ksi",
    fromUnitId: "megapascal",
    toUnitId: "ksi",
    categoryId: "pressure",
    title: "Megapascals to ksi Converter (MPa to ksi)",
    metaDescription: "Convert MPa to ksi for mechanical engineering tensile stress. Divide MPa by 6.89476.",
    formulaDescription: "Divide Megapascals by 6.894757 to convert to ksi.",
    exampleInput: 400,
  },

  // --- ADDITIONAL ENERGY ---
  {
    slug: "kj-to-kcal",
    fromUnitId: "kilojoule",
    toUnitId: "kilocalorie",
    categoryId: "energy",
    title: "Kilojoules to Kilocalories (Food Calories) Converter (kJ to kcal)",
    metaDescription: "Convert food label kilojoules (kJ) to dietary Calories (kcal) by dividing by 4.184.",
    formulaDescription: "1 dietary kilocalorie (kcal) equals 4.184 kilojoules. Divide kJ by 4.184.",
    exampleInput: 2000,
  },
  {
    slug: "kcal-to-kj",
    fromUnitId: "kilocalorie",
    toUnitId: "kilojoule",
    categoryId: "energy",
    title: "Kilocalories (Food Calories) to Kilojoules Converter (kcal to kJ)",
    metaDescription: "Convert dietary Calories (kcal) to kilojoules (kJ) with exact 4.184 multiplier.",
    formulaDescription: "Multiply kilocalories by 4.184 to obtain kilojoules.",
    exampleInput: 500,
  },
  {
    slug: "btu-to-kwh",
    fromUnitId: "btu",
    toUnitId: "kilowatt_hour",
    categoryId: "energy",
    title: "BTU to Kilowatt-hours Converter (BTU to kWh)",
    metaDescription: "Convert BTU thermal energy to electrical kilowatt-hours (kWh). Divide BTU by 3,412.14.",
    formulaDescription: "1 kWh equals approximately 3,412.1416 BTU. Divide BTU by 3,412.14.",
    exampleInput: 10000,
  },
  {
    slug: "foot-pounds-to-joules",
    fromUnitId: "foot_pound",
    toUnitId: "joule",
    categoryId: "energy",
    title: "Foot-pounds to Joules Converter (ft·lbf to J)",
    metaDescription: "Convert mechanical foot-pounds of energy to Joules (ft-lbs to J) for ballistics and impact energy.",
    formulaDescription: "1 foot-pound equals approximately 1.355818 Joules. Multiply ft·lbf by 1.35582.",
    exampleInput: 100,
  },
  {
    slug: "joules-to-foot-pounds",
    fromUnitId: "joule",
    toUnitId: "foot_pound",
    categoryId: "energy",
    title: "Joules to Foot-pounds Converter (J to ft·lbf)",
    metaDescription: "Convert Joules to foot-pounds of energy (J to ft-lbs). Multiply Joules by 0.737562.",
    formulaDescription: "1 Joule equals approximately 0.73756215 foot-pounds. Multiply Joules by 0.737562.",
    exampleInput: 100,
  },

  // --- ADDITIONAL POWER ---
  {
    slug: "watts-to-kw",
    fromUnitId: "watt",
    toUnitId: "kilowatt",
    categoryId: "power",
    title: "Watts to Kilowatts Converter (W to kW)",
    metaDescription: "Convert Watts to Kilowatts (W to kW) for solar panels, appliances, and generators. Divide Watts by 1,000.",
    formulaDescription: "1 Kilowatt equals 1,000 Watts. Divide Watts by 1,000.",
    exampleInput: 1500,
  },
  {
    slug: "kw-to-watts",
    fromUnitId: "kilowatt",
    toUnitId: "watt",
    categoryId: "power",
    title: "Kilowatts to Watts Converter (kW to W)",
    metaDescription: "Convert Kilowatts to Watts (kW to W). Multiply Kilowatts by 1,000.",
    formulaDescription: "Multiply Kilowatts by 1,000 to obtain Watts.",
    exampleInput: 5,
  },
  {
    slug: "tons-refrigeration-to-btu-per-hour",
    fromUnitId: "ton_refrigeration",
    toUnitId: "btu_per_hour",
    categoryId: "power",
    title: "Tons of Refrigeration to BTU/hr Converter (TR to BTU/h)",
    metaDescription: "Convert HVAC cooling tons to BTU per hour using the exact 12,000 BTU/hr per ton standard.",
    formulaDescription: "1 Ton of Refrigeration equals 12,000 BTU/hr. Multiply tons by 12,000.",
    exampleInput: 3,
  },
  {
    slug: "btu-per-hour-to-tons-refrigeration",
    fromUnitId: "btu_per_hour",
    toUnitId: "ton_refrigeration",
    categoryId: "power",
    title: "BTU/hr to Tons of Refrigeration Converter (BTU/h to TR)",
    metaDescription: "Convert air conditioner BTU/hr ratings to Tons of Refrigeration. Divide BTU/hr by 12,000.",
    formulaDescription: "Divide BTU/hr by 12,000 to calculate Tons of Refrigeration.",
    exampleInput: 24000,
  },

  // --- ADDITIONAL DIGITAL STORAGE ---
  {
    slug: "mb-to-kb",
    fromUnitId: "megabyte",
    toUnitId: "kilobyte",
    categoryId: "digital_storage",
    title: "Megabytes to Kilobytes Converter (MB to KB)",
    metaDescription: "Convert Megabytes to Kilobytes (MB to KB) with SI decimal (1,000 KB) and binary reference.",
    formulaDescription: "Under the SI decimal standard, 1 Megabyte equals 1,000 Kilobytes. Multiply MB by 1,000.",
    exampleInput: 5,
  },
  {
    slug: "kb-to-gb",
    fromUnitId: "kilobyte",
    toUnitId: "gigabyte",
    categoryId: "digital_storage",
    title: "Kilobytes to Gigabytes Converter (KB to GB)",
    metaDescription: "Convert Kilobytes to Gigabytes (KB to GB). Divide Kilobytes by 1,000,000.",
    formulaDescription: "1 Gigabyte equals 1,000,000 Kilobytes (SI decimal). Divide KB by 1,000,000.",
    exampleInput: 500000,
  },
  {
    slug: "gb-to-kb",
    fromUnitId: "gigabyte",
    toUnitId: "kilobyte",
    categoryId: "digital_storage",
    title: "Gigabytes to Kilobytes Converter (GB to KB)",
    metaDescription: "Convert Gigabytes to Kilobytes (GB to KB). Multiply GB by 1,000,000.",
    formulaDescription: "Multiply Gigabytes by 1,000,000 to calculate Kilobytes.",
    exampleInput: 1,
  },
  {
    slug: "bytes-to-mb",
    fromUnitId: "byte",
    toUnitId: "megabyte",
    categoryId: "digital_storage",
    title: "Bytes to Megabytes Converter (B to MB)",
    metaDescription: "Convert Bytes to Megabytes (B to MB) for file size reporting.",
    formulaDescription: "Divide Bytes by 1,000,000 to obtain decimal Megabytes.",
    exampleInput: 5000000,
  },
  {
    slug: "gib-to-gb",
    fromUnitId: "gibibyte",
    toUnitId: "gigabyte",
    categoryId: "digital_storage",
    title: "Gibibytes to Gigabytes Converter (GiB to GB)",
    metaDescription: "Convert binary Gibibytes (GiB) to decimal Gigabytes (GB) with exact 1.073741824 factor.",
    formulaDescription: "1 GiB (2³⁰ bytes) equals 1.073741824 GB (10⁹ bytes). Multiply GiB by 1.07374.",
    exampleInput: 500,
  },

  // --- ADDITIONAL DATA TRANSFER ---
  {
    slug: "mbps-to-kbps",
    fromUnitId: "mbps",
    toUnitId: "kbps",
    categoryId: "data_transfer",
    title: "Megabits per Second to Kilobits per Second Converter (Mbps to Kbps)",
    metaDescription: "Convert Mbps to Kbps for audio/video streaming bitrates and network bandwidth. Multiply by 1,000.",
    formulaDescription: "1 Mbps equals 1,000 Kbps. Multiply Mbps by 1,000.",
    exampleInput: 10,
  },

  // --- ADDITIONAL FORCE ---
  {
    slug: "kgf-to-newtons",
    fromUnitId: "kilogram_force",
    toUnitId: "newton",
    categoryId: "force",
    title: "Kilogram-force to Newtons Converter (kgf to N)",
    metaDescription: "Convert kilogram-force (kilopond) to Newtons with exact 9.80665 standard gravity factor.",
    formulaDescription: "1 kilogram-force equals exactly 9.80665 Newtons. Multiply kgf by 9.80665.",
    exampleInput: 10,
  },
  {
    slug: "newtons-to-kgf",
    fromUnitId: "newton",
    toUnitId: "kilogram_force",
    categoryId: "force",
    title: "Newtons to Kilogram-force Converter (N to kgf)",
    metaDescription: "Convert Newtons to kilogram-force (N to kgf). Divide Newtons by 9.80665.",
    formulaDescription: "Divide Newtons by 9.80665 to convert to kilogram-force.",
    exampleInput: 100,
  },
  {
    slug: "kilonewton-to-pound-force",
    fromUnitId: "kilonewton",
    toUnitId: "pound_force",
    categoryId: "force",
    title: "Kilonewtons to Pounds-force Converter (kN to lbf)",
    metaDescription: "Convert kilonewtons to pounds-force (kN to lbf) for climbing gear ratings and structural engineering.",
    formulaDescription: "1 kilonewton equals approximately 224.80894 pounds-force. Multiply kN by 224.809.",
    exampleInput: 22,
  },
  {
    slug: "gram-force-to-newton",
    fromUnitId: "gram_force",
    toUnitId: "newton",
    categoryId: "force",
    title: "Gram-force to Newtons Converter (gf to N)",
    metaDescription: "Convert gram-force to Newtons (gf to N) for mechanical switches and precision tension springs.",
    formulaDescription: "1 gram-force equals 0.00980665 Newtons. Multiply gf by 0.00980665.",
    exampleInput: 50,
  },

  // --- ADDITIONAL DENSITY & CONCENTRATION ---
  {
    slug: "kilograms-per-cubic-meter-to-pounds-per-cubic-foot",
    aliases: ["kg-per-m3-to-lb-per-ft3"],
    fromUnitId: "kg_per_m3",
    toUnitId: "lb_per_ft3",
    categoryId: "density",
    title: "Kilograms per Cubic Meter to Pounds per Cubic Foot (kg/m³ to lb/ft³)",
    metaDescription: "Convert metric density (kg/m³) to imperial density (lb/ft³) by dividing by 16.0185.",
    formulaDescription: "1 kg/m³ equals approximately 0.06242796 lb/ft³. Divide kg/m³ by 16.01846.",
    exampleInput: 1000,
  },
  {
    slug: "grams-per-cubic-centimeter-to-pounds-per-cubic-foot",
    aliases: ["g-per-cm3-to-lb-per-ft3"],
    fromUnitId: "g_per_cm3",
    toUnitId: "lb_per_ft3",
    categoryId: "density",
    title: "Grams per Cubic Centimeter to Pounds per Cubic Foot (g/cm³ to lb/ft³)",
    metaDescription: "Convert g/cm³ to lb/ft³ with exact 62.428 multiplier.",
    formulaDescription: "1 g/cm³ equals approximately 62.42796 lb/ft³. Multiply g/cm³ by 62.428.",
    exampleInput: 1,
  },

  // --- ADDITIONAL TORQUE ---
  {
    slug: "lb-in-to-nm",
    fromUnitId: "lb_in",
    toUnitId: "nm",
    categoryId: "torque",
    title: "Pound-inches to Newton-meters Converter (in-lbs to N·m)",
    metaDescription: "Convert inch-pounds (in-lbs / lb·in) to Newton-meters (N·m) for torque wrenches and scope rings.",
    formulaDescription: "1 pound-inch equals approximately 0.1129848 Newton-meters. Multiply in-lbs by 0.112985 (or divide by 8.85075).",
    exampleInput: 40,
  },
  {
    slug: "lb-ft-to-lb-in",
    fromUnitId: "lb_ft",
    toUnitId: "lb_in",
    categoryId: "torque",
    title: "Foot-pounds to Inch-pounds Torque Converter (ft-lbs to in-lbs)",
    metaDescription: "Convert foot-pounds of torque to inch-pounds (ft-lbs to in-lbs) with exact 12 multiplier.",
    formulaDescription: "1 pound-foot equals 12 pound-inches. Multiply ft-lbs by 12.",
    exampleInput: 10,
  },
  {
    slug: "lb-in-to-lb-ft",
    fromUnitId: "lb_in",
    toUnitId: "lb_ft",
    categoryId: "torque",
    title: "Inch-pounds to Foot-pounds Torque Converter (in-lbs to ft-lbs)",
    metaDescription: "Convert inch-pounds to foot-pounds of torque (in-lbs to ft-lbs). Divide inch-pounds by 12.",
    formulaDescription: "Divide inch-pounds by 12 to convert to foot-pounds.",
    exampleInput: 120,
  },
  {
    slug: "newton-meters-to-kilogram-force-meters",
    aliases: ["nm-to-kgf-m"],
    fromUnitId: "nm",
    toUnitId: "kgf_m",
    categoryId: "torque",
    title: "Newton-meters to Kilogram-force Meters Converter (N·m to kgf·m)",
    metaDescription: "Convert Newton-meters to kgf·m by dividing by 9.80665.",
    formulaDescription: "Divide Newton-meters by 9.80665 to obtain kgf·m.",
    exampleInput: 100,
  },

  // --- ADDITIONAL FREQUENCY ---
  {
    slug: "mhz-to-hz",
    fromUnitId: "megahertz",
    toUnitId: "hertz",
    categoryId: "frequency",
    title: "Megahertz to Hertz Converter (MHz to Hz)",
    metaDescription: "Convert Megahertz to Hertz (MHz to Hz). Multiply MHz by 1,000,000.",
    formulaDescription: "1 Megahertz equals 1,000,000 Hertz. Multiply MHz by 1,000,000.",
    exampleInput: 100,
  },
  {
    slug: "hz-to-mhz",
    fromUnitId: "hertz",
    toUnitId: "megahertz",
    categoryId: "frequency",
    title: "Hertz to Megahertz Converter (Hz to MHz)",
    metaDescription: "Convert Hertz to Megahertz (Hz to MHz). Divide Hz by 1,000,000.",
    formulaDescription: "Divide Hertz by 1,000,000 to convert to Megahertz.",
    exampleInput: 1000000,
  },
  {
    slug: "khz-to-hz",
    fromUnitId: "kilohertz",
    toUnitId: "hertz",
    categoryId: "frequency",
    title: "Kilohertz to Hertz Converter (kHz to Hz)",
    metaDescription: "Convert Kilohertz to Hertz (kHz to Hz). Multiply kHz by 1,000.",
    formulaDescription: "1 Kilohertz equals 1,000 Hertz. Multiply kHz by 1,000.",
    exampleInput: 20,
  },
  {
    slug: "ghz-to-hz",
    fromUnitId: "gigahertz",
    toUnitId: "hertz",
    categoryId: "frequency",
    title: "Gigahertz to Hertz Converter (GHz to Hz)",
    metaDescription: "Convert Gigahertz to Hertz (GHz to Hz). Multiply GHz by 1,000,000,000 (10⁹).",
    formulaDescription: "1 Gigahertz equals 10⁹ Hertz. Multiply GHz by 1,000,000,000.",
    exampleInput: 2.4,
  },
  {
    slug: "ghz-to-mhz",
    fromUnitId: "gigahertz",
    toUnitId: "megahertz",
    categoryId: "frequency",
    title: "Gigahertz to Megahertz Converter (GHz to MHz)",
    metaDescription: "Convert Gigahertz to Megahertz (GHz to MHz) for CPU clock speeds and wireless spectrum. Multiply by 1,000.",
    formulaDescription: "1 Gigahertz equals 1,000 Megahertz. Multiply GHz by 1,000.",
    exampleInput: 3.6,
  },

  // --- ADDITIONAL ANGLE ---
  {
    slug: "radian-to-revolution",
    fromUnitId: "radian",
    toUnitId: "revolution",
    categoryId: "angle",
    title: "Radians to Revolutions Converter (rad to rev)",
    metaDescription: "Convert radians to full revolutions (turns) by dividing by 2π (approx. 6.283185).",
    formulaDescription: "1 full revolution is 2π radians. Divide radians by 2π.",
    exampleInput: 6.283185,
  },
  {
    slug: "mil-to-degree",
    fromUnitId: "mil_angle",
    toUnitId: "degree",
    categoryId: "angle",
    title: "Angular Mils (NATO) to Degrees Converter (mil to °)",
    metaDescription: "Convert NATO artillery angular mils to degrees using 6,400 mils = 360°.",
    formulaDescription: "1 NATO angular mil equals 360 / 6,400 = 0.05625 degrees. Multiply mils by 0.05625.",
    exampleInput: 1600,
  },

  // --- FLOW RATE (8) ---
  {
    slug: "liters-per-minute-to-us-gallons-per-minute",
    aliases: ["liter-minute-to-gallon-us-minute"],
    fromUnitId: "liter_per_min",
    toUnitId: "gallon_us_per_min",
    categoryId: "flow",
    title: "Liters per Minute to US GPM Converter (L/min to GPM)",
    metaDescription: "Convert Liters per Minute (L/min or LPM) to US Gallons per Minute (GPM) for pumps, plumbing, and irrigation.",
    formulaDescription: "1 US Gallon equals 3.785411784 Liters. Divide L/min by 3.78541 (or multiply by 0.264172) to get GPM.",
    exampleInput: 20,
  },
  {
    slug: "us-gallons-per-minute-to-liters-per-minute",
    aliases: ["gallon-us-minute-to-liter-minute"],
    fromUnitId: "gallon_us_per_min",
    toUnitId: "liter_per_min",
    categoryId: "flow",
    title: "US GPM to Liters per Minute Converter (GPM to L/min)",
    metaDescription: "Convert US Gallons per Minute (GPM) to Liters per Minute (L/min) with exact 3.78541 multiplier.",
    formulaDescription: "Multiply US GPM by 3.785411784 to calculate Liters per Minute (L/min).",
    exampleInput: 10,
  },
  {
    slug: "cubic-feet-per-hour-to-liters-per-minute",
    aliases: ["cubic-foot-hour-to-liter-minute"],
    fromUnitId: "cubic_foot_per_hour",
    toUnitId: "liter_per_min",
    categoryId: "flow",
    title: "Cubic Feet per Hour to Liters per Minute Converter (CFH / SCFH to L/min)",
    metaDescription: "Convert CFH (or SCFH) gas flow rate to Liters per Minute (L/min) for welding shielding gas and flowmeters.",
    formulaDescription: "1 ft³/h equals approximately 0.4719474 L/min. Multiply CFH by 0.47195.",
    exampleInput: 25,
  },
  {
    slug: "liters-per-hour-to-us-gallons-per-hour",
    aliases: ["liter-hour-to-gallon-us-hour"],
    fromUnitId: "liter_per_hour",
    toUnitId: "gallon_us_per_hour",
    categoryId: "flow",
    title: "Liters per Hour to US GPH Converter (L/h to GPH)",
    metaDescription: "Convert Liters per Hour (L/h) to US Gallons per Hour (GPH) for aquarium filters, drip irrigation, and fuel burn.",
    formulaDescription: "Divide Liters per Hour by 3.78541 to obtain US Gallons per Hour (GPH).",
    exampleInput: 1000,
  },
  {
    slug: "us-gallons-per-minute-to-cubic-meters-per-second",
    aliases: ["gallon-us-minute-to-cubic-meter-second"],
    fromUnitId: "gallon_us_per_min",
    toUnitId: "cubic_meter_per_sec",
    categoryId: "flow",
    title: "US GPM to Cubic Meters per Second Converter (GPM to m³/s)",
    metaDescription: "Convert US Gallons per Minute (GPM) to SI Cubic Meters per Second (m³/s) for civil hydraulic engineering.",
    formulaDescription: "1 US GPM equals approximately 0.0000630902 m³/s. Multiply GPM by 6.309e-5.",
    exampleInput: 500,
  },
  {
    slug: "cfm-to-liters-per-minute",
    aliases: ["cfm-to-liter-minute"],
    fromUnitId: "cubic_foot_per_min",
    toUnitId: "liter_per_min",
    categoryId: "flow",
    title: "CFM to Liters per Minute Converter (ft³/min to L/min)",
    metaDescription: "Convert Cubic Feet per Minute (CFM) to Liters per Minute (L/min) for air compressors and HVAC ventilation.",
    formulaDescription: "1 CFM equals approximately 28.316847 Liters per Minute. Multiply CFM by 28.3168.",
    exampleInput: 5,
  },
  {
    slug: "cfm-to-cubic-meters-per-hour",
    aliases: ["cfm-to-cubic-meter-hour"],
    fromUnitId: "cubic_foot_per_min",
    toUnitId: "cubic_meter_per_hour",
    categoryId: "flow",
    title: "CFM to Cubic Meters per Hour Converter (CFM to m³/h)",
    metaDescription: "Convert HVAC airflow from CFM to m³/h with exact 1.69901 multiplier.",
    formulaDescription: "1 CFM equals approximately 1.6990108 m³/h. Multiply CFM by 1.699.",
    exampleInput: 100,
  },
  {
    slug: "gpm-to-cubic-meters-per-hour",
    aliases: ["gpm-to-cubic-meter-hour"],
    fromUnitId: "gallon_us_per_min",
    toUnitId: "cubic_meter_per_hour",
    categoryId: "flow",
    title: "US GPM to Cubic Meters per Hour Converter (GPM to m³/h)",
    metaDescription: "Convert pump flow from US GPM to Cubic Meters per Hour (m³/h) by multiplying by 0.227125.",
    formulaDescription: "1 US GPM equals approximately 0.2271247 m³/h. Multiply GPM by 0.227125.",
    exampleInput: 50,
  },

  // --- ELECTRIC CURRENT (4) ---
  {
    slug: "milliamps-to-amps",
    fromUnitId: "milliampere",
    toUnitId: "ampere",
    categoryId: "current",
    title: "Milliamps to Amps Converter (mA to A)",
    metaDescription: "Convert milliamperes to amperes (mA to A) for electronics, power supplies, and circuit breakers. Divide mA by 1,000.",
    formulaDescription: "1 Ampere equals 1,000 milliamperes. Divide mA by 1,000 to convert to Amps.",
    exampleInput: 500,
  },
  {
    slug: "amps-to-milliamps",
    fromUnitId: "ampere",
    toUnitId: "milliampere",
    categoryId: "current",
    title: "Amps to Milliamps Converter (A to mA)",
    metaDescription: "Convert amperes to milliamperes (A to mA) with exact 1,000 multiplier.",
    formulaDescription: "Multiply Amperes by 1,000 to calculate milliamperes (mA).",
    exampleInput: 2.5,
  },
  {
    slug: "microamps-to-milliamps",
    fromUnitId: "microampere",
    toUnitId: "milliampere",
    categoryId: "current",
    title: "Microamps to Milliamps Converter (µA to mA)",
    metaDescription: "Convert microamperes to milliamperes (µA to mA) for low-power IoT sensor sleep currents. Divide by 1,000.",
    formulaDescription: "1 milliampere equals 1,000 microamperes. Divide µA by 1,000.",
    exampleInput: 250,
  },
  {
    slug: "kiloamps-to-amps",
    fromUnitId: "kiloampere",
    toUnitId: "ampere",
    categoryId: "current",
    title: "Kiloamps to Amps Converter (kA to A)",
    metaDescription: "Convert kiloamperes to amperes (kA to A) for industrial switchgear fault ratings. Multiply by 1,000.",
    formulaDescription: "1 kiloampere equals 1,000 Amperes. Multiply kA by 1,000.",
    exampleInput: 10,
  },

  // --- CAPACITANCE (5) ---
  {
    slug: "microfarad-to-farad",
    fromUnitId: "microfarad",
    toUnitId: "farad",
    categoryId: "capacitance",
    title: "Microfarads to Farads Converter (µF to F)",
    metaDescription: "Convert microfarads (µF / uF) to Farads (F) for capacitor calculations and RC time constants. Divide by 1,000,000.",
    formulaDescription: "1 Farad equals 1,000,000 microfarads (10⁶ µF). Divide µF by 1,000,000.",
    exampleInput: 470,
  },
  {
    slug: "picofarad-to-farad",
    fromUnitId: "picofarad",
    toUnitId: "farad",
    categoryId: "capacitance",
    title: "Picofarads to Farads Converter (pF to F)",
    metaDescription: "Convert picofarads to Farads (pF to F) for RF circuit design. Divide by 10¹².",
    formulaDescription: "1 Farad equals 10¹² picofarads. Multiply pF by 10⁻¹².",
    exampleInput: 100,
  },
  {
    slug: "picofarad-to-microfarad",
    fromUnitId: "picofarad",
    toUnitId: "microfarad",
    categoryId: "capacitance",
    title: "Picofarads to Microfarads Converter (pF to µF)",
    metaDescription: "Convert picofarads to microfarads (pF to µF / uF) for ceramic and electrolytic capacitor codes. Divide by 1,000,000.",
    formulaDescription: "1 microfarad equals 1,000,000 picofarads (1,000 nF). Divide pF by 1,000,000.",
    exampleInput: 10000,
  },
  {
    slug: "nanofarad-to-microfarad",
    fromUnitId: "nanofarad",
    toUnitId: "microfarad",
    categoryId: "capacitance",
    title: "Nanofarads to Microfarads Converter (nF to µF)",
    metaDescription: "Convert nanofarads to microfarads (nF to µF) for electronics schematics. Divide nF by 1,000.",
    formulaDescription: "1 microfarad equals 1,000 nanofarads. Divide nF by 1,000.",
    exampleInput: 100,
  },
  {
    slug: "microfarad-to-nanofarad",
    fromUnitId: "microfarad",
    toUnitId: "nanofarad",
    categoryId: "capacitance",
    title: "Microfarads to Nanofarads Converter (µF to nF)",
    metaDescription: "Convert microfarads to nanofarads (µF to nF). Multiply µF by 1,000.",
    formulaDescription: "Multiply microfarads by 1,000 to calculate nanofarads (nF).",
    exampleInput: 0.1,
  },

  // --- ELECTRIC CHARGE (5) ---
  {
    slug: "microcoulomb-to-coulomb",
    fromUnitId: "microcoulomb",
    toUnitId: "coulomb",
    categoryId: "charge",
    title: "Microcoulombs to Coulombs Converter (µC to C)",
    metaDescription: "Convert microcoulombs to Coulombs (µC to C) for electrostatics and physics problems. Divide by 1,000,000.",
    formulaDescription: "1 Coulomb equals 1,000,000 microcoulombs. Divide µC by 1,000,000.",
    exampleInput: 50,
  },
  {
    slug: "nanocoulomb-to-coulomb",
    fromUnitId: "nanocoulomb",
    toUnitId: "coulomb",
    categoryId: "charge",
    title: "Nanocoulombs to Coulombs Converter (nC to C)",
    metaDescription: "Convert nanocoulombs to Coulombs (nC to C) for Coulomb's Law electrostatics. Multiply by 10⁻⁹.",
    formulaDescription: "1 Coulomb equals 1,000,000,000 nanocoulombs (10⁹ nC). Divide nC by 10⁹.",
    exampleInput: 100,
  },
  {
    slug: "mah-to-ah",
    fromUnitId: "milliampere_hour",
    toUnitId: "ampere_hour",
    categoryId: "charge",
    title: "mAh to Ah Converter (Milliampere-hours to Ampere-hours)",
    metaDescription: "Convert battery capacity from mAh to Ah for power banks, lithium-ion cells, and solar batteries. Divide mAh by 1,000.",
    formulaDescription: "1 Ampere-hour (Ah) equals 1,000 milliampere-hours (mAh). Divide mAh by 1,000.",
    exampleInput: 5000,
  },
  {
    slug: "ah-to-mah",
    fromUnitId: "ampere_hour",
    toUnitId: "milliampere_hour",
    categoryId: "charge",
    title: "Ah to mAh Converter (Ampere-hours to Milliampere-hours)",
    metaDescription: "Convert battery Ampere-hours (Ah) to milliampere-hours (mAh). Multiply Ah by 1,000.",
    formulaDescription: "Multiply Ampere-hours (Ah) by 1,000 to obtain milliampere-hours (mAh).",
    exampleInput: 20,
  },
  {
    slug: "mah-to-coulombs",
    fromUnitId: "milliampere_hour",
    toUnitId: "coulomb",
    categoryId: "charge",
    title: "mAh to Coulombs Converter (Milliampere-hours to C)",
    metaDescription: "Convert battery mAh capacity to electric charge in Coulombs (C). Multiply mAh by 3.6.",
    formulaDescription: "1 mAh (0.001 A × 3,600 s) equals exactly 3.6 Coulombs. Multiply mAh by 3.6.",
    exampleInput: 3000,
  },

  // --- ELECTRICAL RESISTANCE (4) ---
  {
    slug: "megohm-to-ohm",
    fromUnitId: "megohm",
    toUnitId: "ohm",
    categoryId: "resistance",
    title: "Megohms to Ohms Converter (MΩ to Ω)",
    metaDescription: "Convert Megohms to Ohms (MΩ to Ω) for insulation testing and resistor values. Multiply by 1,000,000.",
    formulaDescription: "1 Megohm equals 1,000,000 Ohms. Multiply MΩ by 1,000,000.",
    exampleInput: 2.2,
  },
  {
    slug: "ohm-to-megohm",
    fromUnitId: "ohm",
    toUnitId: "megohm",
    categoryId: "resistance",
    title: "Ohms to Megohms Converter (Ω to MΩ)",
    metaDescription: "Convert Ohms to Megohms (Ω to MΩ). Divide Ohms by 1,000,000.",
    formulaDescription: "Divide Ohms by 1,000,000 to convert to Megohms.",
    exampleInput: 1000000,
  },
  {
    slug: "kiloohm-to-ohm",
    fromUnitId: "kiloohm",
    toUnitId: "ohm",
    categoryId: "resistance",
    title: "Kiloohms to Ohms Converter (kΩ to Ω)",
    metaDescription: "Convert kiloohms to Ohms (kΩ to Ω) for electronic circuit design. Multiply by 1,000.",
    formulaDescription: "1 kiloohm equals 1,000 Ohms. Multiply kΩ by 1,000.",
    exampleInput: 4.7,
  },
  {
    slug: "ohm-to-kiloohm",
    fromUnitId: "ohm",
    toUnitId: "kiloohm",
    categoryId: "resistance",
    title: "Ohms to Kiloohms Converter (Ω to kΩ)",
    metaDescription: "Convert Ohms to kiloohms (Ω to kΩ). Divide Ohms by 1,000.",
    formulaDescription: "Divide Ohms by 1,000 to calculate kiloohms (kΩ).",
    exampleInput: 4700,
  },

  // --- INDUCTANCE (4) ---
  {
    slug: "millihenry-to-henry",
    fromUnitId: "millihenry",
    toUnitId: "henry",
    categoryId: "inductance",
    title: "Millihenries to Henries Converter (mH to H)",
    metaDescription: "Convert millihenries to Henries (mH to H) for audio crossovers and power inductors. Divide by 1,000.",
    formulaDescription: "1 Henry equals 1,000 millihenries. Divide mH by 1,000.",
    exampleInput: 100,
  },
  {
    slug: "henry-to-millihenry",
    fromUnitId: "henry",
    toUnitId: "millihenry",
    categoryId: "inductance",
    title: "Henries to Millihenries Converter (H to mH)",
    metaDescription: "Convert Henries to millihenries (H to mH). Multiply Henries by 1,000.",
    formulaDescription: "Multiply Henries by 1,000 to obtain millihenries (mH).",
    exampleInput: 0.5,
  },
  {
    slug: "microhenry-to-millihenry",
    fromUnitId: "microhenry",
    toUnitId: "millihenry",
    categoryId: "inductance",
    title: "Microhenries to Millihenries Converter (µH to mH)",
    metaDescription: "Convert microhenries to millihenries (µH to mH) for RF chokes and buck converters. Divide by 1,000.",
    formulaDescription: "1 millihenry equals 1,000 microhenries. Divide µH by 1,000.",
    exampleInput: 470,
  },
  {
    slug: "microhenry-to-henry",
    fromUnitId: "microhenry",
    toUnitId: "henry",
    categoryId: "inductance",
    title: "Microhenries to Henries Converter (µH to H)",
    metaDescription: "Convert microhenries to Henries (µH to H). Divide µH by 1,000,000.",
    formulaDescription: "1 Henry equals 1,000,000 microhenries. Divide µH by 1,000,000.",
    exampleInput: 1000,
  },

  // --- MAGNETIC FLUX DENSITY (4) ---
  {
    slug: "gauss-to-tesla",
    fromUnitId: "gauss",
    toUnitId: "tesla",
    categoryId: "magnetic",
    title: "Gauss to Tesla Converter (G to T)",
    metaDescription: "Convert magnetic flux density from Gauss to Tesla (G to T) using the exact 10,000 Gauss per Tesla ratio.",
    formulaDescription: "1 Tesla equals 10,000 Gauss. Divide Gauss by 10,000 (or multiply by 0.0001) to obtain Tesla.",
    exampleInput: 5000,
  },
  {
    slug: "tesla-to-gauss",
    fromUnitId: "tesla",
    toUnitId: "gauss",
    categoryId: "magnetic",
    title: "Tesla to Gauss Converter (T to G)",
    metaDescription: "Convert magnetic field strength from Tesla to Gauss (T to G) for MRI magnets and neodymium magnets. Multiply by 10,000.",
    formulaDescription: "1 Tesla equals 10,000 Gauss. Multiply Tesla by 10,000.",
    exampleInput: 1.5,
  },
  {
    slug: "millitesla-to-gauss",
    fromUnitId: "millitesla",
    toUnitId: "gauss",
    categoryId: "magnetic",
    title: "Millitesla to Gauss Converter (mT to G)",
    metaDescription: "Convert millitesla to Gauss (mT to G). Multiply millitesla by 10.",
    formulaDescription: "1 millitesla equals 10 Gauss. Multiply mT by 10.",
    exampleInput: 50,
  },
  {
    slug: "gauss-to-millitesla",
    fromUnitId: "gauss",
    toUnitId: "millitesla",
    categoryId: "magnetic",
    title: "Gauss to Millitesla Converter (G to mT)",
    metaDescription: "Convert Gauss to millitesla (G to mT). Divide Gauss by 10.",
    formulaDescription: "Divide Gauss by 10 to convert to millitesla (mT).",
    exampleInput: 100,
  },

  // --- REGIONAL & INDUSTRY STANDARD PAIRS (BATCH 3 MISSING-BUILD) ---
  {
    slug: "troy-ounces-to-grams",
    fromUnitId: "troy_ounce",
    toUnitId: "gram",
    categoryId: "mass",
    title: "Troy Ounces to Grams Converter (oz t to g Precious Metals)",
    metaDescription: "Convert precious metal Troy ounces (oz t) to grams (g) for gold, silver, and platinum bullion using the exact 31.1034768 g standard.",
    formulaDescription: "1 Troy ounce (480 grains) is legally defined as exactly 31.1034768 grams—about 9.7% heavier than a regular 28.3495 g avoirdupois kitchen ounce. Multiply Troy ounces by 31.1034768.",
    exampleInput: 1,
    benchmarks: [
      { value: 1, convertedValue: "31.1035 g", label: "1 oz Gold / Silver Bullion Coin", description: "American Eagle / Maple Leaf / Krugerrand fine weight" },
      { value: 10, convertedValue: "311.035 g", label: "10 oz Silver Bullion Bar", description: "Standard investment silver bar" },
      { value: 100, convertedValue: "3,110.35 g (3.11 kg)", label: "100 oz COMEX Silver Bar", description: "Institutional bullion bar" },
    ],
  },
  {
    slug: "grams-to-troy-ounces",
    fromUnitId: "gram",
    toUnitId: "troy_ounce",
    categoryId: "mass",
    title: "Grams to Troy Ounces Converter (g to oz t Bullion & Jewelry)",
    metaDescription: "Convert grams to Troy ounces (g to oz t) for gold bars, jewelry, and precious metals. Divide grams by 31.1034768.",
    formulaDescription: "1 Troy ounce equals 31.1034768 grams. Divide grams by 31.1034768 (or multiply by 0.03215075) to obtain Troy ounces.",
    exampleInput: 100,
    benchmarks: [
      { value: 31.1035, convertedValue: "1 oz t", label: "1 Troy Ounce standard", description: "Exact 480-grain precious metal ounce" },
      { value: 100, convertedValue: "3.2151 oz t", label: "100 g Gold Minted Bar", description: "Standard metric bullion bar" },
      { value: 1000, convertedValue: "32.1507 oz t", label: "1 Kilogram Gold Bar", description: "32.1507 Troy ounces per kg" },
    ],
  },
  {
    slug: "imperial-gallons-to-liters",
    fromUnitId: "imperial_gallon",
    toUnitId: "liter",
    categoryId: "volume",
    title: "UK Imperial Gallons to Liters Converter (gal UK to L)",
    metaDescription: "Convert British Imperial gallons to liters (gal UK to L) using the exact 4.54609 liters per Imperial gallon definition.",
    formulaDescription: "1 UK Imperial gallon is defined by the Weights and Measures Act as exactly 4.54609 liters (approx. 20% larger than a 3.78541 L US liquid gallon). Multiply Imperial gallons by 4.54609.",
    exampleInput: 10,
    benchmarks: [
      { value: 1, convertedValue: "4.54609 L", label: "1 UK Imperial Gallon", description: "160 Imperial fluid ounces (8 UK pints)" },
      { value: 10, convertedValue: "45.4609 L", label: "10 Imperial Gallons", description: "Approx. 12.01 US liquid gallons" },
    ],
  },
  {
    slug: "liters-to-imperial-gallons",
    fromUnitId: "liter",
    toUnitId: "imperial_gallon",
    categoryId: "volume",
    title: "Liters to UK Imperial Gallons Converter (L to gal UK)",
    metaDescription: "Convert liters to UK Imperial gallons (L to gal UK) for British, Canadian, and Commonwealth fuel and liquid capacities. Divide by 4.54609.",
    formulaDescription: "Divide liters by 4.54609 (or multiply by 0.2199692) to convert to British Imperial gallons.",
    exampleInput: 50,
  },
  {
    slug: "metric-cups-to-ml",
    fromUnitId: "metric_cup",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "Metric Cups to Milliliters Converter (250 mL Cup to mL)",
    metaDescription: "Convert international Metric Cups (250 mL standard used in UK, Australia, NZ, and Canada) to milliliters.",
    formulaDescription: "1 international Metric Cup equals exactly 250 milliliters (1/4 of a liter), compared to 236.588 mL for a US Customary cup. Multiply Metric Cups by 250.",
    exampleInput: 2,
  },
  {
    slug: "us-cups-to-metric-cups",
    fromUnitId: "us_cup",
    toUnitId: "metric_cup",
    categoryId: "volume",
    title: "US Cups to Metric Cups Converter (236.6 mL vs 250 mL)",
    metaDescription: "Convert between US Customary Cups (236.59 mL) and international Metric Cups (250 mL) for cross-border baking recipes.",
    formulaDescription: "1 US Customary cup (236.588 mL) equals approximately 0.946353 Metric Cups (250 mL). Multiply US cups by 0.946353.",
    exampleInput: 2,
  },
  {
    slug: "us-survey-feet-to-meters",
    fromUnitId: "foot_us_survey",
    toUnitId: "meter",
    categoryId: "length",
    title: "US Survey Feet to Meters Converter (Geodetic ft to m)",
    metaDescription: "Convert US Survey Feet (1200/3937 m) to meters for land surveying, GIS state plane coordinates, and geodetic engineering.",
    formulaDescription: "1 US Survey Foot is defined as exactly 1200 / 3937 meters (approx. 0.3048006096 m), differing from the International Foot (0.3048 m) by 2 parts per million.",
    exampleInput: 10000,
  },
  {
    slug: "meters-to-us-survey-feet",
    fromUnitId: "meter",
    toUnitId: "foot_us_survey",
    categoryId: "length",
    title: "Meters to US Survey Feet Converter (m to Geodetic ft)",
    metaDescription: "Convert meters to US Survey Feet using the exact 3937 / 1200 geodetic ratio for GIS and boundary surveys.",
    formulaDescription: "Multiply meters by 3937 / 1200 (approx. 3.280833333) to obtain US Survey Feet.",
    exampleInput: 1000,
  },
  {
    slug: "ps-to-hp",
    fromUnitId: "horsepower_metric",
    toUnitId: "horsepower_mechanical",
    categoryId: "power",
    title: "Metric Horsepower (PS / CV) to Mechanical Horsepower (hp) Converter",
    metaDescription: "Convert European/Asian automotive Metric Horsepower (PS / CV) to US/UK Mechanical Horsepower (hp / bhp) with exact 0.98632 factor.",
    formulaDescription: "1 Metric Horsepower (PS = 735.49875 W) equals approximately 0.98632007 Mechanical Horsepower (hp = 745.69987 W). Multiply PS by 0.98632.",
    exampleInput: 300,
    benchmarks: [
      { value: 150, convertedValue: "147.948 hp", label: "150 PS compact turbo engine", description: "≈ 148 mechanical bhp" },
      { value: 300, convertedValue: "295.896 hp", label: "300 PS sports sedan", description: "≈ 296 mechanical bhp" },
      { value: 500, convertedValue: "493.16 hp", label: "500 PS supercar rating", description: "≈ 493 mechanical bhp" },
    ],
  },
  {
    slug: "hp-to-ps",
    fromUnitId: "horsepower_mechanical",
    toUnitId: "horsepower_metric",
    categoryId: "power",
    title: "Mechanical Horsepower (hp) to Metric Horsepower (PS / CV) Converter",
    metaDescription: "Convert US/UK mechanical horsepower (hp / bhp) to DIN metric horsepower (PS / CV) by multiplying by 1.01387.",
    formulaDescription: "1 Mechanical Horsepower (745.7 W) equals approximately 1.0138697 Metric Horsepower (PS). Multiply hp by 1.01387.",
    exampleInput: 200,
  },
  {
    slug: "ps-to-kw",
    fromUnitId: "horsepower_metric",
    toUnitId: "kilowatt",
    categoryId: "power",
    title: "Metric Horsepower (PS) to Kilowatts Converter (PS to kW)",
    metaDescription: "Convert automotive Metric Horsepower (PS / CV) to Kilowatts (kW) using the exact 0.73549875 kW per PS factor.",
    formulaDescription: "1 Metric Horsepower (75 kgf·m/s) equals 0.73549875 Kilowatts. Multiply PS by 0.7355 (or divide by 1.35962).",
    exampleInput: 150,
  },
  {
    slug: "kw-to-ps",
    fromUnitId: "kilowatt",
    toUnitId: "horsepower_metric",
    categoryId: "power",
    title: "Kilowatts to Metric Horsepower Converter (kW to PS / CV)",
    metaDescription: "Convert Kilowatts (kW) to Metric Horsepower (PS / CV) for EV and European vehicle specifications. Multiply kW by 1.35962.",
    formulaDescription: "1 Kilowatt equals approximately 1.3596216 Metric Horsepower (PS). Multiply kW by 1.35962.",
    exampleInput: 100,
  },
  {
    slug: "inhg-to-hpa",
    fromUnitId: "inch_mercury",
    toUnitId: "hectopascal",
    categoryId: "pressure",
    title: "Inches of Mercury to Hectopascals / Millibars Converter (inHg to hPa)",
    metaDescription: "Convert aviation altimeter and weather barometer readings from Inches of Mercury (inHg) to Hectopascals (hPa / mbar). Multiply by 33.8639.",
    formulaDescription: "1 inch of mercury (inHg at 0 °C) equals approximately 33.86389 hectopascals (or millibars). Multiply inHg by 33.86389.",
    exampleInput: 29.92,
    benchmarks: [
      { value: 29.92, convertedValue: "1,013.21 hPa", label: "Standard aviation altimeter setting (29.92 inHg)", description: "ISA standard sea-level atmosphere (1013.25 hPa)" },
      { value: 30.2, convertedValue: "1,022.69 hPa", label: "High-pressure fair weather system", description: "Clear skies barometric reading" },
    ],
  },
  {
    slug: "hpa-to-inhg",
    fromUnitId: "hectopascal",
    toUnitId: "inch_mercury",
    categoryId: "pressure",
    title: "Hectopascals / Millibars to Inches of Mercury Converter (hPa to inHg)",
    metaDescription: "Convert ICAO QNH altimeter pressure from hectopascals (hPa / millibars) to US inches of mercury (inHg). Divide by 33.8639.",
    formulaDescription: "Divide hectopascals (hPa) by 33.86389 (or multiply by 0.02953) to obtain inches of mercury (inHg).",
    exampleInput: 1013.25,
  },
  {
    slug: "gallons-imperial-to-gallons-us",
    fromUnitId: "imperial_gallon",
    toUnitId: "us_gallon",
    categoryId: "volume",
    title: "UK Imperial Gallons to US Liquid Gallons Converter (gal UK to gal US)",
    metaDescription: "Convert British Imperial gallons (4.54609 L) to US liquid gallons (3.78541 L) using the exact 1.2009499 ratio.",
    formulaDescription: "1 UK Imperial gallon (4.54609 L) equals approximately 1.2009499 US liquid gallons (3.78541 L). Multiply Imperial gallons by 1.20095.",
    exampleInput: 10,
  },
  {
    slug: "us-fluid-ounces-to-imperial-fluid-ounces",
    fromUnitId: "us_fluid_ounce",
    toUnitId: "imperial_fluid_ounce",
    categoryId: "volume",
    title: "US Fluid Ounces to UK Imperial Fluid Ounces Converter (fl oz US to UK)",
    metaDescription: "Convert US Customary fluid ounces (29.5735 mL) to British Imperial fluid ounces (28.4131 mL) for beverage and culinary measurements.",
    formulaDescription: "1 US fluid ounce (29.5735 mL) is approximately 4.084% larger than 1 UK Imperial fluid ounce (28.4131 mL). Multiply US fluid ounces by 1.0408427.",
    exampleInput: 16,
  },
  {
    slug: "imperial-fluid-ounces-to-us-fluid-ounces",
    fromUnitId: "imperial_fluid_ounce",
    toUnitId: "us_fluid_ounce",
    categoryId: "volume",
    title: "UK Imperial Fluid Ounces to US Fluid Ounces Converter (fl oz UK to US)",
    metaDescription: "Convert British Imperial fluid ounces (28.4131 mL) to US Customary fluid ounces (29.5735 mL). Multiply UK fl oz by 0.96076.",
    formulaDescription: "1 UK Imperial fluid ounce (28.4131 mL) equals approximately 0.9607599 US fluid ounces (29.5735 mL). Multiply UK fluid ounces by 0.96076.",
    exampleInput: 20,
  },
  {
    slug: "imperial-fluid-ounces-to-ml",
    fromUnitId: "imperial_fluid_ounce",
    toUnitId: "milliliter",
    categoryId: "volume",
    title: "UK Imperial Fluid Ounces to Milliliters Converter (fl oz UK to mL)",
    metaDescription: "Convert British Imperial fluid ounces (fl oz UK) to milliliters (mL) using the exact 28.4130625 mL per Imperial fluid ounce standard.",
    formulaDescription: "1 UK Imperial fluid ounce (1/160 of an Imperial gallon) equals 28.4130625 milliliters. Multiply UK fluid ounces by 28.4131.",
    exampleInput: 20,
  },
  {
    slug: "ml-to-imperial-fluid-ounces",
    fromUnitId: "milliliter",
    toUnitId: "imperial_fluid_ounce",
    categoryId: "volume",
    title: "Milliliters to UK Imperial Fluid Ounces Converter (mL to fl oz UK)",
    metaDescription: "Convert milliliters (mL) to British Imperial fluid ounces (fl oz UK) for UK and Commonwealth recipes. Divide mL by 28.4130625.",
    formulaDescription: "Divide milliliters by 28.4130625 (or multiply by 0.0351951) to obtain UK Imperial fluid ounces.",
    exampleInput: 500,
  },
  {
    slug: "ml-to-metric-cups",
    fromUnitId: "milliliter",
    toUnitId: "metric_cup",
    categoryId: "volume",
    title: "Milliliters to Metric Cups Converter (mL to 250 mL Cup)",
    metaDescription: "Convert milliliters (mL) to international Metric Cups (250 mL standard used in Australia, NZ, UK, and Canada). Divide mL by 250.",
    formulaDescription: "1 international Metric Cup is exactly 250 milliliters. Divide milliliters by 250 to convert to Metric Cups.",
    exampleInput: 500,
  },
  {
    slug: "metric-cups-to-us-cups",
    fromUnitId: "metric_cup",
    toUnitId: "us_cup",
    categoryId: "volume",
    title: "Metric Cups to US Cups Converter (250 mL vs 236.6 mL)",
    metaDescription: "Convert international 250 mL Metric Cups to 236.59 mL US Customary Cups for baking and cooking recipes.",
    formulaDescription: "1 Metric Cup (250 mL) equals approximately 1.056688 US Customary Cups (236.588 mL). Multiply Metric Cups by 1.05669.",
    exampleInput: 2,
  },
  {
    slug: "mpg-imperial-to-l-100km",
    fromUnitId: "mpg_imperial",
    toUnitId: "liters_per_100km",
    categoryId: "fuel_economy",
    title: "UK Imperial MPG to Liters per 100 km Converter (MPG UK to L/100km)",
    metaDescription: "Convert British Imperial Miles per Gallon (MPG UK) to Liters per 100 km (L/100km) using the exact 282.480936 reciprocal constant.",
    formulaDescription: "Divide 282.480936 by UK Imperial MPG to calculate fuel consumption in Liters per 100 kilometers (L/100km).",
    exampleInput: 50,
  },
  {
    slug: "l-100km-to-mpg-imperial",
    fromUnitId: "liters_per_100km",
    toUnitId: "mpg_imperial",
    categoryId: "fuel_economy",
    title: "Liters per 100 km to UK Imperial MPG Converter (L/100km to MPG UK)",
    metaDescription: "Convert fuel consumption from Liters per 100 km (L/100km) to British Imperial Miles per Gallon (MPG UK). Divide 282.480936 by L/100km.",
    formulaDescription: "Divide 282.480936 by L/100km to calculate fuel economy in UK Imperial Miles per Gallon (MPG UK).",
    exampleInput: 6,
  },
  {
    slug: "metric-tons-to-imperial-tons",
    fromUnitId: "metric_ton",
    toUnitId: "imperial_ton",
    categoryId: "mass",
    title: "Metric Tons (Tonnes) to UK Imperial Long Tons Converter",
    metaDescription: "Convert Metric Tons / Tonnes (1,000 kg) to British Imperial Long Tons (2,240 lbs) for maritime and commodity freight.",
    formulaDescription: "1 Metric Ton (1,000 kg) equals approximately 0.9842065 UK Imperial Long Tons (2,240 lbs). Multiply metric tons by 0.984207.",
    exampleInput: 10,
  },
  {
    slug: "imperial-tons-to-metric-tons",
    fromUnitId: "imperial_ton",
    toUnitId: "metric_ton",
    categoryId: "mass",
    title: "UK Imperial Long Tons to Metric Tons (Tonnes) Converter",
    metaDescription: "Convert British Imperial Long Tons (2,240 lbs) to Metric Tons / Tonnes (1,000 kg) by multiplying by 1.0160469.",
    formulaDescription: "1 UK Imperial Long Ton (2,240 lbs) equals 1.0160469088 Metric Tons (tonnes). Multiply Imperial Long Tons by 1.01605.",
    exampleInput: 10,
  },
  {
    slug: "rankine-to-celsius",
    fromUnitId: "rankine",
    toUnitId: "celsius",
    categoryId: "temperature",
    title: "Rankine to Celsius Converter (°R to °C Thermodynamic Scale)",
    metaDescription: "Convert absolute Rankine temperature (°R) to degrees Celsius (°C) using the exact (°R − 491.67) × 5/9 thermodynamic formula.",
    formulaDescription: "To convert Rankine (°R) to Celsius (°C), subtract 491.67 and multiply by 5/9: °C = (°R − 491.67) × 5/9.",
    exampleInput: 500,
  },
  {
    slug: "rankine-to-fahrenheit",
    fromUnitId: "rankine",
    toUnitId: "fahrenheit",
    categoryId: "temperature",
    title: "Rankine to Fahrenheit Converter (°R to °F Absolute Scale)",
    metaDescription: "Convert absolute Rankine temperature (°R) to degrees Fahrenheit (°F) by subtracting the 459.67 absolute zero offset.",
    formulaDescription: "To convert Rankine (°R) to Fahrenheit (°F), subtract 459.67: °F = °R − 459.67.",
    exampleInput: 500,
  },
  // --- ELECTRICAL BATTERY CAPACITY & ENERGY (Ah <-> kWh / Wh) ---
  {
    slug: "ah-to-kwh",
    aliases: [
      "amp-hours-to-kilowatt-hours",
      "ampere-hours-to-kilowatt-hours",
      "ah-to-kilowatt-hours",
    ],
    fromUnitId: "ampere_hour",
    toUnitId: "kilowatt_hour",
    categoryId: "charge",
    title: "Amp-Hours to Kilowatt-Hours (Ah to kWh) Conversion Calculator",
    h1: "Amp-Hours to Kilowatt-Hours Converter",
    intro: "Convert electric charge in amp-hours (Ah) to energy in kilowatt-hours (kWh) using battery system voltage.",
    metaDescription: "Convert amp-hours to kilowatt-hours (Ah to kWh) for 12V, 24V, 36V, and 48V solar and lithium battery systems using the formula kWh = (Ah × V) ÷ 1,000.",
    formulaDescription: "To convert amp-hours (Ah) to kilowatt-hours (kWh), multiply the charge in amp-hours by the voltage (V) and divide by 1,000: kWh = (Ah × V) ÷ 1,000. At a standard 12V battery rating, 100 Ah equals 1.2 kWh.",
    exampleInput: 100,
    commonValues: [10, 20, 50, 75, 100, 150, 200, 300, 400, 500],
  },
  {
    slug: "kwh-to-ah",
    aliases: [
      "kilowatt-hours-to-amp-hours",
      "kilowatt-hours-to-ampere-hours",
      "kwh-to-amp-hours",
    ],
    fromUnitId: "kilowatt_hour",
    toUnitId: "ampere_hour",
    categoryId: "energy",
    title: "Kilowatt-Hours to Amp-Hours (kWh to Ah) Conversion Calculator",
    h1: "Kilowatt-Hours to Amp-Hours Converter",
    intro: "Convert battery energy storage in kilowatt-hours (kWh) to amp-hours (Ah) across 12V, 24V, and 48V DC systems.",
    metaDescription: "Convert kilowatt-hours to amp-hours (kWh to Ah) for solar battery banks, EVs, and off-grid power using Ah = (kWh × 1,000) ÷ V.",
    formulaDescription: "To convert kilowatt-hours (kWh) to amp-hours (Ah), multiply the energy in kilowatt-hours by 1,000 and divide by system voltage (V): Ah = (kWh × 1,000) ÷ V.",
    exampleInput: 1.2,
    commonValues: [0.5, 1, 1.2, 2, 2.4, 5, 10, 13.5, 20, 50],
  },
  {
    slug: "ah-to-wh",
    aliases: ["amp-hours-to-watt-hours", "ampere-hours-to-watt-hours"],
    fromUnitId: "ampere_hour",
    toUnitId: "watt_hour",
    categoryId: "charge",
    title: "Amp-Hours to Watt-Hours (Ah to Wh) Conversion Calculator",
    h1: "Amp-Hours to Watt-Hours Converter",
    intro: "Convert battery capacity from amp-hours (Ah) to watt-hours (Wh) by multiplying by nominal voltage (V).",
    metaDescription: "Convert amp-hours to watt-hours (Ah to Wh) for deep-cycle, RV, marine, and solar batteries using Wh = Ah × V.",
    formulaDescription: "Multiply the battery capacity in amp-hours (Ah) by the battery voltage (V) to calculate energy in watt-hours: Wh = Ah × V.",
    exampleInput: 100,
  },
  {
    slug: "wh-to-ah",
    aliases: ["watt-hours-to-amp-hours", "watt-hours-to-ampere-hours"],
    fromUnitId: "watt_hour",
    toUnitId: "ampere_hour",
    categoryId: "energy",
    title: "Watt-Hours to Amp-Hours (Wh to Ah) Conversion Calculator",
    h1: "Watt-Hours to Amp-Hours Converter",
    intro: "Convert energy in watt-hours (Wh) to electric charge in amp-hours (Ah) using battery voltage.",
    metaDescription: "Convert watt-hours to amp-hours (Wh to Ah) instantly for portable power stations and lithium batteries using Ah = Wh ÷ V.",
    formulaDescription: "Divide the energy in watt-hours (Wh) by the nominal battery voltage (V) to get capacity in amp-hours: Ah = Wh ÷ V.",
    exampleInput: 1200,
  },
  {
    slug: "mah-to-wh",
    aliases: ["milliamp-hours-to-watt-hours", "milliampere-hours-to-watt-hours"],
    fromUnitId: "milliampere_hour",
    toUnitId: "watt_hour",
    categoryId: "charge",
    title: "Milliamp-Hours to Watt-Hours (mAh to Wh) Conversion Calculator",
    h1: "Milliamp-Hours to Watt-Hours Converter",
    intro: "Convert power bank and battery capacity from milliamp-hours (mAh) to watt-hours (Wh).",
    metaDescription: "Convert milliamp-hours to watt-hours (mAh to Wh) for airline carry-on power bank limits, laptops, and lithium cells using Wh = (mAh × V) ÷ 1,000.",
    formulaDescription: "Multiply milliamp-hours (mAh) by voltage (V) and divide by 1,000 to obtain watt-hours: Wh = (mAh × V) ÷ 1,000.",
    exampleInput: 10000,
  },
  // --- NUMBERS & QUANTITIES (South Asian Lakh/Crore & International Million/Billion/Trillion) ---
  {
    slug: "billions-to-lakhs",
    aliases: ["billion-to-lakh", "b-to-lakh"],
    fromUnitId: "billion",
    toUnitId: "lakh",
    categoryId: "numbers",
    title: "Billions to Lakhs Converter (B to lakh) – Number Magnitude Calculator",
    h1: "Billions to Lakhs Converter (B to lakh)",
    intro: "Convert international billions (10⁹) to South Asian lakhs (10⁵) instantly. Because 1 billion equals 1,000,000,000 and 1 lakh equals 100,000, 1 billion is exactly 10,000 lakhs.",
    metaDescription: "Convert billions to lakhs (B to lakh) instantly. 1 billion equals 10,000 lakhs (100 crores). Includes formula, worked financial examples, and conversion table.",
    formulaDescription: "1 billion (10⁹) equals 10,000 lakhs (10⁵). Multiply your value in billions by 10,000 to get lakhs.",
    exampleInput: 1,
  },
  {
    slug: "lakhs-to-billions",
    aliases: ["lakh-to-billion", "lakh-to-b"],
    fromUnitId: "lakh",
    toUnitId: "billion",
    categoryId: "numbers",
    title: "Lakhs to Billions Converter (lakh to B) – Number Magnitude Calculator",
    h1: "Lakhs to Billions Converter (lakh to B)",
    intro: "Convert South Asian lakhs (10⁵) to international billions (10⁹) instantly. Divide your value in lakhs by 10,000 (or multiply by 0.0001) to obtain billions.",
    metaDescription: "Convert lakhs to billions (lakh to B) instantly. 10,000 lakhs equal 1 billion. Includes step-by-step financial examples and reference chart.",
    formulaDescription: "1 lakh (100,000) equals 0.0001 billion. Divide your lakh figure by 10,000 to convert to billions.",
    exampleInput: 10000,
  },
  {
    slug: "millions-to-lakhs",
    aliases: ["million-to-lakh", "m-to-lakh"],
    fromUnitId: "million",
    toUnitId: "lakh",
    categoryId: "numbers",
    title: "Millions to Lakhs Converter (M to lakh) – Number Magnitude Calculator",
    h1: "Millions to Lakhs Converter (M to lakh)",
    intro: "Convert international millions (10⁶) to South Asian lakhs (10⁵) instantly. One million (1,000,000) equals exactly 10 lakhs (10 × 100,000).",
    metaDescription: "Convert millions to lakhs (M to lakh) instantly. 1 million equals exactly 10 lakhs. Includes formula, financial examples, and reference table.",
    formulaDescription: "1 million (1,000,000) equals 10 lakhs (100,000). Multiply millions by 10 to obtain lakhs.",
    exampleInput: 5,
  },
  {
    slug: "lakhs-to-millions",
    aliases: ["lakh-to-million", "lakh-to-m"],
    fromUnitId: "lakh",
    toUnitId: "million",
    categoryId: "numbers",
    title: "Lakhs to Millions Converter (lakh to M) – Number Magnitude Calculator",
    h1: "Lakhs to Millions Converter (lakh to M)",
    intro: "Convert South Asian lakhs (10⁵) to international millions (10⁶) instantly. Ten lakhs equal 1 million, so 1 lakh equals 0.1 million.",
    metaDescription: "Convert lakhs to millions (lakh to M) instantly. 10 lakhs equal 1 million (1 lakh = 0.1 million). Includes formula, examples, and conversion chart.",
    formulaDescription: "1 lakh (100,000) equals 0.1 million (1,000,000). Divide lakhs by 10 to obtain millions.",
    exampleInput: 50,
  },
  {
    slug: "crores-to-millions",
    aliases: ["crore-to-million", "cr-to-m"],
    fromUnitId: "crore",
    toUnitId: "million",
    categoryId: "numbers",
    title: "Crores to Millions Converter (cr to M) – Number Magnitude Calculator",
    h1: "Crores to Millions Converter (cr to M)",
    intro: "Convert South Asian crores (10⁷) to international millions (10⁶) instantly. One crore (10,000,000) equals exactly 10 million.",
    metaDescription: "Convert crores to millions (cr to M) instantly. 1 crore equals 10 million. Includes formula, corporate finance examples, and reference table.",
    formulaDescription: "1 crore (10,000,000) equals 10 million (1,000,000). Multiply crores by 10 to obtain millions.",
    exampleInput: 1,
  },
  {
    slug: "millions-to-crores",
    aliases: ["million-to-crore", "m-to-cr"],
    fromUnitId: "million",
    toUnitId: "crore",
    categoryId: "numbers",
    title: "Millions to Crores Converter (M to cr) – Number Magnitude Calculator",
    h1: "Millions to Crores Converter (M to cr)",
    intro: "Convert international millions (10⁶) to South Asian crores (10⁷) instantly. Ten million equals 1 crore, so 1 million equals 0.1 crore (10 lakhs).",
    metaDescription: "Convert millions to crores (M to cr) instantly. 10 million equals 1 crore (1 million = 0.1 crore). Includes formula, examples, and conversion chart.",
    formulaDescription: "1 million (1,000,000) equals 0.1 crore (10,000,000). Divide millions by 10 to obtain crores.",
    exampleInput: 10,
  },
  {
    slug: "billions-to-crores",
    aliases: ["billion-to-crore", "b-to-cr"],
    fromUnitId: "billion",
    toUnitId: "crore",
    categoryId: "numbers",
    title: "Billions to Crores Converter (B to cr) – Number Magnitude Calculator",
    h1: "Billions to Crores Converter (B to cr)",
    intro: "Convert international billions (10⁹) to South Asian crores (10⁷) instantly. One billion (1,000,000,000) equals exactly 100 crores.",
    metaDescription: "Convert billions to crores (B to cr) instantly. 1 billion equals 100 crores. Includes formula, GDP and valuation examples, and reference table.",
    formulaDescription: "1 billion (10⁹) equals 100 crores (10⁷). Multiply billions by 100 to obtain crores.",
    exampleInput: 1,
  },
  {
    slug: "crores-to-billions",
    aliases: ["crore-to-billion", "cr-to-b"],
    fromUnitId: "crore",
    toUnitId: "billion",
    categoryId: "numbers",
    title: "Crores to Billions Converter (cr to B) – Number Magnitude Calculator",
    h1: "Crores to Billions Converter (cr to B)",
    intro: "Convert South Asian crores (10⁷) to international billions (10⁹) instantly. One hundred crores equal 1 billion, so 1 crore equals 0.01 billion.",
    metaDescription: "Convert crores to billions (cr to B) instantly. 100 crores equal 1 billion (1 crore = 0.01 billion). Includes formula, examples, and conversion chart.",
    formulaDescription: "1 crore (10⁷) equals 0.01 billion (10⁹). Divide crores by 100 to obtain billions.",
    exampleInput: 100,
  },
  {
    slug: "lakhs-to-crores",
    aliases: ["lakh-to-crore", "lakh-to-cr"],
    fromUnitId: "lakh",
    toUnitId: "crore",
    categoryId: "numbers",
    title: "Lakhs to Crores Converter (lakh to cr) – Number Magnitude Calculator",
    h1: "Lakhs to Crores Converter (lakh to cr)",
    intro: "Convert lakhs (10⁵) to crores (10⁷) in the South Asian numbering system. One hundred lakhs equal 1 crore, so divide lakhs by 100 to get crores.",
    metaDescription: "Convert lakhs to crores (lakh to cr) instantly. 100 lakhs equal 1 crore (1 lakh = 0.01 crore). Includes formula, real estate examples, and chart.",
    formulaDescription: "1 crore equals 100 lakhs. Divide your value in lakhs by 100 to obtain crores.",
    exampleInput: 100,
  },
  {
    slug: "crores-to-lakhs",
    aliases: ["crore-to-lakh", "cr-to-lakh"],
    fromUnitId: "crore",
    toUnitId: "lakh",
    categoryId: "numbers",
    title: "Crores to Lakhs Converter (cr to lakh) – Number Magnitude Calculator",
    h1: "Crores to Lakhs Converter (cr to lakh)",
    intro: "Convert crores (10⁷) to lakhs (10⁵) in the South Asian numbering system. One crore equals 100 lakhs (10,000,000).",
    metaDescription: "Convert crores to lakhs (cr to lakh) instantly. 1 crore equals 100 lakhs. Includes formula, banking examples, and reference table.",
    formulaDescription: "1 crore (10,000,000) equals 100 lakhs (100,000). Multiply crores by 100 to obtain lakhs.",
    exampleInput: 1,
  },
  {
    slug: "millions-to-billions",
    aliases: ["million-to-billion", "m-to-b"],
    fromUnitId: "million",
    toUnitId: "billion",
    categoryId: "numbers",
    title: "Millions to Billions Converter (M to B) – Number Magnitude Calculator",
    h1: "Millions to Billions Converter (M to B)",
    intro: "Convert millions (10⁶) to billions (10⁹) in the international short-scale numbering system. One thousand million equals 1 billion.",
    metaDescription: "Convert millions to billions (M to B) instantly. 1,000 million equals 1 billion (1 million = 0.001 billion). Includes formula and chart.",
    formulaDescription: "1 billion equals 1,000 million. Divide millions by 1,000 to obtain billions.",
    exampleInput: 500,
  },
  {
    slug: "billions-to-millions",
    aliases: ["billion-to-million", "b-to-m"],
    fromUnitId: "billion",
    toUnitId: "million",
    categoryId: "numbers",
    title: "Billions to Millions Converter (B to M) – Number Magnitude Calculator",
    h1: "Billions to Millions Converter (B to M)",
    intro: "Convert billions (10⁹) to millions (10⁶) instantly. One billion equals 1,000 million in the standard international short-scale system.",
    metaDescription: "Convert billions to millions (B to M) instantly. 1 billion equals 1,000 million. Includes formula, financial examples, and conversion table.",
    formulaDescription: "1 billion (10⁹) equals 1,000 million (10⁶). Multiply billions by 1,000 to obtain millions.",
    exampleInput: 1.5,
  },
  {
    slug: "trillions-to-billions",
    aliases: ["trillion-to-billion", "t-to-b"],
    fromUnitId: "trillion",
    toUnitId: "billion",
    categoryId: "numbers",
    title: "Trillions to Billions Converter (T to B) – Number Magnitude Calculator",
    h1: "Trillions to Billions Converter (T to B)",
    intro: "Convert trillions (10¹²) to billions (10⁹) instantly. One trillion equals 1,000 billion in macroeconomic and fiscal reporting.",
    metaDescription: "Convert trillions to billions (T to B) instantly. 1 trillion equals 1,000 billion. Includes formula, GDP examples, and reference table.",
    formulaDescription: "1 trillion (10¹²) equals 1,000 billion (10⁹). Multiply trillions by 1,000 to obtain billions.",
    exampleInput: 1,
  },
  {
    slug: "billions-to-trillions",
    aliases: ["billion-to-trillion", "b-to-t"],
    fromUnitId: "billion",
    toUnitId: "trillion",
    categoryId: "numbers",
    title: "Billions to Trillions Converter (B to T) – Number Magnitude Calculator",
    h1: "Billions to Trillions Converter (B to T)",
    intro: "Convert billions (10⁹) to trillions (10¹²) instantly. One thousand billion equals 1 trillion, so divide billions by 1,000 to get trillions.",
    metaDescription: "Convert billions to trillions (B to T) instantly. 1,000 billion equals 1 trillion (1 billion = 0.001 trillion). Includes formula and chart.",
    formulaDescription: "1 trillion equals 1,000 billion. Divide billions by 1,000 to obtain trillions.",
    exampleInput: 500,
  },
  {
    slug: "trillions-to-crores",
    aliases: ["trillion-to-crore", "t-to-cr"],
    fromUnitId: "trillion",
    toUnitId: "crore",
    categoryId: "numbers",
    title: "Trillions to Crores Converter (T to cr) – Number Magnitude Calculator",
    h1: "Trillions to Crores Converter (T to cr)",
    intro: "Convert international trillions (10¹²) to South Asian crores (10⁷) instantly. One trillion equals 100,000 crores (1 lakh crores).",
    metaDescription: "Convert trillions to crores (T to cr) instantly. 1 trillion equals 100,000 crores (1 lakh crore). Includes formula, budget examples, and chart.",
    formulaDescription: "1 trillion (10¹²) equals 100,000 crores (10⁷). Multiply trillions by 100,000 to obtain crores.",
    exampleInput: 1,
  },
  {
    slug: "crores-to-trillions",
    aliases: ["crore-to-trillion", "cr-to-t"],
    fromUnitId: "crore",
    toUnitId: "trillion",
    categoryId: "numbers",
    title: "Crores to Trillions Converter (cr to T) – Number Magnitude Calculator",
    h1: "Crores to Trillions Converter (cr to T)",
    intro: "Convert South Asian crores (10⁷) to international trillions (10¹²) instantly. One lakh crores (100,000 crores) equal 1 trillion.",
    metaDescription: "Convert crores to trillions (cr to T) instantly. 100,000 crores equal 1 trillion. Includes formula, macroeconomic examples, and conversion chart.",
    formulaDescription: "1 crore (10⁷) equals 0.00001 trillion (10¹²). Divide crores by 100,000 to obtain trillions.",
    exampleInput: 100000,
  },
  {
    slug: "thousands-to-lakhs",
    aliases: ["thousand-to-lakh", "k-to-lakh"],
    fromUnitId: "thousand",
    toUnitId: "lakh",
    categoryId: "numbers",
    title: "Thousands to Lakhs Converter (K to lakh) – Number Magnitude Calculator",
    h1: "Thousands to Lakhs Converter (K to lakh)",
    intro: "Convert thousands (10³) to South Asian lakhs (10⁵) instantly. One hundred thousand equals 1 lakh, so divide thousands by 100 to get lakhs.",
    metaDescription: "Convert thousands to lakhs (K to lakh) instantly. 100 thousand equals 1 lakh (1 thousand = 0.01 lakh). Includes formula and chart.",
    formulaDescription: "1 lakh (100,000) equals 100 thousand. Divide thousands by 100 to obtain lakhs.",
    exampleInput: 100,
  },
  {
    slug: "lakhs-to-thousands",
    aliases: ["lakh-to-thousand", "lakh-to-k"],
    fromUnitId: "lakh",
    toUnitId: "thousand",
    categoryId: "numbers",
    title: "Lakhs to Thousands Converter (lakh to K) – Number Magnitude Calculator",
    h1: "Lakhs to Thousands Converter (lakh to K)",
    intro: "Convert South Asian lakhs (10⁵) to thousands (10³) instantly. One lakh (100,000) equals exactly 100 thousand.",
    metaDescription: "Convert lakhs to thousands (lakh to K) instantly. 1 lakh equals 100 thousand (100K). Includes formula, examples, and reference table.",
    formulaDescription: "1 lakh (100,000) equals 100 thousand (10³). Multiply lakhs by 100 to obtain thousands.",
    exampleInput: 1,
  },
  {
    slug: "millions-to-thousands",
    aliases: ["million-to-thousand", "m-to-k"],
    fromUnitId: "million",
    toUnitId: "thousand",
    categoryId: "numbers",
    title: "Millions to Thousands Converter (M to K) – Number Magnitude Calculator",
    h1: "Millions to Thousands Converter (M to K)",
    intro: "Convert millions (10⁶) to thousands (10³) instantly. One million equals 1,000 thousand (1,000K).",
    metaDescription: "Convert millions to thousands (M to K) instantly. 1 million equals 1,000 thousand. Includes formula, examples, and conversion chart.",
    formulaDescription: "1 million (1,000,000) equals 1,000 thousand (1,000). Multiply millions by 1,000 to obtain thousands.",
    exampleInput: 1,
  },
  {
    slug: "thousands-to-millions",
    aliases: ["thousand-to-million", "k-to-m"],
    fromUnitId: "thousand",
    toUnitId: "million",
    categoryId: "numbers",
    title: "Thousands to Millions Converter (K to M) – Number Magnitude Calculator",
    h1: "Thousands to Millions Converter (K to M)",
    intro: "Convert thousands (10³) to millions (10⁶) instantly. One thousand thousands (1,000K) equal 1 million.",
    metaDescription: "Convert thousands to millions (K to M) instantly. 1,000 thousand equals 1 million. Includes formula, examples, and reference table.",
    formulaDescription: "1 million equals 1,000 thousand. Divide thousands by 1,000 to obtain millions.",
    exampleInput: 500,
  },
  {
    slug: "dozens-to-gross",
    aliases: ["dozen-to-gross"],
    fromUnitId: "dozen",
    toUnitId: "gross",
    categoryId: "numbers",
    title: "Dozens to Gross Converter (doz to gr) – Counting Units Calculator",
    h1: "Dozens to Gross Converter (doz to gr)",
    intro: "Convert dozens (12 items) to gross (144 items) instantly for wholesale inventory and packaging. Twelve dozen equal 1 gross.",
    metaDescription: "Convert dozens to gross (doz to gr) instantly. 12 dozen equal 1 gross (144 units). Includes formula, wholesale examples, and table.",
    formulaDescription: "1 gross equals 12 dozen (144 items). Divide dozens by 12 to obtain gross.",
    exampleInput: 12,
  },
  {
    slug: "gross-to-dozens",
    aliases: ["gross-to-dozen"],
    fromUnitId: "gross",
    toUnitId: "dozen",
    categoryId: "numbers",
    title: "Gross to Dozens Converter (gr to doz) – Counting Units Calculator",
    h1: "Gross to Dozens Converter (gr to doz)",
    intro: "Convert gross (144 items) to dozens (12 items) instantly for wholesale and commercial inventory. One gross equals 12 dozen.",
    metaDescription: "Convert gross to dozens (gr to doz) instantly. 1 gross equals 12 dozen (144 units). Includes formula, examples, and conversion table.",
    formulaDescription: "1 gross (144 items) equals 12 dozen (12 items). Multiply gross by 12 to obtain dozens.",
    exampleInput: 1,
  },
];

function slugifyToken(str: string): string {
  return str
    .toLowerCase()
    .replace(/µ/g, "u")
    .replace(/°/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDefaultCommonValues(pair: ConversionPairInfo): number[] {
  if (pair.categoryId === "temperature") {
    return [-40, -20, -10, 0, 10, 15, 20, 25, 30, 35, 37, 40, 50, 72, 100, 180, 200, 212, 350, 400];
  }
  if (pair.categoryId === "fuel_economy") {
    return [5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60];
  }
  const ex = pair.exampleInput || 10;
  const baseSet = new Set<number>([
    1,
    2,
    5,
    10,
    15,
    20,
    25,
    30,
    50,
    75,
    100,
    ex,
    Number((ex * 0.5).toPrecision(4)),
    Number((ex * 2).toPrecision(4)),
    Number((ex * 5).toPrecision(4)),
  ]);
  return Array.from(baseSet)
    .filter((n) => n > 0 && isFinite(n))
    .sort((a, b) => a - b)
    .slice(0, 16);
}

/**
 * Determine regional or industry standard distinctions where relevant
 */
function getRegionalDistinctionNote(fromId: string, toId: string, categoryId: string): string | undefined {
  const ids = new Set([fromId, toId]);

  if (ids.has("troy_ounce") || ids.has("pennyweight")) {
    return "Precious Metals vs. Everyday Weight: A Troy ounce (ozt) equals 31.1034768 grams—about 9.7% heavier than a standard kitchen/postal avoirdupois ounce (28.349523125 g). Furthermore, 1 Troy pound contains 12 Troy ounces (373.24 g), whereas 1 standard pound contains 16 avoirdupois ounces (453.59 g).";
  }
  if (ids.has("ounce") && (ids.has("gram") || ids.has("milligram") || ids.has("kilogram"))) {
    return "Standard Avoirdupois vs. Troy Ounce: This calculator converts standard avoirdupois ounces (1 oz = 28.349523125 g) used for food, postal packages, and retail goods in the US and UK. If you are weighing gold, silver, or platinum bullion, use our Troy Ounces (1 ozt = 31.1034768 g) converter instead.";
  }
  if (
    ids.has("gallon_us") ||
    ids.has("gallon_imperial") ||
    ids.has("quart_us") ||
    ids.has("quart_imperial") ||
    ids.has("pint_us") ||
    ids.has("pint_imperial") ||
    ids.has("fl_oz_us") ||
    ids.has("fl_oz_imperial")
  ) {
    return "US Customary vs. UK Imperial Volume: US liquid units and UK Imperial units share the same names but have different volumes. 1 UK Imperial gallon equals 4.54609 liters (160 Imperial fl oz), which is 20.1% larger than 1 US liquid gallon at 3.785411784 liters (128 US fl oz). Meanwhile, 1 US fluid ounce (29.5735 mL) is slightly larger than 1 UK Imperial fluid ounce (28.4131 mL).";
  }
  if (ids.has("cup_us") || ids.has("metric_cup") || ids.has("tablespoon_us") || ids.has("teaspoon_us")) {
    return "US Customary vs. Metric Culinary Measures: A standard US legal measuring cup holds 236.588 mL (8 US fl oz), whereas a Commonwealth Metric cup used in Australia, New Zealand, Canada, and the UK holds 250 mL. A US tablespoon is 14.7868 mL (metric: 15 mL; Australian: 20 mL).";
  }
  if (ids.has("short_ton") || ids.has("long_ton") || ids.has("metric_ton")) {
    return "Three Distinct Definitions of 'Ton': In the United States, a standard 'ton' (Short Ton) is 2,000 lbs (907.18474 kg). In the United Kingdom, a 'ton' (Long Ton) is 2,240 lbs (1,016.0469 kg). Internationally, a Metric Ton (tonne, t) is 1,000 kg (2,204.6226 lbs).";
  }
  if (ids.has("us_survey_foot") || (ids.has("foot") && ids.has("meter")) || ids.has("acre")) {
    return "International Foot vs. US Survey Foot: Under the 1959 International Yard and Pound Agreement, 1 international foot is defined as 0.3048 meters. Legacy US land deeds and State Plane Coordinate Systems prior to 2023 used the US Survey Foot (1200/3937 m ≈ 0.3048006096 m), a difference of 2 parts per million (about 0.01 ft per mile).";
  }
  if (ids.has("metric_horsepower") || ids.has("horsepower")) {
    return "Mechanical (Imperial) Horsepower vs. Metric Horsepower (PS / cv): Mechanical horsepower (hp) used in North America and the UK equals 745.699872 watts (550 ft·lbf/s). European and Asian automakers often specify Metric horsepower (PS, DIN hp, or ch), defined as 735.49875 watts (75 kgf·m/s). 1 mechanical hp = 1.01387 PS.";
  }
  if (categoryId === "digital_storage" || categoryId === "data_rate") {
    return "Decimal SI (Base-10) vs. Binary IEC (Base-2) & Bits vs. Bytes: Networking speeds and storage drive manufacturers use SI decimal prefixes (1 kB = 1,000 bytes, 1 MB = 1,000,000 bytes, 1 GB = 10⁹ bytes), whereas operating systems and RAM often report binary IEC prefixes (1 KiB = 1,024 bytes, 1 MiB = 1,048,576 bytes, 1 GiB = 1,073,741,824 bytes). Also note that lowercase 'b' denotes bits while uppercase 'B' denotes Bytes (1 Byte = 8 bits).";
  }
  if (categoryId === "fuel_economy") {
    return "US vs. UK MPG and Inverse Consumption Scales: Miles per gallon (MPG) measures distance traveled per unit of fuel (higher is better), whereas Liters per 100 km (L/100km) measures fuel volume consumed over a fixed distance (lower is better). Because the UK Imperial gallon (4.54609 L) is ~20.1% larger than the US gallon (3.78541 L), US MPG uses the conversion constant 235.215 while UK MPG uses 282.481.";
  }
  return undefined;
}

/**
 * Enrich every conversion pair with:
 * - Unique HTML title and distinct H1 heading
 * - Concise plain-English introduction
 * - Verified formula source from lib/conversions/units.ts and lib/conversions/engine.ts
 * - Non-repetitive "How to convert" steps
 * - Regional/industry standard distinctions where relevant
 * - Competitor & synonym URL slug aliases (e.g., centimeter-to-inch, cm-to-in)
 * - Primary keyword & natural related keyword cluster
 * - Common numeric query values (e.g., "100 cm to in", "50 kg to lbs")
 * - Verified FAQs and everyday benchmarks
 */
function enrichConversionPair(pair: ConversionPairInfo, index: number): ConversionPairInfo {
  const fromUnit = UNIT_MAP.get(pair.fromUnitId);
  const toUnit = UNIT_MAP.get(pair.toUnitId);
  const category = CATEGORY_MAP.get(pair.categoryId);

  if (!fromUnit || !toUnit) {
    return pair;
  }

  const fromNameLower = fromUnit.name.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
  const toNameLower = toUnit.name.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
  const fromPluralLower = fromUnit.plural.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
  const toPluralLower = toUnit.plural.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
  const fromSymLower = fromUnit.symbol.toLowerCase();
  const toSymLower = toUnit.symbol.toLowerCase();

  // Primary keyword
  const primaryKeyword =
    pair.primaryKeyword || `${fromPluralLower} to ${toPluralLower}`;

  const fromPluralClean = fromUnit.plural.replace(/\s+\([^)]*\)/g, "").trim();
  const toPluralClean = toUnit.plural.replace(/\s+\([^)]*\)/g, "").trim();

  const dimensionNounMap: Record<string, string> = {
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
  const dimensionNoun = dimensionNounMap[pair.categoryId] || "measurement";

  // Clean H1 heading (e.g. "Inches to Nanometers Converter")
  const rawH1 = pair.h1 || `${fromPluralClean} to ${toPluralClean} Converter`;
  const h1 = rawH1 === pair.title ? `Convert ${fromPluralClean} to ${toPluralClean}` : rawH1;

  // Verified calculations for auto-benchmarks, worked examples, and FAQs
  const unitOneOut = convertUnits(1, pair.fromUnitId, pair.toUnitId, "auto");
  const exampleOut = convertUnits(pair.exampleInput, pair.fromUnitId, pair.toUnitId, "auto");
  const reverseOneOut = convertUnits(1, pair.toUnitId, pair.fromUnitId, "auto");

  // Concise 1-sentence actionable subheading (e.g. "Enter the length in inches below to convert it to nanometers.")
  const intro =
    pair.intro ||
    `Enter the ${dimensionNoun} in ${fromPluralLower} below to convert it to ${toPluralLower}.`;

  // Verified formula/factor source from the app's unit data (lib/conversions/units.ts & engine.ts)
  const baseUnit = category ? UNIT_MAP.get(category.baseUnitId) : undefined;
  let formulaSource = pair.formulaSource;
  if (!formulaSource) {
    if (pair.categoryId === "temperature") {
      formulaSource = `Affine thermodynamic temperature scale equation (${unitOneOut.formulaDisplay}) implemented in lib/conversions/engine.ts (convertTemperature) in accordance with BIPM SI Brochure (9th Ed.) Kelvin/Celsius definitions and NIST SP 811 Fahrenheit/Rankine standards.`;
    } else if (pair.categoryId === "fuel_economy") {
      formulaSource = `Nonlinear reciprocal fuel consumption transformation (${unitOneOut.formulaDisplay}) implemented in lib/conversions/engine.ts (convertFuelEconomy) derived from exact international mile (1,609.344 m), US gallon (3.785411784 L), and UK Imperial gallon (4.54609 L) definitions.`;
    } else {
      const fromBase = fromUnit.toBase ?? 1;
      const toBase = toUnit.toBase ?? 1;
      const baseSymbol = baseUnit ? baseUnit.symbol : "base unit";
      formulaSource = `Derived directly from lib/conversions/units.ts base-unit factors: 1 ${fromUnit.symbol} = ${fromBase} ${baseSymbol} and 1 ${toUnit.symbol} = ${toBase} ${baseSymbol}. Scale factor = ${fromBase} / ${toBase} = ${unitOneOut.formattedValue} ${toUnit.symbol} per ${fromUnit.symbol} (inverse: 1 ${toUnit.symbol} = ${reverseOneOut.formattedValue} ${fromUnit.symbol}).`;
    }
  }

  // Brief "How to convert" steps that explain the process without repeating the introduction
  const howToSteps =
    pair.howToSteps ||
    (pair.categoryId === "temperature"
      ? [
          `Start with your temperature reading in ${fromUnit.plural} (${fromUnit.symbol}) and apply the affine scale equation: ${unitOneOut.formulaDisplay}.`,
          `Because temperature scales have different zero points, apply both the scaling ratio and the zero-point offset in the exact order shown in the formula rather than multiplying by a single ratio.`,
          `Worked verification: converting ${pair.exampleInput} ${fromUnit.symbol} gives ${exampleOut.steps.map((s) => s.expression).join(" → ")}, resulting in ${exampleOut.formattedValue} ${toUnit.symbol}.`,
        ]
      : pair.categoryId === "fuel_economy"
      ? [
          `Identify your starting fuel efficiency reading in ${fromUnit.plural} (${fromUnit.symbol}) and apply the governing equation: ${unitOneOut.formulaDisplay}.`,
          `When converting between distance-per-volume (MPG, km/L) and volume-per-distance (L/100km), divide the constant by your input value because the relationship is inversely proportional.`,
          `Worked verification: for ${pair.exampleInput} ${fromUnit.symbol}, compute ${exampleOut.steps.map((s) => s.expression).join(" → ")} to obtain ${exampleOut.formattedValue} ${toUnit.symbol}.`,
        ]
      : [
          `Multiply your measurement in ${fromUnit.plural.toLowerCase()} (${fromUnit.symbol}) by the conversion factor ${unitOneOut.formattedValue} (since 1 ${fromUnit.symbol} = ${unitOneOut.formattedValue} ${toUnit.symbol}).`,
          `Formula with units: ${toUnit.symbol} = ${fromUnit.symbol} × ${unitOneOut.formattedValue}. To convert in reverse from ${toUnit.symbol} back to ${fromUnit.symbol}, multiply by ${reverseOneOut.formattedValue} (or divide by ${unitOneOut.formattedValue}).`,
          `Worked example: ${pair.exampleInput} ${fromUnit.symbol} × ${unitOneOut.formattedValue} = ${exampleOut.formattedValue} ${toUnit.symbol}.`,
        ]);

  const regionalNote =
    pair.regionalNote || getRegionalDistinctionNote(pair.fromUnitId, pair.toUnitId, pair.categoryId);

  const uniquenessNote =
    pair.uniquenessNote ||
    `Canonical page for the "${primaryKeyword}" search intent cluster. Consolidates singular/plural/symbol queries (${fromSymLower} to ${toSymLower}, ${fromNameLower} to ${toNameLower}) and high-frequency numeric queries (${(pair.commonValues || getDefaultCommonValues(pair)).slice(0, 5).map((v) => `${v} ${fromSymLower} to ${toSymLower}`).join(", ")}) into one interactive calculator with verified SI/NIST constants, step-by-step arithmetic, and domain benchmarks.`;

  // Related keyword variations covering singular, plural, symbols, formula, chart, calculator
  const relatedSet = new Set<string>(pair.relatedKeywords || []);
  relatedSet.add(`${fromSymLower} to ${toSymLower}`);
  relatedSet.add(`convert ${fromPluralLower} to ${toPluralLower}`);
  relatedSet.add(`convert ${fromSymLower} to ${toSymLower}`);
  relatedSet.add(`${fromNameLower} to ${toNameLower} converter`);
  relatedSet.add(`how many ${toPluralLower} in a ${fromNameLower}`);
  relatedSet.add(`${fromSymLower} to ${toSymLower} formula`);
  relatedSet.add(`${fromPluralLower} to ${toPluralLower} chart`);
  relatedSet.add(`${pair.exampleInput} ${fromSymLower} to ${toSymLower}`);

  // Competitor & natural URL slug aliases (e.g. unitconverters.net / inchcalculator.com singular/plural/symbol paths)
  const aliasSet = new Set<string>(pair.aliases || []);
  const candidateAliases = [
    `${slugifyToken(fromNameLower)}-to-${slugifyToken(toNameLower)}`,
    `${slugifyToken(fromPluralLower)}-to-${slugifyToken(toPluralLower)}`,
    `${slugifyToken(fromNameLower)}-to-${slugifyToken(toPluralLower)}`,
    `${slugifyToken(fromPluralLower)}-to-${slugifyToken(toNameLower)}`,
    `${slugifyToken(fromSymLower)}-to-${slugifyToken(toSymLower)}`,
    `convert-${pair.slug}`,
    `${pair.slug}-converter`,
    `${pair.slug}-calculator`,
  ];
  for (const a of candidateAliases) {
    if (a && a !== pair.slug && !a.startsWith("-to-") && !a.endsWith("-to-")) {
      aliasSet.add(a);
    }
  }

  const commonValues = pair.commonValues || getDefaultCommonValues(pair);

  const benchmarks =
    pair.benchmarks && pair.benchmarks.length > 0
      ? pair.benchmarks
      : [
          {
            value: 1,
            convertedValue: `${unitOneOut.formattedValue} ${toUnit.symbol}`,
            label: `Unit baseline (1 ${fromUnit.symbol})`,
            description: `Exact 1-unit reference ratio from ${fromUnit.name} to ${toUnit.name}`,
          },
          {
            value: pair.exampleInput,
            convertedValue: `${exampleOut.formattedValue} ${toUnit.symbol}`,
            label: `Worked reference (${pair.exampleInput} ${fromUnit.symbol})`,
            description: `Standard ${category ? category.name.toLowerCase() : pair.categoryId.replace("_", " ")} benchmark calculation`,
          },
          {
            value: Number((pair.exampleInput * 10).toPrecision(4)),
            convertedValue: `${convertUnits(Number((pair.exampleInput * 10).toPrecision(4)), pair.fromUnitId, pair.toUnitId, "auto").formattedValue} ${toUnit.symbol}`,
            label: `10× scale benchmark (${Number((pair.exampleInput * 10).toPrecision(4))} ${fromUnit.symbol})`,
            description: `Tenfold scaling reference in ${toUnit.plural.toLowerCase()}`,
          },
        ];

  const defaultFaqs = [
    {
      question: `How many ${toPluralLower} are in 1 ${fromNameLower}?`,
      answer:
        pair.categoryId === "temperature"
          ? `A temperature of 1 ${fromUnit.symbol} corresponds to ${unitOneOut.formattedValue} ${toUnit.symbol} (${unitOneOut.formulaDisplay}). Conversely, 1 ${toUnit.symbol} equals ${reverseOneOut.formattedValue} ${fromUnit.symbol}.`
          : `There are ${unitOneOut.formattedValue} ${toPluralLower} (${toUnit.symbol}) in 1 ${fromNameLower} (${fromUnit.symbol}). Conversely, 1 ${toNameLower} (${toUnit.symbol}) is equal to ${reverseOneOut.formattedValue} ${fromPluralLower} (${fromUnit.symbol}).`,
    },
    {
      question: `How do you convert ${fromPluralLower} to ${toPluralLower}?`,
      answer:
        pair.categoryId === "temperature" || pair.categoryId === "fuel_economy"
          ? `To convert ${fromPluralLower} (${fromUnit.symbol}) to ${toPluralLower} (${toUnit.symbol}), apply the conversion formula: ${unitOneOut.formulaDisplay}. For example, ${pair.exampleInput} ${fromUnit.symbol} converts to ${exampleOut.formattedValue} ${toUnit.symbol}.`
          : `To convert ${fromPluralLower} (${fromUnit.symbol}) to ${toPluralLower} (${toUnit.symbol}), multiply the ${dimensionNoun} in ${fromPluralLower} by ${unitOneOut.formattedValue} (${toPluralLower} = ${fromPluralLower} × ${unitOneOut.formattedValue}).`,
    },
    {
      question: `What is ${pair.exampleInput} ${fromPluralLower} in ${toPluralLower}?`,
      answer: `${pair.exampleInput} ${fromPluralLower} (${pair.exampleInput} ${fromUnit.symbol}) is equal to ${exampleOut.formattedValue} ${toPluralLower} (${exampleOut.formattedValue} ${toUnit.symbol}).`,
    },
    {
      question: `Which is larger, 1 ${fromUnit.name.toLowerCase()} (${fromUnit.symbol}) or 1 ${toUnit.name.toLowerCase()} (${toUnit.symbol})?`,
      answer:
        pair.categoryId === "temperature" || pair.categoryId === "fuel_economy"
          ? `At an input of 1 ${fromUnit.symbol}, the equivalent value is ${unitOneOut.formattedValue} ${toUnit.symbol}, whereas 1 ${toUnit.symbol} equals ${reverseOneOut.formattedValue} ${fromUnit.symbol}. Because ${pair.categoryId.replace("_", " ")} scales use offset or reciprocal relationships, always check the specific operating range in the conversion table above.`
          : (unitOneOut.directFactor ?? 1) >= 1
          ? `One ${fromUnit.name.toLowerCase()} (${fromUnit.symbol}) is larger than one ${toUnit.name.toLowerCase()} (${toUnit.symbol}). Specifically, 1 ${fromUnit.symbol} contains ${unitOneOut.formattedValue} ${toUnit.symbol}, whereas 1 ${toUnit.symbol} is ${reverseOneOut.formattedValue} ${fromUnit.symbol}.`
          : `One ${toUnit.name.toLowerCase()} (${toUnit.symbol}) is larger than one ${fromUnit.name.toLowerCase()} (${fromUnit.symbol}). Specifically, 1 ${toUnit.symbol} equals ${reverseOneOut.formattedValue} ${fromUnit.symbol}, while 1 ${fromUnit.symbol} is ${unitOneOut.formattedValue} ${toUnit.symbol}.`,
    },
    {
      question: `How do I convert back from ${toUnit.plural.toLowerCase()} (${toUnit.symbol}) to ${fromUnit.plural.toLowerCase()} (${fromUnit.symbol})?`,
      answer:
        pair.categoryId === "temperature" || pair.categoryId === "fuel_economy"
          ? `Use the Swap button in the calculator above to switch ${toUnit.symbol} and ${fromUnit.symbol} immediately. For reference, 1 ${toUnit.symbol} equals ${reverseOneOut.formattedValue} ${fromUnit.symbol}.`
          : `To reverse the calculation from ${toUnit.symbol} to ${fromUnit.symbol}, multiply your ${toUnit.name.toLowerCase()} value by the inverse factor ${reverseOneOut.formattedValue} (or divide by ${unitOneOut.formattedValue}). You can also click the Swap button in the tool above to flip directions in one click.`,
    },
    {
      question: regionalNote
        ? `Are there regional or standard differences when converting ${fromUnit.symbol} and ${toUnit.symbol}?`
        : `How many decimal places should I round ${fromUnit.symbol} to ${toUnit.symbol} results to?`,
      answer:
        regionalNote ||
        `For everyday comparisons and quick estimates, rounding to 2 decimal places is usually sufficient (for example, ${pair.exampleInput} ${fromUnit.symbol} ≈ ${convertUnits(pair.exampleInput, pair.fromUnitId, pair.toUnitId, "2").formattedValue} ${toUnit.symbol}). For engineering, laboratory, or machining specifications, select 4 or 6 decimals—or Scientific (10ⁿ) mode—in the calculator toolbar above.`,
    },
  ];

  const faqs = [...(pair.faqs || [])];
  for (const df of defaultFaqs) {
    if (faqs.length >= 6) break;
    if (!faqs.some((existing) => existing.question.toLowerCase() === df.question.toLowerCase())) {
      faqs.push(df);
    }
  }

  return {
    ...pair,
    h1,
    intro,
    formulaSource,
    howToSteps,
    regionalNote,
    uniquenessNote,
    primaryKeyword,
    relatedKeywords: Array.from(relatedSet),
    aliases: Array.from(aliasSet),
    commonValues,
    priorityTier: pair.priorityTier || (index < 60 ? "A" : index < 160 ? "B" : "C"),
    benchmarks,
    faqs,
  };
}

// Ensure every category in CATEGORIES (including all 49 extended engineering, heat, fluids, light, electricity, magnetism, radiology, and specialty categories)
// has canonical conversion pairs in RAW_CONVERSION_CATALOGUE and populated popularPairSlugs without running expensive unit math on boot.
const existingCategoryIdsInCatalogue = new Set(
  RAW_CONVERSION_CATALOGUE.map((p) => p.categoryId)
);
const existingSlugsInCatalogue = new Set(
  RAW_CONVERSION_CATALOGUE.map((p) => p.slug)
);

for (const cat of CATEGORIES) {
  if (!existingCategoryIdsInCatalogue.has(cat.id)) {
    const catUnits = getUnitsByCategory(cat.id);
    if (catUnits.length >= 2) {
      const baseU = UNIT_MAP.get(cat.baseUnitId) || catUnits[0];
      const peerUnits = catUnits.filter((u) => u.id !== baseU.id).slice(0, 3);
      const generatedSlugs: string[] = [];

      const makeCleanUnitSlug = (u: Unit) => {
        const cleaned = slugifyToken(
          u.plural.replace(/\s+\([^)]*\)/g, "").toLowerCase()
        );
        return cleaned || slugifyToken(u.id);
      };

      for (const peerU of peerUnits) {
        const pairsToCreate: [Unit, Unit][] = [
          [baseU, peerU],
          [peerU, baseU],
        ];
        for (const [fromU, toU] of pairsToCreate) {
          let pairSlug = `${makeCleanUnitSlug(fromU)}-to-${makeCleanUnitSlug(toU)}`;
          if (existingSlugsInCatalogue.has(pairSlug)) {
            pairSlug = `${slugifyToken(fromU.id)}-to-${slugifyToken(toU.id)}`;
          }
          if (!existingSlugsInCatalogue.has(pairSlug)) {
            existingSlugsInCatalogue.add(pairSlug);
            generatedSlugs.push(pairSlug);
            RAW_CONVERSION_CATALOGUE.push({
              slug: pairSlug,
              fromUnitId: fromU.id,
              toUnitId: toU.id,
              categoryId: cat.id,
              title: `${fromU.plural} to ${toU.plural} Converter (${fromU.symbol} to ${toU.symbol})`,
              h1: `${fromU.plural} to ${toU.plural} Converter`,
              metaDescription: `Convert ${fromU.plural.toLowerCase()} to ${toU.plural.toLowerCase()} (${fromU.symbol} to ${toU.symbol}) with live calculation, conversion table, and exact formula.`,
              formulaDescription: `Convert ${fromU.plural.toLowerCase()} (${fromU.symbol}) to ${toU.plural.toLowerCase()} (${toU.symbol}) using standardized SI and NIST conversion factors.`,
              exampleInput: 10,
            });
          }
        }
      }

      if (cat.popularPairSlugs.length === 0) {
        cat.popularPairSlugs.push(...generatedSlugs);
      }
    }
  }
}

function createLightweightPair(pair: ConversionPairInfo, index: number): ConversionPairInfo {
  const fromUnit = UNIT_MAP.get(pair.fromUnitId);
  const toUnit = UNIT_MAP.get(pair.toUnitId);
  if (!fromUnit || !toUnit) return pair;

  const fromPluralClean = fromUnit.plural.replace(/\s+\([^)]*\)/g, "").trim();
  const toPluralClean = toUnit.plural.replace(/\s+\([^)]*\)/g, "").trim();
  const h1 = pair.h1 || `${fromPluralClean} to ${toPluralClean} Converter`;
  const primaryKeyword =
    pair.primaryKeyword || `${fromPluralClean.toLowerCase()} to ${toPluralClean.toLowerCase()}`;

  return {
    ...pair,
    h1,
    primaryKeyword,
    priorityTier: pair.priorityTier || (index < 60 ? "A" : index < 160 ? "B" : "C"),
  };
}

export const CONVERSION_CATALOGUE: ConversionPairInfo[] = RAW_CONVERSION_CATALOGUE.map(
  (pair, index) => createLightweightPair(pair, index)
);

const ENRICHED_PAIR_CACHE = new Map<string, ConversionPairInfo>();
const PAIR_INDEX_MAP = new Map<string, number>();

// O(1) slug map supporting canonical slugs immediately and lazy alias resolution on miss
export const CATALOGUE_MAP = new Map<string, ConversionPairInfo>();
// Also index by `${fromUnitId}__${toUnitId}` for fast O(1) canonical lookup
const PAIR_BY_UNIT_IDS = new Map<string, ConversionPairInfo>();
const PAIRS_BY_CATEGORY_MAP = new Map<string, ConversionPairInfo[]>();

for (let i = 0; i < CONVERSION_CATALOGUE.length; i++) {
  const item = CONVERSION_CATALOGUE[i];
  PAIR_INDEX_MAP.set(item.slug, i);
  PAIR_BY_UNIT_IDS.set(`${item.fromUnitId}__${item.toUnitId}`, item);
  CATALOGUE_MAP.set(item.slug, item);

  const catList = PAIRS_BY_CATEGORY_MAP.get(item.categoryId);
  if (catList) {
    catList.push(item);
  } else {
    PAIRS_BY_CATEGORY_MAP.set(item.categoryId, [item]);
  }
}

export function ensureEnrichedPair(pair: ConversionPairInfo): ConversionPairInfo {
  const cached = ENRICHED_PAIR_CACHE.get(pair.slug);
  if (cached) return cached;
  const idx = PAIR_INDEX_MAP.get(pair.slug) ?? 200;
  const enriched = enrichConversionPair(pair, idx);
  ENRICHED_PAIR_CACHE.set(pair.slug, enriched);
  CATALOGUE_MAP.set(pair.slug, enriched);
  PAIR_BY_UNIT_IDS.set(`${pair.fromUnitId}__${pair.toUnitId}`, enriched);
  return enriched;
}

export function findDedicatedPair(
  fromUnitId: string,
  toUnitId: string
): ConversionPairInfo | undefined {
  return PAIR_BY_UNIT_IDS.get(`${fromUnitId}__${toUnitId}`);
}

let isAliasMapPopulated = false;
function ensureAliasSlugMap(): void {
  if (isAliasMapPopulated) return;
  isAliasMapPopulated = true;
  for (const item of CONVERSION_CATALOGUE) {
    const fromUnit = UNIT_MAP.get(item.fromUnitId);
    const toUnit = UNIT_MAP.get(item.toUnitId);
    if (!fromUnit || !toUnit) continue;
    const fromNameLower = fromUnit.name.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
    const toNameLower = toUnit.name.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
    const fromPluralLower = fromUnit.plural.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
    const toPluralLower = toUnit.plural.toLowerCase().replace(/\s+\([^)]*\)/g, "").trim();
    const fromSymLower = fromUnit.symbol.toLowerCase();
    const toSymLower = toUnit.symbol.toLowerCase();

    const candidateAliases = [
      ...(item.aliases || []),
      `${slugifyToken(fromNameLower)}-to-${slugifyToken(toNameLower)}`,
      `${slugifyToken(fromPluralLower)}-to-${slugifyToken(toPluralLower)}`,
      `${slugifyToken(fromNameLower)}-to-${slugifyToken(toPluralLower)}`,
      `${slugifyToken(fromPluralLower)}-to-${slugifyToken(toNameLower)}`,
      `${slugifyToken(fromSymLower)}-to-${slugifyToken(toSymLower)}`,
      `${slugifyToken(item.fromUnitId)}-to-${slugifyToken(item.toUnitId)}`,
      `convert-${item.slug}`,
      `${item.slug}-converter`,
      `${item.slug}-calculator`,
    ];
    for (const a of candidateAliases) {
      if (a && a !== item.slug && !a.startsWith("-to-") && !a.endsWith("-to-") && !CATALOGUE_MAP.has(a)) {
        CATALOGUE_MAP.set(a, item);
      }
    }
  }

  // Legacy corrupted slug aliases -> redirect to their clean canonical pairs
  const legacyUnitPairRedirects: Record<string, [string, string]> = {
    "watts-per-meter-kelvin-to-cal": ["w_per_mk", "cal_per_scmc"],
    "cal-to-watts-per-meter-kelvin": ["cal_per_scmc", "w_per_mk"],
    "w-to-btu": ["w_per_m2k", "btu_per_hft2f"],
    "btu-to-w": ["btu_per_hft2f", "w_per_m2k"],
    "w-to-w": ["w_per_m2k", "w_per_m2c"],
    "htc-w-cm2k-to-htc-w-m2k": ["w_per_m2c", "w_per_m2k"],
    "kg-to-kg": ["kg_per_sm2", "kg_per_hm2"],
    "mfd-kg-h-m2-to-mfd-kg-s-m2": ["kg_per_hm2", "kg_per_sm2"],
    "pascal-seconds-to-lb": ["pa_s", "lb_per_fts"],
    "lb-to-pascal-seconds": ["lb_per_fts", "pa_s"],
    "btu-to-kilojoules-per-kilogram-kelvin": ["btu_per_lbf", "kj_per_kgk"],
    "millipascals-to-dynes-cm": ["sound_mpa", "barye"],
  };
  for (const [legacySlug, [fId, tId]] of Object.entries(legacyUnitPairRedirects)) {
    const fU = UNIT_MAP.get(fId);
    const tU = UNIT_MAP.get(tId);
    const target = PAIR_BY_UNIT_IDS.get(`${fId}__${tId}`) || (fU && tU ? synthesizeDynamicPair(fU, tU) : undefined);
    if (target && !CATALOGUE_MAP.has(legacySlug)) {
      CATALOGUE_MAP.set(legacySlug, target);
    }
  }
}

/**
 * Clean human-friendly singular and plural display names for internal linking
 * (e.g. "tons", "long tons", "metric tons", "fluid ounces", "teaspoons", "tablespoons", "cups", "pints", "quarts", "gallons")
 */
const FRIENDLY_SINGULAR_OVERRIDES: Record<string, string> = {
  us_ton: "Ton",
  imperial_ton: "Long Ton",
  metric_ton: "Metric Ton",
  pound: "Pound",
  ounce: "Ounce",
  gram: "Gram",
  kilogram: "Kilogram",
  milligram: "Milligram",
  microgram: "Microgram",
  carat: "Carat",
  quarter_us: "US Quarter",
  quarter_uk: "UK Quarter",
  hundredweight_us: "Short Hundredweight",
  hundredweight_uk: "Long Hundredweight",
  us_teaspoon: "Teaspoon",
  imperial_teaspoon: "Imperial Teaspoon",
  metric_teaspoon: "Metric Teaspoon",
  us_tablespoon: "Tablespoon",
  imperial_tablespoon: "Imperial Tablespoon",
  metric_tablespoon: "Metric Tablespoon",
  us_fluid_ounce: "Fluid Ounce",
  imperial_fluid_ounce: "Imperial Fluid Ounce",
  us_cup: "Cup",
  imperial_cup: "Imperial Cup",
  metric_cup: "Metric Cup",
  us_pint: "Pint",
  imperial_pint: "Imperial Pint",
  pint_dry_us: "US Dry Pint",
  us_quart: "Quart",
  imperial_quart: "Imperial Quart",
  quart_dry_us: "US Dry Quart",
  us_gallon: "Gallon",
  imperial_gallon: "Imperial Gallon",
  gill_us: "US Gill",
  gill_uk: "Imperial Gill",
  barrel_oil: "Oil Barrel",
  barrel_us: "US Barrel",
  bushel_us: "US Bushel",
  milliliter: "Milliliter",
  liter: "Liter",
  mpg_us: "Miles per Gallon (US)",
  mpg_uk: "Miles per Gallon (UK)",
};

const FRIENDLY_PLURAL_OVERRIDES: Record<string, string> = {
  us_ton: "Tons",
  imperial_ton: "Long Tons",
  metric_ton: "Metric Tons",
  pound: "Pounds",
  ounce: "Ounces",
  gram: "Grams",
  kilogram: "Kilograms",
  milligram: "Milligrams",
  microgram: "Micrograms",
  carat: "Carats",
  quarter_us: "US Quarters",
  quarter_uk: "UK Quarters",
  hundredweight_us: "Short Hundredweights",
  hundredweight_uk: "Long Hundredweights",
  us_teaspoon: "Teaspoons",
  imperial_teaspoon: "Imperial Teaspoons",
  metric_teaspoon: "Metric Teaspoons",
  us_tablespoon: "Tablespoons",
  imperial_tablespoon: "Imperial Tablespoons",
  metric_tablespoon: "Metric Tablespoons",
  us_fluid_ounce: "Fluid Ounces",
  imperial_fluid_ounce: "Imperial Fluid Ounces",
  us_cup: "Cups",
  imperial_cup: "Imperial Cups",
  metric_cup: "Metric Cups",
  us_pint: "Pints",
  imperial_pint: "Imperial Pints",
  pint_dry_us: "US Dry Pints",
  us_quart: "Quarts",
  imperial_quart: "Imperial Quarts",
  quart_dry_us: "US Dry Quarts",
  us_gallon: "Gallons",
  imperial_gallon: "Imperial Gallons",
  gill_us: "US Gills",
  gill_uk: "Imperial Gills",
  barrel_oil: "Oil Barrels",
  barrel_us: "US Barrels",
  bushel_us: "US Bushels",
  milliliter: "Milliliters",
  liter: "Liters",
  mpg_us: "Miles per Gallon (US)",
  mpg_uk: "Miles per Gallon (UK)",
};

const PREFERRED_UNIT_SLUG_OVERRIDES: Record<string, string> = {
  sol_ppm: "ppm",
  sol_ppb: "ppb",
  sol_mg_per_l: "mg-per-liter",
  sol_ug_per_l: "ug-per-liter",
};

export function getFriendlyUnitSingular(unit: Unit): string {
  if (FRIENDLY_SINGULAR_OVERRIDES[unit.id]) {
    return FRIENDLY_SINGULAR_OVERRIDES[unit.id];
  }
  return unit.name.replace(/\s+\([^)]*\)/g, "").trim();
}

export function getFriendlyUnitPlural(unit: Unit): string {
  if (FRIENDLY_PLURAL_OVERRIDES[unit.id]) {
    return FRIENDLY_PLURAL_OVERRIDES[unit.id];
  }
  return unit.plural.replace(/\s+\([^)]*\)/g, "").trim();
}

export function getPreferredUnitSlug(unit: Unit): string {
  if (PREFERRED_UNIT_SLUG_OVERRIDES[unit.id]) {
    return PREFERRED_UNIT_SLUG_OVERRIDES[unit.id];
  }
  return slugifyToken(getFriendlyUnitPlural(unit).toLowerCase());
}

// Explicit high-priority token bindings so common terms never collide
const EXPLICIT_UNIT_TOKENS: Record<string, string> = {
  ton: "us_ton",
  tons: "us_ton",
  "short-ton": "us_ton",
  "short-tons": "us_ton",
  "long-ton": "imperial_ton",
  "long-tons": "imperial_ton",
  "metric-ton": "metric_ton",
  "metric-tons": "metric_ton",
  tonne: "metric_ton",
  tonnes: "metric_ton",
  pound: "pound",
  pounds: "pound",
  lb: "pound",
  lbs: "pound",
  ounce: "ounce",
  ounces: "ounce",
  oz: "ounce",
  gram: "gram",
  grams: "gram",
  g: "gram",
  kilogram: "kilogram",
  kilograms: "kilogram",
  kg: "kilogram",
  milligram: "milligram",
  milligrams: "milligram",
  mg: "milligram",
  microgram: "microgram",
  micrograms: "microgram",
  ug: "microgram",
  mcg: "microgram",
  carat: "carat",
  carats: "carat",
  teaspoon: "us_teaspoon",
  teaspoons: "us_teaspoon",
  tsp: "us_teaspoon",
  tablespoon: "us_tablespoon",
  tablespoons: "us_tablespoon",
  tbsp: "us_tablespoon",
  "fluid-ounce": "us_fluid_ounce",
  "fluid-ounces": "us_fluid_ounce",
  "fl-oz": "us_fluid_ounce",
  cup: "us_cup",
  cups: "us_cup",
  pint: "us_pint",
  pints: "us_pint",
  quart: "us_quart",
  quarts: "us_quart",
  gallon: "us_gallon",
  gallons: "us_gallon",
  milliliter: "milliliter",
  milliliters: "milliliter",
  ml: "milliliter",
  liter: "liter",
  liters: "liter",
  l: "liter",
  inch: "inch",
  inches: "inch",
  in: "inch",
  foot: "foot",
  feet: "foot",
  ft: "foot",
  yard: "yard",
  yards: "yard",
  yd: "yard",
  mile: "mile",
  miles: "mile",
  mi: "mile",
  centimeter: "centimeter",
  centimeters: "centimeter",
  cm: "centimeter",
  millimeter: "millimeter",
  millimeters: "millimeter",
  mm: "millimeter",
  meter: "meter",
  meters: "meter",
  m: "meter",
  kilometer: "kilometer",
  kilometers: "kilometer",
  km: "kilometer",
  micrometer: "micrometer",
  micrometers: "micrometer",
  nanometer: "nanometer",
  nanometers: "nanometer",
  nm: "nanometer",
};

// Lazily build token -> Unit lookup for dynamic pair resolution only when needed
let lazyUnitSlugTokenMap: Map<string, Unit> | null = null;
function getUnitSlugTokenMap(): Map<string, Unit> {
  if (lazyUnitSlugTokenMap) return lazyUnitSlugTokenMap;
  const map = new Map<string, Unit>();
  for (const u of UNITS) {
    const tokens = [
      u.id,
      slugifyToken(u.id),
      slugifyToken(u.name.replace(/\s+\([^)]*\)/g, "")),
      slugifyToken(u.plural.replace(/\s+\([^)]*\)/g, "")),
      slugifyToken(getFriendlyUnitSingular(u)),
      slugifyToken(getFriendlyUnitPlural(u)),
      slugifyToken(u.symbol),
      ...(u.aliases || []).map((a) => slugifyToken(a)),
    ];
    for (const t of tokens) {
      if (t && !map.has(t)) {
        map.set(t, u);
      }
    }
  }
  for (const [tok, unitId] of Object.entries(EXPLICIT_UNIT_TOKENS)) {
    const unitObj = UNIT_MAP.get(unitId);
    if (unitObj) {
      map.set(tok, unitObj);
    }
  }
  lazyUnitSlugTokenMap = map;
  return map;
}

export function getCanonicalPairSlug(fromUnit: Unit, toUnit: Unit): string {
  const existing = PAIR_BY_UNIT_IDS.get(`${fromUnit.id}__${toUnit.id}`);
  if (existing) return existing.slug;
  return `${getPreferredUnitSlug(fromUnit)}-to-${getPreferredUnitSlug(toUnit)}`;
}

function synthesizeDynamicPair(
  fromUnit: Unit,
  toUnit: Unit,
  categoryIdOverride?: string
): ConversionPairInfo {
  const existing = PAIR_BY_UNIT_IDS.get(`${fromUnit.id}__${toUnit.id}`);
  if (existing) return ensureEnrichedPair(existing);

  const canonicalSlug = `${getPreferredUnitSlug(fromUnit)}-to-${getPreferredUnitSlug(toUnit)}`;
  const fromPlural = getFriendlyUnitPlural(fromUnit);
  const toPlural = getFriendlyUnitPlural(toUnit);
  const oneOut = convertUnits(1, fromUnit.id, toUnit.id, "auto");
  const isMassVol =
    (fromUnit.categoryId === "mass" && toUnit.categoryId === "volume") ||
    (fromUnit.categoryId === "volume" && toUnit.categoryId === "mass");
  const resolvedCategoryId = categoryIdOverride || fromUnit.categoryId;

  const rawPair: ConversionPairInfo = {
    slug: canonicalSlug,
    fromUnitId: fromUnit.id,
    toUnitId: toUnit.id,
    categoryId: resolvedCategoryId,
    title: `${fromPlural} to ${toPlural} Converter (${fromUnit.symbol} to ${toUnit.symbol})`,
    h1: `${fromPlural} to ${toPlural} Converter`,
    metaDescription: isMassVol
      ? `Convert ${fromPlural.toLowerCase()} to ${toPlural.toLowerCase()} (${fromUnit.symbol} to ${toUnit.symbol}) with an interactive substance & density selector. Assuming Water (1 g/mL), 1 ${fromUnit.symbol} = ${oneOut.formattedValue} ${toUnit.symbol}.`
      : `Convert ${fromPlural.toLowerCase()} to ${toPlural.toLowerCase()} (${fromUnit.symbol} to ${toUnit.symbol}) instantly with conversion table, exact formula (1 ${fromUnit.symbol} = ${oneOut.formattedValue} ${toUnit.symbol}), and step-by-step guide.`,
    formulaDescription: isMassVol
      ? `Mass-to-volume conversion depends on substance density ρ (m = ρ × V). Assuming Pure Water (ρ = 1.000 g/mL), 1 ${fromUnit.symbol} = ${oneOut.formattedValue} ${toUnit.symbol}.`
      : `To convert ${fromPlural.toLowerCase()} to ${toPlural.toLowerCase()}, multiply your ${fromUnit.name.toLowerCase()} figure by ${oneOut.formattedValue}.`,
    exampleInput: 5,
  };

  const enriched = enrichConversionPair(rawPair, 200);
  ENRICHED_PAIR_CACHE.set(canonicalSlug, enriched);
  CATALOGUE_MAP.set(canonicalSlug, enriched);
  PAIR_BY_UNIT_IDS.set(`${fromUnit.id}__${toUnit.id}`, enriched);
  return enriched;
}

export function getConversionPair(
  slug: string,
  categoryIdHint?: string
): ConversionPairInfo | undefined {
  const clean = decodeURIComponent(slug)
    .trim()
    .toLowerCase()
    .replace(/\.html?$/i, "");

  // Category-specific legacy collision overrides (e.g. /heat-transfer-coefficient/w-to-kw vs /power/watts-to-kw)
  if (categoryIdHint === "heat_transfer_coefficient") {
    if (clean === "w-to-kw") {
      const fU = UNIT_MAP.get("w_per_m2k");
      const tU = UNIT_MAP.get("kw_per_m2k");
      if (fU && tU) return synthesizeDynamicPair(fU, tU);
    }
    if (clean === "kw-to-w") {
      const fU = UNIT_MAP.get("kw_per_m2k");
      const tU = UNIT_MAP.get("w_per_m2k");
      if (fU && tU) return synthesizeDynamicPair(fU, tU);
    }
    if (clean === "w-to-w") {
      const fU = UNIT_MAP.get("w_per_m2k");
      const tU = UNIT_MAP.get("w_per_m2c");
      if (fU && tU) return synthesizeDynamicPair(fU, tU);
    }
  }

  const direct = CATALOGUE_MAP.get(clean);
  if (direct) return ensureEnrichedPair(direct);

  // Lazy-populate alias slugs on first miss
  ensureAliasSlugMap();
  const aliasMatch = CATALOGUE_MAP.get(clean);
  if (aliasMatch) return ensureEnrichedPair(aliasMatch);

  // Also resolve numeric-prefixed query variations (e.g. "100-cm-to-inches", "50-kg-to-lbs", "25.4-mm-to-in")
  const strippedNumeric = clean.replace(/^(\d+(?:[._-]\d+)?)-+/, "");
  if (strippedNumeric !== clean) {
    const numMatch = CATALOGUE_MAP.get(strippedNumeric);
    if (numMatch) return ensureEnrichedPair(numMatch);
  }

  // Dynamic resolution for any "[unitA]-to-[unitB]" slug across all categories & culinary mass/volume units
  const targetSlug = strippedNumeric !== clean ? strippedNumeric : clean;
  const normalizedTarget = targetSlug
    .replace(/^convert-/, "")
    .replace(/-(?:converter|calculator)$/, "");

  const toIdx = normalizedTarget.indexOf("-to-");
  if (toIdx > 0) {
    const leftToken = normalizedTarget.slice(0, toIdx);
    const rightToken = normalizedTarget.slice(toIdx + 4);

    let fromUnit: Unit | undefined;
    let toUnit: Unit | undefined;

    // If categoryIdHint is provided from URL /[category]/[slug].htm, match units within that category first
    if (categoryIdHint) {
      const catUnits = getUnitsByCategory(categoryIdHint);
      const catLegacyTokens: Record<string, string> = {
        btu: "btu_per_lbf",
        "dynes-cm": "barye",
        "dyn-cm": "barye",
      };
      for (const u of catUnits) {
        const uTokens = [
          u.id.toLowerCase(),
          slugifyToken(u.id),
          slugifyToken(u.name.replace(/\s+\([^)]*\)/g, "")),
          slugifyToken(u.plural.replace(/\s+\([^)]*\)/g, "")),
          slugifyToken(getFriendlyUnitSingular(u)),
          slugifyToken(getFriendlyUnitPlural(u)),
          slugifyToken(u.symbol),
          ...(u.aliases || []).map((a) => slugifyToken(a)),
        ];
        if (!fromUnit && (uTokens.includes(leftToken) || catLegacyTokens[leftToken] === u.id)) {
          fromUnit = u;
        }
        if (!toUnit && (uTokens.includes(rightToken) || catLegacyTokens[rightToken] === u.id)) {
          toUnit = u;
        }
      }
    }

    const tokenMap = getUnitSlugTokenMap();
    if (!fromUnit) fromUnit = tokenMap.get(leftToken);
    if (!toUnit) toUnit = tokenMap.get(rightToken);

    if (fromUnit && toUnit && fromUnit.id !== toUnit.id) {
      const sameCategory = fromUnit.categoryId === toUnit.categoryId;
      const isMassVolumePair =
        (fromUnit.categoryId === "mass" && toUnit.categoryId === "volume") ||
        (fromUnit.categoryId === "volume" && toUnit.categoryId === "mass");
      if (sameCategory) {
        return synthesizeDynamicPair(fromUnit, toUnit);
      }
      if (isMassVolumePair) {
        const catOverride =
          categoryIdHint === "mass" || categoryIdHint === "volume"
            ? categoryIdHint
            : fromUnit.categoryId;
        return synthesizeDynamicPair(fromUnit, toUnit, catOverride);
      }
    }
  }

  return undefined;
}

const SYNTHESIZED_CATEGORY_PAIRS_CACHE = new Map<string, ConversionPairInfo[]>();

export function getConversionsByCategory(categoryId: string): ConversionPairInfo[] {
  const staticPairs = PAIRS_BY_CATEGORY_MAP.get(categoryId);
  if (staticPairs && staticPairs.length > 0) {
    return staticPairs;
  }

  const cached = SYNTHESIZED_CATEGORY_PAIRS_CACHE.get(categoryId);
  if (cached) return cached;

  const units = getUnitsByCategory(categoryId);
  const generated: ConversionPairInfo[] = [];
  const topUnits = units.slice(0, 5);

  for (let i = 0; i < topUnits.length; i++) {
    for (let j = 0; j < topUnits.length; j++) {
      if (i === j) continue;
      if (generated.length >= 12) break;
      generated.push(synthesizeDynamicPair(topUnits[i], topUnits[j]));
    }
    if (generated.length >= 12) break;
  }

  SYNTHESIZED_CATEGORY_PAIRS_CACHE.set(categoryId, generated);
  return generated;
}

/**
 * Generates the comprehensive competitor-style "More [FromUnit] & [ToUnit] Conversions"
 * two-column internal linking lists ("Convert from [FromPlural]" and "Convert to [ToPlural]")
 * with lowercase labels (e.g., "grams to tons", "grams to pounds", "tons to ounces", etc.).
 */
const MASS_PRIORITY_LINK_UNIT_IDS = [
  "kilogram",
  "gram",
  "pound",
  "ounce",
  "milligram",
  "microgram",
  "us_ton",
  "metric_ton",
  "imperial_ton",
  "stone",
];

const VOLUME_PRIORITY_LINK_UNIT_IDS = [
  "liter",
  "milliliter",
  "us_gallon",
  "us_quart",
  "us_pint",
  "us_cup",
  "us_fluid_ounce",
  "us_tablespoon",
  "us_teaspoon",
  "cubic_meter",
  "cubic_foot",
  "cubic_inch",
];

const MASS_PRIORITY_SET = new Set<string>(MASS_PRIORITY_LINK_UNIT_IDS);
const VOLUME_PRIORITY_SET = new Set<string>(VOLUME_PRIORITY_LINK_UNIT_IDS);

export interface MoreUnitConversionsBundle {
  sectionHeading: string;
  fromHeading: string;
  toHeading: string;
  fromLinks: { href: string; label: string }[];
  toLinks: { href: string; label: string }[];
}

export function getMoreUnitConversionLinks(
  fromUnit: Unit,
  toUnit: Unit
): MoreUnitConversionsBundle {
  const fromSingular = getFriendlyUnitSingular(fromUnit);
  const toSingular = getFriendlyUnitSingular(toUnit);
  const fromPlural = getFriendlyUnitPlural(fromUnit);
  const toPlural = getFriendlyUnitPlural(toUnit);
  const fromPluralLower = fromPlural.toLowerCase();
  const toPluralLower = toPlural.toLowerCase();

  const buildPeerUnitsFor = (anchorUnit: Unit): Unit[] => {
    const result: Unit[] = [];
    const seen = new Set<string>([anchorUnit.id]);

    if (MASS_PRIORITY_SET.has(anchorUnit.id)) {
      for (const id of MASS_PRIORITY_LINK_UNIT_IDS) {
        if (!seen.has(id)) {
          const u = UNIT_MAP.get(id);
          if (u) {
            seen.add(id);
            result.push(u);
          }
        }
      }
      return result;
    }

    if (VOLUME_PRIORITY_SET.has(anchorUnit.id)) {
      for (const id of VOLUME_PRIORITY_LINK_UNIT_IDS) {
        if (!seen.has(id)) {
          const u = UNIT_MAP.get(id);
          if (u) {
            seen.add(id);
            result.push(u);
          }
        }
      }
      return result;
    }

    // For all other units, include standard (non-obscure) units in the unit's own category
    const categoryPeers = getUnitsByCategory(anchorUnit.categoryId);
    const anchorIsObscure = OBSCURE_UNIT_IDS.has(anchorUnit.id);
    for (const u of categoryPeers) {
      if (!seen.has(u.id)) {
        if (!anchorIsObscure && OBSCURE_UNIT_IDS.has(u.id)) {
          continue;
        }
        seen.add(u.id);
        result.push(u);
      }
    }

    return result.slice(0, 12);
  };

  const fromTargetUnits = buildPeerUnitsFor(fromUnit).filter(
    (u) => u.id !== toUnit.id
  );
  const toSourceUnits = buildPeerUnitsFor(toUnit).filter(
    (u) => u.id !== fromUnit.id
  );

  const seenFromHrefs = new Set<string>();
  const fromLinks: { href: string; label: string }[] = [];
  for (const targetU of fromTargetUnits) {
    const pairSlug = getCanonicalPairSlug(fromUnit, targetU);
    const href = getPairUrl({ categoryId: fromUnit.categoryId, slug: pairSlug });
    if (!seenFromHrefs.has(href)) {
      seenFromHrefs.add(href);
      fromLinks.push({
        href,
        label: `${fromPluralLower} to ${getFriendlyUnitPlural(targetU).toLowerCase()}`,
      });
    }
  }

  const seenToHrefs = new Set<string>();
  const toLinks: { href: string; label: string }[] = [];
  for (const sourceU of toSourceUnits) {
    const pairSlug = getCanonicalPairSlug(sourceU, toUnit);
    const href = getPairUrl({ categoryId: sourceU.categoryId, slug: pairSlug });
    if (!seenToHrefs.has(href)) {
      seenToHrefs.add(href);
      toLinks.push({
        href,
        label: `${getFriendlyUnitPlural(sourceU).toLowerCase()} to ${toPluralLower}`,
      });
    }
  }

  return {
    sectionHeading: `More ${fromSingular} & ${toSingular} Conversions`,
    fromHeading: `Convert from ${fromPlural}`,
    toHeading: `Convert to ${toPlural}`,
    fromLinks,
    toLinks,
  };
}



