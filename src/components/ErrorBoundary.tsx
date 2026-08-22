import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { DRAFT_STORAGE_KEY } from "../lib/quoteDocument";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors that would otherwise leave a blank white screen.
 *
 * The failure mode this exists for: someone in a truck, no signal, app goes
 * white. They can't refresh into anything better and won't know to clear site
 * data. So this offers two escapes — reload (for a transient error) and
 * discard the saved quote (for a poisoned draft that would crash again on
 * every reload).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept in the console so a screenshot of it is a usable bug report.
    console.error("Unhandled error:", error, info.componentStack);
  }

  private reload = () => {
    window.location.reload();
  };

  private discardAndReload = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      /* storage unavailable; reloading is still worth a try */
    }
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-[10px] font-plex font-semibold tracking-[0.16em] text-ink/40">
            REDLEAF
          </div>
          <h1 className="font-display text-[22px] leading-tight text-ink tracking-[-0.022em] mt-1.5">
            Something went wrong
          </h1>
          <p className="text-[13px] text-ink/55 mt-2 leading-relaxed">
            The app hit an unexpected error. Your saved quote is still on this
            device — try reloading first.
          </p>

          <div className="flex flex-col gap-2 mt-5">
            <button
              type="button"
              onClick={this.reload}
              className="w-full py-3 rounded-xl bg-ink text-paper font-plex text-sm active:bg-ink/80 transition-colors"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.discardAndReload}
              className="w-full py-3 rounded-xl border border-ink/15 text-ink/70 font-plex text-sm active:bg-ink/[0.04] transition-colors"
            >
              Discard saved quote and start fresh
            </button>
          </div>

          <p className="text-[11px] text-ink/40 mt-4 leading-relaxed">
            If reloading keeps failing, the second option clears the stored
            quote. You'll lose the current one, but the app will work again.
          </p>

          <details className="mt-5">
            <summary className="text-[11px] font-plex text-ink/40 cursor-pointer">
              Error details
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-surface border border-ink/10 text-[10px] font-mono text-ink/60 whitespace-pre-wrap break-words max-h-40 overflow-auto">
              {error.name}: {error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}