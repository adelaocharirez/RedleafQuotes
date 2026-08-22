import { useState } from "react";
import type { ClientInfo } from "../lib/quoteDocument";

interface Props {
  value: ClientInfo;
  onChange: (patch: Partial<ClientInfo>) => void;
}

/**
 * Client / job details.
 *
 * Only the name is shown by default. This app is used on a phone with a
 * keyboard that gets in the way, so the three optional fields stay collapsed
 * until asked for.
 */
export function ClientSection({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState(
    () => !!(value.phone || value.address || value.notes)
  );

  const filled = [value.phone, value.address, value.notes].filter(Boolean).length;

  return (
    <section className="bg-surface rounded-2xl px-5 py-4 shadow-sm border border-ink/10">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="client-name"
          className="text-xs uppercase tracking-widest text-ink/60 font-plex"
        >
          Client / Job
        </label>
        <input
          id="client-name"
          type="text"
          inputMode="text"
          autoComplete="name"
          placeholder="Name this quote"
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full bg-transparent text-ink text-lg font-plex border-b border-ink/20 focus:border-amber focus:outline-none py-1"
        />
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="client-phone"
              className="text-xs uppercase tracking-widest text-ink/60 font-plex"
            >
              Phone
            </label>
            <input
              id="client-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Optional"
              value={value.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full bg-transparent text-ink font-mono tabular-nums border-b border-ink/20 focus:border-amber focus:outline-none py-1"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="client-address"
              className="text-xs uppercase tracking-widest text-ink/60 font-plex"
            >
              Job Site
            </label>
            <input
              id="client-address"
              type="text"
              autoComplete="street-address"
              placeholder="Optional"
              value={value.address}
              onChange={(e) => onChange({ address: e.target.value })}
              className="w-full bg-transparent text-ink font-plex border-b border-ink/20 focus:border-amber focus:outline-none py-1"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="client-notes"
              className="text-xs uppercase tracking-widest text-ink/60 font-plex"
            >
              Notes
            </label>
            <textarea
              id="client-notes"
              rows={2}
              placeholder="Optional"
              value={value.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              className="w-full bg-transparent text-ink font-plex border-b border-ink/20 focus:border-amber focus:outline-none py-1 resize-none"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-sm text-moss font-plex underline underline-offset-2"
      >
        {expanded
          ? "Hide details"
          : filled > 0
            ? `Show details (${filled})`
            : "Add phone, address, notes"}
      </button>
    </section>
  );
}