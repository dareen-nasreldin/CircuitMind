import { gaussianElimination, buildMatrix } from './matrixUtils.js';

// Modified Nodal Analysis — same algorithm used by SPICE simulators
// Builds a (n+m)×(n+m) conductance matrix and solves G·x = b
// n = number of non-ground nodes, m = number of voltage sources
export default class MNASolver {
  solve(graph) {
    const nodes = graph.nodes.getNonGroundNodes();
    const n     = nodes.length;
    if (n === 0) return graph;

    // Voltage sources and deactivated-as-short-circuit elements both need
    // an extra unknown (their branch current) in the MNA formulation
    const voltageSources = [...graph.edges.values()].filter(
      e => e.type === 'voltage_source' || e.type === 'short_circuit'
    );
    const m    = voltageSources.length;
    const size = n + m;

    const A = buildMatrix(size);
    const b = new Array(size).fill(0);

    // Fast index lookup: nodeId → row/column index
    const nodeIndex = new Map();
    nodes.forEach((node, i) => nodeIndex.set(node.id, i));

    // Returns matrix index for a node; -1 means ground (row/col omitted)
    const idx = id => (id === 'gnd' ? -1 : (nodeIndex.get(id) ?? -1));

    // ── Stamp resistors into the conductance (G) submatrix ────────────────
    for (const el of graph.edges.values()) {
      if (el.type !== 'resistor' || !el.value || el.value === 0) continue;

      const g = 1 / el.value;
      const i = idx(el.nodeA);
      const j = idx(el.nodeB);

      if (i >= 0) A[i][i] += g;
      if (j >= 0) A[j][j] += g;
      if (i >= 0 && j >= 0) {
        A[i][j] -= g;
        A[j][i] -= g;
      }
    }

    // ── Stamp voltage sources into B/C submatrices ────────────────────────
    voltageSources.forEach((vs, k) => {
      const i = idx(vs.nodeA);
      const j = idx(vs.nodeB);

      // B matrix (upper-right block): incidence of voltage source k at node i/j
      if (i >= 0) { A[i][n + k] += 1;  A[n + k][i] += 1; }
      if (j >= 0) { A[j][n + k] -= 1;  A[n + k][j] -= 1; }

      b[n + k] = vs.value ?? 0;
    });

    // ── Stamp current sources into the RHS vector ─────────────────────────
    for (const el of graph.edges.values()) {
      if (el.type !== 'current_source') continue;

      const i = idx(el.nodeA);
      const j = idx(el.nodeB);

      // SPICE convention: nodeA is the positive terminal — current enters nodeA from external circuit
      if (i >= 0) b[i] += el.value;
      if (j >= 0) b[j] -= el.value;
    }

    // ── Solve and write results back to the graph ─────────────────────────
    const x = gaussianElimination(A, b);

    nodes.forEach((node, i) => { node.voltage = x[i]; });
    graph.nodes.get('gnd').voltage = 0;

    voltageSources.forEach((vs, k) => { vs.current = x[n + k]; });

    // Resistor branch currents from V = IR (after node voltages are known)
    for (const el of graph.edges.values()) {
      if (el.type !== 'resistor') continue;
      const va = graph.nodes.get(el.nodeA)?.voltage ?? 0;
      const vb = graph.nodes.get(el.nodeB)?.voltage ?? 0;
      el.current = (va - vb) / el.value;
    }

    return graph;
  }
}
