import { useState } from "react";
import { MaterialCard } from "./MaterialCard";
import { CostInput } from "./CostInput";

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

export function MaterialSection() {
  const [selectedId, setSelectedId] = useState("");
  const [mainCost, setMainCost] = useState(0);
  const [caps, setCaps] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [rebates, setRebates] = useState(0);

  const totalMaterialCost = mainCost + caps + delivery + rebates;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {MATERIAL_OPTIONS.map((option) => (
          <MaterialCard
            key={option.id}
            icon={option.icon}
            name={option.name}
            selected={selectedId === option.id}
            onClick={() => setSelectedId(option.id)}
          />
        ))}
      </div>

      {selectedId && (
        <div className="flex flex-col gap-2 mt-2">
          <CostInput label="Main Cost" value={mainCost} onChange={setMainCost} />
          <CostInput label="Caps" value={caps} onChange={setCaps} />
          <CostInput label="Delivery" value={delivery} onChange={setDelivery} />
          <CostInput label="Rebates (negative)" value={rebates} onChange={setRebates} />

          <div className="mt-2 bg-ink rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-paper font-plex text-sm uppercase tracking-wide">Total Materials</span>
            <span className="text-amber font-mono text-3xl tabular-nums">${totalMaterialCost.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}