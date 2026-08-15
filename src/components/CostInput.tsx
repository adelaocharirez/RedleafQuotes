interface CostInputProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
}

export function CostInput({ label, value, onChange }: CostInputProps) {
  return (
    <div className="flex items-center justify-between bg-surface rounded-2xl px-5 py-4 shadow-sm">
      <span className="font-plex text-ink text-lg">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-mono text-ink text-xl">$</span>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="font-mono text-2xl text-ink w-24 text-right bg-transparent outline-none tabular-nums"
        />
      </div>
    </div>
  );
}