import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import LegalPageLayout, { TocItem } from "@/components/LegalPageLayout";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer — Measurement Precision Notice",
  description:
    "Read the UnitConvertersGo Disclaimer. Understand the informational purpose of our conversion tools, how rounding and unit definitions work, and when to verify critical calculations.",
  canonicalPath: "/disclaimer",
  noindex: true,
});

const DISCLAIMER_TOC: TocItem[] = [
  { id: "informational-purpose", label: "General Informational & Educational Purpose" },
  { id: "precision-rounding", label: "Formulas, Precision & Rounding Behavior" },
  { id: "unit-conventions", label: "Regional & Domain Unit Conventions" },
  { id: "high-stakes-verification", label: "High-Stakes & Safety-Critical Applications" },
  { id: "no-professional-advice", label: "Not a Substitute for Professional Advice" },
  { id: "report-discrepancy", label: "Reporting a Discrepancy or Requesting Clarification" },
];

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      subtitle="This Disclaimer explains the intended scope of UnitConvertersGo's conversion calculators and reference tables, how mathematical precision and regional unit conventions affect results, and when independent verification is required."
      badgeText="Accuracy & Scope Notice"
      canonicalPath="/disclaimer"
      showLastUpdated={true}
      toc={DISCLAIMER_TOC}
    >
      {/* 1. Informational Purpose */}
      <section id="informational-purpose" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          1. General Informational &amp; Educational Purpose
        </h2>
        <p>
          <strong>{SITE_CONFIG.name}</strong> is built to make everyday, academic, and technical unit conversions fast, clear, and accessible. Our calculators, conversion factors, worked examples, and lookup tables are grounded in widely recognized international standards, including the International System of Units (SI) and NIST Special Publication 811.
        </p>
        <p>
          All conversion outputs, formulas, and explanatory guides on {SITE_CONFIG.name} are provided for <strong>general informational, educational, and reference purposes</strong>.
        </p>
      </section>

      {/* 2. Precision & Rounding */}
      <section id="precision-rounding" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          2. Formulas, Precision &amp; Rounding Behavior
        </h2>
        <p>
          Conversion results depend on the mathematical definition of the selected units, the precision of the input value, and how decimal values are rounded for display:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Exact vs. Approximate Factors:</strong> Many modern conversion factors are defined as exact mathematical constants (for example, 1 international inch is defined as exactly <code className="font-mono text-xs">25.4</code> millimeters, and 1 international avoirdupois pound is exactly <code className="font-mono text-xs">0.45359237</code> kilograms). Other conversions involve irrational numbers (such as degrees to radians using <code className="font-mono text-xs">&pi;</code>) or reciprocal divisions that produce repeating decimals.
          </li>
          <li>
            <strong>IEEE 754 Floating-Point Arithmetic:</strong> Like all modern web browsers and scientific JavaScript tools, {SITE_CONFIG.name} evaluates expressions using 64-bit IEEE 754 floating-point numbers and formats outputs to a practical number of significant figures so results remain readable without trailing binary noise.
          </li>
          <li>
            <strong>Significant Figures &amp; Tolerance:</strong> A calculator cannot know the measurement uncertainty of your physical instrument. If you measure a board as 12 inches with a standard ruler, converting that number to <code className="font-mono text-xs">304.8 mm</code> does not mean your physical cut has sub-millimeter precision.
          </li>
        </ul>
      </section>

      {/* 3. Unit Conventions */}
      <section id="unit-conventions" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          3. Regional &amp; Domain Unit Conventions
        </h2>
        <p>
          In science, trade, and everyday life, several measurement units share similar names while representing distinct quantities depending on region or industry. When performing conversions, always confirm which convention applies to your context:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-[#16324F] dark:text-white">
              US Customary vs. UK Imperial Volume
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              A US liquid gallon (<code className="font-mono text-xs">3.78541 L</code>) is about 20% smaller than a UK Imperial gallon (<code className="font-mono text-xs">4.54609 L</code>). Similarly, US and Imperial fluid ounces, pints, and quarts differ. See our <Link href="/guides/us-vs-imperial-fluid-ounces" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">US vs. UK Fluid Ounces Guide</Link>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-[#16324F] dark:text-white">
              Avoirdupois vs. Troy Mass
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Everyday goods use the Avoirdupois ounce (<code className="font-mono text-xs">28.3495 g</code>), whereas precious metals (gold, silver, platinum) are weighed in Troy ounces (<code className="font-mono text-xs">31.1035 g</code>). See our <Link href="/guides/avoirdupois-vs-troy-weight" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Troy vs. Standard Ounces Guide</Link>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-[#16324F] dark:text-white">
              Decimal (SI) vs. Binary (IEC) Data Units
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Storage drive manufacturers define 1 gigabyte as <code className="font-mono text-xs">1,000,000,000</code> bytes (base-10 SI), while operating systems often report memory in binary gibibytes (<code className="font-mono text-xs">1,073,741,824</code> bytes, base-2 IEC). See our <Link href="/guides/decimal-vs-binary-data-storage" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Decimal vs. Binary Data Storage Guide</Link>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-[#16324F] dark:text-white">
              Nominal vs. Condition-Dependent Units
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Conversions such as Amp-hours (Ah) to Kilowatt-hours (kWh) depend on nominal voltage, and certain pressure or flow measurements in engineering depend on reference temperature and atmospheric conditions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. High-Stakes Verification */}
      <section id="high-stakes-verification" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          4. High-Stakes &amp; Safety-Critical Applications
        </h2>
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/80 space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Independent Verification Required for Critical Uses</span>
          </div>
          <p className="text-amber-950/90 dark:text-amber-200/90 leading-relaxed">
            Whenever an incorrect conversion could result in personal injury, health risk, structural failure, equipment damage, regulatory non-compliance, or significant financial loss, you must independently verify all values against official primary standards, calibrated instruments, and qualified domain professionals.
          </p>
        </div>
        <p>
          Examples of high-stakes applications that require independent verification include, without limitation:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Medical, Clinical &amp; Pharmaceutical Calculations:</strong> Medication dosages, infusion rates, body weight conversions for clinical dosing, or laboratory diagnostic values.</li>
          <li><strong>Structural, Civil, Mechanical &amp; Electrical Engineering:</strong> Load calculations, pressure vessel ratings, fastener torque specifications, electrical circuit sizing, and material stress limits.</li>
          <li><strong>Aviation, Marine &amp; Navigation:</strong> Fuel weight/volume loading, altitude/pressure settings, and airspeed/groundspeed navigation.</li>
          <li><strong>Commercial Contracts, Precious Metals &amp; Financial Settlements:</strong> Bullion weight conversions, commodity trade settlements, and legally binding property or land area descriptions.</li>
        </ul>
      </section>

      {/* 5. No Professional Advice */}
      <section id="no-professional-advice" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          5. Not a Substitute for Professional Advice
        </h2>
        <p>
          Nothing on {SITE_CONFIG.name} constitutes—or is intended to replace—professional engineering, medical, pharmaceutical, legal, financial, or certified calibration advice. If your project or situation requires professional judgment or certified measurements, always consult a licensed professional in the relevant field.
        </p>
      </section>

      {/* 6. Report Discrepancy */}
      <section id="report-discrepancy" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          6. Reporting a Discrepancy or Requesting Clarification
        </h2>
        <p>
          We take calculation accuracy seriously and continuously audit our unit definitions and formulas. If you ever notice a rounding edge case, a typographical error in an explanatory guide, or a unit convention that could be clarified, please let us know via our <Link href="/contact" className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline">Contact page</Link> or by emailing{" "}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline"
          >
            {SITE_CONFIG.contactEmail}
          </a>
          .
        </p>
        <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
          <span className="text-slate-600 dark:text-slate-300">
            Also see our <Link href="/about" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">About page</Link> to learn how {SITE_CONFIG.name} structures its base-unit normalization formulas and reference tables.
          </span>
        </div>
      </section>
    </LegalPageLayout>
  );
}
