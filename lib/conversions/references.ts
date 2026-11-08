import { ConversionPairInfo, Unit } from "./types";
import { convertUnits } from "./engine";
import { CATEGORY_MAP, getUnitsByCategory, UNIT_MAP } from "./units";

export interface TrustedReference {
  organization: string;
  shortName: string;
  documentTitle: string;
  standardCode: string;
  url: string;
  verificationNote: string;
  topicBadge?: string;
  verifiedFormula?: string;
  linkLabel?: string;
  citationText?: string;
}

const NON_SI_IMPERIAL_US_UNIT_IDS = new Set<string>([
  "inch",
  "foot",
  "yard",
  "mile",
  "nautical_mile",
  "fathom",
  "furlong",
  "chain",
  "rod",
  "league",
  "mil",
  "microinch",
  "sqin",
  "sqft",
  "sqyd",
  "sqmi",
  "acre",
  "ounce",
  "pound",
  "stone",
  "ton_us",
  "ton_uk",
  "grain",
  "dram",
  "hundredweight_us",
  "hundredweight_uk",
  "troy_ounce",
  "troy_pound",
  "pennyweight",
  "tsp_us",
  "tbsp_us",
  "floz_us",
  "cup_us",
  "pint_us",
  "quart_us",
  "gallon_us",
  "floz_uk",
  "pint_uk",
  "quart_uk",
  "gallon_uk",
  "cuin",
  "cuft",
  "cuyd",
  "mph",
  "fps",
  "knot",
  "psi",
  "psf",
  "inhg",
  "inwg",
  "btu",
  "ftlb",
  "hp",
  "hp_uk",
  "lbf",
  "ozf",
  "poundal",
  "kip",
  "lb_ft3",
  "lb_in3",
  "lb_gal_us",
  "mpg_us",
  "mpg_uk",
  "fahrenheit",
  "rankine",
]);

function isNonSiUnit(unitId: string): boolean {
  return NON_SI_IMPERIAL_US_UNIT_IDS.has(unitId);
}

export const GLOBAL_TRUSTED_REFERENCES: TrustedReference[] = [
  {
    organization: "National Institute of Standards and Technology (NIST)",
    shortName: "NIST SP 811",
    documentTitle:
      "NIST Guide to the SI, Appendix B.9: Factors for Units Listed by Kind of Quantity or Field of Science",
    standardCode: "NIST SP 811 App. B.9",
    url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    verificationNote:
      "Authoritative U.S. federal conversion factors between SI metric and U.S. Customary / Imperial measurement units across physical quantities.",
    topicBadge: "Conversion Factors by Category",
    verifiedFormula: "NIST Special Publication 811 Appendix B.8 & B.9",
    linkLabel: "NIST SP 811 Appendix B.9",
    citationText:
      "National Institute of Standards and Technology, Guide for the Use of the International System of Units (SI), SP 811 Appendix B.9",
  },
  {
    organization:
      "National Bureau of Standards (NIST) & International Standards Laboratories",
    shortName: "1959 Yard & Pound Agreement",
    documentTitle:
      "Refinement of Values for the Yard and the Pound (1959 International Yard and Pound Agreement)",
    standardCode: "1959 Int'l Yard & Pound Agreement",
    url: "https://www.nist.gov/pml/owm/si-units-length",
    verificationNote:
      "International treaty among the US, UK, Canada, Australia, New Zealand, and South Africa defining 1 yard = 0.9144 m (1 ft = 0.3048 m, 1 in = 25.4 mm, 1 mi = 1,609.344 m) and 1 pound = 0.45359237 kg exactly.",
    topicBadge: "Foot, Inch, Mile & Pound Exact Definitions",
    verifiedFormula: "1 yd = 0.9144 m · 1 ft = 0.3048 m · 1 in = 2.54 cm · 1 lb = 0.45359237 kg",
    linkLabel: "1959 Yard & Pound Standard",
    citationText:
      "Refinement of Values for the Yard and the Pound, Federal Register Doc. 59-5442 (1959 International Yard and Pound Agreement)",
  },
  {
    organization:
      "Bureau International des Poids et Mesures (International Bureau of Weights and Measures)",
    shortName: "BIPM",
    documentTitle: "The International System of Units (SI Brochure, 9th Edition)",
    standardCode: "BIPM SI-9",
    url: "https://www.bipm.org/en/publications/si-brochure",
    verificationNote:
      "International treaty definitions for the 7 base SI units (metre, kilogram, second, ampere, kelvin, mole, candela) and 22 coherent derived SI units.",
    topicBadge: "International SI Base & Derived Units",
    verifiedFormula: "Exact fundamental constants (c, h, e, k, N_A)",
    linkLabel: "BIPM SI Brochure",
    citationText:
      "Bureau International des Poids et Mesures, The International System of Units (SI Brochure, 9th Edition)",
  },
];

