import { useId, useState } from "react";

interface CostInputProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  hint?: string;
}

export function CostInput({ label, value, onChange, hint }: CostInputProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  // Held as a string while focused so "8." and "-" survive typing; parsed on
  // blur. Parsing every keystroke makes decimals impossible to enter.
  const commit = () => {
    if (draft !== null) {
      const parsed = parseFloat(draft);
      onChange(Number.isFinite(parsed) ? parsed : 0);
      setDraft(null);
    }
  };

  return (
    <div className="flex items-center justify-between px-3.5 py-2.5">
      <label htmlFor={id} className="font-plex text-ink text-sm">
        {label}
        {hint && <span className="block text-[11px] text-ink/40 mt-0.5">{hint}</span>}
      </label>
      <div className="flex items-center gap-0.5 shrink-0">
        <span className="font-mono text-ink/40 text-sm">$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={draft ?? String(value)}
          onFocus={() => setDraft(String(value))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          className="font-mono text-base text-ink w-[86px] text-right bg-transparent outline-none tabular-nums tracking-tight border-b border-transparent focus:border-amber transition-colors"
        />
      </div>
    </div>
  );
}