import { useInView } from '../motion/useInView.js'

export function Section({ id, alt = false, tight = false, children }) {
  return <section id={id} className={'sec' + (alt ? ' sec--alt' : '') + (tight ? ' sec--tight' : '')}><div className="wrap">{children}</div></section>
}

// `num` is the outlined numeral (01–06); a non-numeric `num` (MDT, LB, ADMIN…) uses the smaller word size.
// The numeral slides in with an ink fill and the eyebrow tracks in when the header scrolls into view.
export function SectionHeader({ num, eyebrow, eyebrowTone, title, sub, aside }) {
  const word = num && isNaN(Number(num))
  const [ref, iv] = useInView(0.3)
  return (
    <div ref={ref} className={'sh' + (word ? ' sh--word' : '') + iv}>
      {num && <span className="sh__num">{num}</span>}
      {eyebrow && <span className={'sh__eb' + (eyebrowTone ? ' sh__eb--' + eyebrowTone : '')}>{eyebrow}</span>}
      <h2 className="sh__title">{title}</h2>
      {sub && <p className="sh__sub">{sub}</p>}
      {aside && <div className="sh__aside">{aside}</div>}
    </div>
  )
}

export function SubHeading({ children }) {
  return <h3 className="h-sub">{children}</h3>
}

export function Split({ variant, children, style }) {
  return <div className={'split' + (variant ? ' split--' + variant : '')} style={style}>{children}</div>
}
