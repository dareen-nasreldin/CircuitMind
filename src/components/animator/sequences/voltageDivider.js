// Voltage Divider: vs1=12V, R1=300Ω (top), R2=600Ω (bottom)
// I = 12/900 ≈ 13.3 mA,  V_out = I × R2 = 8 V
// Divider formula: V_out = Vs × R2/(R1+R2) = 12 × 600/900 = 8 V

export default {
  id: 'voltageDivider',
  title: 'Voltage Divider',
  difficulty: 'Beginner',
  description: 'Two series resistors create a fraction of the supply voltage at their junction.',
  steps: [
    {
      id: 1,
      title: 'Voltage Divider Formula',
      formula: 'V_{out} = V_s \\cdot \\dfrac{R_2}{R_1 + R_2}',
      calculation: 'V_{out} = 12 \\times \\dfrac{600}{300 + 600} = 12 \\times \\dfrac{2}{3} = 8\\text{ V}',
      explanation: 'Two series resistors form a voltage divider. The output voltage at the junction of R1 and R2 is a fixed fraction of the supply voltage.',
      graphState: null,
      hints: {
        highlight: ['r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 2,
      title: 'Current Through the Divider',
      formula: 'I = \\dfrac{V_s}{R_1 + R_2}',
      calculation: 'I = \\dfrac{12}{300 + 600} = \\dfrac{12}{900} \\approx 13.3\\text{ mA}',
      explanation: 'The same current flows through both resistors because they are in series. This current determines how much voltage is dropped across each resistor.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 3,
      title: 'Voltage at the Output Node',
      formula: 'V_{out} = I \\times R_2',
      calculation: 'V_{out} = \\tfrac{12}{900} \\times 600 = 8\\text{ V}',
      explanation: 'The output voltage equals the current multiplied by R2. Node V_out sits at 8 V — exactly 2/3 of the 12 V supply, matching the R2/(R1+R2) ratio.',
      graphState: null,
      hints: {
        highlight: ['r2', 'n2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
        voltageDrops: { r1: 4, r2: 8 },
      },
    },
    {
      id: 4,
      title: 'Effect of Resistor Ratio',
      formula: 'V_{out} \\propto \\dfrac{R_2}{R_1 + R_2}',
      calculation: 'R_2 = 300\\text{ }\\Omega \\Rightarrow V_{out} = 6\\text{ V}\\\\R_2 = 600\\text{ }\\Omega \\Rightarrow V_{out} = 8\\text{ V}\\\\R_2 = 900\\text{ }\\Omega \\Rightarrow V_{out} = 9\\text{ V}',
      explanation: 'Increasing R2 relative to R1 raises V_out. Decreasing R2 lowers it. The ratio R2/(R1+R2) always controls the output fraction — no matter the absolute values.',
      graphState: null,
      hints: {
        highlight: ['r1', 'r2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: false, drawEquivalent: null, bracket: null,
      },
    },
    {
      id: 5,
      title: 'Summary',
      formula: 'V_{out} = V_s \\cdot \\dfrac{R_2}{R_1 + R_2}',
      calculation: '8\\text{ V} = 12 \\times \\dfrac{600}{900}\\quad\\checkmark',
      explanation: 'The voltage divider is one of the most fundamental circuits in electronics. It sets a precise fraction of the supply voltage at a node — used in sensors, biasing, and reference circuits.',
      graphState: null,
      hints: {
        highlight: ['vs1', 'r1', 'r2', 'n2'],
        fadeOut: [], transformToShort: [], transformToOpen: [],
        showCurrentFlow: true, drawEquivalent: null, bracket: null,
        voltageDrops: { r1: 4, r2: 8 },
      },
    },
  ],
  layout: {
    viewBox: '0 0 540 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 300, unit: 'Ω', x1: 100, y1: 80,  x2: 420, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 600, unit: 'Ω', x1: 420, y1: 80,  x2: 420, y2: 290 },
    ],
    wires: [
      { id: 'w-bottom', x1: 420, y1: 290, x2: 100, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 100, y: 80 },
      { id: 'n2', x: 420, y: 80, label: 'V_out' },
    ],
    groundPoints: [{ x: 100, y: 290 }, { x: 420, y: 290 }],
  },
};
