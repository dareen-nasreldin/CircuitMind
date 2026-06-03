// KVL: vs1=18V, R1=1kΩ, R2=2kΩ, R3=3kΩ in series  →  I=3mA
// V_R1=3V, V_R2=6V, V_R3=9V  (sum = 18V ✓)

export default {
  id: 'kvl',
  title: "Kirchhoff's Voltage Law",
  difficulty: 'Intermediate',
  description: 'The sum of all voltages around any closed loop equals zero.',
  steps: [
    {
      id: 1,
      title: 'Identify the Mesh Loop',
      formula: null,
      calculation: null,
      explanation: 'Trace a closed loop through the circuit. All elements traversed form the mesh.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2', 'r3'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 2,
      title: 'Assign Loop Current Direction',
      formula: '\\text{Assume clockwise current }I',
      calculation: null,
      explanation: 'Choose a direction for the loop current. We will determine its sign after solving.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2', 'r3'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 3,
      title: 'Apply KVL Around the Loop',
      formula: '\\sum V_{\\text{sources}} = \\sum I \\cdot R \\quad(\\text{rises} = \\text{drops})',
      calculation: '18\\text{ V} = I\\,(1000 + 2000 + 3000)\\text{ }\\Omega',
      explanation: 'Sum all voltage rises (sources) and set equal to the sum of voltage drops (resistors).',
      graphState: null,
      hints: {
        highlight: ['vs1'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 4,
      title: 'Solve for Loop Current I',
      formula: 'I = \\dfrac{\\sum V}{\\sum R}',
      calculation: 'I = \\dfrac{18\\text{ V}}{6000\\text{ }\\Omega} = 0.003\\text{ A} = 3\\text{ mA}',
      explanation: 'The loop current is 3 mA.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2', 'r3'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 5,
      title: 'Calculate Voltage Drops',
      formula: 'V = IR \\text{ for each resistor}',
      calculation: 'V_{R1} = 3\\text{ V}\\\\V_{R2} = 6\\text{ V}\\\\V_{R3} = 9\\text{ V}',
      explanation: 'Use V = IR to find the voltage drop across each resistor. They sum to 18 V ✓',
      graphState: null,
      hints: {
        highlight: ['r1', 'r2', 'r3'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true,
        voltageDrops: { r1: 3, r2: 6, r3: 9 },
        drawEquivalent: null, bracket: null,
      },
    },
  ],
  layout: {
    viewBox: '0 0 480 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 18,   unit: 'V', x1: 80,  y1: 80,  x2: 80,  y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 1000, unit: 'Ω', x1: 80,  y1: 80,  x2: 210, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 2000, unit: 'Ω', x1: 210, y1: 80,  x2: 360, y2: 80  },
      { id: 'r3',  type: 'resistor',       value: 3000, unit: 'Ω', x1: 360, y1: 80,  x2: 360, y2: 290 },
    ],
    wires: [
      { id: 'w-bottom', x1: 360, y1: 290, x2: 80, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 80,  y: 80  },
      { id: 'n2', x: 210, y: 80, label: 'n₂' },
      { id: 'n3', x: 360, y: 80  },
    ],
    groundPoints: [{ x: 80, y: 290 }, { x: 360, y: 290 }],
    loopArrow: { cx: 220, cy: 185, r: 55 },
  },
};
