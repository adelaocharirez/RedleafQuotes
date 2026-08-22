import { Card, SectionHeader } from "./ui/Card";
import { Stepper } from "./Stepper";
import { money } from "../lib/format";

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
  const total = estimatedHours * (laborRatePerHour + overheadRatePerHour);

  return (
    <section>
      <SectionHeader label="LABOR & OVERHEAD" value={total > 0 ? money(total) : undefined} />
      <Card>
        <Stepper label="Estimated hours" value={estimatedHours} onChange={onHoursChange} step={1} unit="hrs" />
        <Stepper label="Labor rate" value={laborRatePerHour} onChange={onLaborRateChange} step={1} unit="/hr" />
        <Stepper label="Overhead rate" value={overheadRatePerHour} onChange={onOverheadRateChange} step={1} unit="/hr" />
      </Card>
    </section>
  );
}