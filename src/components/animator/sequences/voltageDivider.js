import TheoremEngine from '../../../engine/TheoremEngine.js';
import { voltageDividerCircuit } from '../../../utils/circuitTemplates.js';

// Voltage divider: 12V, R1=300Ω (top), R2=600Ω (bottom)
// V_out = 12 × 600/(300+600) = 8 V — demonstrated via Thevenin at n2–gnd
const circuit = voltageDividerCircuit();

const INITIAL = {
  id: 0,
  title: 'Voltage Divider Circuit',
  formula: 'V_out = V_s × R2 / (R1 + R2)',
  calculation: 'V_out = 12 × 600 / (300 + 600) = 8 V',
  explanation:
    'Two series resistors form a voltage divider. The output voltage V_out at the junction of R1 and R2 is a fraction of the supply voltage.',
  graphState: circuit.serialize(),
  hints: {
    highlight: [], fadeOut: [], transformToShort: [], transformToOpen: [],
    showCurrentFlow: false, drawEquivalent: null, bracket: null,
  },
};

// Use Thevenin analysis at n2 (the divider tap) to prove V_out = 8 V
const engineSteps = new TheoremEngine().thevenin(circuit, 'n2', 'gnd');

const steps = [INITIAL, ...engineSteps];

export default {
  id: 'voltageDivider',
  title: 'Voltage Divider',
  difficulty: 'Beginner',
  description: 'Two series resistors create a fraction of the supply voltage at their junction.',
  steps,
  layout: {
    viewBox: '0 0 540 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 300, unit: 'Ω', x1: 100, y1: 80,  x2: 420, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 600, unit: 'Ω', x1: 420, y1: 80,  x2: 420, y2: 290 },
    ],
    wires: [
      { id: 'w-bottom', x1: 100, y1: 290, x2: 420, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 100, y: 80 },
      { id: 'n2', x: 420, y: 80, label: 'V_out' },
    ],
    groundPoints: [{ x: 100, y: 290 }, { x: 420, y: 290 }],
    terminals: {
      A: { x: 456, y: 80,  label: 'V_out' },
      B: { x: 456, y: 290, label: 'GND' },
    },
  },
};
