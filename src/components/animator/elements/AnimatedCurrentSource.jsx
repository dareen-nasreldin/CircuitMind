// Current source: circle with arrow inside, between two terminals
export default function AnimatedCurrentSource({
  x1, y1, x2, y2, value, unit = 'A', id,
  highlighted = false, faded = false, transformToOpen = false,
}) {
  const dx  = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux  = dx / len, uy = dy / len;
  const r   = Math.min(24, len / 2.8);

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const topEx = mx - ux * r, topEy = my - uy * r;
  const botEx = mx + ux * r, botEy = my + uy * r;

  const isHoriz = Math.abs(dx) > Math.abs(dy);
  const labelX  = isHoriz ? mx : mx + r + 14;
  const labelY  = isHoriz ? my - r - 10 : my;

  const stroke  = highlighted ? 'var(--accent-cyan)' : 'var(--text-muted)';
  const opacity = faded || transformToOpen ? 0.1 : 1;

  // Arrow inside circle (pointing from x1→x2 direction)
  const arrLen  = r * 0.65;
  const arrX1   = mx - ux * arrLen, arrY1 = my - uy * arrLen;
  const arrX2   = mx + ux * arrLen, arrY2 = my + uy * arrLen;

  return (
    <g opacity={opacity} className="transition-opacity duration-500">
      <line x1={x1} y1={y1} x2={topEx} y2={topEy} stroke={stroke} strokeWidth="1.8" />
      <line x1={x2} y1={y2} x2={botEx} y2={botEy} stroke={stroke} strokeWidth="1.8" />
      <circle cx={mx} cy={my} r={r} stroke={stroke} strokeWidth="1.8" fill="none" />
      {/* Arrow shaft */}
      <line x1={arrX1} y1={arrY1} x2={arrX2} y2={arrY2} stroke={stroke} strokeWidth="1.5"
        markerEnd="url(#arrowhead)" />
      {value !== null && value !== undefined && (
        <text x={labelX} y={labelY} fill="var(--accent-cyan)" fontSize="11"
          fontFamily="JetBrains Mono, monospace" textAnchor="middle" dominantBaseline="middle">
          {value} {unit}
        </text>
      )}
    </g>
  );
}
