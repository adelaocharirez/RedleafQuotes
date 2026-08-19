import { describe, it, expect } from "vitest";
import {
  calculateQuote,
  compareMargins,
  DEFAULT_CONSUMABLES,
  DEFAULT_RATES,
} from "./quoteEngine";
import type { ConsumableItem, QuoteInputs } from "./quoteEngine";

function consumables(
  overrides: Partial<Record<string, { cost: number; name?: string }>>
): ConsumableItem[] {
  return DEFAULT_CONSUMABLES.map((item) => {
    const override = overrides[item.id];
    if (!override) return { ...item };
    return {
      ...item,
      enabled: true,
      defaultCost: override.cost,
      name: override.name ?? item.name,
    };
  });
}

// Real historical quote, hand-verified against the original Excel file.
// Do not change these numbers without re-verifying against that file.
const adrian: QuoteInputs = {
  lengthFt: 35,
  heightFt: 2,
  materialSection: {
    materialId: "retaining-blocks",
    materialName: "Retaining Blocks",
    materialIcon: "",
    mainCost: 800,
    caps: 0,
    delivery: 0,
    rebates: 0,
  },
  consumables: consumables({
    gravelBase: { cost: 40 },
    adhesiveGlue: { cost: 20 },
    misc1: { cost: 60, name: "Dump" },
  }),
  estimatedHours: 8,
  laborRatePerHour: 83,
  overheadRatePerHour: 26,
  targetProfitMarginPercent: 20,
};

describe("calculateQuote — Adrian / Material 1 (verified fixture)", () => {
  const result = calculateQuote(adrian);

  it("computes face square footage", () => {
    expect(result.faceSqFt).toBe(70);
  });

  it("computes material and consumable totals", () => {
    expect(result.totalMaterialCost).toBe(800);
    expect(result.totalConsumablesCost).toBe(120);
  });

  it("computes labor and overhead", () => {
    expect(result.totalLaborCost).toBe(664);
    expect(result.totalOverheadCost).toBe(208);
  });

  it("computes break-even expenses", () => {
    expect(result.totalExpenses).toBe(1792);
  });

  // toBeCloseTo, not toBe: these land on float artifacts
  // (358.40000000000003 and 30.720000000000002) in IEEE-754.
  it("computes profit and final bid price", () => {
    expect(result.profitAmount).toBeCloseTo(358.4, 2);
    expect(result.finalBidPrice).toBeCloseTo(2150.4, 2);
  });

  it("computes price per square foot", () => {
    expect(result.pricePerSqFt).toBeCloseTo(30.72, 2);
  });
});

describe("profit is markup on cost, not margin on final price", () => {
  it("applies the percentage to expenses", () => {
    // Guards the convention directly. Margin-on-final-price would
    // give 2240.00 here, not 2150.40.
    const { finalBidPrice } = calculateQuote(adrian);
    expect(finalBidPrice).toBeCloseTo(1792 * 1.2, 2);
    expect(finalBidPrice).not.toBeCloseTo(1792 / 0.8, 2);
  });
});

describe("rebates", () => {
  it("reduces material cost when entered as a negative number", () => {
    const withRebate = calculateQuote({
      ...adrian,
      materialSection: { ...adrian.materialSection, rebates: -250 },
    });
    expect(withRebate.totalMaterialCost).toBe(550);
  });

  it("inflates the bid when entered positive — the sign-entry hazard", () => {
    const wrongSign = calculateQuote({
      ...adrian,
      materialSection: { ...adrian.materialSection, rebates: 250 },
    });
    expect(wrongSign.totalMaterialCost).toBe(1050);
  });
});

describe("edge cases", () => {
  it("returns zero price per sq ft rather than Infinity at zero area", () => {
    const empty = calculateQuote({ ...adrian, lengthFt: 0, heightFt: 0 });
    expect(empty.pricePerSqFt).toBe(0);
    expect(Number.isFinite(empty.pricePerSqFt)).toBe(true);
  });

  it("clamps negative dimensions and hours to zero", () => {
    const negative = calculateQuote({
      ...adrian,
      lengthFt: -35,
      estimatedHours: -8,
    });
    expect(negative.faceSqFt).toBe(0);
    expect(negative.totalLaborCost).toBe(0);
    expect(negative.totalOverheadCost).toBe(0);
  });

  it("ignores disabled consumables", () => {
    const allOff = calculateQuote({
      ...adrian,
      consumables: DEFAULT_CONSUMABLES.map((c) => ({ ...c, defaultCost: 999 })),
    });
    expect(allOff.totalConsumablesCost).toBe(0);
  });
});

describe("compareMargins", () => {
  it("returns one row per option, agreeing with calculateQuote", () => {
    const rows = compareMargins(adrian);
    expect(rows).toHaveLength(5);
    for (const row of rows) {
      const direct = calculateQuote({
        ...adrian,
        targetProfitMarginPercent: row.marginPercent,
      });
      expect(row.finalBidPrice).toBeCloseTo(direct.finalBidPrice, 6);
    }
  });

  it("prices increase with margin", () => {
    const prices = compareMargins(adrian).map((r) => r.finalBidPrice);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});

describe("defaults", () => {
  it("exports the rates the UI depends on", () => {
    expect(DEFAULT_RATES.laborRatePerHour).toBe(83);
    expect(DEFAULT_RATES.overheadRatePerHour).toBe(26);
    expect(DEFAULT_RATES.targetProfitMarginPercent).toBe(20);
  });

  it("ships 6 fixed consumables and 5 renamable, all off by default", () => {
    expect(DEFAULT_CONSUMABLES.filter((c) => !c.isRenamable)).toHaveLength(6);
    expect(DEFAULT_CONSUMABLES.filter((c) => c.isRenamable)).toHaveLength(5);
    expect(DEFAULT_CONSUMABLES.every((c) => !c.enabled)).toBe(true);
  });

  it("has unique consumable ids", () => {
    const ids = DEFAULT_CONSUMABLES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});