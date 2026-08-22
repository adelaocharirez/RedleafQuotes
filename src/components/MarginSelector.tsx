import { SectionHeader } from "./ui/Card";
import { compareMargins } from "../lib/quoteEngine";
import { moneyShort } from "../lib/format";
import type { QuoteInputs } from "../lib/quoteEngine";

interface MarginSelectorProps {
  inputs: QuoteInputs;
  selectedMargin: number;
  onSelect: (margin: number) => void;
}

export function MarginSelector({ inputs, selectedMargin, onSelect }: MarginSelectorProps) {
  return (
    <section>
      <SectionHeader label="MARGIN" />
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {compareMargins(inputs).map((c) => {
          const selected = selectedMargin === c.marginPercent;
          return (
            <button
              key={c.marginPercent}
              type="button"
              onClick={() => onSelect(c.marginPercent)}
              aria-pressed={selected}
              className={`shrink-0 flex flex-col items-center rounded-xl px-3.5 py-2 border transition-colors ${
                selected
                  ? "border-amber bg-amber/[0.08]"
                  : "border-ink/10 bg-surface active:bg-ink/[0.04]"
              }`}
            >
              <span
                className={`font-plex text-[11px] font-semibold ${selected ? "text-amber" : "text-ink/50"}`}
              >
                {c.marginPercent}%
              </span>
              <span className="font-mono text-sm text-ink tabular-nums tracking-tight mt-0.5">
                {moneyShort(c.finalBidPrice)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}