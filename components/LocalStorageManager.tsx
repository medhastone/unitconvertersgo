"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, CheckCircle2, HardDrive, RefreshCw } from "lucide-react";

interface StorageSummary {
  theme: string | null;
  recentCount: number;
  favoriteCount: number;
}

function getStorageSnapshot(): StorageSummary {
  if (typeof window === "undefined") {
    return { theme: null, recentCount: 0, favoriteCount: 0 };
  }
  try {
    const themeVal =
      localStorage.getItem("ucg-theme") || localStorage.getItem("theme");
    const recentRaw = localStorage.getItem("ucg_recent_conversions");
    const favRaw = localStorage.getItem("ucg_favorite_conversions");

    let recentCount = 0;
    let favoriteCount = 0;

    if (recentRaw) {
      const parsed = JSON.parse(recentRaw);
      if (Array.isArray(parsed)) recentCount = parsed.length;
    }
    if (favRaw) {
      const parsed = JSON.parse(favRaw);
      if (Array.isArray(parsed)) favoriteCount = parsed.length;
    }

    return {
      theme: themeVal,
      recentCount,
      favoriteCount,
    };
  } catch {
    return { theme: null, recentCount: 0, favoriteCount: 0 };
  }
}

const INITIAL_STORAGE_SUMMARY: StorageSummary = {
  theme: null,
  recentCount: 0,
  favoriteCount: 0,
};

export default function LocalStorageManager() {
  const [summary, setSummary] = useState<StorageSummary>(
    INITIAL_STORAGE_SUMMARY
  );
  const [clearedNotice, setClearedNotice] = useState(false);

  const readStorageState = useCallback(() => {
    setSummary(getStorageSnapshot());
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setSummary(getStorageSnapshot());
    });
    window.addEventListener("storage", readStorageState);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("storage", readStorageState);
    };
  }, [readStorageState]);

  const handleClearConversionStorage = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("ucg_recent_conversions");
      localStorage.removeItem("ucg_favorite_conversions");
      readStorageState();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 4000);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
          <h3 className="text-sm font-bold text-[#16324F] dark:text-white">
            Your Current Browser Storage Status (This Device Only)
          </h3>
        </div>
        <button
          type="button"
          onClick={readStorageState}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0D9488] dark:text-slate-400 dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        The values below are read directly from your browser&apos;s{" "}
        <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          localStorage
        </code>
        . This data never leaves your device and is never sent to our servers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <div className="text-slate-400 font-mono text-[11px]">theme</div>
          <div className="font-bold text-[#16324F] dark:text-white mt-0.5">
            {summary.theme ? `${summary.theme} mode` : "System default (not set)"}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <div className="text-slate-400 font-mono text-[11px]">
            ucg_recent_conversions
          </div>
          <div className="font-bold text-[#16324F] dark:text-white mt-0.5">
            {summary.recentCount} saved{" "}
            {summary.recentCount === 1 ? "calculation" : "calculations"}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <div className="text-slate-400 font-mono text-[11px]">
            ucg_favorite_conversions
          </div>
          <div className="font-bold text-[#16324F] dark:text-white mt-0.5">
            {summary.favoriteCount} bookmarked{" "}
            {summary.favoriteCount === 1 ? "pair" : "pairs"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handleClearConversionStorage}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#16324F] hover:bg-[#0D9488] dark:bg-[#0D9488] dark:hover:bg-[#0F766E] text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Saved History &amp; Bookmarks</span>
        </button>

        {clearedNotice && (
          <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Local conversion history and bookmarks cleared.</span>
          </span>
        )}
      </div>
    </div>
  );
}