const CATEGORY_PRIMARY_AUTHORITY: Record<
  string,
  {
    primaryOrg: string;
    primaryShort: string;
    primaryCode: string;
    primaryUrl: string;
    secondaryOrg: string;
    secondaryShort: string;
    secondaryCode: string;
    secondaryUrl: string;
    tertiaryOrg: string;
    tertiaryShort: string;
    tertiaryCode: string;
    tertiaryUrl: string;
  }
> = {
  length: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Length)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg:
      "National Bureau of Standards (NIST) & International Standards Laboratories",
    secondaryShort: "1959 Yard & Pound Agreement",
    secondaryCode: "1959 International Yard and Pound Agreement",
    secondaryUrl: "https://www.nist.gov/pml/owm/si-units-length",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "SI Base Unit: Metre (m)",
    tertiaryUrl: "https://www.bipm.org/en/si-base-units/metre",
  },
  mass: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Mass)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg:
      "National Bureau of Standards (NIST) & International Standards Laboratories",
    secondaryShort: "1959 Yard & Pound Agreement",
    secondaryCode: "1959 International Yard and Pound Agreement (1 lb = 0.45359237 kg)",
    secondaryUrl: "https://www.nist.gov/pml/owm/si-units-mass",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "SI Base Unit: Kilogram (kg)",
    tertiaryUrl: "https://www.bipm.org/en/si-base-units/kilogram",
  },
  volume: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Volume",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-volume",
    secondaryOrg: "NIST Office of Weights and Measures (OWM)",
    secondaryShort: "NIST HB 44",
    secondaryCode: "Liquid & Dry Capacity Tables",
    secondaryUrl: "https://www.nist.gov/pml/owm/nist-handbook-44-current-edition",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST SP 811",
    tertiaryCode: "NIST SP 811 App. B.9",
    tertiaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
  },
  temperature: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Temperature",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-temperature",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Base Unit: Kelvin (K)",
    secondaryUrl: "https://www.bipm.org/en/si-base-units/kelvin",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST SP 811",
    tertiaryCode: "NIST SP 811 App. B.9 (Heat & Temp)",
    tertiaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
  },
  area: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Area)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg:
      "National Bureau of Standards (NIST) & International Standards Laboratories",
    secondaryShort: "1959 Yard & Pound Agreement",
    secondaryCode: "1959 International Yard and Pound Agreement (Area Units)",
    secondaryUrl: "https://www.nist.gov/pml/owm/si-units-length",
    tertiaryOrg: "NIST Office of Weights and Measures (OWM)",
    tertiaryShort: "NIST HB 44",
    tertiaryCode: "Acre, Hectare & Land Survey Tables",
    tertiaryUrl: "https://www.nist.gov/pml/owm/nist-handbook-44-current-edition",
  },
  speed: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Velocity)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg: "National Institute of Standards and Technology (NIST)",
    secondaryShort: "NIST OWM",
    secondaryCode: "SI Units — Length & Distance",
    secondaryUrl: "https://www.nist.gov/pml/owm/si-units-length",
    tertiaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    tertiaryShort: "NIST CUU",
    tertiaryCode: "SI Coherent Derived Units (m/s)",
    tertiaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
  },
  time: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Time",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-time",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Base Unit: Second (s)",
    secondaryUrl: "https://www.bipm.org/en/si-base-units/second",
    tertiaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    tertiaryShort: "NIST CUU",
    tertiaryCode: "Non-SI Units Accepted for Use (min, h, d)",
    tertiaryUrl: "https://physics.nist.gov/cuu/Units/outside.html",
  },
  pressure: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Pressure & Stress)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    secondaryShort: "NIST CUU",
    secondaryCode: "Derived SI Unit: Pascal (Pa)",
    secondaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "SI Brochure (9th Ed.) — Mechanics",
    tertiaryUrl: "https://www.bipm.org/en/publications/si-brochure",
  },
  energy: {
    primaryOrg: "NIST Fundamental Physical Constants (CODATA)",
    primaryShort: "NIST CODATA",
    primaryCode: "CODATA Energy & Thermodynamic Constants",
    primaryUrl: "https://physics.nist.gov/cuu/Constants/",
    secondaryOrg: "National Institute of Standards and Technology (NIST)",
    secondaryShort: "NIST SP 811",
    secondaryCode: "NIST SP 811 App. B.9 (Energy, Work & Heat)",
    secondaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "Derived SI Unit: Joule (J)",
    tertiaryUrl: "https://www.bipm.org/en/publications/si-brochure",
  },
  power: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Power & Radiant Flux)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    secondaryShort: "NIST CUU",
    secondaryCode: "Derived SI Unit: Watt (W)",
    secondaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "SI Brochure (9th Ed.) — Power",
    tertiaryUrl: "https://www.bipm.org/en/publications/si-brochure",
  },
  digital_storage: {
    primaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    primaryShort: "NIST / IEC",
    primaryCode: "IEC 80000-13 Binary Prefixes",
    primaryUrl: "https://physics.nist.gov/cuu/Units/binary.html",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Decimal Prefixes (k, M, G, T, P)",
    secondaryUrl: "https://www.bipm.org/en/measurement-units/si-prefixes",
    tertiaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    tertiaryShort: "NIST CUU",
    tertiaryCode: "SI Prefixes & Decimal Multiples",
    tertiaryUrl: "https://physics.nist.gov/cuu/Units/prefixes.html",
  },
  data_transfer: {
    primaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    primaryShort: "IEC / NIST",
    primaryCode: "IEC 80000-13 Binary & Data Rate Units",
    primaryUrl: "https://physics.nist.gov/cuu/Units/binary.html",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "Decimal Bit-Rate Prefixes",
    secondaryUrl: "https://www.bipm.org/en/measurement-units/si-prefixes",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST OWM",
    tertiaryCode: "SI Units — Time & Frequency",
    tertiaryUrl: "https://www.nist.gov/pml/owm/si-units-time",
  },
  force: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Force)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    secondaryShort: "NIST CUU",
    secondaryCode: "Derived SI Unit: Newton (N)",
    secondaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "SI Brochure (9th Ed.) — Force",
    tertiaryUrl: "https://www.bipm.org/en/publications/si-brochure",
  },
  density: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Volume & Mass Concentration",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-volume",
    secondaryOrg: "National Institute of Standards and Technology (NIST)",
    secondaryShort: "NIST SP 811",
    secondaryCode: "NIST SP 811 App. B.9 (Mass Density)",
    secondaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "Coherent SI Density Standards (kg/m³)",
    tertiaryUrl: "https://www.bipm.org/en/publications/si-brochure",
  },
  torque: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Moment of Force & Torque)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg: "National Institute of Standards and Technology (NIST)",
    secondaryShort: "NIST App. B.8",
    secondaryCode: "NIST SP 811 Alphabetical Conversion Factors",
    secondaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "Mechanics & Rotational Work (N·m)",
    tertiaryUrl: "https://www.bipm.org/en/publications/si-brochure",
  },
  frequency: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Time & Frequency",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-time",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Base Unit: Second (s) & Hertz (Hz)",
    secondaryUrl: "https://www.bipm.org/en/si-base-units/second",
    tertiaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    tertiaryShort: "NIST CUU",
    tertiaryCode: "Derived SI Unit: Hertz (Hz)",
    tertiaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
  },
  angle: {
    primaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    primaryShort: "NIST CUU",
    primaryCode: "Non-SI Units Accepted for Use (deg, arcmin, arcsec)",
    primaryUrl: "https://physics.nist.gov/cuu/Units/outside.html",
    secondaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    secondaryShort: "NIST SI",
    secondaryCode: "SI Coherent Unit: Radian (rad)",
    secondaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST SP 811",
    tertiaryCode: "NIST SP 811 App. B.9 (Plane Angle)",
    tertiaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
  },
  fuel_economy: {
    primaryOrg: "U.S. Department of Energy & Environmental Protection Agency",
    primaryShort: "DOE / EPA",
    primaryCode: "EPA 40 CFR Part 600 Fuel Economy",
    primaryUrl: "https://www.fueleconomy.gov/",
    secondaryOrg: "National Institute of Standards and Technology (NIST)",
    secondaryShort: "NIST SP 811",
    secondaryCode: "NIST SP 811 App. B.9 (Fuel Consumption)",
    secondaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    tertiaryOrg: "NIST Office of Weights and Measures (OWM)",
    tertiaryShort: "NIST OWM",
    tertiaryCode: "SI Units — Volume (US vs. Imperial Gallon)",
    tertiaryUrl: "https://www.nist.gov/pml/owm/si-units-volume",
  },
  flow: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Volume Divided by Time)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg: "NIST Office of Weights and Measures (OWM)",
    secondaryShort: "NIST OWM",
    secondaryCode: "SI Units — Volume & Flow Capacity",
    secondaryUrl: "https://www.nist.gov/pml/owm/si-units-volume",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "Coherent Volumetric Flow Units (m³/s)",
    tertiaryUrl: "https://www.bipm.org/en/publications/si-brochure",
  },
  current: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Electric Current",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-electric-current",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Base Unit: Ampere (A)",
    secondaryUrl: "https://www.bipm.org/en/si-base-units/ampere",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST SP 811",
    tertiaryCode: "NIST SP 811 App. B.9 (Electricity & Magnetism)",
    tertiaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
  },
  capacitance: {
    primaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    primaryShort: "NIST CUU",
    primaryCode: "Derived SI Unit: Farad (F)",
    primaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Prefixes (mF, µF, nF, pF)",
    secondaryUrl: "https://www.bipm.org/en/measurement-units/si-prefixes",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST OWM",
    tertiaryCode: "SI Units — Electric Current & Metrology",
    tertiaryUrl: "https://www.nist.gov/pml/owm/si-units-electric-current",
  },
  charge: {
    primaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    primaryShort: "NIST CUU",
    primaryCode: "Derived SI Unit: Coulomb (C)",
    primaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    secondaryOrg: "National Institute of Standards and Technology (NIST)",
    secondaryShort: "NIST OWM",
    secondaryCode: "SI Units — Electric Current",
    secondaryUrl: "https://www.nist.gov/pml/owm/si-units-electric-current",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST SP 811",
    tertiaryCode: "NIST SP 811 App. B.9 (1 Ah = 3,600 C)",
    tertiaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
  },
  resistance: {
    primaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    primaryShort: "NIST CUU",
    primaryCode: "Derived SI Unit: Ohm (Ω)",
    primaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    secondaryOrg: "National Institute of Standards and Technology (NIST)",
    secondaryShort: "NIST OWM",
    secondaryCode: "SI Units — Electric Current",
    secondaryUrl: "https://www.nist.gov/pml/owm/si-units-electric-current",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM",
    tertiaryCode: "SI Prefixes (mΩ, kΩ, MΩ, GΩ)",
    tertiaryUrl: "https://www.bipm.org/en/measurement-units/si-prefixes",
  },
  inductance: {
    primaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    primaryShort: "NIST CUU",
    primaryCode: "Derived SI Unit: Henry (H)",
    primaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Brochure (9th Ed.) — Inductance",
    secondaryUrl: "https://www.bipm.org/en/publications/si-brochure",
    tertiaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    tertiaryShort: "BIPM Prefixes",
    tertiaryCode: "SI Submultiples (mH, µH, nH)",
    tertiaryUrl: "https://www.bipm.org/en/measurement-units/si-prefixes",
  },
  magnetic: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST SP 811",
    primaryCode: "NIST SP 811 App. B.9 (Magnetic Flux Density)",
    primaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    secondaryOrg: "NIST Reference on Constants, Units, and Uncertainty",
    secondaryShort: "NIST CUU",
    secondaryCode: "Derived SI Unit: Tesla (T) & Weber (Wb)",
    secondaryUrl: "https://physics.nist.gov/cuu/Units/units.html",
    tertiaryOrg: "NIST Fundamental Physical Constants",
    tertiaryShort: "NIST CODATA",
    tertiaryCode: "1 Tesla = 10,000 Gauss",
    tertiaryUrl: "https://physics.nist.gov/cuu/Constants/",
  },
};

