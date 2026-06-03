// Node dot — responds to highlight hints and shows voltage when showVoltage prop is true
export default function AnimatedNode({
  id, x, y, label = null, terminal = false, step = null, highlighted = false, showVoltage = false,
}) {
  const voltage    = step?.graphState?.nodes?.[id]?.voltage;
  const showVoltage_ = showVoltage && voltage !== null && voltage !== undefined;

  return (
    <g>
      {/* Highlight ring — pulsing halo around highlighted node */}
      {highlighted && (
        <circle
          cx={x} cy={y} r={13}
          fill="var(--accent-cyan)" fillOpacity="0.15"
          stroke="var(--accent-cyan)" strokeWidth="1.2" strokeOpacity="0.5"
          className="step-enter"
        />
      )}

      {/* Node dot */}
      <circle
        cx={x} cy={y}
        r={terminal ? 5 : 4}
        fill={highlighted ? 'var(--accent-cyan)' : (terminal ? 'none' : 'var(--text-muted)')}
        stroke={terminal ? 'var(--accent-cyan)' : 'none'}
        strokeWidth="1.5"
        className="transition-all duration-300"
      />

      {/* Label */}
      {label && (
        <text
          x={x + 8} y={y - 8}
          fill={highlighted ? 'var(--accent-cyan)' : 'var(--text-muted)'}
          fontSize="11"
          fontFamily="JetBrains Mono, monospace"
          className="transition-colors duration-300"
        >
          {label}
        </text>
      )}

      {/* Voltage annotation (shown only when showVoltage hint is active) */}
      {showVoltage_ && (
        <text
          x={x + 8} y={y + 18}
          fill="var(--accent-yellow)"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
          className="step-enter"
        >
          {Number(voltage).toFixed(2)} V
        </text>
      )}
    </g>
  );
}
