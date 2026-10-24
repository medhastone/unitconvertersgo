import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import SearchPageClient from "@/components/SearchPageClient";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";

export const metadata: Metadata = buildPageMetadata({
  title: "Converter Search — Unit & Category Lookup",
  description:
    "Search through 680+ metric and imperial unit converters, 78 categories, and formulas instantly by unit name, abbreviation, or phrase.",
  canonicalPath: "/search",
  noindex: true,
});

export default function SearchPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <SearchPageClient />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <TrustedSourcesSection pageTopic="Find the Right Converter — Unit & Symbol Search Index" />
      </div>
    </div>
  );
}
