import type { Metadata } from "next";
import Link from "next/link";
import {
  Ruler,
  Scale,
  Thermometer,
  Square,
  Beaker,
  Gauge,
  Clock,
  CircleDot,
  Zap,
  Activity,
  HardDrive,
  ArrowDownUp,
  Flame,
  Layers,
  RotateCw,
  Radio,
  Compass,
  Fuel,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Users,
  HardHat,
  GraduationCap,
  Dumbbell,
  Briefcase,
  Calculator,
  Cpu,
} from "lucide-react";
import UniversalConverterCard from "@/components/UniversalConverterCard";
import HeroSearch from "@/components/HeroSearch";
import { SITE_CONFIG } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import { TOP_20_POPULAR_CONVERTERS } from "@/lib/seo-config";
import { CATEGORIES } from "@/lib/conversions/units";
import {
  CONVERSION_CATALOGUE,
  CATALOGUE_MAP,
  getPairUrl,
  getCategoryUrl,
} from "@/lib/conversions/catalogue";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_CONFIG.homepageTitle,
  description: SITE_CONFIG.description,
  canonicalPath: "/",
  useExactTitle: true,
});

const ICONS: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Thermometer: <Thermometer className="w-5 h-5" />,
  Square: <Square className="w-5 h-5" />,
  Beaker: <Beaker className="w-5 h-5" />,
  Gauge: <Gauge className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  CircleDot: <CircleDot className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  HardDrive: <HardDrive className="w-5 h-5" />,
  ArrowDownUp: <ArrowDownUp className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  RotateCw: <RotateCw className="w-5 h-5" />,
  Radio: <Radio className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Fuel: <Fuel className="w-5 h-5" />,
};

const FEATURED_POPULAR_CONVERSIONS = [
  {
    slug: "cm-to-inches",
    title: "Centimeters to Inches",
    subtitle: "cm to in",
    icon: <Ruler className="w-4 h-4" />,
    tint: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  },
  {
    slug: "kg-to-lbs",
    title: "Kilograms to Pounds",
    subtitle: "kg to lb",
    icon: <Scale className="w-4 h-4" />,
    tint: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
  },
  {
    slug: "celsius-to-fahrenheit",
    title: "Celsius to Fahrenheit",
    subtitle: "°C to °F",
    icon: <Thermometer className="w-4 h-4" />,
    tint: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
  },
  {
    slug: "mm-to-inches",
    title: "Millimeters to Inches",
    subtitle: "mm to in",
    icon: <Ruler className="w-4 h-4" />,
    tint: "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
  },
  {
    slug: "meters-to-feet",
    title: "Meters to Feet",
    subtitle: "m to ft",
    icon: <Ruler className="w-4 h-4" />,
    tint: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400",
  },
  {
    slug: "km-to-miles",
    title: "Kilometers to Miles",
    subtitle: "km to mi",
    icon: <Gauge className="w-4 h-4" />,
    tint: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
  },
  {
    slug: "liters-to-gallons",
    title: "Liters to Gallons",
    subtitle: "L to gal",
    icon: <Beaker className="w-4 h-4" />,
    tint: "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400",
  },
  {
    slug: "ounces-to-grams",
    title: "Ounces to Grams",
    subtitle: "oz to g",
    icon: <Scale className="w-4 h-4" />,
    tint: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
  },
];

