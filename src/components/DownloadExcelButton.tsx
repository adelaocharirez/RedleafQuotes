import { exportQuoteToExcel } from "../lib/exportToExcel";
import type { QuoteInputs, QuoteBreakdown } from "../lib/quoteEngine";

interface DownloadExcelButtonProps {
  inputs: QuoteInputs;
  breakdown: QuoteBreakdown;
}

export function DownloadExcelButton({ inputs, breakdown }: DownloadExcelButtonProps) {
  return (
    <button
      onClick={() => exportQuoteToExcel(inputs, breakdown)}
      className="block w-full text-center bg-moss text-white font-plex text-lg rounded-2xl px-5 py-4 shadow-sm active:scale-95 transition"
    >
      Download Quote Excel
    </button>
  );
}