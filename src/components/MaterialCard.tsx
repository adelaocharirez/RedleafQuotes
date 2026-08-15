interface MaterialCardProps {
  icon: string;
  name: string;
  selected: boolean;
  onClick: () => void;
}

export function MaterialCard({ icon, name, selected, onClick }: MaterialCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 border-2 transition ${
        selected ? "border-amber bg-amber/10" : "border-transparent bg-surface"
      }`}
    >
      <span className="text-4xl">{icon}</span>
      <span className="font-plex text-ink text-sm text-center">{name}</span>
    </button>
  );
}