import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import LegalPageLayout, { TocItem } from "@/components/LegalPageLayout";
import LocalStorageManager from "@/components/LocalStorageManager";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy — Browser Storage Guide",
  description:
    "Read the UnitConvertersGo Cookie Policy. See the exact browser localStorage keys we use for theme preferences, recent conversions, and bookmarks, and how to manage or clear them.",
  canonicalPath: "/cookie-policy",
});

const COOKIE_TOC: TocItem[] = [
  { id: "what-are-cookies", label: "What Are Cookies & Local Storage?" },
  { id: "current-storage-status", label: "How UnitConvertersGo Uses Browser Storage Today" },
  { id: "storage-table", label: "Exact Browser Storage Keys Used on This Site" },
  { id: "analytics-advertising-cookies", label: "Analytics & Advertising Cookies Status" },
  { id: "manage-clear-storage", label: "Manage or Clear Your Browser Storage" },
  { id: "browser-controls", label: "Controlling Cookies in Your Web Browser" },
  { id: "updates-contact", label: "Updates & Contact Information" },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      subtitle="This Cookie Policy explains how UnitConvertersGo uses browser localStorage and cookies, documents the exact storage keys active on our site today, and gives you direct controls to manage or clear them."
      badgeText="Cookies & Local Storage"
      canonicalPath="/cookie-policy"
      showLastUpdated={true}
      toc={COOKIE_TOC}
    >
      {/* 1. What Are Cookies & Local Storage */}
      <section id="what-are-cookies" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          1. What Are Cookies &amp; Browser Local Storage?
        </h2>
        <p>
          <strong>Cookies</strong> are small text files placed on your computer or mobile device by websites you visit. They are widely used to make websites work efficiently, remember user preferences, or provide analytics and advertising measurement.
        </p>
        <p>
          <strong>Browser Local Storage (<code className="font-mono text-xs">localStorage</code>)</strong> is a modern web browser feature that allows a website to store small pieces of preference data directly inside your browser on your device. Unlike traditional HTTP cookies, data stored in <code className="font-mono text-xs">localStorage</code> is <strong>not</strong> automatically transmitted to the server with every webpage request.
        </p>
      </section>

      {/* 2. How UnitConvertersGo Uses Browser Storage Today */}
      <section id="current-storage-status" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          2. How {SITE_CONFIG.name} Uses Browser Storage Today
        </h2>
        <p>
          We designed {SITE_CONFIG.name} to minimize data collection. Rather than setting tracking cookies or storing your preferences on a remote server, our calculators use your browser&apos;s local storage solely for functional user-interface preferences:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Preference Storage:</strong> Remembering whether you prefer the Light or Dark color theme.
          </li>
          <li>
            <strong>On-Device Convenience:</strong> Keeping a short list of your most recent unit conversions and any converter pairs you choose to bookmark on your device.
          </li>
        </ul>
        <p>
          If you block cookies or clear local storage in your browser, all unit conversion calculators on {SITE_CONFIG.name} will continue to calculate results normally; only your saved theme preference and recent/bookmarked lists will reset.
        </p>
      </section>

      {/* 3. Exact Storage Keys Table */}
      <section id="storage-table" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          3. Exact Browser Storage Keys Used on This Site
        </h2>
        <p>
          We do not invent or hide storage identifiers. Below is the complete list of client-side storage keys used by the {SITE_CONFIG.name} application:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F7F9FC] dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 text-[#16324F] dark:text-slate-200">
                <th className="py-3 px-4 font-bold">Key Name</th>
                <th className="py-3 px-4 font-bold">Storage Type</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Purpose &amp; Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 bg-white dark:bg-slate-950">
              <tr>
                <td className="py-3 px-4 font-mono text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                  theme
                </td>
                <td className="py-3 px-4 font-mono text-xs">localStorage</td>
                <td className="py-3 px-4">Preference</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  Stores <code className="font-mono text-xs">&quot;light&quot;</code> or <code className="font-mono text-xs">&quot;dark&quot;</code> when you toggle the display theme in the header. Kept in your browser until you clear site data.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                  ucg_recent_conversions
                </td>
                <td className="py-3 px-4 font-mono text-xs">localStorage</td>
                <td className="py-3 px-4">Functional</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  Stores up to your most recent unit conversion calculations on your device so you can quickly reference them on converter pages. Never transmitted to our servers. Kept until you click &ldquo;Clear&rdquo; or clear browser storage.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                  ucg_favorite_conversions
                </td>
                <td className="py-3 px-4 font-mono text-xs">localStorage</td>
                <td className="py-3 px-4">Functional</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  Stores unit conversion pairs you bookmark on converter pages for fast access on your device. Never transmitted to our servers. Kept until you remove the bookmark or clear browser storage.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Analytics & Advertising Cookies Status */}
      <section id="analytics-advertising-cookies" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          4. Analytics &amp; Advertising Cookies Status
        </h2>
        <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
          <div className="font-bold text-[#16324F] dark:text-white">
            Current Status: No Third-Party Analytics or Advertising Cookies Are Active
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Currently, third-party analytics and advertising integrations (such as Google Analytics and Google AdSense) are disabled on {SITE_CONFIG.name}. We do not currently set analytics cookies or advertising cookies when you visit our pages.
          </p>
        </div>
        <p>
          <strong>Future Updates &amp; Consent Requirements:</strong> If we integrate analytics or advertising services (such as Google AdSense) in the future to support the website, we will update this Cookie Policy with the specific cookie categories, providers, and durations before or upon launch. Where consent is legally required for visitors in specific jurisdictions (such as the EEA, UK, or Switzerland), a compliant consent management mechanism will be deployed rather than relying solely on a policy page.
        </p>
      </section>

      {/* 5. Manage or Clear Your Browser Storage */}
      <section id="manage-clear-storage" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          5. Manage or Clear Your Local Storage on {SITE_CONFIG.name}
        </h2>
        <p>
          You can view and erase the functional conversion history and bookmarks stored in your browser by {SITE_CONFIG.name} at any time using the interactive tool below:
        </p>
        <LocalStorageManager />
      </section>

      {/* 6. Browser Controls */}
      <section id="browser-controls" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          6. Controlling Cookies &amp; Site Data in Your Web Browser
        </h2>
        <p>
          In addition to the on-page tool above, every modern web browser lets you inspect, block, or delete cookies and <code className="font-mono text-xs">localStorage</code> data through its built-in privacy settings:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Google Chrome / Microsoft Edge:</strong> Open Settings &rarr; Privacy and security &rarr; Third-party cookies / Site settings &rarr; View permissions and data stored across sites.</li>
          <li><strong>Mozilla Firefox:</strong> Open Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data &rarr; Manage Data.</li>
          <li><strong>Apple Safari (macOS / iOS):</strong> Open Settings (or Preferences) &rarr; Privacy &rarr; Manage Website Data.</li>
        </ul>
      </section>

      {/* 7. Updates & Contact */}
      <section id="updates-contact" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          7. Policy Updates &amp; Contact Information
        </h2>
        <p>
          We will update this Cookie Policy whenever we introduce new browser storage features, cookies, or third-party integrations. For general data handling details, please also read our <Link href="/privacy-policy" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Privacy Policy</Link>.
        </p>
        <p>
          Questions about this Cookie Policy can be sent to{" "}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline"
          >
            {SITE_CONFIG.contactEmail}
          </a>{" "}
          or submitted via our <Link href="/contact" className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline">Contact page</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