const CORE_INDEXABLE_CATEGORIES = [
  {
    id: "length",
    displayName: "Length",
    subtitle: "Meters, feet, inches and more",
    iconName: "Ruler",
    tint: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  },
  {
    id: "mass",
    displayName: "Weight & Mass",
    subtitle: "Kilograms, pounds, ounces and more",
    iconName: "Scale",
    tint: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400",
  },
  {
    id: "temperature",
    displayName: "Temperature",
    subtitle: "Celsius, Fahrenheit and more",
    iconName: "Thermometer",
    tint: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
  },
  {
    id: "area",
    displayName: "Area",
    subtitle: "Square meters, acres and more",
    iconName: "Square",
    tint: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "volume",
    displayName: "Volume",
    subtitle: "Liters, gallons, milliliters and more",
    iconName: "Beaker",
    tint: "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400",
  },
  {
    id: "speed",
    displayName: "Speed",
    subtitle: "km/h, mph, m/s and more",
    iconName: "Gauge",
    tint: "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
  },
  {
    id: "time",
    displayName: "Time",
    subtitle: "Seconds, minutes, hours and more",
    iconName: "Clock",
    tint: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  },
  {
    id: "pressure",
    displayName: "Pressure",
    subtitle: "Pascal, bar, psi and more",
    iconName: "CircleDot",
    tint: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400",
  },
  {
    id: "energy",
    displayName: "Energy",
    subtitle: "Joules, calories, kWh and more",
    iconName: "Zap",
    tint: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
  },
  {
    id: "power",
    displayName: "Power",
    subtitle: "Watts, kilowatts and more",
    iconName: "Activity",
    tint: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "digital_storage",
    displayName: "Data Storage",
    subtitle: "Bytes, KB, MB, GB and more",
    iconName: "HardDrive",
    tint: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "data_transfer",
    displayName: "Data Transfer",
    subtitle: "Mbps, Gbps, MB/s and more",
    iconName: "ArrowDownUp",
    tint: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  },
  {
    id: "fuel_economy",
    displayName: "Fuel Consumption",
    subtitle: "US MPG, UK MPG, L/100km",
    iconName: "Fuel",
    tint: "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400",
  },
  {
    id: "force",
    displayName: "Force",
    subtitle: "Newtons, kilonewtons, lbf",
    iconName: "Flame",
    tint: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
  },
  {
    id: "density",
    displayName: "Density",
    subtitle: "kg/m³, g/cm³, lb/ft³",
    iconName: "Layers",
    tint: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "angle",
    displayName: "Angle",
    subtitle: "Degrees, radians, gradians",
    iconName: "Compass",
    tint: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "frequency",
    displayName: "Frequency",
    subtitle: "Hertz, kHz, MHz, GHz, RPM",
    iconName: "Radio",
    tint: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
  },
];

