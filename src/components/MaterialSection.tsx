import { MaterialCard } from "./MaterialCard";
import { CostInput } from "./CostInput";
import type { MaterialSection as MaterialSectionData } from "../lib/quoteEngine";

interface MaterialOption {
  id: string;
  name: string;
  icon: string;
}

const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "green-timber", name: "Green Timber", icon: "🪵" },
  { id: "railroad-ties", name: "Railroad Ties", icon: "🪵" },
  { id: "used-timbers", name: "Used Timbers", icon: "🪵" },
  { id: "retaining-blocks", name: "Retaining Blocks", icon: "🧱" },
  { id: "concrete", name: "Concrete", icon: "🧱" },
];

interface MaterialSectionProps {
  value: MaterialSectionData;
  onChange: (next: MaterialSectionData) => void;
}

export function MaterialSection({ value, onChange }: MaterialSectionProps) {
  const totalMaterialCost = value.mainCost + value.caps + value.delivery + value.rebates;

  const selectMaterial = (option: MaterialOption) => {
    onChange({ ...value, materialId: option.id, materialName: option.name, materialIcon: option.icon });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {MATERIAL_OPTIONS.map((option) => (
          <MaterialCard
            key={option.id}
            icon={option.icon}
            name={option.name}
            selected={value.materialId === option.id}
            onClick={() => selectMaterial(option)}
          />
        ))}
      </div>

      {value.materialId && (
        <div className="flex flex-col gap-2 mt-2">
          <CostInput label="Main Cost" value={value.mainCost} onChange={(n) => onChange({ ...value, mainCost: n })} />
          <CostInput label="Caps" value={value.caps} onChange={(n) => onChange({ ...value, caps: n })} />
          <CostInput label="Delivery" value={value.delivery} onChange={(n) => onChange({ ...value, delivery: n })} />
          <CostInput label="Rebates (negative)" value={value.rebates} onChange={(n) => onChange({ ...value, rebates: n })} />

          <div className="mt-2 bg-ink rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-paper font-plex text-sm uppercase tracking-wide">Total Materials</span>
            <span className="text-amber font-mono text-3xl tabular-nums">${totalMaterialCost.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}