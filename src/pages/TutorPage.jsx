// Phase 4 — Rule-based circuit tutor (Gemini upgrade in Stage 1)

export default function TutorPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="32" height="24" rx="3" className="stroke-accent-green fill-none" strokeWidth="1.5" />
            <line x1="10" y1="14" x2="28" y2="14" className="stroke-accent-green" strokeWidth="1.5" />
            <line x1="10" y1="20" x2="22" y2="20" className="stroke-accent-green" strokeWidth="1.5" />
            <path d="M6 30 L12 36 L4 40 Z" className="fill-accent-green opacity-70" />
            <circle cx="38" cy="14" r="6" className="stroke-accent-green fill-none" strokeWidth="1.5" />
            <line x1="38" y1="11" x2="38" y2="17" className="stroke-accent-green" strokeWidth="1.5" />
            <line x1="35" y1="14" x2="41" y2="14" className="stroke-accent-green" strokeWidth="1.5" />
          </svg>
        </div>

        <span className="inline-block font-mono text-xs font-semibold tracking-widest text-accent-green border border-accent-green/30 bg-accent-green/5 px-3 py-1 rounded-full mb-4">
          PHASE 4 — AI-POWERED
        </span>

        <h1 className="font-mono font-bold text-3xl text-text-primary mb-3">
          Circuit Tutor
        </h1>

        <p className="font-sans text-text-muted leading-relaxed mb-6">
          Describe any circuit problem in plain text and receive a structured,
          step-by-step solution with formulas. Uses a rule-based engine in free MVP —
          upgrades to Gemini API with a single function swap.
        </p>

        <div className="bg-bg-surface border border-border-dim rounded-xl p-4 text-left">
          <p className="font-mono text-xs text-text-muted mb-2 uppercase tracking-wider">Coming in Phase 4:</p>
          {[
            "Rule-based step generator (8 problem types)",
            "Staggered step-card animations",
            "Formula rendering (inline math)",
            "aiUpgrade.js swap point for Gemini",
            "10 sample input tests",
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
