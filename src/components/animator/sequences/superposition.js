import TheoremEngine from '../../../engine/TheoremEngine.js';
import { superpositionCircuit } from '../../../utils/circuitTemplates.js';

const steps = new TheoremEngine().superposition(superpositionCircuit());

export default {
  id: 'superposition',
  title: 'Superposition',
  difficulty: 'Advanced',
  description: 'Activate one independent source at a time, solve, then sum all contributions.',
  steps,
  layout: {
    viewBox: '0 0 580 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 10,   unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'vs2', type: 'voltage_source', value: 5,    unit: 'V', x1: 460, y1: 80,  x2: 460, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 1000, unit: 'Ω', x1: 100, y1: 80,  x2: 460, y2: 80  },
    ],
    wires: [
      { id: 'w-bottom', x1: 100, y1: 290, x2: 460, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 100, y: 80, label: 'n₁' },
      { id: 'n2', x: 460, y: 80, label: 'n₂' },
    ],
    groundPoints: [{ x: 100, y: 290 }, { x: 460, y: 290 }],
  },
};
