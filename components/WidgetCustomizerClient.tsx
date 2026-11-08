"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Code2,
  Copy,
  Check,
  Sliders,
  Maximize2,
  Columns,
  ExternalLink,
  Link2,
  Eye,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Layers,
  X,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import EmbedCalculatorWidget from "@/components/EmbedCalculatorWidget";
import {
  WIDGET_ACCENT_PALETTES,
  WidgetAccent,
  WidgetCustomizationOptions,
  WidgetDescriptor,
  WidgetEmbedStyle,
  WidgetTheme,
  generateWidgetEmbedCode,
  WidgetDirectoryItem,
} from "@/lib/widgets";
import { PrecisionMode } from "@/lib/conversions/types";
import { SITE_CONFIG } from "@/lib/config";

interface WidgetCustomizerClientProps {
  widget: WidgetDescriptor;
  relatedWidgets: WidgetDirectoryItem[];
}

type CmsGuideTab = "wordpress" | "squarespace" | "wix" | "html" | "blogger";

const CMS_GUIDES: Record<
  CmsGuideTab,
  {
    label: string;
    title: string;
    steps: string[];
  }
> = {
  wordpress: {
    label: "WordPress",
    title: "How to Embed in WordPress (Gutenberg & Elementor)",
    steps: [
      "Click the \"Copy Embed Code\" button above to copy the HTML snippet to your clipboard.",
      "Open your WordPress post or page editor and click the (+) Add Block button where you want the calculator to appear.",
      "Select the \"Custom HTML\" block (or the HTML widget in Elementor / Divi) and paste the snippet inside.",
      "Click \"Preview\" or \"Publish\" — the calculator widget will load automatically and adapt to your column width.",
    ],
  },
  squarespace: {
    label: "Squarespace",
    title: "How to Embed in Squarespace",
    steps: [
      "Copy the generated HTML embed code from Step 3 above.",
      "In the Squarespace page editor, click \"Add Block\" at your desired section and choose the \"Code\" block.",
      "Ensure the mode is set to \"HTML\" (with \"Display Source\" unchecked) and paste your widget code.",
      "Save your changes to make the live interactive converter available to your visitors.",
    ],
  },
  wix: {
    label: "Wix",
    title: "How to Embed in Wix Studio & Classic Editor",
    steps: [
      "Copy the HTML snippet from the code box above.",
      "In your Wix Editor, click Add Elements (+) → Embed Code → Embed HTML.",
      "Select \"Code\" as the input type, paste the HTML snippet into the box, and click \"Update\".",
      "Drag the container handles to match your chosen widget width and publish your site.",
    ],
  },
  html: {
    label: "Custom HTML / Webflow",
    title: "How to Add to Static HTML, Webflow, or Docs",
    steps: [
      "Copy the self-contained HTML snippet above (no external JavaScript libraries or API keys required).",
      "In Webflow, add an \"Embed\" element; in static HTML, React, or Markdown documentation, paste the snippet into your template container.",
      "For sidebar layouts, select \"Adjustable Width\" above to lock a maximum pixel width (e.g., 340px).",
    ],
  },
  blogger: {
    label: "Blogger",
    title: "How to Embed in Blogger",
    steps: [
      "Copy the HTML embed snippet above.",
      "Open your Blogger post editor and switch from \"Compose view\" to \"HTML view\" using the top-left pencil icon.",
      "Paste the widget code where you want the calculator displayed, or add an \"HTML/JavaScript\" Gadget in your Blogger Layout sidebar.",
    ],
  },
};

