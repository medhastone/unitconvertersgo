"use client";

import { useState, useMemo } from "react";
import { Grid, Copy, Check } from "lucide-react";
import { getUnitsByCategory, UNIT_MAP } from "@/lib/conversions/units";
import { convertUnits, formatValue } from "@/lib/conversions/engine";

interface CategoryMultiMatrixProps {
  categoryId: string;
}

export default function CategoryMultiMatrix({ categoryId }: CategoryMultiMatrixProps) {
  const units = useMemo(() => getUnitsByCategory(categoryId), [categoryId]);
  const defaultUnit = units[0]?.id || "";
  const [selectedUnitId, setSelectedUnitId] = useState(defaultUnit);
  const [inputValue, setInputValue] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedUnit = UNIT_MAP.get(selectedUnitId);

  const conversions = useMemo(() => {
    if (!selectedUnit) return [];

    return units.map((u) => {
      try {
        const res = convertUnits(inputValue, selectedUnitId, u.id, "auto");
        return {
          unit: u,
          value: res.formattedValue,
        };
      } catch {
        return {
          unit: u,
          value: "—",
        };
      }
    });
  }, [units, selectedUnitId, inputValue, selectedUnit]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (units.length === 0 || !selectedUnit) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Category Conversion Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Simultaneous comparison of {units.length} units in this category
            </p>
          </div>
        </div>

        {/* Input & Unit Selector */}
        <div suppressHydrationWarning className="flex items-center gap-2">
          <label htmlFor={`matrix-input-${categoryId}`} className="sr-only">
            Matrix comparison value
          </label>
          <input
            suppressHydrationWarning
            id={`matrix-input-${categoryId}`}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            aria-label="Enter value for simultaneous category matrix comparison"
            className="w-24 px-3 py-1.5 text-base font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <label htmlFor={`matrix-unit-${categoryId}`} className="sr-only">
            Matrix base unit
          </label>
          <select
            suppressHydrationWarning
            id={`matrix-unit-${categoryId}`}
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            aria-label="Select base unit for category conversion matrix"
            className="px-3 py-1.5 text-base rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {units.map((u) => (
              <option
                key={u.id}
                value={u.id}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
              >
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {conversions.map(({ unit, value }) => (
          <div
            key={unit.id}
            className={`p-3 rounded-lg border transition-colors flex items-center justify-between ${
              unit.id === selectedUnitId
                ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="min-w-0 pr-2">
              <div className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {unit.name} ({unit.symbol})
              </div>
              <div className="text-sm sm:text-base font-mono font-semibold text-slate-900 dark:text-white tabular-nums truncate">
                {value}
              </div>
            </div>
            <button
              onClick={() => handleCopy(value, unit.id)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              title="Copy result"
              aria-label={`Copy value for ${unit.name}`}
            >
              {copiedId === unit.id ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
