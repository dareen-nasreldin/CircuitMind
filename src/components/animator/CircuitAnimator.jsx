import { useAnimationSequence } from '../../hooks/useAnimationSequence.js';
import AnimatedResistor      from './elements/AnimatedResistor.jsx';
import AnimatedVoltageSource from './elements/AnimatedVoltageSource.jsx';
import AnimatedCurrentSource from './elements/AnimatedCurrentSource.jsx';
import AnimatedWire          from './elements/AnimatedWire.jsx';
import AnimatedNode          from './elements/AnimatedNode.jsx';
import LoopArrow             from './elements/LoopArrow.jsx';
import AnimationStep         from './AnimationStep.jsx';
import AnimationControls     from './AnimationControls.jsx';
import StepTimeline          from './StepTimeline.jsx';

// Ground symbol
function GroundSymbol({ x, y }) {
  return (
    <g>
      <line x1={x} y1={y}    x2={x}    y2={y+10}  stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={x-12} y1={y+10} x2={x+12} y2={y+10}  stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={x-8}  y1={y+17} x2={x+8}  y2={y+17}  stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={x-4}  y1={y+24} x2={x+4}  y2={y+24}  stroke="var(--text-muted)" strokeWidth="1.5" />
    </g>
  );
}

// Terminal markers A/B for Thevenin/Norton sequences
function TerminalMarkers({ A, B }) {
  return (
    <g>
      {[A, B].map(term => (
        <g key={term.label}>
          <line
            x1={term.x - 4} y1={term.y}
            x2={term.x + 18} y2={term.y}
            stroke="var(--text-muted)" strokeWidth="1.2" strokeDasharray="4 3"
          />
          <circle cx={term.x - 4} cy={term.y} r="4"
            fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" />
          <text
            x={term.x + 22} y={term.y}
            fill="var(--accent-cyan)" fontSize="12"
            fontFamily="JetBrains Mono, monospace" dominantBaseline="middle"
          >
            {term.label}
          </text>
        </g>
      ))}
    </g>
  );
}

// Map element type → animated SVG component
function renderElement(el, hints, globalFade = false) {
  const highlighted      = hints.highlight?.includes(el.id)        ?? false;
  const faded            = globalFade || (hints.fadeOut?.includes(el.id) ?? false);
  const transformToShort = hints.transformToShort?.includes(el.id) ?? false;
  const transformToOpen  = hints.transformToOpen?.includes(el.id)  ?? false;

  const common = { key: el.id, id: el.id, x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2, value: el.value, unit: el.unit };

  switch (el.type) {
    case 'resistor':
      return <AnimatedResistor {...common} highlighted={highlighted} faded={faded} voltageDrop={hints.voltageDrops?.[el.id]} />;
    case 'voltage_source':
      return <AnimatedVoltageSource {...common} highlighted={highlighted} faded={faded} transformToShort={transformToShort} />;
    case 'current_source':
      return <AnimatedCurrentSource {...common} highlighted={highlighted} faded={faded} transformToOpen={transformToOpen} />;
    default:
      return null;
  }
}

// Norton equivalent overlay — rendered when hints.drawEquivalent.type === 'norton'
function NortonEquivalentOverlay({ iN, rN }) {
  const sx = 130, rx = 380, ytop = 95, ybot = 275;
  const iMa = Math.round(iN * 1000);
  return (
    <g className="step-enter">
      <AnimatedCurrentSource id="equiv-in" x1={sx} y1={ytop} x2={sx} y2={ybot}
        value={iMa} unit="mA" highlighted faded={false} transformToOpen={false} />
      <line x1={sx} y1={ytop} x2={rx} y2={ytop} stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <AnimatedResistor id="equiv-rn" x1={rx} y1={ytop} x2={rx} y2={ybot}
        value={rN} unit="Ω" highlighted faded={false} />
      <line x1={sx} y1={ybot} x2={rx} y2={ybot} stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <circle cx={rx} cy={ytop} r={5} fill="none" stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <circle cx={rx} cy={ybot} r={5} fill="none" stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <text x={rx + 16} y={ytop} fill="var(--accent-cyan)" fontSize="11"
        fontFamily="JetBrains Mono, monospace" dominantBaseline="middle">A</text>
      <text x={rx + 16} y={ybot} fill="var(--accent-cyan)" fontSize="11"
        fontFamily="JetBrains Mono, monospace" dominantBaseline="middle">B (GND)</text>
      <line x1={sx} y1={ybot} x2={sx} y2={ybot+10} stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={sx-10} y1={ybot+10} x2={sx+10} y2={ybot+10} stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={sx-6}  y1={ybot+16} x2={sx+6}  y2={ybot+16} stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={sx-2}  y1={ybot+22} x2={sx+2}  y2={ybot+22} stroke="var(--text-muted)" strokeWidth="1.5" />
    </g>
  );
}

