// Thevenin: vs1=12V, R1=100Ω, R2=200Ω, RL=100Ω
// V_th = 8V,  R_th = 100‖200 = 200/3 ≈ 66.67Ω

const baseHints = {
  fadeOut: [], transformToShort: [], transformToOpen: [],
  showCurrentFlow: false, drawEquivalent: null, bracket: null,
};

export default {
  id: 'thevenin',
  title: "Thevenin's Theorem",
  difficulty: 'Advanced',
  description: 'Simplify any linear circuit to one voltage source + one series resistor.',
  steps: [
    {
      id: 0,
      title: 'Starting Circuit',
      formula: null,
      calculation: 'V_s = 12\\text{ V},\\quad R_1 = 100\\text{ }\\Omega,\\quad R_2 = 200\\text{ }\\Omega,\\quad R_L = 100\\text{ }\\Omega',
      explanation: 'This is the original circuit with load R_L connected at terminals A–B. We will find the Thevenin equivalent seen from those terminals.',
      graphState: null,
      hints: { ...baseHints, highlight: ['rl', 'w-term-top', 'w-term-bot'] },
    },
    {
      id: 1,
      title: 'Remove the Load Resistor',
      formula: null,
      calculation: null,
      explanation: 'Disconnect R_L from terminals A–B. We now have an open circuit at the terminals and will find V_oc.',
      graphState: null,
      hints: { ...baseHints, highlight: [], fadeOut: ['rl', 'w-term-top', 'w-term-bot'] },
    },
    {
      id: 2,
      title: 'Turn Off Independent Sources',
      formula: '\\text{Voltage source} \\rightarrow \\text{short circuit}',
      calculation: null,
      explanation: 'To find R_th, deactivate all independent sources. Voltage sources become short circuits (wires).',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: [],
        fadeOut: ['rl', 'w-term-top', 'w-term-bot'],
        transformToShort: ['vs1'],
      },
    },
    {
      id: 3,
      title: 'Find R_Thevenin',
      formula: 'R_{th} = R_1 \\,\\|\\, R_2 = \\dfrac{R_1 R_2}{R_1 + R_2}',
      calculation: 'R_{th} = \\dfrac{100 \\times 200}{100 + 200} = \\dfrac{200}{3} \\approx 66.67\\text{ }\\Omega',
      explanation: 'With the source deactivated, R1 and R2 are in parallel as seen from terminals A–B.',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: ['r1', 'r2'],
        fadeOut: ['rl', 'w-term-top', 'w-term-bot'],
        transformToShort: ['vs1'],
        bracket: { label: 'R_th ≈ 66.67 Ω', nodes: ['n2', 'gnd'] },
      },
    },
    {
      id: 4,
      title: 'Restore Sources — Find V_oc',
      formula: 'V_{oc} = V_{n2} - V_{gnd}',
      calculation: 'V_{oc} = 12 \\times \\dfrac{R_2}{R_1 + R_2} = 12 \\times \\dfrac{200}{300} = 8\\text{ V}',
      explanation: 'Restore vs1 and solve the open-circuit voltage at terminals A–B. This is V_th.',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: ['rl', 'w-term-top', 'w-term-bot'],
        showCurrentFlow: true,
        bracket: { label: 'V_oc = 8 V', nodes: ['n2', 'gnd'] },
      },
    },
    {
      id: 5,
      title: 'Draw Thevenin Equivalent',
      formula: 'V_{th} = 8\\text{ V},\\quad R_{th} \\approx 66.67\\text{ }\\Omega',
      calculation: null,
      explanation: 'The entire original circuit simplifies to a single 8 V source in series with a 66.67 Ω resistor. Reconnect R_L across terminals A–B to solve for load current and voltage.',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: [],
        drawEquivalent: { type: 'thevenin', vth: 8, rth: 66.67, termA: 'n2', termB: 'gnd' },
      },
    },
  ],
  layout: {
    viewBox: '0 0 560 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 100, unit: 'Ω', x1: 100, y1: 80,  x2: 320, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 200, unit: 'Ω', x1: 320, y1: 80,  x2: 320, y2: 290 },
      { id: 'rl',  type: 'resistor',       value: 100, unit: 'Ω', x1: 460, y1: 80,  x2: 460, y2: 290 },
    ],
    wires: [
      { id: 'w-bottom',   x1: 320, y1: 290, x2: 100, y2: 290 },
      { id: 'w-term-top', x1: 320, y1: 80,  x2: 460, y2: 80  },
      { id: 'w-term-bot', x1: 320, y1: 290, x2: 460, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 100, y: 80 },
      { id: 'n2', x: 320, y: 80 },
    ],
    groundPoints: [{ x: 100, y: 290 }, { x: 320, y: 290 }, { x: 460, y: 290 }],
    terminals: {
      A: { x: 354, y: 80,  label: 'A' },
      B: { x: 354, y: 290, label: 'B' },
    },
  },
};
