import { ToggleSwitch } from "./ToggleSwitch";

interface ConsumableRowProps {
  icon: string;
  name: string;
  enabled: boolean;
  cost: number;
  isRenamable: boolean;
  onToggle: () => void;
  onNameChange: (newName: string) => void;
  onCostChange: (newCost: number) => void;
}

export function ConsumableRow({
  icon,
  name,
  enabled,
  cost,
  isRenamable,
  onToggle,
  onNameChange,
  onCostChange,
}: ConsumableRowProps) {
  return (
    <div className="flex items-center justify-between bg-surface rounded-2xl px-5 py-4 shadow-sm gap-3">
      <span className="text-2xl">{icon}</span>

      {isRenamable ? (
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="font-plex text-ink text-lg flex-1 bg-transparent outline-none border-b border-transparent focus:border-ink"
        />
      ) : (
        <span className="font-plex text-ink text-lg flex-1">{name}</span>
      )}

      {enabled && (
        <div className="flex items-center gap-1">
          <span className="font-mono text-ink text-lg">$</span>
          <input
            type="number"
            inputMode="decimal"
            value={cost}
            onChange={(e) => onCostChange(Number(e.target.value))}
            className="font-mono text-lg text-ink w-16 text-right bg-transparent outline-none tabular-nums"
          />
        </div>
      )}

      <ToggleSwitch enabled={enabled} onToggle={onToggle} />
    </div>
  );
}