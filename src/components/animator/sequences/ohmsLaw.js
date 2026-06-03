// Ohm's Law: vs1=10V, r1=1000Ω  →  I = 10mA

export default {
  id: 'ohmsLaw',
  title: "Ohm's Law",
  difficulty: 'Beginner',
  description: 'V = IR: the fundamental relationship between voltage, current, and resistance.',
  steps: [
    {
      id: 1,
      title: 'Identify the Circuit',
      formula: 'V = 10\\text{ V},\\quad R = 1000\\text{ }\\Omega',
      calculation: null,
      explanation: 'The circuit has a 10 V source and a 1000 Ω resistor. Use Ohm\'s Law to find the current.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 2,
      title: "Apply Ohm's Law",
      formula: 'V = I \\times R \\quad\\Rightarrow\\quad I = \\dfrac{V}{R}',
      calculation: null,
      explanation: "Ohm's Law states V = IR. Since V and R are known, solve directly for current I.",
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 3,
      title: 'Calculate Current I',
      formula: 'I = \\dfrac{V}{R}',
      calculation: 'I = \\dfrac{10\\text{ V}}{1000\\text{ }\\Omega} = 0.01\\text{ A} = 10\\text{ mA}',
      explanation: 'The current flowing through the circuit is 0.01 A (10 mA).',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true,
        currentLabel: '10 mA',
        drawEquivalent: null, bracket: null,
      },
    },
  ],
  layout: {
    viewBox: '0 0 480 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 10,   unit: 'V', x1: 120, y1: 80,  x2: 120, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 1000, unit: 'Ω', x1: 120, y1: 80,  x2: 380, y2: 80  },
    ],
    wires: [
      { id: 'w-right',  x1: 380, y1: 80,  x2: 380, y2: 290 },
      { id: 'w-bottom', x1: 380, y1: 290, x2: 120, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 120, y: 80 },
    ],
    groundPoints: [{ x: 120, y: 290 }, { x: 380, y: 290 }],
    loopArrow: { cx: 250, cy: 185, r: 65 },
  },
};
