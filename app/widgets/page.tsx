import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import WidgetsDirectoryClient from "@/components/WidgetsDirectoryClient";
import {
  getAllWidgetDirectoryItems,
  resolveWidgetBySlug,
  WidgetDescriptor,
} from "@/lib/widgets";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Calculator & Unit Converter Widgets",
  description:
    "Embed free, customizable unit conversion calculator widgets on your website, blog, or classroom. Includes Full-Width, Adjustable Sidebar, Popup Calculator, and Text Link embeds.",
  canonicalPath: "/widgets",
});

export default function WidgetsDirectoryPage() {
  const allItems = getAllWidgetDirectoryItems();

  const heroDemoSlugs = [
    "ah-to-kwh",
    "cm-to-inches",
    "celsius-to-fahrenheit",
    "kg-to-lbs",
  ];
  const heroDemoWidgets = heroDemoSlugs
    .map((s) => resolveWidgetBySlug(s))
    .filter(Boolean) as WidgetDescriptor[];

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
        name: "Calculator Widgets",
        item: `${SITE_CONFIG.baseUrl}/widgets`,
      },
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400"
      >
        <Link
          href="/"
          className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
        >
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-[#16324F] dark:text-slate-200 font-bold">
          Calculator Widgets
        </span>
      </nav>

      {/* Main Directory Client */}
      <WidgetsDirectoryClient
        allItems={allItems}
        heroDemoWidgets={heroDemoWidgets}
      />
    </div>
  );
}
