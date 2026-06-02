import TheoremEngine from '../../../engine/TheoremEngine.js';
import { kvlCircuit } from '../../../utils/circuitTemplates.js';

const steps = new TheoremEngine().kvl(kvlCircuit());

export default {
  id: 'kvl',
  title: "Kirchhoff's Voltage Law",
  difficulty: 'Intermediate',
  description: 'The sum of all voltages around any closed loop equals zero.',
  steps,
  layout: {
    viewBox: '0 0 480 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 10,   unit: 'V', x1: 80,  y1: 80,  x2: 80,  y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 1000, unit: 'Ω', x1: 80,  y1: 80,  x2: 210, y2: 80  },
      { id: 'r2',  type: 'resistor',       value: 2000, unit: 'Ω', x1: 210, y1: 80,  x2: 360, y2: 80  },
      { id: 'r3',  type: 'resistor',       value: 3000, unit: 'Ω', x1: 360, y1: 80,  x2: 360, y2: 290 },
    ],
    wires: [
      { id: 'w-bottom', x1: 80, y1: 290, x2: 360, y2: 290 },
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
