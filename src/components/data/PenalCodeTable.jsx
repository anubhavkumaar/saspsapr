import { useState } from 'react'
import { Label } from '../status/Label.jsx'

const TONE = { Infraction: 'var(--forest)', Misdemeanor: 'var(--warn)', Felony: 'var(--stamp)' }
const CLASSES = ['Infraction', 'Misdemeanor', 'Felony']

export function PenalCodeTable({ codes = [], filterable = true, maxMonths = 25 }) {
  const [f, setF] = useState('all')
  const [tick, setTick] = useState(0)
  // Bumping the tick remounts every row so the visible ones replay their slide-in.
  const pick = c => { setF(c); setTick(t => t + 1) }
  return (
    <div>
      {filterable && (
        <div className="filters" style={{ marginBottom: 16 }}>
          <button type="button" className={f === 'all' ? 'is-on' : ''} onClick={() => pick('all')}>All <em>{codes.length}</em></button>
          {CLASSES.map(c => (
            <button key={c} type="button" className={f === c ? 'is-on' : ''} onClick={() => pick(c)}>
              <i className="sw" style={{ '--c': TONE[c] }}/>{c} <em>{codes.filter(x => x.cls === c).length}</em>
            </button>
          ))}
        </div>
      )}
      <div className="tbl-scroll"><table className="tbl">
        <thead><tr><th>Code</th><th>Offense</th><th>Class</th><th>Sentence</th><th style={{ textAlign: 'right' }}>Fine</th></tr></thead>
        <tbody>{codes.map((c, i) => {
          const hide = f !== 'all' && c.cls !== f
          return (
            <tr key={c.code + '-' + tick} className={hide ? 'is-hidden' : 'is-enter'} style={{ animationDelay: (i * 0.04) + 's' }}>
              <td className="is-code">P.C. {c.code}</td>
              <td style={{ fontWeight: 600 }}>{c.offense}</td>
              <td><Label>{c.cls}</Label></td>
              <td><span className="sentence" style={{ '--c': TONE[c.cls], '--w': ((c.months || 0) / maxMonths * 100) + '%' }}><i/><span className="is-mono" style={{ font: '500 13px/1 var(--mono)', minWidth: 72 }}>{c.sentence === '0' ? '—' : c.sentence}</span></span></td>
              <td className="is-fine" style={{ textAlign: 'right' }}>{c.fine}</td>
            </tr>
          )
        })}</tbody>
      </table></div>
    </div>
  )
}
