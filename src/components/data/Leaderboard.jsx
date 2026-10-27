import { CountUp } from '../motion/Reveal.jsx'
import { useInView } from '../motion/useInView.js'

export function Leaderboard({ rows = [] }) {
  const [ref, iv] = useInView(0.2)
  return (
    <ol ref={ref} className={'lb' + iv}>
      {rows.map((r, i) => (
        <li key={r.name ?? i} className={'lb__row lb__row--' + (i + 1)} style={{ '--i': i }}>
          <span className="lb__rank">{String(i + 1).padStart(2, '0')}</span>
          <div><span className="lb__name">{r.name}</span>{r.last && <span className="lb__date">Last active: {r.last}</span>}</div>
          <div className="lb__count"><strong><CountUp value={r.count || 0}/></strong><span>submission{r.count !== 1 ? 's' : ''}</span></div>
        </li>
      ))}
    </ol>
  )
}
