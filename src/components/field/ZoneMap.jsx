import { useEffect, useRef, useState } from 'react'
import { Crosshair, Fish, Map as MapIcon, MousePointerClick, Navigation2, ZoomOut } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'
import { Segmented } from '../forms/Segmented.jsx'
import { Chip } from '../status/Chip.jsx'
import { ZoneMapArt } from './ZoneMapArt.jsx'

const STYLES = [['satellite', 'Satellite'], ['atlas', 'Atlas'], ['printed', 'Printed'], ['blueprint', 'Blueprint'], ['night', 'Night']]
const COLS = 'ABCDEFGH'
const ROWS = 12
const canObserve = typeof IntersectionObserver !== 'undefined'
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Pan/zoom frame (scale + translate in % of the frame) that fits a set of points.
function frameFor(pts, pad, maxZ) {
  if (!pts.length) return { s: 1, tx: 0, ty: 0 }
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y)
  const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad
  const s = Math.max(1, Math.min(maxZ, 100 / (x1 - x0), 100 / (y1 - y0)))
  const cl = t => Math.min(0, Math.max(100 - 100 * s, t))
  return { s, tx: cl(50 - s * (x0 + x1) / 2), ty: cl(50 - s * (y0 + y1) / 2) }
}

function gridOf(x, y) {
  const c = Math.max(0, Math.min(7, Math.floor(x / 12.5)))
  const r = Math.max(0, Math.min(ROWS - 1, Math.floor(y / (100 / ROWS))))
  return { c, r, ref: COLS[c] + '-' + (r + 1) }
}

// Mask that leaves only the given zones lit (the rest is dimmed by the spotlight layer).
const holes = (list, rx, ry) => list.map(z => 'radial-gradient(ellipse ' + rx + '% ' + ry + '% at ' + z.x + '% ' + z.y + '%, transparent 55%, #000 100%)').join(',')

