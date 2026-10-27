import { CountUp } from '../motion/Reveal.jsx';
export function Tally({ items = [], count = true, style }) {
  return (
    <div className="tally" style={Object.assign({ '--cols': items.length }, style)}>
      {items.map(function (s, i) {
        const n = typeof s.value === 'number' ? s.value : parseInt(s.value, 10);
        return <div key={i}><strong style={s.tone ? { color: 'var(--' + s.tone + ')' } : undefined}>{count && !isNaN(n) && String(n) === String(s.value) ? <CountUp value={n} /> : s.value}</strong><span>{s.label}</span>{s.sub && <em>{s.sub}</em>}</div>;
      })}
    </div>
  );
}
