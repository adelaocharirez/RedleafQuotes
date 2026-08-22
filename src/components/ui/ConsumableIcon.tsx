import {
  Tractor,
  Mountain,
  Waves,
  Layers,
  Bolt,
  Droplet,
  Plus,
} from "lucide-react";

/**
 * Line icons keyed by consumable id.
 *
 * Replaces the emoji set: emoji render as different artwork on every platform,
 * sit at inconsistent optical weights, and are the loudest "unfinished" signal
 * in an interface. These inherit currentColor so rows can dim them when off.
 */
const ICONS = {
  machineRental: Tractor,
  gravelBase: Mountain,
  drainPipe: Waves,
  landscapingFabric: Layers,
  rebarPinsDrillBits: Bolt,
  adhesiveGlue: Droplet,
} as const;

export function ConsumableIcon({ id, className = "" }: { id: string; className?: string }) {
  const Icon = ICONS[id as keyof typeof ICONS] ?? Plus;
  return <Icon size={16} strokeWidth={1.75} className={className} aria-hidden="true" />;
}