import { UNIT_MAP } from "./units";

export interface SearchQueryPreset {
  value: number;
  label: string;
  contextTag?: string;
  isPopular?: boolean;
}

export interface RealWorldScenario {
  id: string;
  category: "culinary" | "science" | "engineering" | "travel";
  title: string;
  sectorName: string;
  description: string;
  exampleCalculation: string;
  practicalTip: string;
}

export interface QuickBenchmarkCard {
  value: number;
  label: string;
  convertedFormatted: string;
  description: string;
  categoryTag: string;
}

/**
 * Curated high-volume Google search query preset chips for conversion pairs.
 * Clicking a chip populates the calculator and calculates the live 3-step solver.
 */
const SPECIFIC_PAIR_PRESETS: Record<string, SearchQueryPreset[]> = {
  // --- TEMPERATURE ---
  "celsius-to-fahrenheit": [
    { value: 0, label: "0 °C (Water Freezing)", contextTag: "Freezing", isPopular: true },
    { value: 20, label: "20 °C (Room Temp)", contextTag: "Thermostat", isPopular: true },
    { value: 37, label: "37 °C (Human Body)", contextTag: "Medical", isPopular: true },
    { value: 100, label: "100 °C (Water Boiling)", contextTag: "Boiling", isPopular: true },
    { value: 180, label: "180 °C (Oven 350°F)", contextTag: "Baking", isPopular: true },
    { value: 200, label: "200 °C (Oven 400°F)", contextTag: "Roasting", isPopular: true },
    { value: 38, label: "38 °C (Fever Line)", contextTag: "Clinical" },
    { value: -40, label: "-40 °C (Equal Point)", contextTag: "Extremes" },
  ],
  "fahrenheit-to-celsius": [
    { value: 32, label: "32 °F (Water Freezing)", contextTag: "Freezing", isPopular: true },
    { value: 68, label: "68 °F (Room Temp)", contextTag: "Comfort", isPopular: true },
    { value: 98.6, label: "98.6 °F (Body Temp)", contextTag: "Medical", isPopular: true },
    { value: 212, label: "212 °F (Water Boiling)", contextTag: "Boiling", isPopular: true },
    { value: 350, label: "350 °F (Cake / Cookie Baking)", contextTag: "Culinary", isPopular: true },
    { value: 400, label: "400 °F (High Roast)", contextTag: "Roasting", isPopular: true },
    { value: 100.4, label: "100.4 °F (Medical Fever)", contextTag: "Health" },
    { value: -40, label: "-40 °F (Equal Point)", contextTag: "Extremes" },
  ],
  "celsius-to-kelvin": [
    { value: -273.15, label: "-273.15 °C (Absolute Zero)", contextTag: "Physics", isPopular: true },
    { value: 0, label: "0 °C (Ice Point / 273.15 K)", contextTag: "Standard", isPopular: true },
    { value: 25, label: "25 °C (Standard Ambient 298.15 K)", contextTag: "Chemistry", isPopular: true },
    { value: 100, label: "100 °C (Steam Point / 373.15 K)", contextTag: "Lab", isPopular: true },
  ],
  "kelvin-to-celsius": [
    { value: 0, label: "0 K (Absolute Zero)", contextTag: "Physics", isPopular: true },
    { value: 273.15, label: "273.15 K (Ice Freezing)", contextTag: "Standard", isPopular: true },
    { value: 298.15, label: "298.15 K (STP Room 25°C)", contextTag: "Lab", isPopular: true },
    { value: 373.15, label: "373.15 K (Boiling Water)", contextTag: "Thermodynamics", isPopular: true },
  ],

  // --- LENGTH ---
  "inches-to-nanometers": [
    { value: 0.0000001, label: '0.0000001" (2.54 nm)', contextTag: "Sub-Micron", isPopular: true },
    { value: 0.000001, label: '0.000001" (25.4 nm)', contextTag: "Semiconductor", isPopular: true },
    { value: 0.0001, label: '0.0001" (2,540 nm)', contextTag: "Optics", isPopular: true },
    { value: 0.001, label: '0.001" (1 Thou / Mil)', contextTag: "Machining", isPopular: true },
    { value: 1, label: '1" (25,400,000 nm)', contextTag: "Exact Standard", isPopular: true },
    { value: 5, label: '5" (127,000,000 nm)', contextTag: "Worked Example", isPopular: true },
  ],
  "nanometers-to-inches": [
    { value: 2.54, label: '2.54 nm (0.0000001")', contextTag: "Sub-Micron", isPopular: true },
    { value: 5, label: "5 nm (CPU Node)", contextTag: "Semiconductor", isPopular: true },
    { value: 25.4, label: '25.4 nm (0.000001")', contextTag: "Nanotech", isPopular: true },
    { value: 550, label: "550 nm (Visible Light)", contextTag: "Optics", isPopular: true },
    { value: 1000, label: "1,000 nm (1 Micrometer)", contextTag: "Metric", isPopular: true },
    { value: 25400000, label: '25,400,000 nm (Exact 1")', contextTag: "Standard", isPopular: true },
  ],
  "cm-to-inches": [
    { value: 2.54, label: "2.54 cm (Exact 1 Inch)", contextTag: "Exact Standard", isPopular: true },
    { value: 10, label: "10 cm (3.937 in)", contextTag: "Decimeter", isPopular: true },
    { value: 15, label: "15 cm (6-inch Ruler)", contextTag: "School Ruler", isPopular: true },
    { value: 30, label: "30 cm (~1 Foot Ruler)", contextTag: "Desk Ruler", isPopular: true },
    { value: 150, label: "150 cm (Tape Measure)", contextTag: "Sewing / Tailor", isPopular: true },
    { value: 175, label: "175 cm (~5 ft 9 in)", contextTag: "Adult Height", isPopular: true },
    { value: 183, label: "183 cm (6 Feet Stature)", contextTag: "Height" },
  ],
  "inches-to-cm": [
    { value: 1, label: "1 in (Exact 2.54 cm)", contextTag: "Standard", isPopular: true },
    { value: 6, label: "6 in (15.24 cm)", contextTag: "Pocket Ruler", isPopular: true },
    { value: 12, label: "12 in (30.48 cm / 1 ft)", contextTag: "Foot Ruler", isPopular: true },
    { value: 24, label: "24 in (60.96 cm / 2 ft)", contextTag: "Cabinetry", isPopular: true },
    { value: 32, label: "32 in (81.28 cm TV)", contextTag: "Display", isPopular: true },
    { value: 55, label: "55 in (139.7 cm TV)", contextTag: "Living Room", isPopular: true },
    { value: 70, label: "70 in (177.8 cm Height)", contextTag: "Doorway / Person" },
  ],
  "meters-to-feet": [
    { value: 1, label: "1 m (3.28 ft)", contextTag: "Base Unit", isPopular: true },
    { value: 1.75, label: "1.75 m (5 ft 8.9 in)", contextTag: "Height", isPopular: true },
    { value: 2, label: "2 m (Doorway Height)", contextTag: "Architecture", isPopular: true },
    { value: 5, label: "5 m (Car Length)", contextTag: "Automotive", isPopular: true },
    { value: 10, label: "10 m (Diving Board)", contextTag: "Sports", isPopular: true },
    { value: 100, label: "100 m (Track Sprint)", contextTag: "Athletics", isPopular: true },
  ],
  "feet-to-meters": [
    { value: 1, label: "1 ft (Exact 0.3048 m)", contextTag: "Standard", isPopular: true },
    { value: 5.75, label: "5.75 ft (5 ft 9 in)", contextTag: "Height", isPopular: true },
    { value: 6, label: "6 ft (1.8288 m)", contextTag: "Height", isPopular: true },
    { value: 10, label: "10 ft (Ceiling Height)", contextTag: "Interior", isPopular: true },
    { value: 50, label: "50 ft (Pool / Boat)", contextTag: "Marine" },
    { value: 100, label: "100 ft (Plot / Lot)", contextTag: "Real Estate" },
  ],
  "km-to-miles": [
    { value: 5, label: "5 km (3.1 mi Parkrun)", contextTag: "Running", isPopular: true },
    { value: 10, label: "10 km (6.2 mi Road Race)", contextTag: "Athletics", isPopular: true },
    { value: 21.0975, label: "21.1 km (Half Marathon)", contextTag: "Marathon", isPopular: true },
    { value: 42.195, label: "42.2 km (Full Marathon)", contextTag: "Marathon", isPopular: true },
    { value: 100, label: "100 km (62.1 mi Highway)", contextTag: "Driving", isPopular: true },
    { value: 120, label: "120 km (74.6 mi Expressway)", contextTag: "Motorway" },
  ],
  "miles-to-km": [
    { value: 1, label: "1 mi (Exact 1.609344 km)", contextTag: "Standard", isPopular: true },
    { value: 3.1, label: "3.1 mi (5K Race)", contextTag: "Running", isPopular: true },
    { value: 13.1, label: "13.1 mi (Half Marathon)", contextTag: "Athletics", isPopular: true },
    { value: 26.2, label: "26.2 mi (Full Marathon)", contextTag: "Marathon", isPopular: true },
    { value: 60, label: "60 mi (96.6 km Highway)", contextTag: "Speed Limit", isPopular: true },
    { value: 100, label: "100 mi (Century Cycling)", contextTag: "Cycling" },
  ],

  // --- MASS & WEIGHT ---
  "grams-to-pounds": [
    { value: 100, label: "100 g (Snack Serving)", contextTag: "Nutrition", isPopular: true },
    { value: 250, label: "250 g (Block of Butter)", contextTag: "Baking", isPopular: true },
    { value: 453.59, label: "453.6 g (Exact 1 Pound)", contextTag: "Exact Standard", isPopular: true },
    { value: 500, label: "500 g (Half Kilogram / 1.1 lb)", contextTag: "Grocery", isPopular: true },
    { value: 1000, label: "1000 g (1 kg / 2.205 lb)", contextTag: "Produce", isPopular: true },
    { value: 2000, label: "2000 g (Small Turkey / Roast)", contextTag: "Cooking" },
  ],
  "pounds-to-grams": [
    { value: 0.5, label: "0.5 lb (8 oz / 226.8 g)", contextTag: "Baking", isPopular: true },
    { value: 1, label: "1 lb (Exact 453.592 g)", contextTag: "Standard", isPopular: true },
    { value: 2, label: "2 lb (907.2 g)", contextTag: "Package", isPopular: true },
    { value: 5, label: "5 lb (Flour Bag / 2.27 kg)", contextTag: "Pantry", isPopular: true },
    { value: 10, label: "10 lb (Pet Food / Produce)", contextTag: "Household" },
  ],
  "kg-to-pounds": [
    { value: 1, label: "1 kg (2.205 lb)", contextTag: "Produce", isPopular: true },
    { value: 5, label: "5 kg (11.02 lb Dumbbell)", contextTag: "Fitness", isPopular: true },
    { value: 20, label: "20 kg (Olympic Barbell Plate)", contextTag: "Gym", isPopular: true },
    { value: 23, label: "23 kg (50.7 lb Airline Bag Limit)", contextTag: "Checked Luggage", isPopular: true },
    { value: 70, label: "70 kg (154.3 lb Human Weight)", contextTag: "Health", isPopular: true },
    { value: 80, label: "80 kg (176.4 lb Adult Stature)", contextTag: "Medical" },
  ],
  "pounds-to-kg": [
    { value: 1, label: "1 lb (0.4536 kg)", contextTag: "Standard", isPopular: true },
    { value: 10, label: "10 lb (4.536 kg Gym Weight)", contextTag: "Fitness", isPopular: true },
    { value: 50, label: "50 lb (22.68 kg Flight Bag Limit)", contextTag: "Airline", isPopular: true },
    { value: 150, label: "150 lb (68.04 kg Body Weight)", contextTag: "Health", isPopular: true },
    { value: 180, label: "180 lb (81.65 kg Body Weight)", contextTag: "Fitness", isPopular: true },
    { value: 200, label: "200 lb (90.72 kg Benchmark)", contextTag: "Weight" },
  ],
  "ounces-to-grams": [
    { value: 1, label: "1 oz (Exact 28.35 g)", contextTag: "Standard", isPopular: true },
    { value: 4, label: "4 oz (Quarter Pounder / 113.4 g)", contextTag: "Cooking", isPopular: true },
    { value: 8, label: "8 oz (Half Pound / 226.8 g)", contextTag: "Baking", isPopular: true },
    { value: 16, label: "16 oz (1 Pound / 453.6 g)", contextTag: "Grocery", isPopular: true },
  ],

  // --- VOLUME ---
  "liters-to-gallons": [
    { value: 1, label: "1 L (0.264 US gal)", contextTag: "Bottle", isPopular: true },
    { value: 3.785, label: "3.785 L (Exact 1 US Gallon)", contextTag: "Exact Standard", isPopular: true },
    { value: 5, label: "5 L (Engine Oil Jug)", contextTag: "Automotive", isPopular: true },
    { value: 10, label: "10 L (Utility Bucket)", contextTag: "Household", isPopular: true },
    { value: 20, label: "20 L (Fuel Jerrycan)", contextTag: "Transport", isPopular: true },
    { value: 50, label: "50 L (Car Fuel Tank)", contextTag: "Vehicle", isPopular: true },
  ],
  "gallons-to-liters": [
    { value: 1, label: "1 gal (Exact 3.785 L)", contextTag: "Standard", isPopular: true },
    { value: 5, label: "5 gal (Water Cooler Jug / 18.9 L)", contextTag: "Office / Water", isPopular: true },
    { value: 10, label: "10 gal (Small Aquarium / 37.9 L)", contextTag: "Aquarium", isPopular: true },
    { value: 15, label: "15 gal (Sedan Fuel Tank / 56.8 L)", contextTag: "Automotive", isPopular: true },
    { value: 55, label: "55 gal (Industrial Drum / 208 L)", contextTag: "Industrial" },
  ],
  "milliliters-to-fluid-ounces": [
    { value: 30, label: "30 ml (1 fl oz Medicine Cup)", contextTag: "Clinical", isPopular: true },
    { value: 100, label: "100 ml (TSA Airport Liquid Limit)", contextTag: "Travel / Aviation", isPopular: true },
    { value: 250, label: "250 ml (One Metric Cup)", contextTag: "Culinary", isPopular: true },
    { value: 500, label: "500 ml (Standard Water Bottle)", contextTag: "Beverage", isPopular: true },
    { value: 750, label: "750 ml (Wine Bottle)", contextTag: "Beverage", isPopular: true },
  ],

  // --- SPEED ---
  "kmh-to-mph": [
    { value: 30, label: "30 km/h (18.6 mph School Zone)", contextTag: "Safety", isPopular: true },
    { value: 50, label: "50 km/h (31.1 mph City Limit)", contextTag: "Urban", isPopular: true },
    { value: 80, label: "80 km/h (49.7 mph Rural Road)", contextTag: "Rural", isPopular: true },
    { value: 100, label: "100 km/h (62.1 mph National Limit)", contextTag: "Highway", isPopular: true },
    { value: 120, label: "120 km/h (74.6 mph Motorway)", contextTag: "Expressway", isPopular: true },
    { value: 130, label: "130 km/h (80.8 mph Autobahn)", contextTag: "European Highway" },
  ],
  "mph-to-kmh": [
    { value: 25, label: "25 mph (40.2 km/h Residential)", contextTag: "Neighborhood", isPopular: true },
    { value: 35, label: "35 mph (56.3 km/h Main Road)", contextTag: "Suburban", isPopular: true },
    { value: 55, label: "55 mph (88.5 km/h State Highway)", contextTag: "Highway", isPopular: true },
    { value: 65, label: "65 mph (104.6 km/h Interstate)", contextTag: "Interstate", isPopular: true },
    { value: 70, label: "70 mph (112.7 km/h Turnpike)", contextTag: "Expressway", isPopular: true },
    { value: 100, label: "100 mph (160.9 km/h Track Speed)", contextTag: "Motorsport" },
  ],

  // --- PRESSURE ---
  "psi-to-bar": [
    { value: 30, label: "30 psi (2.07 bar Compact Car)", contextTag: "Car Tire", isPopular: true },
    { value: 32, label: "32 psi (2.21 bar Standard Sedan)", contextTag: "Car Tire", isPopular: true },
    { value: 35, label: "35 psi (2.41 bar SUV / Crossover)", contextTag: "SUV Tire", isPopular: true },
    { value: 40, label: "40 psi (2.76 bar Heavy Load)", contextTag: "Light Truck", isPopular: true },
    { value: 80, label: "80 psi (5.52 bar Road Bicycle)", contextTag: "Cycling" },
    { value: 100, label: "100 psi (6.89 bar Workshop Air)", contextTag: "Compressor" },
  ],
  "bar-to-psi": [
    { value: 1, label: "1 bar (14.50 psi Standard Atmo)", contextTag: "Atmosphere", isPopular: true },
    { value: 2.2, label: "2.2 bar (31.9 psi Sedan Tire)", contextTag: "Tire Pressure", isPopular: true },
    { value: 2.4, label: "2.4 bar (34.8 psi SUV Tire)", contextTag: "Tire Pressure", isPopular: true },
    { value: 2.5, label: "2.5 bar (36.3 psi Eco Tire)", contextTag: "High Efficiency", isPopular: true },
    { value: 6, label: "6 bar (87.0 psi Road Bike Tire)", contextTag: "Cycling" },
  ],
};