export default function WidgetCustomizerClient({
  widget,
  relatedWidgets,
}: WidgetCustomizerClientProps) {
  const [embedStyle, setEmbedStyle] = useState<WidgetEmbedStyle>("full");
  const [widthPx, setWidthPx] = useState<number>(340);
  const [theme, setTheme] = useState<WidgetTheme>("light");
  const [accent, setAccent] = useState<WidgetAccent>("teal");
  const [defaultValue, setDefaultValue] = useState<string>(
    String(widget.exampleInput)
  );
  const [defaultVoltage, setDefaultVoltage] = useState<string>(
    String(widget.defaultVoltage)
  );
  const [precision, setPrecision] = useState<PrecisionMode>("auto");
  const [showFormula, setShowFormula] = useState<boolean>(true);
  const [lockUnits, setLockUnits] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeCmsTab, setActiveCmsTab] = useState<CmsGuideTab>("wordpress");
  const [isPopupModalOpen, setIsPopupModalOpen] = useState<boolean>(false);

  const options: WidgetCustomizationOptions = useMemo(
    () => ({
      style: embedStyle,
      widthPx,
      theme,
      accent,
      defaultValue,
      defaultVoltage,
      precision,
      showFormula,
      lockUnits,
    }),
    [
      embedStyle,
      widthPx,
      theme,
      accent,
      defaultValue,
      defaultVoltage,
      precision,
      showFormula,
      lockUnits,
    ]
  );

  const [originUrl] = useState<string>(SITE_CONFIG.canonicalDomain);

  const embedCode = useMemo(
    () => generateWidgetEmbedCode(widget, options, originUrl),
    [widget, options, originUrl]
  );

  const activePalette =
    WIDGET_ACCENT_PALETTES[accent] || WIDGET_ACCENT_PALETTES.teal;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // ignore clipboard restrictions
    }
  };

  const handleResetCustomization = () => {
    setEmbedStyle("full");
    setWidthPx(340);
    setTheme("light");
    setAccent("teal");
    setDefaultValue(String(widget.exampleInput));
    setDefaultVoltage(String(widget.defaultVoltage));
    setPrecision("auto");
    setShowFormula(true);
    setLockUnits(false);
  };

  return (
    <div className="space-y-10">
      {/* =====================================================================
          MAIN STUDIO GRID: 7 Cols Controls & Code | 5 Cols Sticky Live Preview
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN: Step 1, Step 2, Step 3 */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Select Widget Style (4 Inch Calculator Modes) */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#16324F] dark:bg-[#0D9488] text-white font-mono text-xs font-extrabold">
                  1
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white tracking-tight">
                    Select Widget Format
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose how the {widget.shortTitle.toLowerCase()} should fit into your page layout.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetCustomization}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0D9488] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    id: "full",
                    label: "Full-Width Widget",
                    desc: "Responsive 100% width — expands to fill your article or content column.",
                    icon: Maximize2,
                  },
                  {
                    id: "adjustable",
                    label: "Adjustable Width",
                    desc: "Custom pixel width (260px–640px) — ideal for sidebars and narrow columns.",
                    icon: Columns,
                  },
                  {
                    id: "popup",
                    label: "Popup Calculator",
                    desc: "Compact trigger button that opens the calculator in a floating popup window.",
                    icon: ExternalLink,
                  },
                  {
                    id: "link",
                    label: "Text Link",
                    desc: "Lightweight HTML anchor link pointing directly to the full converter.",
                    icon: Link2,
                  },
                ] as const
              ).map((mode) => {
                const Icon = mode.icon;
                const isSelected = embedStyle === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setEmbedStyle(mode.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#E6FAF8]/80 dark:bg-teal-950/40 border-[#0D9488] ring-2 ring-[#0D9488]/15"
                        : "bg-[#F7F9FC] dark:bg-slate-950/60 border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488]/50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-[#0D9488] text-white"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-extrabold text-[#16324F] dark:text-white">
                          {mode.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Adjustable Width Slider Control (shown when 'adjustable' is active) */}
            {embedStyle === "adjustable" && (
              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="widget-width-slider"
                    className="text-xs font-extrabold text-[#16324F] dark:text-white flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>Maximum Widget Width:</span>
                  </label>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#16324F] text-white font-mono text-xs font-bold tabular-nums">
                    {widthPx}px
                  </span>
                </div>

                <input
                  id="widget-width-slider"
                  type="range"
                  min={260}
                  max={640}
                  step={10}
                  value={widthPx}
                  onChange={(e) => setWidthPx(Number(e.target.value))}
                  className="w-full accent-[#0D9488] cursor-pointer"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    Range: 260px – 640px
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { w: 280, label: "280px Compact" },
                      { w: 340, label: "340px Sidebar" },
                      { w: 420, label: "420px Medium" },
                      { w: 540, label: "540px Wide" },
                    ].map((preset) => (
                      <button
                        key={preset.w}
                        type="button"
                        onClick={() => setWidthPx(preset.w)}
                        className={`px-2 py-1 rounded text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                          widthPx === preset.w
                            ? "bg-[#0D9488] text-white border-[#0D9488]"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0D9488]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* STEP 2: Customize Appearance & Default Values */}
          {embedStyle !== "link" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#16324F] dark:bg-[#0D9488] text-white font-mono text-xs font-extrabold">
                  2
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white tracking-tight">
                    Customize Appearance &amp; Calculator Defaults
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Match your site&apos;s color scheme and set initial calculation parameters.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Theme Selector */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-bold text-[#16324F] dark:text-slate-200">
                    Widget Surface Theme
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        theme === "light"
                          ? "bg-[#16324F] text-white border-[#16324F]"
                          : "bg-[#F7F9FC] dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light Theme</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        theme === "dark"
                          ? "bg-[#0D9488] text-white border-[#0D9488]"
                          : "bg-[#F7F9FC] dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark Theme</span>
                    </button>
                  </div>
                </div>

                {/* Accent Color Swatches */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-bold text-[#16324F] dark:text-slate-200">
                    Header &amp; Button Accent ({activePalette.name})
                  </span>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
                    {(Object.keys(WIDGET_ACCENT_PALETTES) as WidgetAccent[]).map(
                      (colorKey) => {
                        const pal = WIDGET_ACCENT_PALETTES[colorKey];
                        const isSelected = accent === colorKey;
                        return (
                          <button
                            key={colorKey}
                            type="button"
                            onClick={() => setAccent(colorKey)}
                            title={pal.name}
                            aria-label={`Select ${pal.name} accent color`}
                            style={{ backgroundColor: pal.primaryHex }}
                            className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "scale-115 ring-2 ring-offset-2 ring-slate-900 dark:ring-white"
                                : "opacity-80 hover:opacity-100"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Default Input Value + Voltage (if applicable) + Precision */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label
                    htmlFor="custom-default-val"
                    className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
                  >
                    Default Value ({widget.fromUnit.symbol})
                  </label>
                  <input
                    id="custom-default-val"
                    type="number"
                    step="any"
                    value={defaultValue}
                    onChange={(e) => setDefaultValue(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 font-mono text-sm font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488]"
                  />
                </div>

                {widget.requiresVoltage ? (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="custom-default-voltage"
                      className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
                    >
                      Default Voltage (V)
                    </label>
                    <select
                      id="custom-default-voltage"
                      value={defaultVoltage}
                      onChange={(e) => setDefaultVoltage(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 font-mono text-xs font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    >
                      <option value="12">12 V (Standard Battery)</option>
                      <option value="24">24 V (Solar / Marine)</option>
                      <option value="36">36 V (Golf Cart / E-Bike)</option>
                      <option value="48">48 V (Off-Grid / Server Rack)</option>
                      <option value="120">120 V (AC Line)</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="custom-unit-lock"
                      className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
                    >
                      Unit Dropdowns
                    </label>
                    <select
                      id="custom-unit-lock"
                      value={lockUnits ? "locked" : "unlocked"}
                      onChange={(e) => setLockUnits(e.target.value === "locked")}
                      className="w-full h-10 px-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    >
                      <option value="unlocked">Allow Unit Switching</option>
                      <option value="locked">
                        Lock to {widget.fromUnit.symbol} → {widget.toUnit.symbol}
                      </option>
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="custom-precision"
                    className="block text-xs font-bold text-[#16324F] dark:text-slate-200"
                  >
                    Decimal Precision
                  </label>
                  <select
                    id="custom-precision"
                    value={precision}
                    onChange={(e) => setPrecision(e.target.value as PrecisionMode)}
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 font-mono text-xs font-bold text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] cursor-pointer"
                  >
                    <option value="auto">Auto Precision</option>
                    <option value="2">2 Decimal Places</option>
                    <option value="4">4 Decimal Places</option>
                    <option value="6">6 Decimal Places</option>
                  </select>
                </div>
              </div>

              {/* Show Formula Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <label
                  htmlFor="toggle-show-formula"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Display conversion formula bar inside the widget footer
                </label>
                <input
                  id="toggle-show-formula"
                  type="checkbox"
                  checked={showFormula}
                  onChange={(e) => setShowFormula(e.target.checked)}
                  className="w-4 h-4 accent-[#0D9488] rounded cursor-pointer"
                />
              </div>
            </section>
          )}

          {/* STEP 3: Copy HTML Embed Code & Platform Installation Guides */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0D9488] text-white font-mono text-xs font-extrabold">
                  {embedStyle === "link" ? "2" : "3"}
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white tracking-tight">
                    Copy HTML Embed Code
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste this self-contained HTML snippet into your website where the widget should appear.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-extrabold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Embed Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-teal-400 font-bold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>HTML Snippet ({embedStyle.toUpperCase()})</span>
                </span>
                <span>Zero external JS dependencies · Lazy-loaded</span>
              </div>
              <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap break-all select-all">
                {embedCode}
              </pre>
            </div>

            {/* Platform Installation Instructions Tabs */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Platform Installation Instructions
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                {(Object.keys(CMS_GUIDES) as CmsGuideTab[]).map((tabKey) => {
                  const tab = CMS_GUIDES[tabKey];
                  const isActive = activeCmsTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => setActiveCmsTab(tabKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#16324F] dark:bg-[#0D9488] text-white"
                          : "bg-[#F7F9FC] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0D9488]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white">
                  {CMS_GUIDES[activeCmsTab].title}
                </h3>
                <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
                  {CMS_GUIDES[activeCmsTab].steps.map((stepText, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {stepText}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: Sticky Live Interactive Widget Preview Stage (5 Cols)
            =================================================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Studio Header */}
            <div className="px-5 py-3.5 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-2 bg-[#F7F9FC] dark:bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0D9488]" />
                <span className="text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-white">
                  Live Interactive Preview
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                {embedStyle === "full"
                  ? "100% Width"
                  : embedStyle === "adjustable"
                  ? `Max ${widthPx}px`
                  : embedStyle === "popup"
                  ? "Popup Button"
                  : "Text Link"}
              </span>
            </div>

            {/* Dot-Matrix Preview Canvas */}
            <div className="p-5 sm:p-6 bg-[#F8FAFC] dark:bg-slate-950/90 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] min-h-[340px] flex flex-col items-center justify-center">
              {embedStyle === "link" && (
                <div className="w-full max-w-md p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-2xs">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    Rendered HTML Anchor Link
                  </span>
                  <div>
                    <Link
                      href={widget.converterHref}
                      prefetch={false}
                      className="text-base font-bold text-[#0D9488] hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>{widget.shortTitle}</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clicking this link opens the full {widget.shortTitle} page.
                  </p>
                </div>
              )}

              {embedStyle === "popup" && (
                <div className="w-full max-w-md p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-2xs">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    Rendered Popup Trigger Button
                  </span>
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsPopupModalOpen(true)}
                      style={{ backgroundColor: activePalette.primaryHex }}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-extrabold shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                    >
                      <span>{widget.shortTitle}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click the button above to test the floating popup calculator window.
                  </p>
                </div>
              )}

              {(embedStyle === "full" || embedStyle === "adjustable") && (
                <div
                  style={
                    embedStyle === "adjustable"
                      ? { maxWidth: `${widthPx}px`, width: "100%" }
                      : { width: "100%" }
                  }
                  className="mx-auto transition-all duration-150"
                >
                  <EmbedCalculatorWidget
                    widget={widget}
                    theme={theme}
                    accent={accent}
                    defaultValue={defaultValue}
                    defaultVoltage={defaultVoltage}
                    precision={precision}
                    showFormula={showFormula}
                    lockUnits={lockUnits}
                    showAttributionBar={false}
                  />
                  <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pr-1">
                    <Link
                      href={widget.converterHref}
                      prefetch={false}
                      className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                    >
                      {widget.shortTitle}
                    </Link>{" "}
                    by{" "}
                    <Link
                      href="/"
                      prefetch={false}
                      className="font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
                    >
                      {SITE_CONFIG.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Studio Footer: Direct Full Calculator Link */}
            <div className="px-5 py-3.5 border-t border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Try typing values in the preview above!
              </span>
              <Link
                href={widget.converterHref}
                prefetch={false}
                className="inline-flex items-center gap-1 font-extrabold text-[#16324F] dark:text-[#2DD4BF] hover:text-[#0D9488] transition-colors"
              >
                <span>Open Full Calculator Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* Widget Benefits Card */}
          <div className="rounded-2xl bg-[#F7F9FC] dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#16324F] dark:text-slate-200">
              Why Embed This Calculator Widget?
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span>
                  <strong>100% Free &amp; Unmetered:</strong> No API keys, signup, or usage limits for personal, educational, or commercial sites.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span>
                  <strong>NIST &amp; SI Verified Constants:</strong> Accurate real-time conversions with bidirectional unit swapping.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span>
                  <strong>Sandboxed &amp; Fast:</strong> Native lazy-loaded HTML iframe that never slows down your core page scripts.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =====================================================================
          RELATED CALCULATOR WIDGETS IN THIS CATEGORY
          ===================================================================== */}
      {relatedWidgets.length > 0 && (
        <section className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#16324F] dark:text-white tracking-tight">
                More {widget.categoryName} Widgets to Embed
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Customize and embed other popular {widget.categoryName.toLowerCase()} calculators on your site.
              </p>
            </div>

            <Link
              href="/widgets"
              prefetch={false}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-[#16324F] dark:text-white hover:border-[#0D9488] transition-colors"
            >
              <span>Browse All Calculator Widgets</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0D9488]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {relatedWidgets.map((item) => (
              <Link
                key={item.slug}
                href={`/widgets/w/${item.slug}`}
                prefetch={false}
                rel="nofollow"
                className="group p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#0D9488] transition-all flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 font-mono text-[11px] font-bold">
                      {item.fromSymbol} → {item.toSymbol}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.categoryName}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#16324F] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                  <span>Customize Widget</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          INTERACTIVE POPUP SIMULATOR MODAL (When testing Popup Calculator mode)
          ===================================================================== */}
      {isPopupModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${widget.shortTitle} Popup Preview`}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsPopupModalOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Simulated Browser Popup Title Bar */}
            <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {originUrl}{widget.embedEndpointPath}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPopupModalOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                aria-label="Close popup preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3">
              <EmbedCalculatorWidget
                widget={widget}
                theme={theme}
                accent={accent}
                defaultValue={defaultValue}
                defaultVoltage={defaultVoltage}
                precision={precision}
                showFormula={showFormula}
                lockUnits={lockUnits}
                showAttributionBar={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
