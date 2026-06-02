// Animated current-flow arrow along a wire segment
export default function CurrentArrow({ x1, y1, x2, y2 }) {
  const dx  = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux  = dx / len, uy = dy / len;

  // Arrowhead near the midpoint
  const mx = x1 + ux * len * 0.6;
  const my = y1 + uy * len * 0.6;
  const hw = 7, hl = 12;
  const px = -uy, py = ux;

  const tip  = [mx + ux * hl, my + uy * hl];
  const left = [mx + px * hw, my + py * hw];
  const rght = [mx - px * hw, my - py * hw];
  const pts  = [tip, left, rght].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <g className="step-enter" opacity="0.85">
      <polygon points={pts} fill="var(--accent-cyan)" />
    </g>
  );
}
