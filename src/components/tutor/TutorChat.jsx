import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { solveCircuit } from '../../utils/aiUpgrade.js';
import StepCard from './StepCard.jsx';

const EXAMPLES = [
  '10V source with a 1000Ω resistor — find the current',
  '12V with R1=300Ω and R2=600Ω in series — find current and voltage drops',
  '12V with R1=300Ω and R2=600Ω in parallel — find equivalent resistance and branch currents',
  'Voltage divider: 12V, R1=300Ω top, R2=600Ω bottom — find Vout',
  '18V source with 1kΩ, 2kΩ, and 3kΩ in series — apply KVL',
];

const TUTORIAL_LABELS = {
  ohmsLaw:       "Ohm's Law",
  series:        'Series Circuit',
  parallel:      'Parallel Circuit',
  voltageDivider:'Voltage Divider',
  kvl:           "Kirchhoff's Voltage Law",
  kcl:           "Kirchhoff's Current Law",
};

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] bg-accent-cyan/10 border border-accent-cyan/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
        <p className="font-sans text-sm text-text-primary leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function AssistantResponse({ result }) {
  const navigate = useNavigate();

  if (!result) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Summary badge */}
      {result.summary && (
        <div className="flex items-center gap-2 step-enter">
          <span className="font-mono text-xs text-text-muted">Result:</span>
          <span className="font-mono text-xs font-semibold text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded-full">
            {result.summary}
          </span>
        </div>
      )}

      {/* Step cards — staggered animation */}
      <div className="flex flex-col gap-2.5">
        {result.steps.map((s, i) => (
          <StepCard key={s.id} step={s} index={i} delay={i * 120} />
        ))}
      </div>

      {/* Watch in animator link */}
      {result.relatedTutorial && (
        <div
          className="step-enter flex items-center gap-2 self-start"
          style={{ animationDelay: `${result.steps.length * 120 + 100}ms` }}
        >
          <button
            onClick={() => navigate('/animator')}
            className="flex items-center gap-1.5 font-mono text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <polygon points="2,1 11,6 2,11" fill="currentColor" />
            </svg>
            Watch {TUTORIAL_LABELS[result.relatedTutorial] ?? 'this'} in the Animator
          </button>
        </div>
      )}
    </div>
  );
}

export default function TutorChat() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(text) {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: query }]);
    setLoading(true);

    // Brief artificial delay so the UI doesn't flash instantly
    await new Promise(r => setTimeout(r, 400));

    const result = await solveCircuit(query);

    setMessages(prev => [...prev, { type: 'assistant', result }]);
    setLoading(false);

    // Re-focus input after response
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-bg-primary">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Welcome / empty state */}
          {isEmpty && (
            <div className="flex flex-col items-center gap-6 py-8 step-enter">
              <div className="text-center">
                <h2 className="font-mono font-bold text-xl text-text-primary mb-2">
                  Circuit Tutor
                </h2>
                <p className="font-sans text-sm text-text-muted">
                  Describe a circuit problem and get a step-by-step solution.
                </p>
              </div>

              {/* Example prompts */}
              <div className="w-full flex flex-col gap-2">
                <p className="font-mono text-xs text-text-muted uppercase tracking-wider text-center mb-1">
                  Try an example
                </p>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleSubmit(ex)}
                    className="text-left w-full bg-bg-surface border border-border-dim hover:border-accent-cyan/30 hover:bg-bg-elevated rounded-lg px-4 py-2.5 font-sans text-sm text-text-muted hover:text-text-primary transition-all duration-150"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation */}
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.type === 'user'
                ? <UserBubble text={msg.text} />
                : <AssistantResponse result={msg.result} />
              }
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-2 step-enter">
              <span className="font-mono text-xs text-text-muted">Solving</span>
              <span className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-accent-cyan opacity-70"
                    style={{ animation: `pulse-glow 1s ease-in-out ${i * 200}ms infinite` }}
                  />
                ))}
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-border-dim bg-bg-surface px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your circuit problem…"
            rows={1}
            disabled={loading}
            className="flex-1 resize-none bg-bg-elevated border border-border-dim focus:border-accent-cyan/40 focus:outline-none rounded-lg px-4 py-2.5 font-sans text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 disabled:opacity-50"
            style={{ maxHeight: '120px' }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-accent-cyan text-bg-primary font-bold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-cyan/85 self-end"
            title="Send (Enter)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="max-w-2xl mx-auto mt-1.5 font-mono text-[10px] text-text-muted opacity-50">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
