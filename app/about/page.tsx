import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, Globe, Layers, Code2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import { CATEGORIES, UNITS, UNIT_MAP } from "@/lib/conversions/units";
import { CONVERSION_CATALOGUE, getCategoryUrl } from "@/lib/conversions/catalogue";
import LegalPageLayout, { TocItem } from "@/components/LegalPageLayout";

export const metadata: Metadata = buildPageMetadata({
  title: `About ${SITE_CONFIG.name}`,
  description:
    "Learn about UnitConvertersGo: how our browser-based unit conversion calculators work, which 78 measurement categories are supported, and how our formulas align with SI and NIST standards.",
  canonicalPath: "/about",
});

const ABOUT_TOC: TocItem[] = [
  { id: "purpose", label: "Purpose of UnitConvertersGo" },
  { id: "how-it-works", label: "How Our Conversion Calculators Work" },
  { id: "supported-categories", label: "Supported Measurement Categories" },
  { id: "reference-standards", label: "Reference Standards & Formula Transparency" },
  { id: "embeddable-widgets", label: "Free Embeddable Calculator Widgets" },
  { id: "limitations-feedback", label: "Reasonable Limitations & Continuous Improvement" },
];

export default function AboutPage() {
  const categoryCount = CATEGORIES.length;
  const unitCount = UNITS.length;
  const pairCount = CONVERSION_CATALOGUE.length;

  return (
    <LegalPageLayout
      title={`About ${SITE_CONFIG.name}`}
      subtitle={`${SITE_CONFIG.name} is a free, distraction-free online unit conversion platform designed to make converting between metric, imperial, and specialized scientific units fast, clear, and accessible on any device.`}
      badgeText="About the Platform"
      canonicalPath="/about"
      showLastUpdated={false}
      toc={ABOUT_TOC}
    >
      {/* 1. Purpose */}
      <section id="purpose" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          1. Purpose of {SITE_CONFIG.name}
        </h2>
        <p>
          Whether you are checking a recipe in fluid ounces and milliliters, converting centimeters to inches for a home project, comparing tire pressure in PSI and bar, or working through physics and engineering coursework, looking up a unit conversion should take seconds—not a frustrating search through cluttered pages.
        </p>
        <p>
          We built <strong>{SITE_CONFIG.name}</strong> around four practical design principles:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#16324F] dark:text-white">
              <Cpu className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
              <span>Instant In-Browser Calculation</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Results update in real time as you type, without page reloads, form submissions, or server round-trips.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#16324F] dark:text-white">
              <Layers className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
              <span>Visible Formulas &amp; Worked Examples</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Every converter page shows the underlying mathematical formula, step-by-step calculation, and a quick-reference lookup table.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#16324F] dark:text-white">
              <Globe className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
              <span>Accessible Across All Devices</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Responsive layouts, keyboard-navigable controls, clear typography, and light/dark modes make tools comfortable on mobile phones, tablets, and desktops.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#16324F] dark:text-white">
              <Code2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
              <span>Privacy-Respecting Architecture</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              No user accounts are required, and your calculator inputs stay in your browser rather than being logged on a remote database.
            </p>
          </div>
        </div>
      </section>

      {/* 2. How Calculators Work */}
      <section id="how-it-works" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          2. How Our Conversion Calculators Work
        </h2>
        <p>
          Each measurement category in {SITE_CONFIG.name} defines an authoritative base unit—typically the International System of Units (SI) coherent base or derived unit, such as the meter (<code className="font-mono text-xs">m</code>) for length, the kilogram (<code className="font-mono text-xs">kg</code>) for mass, the pascal (<code className="font-mono text-xs">Pa</code>) for pressure, or the joule (<code className="font-mono text-xs">J</code>) for energy.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Linear Multiplicative Conversions:</strong> When converting from a source unit <code className="font-mono text-xs">A</code> to a target unit <code className="font-mono text-xs">B</code>, the input value is first normalized to the category&apos;s SI base unit and then divided by the target unit&apos;s base factor.
          </li>
          <li>
            <strong>Non-Linear &amp; Offset Scales:</strong> Scales with zero-point offsets or inverse relationships—such as Celsius, Fahrenheit, Kelvin, and Rankine temperature conversions, or Miles per Gallon (MPG) to Liters per 100 Kilometers (<code className="font-mono text-xs">L/100km</code>)—use dedicated analytical formulas.
          </li>
          <li>
            <strong>Readable Number Formatting:</strong> Outputs are formatted with appropriate significant figures to prevent floating-point representation artifacts while preserving scientific notation for extremely large or small magnitudes.
          </li>
        </ul>
      </section>

      {/* 3. Supported Measurement Categories */}
      <section id="supported-categories" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          3. Supported Measurement Categories ({categoryCount} Categories, {unitCount} Units &amp; {pairCount} Dedicated Converters)
        </h2>
        <p>
          Below are the measurement categories currently implemented and available on {SITE_CONFIG.name}. Click any category to open its interactive converter and unit reference tables:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
          {CATEGORIES.map((cat) => {
            const baseUnit = UNIT_MAP.get(cat.baseUnitId);
            const baseLabel = baseUnit
              ? `${baseUnit.name} (${baseUnit.symbol})`
              : cat.baseUnitId;
            return (
              <Link
                key={cat.id}
                href={getCategoryUrl(cat.id)}
                className="group flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] transition-all"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] truncate">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Base unit: {baseLabel}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>

        <div className="pt-1">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
          >
            <span>Browse All Converters &amp; A–Z Unit Index</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Reference Standards */}
      <section id="reference-standards" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          4. Reference Standards &amp; Formula Transparency
        </h2>
        <p>
          To keep conversion factors consistent and verifiable, our unit definitions are cross-checked against publicly available documentation published by international standards bodies:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>NIST Special Publication 811:</strong> <em>Guide for the Use of the International System of Units (SI)</em>, published by the National Institute of Standards and Technology.
          </li>
          <li>
            <strong>BIPM SI Brochure (9th Edition):</strong> Official definitions of the seven SI base units and coherent derived units maintained by the Bureau International des Poids et Mesures.
          </li>
          <li>
            <strong>ISO/IEC 80000 Quantities and Units:</strong> Standard notation for physical quantities, mechanical and thermodynamic units, and binary/decimal data prefixes.
          </li>
        </ul>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Note: {SITE_CONFIG.name} is an independent educational and utility website and is not affiliated with or endorsed by NIST, BIPM, or ISO.
        </p>
      </section>

      {/* 5. Embeddable Widgets */}
      <section id="embeddable-widgets" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          5. Free Embeddable Calculator Widgets
        </h2>
        <p>
          Educators, bloggers, documentation authors, and site owners can embed any converter from {SITE_CONFIG.name} onto their own pages using our <Link href="/widgets" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Calculator Widgets Studio</Link>, which supports customizable themes, accent colors, default values, and four embed layouts.
        </p>
      </section>

      {/* 6. Limitations & Feedback */}
      <section id="limitations-feedback" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          6. Reasonable Limitations &amp; Continuous Improvement
        </h2>
        <p>
          While we carefully verify our conversion constants and formulas, software calculations can be affected by floating-point rounding, significant-figure formatting, and regional unit naming conventions. As explained in our <Link href="/disclaimer" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Disclaimer</Link>, users should always independently verify results for safety-critical, medical, engineering, or financial applications.
        </p>
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#16324F] dark:text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
              <span>Have a Unit Suggestion or Formula Question?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Reach us at{" "}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>{" "}
              or use our Contact form.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#16324F] hover:bg-[#0D9488] dark:bg-[#0D9488] dark:hover:bg-[#0F766E] text-white transition-colors shrink-0"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
