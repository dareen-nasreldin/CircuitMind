import TheoremEngine from '../../../engine/TheoremEngine.js';
import { ohmsLawCircuit } from '../../../utils/circuitTemplates.js';

const steps = new TheoremEngine().ohmsLaw(ohmsLawCircuit());

export default {
  id: 'ohmsLaw',
  title: "Ohm's Law",
  difficulty: 'Beginner',
  description: 'V = IR: the fundamental relationship between voltage, current, and resistance.',
  steps,
  layout: {
    viewBox: '0 0 480 360',
    elements: [
      { id: 'vs1', type: 'voltage_source', value: 10,   unit: 'V', x1: 120, y1: 80,  x2: 120, y2: 290 },
      { id: 'r1',  type: 'resistor',       value: 1000, unit: 'Ω', x1: 120, y1: 80,  x2: 380, y2: 80  },
    ],
    wires: [
      { id: 'w-right',  x1: 380, y1: 80,  x2: 380, y2: 290 },
      { id: 'w-bottom', x1: 120, y1: 290, x2: 380, y2: 290 },
    ],
    nodes: [
      { id: 'n1', x: 120, y: 80 },
    ],
    groundPoints: [{ x: 120, y: 290 }, { x: 380, y: 290 }],
  },
};
