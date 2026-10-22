"use client";

import { SITE_CONFIG } from "@/lib/config";

interface AdSlotProps {
  slot: "topBanner" | "sidebarBox" | "inContent";
  className?: string;
}

/**
 * AdSlot Component
 * Google AdSense integration readiness component.
 * By default, SITE_CONFIG.adsense.enabled is false.
 * Renders cleanly with zero layout shift (CLS).
 */
export default function AdSlot({ slot, className = "" }: AdSlotProps) {
  const isEnabled = SITE_CONFIG.adsense.enabled && !!SITE_CONFIG.adsense.publisherId;

  if (!isEnabled) {
    // Hidden or quiet container to ensure zero CLS and no broken layout
    return null;
  }

  const slotId = SITE_CONFIG.adsense.slots[slot];

  return (
    <div
      className={`my-6 flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 py-3 text-center ${className}`}
      aria-label="Advertisement"
    >
      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-2">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={SITE_CONFIG.adsense.publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
