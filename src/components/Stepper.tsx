import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { number as fmtNumber } from "../lib/format";

interface StepperProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  step?: number;
  min?: number;
  unit?: string;
  /**
   * Allow tapping the number to type it directly. Essential for values that
   * start at 0 and run large — entering a 35 ft wall is 35 taps otherwise.
   */
  typable?: boolean;
}

export function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  unit = "",
  typable = true,
}: StepperProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    // Held as a string while typing so intermediate states like "8." survive;
    // parsing on every keystroke would strip the decimal point mid-entry.
    const parsed = parseFloat(draft);
    onChange(Number.isFinite(parsed) ? Math.max(min, parsed) : value);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between px-3.5 py-2.5">
      <span className="font-plex text-ink text-sm">{label}</span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-[34px] h-[34px] rounded-lg bg-ink/[0.06] text-ink flex items-center justify-center active:bg-ink/15 transition-colors"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={16} strokeWidth={2} />
        </button>

        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            aria-label={label}
            className="font-mono text-base text-ink w-[62px] text-center tabular-nums bg-transparent outline-none border-b border-amber"
          />
        ) : (
          <button
            type="button"
            disabled={!typable}
            onClick={() => {
              setDraft(fmtNumber(value));
              setEditing(true);
            }}
            className="font-mono text-base text-ink w-[62px] text-center tabular-nums tracking-tight disabled:cursor-default"
            aria-label={typable ? `${label}, tap to type` : label}
          >
            {fmtNumber(value)}
            {unit && <span className="text-[11px] text-ink/40 ml-0.5">{unit}</span>}
          </button>
        )}

        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="w-[34px] h-[34px] rounded-lg bg-ink text-white flex items-center justify-center active:bg-ink/80 transition-colors"
          aria-label={`Increase ${label}`}
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}