import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import LegalPageLayout, { TocItem } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: `Terms of Use — Website & Calculator Terms | ${SITE_CONFIG.name}`,
  description:
    "Read the Terms of Use for UnitConvertersGo. Understand acceptable use of our unit conversion tools, embeddable widgets, intellectual property, and limitations of liability.",
  alternates: {
    canonical: `${SITE_CONFIG.canonicalDomain}/terms-of-use`,
  },
  openGraph: {
    title: `Terms of Use | ${SITE_CONFIG.name}`,
    description:
      "Terms and conditions governing the use of UnitConvertersGo calculators, reference tables, and embeddable widgets.",
    url: `${SITE_CONFIG.canonicalDomain}/terms-of-use`,
    siteName: SITE_CONFIG.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Terms of Use | ${SITE_CONFIG.name}`,
    description:
      "Terms and conditions governing the use of UnitConvertersGo calculators, reference tables, and embeddable widgets.",
  },
};

const TERMS_TOC: TocItem[] = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "permitted-use", label: "Permitted Use of Conversion Tools & Widgets" },
  { id: "acceptable-use", label: "Acceptable Use & Prohibited Conduct" },
  { id: "accuracy-limitations", label: "Calculation Accuracy, Rounding & User Responsibilities" },
  { id: "intellectual-property", label: "Intellectual Property Rights" },
  { id: "third-party-links", label: "Third-Party Websites & Standards References" },
  { id: "availability-changes", label: "Website Availability & Service Changes" },
  { id: "limitation-liability", label: "Disclaimer of Warranties & Limitation of Liability" },
  { id: "changes-contact", label: "Changes to These Terms & Contact Details" },
];

export default function TermsOfUsePage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      subtitle="These Terms of Use govern your access to and use of UnitConvertersGo, including our online unit converters, conversion tables, measurement guides, and embeddable calculator widgets."
      badgeText="Terms & Conditions"
      canonicalPath="/terms-of-use"
      showLastUpdated={true}
      toc={TERMS_TOC}
    >
      {/* 1. Acceptance */}
      <section id="acceptance" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using <strong>{SITE_CONFIG.name}</strong> (<code className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">{SITE_CONFIG.domain}</code>), you agree to comply with these Terms of Use and our <Link href="/privacy-policy" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Privacy Policy</Link> and <Link href="/disclaimer" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Disclaimer</Link>. If you do not agree with these terms, please discontinue use of the website.
        </p>
      </section>

      {/* 2. Permitted Use */}
      <section id="permitted-use" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          2. Permitted Use of Conversion Tools, Content &amp; Widgets
        </h2>
        <p>
          {SITE_CONFIG.name} provides free unit conversion calculators, conversion reference tables, educational articles, and embeddable widgets. Subject to these Terms of Use, you are permitted to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Personal, Academic &amp; Professional Reference:</strong> Use our calculators and reference tables for everyday calculations, homework, classroom instruction, research, and general professional reference.
          </li>
          <li>
            <strong>Sharing Links &amp; Citations:</strong> Share links to any page on {SITE_CONFIG.name} and cite conversion tables or formulas with appropriate attribution.
          </li>
          <li>
            <strong>Embedding Official Widgets:</strong> Embed our calculator widgets on your own website using the official embed code generated on our <Link href="/widgets" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Calculator Widgets</Link> pages, provided that you do not alter the widget functionality, obscure attribution links included in the embed snippet, or place the widget on unlawful or deceptive websites.
          </li>
        </ul>
      </section>

      {/* 3. Acceptable Use */}
      <section id="acceptable-use" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          3. Acceptable Use &amp; Prohibited Conduct
        </h2>
        <p>
          To keep {SITE_CONFIG.name} fast, reliable, and accessible for all visitors, you agree not to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Use automated bots, scrapers, or high-frequency request scripts that place an unreasonable load on our hosting infrastructure or degrade site performance.</li>
          <li>Attempt to probe, scan, disrupt, or bypass any security or rate-limiting measures of the website.</li>
          <li>Copy and republish our entire website compilation, user interface design, or codebase as a competing commercial directory or clone site.</li>
          <li>Misrepresent results obtained from {SITE_CONFIG.name} as certified calibration documentation or legally verified metrology certificates.</li>
          <li>Use the website or contact form to transmit spam, malware, or unlawful content.</li>
        </ul>
      </section>

      {/* 4. Accuracy, Rounding & User Responsibilities */}
      <section id="accuracy-limitations" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          4. Accuracy, Rounding, Limitations &amp; User Responsibilities
        </h2>
        <p>
          Our conversion tools are carefully engineered using international measurement definitions—including the International System of Units (SI) and NIST reference constants—to provide clear, practical results. However, mathematical conversions in software involve inherent technical characteristics that you should understand:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Floating-Point Representation &amp; Rounding:</strong> Browser calculations use standard IEEE 754 double-precision floating-point arithmetic and significant-figure formatting to keep outputs readable. Depending on where a number is rounded, results may differ in the final decimal place from unrounded symbolic calculations.
          </li>
          <li>
            <strong>Unit Convention Differences:</strong> Certain unit names have multiple historical or regional definitions (for example, US Customary vs. British Imperial fluid ounces and gallons, Avoirdupois vs. Troy ounces, or decimal SI kilobytes vs. binary IEC kibibytes). It is your responsibility to confirm that you have selected the specific unit convention required for your task.
          </li>
          <li>
            <strong>Independent Verification for High-Stakes Use:</strong> You are solely responsible for verifying any conversion result against primary technical standards or a qualified professional before relying on it for engineering design, construction, medical or pharmaceutical dosing, aviation, financial contracts, or safety-critical operations. Please review our <Link href="/disclaimer" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Disclaimer</Link> for full details.
          </li>
        </ul>
      </section>

      {/* 5. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          5. Intellectual Property Rights
        </h2>
        <p>
          Mathematical constants, physical formulas, and International System of Units (SI) definitions are facts in the public domain. However, the original software implementation, visual design, site branding, layout organization, custom interactive components, and written explanatory guides on {SITE_CONFIG.name} are protected by applicable copyright and intellectual property laws.
        </p>
      </section>

      {/* 6. Third-Party Websites & Services */}
      <section id="third-party-links" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          6. Third-Party Websites &amp; Standards References
        </h2>
        <p>
          Our converter pages and educational guides include reference links to external organizations—such as the National Institute of Standards and Technology (NIST), the Bureau International des Poids et Mesures (BIPM), and the International Organization for Standardization (ISO)—for educational context.
        </p>
        <p>
          {SITE_CONFIG.name} is an independent web resource and is not affiliated with, endorsed by, or sponsored by NIST, BIPM, ISO, or any government agency. We are not responsible for the availability, content, or privacy practices of external third-party websites.
        </p>
      </section>

      {/* 7. Website Availability & Changes */}
      <section id="availability-changes" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          7. Website Availability &amp; Service Changes
        </h2>
        <p>
          We strive to keep {SITE_CONFIG.name} available and responsive at all times, but we do not guarantee uninterrupted, error-free availability. We may update, add, modify, or discontinue specific converters, unit categories, or site features at any time without prior notice in order to improve accuracy, usability, or security.
        </p>
      </section>

      {/* 8. Limitation of Liability */}
      <section id="limitation-liability" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          8. Disclaimer of Warranties &amp; Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by applicable law, {SITE_CONFIG.name} and its calculators, tables, and content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p>
          To the maximum extent permitted by applicable law, {SITE_CONFIG.name} and its operators shall not be liable for any indirect, incidental, consequential, special, or exemplary damages, or for any loss of data, revenue, profits, or property arising out of or in connection with your use of, or reliance upon, any conversion result or information provided on this website. Nothing in these Terms of Use excludes or limits any liability that cannot be excluded or limited under applicable consumer protection or statutory law.
        </p>
      </section>

      {/* 9. Changes to Terms & Contact */}
      <section id="changes-contact" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          9. Changes to These Terms &amp; Contact Details
        </h2>
        <p>
          We may revise these Terms of Use from time to time. When we make updates, we will revise the <strong>Last Updated</strong> date displayed at the top of this page. Your continued use of {SITE_CONFIG.name} after updated terms are posted constitutes acceptance of the revised terms.
        </p>
        <p>
          If you have any questions about these Terms of Use, please contact us at{" "}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline"
          >
            {SITE_CONFIG.contactEmail}
          </a>{" "}
          or through our <Link href="/contact" className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline">Contact page</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
