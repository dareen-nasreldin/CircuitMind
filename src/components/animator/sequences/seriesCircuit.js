// Series circuit: vs1=12V, R1=300Ω, R2=600Ω  →  I≈13.3mA
// V_R1=4V, V_R2=8V  (sum = 12V ✓)

export default {
  id: 'series',
  title: 'Series Circuit',
  difficulty: 'Beginner',
  description: 'Resistors in series share the same current. R_total = R1 + R2.',
  steps: [
    {
      id: 1,
      title: 'Identify the Mesh Loop',
      formula: null,
      calculation: null,
      explanation: 'Resistors in series all carry the same current. Trace the single loop through the circuit.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 2,
      title: 'Total Resistance',
      formula: 'R_{\\text{total}} = R_1 + R_2',
      calculation: 'R_{\\text{total}} = 300 + 600 = 900\\text{ }\\Omega',
      explanation: 'In a series circuit, resistances simply add together.',
      graphState: null,
      hints: {
        highlight: ['r1', 'r2'],
        fadeOut: ['vs1'], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
        textAnnotations: [
          { id: 'req', x: 270, y: 115, text: '⟵ R_total = 900 Ω ⟶' },
        ],
      },
    },
    {
      id: 3,
      title: 'Apply KVL — Solve for I',
      formula: 'I = \\dfrac{V_s}{R_{\\text{total}}}',
      calculation: 'I = \\dfrac{12\\text{ V}}{900\\text{ }\\Omega} = \\dfrac{1}{75}\\text{ A} \\approx 13.3\\text{ mA}',
      explanation: 'By KVL, the source voltage equals the sum of all voltage drops. Solve for the loop current.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 4,
      title: 'Voltage Drops',
      formula: 'V = IR \\text{ for each resistor}',
      calculation: 'V_{R1} = \\tfrac{1}{75} \\times 300 = 4\\text{ V}\\\\V_{R2} = \\tfrac{1}{75} \\times 600 = 8\\text{ V}',
      explanation: 'Voltage drops across R1 and R2 sum to 12 V — confirming KVL.',
      graphState: null,
      hints: {
        highlight: ['r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true,
        voltageDrops: { r1: 4, r2: 8 },
        drawEquivalent: null, bracket: null,
      },
    },
  ],
  layout: {
    viewBox: '0 0 540 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 80,  y1: 80,  x2: 80,  y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 300, unit: 'Ω', x1: 80,  y1: 80,  x2: 270, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 600, unit: 'Ω', x1: 270, y1: 80,  x2: 460, y2: 80  },
    ],
    wires: [
      { id: 'w-right',  x1: 460, y1: 80,  x2: 460, y2: 290 },
      { id: 'w-bottom', x1: 460, y1: 290, x2: 80,  y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 80,  y: 80 },
      { id: 'n2', x: 270, y: 80, label: 'n₂' },
    ],
    groundPoints: [{ x: 80, y: 290 }, { x: 460, y: 290 }],
    loopArrow: { cx: 270, cy: 185, r: 60 },
  },
};
