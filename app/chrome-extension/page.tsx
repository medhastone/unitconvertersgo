import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ChromeExtensionPageClient from "@/components/ChromeExtensionPageClient";
import CategoryExplorerHub from "@/components/CategoryExplorerHub";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Chrome Extension — Toolbar Unit Calculator",
  description:
    "UnitConvertersGo is a fast, simple offline unit calculator for your Chrome toolbar. Convert 31 unit categories instantly with quick search, right-click menu & Alt+U.",
  canonicalPath: "/chrome-extension",
});

export default function ChromeExtensionPage() {
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
        name: "Chrome Extension",
        item: `${SITE_CONFIG.baseUrl}/chrome-extension`,
      },
    ],
  };

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "UnitConvertersGo Chrome Extension",
    applicationCategory: "BrowserApplication",
    operatingSystem: "Chrome, Windows, macOS, Linux, ChromeOS",
    url: `${SITE_CONFIG.baseUrl}/chrome-extension`,
    installUrl:
      "https://chromewebstore.google.com/detail/kebpmckkmclfbncgkggcbofbhfghoilg?utm_source=item-share-cb",
    downloadUrl:
      "https://chromewebstore.google.com/detail/kebpmckkmclfbncgkggcbofbhfghoilg?utm_source=item-share-cb",
    image: DEFAULT_OG_IMAGE.url,
    description:
      "UnitConvertersGo is a fast, simple unit calculator for your browser toolbar. Pick two units, type a number, and see the answer instantly across 31 categories. Works 100% offline.",
    featureList: [
      "Live results as you type across 31 measurement categories",
      'Quick search box: type "5 km to miles" or "72 f in c" and get the answer',
      'Right-click any selected value on a web page (for example "10 kg") to convert it',
      "One-click copy of the result",
      "Remembers your last five conversions",
      "Light and dark theme, adjustable decimal places",
      "Keyboard shortcut: Alt+U",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="w-full bg-[#F7F9FC]/65 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            prefetch={false}
            className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight
            className="w-4 h-4 text-slate-400 shrink-0"
            aria-hidden="true"
          />
          <span className="text-[#16324F] dark:text-white font-bold">
            Chrome Extension
          </span>
        </nav>

        {/* Interactive Chrome Extension Showcase & Live Simulator */}
        <ChromeExtensionPageClient />

        {/* Cross-Category Converter Hub */}
        <CategoryExplorerHub />
      </div>
    </div>
  );
}
