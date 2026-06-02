// Dot-row progress indicator — click to jump to a step
export default function StepTimeline({ steps, currentStep, onJump }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {steps.map((step, i) => (
        <button
          key={step.id}
          onClick={() => onJump(i)}
          title={step.title}
          className={[
            'rounded-full transition-all duration-200 focus:outline-none',
            i === currentStep
              ? 'w-5 h-2 bg-accent-cyan'
              : i < currentStep
                ? 'w-2 h-2 bg-text-muted hover:bg-accent-cyan/60'
                : 'w-2 h-2 bg-border-dim hover:bg-text-muted',
          ].join(' ')}
          aria-label={`Jump to step ${i + 1}: ${step.title}`}
        />
      ))}
    </div>
  );
}
