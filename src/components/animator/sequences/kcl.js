import TheoremEngine from '../../../engine/TheoremEngine.js';
import { theveninCircuit } from '../../../utils/circuitTemplates.js';

// KCL analysis at node n2 (junction of r1 and r2)
const steps = new TheoremEngine().kcl(theveninCircuit(), 'n2');

export default {
  id: 'kcl',
  title: "Kirchhoff's Current Law",
  difficulty: 'Intermediate',
  description: 'The sum of all currents entering and leaving any node equals zero.',
  steps,
  layout: {
    viewBox: '0 0 540 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V', x1: 100, y1: 80,  x2: 100, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 100, unit: 'Ω', x1: 100, y1: 80,  x2: 420, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 200, unit: 'Ω', x1: 420, y1: 80,  x2: 420, y2: 290 },
    ],
    wires: [
      { id: 'w-bottom', x1: 100, y1: 290, x2: 420, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 100, y: 80 },
      { id: 'n2', x: 420, y: 80, label: 'n₂ (KCL node)' },
    ],
    groundPoints: [{ x: 100, y: 290 }, { x: 420, y: 290 }],
    kclNode: 'n2',
  },
};
