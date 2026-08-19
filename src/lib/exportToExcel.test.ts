import { describe, it, expect, afterAll } from "vitest";
import * as XLSX from "xlsx";
import { existsSync, unlinkSync } from "node:fs";
import { exportQuoteToExcel } from "./exportToExcel";
import { calculateQuote, DEFAULT_CONSUMABLES } from "./quoteEngine";
import type { QuoteInputs } from "./quoteEngine";

// Every fixed consumable enabled with a distinct cost, so a row that
// silently reads 0 (the landscapeFabric bug) cannot hide behind a zero.
const everythingOn: QuoteInputs = {
  lengthFt: 35,
  heightFt: 2,
  materialSection: {
    materialId: "retaining-blocks",
    materialName: "Retaining Blocks",
    materialIcon: "",
    mainCost: 800,
    caps: 120,
    delivery: 75,
    rebates: -250,
  },
  consumables: DEFAULT_CONSUMABLES.map((c, i) => ({
    ...c,
    enabled: true,
    defaultCost: (i + 1) * 10,
  })),
  estimatedHours: 8,
  laborRatePerHour: 83,
  overheadRatePerHour: 26,
  targetProfitMarginPercent: 20,
};

const OUT = "quote.xlsx";

function readBack(inputs: QuoteInputs) {
  exportQuoteToExcel(inputs, calculateQuote(inputs));
  const wb = XLSX.readFile(OUT);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1 });
}

function valueOf(rows: (string | number)[][], label: string): number {
  const row = rows.find((r) => r[0] === label);
  if (!row) throw new Error(`No row labelled "${label}" in the export`);
  return Number(row[1] ?? 0);
}

afterAll(() => {
  if (existsSync(OUT)) unlinkSync(OUT);
});

describe("exportToExcel — internal consistency", () => {
  const rows = readBack(everythingOn);

  it("writes every consumable's real cost, not zero", () => {
    // This is the assertion that fails on the landscapeFabric typo.
    for (const c of everythingOn.consumables.filter((x) => !x.isRenamable)) {
      const written = valueOf(rows, c.name);
      expect(written, `${c.id} exported as ${written}`).toBe(c.defaultCost);
    }
  });

  it("consumable rows sum to the Total Consumables row", () => {
    const start = rows.findIndex((r) => r[0] === "3. CONSUMABLES");
    const end = rows.findIndex((r) => r[0] === "Total Consumables");
    const summed = rows
      .slice(start + 1, end)
      .reduce((sum, r) => sum + Number(r[1] ?? 0), 0);
    expect(summed).toBe(valueOf(rows, "Total Consumables"));
  });

  it("material rows sum to the Total Materials row", () => {
    const parts = [
      "Main Block/Timber Cost",
      "Caps (if applicable)",
      "Delivery / Shipping",
      "Rebates (Enter as negative)",
    ].reduce((sum, label) => sum + valueOf(rows, label), 0);
    expect(parts).toBe(valueOf(rows, "Total Materials"));
  });

  it("final bid price equals expenses plus profit", () => {
    expect(valueOf(rows, "FINAL BID PRICE")).toBeCloseTo(
      valueOf(rows, "Total Expenses") + valueOf(rows, "Profit Margin (20%)"),
      6
    );
  });
});

describe("exportToExcel — layout matches the original spreadsheet", () => {
  const rows = readBack(everythingOn);

  it("keeps the three-column header", () => {
    expect(rows[0]).toEqual(["Description", "Value", "Notes & Instructions"]);
  });

  it("keeps the five numbered sections in order", () => {
    const sections = rows
      .map((r) => String(r[0] ?? ""))
      .filter((label) => /^\d\. /.test(label));
    expect(sections).toEqual([
      "1. PROJECT DETAILS",
      "2. MATERIALS",
      "3. CONSUMABLES",
      "4. LABOR & OVERHEAD",
      "5. FINAL PRICING",
    ]);
  });

  it("keeps all five misc consumable rows", () => {
    const misc = everythingOn.consumables.filter((c) => c.isRenamable);
    expect(misc).toHaveLength(5);
    for (const item of misc) {
      expect(rows.some((r) => r[0] === item.name)).toBe(true);
    }
  });
});
