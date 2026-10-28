import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  WifiOff,
  Lock,
  Database,
  MousePointerClick,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Chrome Extension Privacy Policy",
  description:
    "Official Privacy Policy for the UnitConvertersGo Chrome Extension. Works 100% offline, collects zero personal data, and uses only contextMenus and local storage.",
  canonicalPath: "/chrome-extension/privacy-policy",
});

const EXTENSION_PRIVACY_TOC = [
  { id: "summary", label: "1. Privacy Summary (Zero Data Collection)" },
  { id: "offline-processing", label: "2. 100% Offline Local Calculation" },
  { id: "permissions", label: "3. Chrome Permissions & Why We Ask for Them" },
  { id: "local-storage", label: "4. Local Storage & Last 5 Conversions" },
  { id: "website-links", label: "5. Optional Links to unitconvertersgo.com" },
  { id: "third-parties", label: "6. No Analytics, Ads, or Third-Party Tracking" },
  { id: "cws-compliance", label: "7. Chrome Web Store User Data Policy Compliance" },
  { id: "contact", label: "8. Contact & Questions" },
];

export default function ChromeExtensionPrivacyPolicyPage() {
  const fullUrl = `${SITE_CONFIG.baseUrl}/chrome-extension/privacy-policy`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Chrome Extension",
        item: `${SITE_CONFIG.baseUrl}/chrome-extension`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Extension Privacy Policy",
        item: fullUrl,
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Chrome Extension Privacy Policy | ${SITE_CONFIG.name}`,
    description:
      "Privacy Policy for the UnitConvertersGo Chrome Extension detailing offline operation, zero personal data collection, and Manifest V3 permissions.",
    url: fullUrl,
    dateModified: SITE_CONFIG.legalLastUpdatedIso,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
  };

  return (
    <div className="w-full bg-[#F7F9FC]/65 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />

        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumbs"
            className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
          >
            <Link
              href="/"
              prefetch={false}
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight
              className="w-4 h-4 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <Link
              href="/chrome-extension"
              prefetch={false}
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors font-medium"
            >
              Chrome Extension
            </Link>
            <ChevronRight
              className="w-4 h-4 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-[#16324F] dark:text-white font-bold">
              Privacy Policy
            </span>
          </nav>

          <Link
            href="/chrome-extension"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Chrome Extension</span>
          </Link>
        </div>

        {/* Header Banner */}
        <header className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
            <span>Chrome Extension Legal Documentation</span>
            <span aria-hidden="true">·</span>
            <span>Manifest V3</span>
            <span aria-hidden="true">·</span>
            <span>Last Updated: {SITE_CONFIG.legalLastUpdated}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
            UnitConvertersGo Chrome Extension — Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            The <strong>UnitConvertersGo Chrome Extension</strong> works completely offline inside your browser. It does not collect, store on a server, transmit, or share any personal data, browsing activity, or conversion inputs.
          </p>

          {/* 3 At-a-Glance Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#16324F] dark:text-white">
                <WifiOff className="w-4 h-4 text-[#0D9488]" />
                <span>100% Offline Execution</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All 31 unit categories and conversion formulas run locally on your device with no network requests.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#16324F] dark:text-white">
                <Lock className="w-4 h-4 text-[#0D9488]" />
                <span>Zero Data Collection</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No personal information, IP addresses, browsing history, or telemetry is ever collected or sent to a server.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#16324F] dark:text-white">
                <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                <span>Minimal Permissions</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Requests only <code className="font-mono">contextMenus</code> (right-click convert) and <code className="font-mono">storage</code> (local settings).
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Grid: Table of Contents + Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Sidebar TOC */}
          <aside className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-3 lg:sticky lg:top-6">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#16324F] dark:text-slate-200">
              On This Page
            </div>
            <nav aria-label="Table of contents" className="space-y-1">
              {EXTENSION_PRIVACY_TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/chrome-extension"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#E6FAF8]/80 dark:bg-teal-950/50 text-xs font-extrabold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#E6FAF8] transition-colors"
              >
                <span>Open Chrome Extension Page</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>

          {/* Right Main Policy Body */}
          <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Section 1 */}
            <section id="summary" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                1. Privacy Summary (Zero Data Collection)
              </h2>
              <p>
                This Privacy Policy applies specifically to the{" "}
                <strong>UnitConvertersGo Chrome Extension</strong>. Our privacy principle is simple:
              </p>
              <div className="p-4 rounded-xl bg-[#E6FAF8]/65 dark:bg-teal-950/35 border border-[#0D9488]/30 text-sm font-medium text-[#16324F] dark:text-slate-100">
                The extension works offline. It does not collect, store on a server, or send your personal data. It asks only for the two permissions it needs: the right-click menu and local storage for your settings.
              </div>
              <ul className="space-y-2 pt-1">
                {[
                  "No user account, email address, or sign-up is ever required.",
                  "No personal data, browsing history, or web page content is collected or transmitted.",
                  "No remote servers are contacted when you open the popup or convert units.",
                  "No third-party analytics, tracking pixels, or advertising scripts are included in the extension.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 2 */}
            <section
              id="offline-processing"
              className="scroll-mt-24 space-y-3 pt-6 border-t border-slate-200/70 dark:border-slate-800"
            >
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                2. 100% Offline Local Calculation
              </h2>
              <p>
                Every conversion across all 31 supported categories (including Everyday, Technology, Home and kitchen, Engineering, Electrical, and specialty units) is calculated directly on your computer inside the extension using built-in mathematical conversion factors.
              </p>
              <p>
                Whether you type a number into the unit selector, enter a shorthand query like{" "}
                <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  &quot;5 km to miles&quot;
                </code>{" "}
                or{" "}
                <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  &quot;72 f in c&quot;
                </code>{" "}
                into the quick search box, or convert a highlighted value via the right-click menu, your inputs never leave your browser.
              </p>
            </section>

            {/* Section 3 */}
            <section
              id="permissions"
              className="scroll-mt-24 space-y-4 pt-6 border-t border-slate-200/70 dark:border-slate-800"
            >
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                3. Chrome Permissions &amp; Why We Ask for Them
              </h2>
              <p>
                The UnitConvertersGo Chrome Extension follows the principle of least privilege and requests only two standard Chrome Manifest V3 permissions:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-sm font-extrabold text-[#16324F] dark:text-white">
                    <MousePointerClick className="w-4 h-4 text-[#0D9488]" />
                    <span>1. &quot;contextMenus&quot; (Right-Click Menu)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Used exclusively to add the <strong>UnitConvertersGo</strong> conversion option when you select text on a web page (for example, highlighting <code className="font-mono text-xs">&quot;10 kg&quot;</code>) and right-click. The extension only processes the selected text snippet at the moment you interact with the context menu and never monitors or logs your browsing activity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-sm font-extrabold text-[#16324F] dark:text-white">
                    <Database className="w-4 h-4 text-[#0D9488]" />
                    <span>2. &quot;storage&quot; (Local Settings &amp; Recent Conversions)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Used exclusively to save your preferences locally inside your browser (<code className="font-mono text-xs">chrome.storage.local</code>), including your preferred theme (light or dark), decimal precision setting, last selected category/units, and your last five conversions.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                The extension does <strong>not</strong> request <code className="font-mono">tabs</code>, <code className="font-mono">history</code>, <code className="font-mono">cookies</code>, <code className="font-mono">webRequest</code>, or broad <code className="font-mono">&lt;all_urls&gt;</code> host permissions.
              </p>
            </section>

            {/* Section 4 */}
            <section
              id="local-storage"
              className="scroll-mt-24 space-y-3 pt-6 border-t border-slate-200/70 dark:border-slate-800"
            >
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                4. Local Storage &amp; Last 5 Conversions
              </h2>
              <p>
                To make everyday calculations faster, the extension remembers your last five conversions alongside your display preferences (light/dark theme and decimal places). This data is stored strictly on your own device in Chrome&apos;s local extension storage and is never synced or uploaded to any external server.
              </p>
              <p>
                Uninstalling the UnitConvertersGo Chrome Extension or clearing extension data in your browser settings immediately and permanently deletes all locally stored settings and recent conversions.
              </p>
            </section>

            {/* Section 5 */}
            <section
              id="website-links"
              className="scroll-mt-24 space-y-3 pt-6 border-t border-slate-200/70 dark:border-slate-800"
            >
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                5. Optional Links to unitconvertersgo.com
              </h2>
              <p>
                Each conversion result in the extension popup includes an optional link to the matching converter page on{" "}
                <Link
                  href="/"
                  className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                >
                  unitconvertersgo.com
                </Link>
                , where you can view detailed formulas, worked examples, and printable reference tables.
              </p>
              <p>
                The extension never opens or connects to <code className="font-mono text-xs">unitconvertersgo.com</code> in the background. A connection to our website only occurs if you voluntarily click the website link to open the page in a new browser tab, at which point our standard{" "}
                <Link
                  href="/privacy-policy"
                  className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                >
                  Website Privacy Policy
                </Link>{" "}
                applies to your visit on the website.
              </p>
            </section>

            {/* Section 6 */}
            <section
              id="third-parties"
              className="scroll-mt-24 space-y-3 pt-6 border-t border-slate-200/70 dark:border-slate-800"
            >
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                6. No Analytics, Ads, or Third-Party Tracking
              </h2>
              <p>
                The UnitConvertersGo Chrome Extension contains no third-party analytics libraries (such as Google Analytics), no advertising networks, no fingerprinting scripts, and no external remote code. All code and unit definitions are packaged directly within the extension bundle reviewed by the Chrome Web Store.
              </p>
            </section>

            {/* Section 7 */}
            <section
              id="cws-compliance"
              className="scroll-mt-24 space-y-3 pt-6 border-t border-slate-200/70 dark:border-slate-800"
            >
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                7. Chrome Web Store User Data Policy Compliance
              </h2>
              <p>
                The UnitConvertersGo Chrome Extension complies fully with the{" "}
                <strong>Google Chrome Web Store Developer Program Policies</strong> and the{" "}
                <strong>Chrome Web Store User Data Policy</strong>, including the Limited Use requirements. Because we do not collect, access, or transmit any personal or sensitive user data, no user data is ever sold, transferred to third parties, or used for advertising, creditworthiness, or lending purposes.
              </p>
            </section>

            {/* Section 8 */}
            <section
              id="contact"
              className="scroll-mt-24 space-y-3 pt-6 border-t border-slate-200/70 dark:border-slate-800"
            >
              <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                8. Contact &amp; Questions
              </h2>
              <p>
                If you have any questions about this Chrome Extension Privacy Policy or how the extension operates, please contact us:
              </p>
              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0D9488]" />
                  <span>
                    Email:{" "}
                    <a
                      href={`mailto:${SITE_CONFIG.contactEmail}`}
                      className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                    >
                      {SITE_CONFIG.contactEmail}
                    </a>
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                >
                  <span>Contact Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
