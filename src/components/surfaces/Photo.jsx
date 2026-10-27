import { Stamp } from '../status/Stamp.jsx'
import { useInView } from '../motion/useInView.js'

// Taped field photograph that "develops" (brightness / blur settle) when scrolled into view.
// With no src and no children the media area is a flat var(--paper-2) box.
export function Photo({ src, alt = '', caption, ratio = '4/5', tilt = 1.8, tape = true, stamp, stampTone, stampStyle, children }) {
  const [ref, iv] = useInView(0.3)
  return (
    <figure ref={ref} className={'photo' + iv} style={{ '--tilt': tilt + 'deg' }}>
      {tape && <span className="photo__tape" style={{ left: '16%' }}/>}
      {tape && <span className="photo__tape" style={{ right: '12%', transform: 'rotate(7deg)' }}/>}
      <div className="photo__media" style={{ '--ratio': ratio }}>{children || (src ? <img src={src} alt={alt}/> : null)}</div>
      {caption && <figcaption className="photo__cap">{caption}</figcaption>}
      {stamp && <span className="photo__stamp" style={stampStyle || { left: -30, bottom: 74 }}><Stamp tone={stampTone} rotate={-9}>{stamp}</Stamp></span>}
    </figure>
  )
}