// Thevenin equivalent circuit overlay — rendered when hints.drawEquivalent.type === 'thevenin'
function TheveninEquivalentOverlay({ vth, rth }) {
  const sx = 130, rx = 380, ytop = 95, ybot = 275;
  return (
    <g className="step-enter">
      <AnimatedVoltageSource id="equiv-vth" x1={sx} y1={ytop} x2={sx} y2={ybot}
        value={vth} unit="V" highlighted faded={false} transformToShort={false} />
      <line x1={sx} y1={ytop} x2={rx} y2={ytop} stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <AnimatedResistor id="equiv-rth" x1={rx} y1={ytop} x2={rx} y2={ybot}
        value={rth} unit="Ω" highlighted faded={false} />
      <line x1={sx} y1={ybot} x2={rx} y2={ybot} stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <circle cx={rx} cy={ytop} r={5} fill="none" stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <circle cx={rx} cy={ybot} r={5} fill="none" stroke="var(--accent-cyan)" strokeWidth="1.8" />
      <text x={rx + 16} y={ytop} fill="var(--accent-cyan)" fontSize="11"
        fontFamily="JetBrains Mono, monospace" dominantBaseline="middle">A (V_out)</text>
      <text x={rx + 16} y={ybot} fill="var(--accent-cyan)" fontSize="11"
        fontFamily="JetBrains Mono, monospace" dominantBaseline="middle">B (GND)</text>
      <line x1={sx} y1={ybot} x2={sx} y2={ybot+10} stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={sx-10} y1={ybot+10} x2={sx+10} y2={ybot+10} stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={sx-6}  y1={ybot+16} x2={sx+6}  y2={ybot+16} stroke="var(--text-muted)" strokeWidth="1.5" />
      <line x1={sx-2}  y1={ybot+22} x2={sx+2}  y2={ybot+22} stroke="var(--text-muted)" strokeWidth="1.5" />
    </g>
  );
}

