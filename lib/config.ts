/**
 * Global Site Configuration for UnitConvertersGo (UnitConvertersGo.com)
 * Provides a single source of truth for site URLs, metadata, brand details, and AdSense settings.
 */

export const SITE_CONFIG = {
  name: "UnitConvertersGo",
  domain: "UnitConvertersGo.com",
  tagline: "High-Precision Real-Time Unit Converter",
  description:
    "Fast, accurate, mobile-first unit conversion platform calculating length, mass, temperature, digital storage, pressure, and 78 measurement categories in real time.",
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
