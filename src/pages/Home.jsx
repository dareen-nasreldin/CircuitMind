import { Link } from 'react-router-dom';

const FEATURES = [
  {
    to: '/animator',
    label: 'Circuit Animator',
    badge: 'HERO FEATURE',
    badgeColor: 'text-accent-cyan border-accent-cyan/40',
    description: 'Watch circuits transform step-by-step. Thevenin, KVL, KCL, Superposition — animated in real time.',
    icon: AnimatorIcon,
    cta: 'Watch it animate →',
    ctaColor: 'text-accent-cyan hover:text-accent-cyan/80',
  },
  {
    to: '/tutor',
    label: 'Circuit Tutor',
    badge: 'AI-POWERED',
    badgeColor: 'text-accent-green border-accent-green/40',
    description: 'Describe any circuit problem and get a structured step-by-step solution with formulas and explanations.',
    icon: TutorIcon,
    cta: 'Ask the tutor →',
    ctaColor: 'text-accent-green hover:text-accent-green/80',
  },
  {
    to: '/builder',
    label: 'Circuit Builder',
    badge: 'INTERACTIVE',
    badgeColor: 'text-accent-yellow border-accent-yellow/40',
    description: 'Drag and drop resistors, voltage sources, and wires onto a live canvas. See voltages and currents update instantly.',
    icon: BuilderIcon,
    cta: 'Start building →',
    ctaColor: 'text-accent-yellow hover:text-accent-yellow/80',
  },
  {
    to: '/quiz',
    label: 'Adaptive Quiz',
    badge: 'PRACTICE',
    badgeColor: 'text-accent-red border-accent-red/40',
    description: 'Test your knowledge with graded problems. Weak areas surface animations to re-teach the concept.',
    icon: QuizIcon,
    cta: 'Take a quiz →',
    ctaColor: 'text-accent-red hover:text-accent-red/80',
  },
];

function AnimatorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="20" height="16" rx="2" className="stroke-accent-cyan" strokeWidth="1.5" />
      <path d="M8 16 L14 11 L14 21 Z" className="fill-accent-cyan" />
      <line x1="24" y1="12" x2="30" y2="12" className="stroke-accent-cyan" strokeWidth="1.5" />
      <line x1="24" y1="16" x2="30" y2="16" className="stroke-accent-cyan" strokeWidth="1.5" />
      <line x1="24" y1="20" x2="30" y2="20" className="stroke-accent-cyan" strokeWidth="1.5" />
    </svg>
  );
}

function TutorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="22" height="16" rx="2" className="stroke-accent-green" strokeWidth="1.5" />
      <line x1="6" y1="10" x2="18" y2="10" className="stroke-accent-green" strokeWidth="1.5" />
      <line x1="6" y1="14" x2="14" y2="14" className="stroke-accent-green" strokeWidth="1.5" />
      <path d="M4 20 L8 24 L2 26 Z" className="fill-accent-green" />
      <circle cx="26" cy="10" r="4" className="stroke-accent-green fill-none" strokeWidth="1.5" />
      <line x1="26" y1="8" x2="26" y2="12" className="stroke-accent-green" strokeWidth="1.5" />
      <line x1="24" y1="10" x2="28" y2="10" className="stroke-accent-green" strokeWidth="1.5" />
    </svg>
  );
}

function BuilderIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="16" x2="8" y2="16" className="stroke-accent-yellow" strokeWidth="1.5" />
      <rect x="8" y="12" width="4" height="8" rx="1" className="stroke-accent-yellow fill-none" strokeWidth="1.5" />
      <line x1="12" y1="16" x2="16" y2="16" className="stroke-accent-yellow" strokeWidth="1.5" />
      <path d="M16 12 L16 20 M18 13 L18 19 M20 14 L20 18" className="stroke-accent-yellow" strokeWidth="1.5" />
      <line x1="22" y1="16" x2="30" y2="16" className="stroke-accent-yellow" strokeWidth="1.5" />
      <circle cx="2" cy="16" r="2" className="fill-accent-yellow" />
      <circle cx="30" cy="16" r="2" className="stroke-accent-yellow fill-none" strokeWidth="1.5" />
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="20" height="26" rx="2" className="stroke-accent-red fill-none" strokeWidth="1.5" />
      <line x1="8" y1="9"  x2="20" y2="9"  className="stroke-accent-red" strokeWidth="1.5" />
      <line x1="8" y1="14" x2="16" y2="14" className="stroke-accent-red" strokeWidth="1.5" />
      <line x1="8" y1="19" x2="20" y2="19" className="stroke-accent-red" strokeWidth="1.5" />
      <circle cx="22" cy="22" r="6" className="fill-bg-surface stroke-accent-red" strokeWidth="1.5" />
      <line x1="22" y1="19" x2="22" y2="22" className="stroke-accent-red" strokeWidth="1.5" />
      <circle cx="22" cy="24.5" r="0.8" className="fill-accent-red" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-primary">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center bg-grid-cyan bg-grid">
        {/* Radial fade over grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, var(--bg-primary) 80%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-accent-cyan border border-accent-cyan/30 bg-accent-cyan/5 px-3 py-1 rounded-full mb-6">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            FREE MVP — NO API KEY REQUIRED
          </span>

          <h1 className="font-mono font-bold text-5xl text-text-primary mb-4 tracking-tight">
            Circuit<span className="text-accent-cyan">Mind</span>
          </h1>

          <p className="font-sans text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            Understand electrical circuits through{' '}
            <span className="text-text-primary font-medium">animated step-by-step solving</span>.
            Watch Thevenin transformations, KVL loops, and Superposition unfold in real time.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/animator"
              className="inline-flex items-center gap-2 font-mono text-sm font-semibold bg-accent-cyan text-bg-primary px-5 py-2.5 rounded-lg hover:bg-accent-cyan/90 transition-colors no-underline"
            >
              Watch it animate
            </Link>
            <Link
              to="/tutor"
              className="inline-flex items-center gap-2 font-mono text-sm font-medium border border-border-dim text-text-muted px-5 py-2.5 rounded-lg hover:border-accent-cyan/40 hover:text-text-primary transition-colors no-underline"
            >
              Ask the tutor
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ to, label, badge, badgeColor, description, icon: Icon, cta, ctaColor }) => (
            <Link
              key={to}
              to={to}
              className="group block no-underline bg-bg-surface border border-border-dim rounded-xl p-5 hover:border-accent-cyan/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div className="mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                <Icon />
              </div>

              {/* Badge */}
              <span className={`inline-block font-mono text-[0.65rem] font-semibold tracking-widest border px-2 py-0.5 rounded mb-2 ${badgeColor}`}>
                {badge}
              </span>

              <h2 className="font-mono font-semibold text-sm text-text-primary mb-2">
                {label}
              </h2>

              <p className="font-sans text-xs text-text-muted leading-relaxed mb-4">
                {description}
              </p>

              <span className={`font-mono text-xs font-medium transition-colors ${ctaColor}`}>
                {cta}
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center font-mono text-xs text-text-muted">
          Built with a custom{' '}
          <span className="text-accent-cyan">MNA circuit solver</span>
          {' '}+{' '}
          <span className="text-accent-cyan">graph-based engine</span>
          {' '}— the same algorithm used by SPICE simulators.
        </p>
      </section>
    </div>
  );
}
