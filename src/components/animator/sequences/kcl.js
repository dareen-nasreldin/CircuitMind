// KCL at node n2 — T-junction with 3 branches
// vs1=12V, R1=100Ω (n1→n2), R2=200Ω (n2→gnd), R3=200Ω (n2→gnd)
// R2||R3 = 100Ω  →  R_total = 200Ω  →  I_total = 60 mA
// V_n2 = 12 − 0.06×100 = 6 V
// I_R1 = 60 mA (entering n2)
// I_R2 = 6/200 = 30 mA (leaving n2)
// I_R3 = 6/200 = 30 mA (leaving n2)
// KCL: 60 = 30 + 30  ✓

const solvedGraphState = {
  nodes: {
    gnd: { id: 'gnd', voltage: 0 },
    n1:  { id: 'n1',  voltage: 12 },
    n2:  { id: 'n2',  voltage: 6  },
  },
  edges: {},
};

export default {
  id: 'kcl',
  title: "Kirchhoff's Current Law",
  difficulty: 'Intermediate',
  description: 'The sum of all currents entering and leaving any node equals zero.',
  steps: [
    {
      id: 1,
      title: 'Identify the Node',
      formula: null,
      calculation: null,
      explanation: 'Focus on node n2 — a true junction where the circuit branches. KCL states the sum of all currents entering and leaving any node equals zero.',
      graphState: null,
      hints: {
        highlight: ['n2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 2,
      title: 'Identify All Branch Currents',
      formula: '\\sum I_{\\text{in}} = \\sum I_{\\text{out}}',
      calculation: null,
      explanation: 'Node n2 has 3 branches: R1 (entering) and R2, R3 (leaving). Current from vs1 flows through R1 into n2, then splits between R2 and R3.',
      graphState: null,
      hints: {
        highlight: ['r1', 'r2', 'r3'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 3,
      title: 'Apply KCL',
      formula: '\\Sigma\\,I_{\\text{at }n_2} = 0',
      calculation: 'I_{R1} = 0.06\\text{ A (entering)}\\\\I_{R2} = 0.03\\text{ A (leaving)}\\\\I_{R3} = 0.03\\text{ A (leaving)}',
      explanation: 'Solve the circuit: I_total = 12/200 = 60 mA through R1. At n2 (V = 6 V) this splits equally between R2 and R3 since they are equal.',
      graphState: solvedGraphState,
      hints: {
        highlight: ['r1', 'r2', 'r3'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true,
        showVoltages: true,
        drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 4,
      title: 'Verify KCL: Sum = 0',
      formula: '\\Sigma I = 0',
      calculation: '\\Sigma I = 0.06 - 0.03 - 0.03 = 0\\text{ A}\\quad\\checkmark',
      explanation: 'KCL verified: the 60 mA entering via R1 equals the 30 mA + 30 mA leaving via R2 and R3.',
      graphState: solvedGraphState,
      hints: {
        highlight: ['r1', 'r2', 'r3'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true,
        branchCurrentLabels: {
          'kcl-arr-r1': '0.06 A',
          'kcl-arr-r2': '0.03 A',
          'kcl-arr-r3': '0.03 A',
        },
        drawEquivalent: null, bracket: null,
      },
    },
  ],
  layout: {
    viewBox: '0 0 560 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 80,  y1: 80,  x2: 80,  y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 100, unit: 'Ω', x1: 80,  y1: 80,  x2: 280, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 200, unit: 'Ω', x1: 280, y1: 80,  x2: 280, y2: 290 },
      { id: 'r3',  type: 'resistor',       value: 200, unit: 'Ω', x1: 420, y1: 80,  x2: 420, y2: 290 },
    ],
    wires: [
      { id: 'w-n2-r3',  x1: 280, y1: 80,  x2: 420, y2: 80  }, // n2 → r3 top
      { id: 'w-bottom', x1: 420, y1: 290, x2: 80,  y2: 290 }, // ground rail
    ],
    nodes: [
      { id: 'n1', x: 80,  y: 80 },
      { id: 'n2', x: 280, y: 80, label: 'n₂ (KCL node)' },
    ],
    groundPoints: [{ x: 80, y: 290 }, { x: 280, y: 290 }, { x: 420, y: 290 }],
    kclNode: 'n2',
    // Arrows: R1 enters n2 (→), R2 and R3 leave n2 (↓)
    kclArrows: [
      { id: 'kcl-arr-r1', x1: 165, y1: 63, x2: 230, y2: 63, horizontal: true  },
      { id: 'kcl-arr-r2', x1: 293, y1: 120, x2: 293, y2: 170, horizontal: false },
      { id: 'kcl-arr-r3', x1: 433, y1: 120, x2: 433, y2: 170, horizontal: false },
    ],
  },
};
