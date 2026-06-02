// KVL mesh-loop arrow — clockwise arc drawn inside the circuit rectangle
export default function LoopArrow({ cx, cy, r = 55, label = 'I' }) {
  // Partial circle (clockwise, 300° arc) with an arrowhead at the end
  const startAngle = -90 * (Math.PI / 180);  // top
  const endAngle   = 210 * (Math.PI / 180);  // 300° clockwise from top

  const sx = cx + r * Math.cos(startAngle);
  const sy = cy + r * Math.sin(startAngle);
  const ex = cx + r * Math.cos(endAngle);
  const ey = cy + r * Math.sin(endAngle);

  const d = `M ${sx.toFixed(1)},${sy.toFixed(1)} A ${r},${r} 0 1 1 ${ex.toFixed(1)},${ey.toFixed(1)}`;

  return (
    <g className="step-enter" opacity="0.8">
      <defs>
        <marker id="loop-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent-cyan)" />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="var(--accent-cyan)"
        strokeWidth="1.5"
        strokeDasharray="6 3"
        markerEnd="url(#loop-arrow)"
      />
      {label && (
        <text x={cx} y={cy} fill="var(--accent-cyan)" fontSize="12"
          fontFamily="JetBrains Mono, monospace" textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      )}
    </g>
  );
}
