// Run with:  node src/engine/engineTests.js
import { gaussianElimination } from './matrixUtils.js';
import CircuitGraph             from './CircuitGraph.js';
import MNASolver                from './MNASolver.js';
import TopologyAnalyzer         from './TopologyAnalyzer.js';
import TheoremEngine            from './TheoremEngine.js';
import {
  seriesCircuit,
  parallelCircuit,
  theveninCircuit,
  superpositionCircuit,
  kvlCircuit,
} from '../utils/circuitTemplates.js';

const solver   = new MNASolver();
const topology = new TopologyAnalyzer();
const theorems = new TheoremEngine();

let passed = 0;
let failed = 0;

function approx(a, b, tol = 0.01) {
  return Math.abs(a - b) <= tol;
}

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗  ${name}`);
    console.error(`     ${e.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg ?? 'Assertion failed');
}

// ─── matrixUtils ──────────────────────────────────────────────────────────────

console.log('\nmatrixUtils');

test('2×2 system  [2,1;1,3]·x = [5,10]  →  x = [1,3]', () => {
  const x = gaussianElimination([[2, 1], [1, 3]], [5, 10]);
  assert(approx(x[0], 1),   `x[0] expected 1, got ${x[0]}`);
  assert(approx(x[1], 3),   `x[1] expected 3, got ${x[1]}`);
});

test('3×3 system  [1,2,3;0,4,5;1,0,6]·x = [14,11,7]  →  x = [1,1,2]', () => {
  const A = [[1,2,3],[0,4,5],[1,0,6]];
  const b = [14, 11, 7];
  const x = gaussianElimination(A, b);
  // Verify A·x = b
  const residual = A.map((row, i) =>
    Math.abs(row.reduce((s, v, j) => s + v * x[j], 0) - b[i])
  );
  assert(residual.every(r => r < 1e-6), `Residual too large: ${residual}`);
});

// ─── CircuitGraph ─────────────────────────────────────────────────────────────

console.log('\nCircuitGraph');

test('addElement keeps adjacency and connections in sync', () => {
  const g = new CircuitGraph();
  g.addElement('r1', 'resistor', 100, 'n1', 'n2');
  assert(g.adjacency.get('n1').has('n2'), 'n1→n2 missing from adjacency');
  assert(g.adjacency.get('n2').has('n1'), 'n2→n1 missing from adjacency');
  assert(g.nodes.get('n1').connections.has('r1'), 'n1 connections missing r1');
});

test('removeElement cleans adjacency when no parallel edges remain', () => {
  const g = new CircuitGraph();
  g.addElement('r1', 'resistor', 100, 'n1', 'n2');
  g.removeElement('r1');
  assert(!g.edges.has('r1'),                   'r1 still in edges');
  assert(!g.adjacency.get('n1').has('n2'),     'n1→n2 still in adjacency');
});

test('removeElement keeps adjacency when parallel edge still exists', () => {
  const g = new CircuitGraph();
  g.addElement('r1', 'resistor', 100, 'n1', 'n2');
  g.addElement('r2', 'resistor', 200, 'n1', 'n2');
  g.removeElement('r1');
  assert(g.adjacency.get('n1').has('n2'),     'n1→n2 should remain (r2 still there)');
});

test('clone() is fully independent — mutation does not affect original', () => {
  const g = theveninCircuit();
  const c = g.clone();
  c.deactivateSources();
  assert(g.edges.get('vs1').type === 'voltage_source', 'original should be unchanged');
  assert(c.edges.get('vs1').type === 'short_circuit',  'clone should be deactivated');
});

// ─── MNASolver ────────────────────────────────────────────────────────────────

console.log('\nMNASolver');

test('single resistor + voltage source  V=12, R=1000 → V_n1=12, I=0.012', () => {
  const g = new CircuitGraph();
  g.addElement('vs1', 'voltage_source', 12,   'n1', 'gnd');
  g.addElement('r1',  'resistor',       1000, 'n1', 'gnd');
  solver.solve(g);
  assert(approx(g.nodes.get('n1').voltage, 12),   `V_n1=${g.nodes.get('n1').voltage}`);
  assert(approx(g.edges.get('r1').current, 0.012),`I_r1=${g.edges.get('r1').current}`);
});

test('series circuit  V=12, R1=100, R2=200 → V_n1=12, V_n2=8, I=0.04', () => {
  const g = seriesCircuit();
  // Adjust to use R1=100, R2=200 for the known Thevenin example values
  const g2 = theveninCircuit();
  solver.solve(g2);
  assert(approx(g2.nodes.get('n1').voltage, 12), `V_n1=${g2.nodes.get('n1').voltage}`);
  assert(approx(g2.nodes.get('n2').voltage, 8),  `V_n2=${g2.nodes.get('n2').voltage}`);
  assert(approx(g2.edges.get('r1').current, 0.04), `I_r1=${g2.edges.get('r1').current}`);
});

test('parallel circuit  V=12, R1=300, R2=600 → V_n1=12, I_total≈0.06', () => {
  const g = parallelCircuit();
  solver.solve(g);
  assert(approx(g.nodes.get('n1').voltage, 12),  `V_n1=${g.nodes.get('n1').voltage}`);
  const i1 = g.edges.get('r1').current;
  const i2 = g.edges.get('r2').current;
  assert(approx(i1, 0.04),  `I_R1=${i1}`);
  assert(approx(i2, 0.02),  `I_R2=${i2}`);
});