export const CATEGORY_TRUSTED_REFERENCES: Record<string, TrustedReference[]> = {
  length: [
    {
      organization: "National Institute of Standards and Technology (NIST)",
      shortName: "NIST SP 811",
      documentTitle:
        "NIST Guide to the SI, Appendix B.9: Factors for Units Listed by Kind of Quantity — Length",
      standardCode: "NIST SP 811 App. B.9",
      url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
      verificationNote:
        "Official U.S. federal conversion factors between SI length units and U.S. Customary / Imperial length units.",
      topicBadge: "Length Conversion Factors",
      verifiedFormula: "1 ft = 0.3048 m · 1 in = 2.54 cm · 1 mi = 1.609344 km",
      linkLabel: "NIST SP 811 Appendix B.9",
      citationText:
        "National Institute of Standards and Technology, Guide for the Use of the International System of Units (SI), SP 811 Appendix B.9",
    },
    {
      organization:
        "National Bureau of Standards (NIST) & International Standards Laboratories",
      shortName: "1959 Yard & Pound Agreement",
      documentTitle:
        "Refinement of Values for the Yard and the Pound (1959 International Yard and Pound Agreement)",
      standardCode: "1959 Int'l Yard & Pound Agreement",
      url: "https://www.nist.gov/pml/owm/si-units-length",
      verificationNote:
        "Establishes the exact international definitions for the yard (0.9144 m), foot (0.3048 m), inch (25.4 mm = 2.54 cm), and international mile (1,609.344 m).",
      topicBadge: "Foot, Inch, Yard & Mile Standard",
      verifiedFormula: "1 yd = 0.9144 m · 1 ft = 0.3048 m · 1 in = 25.4 mm",
      linkLabel: "1959 International Yard Agreement",
      citationText:
        "Refinement of Values for the Yard and the Pound, Federal Register Doc. 59-5442 (1959 International Yard and Pound Agreement)",
    },
    {
      organization: "Bureau International des Poids et Mesures (BIPM)",
      shortName: "BIPM",
      documentTitle:
        "SI Base Unit: The Metre (m) — Official SI Definition & Realization",
      standardCode: "BIPM SI-9",
      url: "https://www.bipm.org/en/si-base-units/metre",
      verificationNote:
        "Defines the SI base unit metre (m) and its decimal multiples (km, cm, mm, µm, nm) via the fixed numerical value of the speed of light in vacuum c = 299,792,458 m/s.",
      topicBadge: "SI Base Unit: Metre (m)",
      verifiedFormula: "1 km = 1,000 m · 1 m = 100 cm = 1,000 mm = 10⁹ nm",
      linkLabel: "BIPM Metre Standard",
      citationText:
        "Bureau International des Poids et Mesures, SI Base Unit: Metre (m)",
    },
  ],
  mass: [
    {
      organization: "National Institute of Standards and Technology (NIST)",
      shortName: "NIST SP 811",
      documentTitle:
        "NIST Guide to the SI, Appendix B.9: Factors for Units Listed by Kind of Quantity — Mass",
      standardCode: "NIST SP 811 App. B.9",
      url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
      verificationNote:
        "Verifies exact conversion factors between SI mass units and avoirdupois/troy units.",
      topicBadge: "Mass & Weight Metrology",
      verifiedFormula: "1 lb = 0.45359237 kg · 1 kg = 2.204623 lb · 1 oz = 28.34952 g",
      linkLabel: "NIST SP 811 Appendix B.9",
      citationText:
        "National Institute of Standards and Technology, Guide for the Use of the International System of Units (SI), SP 811 Appendix B.9",
    },
    {
      organization:
        "National Bureau of Standards (NIST) & International Standards Laboratories",
      shortName: "1959 Yard & Pound Agreement",
      documentTitle:
        "Refinement of Values for the Yard and the Pound (1959 International Yard and Pound Agreement)",
      standardCode: "1959 Int'l Yard & Pound Agreement",
      url: "https://www.nist.gov/pml/owm/si-units-mass",
      verificationNote:
        "Defines the international avoirdupois pound as exactly 0.45359237 kilograms (453.59237 g) and 1 ounce as 28.349523125 g.",
      topicBadge: "Pound & Ounce Exact Definition",
      verifiedFormula: "1 lb = 0.45359237 kg · 1 oz = 28.349523125 g",
      linkLabel: "1959 International Pound Agreement",
      citationText:
        "Refinement of Values for the Yard and the Pound, Federal Register Doc. 59-5442 (1959 International Yard and Pound Agreement)",
    },
    {
      organization: "Bureau International des Poids et Mesures (BIPM)",
      shortName: "BIPM",
      documentTitle:
        "SI Base Unit: The Kilogram (kg) — Definition via the Planck Constant (h)",
      standardCode: "BIPM SI-9",
      url: "https://www.bipm.org/en/si-base-units/kilogram",
      verificationNote:
        "Defines the SI base unit kilogram (kg) and decimal submultiples (gram, milligram, microgram).",
      topicBadge: "SI Base Unit: Kilogram (kg)",
      verifiedFormula: "1 kg = 1,000 g = 1,000,000 mg",
      linkLabel: "BIPM Kilogram Standard",
      citationText:
        "Bureau International des Poids et Mesures, SI Base Unit: Kilogram (kg)",
    },
  ],
};

