import { useEffect, useRef, useState } from 'react'

const canObserve = typeof IntersectionObserver !== 'undefined'
// Fade in and rise 22px once 12% is visible. Reduced motion is handled in motion.css.
// Keep this off very tall blocks: 12% of an element taller than ~8 viewports never fits on screen.
export function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }) {
  const Tag = as
  const ref = useRef(null)
  const [seen, setSeen] = useState(!canObserve)
  useEffect(() => {
    const el = ref.current
    if (!el || !canObserve) return
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={('reveal ' + (seen ? 'is-in ' : '') + className).trim()} style={{ '--delay': delay + 's', ...style }} {...rest}>
      {children}
    </Tag>
  )
}

// Counts up from 0 the first time it scrolls into view, then just tracks the live value.
export function CountUp({ value = 0, duration = 1200 }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !canObserve) return
    let raf
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      setRunning(true)
      const step = now => {
        const p = Math.min(1, (now - t0) / duration)
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(step)
        else setRunning(false)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.3 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value, duration])
  // A <b>, not a <span>: `.tally span` and `.lb__count span` would otherwise restyle the number to label size.
  return <b ref={ref}>{(running ? n : value).toLocaleString()}</b>
}
