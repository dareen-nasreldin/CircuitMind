// Floating voltage annotation on the canvas
export default function VoltageLabel({ x, y, text, color = 'var(--accent-yellow)' }) {
  return (
    <g className="step-enter">
      <rect
        x={x - 4} y={y - 12}
        width={text.length * 7 + 8} height={18}
        fill="var(--bg-surface)" opacity="0.85" rx="3"
      />
      <text
        x={x} y={y}
        fill={color}
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        dominantBaseline="middle"
      >
        {text}
      </text>
    </g>
  );
}
