/** Shared number formatting. Every currency figure in the UI goes through here. */

/** "$12,345.60" — thousands separators matter on larger jobs. */
export function money(value: number): string {
  if (!Number.isFinite(value)) return "$0.00";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** "$12,346" — for tight spaces like the margin chips. */
export function moneyShort(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Splits currency so the cents can be de-emphasised: ["$2,150", ".40"] */
export function moneyParts(value: number): [string, string] {
  const full = money(value);
  const dot = full.lastIndexOf(".");
  return dot === -1 ? [full, ""] : [full.slice(0, dot), full.slice(dot)];
}

/** Trims trailing zeros: 2.5 -> "2.5", 2.0 -> "2" */
export function number(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(Math.round(value * 100) / 100);
}