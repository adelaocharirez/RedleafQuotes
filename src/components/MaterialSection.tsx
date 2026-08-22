import { Card, SectionHeader } from "./ui/Card";
import { MaterialCard } from "./MaterialCard";
import { CostInput } from "./CostInput";
import { money } from "../lib/format";
import type { MaterialSection as MaterialSectionData } from "../lib/quoteEngine";

interface MaterialOption {
  id: string;
  name: string;
  kind: "timber" | "block";
}

const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "green-timber", name: "Green Timber", kind: "timber" },
  { id: "railroad-ties", name: "Railroad Ties", kind: "timber" },
  { id: "used-timbers", name: "Used Timbers", kind: "timber" },
  { id: "retaining-blocks", name: "Retaining Blocks", kind: "block" },
  { id: "concrete", name: "Concrete", kind: "block" },
];

interface MaterialSectionProps {
  value: MaterialSectionData;
  onChange: (next: MaterialSectionData) => void;
}

export function MaterialSection({ value, onChange }: MaterialSectionProps) {
  const total = value.mainCost + value.caps + value.delivery + value.rebates;
  // Rebates are entered negative, so a positive entry inflates the bid. That's
  // the likelier data-entry slip and it silently raises the price.
  const rebateWrongSign = value.rebates > 0;

  return (
    <section>
      <SectionHeader label="MATERIALS" value={value.materialId ? money(total) : undefined} />

      <div className="grid grid-cols-3 gap-2 mb-2">
        {MATERIAL_OPTIONS.map((option) => (
          <MaterialCard
            key={option.id}
            kind={option.kind}
            name={option.name}
            selected={value.materialId === option.id}
            onClick={() =>
              onChange({
                ...value,
                materialId: option.id,
                materialName: option.name,
                materialIcon: "",
              })
            }
          />
        ))}
      </div>

      {value.materialId && (
        <>
          <Card>
            <CostInput
              label="Main cost"
              value={value.mainCost}
              onChange={(mainCost) => onChange({ ...value, mainCost })}
            />
            <CostInput
              label="Caps"
              value={value.caps}
              onChange={(caps) => onChange({ ...value, caps })}
            />
            <CostInput
              label="Delivery"
              value={value.delivery}
              onChange={(delivery) => onChange({ ...value, delivery })}
            />
            <CostInput
              label="Rebates"
              hint="Enter as a negative, e.g. -250"
              value={value.rebates}
              onChange={(rebates) => onChange({ ...value, rebates })}
            />
          </Card>

          {rebateWrongSign && (
            <p className="mt-2 text-[11px] font-plex text-amber px-0.5">
              Rebates should be negative — a positive amount raises the bid.
            </p>
          )}
          {total < 0 && (
            <p className="mt-2 text-[11px] font-plex text-amber px-0.5">
              Material total is negative. Check the rebate amount.
            </p>
          )}
        </>
      )}
    </section>
  );
}