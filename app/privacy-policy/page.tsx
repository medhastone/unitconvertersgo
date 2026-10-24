import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import LegalPageLayout, { TocItem } from "@/components/LegalPageLayout";
import LocalStorageManager from "@/components/LocalStorageManager";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy — Data & Browser Storage",
  description:
    "Read the UnitConvertersGo Privacy Policy. Learn how unit conversions run locally in your browser, what server logs and localStorage keys are used, and your privacy rights.",
  canonicalPath: "/privacy-policy",
});

const PRIVACY_TOC: TocItem[] = [
  { id: "overview", label: "Overview & Core Privacy Summary" },
  { id: "calculator-inputs", label: "Unit Conversion Inputs (Client-Side Processing)" },
  { id: "information-collected", label: "Information We Collect & Do Not Collect" },
  { id: "server-logs", label: "Server Logs, IP Addresses & Hosting Data" },
  { id: "local-storage-cookies", label: "Cookies & Browser Local Storage" },
  { id: "analytics-advertising", label: "Analytics & Advertising Technologies (Google AdSense)" },
  { id: "data-use-sharing", label: "How Information Is Used & Data Sharing" },
  { id: "data-retention-security", label: "Data Retention & Security Practices" },
  { id: "privacy-rights", label: "Your Privacy Rights & International Visitors" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "updates-contact", label: "Policy Updates & Contact Information" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="This Privacy Policy explains what information UnitConvertersGo collects and does not collect when you use our unit conversion calculators, how browser storage and server logs work, and how you can exercise your privacy choices."
      badgeText="Privacy & Data Transparency"
      canonicalPath="/privacy-policy"
      showLastUpdated={true}
      toc={PRIVACY_TOC}
    >
      {/* 1. Overview */}
      <section id="overview" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          1. Overview &amp; Core Privacy Summary
        </h2>
        <p>
          <strong>{SITE_CONFIG.name}</strong> (<code className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#F7F9FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">{SITE_CONFIG.domain}</code>) is an online measurement conversion utility designed so you can convert units without creating an account, registering a profile, or submitting personal data to use our calculators.
        </p>
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm">
          <div className="font-bold text-[#16324F] dark:text-white">
            Key Facts About How {SITE_CONFIG.name} Operates:
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
            <li>
              <strong>Local Calculator Execution:</strong> Numbers you type into our unit converters are processed directly inside your web browser using JavaScript and are not sent to a database.
            </li>
            <li>
              <strong>No User Accounts Required:</strong> We do not offer or require user registration, passwords, or login profiles.
            </li>
            <li>
              <strong>Standard Web Infrastructure Logs:</strong> Like virtually all websites, our web hosting and content delivery infrastructure automatically process standard HTTP request data (such as IP addresses and browser user-agent strings) to deliver pages and protect against abuse.
            </li>
            <li>
              <strong>Device-Only Preferences:</strong> Recent conversions, bookmarked unit pairs, and light/dark theme preferences are saved exclusively in your own browser&apos;s <code className="font-mono text-xs">localStorage</code> and can be cleared by you at any time.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Calculator Inputs */}
      <section id="calculator-inputs" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          2. Unit Conversion Inputs (Client-Side Processing)
        </h2>
        <p>
          When you enter a numeric value into any converter on {SITE_CONFIG.name}—whether on a category page, a dedicated unit conversion page, or an embedded calculator widget—the mathematical calculation is performed locally on your device by your browser&apos;s JavaScript engine.
        </p>
        <p>
          We do not transmit the values you type into converter input fields to a backend calculation server, nor do we log or profile your individual conversion calculations on our servers. If you use the &ldquo;Copy Link&rdquo; or shareable URL feature, the selected unit pair may appear in the page URL in your browser address bar so that the link opens the requested converter.
        </p>
      </section>

      {/* 3. Information Collected & Not Collected */}
      <section id="information-collected" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          3. Information We Collect &amp; Do Not Collect
        </h2>
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#16324F] dark:text-slate-100">
            A. Information You Voluntarily Provide
          </h3>
          <p>
            If you choose to contact us through our <Link href="/contact" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Contact page</Link> or by emailing <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">{SITE_CONFIG.contactEmail}</a>, we receive the information you include in your message, such as your name, email address, inquiry category, optional converter URL, and message text. Providing this information is completely optional and is only required if you want us to review feedback or reply to your inquiry.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#16324F] dark:text-slate-100">
            B. Information We Do Not Collect
          </h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We do not collect account credentials, payment card numbers, billing addresses, or government identification numbers.</li>
            <li>We do not request access to your device&apos;s precise GPS geolocation, microphone, camera, or address book contacts.</li>
            <li>We do not store your typed calculator numbers or personal conversion history on our servers.</li>
          </ul>
        </div>
      </section>

      {/* 4. Server Logs */}
      <section id="server-logs" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          4. Server Logs, IP Addresses &amp; Hosting-Provider Data
        </h2>
        <p>
          Because {SITE_CONFIG.name} is delivered over the public internet, our cloud hosting and content delivery network (CDN) providers automatically receive standard network and HTTP metadata whenever your browser requests a webpage, stylesheet, or script. This technical data typically includes:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>IP Address:</strong> Required by internet routing protocols to return the requested webpage to your device and to detect automated abuse or denial-of-service (DDoS) attacks.</li>
          <li><strong>Request Metadata:</strong> The requested page path (for example, <code className="font-mono text-xs">/convert/cm-to-inches</code>), date and time of the request, HTTP status code, and referring webpage URL if you clicked a link from another site.</li>
          <li><strong>Browser &amp; Device Headers:</strong> Standard <code className="font-mono text-xs">User-Agent</code> and language headers sent by your browser indicating browser family, operating system type, and preferred language.</li>
        </ul>
        <p>
          This infrastructure data is processed for essential operational purposes: serving web pages reliably, diagnosing server errors, maintaining network security, and preventing malicious scraping.
        </p>
      </section>

      {/* 5. Local Storage & Cookies */}
      <section id="local-storage-cookies" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          5. Cookies &amp; Browser Local Storage
        </h2>
        <p>
          To provide convenient features without requiring user accounts or server-side tracking, {SITE_CONFIG.name} uses your browser&apos;s standard Web Storage API (<code className="font-mono text-xs">localStorage</code>) on your device:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <code className="font-mono text-xs font-semibold text-[#16324F] dark:text-white">theme</code>: Remembers whether you selected light mode or dark mode in the navigation bar.
          </li>
          <li>
            <code className="font-mono text-xs font-semibold text-[#16324F] dark:text-white">ucg_recent_conversions</code>: Stores your recent conversion calculations locally in your browser so you can revisit them on the page.
          </li>
          <li>
            <code className="font-mono text-xs font-semibold text-[#16324F] dark:text-white">ucg_favorite_conversions</code>: Stores unit pairs you bookmark locally in your browser.
          </li>
        </ul>
        <p>
          For full details on cookies and browser storage, please review our dedicated <Link href="/cookie-policy" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Cookie Policy</Link>. You can also inspect or clear your local converter data right now using the control panel below:
        </p>
        <LocalStorageManager />
      </section>

      {/* 6. Analytics & Advertising */}
      <section id="analytics-advertising" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          6. Analytics &amp; Advertising Technologies (Google AdSense)
        </h2>
        <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/70 text-xs sm:text-sm space-y-1.5">
          <div className="font-bold text-[#16324F] dark:text-teal-200">
            Current Implementation Status: Analytics &amp; Advertising Are Currently Inactive
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            As of the Last Updated date of this policy, third-party analytics scripts (such as Google Analytics) and third-party advertising scripts (including Google AdSense) are <strong>disabled</strong> in our active site configuration (<code className="font-mono text-xs">adsense.enabled: false</code>). No third-party advertising or analytics cookies are currently placed on your device when you browse {SITE_CONFIG.name}.
          </p>
        </div>
        <h3 className="text-base font-bold text-[#16324F] dark:text-slate-100 pt-1">
          Future Advertising &amp; Google AdSense Notice
        </h3>
        <p>
          To support the ongoing hosting and maintenance of our free conversion tools, we may enable <strong>Google AdSense</strong> or privacy-conscious analytics in the future. Before or when advertising is activated, this Privacy Policy and our <Link href="/cookie-policy" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Cookie Policy</Link> will be updated, and where required by applicable law (such as in the European Economic Area, the United Kingdom, and Switzerland), an appropriate consent mechanism will be presented before non-essential cookies are set.
        </p>
        <p>
          When Google AdSense is active on a website:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to that website or other websites on the internet.</li>
          <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to {SITE_CONFIG.name} and/or other sites on the internet.</li>
          <li>Users may opt out of personalized advertising at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">www.aboutads.info</a>.</li>
        </ul>
      </section>

      {/* 7. Data Use & Sharing */}
      <section id="data-use-sharing" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          7. How Information Is Used &amp; Data Sharing Practices
        </h2>
        <p>
          We do not sell, rent, or trade your personal information to data brokers or third parties. Limited technical or contact information is used or shared only in the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Responding to Your Inquiries:</strong> If you submit a message via our Contact form or email <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">{SITE_CONFIG.contactEmail}</a>, your submission is routed to our editorial/engineering inbox so we can investigate reported formula issues, add requested units, or reply to your question.
          </li>
          <li>
            <strong>Infrastructure &amp; Service Providers:</strong> Hosting, DNS/CDN, and email routing providers process network requests or contact messages strictly to deliver the service on our behalf.
          </li>
          <li>
            <strong>Legal Compliance &amp; Security:</strong> We may disclose limited log or correspondence information if required to do so by applicable law, subpoena, or valid legal process, or when necessary to protect the security and integrity of {SITE_CONFIG.name}.
          </li>
        </ul>
      </section>

      {/* 8. Data Retention & Security */}
      <section id="data-retention-security" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          8. Data Retention &amp; Security Practices
        </h2>
        <p>
          <strong>Retention:</strong> Browser <code className="font-mono text-xs">localStorage</code> items remain in your browser until you clear them using the controls on our site or your browser settings. Contact emails and support inquiries are retained only as long as reasonably necessary to resolve your inquiry, verify formula corrections, or comply with applicable legal obligations. Server access and security logs are retained in accordance with our hosting provider&apos;s standard log-rotation schedules.
        </p>
        <p>
          <strong>Security:</strong> {SITE_CONFIG.name} is served over encrypted HTTPS (TLS) connections, and minimizing server-side data collection is our primary security safeguard. However, no method of transmission over the internet or electronic storage is 100% immune to risk, and we encourage users not to include sensitive personal information in contact form messages.
        </p>
      </section>

      {/* 9. Privacy Rights & International Visitors */}
      <section id="privacy-rights" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          9. Your Privacy Rights &amp; International Visitors
        </h2>
        <p>
          Depending on where you live—including under the European Union / UK General Data Protection Regulation (GDPR), the California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA), or similar regional privacy laws—you may have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Request access to or information about any personal data you have voluntarily submitted to us (such as past contact correspondence).</li>
          <li>Request correction or deletion of your contact correspondence from our inbox.</li>
          <li>Object to or restrict certain processing of your data where applicable.</li>
          <li>Know that we do not &ldquo;sell&rdquo; or &ldquo;share&rdquo; personal information as defined under the CCPA/CPRA.</li>
        </ul>
        <p>
          Because we do not maintain user accounts or link calculator usage to personal identifiers, we cannot look up browsing or calculation history for any individual visitor. To exercise rights regarding correspondence you sent to us, please email <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">{SITE_CONFIG.contactEmail}</a> from the email address used in your original inquiry.
        </p>
        <p>
          <strong>International Visitors:</strong> {SITE_CONFIG.name} is accessible globally. If you visit the website or contact us from outside the country where our cloud hosting servers operate, standard network requests and any emails you send will necessarily cross international borders as part of normal internet routing.
        </p>
      </section>

      {/* 10. Children's Privacy */}
      <section id="childrens-privacy" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          10. Children&apos;s Privacy
        </h2>
        <p>
          {SITE_CONFIG.name} is a general-audience educational and technical reference utility. We do not knowingly solicit or collect personal information from children under the age of 13 (or the applicable age of digital consent in your jurisdiction). If you are a parent or guardian and believe a child has submitted personal information to us via our Contact page, please contact us at <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-[#0D9488] dark:text-[#2DD4BF] font-semibold hover:underline">{SITE_CONFIG.contactEmail}</a> and we will promptly delete the correspondence.
        </p>
      </section>

      {/* 11. Policy Updates & Contact */}
      <section id="updates-contact" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
          11. Policy Updates &amp; Contact Information
        </h2>
        <p>
          We may update this Privacy Policy to reflect technical changes to our calculators, hosting architecture, or analytics/advertising integrations. Whenever we make material changes, we will update the <strong>Last Updated</strong> date at the top of this page.
        </p>
        <p>
          If you have any questions, privacy requests, or concerns about this Privacy Policy, please contact us at{" "}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline"
          >
            {SITE_CONFIG.contactEmail}
          </a>{" "}
          or via our <Link href="/contact" className="text-[#0D9488] dark:text-[#2DD4BF] font-bold hover:underline">Contact page</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
