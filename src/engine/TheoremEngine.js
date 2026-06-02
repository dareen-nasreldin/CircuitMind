import CircuitGraph from './CircuitGraph.js';
import MNASolver    from './MNASolver.js';
import StepTracer   from './StepTracer.js';

const solver = new MNASolver();

// ─── Internal helpers ─────────────────────────────────────────────────────────

function round(v, dp = 4) {
  return parseFloat(v.toFixed(dp));
}

// Inject a 1 V test source at the terminals and read R_th = 1 / |I_test|
function findRth(deactivatedGraph, termA, termB) {
  const g = deactivatedGraph.clone();
  g.addElement('_v_test', 'voltage_source', 1, termA, termB);
  solver.solve(g);
  const I = g.edges.get('_v_test').current;
  if (!I || Math.abs(I) < 1e-12) return Infinity;
  return round(Math.abs(1 / I), 4);
}

// Open-circuit voltage at the terminals (graph must already be solved)
function findVoc(solvedGraph, termA, termB) {
  const va = solvedGraph.nodes.get(termA)?.voltage ?? 0;
  const vb = solvedGraph.nodes.get(termB)?.voltage ?? 0;
  return round(va - vb, 4);
}

// Collect all independent source element IDs
function getSourceIds(graph) {
  return [...graph.edges.values()]
    .filter(e => e.type === 'voltage_source' || e.type === 'current_source')
    .map(e => e.id);
}

// ─── TheoremEngine ────────────────────────────────────────────────────────────

export default class TheoremEngine {

  // ── Thevenin's Theorem ────────────────────────────────────────────────────
  // termA/termB: the two open terminals; loadId: element to remove first (optional)
  // Returns StepTracer sequence — each step has graphState + hints for animator
  thevenin(graph, termA, termB, loadId = null) {
    const tracer = new StepTracer();

    // ── Step 1: Remove load ────────────────────────────────────────────────
    const g1 = graph.clone();
    if (loadId && g1.edges.has(loadId)) g1.removeElement(loadId);

    tracer.record(
      'Remove the Load Resistor',
      null,
      null,
      `Disconnect the load from terminals ${termA} and ${termB}. We will find the open-circuit voltage at these terminals.`,
      g1.serialize(),
      { fadeOut: loadId ? [loadId] : [] }
    );

    // ── Step 2: Deactivate sources ─────────────────────────────────────────
    const sourceIds = getSourceIds(g1);
    const g2        = g1.clone().deactivateSources();

    tracer.record(
      'Turn Off Independent Sources',
      'Voltage Source → Short Circuit (wire)  |  Current Source → Open Circuit',
      null,
      'To find R_th, deactivate all independent sources. Voltage sources become wires (short circuits). Current sources are removed (open circuits).',
      g2.serialize(),
      { transformToShort: sourceIds }
    );

    // ── Step 3: Find R_th ──────────────────────────────────────────────────
    const rth    = findRth(g2, termA, termB);
    const rthStr = isFinite(rth) ? `${rth} Ω` : '∞ Ω';

    tracer.record(
      'Find R_Thevenin',
      `R_th = resistance seen from terminals ${termA}–${termB}`,
      `R_th = ${rthStr}`,
      `Look into the open terminals with all sources deactivated. The equivalent resistance is ${rthStr}.`,
      g2.serialize(),
      {
        highlight: [...g2.edges.keys()].filter(id => g2.edges.get(id).type === 'resistor'),
        bracket:   { label: `R_th = ${rthStr}`, nodes: [termA, termB] },
      }
    );

    // ── Step 4: Restore sources, find V_oc ────────────────────────────────
    const g4 = g1.clone();
    solver.solve(g4);
    const voc    = findVoc(g4, termA, termB);
    const vocStr = `${voc} V`;

    tracer.record(
      'Restore Sources — Find V_oc',
      `V_oc = V_${termA} − V_${termB}`,
      `V_oc = ${vocStr}`,
      `Restore all independent sources and solve the circuit. The open-circuit voltage at the terminals is ${vocStr}.`,
      g4.serialize(),
      {
        showCurrentFlow: true,
        highlight: [...g4.edges.keys()],
        bracket: { label: `V_oc = ${vocStr}`, nodes: [termA, termB] },
      }
    );

    // ── Step 5: Draw Thevenin equivalent ──────────────────────────────────
    const equiv = new CircuitGraph();
    equiv.addNode('n_th');
    equiv.addElement('v_th', 'voltage_source', voc,  'n_th', 'gnd');
    equiv.addElement('r_th', 'resistor',       rth,  'n_th', termA);

    tracer.record(
      'Draw Thevenin Equivalent',
      `V_th = ${vocStr},  R_th = ${rthStr}`,
      null,
      `The entire original circuit simplifies to one voltage source (V_th = ${vocStr}) in series with one resistor (R_th = ${rthStr}).`,
      equiv.serialize(),
      {
        drawEquivalent: { type: 'thevenin', vth: voc, rth, termA, termB },
      }
    );

    return tracer.getSequence();
  }

