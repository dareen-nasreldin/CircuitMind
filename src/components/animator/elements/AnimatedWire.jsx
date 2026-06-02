// Wire between (x1,y1) and (x2,y2)
// currentFlow: animated marching dashes (CSS animation from index.css)
// erasing: reverse stroke-dashoffset animation
export default function AnimatedWire({ id, x1, y1, x2, y2, currentFlow = false, erasing = false, faded = false }) {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  let className = 'transition-opacity duration-500';
  if (currentFlow) className += ' current-flow';
  if (erasing)     className += ' wire-erase';

  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={currentFlow ? 'var(--accent-cyan)' : 'var(--text-muted)'}
      strokeWidth={currentFlow ? '2' : '1.8'}
      strokeLinecap="round"
      opacity={faded ? 0.15 : 1}
      strokeDasharray={erasing ? len : undefined}
      strokeDashoffset={erasing ? 0 : undefined}
      className={className}
    />
  );
}
