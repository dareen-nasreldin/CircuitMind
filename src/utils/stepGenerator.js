/**
 * Rule-based circuit solver — Phase 4 free-tier engine.
 * Returns an array of step objects (same shape as animator sequences)
 * plus metadata { relatedTutorial, summary }.
 *
 * Upgrade path: swap solveCircuit() in aiUpgrade.js to call Gemini.
 * This file stays untouched.
 */

// ── Helpers ────────────────────────────────────────────────────────────────

function round(n, dp = 4) {
  return parseFloat(n.toFixed(dp));
}

function fmtV(v) {
  return `${round(v, 2)}\\text{ V}`;
}

// Plain-text versions for explanation strings (not rendered by KaTeX)
function pV(v) { return `${round(v, 2)} V`; }
function pI(i) {
  const mA = Math.abs(i) * 1000;
  return mA >= 0.1 ? `${round(mA, 2)} mA` : `${round(i, 6)} A`;
}
function pR(r) {
  return r >= 1000 ? `${round(r / 1000, 3)} kΩ` : `${round(r, 1)} Ω`;
}

function fmtR(r) {
  if (r >= 1000) return `${round(r / 1000, 3)}\\text{ k}\\Omega`;
  return `${round(r, 1)}\\text{ }\\Omega`;
}

function fmtI(i) {
  const abs = Math.abs(i);
  if (abs === 0) return `0\\text{ A}`;
  const mA = abs * 1000;
  if (mA >= 0.1) return `${round(mA, 2)}\\text{ mA}`;
  return `${round(i, 6)}\\text{ A}`;
}

function step(id, title, formula, calculation, explanation) {
  return { id, title, formula: formula || null, calculation: calculation || null, explanation };
}

// ── Input parser ────────────────────────────────────────────────────────────

export function parseInput(text) {
  // Normalise kΩ → plain Ω value strings before numeric extraction
  const norm = text
    .replace(/(\d+(?:\.\d+)?)\s*k(?:Ω|ohm|ohms)/gi, (_, n) => `${parseFloat(n) * 1000}Ω`)
    .replace(/(\d+(?:\.\d+)?)\s*kilo(?:ohm|ohms)/gi, (_, n) => `${parseFloat(n) * 1000}Ω`);

  // Voltage
  const vExplicit = norm.match(/(?:V_?s?|voltage|source|supply)\s*=\s*(\d+(?:\.\d+)?)\s*V\b/i);
  const vStand    = norm.match(/(\d+(?:\.\d+)?)\s*V(?:olts?)?\b/i);
  const V = vExplicit ? parseFloat(vExplicit[1])
          : vStand    ? parseFloat(vStand[1])
          : null;

  // All resistors (Ω or ohm)
  const rAll = [...norm.matchAll(/(\d+(?:\.\d+)?)\s*(?:Ω|ohm)/gi)]
    .map(m => parseFloat(m[1]))
    .filter(r => r > 0);

  // Current if provided
  const mAMatch = norm.match(/(\d+(?:\.\d+)?)\s*mA\b/i);
  const AMatch  = norm.match(/(\d+(?:\.\d+)?)\s*A\b/i);
  let I = null;
  if (mAMatch) I = parseFloat(mAMatch[1]) / 1000;
  else if (AMatch) I = parseFloat(AMatch[1]);

  // Circuit type
  const lower = text.toLowerCase();
  let type;
  if (/voltage\s*div|divider|v_?out|tap/i.test(lower) && rAll.length >= 2)   type = 'divider';
  else if (/parallel|\|\|/i.test(lower) && rAll.length >= 2)                  type = 'parallel';
  else if (/series/i.test(lower) && rAll.length >= 2)                         type = 'series';
  else if (/kvl|voltage\s+law|mesh|loop/i.test(lower) && rAll.length >= 2)   type = 'series';
  else if (/kcl|current\s+law|node/i.test(lower) && rAll.length >= 2)        type = 'parallel';
  else if (rAll.length === 1 && V !== null)                                    type = 'ohms';
  else if (rAll.length === 1 && I !== null)                                    type = 'ohms';
  else if (rAll.length >= 2 && V !== null)                                     type = 'series';
  else                                                                          type = 'unknown';

  return { V, I, resistors: rAll, type };
}

// ── Solvers ────────────────────────────────────────────────────────────────