export default function HomePage() {
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
    ],
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#F7F9FC]/60 dark:bg-slate-950">
      <script
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* HERO + QUICK CONVERTER SECTION */}
      <section suppressHydrationWarning className="bg-gradient-to-b from-[#F7F9FC] to-white dark:from-slate-950 dark:to-slate-900/50 border-b border-slate-200/70 dark:border-slate-800/80 pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6">
        <div suppressHydrationWarning className="max-w-4xl mx-auto space-y-5 sm:space-y-7">
          {/* Hero Heading, Supporting Text & Large Search Bar */}
          <div className="text-center space-y-2.5 sm:space-y-3.5 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#16324F] dark:text-white text-balance leading-tight">
              Free Unit Converter — Convert Units{" "}
              <span className="text-[#0D9488] dark:text-[#2DD4BF]">Instantly</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Simple, accurate conversions across {CATEGORIES.length} measurement categories and {CONVERSION_CATALOGUE.length} unit calculators.
            </p>

            {/* Large Search Field Immediately Below Heading */}
            <div className="pt-1.5">
              <HeroSearch />
            </div>
          </div>

          {/* Prominent Single-Column / Responsive Quick Converter Card */}
          <UniversalConverterCard
            initialCategoryId="length"
            initialFromUnitId="meter"
            initialToUnitId="foot"
            initialValue={1}
          />
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
        {/* POPULAR CONVERSIONS (2-column compact cards on mobile, 4-column on desktop) */}
        <section id="popular" className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 shrink-0" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                Popular Conversions
              </h2>
            </div>
            <Link
              href="/directory"
              prefetch={false}
              className="inline-flex items-center gap-1 min-h-[44px] px-2 text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {FEATURED_POPULAR_CONVERSIONS.map((item) => {
              const pairObj = CATALOGUE_MAP.get(item.slug);
              const href = pairObj ? getPairUrl(pairObj) : `/length/${item.slug}`;
              return (
              <Link
                key={item.slug}
                href={href}
                prefetch={false}
                className="group p-3 sm:p-4 min-h-[68px] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0D9488] dark:hover:border-[#0D9488] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${item.tint}`}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] shrink-0" />
              </Link>
              );
            })}
          </div>
        </section>

        {/* BROWSE BY CATEGORY (2-column compact cards on mobile, 3-4 columns on desktop) */}
        <section id="categories" className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-[#0D9488] shrink-0" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                Browse by Category
              </h2>
            </div>
            <Link
              href="/directory"
              prefetch={false}
              className="inline-flex items-center gap-1 min-h-[44px] px-2 text-sm font-bold text-[#16324F] dark:text-slate-300 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors shrink-0"
            >
              <span>All {CATEGORIES.length} Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {CORE_INDEXABLE_CATEGORIES.map((catInfo) => (
              <Link
                key={catInfo.id}
                href={getCategoryUrl(catInfo.id)}
                prefetch={false}
                className="group p-3 sm:p-4 min-h-[76px] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0D9488] dark:hover:border-[#0D9488] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-2"
              >
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${catInfo.tint}`}
                  >
                    {ICONS[catInfo.iconName] || <Ruler className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors leading-snug">
                      {catInfo.displayName} Converter
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight mt-0.5">
                      {catInfo.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] shrink-0" />
              </Link>
            ))}
          </div>

          {/* Dedicated Cooking & Ingredient Conversions Feature Card */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
                    Cooking &amp; Ingredient Conversions (Density-Aware)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Convert grams ↔ cups, tbsp, tsp, mL &amp; oz using verified USDA FoodData Central &amp; King Arthur Baking densities
                  </p>
                </div>
              </div>
              <Link
                href="/cooking"
                prefetch={false}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0"
              >
                <span>Open Cooking Converter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { slug: "flour", label: "Flour" },
                { slug: "sugar", label: "Granulated Sugar" },
                { slug: "brown-sugar", label: "Brown Sugar" },
                { slug: "powdered-sugar", label: "Powdered Sugar" },
                { slug: "butter", label: "Butter" },
                { slug: "rice", label: "Rice" },
                { slug: "milk", label: "Milk" },
                { slug: "water", label: "Water" },
                { slug: "honey", label: "Honey" },
                { slug: "oil", label: "Cooking Oil" },
                { slug: "salt", label: "Salt" },
              ].map((ing) => (
                <Link
                  key={ing.slug}
                  href={`/cooking/${ing.slug}`}
                  prefetch={false}
                  className="px-3 py-1.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#0D9488] text-xs sm:text-[13px] font-bold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] transition-colors"
                >
                  {ing.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CONTENT SECTION — HOW ONLINE UNIT CONVERSION WORKS (Collapsible) + TOP 20 MOST POPULAR CONVERTERS */}
        <section className="space-y-4">
          {/* Collapsible Educational Card */}
          <details
            open
            className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900/90 overflow-hidden shadow-2xs"
          >
            <summary className="list-none cursor-pointer px-4 sm:px-6 py-4 min-h-[52px] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0D9488]/12 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white">
                  How Online Unit Conversion Works
                </h2>
              </div>
              <ChevronDown className="w-5 h-5 text-[#16324F] dark:text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
            </summary>

            <div className="px-4 sm:px-6 pb-5 pt-1 space-y-4 text-[15px] sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Unit conversion uses a fixed mathematical relationship between two units. You enter a value, choose the units, and the tool multiplies or divides it by a conversion factor to give the result.
              </p>

              {/* Worked Example Box */}
              <div className="rounded-xl bg-sky-50/70 dark:bg-slate-950 border border-sky-200/70 dark:border-slate-800 px-4 py-3 space-y-1.5">
                <div className="font-bold text-[#16324F] dark:text-white text-sm sm:text-base">
                  Example: Meters to Feet
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-300 font-mono">
                  <span>1 meter = 3.28084 feet</span>
                  <span>Formula: Feet = Meters × 3.28084</span>
                </div>
              </div>

              <Link
                href="/guides/metric-to-imperial"
                prefetch={false}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#0D9488]/40 bg-[#0D9488]/5 hover:bg-[#0D9488]/10 text-sm sm:text-[15px] font-bold text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Learn more about unit conversion</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </details>

          {/* Server-Rendered Top 20 Most Popular Converters */}
          <div
            id="popular-converters"
            className="scroll-mt-24 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 space-y-3.5 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white">
                Top 20 Most Popular Unit Converters
              </h2>
              <Link
                href="/directory"
                prefetch={false}
                className="text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
              >
                Browse All Converters →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {TOP_20_POPULAR_CONVERTERS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 hover:border-[#0D9488] text-sm font-semibold text-[#16324F] dark:text-slate-200 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] flex items-center justify-between gap-2 transition-colors capitalize"
                >
                  <span className="truncate">{item.anchorText}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* About UnitConvertersGo - Human Editorial Content & Real-World Problem Solvers */}
          <section
            id="about"
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 space-y-8 shadow-xs"
          >
            {/* Header & Mission Statement */}
            <div className="space-y-4 max-w-4xl">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                About UnitConvertersGo
              </h2>
              <div className="space-y-3.5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  We create accurate, easy-to-use calculators and conversion tools, paired with clear,
                  informative content, to help finance professionals, students, engineers, fitness
                  enthusiasts, contractors, homeowners, and others solve real-world measurement problems.
                </p>
                <p>
                  We design each tool to deliver the right amount of information, whether you want a quick
                  answer on a job site or to understand the underlying calculations, dimensional analysis,
                  and mathematical relationships behind it.
                </p>
                <p>
                  We believe accuracy and transparency go hand in hand. You can inspect the exact formulas,
                  computational methods, conversion factors, and metrological assumptions behind our
                  calculators to understand how we calculate the results.
                </p>
                <p className="text-sm sm:text-[15px] text-slate-500 dark:text-slate-400">
                  Every conversion factor and equation is cross-checked against official publications from NIST (Special Publication 811), the BIPM SI Brochure (9th Edition), and ISO/IEC 80000 standards.
                </p>
              </div>
            </div>

            {/* Core Values: 3 Transparency Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 flex flex-col gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#16324F] dark:text-white">
                  Transparent Formulas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  No black-box math. Every calculator displays explicit formulas, step-by-step worked examples,
                  and reverse equations so you can verify each calculation.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 flex flex-col gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#16324F] dark:text-white">
                  Standardized Definitions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Conversion factors are derived from internationally recognized metrology standards (NIST SP 811,
                  BIPM SI brochure, and ISO 80000) using exact physical constants.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 flex flex-col gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#16324F] dark:text-white">
                  Fast &amp; Distraction-Free
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Built for immediate productivity. Instant calculations that run client-side in your browser
                  with zero delays, intrusive modals, or paywalls.
                </p>
              </div>
            </div>

            {/* Audience Personas: Who Uses UnitConvertersGo */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#16324F] dark:text-white">
                  Built to Help Real-World Problem Solvers
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Whether you are estimating materials on a construction site or balancing an engineering equation,
                  our tools support your daily workflow:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#16324F] dark:text-white">
                    <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <span>Contractors &amp; Homeowners</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Estimate framing lumber, square footage, tile area, drywall sheets, and concrete volume with quick
                    fraction-to-decimal and metric-to-imperial conversions.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#16324F] dark:text-white">
                    <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span>Engineers &amp; Technicians</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Verify high-precision tolerances across pressure (psi to bar), flow rates, torque, thermal
                    conductivity, dynamic viscosity, and power output.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#16324F] dark:text-white">
                    <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span>Students &amp; Educators</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Study dimensional analysis for physics and chemistry homework with unit cancellation breakdowns,
                    standard SI units, and scientific exponential notation.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#16324F] dark:text-white">
                    <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <span>Fitness Enthusiasts &amp; Athletes</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Convert gym barbell weights (kg to lbs), running paces (min/km to min/mi), triathlon distances,
                    and metabolic food energy between kilocalories and kilojoules.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#16324F] dark:text-white">
                    <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span>Finance, Logistics &amp; Trade Professionals</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Compute cargo gross weight thresholds, ocean freight container capacity (CBM to cubic feet),
                    fuel efficiency comparisons (mpg to L/100km), and tariff weight classifications for international shipping.
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Integrity & Team Note */}
            <div className="p-4 sm:p-5 rounded-xl border border-[#0D9488]/30 bg-[#0D9488]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#0D9488]/10 text-[#0D9488] shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-[#16324F] dark:text-white">
                    Automated Verification &amp; Standards Alignment
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Our calculation engines are continuously validated against automated unit-conversion test suites and official NIST SP 811, BIPM SI, and ISO/IEC 80000 reference tables.
                  </p>
                </div>
              </div>
              <Link
                href="/directory"
                prefetch={false}
                className="shrink-0 px-4 py-2 min-h-[40px] rounded-lg bg-[#0D9488] hover:bg-[#0B7A6F] text-white text-sm font-bold transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
              >
                <span>Browse All Converters</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
