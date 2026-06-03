// Norton: vs1=12V, R1=100Ω, R2=200Ω, RL=100Ω
// R_N = R_th = 200/3 ≈ 66.67Ω
// I_sc = 12/100 = 0.12A = 120mA  (R2 shorted out when terminals are shorted)
// Verify: V_th = I_N × R_N  →  0.12 × (200/3) = 8V ✓

const baseHints = {
  fadeOut: [], transformToShort: [], transformToOpen: [],
  showCurrentFlow: false, drawEquivalent: null, bracket: null,
};

export default {
  id: 'norton',
  title: "Norton's Theorem",
  difficulty: 'Advanced',
  description: 'Simplify any linear circuit to one current source + one parallel resistor.',
  steps: [
    {
      id: 0,
      title: 'Starting Circuit',
      formula: null,
      calculation: 'V_s = 12\\text{ V},\\quad R_1 = 100\\text{ }\\Omega,\\quad R_2 = 200\\text{ }\\Omega,\\quad R_L = 100\\text{ }\\Omega',
      explanation: 'This is the original circuit with load R_L at terminals A–B. We will find the Norton equivalent: a current source I_N in parallel with R_N.',
      graphState: null,
      hints: { ...baseHints, highlight: ['rl', 'w-term-top', 'w-term-bot'] },
    },
    {
      id: 1,
      title: 'Remove the Load Resistor',
      formula: null,
      calculation: null,
      explanation: 'Disconnect R_L from terminals A–B. The Norton resistance R_N equals R_th and is found with all sources deactivated.',
      graphState: null,
      hints: { ...baseHints, highlight: [], fadeOut: ['rl', 'w-term-top', 'w-term-bot'] },
    },
    {
      id: 2,
      title: 'Find R_Norton',
      formula: 'R_N = R_{th} = R_1 \\,\\|\\, R_2 = \\dfrac{R_1 R_2}{R_1 + R_2}',
      calculation: 'R_N = \\dfrac{100 \\times 200}{100 + 200} = \\dfrac{200}{3} \\approx 66.67\\text{ }\\Omega',
      explanation: 'R_N equals R_th — deactivate all sources and find the resistance seen from terminals A–B.',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: ['r1', 'r2'],
        fadeOut: ['rl', 'w-term-top', 'w-term-bot'],
        transformToShort: ['vs1'],
      },
    },
    {
      id: 3,
      title: 'Find I_sc — Short-Circuit Current',
      formula: 'I_N = I_{sc}',
      calculation: 'I_{sc} = \\dfrac{V_s}{R_1} = \\dfrac{12}{100} = 0.12\\text{ A} = 120\\text{ mA}',
      explanation: 'Short terminals A–B with a wire. R2 is bypassed (both ends at 0 V), so all current flows through R1. I_N = 120 mA.',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: ['vs1', 'r1'],
        fadeOut: ['rl', 'w-term-top', 'w-term-bot'],
        showCurrentFlow: true,
        shortTerminals: true,
      },
    },
    {
      id: 4,
      title: 'Verify: V_th = I_N × R_N',
      formula: 'V_{th} = I_N \\times R_N',
      calculation: '0.12\\text{ A} \\times \\dfrac{200}{3}\\text{ }\\Omega = 8\\text{ V} = V_{th}\\quad\\checkmark',
      explanation: 'Confirm the Norton values are consistent with the Thevenin equivalent (V_th = 8 V).',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: ['rl', 'w-term-top', 'w-term-bot'],
        showCurrentFlow: true,
      },
    },
    {
      id: 5,
      title: 'Draw Norton Equivalent',
      formula: 'I_N = 120\\text{ mA},\\quad R_N \\approx 66.67\\text{ }\\Omega',
      calculation: null,
      explanation: 'The circuit simplifies to a 120 mA current source in parallel with R_N ≈ 66.67 Ω. Reconnect R_L across the terminals to find the load voltage.',
      graphState: null,
      hints: {
        ...baseHints,
        highlight: [],
        drawEquivalent: { type: 'norton', in: 0.12, rn: 66.67 },
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
