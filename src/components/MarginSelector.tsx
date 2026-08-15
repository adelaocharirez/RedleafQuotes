import { compareMargins } from "../lib/quoteEngine";
import type { QuoteInputs } from "../lib/quoteEngine";

interface MarginSelectorProps {
  inputs: QuoteInputs;
  selectedMargin: number;
  onSelect: (margin: number) => void;
}

export function MarginSelector({ inputs, selectedMargin, onSelect }: MarginSelectorProps) {
  const comparisons = compareMargins(inputs);

  return (
    <div className="flex gap-2 overflow-x-auto">
      {comparisons.map((c) => (
        <button
          key={c.marginPercent}
          onClick={() => onSelect(c.marginPercent)}
          className={`flex-shrink-0 flex flex-col items-center rounded-2xl px-4 py-3 border-2 transition ${
            selectedMargin === c.marginPercent ? "border-amber bg-amber/10" : "border-transparent bg-surface"
          }`}
        >
          <span className="font-plex text-ink text-sm">{c.marginPercent}%</span>
          <span className="font-mono text-ink text-lg tabular-nums">${c.finalBidPrice.toFixed(0)}</span>
        </button>
      ))}
    </div>
  );
}