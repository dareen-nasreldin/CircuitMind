/**
 * aiUpgrade.js — single swap point for all AI features.
 *
 * Free MVP: calls the rule-based stepGenerator.
 * Stage 1 upgrade: uncomment the Gemini calls below and add VITE_GEMINI_API_KEY to .env
 *
 * Components never import stepGenerator or geminiService directly — only this file.
 */

import { stepGenerator } from './stepGenerator.js';

export async function solveCircuit(userInput) {
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    // Stage 1: swap this block for the Gemini call
    // const { geminiSolveCircuit } = await import('../services/geminiService.js');
    // return await geminiSolveCircuit(userInput);
  }
  return stepGenerator(userInput);
}
