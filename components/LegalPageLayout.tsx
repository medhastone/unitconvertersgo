import Link from "next/link";
import { ReactNode } from "react";
import {
  ShieldCheck,
  FileText,
  Scale,
  Cookie,
  Info,
  Mail,
  Grid,
  ChevronRight,
  Clock,
  BookOpen,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export interface TocItem {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  canonicalPath: string;
  showLastUpdated?: boolean;
  lastUpdatedText?: string;
  toc?: TocItem[];
  children: ReactNode;
}

const LEGAL_NAV_LINKS = [
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    description: "How data, logs, and browser storage are handled",
  },
  {
    href: "/terms-of-use",
    label: "Terms of Use",
    icon: Scale,
    description: "Acceptable use, IP rights, and service limitations",
  },
  {
    href: "/disclaimer",
    label: "Disclaimer",
    icon: FileText,
    description: "Informational scope, rounding, and verification notice",
  },
  {
    href: "/cookie-policy",
    label: "Cookie Policy",
    icon: Cookie,
    description: "Cookies, local storage keys, and browser controls",
  },
  {
    href: "/about",
    label: "About UnitConvertersGo",
    icon: Info,
    description: "Measurement categories, formulas, and standards",
  },
  {
    href: "/contact",
    label: "Contact & Feedback",
    icon: Mail,
    description: "Report an issue, suggest a unit, or ask a question",
  },
];

export default function LegalPageLayout({
  title,
  subtitle,
  badgeText = "Legal & Trust Center",
  canonicalPath,
  showLastUpdated = true,
  lastUpdatedText = SITE_CONFIG.legalLastUpdated,
  toc = [],
  children,
}: LegalPageLayoutProps) {
  const fullUrl = `${SITE_CONFIG.canonicalDomain}${canonicalPath}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.canonicalDomain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: fullUrl,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${title} | ${SITE_CONFIG.name}`,
    description: subtitle,
    url: fullUrl,
    ...(showLastUpdated
      ? { dateModified: SITE_CONFIG.legalLastUpdatedIso }
      : {}),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.canonicalDomain,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Top Header Banner — Clean light-gray background with deep navy headings */}
      <div className="border-b border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-11">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap mb-4"
          >
            <Link
              href="/"
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#16324F] dark:text-slate-200 font-semibold">
              {title}
            </span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#2DD4BF]">
                {badgeText}
              </span>
              {showLastUpdated && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
                  <span>Last Updated: {lastUpdatedText}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile Table of Contents (shown on small screens when TOC items exist) */}
        {toc.length > 0 && (
          <div className="lg:hidden mb-8 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16324F] dark:text-slate-200 mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>On This Page</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {toc.map((item, idx) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex items-center gap-1.5 py-1 text-slate-600 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] font-medium transition-colors"
                  >
                    <span className="text-slate-400 font-mono text-[11px]">
                      {idx + 1}.
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Narrow, high-readability main document column */}
          <article className="lg:col-span-8 max-w-3xl space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed">
            {children}
          </article>

          {/* Sticky Sidebar for Table of Contents & Legal/Site Navigation */}
          <aside
            aria-label="Document navigation and related pages"
            className="lg:col-span-4 space-y-6 lg:sticky lg:top-24"
          >
            {toc.length > 0 && (
              <div className="hidden lg:block rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#16324F] dark:text-slate-200 mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Table of Contents</span>
                </h2>
                <nav aria-label="Table of contents">
                  <ol className="space-y-2 text-xs">
                    {toc.map((item, idx) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="group flex items-start gap-2 text-slate-600 dark:text-slate-400 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                        >
                          <span className="font-mono text-[11px] text-slate-400 group-hover:text-[#0D9488] shrink-0 mt-0.5">
                            {String(idx + 1).padStart(2, "0")}.
                          </span>
                          <span className="font-medium leading-snug">
                            {item.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            )}

            {/* Legal & Information Directory Card */}
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 p-5 space-y-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#16324F] dark:text-slate-200">
                Legal &amp; Site Information
              </h2>
              <ul className="space-y-1.5">
                {LEGAL_NAV_LINKS.map((item) => {
                  const Icon = item.icon;
                  const isActive = canonicalPath === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                          isActive
                            ? "bg-[#16324F] dark:bg-[#0D9488] text-white font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-[#0D9488] dark:hover:text-[#2DD4BF]"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isActive
                              ? "text-[#2DD4BF] dark:text-slate-950"
                              : "text-[#0D9488] dark:text-[#2DD4BF]"
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold">{item.label}</div>
                          <div
                            className={`text-[11px] leading-snug mt-0.5 ${
                              isActive
                                ? "text-slate-200 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Questions about our policies or calculators?
                </div>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{SITE_CONFIG.contactEmail}</span>
                </a>
              </div>
            </div>

            {/* Quick Link to All Converters Directory */}
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0D9488]/10 text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
                  <Grid className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#16324F] dark:text-white truncate">
                    Browse All Converters
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Explore all 75+ measurement categories
                  </div>
                </div>
              </div>
              <Link
                href="/directory"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F7F9FC] dark:bg-slate-800 text-[#16324F] dark:text-slate-200 hover:bg-[#0D9488] hover:text-white transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                Open
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
