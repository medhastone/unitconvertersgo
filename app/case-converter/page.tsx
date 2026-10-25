import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import CaseConverterClient from "@/components/CaseConverterClient";
import CategoryExplorerHub from "@/components/CategoryExplorerHub";
import ToolSearchBar from "@/components/ToolSearchBar";

export const metadata: Metadata = buildPageMetadata({
  title: "Text Case Converter Tool",
  description:
    "Free online Case Converter tool. Convert text between Sentence case, lower case, UPPER CASE, Title Case, camelCase, PascalCase, snake_case, and kebab-case in your browser.",
  canonicalPath: "/case-converter",
  noindex: true,
});

export default function CaseConverterPage() {
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
        name: "Case Converter",
        item: `${SITE_CONFIG.baseUrl}/case-converter`,
      },
    ],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Text Case Converter Tool",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: `${SITE_CONFIG.baseUrl}/case-converter`,
    description:
      "Free online Case Converter tool. Convert text between Sentence case, lower case, UPPER CASE, Title Case, camelCase, PascalCase, snake_case, and kebab-case in your browser.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.baseUrl}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]/60 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 shrink-0"
          >
            <Link
              href="/"
              prefetch={false}
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              href="/sitemap"
              prefetch={false}
              className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
            >
              Common Converters
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-[#16324F] dark:text-white">
              Case Converter
            </span>
          </nav>

          <div className="w-full md:max-w-md lg:max-w-lg">
            <ToolSearchBar currentCategoryName="Case Converter" />
          </div>
        </div>

        <header className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white">
            Case Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Enter your text below to convert it between uppercase, lowercase, title case, and developer formats.
          </p>
        </header>

        <CaseConverterClient />

        <CategoryExplorerHub />
      </div>
    </div>
  );
}
