import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers, HelpCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/conversions/units";

export const metadata: Metadata = {
  title: "404 — Conversion Not Found",
  description: "The requested unit conversion URL or measurement page could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          404 — Conversion Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The measurement page or conversion URL you are looking for doesn&apos;t exist, was moved, or hasn&apos;t been catalogued yet.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-lg transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span>Browse Full URL Directory</span>
        </Link>
      </div>

      {/* Suggested Categories */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Or explore one of our measurement categories
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/conversions/${cat.id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
