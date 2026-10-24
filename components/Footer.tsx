"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { CATEGORY_MAP, UNIT_MAP } from "@/lib/conversions/units";
import { CATALOGUE_MAP } from "@/lib/conversions/catalogue";
import { getCategoryUrl, getPairUrl } from "@/lib/conversions/url";
import LocalStorageManager from "@/components/LocalStorageManager";

/**
 * Curated list of 8 primary conversion category IDs, resolved dynamically
 * against CATEGORY_MAP and getCategoryUrl() single source of truth so all
 * footer columns share an identical 8-row height on desktop and 4-row grid on mobile.
 */
const FOOTER_CATEGORY_CONFIG: { id: string; labelOverride?: string }[] = [
  { id: "length", labelOverride: "Length" },
  { id: "mass", labelOverride: "Weight & Mass" },
  { id: "temperature", labelOverride: "Temperature" },
  { id: "area", labelOverride: "Area" },
  { id: "volume", labelOverride: "Volume" },
  { id: "speed", labelOverride: "Speed" },
  { id: "time", labelOverride: "Time" },
  { id: "digital_storage", labelOverride: "Data Storage" },
];

/**
 * Curated list of 8 frequently searched conversion pair slugs, resolved
 * dynamically against CATALOGUE_MAP and UNIT_MAP single source of truth.
 */
const FOOTER_POPULAR_SLUGS: string[] = [
  "cm-to-inches",
  "inches-to-cm",
  "kg-to-lbs",
  "celsius-to-fahrenheit",
  "meters-to-feet",
  "km-to-miles",
  "liters-to-gallons",
  "mm-to-inches",
];

