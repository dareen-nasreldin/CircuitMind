import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     end: true  },
  { to: '/animator', label: 'Animator', end: false },
  { to: '/tutor',    label: 'Tutor',    end: false },
  { to: '/builder',  label: 'Builder',  end: false },
  { to: '/quiz',     label: 'Quiz',     end: false },
];

function ChipIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="7" y="7" width="12" height="12" rx="2"
        className="stroke-accent-cyan fill-none"
        strokeWidth="1.5"
      />
      {/* Connection leads */}
      <line x1="1" y1="13" x2="7"  y2="13" className="stroke-accent-cyan" strokeWidth="1.5" />
      <line x1="19" y1="13" x2="25" y2="13" className="stroke-accent-cyan" strokeWidth="1.5" />
      <line x1="13" y1="1"  x2="13" y2="7"  className="stroke-accent-cyan" strokeWidth="1.5" />
      <line x1="13" y1="19" x2="13" y2="25" className="stroke-accent-cyan" strokeWidth="1.5" />
      {/* Terminal dots */}
      <circle cx="1"  cy="13" r="1.5" className="fill-accent-cyan" />
      <circle cx="25" cy="13" r="1.5" className="fill-accent-cyan" />
      <circle cx="13" cy="1"  r="1.5" className="fill-accent-cyan" />
      <circle cx="13" cy="25" r="1.5" className="fill-accent-cyan" />
      {/* Center node */}
      <circle cx="13" cy="13" r="2.5" className="fill-accent-cyan" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-14 bg-bg-surface border-b border-border-dim flex items-center justify-between px-6">
      {/* Logo */}
      <NavLink
        to="/"
        className="flex items-center gap-2.5 no-underline select-none"
        aria-label="CircuitMind home"
      >
        <ChipIcon />
        <span className="font-mono font-bold text-[1.05rem] tracking-tight">
          <span className="text-accent-cyan">Circuit</span>
          <span className="text-text-primary">Mind</span>
        </span>
      </NavLink>

      {/* Nav links */}
      <div className="flex items-center gap-0.5">
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'font-mono text-[0.78rem] font-medium px-3.5 py-1.5 rounded-md',
                'transition-all duration-150 no-underline',
                isActive
                  ? 'text-accent-cyan bg-accent-cyan/10'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated',
              ].join(' ')
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