/**
 * Returns preset Google search queries for a unit pair
 */
export function getPresetSearchQueries(
  fromUnitId: string,
  toUnitId: string,
  categoryId: string
): SearchQueryPreset[] {
  const directKey = `${fromUnitId}-to-${toUnitId}`.replace(/_/g, "");
  if (SPECIFIC_PAIR_PRESETS[directKey]) {
    return SPECIFIC_PAIR_PRESETS[directKey];
  }

  // Check aliases / alternative key formats
  for (const [key, presets] of Object.entries(SPECIFIC_PAIR_PRESETS)) {
    if (key.includes(fromUnitId) && key.includes(toUnitId)) {
      return presets;
    }
  }

  // Generate intelligent default presets based on category and unit scale
  const fromUnit = UNIT_MAP.get(fromUnitId);
  const toUnit = UNIT_MAP.get(toUnitId);
  const symbol = fromUnit?.symbol || "";

  if (categoryId === "digital_storage") {
    return [
      { value: 1, label: `1 ${symbol} (Base)`, isPopular: true },
      { value: 8, label: `8 ${symbol} (Octet Byte)`, isPopular: true },
      { value: 16, label: `16 ${symbol} (RAM / Flash)`, isPopular: true },
      { value: 64, label: `64 ${symbol} (Phone Storage)`, isPopular: true },
      { value: 128, label: `128 ${symbol} (Standard SSD)`, isPopular: true },
      { value: 256, label: `256 ${symbol} (Laptop SSD)`, isPopular: true },
      { value: 512, label: `512 ${symbol} (High Capacity)`, isPopular: true },
      { value: 1024, label: `1024 ${symbol} (Binary Boundary)`, isPopular: true },
    ];
  }

  if (categoryId === "energy" || categoryId === "power") {
    return [
      { value: 1, label: `1 ${symbol}`, isPopular: true },
      { value: 10, label: `10 ${symbol}`, isPopular: true },
      { value: 100, label: `100 ${symbol} (Incandescent Light)`, isPopular: true },
      { value: 1000, label: `1000 ${symbol} (1 Kilowatt Scale)`, isPopular: true },
      { value: 2000, label: `2000 ${symbol} (Microwave / Kettle)`, isPopular: true },
    ];
  }

  return [
    { value: 1, label: `1 ${symbol}`, isPopular: true },
    { value: 5, label: `5 ${symbol}`, isPopular: true },
    { value: 10, label: `10 ${symbol}`, isPopular: true },
    { value: 25, label: `25 ${symbol}`, isPopular: true },
    { value: 50, label: `50 ${symbol}`, isPopular: true },
    { value: 100, label: `100 ${symbol}`, isPopular: true },
  ];
}

