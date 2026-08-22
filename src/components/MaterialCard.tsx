import { BrickWall, TreePine } from "lucide-react";

interface MaterialCardProps {
  kind: "timber" | "block";
  name: string;
  selected: boolean;
  onClick: () => void;
}

export function MaterialCard({ kind, name, selected, onClick }: MaterialCardProps) {
  const Icon = kind === "timber" ? TreePine : BrickWall;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 border transition-colors ${
        selected
          ? "border-amber bg-amber/[0.08] text-ink"
          : "border-ink/10 bg-surface text-ink/70 active:bg-ink/[0.04]"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.75}
        className={selected ? "text-amber" : "text-ink/40"}
        aria-hidden="true"
      />
      <span className="font-plex text-[11px] leading-tight text-center">{name}</span>
    </button>
  );
}