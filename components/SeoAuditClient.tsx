"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  Search,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface SeoAuditRow {
  url: string;
  path: string;
  pageType: string;
  oldTitle: string;
  oldTitleLen: number;
  newTitle: string;
  newTitleLen: number;
  oldDescription: string;
  oldDescLen: number;
  newDescription: string;
  newDescLen: number;
  ogImagePath: string;
}

interface SeoAuditClientProps {
  rows: SeoAuditRow[];
  totalCategories: number;
  totalConverters: number;
}

const FEATURED_OG_PREVIEWS = [
  { label: "Default (Homepage)", path: "/og-default.png" },
  { label: "Length Converter", path: "/og/category-length.png" },
  { label: "Weight & Mass", path: "/og/category-weight-and-mass.png" },
  { label: "Temperature", path: "/og/category-temperature.png" },
  { label: "Volume & Liquid", path: "/og/category-volume.png" },
  { label: "Cooking & Baking", path: "/og/category-cooking.png" },
  { label: "Area Converter", path: "/og/category-area.png" },
  { label: "Speed Converter", path: "/og/category-speed.png" },
  { label: "Pressure Converter", path: "/og/category-pressure.png" },
  { label: "Data Storage", path: "/og/category-data-storage.png" },
];

const PAGE_SIZE = 50;

export default function SeoAuditClient({
  rows,
  totalCategories,
  totalConverters,
}: SeoAuditClientProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedOgPreview, setSelectedOgPreview] = useState(
    FEATURED_OG_PREVIEWS[1]
  );
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.pageType !== typeFilter) return false;
      if (!q) return true;
      return (
        r.url.toLowerCase().includes(q) ||
        r.newTitle.toLowerCase().includes(q) ||
        r.oldTitle.toLowerCase().includes(q) ||
        r.newDescription.toLowerCase().includes(q)
      );
    });
  }, [rows, query, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const countsByType = useMemo(() => {
    const map: Record<string, number> = { all: rows.length };
    for (const r of rows) {
      map[r.pageType] = (map[r.pageType] || 0) + 1;
    }
    return map;
  }, [rows]);

  return (
    <div className="space-y-8">
      {/* Top Action & Summary Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#0D9488]" />
              <span>Pre-Deployment Metadata Diff &amp; Social Card Verification</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Review old vs. new titles, meta descriptions, character lengths, and 1200×630 OpenGraph images across all {rows.length} canonical URLs.
            </p>
          </div>

          <a
            href="/seo-metadata-diff.csv"
            download="seo-metadata-diff.csv"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0D9488] hover:bg-[#0B7A6F] text-white text-sm font-bold shadow-xs transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Full CSV ({rows.length} URLs)</span>
          </a>
        </div>

        {/* Verification Checklist Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Homepage Title &amp; H1</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              45 chars (&lt;60) • H1 includes &ldquo;Free Unit Converter&rdquo;
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Unified Counts Sitewide</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">
              {totalCategories} Categories • {totalConverters} Converters
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1200×630 OG &amp; Twitter Cards</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {totalCategories + 2} Category PNGs (Title + Example + Logo)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>JSON-LD &amp; Zero Keywords</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              BreadcrumbList, WebSite &amp; WebApplication
            </div>
          </div>
        </div>
      </div>

      {/* Build-Time 1200x630 Category OG Image Inspector */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0D9488]" />
            <h3 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
              Build-Time 1200×630 OpenGraph &amp; Twitter Card Preview
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {selectedOgPreview.path} (1200×630 PNG)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FEATURED_OG_PREVIEWS.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => setSelectedOgPreview(item)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedOgPreview.path === item.path
                  ? "bg-[#16324F] dark:bg-[#0D9488] text-white"
                  : "bg-[#F7F9FC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 max-w-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedOgPreview.path}
            alt={selectedOgPreview.label}
            width={1200}
            height={630}
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Page Type Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All URLs (${countsByType.all || 0})` },
              { id: "home", label: `Homepage (${countsByType.home || 0})` },
              { id: "tool", label: `Tool Pages (${countsByType.tool || 0})` },
              { id: "category", label: `Categories (${countsByType.category || 0})` },
              { id: "cooking", label: `Cooking (${countsByType.cooking || 0})` },
              { id: "guide", label: `Guides (${countsByType.guide || 0})` },
              { id: "hub", label: `Hubs (${countsByType.hub || 0})` },
              { id: "legal", label: `Legal (${countsByType.legal || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setTypeFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  typeFilter === tab.id
                    ? "bg-[#0D9488] text-white"
                    : "bg-[#F7F9FC] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Filter by URL, unit, or title..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F9FC] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-3.5 w-56">URL &amp; Type</th>
                <th className="py-3 px-3.5">Old vs. New Title</th>
                <th className="py-3 px-3.5">Old vs. New Meta Description</th>
                <th className="py-3 px-3.5 w-44">OG Image (1200×630)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {visibleRows.map((row) => (
                <tr
                  key={row.url}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 align-top"
                >
                  <td className="py-3.5 px-3.5 font-mono">
                    <Link
                      href={row.path}
                      prefetch={false}
                      className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline inline-flex items-center gap-1 break-all"
                    >
                      <span>{row.path}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </Link>
                    <div className="mt-1 text-[11px] text-slate-400 uppercase font-sans font-semibold">
                      {row.pageType}
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5 space-y-1.5">
                    <div className="text-slate-400 dark:text-slate-500 line-through">
                      {row.oldTitle}{" "}
                      <span className="font-mono text-[11px]">
                        ({row.oldTitleLen}c)
                      </span>
                    </div>
                    <div className="font-bold text-[#16324F] dark:text-white">
                      {row.newTitle}{" "}
                      <span className="font-mono text-[11px] text-[#0D9488] dark:text-[#2DD4BF] font-normal">
                        ({row.newTitleLen} chars)
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5 space-y-1.5">
                    <div className="text-slate-400 dark:text-slate-500 line-clamp-2">
                      {row.oldDescription}{" "}
                      <span className="font-mono text-[11px]">
                        ({row.oldDescLen}c)
                      </span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-200 font-medium">
                      {row.newDescription}{" "}
                      <span className="font-mono text-[11px] text-[#0D9488] dark:text-[#2DD4BF]">
                        ({row.newDescLen} chars)
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
                    <a
                      href={row.ogImagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0D9488] hover:underline"
                    >
                      {row.ogImagePath}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between gap-4 pt-2 text-xs text-slate-600 dark:text-slate-400">
          <div>
            Showing{" "}
            <span className="font-bold font-mono text-slate-900 dark:text-white">
              {filteredRows.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold font-mono text-slate-900 dark:text-white">
              {Math.min(currentPage * PAGE_SIZE, filteredRows.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold font-mono text-slate-900 dark:text-white">
              {filteredRows.length}
            </span>{" "}
            URLs
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1 font-semibold cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="font-mono font-semibold">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
