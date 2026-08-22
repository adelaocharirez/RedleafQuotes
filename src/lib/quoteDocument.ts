import { DEFAULT_CONSUMABLES, DEFAULT_RATES } from "./quoteEngine";
import type { QuoteInputs } from "./quoteEngine";

/**
 * Client / job details.
 *
 * Every field is optional except that `name` is what the export filename and
 * (later) the saved-quote list are labelled with, so the UI nudges toward it.
 */
export interface ClientInfo {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export const EMPTY_CLIENT: ClientInfo = {
  name: "",
  phone: "",
  address: "",
  notes: "",
};

/**
 * A complete, self-contained quote: who it's for, plus everything needed to
 * price it. This is the unit that gets saved.
 *
 * Deliberately self-contained so that "save/reopen quotes" later means storing
 * an array of these rather than reshaping anything. Don't add state that lives
 * outside this object.
 */
export interface QuoteDocument {
  /** Bumped whenever the shape changes. Old data is discarded, not guessed at. */
  version: number;
  /** Stable id, ready for the saved-quotes list. Unused for now. */
  id: string;
  createdAt: string;
  updatedAt: string;
  client: ClientInfo;
  inputs: QuoteInputs;
}

export const QUOTE_DOCUMENT_VERSION = 1;

/** Storage key. Versioned so a shape change can never collide with old data. */
export const DRAFT_STORAGE_KEY = "redleaf:draft:v1";

function newId(): string {
  return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyQuoteInputs(): QuoteInputs {
  return {
    lengthFt: 0,
    heightFt: 0,
    materialSection: {
      materialId: "",
      materialName: "",
      materialIcon: "",
      mainCost: 0,
      caps: 0,
      delivery: 0,
      rebates: 0,
    },
    // Fresh copy every time — DEFAULT_CONSUMABLES is a shared array and the
    // items inside it are mutable. Without this, editing one quote's
    // consumables would leak into the defaults for the next one.
    consumables: DEFAULT_CONSUMABLES.map((c) => ({ ...c })),
    estimatedHours: 0,
    laborRatePerHour: DEFAULT_RATES.laborRatePerHour,
    overheadRatePerHour: DEFAULT_RATES.overheadRatePerHour,
    targetProfitMarginPercent: DEFAULT_RATES.targetProfitMarginPercent,
  };
}

export function createQuoteDocument(
  overrides: Partial<Pick<QuoteInputs, "laborRatePerHour" | "overheadRatePerHour" | "targetProfitMarginPercent">> = {}
): QuoteDocument {
  const now = new Date().toISOString();
  return {
    version: QUOTE_DOCUMENT_VERSION,
    id: newId(),
    createdAt: now,
    updatedAt: now,
    client: { ...EMPTY_CLIENT },
    inputs: { ...emptyQuoteInputs(), ...overrides },
  };
}

/**
 * Validate anything read out of storage.
 *
 * Returns null for missing, corrupt, or old-version data — the caller then
 * starts fresh. Deliberately strict: a half-valid quote that silently loads
 * with some fields missing is worse than no quote at all, because it would
 * produce a wrong price rather than an obvious empty form.
 */
export function parseQuoteDocument(raw: unknown): QuoteDocument | null {
  if (typeof raw !== "object" || raw === null) return null;
  const doc = raw as Partial<QuoteDocument>;

  if (doc.version !== QUOTE_DOCUMENT_VERSION) return null;
  if (typeof doc.id !== "string") return null;

  const inputs = doc.inputs;
  if (typeof inputs !== "object" || inputs === null) return null;
  if (!Array.isArray(inputs.consumables)) return null;

  const numbers = [
    inputs.lengthFt,
    inputs.heightFt,
    inputs.estimatedHours,
    inputs.laborRatePerHour,
    inputs.overheadRatePerHour,
    inputs.targetProfitMarginPercent,
  ];
  if (!numbers.every((n) => typeof n === "number" && Number.isFinite(n))) {
    return null;
  }

  const material = inputs.materialSection;
  if (typeof material !== "object" || material === null) return null;
  const materialNumbers = [
    material.mainCost,
    material.caps,
    material.delivery,
    material.rebates,
  ];
  if (!materialNumbers.every((n) => typeof n === "number" && Number.isFinite(n))) {
    return null;
  }

  return {
    version: QUOTE_DOCUMENT_VERSION,
    id: doc.id,
    createdAt: typeof doc.createdAt === "string" ? doc.createdAt : new Date().toISOString(),
    updatedAt: typeof doc.updatedAt === "string" ? doc.updatedAt : new Date().toISOString(),
    client: { ...EMPTY_CLIENT, ...(doc.client ?? {}) },
    inputs: inputs as QuoteInputs,
  };
}

/** True when the user has entered nothing worth keeping. */
export function isQuoteEmpty(doc: QuoteDocument): boolean {
  const { inputs, client } = doc;
  return (
    inputs.lengthFt === 0 &&
    inputs.heightFt === 0 &&
    inputs.estimatedHours === 0 &&
    inputs.materialSection.materialId === "" &&
    inputs.materialSection.mainCost === 0 &&
    !inputs.consumables.some((c) => c.enabled) &&
    client.name.trim() === "" &&
    client.phone.trim() === "" &&
    client.address.trim() === "" &&
    client.notes.trim() === ""
  );
}

/**
 * Filename-safe label for exports.
 *
 * Excel sheet names additionally cap at 31 chars and reject : \ / ? * [ ],
 * so this strips those too and keeps the result short enough for either use.
 */
export function quoteLabel(doc: QuoteDocument): string {
  const base = doc.client.name.trim() || doc.inputs.materialSection.materialName.trim() || "Quote";
  const safe = base
    .replace(/[:\\/?*[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 31);
  return safe || "Quote";
}