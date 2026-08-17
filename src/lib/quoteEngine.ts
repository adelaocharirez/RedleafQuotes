// Project Details

export interface MaterialSection {
    materialId: string;
    materialName: string;
    materialIcon: string;

    //manual entry
    mainCost: number;
    caps: number;
    delivery: number;
    rebates: number;
}
//Consumables

export type FixedConsumable = 
    |"machineRental"
    |"gravelBase"
    |"drainPipe"
    |"landscapingFabric"
    |"rebarPinsDrillBits"
    |"adhesiveGlue";

export type MiscConsumableId = "misc1" | "misc2" | "misc3" | "misc4" | "misc5";

export interface ConsumableItem{
    id: FixedConsumable | MiscConsumableId;
    name: string;
    defaultCost: number;
    icon: string;
    enabled: boolean;
    isRenamable: boolean;


}

export const DEFAULT_CONSUMABLES: ConsumableItem[] = [
    {id: "machineRental", name: "Machine Rental", defaultCost: 0, icon: "🚜", enabled: false, isRenamable: false},
    {id: "gravelBase", name: "Gravel / Base", defaultCost: 0, icon: "🪨", enabled: false, isRenamable: false},
    {id: "drainPipe", name: "Drain Pipe", defaultCost: 0, icon: "🚰", enabled: false, isRenamable: false},
    {id: "landscapingFabric", name: "Landscape Fabric", defaultCost: 0, icon: "🧵", enabled: false, isRenamable: false },
    {id: "rebarPinsDrillBits", name: "Rebar / Pins / Drill Bits", defaultCost: 0, icon: "🔩", enabled: false, isRenamable: false },
    {id: "adhesiveGlue", name: "Adhesive / Glue", defaultCost: 0, icon: "🧴", enabled: false, isRenamable: false },
    {id: "misc1", name: "Misc Consumable 1", defaultCost: 0, icon: "➕", enabled: false, isRenamable: true },
    {id: "misc2", name: "Misc Consumable 2", defaultCost: 0, icon: "➕", enabled: false, isRenamable: true },
    {id: "misc3", name: "Misc Consumable 3", defaultCost: 0, icon: "➕", enabled: false, isRenamable: true },
    {id: "misc4", name: "Misc Consumable 4", defaultCost: 0, icon: "➕", enabled: false, isRenamable: true },
    {id: "misc5", name: "Misc Consumable 5", defaultCost: 0, icon: "➕", enabled: false, isRenamable: true },
]; 

//Accept Inputs

export interface QuoteInputs {
    lengthFt: number;
    heightFt: number;
    materialSection: MaterialSection;
    consumables: ConsumableItem[];
    estimatedHours: number;
    laborRatePerHour: number; // default 83
    overheadRatePerHour: number; // 26
    targetProfitMarginPercent: number; // 20%
}

//ouputs
export interface QuoteBreakdown {
  faceSqFt: number;
  totalMaterialCost: number;
  totalConsumablesCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalExpenses: number;   // break-even cost
  profitAmount: number;
  finalBidPrice: number;
  pricePerSqFt: number;    // maps to the "FACE SQFT" row in the sheet (final price ÷ sq ft)
}

export const DEFAULT_MARGIN_OPTIONS: number[] = [10, 15, 20, 25, 30];
//calculation

export function calculateQuote(inputs: QuoteInputs): QuoteBreakdown {
    const safeLength = Math.max(0, inputs.lengthFt);
    const safeHeight = Math.max(0, inputs.heightFt);
    const safeHours = Math.max(0, inputs.estimatedHours);

    const faceSqFt = safeLength * safeHeight;
    const { mainCost, caps, delivery, rebates } = inputs.materialSection;
    const totalMaterialCost = mainCost + caps + delivery + rebates;

    const totalConsumablesCost = inputs.consumables.filter((c) => c.enabled)
    .reduce((sum, c) => sum + c.defaultCost, 0);

    const totalLaborCost = safeHours * inputs.laborRatePerHour;
    const totalOverheadCost = safeHours * inputs.overheadRatePerHour;

    const totalExpenses = 
        totalMaterialCost + totalConsumablesCost + totalLaborCost + totalOverheadCost;
    
    //Markup, profit = cost x % 

    const clampedMarginPct = Math.max(0, inputs.targetProfitMarginPercent);
    const profitAmount = totalExpenses * (clampedMarginPct / 100);
    const finalBidPrice = totalExpenses + profitAmount;

    const pricePerSqFt = faceSqFt > 0 ? finalBidPrice / faceSqFt : 0;

    return {
        faceSqFt,
        totalMaterialCost,
        totalConsumablesCost,
        totalLaborCost,
        totalOverheadCost,
        totalExpenses,
        profitAmount,
        finalBidPrice,
        pricePerSqFt,
    };

}

//margin comparison

export interface MarginComparison{
    marginPercent: number;
    profitAmount: number;
    finalBidPrice: number;
    pricePerSqFt: number;
}

export function compareMargins(
  inputs: QuoteInputs,
  marginOptions: number[] = DEFAULT_MARGIN_OPTIONS
): MarginComparison[] {
  return marginOptions.map((marginPercent) => {
    const breakdown = calculateQuote({
      ...inputs,
      targetProfitMarginPercent: marginPercent,
    });
    return {
      marginPercent,
      profitAmount: breakdown.profitAmount,
      finalBidPrice: breakdown.finalBidPrice,
      pricePerSqFt: breakdown.pricePerSqFt,
    };
  });
}

export const DEFAULT_RATES = {
  laborRatePerHour: 83,
  overheadRatePerHour: 26,
  targetProfitMarginPercent: 20,
};