/**
 * Generates 3 rich, topic-specific TrustedReference entries for any Category page
 */
export function getTrustedReferencesForCategory(
  categoryId: string
): TrustedReference[] {
  if (CATEGORY_TRUSTED_REFERENCES[categoryId]) {
    return CATEGORY_TRUSTED_REFERENCES[categoryId];
  }

  const cat = CATEGORY_MAP.get(categoryId);
  const units = getUnitsByCategory(categoryId);
  const auth = CATEGORY_PRIMARY_AUTHORITY[categoryId];
  if (!cat || !auth) {
    return GLOBAL_TRUSTED_REFERENCES;
  }

  const u0 = units[0];
  const u1 = units[1] || units[0];
  const u2 = units[2] || u1;
  const one01 =
    u0 && u1 ? convertUnits(1, u0.id, u1.id, "auto").formattedValue : "1";

  return [
    {
      organization: auth.primaryOrg,
      shortName: auth.primaryShort,
      documentTitle: `${cat.name} Metrology Standards — ${u0?.name || ""} (${
        u0?.symbol || ""
      }), ${u1?.name || ""} (${u1?.symbol || ""}) & ${u2?.name || ""} (${
        u2?.symbol || ""
      })`,
      standardCode: auth.primaryCode,
      url: auth.primaryUrl,
      verificationNote: `Official conversion factors and definitions for ${cat.name.toLowerCase()} units, verifying 1 ${
        u0?.symbol || ""
      } = ${one01} ${u1?.symbol || ""} across all ${
        units.length
      } supported units.`,
      topicBadge: `${cat.name} Conversion Standard`,
      verifiedFormula: `1 ${u0?.symbol || ""} = ${one01} ${u1?.symbol || ""}`,
      linkLabel: `${auth.primaryShort} Standard`,
      citationText: `${auth.primaryOrg}, ${cat.name} Metrology Standards (${auth.primaryCode})`,
    },
    {
      organization: auth.secondaryOrg,
      shortName: auth.secondaryShort,
      documentTitle: `International Reference Specification for ${cat.pluralName}`,
      standardCode: auth.secondaryCode,
      url: auth.secondaryUrl,
      verificationNote: `Defines the base reference unit (${
        UNIT_MAP.get(cat.baseUnitId)?.name || cat.baseUnitId
      }, ${
        UNIT_MAP.get(cat.baseUnitId)?.symbol || ""
      }) and exact scaling factors for ${units
        .slice(0, 5)
        .map((u) => `${u.name} (${u.symbol})`)
        .join(", ")}.`,
      topicBadge: `Base Unit: ${
        UNIT_MAP.get(cat.baseUnitId)?.name || cat.baseUnitId
      } (${UNIT_MAP.get(cat.baseUnitId)?.symbol || ""})`,
      verifiedFormula: `${units.length} verified ${cat.name.toLowerCase()} units`,
      linkLabel: `${auth.secondaryShort} Reference`,
      citationText: `${auth.secondaryOrg}, International Reference Specification for ${cat.pluralName} (${auth.secondaryCode})`,
    },
    {
      organization: auth.tertiaryOrg,
      shortName: auth.tertiaryShort,
      documentTitle: `Official ${cat.name} Conversion Factors & Rounding Rules`,
      standardCode: auth.tertiaryCode,
      url: auth.tertiaryUrl,
      verificationNote: `Governs mathematical formulas, significant-figure precision, and unit symbol notation for ${cat.name.toLowerCase()} calculations.`,
      topicBadge: `${cat.name} Formula & Symbol Standard`,
      verifiedFormula: `${cat.pluralName} Metrology Verification`,
      linkLabel: `${auth.tertiaryShort} Tables`,
      citationText: `${auth.tertiaryOrg}, ${auth.tertiaryCode}`,
    },
  ];
}

