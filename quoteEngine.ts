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
    |"landscaping"
    |"rebarPinsDrillBits"
    |"adhesiveGlue";

export type MiscConsumableId = "misc1" | "misc2" | "misc3" | "misc4" | "misc5";

export interface ConsumableItem{
    id: FixedConsumable | MiscConsumableId;
    name: string;
    defaultCost: number;
    icon: string;
    enabled: boolean;


}

