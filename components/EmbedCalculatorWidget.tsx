"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  Zap,
  ExternalLink,
} from "lucide-react";
import { convertUnits } from "@/lib/conversions/engine";
import { UNIT_MAP } from "@/lib/conversions/units";
import { PrecisionMode } from "@/lib/conversions/types";
import {
  WIDGET_ACCENT_PALETTES,
  WidgetAccent,
  WidgetDescriptor,
  WidgetTheme,
} from "@/lib/widgets";
import { SITE_CONFIG } from "@/lib/config";

interface EmbedCalculatorWidgetProps {
  widget: WidgetDescriptor;
  theme?: WidgetTheme;
  accent?: WidgetAccent;
  defaultValue?: string;
  defaultVoltage?: string;
  precision?: PrecisionMode;
  showFormula?: boolean;
  lockUnits?: boolean;
  showAttributionBar?: boolean;
  className?: string;
}

export default function EmbedCalculatorWidget({
  widget,
  theme = "light",
  accent = "teal",
  defaultValue,
  defaultVoltage = "12",
  precision = "auto",
  showFormula = true,
  lockUnits = false,
  showAttributionBar = true,
  className = "",
}: EmbedCalculatorWidgetProps) {
  const [unitOverride, setUnitOverride] = useState<{
    slug: string;
    fromId: string;
    toId: string;
  } | null>(null);
  const [inputOverride, setInputOverride] = useState<{
    defaultVal: string | undefined;
    val: string;
  } | null>(null);
  const [voltageOverride, setVoltageOverride] = useState<{
    defaultVolt: string | undefined;
    val: string;
  } | null>(null);
  const [precisionOverride, setPrecisionOverride] = useState<{
    propPrecision: PrecisionMode;
    val: PrecisionMode;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fromUnitId =
    unitOverride && unitOverride.slug === widget.slug
      ? unitOverride.fromId
      : widget.fromUnit.id;
  const toUnitId =
    unitOverride && unitOverride.slug === widget.slug
      ? unitOverride.toId
      : widget.toUnit.id;
  const inputVal =
    inputOverride && inputOverride.defaultVal === defaultValue
      ? inputOverride.val
      : defaultValue !== undefined
      ? defaultValue
      : String(widget.exampleInput);
  const voltageStr =
    voltageOverride && voltageOverride.defaultVolt === defaultVoltage
      ? voltageOverride.val
      : defaultVoltage || "12";
  const activePrecision =
    precisionOverride && precisionOverride.propPrecision === precision
      ? precisionOverride.val
      : precision;

  const setFromUnitId = (id: string) =>
    setUnitOverride({ slug: widget.slug, fromId: id, toId: toUnitId });
  const setToUnitId = (id: string) =>
    setUnitOverride({ slug: widget.slug, fromId: fromUnitId, toId: id });
  const setInputVal = (val: string) =>
    setInputOverride({ defaultVal: defaultValue, val });
  const setVoltageStr = (val: string) =>
    setVoltageOverride({ defaultVolt: defaultVoltage, val });
  const setActivePrecision = (val: PrecisionMode) =>
    setPrecisionOverride({ propPrecision: precision, val });

  const palette = WIDGET_ACCENT_PALETTES[accent] || WIDGET_ACCENT_PALETTES.teal;
  const isDark = theme === "dark";

  const activeFromUnit = UNIT_MAP.get(fromUnitId) || widget.fromUnit;
  const activeToUnit = UNIT_MAP.get(toUnitId) || widget.toUnit;

  const isVoltagePair = useMemo(() => {
    return (
      (activeFromUnit.categoryId === "charge" && activeToUnit.categoryId === "energy") ||
      (activeFromUnit.categoryId === "energy" && activeToUnit.categoryId === "charge")
    );
  }, [activeFromUnit.categoryId, activeToUnit.categoryId]);

  const numericInput = parseFloat(inputVal);
  const numericVoltage = parseFloat(voltageStr);
  const isValidInput = inputVal.trim() !== "" && !isNaN(numericInput);
  const safeVoltage = !isNaN(numericVoltage) && numericVoltage > 0 ? numericVoltage : 12;

  const conversion = useMemo(() => {
    if (!isValidInput) return null;
    try {
      return convertUnits(
        numericInput,
        activeFromUnit.id,
        activeToUnit.id,
        activePrecision,
        safeVoltage
      );
    } catch {
      return null;
    }
  }, [isValidInput, numericInput, activeFromUnit.id, activeToUnit.id, activePrecision, safeVoltage]);

  const handleSwap = () => {
    setFromUnitId(activeToUnit.id);
    setToUnitId(activeFromUnit.id);
  };

  const handleReset = () => {
    setFromUnitId(widget.fromUnit.id);
    setToUnitId(widget.toUnit.id);
    setInputVal(defaultValue !== undefined ? defaultValue : String(widget.exampleInput));
    setVoltageStr(defaultVoltage || "12");
    setActivePrecision(precision);
  };

  const handleCopy = async () => {
    if (!conversion) return;
    try {
      await navigator.clipboard.writeText(
        `${conversion.formattedValue} ${activeToUnit.symbol}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard error in restricted iframe
    }
  };

  return (
    <div
      className={`w-full rounded-xl border transition-colors select-none overflow-hidden ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200/95 text-slate-900"
      } ${className}`}
    >
      {/* Top Accent Header Bar */}
      <div
        style={{ backgroundColor: palette.primaryHex }}
        className="px-4 py-3 text-white flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-white" />
          </span>
          <h2 className="text-sm font-extrabold tracking-tight truncate">
            {widget.widgetHeading}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Reset calculator"
          aria-label="Reset calculator"
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Calculator Body */}
      <div className="p-4 space-y-3.5">
        {/* Input Row */}
        <div className="grid grid-cols-12 gap-2.5 items-end">
          <div className={lockUnits ? "col-span-12" : "col-span-5"}>
            <label
              htmlFor={`widget-input-${widget.slug}`}
              className={`block text-[11px] font-bold mb-1 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {activeFromUnit.plural} ({activeFromUnit.symbol})
            </label>
            <input
              id={`widget-input-${widget.slug}`}
              type="number"
              inputMode="decimal"
              step="any"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter value"
              className={`w-full h-10 px-3 rounded-lg border font-mono text-sm font-extrabold tabular-nums focus:outline-none transition-colors ${
                isDark
                  ? "bg-slate-950 border-slate-700 text-white focus:border-teal-400"
                  : "bg-[#F7F9FC] border-slate-300 text-slate-900 focus:border-slate-500"
              }`}
            />
          </div>

          {!lockUnits && (
            <>
              <div className="col-span-5">
                <label
                  htmlFor={`widget-from-${widget.slug}`}
                  className={`block text-[11px] font-bold mb-1 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  From Unit
                </label>
                <select
                  id={`widget-from-${widget.slug}`}
                  value={activeFromUnit.id}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className={`w-full h-10 px-2.5 rounded-lg border text-xs font-bold focus:outline-none cursor-pointer ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white"
                      : "bg-[#F7F9FC] border-slate-300 text-slate-900"
                  }`}
                >
                  {widget.availableUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.plural} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap units"
                  aria-label="Swap units"
                  style={{
                    backgroundColor: isDark ? palette.softBgDark : palette.softBgLight,
                    color: isDark ? palette.textAccentDark : palette.textAccentLight,
                  }}
                  className="w-full h-10 rounded-lg border border-current/20 flex items-center justify-center hover:opacity-85 transition-opacity cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Voltage (V) Row for Electrical Battery Calculators (e.g. Ah to kWh) */}
        {isVoltagePair && (
          <div
            className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-2 ${
              isDark
                ? "bg-slate-950/70 border-slate-800"
                : "bg-slate-50 border-slate-200/90"
            }`}
          >
            <div className="flex items-center gap-2">
              <label
                htmlFor={`widget-voltage-${widget.slug}`}
                className={`text-[11px] font-bold whitespace-nowrap ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Voltage (V):
              </label>
              <input
                id={`widget-voltage-${widget.slug}`}
                type="number"
                inputMode="decimal"
                step="any"
                min="0.1"
                value={voltageStr}
                onChange={(e) => setVoltageStr(e.target.value)}
                className={`w-20 h-8 px-2 rounded-md border font-mono text-xs font-extrabold tabular-nums ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div className="flex items-center gap-1">
              {["12", "24", "36", "48"].map((vPreset) => {
                const isSelected = voltageStr.trim() === vPreset;
                return (
                  <button
                    key={vPreset}
                    type="button"
                    onClick={() => setVoltageStr(vPreset)}
                    style={
                      isSelected
                        ? { backgroundColor: palette.primaryHex, color: "#ffffff" }
                        : undefined
                    }
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? ""
                        : isDark
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {vPreset}V
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Target Unit Row (if units are unlocked) */}
        {!lockUnits && (
          <div>
            <label
              htmlFor={`widget-to-${widget.slug}`}
              className={`block text-[11px] font-bold mb-1 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Convert To
            </label>
            <select
              id={`widget-to-${widget.slug}`}
              value={activeToUnit.id}
              onChange={(e) => setToUnitId(e.target.value)}
              className={`w-full h-10 px-2.5 rounded-lg border text-xs font-bold focus:outline-none cursor-pointer ${
                isDark
                  ? "bg-slate-950 border-slate-700 text-white"
                  : "bg-[#F7F9FC] border-slate-300 text-slate-900"
              }`}
            >
              {widget.availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.plural} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Result Output Box */}
        <div
          style={{
            backgroundColor: isDark ? palette.softBgDark : palette.softBgLight,
            borderColor: isDark ? "rgba(148,163,184,0.2)" : `${palette.primaryHex}33`,
          }}
          className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <div
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Result ({activeToUnit.plural})
            </div>
            <div
              aria-live="polite"
              className="flex items-baseline gap-1.5 flex-wrap mt-0.5"
            >
              <span
                className={`text-2xl font-extrabold font-mono tabular-nums tracking-tight break-all ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {conversion ? conversion.formattedValue : "—"}
              </span>
              <span
                style={{
                  color: isDark ? palette.textAccentDark : palette.textAccentLight,
                }}
                className="text-sm font-extrabold font-mono"
              >
                {activeToUnit.symbol}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {lockUnits && (
              <button
                type="button"
                onClick={handleSwap}
                title="Swap conversion direction"
                className={`p-2 rounded-lg border text-xs font-bold cursor-pointer ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!conversion}
              style={{ backgroundColor: palette.primaryHex }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold hover:opacity-95 disabled:opacity-40 transition-opacity cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Formula & Attribution Strip */}
        {((showFormula && conversion) || showAttributionBar) && (
          <div
            className={`pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
              isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
            }`}
          >
            {showFormula && conversion ? (
              <span className="font-mono font-semibold truncate">
                Formula: {conversion.formulaDisplay}
              </span>
            ) : (
              <span className="font-mono font-semibold truncate">
                {activeFromUnit.symbol} → {activeToUnit.symbol}
              </span>
            )}

            {showAttributionBar && (
              <a
                href={`${SITE_CONFIG.canonicalDomain}${widget.converterHref}`}
                target="_blank"
                rel="noopener"
                style={{
                  color: isDark ? palette.textAccentDark : palette.textAccentLight,
                }}
                className="inline-flex items-center gap-1 font-bold hover:underline shrink-0"
              >
                <span>{SITE_CONFIG.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
