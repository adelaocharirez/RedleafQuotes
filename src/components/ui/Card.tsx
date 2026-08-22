import type { ReactNode } from "react";

/**
 * Groups rows into a single bordered card with hairline dividers between them.
 *
 * Replaces the previous pattern of every row being its own shadowed box.
 * Grouped rows read as one system; separately floating cards read as unfinished.
 */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-surface border border-ink/10 rounded-xl overflow-hidden divide-y divide-ink/[0.07] ${className}`}
    >
      {children}
    </div>
  );
}

/** One row inside a Card. */
export function Row({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center gap-3 px-3.5 py-3 ${className}`}>{children}</div>;
}

/**
 * Small uppercase label above a Card, with an optional value on the right.
 * The tiny label against a large number is what creates type hierarchy.
 */
export function SectionHeader({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-2 px-0.5">
      <span className="text-[10px] font-plex font-semibold tracking-[0.15em] text-ink/40">
        {label}
      </span>
      {value && (
        <span className="font-mono text-xs text-ink/45 tabular-nums">{value}</span>
      )}
    </div>
  );
}