import type { Metadata } from "next";
import Link from "next/link";
import { getConversionsByCategory } from "@/lib/conversions/catalogue";
import { UNIT_MAP } from "@/lib/conversions/units";
import { getCanonicalConverterPath } from "@/lib/conversions/url";
import { getConverterTier } from "@/lib/seo-tiers";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import { ArrowRight, ChevronRight, Gauge, Compass, BookOpen } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: `Specialty & Engineering Unit Converters (Fuel Economy, Molar, Resolution & Radiation) | ${SITE_CONFIG.name}`,
  description:
    "Convert automotive fuel consumption (MPG to L/100km, US vs UK MPG), molar concentration, digital image resolution (DPI/PPI), and radiation units with exact NIST SP 811 precision.",
  canonicalPath: "/specialty",
  useExactTitle: true,
});

const SPECIALTY_CATEGORY_IDS = [
  "fuel_economy",
  "concentration_molar",
  "digital_image_resolution",
  "radiation",
] as const;

export default function SpecialtyHubPage() {
  const allSpecialtyPairs = SPECIALTY_CATEGORY_IDS.flatMap((catId) =>
    getConversionsByCategory(catId)
  );

  const tierABPairs = allSpecialtyPairs.filter((p) => {
    const t = getConverterTier(p);
    return t === "A" || t === "B";
  });

  const tierCPairs = allSpecialtyPairs.filter((p) => getConverterTier(p) === "C");

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]/65 dark:bg-[#080d14] text-[#16324F] dark:text-slate-200">
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[#0D9488] dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#16324F] dark:text-slate-200 font-semibold">Specialty &amp; Engineering Hub</span>
        </nav>

        {/* Hero */}
        <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[#0D9488] dark:text-emerald-400 text-xs font-medium">
            <Gauge className="w-3.5 h-3.5" />
            Consolidated Engineering &amp; Specialty Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
            Specialty &amp; Engineering Unit Converters
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            This consolidated engineering hub brings together high-demand automotive fuel consumption
            converters (US MPG, UK Imperial MPG, km/L, and L/100km) alongside specialized laboratory
            molar concentration, digital imaging resolution (DPI/PPI), and dosimetry reference tools.
          </p>
        </section>

        {/* Tier A / B Priority Converters */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white">
                Popular Specialty &amp; Fuel Economy Converters
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                High-demand engineering and automotive conversion pairs verified against NIST SP 811.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {tierABPairs.map((pair) => {
              const fromU = UNIT_MAP.get(pair.fromUnitId);
              const toU = UNIT_MAP.get(pair.toUnitId);
              const href = getCanonicalConverterPath(pair.categoryId, pair.slug);
              return (
                <Link
                  key={`${pair.categoryId}/${pair.slug}`}
                  href={href}
                  className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:border-[#0D9488] dark:hover:border-emerald-500/40 transition-all shadow-2xs"
                >
                  <div className="min-w-0 pr-3">
                    <div className="text-sm font-bold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-emerald-400 transition-colors truncate">
                      {fromU?.plural || pair.fromUnitId} to {toU?.plural || pair.toUnitId}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {fromU?.symbol} → {toU?.symbol}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Related Engineering Guides & Core Hubs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/guides/us-vs-uk-mpg-fuel-economy"
            className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-[#0D9488] dark:hover:border-emerald-500/40 transition-all flex items-start gap-3.5 shadow-2xs"
          >
            <BookOpen className="w-5 h-5 text-[#0D9488] dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-[#16324F] dark:text-white">
                US MPG vs. UK Imperial MPG vs. L/100km Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Understand the reciprocal 235.215 hyperbola formula and why UK Imperial gallons
                produce 20.1% higher MPG ratings.
              </p>
            </div>
          </Link>
          <Link
            href="/directory"
            className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-[#0D9488] dark:hover:border-emerald-500/40 transition-all flex items-start gap-3.5 shadow-2xs"
          >
            <Compass className="w-5 h-5 text-[#0D9488] dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-[#16324F] dark:text-white">
                Browse Full Measurement Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore all primary physical measurement categories including Length, Weight,
                Pressure, Power, Energy, Speed, and Volume.
              </p>
            </div>
          </Link>
        </section>

        {/* Collapsed All Conversions (<details>) for Tier C Specialty Pairs */}
        {tierCPairs.length > 0 && (
          <section className="rounded-xl border border-slate-200/90 dark:border-slate-800/70 bg-white dark:bg-slate-900/30 p-5 shadow-2xs">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold text-[#16324F] dark:text-slate-300 hover:text-[#0D9488]">
                <span>
                  All conversions ({tierCPairs.length} additional specialty, molar, resolution &amp; radiation pairs)
                </span>
                <span className="text-xs text-[#0D9488] dark:text-emerald-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/70 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {tierCPairs.map((pair) => {
                  const fromU = UNIT_MAP.get(pair.fromUnitId);
                  const toU = UNIT_MAP.get(pair.toUnitId);
                  const href = getCanonicalConverterPath(pair.categoryId, pair.slug);
                  return (
                    <Link
                      key={`${pair.categoryId}/${pair.slug}`}
                      href={href}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#0D9488] dark:hover:text-emerald-400 py-1.5 px-2.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors truncate"
                    >
                      {fromU?.plural || pair.fromUnitId} to {toU?.plural || pair.toUnitId} (
                      {fromU?.symbol} to {toU?.symbol})
                    </Link>
                  );
                })}
              </div>
            </details>
          </section>
        )}
      </div>
    </div>
  );
}

