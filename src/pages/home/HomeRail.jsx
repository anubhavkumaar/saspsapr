import { useEffect, useRef, useState } from 'react'
import { List, X } from 'lucide-react'
import { scrollToSection } from '../../lib/nav'
import { Icon } from '../../components'

// Every part of Home, in page order. `path` is the URL the part answers on (see HOME_SECTIONS); the others just scroll.
const PARTS = [
  { id: 'hero',      num: '',   label: 'Overview',        path: '/' },
  { id: 'quick',     num: '01', label: 'Quick Reference' },
  { id: 'hunting',   num: '02', label: 'Hunting',         path: '/hunting' },
  { id: 'fishing',   num: '03', label: 'Fishing',         path: '/fishing' },
  { id: 'zones',     num: '04', label: 'Zone Map',        path: '/map' },
  { id: 'codes',     num: '05', label: 'Penal Codes' },
  { id: 'roster',    num: '06', label: 'Roster',          path: '/roster' },
  { id: 'personnel', num: '07', label: 'Personnel',       path: '/personnel' },
  { id: 'join-cta',  num: '',   label: 'Join SAPR' },
]

// A way to go straight to one part of Home instead of scrolling the whole page. On a wide screen it sits in the margin beside the
// page; on a narrower one it is a "Sections" button that opens the same list. The part in view is marked. It stays out of the way of the opening
// screen and appears once the reader has reached Quick Reference.
export function HomeRail() {
  const [active, setActive] = useState('hero')
  const [open,   setOpen]   = useState(false)
  const box = useRef(null)

  useEffect(() => {
    const els = PARTS.map(p => document.getElementById(p.id)).filter(Boolean)
    if (!els.length) return
    // a thin band a third of the way down the screen: the part crossing it is the one being read
    const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) setActive(e.target.id) }, { rootMargin: '-30% 0px -65% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey  = e => { if (e.key === 'Escape') setOpen(false) }
    const onDown = e => { if (!box.current?.contains(e.target)) setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [open])

  const shown = active !== 'hero'

  const go = (e, p) => {
    e.preventDefault()
    setOpen(false)
    scrollToSection(p.id, p.path)
  }

  return (
    <nav ref={box} className={'homenav' + (shown ? ' is-shown' : '') + (open ? ' is-open' : '')} aria-label="Parts of this page" inert={!shown}>
      <button type="button" className="homenav__toggle" aria-expanded={open} aria-controls="homenav-list" onClick={() => setOpen(o => !o)}>
        <Icon icon={open ? X : List}/><span>Sections</span>
      </button>
      <span className="t-label homenav__label">On this page</span>
      <ol id="homenav-list" className="homenav__list">
        {PARTS.map(p => (
          <li key={p.id}>
            <a href={p.path || '#' + p.id} className={active === p.id ? 'is-on' : ''} aria-current={active === p.id ? 'location' : undefined} onClick={e => go(e, p)}>
              <b>{p.num}</b><span>{p.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
