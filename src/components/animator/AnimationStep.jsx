// Right-panel step card — title, formula, calculation, explanation
export default function AnimationStep({ step, stepIndex, totalSteps }) {
  if (!step) return null;

  return (
    <div className="p-5 h-full flex flex-col gap-4">
      {/* Step counter */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-semibold tracking-widest text-text-muted uppercase">
          Step {stepIndex + 1} of {totalSteps}
        </span>
        <div className="flex-1 h-px bg-border-dim" />
      </div>

      {/* Title */}
      <h2 className="font-mono font-bold text-base text-text-primary leading-snug step-enter" key={step.id + '-title'}>
        {step.title}
      </h2>

      {/* Formula */}
      {step.formula && (
        <div
          className="bg-bg-elevated border border-accent-cyan/20 rounded-lg px-4 py-3 step-enter"
          key={step.id + '-formula'}
          style={{ animationDelay: '80ms' }}
        >
          <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-1">Formula</p>
          <p className="font-mono text-sm text-accent-cyan leading-relaxed">{step.formula}</p>
        </div>
      )}

      {/* Calculation */}
      {step.calculation && (
        <div
          className="bg-bg-elevated border border-accent-green/20 rounded-lg px-4 py-3 step-enter"
          key={step.id + '-calc'}
          style={{ animationDelay: '160ms' }}
        >
          <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-1">Calculation</p>
          <p className="font-mono text-sm text-accent-green leading-relaxed whitespace-pre-wrap">{step.calculation}</p>
        </div>
      )}

      {/* Explanation */}
      <div
        className="step-enter"
        key={step.id + '-expl'}
        style={{ animationDelay: '240ms' }}
      >
        <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-2">Explanation</p>
        <p className="font-sans text-sm text-text-muted leading-relaxed">{step.explanation}</p>
      </div>

      {/* Keyboard hint (bottom) */}
      <div className="mt-auto pt-4 border-t border-border-dim">
        <p className="font-mono text-[10px] text-text-muted opacity-60 leading-relaxed">
          Space: play/pause  ·  ← →: step  ·  R: reset
        </p>
      </div>
    </div>
  );
}