// Printed map sheet over the in-game zone map: A–H / 1–12 margin rulers that pan with the map, mouse crosshair + grid readout,
// title block, north arrow, survey-scan reveal, spotlight on the selected part, dispatch pings, hunting reticle / fishing ripples
// on focus, minimap while zoomed. Full / Hunting / Fishing tabs pan + zoom; click a pin to zoom to that zone.
// `view`, `focus` and `treatment` are controlled when given, otherwise it keeps its own state.
export function ZoneMap({
  src, alt = 'Hunting and fishing zone map of San Andreas', ratio = '1091/1600', zones = [],
  view, onViewChange, active, onSelect, focus, onFocus, details = {},
  sheet = 'Sheet 04', title = 'San Andreas', subtitle = 'Hunting & Fishing Zones', pings = true,
  treatment, onTreatmentChange, defaultTreatment = 'satellite', styleSwitch = true,
  hint = 'Pick a part of the map, then click a zone to zoom in',
}) {
  const [lv, setLv] = useState('all')
  const [lf, setLf] = useState(null)
  const [lt, setLt] = useState(defaultTreatment)
  const t = treatment !== undefined ? treatment : lt
  const setT = x => { if (onTreatmentChange) onTreatmentChange(x); if (treatment === undefined) setLt(x) }
  const [seen, setSeen] = useState(false)
  const [armed, setArmed] = useState(false)
  const [mouse, setMouse] = useState(null)
  const [ping, setPing] = useState(null)
  const ref = useRef(null)
  const v = view !== undefined ? view : lv
  const fz = focus !== undefined ? focus : lf
  const setFocus = n => { if (onFocus) onFocus(n); if (focus === undefined) setLf(n) }
  const setV = x => { if (onViewChange) onViewChange(x); if (view === undefined) setLv(x); setFocus(null) }

  // Survey-scan reveal: if the map is already on screen it just shows; if not, it is held back ("armed") until it scrolls in.
  // The first observer callback says which; a 6s timer means it can never stay hidden.
  useEffect(() => {
    const el = ref.current
    if (!el || !canObserve) return
    let first = true
    const io = new IntersectionObserver(es => {
      const hit = es[0].isIntersecting
      if (first) { first = false; if (!hit && !reduced()) setArmed(true) }
      if (hit) { setSeen(true); io.disconnect() }
    }, { threshold: 0.05 })
    io.observe(el)
    const fallback = setTimeout(() => setSeen(true), 6000)
    return () => { io.disconnect(); clearTimeout(fallback) }
  }, [])

  // Dispatch pings: now and then a visible zone flashes a ring and a tag.
  const pool = zones.filter(z => (v === 'all' || z.kind === v) && z.name !== fz)
  const poolKey = pool.map(z => z.name).join('|')
  const poolRef = useRef(pool)
  useEffect(() => { poolRef.current = pool })
  useEffect(() => {
    if (!pings || !seen || !poolKey || reduced()) return
    let n = 0
    const tick = () => {
      const p = poolRef.current
      if (!p.length) return
      n++
      setPing({ z: p[Math.floor(Math.random() * p.length)], id: n })
    }
    const t0 = setTimeout(tick, 2200)
    const id = setInterval(tick, 3600)
    return () => { clearTimeout(t0); clearInterval(id) }
  }, [pings, seen, poolKey])

  // Pin numbers match ZoneList: 1..n within each kind.
  const nums = {}
  let h = 0, w = 0
  zones.forEach(z => { nums[z.name] = z.kind === 'hunt' ? ++h : ++w })

  const fzObj = zones.find(z => z.name === fz)
  const f = fzObj ? frameFor([fzObj], 8, 2.6) : v === 'all' ? { s: 1, tx: 0, ty: 0 } : frameFor(zones.filter(z => z.kind === v), 9, 2.2)
  const zoomed = f.s > 1.01
  const spot = fzObj ? holes([fzObj], 9, 6.2) : v !== 'all' ? holes(zones.filter(z => z.kind === v), 11, 7.5) : ''
  const hovObj = zones.find(z => z.name === (active || fz))
  const mg = mouse ? gridOf((mouse.x - f.tx) / f.s, (mouse.y - f.ty) / f.s) : null
  const hg = hovObj ? gridOf(hovObj.x, hovObj.y) : mg
  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    setMouse({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 })
  }
  const reset = () => { setFocus(null); if (onViewChange) onViewChange('all'); if (view === undefined) setLv('all') }
  const tickPos = (center, off) => off + f.s * center

  return (
    <div className={'zmap zmap--' + t}>
      <Segmented value={v} onChange={setV} options={[
        { value: 'all', label: 'Full Map', icon: MapIcon },
        { value: 'hunt', label: 'Hunting · ' + h, icon: Crosshair },
        { value: 'fish', label: 'Fishing · ' + w, icon: Fish },
      ]}/>
      <div className="zmap__sheet">
        <div className="zmap__rx" aria-hidden="true">{COLS.split('').map((c, i) => {
          const p = tickPos(i * 12.5 + 6.25, f.tx)
          return <span key={c} className={hg && hg.c === i ? 'is-on' : ''} style={{ left: p + '%', opacity: p < 2 || p > 98 ? 0 : 1 }}>{c}</span>
        })}</div>
        <div className="zmap__ry" aria-hidden="true">{Array.from({ length: ROWS }).map((_, i) => {
          const p = tickPos((i + 0.5) * 100 / ROWS, f.ty)
          return <span key={i} className={hg && hg.r === i ? 'is-on' : ''} style={{ top: p + '%', opacity: p < 2 || p > 98 ? 0 : 1 }}>{i + 1}</span>
        })}</div>
        <div ref={ref} className={'zmap__frame' + (armed ? ' is-armed' : '') + (seen ? ' is-seen' : '')} style={{ aspectRatio: ratio }} onMouseMove={onMove} onMouseLeave={() => setMouse(null)}>
          <div className="zmap__stage" style={{ transform: 'translate(' + f.tx + '%,' + f.ty + '%) scale(' + f.s + ')', '--z': f.s }}>
            {t === 'atlas' ? <ZoneMapArt zones={zones}/> : src && <img className="zmap__art" src={src} alt={alt} draggable="false"/>}
            {t !== 'atlas' && t !== 'satellite' && <div className="zmap__tint"/>}
            <div className={'zmap__spot' + (spot ? ' is-on' : '')} style={spot ? { WebkitMaskImage: spot, maskImage: spot, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' } : undefined}/>
            {ping && (
              <span key={'p' + ping.id} className={'zmap__ping zmap__ping--' + ping.z.kind + (ping.z.x > 65 ? ' zmap__ping--flip' : '')} style={{ left: ping.z.x + '%', top: ping.z.y + '%' }}>
                <i/><i/><b>{ping.z.kind === 'fish' ? '10-49A' : 'Patrol'} · {ping.z.name}</b>
              </span>
            )}
            {zones.map((zn, i) => {
              const dim = v !== 'all' && zn.kind !== v
              const on = active === zn.name || fz === zn.name
              const isF = fz === zn.name
              return (
                <button key={zn.name + v} type="button" tabIndex={dim ? -1 : 0} aria-label={zn.name}
                  className={'zmap__pin zmap__pin--' + zn.kind + (on ? ' is-on' : '') + (isF ? ' is-focus' : '') + (dim ? ' is-dim' : '') + (armed ? ' is-armed' : '') + (seen ? ' is-seen' : '')}
                  style={{ left: zn.x + '%', top: (zn.y - 0.9) + '%', '--i': i }}
                  onMouseEnter={() => onSelect && onSelect(zn.name)} onMouseLeave={() => onSelect && onSelect(null)}
                  onFocus={() => onSelect && onSelect(zn.name)} onBlur={() => onSelect && onSelect(null)}
                  onClick={() => setFocus(isF ? null : zn.name)}>
                  <span className="zmap__pin-in">
                    {isF && zn.kind === 'hunt' && <span className="zmap__ret"/>}
                    {isF && zn.kind === 'fish' && <span className="zmap__rip"><i/><i/><i/></span>}
                    <span className={'mk mk--' + zn.kind}>{nums[zn.name]}</span>
                  </span>
                  <span className="zmap__tip">{zn.name}<em>{gridOf(zn.x, zn.y).ref}</em></span>
                </button>
              )
            })}
          </div>
          <span className="zmap__scan" aria-hidden="true"/>
          {mouse && !hovObj && <><span className="zmap__xh zmap__xh--x" style={{ left: mouse.x + '%' }}/><span className="zmap__xh zmap__xh--y" style={{ top: mouse.y + '%' }}/></>}
          <div className="zmap__title">
            <span className="zmap__sheetno">{sheet}</span><b>{title}</b><span>{subtitle}</span>
            <span className="zmap__legend"><span><span className="mk mk--hunt"/>Hunting</span><span><span className="mk mk--fish"/>Fishing</span></span>
          </div>
          <span className="zmap__north" aria-hidden="true"><Icon icon={Navigation2} size={16}/><b>N</b></span>
          {v !== 'all' && !fzObj && (
            <span key={'st-' + v} className={'stamp stamp--sm stamp--in zmap__stamp' + (v === 'fish' ? ' stamp--water' : '')} style={{ '--rot': '-6deg' }}>{v === 'hunt' ? 'Hunting Zones' : 'Fishing Zones'}</span>
          )}
          {zoomed && (src || t === 'atlas') && (
            <button type="button" className="zmap__mini" onClick={reset} aria-label="Back to full map">
              {t === 'atlas' ? <ZoneMapArt labels={false}/> : <img src={src} alt="" draggable="false"/>}
              <i style={{ left: (-f.tx / f.s) + '%', top: (-f.ty / f.s) + '%', width: (100 / f.s) + '%', height: (100 / f.s) + '%' }}/>
            </button>
          )}
          {fzObj && (
            <div key={'cap-' + fzObj.name} className="zmap__cap">
              <span className={'mk mk--' + fzObj.kind}>{nums[fzObj.name]}</span>
              <div>
                <b>{fzObj.name}</b>
                <span>{(fzObj.kind === 'hunt' ? 'Hunting Zone' : 'Fishing Zone') + ' · Grid ' + gridOf(fzObj.x, fzObj.y).ref + (details[fzObj.kind] ? ' · ' + details[fzObj.kind] : '')}</span>
              </div>
              <button type="button" className="modal__close" onClick={() => setFocus(null)} aria-label="Back to map"><Icon icon={ZoomOut}/></button>
            </div>
          )}
        </div>
      </div>
      {styleSwitch && (
        <div className="zmap__styles"><span className="t-label">Map style</span>{STYLES.map(s => <Chip key={s[0]} active={t === s[0]} onClick={() => setT(s[0])}>{s[1]}</Chip>)}</div>
      )}
      <div className="zmap__foot">
        <span><Icon icon={MousePointerClick} size={14}/>{hint}</span>
        <span className="zmap__read">{hovObj ? hovObj.name + ' · Grid ' + gridOf(hovObj.x, hovObj.y).ref : mg ? 'Grid ' + mg.ref : zones.length + ' zones'}</span>
      </div>
    </div>
  )
}
