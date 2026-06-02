// Phase 6 — Drag-and-drop circuit builder with live MNA calculations

export default function BuilderPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2"  y1="24" x2="10" y2="24" className="stroke-accent-yellow" strokeWidth="1.5" />
            <rect x="10" y="18" width="6" height="12" rx="1.5" className="stroke-accent-yellow fill-none" strokeWidth="1.5" />
            <line x1="16" y1="24" x2="22" y2="24" className="stroke-accent-yellow" strokeWidth="1.5" />
            <path d="M22 18 L22 30 M25 19.5 L25 28.5 M28 21 L28 27"
              className="stroke-accent-yellow" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="24" x2="46" y2="24" className="stroke-accent-yellow" strokeWidth="1.5" />
            <circle cx="2"  cy="24" r="2.5" className="fill-accent-yellow" />
            <circle cx="46" cy="24" r="2.5" className="stroke-accent-yellow fill-none" strokeWidth="1.5" />
            {/* Grid dots */}
            <circle cx="38" cy="10" r="1" className="fill-accent-yellow opacity-40" />
            <circle cx="38" cy="38" r="1" className="fill-accent-yellow opacity-40" />
            <circle cx="10" cy="10" r="1" className="fill-accent-yellow opacity-40" />
            <circle cx="10" cy="38" r="1" className="fill-accent-yellow opacity-40" />
          </svg>
        </div>

        <span className="inline-block font-mono text-xs font-semibold tracking-widest text-accent-yellow border border-accent-yellow/30 bg-accent-yellow/5 px-3 py-1 rounded-full mb-4">
          PHASE 6 — INTERACTIVE
        </span>

        <h1 className="font-mono font-bold text-3xl text-text-primary mb-3">
          Circuit Builder
        </h1>

        <p className="font-sans text-text-muted leading-relaxed mb-6">
          Drag resistors, voltage sources, and current sources onto a 50px snap grid.
          Draw wires between terminals. Node voltages and branch currents update live
          via the MNA solver on every change.
        </p>

        <div className="bg-bg-surface border border-border-dim rounded-xl p-4 text-left">
          <p className="font-mono text-xs text-text-muted mb-2 uppercase tracking-wider">Coming in Phase 6:</p>
          {[
            "SVG canvas with 50px snap-to-grid",
            "Drag-and-drop component palette",
            "Wire drawing → updates CircuitGraph",
            "LiveCalculator: V, I, R per element",
            '"Animate This Circuit" button',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 py-1">
              <span className="text-text-muted font-mono text-xs">─</span>
              <span className="font-sans text-xs text-text-muted">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
