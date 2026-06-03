import { useMemo } from 'react';

// Compute zigzag polyline points for any orientation using rotation matrix
function zigzagPoints(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 2) return `${x1},${y1}`;

  const ux = dx / len, uy = dy / len; // unit along element
  const px = -uy,      py = ux;       // unit perpendicular

  const lead   = len * 0.24;
  const body   = len - 2 * lead;
  const amp    = Math.min(9, body / 8);
  const peaks  = 6;
  const segW   = body / peaks;

  const pts = [
    [x1, y1],
    [x1 + ux * lead, y1 + uy * lead],
  ];

  for (let i = 0; i < peaks; i++) {
    const t    = lead + (i + 0.5) * segW;
    const sign = i % 2 === 0 ? 1 : -1;
    pts.push([x1 + ux * t + px * sign * amp, y1 + uy * t + py * sign * amp]);
  }

  pts.push([x1 + ux * (len - lead), y1 + uy * (len - lead)]);
  pts.push([x2, y2]);

  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

export default function AnimatedResistor({ x1, y1, x2, y2, value, unit, id, highlighted = false, faded = false, voltageDrop }) {
  const points = useMemo(() => zigzagPoints(x1, y1, x2, y2), [x1, y1, x2, y2]);

  const isHoriz = Math.abs(x2 - x1) >= Math.abs(y2 - y1);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Label offset: above for horizontal, right for vertical
  const lx = isHoriz ? mx      : mx + 22;
  const ly = isHoriz ? my - 18 : my;

  const stroke = highlighted ? 'var(--accent-cyan)' : 'var(--text-muted)';

  return (
    <g
      opacity={faded ? 0.15 : 1}
      className={`transition-all duration-500 ${highlighted ? 'glow-cyan' : ''}`}
    >
      <polyline
        points={points}
        stroke={stroke}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {value !== null && value !== undefined && (
        <text
          x={lx} y={ly}
          fill={highlighted ? 'var(--accent-cyan)' : 'var(--text-muted)'}
          fontSize="11"
          fontFamily="JetBrains Mono, monospace"
          textAnchor="middle"
          dominantBaseline="middle"
          className="transition-colors duration-300"
          style={{ fontVariantNumeric: 'normal' }}
        >
          {`${value} ${unit ?? ''}`}
        </text>
      )}
      {voltageDrop !== undefined && voltageDrop !== null && (
        <text
          x={lx} y={isHoriz ? ly + 13 : ly + 14}
          fill="var(--accent-yellow)"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
          textAnchor="middle"
          dominantBaseline="middle"
          className="step-enter"
          style={{ fontVariantNumeric: 'normal' }}
        >
          {voltageDrop} V
        </text>
      )}
    </g>
  );
}
