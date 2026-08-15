import { useState } from "react";
import { ProjectDetails } from "./components/ProjectDetails";
import { MaterialSection } from "./components/MaterialSection";
import { ConsumablesSection } from "./components/ConsumablesSection";
import { LaborOverheadSection } from "./components/LaborOverheadSection";
import { MarginSelector } from "./components/MarginSelector";
import { FinalSummary } from "./components/FinalSummary";
import {
  calculateQuote,
  DEFAULT_CONSUMABLES,
  DEFAULT_RATES,
} from "./lib/quoteEngine";
import type {
  ConsumableItem,
  MaterialSection as MaterialSectionData,
  QuoteInputs,
} from "./lib/quoteEngine";

function App() {
  const [lengthFt, setLengthFt] = useState(0);
  const [heightFt, setHeightFt] = useState(0);
  const [materialSection, setMaterialSection] = useState<MaterialSectionData>({
    materialId: "",
    materialName: "",
    materialIcon: "",
    mainCost: 0,
    caps: 0,
    delivery: 0,
    rebates: 0,
  });
  const [consumables, setConsumables] = useState<ConsumableItem[]>(DEFAULT_CONSUMABLES);
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [laborRatePerHour, setLaborRatePerHour] = useState(DEFAULT_RATES.laborRatePerHour);
  const [overheadRatePerHour, setOverheadRatePerHour] = useState(DEFAULT_RATES.overheadRatePerHour);
  const [targetProfitMarginPercent, setTargetProfitMarginPercent] = useState(
    DEFAULT_RATES.targetProfitMarginPercent
  );

  const quoteInputs: QuoteInputs = {
    lengthFt,
    heightFt,
    materialSection,
    consumables,
    estimatedHours,
    laborRatePerHour,
    overheadRatePerHour,
    targetProfitMarginPercent,
  };

  const breakdown = calculateQuote(quoteInputs);

  return (
    <div className="min-h-screen bg-paper p-4 flex flex-col gap-6 pb-32">
      <h1 className="font-display text-2xl text-ink">New Quote</h1>

      <ProjectDetails
        lengthFt={lengthFt}
        heightFt={heightFt}
        onLengthChange={setLengthFt}
        onHeightChange={setHeightFt}
      />

      <MaterialSection value={materialSection} onChange={setMaterialSection} />

      <ConsumablesSection consumables={consumables} onChange={setConsumables} />

      <LaborOverheadSection
        estimatedHours={estimatedHours}
        laborRatePerHour={laborRatePerHour}
        overheadRatePerHour={overheadRatePerHour}
        onHoursChange={setEstimatedHours}
        onLaborRateChange={setLaborRatePerHour}
        onOverheadRateChange={setOverheadRatePerHour}
      />

      <MarginSelector
        inputs={quoteInputs}
        selectedMargin={targetProfitMarginPercent}
        onSelect={setTargetProfitMarginPercent}
      />

      <FinalSummary breakdown={breakdown} />
    </div>
  );
}

export default App;