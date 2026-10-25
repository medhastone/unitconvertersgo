"use client";

import { Ruler } from "lucide-react";
import { formatAsTapeFraction } from "@/lib/conversions/fractions";

interface TapeMeasureVisualProps {
  inchesValue: number;
  cmValue?: number;
}

export default function TapeMeasureVisual({
  inchesValue,
  cmValue,
}: TapeMeasureVisualProps) {
  if (
    !Number.isFinite(inchesValue) ||
    inchesValue < 0 ||
    inchesValue > 100000
  ) {
    return null;
  }

  const frac16 = formatAsTapeFraction(inchesValue, 16);
  const frac32 = formatAsTapeFraction(inchesValue, 32);
  const frac64 = formatAsTapeFraction(inchesValue, 64);

  if (!frac16 || !frac32 || !frac64) return null;

  // Center a 2-inch tape measure window around the snapped 1/16" mark
  const snappedInch = frac16.exactDecimal;
  const baseWhole = Math.floor(snappedInch);
  // If snappedInch is an exact whole inch > 0, start at baseWhole - 1 so the mark sits right in the middle of the 2" window
  const windowStartInch =
    snappedInch === baseWhole && baseWhole > 0 ? baseWhole - 1 : baseWhole;
  const windowSpanInches = 2; // 32 sixteenths total across the blade

  // Percentage across the 2-inch window (clamped 0..100)
  const snappedPercent = Math.min(
    100,
    Math.max(0, ((snappedInch - windowStartInch) / windowSpanInches) * 100)
  );
  const exactPercent = Math.min(
    100,
    Math.max(0, ((inchesValue - windowStartInch) / windowSpanInches) * 100)
  );

  // 33 ticks (0/16 through 32/16)
  const totalSixteenths = windowSpanInches * 16;

  return (
    <div
      aria-label={`Tape measure visual marking ${frac16.display} inches at the nearest 1/16 inch`}
      className="p-3.5 sm:p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-950/80 border border-slate-200/90 dark:border-slate-800 space-y-3"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <span className="font-extrabold text-[#16324F] dark:text-white flex items-center gap-1.5">
          <Ruler className="w-4 h-4 text-[#0D9488]" />
          <span>1/16&Prime; Shop Tape Measure Readout</span>
        </span>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums">
          <span className="px-2 py-0.5 rounded-md bg-[#0D9488] text-white font-extrabold">
            Nearest 1/16&Prime;: {frac16.display}&Prime;
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#16324F] dark:text-slate-200 font-bold">
            1/32&Prime;: {frac32.display}&Prime;
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#0D9488] dark:text-[#2DD4BF] font-bold">
            1/64&Prime;: {frac64.display}&Prime;
          </span>
        </div>
      </div>

      {/* Yellow Steel Tape Measure Blade */}
      <div className="relative rounded-xl border-2 border-amber-500/80 dark:border-amber-600/80 bg-gradient-to-b from-[#FEF08A] via-[#FDE047] to-[#FACC15] text-slate-950 px-3 sm:px-5 pt-7 pb-3 shadow-inner overflow-hidden select-none">
        {/* Top Metallic Rivet / Case Edge Accent */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-600/40 via-amber-400/20 to-amber-600/40"
        />

        {/* Snapped 1/16" Callout Flag & Marker Line */}
        <div className="relative w-full h-14">
          {/* Exact Decimal Ghost Line (if different from 1/16") */}
          {Math.abs(exactPercent - snappedPercent) > 0.15 && (
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-0.5 border-l border-dashed border-slate-700/70 z-10"
              style={{ left: `${exactPercent}%` }}
              title={`Exact decimal: ${Number(inchesValue.toFixed(4))}"`}
            />
          )}

          {/* Active Nearest 1/16" Marker Needle */}
          <div
            className="absolute top-0 bottom-0 z-20 transition-all duration-200"
            style={{ left: `${snappedPercent}%` }}
          >
            {/* Floating Badge Above Needle */}
            <div
              className={`absolute -top-5 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-[#16324F] text-white font-mono text-[11px] font-extrabold shadow-xs border border-teal-400/60 ${
                snappedPercent < 12
                  ? "translate-x-0"
                  : snappedPercent > 88
                  ? "-translate-x-full"
                  : "-translate-x-1/2"
              }`}
            >
              {frac16.display}&Prime;
            </div>
            {/* High-Contrast Vertical Pointer Line */}
            <div className="w-0.5 h-full bg-[#0D9488] -translate-x-1/2 shadow-[0_0_0_1.5px_rgba(255,255,255,0.85)]" />
            {/* Bottom Triangle Tip */}
            <div className="w-2.5 h-2.5 bg-[#0D9488] rotate-45 -translate-x-1/2 -mt-1.5 border border-white" />
          </div>

          {/* 33 Graduation Ticks (Every 1/16" across 2-inch window) */}
          <div className="absolute inset-x-0 bottom-0 h-10 flex justify-between items-end">
            {Array.from({ length: totalSixteenths + 1 }).map((_, idx) => {
              const isWholeInch = idx % 16 === 0;
              const isHalfInch = !isWholeInch && idx % 8 === 0;
              const isQuarterInch = !isWholeInch && !isHalfInch && idx % 4 === 0;
              const isEighthInch =
                !isWholeInch && !isHalfInch && !isQuarterInch && idx % 2 === 0;

              const inchNumber = windowStartInch + idx / 16;
              const rem16 = idx % 16;

              const tickHeightClass = isWholeInch
                ? "h-8 w-[2px] bg-slate-950"
                : isHalfInch
                ? "h-6 w-[2px] bg-slate-900"
                : isQuarterInch
                ? "h-4.5 w-[1.5px] bg-slate-800"
                : isEighthInch
                ? "h-3 w-px bg-slate-800/90"
                : "h-2 w-px bg-slate-700/80";

              return (
                <div
                  key={idx}
                  className="relative flex flex-col items-center justify-end h-full"
                >
                  {isWholeInch && (
                    <span className="mb-0.5 font-mono text-xs sm:text-sm font-black text-slate-950 leading-none">
                      {inchNumber}&Prime;
                    </span>
                  )}
                  {isHalfInch && (
                    <span className="mb-0.5 font-mono text-[10px] font-extrabold text-slate-900 leading-none">
                      1/2
                    </span>
                  )}
                  {isQuarterInch && (
                    <span className="mb-0.5 font-mono text-[9px] font-bold text-slate-800 leading-none hidden sm:inline">
                      {rem16 === 4 ? "1/4" : "3/4"}
                    </span>
                  )}
                  <div className={tickHeightClass} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Caption Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
        <span>
          Exact Decimal:{" "}
          <strong className="text-[#16324F] dark:text-white">
            {Number(inchesValue.toFixed(4))} in
          </strong>{" "}
          {cmValue !== undefined && Number.isFinite(cmValue) && (
            <span>({Number(cmValue.toFixed(2))} cm)</span>
          )}
        </span>
        <span>
          Tape Mark (1/16&Prime;):{" "}
          <strong className="text-[#0D9488] dark:text-[#2DD4BF]">
            {frac16.display}&Prime; ({Number(frac16.exactDecimal.toFixed(4))} in)
          </strong>{" "}
          · Error: ±{Number(frac16.error.toFixed(4))}&Prime;
        </span>
      </div>
    </div>
  );
}
