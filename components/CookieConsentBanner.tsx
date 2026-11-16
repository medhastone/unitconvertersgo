"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export type CookieConsentStatus = "accepted" | "declined";

const CONSENT_STORAGE_KEY = "cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "consent" | "config" | "event" | "js",
      targetOrAction: string | Date,
      params?: Record<string, string | boolean | number>
    ) => void;
  }
}

function updateAnalyticsConsent(status: "granted" | "denied"): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: status,
    });
  } else {
    window.dataLayer.push(["consent", "update", { analytics_storage: status }]);
  }
}

function subscribeStorage(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredConsentSnapshot(): CookieConsentStatus | null {
  if (typeof window === "undefined") {
    return "declined";
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw === "accepted" || raw === "declined") {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

function getServerConsentSnapshot(): CookieConsentStatus | null {
  // Return non-null during SSR to avoid hydration mismatch before client check
  return "declined";
}

export default function CookieConsentBanner() {
  const storedConsent = useSyncExternalStore(
    subscribeStorage,
    getStoredConsentSnapshot,
    getServerConsentSnapshot
  );
  const [dismissedInSession, setDismissedInSession] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    if (storedConsent === "accepted") {
      updateAnalyticsConsent("granted");
    }
  }, [storedConsent]);

  useEffect(() => {
    if (storedConsent !== null || hasInteracted) return;
    const onInteract = () => setHasInteracted(true);
    const events = ["scroll", "pointerdown", "touchstart", "keydown", "mousemove"];
    for (const evt of events) {
      window.addEventListener(evt, onInteract, { passive: true, once: true });
    }
    return () => {
      for (const evt of events) {
        window.removeEventListener(evt, onInteract);
      }
    };
  }, [storedConsent, hasInteracted]);

  const handleAccept = (): void => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
    } catch {
      // Ignore storage write errors in restricted browsing modes
    }
    updateAnalyticsConsent("granted");
    setDismissedInSession(true);
  };

  const handleDecline = (): void => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "declined");
    } catch {
      // Ignore storage write errors in restricted browsing modes
    }
    setDismissedInSession(true);
  };

  if (storedConsent !== null || dismissedInSession || !hasInteracted) {
    return null;
  }

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto pointer-events-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl px-4 py-3.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/70 flex items-center justify-center text-[#0F766E] dark:text-[#2DD4BF] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-0.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="font-bold text-[#16324F] dark:text-white">
              We value your privacy
            </p>
            <p>
              We use analytics cookies only with your permission to understand
              how our unit converters are used and improve site performance. Read
              our{" "}
              <Link
                href="/privacy"
                prefetch={false}
                className="font-semibold text-[#0F766E] dark:text-[#2DD4BF] underline underline-offset-2 hover:text-[#115E59] transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[40px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 sm:flex-initial px-5 py-2.5 min-h-[40px] rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-xs sm:text-sm font-extrabold text-white shadow-xs transition-colors cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
