import { Stepper } from "./Stepper";

interface ProjectDetailsProps {
  lengthFt: number;
  heightFt: number;
  onLengthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
}

export function ProjectDetails({ lengthFt, heightFt, onLengthChange, onHeightChange }: ProjectDetailsProps) {
  const faceSqFt = lengthFt * heightFt;

  return (
    <div className="flex flex-col gap-3">
      <Stepper label="Length" value={lengthFt} onChange={onLengthChange} step={1} unit=" ft" />
      <Stepper label="Height" value={heightFt} onChange={onHeightChange} step={0.5} unit=" ft" />

      <div className="mt-2 bg-ink rounded-2xl px-5 py-4 flex items-center justify-between">
        <span className="text-paper font-plex text-sm uppercase tracking-wide">Face Sq Ft</span>
        <span className="text-amber font-mono text-3xl tabular-nums">{faceSqFt.toFixed(1)}</span>
      </div>
    </div>
  );
}