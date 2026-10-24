"use client";

import { useState, useMemo } from "react";
import {
  Type,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  Sparkles,
  FileText,
} from "lucide-react";

type CaseMode =
  | "uppercase"
  | "lowercase"
  | "titlecase"
  | "sentencecase"
  | "capitalize"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase"
  | "constantcase"
  | "alternating"
  | "inverse";

interface CaseOption {
  id: CaseMode;
  label: string;
  sample: string;
  description: string;
}

const CASE_OPTIONS: CaseOption[] = [
  {
    id: "sentencecase",
    label: "Sentence case",
    sample: "The quick brown fox.",
    description: "Capitalizes the first letter of each sentence.",
  },
  {
    id: "lowercase",
    label: "lower case",
    sample: "the quick brown fox",
    description: "Converts all characters to lowercase.",
  },
  {
    id: "uppercase",
    label: "UPPER CASE",
    sample: "THE QUICK BROWN FOX",
    description: "Converts all characters to uppercase.",
  },
  {
    id: "capitalize",
    label: "Capitalized Case",
    sample: "The Quick Brown Fox",
    description: "Capitalizes the first letter of every word.",
  },
  {
    id: "titlecase",
    label: "Title Case (APA/Chicago)",
    sample: "The Quick Brown Fox Jumps Over the Lazy Dog",
    description: "Capitalizes major words while keeping minor articles lowercase.",
  },
  {
    id: "camelcase",
    label: "camelCase",
    sample: "theQuickBrownFox",
    description: "Joins words and capitalizes each subsequent word after the first.",
  },
  {
    id: "pascalcase",
    label: "PascalCase",
    sample: "TheQuickBrownFox",
    description: "Joins words and capitalizes the first letter of every word.",
  },
  {
    id: "snakecase",
    label: "snake_case",
    sample: "the_quick_brown_fox",
    description: "Lowercase words separated by underscores.",
  },
  {
    id: "kebabcase",
    label: "kebab-case",
    sample: "the-quick-brown-fox",
    description: "Lowercase words separated by hyphens (URL slug style).",
  },
  {
    id: "constantcase",
    label: "CONSTANT_CASE",
    sample: "THE_QUICK_BROWN_FOX",
    description: "Uppercase words separated by underscores.",
  },
  {
    id: "alternating",
    label: "aLtErNaTiNg cAsE",
    sample: "tHe qUiCk bRoWn fOx",
    description: "Alternates between lowercase and uppercase letters.",
  },
  {
    id: "inverse",
    label: "InVeRsE CaSe",
    sample: "tHE qUICK bROWN fOX",
    description: "Flips uppercase letters to lowercase and vice versa.",
  },
];

const MINOR_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "if",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "per",
  "so",
  "the",
  "to",
  "up",
  "via",
  "vs",
  "yet",
]);

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function transformCase(text: string, mode: CaseMode): string {
  if (!text) return "";
  switch (mode) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "capitalize":
      return text
        .toLowerCase()
        .replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
    case "sentencecase":
      return text
        .toLowerCase()
        .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());
    case "titlecase":
      return text
        .toLowerCase()
        .split(/(\s+)/)
        .map((token, idx, arr) => {
          if (/^\s+$/.test(token)) return token;
          const clean = token.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "");
          const isFirst = idx === 0;
          const isLast = idx === arr.length - 1;
          if (!isFirst && !isLast && MINOR_WORDS.has(clean)) {
            return token;
          }
          return token.replace(/[a-z]/i, (c) => c.toUpperCase());
        })
        .join("");
    case "camelcase": {
      const words = splitWords(text);
      return words
        .map((w, i) => {
          const lower = w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          if (!lower) return "";
          return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
    }
    case "pascalcase": {
      const words = splitWords(text);
      return words
        .map((w) => {
          const lower = w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          return lower ? lower.charAt(0).toUpperCase() + lower.slice(1) : "";
        })
        .join("");
    }
    case "snakecase": {
      const words = splitWords(text);
      return words
        .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
        .filter(Boolean)
        .join("_");
    }
    case "kebabcase": {
      const words = splitWords(text);
      return words
        .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
        .filter(Boolean)
        .join("-");
    }
    case "constantcase": {
      const words = splitWords(text);
      return words
        .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
        .filter(Boolean)
        .join("_");
    }
    case "alternating": {
      let toggle = false;
      return Array.from(text)
        .map((ch) => {
          if (/[a-zA-Z]/.test(ch)) {
            const out = toggle ? ch.toUpperCase() : ch.toLowerCase();
            toggle = !toggle;
            return out;
          }
          return ch;
        })
        .join("");
    }
    case "inverse":
      return Array.from(text)
        .map((ch) =>
          ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()
        )
        .join("");
    default:
      return text;
  }
}

export default function CaseConverterClient() {
  const [text, setText] = useState(
    "Convert text between Sentence case, UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case instantly."
  );
  const [activeMode, setActiveMode] = useState<CaseMode>("sentencecase");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    return { words, chars, charsNoSpaces, sentences, lines };
  }, [text]);

  const handleApplyCase = (mode: CaseMode) => {
    setActiveMode(mode);
    setText((prev) => transformCase(prev, mode));
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xs space-y-5">
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
                Interactive Text Case Converter
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste or type text below, then select any case transformation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                setText(
                  "Convert text between Sentence case, UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case instantly."
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 hover:border-[#0D9488] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sample</span>
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 hover:border-rose-500 hover:text-rose-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label htmlFor="case-converter-input" className="sr-only">
            Text to convert
          </label>
          <textarea
            id="case-converter-input"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-950 p-4 text-sm sm:text-base text-[#16324F] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] font-mono leading-relaxed"
          />
        </div>

        {/* Live Text Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.chars },
            { label: "No Spaces", value: stats.charsNoSpaces },
            { label: "Sentences", value: stats.sentences },
            { label: "Lines", value: stats.lines },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {stat.label}
              </span>
              <span className="text-sm font-extrabold font-mono text-[#16324F] dark:text-white">
                {stat.value.toLocaleString("en-US")}
              </span>
            </div>
          ))}
        </div>

        {/* Case Action Buttons */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Select Case Transformation</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {CASE_OPTIONS.map((opt) => {
              const isSelected = activeMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleApplyCase(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    isSelected
                      ? "border-[#0D9488] bg-[#0D9488]/8 dark:bg-[#0D9488]/20 text-[#16324F] dark:text-white shadow-2xs"
                      : "border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC]/70 dark:bg-slate-950/60 hover:border-[#0D9488] text-[#16324F] dark:text-slate-200"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">{opt.label}</div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {opt.sample}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reference Table of All 12 Formats */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-[#0D9488]" />
          <h2 className="text-base sm:text-lg font-extrabold text-[#16324F] dark:text-white">
            Simultaneous Preview Across All 12 Text Cases
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CASE_OPTIONS.map((opt) => {
            const preview = transformCase(
              text || "The quick brown fox jumps over the lazy dog",
              opt.id
            );
            return (
              <div
                key={opt.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950/60 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#16324F] dark:text-white">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {opt.description}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs font-mono text-[#0D9488] dark:text-[#2DD4BF] break-words line-clamp-2">
                  {preview}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
