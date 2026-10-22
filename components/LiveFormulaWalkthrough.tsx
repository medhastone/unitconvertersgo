"use client";

import { ConversionOutput } from "@/lib/conversions/types";
import { Calculator } from "lucide-react";

interface LiveFormulaWalkthroughProps {
  output: ConversionOutput;
  inputValue: number;
}

export default function LiveFormulaWalkthrough({
  output,
  inputValue,
}: LiveFormulaWalkthroughProps) {
  const { fromUnit, toUnit, formulaDisplay, steps, formattedValue } = output;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Live Formula &amp; Calculation Walkthrough
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time step-by-step arithmetic substitution
          </p>
        </div>
      </div>

      {/* Primary Mathematical Formula */}
      <div className="mb-4 rounded-lg bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/80 dark:border-slate-800">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
          Governing Conversion Equation
        </div>
        <div className="text-base sm:text-lg font-mono font-semibold text-slate-900 dark:text-emerald-400">
          {formulaDisplay}
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between p-3 rounded-md bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-xs gap-2"
          >
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Step {idx + 1}: {step.label}
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                {step.explanation}
              </p>
            </div>
            <div className="font-mono font-medium text-slate-900 dark:text-slate-100 sm:text-right shrink-0 bg-white dark:bg-slate-900 px-2 py-1 rounded-sm border border-slate-200 dark:border-slate-700">
              {step.expression}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Result Statement */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <span>
          Summary: <strong className="text-slate-900 dark:text-white font-mono">{inputValue} {fromUnit.symbol}</strong> equals exactly{" "}
          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formattedValue} {toUnit.symbol}</strong>.
        </span>
      </div>
    </div>
  );
}
