import { CATEGORY_MAP } from "./units";

/**
 * Competitor-aligned SEO folder slugs for all 78 measurement categories
 * (matching unitconverters.net topical directory silos, e.g., /length/cm-to-inches.htm,
 * /weight-and-mass/kg-to-lbs.htm, /temperature/celsius-to-fahrenheit.htm).
 */
const CATEGORY_FOLDER_OVERRIDES: Record<string, string> = {
  mass: "weight-and-mass",
  digital_storage: "data-storage",
  data_transfer: "data-transfer",
  fuel_economy: "fuel-consumption",
  volume_dry: "volume-dry",
  velocity_angular: "angular-velocity",
  acceleration_angular: "angular-acceleration",
  specific_volume: "specific-volume",
  moment_of_inertia: "moment-of-inertia",
  moment_of_force: "moment-of-force",
  fuel_efficiency_mass: "fuel-efficiency-mass",
  fuel_efficiency_volume: "fuel-efficiency-volume",
  temperature_interval: "temperature-interval",
  thermal_expansion: "thermal-expansion",
  thermal_resistance: "thermal-resistance",
  thermal_conductivity: "thermal-conductivity",
  specific_heat_capacity: "specific-heat-capacity",
  heat_density: "heat-density",
  heat_flux_density: "heat-flux-density",
  heat_transfer_coefficient: "heat-transfer-coefficient",
  flow_mass: "mass-flow",
  flow_molar: "molar-flow",
  mass_flux_density: "mass-flux-density",
  concentration_molar: "concentration-molar",
  concentration_solution: "concentration-solution",
  viscosity_dynamic: "viscosity-dynamic",
  viscosity_kinematic: "viscosity-kinematic",
  surface_tension: "surface-tension",
  luminous_intensity: "luminous-intensity",
  digital_image_resolution: "digital-image-resolution",
  charge_linear: "linear-charge-density",
  charge_surface: "surface-charge-density",
  charge_volume: "volume-charge-density",
  current_linear: "linear-current-density",
  current_surface: "surface-current-density",
  electric_field: "electric-field-strength",
  electric_potential: "electric-potential",
  resistance: "electric-resistance",
  electric_resistivity: "electric-resistivity",
  electric_conductance: "electric-conductance",
  electric_conductivity: "electric-conductivity",
  capacitance: "electrostatic-capacitance",
  magnetomotive_force: "magnetomotive-force",
  magnetic_field_strength: "magnetic-field-strength",
  magnetic_flux: "magnetic-flux",
  magnetic: "magnetic-flux-density",
  radiation_activity: "radiation-activity",
  radiation_exposure: "radiation-exposure",
  radiation_absorbed_dose: "radiation-absorbed-dose",
  volume_lumber: "volume-lumber",
};

const REVERSE_FOLDER_MAP = new Map<string, string>();
for (const [catId, folderSlug] of Object.entries(CATEGORY_FOLDER_OVERRIDES)) {
  REVERSE_FOLDER_MAP.set(folderSlug.toLowerCase(), catId);
}

const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  weight: "mass",
  "weight-and-mass": "mass",
  "weight-and-mass-converter": "mass",
  "length-converter": "length",
  distance: "length",
  "liquid-volume": "volume",
  "volume-converter": "volume",
  "temperature-converter": "temperature",
  "area-converter": "area",
  "speed-converter": "speed",
  "time-converter": "time",
  "pressure-converter": "pressure",
  "energy-converter": "energy",
  "power-converter": "power",
  "data-storage": "digital_storage",
  "digital-storage": "digital_storage",
  "data-transfer": "data_transfer",
  "fuel-economy": "fuel_economy",
  "fuel-consumption": "fuel_economy",
  "flow-rate": "flow",
  "electric-current": "current",
  "electric-charge": "charge",
  "electrical-resistance": "resistance",
  "electric-resistance": "resistance",
  "electrostatic-capacitance": "capacitance",
  "magnetic-flux-density": "magnetic",
  "frequency-wavelength": "frequency",
};

/**
 * Returns the canonical SEO category directory slug (e.g., "length", "weight-and-mass", "temperature").
 */
export function getCategoryUrlSlug(categoryId: string): string {
  const cleanId = categoryId.trim().toLowerCase();
  if (CATEGORY_FOLDER_OVERRIDES[cleanId]) {
    return CATEGORY_FOLDER_OVERRIDES[cleanId];
  }
  return cleanId.replace(/_/g, "-");
}

/**
 * Builds the canonical clean top-level category hub URL:
 * e.g., "/length", "/weight-and-mass", "/temperature", "/data-storage"
 */
export function getCategoryUrl(categoryId: string): string {
  return `/${getCategoryUrlSlug(categoryId)}`;
}

/**
 * Resolves any URL category segment (e.g., "length", "weight-and-mass", "length-converter.html", "digital_storage")
 * back to our canonical internal Category ID (e.g., "length", "mass", "digital_storage").
 */
export function resolveCategoryIdFromUrlSlug(
  rawSegment: string
): string | undefined {
  const cleaned = decodeURIComponent(rawSegment)
    .trim()
    .toLowerCase()
    .replace(/\.html?$/i, "")
    .replace(/-converter$/, "");

  if (CATEGORY_MAP.has(cleaned)) {
    return cleaned;
  }
  if (REVERSE_FOLDER_MAP.has(cleaned)) {
    return REVERSE_FOLDER_MAP.get(cleaned);
  }
  if (LEGACY_CATEGORY_ALIASES[cleaned]) {
    return LEGACY_CATEGORY_ALIASES[cleaned];
  }
  const underscored = cleaned.replace(/-/g, "_");
  if (CATEGORY_MAP.has(underscored)) {
    return underscored;
  }
  return undefined;
}

/**
 * Builds the canonical hierarchical unit conversion URL:
 * e.g., "/length/cm-to-inches" or "/weight-and-mass/kg-to-lbs"
 */
export function getPairUrl(pair: {
  categoryId: string;
  slug: string;
}): string {
  const catFolder = getCategoryUrlSlug(pair.categoryId);
  const cleanPairSlug = pair.slug
    .trim()
    .toLowerCase()
    .replace(/\.html?$/i, "");
  return `/${catFolder}/${cleanPairSlug}`;
}

/**
 * Strips ".htm" or ".html" extension from a slug parameter.
 */
export function stripHtmExtension(rawSlug: string): string {
  return decodeURIComponent(rawSlug)
    .trim()
    .replace(/\.html?$/i, "");
}
