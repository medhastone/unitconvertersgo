"use client";

import { useMemo, useState } from "react";
import { Table, ArrowRight } from "lucide-react";
import { convertUnits, formatValue } from "@/lib/conversions/engine";
import { UNIT_MAP } from "@/lib/conversions/units";

interface DynamicReferenceTableProps {
  fromUnitId: string;
  toUnitId: string;
  onSelectValue?: (value: number) => void;
}

const STEP_PRESETS = {
  standard: [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 75, 100, 250, 500, 1000],
  small: [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10],
  large: [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
};

export default function DynamicReferenceTable({
  fromUnitId,
  toUnitId,
  onSelectValue,
}: DynamicReferenceTableProps) {
  const [activePreset, setActivePreset] = useState<"standard" | "small" | "large">("standard");

  const fromUnit = UNIT_MAP.get(fromUnitId);
  const toUnit = UNIT_MAP.get(toUnitId);

  const tableData = useMemo(() => {
    if (!fromUnit || !toUnit) return [];
    const steps = STEP_PRESETS[activePreset];

    return steps.map((val) => {
      const res = convertUnits(val, fromUnitId, toUnitId, "auto");
      return {
        input: val,
        output: res.formattedValue,
      };
    });
  }, [fromUnitId, toUnitId, activePreset, fromUnit, toUnit]);

  if (!fromUnit || !toUnit) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col gap-3 w-full mb-4">
        <div className="flex items-start gap-2.5 w-full">
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
            <Table className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              {fromUnit.name} to {toUnit.name} Conversion Table
            </h2>
            <p className="w-full text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Click or press Enter on any row to test value in calculator
            </p>
          </div>
        </div>

        {/* Preset segmented buttons */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs self-start">
          <button
            onClick={() => setActivePreset("standard")}
            className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              activePreset === "standard"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Standard (1–1000)
          </button>
          <button
            onClick={() => setActivePreset("small")}
            className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              activePreset === "small"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Fractions (0.1–10)
          </button>
          <button
            onClick={() => setActivePreset("large")}
            className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              activePreset === "large"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            High Scale (100–100k)
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table
          className="w-full text-left text-xs sm:text-sm"
          aria-label={`${fromUnit.name} to ${toUnit.name} conversion reference table`}
        >
          <caption className="sr-only">
            Reference conversion table showing common values in {fromUnit.plural} ({fromUnit.symbol}) and their equivalent in {toUnit.plural} ({toUnit.symbol})
          </caption>
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-2.5 px-4 font-semibold">{fromUnit.name} ({fromUnit.symbol})</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-right">{toUnit.name} ({toUnit.symbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono tabular-nums">
            {tableData.map((row) => (
              <tr
                key={row.input}
                tabIndex={onSelectValue ? 0 : undefined}
                onClick={() => {
                  onSelectValue?.(row.input);
                  if (typeof window !== "undefined") {
                    document
                      .getElementById("converter-tool-section")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                onKeyDown={(e) => {
                  if (onSelectValue && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelectValue(row.input);
                    if (typeof window !== "undefined") {
                      document
                        .getElementById("converter-tool-section")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }
                }}
                className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 focus-visible:outline-hidden focus-visible:bg-indigo-50/60 dark:focus-visible:bg-indigo-950/40 transition-colors ${
                  onSelectValue ? "cursor-pointer group" : ""
                }`}
              >
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                  {formatValue(row.input, "auto")}{" "}
                  <span className="text-slate-400 text-xs">{fromUnit.symbol}</span>
                </td>
                <td className="py-2.5 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="inline-flex items-center justify-end gap-2">
                    <span>
                      {row.output} <span className="text-slate-400 text-xs ml-1">{toUnit.symbol}</span>
                    </span>
                    {onSelectValue && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0D9488] dark:text-[#2DD4BF] border border-[#0D9488]/30 group-hover:bg-[#0D9488] group-hover:text-white transition-all shrink-0">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
