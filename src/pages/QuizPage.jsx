// Phase 5 — Adaptive quiz with static question bank (Gemini generation later)

export default function QuizPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="2" width="28" height="38" rx="3" className="stroke-accent-red fill-none" strokeWidth="1.5" />
            <line x1="12" y1="12" x2="28" y2="12" className="stroke-accent-red" strokeWidth="1.5" />
            <line x1="12" y1="19" x2="24" y2="19" className="stroke-accent-red" strokeWidth="1.5" />
            <line x1="12" y1="26" x2="28" y2="26" className="stroke-accent-red" strokeWidth="1.5" />
            <circle cx="34" cy="34" r="9" className="fill-bg-surface stroke-accent-red" strokeWidth="1.5" />
            <line x1="34" y1="29" x2="34" y2="35" className="stroke-accent-red" strokeWidth="2" strokeLinecap="round" />
            <circle cx="34" cy="38" r="1.2" className="fill-accent-red" />
          </svg>
        </div>

        <span className="inline-block font-mono text-xs font-semibold tracking-widest text-accent-red border border-accent-red/30 bg-accent-red/5 px-3 py-1 rounded-full mb-4">
          PHASE 5 — PRACTICE
        </span>

        <h1 className="font-mono font-bold text-3xl text-text-primary mb-3">
          Adaptive Quiz
        </h1>

        <p className="font-sans text-text-muted leading-relaxed mb-6">
          50+ problems across Beginner, Intermediate, and Advanced levels.
          ±2% tolerance checking, session scoring, and a post-quiz summary
          that links weak topics back to the Circuit Animator.
        </p>

        <div className="bg-bg-surface border border-border-dim rounded-xl p-4 text-left">
          <p className="font-mono text-xs text-text-muted mb-2 uppercase tracking-wider">Coming in Phase 5:</p>
          {[
            "questionBank.json — 50 questions",
            "Difficulty selector: Beginner / Intermediate / Advanced",
            "±2% tolerance answer checking",
            "Session score tracking",
            "\"Watch animation\" shortcut for weak topics",
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
