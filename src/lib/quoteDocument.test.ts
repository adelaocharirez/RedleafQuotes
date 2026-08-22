import { describe, it, expect } from "vitest";
import {
  createQuoteDocument,
  parseQuoteDocument,
  emptyQuoteInputs,
  isQuoteEmpty,
  quoteLabel,
  QUOTE_DOCUMENT_VERSION,
} from "./quoteDocument";
import { calculateQuote } from "./quoteEngine";

describe("createQuoteDocument", () => {
  it("starts blank and priced at zero", () => {
    const doc = createQuoteDocument();
    expect(isQuoteEmpty(doc)).toBe(true);
    expect(calculateQuote(doc.inputs).finalBidPrice).toBe(0);
  });

  it("carries over rates when asked", () => {
    const doc = createQuoteDocument({
      laborRatePerHour: 95,
      targetProfitMarginPercent: 30,
    });
    expect(doc.inputs.laborRatePerHour).toBe(95);
    expect(doc.inputs.targetProfitMarginPercent).toBe(30);
    expect(doc.inputs.overheadRatePerHour).toBe(26);
  });

  it("gives each document a distinct id", () => {
    const ids = new Set(Array.from({ length: 50 }, () => createQuoteDocument().id));
    expect(ids.size).toBe(50);
  });

  it("does not share consumable objects between documents", () => {
    // Guards a real hazard: DEFAULT_CONSUMABLES is a module-level array, so a
    // shallow copy would let one quote's edits leak into the next one.
    const a = createQuoteDocument();
    const b = createQuoteDocument();
    a.inputs.consumables[0].defaultCost = 999;
    a.inputs.consumables[0].enabled = true;
    expect(b.inputs.consumables[0].defaultCost).toBe(0);
    expect(b.inputs.consumables[0].enabled).toBe(false);
    expect(emptyQuoteInputs().consumables[0].defaultCost).toBe(0);
  });
});

describe("parseQuoteDocument — rejects anything it can't trust", () => {
  const good = createQuoteDocument();

  it("round-trips a valid document through JSON", () => {
    const parsed = parseQuoteDocument(JSON.parse(JSON.stringify(good)));
    expect(parsed).not.toBeNull();
    expect(parsed!.id).toBe(good.id);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "not a quote"],
    ["a number", 42],
    ["an empty object", {}],
    ["an array", []],
  ])("rejects %s", (_label, value) => {
    expect(parseQuoteDocument(value)).toBeNull();
  });

  it("rejects a future or past version rather than guessing", () => {
    expect(parseQuoteDocument({ ...good, version: QUOTE_DOCUMENT_VERSION + 1 })).toBeNull();
    expect(parseQuoteDocument({ ...good, version: 0 })).toBeNull();
  });

  it("rejects missing inputs", () => {
    const { inputs: _omit, ...rest } = good;
    expect(parseQuoteDocument(rest)).toBeNull();
  });

  it("rejects NaN or non-numeric fields that would poison the total", () => {
    expect(
      parseQuoteDocument({ ...good, inputs: { ...good.inputs, lengthFt: NaN } })
    ).toBeNull();
    expect(
      parseQuoteDocument({ ...good, inputs: { ...good.inputs, estimatedHours: "8" } })
    ).toBeNull();
    expect(
      parseQuoteDocument({
        ...good,
        inputs: {
          ...good.inputs,
          materialSection: { ...good.inputs.materialSection, mainCost: NaN },
        },
      })
    ).toBeNull();
  });

  it("rejects consumables that aren't an array", () => {
    expect(
      parseQuoteDocument({ ...good, inputs: { ...good.inputs, consumables: {} } })
    ).toBeNull();
  });

  it("fills in missing client fields rather than failing", () => {
    const parsed = parseQuoteDocument({ ...good, client: { name: "Adrian" } });
    expect(parsed).not.toBeNull();
    expect(parsed!.client.name).toBe("Adrian");
    expect(parsed!.client.phone).toBe("");
  });

  it("never returns a document that would produce NaN", () => {
    const parsed = parseQuoteDocument(JSON.parse(JSON.stringify(good)));
    const total = calculateQuote(parsed!.inputs).finalBidPrice;
    expect(Number.isFinite(total)).toBe(true);
  });
});

describe("isQuoteEmpty", () => {
  it("is false once any job data is entered", () => {
    const doc = createQuoteDocument();
    expect(isQuoteEmpty({ ...doc, inputs: { ...doc.inputs, lengthFt: 35 } })).toBe(false);
    expect(isQuoteEmpty({ ...doc, client: { ...doc.client, name: "Adrian" } })).toBe(false);
  });

  it("stays true when only rates differ from default", () => {
    // Rates are settings, not job data — a quote with custom rates and
    // nothing else is still blank, so "New Quote" shouldn't offer to clear it.
    const doc = createQuoteDocument({ laborRatePerHour: 95 });
    expect(isQuoteEmpty(doc)).toBe(true);
  });
});

describe("quoteLabel", () => {
  it("prefers the client name", () => {
    const doc = createQuoteDocument();
    doc.client.name = "Adrian";
    expect(quoteLabel(doc)).toBe("Adrian");
  });

  it("falls back to material, then to Quote", () => {
    const doc = createQuoteDocument();
    doc.inputs.materialSection.materialName = "Retaining Blocks";
    expect(quoteLabel(doc)).toBe("Retaining Blocks");
    doc.inputs.materialSection.materialName = "";
    expect(quoteLabel(doc)).toBe("Quote");
  });

  it("strips characters Excel rejects in sheet names", () => {
    const doc = createQuoteDocument();
    doc.client.name = "Adrian: 12/4 [rear]?";
    const label = quoteLabel(doc);
    expect(label).not.toMatch(/[:\\/?*[\]]/);
  });

  it("stays within Excel's 31-character sheet name limit", () => {
    const doc = createQuoteDocument();
    doc.client.name = "A".repeat(80);
    expect(quoteLabel(doc).length).toBeLessThanOrEqual(31);
  });

  it("never returns an empty string", () => {
    const doc = createQuoteDocument();
    doc.client.name = "///";
    expect(quoteLabel(doc).length).toBeGreaterThan(0);
  });
});