function solveOhms({ V, I, resistors }) {
  const R = resistors[0] ?? null;
  let steps = [];
  let relatedTutorial = 'ohmsLaw';
  let summary;

  if (V !== null && R !== null) {
    const current = round(V / R, 6);
    summary = `I = ${round(current * 1000, 3)} mA`;
    steps = [
      step(1, 'Identify the Circuit',
        `V = ${fmtV(V)},\\quad R = ${fmtR(R)}`,
        null,
        `The circuit has a ${pV(V)} source and a ${pR(R)} resistor. Apply Ohm's Law to find the current.`),
      step(2, "Apply Ohm's Law",
        `V = I \\times R \\quad\\Rightarrow\\quad I = \\dfrac{V}{R}`,
        null,
        `Ohm's Law relates voltage, current, and resistance. Since V and R are known, solve directly for current I.`),
      step(3, 'Calculate Current',
        `I = \\dfrac{V}{R}`,
        `I = \\dfrac{${fmtV(V)}}{${fmtR(R)}} = ${fmtI(current)}`,
        `The current flowing through the circuit is ${pI(current)}.`),
    ];
  } else if (I !== null && R !== null) {
    const voltage = round(I * R, 4);
    summary = `V = ${voltage} V`;
    steps = [
      step(1, 'Identify the Circuit',
        `I = ${fmtI(I)},\\quad R = ${fmtR(R)}`,
        null,
        `Current and resistance are given. Find the voltage across the resistor.`),
      step(2, "Apply Ohm's Law",
        `V = I \\times R`,
        `V = ${fmtI(I)} \\times ${fmtR(R)} = ${fmtV(voltage)}`,
        `Multiply current (${pI(I)}) by resistance (${pR(R)}) to get the voltage drop.`),
    ];
  } else {
    return null; // not enough info
  }

  return { steps, relatedTutorial, summary };
}

function solveSeries({ V, resistors }) {
  if (V === null || resistors.length < 2) return null;

  const Rtotal = round(resistors.reduce((s, r) => s + r, 0), 4);
  const I      = round(V / Rtotal, 6);
  const drops  = resistors.map(r => round(I * r, 4));
  const rList  = resistors.map((r, i) => `R_{${i + 1}} = ${fmtR(r)}`).join(',\\quad ');
  const rSum   = resistors.map(r => fmtR(r)).join(' + ');
  const dropList = drops.map((v, i) => `V_{R${i + 1}} = ${fmtV(v)}`).join('\\\\');
  const dropSumCheck = round(drops.reduce((s, d) => s + d, 0), 3);

  const steps = [
    step(1, 'Identify the Series Circuit',
      rList,
      null,
      `The circuit has a ${pV(V)} source with ${resistors.length} resistors in series. The same current flows through all elements.`),
    step(2, 'Total Resistance',
      `R_{\\text{total}} = ${resistors.map((_, i) => `R_{${i + 1}}`).join(' + ')}`,
      `R_{\\text{total}} = ${rSum} = ${fmtR(Rtotal)}`,
      `In a series circuit, resistances add directly.`),
    step(3, 'Apply KVL — Find Loop Current',
      `I = \\dfrac{V_s}{R_{\\text{total}}}`,
      `I = \\dfrac{${fmtV(V)}}{${fmtR(Rtotal)}} = ${fmtI(I)}`,
      `By KVL, the source voltage equals the sum of all voltage drops. Solve for the single loop current.`),
    step(4, 'Voltage Drops',
      `V_n = I \\times R_n`,
      dropList,
      `The voltage drop across each resistor is proportional to its resistance. Sum = ${pV(dropSumCheck)} ✓`),
  ];

  const summary = `I = ${pI(I)},  drops: ${drops.map((v, i) => `V_R${i + 1} = ${pV(v)}`).join(', ')}`;
  return { steps, relatedTutorial: 'series', summary };
}

