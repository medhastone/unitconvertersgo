import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Calendar } from "lucide-react";
import { GUIDES, GUIDES_MAP } from "@/lib/conversions/guides";
import { SITE_CONFIG } from "@/lib/config";
import TrustedSourcesSection from "@/components/TrustedSourcesSection";

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES_MAP.get(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.summary,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.summary,
      url: `${SITE_CONFIG.baseUrl}/guides/${guide.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.summary,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = GUIDES_MAP.get(slug);

  if (!guide) {
    notFound();
  }

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
        name: "Guides",
        item: `${SITE_CONFIG.baseUrl}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${SITE_CONFIG.baseUrl}/guides/${guide.slug}`,
      },
    ],
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/guides" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Guides
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{guide.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Measurement Guides</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
          {guide.title}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {guide.summary}
        </p>

        {/* Clean unboxed metadata per zero-pill discipline */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> {guide.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {guide.readTime}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {guide.publishedDate}
          </span>
        </div>
      </header>

      {/* Article Sections */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        {guide.content.map((sec, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {sec.heading}
            </h2>
            <div className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
              {sec.body}
            </div>
          </section>
        ))}
      </div>

      {/* Trusted Scientific Sources & Metrology Standards */}
      <TrustedSourcesSection pageTopic={guide.title} />

      {/* Related Guides Footer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Other Educational Guides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((other) => (
            <Link
              key={other.slug}
              href={`/guides/${other.slug}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-xs transition-all space-y-1 group"
            >
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {other.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {other.summary}
              </p>
            </Link>
          ))}
        </div>
      </footer>
    </article>
  );
}