export default function CircuitAnimator({ sequence, onBack }) {
  const { currentStep, totalSteps, isPlaying, speed, play, pause, next, prev, reset, jumpTo, setSpeed } =
    useAnimationSequence(sequence.steps, { stepDuration: 2500 });

  const step        = sequence.steps[currentStep];
  const hints       = step?.hints ?? {};
  const layout      = sequence.layout;
  const showEquiv   = !!hints.drawEquivalent;

  // KCL node highlight
  const kclNodeHighlighted = layout.kclNode && hints.highlight?.includes(layout.kclNode);

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-bg-surface border-b border-border-dim shrink-0">
        <button
          onClick={onBack}
          className="font-mono text-xs text-text-muted hover:text-accent-cyan transition-colors flex items-center gap-1.5"
        >
          ← All theorems
        </button>
        <span className="font-mono text-sm font-semibold text-text-primary">{sequence.title}</span>
        <span className="font-mono text-xs text-text-muted">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Left: SVG canvas + controls */}
        <div className="flex-1 flex flex-col min-w-0 bg-bg-primary">
          {/* SVG canvas */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            {/* Blueprint grid background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.25) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <svg
              viewBox={layout.viewBox}
              className="w-full h-full relative z-10"
              style={{ maxHeight: '420px' }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Arrowhead marker for current sources */}
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--text-muted)" />
                </marker>
                <marker id="arrowhead-cyan" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--accent-cyan)" />
                </marker>
              </defs>

              {/* Wires */}
              {layout.wires?.map(w => (
                <AnimatedWire
                  key={w.id}
                  {...w}
                  currentFlow={!showEquiv && (hints.showCurrentFlow ?? false)}
                  faded={showEquiv || (hints.fadeOut?.includes(w.id) ?? false)}
                />
              ))}

              {/* Circuit elements */}
              {layout.elements?.map(el => renderElement(el, hints, showEquiv))}

              {/* Thevenin equivalent overlay */}
              {showEquiv && hints.drawEquivalent.type === 'thevenin' && (
                <TheveninEquivalentOverlay
                  vth={hints.drawEquivalent.vth}
                  rth={hints.drawEquivalent.rth}
                />
              )}

              {/* Norton equivalent overlay */}
              {showEquiv && hints.drawEquivalent.type === 'norton' && (
                <NortonEquivalentOverlay
                  iN={hints.drawEquivalent.in}
                  rN={hints.drawEquivalent.rn}
                />
              )}

              {/* Short-circuit wire across terminals (Norton I_sc step) */}
              {hints.shortTerminals && layout.terminals && (
                <line
                  x1={layout.terminals.A.x - 4} y1={layout.terminals.A.y}
                  x2={layout.terminals.B.x - 4} y2={layout.terminals.B.y}
                  stroke="var(--accent-cyan)" strokeWidth="2.5"
                  className="step-enter"
                />
              )}

              {/* Nodes */}
              {layout.nodes?.map(n => (
                <AnimatedNode
                  key={n.id}
                  {...n}
                  step={step}
                  terminal={n.terminal ?? false}
                  highlighted={hints.highlight?.includes(n.id) ?? false}
                  showVoltage={hints.showVoltages ?? false}
                />
              ))}

              {/* Ground symbols */}
              {layout.groundPoints?.map((pt, i) => (
                <GroundSymbol key={i} x={pt.x} y={pt.y} />
              ))}

              {/* Terminal markers (Thevenin / Norton / Voltage Divider) */}
              {layout.terminals && (
                <TerminalMarkers A={layout.terminals.A} B={layout.terminals.B} />
              )}

              {/* KVL / current loop arrow */}
              {layout.loopArrow && hints.showCurrentFlow && (
                <LoopArrow
                  cx={layout.loopArrow.cx}
                  cy={layout.loopArrow.cy}
                  r={layout.loopArrow.r}
                  label={hints.currentLabel ?? 'I'}
                />
              )}

              {/* KCL node highlight ring — visible when node is highlighted OR current is flowing */}
              {layout.kclNode && (hints.highlight?.includes(layout.kclNode) || hints.showCurrentFlow) && (() => {
                const nodeData = layout.nodes?.find(n => n.id === layout.kclNode);
                return nodeData ? (
                  <circle
                    cx={nodeData.x} cy={nodeData.y} r="14"
                    fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5"
                    strokeDasharray="4 3" opacity="0.7"
                    className="step-enter"
                  />
                ) : null;
              })()}

              {/* KCL branch-current directional arrows — shown when current flow is active */}
              {layout.kclArrows && hints.showCurrentFlow && layout.kclArrows.map(arrow => {
                const mx = (arrow.x1 + arrow.x2) / 2;
                const my = (arrow.y1 + arrow.y2) / 2;
                const label = hints.branchCurrentLabels?.[arrow.id];
                return (
                  <g key={arrow.id} className="step-enter">
                    <line
                      x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2}
                      stroke="var(--accent-cyan)" strokeWidth="1.5"
                      markerEnd="url(#arrowhead-cyan)"
                    />
                    {label && (
                      <text
                        x={arrow.horizontal ? mx : mx + 16}
                        y={arrow.horizontal ? my - 6 : my}
                        fill="var(--accent-cyan)"
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Generic text annotations — shown when present in hints */}
              {hints.textAnnotations?.map(a => (
                <text
                  key={a.id}
                  x={a.x} y={a.y}
                  fill={a.color ?? 'var(--accent-cyan)'}
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="step-enter"
                >
                  {a.text}
                </text>
              ))}

              {/* Superposition Step 4: per-node summation labels */}
              {hints.sumAnnotations?.map(ann => {
                const nd = layout.nodes?.find(n => n.id === ann.nodeId);
                if (!nd) return null;
                return (
                  <text
                    key={`sum-${ann.nodeId}`}
                    x={nd.x + 10} y={nd.y + 28}
                    fill="var(--accent-yellow)"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    className="step-enter"
                  >
                    {ann.text}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Timeline + Controls */}
          <div className="px-5 pb-4 bg-bg-surface border-t border-border-dim shrink-0">
            <StepTimeline
              steps={sequence.steps}
              currentStep={currentStep}
              onJump={jumpTo}
            />
            <AnimationControls
              isPlaying={isPlaying}
              speed={speed}
              onPlay={play}
              onPause={pause}
              onNext={next}
              onPrev={prev}
              onReset={reset}
              onSpeedChange={setSpeed}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>
        </div>

        {/* Right: Step card */}
        <div className="w-72 xl:w-80 border-l border-border-dim bg-bg-surface overflow-y-auto shrink-0">
          <AnimationStep
            step={step}
            stepIndex={currentStep}
            totalSteps={totalSteps}
          />
        </div>
      </div>
    </div>
  );
}
