import { useEffect, useRef, useState } from 'react'
import { Laptop as LaptopIcon, Lock, Power } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

const BOOT = ['SAPR FIELD TERMINAL — v2.6', 'Authenticating device… OK', 'Checking enrollment status… OPEN', 'Loading Expression of Interest…']
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Closed laptop that opens on click: the lid swings up, the black screen boots with the lockup and typed terminal lines,
// then the page appears (and scrolls inside the screen). The power key on the base closes it again.
// Reduced motion skips straight to "on". Phases: closed → opening → boot → on.
export function Laptop({ url, logo, bootLines = BOOT, hint = 'Click to open', sub, defaultOpen = false, onOpen, children }) {
  const [phase, setPhase] = useState(defaultOpen ? 'on' : 'closed')
  const timers = useRef([])
  useEffect(() => {
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

  const open = () => {
    if (phase !== 'closed') return
    if (onOpen) onOpen()
    if (reduced()) { setPhase('on'); return }
    setPhase('opening')
    timers.current.push(setTimeout(() => setPhase('boot'), 1150))
    timers.current.push(setTimeout(() => setPhase('on'), 1150 + 700 + bootLines.length * 380))
  }
  const close = () => { timers.current.forEach(clearTimeout); setPhase('closed') }
  const lidUp = phase !== 'closed'

  return (
    <div className={'laptop laptop--' + phase}>
      <div className="laptop__stage">
        <div className="laptop__lid" aria-hidden={!lidUp}>
          <span className="laptop__cam"/>
          <div className="laptop__screen">
            {/* inert until the screen is on, so the form can't be tabbed into while it is still booting */}
            <div className="laptop__ui" aria-hidden={phase !== 'on'} inert={phase !== 'on'}>
              {url && <div className="laptop__bar"><i/><i/><i/><span><Icon icon={Lock} size={11}/>{url}</span></div>}
              {/* mounted only once the screen is on, so what is inside (stamps, form focus) starts when the page appears */}
              <div className="laptop__page">{phase === 'on' && children}</div>
            </div>
            <div className="laptop__boot" aria-hidden="true">
              {logo && <img src={logo} alt=""/>}
              <div className="laptop__lines">{bootLines.map((l, i) => <span key={i} style={{ '--i': i }}>{'> ' + l}</span>)}</div>
              <div className="laptop__prog"><i style={{ '--d': (bootLines.length * 0.38 + 0.4) + 's' }}/></div>
            </div>
          </div>
        </div>
        {phase === 'closed' && (
          <button type="button" className="laptop__open" onClick={open}>
            <span className="laptop__open-ic"><Icon icon={LaptopIcon} size={22}/></span>
            <b>{hint}</b>
            {sub && <small>{sub}</small>}
          </button>
        )}
      </div>
      <div className="laptop__base">
        <span className="laptop__notch"/>
        {phase === 'on' && <button type="button" className="laptop__power" onClick={close} aria-label="Close laptop"><Icon icon={Power} size={11}/></button>}
      </div>
      <div className="laptop__shadow"/>
    </div>
  )
}
