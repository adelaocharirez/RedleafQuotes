import { useState } from "react";
import { ClientSection } from "./components/ClientSection";
import { ProjectDetails } from "./components/ProjectDetails";
import { MaterialSection } from "./components/MaterialSection";
import { ConsumablesSection } from "./components/ConsumablesSection";
import { LaborOverheadSection } from "./components/LaborOverheadSection";
import { MarginSelector } from "./components/MarginSelector";
import { FinalSummary } from "./components/FinalSummary";
import { useQuoteForm } from "./hooks/useQuoteForm";

function App() {
  const quote = useQuoteForm();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-md pb-44">
        <header className="bg-surface border-b border-ink/[0.09] px-4 pt-4 pb-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-plex font-semibold tracking-[0.16em] text-ink/40">
              REDLEAF
            </span>
            {quote.restored && (
              <span className="flex items-center gap-1.5 bg-moss/10 px-2 py-0.5 rounded-full">
                <span className="w-[5px] h-[5px] rounded-full bg-moss" />
                <span className="text-[10px] font-plex font-semibold text-moss tracking-wide">
                  SAVED
                </span>
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-3 mt-1.5">
            <h1 className="font-display text-[22px] leading-tight text-ink tracking-[-0.022em] truncate">
              {quote.client.name.trim() || "New Quote"}
            </h1>

            {!quote.isEmpty &&
              (confirmingReset ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      quote.reset();
                      setConfirmingReset(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-ink text-paper text-xs font-plex"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className="px-2.5 py-1.5 rounded-lg border border-ink/15 text-ink text-xs font-plex"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className="shrink-0 px-2.5 py-1.5 rounded-lg border border-ink/15 text-ink/70 text-xs font-plex active:bg-ink/[0.04]"
                >
                  New
                </button>
              ))}
          </div>

          {quote.summaryLine && (
            <p className="text-[12.5px] text-ink/45 mt-0.5 truncate">{quote.summaryLine}</p>
          )}
        </header>

        <main className="px-4 pt-4 flex flex-col gap-4">
          <ClientSection value={quote.client} onChange={quote.setClient} />

          <ProjectDetails
            lengthFt={quote.inputs.lengthFt}
            heightFt={quote.inputs.heightFt}
            onLengthChange={quote.setLengthFt}
            onHeightChange={quote.setHeightFt}
          />

          <MaterialSection
            value={quote.inputs.materialSection}
            onChange={quote.setMaterialSection}
          />

          <ConsumablesSection
            consumables={quote.inputs.consumables}
            onChange={quote.setConsumables}
          />

          <LaborOverheadSection
            estimatedHours={quote.inputs.estimatedHours}
            laborRatePerHour={quote.inputs.laborRatePerHour}
            overheadRatePerHour={quote.inputs.overheadRatePerHour}
            onHoursChange={quote.setEstimatedHours}
            onLaborRateChange={quote.setLaborRatePerHour}
            onOverheadRateChange={quote.setOverheadRatePerHour}
          />

          <MarginSelector
            inputs={quote.inputs}
            selectedMargin={quote.inputs.targetProfitMarginPercent}
            onSelect={quote.setTargetProfitMarginPercent}
          />
        </main>
      </div>

      <FinalSummary doc={quote.doc} breakdown={quote.breakdown} />
    </div>
  );
}

export default App;