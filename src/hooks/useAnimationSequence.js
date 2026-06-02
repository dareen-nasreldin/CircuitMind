import { useState, useEffect, useRef, useCallback } from 'react';

export function useAnimationSequence(steps, { stepDuration = 2000 } = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [speed,       setSpeed]       = useState(1);
  const timerRef   = useRef(null);
  const totalSteps = steps?.length ?? 0;

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Auto-advance when playing
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!isPlaying || totalSteps === 0) return;
    timerRef.current = setTimeout(() => {
      setCurrentStep(s => {
        if (s < totalSteps - 1) return s + 1;
        setIsPlaying(false);
        return s;
      });
    }, stepDuration / speed);
  }, [isPlaying, currentStep, speed, stepDuration, totalSteps]);

  const next   = useCallback(() => { setIsPlaying(false); setCurrentStep(s => Math.min(s + 1, totalSteps - 1)); }, [totalSteps]);
  const prev   = useCallback(() => { setIsPlaying(false); setCurrentStep(s => Math.max(s - 1, 0)); }, []);
  const play   = useCallback(() => setIsPlaying(true),  []);
  const pause  = useCallback(() => setIsPlaying(false), []);
  const reset  = useCallback(() => { setCurrentStep(0); setIsPlaying(false); }, []);
  const jumpTo = useCallback((i) => { setIsPlaying(false); setCurrentStep(Math.max(0, Math.min(i, totalSteps - 1))); }, [totalSteps]);

  // Keyboard shortcuts: Space, ←, →, R
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ')               { e.preventDefault(); setIsPlaying(p => !p); }
      if (e.key === 'ArrowRight')      { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')       { e.preventDefault(); prev(); }
      if (e.key.toLowerCase() === 'r') { reset(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, reset]);

  return { currentStep, totalSteps, isPlaying, speed, play, pause, next, prev, reset, jumpTo, setSpeed };
}
