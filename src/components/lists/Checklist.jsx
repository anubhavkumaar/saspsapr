import { useState } from 'react'
import { Check } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

// Tick and untick during a briefing; state is local and not persisted.
export function Checklist({ items = [], cols = 2, hint = 'Tap to tick off during a briefing' }) {
  const [done, setDone] = useState({})
  const n = Object.values(done).filter(Boolean).length
  const toggle = i => setDone(d => ({ ...d, [i]: !d[i] }))
  return (
    <div>
      <ul className="checklist" style={{ '--cols': cols }}>
        {items.map((t, i) => (
          <li key={i} className={done[i] ? 'is-done' : ''} role="checkbox" aria-checked={!!done[i]} tabIndex={0}
            onClick={() => toggle(i)}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(i) } }}>
            <span className="checklist__box"><Icon icon={Check}/></span><span>{t}</span>
          </li>
        ))}
      </ul>
      <div className="checklist__meta">
        <span>{hint}</span>
        <span>{n} / {items.length} checked{n > 0 && <button type="button" className="btn btn--text btn--sm" style={{ marginLeft: 12 }} onClick={() => setDone({})}><span>Reset</span></button>}</span>
      </div>
    </div>
  )
}
