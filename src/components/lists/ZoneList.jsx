import { ZoomIn, ZoomOut } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

// Numbered hunt/fish zone list, linked both ways to ZoneMap (or Radar): `active` is the hovered zone, `focus` the zoomed one.
// `kind` filters to one group (rows slide in again when it changes); `onSelect` makes rows clickable (zoom to that zone).
export function ZoneList({ zones = [], kind = 'all', active, focus, onHover, onSelect }) {
  const group = (k, title) => {
    if (kind !== 'all' && kind !== k) return null
    const z = zones.filter(x => x.kind === k)
    if (!z.length) return null
    return (
      <div key={k + '-' + kind}>
        <h4><span className={'mk mk--' + k}/>{title}</h4>
        <ol className={'zone-list' + (onSelect ? ' zone-list--click' : '')}>
          {z.map((x, i) => {
            const on = active === x.name || focus === x.name
            return (
              <li key={x.name} className={(on ? 'is-on' : '') + (focus === x.name ? ' is-focus' : '')} style={{ animationDelay: (i * 0.05) + 's' }}
                onMouseEnter={() => onHover && onHover(x.name)} onMouseLeave={() => onHover && onHover(null)}
                onClick={onSelect ? () => onSelect(x.name) : undefined} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined}
                onKeyDown={onSelect ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(x.name) } } : undefined}>
                <span className={'mk mk--' + k}>{i + 1}</span><span style={{ flex: 1 }}>{x.name}</span>
                {onSelect && <Icon icon={focus === x.name ? ZoomOut : ZoomIn} className="zone-list__go"/>}
              </li>
            )
          })}
        </ol>
      </div>
    )
  }
  return <div className="zone-lists">{group('hunt', 'Hunting Zones')}{group('fish', 'Fishing Zones')}</div>
}