  // ── Norton's Theorem ──────────────────────────────────────────────────────
  norton(graph, termA, termB, loadId = null) {
    const tracer = new StepTracer();

    const g1 = graph.clone();
    if (loadId && g1.edges.has(loadId)) g1.removeElement(loadId);

    tracer.record(
      'Remove the Load Resistor',
      null,
      null,
      `Disconnect the load from terminals ${termA} and ${termB}.`,
      g1.serialize(),
      { fadeOut: loadId ? [loadId] : [] }
    );

    // R_N = R_th (same process)
    const sourceIds = getSourceIds(g1);
    const g2        = g1.clone().deactivateSources();
    const rn        = findRth(g2, termA, termB);
    const rnStr     = isFinite(rn) ? `${rn} Ω` : '∞ Ω';

    tracer.record(
      'Deactivate Sources — Find R_Norton',
      `R_N = R_th = ${rnStr}`,
      null,
      `R_N equals R_th — deactivate all sources and find the resistance seen at the terminals. R_N = ${rnStr}.`,
      g2.serialize(),
      { transformToShort: sourceIds, highlight: [...g2.edges.keys()] }
    );

    // I_sc: short the terminals and solve for the short-circuit current
    const g3 = g1.clone();
    g3.addElement('_sc', 'resistor', 1e-6, termA, termB); // near-zero R ≈ short
    solver.solve(g3);
    const isc    = round(g3.edges.get('_sc').current ?? 0, 6);
    const iscStr = `${isc} A`;

    tracer.record(
      'Find I_sc — Short-Circuit Current',
      `I_N = I_sc`,
      `I_sc = ${iscStr}`,
      `Place a short circuit across terminals ${termA}–${termB} and solve. The current through the short is the Norton current I_N = ${iscStr}.`,
      g3.serialize(),
      { showCurrentFlow: true }
    );

    // Verify: I_N × R_N should equal V_th
    const g4 = g1.clone();
    solver.solve(g4);
    const vth = findVoc(g4, termA, termB);

    tracer.record(
      'Verify: V_th = I_N × R_N',
      `V_th = I_N × R_N`,
      `${vth} V = ${isc} A × ${rn} Ω = ${round(isc * rn, 4)} V`,
      'Confirm the Norton equivalent values are consistent with the Thevenin equivalent.',
      g4.serialize(),
      {}
    );

    // Equivalent circuit
    const equiv = new CircuitGraph();
    equiv.addNode('n_nor');
    equiv.addElement('i_n',  'current_source', isc, 'n_nor', 'gnd');
    equiv.addElement('r_n',  'resistor',       rn,  'n_nor', 'gnd');

    tracer.record(
      'Draw Norton Equivalent',
      `I_N = ${iscStr},  R_N = ${rnStr}`,
      null,
      `The circuit simplifies to a current source (I_N = ${iscStr}) in parallel with R_N = ${rnStr}.`,
      equiv.serialize(),
      { drawEquivalent: { type: 'norton', in: isc, rn, termA, termB } }
    );

    return tracer.getSequence();
  }

