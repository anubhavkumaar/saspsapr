import { CountUp } from '../motion/Reveal.jsx'
import { useInView } from '../motion/useInView.js'

// Stats rise one after another with a drawing accent bar under each; numbers count up.
export function Tally({ items = [], count = true, style }) {
  const [ref, iv] = useInView(0.3)
  return (
    <div ref={ref} className={'tally' + iv} style={{ '--cols': items.length, ...style }}>
      {items.map((s, i) => {
        const n = typeof s.value === 'number' ? s.value : parseInt(s.value, 10)
        return (
          <div key={i} style={{ '--i': i, '--c': s.tone ? 'var(--' + s.tone + ')' : 'var(--forest)' }}>
            <strong style={s.tone ? { color: 'var(--' + s.tone + ')' } : undefined}>{count && !isNaN(n) && String(n) === String(s.value) ? <CountUp value={n}/> : s.value}</strong>
            <span>{s.label}</span>{s.sub && <em>{s.sub}</em>}
          </div>
        )
      })}
    </div>
  )
}
