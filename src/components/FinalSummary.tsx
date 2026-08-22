import { Download } from "lucide-react";
import { money, moneyParts } from "../lib/format";
import { exportQuoteToExcel } from "../lib/exportToExcel";
import { quoteLabel } from "../lib/quoteDocument";
import type { QuoteDocument } from "../lib/quoteDocument";
import type { QuoteBreakdown } from "../lib/quoteEngine";

interface FinalSummaryProps {
  doc: QuoteDocument;
  breakdown: QuoteBreakdown;
}

/**
 * Pinned to the bottom of the viewport.
 *
 * The bid is the whole point of the app and previously sat at the end of a long
 * scroll, so it was invisible while you were editing the numbers that changed
 * it. Uses env(safe-area-inset-bottom) rather than guessed padding so it clears
 * the home indicator on notched phones.
 */
export function FinalSummary({ doc, breakdown }: FinalSummaryProps) {
  const [dollars, cents] = moneyParts(breakdown.finalBidPrice);
  const incomplete = !doc.inputs.materialSection.materialId || doc.inputs.estimatedHours <= 0;

  return (
    <div
      className="fixed bottom-0 inset-x-0 bg-ink px-4 pt-3"
      style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-md flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[9.5px] font-plex font-semibold tracking-[0.16em] text-paper/40">
            FINAL BID
          </div>
          <div className="font-mono text-[33px] leading-tight text-paper tabular-nums tracking-[-0.035em]">
            {dollars}
            <span className="text-paper/45">{cents}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-paper/40">
            <span>{money(breakdown.pricePerSqFt)}/sq ft</span>
            <span className="text-paper/20">|</span>
            <span className="text-amber">{doc.inputs.targetProfitMarginPercent}% margin</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (incomplete && !confirm("This quote has no material or hours set. Export anyway?")) {
              return;
            }
            exportQuoteToExcel(doc.inputs, breakdown, quoteLabel(doc));
          }}
          className="w-[42px] h-[42px] shrink-0 rounded-xl bg-amber text-white flex items-center justify-center active:bg-amber/80 transition-colors"
          aria-label="Download quote as Excel"
        >
          <Download size={19} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}