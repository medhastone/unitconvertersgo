"use client";

import { useState, useEffect, useRef } from "react";
import { CATEGORIES, getUnitsByCategory } from "@/lib/conversions/units";

const CURATED_NATURAL_PROMPTS: string[] = [
  "convert volt to watt",
  "convert 100 psi to bar",
  "convert 25 celsius to fahrenheit",
  "convert 50 kg to pounds",
  "convert kilowatts to horsepower",
  "convert meters to feet",
  "convert newton meter to foot-pound",
  "convert millisievert to rem",
  "convert lux to foot-candles",
  "convert tesla to gauss",
  "convert dynamic viscosity poise to Pa·s",
  "convert thermal conductivity W/(m·K) to BTU",
  "convert molarity mol/L to mmol/L",
  "convert gigabytes to terabytes",
  "convert fuel economy mpg to L/100km",
  "convert angular velocity rpm to rad/s",
  "convert electric charge coulomb to Ah",
  "convert inductance henry to millihenry",
  "convert sound decibels dB to bel",
  "convert typography px to rem",
  "case converter camelCase to snake_case",
];

function buildCompletePromptPool(): string[] {
  const seen = new Set<string>();
  const pool: string[] = [];

  const addPrompt = (text: string) => {
    const key = text.trim().toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    pool.push(text.trim());
  };

  for (const p of CURATED_NATURAL_PROMPTS) {
    addPrompt(p);
  }

  // Include every single one of the 78 measurement categories with real unit pairs
  for (const cat of CATEGORIES) {
    const units = getUnitsByCategory(cat.id);
    if (units.length >= 2) {
      const u1 = units[0].name.toLowerCase();
      const u2 = units[1].name.toLowerCase();
      addPrompt(`convert ${u1} to ${u2} (${cat.name})`);
    } else {
      addPrompt(`${cat.name.toLowerCase()} converter`);
    }
  }

  return pool;
}

const MASTER_PROMPT_POOL = buildCompletePromptPool();

/**
 * Fisher-Yates shuffle that prevents the first item of a new cycle
 * from ever matching `lastShownPrompt` (strictly non-repeating).
 */
function shuffleNonRepeating(
  items: string[],
  lastShownPrompt: string | null,
  keepFirstPromptOnInitialCycle: boolean
): string[] {
  const copy = [...items];
  const startIndex = keepFirstPromptOnInitialCycle ? 1 : 0;

  for (let i = copy.length - 1; i > startIndex; i--) {
    const j =
      startIndex + Math.floor(Math.random() * (i - startIndex + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  if (
    lastShownPrompt &&
    copy.length > 1 &&
    copy[0].toLowerCase() === lastShownPrompt.toLowerCase()
  ) {
    const swapIdx = 1 + Math.floor(Math.random() * (copy.length - 1));
    const tmp = copy[0];
    copy[0] = copy[swapIdx];
    copy[swapIdx] = tmp;
  }

  return copy;
}

export interface UseTypewriterPlaceholderOptions {
  isPaused?: boolean;
  prefix?: string;
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  holdDurationMs?: number;
}

export interface TypewriterPlaceholderResult {
  placeholder: string;
  currentFullPrompt: string;
}

export function useTypewriterPlaceholder({
  isPaused = false,
  prefix = "Try: ",
  typingSpeedMs = 45,
  deletingSpeedMs = 22,
  holdDurationMs = 1900,
}: UseTypewriterPlaceholderOptions = {}): TypewriterPlaceholderResult {
  const deckRef = useRef<string[]>([]);
  const deckIndexRef = useRef<number>(0);
  const lastShownRef = useRef<string | null>(null);
  const isFirstCycleRef = useRef<boolean>(true);

  const [currentFullPrompt, setCurrentFullPrompt] = useState<string>(
    MASTER_PROMPT_POOL[0] || "convert volt to watt"
  );
  const [typedText, setTypedText] = useState<string>(
    MASTER_PROMPT_POOL[0] || "convert volt to watt"
  );
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "holding"
  );

  // Initialize shuffled deck on client mount without redundant state updates
  useEffect(() => {
    const initialDeck = shuffleNonRepeating(
      MASTER_PROMPT_POOL,
      null,
      true // Ensure "convert volt to watt" leads first before cycling through shuffled non-repeating pool
    );
    deckRef.current = initialDeck;
    deckIndexRef.current = 0;
    isFirstCycleRef.current = false;
    const first = initialDeck[0] || "convert volt to watt";
    lastShownRef.current = first;
  }, []);

  useEffect(() => {
    if (isPaused) return;
    if (typeof document !== "undefined" && document.hidden) return;

    // Respect prefers-reduced-motion by rotating whole prompts without rapid character flicker
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        let nextIndex = deckIndexRef.current + 1;
        if (nextIndex >= deckRef.current.length) {
          deckRef.current = shuffleNonRepeating(
            MASTER_PROMPT_POOL,
            lastShownRef.current,
            false
          );
          nextIndex = 0;
        }
        deckIndexRef.current = nextIndex;
        const nextPrompt = deckRef.current[nextIndex];
        lastShownRef.current = nextPrompt;
        setCurrentFullPrompt(nextPrompt);
        setTypedText(nextPrompt);
      }, 3200);
      return () => clearTimeout(timer);
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (typedText.length < currentFullPrompt.length) {
        timeoutId = setTimeout(() => {
          setTypedText(currentFullPrompt.slice(0, typedText.length + 1));
        }, typingSpeedMs);
      } else {
        timeoutId = setTimeout(() => {
          setPhase("holding");
        }, holdDurationMs);
      }
    } else if (phase === "holding") {
      timeoutId = setTimeout(() => {
        setPhase("deleting");
      }, holdDurationMs);
    } else if (phase === "deleting") {
      if (typedText.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedText(currentFullPrompt.slice(0, typedText.length - 1));
        }, deletingSpeedMs);
      } else {
        // Advance to next non-repeating prompt in deck
        let nextIndex = deckIndexRef.current + 1;
        if (nextIndex >= deckRef.current.length) {
          deckRef.current = shuffleNonRepeating(
            MASTER_PROMPT_POOL,
            lastShownRef.current,
            false
          );
          nextIndex = 0;
        }
        deckIndexRef.current = nextIndex;
        const nextPrompt =
          deckRef.current[nextIndex] || MASTER_PROMPT_POOL[0];
        lastShownRef.current = nextPrompt;
        setCurrentFullPrompt(nextPrompt);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeoutId);
  }, [
    isPaused,
    phase,
    typedText,
    currentFullPrompt,
    typingSpeedMs,
    deletingSpeedMs,
    holdDurationMs,
  ]);

  const cursor = !isPaused && phase !== "holding" ? "|" : "";
  const placeholder = `${prefix}"${typedText}${cursor}"`;

  return {
    placeholder,
    currentFullPrompt,
  };
}