function solveParallel({ V, resistors }) {
  if (V === null || resistors.length < 2) return null;

  const Req    = round(1 / resistors.reduce((s, r) => s + 1 / r, 0), 4);
  const Itotal = round(V / Req, 6);
  const branches = resistors.map(r => round(V / r, 6));
  const branchCheck = round(branches.reduce((s, i) => s + i, 0), 6);

  const rList    = resistors.map((r, i) => `R_{${i + 1}} = ${fmtR(r)}`).join(',\\quad ');
  const rRecip   = resistors.map((r, i) => `\\dfrac{1}{${fmtR(r)}}`).join(' + ');
  const branchLines = branches.map((b, i) => `I_{R${i + 1}} = \\dfrac{${fmtV(V)}}{${fmtR(resistors[i])}} = ${fmtI(b)}`).join('\\\\');

  const steps = [
    step(1, 'Identify the Parallel Circuit',
      rList,
      null,
      `The circuit has a ${pV(V)} source with ${resistors.length} resistors in parallel. All branches share the same voltage.`),
    step(2, 'Equivalent Resistance',
      `\\dfrac{1}{R_{\\text{eq}}} = ${resistors.map((_, i) => `\\dfrac{1}{R_{${i + 1}}}`).join(' + ')}`,
      `\\dfrac{1}{R_{\\text{eq}}} = ${rRecip} \\Rightarrow R_{\\text{eq}} = ${fmtR(Req)}`,
      `The reciprocal of the equivalent resistance equals the sum of the reciprocals of all branch resistances.`),
    step(3, 'Total Current',
      `I_{\\text{total}} = \\dfrac{V_s}{R_{\\text{eq}}}`,
      `I_{\\text{total}} = \\dfrac{${fmtV(V)}}{${fmtR(Req)}} = ${fmtI(Itotal)}`,
      `The total current drawn from the source.`),
    step(4, 'Branch Currents',
      `I_n = \\dfrac{V_s}{R_n}`,
      branchLines,
      `Each branch carries current inversely proportional to its resistance.`),
    step(5, 'Verify KCL',
      `\\Sigma I = I_{\\text{total}}`,
      `${branches.map(b => fmtI(b)).join(' + ')} = ${fmtI(branchCheck)}`,
      `The sum of all branch currents equals the total current. KCL verified.`),
  ];

  const summary = `R_eq = ${pR(Req)},  I_total = ${pI(Itotal)}`;
  return { steps, relatedTutorial: 'parallel', summary };
}

function solveDivider({ V, resistors }) {
  if (V === null || resistors.length < 2) return null;

  const R1   = resistors[0];
  const R2   = resistors[1];
  const Rtot = round(R1 + R2, 4);
  const I    = round(V / Rtot, 6);
  const Vout = round(V * R2 / Rtot, 4);
  const Vtop = round(I * R1, 4);

  const steps = [
    step(1, 'Identify the Voltage Divider',
      `V_s = ${fmtV(V)},\\quad R_1 = ${fmtR(R1)},\\quad R_2 = ${fmtR(R2)}`,
      null,
      `Two series resistors form a voltage divider. The output voltage is taken across R2 (the bottom resistor).`),
    step(2, 'Apply the Divider Formula',
      `V_{\\text{out}} = V_s \\cdot \\dfrac{R_2}{R_1 + R_2}`,
      `V_{\\text{out}} = ${fmtV(V)} \\times \\dfrac{${fmtR(R2)}}{${fmtR(R1)} + ${fmtR(R2)}} = ${fmtV(Vout)}`,
      `The output voltage is a fraction of the supply, set by the resistor ratio.`),
    step(3, 'Series Current',
      `I = \\dfrac{V_s}{R_1 + R_2}`,
      `I = \\dfrac{${fmtV(V)}}{${fmtR(Rtot)}} = ${fmtI(I)}`,
      `The same current flows through both resistors since they are in series.`),
    step(4, 'Verify Voltage Drops',
      `V_{R1} + V_{\\text{out}} = V_s`,
      `${fmtV(Vtop)} + ${fmtV(Vout)} = ${fmtV(round(Vtop + Vout, 3))}`,
      `The drops across R1 and R2 must sum to the source voltage. KVL confirmed.`),
  ];

  const summary = `V_out = ${Vout} V  (${round(Vout / V * 100, 1)}% of ${V} V)`;
  return { steps, relatedTutorial: 'voltageDivider', summary };
}

// ── Unknown / fallback ────────────────────────────────────────────────────

function unknownResult() {
  return {
    steps: [
      step(1, 'Could Not Parse Circuit',
        null,
        null,
        `Try phrasing your problem like one of these examples:
• "10V source with a 1000Ω resistor — find the current"
• "12V with R1=300Ω and R2=600Ω in series"
• "12V with R1=300Ω and R2=600Ω in parallel"
• "Voltage divider: 12V, R1=300Ω, R2=600Ω — find Vout"
Include the voltage (V), resistance values (Ω or ohm or kΩ), and the circuit type (series/parallel/divider).`),
    ],
    relatedTutorial: null,
    summary: null,
  };
}

// ── Main entry point ───────────────────────────────────────────────────────

export function stepGenerator(userInput) {
  const parsed = parseInput(userInput);
  let result;

  switch (parsed.type) {
    case 'ohms':    result = solveOhms(parsed);    break;
    case 'series':  result = solveSeries(parsed);  break;
    case 'parallel':result = solveParallel(parsed);break;
    case 'divider': result = solveDivider(parsed); break;
    default:        result = null;
  }

  return result ?? unknownResult();
}