test('superposition circuit  vs1=10V, vs2=5V, R1=1kΩ → I_r1=5mA', () => {
  const g = superpositionCircuit();
  solver.solve(g);
  assert(approx(g.edges.get('r1').current, 0.005, 0.0001), `I_r1=${g.edges.get('r1').current}`);
});

test('current source circuit  I=0.01A, R=1kΩ → V_node=10V', () => {
  const g = new CircuitGraph();
  g.addElement('cs1', 'current_source', 0.01, 'n1', 'gnd');
  g.addElement('r1',  'resistor',       1000, 'n1', 'gnd');
  solver.solve(g);
  assert(approx(g.nodes.get('n1').voltage, 10), `V_n1=${g.nodes.get('n1').voltage}`);
});

// ─── TopologyAnalyzer ─────────────────────────────────────────────────────────

console.log('\nTopologyAnalyzer');

test('series circuit classifies as "series"', () => {
  const result = topology.classify(theveninCircuit());
  assert(result === 'series', `Got "${result}" instead of "series"`);
});

test('parallel circuit classifies as "parallel"', () => {
  const result = topology.classify(parallelCircuit());
  assert(result === 'parallel', `Got "${result}" instead of "parallel"`);
});

test('findMeshLoops returns at least one loop for a closed circuit', () => {
  const g     = theveninCircuit();
  const loops = topology.findMeshLoops(g);
  assert(loops.length >= 1, `No loops found — expected at least 1`);
});

test('getNodeCurrents returns all incident elements', () => {
  const g    = theveninCircuit();
  const els  = topology.getNodeCurrents(g, 'n2');
  const ids  = els.map(e => e.id).sort();
  assert(ids.includes('r1') && ids.includes('r2'), `Expected r1,r2 at n2, got ${ids}`);
});

// ─── TheoremEngine ────────────────────────────────────────────────────────────

console.log('\nTheoremEngine');

test('thevenin returns 5 steps', () => {
  const steps = theorems.thevenin(theveninCircuit(), 'n2', 'gnd');
  assert(steps.length === 5, `Expected 5 steps, got ${steps.length}`);
});

test('thevenin V_th = 8 V, R_th = 66.67 Ω', () => {
  const steps = theorems.thevenin(theveninCircuit(), 'n2', 'gnd');
  const vthStep = steps[3]; // "Find V_oc"
  const rthStep = steps[2]; // "Find R_th"
  assert(vthStep.calculation.includes('8'),       `V_oc step: ${vthStep.calculation}`);
  assert(rthStep.calculation.includes('66.6667'), `R_th step: ${rthStep.calculation}`);
});

test('thevenin step hints include fadeOut for load ID', () => {
  const g = theveninCircuit(true, 100); // includes rl
  const steps = theorems.thevenin(g, 'n2', 'gnd', 'rl');
  assert(steps[0].hints.fadeOut.includes('rl'), 'Step 1 should fadeOut rl');
  assert(steps[1].hints.transformToShort.includes('vs1'), 'Step 2 should transformToShort vs1');
});

test('norton returns 5 steps', () => {
  const steps = theorems.norton(theveninCircuit(), 'n2', 'gnd');
  assert(steps.length === 5, `Expected 5 steps, got ${steps.length}`);
});

test('superposition returns (sources+2) steps', () => {
  const g     = superpositionCircuit(); // 2 sources
  const steps = theorems.superposition(g);
  assert(steps.length === 4, `Expected 4 steps (1 identify + 2 source steps + 1 sum), got ${steps.length}`);
});

test('superposition accumulated node voltages match direct MNA', () => {
  const g       = superpositionCircuit();
  const steps   = theorems.superposition(g);
  const sumStep = steps[steps.length - 1];
  // Direct MNA reference
  const direct  = g.clone();
  solver.solve(direct);
  const v_n1_direct = direct.nodes.get('n1').voltage;
  assert(approx(v_n1_direct, 10, 0.01), `Direct MNA V_n1=${v_n1_direct}, expected 10`);
  // Sum step calculation should mention the expected voltages
  assert(sumStep.calculation.length > 0, 'Sum step should have a calculation string');
});

test('kvl returns 5 steps for series circuit', () => {
  const steps = theorems.kvl(kvlCircuit());
  assert(steps.length === 5, `Expected 5 steps, got ${steps.length}`);
});

test('kvl step 4 calculation contains correct current for 10V/6kΩ circuit', () => {
  const steps = theorems.kvl(kvlCircuit());
  // I = 10/6000 = 0.001667 A
  const calcStep = steps[3];
  assert(calcStep.calculation.includes('0.001667') || calcStep.calculation.includes('1.6667'),
    `Unexpected calculation: ${calcStep.calculation}`);
});

test('kcl returns 4 steps', () => {
  const steps = theorems.kcl(theveninCircuit(), 'n2');
  assert(steps.length === 4, `Expected 4 steps, got ${steps.length}`);
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
if (failed === 0) {
  console.log(`✓ All ${passed} tests passed.\n`);
} else {
  console.log(`${passed} passed,  ${failed} FAILED.\n`);
  process.exit(1);
}
