import { ExternalLink, BookCheck } from "lucide-react";
import {
  GLOBAL_TRUSTED_REFERENCES,
  getTrustedReferencesForCategory,
  getTrustedReferencesForPair,
  TrustedReference,
} from "@/lib/conversions/references";
import { ConversionPairInfo, Unit } from "@/lib/conversions/types";

interface TrustedSourcesSectionProps {
  categoryId?: string;
  categoryName?: string;
  pair?: ConversionPairInfo;
  fromUnit?: Unit;
  toUnit?: Unit;
  pageTopic?: string;
  customSubtitle?: string;
}

export default function TrustedSourcesSection({
  categoryId,
  categoryName,
  pair,
  fromUnit,
  toUnit,
}: TrustedSourcesSectionProps) {
  let references: TrustedReference[];

  if (pair && fromUnit && toUnit) {
    references = getTrustedReferencesForPair(pair, fromUnit, toUnit);
  } else if (categoryId && categoryName) {
    references = getTrustedReferencesForCategory(categoryId);
  } else {
    references = GLOBAL_TRUSTED_REFERENCES;
  }

  return (
    <section
      aria-labelledby="references-standards-heading"
      className="cv-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-3.5"
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#E6FAF8] dark:bg-teal-950/70 text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
            <BookCheck className="w-4 h-4" />
          </span>
          <h2
            id="references-standards-heading"
            className="text-xl sm:text-2xl font-extrabold text-[#16324F] dark:text-white tracking-tight"
          >
            References
          </h2>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
          NIST · BIPM · ISO
        </span>
      </div>

      {/* Clean, High-Visibility Numbered Citation List */}
      <ol className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm sm:text-[15px] text-slate-700 dark:text-slate-300">
        {references.map((ref, idx) => (
          <li
            key={`cite-${idx}`}
            id={`ref-${idx + 1}`}
            className="py-2.5 first:pt-0.5 last:pb-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 scroll-mt-24"
          >
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="font-mono font-extrabold text-[#0D9488] dark:text-[#2DD4BF] shrink-0">
                [{idx + 1}]
              </span>
              <div className="min-w-0 leading-relaxed">
                <span className="font-bold text-[#16324F] dark:text-white">
                  {ref.shortName} ({ref.standardCode})
                </span>
                <span className="text-slate-400 mx-1.5">·</span>
                <span className="text-slate-600 dark:text-slate-300">
                  {ref.documentTitle}
                </span>
              </div>
            </div>

            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline shrink-0 self-start sm:self-center"
            >
              <span>{ref.linkLabel || "Official Source"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
