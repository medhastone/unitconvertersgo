import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/conversions/units";
import { CONVERSION_CATALOGUE } from "@/lib/conversions/catalogue";
import { getCategoryUrl } from "@/lib/conversions/url";
import { SITE_CONFIG } from "@/lib/config";
import AllConvertersDirectoryClient from "@/components/AllConvertersDirectoryClient";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";

export const metadata: Metadata = {
  title: "All Unit Converters — Browse Conversion Tools by Category | UnitConvertersGo",
  description:
    "Browse conversion tools by measurement category or find a specific unit conversion across Length, Weight & Mass, Temperature, Area, Volume, Speed, Time, Pressure, Energy, Power, and Data Storage.",
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/directory`,
  },
  openGraph: {
    title: "All Unit Converters — UnitConvertersGo",
    description:
      "Browse conversion tools by measurement category or find a specific unit conversion.",
    url: `${SITE_CONFIG.baseUrl}/directory`,
  },
  twitter: {
    card: "summary_large_image",
    title: "All Unit Converters — UnitConvertersGo",
    description:
      "Browse conversion tools by measurement category or find a specific unit conversion.",
  },
};

export default function AllConvertersDirectoryPage() {
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
        name: "All Converters",
        item: `${SITE_CONFIG.baseUrl}/directory`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Unit Converters",
    description:
      "Browse conversion tools by measurement category or find a specific unit conversion.",
    url: `${SITE_CONFIG.baseUrl}/directory`,
    hasPart: CATEGORIES.map((cat) => ({
      "@type": "CollectionPage",
      name: `${cat.name} Converter`,
      url: `${SITE_CONFIG.baseUrl}${getCategoryUrl(cat.id)}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Breadcrumbs: Home > All Converters */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-[#16324F] dark:text-white">
            All Converters
          </span>
        </nav>

        {/* Page Hero Header: Title + Concise Introduction */}
        <header className="space-y-2.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] text-xs font-bold tracking-wide uppercase">
            <span>{CATEGORIES.length} Categories</span>
            <span aria-hidden="true">•</span>
            <span>{CONVERSION_CATALOGUE.length} Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white">
            All Unit Converters
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Browse conversion tools by measurement category or find a specific unit conversion.
          </p>
        </header>

        {/* Interactive Search, Compact Category Filters, Grouped Directory Grid, Popular Links & A–Z Unit Index */}
        <AllConvertersDirectoryClient />

        {/* Site Information, Tools & Legal Pages (HTML Sitemap Section) */}
        <section
          aria-labelledby="site-legal-pages-heading"
          className="rounded-2xl bg-[#F7F9FC] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 space-y-4"
        >
          <div className="space-y-1">
            <h2
              id="site-legal-pages-heading"
              className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16324F] dark:text-white"
            >
              Site Information, Widgets &amp; Legal Policies
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Direct links to our platform documentation, embeddable calculator widgets, and legal compliance pages.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              {
                href: "/about",
                title: "About UnitConvertersGo",
                desc: "How our calculators, categories, and SI/NIST formulas work.",
              },
              {
                href: "/contact",
                title: "Contact & Feedback",
                desc: "Report a calculation issue or request a new measurement unit.",
              },
              {
                href: "/privacy-policy",
                title: "Privacy Policy",
                desc: "In-browser calculations, server logs, and data practices.",
              },
              {
                href: "/terms-of-use",
                title: "Terms of Use",
                desc: "Acceptable use, intellectual property, and service terms.",
              },
              {
                href: "/disclaimer",
                title: "Disclaimer",
                desc: "Informational purpose, rounding, and verification requirements.",
              },
              {
                href: "/cookie-policy",
                title: "Cookie Policy",
                desc: "Cookies, localStorage keys, and browser storage controls.",
              },
              {
                href: "/widgets",
                title: "Calculator Widgets",
                desc: "Embed free unit converters on your website or blog.",
              },
              {
                href: "/sitemap",
                title: "Sitemap",
                desc: "Hierarchical index of all 9 converter groups and unit pairs.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] transition-all space-y-1"
              >
                <div className="font-bold text-[#16324F] dark:text-white hover:text-[#0D9488] dark:hover:text-[#2DD4BF]">
                  {item.title}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trusted Scientific Sources & Metrology Standards */}
        <TrustedSourcesSection pageTopic="All Unit Converters Directory (SI, NIST & ISO/IEC 80000 Standards)" />
      </div>
    </div>
  );
}
