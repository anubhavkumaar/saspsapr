import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

// links: { label, to?, href?, onClick?, active? }. `to` routes through react-router; the rest are plain anchors.
export function Header({ logo, name = 'SAPR', sub = 'San Andreas Park Rangers', links = [], actions, onBrand }) {
  const [open, setOpen] = useState(false)
  const link = (l, i) => {
    const cls = l.active ? 'is-on' : ''
    if (l.to) return <Link key={i} to={l.to} className={cls} onClick={() => setOpen(false)}>{l.label}</Link>
    return (
      <a key={i} href={l.href || '#'} className={cls}
        onClick={e => { if (l.onClick) { e.preventDefault(); l.onClick() } setOpen(false) }}>{l.label}</a>
    )
  }
  return (
    <header className={'hdr' + (links.length > 4 ? ' hdr--many' : '')}>
      <div className="wrap hdr__in" style={{ position: 'relative' }}>
        <button type="button" className="brand" onClick={onBrand}>
          {logo && <img src={logo} alt="Ranger patch and San Andreas State Parks seal"/>}
          <span><span className="brand__name">{name}</span><span className="brand__sub">{sub}</span></span>
        </button>
        <nav className="hdr__nav">{links.map(link)}</nav>
        <div className="hdr__actions">{actions}</div>
        <button type="button" className="hdr__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><Icon icon={open ? X : Menu} size={18}/></button>
        <nav className={'hdr__drawer' + (open ? ' is-open' : '')}>{links.map(link)}</nav>
      </div>
    </header>
  )
}
