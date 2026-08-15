import { Stepper } from "./Stepper";

interface LaborOverheadSectionProps {
  estimatedHours: number;
  laborRatePerHour: number;
  overheadRatePerHour: number;
  onHoursChange: (value: number) => void;
  onLaborRateChange: (value: number) => void;
  onOverheadRateChange: (value: number) => void;
}

export function LaborOverheadSection({
  estimatedHours,
  laborRatePerHour,
  overheadRatePerHour,
  onHoursChange,
  onLaborRateChange,
  onOverheadRateChange,
}: LaborOverheadSectionProps) {
  const totalLaborCost = estimatedHours * laborRatePerHour;
  const totalOverheadCost = estimatedHours * overheadRatePerHour;

  return (
    <div className="flex flex-col gap-3">
      <Stepper label="Estimated Hours" value={estimatedHours} onChange={onHoursChange} step={1} unit=" hrs" />
      <Stepper label="Labor Rate" value={laborRatePerHour} onChange={onLaborRateChange} step={1} unit="/hr" />
      <Stepper label="Overhead Rate" value={overheadRatePerHour} onChange={onOverheadRateChange} step={1} unit="/hr" />

      <div className="mt-2 bg-ink rounded-2xl px-5 py-4 flex items-center justify-between">
        <span className="text-paper font-plex text-sm uppercase tracking-wide">Labor + Overhead</span>
        <span className="text-amber font-mono text-3xl tabular-nums">
          ${(totalLaborCost + totalOverheadCost).toFixed(2)}
        </span>
      </div>
    </div>
  );
}