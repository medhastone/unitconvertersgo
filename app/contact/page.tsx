import { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, CheckCircle2, HelpCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import LegalPageLayout, { TocItem } from "@/components/LegalPageLayout";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = buildPageMetadata({
  title: `Contact ${SITE_CONFIG.name}`,
  description:
    "Contact the UnitConvertersGo team. Report a conversion formula discrepancy, request a new measurement unit, or get help with embeddable calculator widgets.",
  canonicalPath: "/contact",
});

const CONTACT_TOC: TocItem[] = [
  { id: "direct-contact", label: "Direct Email & Response Times" },
  { id: "contact-form", label: "Send a Message or Report an Issue" },
  { id: "reporting-checklist", label: "What to Include in a Calculation Report" },
];

export default function ContactPage() {
  return (
    <LegalPageLayout
      title={`Contact ${SITE_CONFIG.name}`}
      subtitle="Have a question about a conversion formula, want to request a new unit or category, or spotted a display issue? Reach out to our team below."
      badgeText="Support & Feedback"
      canonicalPath="/contact"
      showLastUpdated={false}
      toc={CONTACT_TOC}
    >
      {/* 1. Direct Contact Summary Cards */}
      <section id="direct-contact" className="scroll-mt-24 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
              <Mail className="w-4 h-4" />
              <span>Email Contact</span>
            </div>
            <div className="text-base font-extrabold text-[#16324F] dark:text-white">
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4"
              >
                {SITE_CONFIG.contactEmail}
              </a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For general feedback, new unit requests, formula inquiries, or privacy and legal questions.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
              <Clock className="w-4 h-4" />
              <span>Review &amp; Response Window</span>
            </div>
            <div className="text-base font-extrabold text-[#16324F] dark:text-white">
              1–3 Business Days
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We review calculation discrepancy reports with top priority and aim to respond to all inquiries within a few business days.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Validated Contact Form */}
      <section id="contact-form" className="scroll-mt-24">
        <ContactForm />
      </section>

      {/* 3. Helpful Checklist for Reporting Issues */}
      <section
        id="reporting-checklist"
        className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
          <h2 className="text-lg font-extrabold text-[#16324F] dark:text-white tracking-tight">
            What to Include When Reporting a Calculation or Unit Issue
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          To help us reproduce and verify your question quickly, please include the following details if applicable:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#16324F] dark:text-white block">
                1. Converter Page or Unit Pair
              </strong>
              <span className="text-slate-600 dark:text-slate-400 text-xs">
                The page URL (e.g., <code className="font-mono">/convert/liters-to-gallons</code>) or the exact source and target units selected.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#16324F] dark:text-white block">
                2. Input Value &amp; Observed Result
              </strong>
              <span className="text-slate-600 dark:text-slate-400 text-xs">
                The number you entered, the output shown on screen, and the result you expected.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#16324F] dark:text-white block">
                3. Regional or Domain Standard
              </strong>
              <span className="text-slate-600 dark:text-slate-400 text-xs">
                If requesting a new unit, let us know the standard symbol and reference definition (such as NIST or ISO).
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#16324F] dark:text-white block">
                4. Device &amp; Browser (For UI Bugs)
              </strong>
              <span className="text-slate-600 dark:text-slate-400 text-xs">
                Your browser name (e.g., Chrome, Safari, Firefox) and whether you are on mobile or desktop.
              </span>
            </div>
          </li>
        </ul>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          Looking for information on how we handle messages you send us? Read our <Link href="/privacy-policy" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Privacy Policy</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
