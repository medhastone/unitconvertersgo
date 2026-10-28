"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

if (typeof Object !== "undefined" && !("suppressHydrationWarning" in Object.prototype)) {
  try {
    Object.defineProperty(Object.prototype, "suppressHydrationWarning", {
      value: true,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  } catch {}
}
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Code2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTypewriterPlaceholder } from "@/lib/search/animated-prompts";
import { GUIDES } from "@/lib/conversions/guides";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

const GUIDE_SHORT_TITLES: Record<string, string> = {
  "metric-to-imperial": "Metric vs. Imperial Conversion Guide",
  "us-vs-imperial-fluid-ounces": "US vs. UK Imperial Fluid Ounces",
  "decimal-vs-binary-data-storage": "Why 1TB Shows 931 GB in Windows",
  "temperature-scales-explained": "°C, °F, Kelvin & Rankine Explained",
  "pressure-units-psi-bar-kpa-explained": "PSI, Bar, kPa & Atmosphere Guide",
  "avoirdupois-vs-troy-weight": "Troy vs. Standard Ounces Guide",
  "us-vs-uk-mpg-fuel-economy": "US vs. UK MPG & L/100km Guide",
};

function NavbarSearchPlaceholder({ isPaused }: { isPaused: boolean }) {
  const { placeholder } = useTypewriterPlaceholder({
    isPaused,
    prefix: "",
  });

  return (
    <span className="hidden sm:inline text-slate-500 dark:text-slate-300 truncate">
      {placeholder}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [isMobileGuidesOpen, setIsMobileGuidesOpen] = useState(false);
  const guidesDropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcuts Cmd+K / Ctrl+K and Escape to close dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsGuidesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close Guides dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        guidesDropdownRef.current &&
        !guidesDropdownRef.current.contains(e.target as Node)
      ) {
        setIsGuidesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGuidesMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsGuidesOpen(true);
  };

  const handleGuidesMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsGuidesOpen(false);
    }, 150);
  };

  // Render chrome-free when inside standalone /embed/[slug] iframe endpoint
  if (pathname?.startsWith("/embed")) {
    return null;
  }

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const nextTheme = isCurrentlyDark ? "light" : "dark";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("ucg-theme", nextTheme);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <>
      <header suppressHydrationWarning className="relative z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors duration-150">
        <div suppressHydrationWarning className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-5 px-4 sm:px-6 h-[64px] sm:h-[70px]">
          {/* Zone 1: Official Brand Logo - explicit width & height at every breakpoint for zero CLS */}
          <Link
            href="/"
            className="inline-flex items-center shrink-0 hover:opacity-95 transition-opacity min-h-[44px]"
            aria-label="UnitConvertersGo - Home"
          >
            <Image
              suppressHydrationWarning
              src="/logo.webp"
              alt="UnitConvertersGo"
              width={242}
              height={40}
              sizes="(max-width: 640px) 193px, (max-width: 1024px) 218px, 266px"
              priority
              referrerPolicy="no-referrer"
              className="w-[193px] h-[32px] sm:w-[218px] sm:h-[36px] lg:w-[266px] lg:h-[44px] object-contain bg-transparent shrink-0"
            />
          </Link>

          {/* Zone 2: Clean single-line navigation links (Desktop) */}
          <nav
            suppressHydrationWarning
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300"
          >
            <Link
              href="/"
              className="hover:text-[#16324F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Home
            </Link>
            <Link
              href="/#categories"
              className="hover:text-[#16324F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Categories
            </Link>
            <Link
              href="/cooking"
              className="hover:text-[#16324F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Cooking
            </Link>

            {/* Guides Dropdown Menu */}
            <div
              ref={guidesDropdownRef}
              className="relative"
              onMouseEnter={handleGuidesMouseEnter}
              onMouseLeave={handleGuidesMouseLeave}
            >
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setIsGuidesOpen((prev) => !prev)}
                aria-expanded={isGuidesOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isGuidesOpen || pathname?.startsWith("/guides")
                    ? "text-[#0D9488] dark:text-[#2DD4BF]"
                    : "hover:text-[#16324F] dark:hover:text-white"
                }`}
              >
                <span>Guides</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${
                    isGuidesOpen ? "rotate-180 text-[#0D9488] dark:text-[#2DD4BF]" : ""
                  }`}
                />
              </button>

              {isGuidesOpen && (
                <div
                  role="menu"
                  aria-label="Measurement Guides"
                  className="absolute left-0 top-full pt-2 w-[360px] z-50"
                >
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16324F] dark:text-slate-200">
                        <BookOpen className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
                        <span>Measurement Guides</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {GUIDES.length} Articles
                      </span>
                    </div>

                    <div className="p-2 max-h-[380px] overflow-y-auto divide-y divide-slate-100/70 dark:divide-slate-800/50">
                      {GUIDES.map((guide) => (
                        <Link
                          key={guide.slug}
                          href={`/guides/${guide.slug}`}
                          role="menuitem"
                          onClick={() => setIsGuidesOpen(false)}
                          className="group flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-slate-800/80 transition-colors"
                        >
                          <span className="text-xs font-bold text-[#16324F] dark:text-slate-100 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors">
                            {GUIDE_SHORT_TITLES[guide.slug] || guide.title}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <span>{guide.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{guide.readTime}</span>
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="px-4 py-2.5 bg-[#F7F9FC] dark:bg-slate-950/70 border-t border-slate-200/80 dark:border-slate-800">
                      <Link
                        href="/guides"
                        onClick={() => setIsGuidesOpen(false)}
                        className="flex items-center justify-between text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline py-1"
                      >
                        <span>View All Measurement Guides</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/directory"
              className="hover:text-[#16324F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
            >
              All Converters
            </Link>
            <Link
              href="/widgets"
              className="inline-flex items-center gap-1.5 text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#16324F] dark:hover:text-white font-bold transition-colors whitespace-nowrap shrink-0 py-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Widgets</span>
            </Link>
            <Link
              href="/chrome-extension"
              className="hover:text-[#16324F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Extension
            </Link>
          </nav>

          {/* Zone 3: Search Icon/Button + Theme Toggle + Mobile Menu Button (All >= 44x44px touch targets) */}
          <div suppressHydrationWarning className="flex items-center gap-2 shrink-0">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center justify-between gap-2 min-w-[44px] sm:w-[230px] lg:w-[270px] min-h-[44px] px-3 py-2 text-xs font-semibold text-[#16324F] dark:text-slate-200 bg-[#F7F9FC] dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Search units and converters"
              title="Search units and converters"
            >
              <span className="inline-flex items-center gap-2 min-w-0 truncate">
                <Search className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
                <NavbarSearchPlaceholder isPaused={isSearchOpen} />
              </span>
              <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm shrink-0">
                ⌘K
              </kbd>
            </button>

            <button
              suppressHydrationWarning
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 text-[#16324F] dark:text-amber-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
              title="Toggle Dark / Light Mode"
              aria-label="Toggle Dark and Light Mode"
            >
              <Sun className="w-4 h-4 hidden dark:block" />
              <Moon className="w-4 h-4 block dark:hidden" />
            </button>

            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 text-[#16324F] dark:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Accessible Navigation Drawer */}
        {isMobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 min-h-[44px] rounded-xl text-sm font-bold text-[#16324F] dark:text-slate-100 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 transition-colors"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/#categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 min-h-[44px] rounded-xl text-sm font-bold text-[#16324F] dark:text-slate-100 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 transition-colors"
            >
              <span>Browse Categories</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/cooking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 min-h-[44px] rounded-xl text-sm font-bold text-[#16324F] dark:text-slate-100 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 transition-colors"
            >
              <span>Cooking &amp; Ingredient Conversions</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Mobile Expandable Guides Accordion */}
            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMobileGuidesOpen((prev) => !prev)}
                aria-expanded={isMobileGuidesOpen}
                className="w-full flex items-center justify-between px-3 py-3 min-h-[44px] text-sm font-bold text-[#16324F] dark:text-slate-100 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
                  <span>Guides ({GUIDES.length})</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
                    isMobileGuidesOpen ? "rotate-180 text-[#0D9488] dark:text-[#2DD4BF]" : ""
                  }`}
                />
              </button>

              {isMobileGuidesOpen && (
                <div className="bg-[#F7F9FC] dark:bg-slate-950/60 px-2 py-2 space-y-1 border-t border-slate-200/60 dark:border-slate-800">
                  {GUIDES.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      onClick={() => {
                        setIsMobileGuidesOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col px-3 py-2 rounded-lg text-xs font-semibold text-[#16324F] dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>{GUIDE_SHORT_TITLES[guide.slug] || guide.title}</span>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        {guide.category} · {guide.readTime}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/guides"
                    onClick={() => {
                      setIsMobileGuidesOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>View All Measurement Guides</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/directory"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 min-h-[44px] rounded-xl text-sm font-bold text-[#16324F] dark:text-slate-100 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 transition-colors"
            >
              <span>All Converters Directory</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/widgets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 min-h-[44px] rounded-xl text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:bg-[#F7F9FC] dark:hover:bg-slate-800 transition-colors"
            >
              <span>Calculator Widgets (Embed)</span>
              <ChevronRight className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
            </Link>

            <Link
              href="/chrome-extension"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 min-h-[44px] rounded-xl text-sm font-bold text-[#16324F] dark:text-slate-100 hover:bg-[#F7F9FC] dark:hover:bg-slate-800 transition-colors"
            >
              <span>Chrome Extension (Toolbar Calculator)</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </nav>
        )}
      </header>

      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}
