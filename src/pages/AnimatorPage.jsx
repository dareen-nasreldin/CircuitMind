import { useState } from 'react';
import CircuitAnimator from '../components/animator/CircuitAnimator.jsx';

// Lazy-import all sequences
import thevenin      from '../components/animator/sequences/thevenin.js';
import norton        from '../components/animator/sequences/norton.js';
import kvl           from '../components/animator/sequences/kvl.js';
import kcl           from '../components/animator/sequences/kcl.js';
import superposition from '../components/animator/sequences/superposition.js';
import series        from '../components/animator/sequences/seriesCircuit.js';
import parallel      from '../components/animator/sequences/parallelCircuit.js';
import vdivider      from '../components/animator/sequences/voltageDivider.js';
import ohmsLaw       from '../components/animator/sequences/ohmsLaw.js';

const SEQUENCES = {
  ohmsLaw:       ohmsLaw,
  series:        series,
  parallel:      parallel,
  voltageDivider: vdivider,
  kvl:           kvl,
  kcl:           kcl,
  superposition: superposition,
  thevenin:      thevenin,
  norton:        norton,
};

const CARDS = [
  { id: 'ohmsLaw',       difficulty: 'Beginner',     color: 'accent-green',  icon: OhmsIcon },
  { id: 'series',        difficulty: 'Beginner',     color: 'accent-green',  icon: SeriesIcon },
  { id: 'parallel',      difficulty: 'Beginner',     color: 'accent-green',  icon: ParallelIcon },
  { id: 'voltageDivider',difficulty: 'Beginner',     color: 'accent-green',  icon: VDivIcon },
  { id: 'kvl',           difficulty: 'Intermediate', color: 'accent-yellow', icon: KVLIcon },
  { id: 'kcl',           difficulty: 'Intermediate', color: 'accent-yellow', icon: KCLIcon },
  { id: 'superposition', difficulty: 'Advanced',     color: 'accent-red',    icon: SuperIcon },
  { id: 'thevenin',      difficulty: 'Advanced',     color: 'accent-red',    icon: ThevIcon },
  { id: 'norton',        difficulty: 'Advanced',     color: 'accent-red',    icon: NortonIcon },
];

const DIFF_STYLE = {
  Beginner:     'text-accent-green  border-accent-green/40  bg-accent-green/5',
  Intermediate: 'text-accent-yellow border-accent-yellow/40 bg-accent-yellow/5',
  Advanced:     'text-accent-red    border-accent-red/40    bg-accent-red/5',
};

/* ─── Tiny SVG preview icons ───────────────────────────────────────────────── */

function OhmsIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="20" x2="15" y2="20"/><circle cx="20" cy="20" r="5"/>
      <polyline points="25,20 28,14 31,26 34,14 37,26 40,14 43,26 46,20"/>
      <line x1="46" y1="20" x2="55" y2="20"/>
    </svg>
  );
}
function SeriesIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="10" x2="10" y2="10"/>
      <polyline points="10,10 12,6 14,14 16,6 18,14 20,10"/>
      <line x1="20" y1="10" x2="25" y2="10"/>
      <polyline points="25,10 27,6 29,14 31,6 33,14 35,10"/>
      <line x1="35" y1="10" x2="40" y2="10"/>
      <line x1="40" y1="10" x2="40" y2="30"/><line x1="5" y1="30" x2="40" y2="30"/>
      <circle cx="12" cy="30" r="6"/><line x1="12" y1="24" x2="12" y2="36"/>
      <line x1="5" y1="10" x2="5" y2="24"/>
    </svg>
  );
}
function ParallelIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="5" x2="55" y2="5"/><line x1="5" y1="35" x2="55" y2="35"/>
      <circle cx="15" cy="20" r="5"/><line x1="15" y1="5" x2="15" y2="15"/><line x1="15" y1="25" x2="15" y2="35"/>
      <polyline points="30,5 32,12 34,28 36,12 38,28 40,20"/><line x1="30" y1="20" x2="30" y2="5"/>
      <polyline points="50,5 52,12 53,28 54,12 55,28"/><line x1="50" y1="20" x2="50" y2="35"/>
    </svg>
  );
}
function VDivIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="20" r="6"/><line x1="12" y1="5" x2="12" y2="14"/><line x1="12" y1="26" x2="12" y2="35"/>
      <line x1="12" y1="5" x2="40" y2="5"/>
      <polyline points="40,5 42,11 44,19 46,11 48,19 50,14"/>
      <line x1="50" y1="14" x2="50" y2="26"/>
      <polyline points="40,35 42,29 44,21 46,29 48,21 50,26"/>
      <line x1="12" y1="35" x2="40" y2="35"/>
      <line x1="45" y1="20" x2="58" y2="20" strokeDasharray="3 2"/>
    </svg>
  );
}
function KVLIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="8" width="44" height="24" rx="2" strokeDasharray="none"/>
      <path d="M 30 20 A 12 9 0 1 1 29.9 20" stroke="var(--accent-cyan)" strokeWidth="1" markerEnd="url(#kv)"/>
      <defs><marker id="kv" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5Z" fill="currentColor"/></marker></defs>
    </svg>
  );
}
function KCLIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="30" cy="20" r="5" fill="var(--accent-cyan)" fillOpacity="0.3"/>
      <line x1="5" y1="20" x2="25" y2="20"/><line x1="35" y1="20" x2="55" y2="20"/>
      <line x1="30" y1="5" x2="30" y2="15"/><line x1="30" y1="25" x2="30" y2="35"/>
    </svg>
  );
}
function SuperIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="20" r="5"/><circle cx="50" cy="20" r="5"/>
      <line x1="5" y1="20" x2="5" y2="5"/><line x1="5" y1="5" x2="55" y2="5"/>
      <line x1="55" y1="5" x2="55" y2="20"/><line x1="5" y1="35" x2="55" y2="35"/>
      <polyline points="15,5 17,11 19,19 21,11 23,19 25,12" opacity="0.5"/>
    </svg>
  );
}
function ThevIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="20" r="6"/><line x1="10" y1="5" x2="10" y2="14"/><line x1="10" y1="26" x2="10" y2="35"/>
      <line x1="10" y1="5" x2="40" y2="5"/>
      <polyline points="40,5 42,11 44,19 46,11 48,19 50,12"/>
      <line x1="50" y1="12" x2="50" y2="28"/>
      <line x1="10" y1="35" x2="50" y2="35"/>
      <line x1="50" y1="20" x2="58" y2="20"/><line x1="50" y1="28" x2="58" y2="28"/>
    </svg>
  );
}
function NortonIcon() {
  return (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="20" r="6"/><line x1="8" y1="20" x2="12" y2="20"/>
      <line x1="10" y1="5" x2="10" y2="14"/><line x1="10" y1="26" x2="10" y2="35"/>
      <line x1="10" y1="5" x2="40" y2="5"/>
      <line x1="40" y1="5" x2="40" y2="35"/><line x1="10" y1="35" x2="40" y2="35"/>
      <polyline points="40,5 42,11 44,19 46,11 48,19 50,12"/>
      <line x1="50" y1="12" x2="50" y2="28"/><line x1="40" y1="20" x2="50" y2="20"/>
    </svg>
  );
}

/* ─── Selector grid ─────────────────────────────────────────────────────────── */

function SelectorGrid({ onSelect }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-primary px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-mono font-bold text-2xl text-text-primary mb-2">
            Circuit Animator
          </h1>
          <p className="font-sans text-sm text-text-muted">
            Select a theorem to watch it animate step-by-step on a live SVG canvas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map(({ id, difficulty, color, icon: Icon }) => {
            const seq = SEQUENCES[id];
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className="group text-left bg-bg-surface border border-border-dim rounded-xl p-5 hover:border-accent-cyan/30 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-accent-cyan/40"
              >
                {/* Icon */}
                <div className={`w-12 h-8 mb-3 text-${color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <Icon />
                </div>

                {/* Difficulty badge */}
                <span className={`inline-block font-mono text-[0.6rem] font-semibold tracking-widest border px-2 py-0.5 rounded mb-2 ${DIFF_STYLE[difficulty]}`}>
                  {difficulty.toUpperCase()}
                </span>

                {/* Title */}
                <h2 className="font-mono font-semibold text-sm text-text-primary mb-1.5 group-hover:text-accent-cyan transition-colors">
                  {seq.title}
                </h2>

                {/* Description */}
                <p className="font-sans text-xs text-text-muted leading-relaxed mb-3">
                  {seq.description}
                </p>

                {/* Step count */}
                <span className="font-mono text-[10px] text-text-muted">
                  {seq.steps.length} animation steps  ·  Animate →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function AnimatorPage() {
  const [selectedId, setSelectedId] = useState(null);

  if (!selectedId) {
    return <SelectorGrid onSelect={setSelectedId} />;
  }

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <CircuitAnimator
        key={selectedId}
        sequence={SEQUENCES[selectedId]}
        onBack={() => setSelectedId(null)}
      />
    </div>
  );
}
