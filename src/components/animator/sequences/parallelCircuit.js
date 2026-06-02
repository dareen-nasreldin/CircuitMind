import TheoremEngine from '../../../engine/TheoremEngine.js';
import { parallelCircuit as buildCircuit } from '../../../utils/circuitTemplates.js';

// KCL at n1 shows parallel current splitting
const steps = new TheoremEngine().kcl(buildCircuit(), 'n1');

export default {
  id: 'parallel',
  title: 'Parallel Circuit',
  difficulty: 'Beginner',
  description: 'Resistors in parallel share the same voltage. Currents split at each junction.',
  steps,
  layout: {
    viewBox: '0 0 480 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 300, unit: 'Ω', x1: 240, y1: 80,  x2: 240, y2: 290 },
      { id: 'r2',  type: 'resistor',       value: 600, unit: 'Ω', x1: 370, y1: 80,  x2: 370, y2: 290 },
    ],
    wires: [
      { id: 'w-top',    x1: 60,  y1: 80,  x2: 420, y2: 80  },
      { id: 'w-bottom', x1: 60,  y1: 290, x2: 420, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 60, y: 80, label: 'n₁' },
    ],
    groundPoints: [{ x: 60, y: 290 }],
    kclNode: 'n1',
  },
};
