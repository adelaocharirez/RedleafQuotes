interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  /** What this switch controls, e.g. "Gravel / Base". Needed for screen readers. */
  label: string;
}

export function ToggleSwitch({ enabled, onToggle, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={`w-[38px] h-[22px] shrink-0 rounded-full flex items-center px-[3px] transition-colors ${
        enabled ? "bg-moss justify-end" : "bg-ink/15 justify-start"
      }`}
    >
      <span className="w-4 h-4 rounded-full bg-white" />
    </button>
  );
}