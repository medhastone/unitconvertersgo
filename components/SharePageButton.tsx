"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Share2,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Send,
  Globe,
  ExternalLink,
  X,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export interface SharePageButtonProps {
  /** Visual variant: 'icon' for compact navbar button, 'button' for inline toolbars */
  variant?: "icon" | "button";
  /** Optional custom title override for the shared tool page */
  customTitle?: string;
  /** Optional custom path or full URL override */
  customPath?: string;
  /** Optional label for the 'button' variant */
  label?: string;
}

export default function SharePageButton({
  variant = "icon",
  customTitle,
  customPath,
  label = "Share",
}: SharePageButtonProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedPath = customPath || pathname || "/";
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_CONFIG.baseUrl;
  const pageUrl = resolvedPath.startsWith("http")
    ? resolvedPath
    : `${origin}${resolvedPath.startsWith("/") ? resolvedPath : `/${resolvedPath}`}`;

  const pageTitle =
    customTitle ||
    (typeof document !== "undefined" && document.title
      ? document.title
      : SITE_CONFIG.homepageTitle);

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = pageUrl;
      textarea.setAttribute("readonly", "");
      textarea.className = "sr-only";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: pageTitle,
          text: `${pageTitle} — Free instant unit calculator on UnitConvertersGo`,
          url: pageUrl,
        });
        setIsOpen(false);
      } catch {
        // User cancelled native share sheet
      }
    }
  };

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(pageTitle);
  const encodedText = encodeURIComponent(`${pageTitle} — ${pageUrl}`);

  const shareTargets = [
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
      icon: <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <Share2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
      icon: <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
    },
  ];

  return (
    <div ref={containerRef} className="relative inline-block">
      {variant === "icon" ? (
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Share this page"
          title="Share this tool page"
          className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 text-[#16324F] dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer shrink-0"
        >
          <Share2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          title="Share this tool page"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 hover:bg-[#E6FAF8] dark:hover:bg-teal-950/60 border border-slate-200/90 dark:border-slate-700 hover:border-[#0D9488] text-xs sm:text-sm font-extrabold text-[#16324F] dark:text-teal-300 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
          <span>{label}</span>
        </button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label="Share this tool page"
          className="absolute right-0 mt-2 w-[300px] sm:w-[340px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-3.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488] dark:text-[#2DD4BF]">
                Share Tool Page
              </p>
              <p className="text-xs font-bold text-[#16324F] dark:text-white truncate mt-0.5">
                {pageTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close share menu"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Copy Direct URL Bar */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
            <input
              type="text"
              readOnly
              value={pageUrl}
              aria-label="Page URL to share"
              onFocus={(e) => e.currentTarget.select()}
              className="w-full min-w-0 bg-transparent px-2 py-1 text-xs font-mono text-slate-600 dark:text-slate-300 focus:outline-hidden truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
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

          {/* Direct Social & Messaging Share Grid */}
          <div className="grid grid-cols-2 gap-2">
            {shareTargets.map((target) => (
              <a
                key={target.name}
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 text-xs font-bold text-[#16324F] dark:text-slate-200 transition-colors"
              >
                {target.icon}
                <span className="truncate">{target.name}</span>
              </a>
            ))}
          </div>

          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-[#16324F] dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
              <span>More Device Share Options</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
