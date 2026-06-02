import TheoremEngine from '../../../engine/TheoremEngine.js';
import { theveninCircuit } from '../../../utils/circuitTemplates.js';

const circuit = theveninCircuit(true, 100);

const INITIAL = {
  id: 0,
  title: 'Starting Circuit',
  formula: null,
  calculation: 'V_s = 12 V,  R1 = 100 Ω,  R2 = 200 Ω,  R_L = 100 Ω',
  explanation:
    'This is the original circuit with the load R_L at terminals A–B. We will find the Norton equivalent: a current source I_N in parallel with R_N.',
  graphState: circuit.serialize(),
  hints: {
    highlight: [], fadeOut: [], transformToShort: [], transformToOpen: [],
    showCurrentFlow: false, drawEquivalent: null, bracket: null,
  },
};

const engineSteps = new TheoremEngine().norton(circuit, 'n2', 'gnd', 'rl');

engineSteps.slice(1).forEach(step => {
  ['rl', 'w-term-top', 'w-term-bot'].forEach(id => {
    if (!step.hints.fadeOut.includes(id)) step.hints.fadeOut.push(id);
  });
});
engineSteps[0].hints.fadeOut.push('w-term-top', 'w-term-bot');

const steps = [INITIAL, ...engineSteps];

export default {
  id: 'norton',
  title: "Norton's Theorem",
  difficulty: 'Advanced',
  description: 'Simplify any linear circuit to one current source + one parallel resistor.',
  steps,
  layout: {
    viewBox: '0 0 560 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 100, unit: 'Ω', x1: 100, y1: 80,  x2: 320, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 200, unit: 'Ω', x1: 320, y1: 80,  x2: 320, y2: 290 },
      { id: 'rl',  type: 'resistor',       value: 100, unit: 'Ω', x1: 460, y1: 80,  x2: 460, y2: 290 },
    ],
    wires: [
      { id: 'w-bottom',   x1: 100, y1: 290, x2: 320, y2: 290 },
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
