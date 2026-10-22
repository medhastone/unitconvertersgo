import { Category, Unit } from "./types";

export interface SuperCategoryGroup {
  id: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  badgeClass: string;
  headerBgClass: string;
  categoryIds: string[];
}

export const SUPER_CATEGORIES: SuperCategoryGroup[] = [
  {
    id: "common",
    name: "Common Converters",
    shortName: "Common",
    description:
      "Everyday metric, imperial, and US customary converters for length, weight, volume, temperature, area, pressure, energy, speed, time, and data.",
    iconName: "Ruler",
    badgeClass:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/80 dark:border-teal-800",
    headerBgClass: "from-teal-500/10 to-emerald-500/5",
    categoryIds: [
      "length",
      "mass",
      "volume",
      "temperature",
      "area",
      "pressure",
      "energy",
      "volume_dry",
      "currency",
      "numbers",
      "power",
      "force",
      "time",
      "speed",
      "angle",
      "fuel_economy",
      "digital_storage",
    ],
  },
  {
    id: "engineering",
    name: "Engineering Converters",
    shortName: "Engineering",
    description:
      "Mechanical, structural, and rotational kinematics converters including angular velocity, linear and angular acceleration, density, specific volume, moment of inertia, moment of force, and torque.",
    iconName: "RotateCw",
    badgeClass:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800",
    headerBgClass: "from-blue-500/10 to-indigo-500/5",
    categoryIds: [
      "velocity_angular",
      "acceleration",
      "acceleration_angular",
      "density",
      "specific_volume",
      "moment_of_inertia",
      "moment_of_force",
      "torque",
    ],
  },
  {
    id: "heat",
    name: "Heat & Thermodynamics Converters",
    shortName: "Heat",
    description:
      "Thermal engineering and calorimetry calculators for mass/volume fuel efficiency, temperature intervals, thermal expansion, thermal resistance, conductivity, specific heat capacity, heat density, and heat transfer.",
    iconName: "Flame",
    badgeClass:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800",
    headerBgClass: "from-rose-500/10 to-orange-500/5",
    categoryIds: [
      "fuel_efficiency_mass",
      "fuel_efficiency_volume",
      "temperature_interval",
      "thermal_expansion",
      "thermal_resistance",
      "thermal_conductivity",
      "specific_heat_capacity",
      "heat_density",
      "heat_flux_density",
      "heat_transfer_coefficient",
    ],
  },
  {
    id: "fluids",
    name: "Fluids & Chemical Converters",
    shortName: "Fluids",
    description:
      "Fluid dynamics, rheology, and chemical process converters covering volumetric, mass, and molar flow rates, mass flux density, molar/solution concentration, dynamic/kinematic viscosity, surface tension, and permeability.",
    iconName: "Beaker",
    badgeClass:
      "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800",
    headerBgClass: "from-cyan-500/10 to-sky-500/5",
    categoryIds: [
      "flow",
      "flow_mass",
      "flow_molar",
      "mass_flux_density",
      "concentration_molar",
      "concentration_solution",
      "viscosity_dynamic",
      "viscosity_kinematic",
      "surface_tension",
      "permeability",
    ],
  },
  {
    id: "light",
    name: "Light & Optics Converters",
    shortName: "Light",
    description:
      "Photometry, radiometry, display resolution, and wave frequency calculators including luminance, luminous intensity, illumination (lux to foot-candles), digital image resolution, and frequency/wavelength.",
    iconName: "Sparkles",
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800",
    headerBgClass: "from-amber-500/10 to-yellow-500/5",
    categoryIds: [
      "luminance",
      "luminous_intensity",
      "illumination",
      "digital_image_resolution",
      "frequency",
    ],
  },
  {
    id: "electricity",
    name: "Electricity Converters",
    shortName: "Electricity",
    description:
      "Electrical engineering and electrostatic converters for charge, linear/surface/volume charge density, current, linear/surface current density, electric field, voltage potential, resistance, resistivity, conductance, conductivity, capacitance, and inductance.",
    iconName: "Zap",
    badgeClass:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800",
    headerBgClass: "from-indigo-500/10 to-violet-500/5",
    categoryIds: [
      "charge",
      "charge_linear",
      "charge_surface",
      "charge_volume",
      "current",
      "current_linear",
      "current_surface",
      "electric_field",
      "electric_potential",
      "resistance",
      "electric_resistivity",
      "electric_conductance",
      "electric_conductivity",
      "capacitance",
      "inductance",
    ],
  },
  {
    id: "magnetism",
    name: "Magnetism Converters",
    shortName: "Magnetism",
    description:
      "Electromagnetic field and flux calculators for magnetomotive force (ampere-turns to gilberts), magnetic field strength (A/m to oersteds), magnetic flux (webers to maxwells), and magnetic flux density (tesla to gauss).",
    iconName: "Compass",
    badgeClass:
      "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200/80 dark:border-violet-800",
    headerBgClass: "from-violet-500/10 to-purple-500/5",
    categoryIds: [
      "magnetomotive_force",
      "magnetic_field_strength",
      "magnetic_flux",
      "magnetic",
    ],
  },
  {
    id: "radiology",
    name: "Radiology & Dosimetry Converters",
    shortName: "Radiology",
    description:
      "Health physics and ionizing radiation converters for equivalent dose (sieverts to rem), radioactive activity (becquerels to curies), radiation exposure (roentgens to C/kg), and absorbed dose (grays to rad).",
    iconName: "Radio",
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800",
    headerBgClass: "from-emerald-500/10 to-teal-500/5",
    categoryIds: [
      "radiation",
      "radiation_activity",
      "radiation_exposure",
      "radiation_absorbed_dose",
    ],
  },
  {
    id: "other",
    name: "Other & Specialty Converters",
    shortName: "Other",
    description:
      "Specialized measurement calculators for SI metric prefixes, network data transfer rates, acoustic sound pressure, DTP/CSS typography units, and forestry lumber board-foot volume.",
    iconName: "Layers",
    badgeClass:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700",
    headerBgClass: "from-slate-500/10 to-slate-400/5",
    categoryIds: [
      "prefixes",
      "data_transfer",
      "sound",
      "typography",
      "volume_lumber",
    ],
  },
];

