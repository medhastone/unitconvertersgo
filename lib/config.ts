/**
 * Global Site Configuration for UnitConvertersGo (UnitConvertersGo.com)
 * Provides a single source of truth for site URLs, metadata, brand details, and AdSense settings.
 */

import { CATEGORIES } from "./conversions/units";
import { CONVERSION_CATALOGUE } from "./conversions/catalogue";

export const TOTAL_CATEGORIES_COUNT = CATEGORIES.length;
export const TOTAL_CONVERTER_PAIRS_COUNT = CONVERSION_CATALOGUE.length;

export const SITE_CONFIG = {
  name: "UnitConvertersGo",
  domain: "UnitConvertersGo.com",
  tagline: "Free Online Unit Converter & Measurement Calculator",
  homepageTitle: "UnitConvertersGo – Free Online Unit Converter",
  description: `Convert ${CONVERSION_CATALOGUE.length} unit calculators across ${CATEGORIES.length} measurement categories instantly. Try our free unit converter for length, weight, volume, and temperature now!`,
  // Production or runtime app URL without trailing slash
  baseUrl: (
    process.env.APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://unitconvertersgo.com")
  ).replace(/\/+$/, ""),
  canonicalDomain: (
    process.env.APP_URL || "https://unitconvertersgo.com"
  ).replace(/\/+$/, ""),
  author: "UnitConvertersGo Editorial & Engineering Team",
  contactEmail: "info@unitconvertersgo.com",
  formRecipientEmail: "medhastone@gmail.com",
  legalLastUpdated: "October 21, 2026",
  legalLastUpdatedIso: "2026-10-21",
  // Google AdSense Configuration (Disabled by default per prompt instructions)
  adsense: {
    enabled: false,
    publisherId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
    slots: {
      topBanner: "1234567890",
      sidebarBox: "2345678901",
      inContent: "3456789012",
    },
  },
};
