// Phase 3 — Hero feature: animated step-by-step circuit solving

function PhaseIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="12" width="30" height="24" rx="3" className="stroke-accent-cyan fill-none" strokeWidth="1.5" />
      <path d="M14 24 L22 16 L22 32 Z" className="fill-accent-cyan opacity-80" />
      <line x1="36" y1="18" x2="44" y2="18" className="stroke-accent-cyan" strokeWidth="1.5" />
      <line x1="36" y1="24" x2="44" y2="24" className="stroke-accent-cyan" strokeWidth="1.5" />
      <line x1="36" y1="30" x2="44" y2="30" className="stroke-accent-cyan" strokeWidth="1.5" />
    </svg>
  );
}

export default function AnimatorPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6 opacity-70">
          <PhaseIcon />
        </div>

        <span className="inline-block font-mono text-xs font-semibold tracking-widest text-accent-cyan border border-accent-cyan/30 bg-accent-cyan/5 px-3 py-1 rounded-full mb-4">
          PHASE 3 — HERO FEATURE
        </span>

        <h1 className="font-mono font-bold text-3xl text-text-primary mb-3">
          Circuit Animator
        </h1>

        <p className="font-sans text-text-muted leading-relaxed mb-6">
          Animated step-by-step circuit solving. Watch Thevenin transformations,
          KVL loop tracing, KCL node analysis, and Superposition unfold on a live SVG canvas.
          Driven by a real graph-based circuit engine.
        </p>

        <div className="bg-bg-surface border border-border-dim rounded-xl p-4 text-left">
          <p className="font-mono text-xs text-text-muted mb-2 uppercase tracking-wider">Coming in Phase 3:</p>
          {[
            "9 theorem animation sequences",
            "Play / Pause / Step controls",
            "SVG wire draw animations (stroke-dashoffset)",
            "Keyboard shortcuts: Space, ←→, R",
            "Driven by TheoremEngine + StepTracer",
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
