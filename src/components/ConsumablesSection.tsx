import { Card, SectionHeader } from "./ui/Card";
import { ConsumableRow } from "./ConsumableRow";
import { money } from "../lib/format";
import type { ConsumableItem } from "../lib/quoteEngine";

interface ConsumablesSectionProps {
  consumables: ConsumableItem[];
  onChange: (next: ConsumableItem[]) => void;
}

export function ConsumablesSection({ consumables, onChange }: ConsumablesSectionProps) {
  const patch = (id: string, patch: Partial<ConsumableItem>) =>
    onChange(consumables.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const activeCount = consumables.filter((c) => c.enabled).length;
  const total = consumables.filter((c) => c.enabled).reduce((sum, c) => sum + c.defaultCost, 0);

  return (
    <section>
      <SectionHeader
        label="CONSUMABLES"
        value={activeCount > 0 ? `${activeCount} on · ${money(total)}` : undefined}
      />
      <Card>
        {consumables.map((item) => (
          <ConsumableRow
            key={item.id}
            id={item.id}
            name={item.name}
            enabled={item.enabled}
            cost={item.defaultCost}
            isRenamable={item.isRenamable}
            onToggle={() => patch(item.id, { enabled: !item.enabled })}
            onNameChange={(name) => patch(item.id, { name })}
            onCostChange={(defaultCost) => patch(item.id, { defaultCost })}
          />
        ))}
      </Card>
    </section>
  );
}