import CircuitGraph from '../engine/CircuitGraph.js';

// Pre-built CircuitGraph instances used by the Animator sequences
// Values match the plan's worked examples so animator steps show correct numbers

// 12 V + R1=300 Ω + R2=600 Ω in series (single loop)
// V_n1 = 12 V, V_n2 = 8 V, I = 13.33 mA
export function seriesCircuit() {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 12,  'n1',  'gnd');
  g.addElement('r1',  'resistor',       300, 'n1',  'n2');
  g.addElement('r2',  'resistor',       600, 'n2',  'gnd');
  return g;
}

// 12 V with R1=300 Ω and R2=600 Ω in parallel
// V_n1 = 12 V, I_total = 60 mA, I_R1 = 40 mA, I_R2 = 20 mA
export function parallelCircuit() {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 12,  'n1', 'gnd');
  g.addElement('r1',  'resistor',       300, 'n1', 'gnd');
  g.addElement('r2',  'resistor',       600, 'n1', 'gnd');
  return g;
}

// Thevenin/Norton demo circuit from the plan:
//   12 V source → R1=100 Ω → node n2 → R2=200 Ω → gnd
//   Terminals: n2 (A) and gnd (B)
//   V_th = 8 V, R_th = 66.67 Ω
export function theveninCircuit(includeLoad = false, rlValue = 100) {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 12,       'n1',  'gnd');
  g.addElement('r1',  'resistor',       100,      'n1',  'n2');
  g.addElement('r2',  'resistor',       200,      'n2',  'gnd');
  if (includeLoad) {
    g.addElement('rl', 'resistor', rlValue, 'n2', 'gnd');
  }
  return g;
}

// Superposition demo: two independent voltage sources + one resistor
//   vs1 = 10 V (n1→gnd), vs2 = 5 V (n2→gnd), r1 = 1 kΩ (n1→n2)
//   Expected I_r1 = (10−5)/1000 = 5 mA
//   Superposition check:
//     vs1 only → I_r1 = 10/1000 = 10 mA
//     vs2 only → I_r1 = −5/1000 = −5 mA  →  total = 5 mA ✓
export function superpositionCircuit() {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 10,   'n1', 'gnd');
  g.addElement('vs2', 'voltage_source', 5,    'n2', 'gnd');
  g.addElement('r1',  'resistor',       1000, 'n1', 'n2');
  return g;
}

// Ohm's Law demo: 10 V + 1 kΩ → I = 10 mA
export function ohmsLawCircuit() {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 10,   'n1', 'gnd');
  g.addElement('r1',  'resistor',       1000, 'n1', 'gnd');
  return g;
}

// KVL demo: 18 V source, R1=1 kΩ, R2=2 kΩ, R3=3 kΩ all in series
//   I = 18 / 6000 = 3 mA
//   V_R1 = 3 V, V_R2 = 6 V, V_R3 = 9 V
export function kvlCircuit() {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 18,   'n1', 'gnd');
  g.addElement('r1',  'resistor',       1000, 'n1', 'n2');
  g.addElement('r2',  'resistor',       2000, 'n2', 'n3');
  g.addElement('r3',  'resistor',       3000, 'n3', 'gnd');
  return g;
}

// Voltage divider: 12 V, R1=300 Ω (top), R2=600 Ω (bottom)
//   V_out = 12 × 600/(300+600) = 8 V
export function voltageDividerCircuit() {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 12,  'n1', 'gnd');
  g.addElement('r1',  'resistor',       300, 'n1', 'n2');
  g.addElement('r2',  'resistor',       600, 'n2', 'gnd');
  return g;
}
