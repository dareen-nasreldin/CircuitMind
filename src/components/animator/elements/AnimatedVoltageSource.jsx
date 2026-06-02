// Voltage source drawn as a circle between two terminals
// transformToShort: circle fades, wire draws in (Thevenin deactivation step)
export default function AnimatedVoltageSource({
  x1, y1, x2, y2, value, unit = 'V', id,
  highlighted = false, faded = false, transformToShort = false,
}) {
  const dx  = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux  = dx / len, uy = dy / len;
  const r   = Math.min(24, len / 2.8);

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  // Circle edge points (where leads meet the circle)
  const topEx = mx - ux * r, topEy = my - uy * r;
  const botEx = mx + ux * r, botEy = my + uy * r;

  const isHoriz = Math.abs(dx) > Math.abs(dy);
  // + and − label offsets inside circle
  const plusX  = mx - ux * r * 0.45;
  const plusY  = my - uy * r * 0.45;
  const minusX = mx + ux * r * 0.45;
  const minusY = my + uy * r * 0.45;

  // Value label: to the side of the circle
  const labelX = isHoriz ? mx      : mx + r + 14;
  const labelY = isHoriz ? my - r - 10 : my;

  const stroke   = highlighted ? 'var(--accent-cyan)' : 'var(--text-muted)';
  const bodyOpac = faded ? 0.15 : (transformToShort ? 0 : 1);
  const leadOpac = faded ? 0.15 : 1;

  return (
    <g className="transition-all duration-500">
      {/* Lead wires to circle edge */}
      <line x1={x1} y1={y1} x2={topEx} y2={topEy} stroke={stroke} strokeWidth="1.8" opacity={leadOpac} />
      <line x1={x2} y1={y2} x2={botEx} y2={botEy} stroke={stroke} strokeWidth="1.8" opacity={leadOpac} />

      {/* Circle body — fades when short-circuited */}
      <g opacity={bodyOpac} className="transition-opacity duration-500">
        <circle cx={mx} cy={my} r={r} stroke={stroke} strokeWidth="1.8" fill="none" />
        <text x={plusX}  y={plusY}  fill={stroke} fontSize="13" fontWeight="700" textAnchor="middle" dominantBaseline="middle">+</text>
        <text x={minusX} y={minusY} fill={stroke} fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="middle">−</text>
        {value !== null && value !== undefined && (
          <text
            x={labelX} y={labelY}
            fill="var(--accent-yellow)"
            fontSize="11" fontFamily="JetBrains Mono, monospace"
            textAnchor="middle" dominantBaseline="middle"
          >
            {value} {unit}
          </text>
        )}
      </g>

      {/* Short-circuit wire — animates in when transformToShort */}
      {transformToShort && (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--accent-red)" strokeWidth="2.5"
          className="wire-draw"
        />
      )}
      {transformToShort && (
        <text x={mx + (isHoriz ? 0 : 30)} y={my + (isHoriz ? -14 : 0)}
          fill="var(--accent-red)" fontSize="10" fontFamily="JetBrains Mono, monospace"
          textAnchor="middle" className="step-enter">
          Short
        </text>
      )}
    </g>
  );
}
