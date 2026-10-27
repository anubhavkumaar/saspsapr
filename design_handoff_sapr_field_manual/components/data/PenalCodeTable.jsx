import { Label } from '../status/Label.jsx';
const TONE = { Infraction: 'var(--forest)', Misdemeanor: 'var(--warn)', Felony: 'var(--stamp)' };
export function PenalCodeTable({ codes = [], filterable = true, maxMonths = 25 }) {
  const [f, setF] = React.useState('all');
  const [tick, setTick] = React.useState(0);
  const classes = ['Infraction', 'Misdemeanor', 'Felony'];
  const pick = function (c) { setF(c); setTick(tick + 1); };
  return (
    <div>
      {filterable && (
        <div className="filters" style={{ marginBottom: 16 }}>
          <button type="button" className={f === 'all' ? 'is-on' : ''} onClick={function () { pick('all'); }}>All <em>{codes.length}</em></button>
          {classes.map(function (c) { return <button key={c} type="button" className={f === c ? 'is-on' : ''} onClick={function () { pick(c); }}><i className="sw" style={{ '--c': TONE[c] }} />{c} <em>{codes.filter(function (x) { return x.cls === c; }).length}</em></button>; })}
        </div>
      )}
      <div className="tbl-scroll"><table className="tbl">
        <thead><tr><th>Code</th><th>Offense</th><th>Class</th><th>Sentence</th><th style={{ textAlign: 'right' }}>Fine</th></tr></thead>
        <tbody>{codes.map(function (c, i) {
          const hide = f !== 'all' && c.cls !== f;
          return (
            <tr key={c.code + '-' + tick} className={hide ? 'is-hidden' : 'is-enter'} style={{ animationDelay: (i * 0.04) + 's' }}>
              <td className="is-code">P.C. {c.code}</td>
              <td style={{ fontWeight: 600 }}>{c.offense}</td>
              <td><Label>{c.cls}</Label></td>
              <td><span className="sentence" style={{ '--c': TONE[c.cls], '--w': ((c.months || 0) / maxMonths * 100) + '%' }}><i /><span className="is-mono" style={{ font: '500 13px/1 var(--mono)', minWidth: 72 }}>{c.sentence === '0' ? '—' : c.sentence}</span></span></td>
              <td className="is-fine" style={{ textAlign: 'right' }}>{c.fine}</td>
            </tr>
          );
        })}</tbody>
      </table></div>
    </div>
  );
}
