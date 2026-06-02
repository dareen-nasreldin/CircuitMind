const SPEEDS = [0.5, 1, 2];

function Btn({ onClick, disabled, children, title, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        'flex items-center justify-center w-9 h-9 rounded-lg font-mono text-sm',
        'transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-accent-cyan/40',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        'bg-bg-elevated border border-border-dim text-text-muted hover:text-text-primary hover:border-accent-cyan/30',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export default function AnimationControls({
  isPlaying, speed,
  onPlay, onPause, onNext, onPrev, onReset, onSpeedChange,
  currentStep, totalSteps,
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      {/* Nav controls */}
      <div className="flex items-center gap-1.5">
        <Btn onClick={onReset}  title="Reset (R)"       disabled={currentStep === 0 && !isPlaying}>⟳</Btn>
        <Btn onClick={onPrev}   title="Previous (←)"    disabled={currentStep === 0}>←</Btn>

        {isPlaying ? (
          <Btn
            onClick={onPause}
            title="Pause (Space)"
            className="w-12 bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan"
          >
            ⏸
          </Btn>
        ) : (
          <Btn
            onClick={onPlay}
            title="Play (Space)"
            disabled={currentStep === totalSteps - 1}
            className="w-12 bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan"
          >
            ▶
          </Btn>
        )}

        <Btn onClick={onNext}   title="Next (→)"        disabled={currentStep === totalSteps - 1}>→</Btn>
      </div>

      {/* Speed selector */}
      <div className="flex items-center gap-1">
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={[
              'font-mono text-[11px] px-2.5 py-1 rounded-md border transition-all duration-150',
              speed === s
                ? 'border-accent-cyan/50 text-accent-cyan bg-accent-cyan/10'
                : 'border-border-dim text-text-muted hover:border-accent-cyan/30 hover:text-text-primary',
            ].join(' ')}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
