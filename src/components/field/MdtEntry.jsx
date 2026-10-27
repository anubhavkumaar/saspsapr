import { FileText, TriangleAlert, X } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

// One MDT / warning log row: type icon, Big Shoulders Citizen ID, officer + date.
export function MdtEntry({ type = 'mdt', citizenId, notes, officer, date, onDelete, style }) {
  const w = type === 'warning'
  return (
    <div className={'mdt' + (w ? ' mdt--warning' : '')} style={style}>
      <span className="mdt__ic"><Icon icon={w ? TriangleAlert : FileText} size={18}/></span>
      <div>
        <span className="mdt__k">{w ? 'Warning' : 'MDT'} · CID</span>
        <span className="mdt__cid">{citizenId || '—'}</span>
        {notes && <div className="mdt__note">{notes}</div>}
      </div>
      <div className="mdt__meta">
        <b>{officer || 'Unknown'}</b>{date}
        {onDelete && <div><button type="button" className="mdt__del" onClick={onDelete} aria-label="Remove"><Icon icon={X}/></button></div>}
      </div>
    </div>
  )
}
