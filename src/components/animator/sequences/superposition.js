// Superposition: vs1=10V, vs2=5V, R1=1000Ω (n1→n2)
// vs1 only: V_n1=10V, V_n2=0V
// vs2 only: V_n1=0V,  V_n2=5V
// Sum:      V_n1=10V, V_n2=5V  |  I_R1 = (10−5)/1000 = 5mA

export default {
  id: 'superposition',
  title: 'Superposition',
  difficulty: 'Advanced',
  description: 'Activate one independent source at a time, solve, then sum all contributions.',
  steps: [
    {
      id: 1,
      title: 'Identify Independent Sources',
      formula: null,
      calculation: null,
      explanation: 'The circuit has 2 independent sources: vs1 and vs2. Superposition activates one source at a time while all others are deactivated.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'vs2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 2,
      title: 'Activate vs1 (10 V) Only',
      formula: '\\text{Deactivate: }vs2 \\rightarrow \\text{short}',
      calculation: 'V_{n1}^{(1)} = 10\\text{ V}\\\\V_{n2}^{(1)} = 0\\text{ V}',
      explanation: 'With only vs1 active, vs2 is replaced by a short circuit. n2 is connected to GND via the short, so V_n2 = 0 V.',
      graphState: null,
      hints: {
        highlight: ['vs1'],
        fadeOut: [], transformToShort: ['vs2'], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 3,
      title: 'Activate vs2 (5 V) Only',
      formula: '\\text{Deactivate: }vs1 \\rightarrow \\text{short}',
      calculation: 'V_{n1}^{(2)} = 0\\text{ V}\\\\V_{n2}^{(2)} = 5\\text{ V}',
      explanation: 'With only vs2 active, vs1 is replaced by a short circuit. n1 is connected to GND via the short, so V_n1 = 0 V.',
      graphState: null,
      hints: {
        highlight: ['vs2'],
        fadeOut: [], transformToShort: ['vs1'], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 4,
      title: 'Sum All Contributions',
      formula: 'V_{\\text{total}} = V^{(1)} + V^{(2)}',
      calculation: 'V_{n1} = 10 + 0 = 10\\text{ V}\\\\V_{n2} = 0 + 5 = 5\\text{ V}\\\\I_{R1} = \\dfrac{10 - 5}{1000} = 5\\text{ mA}',
      explanation: 'Add contributions from each source. V_n1 = 10 V, V_n2 = 5 V. The current through R1 is 5 mA.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'vs2', 'r1'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true,
        // Summation annotations displayed next to n1 and n2 on the diagram
        sumAnnotations: [
          { nodeId: 'n1', text: '10+0=10 V' },
          { nodeId: 'n2', text: '0+5=5 V'  },
        ],
        drawEquivalent: null, bracket: null,
      },
    },
  ],
  layout: {
    viewBox: '0 0 580 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 10,   unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'vs2', type: 'voltage_source', value: 5,    unit: 'V', x1: 460, y1: 80,  x2: 460, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 1000, unit: 'Ω', x1: 100, y1: 80,  x2: 460, y2: 80  },
    ],
    wires: [
      { id: 'w-bottom', x1: 460, y1: 290, x2: 100, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 100, y: 80, label: 'n₁' },
      { id: 'n2', x: 460, y: 80, label: 'n₂' },
    ],
    groundPoints: [{ x: 100, y: 290 }, { x: 460, y: 290 }],
  },
};
