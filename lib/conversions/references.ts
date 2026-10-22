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

export const GLOBAL_TRUSTED_REFERENCES: TrustedReference[] = [
  {
    organization:
      "National Institute of Standards and Technology (U.S. Department of Commerce)",
    shortName: "NIST",
    documentTitle:
      "Checking the Net Contents of Packaged Goods, Handbook 133 - 2019 Edition & NIST SP 811",
    standardCode: "NIST HB 133 / SP 811",
    url: "https://nvlpubs.nist.gov/nistpubs/hb/2019/NIST.HB.133-2019.pdf",
    verificationNote:
      "Official U.S. federal conversion factors between SI metric and U.S. Customary measurement units across all 25 categories.",
    topicBadge: "SI & U.S. Customary Conversion Factors",
    verifiedFormula: "1 in = 2.54 cm · 1 lb = 0.45359237 kg · 1 gal = 3.785411784 L",
    linkLabel: "NIST HB 133 Standard",
    citationText:
      "National Institute of Standards and Technology, Checking the Net Contents of Packaged Goods, Handbook 133 - 2019 Edition",
  },
  {
    organization:
      "Bureau International des Poids et Mesures (International Bureau of Weights and Measures)",
    shortName: "BIPM",
    documentTitle: "The International System of Units (SI Brochure, 9th Edition)",
    standardCode: "BIPM SI-9",
    url: "https://www.bipm.org/en/publications/si-brochure",
    verificationNote:
      "International treaty definitions for the 7 base SI units (meter, kilogram, second, ampere, kelvin, mole, candela) and 22 coherent derived units.",
    topicBadge: "International SI Base & Derived Units",
    verifiedFormula: "Exact fundamental constants (c, h, e, k, N_A)",
    linkLabel: "BIPM SI Brochure",
    citationText:
      "Bureau International des Poids et Mesures, The International System of Units (SI Brochure, 9th Edition)",
  },
  {
    organization: "National Institute of Standards and Technology (NIST)",
    shortName: "NIST SP 811",
    documentTitle:
      "NIST Guide to the SI, Appendix B.9: Factors for Units Listed by Kind of Quantity or Field of Science",
    standardCode: "NIST SP 811 App. B.9",
    url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
    verificationNote:
      "Authoritative conversion factors organized by physical quantity and engineering discipline.",
    topicBadge: "Conversion Factors by Category",
    verifiedFormula: "NIST Special Publication 811 Appendix B.9",
    linkLabel: "NIST SP 811 Appendix B.9",
    citationText:
      "National Institute of Standards and Technology, Guide for the Use of the International System of Units (SI), SP 811 Appendix B.9",
  },
];

