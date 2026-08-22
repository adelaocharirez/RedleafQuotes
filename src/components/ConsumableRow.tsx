import { useId, useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";
import { ConsumableIcon } from "./ui/ConsumableIcon";

interface ConsumableRowProps {
  id: string;
  name: string;
  enabled: boolean;
  cost: number;
  isRenamable: boolean;
  onToggle: () => void;
  onNameChange: (newName: string) => void;
  onCostChange: (newCost: number) => void;
}

export function ConsumableRow({
  id,
  name,
  enabled,
  cost,
  isRenamable,
  onToggle,
  onNameChange,
  onCostChange,
}: ConsumableRowProps) {
  const costId = useId();
  const nameId = useId();
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft !== null) {
      const parsed = parseFloat(draft);
      onCostChange(Number.isFinite(parsed) ? parsed : 0);
      setDraft(null);
    }
  };

  // Text and icon dim when off; the toggle stays full strength so it's always
  // easy to hit. Fading the whole row would make the control hard to see.
  const dim = enabled ? "text-ink" : "text-ink/35";

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5">
      <ConsumableIcon id={id} className={enabled ? "text-moss" : "text-ink/25"} />

      {isRenamable ? (
        <>
          <label htmlFor={nameId} className="sr-only">
            Consumable name
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={`font-plex text-sm flex-1 min-w-0 bg-transparent outline-none border-b border-transparent focus:border-amber transition-colors ${dim}`}
          />
        </>
      ) : (
        <span className={`font-plex text-sm flex-1 min-w-0 truncate ${dim}`}>{name}</span>
      )}

      {enabled && (
        <div className="flex items-center gap-0.5 shrink-0">
          <label htmlFor={costId} className="sr-only">
            {name} cost
          </label>
          <span className="font-mono text-ink/40 text-xs">$</span>
          <input
            id={costId}
            type="text"
            inputMode="decimal"
            value={draft ?? String(cost)}
            onFocus={() => setDraft(String(cost))}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            className="font-mono text-sm text-ink w-14 text-right bg-transparent outline-none tabular-nums border-b border-transparent focus:border-amber transition-colors"
          />
        </div>
      )}

      <ToggleSwitch enabled={enabled} onToggle={onToggle} label={name} />
    </div>
  );
}