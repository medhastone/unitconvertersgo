import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EmbedCalculatorWidget from "@/components/EmbedCalculatorWidget";
import {
  resolveWidgetBySlug,
  WidgetAccent,
  WidgetTheme,
} from "@/lib/widgets";
import { PrecisionMode } from "@/lib/conversions/types";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    theme?: string;
    accent?: string;
    val?: string;
    v?: string;
    decimals?: string;
    formula?: string;
    lock?: string;
  }>;
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const widget = resolveWidgetBySlug(slug);
  if (!widget) return {};

  return buildPageMetadata({
    title: `${widget.shortTitle} — Embeddable Widget`,
    description: widget.description,
    canonicalPath: widget.converterHref,
    noindex: true,
    categoryId: widget.categoryId,
  });
}

export default async function EmbedWidgetPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const widget = resolveWidgetBySlug(slug);

  if (!widget) {
    notFound();
  }

  const theme: WidgetTheme = sp.theme === "dark" ? "dark" : "light";
  const validAccents: WidgetAccent[] = [
    "teal",
    "navy",
    "blue",
    "emerald",
    "amber",
    "slate",
  ];
  const accent: WidgetAccent = validAccents.includes(sp.accent as WidgetAccent)
    ? (sp.accent as WidgetAccent)
    : "teal";

  const validDecimals: PrecisionMode[] = ["auto", "0", "2", "4", "6", "8", "sci"];
  const precision: PrecisionMode = validDecimals.includes(sp.decimals as PrecisionMode)
    ? (sp.decimals as PrecisionMode)
    : "auto";

  const showFormula = sp.formula !== "0";
  const lockUnits = sp.lock === "1";

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
        name: widget.shortTitle,
        item: `${SITE_CONFIG.baseUrl}${widget.converterHref}`,
      },
    ],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${widget.shortTitle} Widget`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: `${SITE_CONFIG.baseUrl}${widget.converterHref}`,
    description: widget.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-start p-1.5 ${
        theme === "dark" ? "bg-slate-950" : "bg-transparent"
      }`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <EmbedCalculatorWidget
        widget={widget}
        theme={theme}
        accent={accent}
        defaultValue={sp.val}
        defaultVoltage={sp.v || String(widget.defaultVoltage)}
        precision={precision}
        showFormula={showFormula}
        lockUnits={lockUnits}
        showAttributionBar={true}
      />
    </div>
  );
}
