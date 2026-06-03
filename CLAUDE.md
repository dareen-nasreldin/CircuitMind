# CLAUDE.md — CircuitMind Project Instructions
> Claude Code reads this file automatically every session. Follow all rules here persistently.

---

## 🧠 Project Identity

This project is **CircuitMind** — an interactive circuit learning web app.
The full detailed plan lives in `circuitmind-free-mvp-plan.md`. Read it before making any architectural decisions.

---

## 🚦 Phase Control (CRITICAL)

- **Always ask which phase we are on before writing code**
- **Build one phase at a time. Stop after each phase and wait for approval.**
- Do not build ahead into future phases without being explicitly told to
- If a future phase requirement conflicts with current work, note it and move on — do not implement it early
- Current phase is tracked by the user — ask at the start of every session: *"Which phase are we on?"*

---

## 📁 File Structure Rules

- Follow the folder structure in `circuitmind-free-mvp-plan.md` exactly
- Do not create files or folders not in the plan without asking first
- All Gemini API calls go in `src/services/geminiService.js` — nowhere else
- All system prompts go in `src/utils/geminiPrompts.js` — nowhere else
- All circuit math stays in `src/utils/circuitMath.js` — pure functions, no side effects
- All circuit engine logic stays in `src/engine/` — no DOM or SVG references inside engine files
- All AI upgrade swap points go through `src/utils/aiUpgrade.js` — never call Gemini from components directly

---

## 📦 Dependency Rules

Only install these packages — nothing else without explicit user approval:
- `vite` + `react` + `react-dom`
- `tailwindcss` + `postcss` + `autoprefixer`
- `react-router-dom`

**Never install:**
- Framer Motion, GSAP, or any animation library
- Any circuit simulation library (e.g. circuit-simulator, Falstad)
- Any math library (e.g. mathjs, numeric.js) — implement Gaussian elimination from scratch
- Any UI component library (e.g. shadcn, MUI, Chakra) — build UI from scratch with Tailwind
- Three.js — this is post-MVP, do not touch it

---

## 🔑 API Key Rules

- **MVP runs with zero API keys** — do not require a `.env` file to run the app
- Gemini API key is optional: `VITE_GEMINI_API_KEY` in `.env`
- Always add a fallback: if no key is present, use the rule-based engine from `stepGenerator.js`
- Pattern to use everywhere:

```js
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  return stepGenerator(input); // free fallback
}
// else call Gemini
```

- Never hardcode any API key
- Never commit `.env` to git — ensure `.gitignore` includes `.env`

---

## 🎨 Styling Rules

- Dark mode only — background `#0a0f1e`, surface `#111827`
- Use only these accent colors:
  - Cyan `#00d4ff` — active elements, highlights, current flow
  - Green `#00ff88` — correct answers, final results
  - Red `#ff4466` — wrong answers, open circuits, errors
  - Yellow `#ffaa00` — voltage labels, warnings
- All colors defined as CSS variables in `src/index.css` — never hardcode hex values in components
- Fonts: `JetBrains Mono` for headings and formulas, `IBM Plex Sans` for body text
- Load fonts from Google Fonts in `index.html`
- No inline styles — use Tailwind classes or CSS variables only

---

## ⚙️ Engine Rules (CRITICAL for correctness)

- `CircuitGraph.js` must use ES6 `Map` for both `nodes` and `edges` — not plain objects
- Adjacency list must update in sync on every `addElement` and `removeElement`
- `MNASolver.js` rebuilds the matrix fresh on every `.solve()` call — never cache it
- Gaussian elimination must be implemented from scratch in `matrixUtils.js` — no libraries
- `TheoremEngine.js` must call `StepTracer.record()` at every graph mutation
- `CircuitGraph` is rendering-agnostic — zero SVG, DOM, or React references inside `src/engine/`
- Unit test each engine file with console assertions before connecting to UI

---

## 🎬 Animation Rules

- All animations use CSS + SVG only — no JS animation libraries
- Wire drawing: SVG `stroke-dashoffset` + `stroke-dasharray`
- Current flow: looping CSS animation on `stroke-dashoffset` — never JS `setInterval`
- Step cards: CSS `animation-delay` staggering — one class per delay tier
- Every animation is driven declaratively by the `animation` object in each step
- `CircuitAnimator.jsx` reads the step's `animation` object and applies CSS classes — it does not calculate anything
- `useAnimationSequence.js` manages step index and playback only — it never touches the DOM or SVG directly

---

## 🔁 Git Rules

- Initialize git on day 1: `git init`
- Commit after every phase with a clear message: `git commit -m "Phase 2: Circuit engine complete"`
- Never commit: `node_modules/`, `.env`, `dist/`
- `.gitignore` must include these from day 1

---

## 🚫 Things to Never Do

- Never put SVG or DOM logic inside `src/engine/`
- Never call the Gemini API from a React component — only through `aiUpgrade.js` → `geminiService.js`
- Never use `localStorage` or `sessionStorage`
- Never install Three.js (post-MVP only)
- Never build Phase N+1 without user approval of Phase N
- Never guess on architectural decisions — ask the user first
- Never use `any` typed patterns that would break the engine's Map lookups
- Never skip writing the `StepTracer.record()` call inside `TheoremEngine` methods

---

## ✅ Definition of "Done" Per Phase

A phase is only done when:

1. The feature works end-to-end in the browser (`npm run dev`)
2. No console errors
3. Follows the file structure from the plan
4. The user has reviewed and approved it

Do not mark a phase complete or move on without user sign-off.

---did 

## 💬 Communication Style

- At the start of every session, ask: *"Which phase are we on, and is there anything from last session I should know?"*
- Before starting any phase, briefly summarize what you're about to build and wait for a go-ahead
- If you hit an ambiguity not covered by the plan, stop and ask — do not guess
- When a phase is complete, list what was built and ask: *"Ready to move to the next phase?"*
