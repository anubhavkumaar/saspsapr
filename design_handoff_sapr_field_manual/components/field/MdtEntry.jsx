import { Icon } from '../icons/Icon.jsx';
export function MdtEntry({ type = 'mdt', citizenId, notes, officer, date, onDelete, style }) {
  const w = type === 'warning';
  return (
    <div className={'mdt' + (w ? ' mdt--warning' : '')} style={style}>
      <span className="mdt__ic"><Icon name={w ? 'triangle-alert' : 'file-text'} size={18} /></span>
      <div><span className="mdt__k">{w ? 'Warning' : 'MDT'} · CID</span><span className="mdt__cid">{citizenId || '—'}</span>{notes && <div className="mdt__note">{notes}</div>}</div>
      <div className="mdt__meta"><b>{officer || 'Unknown'}</b>{date}{onDelete && <div><button type="button" className="mdt__del" onClick={onDelete} aria-label="Remove"><Icon name="x" /></button></div>}</div>
    </div>
  );
}
