import { useCallback, useEffect, useRef, useState } from "react";
import {
  DRAFT_STORAGE_KEY,
  createQuoteDocument,
  parseQuoteDocument,
  isQuoteEmpty,
} from "../lib/quoteDocument";
import type { ClientInfo, QuoteDocument } from "../lib/quoteDocument";
import { calculateQuote } from "../lib/quoteEngine";
import type {
  ConsumableItem,
  MaterialSection as MaterialSectionData,
  QuoteInputs,
} from "../lib/quoteEngine";
import { clearLocalStorage, readLocalStorage } from "./useLocalStorage";

/** How long to wait after the last keystroke before writing to storage. */
const SAVE_DEBOUNCE_MS = 400;

/**
 * Owns the entire quote: client details, inputs, persistence, and reset.
 *
 * App.tsx should hold no quote state of its own — everything lives here so
 * that saving, restoring, and resetting all operate on one object. When the
 * saved-quotes list gets built, it hooks in here (a `load(doc)` function)
 * rather than anywhere else.
 */
export function useQuoteForm() {
  const [doc, setDoc] = useState<QuoteDocument>(() => {
    const saved = parseQuoteDocument(readLocalStorage(DRAFT_STORAGE_KEY, null));
    return saved ?? createQuoteDocument();
  });

  // True only when a real draft came back from storage, so the UI can say so.
  const [restored, setRestored] = useState(() => {
    return parseQuoteDocument(readLocalStorage(DRAFT_STORAGE_KEY, null)) !== null;
  });

  // Debounced write. Steppers fire rapidly when held; writing on every tap
  // would serialize the whole document dozens of times a second.
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(doc));
      } catch (err) {
        console.warn("Could not save draft quote.", err);
      }
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer.current);
  }, [doc]);

  // Flush immediately if the app is backgrounded or closed — the debounce
  // window is exactly when someone swipes away, which is the case this
  // whole feature exists for.
  useEffect(() => {
    const flush = () => {
      if (document.visibilityState === "hidden") {
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(doc));
        } catch {
          /* storage unavailable; nothing more to do */
        }
      }
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flush);
    };
  }, [doc]);

  const patchInputs = useCallback((patch: Partial<QuoteInputs>) => {
    setRestored(false);
    setDoc((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      inputs: { ...prev.inputs, ...patch },
    }));
  }, []);

  const setClient = useCallback((patch: Partial<ClientInfo>) => {
    setRestored(false);
    setDoc((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      client: { ...prev.client, ...patch },
    }));
  }, []);

  /**
   * Clear back to a blank quote.
   *
   * Rates and margin carry over deliberately — they're settings, not job data,
   * and re-entering them on every quote would defeat the point.
   */
  const reset = useCallback(() => {
    setRestored(false);
    setDoc((prev) =>
      createQuoteDocument({
        laborRatePerHour: prev.inputs.laborRatePerHour,
        overheadRatePerHour: prev.inputs.overheadRatePerHour,
        targetProfitMarginPercent: prev.inputs.targetProfitMarginPercent,
      })
    );
    clearLocalStorage(DRAFT_STORAGE_KEY);
  }, []);

  const inputs = doc.inputs;

  // "Retaining wall · 35 × 2 ft · 70 sq ft" — orientation line under the title.
  const bits: string[] = [];
  if (inputs.materialSection.materialName) bits.push(inputs.materialSection.materialName);
  if (inputs.lengthFt > 0 && inputs.heightFt > 0) {
    bits.push(`${inputs.lengthFt} × ${inputs.heightFt} ft`);
  }

  return {
    summaryLine: bits.join("  ·  "),
    doc,
    client: doc.client,
    inputs,
    breakdown: calculateQuote(inputs),
    isEmpty: isQuoteEmpty(doc),
    restored,
    dismissRestored: useCallback(() => setRestored(false), []),

    setClient,
    reset,

    setLengthFt: useCallback((lengthFt: number) => patchInputs({ lengthFt }), [patchInputs]),
    setHeightFt: useCallback((heightFt: number) => patchInputs({ heightFt }), [patchInputs]),
    setMaterialSection: useCallback(
      (materialSection: MaterialSectionData) => patchInputs({ materialSection }),
      [patchInputs]
    ),
    setConsumables: useCallback(
      (consumables: ConsumableItem[]) => patchInputs({ consumables }),
      [patchInputs]
    ),
    setEstimatedHours: useCallback(
      (estimatedHours: number) => patchInputs({ estimatedHours }),
      [patchInputs]
    ),
    setLaborRatePerHour: useCallback(
      (laborRatePerHour: number) => patchInputs({ laborRatePerHour }),
      [patchInputs]
    ),
    setOverheadRatePerHour: useCallback(
      (overheadRatePerHour: number) => patchInputs({ overheadRatePerHour }),
      [patchInputs]
    ),
    setTargetProfitMarginPercent: useCallback(
      (targetProfitMarginPercent: number) => patchInputs({ targetProfitMarginPercent }),
      [patchInputs]
    ),
  };
}