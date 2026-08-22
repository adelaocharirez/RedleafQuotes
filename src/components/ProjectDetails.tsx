import { Card, SectionHeader } from "./ui/Card";
import { Stepper } from "./Stepper";

interface ProjectDetailsProps {
  lengthFt: number;
  heightFt: number;
  onLengthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
}

export function ProjectDetails({
  lengthFt,
  heightFt,
  onLengthChange,
  onHeightChange,
}: ProjectDetailsProps) {
  const faceSqFt = lengthFt * heightFt;

  return (
    <section>
      <SectionHeader
        label="PROJECT"
        value={faceSqFt > 0 ? `${faceSqFt.toFixed(faceSqFt % 1 === 0 ? 0 : 1)} sq ft` : undefined}
      />
      <Card>
        <Stepper label="Length" value={lengthFt} onChange={onLengthChange} step={1} unit="ft" />
        <Stepper label="Height" value={heightFt} onChange={onHeightChange} step={0.5} unit="ft" />
      </Card>
    </section>
  );
}