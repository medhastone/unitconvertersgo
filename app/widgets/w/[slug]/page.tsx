import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Code2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import WidgetCustomizerClient from "@/components/WidgetCustomizerClient";
import {
  getAllWidgetDirectoryItems,
  resolveWidgetBySlug,
} from "@/lib/widgets";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

interface WidgetStudioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: WidgetStudioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const widget = resolveWidgetBySlug(slug);
  if (!widget) return {};

  return buildPageMetadata({
    title: `${widget.shortTitle} Widget`,
    description: widget.description,
    canonicalPath: widget.widgetStudioHref,
  });
}

export default async function WidgetStudioPage({
  params,
}: WidgetStudioPageProps) {
  const { slug } = await params;
  const widget = resolveWidgetBySlug(slug);

  if (!widget) {
    notFound();
  }

  if (slug !== widget.slug) {
    permanentRedirect(widget.widgetStudioHref);
  }

  const allWidgets = getAllWidgetDirectoryItems();
  const relatedWidgets = allWidgets
    .filter(
      (item) =>
        item.slug !== widget.slug &&
        (item.categoryId === widget.categoryId ||
          (widget.requiresVoltage && item.isElectrical))
    )
    .slice(0, 8);

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
      {
        "@type": "ListItem",
        position: 3,
        name: widget.title,
        item: `${SITE_CONFIG.baseUrl}${widget.widgetStudioHref}`,
      },
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400"
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
          href="/widgets"
          prefetch={false}
          className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
        >
          Calculator Widgets
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link
          href={`/conversions/${widget.categoryId}`}
          prefetch={false}
          className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors"
        >
          {widget.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-[#16324F] dark:text-slate-200 font-bold">
          {widget.shortTitle} Widget
        </span>
      </nav>

      {/* Studio Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-4 border-b border-slate-200/90 dark:border-slate-800">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 text-xs font-extrabold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Free Website Embed Studio · {widget.fromUnit.symbol} → {widget.toUnit.symbol}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#16324F] dark:text-white">
            Add the {widget.shortTitle} to Your Website
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Customize the widget layout and default values below to generate your HTML embed code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href={widget.converterHref}
            prefetch={false}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-xs font-extrabold text-[#16324F] dark:text-white hover:border-[#0D9488] transition-colors"
          >
            <span>View Full Calculator</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#0D9488]" />
          </Link>
          <Link
            href="/widgets"
            prefetch={false}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16324F] hover:bg-[#0D9488] text-white text-xs font-extrabold transition-colors"
          >
            <span>All Widgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Widget Customizer Studio */}
      <WidgetCustomizerClient
        widget={widget}
        relatedWidgets={relatedWidgets}
      />
    </div>
  );
}
