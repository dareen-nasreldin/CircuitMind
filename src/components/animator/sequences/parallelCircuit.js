// Parallel circuit: vs1=12V, R1=300Ω || R2=600Ω at node n1
// I_vs1=60mA (entering n1), I_R1=40mA (leaving), I_R2=20mA (leaving)
// KCL: 60 = 40 + 20 ✓

export default {
  id: 'parallel',
  title: 'Parallel Circuit',
  difficulty: 'Beginner',
  description: 'Resistors in parallel share the same voltage. Currents split at each junction.',
  steps: [
    {
      id: 1,
      title: 'Identify the Node',
      formula: null,
      calculation: null,
      explanation: 'In a parallel circuit all branches share the same voltage. Node n₁ is the junction where current splits.',
      graphState: null,
      hints: {
        highlight: ['n1'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 2,
      title: 'Identify Branch Currents',
      formula: '\\sum I_{\\text{in}} = \\sum I_{\\text{out}}',
      calculation: null,
      explanation: 'Node n₁ connects the source and both resistors. KCL requires that entering current equals leaving current.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
        kclNode: 'n1',
      },
    },
    {
      id: 3,
      title: 'Apply KCL at n₁',
      formula: '\\Sigma\\,I_{\\text{at }n_1} = 0',
      calculation: 'I_{vs1} = 0.06\\text{ A (entering)}\\\\I_{R1} = 0.04\\text{ A (leaving)}\\\\I_{R2} = 0.02\\text{ A (leaving)}',
      explanation: 'Each resistor branch draws current proportional to 1/R. Higher resistance → lower current.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
        branchCurrentLabels: {
          'par-arr-vs1': '0.06 A',
          'par-arr-r1':  '0.04 A',
          'par-arr-r2':  '0.02 A',
        },
      },
    },
    {
      id: 4,
      title: 'Verify KCL: Sum = 0',
      formula: '\\Sigma I = 0',
      calculation: '0.06 - 0.04 - 0.02 = 0\\text{ A}',
      explanation: 'KCL is satisfied: the 60 mA supplied by the source equals 40 mA + 20 mA through the resistors.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
        branchCurrentLabels: {
          'par-arr-vs1': '0.06 A',
          'par-arr-r1':  '0.04 A',
          'par-arr-r2':  '0.02 A',
        },
      },
    },
  ],
  layout: {
    viewBox: '0 0 480 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 300, unit: 'Ω', x1: 240, y1: 80,  x2: 240, y2: 290 },
      { id: 'r2',  type: 'resistor',       value: 600, unit: 'Ω', x1: 370, y1: 80,  x2: 370, y2: 290 },
    ],
    wires: [
      { id: 'w-top',    x1: 60,  y1: 80,  x2: 420, y2: 80  },
      { id: 'w-bottom', x1: 420, y1: 290, x2: 60,  y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 60, y: 80, label: 'n₁' },
    ],
    groundPoints: [{ x: 60, y: 290 }],
    kclNode: 'n1',
    // Directional current arrows for each branch (shown when showCurrentFlow=true)
    // vs1: current enters n1 from below (flows upward through source)
    // r1, r2: current leaves n1 downward through each resistor
    kclArrows: [
      { id: 'par-arr-vs1', x1: 112, y1: 200, x2: 112, y2: 145, horizontal: false }, // upward
      { id: 'par-arr-r1',  x1: 252, y1: 145, x2: 252, y2: 200, horizontal: false }, // downward
      { id: 'par-arr-r2',  x1: 382, y1: 145, x2: 382, y2: 200, horizontal: false }, // downward
    ],
  },
};
