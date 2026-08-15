interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

export function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-14 h-8 rounded-full flex items-center px-1 transition ${
        enabled ? "bg-moss justify-end" : "bg-ink/20 justify-start"
      }`}
      aria-label={enabled ? "Turn off" : "Turn on"}
    >
      <span className="w-6 h-6 rounded-full bg-white shadow-sm" />
    </button>
  );
}