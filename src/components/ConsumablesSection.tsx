import { useState } from "react";
import { ConsumableRow } from "./ConsumableRow";
import { DEFAULT_CONSUMABLES, type ConsumableItem } from "../lib/quoteEngine";

export function ConsumablesSection() {
  const [consumables, setConsumables] = useState<ConsumableItem[]>(DEFAULT_CONSUMABLES);

  const toggleConsumable = (id: string) => {
    setConsumables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const updateCost = (id: string, newCost: number) => {
    setConsumables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, defaultCost: newCost } : item))
    );
  };

  const updateName = (id: string, newName: string) => {
    setConsumables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const totalConsumablesCost = consumables
    .filter((c) => c.enabled)
    .reduce((sum, c) => sum + c.defaultCost, 0);

  return (
    <div className="flex flex-col gap-3">
      {consumables.map((item) => (
        <ConsumableRow
          key={item.id}
          icon={item.icon}
          name={item.name}
          enabled={item.enabled}
          cost={item.defaultCost}
          isRenamable={item.isRenamable}
          onToggle={() => toggleConsumable(item.id)}
          onNameChange={(newName) => updateName(item.id, newName)}
          onCostChange={(newCost) => updateCost(item.id, newCost)}
        />
      ))}

      <div className="mt-2 bg-ink rounded-2xl px-5 py-4 flex items-center justify-between">
        <span className="text-paper font-plex text-sm uppercase tracking-wide">Total Consumables</span>
        <span className="text-amber font-mono text-3xl tabular-nums">${totalConsumablesCost.toFixed(2)}</span>
      </div>
    </div>
  );
}