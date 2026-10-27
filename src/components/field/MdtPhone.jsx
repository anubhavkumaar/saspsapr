import { useEffect, useRef, useState } from 'react'
import { Phone } from './Phone.jsx'
import { useInView } from '../motion/useInView.js'

const BOOT = ['SAPR MDT — v2.6', 'Linking citizen records… OK', 'Syncing warnings… OK', 'Loading the log…']
const NONE = []
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The phone's power-on, in the laptop's idiom: the glass stays dark until the phone scrolls into view, then the lockup and
// the typed terminal lines run over a progress bar and the screen hands over to the log. Covers the whole screen of the
// <Phone> it sits in; `onDone` fires once the log is showing. Phases: off → boot → out.
function PhoneBoot({ logo, lines, onDone }) {
  const [ref, iv] = useInView(0.25)
  const [phase, setPhase] = useState('off')
  const done = useRef(onDone)
  useEffect(() => { done.current = onDone })
  const run = iv.includes('is-in')
  const total = 450 + lines.length * 380 + 350 + 500   // typing, progress bar, a beat on the finished screen
  useEffect(() => {
    if (!run) return
    const timers = [
      setTimeout(() => setPhase('boot'), 350),   // after the phone's own power flicker
      setTimeout(() => setPhase('out'), 350 + total),
      setTimeout(() => done.current(), 350 + total + 450),
    ]
    return () => timers.forEach(clearTimeout)
  }, [run, total])
  return (
    <div ref={ref} className={'phone__boot phone__boot--' + phase} aria-hidden="true">
      {logo && <img src={logo} alt=""/>}
      <div className="phone__lines">{lines.map((l, i) => <span key={i} style={{ '--i': i }}>{'> ' + l}</span>)}</div>
      <div className="phone__prog"><i style={{ '--d': (lines.length * 0.38 + 0.4) + 's' }}/></div>
    </div>
  )
}

// <Phone> that boots like the laptop does and then keeps dropping its `toasts` (the alerts) while the page is open.
// Everything else is Phone's: eyebrow, title, foot, toastEvery and the children (the log). Reduced motion skips the boot.
export function MdtPhone({ logo, bootLines = BOOT, toasts = NONE, children, ...phone }) {
  const [booted, setBooted] = useState(reduced)
  return (
    <Phone {...phone} toasts={booted ? toasts : NONE}>
      {!booted && <PhoneBoot logo={logo} lines={bootLines} onDone={() => setBooted(true)}/>}
      {children}
    </Phone>
  )
}