  // ── KVL — Kirchhoff's Voltage Law ─────────────────────────────────────────
  // Solves a single-loop circuit; loop auto-detected from graph
  kvl(graph) {
    const tracer = new StepTracer();

    tracer.record(
      'Identify the Mesh Loop',
      null,
      null,
      'Trace a closed loop through the circuit. All elements traversed form the mesh.',
      graph.serialize(),
      { highlight: [...graph.edges.keys()] }
    );

    tracer.record(
      'Assign Loop Current Direction',
      'Assume clockwise current I',
      null,
      'Choose a direction for the loop current. We will determine its sign after solving.',
      graph.serialize(),
      { showCurrentFlow: true }
    );

    // Apply KVL: ΣV_sources = ΣI·R
    const sources   = [...graph.edges.values()].filter(e => e.type === 'voltage_source');
    const resistors = [...graph.edges.values()].filter(e => e.type === 'resistor');

    const totalV = sources.reduce((s, e) => s + (e.value ?? 0), 0);
    const totalR = resistors.reduce((s, e) => s + (e.value ?? 0), 0);
    const I      = totalR !== 0 ? round(totalV / totalR, 6) : 0;

    const kvlTerms = resistors.map(e => `I × ${e.value} Ω`).join(' + ');
    const formula  = `ΣV = 0  →  ${sources.map(e => `${e.value} V`).join(' + ')} = ${kvlTerms}`;

    tracer.record(
      'Apply KVL Around the Loop',
      'ΣV_sources = ΣI·R  (sum of rises = sum of drops)',
      formula,
      'Sum all voltage rises (sources) and set equal to sum of voltage drops (resistors).',
      graph.serialize(),
      { highlight: sources.map(e => e.id) }
    );

    tracer.record(
      'Solve for Loop Current I',
      `I = ΣV / ΣR`,
      `I = ${totalV} V / ${totalR} Ω = ${I} A (${round(I * 1000, 4)} mA)`,
      `The loop current is ${I} A.`,
      graph.serialize(),
      {}
    );

    // Solve full MNA and record per-element voltage drops
    const solved = graph.clone();
    solver.solve(solved);

    const drops = resistors.map(r => {
      const el = solved.edges.get(r.id);
      const va = solved.nodes.get(el.nodeA)?.voltage ?? 0;
      const vb = solved.nodes.get(el.nodeB)?.voltage ?? 0;
      return `V_${r.id} = ${round(Math.abs(va - vb), 4)} V`;
    }).join(',  ');

    tracer.record(
      'Calculate Voltage Drops',
      'V = I × R  for each element',
      drops,
      'Use V = IR to find the voltage drop across each resistor.',
      solved.serialize(),
      { highlight: resistors.map(r => r.id), showCurrentFlow: true }
    );

    return tracer.getSequence();
  }

  // ── Ohm's Law ─────────────────────────────────────────────────────────────
  // Simple 3-step demo for a single-resistor circuit
  ohmsLaw(graph) {
    const tracer    = new StepTracer();
    const sources   = [...graph.edges.values()].filter(e => e.type === 'voltage_source');
    const resistors = [...graph.edges.values()].filter(e => e.type === 'resistor');
    const V         = sources[0]?.value ?? 0;
    const R         = resistors[0]?.value ?? 1;
    const I         = round(V / R, 6);

    tracer.record(
      'Identify the Circuit',
      null,
      `V = ${V} V,  R = ${R} Ω`,
      `The circuit has a ${V} V source and a ${R} Ω resistor. Use Ohm\'s Law to find the current.`,
      graph.serialize(),
      { highlight: [...graph.edges.keys()] }
    );

    tracer.record(
      "Apply Ohm's Law",
      'V = I × R   →   I = V / R',
      null,
      `Ohm\'s Law states V = IR. Since V and R are known, solve directly for I.`,
      graph.serialize(),
      { highlight: sources.map(e => e.id) }
    );

    const solved = graph.clone();
    solver.solve(solved);

    tracer.record(
      'Calculate Current I',
      'I = V / R',
      `I = ${V} V ÷ ${R} Ω = ${I} A  (${round(I * 1000, 4)} mA)`,
      `The current flowing through the circuit is ${I} A or ${round(I * 1000, 4)} mA.`,
      solved.serialize(),
      { highlight: [...solved.edges.keys()], showCurrentFlow: true }
    );

    return tracer.getSequence();
  }

