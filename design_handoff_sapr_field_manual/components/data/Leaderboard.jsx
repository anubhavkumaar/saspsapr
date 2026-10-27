import { CountUp } from '../motion/Reveal.jsx';
export function Leaderboard({ rows = [] }) {
  return (
    <ol className="lb">
      {rows.map(function (r, i) {
        return <li key={i} className={'lb__row lb__row--' + (i + 1)}><span className="lb__rank">{String(i + 1).padStart(2, '0')}</span><div><span className="lb__name">{r.name}</span>{r.last && <span className="lb__date">Last active: {r.last}</span>}</div><div className="lb__count"><strong><CountUp value={r.count || 0} /></strong><span>submission{r.count !== 1 ? 's' : ''}</span></div></li>;
      })}
    </ol>
  );
}