export const EXTENDED_CATEGORIES: Category[] = [
  // =========================================================================
  // 1. COMMON EXTENSIONS
  // =========================================================================
  {
    id: "volume_dry",
    name: "Volume - Dry",
    pluralName: "Dry Volume & Agricultural Capacity",
    baseUnitId: "dry_liter",
    iconName: "Beaker",
    description:
      "Convert agricultural and bulk dry volume measurements including US dry barrels, bushels, pecks, dry gallons, dry quarts, dry pints, liters, and cubic meters.",
    popularPairSlugs: [],
  },
  {
    id: "currency",
    name: "Currency",
    pluralName: "Global Currency Reference Rates",
    baseUnitId: "usd_ref",
    iconName: "Scale",
    description:
      "Convert major world currencies using standard benchmark reference exchange rates across USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, and INR.",
    popularPairSlugs: [],
  },
  {
    id: "numbers",
    name: "Numbers & Quantities",
    pluralName: "Number Magnitudes & Counting Units",
    baseUnitId: "num_unit",
    iconName: "Layers",
    description:
      "Convert between counting quantities and large number magnitudes including units, dozens, gross, thousands, millions, billions, trillions, lakhs, and crores.",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 2. ENGINEERING CONVERTERS
  // =========================================================================
  {
    id: "velocity_angular",
    name: "Velocity - Angular",
    pluralName: "Angular Velocity & Rotational Speed",
    baseUnitId: "rad_per_sec",
    iconName: "RotateCw",
    description:
      "Convert angular velocity and rotational speed between radians per second (rad/s), degrees per second (°/s), revolutions per minute (RPM), and revolutions per second (RPS).",
    popularPairSlugs: [],
  },
  {
    id: "acceleration",
    name: "Acceleration",
    pluralName: "Linear Acceleration & G-Force",
    baseUnitId: "m_per_s2",
    iconName: "Gauge",
    description:
      "Convert linear acceleration between meters per second squared (m/s²), standard gravity (g), feet per second squared (ft/s²), Gal (cm/s²), and inches per second squared.",
    popularPairSlugs: [],
  },
  {
    id: "acceleration_angular",
    name: "Acceleration - Angular",
    pluralName: "Angular Acceleration",
    baseUnitId: "rad_per_s2",
    iconName: "RotateCw",
    description:
      "Convert angular acceleration between radians per second squared (rad/s²), revolutions per minute per second (RPM/s), revolutions per second squared (rev/s²), and degrees per second squared (°/s²).",
    popularPairSlugs: [],
  },
  {
    id: "specific_volume",
    name: "Specific Volume",
    pluralName: "Specific Volume & Reciprocal Density",
    baseUnitId: "m3_per_kg",
    iconName: "Beaker",
    description:
      "Convert thermodynamic specific volume between cubic meters per kilogram (m³/kg), liters per kilogram (L/kg), cubic centimeters per gram (cm³/g), and cubic feet per pound (ft³/lb).",
    popularPairSlugs: [],
  },
  {
    id: "moment_of_inertia",
    name: "Moment of Inertia",
    pluralName: "Mass Moment of Inertia",
    baseUnitId: "kg_m2",
    iconName: "RotateCw",
    description:
      "Convert rotational mass moment of inertia between kilogram square meters (kg·m²), kilogram square centimeters (kg·cm²), gram square centimeters (g·cm²), pound square feet (lb·ft²), and slug square feet.",
    popularPairSlugs: [],
  },
  {
    id: "moment_of_force",
    name: "Moment of Force",
    pluralName: "Bending Moment & Moment of Force",
    baseUnitId: "mof_nm",
    iconName: "Flame",
    description:
      "Convert structural bending moment and moment of force between Newton-meters (N·m), kilonewton-meters (kN·m), pound-force feet (lbf·ft), pound-force inches (lbf·in), and kilogram-force meters (kgf·m).",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 3. HEAT CONVERTERS
  // =========================================================================
  {
    id: "fuel_efficiency_mass",
    name: "Fuel Efficiency - Mass",
    pluralName: "Specific Energy & Mass Fuel Heating Value",
    baseUnitId: "j_per_kg",
    iconName: "Flame",
    description:
      "Convert specific energy and mass fuel heating value between joules per kilogram (J/kg), kilojoules per kilogram (kJ/kg), megajoules per kilogram (MJ/kg), calories per gram (cal/g), and BTU per pound (BTU/lb).",
    popularPairSlugs: [],
  },
  {
    id: "fuel_efficiency_volume",
    name: "Fuel Efficiency - Volume",
    pluralName: "Volumetric Energy Density & Heating Value",
    baseUnitId: "j_per_m3",
    iconName: "Fuel",
    description:
      "Convert volumetric energy density and fuel heating value between joules per cubic meter (J/m³), megajoules per cubic meter (MJ/m³), megajoules per liter (MJ/L), BTU per cubic foot (BTU/ft³), and BTU per US gallon.",
    popularPairSlugs: [],
  },
  {
    id: "temperature_interval",
    name: "Temperature Interval",
    pluralName: "Temperature Difference & Delta-T Intervals",
    baseUnitId: "delta_kelvin",
    iconName: "Thermometer",
    description:
      "Convert temperature differences and thermal intervals (ΔT) between kelvin (ΔK), degrees Celsius interval (Δ°C), degrees Fahrenheit interval (Δ°F), and degrees Rankine interval (Δ°R).",
    popularPairSlugs: [],
  },
  {
    id: "thermal_expansion",
    name: "Thermal Expansion",
    pluralName: "Coefficient of Thermal Expansion",
    baseUnitId: "per_kelvin",
    iconName: "Thermometer",
    description:
      "Convert linear and volumetric thermal expansion coefficients between per kelvin (1/K), per degree Celsius (1/°C), per degree Fahrenheit (1/°F), and parts per million per kelvin (ppm/K).",
    popularPairSlugs: [],
  },
  {
    id: "thermal_resistance",
    name: "Thermal Resistance",
    pluralName: "Thermal Resistance & Insulation R-Value",
    baseUnitId: "kelvin_per_watt",
    iconName: "Flame",
    description:
      "Convert thermal resistance between kelvin per watt (K/W), degree Celsius per watt (°C/W), degree Fahrenheit hour per BTU (°F·h/BTU), and degree Fahrenheit second per BTU.",
    popularPairSlugs: [],
  },
  {
    id: "thermal_conductivity",
    name: "Thermal Conductivity",
    pluralName: "Thermal Conductivity (k-Value)",
    baseUnitId: "w_per_mk",
    iconName: "Flame",
    description:
      "Convert material thermal conductivity between watts per meter-kelvin (W/(m·K)), watts per centimeter-°C, calories per second-cm-°C, and BTU per hour-foot-°F.",
    popularPairSlugs: [],
  },
  {
    id: "specific_heat_capacity",
    name: "Specific Heat Capacity",
    pluralName: "Specific Heat Capacity",
    baseUnitId: "j_per_kgk",
    iconName: "Flame",
    description:
      "Convert specific heat capacity between joules per kilogram-kelvin (J/(kg·K)), kilojoules per kilogram-kelvin (kJ/(kg·K)), calories per gram-°C (cal/(g·°C)), and BTU per pound-°F (BTU/(lb·°F)).",
    popularPairSlugs: [],
  },
  {
    id: "heat_density",
    name: "Heat Density",
    pluralName: "Areal Heat Density & Fluence",
    baseUnitId: "j_per_m2",
    iconName: "Flame",
    description:
      "Convert surface heat density and energy fluence between joules per square meter (J/m²), kilojoules per square meter (kJ/m²), calories per square centimeter (langley), and BTU per square foot (BTU/ft²).",
    popularPairSlugs: [],
  },
  {
    id: "heat_flux_density",
    name: "Heat Flux Density",
    pluralName: "Heat Flux Density & Irradiance",
    baseUnitId: "w_per_m2",
    iconName: "Zap",
    description:
      "Convert thermal heat flux density and solar irradiance between watts per square meter (W/m²), kilowatts per square meter (kW/m²), watts per square centimeter (W/cm²), and BTU per hour-square foot.",
    popularPairSlugs: [],
  },
  {
    id: "heat_transfer_coefficient",
    name: "Heat Transfer Coefficient",
    pluralName: "Heat Transfer Coefficient (U-Value)",
    baseUnitId: "w_per_m2k",
    iconName: "Thermometer",
    description:
      "Convert convective and overall heat transfer coefficients (U-values) between watts per square meter-kelvin (W/(m²·K)), kilowatts per square meter-K, calories/s·cm²·°C, and BTU/(h·ft²·°F).",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 4. FLUIDS CONVERTERS
  // =========================================================================
  {
    id: "flow_mass",
    name: "Flow - Mass",
    pluralName: "Mass Flow Rate",
    baseUnitId: "kg_per_sec",
    iconName: "Beaker",
    description:
      "Convert fluid mass flow rates between kilograms per second (kg/s), kilograms per minute (kg/min), kilograms per hour (kg/h), grams per second (g/s), metric tons per hour (t/h), and pounds per hour (lb/h).",
    popularPairSlugs: [],
  },
  {
    id: "flow_molar",
    name: "Flow - Molar",
    pluralName: "Molar Flow Rate",
    baseUnitId: "mol_per_sec",
    iconName: "Beaker",
    description:
      "Convert chemical molar flow rates between moles per second (mol/s), kilomoles per second (kmol/s), kilomoles per hour (kmol/h), moles per minute (mol/min), millimoles per second, and pound-moles per hour.",
    popularPairSlugs: [],
  },
  {
    id: "mass_flux_density",
    name: "Mass Flux Density",
    pluralName: "Mass Flux Density",
    baseUnitId: "kg_per_sm2",
    iconName: "Layers",
    description:
      "Convert mass flux density between kilograms per second per square meter (kg/(s·m²)), kilograms per hour per square meter, grams per second per square centimeter, and pounds per hour per square foot.",
    popularPairSlugs: [],
  },
  {
    id: "concentration_molar",
    name: "Concentration - Molar",
    pluralName: "Molarity & Molar Concentration",
    baseUnitId: "mol_per_m3",
    iconName: "Beaker",
    description:
      "Convert chemical molarity and molar concentration between moles per cubic meter (mol/m³), moles per liter (M, mol/L), millimoles per liter (mmol/L), micromoles per liter (µmol/L), and kilomoles per cubic meter.",
    popularPairSlugs: [],
  },
  {
    id: "concentration_solution",
    name: "Concentration - Solution",
    pluralName: "Solution Mass Concentration",
    baseUnitId: "sol_kg_per_l",
    iconName: "Beaker",
    description:
      "Convert solution mass concentration between kilograms per liter (kg/L), grams per liter (g/L), milligrams per liter (mg/L), grams per 100 mL (% w/v), pounds per US gallon (lb/gal), and grains per gallon.",
    popularPairSlugs: [],
  },
  {
    id: "viscosity_dynamic",
    name: "Viscosity - Dynamic",
    pluralName: "Dynamic (Absolute) Viscosity",
    baseUnitId: "pascal_sec",
    iconName: "Beaker",
    description:
      "Convert dynamic (absolute) fluid viscosity between Pascal-seconds (Pa·s), millipascal-seconds (mPa·s), poise (P), centipoise (cP), pound per foot-second (lb/(ft·s)), and pound-force seconds per square foot.",
    popularPairSlugs: [],
  },
  {
    id: "viscosity_kinematic",
    name: "Viscosity - Kinematic",
    pluralName: "Kinematic Viscosity",
    baseUnitId: "m2_per_sec",
    iconName: "Beaker",
    description:
      "Convert kinematic fluid viscosity between square meters per second (m²/s), square millimeters per second (mm²/s), stokes (St), centistokes (cSt), and square feet per second (ft²/s).",
    popularPairSlugs: [],
  },
  {
    id: "surface_tension",
    name: "Surface Tension",
    pluralName: "Liquid Surface Tension",
    baseUnitId: "n_per_m",
    iconName: "Beaker",
    description:
      "Convert liquid interfacial surface tension between newtons per meter (N/m), millinewtons per meter (mN/m), dynes per centimeter (dyn/cm), ergs per square centimeter, and pound-force per inch (lbf/in).",
    popularPairSlugs: [],
  },
  {
    id: "permeability",
    name: "Permeability",
    pluralName: "Porous Media & Rock Permeability",
    baseUnitId: "perm_m2",
    iconName: "Layers",
    description:
      "Convert hydrogeological and petroleum rock permeability between square meters (m²), darcy (D), millidarcy (mD), microdarcy (µD), and square micrometers (µm²).",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 5. LIGHT CONVERTERS
  // =========================================================================
  {
    id: "luminance",
    name: "Luminance",
    pluralName: "Display & Surface Luminance",
    baseUnitId: "cd_per_m2",
    iconName: "Sparkles",
    description:
      "Convert photometric luminance and screen brightness between candelas per square meter (cd/m² / nits), kilocandelas per square meter, stilb (sb), lambert (L), foot-lambert (fL), and candelas per square foot.",
    popularPairSlugs: [],
  },
  {
    id: "luminous_intensity",
    name: "Luminous Intensity",
    pluralName: "Luminous Intensity (Candlepower)",
    baseUnitId: "candela_unit",
    iconName: "Sparkles",
    description:
      "Convert luminous intensity between candelas (cd), millicandelas (mcd), kilocandelas (kcd), lumens per steradian (lm/sr), and Hefnerkerze (HK).",
    popularPairSlugs: [],
  },
  {
    id: "illumination",
    name: "Illumination",
    pluralName: "Illuminance & Light Level",
    baseUnitId: "lux_unit",
    iconName: "Sparkles",
    description:
      "Convert incident light illuminance between lux (lx), kilolux (klx), millilux (mlx), foot-candles (fc), phot (ph), nox, and lumens per square meter (lm/m²).",
    popularPairSlugs: [],
  },
  {
    id: "digital_image_resolution",
    name: "Digital Image Resolution",
    pluralName: "Image Print & Pixel Resolution",
    baseUnitId: "dot_per_meter",
    iconName: "Square",
    description:
      "Convert digital image and print resolution between dots per inch (DPI), pixels per inch (PPI), dots per centimeter (dpcm), dots per millimeter (dpmm), and pixels per meter.",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 6. ELECTRICITY CONVERTERS
  // =========================================================================
  {
    id: "charge_linear",
    name: "Linear Charge Density",
    pluralName: "Linear Electric Charge Density",
    baseUnitId: "c_per_m",
    iconName: "Zap",
    description:
      "Convert linear electric charge density between coulombs per meter (C/m), millicoulombs per meter (mC/m), microcoulombs per meter (µC/m), coulombs per centimeter (C/cm), and coulombs per inch (C/in).",
    popularPairSlugs: [],
  },
  {
    id: "charge_surface",
    name: "Surface Charge Density",
    pluralName: "Surface Electric Charge Density",
    baseUnitId: "c_per_m2",
    iconName: "Zap",
    description:
      "Convert surface electric charge density between coulombs per square meter (C/m²), millicoulombs per square meter (mC/m²), microcoulombs per square meter (µC/m²), coulombs per square centimeter, and coulombs per square inch.",
    popularPairSlugs: [],
  },
  {
    id: "charge_volume",
    name: "Volume Charge Density",
    pluralName: "Volumetric Electric Charge Density",
    baseUnitId: "c_per_m3",
    iconName: "Zap",
    description:
      "Convert volumetric electric charge density between coulombs per cubic meter (C/m³), millicoulombs per cubic meter (mC/m³), microcoulombs per cubic meter (µC/m³), coulombs per cubic centimeter, and coulombs per cubic inch.",
    popularPairSlugs: [],
  },
  {
    id: "current_linear",
    name: "Linear Current Density",
    pluralName: "Linear Electric Current Density",
    baseUnitId: "a_per_m",
    iconName: "Zap",
    description:
      "Convert linear electric current density between amperes per meter (A/m), amperes per centimeter (A/cm), amperes per inch (A/in), milliamperes per meter (mA/m), and oersteds (Oe).",
    popularPairSlugs: [],
  },
  {
    id: "current_surface",
    name: "Surface Current Density",
    pluralName: "Areal Current Density",
    baseUnitId: "a_per_m2",
    iconName: "Zap",
    description:
      "Convert surface (areal) current density between amperes per square meter (A/m²), kiloamperes per square meter (kA/m²), amperes per square centimeter (A/cm²), amperes per square millimeter (A/mm²), and amperes per square inch.",
    popularPairSlugs: [],
  },
  {
    id: "electric_field",
    name: "Electric Field Strength",
    pluralName: "Electric Field Strength",
    baseUnitId: "v_per_m",
    iconName: "Zap",
    description:
      "Convert electric field strength between volts per meter (V/m), kilovolts per meter (kV/m), kilovolts per centimeter (kV/cm), volts per centimeter (V/cm), volts per millimeter (V/mm), volts per inch (V/in), and newtons per coulomb (N/C).",
    popularPairSlugs: [],
  },
  {
    id: "electric_potential",
    name: "Electric Potential",
    pluralName: "Voltage & Electric Potential",
    baseUnitId: "volt_unit",
    iconName: "Zap",
    description:
      "Convert electrical potential difference and voltage between volts (V), millivolts (mV), microvolts (µV), kilovolts (kV), megavolts (MV), watts per ampere (W/A), abvolts, and statvolts.",
    popularPairSlugs: [],
  },
  {
    id: "electric_resistivity",
    name: "Electric Resistivity",
    pluralName: "Electrical Resistivity",
    baseUnitId: "ohm_meter",
    iconName: "Activity",
    description:
      "Convert material electrical resistivity between ohm-meters (Ω·m), ohm-centimeters (Ω·cm), microhm-centimeters (µΩ·cm), microhm-inches (µΩ·in), and ohm square millimeter per meter (Ω·mm²/m).",
    popularPairSlugs: [],
  },
  {
    id: "electric_conductance",
    name: "Electric Conductance",
    pluralName: "Electrical Conductance",
    baseUnitId: "siemens_unit",
    iconName: "Activity",
    description:
      "Convert electrical conductance between siemens (S), millisiemens (mS), microsiemens (µS), kilosiemens (kS), and mho (℧).",
    popularPairSlugs: [],
  },
  {
    id: "electric_conductivity",
    name: "Electric Conductivity",
    pluralName: "Electrical & Water Conductivity",
    baseUnitId: "s_per_m",
    iconName: "Activity",
    description:
      "Convert electrical and water quality conductivity between siemens per meter (S/m), millisiemens per meter (mS/m), microsiemens per centimeter (µS/cm), millisiemens per centimeter (mS/cm), megasiemens per meter (MS/m), and % IACS.",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 7. MAGNETISM CONVERTERS
  // =========================================================================
  {
    id: "magnetomotive_force",
    name: "Magnetomotive Force",
    pluralName: "Magnetomotive Force (MMF)",
    baseUnitId: "ampere_turn",
    iconName: "Compass",
    description:
      "Convert magnetomotive force (MMF) between ampere-turns (At), kiloampere-turns (kAt), milliampere-turns (mAt), gilberts (Gb), and abampere-turns.",
    popularPairSlugs: [],
  },
  {
    id: "magnetic_field_strength",
    name: "Magnetic Field Strength",
    pluralName: "Magnetic Field Strength (H-Field)",
    baseUnitId: "h_a_per_m",
    iconName: "Compass",
    description:
      "Convert magnetizing field strength (H-field) between amperes per meter (A/m), kiloamperes per meter (kA/m), oersteds (Oe), ampere-turns per meter (At/m), and gilberts per centimeter.",
    popularPairSlugs: [],
  },
  {
    id: "magnetic_flux",
    name: "Magnetic Flux",
    pluralName: "Magnetic Flux",
    baseUnitId: "weber_unit",
    iconName: "Compass",
    description:
      "Convert total magnetic flux between webers (Wb), milliwebers (mWb), microwebers (µWb), maxwells (Mx), kilolines, and volt-seconds (V·s).",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 8. RADIOLOGY CONVERTERS
  // =========================================================================
  {
    id: "radiation",
    name: "Radiation",
    pluralName: "Radiation Equivalent Dose",
    baseUnitId: "sievert_unit",
    iconName: "Radio",
    description:
      "Convert ionizing radiation dose equivalent between sieverts (Sv), millisieverts (mSv), microsieverts (µSv), rem, millirem (mrem), and joules per kilogram (J/kg).",
    popularPairSlugs: [],
  },
  {
    id: "radiation_activity",
    name: "Radiation-Activity",
    pluralName: "Radioactive Decay Activity",
    baseUnitId: "becquerel_unit",
    iconName: "Radio",
    description:
      "Convert radioactive source activity between becquerels (Bq), kilobecquerels (kBq), megabecquerels (MBq), gigabecquerels (GBq), curies (Ci), millicuries (mCi), microcuries (µCi), and rutherfords (Rd).",
    popularPairSlugs: [],
  },
  {
    id: "radiation_exposure",
    name: "Radiation-Exposure",
    pluralName: "Ionizing Radiation Exposure",
    baseUnitId: "c_per_kg_rad",
    iconName: "Radio",
    description:
      "Convert X-ray and gamma radiation air-ionization exposure between coulombs per kilogram (C/kg), millicoulombs per kilogram (mC/kg), microcoulombs per kilogram (µC/kg), roentgens (R), and milliroentgens (mR).",
    popularPairSlugs: [],
  },
  {
    id: "radiation_absorbed_dose",
    name: "Radiation-Absorbed Dose",
    pluralName: "Radiation Absorbed Dose",
    baseUnitId: "gray_unit",
    iconName: "Radio",
    description:
      "Convert ionizing radiation absorbed dose between grays (Gy), milligrays (mGy), centigrays (cGy), micrograys (µGy), rads, millirads (mrad), and ergs per gram.",
    popularPairSlugs: [],
  },

  // =========================================================================
  // 9. OTHER CONVERTERS
  // =========================================================================
  {
    id: "prefixes",
    name: "Prefixes",
    pluralName: "SI Metric Prefixes & Powers of Ten",
    baseUnitId: "prefix_none",
    iconName: "Layers",
    description:
      "Convert numbers across official BIPM SI metric prefixes from quetta (10³⁰), yotta (10²⁴), tera (10¹²), giga (10⁹), mega (10⁶), and kilo (10³) to milli (10⁻³), micro (10⁻⁶), nano (10⁻⁹), and pico (10⁻¹²).",
    popularPairSlugs: [],
  },
  {
    id: "sound",
    name: "Sound",
    pluralName: "Acoustic Sound Pressure",
    baseUnitId: "sound_pa",
    iconName: "Radio",
    description:
      "Convert acoustic sound wave pressure between Pascals (Pa), millipascals (mPa), micropascals (µPa, 20 µPa human hearing reference), dynes per square centimeter (barye), and microbars.",
    popularPairSlugs: [],
  },
  {
    id: "typography",
    name: "Typography",
    pluralName: "Typography, Print & CSS Length Units",
    baseUnitId: "typo_point",
    iconName: "Ruler",
    description:
      "Convert desktop publishing, print, and web CSS typography units between PostScript points (pt), picas (pc), CSS pixels (px at 96 DPI), twips, millimeters, centimeters, inches, and Didot points.",
    popularPairSlugs: [],
  },
  {
    id: "volume_lumber",
    name: "Volume - Lumber",
    pluralName: "Lumber & Forestry Timber Volume",
    baseUnitId: "board_foot_lumber",
    iconName: "Square",
    description:
      "Convert timber and lumber volume between board feet (FBM / bd ft), thousand board feet (MBF), cubic feet (ft³), cubic meters (m³), cubic inches (in³), and firewood cords.",
    popularPairSlugs: [],
  },
];

export const EXTENDED_UNITS: Unit[] = [
  // --- VOLUME - DRY (Base: dry_liter) ---
  { id: "dry_liter", name: "Liter (Dry)", plural: "Liters (Dry)", symbol: "L", categoryId: "volume_dry", system: "metric", aliases: [], toBase: 1, description: "Metric liter equal to 0.001 m³." },
  { id: "us_bushel", name: "US Bushel", plural: "US Bushels", symbol: "bu (US)", categoryId: "volume_dry", system: "us_customary", aliases: ["bushels"], toBase: 35.23907016688, description: "Standard US agricultural bushel (2,150.42 in³ ≈ 35.239 L)." },
  { id: "uk_bushel", name: "Imperial Bushel (UK)", plural: "Imperial Bushels", symbol: "bu (UK)", categoryId: "volume_dry", system: "imperial", aliases: [], toBase: 36.36872, description: "UK Imperial bushel equal to 8 Imperial gallons (36.36872 L)." },
  { id: "us_peck", name: "US Peck", plural: "US Pecks", symbol: "pk (US)", categoryId: "volume_dry", system: "us_customary", aliases: ["peck", "pecks"], toBase: 8.80976754172, description: "Quarter of a US bushel (8 dry quarts ≈ 8.810 L)." },
  { id: "us_dry_gallon", name: "US Dry Gallon", plural: "US Dry Gallons", symbol: "dry gal", categoryId: "volume_dry", system: "us_customary", aliases: [], toBase: 4.40488377086, description: "1/8 of a US bushel (4.40488 L)." },
  { id: "us_dry_quart", name: "US Dry Quart", plural: "US Dry Quarts", symbol: "dry qt", categoryId: "volume_dry", system: "us_customary", aliases: [], toBase: 1.101220942715, description: "1/32 of a US bushel (1.10122 L)." },
  { id: "us_dry_pint", name: "US Dry Pint", plural: "US Dry Pints", symbol: "dry pt", categoryId: "volume_dry", system: "us_customary", aliases: [], toBase: 0.5506104713575, description: "1/64 of a US bushel (0.55061 L)." },
  { id: "us_dry_barrel", name: "US Dry Barrel", plural: "US Dry Barrels", symbol: "dry bbl", categoryId: "volume_dry", system: "us_customary", aliases: [], toBase: 115.627123584, description: "Standard US dry commodity barrel (7,056 in³ ≈ 115.627 L)." },
  { id: "dry_cubic_meter", name: "Cubic Meter (Dry)", plural: "Cubic Meters (Dry)", symbol: "m³", categoryId: "volume_dry", system: "si", aliases: [], toBase: 1000, description: "SI volume unit equal to 1,000 liters." },

  // --- CURRENCY REFERENCE (Base: usd_ref) ---
  { id: "usd_ref", name: "US Dollar", plural: "US Dollars", symbol: "USD", categoryId: "currency", system: "other", aliases: ["usd", "dollars"], toBase: 1, description: "United States Dollar reference benchmark." },
  { id: "eur_ref", name: "Euro", plural: "Euros", symbol: "EUR", categoryId: "currency", system: "other", aliases: ["eur", "euros"], toBase: 1.08, description: "European Union Euro benchmark rate." },
  { id: "gbp_ref", name: "British Pound Sterling", plural: "British Pounds", symbol: "GBP", categoryId: "currency", system: "other", aliases: ["gbp"], toBase: 1.27, description: "United Kingdom Pound Sterling benchmark rate." },
  { id: "jpy_ref", name: "Japanese Yen", plural: "Japanese Yen", symbol: "JPY", categoryId: "currency", system: "other", aliases: ["jpy", "yen"], toBase: 0.0066, description: "Japanese Yen benchmark rate." },
  { id: "cad_ref", name: "Canadian Dollar", plural: "Canadian Dollars", symbol: "CAD", categoryId: "currency", system: "other", aliases: ["cad"], toBase: 0.73, description: "Canadian Dollar benchmark rate." },
  { id: "aud_ref", name: "Australian Dollar", plural: "Australian Dollars", symbol: "AUD", categoryId: "currency", system: "other", aliases: ["aud"], toBase: 0.66, description: "Australian Dollar benchmark rate." },
  { id: "chf_ref", name: "Swiss Franc", plural: "Swiss Francs", symbol: "CHF", categoryId: "currency", system: "other", aliases: ["chf"], toBase: 1.13, description: "Swiss Franc benchmark rate." },
  { id: "inr_ref", name: "Indian Rupee", plural: "Indian Rupees", symbol: "INR", categoryId: "currency", system: "other", aliases: ["inr", "rupees"], toBase: 0.012, description: "Indian Rupee benchmark rate." },

  // --- NUMBERS & QUANTITIES (Base: num_unit) ---
  { id: "num_unit", name: "Unit (One)", plural: "Units (Ones)", symbol: "1", categoryId: "numbers", system: "other", aliases: ["ones"], toBase: 1, description: "Single base unit (10⁰ = 1)." },
  { id: "dozen", name: "Dozen", plural: "Dozens", symbol: "doz", categoryId: "numbers", system: "other", aliases: ["dozens"], toBase: 12, description: "Group of 12 items." },
  { id: "gross", name: "Gross", plural: "Gross", symbol: "gr", categoryId: "numbers", system: "other", aliases: ["twelve dozen"], toBase: 144, description: "12 dozen (144 items)." },
  { id: "thousand", name: "Thousand", plural: "Thousands", symbol: "K", categoryId: "numbers", system: "other", aliases: ["thousands"], toBase: 1e3, description: "1,000 (10³)." },
  { id: "lakh", name: "Lakh", plural: "Lakhs", symbol: "lakh", categoryId: "numbers", system: "other", aliases: ["lakhs"], toBase: 1e5, description: "South Asian numbering unit equal to 100,000 (10⁵)." },
  { id: "million", name: "Million", plural: "Millions", symbol: "M", categoryId: "numbers", system: "other", aliases: ["millions"], toBase: 1e6, description: "1,000,000 (10⁶)." },
  { id: "crore", name: "Crore", plural: "Crores", symbol: "cr", categoryId: "numbers", system: "other", aliases: ["crores"], toBase: 1e7, description: "South Asian numbering unit equal to 10,000,000 (100 lakhs = 10⁷)." },
  { id: "billion", name: "Billion", plural: "Billions", symbol: "B", categoryId: "numbers", system: "other", aliases: ["billions"], toBase: 1e9, description: "1,000,000,000 (10⁹)." },
  { id: "trillion", name: "Trillion", plural: "Trillions", symbol: "T", categoryId: "numbers", system: "other", aliases: ["trillions"], toBase: 1e12, description: "1,000,000,000,000 (10¹²)." },

  // --- VELOCITY - ANGULAR (Base: rad_per_sec) ---
  { id: "rad_per_sec", name: "Radian per Second", plural: "Radians per Second", symbol: "rad/s", categoryId: "velocity_angular", system: "si", aliases: ["rad/sec"], toBase: 1, description: "SI unit of angular velocity." },
  { id: "deg_per_sec", name: "Degree per Second", plural: "Degrees per Second", symbol: "°/s", categoryId: "velocity_angular", system: "other", aliases: ["deg/s"], toBase: Math.PI / 180, description: "Angular rotation of 1 degree per second (π/180 rad/s)." },
  { id: "rev_per_min", name: "Revolution per Minute", plural: "Revolutions per Minute", symbol: "r/min", categoryId: "velocity_angular", system: "other", aliases: ["rpm angular"], toBase: (2 * Math.PI) / 60, description: "One full rotation per minute (2π/60 ≈ 0.10472 rad/s)." },
  { id: "rev_per_sec", name: "Revolution per Second", plural: "Revolutions per Second", symbol: "r/s", categoryId: "velocity_angular", system: "other", aliases: ["rps"], toBase: 2 * Math.PI, description: "One full rotation per second (2π ≈ 6.28319 rad/s)." },
  { id: "rev_per_hour", name: "Revolution per Hour", plural: "Revolutions per Hour", symbol: "r/h", categoryId: "velocity_angular", system: "other", aliases: [], toBase: (2 * Math.PI) / 3600, description: "One full rotation per hour." },

  // --- ACCELERATION (Base: m_per_s2) ---
  { id: "m_per_s2", name: "Meter per Second Squared", plural: "Meters per Second Squared", symbol: "m/s²", categoryId: "acceleration", system: "si", aliases: ["m/s2"], toBase: 1, description: "Coherent SI unit of linear acceleration." },
  { id: "g_accel", name: "Standard Gravity", plural: "Standard Gravity (g)", symbol: "g", categoryId: "acceleration", system: "other", aliases: ["g-force", "g_n"], toBase: 9.80665, description: "Nominal Earth gravitational acceleration (9.80665 m/s²)." },
  { id: "ft_per_s2", name: "Foot per Second Squared", plural: "Feet per Second Squared", symbol: "ft/s²", categoryId: "acceleration", system: "us_customary", aliases: ["ft/s2"], toBase: 0.3048, description: "Imperial & US customary acceleration unit (0.3048 m/s²)." },
  { id: "in_per_s2", name: "Inch per Second Squared", plural: "Inches per Second Squared", symbol: "in/s²", categoryId: "acceleration", system: "us_customary", aliases: ["in/s2"], toBase: 0.0254, description: "Equal to 0.0254 m/s²." },
  { id: "galileo", name: "Gal (Galileo)", plural: "Gals", symbol: "Gal", categoryId: "acceleration", system: "metric", aliases: ["cm/s2"], toBase: 0.01, description: "CGS gravimetry unit equal to 1 cm/s² (0.01 m/s²)." },

  // --- ACCELERATION - ANGULAR (Base: rad_per_s2) ---
  { id: "rad_per_s2", name: "Radian per Second Squared", plural: "Radians per Second Squared", symbol: "rad/s²", categoryId: "acceleration_angular", system: "si", aliases: ["rad/s2"], toBase: 1, description: "SI unit of angular acceleration." },
  { id: "deg_per_s2", name: "Degree per Second Squared", plural: "Degrees per Second Squared", symbol: "°/s²", categoryId: "acceleration_angular", system: "other", aliases: ["deg/s2"], toBase: Math.PI / 180, description: "Equal to π/180 rad/s²." },
  { id: "rev_per_s2", name: "Revolution per Second Squared", plural: "Revolutions per Second Squared", symbol: "r/s²", categoryId: "acceleration_angular", system: "other", aliases: ["rev/s2"], toBase: 2 * Math.PI, description: "Equal to 2π rad/s² (6.283185 rad/s²)." },
  { id: "rev_per_min_s", name: "Revolution per Minute per Second", plural: "RPM per Second", symbol: "RPM/s", categoryId: "acceleration_angular", system: "other", aliases: ["rpm/s"], toBase: (2 * Math.PI) / 60, description: "Change of 1 RPM every second (≈ 0.10472 rad/s²)." },

  // --- SPECIFIC VOLUME (Base: m3_per_kg) ---
  { id: "m3_per_kg", name: "Cubic Meter per Kilogram", plural: "Cubic Meters per Kilogram", symbol: "m³/kg", categoryId: "specific_volume", system: "si", aliases: ["m3/kg"], toBase: 1, description: "SI unit of specific volume (reciprocal of density)." },
  { id: "l_per_kg", name: "Liter per Kilogram", plural: "Liters per Kilogram", symbol: "L/kg", categoryId: "specific_volume", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 m³/kg." },
  { id: "cm3_per_g", name: "Cubic Centimeter per Gram", plural: "Cubic Centimeters per Gram", symbol: "cm³/g", categoryId: "specific_volume", system: "metric", aliases: ["cc/g", "ml/g"], toBase: 0.001, description: "CGS specific volume equal to 0.001 m³/kg." },
  { id: "ft3_per_lb", name: "Cubic Foot per Pound", plural: "Cubic Feet per Pound", symbol: "ft³/lb", categoryId: "specific_volume", system: "us_customary", aliases: ["ft3/lb"], toBase: 0.0624279606, description: "Imperial/US thermodynamic specific volume unit (≈ 0.062428 m³/kg)." },
  { id: "gal_us_per_lb", name: "US Gallon per Pound", plural: "US Gallons per Pound", symbol: "gal/lb", categoryId: "specific_volume", system: "us_customary", aliases: [], toBase: 0.00834540445, description: "Equal to 3.785411784 L per 0.45359237 kg." },

  // --- MOMENT OF INERTIA (Base: kg_m2) ---
  { id: "kg_m2", name: "Kilogram Square Meter", plural: "Kilogram Square Meters", symbol: "kg·m²", categoryId: "moment_of_inertia", system: "si", aliases: ["kg m2"], toBase: 1, description: "Coherent SI unit of mass moment of inertia." },
  { id: "kg_cm2", name: "Kilogram Square Centimeter", plural: "Kilogram Square Centimeters", symbol: "kg·cm²", categoryId: "moment_of_inertia", system: "metric", aliases: ["kg cm2"], toBase: 1e-4, description: "Equal to 0.0001 kg·m²." },
  { id: "g_cm2", name: "Gram Square Centimeter", plural: "Gram Square Centimeters", symbol: "g·cm²", categoryId: "moment_of_inertia", system: "metric", aliases: ["g cm2"], toBase: 1e-7, description: "Equal to 10⁻⁷ kg·m²." },
  { id: "lb_ft2", name: "Pound Square Foot", plural: "Pound Square Feet", symbol: "lb·ft²", categoryId: "moment_of_inertia", system: "us_customary", aliases: ["lb ft2"], toBase: 0.0421401101, description: "US customary rotational inertia unit (0.04214 kg·m²)." },
  { id: "lb_in2", name: "Pound Square Inch", plural: "Pound Square Inches", symbol: "lb·in²", categoryId: "moment_of_inertia", system: "us_customary", aliases: ["lb in2"], toBase: 0.000292639653, description: "Equal to 2.9264×10⁻⁴ kg·m²." },
  { id: "slug_ft2", name: "Slug Square Foot", plural: "Slug Square Feet", symbol: "slug·ft²", categoryId: "moment_of_inertia", system: "us_customary", aliases: ["slug ft2"], toBase: 1.3558179619, description: "Gravitational imperial moment of inertia unit (1.35582 kg·m²)." },

  // --- MOMENT OF FORCE (Base: mof_nm) ---
  { id: "mof_nm", name: "Newton Meter", plural: "Newton Meters", symbol: "N·m", categoryId: "moment_of_force", system: "si", aliases: [], toBase: 1, description: "SI unit of moment of force." },
  { id: "mof_knm", name: "Kilonewton Meter", plural: "Kilonewton Meters", symbol: "kN·m", categoryId: "moment_of_force", system: "si", aliases: ["knm"], toBase: 1000, description: "Structural engineering bending moment unit (1,000 N·m)." },
  { id: "mof_lbf_ft", name: "Pound-force Foot", plural: "Pound-force Feet", symbol: "lbf·ft", categoryId: "moment_of_force", system: "us_customary", aliases: [], toBase: 1.35581794833, description: "Equal to 1.35582 N·m." },
  { id: "mof_lbf_in", name: "Pound-force Inch", plural: "Pound-force Inches", symbol: "lbf·in", categoryId: "moment_of_force", system: "us_customary", aliases: [], toBase: 0.112984829, description: "Equal to 0.112985 N·m." },
  { id: "mof_kgf_m", name: "Kilogram-force Meter", plural: "Kilogram-force Meters", symbol: "kgf·m", categoryId: "moment_of_force", system: "metric", aliases: [], toBase: 9.80665, description: "Equal to 9.80665 N·m." },
  { id: "dyne_cm", name: "Dyne Centimeter", plural: "Dyne Centimeters", symbol: "dyn·cm", categoryId: "moment_of_force", system: "metric", aliases: [], toBase: 1e-7, description: "CGS moment of force equal to 10⁻⁷ N·m." },

  // --- FUEL EFFICIENCY - MASS (Base: j_per_kg) ---
  { id: "j_per_kg", name: "Joule per Kilogram", plural: "Joules per Kilogram", symbol: "J/kg", categoryId: "fuel_efficiency_mass", system: "si", aliases: [], toBase: 1, description: "SI unit of specific energy." },
  { id: "kj_per_kg", name: "Kilojoule per Kilogram", plural: "Kilojoules per Kilogram", symbol: "kJ/kg", categoryId: "fuel_efficiency_mass", system: "metric", aliases: ["kj/kg"], toBase: 1000, description: "Equal to 1,000 J/kg." },
  { id: "mj_per_kg", name: "Megajoule per Kilogram", plural: "Megajoules per Kilogram", symbol: "MJ/kg", categoryId: "fuel_efficiency_mass", system: "metric", aliases: ["mj/kg"], toBase: 1e6, description: "Standard fuel heating value unit (1,000,000 J/kg)." },
  { id: "cal_per_g", name: "Calorie (IT) per Gram", plural: "Calories per Gram", symbol: "cal/g", categoryId: "fuel_efficiency_mass", system: "metric", aliases: ["kcal/kg"], toBase: 4186.8, description: "Equal to 4,186.8 J/kg (1 kcal/kg)." },
  { id: "btu_per_lb", name: "BTU per Pound", plural: "BTUs per Pound", symbol: "BTU/lb", categoryId: "fuel_efficiency_mass", system: "us_customary", aliases: ["btu/lb"], toBase: 2326, description: "Imperial/US fuel specific heating value (1 BTU/lb = 2,326 J/kg)." },

  // --- FUEL EFFICIENCY - VOLUME (Base: j_per_m3) ---
  { id: "j_per_m3", name: "Joule per Cubic Meter", plural: "Joules per Cubic Meter", symbol: "J/m³", categoryId: "fuel_efficiency_volume", system: "si", aliases: [], toBase: 1, description: "SI unit of volumetric energy density." },
  { id: "mj_per_m3", name: "Megajoule per Cubic Meter", plural: "Megajoules per Cubic Meter", symbol: "MJ/m³", categoryId: "fuel_efficiency_volume", system: "metric", aliases: ["mj/m3"], toBase: 1e6, description: "Standard natural gas heating value unit (10⁶ J/m³)." },
  { id: "kj_per_liter", name: "Kilojoule per Liter", plural: "Kilojoules per Liter", symbol: "kJ/L", categoryId: "fuel_efficiency_volume", system: "metric", aliases: [], toBase: 1e6, description: "Equal to 1 MJ/m³ (1,000,000 J/m³)." },
  { id: "mj_per_liter", name: "Megajoule per Liter", plural: "Megajoules per Liter", symbol: "MJ/L", categoryId: "fuel_efficiency_volume", system: "metric", aliases: ["mj/l"], toBase: 1e9, description: "Liquid fuel energy density unit (10⁹ J/m³)." },
  { id: "btu_per_ft3", name: "BTU per Cubic Foot", plural: "BTUs per Cubic Foot", symbol: "BTU/ft³", categoryId: "fuel_efficiency_volume", system: "us_customary", aliases: ["btu/ft3"], toBase: 37258.9458, description: "US gas heating value unit (≈ 37.259 kJ/m³)." },
  { id: "btu_per_gal_us", name: "BTU per US Gallon", plural: "BTUs per US Gallon", symbol: "BTU/gal", categoryId: "fuel_efficiency_volume", system: "us_customary", aliases: [], toBase: 278716.28, description: "US liquid fuel energy content unit." },

  // --- TEMPERATURE INTERVAL (Base: delta_kelvin) ---
  { id: "delta_kelvin", name: "Kelvin Interval", plural: "Kelvins (Interval)", symbol: "ΔK", categoryId: "temperature_interval", system: "si", aliases: ["kelvin interval"], toBase: 1, description: "SI thermodynamic temperature difference of 1 K." },
  { id: "delta_celsius", name: "Degree Celsius Interval", plural: "Degrees Celsius (Interval)", symbol: "Δ°C", categoryId: "temperature_interval", system: "metric", aliases: ["celsius interval", "deg c interval"], toBase: 1, description: "Temperature difference of 1 °C (equal in magnitude to 1 K)." },
  { id: "delta_fahrenheit", name: "Degree Fahrenheit Interval", plural: "Degrees Fahrenheit (Interval)", symbol: "Δ°F", categoryId: "temperature_interval", system: "us_customary", aliases: ["fahrenheit interval", "deg f interval"], toBase: 5 / 9, description: "Temperature difference of 1 °F (equal to 5/9 Δ°C or 0.5556 ΔK)." },
  { id: "delta_rankine", name: "Degree Rankine Interval", plural: "Degrees Rankine (Interval)", symbol: "Δ°R", categoryId: "temperature_interval", system: "us_customary", aliases: ["rankine interval"], toBase: 5 / 9, description: "Temperature difference of 1 °R (equal to 5/9 ΔK)." },

  // --- THERMAL EXPANSION (Base: per_kelvin) ---
  { id: "per_kelvin", name: "Length/Length per Kelvin", plural: "Per Kelvin (1/K)", symbol: "1/K", categoryId: "thermal_expansion", system: "si", aliases: ["k-1"], toBase: 1, description: "SI fractional thermal expansion per kelvin." },
  { id: "per_celsius", name: "Length/Length per Degree Celsius", plural: "Per Degree Celsius (1/°C)", symbol: "1/°C", categoryId: "thermal_expansion", system: "metric", aliases: ["1/c"], toBase: 1, description: "Fractional thermal expansion per degree Celsius." },
  { id: "per_fahrenheit", name: "Length/Length per Degree Fahrenheit", plural: "Per Degree Fahrenheit (1/°F)", symbol: "1/°F", categoryId: "thermal_expansion", system: "us_customary", aliases: ["1/f"], toBase: 1.8, description: "Fractional expansion per °F (1/°F = 1.8 × 1/°C)." },
  { id: "ppm_per_k", name: "Micrometer per Meter-Kelvin (ppm/K)", plural: "ppm per Kelvin (µm/(m·K))", symbol: "ppm/K", categoryId: "thermal_expansion", system: "metric", aliases: ["ppm/c"], toBase: 1e-6, description: "Engineering thermal expansion unit (10⁻⁶ /K)." },
  { id: "ppm_per_f", name: "Microinch per Inch-°F (ppm/°F)", plural: "ppm per °F (µin/(in·°F))", symbol: "ppm/°F", categoryId: "thermal_expansion", system: "us_customary", aliases: [], toBase: 1.8e-6, description: "US engineering expansion unit (1.8×10⁻⁶ /K)." },

  // --- THERMAL RESISTANCE (Base: kelvin_per_watt) ---
  { id: "kelvin_per_watt", name: "Kelvin per Watt", plural: "Kelvins per Watt", symbol: "K/W", categoryId: "thermal_resistance", system: "si", aliases: ["k/w"], toBase: 1, description: "SI unit of absolute thermal resistance." },
  { id: "celsius_per_watt", name: "Degree Celsius per Watt", plural: "Degrees Celsius per Watt", symbol: "°C/W", categoryId: "thermal_resistance", system: "metric", aliases: ["c/w"], toBase: 1, description: "Electronics heatsink thermal resistance unit (1 °C/W = 1 K/W)." },
  { id: "f_hr_per_btu", name: "Degree Fahrenheit Hour per BTU", plural: "°F·hr/BTU", symbol: "°F·h/BTU", categoryId: "thermal_resistance", system: "us_customary", aliases: [], toBase: 1.89563424, description: "US thermal resistance unit (≈ 1.8956 K/W)." },
  { id: "f_sec_per_btu", name: "Degree Fahrenheit Second per BTU", plural: "°F·s/BTU", symbol: "°F·s/BTU", categoryId: "thermal_resistance", system: "us_customary", aliases: [], toBase: 0.000526565, description: "Equal to 1/3600 °F·h/BTU." },

  // --- THERMAL CONDUCTIVITY (Base: w_per_mk) ---
  { id: "w_per_mk", name: "Watt per Meter-Kelvin", plural: "Watts per Meter-Kelvin", symbol: "W/(m·K)", categoryId: "thermal_conductivity", system: "si", aliases: ["w/mk"], toBase: 1, description: "Coherent SI unit of thermal conductivity." },
  { id: "w_per_cmc", name: "Watt per Centimeter-°C", plural: "Watts per Centimeter-°C", symbol: "W/(cm·°C)", categoryId: "thermal_conductivity", system: "metric", aliases: [], toBase: 100, description: "Equal to 100 W/(m·K)." },
  { id: "kw_per_mk", name: "Kilowatt per Meter-Kelvin", plural: "Kilowatts per Meter-Kelvin", symbol: "kW/(m·K)", categoryId: "thermal_conductivity", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 W/(m·K)." },
  { id: "cal_per_scmc", name: "Calorie per Second-cm-°C", plural: "cal/(s·cm·°C)", symbol: "cal/(s·cm·°C)", categoryId: "thermal_conductivity", system: "metric", aliases: [], toBase: 418.4, description: "CGS thermal conductivity unit (418.4 W/(m·K))." },
  { id: "btu_per_hftf", name: "BTU per Hour-Foot-°F", plural: "BTU/(h·ft·°F)", symbol: "BTU/(h·ft·°F)", categoryId: "thermal_conductivity", system: "us_customary", aliases: ["btu/hr ft f"], toBase: 1.73073467, description: "US HVAC thermal conductivity unit (≈ 1.7307 W/(m·K))." },
  { id: "btu_in_per_hft2f", name: "BTU-Inch per Hour-Sq. Foot-°F", plural: "BTU·in/(h·ft²·°F)", symbol: "BTU·in/(h·ft²·°F)", categoryId: "thermal_conductivity", system: "us_customary", aliases: [], toBase: 0.144227889, description: "US building insulation k-factor unit (≈ 0.1442 W/(m·K))." },

  // --- SPECIFIC HEAT CAPACITY (Base: j_per_kgk) ---
  { id: "j_per_kgk", name: "Joule per Kilogram-Kelvin", plural: "Joules per Kilogram-Kelvin", symbol: "J/(kg·K)", categoryId: "specific_heat_capacity", system: "si", aliases: ["j/kg k", "j/kg c"], toBase: 1, description: "Coherent SI unit of specific heat capacity." },
  { id: "kj_per_kgk", name: "Kilojoule per Kilogram-Kelvin", plural: "Kilojoules per Kilogram-Kelvin", symbol: "kJ/(kg·K)", categoryId: "specific_heat_capacity", system: "metric", aliases: ["kj/kg k", "kj/kg c"], toBase: 1000, description: "Equal to 1,000 J/(kg·K)." },
  { id: "j_per_gc", name: "Joule per Gram-°C", plural: "Joules per Gram-°C", symbol: "J/(g·°C)", categoryId: "specific_heat_capacity", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 J/(kg·K)." },
  { id: "cal_per_gc", name: "Calorie per Gram-°C", plural: "Calories per Gram-°C", symbol: "cal/(g·°C)", categoryId: "specific_heat_capacity", system: "metric", aliases: ["cal/g c"], toBase: 4186.8, description: "Water specific heat benchmark (1 cal/(g·°C) = 4,186.8 J/(kg·K))." },
  { id: "btu_per_lbf", name: "BTU per Pound-°F", plural: "BTU/(lb·°F)", symbol: "BTU/(lb·°F)", categoryId: "specific_heat_capacity", system: "us_customary", aliases: ["btu/lb f"], toBase: 4186.8, description: "Imperial/US specific heat capacity unit (4,186.8 J/(kg·K))." },

  // --- HEAT DENSITY (Base: j_per_m2) ---
  { id: "j_per_m2", name: "Joule per Square Meter", plural: "Joules per Square Meter", symbol: "J/m²", categoryId: "heat_density", system: "si", aliases: [], toBase: 1, description: "SI unit of areal heat density and radiant exposure." },
  { id: "kj_per_m2", name: "Kilojoule per Square Meter", plural: "Kilojoules per Square Meter", symbol: "kJ/m²", categoryId: "heat_density", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 J/m²." },
  { id: "mj_per_m2", name: "Megajoule per Square Meter", plural: "Megajoules per Square Meter", symbol: "MJ/m²", categoryId: "heat_density", system: "metric", aliases: [], toBase: 1e6, description: "Solar radiation daily exposure unit (10⁶ J/m²)." },
  { id: "langley", name: "Langley (cal/cm²)", plural: "Langleys", symbol: "Ly", categoryId: "heat_density", system: "metric", aliases: ["cal/cm2"], toBase: 41840, description: "Solar insolation unit equal to 1 thermochemical calorie/cm² (41,840 J/m²)." },
  { id: "btu_per_ft2", name: "BTU per Square Foot", plural: "BTUs per Square Foot", symbol: "BTU/ft²", categoryId: "heat_density", system: "us_customary", aliases: ["btu/ft2"], toBase: 11356.5267, description: "US thermal exposure unit (≈ 11,356.5 J/m²)." },

  // --- HEAT FLUX DENSITY (Base: w_per_m2) ---
  { id: "w_per_m2", name: "Watt per Square Meter", plural: "Watts per Square Meter", symbol: "W/m²", categoryId: "heat_flux_density", system: "si", aliases: ["w/m2"], toBase: 1, description: "SI unit of heat flux density and solar irradiance." },
  { id: "kw_per_m2", name: "Kilowatt per Square Meter", plural: "Kilowatts per Square Meter", symbol: "kW/m²", categoryId: "heat_flux_density", system: "metric", aliases: ["kw/m2"], toBase: 1000, description: "Peak solar irradiance benchmark (1 kW/m² = 1,000 W/m²)." },
  { id: "w_per_cm2", name: "Watt per Square Centimeter", plural: "Watts per Square Centimeter", symbol: "W/cm²", categoryId: "heat_flux_density", system: "metric", aliases: ["w/cm2"], toBase: 10000, description: "Equal to 10,000 W/m²." },
  { id: "w_per_in2", name: "Watt per Square Inch", plural: "Watts per Square Inch", symbol: "W/in²", categoryId: "heat_flux_density", system: "us_customary", aliases: ["w/in2"], toBase: 1550.0031, description: "Heater element surface watt density unit (≈ 1,550 W/m²)." },
  { id: "btu_per_hft2", name: "BTU per Hour-Square Foot", plural: "BTU/(h·ft²)", symbol: "BTU/(h·ft²)", categoryId: "heat_flux_density", system: "us_customary", aliases: ["btu/hr ft2"], toBase: 3.15459075, description: "US HVAC heat flux unit (≈ 3.1546 W/m²)." },

  // --- HEAT TRANSFER COEFFICIENT (Base: w_per_m2k) ---
  { id: "w_per_m2k", name: "Watt per Square Meter-Kelvin", plural: "W/(m²·K)", symbol: "W/(m²·K)", categoryId: "heat_transfer_coefficient", system: "si", aliases: ["u-value si"], toBase: 1, description: "SI unit of heat transfer coefficient and window U-value." },
  { id: "w_per_m2c", name: "Watt per Square Meter-°C", plural: "W/(m²·°C)", symbol: "W/(m²·°C)", categoryId: "heat_transfer_coefficient", system: "metric", aliases: [], toBase: 1, description: "Equal to 1 W/(m²·K)." },
  { id: "kw_per_m2k", name: "Kilowatt per Square Meter-Kelvin", plural: "kW/(m²·K)", symbol: "kW/(m²·K)", categoryId: "heat_transfer_coefficient", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 W/(m²·K)." },
  { id: "btu_per_hft2f", name: "BTU per Hour-Sq. Foot-°F", plural: "BTU/(h·ft²·°F)", symbol: "BTU/(h·ft²·°F)", categoryId: "heat_transfer_coefficient", system: "us_customary", aliases: ["u-factor us"], toBase: 5.67826334, description: "US fenestration U-factor and heat exchanger coefficient (≈ 5.6783 W/(m²·K))." },
  { id: "cal_per_scm2c", name: "Calorie per Second-Sq. cm-°C", plural: "cal/(s·cm²·°C)", symbol: "cal/(s·cm²·°C)", categoryId: "heat_transfer_coefficient", system: "metric", aliases: [], toBase: 41840, description: "CGS heat transfer coefficient equal to 41,840 W/(m²·K)." },

  // --- FLOW - MASS (Base: kg_per_sec) ---
  { id: "kg_per_sec", name: "Kilogram per Second", plural: "Kilograms per Second", symbol: "kg/s", categoryId: "flow_mass", system: "si", aliases: [], toBase: 1, description: "SI unit of mass flow rate." },
  { id: "kg_per_min", name: "Kilogram per Minute", plural: "Kilograms per Minute", symbol: "kg/min", categoryId: "flow_mass", system: "metric", aliases: [], toBase: 1 / 60, description: "Equal to 1/60 kg/s." },
  { id: "kg_per_hour", name: "Kilogram per Hour", plural: "Kilograms per Hour", symbol: "kg/h", categoryId: "flow_mass", system: "metric", aliases: ["kg/hr"], toBase: 1 / 3600, description: "Process engineering mass flow unit." },
  { id: "g_per_sec", name: "Gram per Second", plural: "Grams per Second", symbol: "g/s", categoryId: "flow_mass", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 kg/s." },
  { id: "ton_metric_per_hour", name: "Metric Ton per Hour", plural: "Metric Tons per Hour", symbol: "t/h", categoryId: "flow_mass", system: "metric", aliases: ["tph"], toBase: 1000 / 3600, description: "Industrial bulk mass flow rate (1,000 kg/h)." },
  { id: "lb_per_sec", name: "Pound per Second", plural: "Pounds per Second", symbol: "lb/s", categoryId: "flow_mass", system: "us_customary", aliases: [], toBase: 0.45359237, description: "Equal to 0.453592 kg/s." },
  { id: "lb_per_min", name: "Pound per Minute", plural: "Pounds per Minute", symbol: "lb/min", categoryId: "flow_mass", system: "us_customary", aliases: [], toBase: 0.45359237 / 60, description: "Equal to 0.00756 kg/s." },
  { id: "lb_per_hour", name: "Pound per Hour", plural: "Pounds per Hour", symbol: "lb/h", categoryId: "flow_mass", system: "us_customary", aliases: ["lb/hr", "pph"], toBase: 0.45359237 / 3600, description: "Steam boiler and aviation fuel flow unit." },

  // --- FLOW - MOLAR (Base: mol_per_sec) ---
  { id: "mol_per_sec", name: "Mole per Second", plural: "Moles per Second", symbol: "mol/s", categoryId: "flow_molar", system: "si", aliases: [], toBase: 1, description: "SI unit of molar flow rate." },
  { id: "kmol_per_sec", name: "Kilomole per Second", plural: "Kilomoles per Second", symbol: "kmol/s", categoryId: "flow_molar", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 mol/s." },
  { id: "kmol_per_hour", name: "Kilomole per Hour", plural: "Kilomoles per Hour", symbol: "kmol/h", categoryId: "flow_molar", system: "metric", aliases: [], toBase: 1000 / 3600, description: "Chemical plant molar throughput unit (0.27778 mol/s)." },
  { id: "mol_per_min", name: "Mole per Minute", plural: "Moles per Minute", symbol: "mol/min", categoryId: "flow_molar", system: "metric", aliases: [], toBase: 1 / 60, description: "Equal to 1/60 mol/s." },
  { id: "mol_per_hour", name: "Mole per Hour", plural: "Moles per Hour", symbol: "mol/h", categoryId: "flow_molar", system: "metric", aliases: [], toBase: 1 / 3600, description: "Equal to 1/3600 mol/s." },
  { id: "mmol_per_sec", name: "Millimole per Second", plural: "Millimoles per Second", symbol: "mmol/s", categoryId: "flow_molar", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 mol/s." },
  { id: "lbmol_per_hour", name: "Pound-mole per Hour", plural: "Pound-moles per Hour", symbol: "lbmol/h", categoryId: "flow_molar", system: "us_customary", aliases: [], toBase: 453.59237 / 3600, description: "US chemical engineering molar flow unit (≈ 0.126 mol/s)." },

  // --- MASS FLUX DENSITY (Base: kg_per_sm2) ---
  { id: "kg_per_sm2", name: "Kilogram per Second-Sq. Meter", plural: "kg/(s·m²)", symbol: "kg/(s·m²)", categoryId: "mass_flux_density", system: "si", aliases: [], toBase: 1, description: "SI unit of mass flux density." },
  { id: "kg_per_hm2", name: "Kilogram per Hour-Sq. Meter", plural: "kg/(h·m²)", symbol: "kg/(h·m²)", categoryId: "mass_flux_density", system: "metric", aliases: [], toBase: 1 / 3600, description: "Membrane and distillation mass flux unit." },
  { id: "g_per_scm2", name: "Gram per Second-Sq. Centimeter", plural: "g/(s·cm²)", symbol: "g/(s·cm²)", categoryId: "mass_flux_density", system: "metric", aliases: [], toBase: 10, description: "CGS mass flux density equal to 10 kg/(s·m²)." },
  { id: "lb_per_sft2", name: "Pound per Second-Sq. Foot", plural: "lb/(s·ft²)", symbol: "lb/(s·ft²)", categoryId: "mass_flux_density", system: "us_customary", aliases: [], toBase: 4.88242764, description: "Equal to 4.8824 kg/(s·m²)." },
  { id: "lb_per_hft2", name: "Pound per Hour-Sq. Foot", plural: "lb/(h·ft²)", symbol: "lb/(h·ft²)", categoryId: "mass_flux_density", system: "us_customary", aliases: [], toBase: 4.88242764 / 3600, description: "Equal to 0.0013562 kg/(s·m²)." },

  // --- CONCENTRATION - MOLAR (Base: mol_per_m3) ---
  { id: "mol_per_m3", name: "Mole per Cubic Meter", plural: "Moles per Cubic Meter", symbol: "mol/m³", categoryId: "concentration_molar", system: "si", aliases: [], toBase: 1, description: "Coherent SI unit of molar concentration." },
  { id: "mol_per_liter", name: "Mole per Liter (Molar, M)", plural: "Moles per Liter (M)", symbol: "mol/L", categoryId: "concentration_molar", system: "metric", aliases: ["molar", "molarity"], toBase: 1000, description: "Standard chemistry molarity unit (1 M = 1 mol/L = 1,000 mol/m³)." },
  { id: "mmol_per_liter", name: "Millimole per Liter (mM)", plural: "Millimoles per Liter (mmol/L)", symbol: "mmol/L", categoryId: "concentration_molar", system: "metric", aliases: ["mm"], toBase: 1, description: "Clinical blood chemistry unit (1 mmol/L = 1 mol/m³)." },
  { id: "umol_per_liter", name: "Micromole per Liter (µM)", plural: "Micromoles per Liter (µmol/L)", symbol: "µmol/L", categoryId: "concentration_molar", system: "metric", aliases: ["um"], toBase: 0.001, description: "Equal to 10⁻⁶ mol/L." },
  { id: "kmol_per_m3", name: "Kilomole per Cubic Meter", plural: "Kilomoles per Cubic Meter", symbol: "kmol/m³", categoryId: "concentration_molar", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1 mol/L (1,000 mol/m³)." },

  // --- CONCENTRATION - SOLUTION (Base: sol_kg_per_l) ---
  { id: "sol_kg_per_l", name: "Kilogram per Liter", plural: "Kilograms per Liter", symbol: "kg/L", categoryId: "concentration_solution", system: "metric", aliases: [], toBase: 1, description: "Equal to 1,000 g/L." },
  { id: "sol_g_per_l", name: "Gram per Liter", plural: "Grams per Liter", symbol: "g/L", categoryId: "concentration_solution", system: "metric", aliases: [], toBase: 0.001, description: "Standard laboratory solution concentration unit." },
  { id: "sol_mg_per_l", name: "Milligram per Liter", plural: "Milligrams per Liter", symbol: "mg/L", categoryId: "concentration_solution", system: "metric", aliases: [], toBase: 1e-6, description: "Water quality concentration unit (approx. 1 ppm in dilute aqueous solution)." },
  { id: "sol_g_per_100ml", name: "Gram per 100 mL (% w/v)", plural: "Grams per 100 mL (% w/v)", symbol: "g/dL", categoryId: "concentration_solution", system: "metric", aliases: ["g/100ml"], toBase: 0.01, description: "Clinical deciliter concentration unit (1 g/dL = 10 g/L)." },
  { id: "sol_lb_per_gal", name: "Pound per US Gallon", plural: "Pounds per US Gallon", symbol: "lb/gal", categoryId: "concentration_solution", system: "us_customary", aliases: [], toBase: 0.119826427, description: "Equal to 119.826 g/L." },
  { id: "sol_grain_per_gal", name: "Grain per US Gallon (gpg)", plural: "Grains per US Gallon", symbol: "gr/gal", categoryId: "concentration_solution", system: "us_customary", aliases: ["gpg"], toBase: 0.00001711806, description: "Water hardness unit (1 gpg ≈ 17.118 mg/L)." },

  // --- VISCOSITY - DYNAMIC (Base: pascal_sec) ---
  { id: "pascal_sec", name: "Pascal Second", plural: "Pascal Seconds", symbol: "Pa·s", categoryId: "viscosity_dynamic", system: "si", aliases: ["pa s", "ns/m2"], toBase: 1, description: "Coherent SI unit of dynamic viscosity (1 Pa·s = 1,000 cP)." },
  { id: "mpas", name: "Millipascal Second", plural: "Millipascal Seconds", symbol: "mPa·s", categoryId: "viscosity_dynamic", system: "metric", aliases: ["mpas"], toBase: 0.001, description: "Numerically identical to 1 centipoise (1 mPa·s = 1 cP)." },
  { id: "poise", name: "Poise", plural: "Poise", symbol: "P", categoryId: "viscosity_dynamic", system: "metric", aliases: ["dyne s/cm2"], toBase: 0.1, description: "CGS dynamic viscosity unit equal to 0.1 Pa·s." },
  { id: "centipoise", name: "Centipoise", plural: "Centipoise", symbol: "cP", categoryId: "viscosity_dynamic", system: "metric", aliases: ["cp"], toBase: 0.001, description: "Water at 20 °C has a viscosity of approximately 1 cP (0.001 Pa·s)." },
  { id: "lb_per_fts", name: "Pound per Foot-Second", plural: "lb/(ft·s)", symbol: "lb/(ft·s)", categoryId: "viscosity_dynamic", system: "us_customary", aliases: [], toBase: 1.48816394, description: "Imperial dynamic viscosity unit (≈ 1.4882 Pa·s)." },
  { id: "lbf_s_per_ft2", name: "Pound-force Second per Sq. Foot", plural: "lbf·s/ft²", symbol: "lbf·s/ft²", categoryId: "viscosity_dynamic", system: "us_customary", aliases: ["slug/ft s"], toBase: 47.88025898, description: "Gravitational US viscosity unit (≈ 47.88 Pa·s)." },

  // --- VISCOSITY - KINEMATIC (Base: m2_per_sec) ---
  { id: "m2_per_sec", name: "Square Meter per Second", plural: "Square Meters per Second", symbol: "m²/s", categoryId: "viscosity_kinematic", system: "si", aliases: ["m2/s"], toBase: 1, description: "Coherent SI unit of kinematic viscosity." },
  { id: "mm2_per_sec", name: "Square Millimeter per Second", plural: "Square Millimeters per Second", symbol: "mm²/s", categoryId: "viscosity_kinematic", system: "metric", aliases: ["mm2/s"], toBase: 1e-6, description: "Numerically identical to 1 centistokes (1 mm²/s = 1 cSt = 10⁻⁶ m²/s)." },
  { id: "stokes", name: "Stokes", plural: "Stokes", symbol: "St", categoryId: "viscosity_kinematic", system: "metric", aliases: ["cm2/s"], toBase: 1e-4, description: "CGS kinematic viscosity unit equal to 1 cm²/s (0.0001 m²/s)." },
  { id: "centistokes", name: "Centistokes", plural: "Centistokes", symbol: "cSt", categoryId: "viscosity_kinematic", system: "metric", aliases: ["cst"], toBase: 1e-6, description: "Standard lubricant and fuel viscosity unit (1 cSt = 1 mm²/s)." },
  { id: "ft2_per_sec", name: "Square Foot per Second", plural: "Square Feet per Second", symbol: "ft²/s", categoryId: "viscosity_kinematic", system: "us_customary", aliases: ["ft2/s"], toBase: 0.09290304, description: "Imperial kinematic viscosity unit (0.092903 m²/s)." },

  // --- SURFACE TENSION (Base: n_per_m) ---
  { id: "n_per_m", name: "Newton per Meter", plural: "Newtons per Meter", symbol: "N/m", categoryId: "surface_tension", system: "si", aliases: ["j/m2 surface"], toBase: 1, description: "SI unit of liquid surface tension." },
  { id: "mn_per_m", name: "Millinewton per Meter", plural: "Millinewtons per Meter", symbol: "mN/m", categoryId: "surface_tension", system: "metric", aliases: ["mn/m"], toBase: 0.001, description: "Equal to 1 dyne/cm (0.001 N/m). Water at 20 °C is ~72.8 mN/m." },
  { id: "dyne_per_cm", name: "Dyne per Centimeter", plural: "Dynes per Centimeter", symbol: "dyn/cm", categoryId: "surface_tension", system: "metric", aliases: ["erg/cm2"], toBase: 0.001, description: "CGS surface tension unit equal to 1 mN/m (0.001 N/m)." },
  { id: "gf_per_cm", name: "Gram-force per Centimeter", plural: "gf/cm", symbol: "gf/cm", categoryId: "surface_tension", system: "metric", aliases: [], toBase: 0.980665, description: "Equal to 0.980665 N/m." },
  { id: "lbf_per_in", name: "Pound-force per Inch", plural: "lbf/in", symbol: "lbf/in", categoryId: "surface_tension", system: "us_customary", aliases: [], toBase: 175.126835, description: "Equal to 175.127 N/m." },

  // --- PERMEABILITY (Base: perm_m2) ---
  { id: "perm_m2", name: "Square Meter (Permeability)", plural: "Square Meters (m²)", symbol: "m²", categoryId: "permeability", system: "si", aliases: [], toBase: 1, description: "SI unit of porous media intrinsic permeability." },
  { id: "darcy", name: "Darcy", plural: "Darcies", symbol: "D", categoryId: "permeability", system: "other", aliases: ["darcies"], toBase: 9.869233e-13, description: "Petroleum reservoir permeability unit (≈ 0.986923 µm²)." },
  { id: "millidarcy", name: "Millidarcy", plural: "Millidarcies", symbol: "mD", categoryId: "permeability", system: "other", aliases: ["md"], toBase: 9.869233e-16, description: "One-thousandth of a Darcy (9.869×10⁻¹⁶ m²)." },
  { id: "microdarcy", name: "Microdarcy", plural: "Microdarcies", symbol: "µD", categoryId: "permeability", system: "other", aliases: ["ud"], toBase: 9.869233e-19, description: "Tight shale permeability unit (10⁻⁶ Darcy)." },
  { id: "perm_um2", name: "Square Micrometer", plural: "Square Micrometers (µm²)", symbol: "µm²", categoryId: "permeability", system: "metric", aliases: ["um2"], toBase: 1e-12, description: "Equal to 10⁻¹² m² (approx. 1.01325 Darcy)." },

  // --- LUMINANCE (Base: cd_per_m2) ---
  { id: "cd_per_m2", name: "Candela per Square Meter (Nit)", plural: "Candelas per Sq. Meter (Nits)", symbol: "cd/m²", categoryId: "luminance", system: "si", aliases: ["nit", "nits"], toBase: 1, description: "SI display brightness and luminance unit (1 nit = 1 cd/m²)." },
  { id: "kcd_per_m2", name: "Kilocandela per Square Meter", plural: "kcd/m²", symbol: "kcd/m²", categoryId: "luminance", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 nits (cd/m²)." },
  { id: "stilb", name: "Stilb (cd/cm²)", plural: "Stilbs", symbol: "sb", categoryId: "luminance", system: "metric", aliases: ["cd/cm2"], toBase: 10000, description: "CGS luminance unit equal to 10,000 cd/m²." },
  { id: "lambert", name: "Lambert", plural: "Lamberts", symbol: "L", categoryId: "luminance", system: "metric", aliases: [], toBase: 10000 / Math.PI, description: "Equal to (10,000/π) ≈ 3,183.099 cd/m²." },
  { id: "foot_lambert", name: "Foot-lambert", plural: "Foot-lamberts", symbol: "fL", categoryId: "luminance", system: "us_customary", aliases: ["fl"], toBase: 3.4262591, description: "Cinema projection luminance unit (1/π cd/ft² ≈ 3.426 cd/m²)." },
  { id: "cd_per_ft2", name: "Candela per Square Foot", plural: "cd/ft²", symbol: "cd/ft²", categoryId: "luminance", system: "us_customary", aliases: [], toBase: 10.7639104, description: "Equal to 10.7639 cd/m²." },

  // --- LUMINOUS INTENSITY (Base: candela_unit) ---
  { id: "candela_unit", name: "Candela", plural: "Candelas", symbol: "cd", categoryId: "luminous_intensity", system: "si", aliases: ["candlepower"], toBase: 1, description: "Fundamental SI base unit of luminous intensity." },
  { id: "millicandela", name: "Millicandela", plural: "Millicandelas", symbol: "mcd", categoryId: "luminous_intensity", system: "metric", aliases: ["mcd"], toBase: 0.001, description: "Indicator LED brightness unit (0.001 cd)." },
  { id: "kilocandela", name: "Kilocandela", plural: "Kilocandelas", symbol: "kcd", categoryId: "luminous_intensity", system: "metric", aliases: ["kcd"], toBase: 1000, description: "Searchlight & automotive headlamp intensity unit (1,000 cd)." },
  { id: "lumen_per_sr", name: "Lumen per Steradian", plural: "Lumens per Steradian", symbol: "lm/sr", categoryId: "luminous_intensity", system: "si", aliases: [], toBase: 1, description: "Exact SI definition of 1 candela (1 lm/sr = 1 cd)." },
  { id: "hefnerkerze", name: "Hefnerkerze", plural: "Hefnerkerze", symbol: "HK", categoryId: "luminous_intensity", system: "other", aliases: [], toBase: 0.903, description: "Historical German photometric candle standard (≈ 0.903 cd)." },

  // --- ILLUMINATION (Base: lux_unit) ---
  { id: "lux_unit", name: "Lux", plural: "Lux", symbol: "lx", categoryId: "illumination", system: "si", aliases: ["lux", "lm/m2"], toBase: 1, description: "SI derived unit of illuminance (1 lumen per square meter)." },
  { id: "kilolux", name: "Kilolux", plural: "Kilolux", symbol: "klx", categoryId: "illumination", system: "metric", aliases: ["klx"], toBase: 1000, description: "Equal to 1,000 lux (outdoor daylight benchmark)." },
  { id: "millilux", name: "Millilux", plural: "Millilux", symbol: "mlx", categoryId: "illumination", system: "metric", aliases: ["mlx"], toBase: 0.001, description: "Low-light starlight/moonlight illuminance unit (0.001 lx)." },
  { id: "foot_candle", name: "Foot-candle", plural: "Foot-candles", symbol: "fc", categoryId: "illumination", system: "us_customary", aliases: ["lm/ft2", "footcandles"], toBase: 10.7639104, description: "Architectural and photography lighting unit (1 lm/ft² ≈ 10.7639 lux)." },
  { id: "phot", name: "Phot (lm/cm²)", plural: "Phots", symbol: "ph", categoryId: "illumination", system: "metric", aliases: [], toBase: 10000, description: "CGS illuminance unit equal to 10,000 lux." },
  { id: "nox", name: "Nox", plural: "Nox", symbol: "nx", categoryId: "illumination", system: "metric", aliases: [], toBase: 0.001, description: "Dark-adapted illuminance unit equal to 1 millilux (0.001 lx)." },

  // --- DIGITAL IMAGE RESOLUTION (Base: dot_per_meter) ---
  { id: "dot_per_meter", name: "Dot per Meter", plural: "Dots per Meter", symbol: "dpm", categoryId: "digital_image_resolution", system: "si", aliases: ["px/m"], toBase: 1, description: "SI spatial resolution unit (dots or pixels per meter)." },
  { id: "dpi", name: "Dot per Inch (DPI / PPI)", plural: "Dots per Inch (DPI)", symbol: "DPI", categoryId: "digital_image_resolution", system: "us_customary", aliases: ["ppi", "pixels per inch", "dots per inch"], toBase: 39.37007874, description: "Standard display and print resolution unit (1 DPI ≈ 39.37 dots/m)." },
  { id: "dpcm", name: "Dot per Centimeter", plural: "Dots per Centimeter (dpcm)", symbol: "dpcm", categoryId: "digital_image_resolution", system: "metric", aliases: ["px/cm"], toBase: 100, description: "Metric print resolution unit (1 in = 2.54 cm, so 1 dpcm = 2.54 DPI)." },
  { id: "dpmm", name: "Dot per Millimeter", plural: "Dots per Millimeter (dpmm)", symbol: "dpmm", categoryId: "digital_image_resolution", system: "metric", aliases: ["px/mm"], toBase: 1000, description: "Thermal label printer resolution unit (1 dpmm = 25.4 DPI)." },

  // --- LINEAR CHARGE DENSITY (Base: c_per_m) ---
  { id: "c_per_m", name: "Coulomb per Meter", plural: "Coulombs per Meter", symbol: "C/m", categoryId: "charge_linear", system: "si", aliases: [], toBase: 1, description: "SI unit of linear electric charge density." },
  { id: "mc_per_m", name: "Millicoulomb per Meter", plural: "Millicoulombs per Meter", symbol: "mC/m", categoryId: "charge_linear", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 C/m." },
  { id: "uc_per_m", name: "Microcoulomb per Meter", plural: "Microcoulombs per Meter", symbol: "µC/m", categoryId: "charge_linear", system: "metric", aliases: [], toBase: 1e-6, description: "Equal to 10⁻⁶ C/m." },
  { id: "c_per_cm", name: "Coulomb per Centimeter", plural: "Coulombs per Centimeter", symbol: "C/cm", categoryId: "charge_linear", system: "metric", aliases: [], toBase: 100, description: "Equal to 100 C/m." },
  { id: "c_per_in", name: "Coulomb per Inch", plural: "Coulombs per Inch", symbol: "C/in", categoryId: "charge_linear", system: "us_customary", aliases: [], toBase: 39.37007874, description: "Equal to 39.3701 C/m." },

  // --- SURFACE CHARGE DENSITY (Base: c_per_m2) ---
  { id: "c_per_m2", name: "Coulomb per Square Meter", plural: "Coulombs per Square Meter", symbol: "C/m²", categoryId: "charge_surface", system: "si", aliases: [], toBase: 1, description: "SI unit of surface electric charge density." },
  { id: "mc_per_m2", name: "Millicoulomb per Square Meter", plural: "mC/m²", symbol: "mC/m²", categoryId: "charge_surface", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 C/m²." },
  { id: "uc_per_m2", name: "Microcoulomb per Square Meter", plural: "µC/m²", symbol: "µC/m²", categoryId: "charge_surface", system: "metric", aliases: [], toBase: 1e-6, description: "Equal to 10⁻⁶ C/m²." },
  { id: "c_per_cm2", name: "Coulomb per Square Centimeter", plural: "C/cm²", symbol: "C/cm²", categoryId: "charge_surface", system: "metric", aliases: [], toBase: 10000, description: "Equal to 10,000 C/m²." },
  { id: "c_per_in2", name: "Coulomb per Square Inch", plural: "C/in²", symbol: "C/in²", categoryId: "charge_surface", system: "us_customary", aliases: [], toBase: 1550.0031, description: "Equal to 1,550.003 C/m²." },

  // --- VOLUME CHARGE DENSITY (Base: c_per_m3) ---
  { id: "c_per_m3", name: "Coulomb per Cubic Meter", plural: "Coulombs per Cubic Meter", symbol: "C/m³", categoryId: "charge_volume", system: "si", aliases: [], toBase: 1, description: "SI unit of volumetric electric charge density." },
  { id: "mc_per_m3", name: "Millicoulomb per Cubic Meter", plural: "mC/m³", symbol: "mC/m³", categoryId: "charge_volume", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 C/m³." },
  { id: "uc_per_m3", name: "Microcoulomb per Cubic Meter", plural: "µC/m³", symbol: "µC/m³", categoryId: "charge_volume", system: "metric", aliases: [], toBase: 1e-6, description: "Equal to 10⁻⁶ C/m³." },
  { id: "c_per_cm3", name: "Coulomb per Cubic Centimeter", plural: "C/cm³", symbol: "C/cm³", categoryId: "charge_volume", system: "metric", aliases: [], toBase: 1e6, description: "Equal to 1,000,000 C/m³." },
  { id: "c_per_in3", name: "Coulomb per Cubic Inch", plural: "C/in³", symbol: "C/in³", categoryId: "charge_volume", system: "us_customary", aliases: [], toBase: 61023.7441, description: "Equal to 61,023.74 C/m³." },

  // --- LINEAR CURRENT DENSITY (Base: a_per_m) ---
  { id: "a_per_m", name: "Ampere per Meter", plural: "Amperes per Meter", symbol: "A/m", categoryId: "current_linear", system: "si", aliases: [], toBase: 1, description: "SI unit of linear current density." },
  { id: "a_per_cm", name: "Ampere per Centimeter", plural: "Amperes per Centimeter", symbol: "A/cm", categoryId: "current_linear", system: "metric", aliases: [], toBase: 100, description: "Equal to 100 A/m." },
  { id: "a_per_in", name: "Ampere per Inch", plural: "Amperes per Inch", symbol: "A/in", categoryId: "current_linear", system: "us_customary", aliases: [], toBase: 39.37007874, description: "Equal to 39.3701 A/m." },
  { id: "ma_per_m", name: "Milliampere per Meter", plural: "Milliamperes per Meter", symbol: "mA/m", categoryId: "current_linear", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 A/m." },
  { id: "oersted_curr", name: "Oersted (Linear Current)", plural: "Oersteds", symbol: "Oe", categoryId: "current_linear", system: "other", aliases: [], toBase: 1000 / (4 * Math.PI), description: "CGS electromagnetic unit equal to 1000/(4π) ≈ 79.5775 A/m." },

  // --- SURFACE CURRENT DENSITY (Base: a_per_m2) ---
  { id: "a_per_m2", name: "Ampere per Square Meter", plural: "Amperes per Square Meter", symbol: "A/m²", categoryId: "current_surface", system: "si", aliases: [], toBase: 1, description: "SI unit of areal current density." },
  { id: "ka_per_m2", name: "Kiloampere per Square Meter", plural: "kA/m²", symbol: "kA/m²", categoryId: "current_surface", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 A/m²." },
  { id: "a_per_cm2", name: "Ampere per Square Centimeter", plural: "A/cm²", symbol: "A/cm²", categoryId: "current_surface", system: "metric", aliases: [], toBase: 10000, description: "Semiconductor and electroplating current density unit (10,000 A/m²)." },
  { id: "a_per_mm2", name: "Ampere per Square Millimeter", plural: "A/mm²", symbol: "A/mm²", categoryId: "current_surface", system: "metric", aliases: [], toBase: 1e6, description: "Wire ampacity current density unit (10⁶ A/m²)." },
  { id: "a_per_in2", name: "Ampere per Square Inch", plural: "A/in²", symbol: "A/in²", categoryId: "current_surface", system: "us_customary", aliases: [], toBase: 1550.0031, description: "Equal to 1,550.003 A/m²." },

  // --- ELECTRIC FIELD STRENGTH (Base: v_per_m) ---
  { id: "v_per_m", name: "Volt per Meter", plural: "Volts per Meter", symbol: "V/m", categoryId: "electric_field", system: "si", aliases: ["v/m"], toBase: 1, description: "SI unit of electric field strength (1 V/m = 1 N/C)." },
  { id: "kv_per_m", name: "Kilovolt per Meter", plural: "Kilovolts per Meter", symbol: "kV/m", categoryId: "electric_field", system: "metric", aliases: ["kv/m"], toBase: 1000, description: "Equal to 1,000 V/m." },
  { id: "kv_per_cm", name: "Kilovolt per Centimeter", plural: "Kilovolts per Centimeter", symbol: "kV/cm", categoryId: "electric_field", system: "metric", aliases: ["kv/cm"], toBase: 100000, description: "Dielectric breakdown field strength unit (100,000 V/m)." },
  { id: "v_per_cm", name: "Volt per Centimeter", plural: "Volts per Centimeter", symbol: "V/cm", categoryId: "electric_field", system: "metric", aliases: ["v/cm"], toBase: 100, description: "Equal to 100 V/m." },
  { id: "v_per_mm", name: "Volt per Millimeter", plural: "Volts per Millimeter", symbol: "V/mm", categoryId: "electric_field", system: "metric", aliases: ["v/mm", "kv/m"], toBase: 1000, description: "Insulation dielectric strength unit (1,000 V/m)." },
  { id: "v_per_in", name: "Volt per Inch", plural: "Volts per Inch", symbol: "V/in", categoryId: "electric_field", system: "us_customary", aliases: ["v/in"], toBase: 39.37007874, description: "Equal to 39.3701 V/m." },
  { id: "n_per_c", name: "Newton per Coulomb", plural: "Newtons per Coulomb", symbol: "N/C", categoryId: "electric_field", system: "si", aliases: ["n/c"], toBase: 1, description: "Electrostatic force per unit charge (1 N/C = 1 V/m)." },

  // --- ELECTRIC POTENTIAL / VOLTAGE (Base: volt_unit) ---
  { id: "volt_unit", name: "Volt", plural: "Volts", symbol: "V", categoryId: "electric_potential", system: "si", aliases: ["volts", "v"], toBase: 1, description: "SI derived unit of electric potential and electromotive force (1 J/C)." },
  { id: "millivolt", name: "Millivolt", plural: "Millivolts", symbol: "mV", categoryId: "electric_potential", system: "metric", aliases: ["mv", "millivolts"], toBase: 0.001, description: "One-thousandth of a Volt (0.001 V)." },
  { id: "microvolt", name: "Microvolt", plural: "Microvolts", symbol: "µV", categoryId: "electric_potential", system: "metric", aliases: ["uv", "microvolts"], toBase: 1e-6, description: "One-millionth of a Volt (10⁻⁶ V)." },
  { id: "kilovolt", name: "Kilovolt", plural: "Kilovolts", symbol: "kV", categoryId: "electric_potential", system: "metric", aliases: ["kv", "kilovolts"], toBase: 1000, description: "High-voltage power distribution unit (1,000 V)." },
  { id: "megavolt", name: "Megavolt", plural: "Megavolts", symbol: "MV", categoryId: "electric_potential", system: "metric", aliases: ["mv_high", "megavolts"], toBase: 1e6, description: "Equal to 1,000,000 Volts." },
  { id: "statvolt", name: "Statvolt", plural: "Statvolts", symbol: "statV", categoryId: "electric_potential", system: "other", aliases: [], toBase: 299.792458, description: "CGS electrostatic voltage unit (≈ 299.792 V)." },
  { id: "abvolt", name: "Abvolt", plural: "Abvolts", symbol: "abV", categoryId: "electric_potential", system: "other", aliases: [], toBase: 1e-8, description: "CGS electromagnetic voltage unit (10⁻⁸ V)." },

  // --- ELECTRIC RESISTIVITY (Base: ohm_meter) ---
  { id: "ohm_meter", name: "Ohm Meter", plural: "Ohm Meters", symbol: "Ω·m", categoryId: "electric_resistivity", system: "si", aliases: ["ohm m"], toBase: 1, description: "SI unit of electrical resistivity." },
  { id: "ohm_cm", name: "Ohm Centimeter", plural: "Ohm Centimeters", symbol: "Ω·cm", categoryId: "electric_resistivity", system: "metric", aliases: ["ohm cm"], toBase: 0.01, description: "Semiconductor wafer and soil resistivity unit (0.01 Ω·m)." },
  { id: "uohm_cm", name: "Microhm Centimeter", plural: "Microhm Centimeters", symbol: "µΩ·cm", categoryId: "electric_resistivity", system: "metric", aliases: ["microohm cm"], toBase: 1e-8, description: "Metal conductor resistivity unit (10⁻⁸ Ω·m)." },
  { id: "ohm_mm2_per_m", name: "Ohm Sq. Millimeter per Meter", plural: "Ω·mm²/m", symbol: "Ω·mm²/m", categoryId: "electric_resistivity", system: "metric", aliases: [], toBase: 1e-6, description: "Cable conductor resistivity unit (10⁻⁶ Ω·m). Annealed copper is ~0.01724 Ω·mm²/m." },
  { id: "uohm_inch", name: "Microhm Inch", plural: "Microhm Inches", symbol: "µΩ·in", categoryId: "electric_resistivity", system: "us_customary", aliases: [], toBase: 2.54e-8, description: "Equal to 2.54×10⁻⁸ Ω·m." },

  // --- ELECTRIC CONDUCTANCE (Base: siemens_unit) ---
  { id: "siemens_unit", name: "Siemens", plural: "Siemens", symbol: "S", categoryId: "electric_conductance", system: "si", aliases: ["siemens", "mho"], toBase: 1, description: "SI derived unit of electrical conductance (1 S = 1 A/V = 1 Ω⁻¹)." },
  { id: "millisiemens", name: "Millisiemens", plural: "Millisiemens", symbol: "mS", categoryId: "electric_conductance", system: "metric", aliases: ["ms_cond"], toBase: 0.001, description: "One-thousandth of a Siemens (0.001 S)." },
  { id: "microsiemens", name: "Microsiemens", plural: "Microsiemens", symbol: "µS", categoryId: "electric_conductance", system: "metric", aliases: ["us_cond", "micromho"], toBase: 1e-6, description: "One-millionth of a Siemens (10⁻⁶ S)." },
  { id: "kilosiemens", name: "Kilosiemens", plural: "Kilosiemens", symbol: "kS", categoryId: "electric_conductance", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 Siemens." },
  { id: "mho_unit", name: "Mho (Reciprocal Ohm)", plural: "Mhos", symbol: "℧", categoryId: "electric_conductance", system: "other", aliases: ["mhos"], toBase: 1, description: "Traditional name for reciprocal ohm (1 ℧ = 1 S)." },

  // --- ELECTRIC CONDUCTIVITY (Base: s_per_m) ---
  { id: "s_per_m", name: "Siemens per Meter", plural: "Siemens per Meter", symbol: "S/m", categoryId: "electric_conductivity", system: "si", aliases: ["s/m"], toBase: 1, description: "SI unit of electrical conductivity." },
  { id: "ms_per_m", name: "Millisiemens per Meter", plural: "Millisiemens per Meter", symbol: "mS/m", categoryId: "electric_conductivity", system: "metric", aliases: ["ms/m"], toBase: 0.001, description: "Equal to 0.001 S/m." },
  { id: "ms_per_cm", name: "Millisiemens per Centimeter", plural: "Millisiemens per Centimeter", symbol: "mS/cm", categoryId: "electric_conductivity", system: "metric", aliases: ["ms/cm"], toBase: 0.1, description: "Salinity & hydroponics EC unit (1 mS/cm = 0.1 S/m)." },
  { id: "us_per_cm", name: "Microsiemens per Centimeter", plural: "Microsiemens per Centimeter", symbol: "µS/cm", categoryId: "electric_conductivity", system: "metric", aliases: ["us/cm"], toBase: 0.0001, description: "Drinking water & pure water EC unit (1 µS/cm = 0.0001 S/m)." },
  { id: "megasiemens_per_m", name: "Megasiemens per Meter", plural: "Megasiemens per Meter", symbol: "MS/m", categoryId: "electric_conductivity", system: "metric", aliases: ["ms_mega/m"], toBase: 1e6, description: "Metal alloy conductivity unit (10⁶ S/m)." },
  { id: "iacs_percent", name: "Percent IACS (Annealed Copper)", plural: "% IACS", symbol: "% IACS", categoryId: "electric_conductivity", system: "other", aliases: ["iacs"], toBase: 580000, description: "International Annealed Copper Standard (100% IACS = 58 MS/m)." },

  // --- MAGNETOMOTIVE FORCE (Base: ampere_turn) ---
  { id: "ampere_turn", name: "Ampere-turn", plural: "Ampere-turns", symbol: "At", categoryId: "magnetomotive_force", system: "si", aliases: ["ampere turns"], toBase: 1, description: "SI unit of magnetomotive force (MMF)." },
  { id: "kiloampere_turn", name: "Kiloampere-turn", plural: "Kiloampere-turns", symbol: "kAt", categoryId: "magnetomotive_force", system: "metric", aliases: [], toBase: 1000, description: "Equal to 1,000 Ampere-turns." },
  { id: "milliampere_turn", name: "Milliampere-turn", plural: "Milliampere-turns", symbol: "mAt", categoryId: "magnetomotive_force", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 Ampere-turns." },
  { id: "gilbert", name: "Gilbert", plural: "Gilberts", symbol: "Gb", categoryId: "magnetomotive_force", system: "other", aliases: ["gilberts"], toBase: 10 / (4 * Math.PI), description: "CGS magnetomotive force unit (10/(4π) ≈ 0.795775 At)." },

  // --- MAGNETIC FIELD STRENGTH (Base: h_a_per_m) ---
  { id: "h_a_per_m", name: "Ampere per Meter (H-Field)", plural: "Amperes per Meter", symbol: "A/m", categoryId: "magnetic_field_strength", system: "si", aliases: ["at/m"], toBase: 1, description: "SI unit of magnetic field strength (H)." },
  { id: "h_ka_per_m", name: "Kiloampere per Meter", plural: "Kiloamperes per Meter", symbol: "kA/m", categoryId: "magnetic_field_strength", system: "metric", aliases: ["ka/m"], toBase: 1000, description: "Equal to 1,000 A/m." },
  { id: "oersted", name: "Oersted", plural: "Oersteds", symbol: "Oe", categoryId: "magnetic_field_strength", system: "other", aliases: ["oersteds"], toBase: 1000 / (4 * Math.PI), description: "CGS magnetizing field unit (1 Oe = 1000/(4π) ≈ 79.57747 A/m)." },
  { id: "gilbert_per_cm", name: "Gilbert per Centimeter", plural: "Gilberts per Centimeter", symbol: "Gb/cm", categoryId: "magnetic_field_strength", system: "other", aliases: [], toBase: 1000 / (4 * Math.PI), description: "Identical to 1 Oersted (≈ 79.57747 A/m)." },

  // --- MAGNETIC FLUX (Base: weber_unit) ---
  { id: "weber_unit", name: "Weber", plural: "Webers", symbol: "Wb", categoryId: "magnetic_flux", system: "si", aliases: ["webers", "wb"], toBase: 1, description: "SI derived unit of magnetic flux (1 Wb = 1 V·s = 10⁸ Maxwells)." },
  { id: "milliweber", name: "Milliweber", plural: "Milliwebers", symbol: "mWb", categoryId: "magnetic_flux", system: "metric", aliases: ["mwb"], toBase: 0.001, description: "One-thousandth of a Weber (0.001 Wb)." },
  { id: "microweber", name: "Microweber", plural: "Microwebers", symbol: "µWb", categoryId: "magnetic_flux", system: "metric", aliases: ["uwb"], toBase: 1e-6, description: "One-millionth of a Weber (100 Maxwells)." },
  { id: "maxwell", name: "Maxwell", plural: "Maxwells", symbol: "Mx", categoryId: "magnetic_flux", system: "other", aliases: ["maxwells", "mx"], toBase: 1e-8, description: "CGS magnetic flux unit equal to 10⁻⁸ Webers." },
  { id: "kiloline", name: "Kiloline", plural: "Kilolines", symbol: "kline", categoryId: "magnetic_flux", system: "other", aliases: [], toBase: 1e-5, description: "Equal to 1,000 Maxwells (10⁻⁵ Wb)." },
  { id: "volt_second", name: "Volt Second", plural: "Volt Seconds", symbol: "V·s", categoryId: "magnetic_flux", system: "si", aliases: [], toBase: 1, description: "Equivalent SI expression for 1 Weber." },

  // --- RADIATION EQUIVALENT DOSE (Base: sievert_unit) ---
  { id: "sievert_unit", name: "Sievert", plural: "Sieverts", symbol: "Sv", categoryId: "radiation", system: "si", aliases: ["sieverts", "sv"], toBase: 1, description: "SI derived unit of ionizing radiation equivalent dose (1 Sv = 100 rem)." },
  { id: "millisievert", name: "Millisievert", plural: "Millisieverts", symbol: "mSv", categoryId: "radiation", system: "metric", aliases: ["msv"], toBase: 0.001, description: "Medical imaging & dosimetry unit (1 mSv = 0.001 Sv = 100 mrem)." },
  { id: "microsievert", name: "Microsievert", plural: "Microsieverts", symbol: "µSv", categoryId: "radiation", system: "metric", aliases: ["usv"], toBase: 1e-6, description: "Background radiation dosimetry unit (10⁻⁶ Sv = 0.1 mrem)." },
  { id: "rem_unit", name: "Rem (Roentgen Equivalent Man)", plural: "Rem", symbol: "rem", categoryId: "radiation", system: "other", aliases: ["rems"], toBase: 0.01, description: "Traditional biological dose unit equal to 0.01 Sieverts (10 mSv)." },
  { id: "millirem", name: "Millirem", plural: "Millirem", symbol: "mrem", categoryId: "radiation", system: "other", aliases: ["mrem"], toBase: 1e-5, description: "US occupational dosimetry unit (1 mrem = 10 µSv = 0.01 mSv)." },

  // --- RADIATION-ACTIVITY (Base: becquerel_unit) ---
  { id: "becquerel_unit", name: "Becquerel", plural: "Becquerels", symbol: "Bq", categoryId: "radiation_activity", system: "si", aliases: ["becquerels", "bq"], toBase: 1, description: "SI derived unit of radioactivity equal to 1 nuclear decay per second." },
  { id: "kilobecquerel", name: "Kilobecquerel", plural: "Kilobecquerels", symbol: "kBq", categoryId: "radiation_activity", system: "metric", aliases: ["kbq"], toBase: 1e3, description: "Equal to 1,000 Becquerels." },
  { id: "megabecquerel", name: "Megabecquerel", plural: "Megabecquerels", symbol: "MBq", categoryId: "radiation_activity", system: "metric", aliases: ["mbq"], toBase: 1e6, description: "Nuclear medicine tracer activity unit (10⁶ Bq)." },
  { id: "gigabecquerel", name: "Gigabecquerel", plural: "Gigabecquerels", symbol: "GBq", categoryId: "radiation_activity", system: "metric", aliases: ["gbq"], toBase: 1e9, description: "Equal to 10⁹ Becquerels (≈ 27.027 mCi)." },
  { id: "curie", name: "Curie", plural: "Curies", symbol: "Ci", categoryId: "radiation_activity", system: "other", aliases: ["curies", "ci"], toBase: 3.7e10, description: "Traditional radioactivity unit equal to 3.7×10¹⁰ Becquerels (37 GBq)." },
  { id: "millicurie", name: "Millicurie", plural: "Millicuries", symbol: "mCi", categoryId: "radiation_activity", system: "other", aliases: ["mci"], toBase: 3.7e7, description: "Equal to 37 Megabecquerels (3.7×10⁷ Bq)." },
  { id: "microcurie", name: "Microcurie", plural: "Microcuries", symbol: "µCi", categoryId: "radiation_activity", system: "other", aliases: ["uci"], toBase: 37000, description: "Equal to 37 Kilobecquerels (37,000 Bq)." },
  { id: "rutherford", name: "Rutherford", plural: "Rutherfords", symbol: "Rd", categoryId: "radiation_activity", system: "other", aliases: [], toBase: 1e6, description: "Equal to 1 Megabecquerel (10⁶ decays/s)." },

  // --- RADIATION-EXPOSURE (Base: c_per_kg_rad) ---
  { id: "c_per_kg_rad", name: "Coulomb per Kilogram", plural: "Coulombs per Kilogram", symbol: "C/kg", categoryId: "radiation_exposure", system: "si", aliases: ["c/kg"], toBase: 1, description: "SI unit of ionizing radiation air exposure." },
  { id: "mc_per_kg_rad", name: "Millicoulomb per Kilogram", plural: "Millicoulombs per Kilogram", symbol: "mC/kg", categoryId: "radiation_exposure", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 C/kg." },
  { id: "uc_per_kg_rad", name: "Microcoulomb per Kilogram", plural: "Microcoulombs per Kilogram", symbol: "µC/kg", categoryId: "radiation_exposure", system: "metric", aliases: [], toBase: 1e-6, description: "Equal to 10⁻⁶ C/kg." },
  { id: "roentgen", name: "Roentgen", plural: "Roentgens", symbol: "R", categoryId: "radiation_exposure", system: "other", aliases: ["roentgens"], toBase: 0.000258, description: "Legacy X-ray/gamma exposure unit defined as exactly 2.58×10⁻⁴ C/kg." },
  { id: "milliroentgen", name: "Milliroentgen", plural: "Milliroentgens", symbol: "mR", categoryId: "radiation_exposure", system: "other", aliases: ["mr"], toBase: 2.58e-7, description: "One-thousandth of a Roentgen (2.58×10⁻⁷ C/kg)." },

  // --- RADIATION-ABSORBED DOSE (Base: gray_unit) ---
  { id: "gray_unit", name: "Gray", plural: "Grays", symbol: "Gy", categoryId: "radiation_absorbed_dose", system: "si", aliases: ["grays", "gy"], toBase: 1, description: "SI derived unit of absorbed radiation dose (1 Gy = 1 J/kg = 100 rad)." },
  { id: "centigray", name: "Centigray", plural: "Centigrays", symbol: "cGy", categoryId: "radiation_absorbed_dose", system: "metric", aliases: ["cgy"], toBase: 0.01, description: "Radiotherapy dose unit numerically equal to 1 rad (0.01 Gy)." },
  { id: "milligray", name: "Milligray", plural: "Milligrays", symbol: "mGy", categoryId: "radiation_absorbed_dose", system: "metric", aliases: ["mgy"], toBase: 0.001, description: "CT scan & diagnostic radiography absorbed dose unit (0.001 Gy)." },
  { id: "microgray", name: "Microgray", plural: "Micrograys", symbol: "µGy", categoryId: "radiation_absorbed_dose", system: "metric", aliases: ["ugy"], toBase: 1e-6, description: "Equal to 10⁻⁶ Gray." },
  { id: "rad_dose", name: "Rad (Radiation Absorbed Dose)", plural: "Rads", symbol: "rad", categoryId: "radiation_absorbed_dose", system: "other", aliases: ["rads"], toBase: 0.01, description: "CGS absorbed dose unit equal to 100 erg/g or 0.01 Gray (1 cGy)." },
  { id: "millirad", name: "Millirad", plural: "Millirads", symbol: "mrad", categoryId: "radiation_absorbed_dose", system: "other", aliases: [], toBase: 1e-5, description: "One-thousandth of a rad (10 µGy)." },

  // --- PREFIXES (Base: prefix_none) ---
  { id: "prefix_none", name: "Base Unit (No Prefix)", plural: "Base Units (10⁰)", symbol: "1", categoryId: "prefixes", system: "si", aliases: [], toBase: 1, description: "Unprefixed SI base unit (10⁰ = 1)." },
  { id: "prefix_tera", name: "Tera (T)", plural: "Tera (10¹²)", symbol: "T", categoryId: "prefixes", system: "si", aliases: ["tera"], toBase: 1e12, description: "SI prefix for 10¹² (trillion)." },
  { id: "prefix_giga", name: "Giga (G)", plural: "Giga (10⁹)", symbol: "G", categoryId: "prefixes", system: "si", aliases: ["giga"], toBase: 1e9, description: "SI prefix for 10⁹ (billion)." },
  { id: "prefix_mega", name: "Mega (M)", plural: "Mega (10⁶)", symbol: "M", categoryId: "prefixes", system: "si", aliases: ["mega"], toBase: 1e6, description: "SI prefix for 10⁶ (million)." },
  { id: "prefix_kilo", name: "Kilo (k)", plural: "Kilo (10³)", symbol: "k", categoryId: "prefixes", system: "si", aliases: ["kilo"], toBase: 1e3, description: "SI prefix for 10³ (thousand)." },
  { id: "prefix_hecto", name: "Hecto (h)", plural: "Hecto (10²)", symbol: "h", categoryId: "prefixes", system: "si", aliases: ["hecto"], toBase: 100, description: "SI prefix for 10² (hundred)." },
  { id: "prefix_deci", name: "Deci (d)", plural: "Deci (10⁻¹)", symbol: "d", categoryId: "prefixes", system: "si", aliases: ["deci"], toBase: 0.1, description: "SI prefix for 10⁻¹ (tenth)." },
  { id: "prefix_centi", name: "Centi (c)", plural: "Centi (10⁻²)", symbol: "c", categoryId: "prefixes", system: "si", aliases: ["centi"], toBase: 0.01, description: "SI prefix for 10⁻² (hundredth)." },
  { id: "prefix_milli", name: "Milli (m)", plural: "Milli (10⁻³)", symbol: "m", categoryId: "prefixes", system: "si", aliases: ["milli"], toBase: 1e-3, description: "SI prefix for 10⁻³ (thousandth)." },
  { id: "prefix_micro", name: "Micro (µ)", plural: "Micro (10⁻⁶)", symbol: "µ", categoryId: "prefixes", system: "si", aliases: ["micro"], toBase: 1e-6, description: "SI prefix for 10⁻⁶ (millionth)." },
  { id: "prefix_nano", name: "Nano (n)", plural: "Nano (10⁻⁹)", symbol: "n", categoryId: "prefixes", system: "si", aliases: ["nano"], toBase: 1e-9, description: "SI prefix for 10⁻⁹ (billionth)." },
  { id: "prefix_pico", name: "Pico (p)", plural: "Pico (10⁻¹²)", symbol: "p", categoryId: "prefixes", system: "si", aliases: ["pico"], toBase: 1e-12, description: "SI prefix for 10⁻¹² (trillionth)." },

  // --- SOUND PRESSURE (Base: sound_pa) ---
  { id: "sound_pa", name: "Pascal (Sound Pressure)", plural: "Pascals (Pa)", symbol: "Pa", categoryId: "sound", system: "si", aliases: [], toBase: 1, description: "SI unit of acoustic sound pressure (1 Pa ≈ 94 dB SPL)." },
  { id: "sound_mpa", name: "Millipascal", plural: "Millipascals (mPa)", symbol: "mPa", categoryId: "sound", system: "metric", aliases: [], toBase: 0.001, description: "Equal to 0.001 Pa." },
  { id: "sound_upa", name: "Micropascal", plural: "Micropascals (µPa)", symbol: "µPa", categoryId: "sound", system: "metric", aliases: [], toBase: 1e-6, description: "Acoustics reference pressure unit (20 µPa = 0 dB SPL threshold of human hearing)." },
  { id: "barye", name: "Dyne per Sq. Centimeter (Barye)", plural: "Dynes/cm² (Microbars)", symbol: "µbar", categoryId: "sound", system: "metric", aliases: ["dyne/cm2", "microbar"], toBase: 0.1, description: "CGS acoustic pressure unit equal to 0.1 Pa." },

  // --- TYPOGRAPHY (Base: typo_point) ---
  { id: "typo_point", name: "Point (DTP / PostScript)", plural: "Points (pt)", symbol: "pt", categoryId: "typography", system: "other", aliases: ["points", "pt"], toBase: 1, description: "Standard Desktop Publishing point equal to 1/72 of an international inch (0.352778 mm)." },
  { id: "typo_pica", name: "Pica (PostScript)", plural: "Picas (pc)", symbol: "pc", categoryId: "typography", system: "other", aliases: ["picas", "pica"], toBase: 12, description: "Typography pica equal to 12 points or 1/6 of an inch." },
  { id: "typo_pixel", name: "Pixel (CSS 96 DPI)", plural: "Pixels (px)", symbol: "px", categoryId: "typography", system: "other", aliases: ["pixels", "px"], toBase: 0.75, description: "W3C CSS reference pixel equal to 1/96 inch (0.75 pt)." },
  { id: "typo_twip", name: "Twip", plural: "Twips", symbol: "twip", categoryId: "typography", system: "other", aliases: ["twips"], toBase: 0.05, description: "Twentieth of a point (1/1440 of an inch)." },
  { id: "typo_mm", name: "Millimeter (Print)", plural: "Millimeters (mm)", symbol: "mm", categoryId: "typography", system: "metric", aliases: [], toBase: 72 / 25.4, description: "1 mm = 2.83464567 DTP points." },
  { id: "typo_inch", name: "Inch (Print)", plural: "Inches (in)", symbol: "in", categoryId: "typography", system: "us_customary", aliases: [], toBase: 72, description: "1 inch = 72 DTP points = 6 picas = 96 CSS pixels." },

  // --- VOLUME - LUMBER (Base: board_foot_lumber) ---
  { id: "board_foot_lumber", name: "Board Foot", plural: "Board Feet", symbol: "FBM", categoryId: "volume_lumber", system: "us_customary", aliases: ["bd ft", "bf", "board feet"], toBase: 1, description: "North American lumber volume unit equal to 1 ft × 1 ft × 1 in (144 in³ = 1/12 ft³)." },
  { id: "mbf_lumber", name: "Thousand Board Feet", plural: "Thousand Board Feet (MBF)", symbol: "MBF", categoryId: "volume_lumber", system: "us_customary", aliases: ["mbf"], toBase: 1000, description: "Commercial forestry unit equal to 1,000 board feet." },
  { id: "lumber_ft3", name: "Cubic Foot (Timber)", plural: "Cubic Feet (ft³)", symbol: "ft³", categoryId: "volume_lumber", system: "us_customary", aliases: [], toBase: 12, description: "1 cubic foot equals 12 board feet." },
  { id: "lumber_m3", name: "Cubic Meter (Timber)", plural: "Cubic Meters (m³)", symbol: "m³", categoryId: "volume_lumber", system: "si", aliases: [], toBase: 423.7760007, description: "1 cubic meter of sawn timber equals approximately 423.776 board feet." },
  { id: "cord_wood", name: "Cord (Firewood / Pulpwood)", plural: "Cords", symbol: "cord", categoryId: "volume_lumber", system: "us_customary", aliases: ["cords"], toBase: 1536, description: "Full stacked cord (4 ft × 4 ft × 8 ft = 128 ft³ = 1,536 board feet)." },
];
