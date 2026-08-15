import {Minus, Plus } from "lucide-react";
//Reusable button widget for increments and decreasing a value
interface StepperProps {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
    step?: number;
    min?: number;
    unit?: string;
}

export function Stepper({ label, value, onChange, step = 1, min = 0, unit = ""}: StepperProps){
    const decrease = () => {
        const next = Math.max(min, value - step);
        onChange(next);
    };
    const increase = () => {
        onChange(value + step);

    };
    return (
    <div className="flex items-center justify-between bg-surface rounded-2xl px-5 py-4 shadow-sm">
      <span className="font-plex text-ink text-lg">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={decrease}
          className="w-12 h-12 rounded-full bg-ink text-paper flex items-center justify-center active:scale-95 transition"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={22} />
        </button>
        <span className="font-mono text-2xl text-ink w-16 text-center tabular-nums">
          {value}{unit}
        </span>
        <button
          onClick={increase}
          className="w-12 h-12 rounded-full bg-amber text-white flex items-center justify-center active:scale-95 transition"
          aria-label={`Increase ${label}`}
        >
          <Plus size={22} />
        </button>
      </div>
    </div>
  );
}