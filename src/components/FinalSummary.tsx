import type { QuoteBreakdown } from "../lib/quoteEngine";

interface FinalSummaryProps {
  breakdown: QuoteBreakdown;
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-paper/80 font-plex text-sm">{label}</span>
      <span className="text-paper font-mono text-lg tabular-nums">${value.toFixed(2)}</span>
    </div>
  );
}

export function FinalSummary({ breakdown }: FinalSummaryProps) {
  return (
    <div className="bg-ink rounded-2xl px-5 py-5 flex flex-col gap-2">
      <Row label="Total Expenses" value={breakdown.totalExpenses} />
      <Row label="Profit" value={breakdown.profitAmount} />
      <div className="border-t border-paper/20 my-1" />
      <div className="flex items-center justify-between">
        <span className="text-paper font-plex text-sm uppercase tracking-wide">Final Bid Price</span>
        <span className="text-amber font-mono text-4xl tabular-nums">${breakdown.finalBidPrice.toFixed(2)}</span>
      </div>
      <span className="text-paper/60 font-mono text-sm text-right">${breakdown.pricePerSqFt.toFixed(2)}/sq ft</span>
    </div>
  );
}