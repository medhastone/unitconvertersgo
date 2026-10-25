import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import { CATEGORIES } from "@/lib/conversions/units";
import { CONVERSION_CATALOGUE } from "@/lib/conversions/catalogue";
import SearchPageClient from "@/components/SearchPageClient";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";

export const metadata: Metadata = buildPageMetadata({
  title: "Converter Search — Unit & Category Lookup",
  description: `Search through ${CONVERSION_CATALOGUE.length} metric and imperial unit converters across ${CATEGORIES.length} measurement categories instantly by unit name, symbol, or phrase.`,
  canonicalPath: "/search",
  noindex: true,
});

export default function SearchPage() {
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
        name: "Converter Search",
        item: `${SITE_CONFIG.baseUrl}/search`,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SearchPageClient />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <TrustedSourcesSection pageTopic="Find the Right Converter — Unit & Symbol Search Index" />
      </div>
    </div>
  );
}