/**
 * Returns structured real-world application scenarios for the conversion page.
 */
export function getRealWorldScenarios(
  fromUnitId: string,
  toUnitId: string,
  categoryId: string
): RealWorldScenario[] {
  const fromUnit = UNIT_MAP.get(fromUnitId);
  const toUnit = UNIT_MAP.get(toUnitId);
  const fromName = fromUnit?.name || fromUnitId;
  const toName = toUnit?.name || toUnitId;
  const fromSym = fromUnit?.symbol || "";
  const toSym = toUnit?.symbol || "";

  if (categoryId === "temperature") {
    return [
      {
        id: "culinary",
        category: "culinary",
        sectorName: "Baking & Cooking",
        title: "International Recipes & Oven Settings",
        description:
          "European, Asian, and British culinary cookbooks use Celsius oven temperatures, whereas North American recipes specify Fahrenheit. Translating these accurately prevents undercooked pastries or scorched proteins.",
        exampleCalculation:
          "A classic French tart requires 180 °C. Converted: (180 × 1.8) + 32 = 356 °F, typically dialed to 350 °F in American ovens.",
        practicalTip:
          "For fan-forced / convection ovens, reduce the calculated Celsius temperature by 20 °C (or 25 °F) to compensate for accelerated airflow.",
      },
      {
        id: "science",
        category: "science",
        sectorName: "Clinical & Health",
        title: "Body Temperature & Fever Monitoring",
        description:
          "Clinical thermometers outside the United States read in Celsius. Medical fever diagnosis requires exact decimal precision, as a mere 1 °C change represents a significant clinical threshold.",
        exampleCalculation:
          "Normal body temperature is 37.0 °C (98.6 °F). A clinical fever begins at 38.0 °C (100.4 °F), and high fevers reach 39.5 °C (103.1 °F).",
        practicalTip:
          "Never round temperature values in pediatric triage; always reference verified digital clinical scales.",
      },
      {
        id: "engineering",
        category: "engineering",
        sectorName: "HVAC & Meteorology",
        title: "Thermostat Climate Control & Weather Forecasting",
        description:
          "Smart thermostats, weather models, and building energy management systems operate on digital sensors that convert between Celsius for global meteorological feeds and Fahrenheit for domestic displays.",
        exampleCalculation:
          "A comfortable domestic thermostat setpoint of 20 °C translates exactly to (20 × 1.8) + 32 = 68 °F, the standard ASHRAE winter comfort baseline.",
        practicalTip:
          "Each 1 °C (1.8 °F) adjustment on a heating thermostat changes household energy consumption by approximately 6% to 8% annually.",
      },
    ];
  }

  if (categoryId === "length") {
    return [
      {
        id: "engineering",
        category: "engineering",
        sectorName: "Carpentry & Architecture",
        title: "Blueprint Dimensions & Construction Tolerance",
        description:
          "Architectural drawings in metric regions use millimeters and centimeters, while US construction documents rely on feet and fractional inches. Precision conversion prevents costly job-site fabrication errors.",
        exampleCalculation:
          "A standard interior door width of 32 inches converts to 32 × 2.54 = 81.28 cm (or 813 mm in European modular millwork).",
        practicalTip:
          "International building tolerance guidelines define 1 inch as legally and metrologically equal to exactly 25.4 mm (2.54 cm).",
      },
      {
        id: "travel",
        category: "travel",
        sectorName: "Apparel & Personal Height",
        title: "Garment Sizing & Driver License Records",
        description:
          "Passports, medical charts, and international online clothing sizing charts require converting human height and body measurements between centimeters and imperial feet/inches.",
        exampleCalculation:
          "An adult stature of 175 cm converts to 175 ÷ 2.54 = 68.9 inches, corresponding to 5 feet 8.9 inches.",
        practicalTip:
          "When converting height, divide total inches by 12 to separate whole feet from remaining inches (e.g., 68.9 in = 5 ft + 8.9 in).",
      },
      {
        id: "science",
        category: "science",
        sectorName: "Aerospace & Automotive",
        title: "Chassis Clearance & Wheelbase Engineering",
        description:
          "Modern automotive engineering teams collaborate across continents. German and Japanese platforms specify ride heights and ground clearance in metric units that US repair manuals convert to inches.",
        exampleCalculation:
          "A vehicle ground clearance of 20 cm provides 20 × 0.3937 = 7.87 inches of road obstacle clearance.",
        practicalTip:
          "High-performance suspension alignment uses millimeters rather than fractional inches to maintain sub-millimeter toe and camber precision.",
      },
    ];
  }

  if (categoryId === "mass") {
    return [
      {
        id: "culinary",
        category: "culinary",
        sectorName: "Pastry & Baking",
        title: "Flour, Butter & Sugar Ratios",
        description:
          "Professional pastry chefs measure ingredients strictly by mass rather than volume to prevent up to 20% density fluctuations from scooped cups. Converting grams to pounds ensures scalable yield accuracy.",
        exampleCalculation:
          "A standard European artisan sourdough loaf using 500 g of bread flour requires 500 ÷ 453.592 = 1.102 pounds of flour.",
        practicalTip:
          "1 stick of American butter weighs 4 oz or 0.25 lb, which converts to approximately 113.4 grams.",
      },
      {
        id: "travel",
        category: "travel",
        sectorName: "Aviation & Logistics",
        title: "Airline Baggage Limits & Shipping Tariffs",
        description:
          "International commercial airlines enforce strict baggage thresholds. European and Asian carriers enforce a 23 kg checked allowance, whereas US carriers describe this as a 50 lb ceiling.",
        exampleCalculation:
          "A 50 lb luggage allowance equals 50 × 0.453592 = 22.68 kg, safely below the international 23 kg baggage scale threshold.",
        practicalTip:
          "Pack with a 1-pound (0.5 kg) safety margin to prevent expensive airport overweight surcharges caused by scale calibration differences.",
      },
      {
        id: "science",
        category: "science",
        sectorName: "Clinical Pharmacology",
        title: "Pediatric Dosing & Weight-Based Formulations",
        description:
          "Hospital medication guidelines calculate active pharmaceutical dosages per kilogram of patient body weight (mg/kg), requiring rapid and error-free conversion from pounds.",
        exampleCalculation:
          "A child weighing 44 lb has a metric body mass of 44 ÷ 2.20462 = 20.0 kg, allowing straightforward single-step antibiotic dosing.",
        practicalTip:
          "Always verify weight conversions using two independent clinicians or verified digital calculation engines to prevent medical dosing errors.",
      },
    ];
  }

  if (categoryId === "volume") {
    return [
      {
        id: "culinary",
        category: "culinary",
        sectorName: "Beverages & Cooking",
        title: "International Fluid Measurement in Kitchens",
        description:
          "Metric recipes call for milliliters and liters, while US recipes measure in fluid ounces, cups, pints, and gallons. Converting precisely guarantees proper consistency in sauces and reductions.",
        exampleCalculation:
          "One metric cup (250 ml) contains 250 × 0.033814 = 8.45 US fluid ounces, slightly larger than a traditional 8 fl oz American measuring cup.",
        practicalTip:
          "Remember that UK Imperial fluid ounces (28.41 ml) are slightly smaller than US Customary fluid ounces (29.57 ml).",
      },
      {
        id: "engineering",
        category: "engineering",
        sectorName: "Automotive & Machinery",
        title: "Engine Oil, Coolant & Tank Capacities",
        description:
          "Vehicle maintenance fluids are packaged in both 1-gallon bottles and 5-liter drums. Knowing the exact conversion prevents dangerous overfilling or catastrophic lubrication starvation.",
        exampleCalculation:
          "A truck requiring a 15-gallon fuel tank replenishment takes 15 × 3.78541 = 56.78 liters at European or Canadian gas stations.",
        practicalTip:
          "1 US gallon equals exactly 3.785411784 liters, whereas 1 Imperial gallon equals 4.54609 liters.",
      },
      {
        id: "travel",
        category: "travel",
        sectorName: "Aviation & TSA Security",
        title: "Airport Liquid Restrictions",
        description:
          "International airport security restricts carry-on liquids to containers of 100 ml or less, which corresponds to 3.4 US fluid ounces.",
        exampleCalculation:
          "100 ml converted to fluid ounces is 100 ÷ 29.5735 = 3.38 fl oz, neatly matching the TSA 3-1-1 travel rule.",
        practicalTip:
          "Containers exceeding 100 ml even if half-empty are confiscated at security checkpoints; carry dedicated 3.4 oz travel bottles.",
      },
    ];
  }

  // Universal Default Scenarios
  return [
    {
      id: "practical",
      category: "engineering",
      sectorName: "Industry & Trade",
      title: `Standard Technical Calibration (${fromName} to ${toName})`,
      description: `In engineering and international commerce, converting from ${fromName} (${fromSym}) to ${toName} (${toSym}) ensures compliance with bilateral trade specifications and ISO quality controls.`,
      exampleCalculation: `Applying the standard conversion formula converts source values into certified target units with full traceability.`,
      practicalTip: `Always use standardized metrological conversion factors rather than truncated approximations for manufacturing tolerances.`,
    },
    {
      id: "science",
      category: "science",
      sectorName: "Research & Academia",
      title: `Scientific Documentation & Publications`,
      description: `Academic journals adhere to SI metric conventions, necessitating clear conversion between localized regional units and international standard units.`,
      exampleCalculation: `Researchers document both the original instrument readout and the normalized SI equivalent in research papers.`,
      practicalTip: `Record raw instrument measurements before applying rounding formulas to maintain experimental reproducibility.`,
    },
    {
      id: "travel",
      category: "travel",
      sectorName: "Everyday & Global Life",
      title: `Cross-Border Commerce & Navigation`,
      description: `Global travelers, imported goods consumers, and digital remote workers regularly convert between differing national standards.`,
      exampleCalculation: `Directly inputting everyday values provides instantaneous parity without mental arithmetic guesswork.`,
      practicalTip: `Bookmark the live conversion tool for instant offline-ready access on mobile devices during travel.`,
    },
  ];
}
