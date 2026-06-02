// Records each intermediate graph state during solving
// Output feeds directly into useAnimationSequence (Phase 3)
export default class StepTracer {
  constructor() {
    this.steps = [];
  }

  // hints: declarative animation instructions for Phase 3 animator
  //   { highlight, fadeOut, transformToShort, transformToOpen,
  //     breakWire, showCurrentFlow, drawEquivalent, bracket }
  record(label, formula, calculation, explanation, graphSnapshot, hints = {}) {
    this.steps.push({
      id:          this.steps.length + 1,
      title:       label,
      formula:     formula      ?? null,
      calculation: calculation  ?? null,
      explanation,
      graphState:  graphSnapshot,
      hints: {
        highlight:        [],
        fadeOut:          [],
        transformToShort: [],
        transformToOpen:  [],
        showCurrentFlow:  false,
        drawEquivalent:   null,
        bracket:          null,
        ...hints,
      },
    });
  }

  getSequence() { return [...this.steps]; }

  reset() { this.steps = []; }
}