  // ── KCL — Kirchhoff's Current Law ─────────────────────────────────────────
  kcl(graph, nodeId) {
    const tracer = new StepTracer();

    tracer.record(
      'Identify the Node',
      null,
      null,
      `Focus on node ${nodeId}. KCL states that the sum of all currents entering and leaving a node equals zero.`,
      graph.serialize(),
      { highlight: [nodeId] }
    );

    const elements = [...(graph.nodes.get(nodeId)?.connections ?? [])]
      .map(id => graph.edges.get(id))
      .filter(Boolean);

    tracer.record(
      'Identify All Branch Currents',
      'ΣI_in = ΣI_out',
      null,
      `Node ${nodeId} has ${elements.length} branch(es): ${elements.map(e => e.id).join(', ')}.`,
      graph.serialize(),
      { highlight: elements.map(e => e.id), showCurrentFlow: true }
    );

    // Solve for all currents
    const solved = graph.clone();
    solver.solve(solved);

    const currents = elements.map(e => {
      const el      = solved.edges.get(e.id);
      const I       = round(el.current ?? 0, 6);
      const dir     = el.nodeA === nodeId ? 'leaving' : 'entering';
      return `I_${e.id} = ${I} A (${dir})`;
    });

    tracer.record(
      'Apply KCL',
      `Σ currents at node ${nodeId} = 0`,
      currents.join('\n'),
      'All branch currents at the node. Entering currents are positive, leaving currents are negative.',
      solved.serialize(),
      { highlight: elements.map(e => e.id), showCurrentFlow: true }
    );

    const netCurrent = round(
      elements.reduce((sum, e) => {
        const el = solved.edges.get(e.id);
        const I  = el.current ?? 0;
        return sum + (el.nodeB === nodeId ? I : -I);
      }, 0),
      6
    );

    tracer.record(
      'Verify KCL: Sum = 0',
      `ΣI = 0`,
      `ΣI at node ${nodeId} = ${netCurrent} A  (should be ≈ 0)`,
      `KCL verified: net current at node ${nodeId} is ${netCurrent} A.`,
      solved.serialize(),
      {}
    );

    return tracer.getSequence();
  }

  // ── Superposition ─────────────────────────────────────────────────────────
  superposition(graph) {
    const tracer  = new StepTracer();
    const sources = getSourceIds(graph);

    tracer.record(
      'Identify Independent Sources',
      null,
      null,
      `The circuit has ${sources.length} independent source(s): ${sources.join(', ')}. Superposition activates one at a time.`,
      graph.serialize(),
      { highlight: sources }
    );

    // Accumulated node voltages across all source contributions
    const accumulated = new Map();

    for (const srcId of sources) {
      const g = graph.clone().deactivateAllExcept(srcId);
      solver.solve(g);

      const src       = graph.edges.get(srcId);
      const srcLabel  = `${src.type === 'voltage_source' ? 'voltage' : 'current'} source ${srcId} (${src.value} ${src.type === 'voltage_source' ? 'V' : 'A'})`;
      const voltages  = graph.nodes.getNonGroundNodes()
        .map(n => {
          const v = g.nodes.get(n.id)?.voltage ?? 0;
          accumulated.set(n.id, (accumulated.get(n.id) ?? 0) + v);
          return `V_${n.id} = ${round(v, 4)} V`;
        })
        .join(',  ');

      const otherSrc = sources.filter(s => s !== srcId);
      tracer.record(
        `Activate ${srcLabel} only`,
        `Deactivate: ${otherSrc.join(', ')}`,
        voltages,
        `With only ${srcLabel} active, solve for node voltages.`,
        g.serialize(),
        {
          highlight: [srcId],
          transformToShort: otherSrc.filter(id => graph.edges.get(id)?.type === 'voltage_source'),
          transformToOpen:  otherSrc.filter(id => graph.edges.get(id)?.type === 'current_source'),
          showCurrentFlow: true,
        }
      );
    }

    // Final summation step
    const finalSolved = graph.clone();
    solver.solve(finalSolved);

    const sumLine = [...accumulated.entries()]
      .map(([id, v]) => `V_${id} = ${round(v, 4)} V`)
      .join(',  ');

    tracer.record(
      'Sum All Contributions',
      'V_total = V_source1 + V_source2 + … (per node)',
      sumLine,
      'Add the individual node voltage contributions from each source. This is the actual node voltage in the full circuit.',
      finalSolved.serialize(),
      { highlight: [...finalSolved.edges.keys()], showCurrentFlow: true }
    );

    return tracer.getSequence();
  }
}
