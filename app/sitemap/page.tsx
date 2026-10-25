import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Map } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import { CATEGORIES, UNITS } from "@/lib/conversions/units";
import { SUPER_CATEGORIES } from "@/lib/conversions/extended-categories";
import { CONVERSION_CATALOGUE } from "@/lib/conversions/catalogue";
import SitemapDirectoryClient from "@/components/SitemapDirectoryClient";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";

export const metadata: Metadata = buildPageMetadata({
  title: `Complete HTML Sitemap — ${CATEGORIES.length} Categories`,
  description: `Complete HTML sitemap for UnitConvertersGo covering ${CATEGORIES.length} measurement categories and ${CONVERSION_CATALOGUE.length} unit conversion calculators.`,
  canonicalPath: "/sitemap",
});

export default function HtmlSitemapPage() {
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
        name: "Sitemap",
        item: `${SITE_CONFIG.baseUrl}/sitemap`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "UnitConvertersGo Complete HTML Sitemap",
    description:
      "Hierarchical index of all unit conversion calculators grouped into Common, Engineering, Heat, Fluids, Light, Electricity, Magnetism, Radiology, and Other categories.",
    url: `${SITE_CONFIG.baseUrl}/sitemap`,
    hasPart: SUPER_CATEGORIES.map((group) => ({
      "@type": "CollectionPage",
      name: group.name,
      description: group.description,
      url: `${SITE_CONFIG.baseUrl}/sitemap#group-${group.id}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]/60 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-8">
        {/* Breadcrumbs */}
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
          <span className="font-bold text-[#16324F] dark:text-white">
            Sitemap
          </span>
        </nav>

        {/* Sitemap Hero Header */}
        <header className="space-y-3 max-w-4xl">
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-lg bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] text-xs font-bold uppercase tracking-wider">
            <Map className="w-3.5 h-3.5" />
            <span>9 Super-Categories</span>
            <span aria-hidden="true">•</span>
            <span>{CATEGORIES.length} Categories</span>
            <span aria-hidden="true">•</span>
            <span>{UNITS.length} Units</span>
            <span aria-hidden="true">•</span>
            <span>{CONVERSION_CATALOGUE.length} Converters</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white">
            UnitConvertersGo Complete Sitemap
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Browse all unit conversion calculators, measurement categories, and reference tools in one place.
          </p>
        </header>

        {/* Interactive Sitemap Tree & Search */}
        <SitemapDirectoryClient />

        {/* Trusted Standards Section */}
        <TrustedSourcesSection pageTopic="Complete Unit Converters Sitemap (NIST SP 811, BIPM SI Brochure & ISO/IEC 80000)" />
      </div>
    </div>
  );
}
