import MathText from '../MathText.jsx';

// A single step card — same data shape as the animator steps.
// `delay` is the CSS animation-delay in ms for staggered entrance.
export default function StepCard({ step, index, delay = 0 }) {
  return (
    <div
      className="step-enter bg-bg-surface border border-border-dim rounded-xl overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-dim">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 font-mono text-xs font-bold text-accent-cyan shrink-0">
          {index + 1}
        </span>
        <h3 className="font-mono font-semibold text-sm text-text-primary">
          {step.title}
        </h3>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Formula */}
        {step.formula && (
          <div className="bg-bg-elevated border border-accent-cyan/15 rounded-lg px-3 py-2.5">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Formula</p>
            <div className="formula-math text-sm">
              <MathText tex={step.formula} />
            </div>
          </div>
        )}

        {/* Calculation */}
        {step.calculation && (
          <div className="bg-bg-elevated border border-accent-green/15 rounded-lg px-3 py-2.5">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Calculation</p>
            <div className="calc-math text-sm leading-relaxed whitespace-pre-wrap">
              <MathText tex={step.calculation} />
            </div>
          </div>
        )}

        {/* Explanation */}
        <p className="font-sans text-sm text-text-muted leading-relaxed whitespace-pre-line">
          {step.explanation}
        </p>
      </div>
    </div>
  );
}