const EXPLORE_SUPPORT_LINKS = [
  { href: "/directory", label: "All Converters" },
  { href: "/#popular", label: "Popular Converters" },
  { href: "/guides", label: "Measurement Guides" },
  { href: "/widgets", label: "Calculator Widgets" },
  { href: "/case-converter", label: "Text Case Converter" },
  { href: "/search", label: "Search Converters" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/disclaimer#precision-rounding", label: "Precision & Rounding" },
  { href: "/disclaimer#unit-conventions", label: "Unit Conventions" },
  { href: "/cookie-policy#storage-table", label: "Browser Storage Keys" },
  { href: "/disclaimer#report-discrepancy", label: "Report a Discrepancy" },
];

type AccordionSectionId = "categories" | "popular" | "explore" | "legal";

export default function Footer() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<
    Record<AccordionSectionId, boolean>
  >({
    categories: true,
    popular: true,
    explore: true,
    legal: true,
  });
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Close cookie preferences modal on Escape key
  useEffect(() => {
    if (!isCookieModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCookieModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCookieModalOpen]);

  if (pathname?.startsWith("/embed")) {
    return null;
  }

  const toggleSection = (section: AccordionSectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Resolve categories dynamically from the registry
  const categoryLinks = FOOTER_CATEGORY_CONFIG.map((item) => {
    const category = CATEGORY_MAP.get(item.id);
    if (!category) return null;
    return {
      id: category.id,
      label: item.labelOverride || category.name,
      href: getCategoryUrl(category.id),
    };
  }).filter(
    (item): item is { id: string; label: string; href: string } => item !== null
  );

  // Resolve popular converters dynamically from the registry
  const popularConverterLinks = FOOTER_POPULAR_SLUGS.map((slug) => {
    const pair = CATALOGUE_MAP.get(slug);
    if (!pair) return null;
    const fromUnit = UNIT_MAP.get(pair.fromUnitId);
    const toUnit = UNIT_MAP.get(pair.toUnitId);
    const label =
      fromUnit && toUnit
        ? `${fromUnit.plural} to ${toUnit.plural}`
        : pair.title.replace(/\s*Converter.*$/i, "");
    return {
      slug: pair.slug,
      label,
      href: getPairUrl(pair),
    };
  }).filter(
    (item): item is { slug: string; label: string; href: string } =>
      item !== null
  );

  const currentYear = new Date().getFullYear();

  return (
    <footer
      suppressHydrationWarning
      id="site-footer"
      aria-label="Site footer"
      className="w-full border-t border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 text-[#172033] dark:text-slate-200"
    >
      <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 items-stretch gap-y-2 sm:gap-x-8 sm:gap-y-10 lg:gap-x-8">
          {/* SECTION A — BRAND INTRODUCTION */}
          <div className="pb-6 mb-2 border-b border-slate-200/80 dark:border-slate-800/80 sm:pb-6 sm:mb-2 lg:pb-0 lg:mb-0 lg:border-b-0 sm:col-span-2 lg:col-span-4 lg:pr-6 flex flex-col justify-between h-full">
            <div className="space-y-3.5">
              <Link
                href="/"
                className="inline-flex items-center shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                aria-label="UnitConvertersGo — Home"
              >
                <Image
                  suppressHydrationWarning
                  src="/logo.webp"
                  alt="UnitConvertersGo"
                  width={290}
                  height={48}
                  referrerPolicy="no-referrer"
                  className="h-10 sm:h-11 lg:h-12 w-auto max-w-[230px] sm:max-w-[260px] lg:max-w-[290px] object-contain bg-transparent transition-opacity hover:opacity-95 motion-reduce:transition-none"
                />
              </Link>

              <p className="text-sm font-medium leading-relaxed text-[#172033] dark:text-slate-200 max-w-md">
                Simple, reliable unit conversions for everyday measurements and
                technical reference.
              </p>

              <p className="text-xs leading-relaxed text-[#64748B] dark:text-slate-400 max-w-md">
                Explore conversion tools for length, weight, temperature, volume,
                speed, and more.
              </p>
            </div>

            <div className="mt-4 lg:mt-auto pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60">
              <Link
                href="/directory"
                prefetch={false}
                className="inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
              >
                <span>Explore all converters</span>
                <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* SECTION B — CONVERSION CATEGORIES */}
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 sm:border-b-0 sm:col-span-1 lg:col-span-2 flex flex-col h-full">
            {/* Desktop / Tablet Static Heading */}
            <h2 className="hidden sm:block text-xs font-bold tracking-wider uppercase text-[#16324F] dark:text-slate-100 mb-4">
              Conversion Categories
            </h2>

            {/* Mobile Collapsible Disclosure Button */}
            <button
              type="button"
              onClick={() => toggleSection("categories")}
              aria-expanded={openSections.categories}
              aria-controls="footer-panel-categories"
              className="sm:hidden w-full min-h-[48px] py-3 flex items-center justify-between gap-2 text-left text-sm font-bold text-[#16324F] dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              <span>Conversion Categories</span>
              <ChevronDown
                className={`w-4 h-4 text-[#64748B] dark:text-slate-400 transition-transform duration-150 motion-reduce:transition-none shrink-0 ${
                  openSections.categories ? "rotate-180 text-[#0D9488]" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="footer-panel-categories"
              className={`${
                openSections.categories ? "flex flex-col flex-1 justify-between pb-4" : "hidden"
              } sm:flex sm:flex-col sm:flex-1 sm:justify-between sm:pb-0`}
            >
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-0.5 sm:space-y-2 text-xs sm:text-[13px] text-[#64748B] dark:text-slate-400">
                {categoryLinks.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={cat.href}
                      prefetch={false}
                      className="min-h-[44px] sm:min-h-0 flex items-center py-1.5 sm:py-0.5 text-[#172033]/85 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded truncate"
                    >
                      <span className="truncate">{cat.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 sm:mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60">
                <Link
                  href="/directory#converter-directory-heading"
                  prefetch={false}
                  className="min-h-[44px] sm:min-h-0 inline-flex items-center gap-1 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                >
                  <span>All Categories</span>
                  <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* SECTION C — POPULAR CONVERTERS */}
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 sm:border-b-0 sm:col-span-1 lg:col-span-2 flex flex-col h-full">
            {/* Desktop / Tablet Static Heading */}
            <h2 className="hidden sm:block text-xs font-bold tracking-wider uppercase text-[#16324F] dark:text-slate-100 mb-4">
              Popular Converters
            </h2>

            {/* Mobile Collapsible Disclosure Button */}
            <button
              type="button"
              onClick={() => toggleSection("popular")}
              aria-expanded={openSections.popular}
              aria-controls="footer-panel-popular"
              className="sm:hidden w-full min-h-[48px] py-3 flex items-center justify-between gap-2 text-left text-sm font-bold text-[#16324F] dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              <span>Popular Converters</span>
              <ChevronDown
                className={`w-4 h-4 text-[#64748B] dark:text-slate-400 transition-transform duration-150 motion-reduce:transition-none shrink-0 ${
                  openSections.popular ? "rotate-180 text-[#0D9488]" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="footer-panel-popular"
              className={`${
                openSections.popular ? "flex flex-col flex-1 justify-between pb-4" : "hidden"
              } sm:flex sm:flex-col sm:flex-1 sm:justify-between sm:pb-0`}
            >
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-0.5 sm:space-y-2 text-xs sm:text-[13px] text-[#64748B] dark:text-slate-400">
                {popularConverterLinks.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={tool.href}
                      prefetch={false}
                      className="min-h-[44px] sm:min-h-0 flex items-center py-1.5 sm:py-0.5 text-[#172033]/85 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded truncate"
                    >
                      <span className="truncate">{tool.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 sm:mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60">
                <Link
                  href="/directory"
                  prefetch={false}
                  className="min-h-[44px] sm:min-h-0 inline-flex items-center gap-1 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                >
                  <span>Full Directory</span>
                  <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* SECTION D — EXPLORE & SUPPORT */}
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 sm:border-b-0 sm:col-span-1 lg:col-span-2 flex flex-col h-full">
            {/* Desktop / Tablet Static Heading */}
            <h2 className="hidden sm:block text-xs font-bold tracking-wider uppercase text-[#16324F] dark:text-slate-100 mb-4">
              Explore &amp; Support
            </h2>

            {/* Mobile Collapsible Disclosure Button */}
            <button
              type="button"
              onClick={() => toggleSection("explore")}
              aria-expanded={openSections.explore}
              aria-controls="footer-panel-explore"
              className="sm:hidden w-full min-h-[48px] py-3 flex items-center justify-between gap-2 text-left text-sm font-bold text-[#16324F] dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              <span>Explore &amp; Support</span>
              <ChevronDown
                className={`w-4 h-4 text-[#64748B] dark:text-slate-400 transition-transform duration-150 motion-reduce:transition-none shrink-0 ${
                  openSections.explore ? "rotate-180 text-[#0D9488]" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="footer-panel-explore"
              className={`${
                openSections.explore ? "flex flex-col flex-1 justify-between pb-4" : "hidden"
              } sm:flex sm:flex-col sm:flex-1 sm:justify-between sm:pb-0`}
            >
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-0.5 sm:space-y-2 text-xs sm:text-[13px] text-[#64748B] dark:text-slate-400">
                {EXPLORE_SUPPORT_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="min-h-[44px] sm:min-h-0 flex items-center py-1.5 sm:py-0.5 text-[#172033]/85 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded truncate"
                    >
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 sm:mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60">
                <Link
                  href="/sitemap"
                  prefetch={false}
                  className="min-h-[44px] sm:min-h-0 inline-flex items-center gap-1 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                >
                  <span>HTML Sitemap</span>
                  <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* SECTION E — LEGAL */}
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 sm:border-b-0 sm:col-span-1 lg:col-span-2 flex flex-col h-full">
            {/* Desktop / Tablet Static Heading */}
            <h2 className="hidden sm:block text-xs font-bold tracking-wider uppercase text-[#16324F] dark:text-slate-100 mb-4">
              Legal
            </h2>

            {/* Mobile Collapsible Disclosure Button */}
            <button
              type="button"
              onClick={() => toggleSection("legal")}
              aria-expanded={openSections.legal}
              aria-controls="footer-panel-legal"
              className="sm:hidden w-full min-h-[48px] py-3 flex items-center justify-between gap-2 text-left text-sm font-bold text-[#16324F] dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              <span>Legal</span>
              <ChevronDown
                className={`w-4 h-4 text-[#64748B] dark:text-slate-400 transition-transform duration-150 motion-reduce:transition-none shrink-0 ${
                  openSections.legal ? "rotate-180 text-[#0D9488]" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="footer-panel-legal"
              className={`${
                openSections.legal ? "flex flex-col flex-1 justify-between pb-4" : "hidden"
              } sm:flex sm:flex-col sm:flex-1 sm:justify-between sm:pb-0`}
            >
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-0.5 sm:space-y-2 text-xs sm:text-[13px] text-[#64748B] dark:text-slate-400">
                {LEGAL_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="min-h-[44px] sm:min-h-0 flex items-center py-1.5 sm:py-0.5 text-[#172033]/85 dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded truncate"
                    >
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 sm:mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsCookieModalOpen(true)}
                  className="min-h-[44px] sm:min-h-0 inline-flex items-center gap-1.5 py-1 text-left text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                >
                  <SlidersHorizontal
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>Cookie Preferences</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION F — BOTTOM BAR */}
        <div className="mt-6 sm:mt-10 lg:mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-slate-400">
          <p suppressHydrationWarning className="text-center sm:text-left">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>

          <nav
            aria-label="Essential legal and support links"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
          >
            <Link
              href="/privacy-policy"
              prefetch={false}
              className="min-h-[44px] sm:min-h-0 inline-flex items-center py-1 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              ·
            </span>
            <Link
              href="/terms-of-use"
              prefetch={false}
              className="min-h-[44px] sm:min-h-0 inline-flex items-center py-1 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              Terms of Use
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              ·
            </span>
            <Link
              href="/contact"
              prefetch={false}
              className="min-h-[44px] sm:min-h-0 inline-flex items-center py-1 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Functional Cookie & Browser Storage Preferences Modal */}
      {isCookieModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCookieModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900">
              <div>
                <h2
                  id="cookie-preferences-modal-title"
                  className="text-base font-extrabold text-[#16324F] dark:text-white"
                >
                  Cookie &amp; Browser Storage Preferences
                </h2>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                  Inspect or clear functional on-device storage used by{" "}
                  {SITE_CONFIG.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCookieModalOpen(false)}
                aria-label="Close cookie preferences dialog"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#64748B] hover:text-[#16324F] dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <LocalStorageManager />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs text-[#64748B] dark:text-slate-400">
                <span>
                  No third-party advertising or tracking cookies are active.
                </span>
                <Link
                  href="/cookie-policy"
                  onClick={() => setIsCookieModalOpen(false)}
                  className="font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                >
                  Read full Cookie Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