/**
 * Generates 3 page-specific TrustedReference items tailored to a specific unit conversion pair.
 * Uses NIST SP 811 and the 1959 International Yard and Pound Agreement for non-SI Imperial/US units
 * (foot, inch, mile, yard, pound, ounce, etc.), and restricts BIPM citations strictly to SI units.
 */
export function getTrustedReferencesForPair(
  pair: ConversionPairInfo,
  fromUnit: Unit,
  toUnit: Unit
): TrustedReference[] {
  const cat = CATEGORY_MAP.get(pair.categoryId);
  const auth =
    CATEGORY_PRIMARY_AUTHORITY[pair.categoryId] ||
    CATEGORY_PRIMARY_AUTHORITY.length;

  const oneForward = convertUnits(1, fromUnit.id, toUnit.id, "auto");
  const oneReverse = convertUnits(1, toUnit.id, fromUnit.id, "auto");
  const exampleOut = convertUnits(
    pair.exampleInput,
    fromUnit.id,
    toUnit.id,
    "auto"
  );

  const pairTopicTitle = `Convert ${fromUnit.plural} to ${toUnit.plural} (${fromUnit.symbol} to ${toUnit.symbol})`;
  const catName = cat?.name || "Measurement";

  const fromIsNonSi = isNonSiUnit(fromUnit.id);
  const toIsNonSi = isNonSiUnit(toUnit.id);
  const involvesNonSi = fromIsNonSi || toIsNonSi;
  const siUnitsInPair = [fromUnit, toUnit].filter((u) => !isNonSiUnit(u.id));

  if (involvesNonSi) {
    const nonSiUnits = [fromUnit, toUnit].filter((u) => isNonSiUnit(u.id));
    const nonSiLabel = nonSiUnits.map((u) => `${u.name} (${u.symbol})`).join(" & ");

    const ref1: TrustedReference = {
      organization: "National Institute of Standards and Technology (NIST)",
      shortName: "NIST SP 811",
      documentTitle: `NIST Guide to the SI, Appendix B.9 — ${fromUnit.plural} (${fromUnit.symbol}) to ${toUnit.plural} (${toUnit.symbol}) Conversion Factor`,
      standardCode: "NIST SP 811 App. B.9",
      url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
      verificationNote: `Official NIST Special Publication 811 conversion factor for ${pairTopicTitle}. Verifies 1 ${fromUnit.name.toLowerCase()} (${fromUnit.symbol}) = ${oneForward.formattedValue} ${toUnit.plural.toLowerCase()} (${toUnit.symbol}).`,
      topicBadge: `${fromUnit.plural} to ${toUnit.plural} (${fromUnit.symbol} → ${toUnit.symbol})`,
      verifiedFormula: `1 ${fromUnit.symbol} = ${oneForward.formattedValue} ${toUnit.symbol} · 1 ${toUnit.symbol} = ${oneReverse.formattedValue} ${fromUnit.symbol}`,
      linkLabel: "NIST SP 811 Appendix B.9",
      citationText:
        "National Institute of Standards and Technology, Guide for the Use of the International System of Units (SI), SP 811 Appendix B.9",
    };

    const ref2: TrustedReference = {
      organization:
        "National Bureau of Standards (NIST) & International Standards Laboratories",
      shortName: "1959 Yard & Pound Agreement",
      documentTitle: `1959 International Yard and Pound Agreement — Legal Definition of ${nonSiLabel}`,
      standardCode: "1959 Int'l Yard & Pound Agreement",
      url:
        pair.categoryId === "mass"
          ? "https://www.nist.gov/pml/owm/si-units-mass"
          : "https://www.nist.gov/pml/owm/si-units-length",
      verificationNote: `Establishes the exact international standard for ${nonSiLabel} under the 1959 International Yard and Pound Agreement (1 yard = 0.9144 m, 1 foot = 0.3048 m, 1 inch = 25.4 mm, 1 mile = 1,609.344 m, 1 pound = 0.45359237 kg).`,
      topicBadge: `${nonSiLabel} Standard`,
      verifiedFormula: `Example: ${pair.exampleInput} ${fromUnit.symbol} = ${exampleOut.formattedValue} ${toUnit.symbol}`,
      linkLabel: "1959 International Yard & Pound Standard",
      citationText:
        "Refinement of Values for the Yard and the Pound, Federal Register Doc. 59-5442 (1959 International Yard and Pound Agreement)",
    };

    const ref3: TrustedReference =
      siUnitsInPair.length > 0
        ? {
            organization: "Bureau International des Poids et Mesures (BIPM)",
            shortName: "BIPM",
            documentTitle: `SI Unit Definition: ${siUnitsInPair
              .map((u) => `${u.name} (${u.symbol})`)
              .join(" & ")} — SI Brochure (9th Edition)`,
            standardCode: "BIPM SI-9",
            url:
              pair.categoryId === "length"
                ? "https://www.bipm.org/en/si-base-units/metre"
                : pair.categoryId === "mass"
                  ? "https://www.bipm.org/en/si-base-units/kilogram"
                  : "https://www.bipm.org/en/publications/si-brochure",
            verificationNote: `Official BIPM SI definition for ${siUnitsInPair
              .map((u) => `${u.name} (${u.symbol})`)
              .join(" and ")}.`,
            topicBadge: `SI Standard: ${siUnitsInPair.map((u) => u.symbol).join(", ")}`,
            verifiedFormula: oneForward.formulaDisplay,
            linkLabel: "BIPM SI Brochure",
            citationText: `Bureau International des Poids et Mesures, The International System of Units (SI Brochure, 9th Ed.) — ${siUnitsInPair
              .map((u) => u.name)
              .join(", ")}`,
          }
        : {
            organization: "NIST Office of Weights and Measures (OWM)",
            shortName: "NIST OWM",
            documentTitle: `U.S. Customary & Imperial ${catName} Unit Specifications (${fromUnit.symbol} to ${toUnit.symbol})`,
            standardCode: "NIST Handbook 44",
            url: "https://www.nist.gov/pml/owm/nist-handbook-44-current-edition",
            verificationNote: `${pair.formulaDescription}${
              pair.regionalNote ? ` ${pair.regionalNote}` : ""
            }`,
            topicBadge: `${fromUnit.symbol} to ${toUnit.symbol} Mathematical Basis`,
            verifiedFormula: oneForward.formulaDisplay,
            linkLabel: "NIST Handbook 44",
            citationText:
              "National Institute of Standards and Technology, Office of Weights and Measures, NIST Handbook 44",
          };

    return [ref1, ref2, ref3];
  }

  return [
    {
      organization: auth.primaryOrg,
      shortName: auth.primaryShort,
      documentTitle: `${catName} Metrology Standard — ${fromUnit.plural} (${fromUnit.symbol}) to ${toUnit.plural} (${toUnit.symbol})`,
      standardCode: auth.primaryCode,
      url: auth.primaryUrl,
      verificationNote: `Official metrology reference for ${pairTopicTitle}. Verifies the exact conversion relationship 1 ${fromUnit.name.toLowerCase()} (${fromUnit.symbol}) = ${oneForward.formattedValue} ${toUnit.plural.toLowerCase()} (${toUnit.symbol}).`,
      topicBadge: `${fromUnit.plural} to ${toUnit.plural} (${fromUnit.symbol} → ${toUnit.symbol})`,
      verifiedFormula: `1 ${fromUnit.symbol} = ${oneForward.formattedValue} ${toUnit.symbol} · 1 ${toUnit.symbol} = ${oneReverse.formattedValue} ${fromUnit.symbol}`,
      linkLabel: `${auth.primaryShort} Standard`,
      citationText: `${auth.primaryOrg}, ${catName} Standard (${auth.primaryCode})`,
    },
    {
      organization: auth.secondaryOrg,
      shortName: auth.secondaryShort,
      documentTitle: `SI Unit Specifications: ${fromUnit.name} (${fromUnit.symbol}) & ${toUnit.name} (${toUnit.symbol})`,
      standardCode: auth.secondaryCode,
      url: auth.secondaryUrl,
      verificationNote: `Defines ${fromUnit.name} (${fromUnit.symbol}): ${
        fromUnit.description || `standard ${catName.toLowerCase()} unit`
      } And ${toUnit.name} (${toUnit.symbol}): ${
        toUnit.description || `standard ${catName.toLowerCase()} unit`
      }`,
      topicBadge: `${fromUnit.name} (${fromUnit.symbol}) & ${toUnit.name} (${toUnit.symbol}) Specs`,
      verifiedFormula: `Example: ${pair.exampleInput} ${fromUnit.symbol} = ${exampleOut.formattedValue} ${toUnit.symbol}`,
      linkLabel: `${auth.secondaryShort} Specification`,
      citationText: `${auth.secondaryOrg}, ${auth.secondaryCode} — ${fromUnit.name} & ${toUnit.name}`,
    },
    {
      organization: auth.tertiaryOrg,
      shortName: auth.tertiaryShort,
      documentTitle: `Conversion Factors & Mathematical Basis (${fromUnit.symbol} to ${toUnit.symbol})`,
      standardCode: auth.tertiaryCode,
      url: auth.tertiaryUrl,
      verificationNote: `${pair.formulaDescription}${
        pair.regionalNote ? ` ${pair.regionalNote}` : ""
      }`,
      topicBadge: `${fromUnit.symbol} to ${toUnit.symbol} Mathematical Basis`,
      verifiedFormula: oneForward.formulaDisplay,
      linkLabel: `${auth.tertiaryShort} Reference`,
      citationText: `${auth.tertiaryOrg}, ${auth.tertiaryCode}`,
    },
  ];
}
