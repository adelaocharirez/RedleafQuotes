import * as XLSX from "xlsx";
import type { QuoteInputs, QuoteBreakdown, FixedConsumable } from "./quoteEngine";

export function exportQuoteToExcel(
  inputs: QuoteInputs,
  breakdown: QuoteBreakdown,
  label = "Quote"
) {
  const misc = inputs.consumables.filter((c) => c.isRenamable);

  const findCost = (id: FixedConsumable) => {
    const item = inputs.consumables.find((c) => c.id === id);
    return item?.enabled ? item.defaultCost : 0;
  };

  const rows: (string | number)[][] = [
    ["Description", "Value", "Notes & Instructions"],

    ["1. PROJECT DETAILS", "", ""],
    ["Length (ft)", inputs.lengthFt, "Enter total length"],
    ["Height (ft)", inputs.heightFt, "Enter total height"],
    ["Total Sq Ft (Face Feet)", breakdown.faceSqFt, "Auto-calculates Sq Ft"],

    ["2. MATERIALS", "", ""],
    ["Main Block/Timber Cost", inputs.materialSection.mainCost, "Enter your base material cost"],
    ["Caps (if applicable)", inputs.materialSection.caps, "Enter cost for caps"],
    ["Delivery / Shipping", inputs.materialSection.delivery, "Enter delivery fees"],
    ["Rebates (Enter as negative)", inputs.materialSection.rebates, "Example: -250"],
    ["Total Materials", breakdown.totalMaterialCost, "Auto-calculates Materials"],

    ["3. CONSUMABLES", "", ""],
    ["Machine Rental", findCost("machineRental"), "Adjust if not renting a machine"],
    ["Gravel / Base", findCost("gravelBase"), "Enter gravel cost"],
    ["Drain Pipe", findCost("drainPipe"), "Enter drain pipe cost"],
    ["Landscape Fabric", findCost("landscapingFabric"), "Enter fabric cost"],
    ["Rebar / Pins / Drill Bits", findCost("rebarPinsDrillBits"), "Enter hardware cost"],
    ["Adhesive / Glue", findCost("adhesiveGlue"), "Enter glue cost"],
    ...misc.map((item): (string | number)[] => [
      item.name,
      item.enabled ? item.defaultCost : 0,
      "Rename as needed",
    ]),
    ["Total Consumables", breakdown.totalConsumablesCost, "Auto-calculates Consumables"],

    ["4. LABOR & OVERHEAD", "", ""],
    ["Estimated Hours", inputs.estimatedHours, "Enter total hours to complete"],
    ["Labor Rate ($/hr)", inputs.laborRatePerHour, "Standard rate for crew of 3"],
    ["Overhead Rate ($/hr)", inputs.overheadRatePerHour, "Standard overhead rate"],
    ["Total Labor Cost", breakdown.totalLaborCost, "Auto-calculates Labor"],
    ["Total Overhead Cost", breakdown.totalOverheadCost, "Auto-calculates Overhead"],
    [
      "Total Labor & Overhead",
      breakdown.totalLaborCost + breakdown.totalOverheadCost,
      "Auto-calculates Labor + OH",
    ],

    ["5. FINAL PRICING", "", ""],
    ["Total Expenses", breakdown.totalExpenses, "Auto-calculates your break-even"],
    [
      `Profit Margin (${inputs.targetProfitMarginPercent}%)`,
      breakdown.profitAmount,
      `Auto-calculates your ${inputs.targetProfitMarginPercent}% cut`,
    ],
    ["FINAL BID PRICE", breakdown.finalBidPrice, "Auto-calculates price for client"],
    ["FACE SQFT", breakdown.pricePerSqFt, "F-SQFT"],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 28 }, { wch: 12 }, { wch: 32 }];

  const workbook = XLSX.utils.book_new();
  // label is already stripped of characters Excel rejects in sheet names and
  // truncated to the 31-char limit (see quoteLabel).
  XLSX.utils.book_append_sheet(workbook, worksheet, label);

  XLSX.writeFile(workbook, `${label}.xlsx`);
}