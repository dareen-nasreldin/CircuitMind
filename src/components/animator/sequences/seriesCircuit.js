import TheoremEngine from '../../../engine/TheoremEngine.js';
import { seriesCircuit as buildCircuit } from '../../../utils/circuitTemplates.js';

// Reuse KVL method — it perfectly demonstrates series circuit solving
const steps = new TheoremEngine().kvl(buildCircuit());

export default {
  id: 'series',
  title: 'Series Circuit',
  difficulty: 'Beginner',
  description: 'Resistors in series share the same current. R_total = R1 + R2.',
  steps,
  layout: {
    viewBox: '0 0 540 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 12,  unit: 'V',  x1: 80,  y1: 80,  x2: 80,  y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 300, unit: 'Ω',  x1: 80,  y1: 80,  x2: 270, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 600, unit: 'Ω',  x1: 270, y1: 80,  x2: 460, y2: 80  },
    ],
    wires: [
      { id: 'w-right',  x1: 460, y1: 80,  x2: 460, y2: 290 },
      { id: 'w-bottom', x1: 80,  y1: 290, x2: 460, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 80,  y: 80 },
      { id: 'n2', x: 270, y: 80, label: 'n₂' },
    ],
    groundPoints: [{ x: 80, y: 290 }, { x: 460, y: 290 }],
    loopArrow: { cx: 270, cy: 185, r: 60 },
  },
};
