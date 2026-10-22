import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import SearchPageClient from "@/components/SearchPageClient";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";

export const metadata: Metadata = {
  title: "Converter Search — Find the Right Unit & Category Converter",
  description:
    "Search through 350+ metric and imperial unit converters, categories, and formulas instantly. Real-time search by unit name, abbreviation, or phrase.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/search`,
  },
  openGraph: {
    title: "Converter Search — Find the Right Unit & Category Converter",
    description:
      "Search through 350+ metric and imperial unit converters, categories, and formulas instantly. Real-time search by unit name, abbreviation, or phrase.",
    url: `${SITE_CONFIG.baseUrl}/search`,
  },
};

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
