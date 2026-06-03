import katex from 'katex';
import 'katex/dist/katex.min.css';

// Renders a LaTeX string inline using KaTeX.
// Falls back to plain text display if parsing fails.
export default function MathText({ tex, className = '' }) {
  if (!tex) return null;
  try {
    const html = katex.renderToString(tex, {
      displayMode: false,
      throwOnError: false,
      strict: false,
      output: 'html',
    });
    return (
      <span
        className={`math-inline ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span className={className}>{tex}</span>;
  }
}
