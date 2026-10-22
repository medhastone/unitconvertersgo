import { GuideArticle } from "./types";

export const GUIDES: GuideArticle[] = [
  {
    slug: "metric-to-imperial",
    title: "The Comprehensive Metric to Imperial Conversion Guide",
    summary:
      "A complete historical and mathematical breakdown of why the world uses two measurement standards, how to quickly convert between them in your head, and common engineering traps.",
    category: "General Measurement",
    readTime: "6 min read",
    publishedDate: "October 2026",
    content: [
      {
        heading: "1. The Historical Divide: SI Metric vs. Imperial",
        body: "The International System of Units (SI Metric) was born in late 18th-century revolutionary France to replace thousands of arbitrary feudal measurements with a single base-10 decimal system tied to the Earth's circumference. Conversely, the British Imperial system and the US Customary system evolved over centuries from everyday physical references: the thumb width (inch), the human foot, and grains of barley.",
      },
      {
        heading: "2. The 1959 International Yard and Pound Agreement",
        body: "Prior to 1959, the US inch and the British inch were slightly different. On July 1, 1959, Australia, Canada, New Zealand, South Africa, the United Kingdom, and the United States signed the International Yard and Pound treaty, legally defining 1 yard as exactly 0.9144 meters and 1 avoirdupois pound as exactly 0.45359237 kilograms. As a result, 1 inch became exactly 25.4 millimeters worldwide.",
      },
      {
        heading: "3. Mental Math Shortcuts for Fast Conversions",
        body: "When traveling or cooking without a calculator: \n• Celsius to Fahrenheit: Double the Celsius number and add 30 (e.g. 20°C × 2 + 30 ≈ 70°F, true is 68°F).\n• Kilometers to Miles: Divide by 8 and multiply by 5 (e.g. 80 km ÷ 8 × 5 = 50 miles, true is 49.7 miles).\n• Kilograms to Pounds: Double the kg value and add 10% (e.g. 50 kg × 2 = 100 + 10 = 110 lbs, true is 110.23 lbs).\n• Centimeters to Inches: Divide by 2 and subtract 20% (e.g. 50 cm ÷ 2 = 25 - 5 = 20 inches, true is 19.68 in).",
      },
      {
        heading: "4. Infamous Engineering Disasters from Unit Confusion",
        body: "The most famous unit conversion mistake in history occurred in September 1999, when NASA lost the $125 million Mars Climate Orbiter. The ground software manufactured by Lockheed Martin calculated thruster impulse in Imperial pound-seconds (lbf·s), while the spacecraft flight computer expected SI Newton-seconds (N·s). The resulting trajectory error sent the spacecraft directly into the Martian atmosphere where it disintegrated.",
      },
    ],
  },
  {
    slug: "us-vs-imperial-fluid-ounces",
    title: "US Customary vs. British Imperial Fluid Units Explained",
    summary:
      "Why a US pint is 16 fluid ounces but a British pint is 20 fluid ounces, and how to avoid major cooking and brewing measurement errors.",
    category: "Volume & Culinary",
    readTime: "5 min read",
    publishedDate: "October 2026",
    content: [
      {
        heading: "1. The Great Liquid Divide",
        body: "One of the most confusing areas of measurement is liquid volume. While length and mass were standardized internationally in 1959, volume was not. The British Weights and Measures Act of 1824 standardized the British Empire around the imperial gallon (4.54609 liters), defined as the volume of 10 pounds of distilled water at 62 °F. Meanwhile, the United States retained the earlier 1706 Queen Anne wine gallon of 231 cubic inches (3.78541 liters).",
      },
      {
        heading: "2. The Ounce Difference",
        body: "Because the British gallon was divided into 160 fluid ounces and the US gallon into 128 fluid ounces: \n• 1 US Fluid Ounce = 29.5735 mL \n• 1 Imperial Fluid Ounce = 28.4131 mL \nThus, an individual US fluid ounce is about 4% larger than a British fluid ounce. However, an Imperial pint contains 20 Imperial ounces (568.26 mL), whereas a US pint contains only 16 US fluid ounces (473.18 mL)—making the British pint 20% larger overall!",
      },
      {
        heading: "3. Culinary Rules of Thumb",
        body: "When following British, Australian, or Canadian recipes: be careful with pints, cups, and gallons. In modern Australian, New Zealand, and UK metric cooking, a metric cup is defined as 250 mL, whereas in the US, a customary cup is 236.59 mL (and a legal FDA nutrition cup is 240 mL). For delicate baking, weighing ingredients in grams is always superior to measuring volume in cups.",
      },
    ],
  },
  {
    slug: "decimal-vs-binary-data-storage",
    title: "Why Your 1TB Hard Drive Only Shows 931 GB in Windows",
    summary:
      "Demystifying Decimal (SI) Gigabytes vs. Binary (IEC) Gibibytes, the 1000 vs 1024 dispute, and how operating systems report storage.",
    category: "Computing & IT",
    readTime: "4 min read",
    publishedDate: "October 2026",
    content: [
      {
        heading: "1. The 1000 vs. 1024 Conflict",
        body: "In computer science, memory addressing naturally operates in powers of 2. Early computer scientists appropriated the SI metric prefixes (kilo = 10³, mega = 10⁶) to mean powers of 2 (2¹⁰ = 1024, 2²⁰ = 1,048,576). For small numbers, the difference was minimal (1024 vs 1000 is only a 2.4% difference). However, as capacities grew to Gigabytes and Terabytes, the discrepancy compounded to over 7% for Gigabytes and nearly 10% for Terabytes.",
      },
      {
        heading: "2. The IEC Standard: KB vs. KiB",
        body: "To eliminate legal disputes and technical ambiguity, the International Electrotechnical Commission (IEC) in 1998 approved explicit binary prefixes: \n• Kilobyte (KB) = 1,000 Bytes (10³) \n• Kibibyte (KiB) = 1,024 Bytes (2¹⁰) \n• Megabyte (MB) = 1,000,000 Bytes (10⁶) \n• Mebibyte (MiB) = 1,048,576 Bytes (2²⁰) \n• Gigabyte (GB) = 1,000,000,000 Bytes (10⁹) \n• Gibibyte (GiB) = 1,073,741,824 Bytes (2³⁰) \n• Terabyte (TB) = 1,000,000,000,000 Bytes (10¹²) \n• Tebibyte (TiB) = 1,099,511,627,776 Bytes (2⁴⁰)",
      },
      {
        heading: "3. Why Windows Shows 931 GB for a 1TB Drive",
        body: "Drive manufacturers sell hard drives and SSDs labeled with SI decimal Gigabytes (1 TB = 1,000,000,000,000 bytes). When you plug this drive into a Microsoft Windows computer, Windows calculates capacity by dividing by 1024³ (1,073,741,824), but confusingly labels the result as 'GB' instead of 'GiB'. 1,000,000,000,000 ÷ 1,073,741,824 = 931.32 GiB. Your drive is not missing 69 GB of space; it is simply reported in binary units disguised as decimal units.",
      },
    ],
  },
  {
    slug: "temperature-scales-explained",
    title: "Celsius vs. Fahrenheit vs. Kelvin vs. Rankine: Complete Temperature Scales Guide",
    summary:
      "How thermodynamic absolute temperature scales (Kelvin and Rankine) relate to everyday relative scales (Celsius and Fahrenheit), exact offset formulas, and key physics benchmarks.",
    category: "Thermodynamics & Weather",
    readTime: "5 min read",
    publishedDate: "October 2026",
    content: [
      {
        heading: "1. Relative vs. Absolute Temperature Scales",
        body: "Unlike length or mass—where zero means the complete absence of the quantity and conversions only require multiplying by a scale factor—everyday temperature scales (Celsius and Fahrenheit) use arbitrary zero points based on phase changes of water or brine. Consequently, converting between temperature scales requires both a scale multiplier (9/5 or 5/9) and an additive offset (+32 or +273.15).",
      },
      {
        heading: "2. The Four Major Temperature Scales Compared",
        body: "• Celsius (°C): Part of the metric system; water freezes at 0 °C and boils at 100 °C at 1 standard atmosphere (101.325 kPa).\n• Fahrenheit (°F): Used in the United States for weather and culinary temperatures; water freezes at 32 °F and boils at 212 °F (a 180-degree span, meaning 1 °C interval = 1.8 °F interval).\n• Kelvin (K): The base SI thermodynamic unit defined by fixing the Boltzmann constant k. Starts at Absolute Zero (0 K = -273.15 °C) and uses the exact same degree step size as Celsius.\n• Rankine (°R): The Imperial/US thermodynamic absolute scale starting at Absolute Zero (0 °R = -459.67 °F) while using Fahrenheit-sized degree increments (°R = °F + 459.67).",
      },
      {
        heading: "3. Exact Conversion Equations & The -40° Crossover",
        body: "Because the Fahrenheit scale has 1.8 degrees for every 1 Celsius degree and starts 32 degrees higher at freezing, the two lines intersect at exactly -40°: (-40 × 1.8) + 32 = -72 + 32 = -40. Thus, -40 °C is identically equal to -40 °F.",
      },
    ],
  },
  {
    slug: "pressure-units-psi-bar-kpa-explained",
    title: "PSI vs. Bar vs. kPa vs. Atmosphere: Engineering & Tire Pressure Reference",
    summary:
      "Understand how Pascals, Kilopascals, Bar, PSI, Atmospheres, and Inches of Mercury relate across automotive tires, HVAC, hydraulics, and meteorology.",
    category: "Engineering & Mechanics",
    readTime: "5 min read",
    publishedDate: "October 2026",
    content: [
      {
        heading: "1. The SI Base Unit: Pascal (Pa) and Kilopascal (kPa)",
        body: "In the International System of Units (SI), pressure is defined as force per unit area: 1 Pascal (Pa) equals 1 Newton of force distributed over 1 square meter (1 N/m²). Because 1 Pascal is a very small pressure, engineers almost universally use Kilopascals (1 kPa = 1,000 Pa) for tire placards and HVAC, or Megapascals (1 MPa = 1,000,000 Pa = 1 N/mm²) for structural steel and hydraulic cylinders.",
      },
      {
        heading: "2. Bar, Atmosphere (atm), and PSI Compared",
        body: "• 1 Bar = 100,000 Pa (100 kPa) ≈ 14.5038 PSI. Widely used in European automotive tire gauges, espresso machines, and industrial pneumatics.\n• 1 Standard Atmosphere (atm) = 101,325 Pa (101.325 kPa = 1.01325 bar) ≈ 14.6959 PSI. Represents mean sea-level barometric pressure.\n• 1 PSI (Pound-force per Square Inch) = 6,894.757 Pa (6.89476 kPa) ≈ 0.068948 bar. The standard pressure unit in the United States for tires, plumbing, and gas cylinders.",
      },
      {
        heading: "3. Gauge Pressure (psig) vs. Absolute Pressure (psia)",
        body: "When checking a car tire at sea level, a tire gauge reads '0 PSI' when open to the air, even though the Earth's atmosphere is pressing down at 14.7 PSI. Tire and compressor gauges measure Gauge Pressure (psig)—pressure above ambient atmospheric pressure. Scientific gas-law calculations require Absolute Pressure (psia = psig + 14.696 PSI).",
      },
    ],
  },
  {
    slug: "avoirdupois-vs-troy-weight",
    title: "Troy Ounces vs. Regular Avoirdupois Ounces: Bullion & Jewelry Weight Guide",
    summary:
      "Why 1 ounce of gold (31.1035 g) weighs 9.7% more than 1 ounce of food (28.3495 g), yet 1 Troy pound weighs less than 1 regular pound.",
    category: "Mass & Precious Metals",
    readTime: "5 min read",
    publishedDate: "October 2026",
    content: [
      {
        heading: "1. Two Completely Different Ounce Definitions",
        body: "In everyday commerce, postal shipping, and grocery measurements, the United States and Commonwealth use the Avoirdupois system, where 1 ounce equals 437.5 grains (exactly 28.349523125 grams). However, precious metals—including gold, silver, platinum, palladium, and bullion coins—are exclusively weighed and priced in the Troy system, originating from the medieval trade fairs of Troyes, France. One Troy ounce (oz t) is legally defined as 480 grains, or exactly 31.1034768 grams.",
      },
      {
        heading: "2. The Troy Pound Paradox (12 oz vs. 16 oz)",
        body: "Because 1 Troy ounce (31.1035 g) is heavier than 1 Avoirdupois ounce (28.3495 g), many people assume a Troy pound is also heavier than a regular pound. In fact, the opposite is true: a regular Avoirdupois pound is divided into 16 ounces (7,000 grains = 453.59237 g), whereas a historical Troy pound was divided into only 12 Troy ounces (5,760 grains = 373.2417 g). To avoid confusion, modern bullion markets quote large bars exclusively in Troy ounces (e.g., 100 oz t or 400 oz t Good Delivery bars) or metric kilograms.",
      },
      {
        heading: "3. Pennyweights (dwt), Grains, and Metric Carats",
        body: "• 1 Troy Ounce (oz t) = 20 Pennyweights (dwt) = 480 Grains = 31.1034768 Grams\n• 1 Pennyweight (dwt) = 24 Grains = 1.55517384 Grams (used by jewelers for ring shanks and dental alloys)\n• 1 Metric Carat (ct) = 0.2 Grams = 200 Milligrams (used for diamonds and gemstones; distinct from 'karat' gold purity where 24K = 99.9% pure gold).",
      },
    ],
  },
  {
    slug: "us-vs-uk-mpg-fuel-economy",
    title: "US MPG vs. UK Imperial MPG vs. L/100km: Complete Fuel Consumption Guide",
    summary:
      "How the inverse hyperbola formula converts Miles per Gallon to Liters per 100 km, and why British MPG numbers are always 20% higher than US EPA ratings.",
    category: "Automotive & Fuel Economy",
    readTime: "5 min read",
    publishedDate: "October 2026",
    content: [
      {
        heading: "1. Distance-per-Volume (MPG) vs. Volume-per-Distance (L/100km)",
        body: "North America and the UK express fuel efficiency as distance traveled per unit of fuel (Miles per Gallon, where a higher number means better economy). Continental Europe, Canada, Australia, and China express fuel consumption as volume burned over a fixed 100-kilometer distance (L/100km, where a lower number means better economy). Because one ratio is the mathematical reciprocal of the other, you cannot multiply by a constant—you must divide a constant by the input value.",
      },
      {
        heading: "2. Exact Reciprocal Conversion Constants",
        body: "• US MPG ↔ L/100km: L/100km = 235.214583 ÷ MPG (US)\n• UK Imperial MPG ↔ L/100km: L/100km = 282.480936 ÷ MPG (UK)\n• US MPG ↔ UK Imperial MPG: 1 MPG (US) = 1.20095 MPG (UK), because the 4.54609 L Imperial gallon holds 20.095% more fuel than the 3.78541 L US liquid gallon.",
      },
      {
        heading: "3. Why US EPA and European/UK WLTP Ratings Differ Beyond Gallon Size",
        body: "Even after converting UK Imperial MPG into US MPG using the 1.20095 gallon ratio, British and European window-sticker figures often appear 10% to 15% higher than North American stickers for the exact same engine. This occurs because the US Environmental Protection Agency (EPA) 5-cycle test includes aggressive highway acceleration, air-conditioning load, and cold-weather operation (20 °F), whereas the Worldwide Harmonised Light Vehicles Test Procedure (WLTP) uses different average speeds and thermal profiles.",
      },
    ],
  },
];

export const GUIDES_MAP = new Map<string, GuideArticle>(
  GUIDES.map((g) => [g.slug, g])
);