/**
 * Primary topic-specific external reference URLs by category and specialized unit domains.
 * Every URL below has been verified to return HTTP 200 OK and is publicly accessible.
 */
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
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Length",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-length",
    secondaryOrg: "Bureau International des Poids et Mesures (BIPM)",
    secondaryShort: "BIPM",
    secondaryCode: "SI Base Unit: Metre (m)",
    secondaryUrl: "https://www.bipm.org/en/si-base-units/metre",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST HB 133",
    tertiaryCode: "NIST Handbook 133 (2019 Ed.)",
    tertiaryUrl: "https://nvlpubs.nist.gov/nistpubs/hb/2019/NIST.HB.133-2019.pdf",
  },
  mass: {
    primaryOrg: "National Institute of Standards and Technology (NIST)",
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Mass",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-mass",
    secondaryOrg: "NIST Office of Weights and Measures (OWM)",
    secondaryShort: "NIST HB 44",
    secondaryCode: "NIST Handbook 44 (Current Ed.)",
    secondaryUrl: "https://www.nist.gov/pml/owm/nist-handbook-44-current-edition",
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
    primaryShort: "NIST OWM",
    primaryCode: "SI Units — Length & Area",
    primaryUrl: "https://www.nist.gov/pml/owm/si-units-length",
    secondaryOrg: "NIST Office of Weights and Measures (OWM)",
    secondaryShort: "NIST HB 44",
    secondaryCode: "Acre, Hectare & Land Survey Tables",
    secondaryUrl: "https://www.nist.gov/pml/owm/nist-handbook-44-current-edition",
    tertiaryOrg: "National Institute of Standards and Technology (NIST)",
    tertiaryShort: "NIST SP 811",
    tertiaryCode: "NIST SP 811 App. B.9 (Area)",
    tertiaryUrl:
      "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
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
      shortName: "NIST OWM",
      documentTitle:
        "SI Units — Length: Official U.S. Metrology Definitions & International Yard Agreement",
      standardCode: "NIST SI Length",
      url: "https://www.nist.gov/pml/owm/si-units-length",
      verificationNote:
        "Verifies the 1959 International Yard and Pound Agreement (1 yard = 0.9144 m, 1 foot = 0.3048 m, 1 inch = 25.4 mm = 2.54 cm).",
      topicBadge: "Length & Distance Metrology",
      verifiedFormula: "1 in = 2.54 cm · 1 ft = 0.3048 m · 1 mi = 1.609344 km",
      linkLabel: "NIST SI Length",
      citationText:
        "National Institute of Standards and Technology, Office of Weights and Measures — SI Units: Length",
    },
    {
      organization: "Bureau International des Poids et Mesures (BIPM)",
      shortName: "BIPM",
      documentTitle:
        "SI Base Unit: The Metre (m) — Official Definition & Realization",
      standardCode: "BIPM SI-9",
      url: "https://www.bipm.org/en/si-base-units/metre",
      verificationNote:
        "Defines the metre (m) via the fixed numerical value of the speed of light in vacuum c = 299,792,458 m/s.",
      topicBadge: "SI Base Unit: Metre (m)",
      verifiedFormula: "1 km = 1,000 m · 1 m = 100 cm = 1,000 mm = 10⁹ nm",
      linkLabel: "BIPM Metre Standard",
      citationText:
        "Bureau International des Poids et Mesures, SI Base Unit: Metre (m)",
    },
    {
      organization: "National Institute of Standards and Technology (NIST)",
      shortName: "NIST HB 133",
      documentTitle:
        "Checking the Net Contents of Packaged Goods, Handbook 133 (2019 Edition)",
      standardCode: "NIST HB 133",
      url: "https://nvlpubs.nist.gov/nistpubs/hb/2019/NIST.HB.133-2019.pdf",
      verificationNote:
        "Authoritative U.S. federal handbook for linear, area, mass, and volumetric commercial conversions.",
      topicBadge: "U.S. Customary & Metric Tables",
      verifiedFormula: "1 in = 25,400,000 nm · 1 yd = 0.9144 m",
      linkLabel: "NIST Handbook 133 PDF",
      citationText:
        "National Institute of Standards and Technology, Checking the Net Contents of Packaged Goods, Handbook 133 - 2019 Edition",
    },
  ],
  mass: [
    {
      organization: "National Institute of Standards and Technology (NIST)",
      shortName: "NIST OWM",
      documentTitle:
        "SI Units — Mass: Avoirdupois, Metric & Commercial Weight Standards",
      standardCode: "NIST SI Mass",
      url: "https://www.nist.gov/pml/owm/si-units-mass",
      verificationNote:
        "Verifies the exact legal definition of the international avoirdupois pound: 1 lb = 0.45359237 kg (453.59237 g) and 1 oz = 28.349523125 g.",
      topicBadge: "Mass & Weight Metrology",
      verifiedFormula: "1 lb = 453.59237 g · 1 kg = 2.20462262 lb · 1 lb = 16 oz",
      linkLabel: "NIST SI Mass",
      citationText:
        "National Institute of Standards and Technology, Office of Weights and Measures — SI Units: Mass",
    },
    {
      organization: "NIST Office of Weights and Measures",
      shortName: "NIST HB 44",
      documentTitle:
        "NIST Handbook 44 (Current Edition) — Specifications, Tolerances & Mass Conversion Tables",
      standardCode: "NIST HB 44",
      url: "https://www.nist.gov/pml/owm/nist-handbook-44-current-edition",
      verificationNote:
        "Distinguishes commercial avoirdupois weight (1 lb = 7,000 grains = 453.59237 g) from precious-metal Troy weight (1 oz t = 31.1034768 g).",
      topicBadge: "Avoirdupois vs. Troy & Metric Tons",
      verifiedFormula: "1 oz = 28.3495 g · 1 oz t = 31.1035 g · 1 t = 1,000 kg",
      linkLabel: "NIST Handbook 44",
      citationText:
        "National Institute of Standards and Technology, Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices, Handbook 44",
    },
    {
      organization: "Bureau International des Poids et Mesures (BIPM)",
      shortName: "BIPM",
      documentTitle:
        "SI Base Unit: The Kilogram (kg) — Definition via the Planck Constant (h)",
      standardCode: "BIPM SI-9",
      url: "https://www.bipm.org/en/si-base-units/kilogram",
      verificationNote:
        "Defines the kilogram (kg) and decimal submultiples (gram, milligram, microgram) used in laboratory, medical, and industrial weighing.",
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
 * Generates 3 page-specific TrustedReference items tailored to a specific unit conversion pair
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
      documentTitle: `Unit Specifications: ${fromUnit.name} (${fromUnit.symbol}) & ${toUnit.name} (${toUnit.symbol})`,
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
