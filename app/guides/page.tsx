import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { GUIDES } from "@/lib/conversions/guides";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Measurement Guides & Reference Articles",
  description:
    "In-depth technical and historical measurement guides covering Metric vs. Imperial standards, US vs. UK fluid ounces, binary vs. decimal storage, temperature scales, pressure units, and fuel economy.",
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/guides`,
  },
  openGraph: {
    title: "Measurement Guides & Reference Articles | UnitConvertersGo",
    description:
      "Explore comprehensive measurement guides, conversion formulas, and engineering reference articles on UnitConvertersGo.",
    url: `${SITE_CONFIG.baseUrl}/guides`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Measurement Guides & Reference Articles | UnitConvertersGo",
    description:
      "Explore comprehensive measurement guides, conversion formulas, and engineering reference articles on UnitConvertersGo.",
  },
};

export default function GuidesIndexPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_CONFIG.baseUrl}/guides#collection`,
        name: "Measurement Guides & Reference Articles",
        description:
          "Technical measurement guides, historical unit comparisons, and practical conversion formulas.",
        url: `${SITE_CONFIG.baseUrl}/guides`,
        hasPart: GUIDES.map((guide) => ({
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          url: `${SITE_CONFIG.baseUrl}/guides/${guide.slug}`,
        })),
      },
      {
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
            name: "Measurement Guides",
            item: `${SITE_CONFIG.baseUrl}/guides`,
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Measurement Guides</span>
      </nav>

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
          <BookOpen className="w-4 h-4" />
          <span>Reference Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white text-balance">
          Measurement Guides &amp; Technical Explanations
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Clear, practical articles explaining international measurement standards, conversion formulas, and the real-world differences between Metric, US Customary, and British Imperial units.
        </p>
      </header>

      {/* Guides Grid */}
      <section aria-label="All Measurement Guides" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((guide, index) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] transition-colors"
          >
            <div className="space-y-3">
              {/* Unboxed metadata per zero-pill discipline */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                  {String(index + 1).padStart(2, "0")}. {guide.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{guide.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>{guide.publishedDate}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors text-balance">
                {guide.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {guide.summary}
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#16324F] dark:text-slate-200 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors">
              <span>Read Complete Guide</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
